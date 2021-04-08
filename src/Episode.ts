export interface Reference {
  book: string;
  chapter: number;
  verse: number;
}

export interface Episode {
  title: string;
  url: string;
  reference?: Reference;
  vimeoId?: number;
}

export interface RSSItem {
  title: string;
  link: string;
  "content:encoded": string;
}

export function episodeFromRSS(item: RSSItem): Episode {
  const reference = parseRefFromTitle(item.title);
  const vimeoId = parseVimeoId(item["content:encoded"]);

  const episode: Episode = {
    title: item.title,
    url: item.link
  };
  if (reference) episode.reference = reference;
  if (vimeoId) episode.vimeoId = vimeoId;
  return episode;
}

function parseRefFromTitle(title: string): Reference | undefined {
  const pattern = /(.+) (\d+):(\d+)/;
  const match = pattern.exec(title);
  if (!match) return undefined;
  return {
    book: match[1],
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
