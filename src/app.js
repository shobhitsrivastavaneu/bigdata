const http = require("http");
const express = require("express");
const routes = require("./routes");

const app = express();

app.use(express.json());

app.enable("etag");
app.set("etag", "strong");

app.use("/", routes);
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () =>
  console.log(`The server is running on port ${PORT}`)
);
