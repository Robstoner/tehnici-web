const express = require("express");

app = express();

console.log("Folder proiect: " + __dirname);

app.get("/ceva", (req, res) => {
  res.send("altceva");
});

app.get("/index.html", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
