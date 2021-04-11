import axios from "axios";
import { isNT, spToEng } from "./BibleBook";
import { Channel, GREEK_SP } from "./Channel";
import { NewEpisode, Reference } from "./Episode";
import log from "./Log";

interface APIResponse {
  book: { chapter: { [key: number]: { verse: string } } }[];
}

const VERSIONS = {
  dailydoseofgreek: "westcott",
  dosisdiariadegriego: "westcott",
  dailydoseofhebrew: "codex",
  dailydoseoflatin: "vulgate"
};

export async function addVerseTexts(episodes: NewEpisode[], channel: Channel) {
  for (let i = 0; i < episodes.length; ++i) {
    const ep = episodes[i];
    if (ep.reference) {
      const text = await getVerseText(ep.reference, channel);
      if (text) ep.text = text;
    }
  }
}

export async function getVerseText(
  ref: Reference,
  channel: Channel
): Promise<string | null> {
  const bookName = channel == GREEK_SP ? spToEng(ref.book) : ref.book;
  const refText = `${bookName} ${ref.chapter}:${ref.verse}`;
  try {
    const response = await axios.get(
      `http://getbible.net/json?p=${refText}&v=${pickVersion(
        channel,
        ref.book
      )}`
    );
    return unpack(response.data, ref.verse);
  } catch (err) {
    log(`Failed to get verse text for ${refText} for ${channel}`);
    return null;
  }
}

function pickVersion(channel: Channel, book: string) {
  let version = VERSIONS[channel];
  if (version == "westcott" && !isNT(book, channel == GREEK_SP))
    version = "lxxunaccents";
  return version;
}

function unpack(data: string, verseNum: number): string {
  const pattern = /\((.+)\)/;
  const match = pattern.exec(data);
  if (!match) throw `No match: ${data}`;
  const apiResponse: APIResponse = JSON.parse(match[1]);
  const text = apiResponse.book[0].chapter[verseNum].verse.trim();
  return cleanVerseText(text);
}

function cleanVerseText(text: string) {
  const variants = /{.+?}/g;
  const excessSpace = /\s+/g;
  return text.replace(variants, "").replace(excessSpace, " ");
}
