const express = require('express')
const fs = require('fs')
const sass = require('sass')
const path = require('path')
const sharp = require('sharp')
const { randomInt } = require('crypto')
const { Client } = require('pg')

var client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'magazin',
  user: 'rob',
  password: '1234',
})
client.connect()

obGlobal = {
  obErori: null,
  obImagini: null,
  categorii: new Set(),
  folderBackup: path.join(__dirname, 'backup'),
  folderScss: path.join(__dirname, 'resurse/scss'),
  folderCss: path.join(__dirname, 'resurse/css'),
  folderPozeProduse: path.join(__dirname, 'resurse/imagini/produse'),
}

app = express()

console.log('Folder proiect: ' + __dirname)
console.log('Cale fisier: ' + __filename)
console.log('Folder curent: ' + process.cwd())

foldere = ['temp', 'backup']

foldere.forEach((folder) => {
  // let cale = __dirname + "/" + folder;
  let cale = path.join(__dirname, folder)
  if (!fs.existsSync(cale)) {
    fs.mkdirSync(cale)
  }
})

app.set('view engine', 'ejs')

app.use('/resurse', express.static(path.join(__dirname, 'resurse')))

app.use(/^\/resurse(\/[a-zA-Z0-9]*(?!\.)[a-zA-Z0-9]*)*$/, (req, res) => {
  afisEroare(res, 403)
})

app.get(/\.ejs$/, (req, res) => {
  afisEroare(res, '400')
})

app.get('/favicon.ico', (req, res) => {
  res.sendFile('favicon.ico', { root: __dirname + '/resurse/ico' })
})

app.get(['/', '/index', '/home'], async (req, res) => {
  rez = await client.query('select * from produse')
  produse = rez.rows
  produse.forEach((produs) => {
    produs.poza = path.join('/resurse/imagini/produse', produs.poza)
  })

  res.render('pagini/index', {
    ip: req.ip,
    imagini: obGlobal.obImagini.imagini,
    categorii: obGlobal.categorii,
    produse: produse,
  })
})

app.get('/galerie', (req, res) => {
  let nrImagini = randomInt(5, 11)
  if (nrImagini % 2 == 0) nrImagini++

  let imgInv = [...obGlobal.obImagini.imagini].reverse()

  let fisScss = path.join(__dirname, 'resurse/scss/galerie-animata.scss')
  let liniiFisScss = fs.readFileSync(fisScss).toString().split('\n')

  let stringImg = '$nrImg: ' + nrImagini + ';'

  liniiFisScss.shift()
  liniiFisScss.unshift(stringImg)

  fs.writeFileSync(fisScss, liniiFisScss.join('\n'))

  res.render('pagini/galerie.ejs', {
    imagini: obGlobal.obImagini.imagini,
    nrImagini: nrImagini,
    imgInv: imgInv,
    categorii: obGlobal.categorii,
  })
})

app.get('/produse', async (req, res) => {
  let produse = []
  let subcategorii = new Set()

  if (req.query.categ) {
    let categ = req.query.categ
    rez = await client.query('select * from produse where categorie = $1', [categ])
    produse = rez.rows
  } else {
    rez = await client.query('select * from produse')
    produse = rez.rows
  }

  let min = 0,
    max = 10000,
    accesorii = new Set(),
    chei = [],
    nume = [],
    culori = new Set()

  rez = await client.query(
    'SELECT pg_type.typname AS enumtype, pg_enum.enumlabel AS enumlabel FROM pg_type JOIN pg_enum ON pg_enum.enumtypid = pg_type.oid;'
  )

  culori.add('Toate')
  rez.rows.forEach((c) => {
    if (c.enumtype == 'culori') culori.add(c.enumlabel)
  })

  produse.forEach((produs) => {
    produs.poza = '/resurse/imagini/produse' + produs.poza

    subcategorii.add(produs.subcategorie)
    nume.push(produs.nume)
    if (produs.accesorii)
      produs.accesorii.split(', ').forEach((acc) => {
        accesorii.add(acc)
      })
    if (produs.descriere)
      produs.descriere.split(' ').forEach((cuv) => {
        if (cuv.length > 3) chei.push(cuv)
      })
    if (produs.culoare) culori.add(produs.culoare)
    if (min > produs.pret) min = produs.pret
    if (max < produs.pret) max = produs.pret
  })

  res.render('pagini/produse', {
    categorii: obGlobal.categorii,
    produse: produse,
    subcategorii: subcategorii,
    accesorii: accesorii,
    chei: chei,
    min: min,
    max: max,
    nume: nume,
    culori: culori,
  })
})

app.get('/produse/:id', (req, res) => {
  let id = req.params.id
  let produs = null
  client.query('select * from produse where id = $1', [id], (err, rez) => {
    if (err) {
      afisEroare(res, '500')
    } else {
      if (rez.rows.length == 0) {
        afisEroare(res, '404')
      } else {
        produs = rez.rows[0]
        produs.poza = '/resurse/imagini/produse' + produs.poza
        res.render('pagini/produs', {
          categorii: obGlobal.categorii,
          produs: produs,
        })
      }
    }
  })
})

app.get('/*', (req, res) => {
  try {
    res.render('pagini' + req.url, { categorii: obGlobal.categorii }, (err, html) => {
      if (err) {
        if (err.message.includes('Failed to lookup view')) {
          afisEroare(res, '404')
        } else {
          afisEroare(res)
        }
      } else {
        res.send(html)
      }
    })
  } catch (err) {
    if (err.message.includes('Cannot find module')) {
      afisEroare(res, '404')
    }
  }
})

async function initCategorii() {
  let rezultat = await client.query('select * from produse')

  rezultat.rows.forEach((produs) => {
    produs.poza = '/resurse/imagini/produse' + produs.poza
    obGlobal.categorii.add(produs.categorie)
  })
}

initCategorii()

function initImagini() {
  var continut = fs.readFileSync(path.join(__dirname, 'resurse/json/galerie.json')).toString('utf-8')
  obGlobal.obImagini = JSON.parse(continut)
  let caleAbs = path.join(__dirname, obGlobal.obImagini.cale_galerie)
  let caleAbsMediu = path.join(caleAbs, 'mediu')
  let caleAbsMic = path.join(caleAbs, 'mic')

  if (!fs.existsSync(caleAbsMediu)) {
    fs.mkdirSync(caleAbsMediu)
  }
  if (!fs.existsSync(caleAbsMic)) {
    fs.mkdirSync(caleAbsMic)
  }

  obGlobal.obImagini.imagini.forEach((imagine) => {
    ;[numeFis, ext] = imagine.fisier.split('.')
    imagine.fisier_mediu = '/' + path.join(obGlobal.obImagini.cale_galerie, 'mediu', numeFis + '.webp')
    imagine.fisier_mic = '/' + path.join(obGlobal.obImagini.cale_galerie, 'mic', numeFis + '.webp')

    sharp(path.join(caleAbs, imagine.fisier)).resize(400).toFile(path.join(__dirname, imagine.fisier_mediu))
    sharp(path.join(caleAbs, imagine.fisier)).resize(200).toFile(path.join(__dirname, imagine.fisier_mic))

    imagine.fisier = '/' + path.join(obGlobal.obImagini.cale_galerie, imagine.fisier)
  })
}

initImagini()

function initErori() {
  var continut = fs.readFileSync(path.join(__dirname, 'resurse/json/erori.json')).toString('utf-8')

  obGlobal.obErori = JSON.parse(continut)

  obGlobal.obErori.info_erori.forEach((eroare) => {
    eroare.imagine = '/' + path.join(obGlobal.obErori.cale_baza, eroare.imagine)
  })
}

initErori()

function afisEroare(res, _identificator, _titlu = 'titlu default', _text, _imagine) {
  let vErori = obGlobal.obErori.info_erori
  let eroare = vErori.find((eroare) => eroare.identificator == _identificator)

  if (eroare) {
    let titlu1 = _titlu == 'titlu default' ? eroare.titlu || _titlu : _titlu
    let text1 = _text || eroare.text
    let imagine1 = _imagine || eroare.imagine

    if (eroare.status) res.status(eroare.identificator)

    res.render('pagini/eroare', {
      titlu: titlu1,
      text: text1,
      imagine: imagine1,
      categorii: obGlobal.categorii,
    })
  } else {
    res.render('pagini/eroare', obGlobal.eroare_default)
  }
}

function compileazaScss(caleScss, caleCss) {
  if (!caleCss) {
    let numeFisExt = path.basename(caleScss)

    let numeFis = numeFisExt.split('.')[0]
    caleCss = numeFis + '.css'
  }

  if (!path.isAbsolute(caleScss)) {
    caleScss = path.join(obGlobal.folderScss, caleScss)
  }
  if (!path.isAbsolute(caleCss)) {
    caleCss = path.join(obGlobal.folderCss, caleCss)
  }

  let caleBackup = path.join(obGlobal.folderBackup, 'resurse/css')
  if (!fs.existsSync(caleBackup)) {
    fs.mkdirSync(caleBackup, { recursive: true })
  }

  let numeFisCss = path.basename(caleCss).split('.')[0]
  if (fs.existsSync(caleCss)) {
    fs.copyFileSync(caleCss, path.join(caleBackup, numeFisCss + '_' + new Date().getTime() + '.css'))
  }

  rez = sass.compile(caleScss, { sourceMap: true })
  fs.writeFileSync(caleCss, rez.css)
}

function compileazaToateScss() {
  let vScss = fs.readdirSync(obGlobal.folderScss)
  vScss.forEach((numeFis) => {
    let caleScss = path.join(obGlobal.folderScss, numeFis)
    compileazaScss(caleScss)
  })
}

// compileazaToateScss()

fs.watch(obGlobal.folderScss, (eveniment, fisier) => {
  if (eveniment == 'change' || eveniment == 'rename') {
    let caleCompleta = path.join(obGlobal.folderScss, fisier)
    if (fs.existsSync(caleCompleta)) {
      compileazaScss(caleCompleta)
    }
  }
})

app.listen(3000, () => {
  console.log('Server started on port 3000')
})
