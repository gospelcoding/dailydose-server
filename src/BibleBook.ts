import { Episode } from "./Episode";

const MIN_MATCH = 3;

export interface RichBook {
  name: string;
  count: number;
}

export interface RichChapter {
  chapter: number;
  count: number;
}

export const SPECIAL = "Special";

const BIBLE_BOOKS = [
  "Genesis",
  "Exodus",
  "Leviticus",
  "Numbers",
  "Deuteronomy",
  "Joshua",
  "Judges",
  "Ruth",
  "1 Samuel",
  "2 Samuel",
  "1 Kings",
  "2 Kings",
  "1 Chronicles",
  "2 Chronicles",
  "Ezra",
  "Nehemiah",
  "Esther",
  "Job",
  "Psalms",
  "Proverbs",
  "Ecclesiastes",
  "Song of Songs",
  "Isaiah",
  "Jeremiah",
  "Lamentations",
  "Ezekiel",
  "Daniel",
  "Hosea",
  "Joel",
  "Amos",
  "Obadiah",
  "Jonah",
  "Micah",
  "Nahum",
  "Habakkuk",
  "Zephaniah",
  "Haggai",
  "Zechariah",
  "Malachi",
  "Matthew",
  "Mark",
  "Luke",
  "John",
  "Acts",
  "Romans",
  "1 Corinthians",
  "2 Corinthians",
  "Galatians",
  "Ephesians",
  "Philippians",
  "Colossians",
  "1 Thessalonians",
  "2 Thessalonians",
  "1 Timothy",
  "2 Timothy",
  "Titus",
  "Philemon",
  "Hebrews",
  "James",
  "1 Peter",
  "2 Peter",
  "1 John",
  "2 John",
  "3 John",
  "Jude",
  "Revelation"
];

const BIBLE_BOOKS_SP = [
  "Génesis",
  "Éxodo",
  "Levítico",
  "Números",
  "Deuteronomio",
  "Josué",
  "Jueces",
  "Rut",
  "1 Samuel",
  "2 Samuel",
  "1 Reyes",
  "2 Reyes",
  "1 Crónicas",
  "2 Crónicas",
  "Esdras",
  "Nehemías",
  "Ester",
  "Job",
  "Salmos",
  "Proverbios",
  "Eclesiastés",
  "Cantares",
  "Isaías",
  "Jeremías",
  "Lamentaciones",
  "Ezequiel",
  "Daniel",
  "Oseas",
  "Joel",
  "Amós",
  "Abdías",
  "Jonás",
  "Miqueas",
  "Nahúm",
  "Habacuc",
  "Sofonías",
  "Hageo",
  "Zacarías",
  "Malaquías",
  "Mateo",
  "Marcos",
  "Lucas",
  "Juan",
  "Hechos",
  "Romanos",
  "1 Corintios",
  "2 Corintios",
  "Gálatas",
  "Efesios",
  "Filipenses",
  "Colosenses",
  "1 Tesalonicenses",
  "2 Tesalonicenses",
  "1 Timoteo",
  "2 Timoteo",
  "Tito",
  "Filemón",
  "Hebreos",
  "Santiago",
  "1 Pedro",
  "2 Pedro",
  "1 Juan",
  "2 Juan",
  "3 Juan",
  "Judas",
  "Apocalipsis"
];

export function matchingBook(text: string, sp: boolean): string | null {
  const bookList = sp ? BIBLE_BOOKS_SP : BIBLE_BOOKS;
  let matchedBook: string | null = null;
  let matchSize = 0;

  bookList.forEach(book => {
    const bookMatchSize = largestMatch(text, book);
    if (bookMatchSize >= MIN_MATCH && bookMatchSize > matchSize) {
      matchedBook = book;
      matchSize = bookMatchSize;
    }
  });

  return matchedBook;
}

function largestMatch(baseText: string, bookName: string): number {
  const base = baseText.toLocaleLowerCase();
  const book = bookName.toLocaleLowerCase();
  let matchSize = 0;
  for (let size = 0; size <= book.length; ++size) {
    if (match(base, book, size)) matchSize = size;
  }
  return matchSize;
}

// End of base must match beginning of book
function match(base: string, book: string, size: number) {
  return base.slice(base.length - size) == book.slice(0, size);
}

export function compBooks(a: string, b: string, sp: boolean) {
  const bookList = sp ? BIBLE_BOOKS_SP : BIBLE_BOOKS;
  const indexOf = (str: string) => {
    const index = bookList.indexOf(str);
    return index >= 0 ? index : 10000; // Not in list needs to go to back
  };
  return indexOf(a) - indexOf(b);
}

export function getRichBooks(episodes: Episode[], sp: boolean) {
  const books = episodes.reduce((bookNames: RichBook[], ep) => {
    // const name = ep.reference ? ep.reference.book : SPECIAL;
    const name = ep.reference?.book;
    if (!name) return bookNames;

    const index = bookNames.findIndex(bn => bn.name == name);
    if (index == -1) {
      bookNames.push({ name, count: 1 });
    } else {
      bookNames[index].count += 1;
    }
    return bookNames;
  }, []);
  books.sort((a, b) => compBooks(a.name, b.name, sp));
  return books;
}

export function getRichChapters(episodes: Episode[], book: string) {
  const chaps = episodes.reduce((chaps: { [ch: string]: number }, ep) => {
    if (ep.reference?.book == book) {
      const ch = ep.reference.chapter;
      if (!chaps[ch]) chaps[ch] = 0;
      chaps[ch] += 1;
    }
    return chaps;
  }, {});
  return Object.keys(chaps)
    .sort((a, b) => parseInt(a) - parseInt(b))
    .map(ch => ({ chapter: parseInt(ch), count: chaps[ch] }));
}

export function isNT(book: string, sp: boolean) {
  const bibleBooks = sp ? BIBLE_BOOKS_SP : BIBLE_BOOKS;
  const matthew = sp ? "Mateo" : "Matthew";
  return bibleBooks.indexOf(book) >= bibleBooks.indexOf(matthew);
}

export function spToEng(book: string) {
  return BIBLE_BOOKS[BIBLE_BOOKS_SP.indexOf(book)];
}
