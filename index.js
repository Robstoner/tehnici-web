const express = require("express");
const fs = require("fs");
const sass = require("sass");
const path = require("path");

obGlobal = {
  obErori: null,
  obImagini: null,
};

app = express();

console.log("Folder proiect: " + __dirname);
console.log("Cale fisier: " + __filename);
console.log("Folder curent: " + process.cwd());

foldere = ["temp", "temp1"];

foldere.forEach((folder) => {
  // let cale = __dirname + "/" + folder;
  let cale = path.join(__dirname, folder);
  if (!fs.existsSync(cale)) {
    fs.mkdirSync(cale);
  }
});

app.set("view engine", "ejs");

app.use("/resurse", express.static(path.join(__dirname, "resurse")));

function initErori() {
  var continut = fs
    .readFileSync(path.join(__dirname, "resurse/json/erori.json"))
    .toString("utf-8");
  obGlobal.obErori = JSON.parse(continut);
  obGlobal.obErori.info_erori.forEach((eroare) => {
    eroare.imagine = path.join(obGlobal.obErori.cale_baza, eroare.imagine);
  });
}

initErori();

function afisEroare(
  res,
  _identificator,
  _titlu = "titlu default",
  _text,
  _imagine
) {
  let vErori = obGlobal.obErori.info_erori;
  let eroare = vErori.find((eroare) => eroare.identificator == _identificator);
  console.log(_identificator, eroare);
  if (eroare) {
    let titlu1 = _titlu == "titlu default" ? eroare.titlu || _titlu : _titlu;
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

app.use(/^\/resurse(\/[a-zA-Z0-9]*(?!\.)[a-zA-Z0-9]*)*$/, (req, res) => {
  console.log(
    "==========================================================================="
  );
  afisEroare(res, "403");
});

app.get("/favicon.ico", (req, res) => {
  res.sendFile("favicon.ico", { root: __dirname + "/resurse/ico" });
});

app.get(["/", "/index", "/home"], (req, res) => {
  res.render("pagini/index", { ip: req.ip });
});

// app.get("/despre", (req, res) => {
//   res.render("pagini/despre");
// });

app.get(/\.ejs$/, (req, res) => {
  afisEroare(res, "400");
});

app.get("/*", (req, res) => {
  try {
    console.log("cv");
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
  } catch (err) {
    if (err.message.includes("Cannot find module")) {
      afisEroare(res, "404");
    }
  }
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
