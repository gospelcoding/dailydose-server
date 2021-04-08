import { Episode } from "./Episode";
import fs from "fs";

const EPISODE_JSON = "data/episodes.json";

export function getEpisodes(): Episode[] {
  if (!fs.existsSync(EPISODE_JSON)) fs.writeFileSync(EPISODE_JSON, "[]");

  return JSON.parse(fs.readFileSync(EPISODE_JSON).toString());
}

export function saveEpisodes(episodes: Episode[]) {
  fs.writeFileSync(EPISODE_JSON, JSON.stringify(episodes));
}
