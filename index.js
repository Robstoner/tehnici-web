const express = require("express");
const fs = require("fs");

obGlobal = {
  obErori: null,
  obImagini: null,
};

app = express();

console.log("Folder proiect: " + __dirname);

app.set("view engine", "ejs");

app.use("/resurse", express.static(__dirname + "/resurse"));

app.get("/*", (req, res) => {
  res.render("pagini" + req.url, (err, html) => {
    if (err) {
      if (err.message.includes("Failed to lookup view")) {
        afisEroare(res, "404");
      } else {
        afisEroare(res);
      }
    } else {
      res.send(html);
    }
  });
});

app.get("/ceva", (req, res) => {
  res.send("altceva");
});

app.get(["/index", "/home"], (req, res) => {
  res.render("pagini/index");
});

app.get("/despre", (req, res) => {
  res.render("pagini/despre");
});

function initErori() {
  var continut = fs
    .readFileSync(__dirname + "/resurse/json/erori.json")
    .toString("utf-8");
  obGlobal.obErori = JSON.parse(continut);
  obGlobal.obErori.info_erori.forEach((eroare) => {
    eroare.imagine = "/" + obGlobal.obErori.cale_baza + "/" + eroare.imagine;
  });
}

initErori();

function afisEroare(res, _identificator, _titlu, _text, _imagine) {
  let vErori = obGlobal.obErori.info_erori;
  let eroare = vErori.find((eroare) => eroare.identificator == _identificator);

  if (eroare) {
    let titlu1 = _titlu || eroare.titlu;
    let text1 = _text || eroare.text;
    let imagine1 = _imagine || eroare.imagine;

    if (eroare.status) res.status(eroare.identificator);
    res.render("pagini/eroare", {
      titlu: titlu1,
      text: text1,
      imagine: imagine1,
    });
  } else {
    res.render("pagini/eroare", obGlobal.eroare_default);
  }
}
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
