import serverApp from "./serverApp";
import { initFirebase } from "./Firebase";

// Init Firebase
initFirebase();

// Watch rss feeds
// ....

// Start server
const app = serverApp();
const port = 3001;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
