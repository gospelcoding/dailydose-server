import axios from "axios";
import { Channel } from "./Channel";
import secrets from "./secrets";
import log from "./Log";
import { NewEpisode, VimeoUrls } from "./Episode";

export const VID_SIZES = ["240", "360", "540", "720", "1080"] as const;
export type VidSize = typeof VID_SIZES[number];

interface VimeoResponse {
  files: {
    quality: string;
    width: number;
    height: number;
    link: string;
    size: number;
  }[];
}

export async function addVimeoUrls(
  episodes: NewEpisode[],
  channel: Channel
): Promise<void> {
  for (let i = 0; i < episodes.length; ++i) {
    const episode = episodes[i];
    if (episode.vimeoId) {
      const urls = await getVideoUrls(episode.vimeoId, channel);
      if (Object.keys(urls).length > 0) episode.vimeoUrls = urls;
    }
  }
}

export async function getVideoUrls(
  vimeoId: number,
  channel: Channel
): Promise<VimeoUrls> {
  const token = secrets.vimeoApiKeys[channel];
  if (!token) return {};

  try {
    const response = await axios.get(
      `https://api.vimeo.com/videos/${vimeoId}`,
      {
        headers: { Authorization: `bearer ${token}` }
      }
    );
    const vimeoData: VimeoResponse = response.data;
    return vimeoData.files.reduce((urls: VimeoUrls, file) => {
      return file.height
        ? { ...urls, [file.height.toString()]: file.link }
        : urls;
    }, {});
  } catch (err) {
    log(err);
    return {};
  }
}
