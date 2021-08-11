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
    id: 2100,
    title: "John 7:45",
    url: "https://dailydoseofgreek.com/scripture-passage/john-7-45/",
    reference: {
      book: "John",
      chapter: 7,
      verse: 45
    },
    vimeoId: 528291491,
    youtubeId: "UrShHg2CiTs",
    text: "ηλθον ουν οι υπηρεται προς τους αρχιερεις και φαρισαιους και ειπον αυτοις εκεινοι δια τι ουκ ηγαγετε αυτον",
    vimeoThumb: "https://i.vimeocdn.com/video/1093479001_1280x720.jpg?r=pad",
    vimeoUrls: {
      314: "https://player.vimeo.com/external/528291491.sd.mp4?s=36e8df87fe5067d481a33cc9513c8d1ef4c71cf5&profile_id=164&oauth2_token_id=1483004939",
      472: "https://player.vimeo.com/external/528291491.sd.mp4?s=36e8df87fe5067d481a33cc9513c8d1ef4c71cf5&profile_id=165&oauth2_token_id=1483004939",
      670: "https://player.vimeo.com/external/528291491.hd.mp4?s=fd167ae9b23833b1e0415922825da0f85cdecb60&profile_id=174&oauth2_token_id=1483004939",
      942: "https://player.vimeo.com/external/528291491.hd.mp4?s=fd167ae9b23833b1e0415922825da0f85cdecb60&profile_id=175&oauth2_token_id=1483004939"
    }
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
    text: "ει τις ερχεται προς υμας και ταυτην την διδαχην ου φερει μη λαμβανετε αυτον εις οικιαν και χαιρειν αυτω μη λεγετε",
    next: 999,
    vimeoThumb: "https://i.vimeocdn.com/video/670989115_1280x720.jpg?r=pad",
    vimeoUrls: {
      "360":
        "https://player.vimeo.com/external/246116481.sd.mp4?s=d1214bab80905b8bb22086f0ee9b8d828ca3969a&profile_id=164&oauth2_token_id=1483004939",
      "540":
        "https://player.vimeo.com/external/246116481.sd.mp4?s=d1214bab80905b8bb22086f0ee9b8d828ca3969a&profile_id=165&oauth2_token_id=1483004939",
      "720":
        "https://player.vimeo.com/external/246116481.hd.mp4?s=28c498b427448d37da177f5de8af344670caffd7&profile_id=174&oauth2_token_id=1483004939"
    }
  });
});

test("All from 2", async () => {
  const response = await request(app).get("/dailydoseofgreek/all/3");
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(2);
});

test("Newer than", async () => {
  let response = await request(app).get("/dailydoseofgreek/newerThan/2098");
  expect(response.status).toBe(200);
  expect(response.body.map((ep: Episode) => ep.id)).toEqual([2100, 2099]);

  response = await request(app).get("/dailydoseofgreek/newerThan/OOPS");
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(0);
});

test("Get by id", async () => {
  let response = await request(app).get("/dailydoseofgreek/id/123456");
  expect(response.status).toBe(404);

  response = await request(app).get("/dailydoseofgreek/id/2090");
  expect(response.status).toBe(200);
  expect(response.body.title).toBe("The Minister and His Greek New Testament");
});

test("Get by url", async () => {
  let response = await request(app).get("/byUrl").query({
    url: "https://dailydoseofgreek.com/scripture-passage/not-an-episode/"
  });
  expect(response.status).toBe(404);

  response = await request(app)
    .get("/byUrl")
    .query({
      url: encodeURIComponent(
        "https://dailydoseofgreek.com/scripture-passage/john-7-37/"
      )
    });
  expect(response.status).toBe(200);
  expect(response.body.title).toBe("John 7:37");
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
  // expect(response.body[response.body.length - 1].name).toBe("Special");
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
    text: "και εισελθων παλιν εις καφαρναουμ δι ημερων ηκουσθη οτι εν οικω εστιν",
    next: 254,
    vimeoThumb: "https://i.vimeocdn.com/video/514605920_1280x720.jpg?r=pad",
    vimeoUrls: {
      "270":
        "https://player.vimeo.com/external/124760846.mobile.mp4?s=799be896f2f39e70d8212d5fc44e23c5f27c1380&profile_id=116&oauth2_token_id=1483004939",
      "360":
        "https://player.vimeo.com/external/124760846.sd.mp4?s=86e9b5e50f24aa4d2a59256cea497398df03b9b9&profile_id=112&oauth2_token_id=1483004939",
      "720":
        "https://player.vimeo.com/external/124760846.hd.mp4?s=4919ebbe3408a43ba0bcc02edff42a03e332907b&profile_id=113&oauth2_token_id=1483004939"
    }
  });

  response = await request(app).get(
    "/dailydoseofgreek/book/Philippians/chapter/2"
  );
  expect(response.status).toBe(200);
  expect(response.body.map((ep: Episode) => ep.title)).toEqual([
    "Philippians 2:6 – Weekend",
    "Phil 2-9-11",
    "Phil 2-9-11b"
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
