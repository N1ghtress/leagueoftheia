// server.js

import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import RiotAPI from "./riotApi.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, "public");
const PORT = 3000;

const apiKey = process.env.RIOT_API_KEY;

if (!apiKey) {
    console.error(
        "Erreur : la variable d'environnement RIOT_API_KEY est absente."
    );

    process.exit(1);
}

const riotAPI = new RiotAPI(apiKey, {
    regionalHost: "https://europe.api.riotgames.com",
    platformHost: "https://euw1.api.riotgames.com",
    requestDelay: 50,
    maxRetries: 2
});


function sendJson(response, statusCode, data) {
    response.writeHead(statusCode, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store"
    });

    response.end(JSON.stringify(data));
}


async function serveStaticFile(response, pathname) {
    let filePath;

    if (pathname === "/") {
        filePath = path.join(PUBLIC_DIR, "index.html");
    } else {
        filePath = path.join(
            PUBLIC_DIR,
            pathname.replace(/^\/+/, "")
        );
    }

    /*
     * Protection basique contre les chemins sortant de public/
     */
    const normalizedPath = path.normalize(filePath);

    if (!normalizedPath.startsWith(PUBLIC_DIR)) {
        sendJson(response, 403, {
            error: "Forbidden"
        });

        return;
    }

    try {
        const data = await fs.readFile(normalizedPath);

        const extension = path.extname(normalizedPath);

        const contentTypes = {
            ".html": "text/html; charset=utf-8",
            ".css": "text/css; charset=utf-8",
            ".js": "text/javascript; charset=utf-8"
        };

        response.writeHead(200, {
            "Content-Type":
                contentTypes[extension] ||
                "application/octet-stream"
        });

        response.end(data);

    } catch {
        sendJson(response, 404, {
            error: "File not found"
        });
    }
}


const server = http.createServer(async (request, response) => {
    try {
        const url = new URL(
            request.url,
            `http://${request.headers.host}`
        );

        /*
         * API League of Theia
         *
         * /api/player?riotId=gameName%23tagLine
         */
        if (
            request.method === "GET" &&
            url.pathname === "/api/player"
        ) {
            const riotId = url.searchParams.get("riotId");

            if (!riotId) {
                sendJson(response, 400, {
                    error: "riotId est requis."
                });

                return;
            }

            const separatorIndex = riotId.lastIndexOf("#");

            if (separatorIndex <= 0) {
                sendJson(response, 400, {
                    error: "Format attendu : gameName#tagLine"
                });

                return;
            }

            const gameName = riotId.slice(0, separatorIndex);
            const tagLine = riotId.slice(separatorIndex + 1);

            if (!gameName || !tagLine) {
                sendJson(response, 400, {
                    error: "Format attendu : gameName#tagLine"
                });

                return;
            }

            const data = await riotAPI.playerData(
                gameName,
                tagLine,
                {
                    start: 0,
                    count: 20
                }
            );

            sendJson(response, 200, data);

            return;
        }

        /*
         * Tous les autres chemins servent les fichiers
         * du dossier public/.
         */
        if (request.method === "GET") {
            await serveStaticFile(response, url.pathname);
            return;
        }

        sendJson(response, 405, {
            error: "Method not allowed"
        });

    } catch (error) {
        console.error(error);

        sendJson(response, 500, {
            error: error.message || "Internal server error"
        });
    }
});


server.listen(PORT, () => {
    console.log(
        `League of Theia disponible sur http://localhost:${PORT}`
    );
});
