const path = require('path');
const express = require('express');
const { initPool } = require('./db/oracle');
const session = require('express-session');

const tableRouter = require("./routes/tableRouter");
const rootDir = require("./utils/pathUtil");


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded());

app.use(express.static(path.join(rootDir, 'public')))


app.use(session({
  secret:process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(tableRouter);

(async () => {
  try {
    await initPool(); // create pool once at startup
    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
})();