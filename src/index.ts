import serverApp from "./serverApp";
import { initFirebase } from "./Firebase";
import updateEpisodes from "./updateEpisodes";
import cron from "node-cron";
import log from "./Log";

const UPDATE_INTERVAL = 1000 * 60 * 5; // 5 minutes

// Init Firebase
initFirebase();

// Watch rss feeds
cron.schedule("*/5 * * * *", () => {
  log("Running update...");
  updateEpisodes();
});

// Start server
const app = serverApp();
const port = 3001;
app.listen(port, () => {
  console.log(
    `Daily Dose API listening at http://localhost:${port}. ENV: ${process.env.NODE_ENV}`
  );
});
