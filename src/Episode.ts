import { decode } from "html-entities";
import { matchingBook } from "./BibleBook";
import log from "./Log";

export interface Reference {
  book: string;
  chapter: number;
  verse: number;
}
export interface VimeoUrls {
  [size: string]: string;
}

export interface NewEpisode {
  title: string;
  url: string;
  timestamp: string;
  reference?: Reference;
  vimeoId?: number;
  vimeoUrls?: VimeoUrls;
  vimeoThumb?: string;
  youtubeId?: string;
  text?: string;
  next?: number;
}

export interface Episode extends NewEpisode {
  id: number;
}

export interface MultiChannelEpisodes {
  [key: string]: Episode[]; // key must actually be Channel, but TS won't let me say that
}

export interface RSSItem {
  title: string;
  link: string;
  pubDate: string;
  "content:encoded": string;
}

export function episodeFromRSS(item: RSSItem, sp: boolean): NewEpisode {
  const title = decode(item.title);
  const reference = parseRefFromTitle(title, sp);
  const vimeoId = parseVimeoId(item["content:encoded"]);
  const youtubeId = parseYoutubeId(item["content:encoded"]);

  const episode: NewEpisode = {
    title,
    url: item.link,
    timestamp: item.pubDate
  };
  if (reference) episode.reference = reference;
  if (vimeoId) episode.vimeoId = vimeoId;
  if (youtubeId) episode.youtubeId = youtubeId;

  return episode;
}

function parseRefFromTitle(title: string, sp: boolean): Reference | undefined {
  const pattern = /(.+) (\d+)[:-](\d+)/;
  const match = pattern.exec(title);
  if (!match) return undefined;

  const book = matchingBook(match[1], sp);
  if (!book) return undefined;

  return {
    book,
    chapter: parseInt(match[2]),
    verse: parseInt(match[3])
  };
}

function parseVimeoId(content: string): number | undefined {
  const pattern = /vimeo\.com\/video\/(\d+)/;
  const match = pattern.exec(content);
  if (!match) return undefined;
  return parseInt(match[1]);
}

function parseYoutubeId(content: string): string | undefined {
  const pattern = /youtube\.com\/embed\/(.+?)[?"']/;
  const match = pattern.exec(content);
  if (!match) return undefined;
  return match[1];
}

export function addNewEpisodes(
  episodes: Episode[],
  newEpisodes: NewEpisode[]
): Episode[] {
  const lastId = episodes[0] ? episodes[0].id : 0;
  return newEpisodes
    .map((ep, index) => ({ id: lastId + (newEpisodes.length - index), ...ep }))
    .concat(episodes);
}

export function chapterEpisodes(
  episodes: Episode[],
  book: string,
  chapter: number
) {
  const chEpisodes = episodes.filter(
    ep => ep.reference?.book == book && ep.reference?.chapter == chapter
  );
  // Sort by verse first, then id (both asc)
  chEpisodes.sort((a, b) =>
    a.reference!.verse == b.reference!.verse
      ? a.id - b.id
      : a.reference!.verse - b.reference!.verse
  );
  return chEpisodes;
}
