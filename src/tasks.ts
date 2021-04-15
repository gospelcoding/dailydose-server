// Do stuff here to reprocess episodes without re-running a whole update.

import { CHANNELS } from "./Channel";
import { getEpisodes, saveEpisodes } from "./EpisodeStorage";
import log from "./Log";
import markNextEpisode from "./markNextEpisode";
import updateEpisodes from "./updateEpisodes";
import { addVimeoUrls, getVideoUrls } from "./VimeoAPI";

// markAll();
// runUpdate();
// getVimeoUrls();

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
async function runUpdate() {
  console.log("Remove latest episode...");
  CHANNELS.forEach(channel => {
    const episodes = getEpisodes(channel);
    episodes.splice(0, 1);
    if (episodes[0].next) episodes[0].next = undefined;
    saveEpisodes(channel, episodes);
  });
  console.log("Run Update...");
  await updateEpisodes();
  console.log("Done");
}

// Re-update all
// Delete all json files and run updateEpisodes

// Add Vimeo urls to all lacking it
async function getVimeoUrls() {
  CHANNELS.forEach(channel => {
    const episodes = getEpisodes(channel);
    addVimeoUrls(episodes, channel).then(() => {
      saveEpisodes(channel, episodes);
    });
  });
}
