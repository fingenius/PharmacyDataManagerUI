const path = require('path');
const express = require('express');

const tableRouter = require("./routes/tableRouter");
const rootDir = require("./utils/pathUtil");


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded());

app.use(express.static(path.join(rootDir, 'public')))

app.use(tableRouter);
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});