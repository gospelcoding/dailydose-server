import serverApp from "./serverApp";
import { initFirebase } from "./Firebase";
import updateEpisodes from "./updateEpisodes";

const UPDATE_INTERVAL = 1000 * 60 * 5; // 5 minutes

// Init Firebase
initFirebase();

// Watch rss feeds
setInterval(() => {
  updateEpisodes();
}, UPDATE_INTERVAL);

// Start server
const app = serverApp();
const port = 3001;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
