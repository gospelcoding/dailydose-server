import express, { Request, Response } from "express";
import { getRichBooks, getRichChapters } from "./BibleBook";
import {
  Channel,
  channelFromUrl,
  CHANNELS,
  GREEK_SP,
  isChannel
} from "./Channel";
import { chapterEpisodes, Episode } from "./Episode";
import { getAllEpisodes, getEpisodes } from "./EpisodeStorage";

const PAGE_SIZE = 15;

export default function serverApp() {
  const app = express();

  // Search episode titles for value of param q
  app.get("/search", (req, res) => {
    if (!req.query.q) res.status(400).send();
    else {
      const qs = req.query.q
        .toString()
        .toLocaleLowerCase()
        .split(/\s+/)
        .filter(q => q.length > 0);
      const episodes = getAllEpisodes();
      Object.keys(episodes).forEach(channel => {
        episodes[channel] = episodes[channel].filter(
          ep => !qs.some(q => !ep.title.toLocaleLowerCase().includes(q))
        );
      });
      res.json(episodes);
    }
  });

  app.get("/byUrl", (req, res) => {
    const queryUrl = decodeURIComponent(`${req.query.url}`).replace(
      "http:",
      "https:"
    );
    const channel = channelFromUrl(queryUrl);
    if (!channel) res.status(404).send();
    else {
      const episodes = getEpisodes(channel);
      const episode = episodes.find(ep => ep.url === queryUrl);
      if (!episode) res.status(404).send();
      else res.json(episode);
    }
  });

  app.get("/:channel/all/:id", (req, res) => {
    // 15 episodes starting after given id
    useEpisodes(req, res, episodes => {
      const startIndex = episodes.findIndex(
        ep => ep.id <= parseInt(req.params.id)
      );
      res.json(episodes.slice(startIndex + 1, startIndex + 1 + PAGE_SIZE));
    });
  });

  app.get("/:channel/all", (req, res) => {
    // Latest 15 episodes
    useEpisodes(req, res, episodes => {
      res.json(episodes.slice(0, PAGE_SIZE));
    });
  });

  app.get("/:channel/newerThan/:id", (req, res) => {
    useEpisodes(req, res, episodes => {
      const id = parseInt(req.params.id) || 1000000;
      const newEpisodes: Episode[] = [];
      let i = 0;
      while (episodes[i] && episodes[i].id > id) {
        newEpisodes.push(episodes[i]);
        ++i;
      }
      res.json(newEpisodes);
    });
  });

  app.get("/:channel/id/:id", (req, res) => {
    useEpisodes(req, res, episodes => {
      const id = parseInt(req.params.id);
      const episode = episodes.find(ep => ep.id === id);
      if (episode) res.json(episode);
      else res.status(404).send();
    });
  });

  // All episodes from that chapter
  app.get("/:channel/book/:book/chapter/:chapter", (req, res) => {
    useEpisodes(req, res, episodes => {
      const chapter = parseInt(req.params.chapter);
      res.json(chapterEpisodes(episodes, req.params.book, chapter));
    });
  });

  // List of chapters available
  app.get("/:channel/book/:book", (req, res) => {
    useEpisodes(req, res, episodes => {
      const chapterNums = getRichChapters(episodes, req.params.book);
      res.json(chapterNums);
    });
  });

  // List of available books
  app.get("/:channel/books", (req, res) => {
    useEpisodes(req, res, (episodes, channel) => {
      res.json(getRichBooks(episodes, channel == GREEK_SP));
    });
  });

  return app;
}

function useEpisodes(
  req: Request,
  res: Response,
  cb: (episodes: Episode[], channel: Channel) => void
) {
  if (isChannel(req.params.channel))
    cb(getEpisodes(req.params.channel), req.params.channel);
  else res.status(404).send(`Invalid channel: ${req.params.channel}`);
}
