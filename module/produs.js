class Produs {
  constructor({
    id,
    nume,
    descriere,
    poza,
    categorie,
    subcategorie,
    pret,
    dimensiuni,
    dataLansare,
    accesorii,
    culoare,
    fragil,
  } = {}) {
    for (let prop in arguments[0]) {
      this[prop] = arguments[0][prop]
    }
  }
}
