import { chapterEpisodes, Episode, Reference } from "./Episode";

export default function markNextEpisode(episodes: Episode[]) {
  episodes.forEach((ep, index) => {
    if (ep.next || !ep.reference) return;

    const sameChEps = chapterEpisodes(
      episodes,
      ep.reference.book,
      ep.reference.chapter
    );
    const nextEp = sameChEps[sameChEps.findIndex(e => e.id == ep.id) + 1];
    if (nextEp) {
      ep.next = nextEp.id;
    } else {
      const nextChEp = episodes.find(
        ep2 =>
          ep2.reference?.book == ep.reference!.book &&
          ep2.reference?.chapter == ep.reference!.chapter + 1 &&
          ep2.reference?.verse == 1
      );
      if (nextChEp) ep.next = nextChEp.id;
    }
  });
}

function nextVerseInChapter(ref: Reference, ref2: Reference) {
  return ref2.chapter == ref.chapter && ref2.verse == ref.verse + 1;
}

function firstVerseInNextChapter(ref: Reference, ref2: Reference) {
  return ref2.chapter == ref.chapter + 1 && ref2.verse == 1;
}
