window.onload = function () {
  carouselItems = document.getElementsByClassName('carousel-item')

  setInterval(function () {
    items = document.getElementsByClassName('carusel-ob')
    console.log(produse)

    let produseRandom = []
    let nrProduse = 5
    let nrProduseTotal = produse.length
    let nr = 0
    while (nr < nrProduse) {
      let random = Math.floor(Math.random() * nrProduseTotal)
      if (!produseRandom.includes(produse[random])) {
        produseRandom.push(produse[random])
        nr++
      }
    }
    console.log(produseRandom)
    for (let i = 0; i < items.length; i++) {
      items[i].getElementsByClassName('carusel-img')[0].src = produseRandom[i].poza
      items[i].getElementsByClassName('carusel-nume')[0].innerHTML = produseRandom[i].nume
      items[i].getElementsByClassName('carusel-descriere')[0].innerHTML = produseRandom[i].descriere
    }
  }, 5000)
}
