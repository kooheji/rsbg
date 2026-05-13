// banner.js
const SKILL_ORDERS = {
  rs3: [
    "Overall","Attack","Defence","Strength","Constitution","Ranged","Prayer","Magic",
    "Cooking","Woodcutting","Fletching","Fishing","Firemaking","Crafting","Smithing",
    "Mining","Herblore","Agility","Thieving","Slayer","Farming","Runecrafting",
    "Hunter","Construction","Summoning","Dungeoneering","Divination","Invention","Archaeology","Necromancy"
  ],
  osrs: [
    "Overall","Attack","Defence","Strength","Hitpoints","Ranged","Prayer","Magic",
    "Cooking","Woodcutting","Fletching","Fishing","Firemaking","Crafting","Smithing",
    "Mining","Herblore","Agility","Thieving","Slayer","Farming","Runecrafting",
    "Hunter","Construction","Sailing"
  ]
};

async function fetchHiscores(username, game = "rs3") {
  const config = window.RSBG_CONFIG || {};
  const proxyUrl = config.HISCORES_PROXY_URL || "/proxy.php";

  const url = `${proxyUrl}?player=${encodeURIComponent(username)}&game=${game}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch hiscores");
  const text = await res.text();
  return parseHiscores(text, game);
}

function parseHiscores(csv, game) {
  const lines = csv.trim().split(/\r?\n/);
  const skills = [];

  const skillNames = game === "osrs" ? SKILL_ORDERS.osrs : SKILL_ORDERS.rs3;

  for (let i = 0; i < skillNames.length; i++) {
    const line = lines[i] || "";
    const parts = line.split(",").map((part) => part.trim());
    if (parts.length < 3) {
      skills.push({
        name: skillNames[i],
        rank: "-",
        level: null,
        xp: null
      });
      continue;
    }
    const [rank, level, xp] = parts;
    const parsedLevel = parseInt(level, 10);
    const parsedXp = parseInt(xp, 10);
    skills.push({
      name: skillNames[i],
      rank,
      level: Number.isNaN(parsedLevel) ? null : parsedLevel,
      xp: Number.isNaN(parsedXp) ? null : parsedXp
    });
  }

  return skills;
}

function getDisplaySkills(skills) {
  return skills.filter((skill) => skill.name !== "Overall");
}

const ICON_MAP_RS3 = {
  Overall: "icons/overall.png",
  Attack: "icons/attack_detail.png",
  Defence: "icons/defence_detail.png",
  Strength: "icons/strength_detail.png",
  Constitution: "icons/constitution_detail.png",
  Ranged: "icons/ranged_detail.png",
  Prayer: "icons/prayer_detail.png",
  Magic: "icons/magic_detail.png",
  Cooking: "icons/cooking_detail.png",
  Woodcutting: "icons/woodcutting_detail.png",
  Fletching: "icons/fletching_detail.png",
  Fishing: "icons/fishing_detail.png",
  Firemaking: "icons/firemaking_detail.png",
  Crafting: "icons/crafting_detail.png",
  Smithing: "icons/smithing_detail.png",
  Mining: "icons/mining_detail.png",
  Herblore: "icons/herblore_detail.png",
  Agility: "icons/agility_detail.png",
  Thieving: "icons/thieving_detail.png",
  Slayer: "icons/slayer_detail.png",
  Farming: "icons/farming_detail.png",
  Runecrafting: "icons/runecrafting_detail.png",
  Hunter: "icons/hunter_detail.png",
  Construction: "icons/construction_detail.png",
  Summoning: "icons/summoning_detail.png",
  Dungeoneering: "icons/dungeoneering_detail.png",
  Divination: "icons/divination_detail.png",
  Invention: "icons/invention_detail.png",
  Archaeology: "icons/archaeology_detail.png",
  Necromancy: "icons/necromancy.png"
};

const ICON_MAP_OSRS = {
  Overall: "icons/overall.png",
  Attack: "icons/osrs_attack_detail.png",
  Defence: "icons/osrs_defence_detail.png",
  Strength: "icons/osrs_strength_detail.png",
  Hitpoints: "icons/osrs_hitpoints_detail.png",
  Ranged: "icons/osrs_ranged_detail.png",
  Prayer: "icons/osrs_prayer_detail.png",
  Magic: "icons/osrs_magic_detail.png",
  Cooking: "icons/osrs_cooking_detail.png",
  Woodcutting: "icons/osrs_woodcutting_detail.png",
  Fletching: "icons/osrs_fletching_detail.png",
  Fishing: "icons/osrs_fishing_detail.png",
  Firemaking: "icons/osrs_firemaking_detail.png",
  Crafting: "icons/osrs_crafting_detail.png",
  Smithing: "icons/osrs_smithing_detail.png",
  Mining: "icons/osrs_mining_detail.png",
  Herblore: "icons/osrs_herblore_detail.png",
  Agility: "icons/osrs_agility_detail.png",
  Thieving: "icons/osrs_thieving_detail.png",
  Slayer: "icons/osrs_slayer_detail.png",
  Farming: "icons/osrs_farming_detail.png",
  Runecrafting: "icons/osrs_runecrafting_detail.png",
  Hunter: "icons/osrs_hunter_detail.png",
  Construction: "icons/osrs_construction_detail.png",
  Sailing: "icons/osrs_sailing.png"
};

function renderSkills(skills, container, mode = "text", game = "rs3") {
  container.innerHTML = "";
  const ICON_MAP = game === "rs3" ? ICON_MAP_RS3 : ICON_MAP_OSRS;
  const normalizedMode = normalizeDisplayMode(mode);

  getDisplaySkills(skills).forEach(skill => {
    const li = document.createElement("li");
    li.className = "skill-tile";
    li.title = `${skill.name}: Lv ${formatLevel(skill.level)} (${formatXp(skill.xp)} XP)`;

    if (game === "osrs" && normalizedMode === "icons") {
      const img = document.createElement("img");
      img.className = "skill-icon";
      img.src = ICON_MAP[skill.name] || "";
      img.alt = skill.name;
      li.appendChild(img);

      const span = document.createElement("span");
      span.className = "skill-level";
      span.textContent = formatLevel(skill.level);
      li.appendChild(span);
    } else if (normalizedMode === "icons") {
      const img = document.createElement("img");
      img.className = "skill-icon";
      img.src = ICON_MAP[skill.name] || "";
      img.alt = skill.name;
      li.appendChild(img);

      const span = document.createElement("span");
      span.className = "skill-level";
      span.textContent = formatLevel(skill.level);
      li.appendChild(span);
    } else if (normalizedMode === "text") {
      li.appendChild(createSkillName(skill.name));
      li.appendChild(createSkillLevel(skill.level));
    } else {
      li.appendChild(createSkillName(skill.name));
      li.appendChild(createSkillLevel(skill.level));
    }

    container.appendChild(li);
  });
}

function createSkillName(name) {
  const span = document.createElement("span");
  span.className = "skill-name";
  span.textContent = name;
  return span;
}

function createSkillLevel(level) {
  const span = document.createElement("span");
  span.className = "skill-level";
  span.textContent = formatLevel(level);
  return span;
}

function formatLevel(level) {
  return level === null || level === undefined ? "-" : level;
}

function formatXp(xp) {
  return xp === null || xp === undefined ? "-" : xp;
}

function normalizeDisplayMode(mode) {
  if (mode === "icons") return "icons";
  if (mode === "text") return "text";
  return "names-levels";
}
