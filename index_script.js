const toggleBtn = document.querySelector('.toggle')
const toggleBtnIcon = document.querySelector('.toggle i')
const dropdownMenu = document.querySelector('.dropdown-menu')

toggleBtn.onclick = function () {
    dropdownMenu.classList.toggle('open')
    const isOpen = dropdownMenu.classList.contains('open')

    toggleBtnIcon.classList = isOpen
        ? 'fa-solid fa-xmark'
        : 'fa-solid fa-bars'
}