// riotApi.js

export default class RiotAPI {
    constructor(apiKey, options = {}) {
        if (!apiKey) {
            throw new Error("RIOT_API_KEY est manquante.");
        }

        this.apiKey = apiKey;

        this.regionalHost =
            options.regionalHost ||
            "https://europe.api.riotgames.com";

        this.platformHost =
            options.platformHost ||
            "https://euw1.api.riotgames.com";

        /*
         * Minimum delay between to calls.
         * 350 ms ≈ 2 à 3 requests / second at max.
         */
        this.requestDelay =
            options.requestDelay ?? 100;

        this.maxRetries =
            options.maxRetries ?? 2;

        this.lastRequestTime = 0;
    }

    async waitBeforeRequest() {
        const now = Date.now();
        const elapsed = now - this.lastRequestTime;

        if (elapsed < this.requestDelay) {
            await this.sleep(
                this.requestDelay - elapsed
            );
        }
    }

    async sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    async send(host, path) {
        let attempt = 0;

        while (attempt <= this.maxRetries) {
            await this.waitBeforeRequest();

            this.lastRequestTime = Date.now();

            const url = `${host}${path}`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "X-Riot-Token": this.apiKey,
                    "Accept": "application/json"
                }
            });

            let data = null;

            try {
                data = await response.json();
            } catch {
                // Pas de JSON disponible.
            }

            /*
             * Rate limit Riot API
             */
            if (response.status === 429) {
                if (attempt >= this.maxRetries) {
                    throw new Error(
                        "Rate limit Riot API atteint. Réessaie dans quelques instants."
                    );
                }

                const retryAfterHeader =
                    response.headers.get("Retry-After");

                let retryAfter =
                    Number.parseInt(
                        retryAfterHeader || "2",
                        10
                    );

                if (!Number.isFinite(retryAfter)) {
                    retryAfter = 2;
                }

                console.warn(
                    `Riot API: 429. Nouvelle tentative dans ${retryAfter}s.`
                );

                await this.sleep(
                    retryAfter * 1000
                );

                attempt++;
                continue;
            }

            if (!response.ok) {
                const message =
                    data?.status?.message ||
                    `Riot API returned HTTP ${response.status}`;

                throw new Error(message);
            }

            return data;
        }

        throw new Error(
            "Impossible de contacter Riot API."
        );
    }


    /*
     * Account
     */
    async accountByRiotId(gameName, tagLine) {
        const encodedGameName =
            encodeURIComponent(gameName);

        const encodedTagLine =
            encodeURIComponent(tagLine);

        return this.send(
            this.regionalHost,
            `/riot/account/v1/accounts/by-riot-id/${encodedGameName}/${encodedTagLine}`
        );
    }


    /*
     * Champion Mastery
     */
    async championMasteryByPuuid(puuid) {
        return this.send(
            this.platformHost,
            `/lol/champion-mastery/v4/champion-masteries/by-puuid/${encodeURIComponent(puuid)}`
        );
    }


    /*
     * Match IDs
     */
    async matchesIdsByPuuid(
        puuid,
        {
            startTime = null,
            endTime = null,
            queue = null,
            type = null,
            start = 0,
            count = 5
        } = {}
    ) {
        const params = new URLSearchParams();

        if (startTime !== null) params.set("startTime", startTime);
        if (endTime !== null) params.set("endTime", endTime);
        if (queue !== null) params.set("queue", queue);
        if (type !== null) params.set("type", type);
        params.set("start", start);
        params.set("count", count);

        return this.send(
            this.regionalHost,
            `/lol/match/v5/matches/by-puuid/${encodeURIComponent(puuid)}/ids?${params.toString()}`
        );
    }


    /*
     * Match
     */
    async matchByMatchId(matchId) {
        return this.send(
            this.regionalHost,
            `/lol/match/v5/matches/${encodeURIComponent(matchId)}`
        );
    }


    /*
     * Player Data
     */
    async playerData(
        gameName,
        tagLine,
        {
            start = 0,
            count = 20,
            includeMatches = true
        } = {}
    ) {
        const account = await this.accountByRiotId(gameName, tagLine);
        const puuid = account.puuid;

        const mastery = await this.championMasteryByPuuid(puuid);

        const matchIds = await this.matchesIdsByPuuid(puuid, { start: start, count: count });

        if (!includeMatches) {
            return {
                account,
                puuid,
                mastery,
                matchIds,
                matches: []
            };
        }

        const matches = [];

        for (const matchId of matchIds) {
            try {
                const match = await this.matchByMatchId(matchId);
                matches.push(match);
            } catch (error) {
                console.error(`Erreur match ${matchId}:`, error.message);
            }
        }

        return {
            account,
            puuid,
            mastery,
            matchIds,
            matches
        };
    }
}
