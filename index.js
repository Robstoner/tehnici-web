const express = require("express");

app = express();

console.log("Folder proiect: " + __dirname);

app.set("view engine", "ejs");

app.use("/resurse", express.static(__dirname + "/resurse"));

app.get("/ceva", (req, res) => {
  res.send("altceva");
});

app.get(["/index", "/home"], (req, res) => {
  res.render("pagini/index");
});

app.get("/despre", (req, res) => {
  res.render("pagini/despre");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
