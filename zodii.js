var zodiacSigns = document.querySelectorAll('.zodie');
var zodiacSelectate = 0;
var buton1 = document.getElementById('submitZodiac');
var buton2 = document.getElementById('reload');

var mesaj = document.querySelector('.mesaj');

var zodie1 = -1;
var zodie2 = -1;

zodiacSigns.forEach((user, index) => {
    user.addEventListener('click', event => {
        if(zodiacSelectate < 2) {
        zodiacSigns[index].classList.add("zodieActiva");
        zodiacSelectate++;
        if(zodie1 == -1) {
            zodie1 = index;
        }
        else {
            zodie2 = index;
            console.log(zodiacSigns[zodie1], zodiacSigns[zodie2]);
            mesaj.innerText = "Ati selectat zodia " + zodiacSigns[zodie1].querySelector('.clasa').innerText + " si " + zodiacSigns[zodie2].querySelector('.clasa').innerText;
            buton1.style.visibility = "visible";
            buton2.style.visibility = "visible";
        }
        }
        else
            window.alert("**** ****");
    })  
  })

buton1.addEventListener('click', () => {
    window.alert("**** ** ***** *****");
});

buton2.addEventListener('click', () => {
    location.reload();
});
