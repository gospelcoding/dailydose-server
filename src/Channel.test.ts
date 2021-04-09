import { CHANNELS, isChannel, shortName } from "./Channel";

test("Channel Short Name", () => {
  expect(CHANNELS.map(shortName)).toEqual([
    "greek",
    "griego",
    "hebrew",
    "latin"
  ]);
});

test("Is channel", () => {
  expect(isChannel("dailydoseofgreek")).toBe(true);
  expect(isChannel("dailydoseofklingon")).toBe(false);
});
