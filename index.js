const express = require("express");
const fs = require("fs");
const sass = require("sass");
const path = require("path");
const sharp = require("sharp");

obGlobal = {
  obErori: null,
  obImagini: null,
  folderBackup: path.join(__dirname, "backup"),
  folderScss: path.join(__dirname, "resurse/scss"),
  folderCss: path.join(__dirname, "resurse/css"),
};

app = express();

console.log("Folder proiect: " + __dirname);
console.log("Cale fisier: " + __filename);
console.log("Folder curent: " + process.cwd());

foldere = ["temp", "backup"];

foldere.forEach((folder) => {
  // let cale = __dirname + "/" + folder;
  let cale = path.join(__dirname, folder);
  if (!fs.existsSync(cale)) {
    fs.mkdirSync(cale);
  }
});

app.set("view engine", "ejs");

app.use("/resurse", express.static(path.join(__dirname, "resurse")));

app.use(/^\/resurse(\/[a-zA-Z0-9]*(?!\.)[a-zA-Z0-9]*)*$/, (req, res) => {
  afisEroare(res, "403");
});

app.get(/\.ejs$/, (req, res) => {
  afisEroare(res, "400");
});

app.get("/favicon.ico", (req, res) => {
  res.sendFile("favicon.ico", { root: __dirname + "/resurse/ico" });
});

app.get(["/", "/index", "/home"], (req, res) => {
  res.render("pagini/index", {
    ip: req.ip,
    imagini: obGlobal.obImagini.imagini,
  });
});

app.get("/galerie", (req, res) => {
  res.render("pagini/galerie", {
    imagini: obGlobal.obImagini.imagini,
  });
});

app.get("*/galerie-animata.css", function (req, res) {
  var sirScss = fs
    .readFileSync(__dirname + "/resurse/scss_ejs/galerie_animata.scss")
    .toString("utf8");
  var culori = ["navy", "black", "purple", "grey"];
  var indiceAleator = Math.floor(Math.random() * culori.length);
  var culoareAleatoare = culori[indiceAleator];
  rezScss = ejs.render(sirScss, { culoare: culoareAleatoare });
  console.log(rezScss);
  var caleScss = __dirname + "/temp/galerie_animata.scss";
  fs.writeFileSync(caleScss, rezScss);
  try {
    rezCompilare = sass.compile(caleScss, { sourceMap: true });

    var caleCss = __dirname + "/temp/galerie_animata.css";
    fs.writeFileSync(caleCss, rezCompilare.css);
    res.setHeader("Content-Type", "text/css");
    res.sendFile(caleCss);
  } catch (err) {
    console.log(err);
    res.send("Eroare");
  }
});

app.get("*/galerie-animata.css.map", function (req, res) {
  res.sendFile(path.join(__dirname, "temp/galerie-animata.css.map"));
});

app.get("/*", (req, res) => {
  try {
    res.render("pagini" + req.url, (err, html) => {
      console.log(err);
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

function initImagini() {
  var continut = fs
    .readFileSync(path.join(__dirname, "resurse/json/galerie.json"))
    .toString("utf-8");
  obGlobal.obImagini = JSON.parse(continut);
  let caleAbs = path.join(__dirname, obGlobal.obImagini.cale_galerie);
  let caleAbsMediu = path.join(caleAbs, "mediu");
  let caleAbsMic = path.join(caleAbs, "mic");

  if (!fs.existsSync(caleAbsMediu)) {
    fs.mkdirSync(caleAbsMediu);
  }
  if (!fs.existsSync(caleAbsMic)) {
    fs.mkdirSync(caleAbsMic);
  }

  obGlobal.obImagini.imagini.forEach((imagine) => {
    [numeFis, ext] = imagine.fisier.split(".");
    imagine.fisier_mediu =
      "/" +
      path.join(obGlobal.obImagini.cale_galerie, "mediu", numeFis + ".webp");
    imagine.fisier_mic =
      "/" +
      path.join(obGlobal.obImagini.cale_galerie, "mic", numeFis + ".webp");

    sharp(path.join(caleAbs, imagine.fisier))
      .resize(400)
      .toFile(path.join(__dirname, imagine.fisier_mediu));
    sharp(path.join(caleAbs, imagine.fisier))
      .resize(200)
      .toFile(path.join(__dirname, imagine.fisier_mic));

    imagine.fisier =
      "/" + path.join(obGlobal.obImagini.cale_galerie, imagine.fisier);
  });
}

initImagini();

function initErori() {
  var continut = fs
    .readFileSync(path.join(__dirname, "resurse/json/erori.json"))
    .toString("utf-8");
  obGlobal.obErori = JSON.parse(continut);
  obGlobal.obErori.info_erori.forEach((eroare) => {
    eroare.imagine =
      "/" + path.join(obGlobal.obErori.cale_baza, eroare.imagine);
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

  if (eroare) {
    let titlu1 = _titlu == "titlu default" ? eroare.titlu || _titlu : _titlu;
    let text1 = _text || eroare.text;
    let imagine1 = _imagine || eroare.imagine;

    if (eroare.status) res.status(eroare.identificator);
    console.log(titlu1, text1, imagine1);
    res.render("pagini/eroare", {
      titlu: titlu1,
      text: text1,
      imagine: imagine1,
    });
  } else {
    res.render("pagini/eroare", obGlobal.eroare_default);
  }
}

function compileazaScss(caleScss, caleCss) {
  if (!caleCss) {
    let vectorCale = caleScss.split("\\");
    let numeFisExt = vectorCale[vectorCale.length - 1];

    let numeFis = numeFisExt.split(".")[0];
    caleCss = numeFis + ".css";
  }

  if (!path.isAbsolute(caleScss)) {
    caleScss = path.join(obGlobal.folderScss, caleScss);
  }
  if (!path.isAbsolute(caleCss)) {
    caleCss = path.join(obGlobal.folderCss, caleCss);
  }

  let vectorCale = caleCss.split("\\");
  let numeFisCss = vectorCale[vectorCale.length - 1];
  if (fs.existsSync(caleCss)) {
    fs.copyFileSync(caleCss, path.join(obGlobal.folderBackup, numeFisCss));
  }

  rez = sass.compile(caleScss, { sourceMap: true });
  fs.writeFileSync(caleCss, rez.css);
}

fs.watch(obGlobal.folderScss, (eveniment, fisier) => {
  if (eveniment == "change" || eveniment == "rename") {
    let caleCompleta = path.join(obGlobal.folderScss, fisier);
    if (fs.existsSync(caleCompleta)) {
      compileazaScss(caleCompleta);
    }
  }
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
