"use strict";

const navItems = document.querySelectorAll(".nav-item");
const subItems = document.querySelectorAll(".sub-item");
const pages = document.querySelectorAll(".page");

const gameTagInput = document.getElementById("gameTag");
const searchButton = document.getElementById("searchButton");
const messageArea = document.getElementById("messageArea");

let championMap;

async function loadChampions() {
  const response = await fetch('/assets/champion.json');
  const champions = await response.json();

  championMap = new Map(
    Object.values(champions.data).map(champion => [
      Number(champion.key),
      {
        ...champion,
        image: `/assets/${champion.image.full}`
      }
    ])
  );

  // Image preloading
  await Promise.all(
    [...championMap.values()].map(champion => {
      const img = new Image();
      img.src = champion.image;

      return img.decode();
    })
  );
}
loadChampions();

function showMessage(message, type = "info") {
    if (!messageArea) {
        console.error(message);
        return;
    }

    messageArea.textContent = message;
    messageArea.className = `message-area visible ${type}`;
}


function clearMessage() {
    if (!messageArea) {
        return;
    }

    messageArea.textContent = "";
    messageArea.className = "message-area";
}

function showPage(pageName) {
    pages.forEach((page) => {
        page.classList.remove("active");
    });

    const targetPage = document.getElementById(`page-${pageName}`);

    if (targetPage) {
        targetPage.classList.add("active");
    }
}


function activateSubItem(item) {
    subItems.forEach((subItem) => {
        subItem.classList.remove("active");
    });

    item.classList.add("active");
}


function activateMainItem(item) {
    navItems.forEach((navItem) => {
        navItem.classList.remove("active");
    });

    item.classList.add("active");
}


async function performSearch() {
    const value = gameTagInput.value.trim();

    if (!value) {
        showMessage("Entre un Riot ID au format gameName#tagLine.", "error")
        gameTagInput.focus();
        return;
    }

    clearMessage();
    searchButton.disabled = true;
    searchButton.textContent = "Chargement...";

    try {
        const response = await fetch(
            `/api/player?riotId=${encodeURIComponent(value)}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "Impossible de récupérer le joueur."
            );
        }

        console.log("Compte :", data.account);
        console.log("PUUID :", data.puuid);
        console.log("Maîtrises :", data.mastery);
        console.log("Match IDs :", data.matchIds);
        console.log("Matchs :", data.matches);

        updateInterface(data);
        showMessage(`Données de ${data.account.gameName}#${data.account.tagLine} chargées.`, "success");
    } catch (error) {
        console.error(error);
        showMessage(error.message || "Une erreur inconnue est survenue.", "error");
    } finally {
        searchButton.disabled = false;
        searchButton.textContent = "Rechercher";
    }
}


let currentMasteryData = [];

function updateInterface(data) {
    const championMastery = data.mastery;

    if (!Array.isArray(championMastery)) {
        throw new Error(
            "Les données de maîtrise des champions sont invalides."
        );
    }

    currentMasteryData = championMastery;

    updateStats(championMastery);
    renderBubbleChart(championMastery);
}


function updateStats(championMastery) {
    const totalMastery = d3.sum(championMastery, d => Number(d.championPoints) || 0);
    const highestMastery = d3.max(championMastery, d => Number(d.championPoints) || 0) || 0;

    const stats = document.querySelectorAll(".stats-grid .stat-card");

    if (stats.length < 3) {
        return;
    }

    stats[0].querySelector("strong").textContent = championMastery.length;
    stats[1].querySelector("strong").textContent = formatMasteryPoints(totalMastery);
    stats[2].querySelector("strong").textContent = formatMasteryPoints(highestMastery);
}


function renderBubbleChart(championMastery) {
    const container = d3.select("#bubbleChart");

    if (container.empty()) return;
    container.selectAll("*").remove();

    const width = container.node().clientWidth;
    const height = container.node().clientHeight;

    if (width <= 0 || height <= 0) return;

    const sortedData = [...championMastery]
            .filter(d => Number(d.championPoints) > 0)
            .sort((a, b) => b.championPoints - a.championPoints);

    const root = d3.hierarchy({ children: sortedData })
        .sum(d => Number(d.championPoints) || 0)
        .sort((a, b) => b.value - a.value);

    const pack = d3.pack().size([width, height]).padding(7);
    pack(root);

    const svg = container
            .append("svg")
            .attr("class", "bubble-svg")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet");

    const nodes = svg
            .selectAll(".bubble-node")
            .data(root.leaves(), d => d.data.championId)
            .join("g")
            .attr("class", "bubble-node")
            .attr("transform", d => `translate(${d.x},${d.y})`);

    nodes
        .append("circle")
        .attr("class", "d3-bubble")
        .attr("r", d => d.r);

    nodes
        .filter(d => d.r >= 24)
        .append("text")
        .attr("class", "d3-bubble-name")
        .attr("dy", "-2")
        .text(d => getChampionName(d.data.championId));

    nodes
        .filter(d => d.r >= 24)
        .append("text")
        .attr("class", "d3-bubble-points")
        .attr("dy", "12")
        .text(d => formatMasteryPoints(d.data.championPoints));

    nodes
        .append("title")
        .text(d => {
            const name = getChampionName(d.data.championId);
            return (`${name}\n` + `Niveau ${d.data.championLevel}\n` + `${Number(d.data.championPoints).toLocaleString("fr-FR")} points`);
        });
}


function formatMasteryPoints(points) {
    const value = Number(points) || 0;

    if (value >= 1000000) {
        return (
            (value / 1000000)
                .toFixed(2)
                .replace(".00", "")
                .replace(".", ",") +
            "M"
        );
    }

    if (value >= 1000) {
        return (
            (value / 1000)
                .toFixed(1)
                .replace(".0", "")
                .replace(".", ",") +
            "K"
        );
    }

    return value.toString();
}


function getChampionName(championId) {
    return championMap.get(championId).name;
}


navItems.forEach((item) => {
    item.addEventListener("click", () => {
        const page = item.dataset.page;

        activateMainItem(item);

        if (page === "mastery") {
            const bubbles = document.querySelector(
                '.sub-item[data-page="bubbles"]'
            );

            activateSubItem(bubbles);
            showPage("bubbles");

            return;
        }

        showPage(page);
    });
});


subItems.forEach((item) => {
    item.addEventListener("click", () => {
        const page = item.dataset.page;

        activateSubItem(item);

        const mastery = document.querySelector(
            '.nav-item[data-page="mastery"]'
        );

        activateMainItem(mastery);
        showPage(page);
    });
});


searchButton.addEventListener(
    "click",
    performSearch
);


gameTagInput.addEventListener(
    "keydown",
    (event) => {
        if (event.key === "Enter") {
            performSearch();
        }
    }
);


window.addEventListener(
    "resize",
    () => {
        if (currentMasteryData.length > 0) {
            renderBubbleChart(currentMasteryData);
        }
    }
);
