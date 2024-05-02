// модальное окно

const modalBtn = $('.btn');
const modalClose = $('.form-block__close');
const modalOverlay = $('.form-block');
const modalWrapper = $('.form-block__container');
const modalForm = $('.form__fieldset');
const body = $('body');
const originalModalForm = modalForm.html();

modalBtn.on('click', function() {
    modalOverlay.show(400);
    body.addClass('no-scroll');
});

modalClose.on('click', function() {
    modalOverlay.hide(400);
    body.removeClass('no-scroll');
    modalForm.html(originalModalForm);
});

modalOverlay.on('click', function(event) {
	if ($(event.target).closest(modalWrapper).length === 0) {
		$(this).fadeOut();
        body.removeClass('no-scroll');
        modalForm.html(originalModalForm);
	}
});

 // бургер-меню

const burgerMenu = $('.header__menu-btn');
const menuList = $('.menu__wrapper');
const link = $('.menu__link');

function openMenu() {
    burgerMenu.addClass('active');
    menuList.addClass('active');
    body.addClass('lock');
}

function closeMenu() {
    burgerMenu.removeClass('active');
    menuList.removeClass('active');
    body.removeClass('lock');
}

$(document).on('mousedown', function(event) {
    if (!$(event.target).closest('.menu__wrapper').length && !$(event.target).is(burgerMenu)) {
        closeMenu();
    }
});

burgerMenu.on('click', function() {
    const open = burgerMenu.hasClass('active');

    if (open) {
        closeMenu()
    } else {
        openMenu()
    }
});

link.on('click', function() {
    closeMenu()
});



// const navigation = $('.menu__wrapper');
// const navigationClose = $('.header__menu-btn');
// const presentBtn = $('.btn');
// const modalOrder = $('.form-block')
// const modalOrderClose = $('.form-block__close');

// //!--inert 

// let prevActiveElement;


// function addInnert(elem) {
//     prevActiveElement = document.activeElement;
//     for (let i = 0; i < document.body.children.length; i++) {
//         if (document.body.children[i] !== elem) {
//             document.body.children[i].inert = true;
//         }
//     };
//     elem.inert = false;
//     if (elem.closest('[inert]')) elem.closest('[inert]').inert = false;

//     for (let i = 0; i < window.elemsInert.length; i++) {
//         if (elem === window.elemsInert[i].elem && window.elemsInert[i].esc) {
//             function esc(e) {
//                 if (e.key == 'Escape') {
//                     window.elemsInert[i].esc()
//                 }
//                 document.removeEventListener('keydown', esc);
//             }
//             document.addEventListener('keydown', esc);
//         }

//     }
// }

// function activationInnert(elemsInert) {
//     window.elemsInert = elemsInert;

//     function removeInnert(elem) {
//         if (elem) {
//             for (let i = 0; i < document.body.children.length; i++) {
//                 if (document.body.children[i] !== elem) {
//                     document.body.children[i].inert = false;
//                 }
//             };
//             elem.innert = true;
//             prevActiveElement.focus();
//         }

//         for (let i = 0; i < elemsInert.length; i++) {
//             if (window.screen.width <= elemsInert[i].breakpoints || !elemsInert[i].breakpoints) {
//                 elemsInert[i].elem.inert = true
//                 console.log(elemsInert[i]);
//             }
//         }
//     }
//     removeInnert();

//     return removeInnert
// }

// //!--end-innert

// const removeInnert = activationInnert([
//     {
//         elem: modalOrder.get(0),
//         esc: closeModal
//     },
//     {
//         elem: navigation.get(0),
//         esc: closeBurger,
//     }
// ]);


// function openBurger() {
//     navigation.addClass('navigation_open').animate({
//         left: 0,
//     }, 500, function () {
//         addInnert(navigation.get(0));//!--активируем inert на navigation
//         navigationClose.animate({
//             opacity: 1,
//         }, 300);
//     });
// }

// function closeBurger() {
//     navigationClose.animate({
//         opacity: 0,
//     }, 300, function () {
//         removeInnert(navigation.get(0))//!--Деактивируем inert 
//         navigation.animate({
//             left: '-400px',
//         }, 500).removeClass('navigation_open');
//     });
// }

// headerBurger.on('click', openBurger)

// navigationClose.on('click', closeBurger);

// function openModal() {
//     modalOrder.show(300);
//     addInnert(modalOrder.get(0));//!--активируем inert на modalOrder
// }

// function closeModal() {
//     modalOrder.hide(300);
//     removeInnert(modalOrder.get(0))//!--Деактивируем inert 
// }

// presentBtn.on('click', openModal)

// modalOrderClose.on('click', closeModal)

