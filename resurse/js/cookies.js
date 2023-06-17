//setCookie("a",10, 1000)
function setCookie(nume, val, timpExpirare) {
  //timpExpirare in milisecunde
  let d = new Date()
  d.setTime(d.getTime() + timpExpirare)
  document.cookie = `${nume}=${val}; expires=${d.toUTCString()}`
}

function getCookie(nume) {
  let vectorParametri = document.cookie.split(';') // ["a=10","b=ceva"]
  for (let param of vectorParametri) {
    if (param.trim().startsWith(nume + '=')) return param.split('=')[1]
  }
  return null
}

function deleteCookie(nume) {
  console.log(`${nume}; expires=${new Date().toUTCString()}`)
  document.cookie = `${nume}=0; expires=${new Date().toUTCString()}`
}

window.addEventListener('load', function () {
  if (getCookie('acceptat_banner')) {
    document.getElementById('banner-cookies').setAttribute('style', 'display: none !important;')
  }

  this.document.getElementById('ok-cookies').onclick = function () {
    setCookie('acceptat_banner', true, 5000)
    document.getElementById('banner-cookies').setAttribute('style', 'display: none !important;')
  }
})

export { setCookie, getCookie, deleteCookie }
