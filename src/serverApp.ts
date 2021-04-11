import express, { Request, Response } from "express";
import { getRichBooks, getRichChapters } from "./BibleBook";
import { Channel, CHANNELS, GREEK_SP, isChannel } from "./Channel";
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
