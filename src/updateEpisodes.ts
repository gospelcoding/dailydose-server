import got from "got";
import parser from "fast-xml-parser";
import {
  addNewEpisodes,
  Episode,
  episodeFromRSS,
  NewEpisode,
  RSSItem
} from "./Episode";
import { getEpisodes, saveEpisodes } from "./EpisodeStorage";
import { Channel, CHANNELS, GREEK_SP, shortName } from "./Channel";
import log from "./Log";
import { addVerseTexts } from "./BibleAPI";
import markNextEpisode from "./markNextEpisode";

export default async function updateEpisodes() {
  return Promise.all(
    CHANNELS.map(channel => updateEpisodesForChannel(channel))
  );
}

async function updateEpisodesForChannel(channel: Channel) {
  const episodes = getEpisodes(channel);
  const newEpisodes: NewEpisode[] = [];
  const lastFetchUrl = episodes[0] ? episodes[0].url : "BETTER FETCH 'EM ALL";
  let done = false;
  let page = 1;

  while (!done) {
    const currentEpisodes = await fetchPage(channel, page);
    if (currentEpisodes.length == 0) done = true;
    let i = 0;
    while (i < currentEpisodes.length && !done) {
      if (currentEpisodes[i].url == lastFetchUrl) {
        done = true;
      } else {
        newEpisodes.push(currentEpisodes[i]);
      }
      i += 1;
    }
    page += 1;
    log(`${shortName(channel)} PAGE: ${page}`);
  }

  if (newEpisodes.length > 0) {
    await addVerseTexts(newEpisodes, channel);
    const finalEpisodes = addNewEpisodes(episodes, newEpisodes);
    markNextEpisode(finalEpisodes);
    saveEpisodes(channel, finalEpisodes);
  }
}

async function fetchPage(channel: Channel, page: number): Promise<Episode[]> {
  try {
    const buffer = await got(`https://${channel}.com/feed/?paged=${page}`, {
      responseType: "buffer",
      resolveBodyOnly: true,
      timeout: 5000,
      retry: 5
    });
    const feed = parser.parse(buffer.toString());
    return feed.rss.channel.item.map((item: RSSItem) =>
      episodeFromRSS(item, channel == GREEK_SP)
    );
  } catch (err) {
    if (err.response?.statusCode == 404) {
      return [];
    } else {
      throw err;
    }
  }
}
