import { getRichBooks, getRichChapters, matchingBook } from "./BibleBook";
import { Episode } from "./Episode";
import { getEpisodes } from "./EpisodeStorage";

test("Match books", () => {
  expect(matchingBook("John", false)).toBe("John");
  expect(matchingBook("1 Corinthians", false)).toBe("1 Corinthians");
  expect(matchingBook("“Great Faith,” A sermon on Matthew", false)).toBe(
    "Matthew"
  );
  expect(matchingBook("Rev", false)).toBe("Revelation");
  expect(matchingBook("Phil", false)).toBe("Philippians");
  expect(matchingBook("LXX – Psa", false)).toBe("Psalms");
  expect(matchingBook("Juan", false)).toBe(null);
  expect(matchingBook("Juan", true)).toBe("Juan");
  expect(matchingBook("John, ὁ βαπτίζων (Mark", false)).toBe("Mark");
  expect(matchingBook("Diamond Symbol in 1 John", false)).toBe("1 John");
});

test("Get rich books", () => {
  const episodes: Episode[] = [
    {
      id: 4,
      title: "",
      url: "",
      reference: { book: "John", chapter: 1, verse: 2 }
    },
    {
      id: 4,
      title: "",
      url: "",
      reference: { book: "John", chapter: 1, verse: 2 }
    },
    {
      id: 4,
      title: "GNT",
      url: ""
    },
    {
      id: 4,
      title: "",
      url: "",
      reference: { book: "Mark", chapter: 8, verse: 2 }
    }
  ];
  expect(getRichBooks(episodes, false)).toEqual([
    { name: "Mark", count: 1 },
    { name: "John", count: 2 },
    { name: "Special", count: 1 }
  ]);
});

test("get rich chapters", () => {
  const episodes = getEpisodes("dailydoseofgreek");
  const chaps = getRichChapters(episodes, "Mark");
  expect(chaps.length).toBe(16);
  expect(chaps[0]).toEqual({ chapter: 1, count: 46 });
});