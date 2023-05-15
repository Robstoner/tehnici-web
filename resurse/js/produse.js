window.onload = function () {
  if (document.getElementById('search-switch').checked)
    document.getElementById('search-produse').style.display = 'block'

  document.getElementById('search-switch').onchange = function () {
    if (!this.checked) document.getElementById('search-produse').style.display = 'none'
    else document.getElementById('search-produse').style.display = 'block'
  }

  document.getElementById('valoare-pret').value = document.getElementById('inpPret').value

  document.getElementById('inpPret').onchange = function () {
    document.getElementById('valoare-pret').value = this.value
  }

  document.getElementById('valoare-pret').onchange = function () {
    document.getElementById('inpPret').value = this.value
  }

  function filtreaza() {
    let produse = document.getElementsByClassName('produs')

    let inpNume = document.getElementById('inpNume').value
    let inpCheie = document.getElementById('inpCheie').value
    let inpPret = document.getElementById('inpPret').value
    let inpSubcategorie = document.getElementById('inpSubcategorie').value
    let inpNoutati = document.getElementById('inpNoutati').checked
    let Accesorii = document.getElementById('inpAccesorii').selectedOptions
    let inpAccesorii = Array.from(Accesorii).map((opt) => opt.value)
    let inpCuloare = document.querySelector('input[name="culoare"]:checked').value

    for (let produs of produse) {
      let ok = 1
      produs.style.display = 'none'

      let nume = produs.getElementsByClassName('nume')[0].innerHTML
      let descriere = produs.getElementsByClassName('descriere')[0].innerHTML
      let pret = produs.getElementsByClassName('pret')[0].innerHTML
      let subcategorie = produs.getElementsByClassName('subcategorie')[0].innerHTML
      let dataLansare = produs.getElementsByClassName('dataLansare')[0].innerHTML
      let accesorii = produs.getElementsByClassName('accesorii')[0].innerHTML
      let culoare = produs.getElementsByClassName('culoare')[0].innerHTML
      let accesoriiList = accesorii.split(', ')

      if (inpCuloare != 'Toate' && culoare != inpCuloare) continue
      if (inpNume != '' && !nume.includes(inpNume)) continue
      if (inpCheie != '' && !descriere.includes(inpCheie)) continue
      if (inpPret != 0 && Number(pret) > Number(inpPret)) continue
      if (inpSubcategorie != 'toate' && subcategorie != inpSubcategorie) continue
      if (inpNoutati && Date.parse(dataLansare) < Date.parse('2020-01-01')) continue
      if (inpAccesorii.length > 0)
        for (let j = 0; j < inpAccesorii.length; j++) if (!accesoriiList.includes(inpAccesorii[j])) ok = 0

      if (ok) produs.style.display = 'block'
    }
  }

  document.getElementById('filtreaza').onclick = function () {
    filtreaza()
  }

  let radios = document.querySelectorAll('input[name="culoare"]')

  radios.forEach((radio) => {
    radio.addEventListener('change', function () {
      filtreaza()
    })
  })

  document.getElementById('inpNume').onchange = function () {
    filtreaza()
  }

  document.getElementById('inpCheie').onchange = function () {
    filtreaza()
  }

  document.getElementById('inpPret').onchange = function () {
    filtreaza()
  }

  document.getElementById('inpSubcategorie').onchange = function () {
    filtreaza()
  }

  document.getElementById('inpAccesorii').onchange = function () {
    filtreaza()
  }

  document.getElementById('buton-inpNoutati').onclick = function () {
    document.getElementById('inpNoutati').checked = !document.getElementById('inpNoutati').checked

    filtreaza()
  }

  document.getElementById('reseteaza').onclick = function () {
    document.getElementById('inpNume').value = ''
    document.getElementById('inpCheie').value = ''
    document.getElementById('inpPret').value = 0
    document.getElementById('inpSubcategorie').value = 'toate'
    document.getElementById('inpNoutati').checked = false
    document.getElementById('inpAccesorii').value = ''

    document.getElementById('valoare-pret').value = 0

    let produse = document.getElementsByClassName('produs')
    for (let produs of produse) produs.style.display = 'block'
  }

  document.getElementById('calculeaza').onclick = function () {
    let produse = document.getElementsByClassName('produs')
    let total = 0
    let nr = 0

    for (let produs of produse) {
      if (produs.style.display == 'none') continue

      let pret = produs.getElementsByClassName('pret')[0].innerHTML
      total += parseInt(pret)
      nr++
    }

    let medie = total / nr

    let div = document.createElement('div')
    div.id = 'calcul'
    div.innerHTML = 'Total: ' + total + '<br>Medie: ' + medie
    div.style.display = 'block'
    document.body.appendChild(div)
    setTimeout(() => {
      document.getElementById('calcul').style.display = 'none'
    }, 5000)
  }

  document.getElementById('sorteazaCresc').onclick = function () {
    let produse = document.getElementsByClassName('produs')

    let produseList = Array.from(produse)
    produseList.sort((a, b) => {
      let pretA = parseInt(a.getElementsByClassName('pret')[0].innerHTML)
      let pretB = parseInt(b.getElementsByClassName('pret')[0].innerHTML)

      let numeA = a.getElementsByClassName('nume')[0].innerHTML
      let numeB = b.getElementsByClassName('nume')[0].innerHTML

      if (numeA == numeB) return pretA - pretB
      else return numeA.localeCompare(numeB)
    })

    for (let prod of produseList) {
      prod.parentElement.appendChild(prod)
    }
  }

  document.getElementById('sorteazaDescresc').onclick = function () {
    let produse = document.getElementsByClassName('produs')

    let produseList = Array.from(produse)
    produseList.sort((a, b) => {
      let pretA = parseInt(a.getElementsByClassName('pret')[0].innerHTML)
      let pretB = parseInt(b.getElementsByClassName('pret')[0].innerHTML)

      let numeA = a.getElementsByClassName('nume')[0].innerHTML
      let numeB = b.getElementsByClassName('nume')[0].innerHTML

      if (numeA == numeB) return pretB - pretA
      else return numeB.localeCompare(numeA)
    })

    for (let prod of produseList) {
      prod.parentElement.appendChild(prod)
    }
  }
}
