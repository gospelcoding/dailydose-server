import request from "supertest";
import serverApp from "./serverApp";
import fs from "fs";
import { Episode } from "./Episode";

const app = serverApp();

beforeAll(() => {
  // Import fixed data
  fs.copyFileSync("fixtures/episodes_greek.json", "data/episodes_greek.json");
});

test("404 for invalid channels", async () => {
  const response = await request(app).get("/dailydoseoffinnish/all");
  expect(response.status).toBe(404);
});

test("All", async () => {
  const response = await request(app).get("/dailydoseofgreek/all");
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(15);
  expect(response.body[0]).toEqual({
    id: 2096,
    title: "Biblical Words and Their Meaning, by Moisés Silva",
    url:
      "https://dailydoseofgreek.com/scripture-passage/biblical-words-and-their-meaning-by-moises-silva/",
    vimeoId: 478438863,
    youtubeId: "6xJ24D4e8eY"
  });
});

test("All from 1000", async () => {
  const response = await request(app).get("/dailydoseofgreek/all/1001");
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(15);
  expect(response.body[0]).toEqual({
    id: 1000,
    title: "2 John 1-10",
    url: "https://dailydoseofgreek.com/scripture-passage/2-john-1-10/",
    reference: { book: "2 John", chapter: 1, verse: 10 },
    vimeoId: 246116481,
    text:
      "ει τις ερχεται προς υμας και ταυτην την διδαχην ου φερει μη λαμβανετε αυτον εις οικιαν και χαιρειν αυτω μη λεγετε"
  });
});

test("All from 2", async () => {
  const response = await request(app).get("/dailydoseofgreek/all/3");
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(2);
});

test("Newer than", async () => {
  let response = await request(app).get("/dailydoseofgreek/newerThan/2094");
  expect(response.status).toBe(200);
  expect(response.body.map((ep: Episode) => ep.id)).toEqual([2096, 2095]);

  response = await request(app).get("/dailydoseofgreek/newerThan/OOPS");
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(0);
});

test("Books", async () => {
  let response = await request(app).get("/dailydoseofgreek/books");
  expect(response.status).toBe(200);
  expect(response.body.slice(0, 3)).toEqual([
    {
      count: 11,
      name: "Psalms"
    },
    {
      count: 13,
      name: "Matthew"
    },
    {
      count: 681,
      name: "Mark"
    }
  ]);
  expect(response.body[response.body.length - 1].name).toBe("Special");
});

test("Chapters in books", async () => {
  let response = await request(app).get("/dailydoseofgreek/book/Mark");
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(16);
  expect(response.body[0]).toEqual({ chapter: 1, count: 46 });

  response = await request(app).get("/dailydoseofgreek/book/Psalms");
  expect(response.status).toBe(200);
  expect(response.body).toEqual([{ chapter: 50, count: 11 }]);
});

test("Episodes in chapter", async () => {
  let response = await request(app).get(
    "/dailydoseofgreek/book/Mark/chapter/2"
  );
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(28);
  expect(response.body[0]).toEqual({
    id: 213,
    reference: {
      book: "Mark",
      chapter: 2,
      verse: 1
    },
    title: "Mark 2:1",
    url: "https://dailydoseofgreek.com/scripture-passage/mark/mark-21/",
    vimeoId: 124760846,
    text:
      "και εισελθων παλιν εις καφαρναουμ δι ημερων ηκουσθη οτι εν οικω εστιν",
    next: 254
  });

  response = await request(app).get(
    "/dailydoseofgreek/book/Philippians/chapter/2"
  );
  expect(response.status).toBe(200);
  expect(response.body.map((ep: Episode) => ep.title)).toEqual([
    "Philippians 2:6 – Weekend",
    "Phil 2-9-11b",
    "Phil 2-9-11"
  ]);
});

test("Search", async () => {
  let response = await request(app).get("/search?q=accent");
  expect(response.status).toBe(200);
  expect(response.body.dailydoseofgreek[0].title).toBe("Greek Accents");

  response = await request(app).get("/search?q=aspect imper");
  expect(response.status).toBe(200);
  expect(response.body.dailydoseofgreek[0].title).toBe(
    "Imperatives-Debates-Verbal Aspect"
  );
});
