import { getVideoUrls } from "./VimeoAPI";
// import fs from "fs";

test.skip("Vimeo API", async () => {
  const data = await getVideoUrls(478438863, "dailydoseofgreek");
  expect(data).toEqual({
    "1080":
      "https://player.vimeo.com/external/478438863.hd.mp4?s=08fd244cb2abf6a474dae42906d2324a28721aaf&profile_id=175&oauth2_token_id=1483004939",
    "240":
      "https://player.vimeo.com/external/478438863.sd.mp4?s=620d93fd31e8c4cb421e7ea1f253da99c1430def&profile_id=139&oauth2_token_id=1483004939",
    "360":
      "https://player.vimeo.com/external/478438863.sd.mp4?s=620d93fd31e8c4cb421e7ea1f253da99c1430def&profile_id=164&oauth2_token_id=1483004939",
    "540":
      "https://player.vimeo.com/external/478438863.sd.mp4?s=620d93fd31e8c4cb421e7ea1f253da99c1430def&profile_id=165&oauth2_token_id=1483004939",
    "720":
      "https://player.vimeo.com/external/478438863.hd.mp4?s=08fd244cb2abf6a474dae42906d2324a28721aaf&profile_id=174&oauth2_token_id=1483004939"
  });
  // fs.writeFileSync("./data/vimeoResponse.json", JSON.stringify(data));
});
