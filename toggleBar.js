// Meniu Toggle Bar
const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.nav-meniu');

menu.addEventListener('click', function() {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
})