import { Channel, CHANNELS, GREEK, shortName } from "./Channel";
import { getEpisodes } from "./EpisodeStorage";
import log from "./Log";

analyzeEpisodes();

function analyzeEpisodes() {
  CHANNELS.forEach(ch => analyzeEpisodesForChannel(ch));
  // analyzeEpisodesForChannel(GREEK);
}

function analyzeEpisodesForChannel(channel: Channel) {
  const episodes = getEpisodes(channel);
  let forVerse = 0;
  let special = 0;
  let noVideoForVerse = 0;
  let noVideoForSpecial = 0;
  let vimeoForVerse = 0;
  let vimeoForSpecial = 0;
  let youtubeForVerse = 0;
  let youtubeForSpecial = 0;
  let bothForVerse = 0;
  let bothForSpecial = 0;

  episodes.forEach(ep => {
    if (ep.reference) {
      ++forVerse;
      if (ep.vimeoId && ep.youtubeId) ++bothForVerse;
      else if (ep.vimeoId) ++vimeoForVerse;
      else if (ep.youtubeId) ++youtubeForVerse;
      else {
        ++noVideoForVerse;
        log(ep.title);
      }
    } else {
      // log(ep.title);
      ++special;
      if (ep.vimeoId && ep.youtubeId) ++bothForSpecial;
      else if (ep.vimeoId) ++vimeoForSpecial;
      else if (ep.youtubeId) ++youtubeForSpecial;
      else ++noVideoForSpecial;
    }
  });
  log(shortName(channel));
  log("=====================");
  log(`Verse episodes: ${forVerse}`);
  log(`No Video: ${noVideoForVerse}`);
  log(`Both: ${bothForVerse}`);
  log(`Vimeo: ${vimeoForVerse}`);
  log(`Youtube: ${youtubeForVerse}`);
  log("---------------------");
  log(`Special episodes: ${special}`);
  log(`No Video: ${noVideoForSpecial}`);
  log(`Both: ${bothForSpecial}`);
  log(`Vimeo: ${vimeoForSpecial}`);
  log(`Youtube: ${youtubeForSpecial}`);
  log(`=======================`);
  log("");
}
