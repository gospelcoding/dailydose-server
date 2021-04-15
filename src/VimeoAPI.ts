import axios from "axios";
import { Channel } from "./Channel";
import secrets from "./secrets";
import log from "./Log";
import { NewEpisode, VimeoUrls } from "./Episode";

export const VID_SIZES = ["240", "360", "540", "720", "1080"] as const;
export type VidSize = typeof VID_SIZES[number];
const TARGET_THUMB = 720;

interface VimeoResponse {
  files: {
    quality: string;
    width: number;
    height: number;
    link: string;
    size: number;
  }[];
  pictures: {
    sizes: {
      height: number;
      link: string;
    }[];
  };
}

export async function addVimeoUrls(
  episodes: NewEpisode[],
  channel: Channel
): Promise<void> {
  for (let i = 0; i < episodes.length; ++i) {
    const episode = episodes[i];
    if (episode.vimeoId) {
      const vimeoParams = await getVideoUrls(episode.vimeoId, channel);
      if (Object.keys(vimeoParams).length > 0)
        episodes[i] = { ...episodes[i], ...vimeoParams };
    }
  }
}

export async function getVideoUrls(
  vimeoId: number,
  channel: Channel
): Promise<{ vimeoUrls?: VimeoUrls; vimeoThumb?: string }> {
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
    const vimeoUrls = vimeoData.files.reduce((urls: VimeoUrls, file) => {
      return file.height
        ? { ...urls, [file.height.toString()]: file.link }
        : urls;
    }, {});
    const vimeoThumb = chooseVidSize(vimeoData.pictures.sizes, TARGET_THUMB)
      .link;
    return { vimeoThumb, vimeoUrls };
  } catch (err) {
    log(err);
    return {};
  }
}

function chooseVidSize(
  sizes: VimeoResponse["pictures"]["sizes"],
  target: number
): VimeoResponse["pictures"]["sizes"][number] {
  // Biggest <= to target or smallest available
  return sizes.reduce((chosenSize, size) => {
    if (
      (size.height <= target && size.height > chosenSize.height) ||
      (chosenSize.height > target && size.height < chosenSize.height)
    )
      return size;
    return chosenSize;
  });
}
