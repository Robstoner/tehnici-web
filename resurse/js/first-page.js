window.onload = function () {
  carouselItems = document.getElementsByClassName('carousel-item')

  // make only 5 items visible that change every 5 seconds

  let nr = 0
  setInterval(function () {
    for (let i = 0; i < carouselItems.length; i++) {
      carouselItems[i].style.display = 'none'
    }

    for (let i = 0; i < 5; i++) {
      carouselItems[nr].style.display = 'block'
      nr++
      if (nr == carouselItems.length) nr = 0
    }
  }, 15000)
}
