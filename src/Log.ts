import path from "path";
import fs from "fs";

export default function log(msg: any) {
  if (process.env.NODE_ENV == "production") {
    const date = new Date();
    const filename = path.join("data", "log", date.toISOString().slice(0, 10));
    const entry = `[${date.toTimeString()}]  ${msg}\n`;
    fs.appendFileSync(filename, entry);
  } else {
    console.log(msg);
  }
}
