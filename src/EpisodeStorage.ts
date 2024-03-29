import { Episode, MultiChannelEpisodes } from "./Episode";
import fs from "fs";
import { Channel, CHANNELS, shortName } from "./Channel";
import log from "./Log";

function jsonPath(channel: Channel) {
  return `data/episodes_${shortName(channel)}.json`;
}

export function getEpisodes(channel: Channel): Episode[] {
  const filepath = jsonPath(channel);
  if (!fs.existsSync(filepath)) fs.writeFileSync(filepath, "[]");

  return JSON.parse(fs.readFileSync(filepath).toString());
}

export function getAllEpisodes(): MultiChannelEpisodes {
  const allEpisodes: MultiChannelEpisodes = {};
  CHANNELS.forEach(channel => {
    allEpisodes[channel] = getEpisodes(channel);
  });
  return allEpisodes;
}

export function saveEpisodes(channel: Channel, episodes: Episode[]) {
  const filepath = jsonPath(channel);
  log(`WRITE ${channel}`);
  fs.writeFileSync(filepath, JSON.stringify(episodes));
}
