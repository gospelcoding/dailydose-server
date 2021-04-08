import got from "got";
import parser from "fast-xml-parser";
import { Episode, episodeFromRSS, RSSItem } from "./Episode";
import { getEpisodes, saveEpisodes } from "./EpisodeStorage";

updateEpisodes();

export default async function updateEpisodes() {
  const episodes = getEpisodes();
  const newEpisodes = [];
  const lastFetchUrl = episodes[0] ? episodes[0].url : "BETTER FETCH 'EM ALL";
  let done = false;
  let page = 1;

  while (!done) {
    const currentEpisodes = await fetchPage(page);
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
    console.log(`PAGE: ${page}`);
  }

  saveEpisodes(newEpisodes.concat(episodes));
}

async function fetchPage(page: number): Promise<Episode[]> {
  try {
    const buffer = await got(
      `https://dailydoseofgreek.com/feed/?paged=${page}`,
      {
        responseType: "buffer",
        resolveBodyOnly: true,
        timeout: 5000,
        retry: 5
      }
    );
    const feed = parser.parse(buffer.toString());
    // console.log(feed.rss.channel.item[1]["content:encoded"]);
    return feed.rss.channel.item.map((item: RSSItem) => episodeFromRSS(item));
  } catch (err) {
    if (err.response?.statusCode == 404) {
      return [];
    } else {
      throw err;
    }
  }
}
