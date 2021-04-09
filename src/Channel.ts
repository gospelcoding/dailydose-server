export const CHANNELS = [
  "dailydoseofgreek",
  "dosisdiariadegriego",
  "dailydoseofhebrew",
  "dailydoseoflatin"
] as const;
export type Channel = typeof CHANNELS[number];

export const GREEK = CHANNELS[0];
export const GREEK_SP = CHANNELS[1];
export const HEBREW = CHANNELS[2];
export const LATIN = CHANNELS[3];

export function shortName(channel: Channel) {
  return channel.replace("dailydoseof", "").replace("dosisdiariade", "");
}

export function isChannel(word: string): word is Channel {
  return CHANNELS.includes(word as Channel);
}
