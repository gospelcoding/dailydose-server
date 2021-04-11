// Do stuff here to reprocess episodes without re-running a whole update.

import { CHANNELS } from "./Channel";
import { getEpisodes, saveEpisodes } from "./EpisodeStorage";
import log from "./Log";
import markNextEpisode from "./markNextEpisode";

// markAll();

// Mark next episodes
function markAll() {
  CHANNELS.forEach(channel => {
    log(`Mark ${channel}...`);
    const episodes = getEpisodes(channel);
    episodes.forEach(ep => {
      if (ep.next) ep.next = undefined;
    });
    markNextEpisode(episodes);
    saveEpisodes(channel, episodes);
  });
  log("Done");
}

// Redo latest from scratch - delete most recent in each channel and then run update
// Also delete any "next" param from the 2nd to last episode

// Re-update all
// Delete all json files and run updateEpisodes
