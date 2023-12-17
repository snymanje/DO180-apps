var express = require("express");
app = express();

let podIP = process.environment?.HOSTNAME || "Unkown";

app.get("/", function (req, res) {
  res.send(`Hello World from pod: ${podIP}`);
});

app.get("/hello", function (req, res) {
  res.send("Hello World");
});

app.listen(8080, function () {
  console.log("Example app listening on port 8080!");
});
