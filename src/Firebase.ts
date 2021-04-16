import admin, { initializeApp } from "firebase-admin";
import { Channel, GREEK_SP, shortName } from "./Channel";
import { Episode } from "./Episode";
import { getEpisodes } from "./EpisodeStorage";
import log from "./Log";
var serviceAccount = require("../data/daily-dose-310717-firebase-adminsdk-anc44-dc2ac0bd41.json");

export function initFirebase() {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  // Debug
  // sendNotification("dailydoseofgreek", getEpisodes("dailydoseofhebrew")[0]); //
}

export function sendNotification(channel: Channel, episode: Episode) {
  log(`Send notification for ${channel} ${episode.title}`);
  const message = {
    notification: {
      title: title(channel, episode),
      body: episode.text ? episode.text : new Date().toDateString()
    },
    android: {
      notification: {
        icon: `notify_${shortName(channel)}`
      }
    },
    data: {
      channel: channel,
      episodes: JSON.stringify([episode])
    },
    topic: channel
  };

  admin
    .messaging()
    .send(message)
    .then(response => {
      // Response is a message ID string.
      log(`Successfully sent message: ${response}`);
    })
    .catch(error => {
      log(`Error sending message: ${error}`);
    });
}

function title(channel: Channel, episode: Episode) {
  return `${channel == GREEK_SP ? "Nuevo Episodio" : "New Episode"}: ${
    episode.title
  }`;
}
