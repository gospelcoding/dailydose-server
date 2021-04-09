import express, { Request, Response } from "express";
import { numSort, uniq } from "./arrayUtils";
import { sortBooks } from "./BibleBook";
import { Channel, CHANNELS, GREEK_SP, isChannel } from "./Channel";
import { Episode } from "./Episode";
import { getEpisodes } from "./EpisodeStorage";

const PAGE_SIZE = 15;

export default function serverApp() {
  const app = express();

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
      const chEpisodes = episodes.filter(
        ep =>
          ep.reference?.book == req.params.book &&
          ep.reference?.chapter == chapter
      );
      chEpisodes.sort((a, b) => a.reference!.verse - b.reference!.verse);
      res.json(chEpisodes);
    });
  });

  app.get("/:channel/book/:book", (req, res) => {
    // List of chapters available
    useEpisodes(req, res, episodes => {
      const chapterNums = uniq(
        episodes
          .filter(ep => ep.reference?.book == req.params.book)
          .map(ep => ep.reference?.chapter)
      ) as number[];
      numSort(chapterNums);
      res.json(chapterNums);
    });
  });

  // List of available books
  app.get("/:channel/books", (req, res) => {
    useEpisodes(req, res, (episodes, channel) => {
      const bookNames = uniq(
        episodes.filter(ep => ep.reference).map(ep => ep.reference?.book)
      );
      sortBooks(bookNames as string[], channel == GREEK_SP);
      res.json(bookNames);
    });
  });

  app.get("/:channel/search"); // Search episode titles for value of param q

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
