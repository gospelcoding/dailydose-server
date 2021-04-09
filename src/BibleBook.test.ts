import { matchingBook } from "./BibleBook";

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
