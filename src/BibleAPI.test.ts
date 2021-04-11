import { getVerseText } from "./BibleAPI";

test.skip("Get verses", async () => {
  let text = await getVerseText(
    { book: "John", chapter: 1, verse: 1 },
    "dailydoseofgreek"
  );
  expect(text).toEqual(
    "εν αρχη ην ο λογος και ο λογος ην προς τον θεον και θεος ην ο λογος"
  );

  text = await getVerseText(
    { book: "Psalms", chapter: 1, verse: 1 },
    "dailydoseofgreek"
  );
  expect(text).toEqual(
    "μακαριος ανηρ ος ουκ επορευθη εν βουλη ασεβων και εν οδω αμαρτωλων ουκ εστη και επι καθεδραν λοιμων ουκ εκαθισεν"
  );

  text = await getVerseText(
    { book: "Santiago", chapter: 2, verse: 14 },
    "dosisdiariadegriego"
  );
  expect(text).toEqual(
    "τι οφελος αδελφοι μου εαν πιστιν λεγη τις εχειν εργα δε μη εχη μη δυναται η πιστις σωσαι αυτον"
  );

  text = await getVerseText(
    { book: "Genesis", chapter: 1, verse: 1 },
    "dailydoseofhebrew"
  );
  expect(text).toEqual(
    "בְּרֵאשִׁ֖ית בָּרָ֣א אֱלֹהִ֑ים אֵ֥ת הַשָּׁמַ֖יִם וְאֵ֥ת הָאָֽרֶץ׃"
  );

  text = await getVerseText(
    { book: "Romans", chapter: 5, verse: 1 },
    "dailydoseoflatin"
  );
  expect(text).toEqual(
    "Justificati ergo ex fide, pacem habeamus ad Deum per Dominum nostrum Jesum Christum :"
  );
});
