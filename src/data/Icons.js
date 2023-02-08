import { library } from '@fortawesome/fontawesome-svg-core';
import { faApple, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEye, faEyeSlash, faHandshake, faHeart } from '@fortawesome/free-regular-svg-icons';
import { faArrowLeftLong, faArrowRightArrowLeft, faArrowTrendUp, faBagShopping, faBarcode, faBars, faBasketShopping, faBellConcierge, faBowlFood, faBurger, faCalculator, faCalendarDays, faChevronDown, faChevronLeft, faChevronRight, faClipboard, faCommentsDollar, faDollarSign, faDumbbell, faEllipsis, faEnvelope, faFileInvoice, faFileInvoiceDollar, faGamepad, faGift, faHandHoldingDollar, faHospital, faHouse, faLandmark, faLaptop, faMoneyBills, faMoneyBillTransfer, faMoneyBillTrendUp, faMoneyCheckDollar, faPencil, faPlus, faShirt, faTaxi, faTicket, faTrash, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';

library.add( 
  faBagShopping, faEllipsis, faBars, faPlus, faChevronRight, faDollarSign, faCalendarDays,
  faArrowLeftLong, faCalculator, faBowlFood, faTaxi, faBurger, faShirt, faDumbbell, 
  faHeart, faFileInvoice, faFileInvoiceDollar, faGift, faLaptop, faPencil, faEye,
  faEyeSlash, faArrowTrendUp, faArrowRightArrowLeft, faMoneyBillTrendUp, faMoneyBillTransfer,
  faHandHoldingDollar, faLandmark, faMoneyBills, faMoneyCheckDollar, faCommentsDollar,
  faHospital, faHouse, faUser, faEnvelope, faClipboard, faBarcode, faChevronDown, faTrash,
  faBellConcierge, faTicket, faHandshake, faGamepad, faUsers, faBasketShopping, faGoogle,
  faApple, faChevronLeft
);

const ICONS = [

  "fa-solid fa-house",
  "fa-solid fa-user",
  "fa-solid fa-envelope",
  "fa-solid fa-clipboard",
  "fa-solid fa-barcode",
  "fa-solid fa-burger",
  "fa-solid fa-ticket",
  "fa-regular fa-handshake",
  "fa-soid fa-users",
  "fa-solid fa-bowl-food",
  "fa-solid fa-bag-shopping",

  //#region default icons
  "fa-solid fa-basket-shopping",
  "fa-solid fa-taxi",
  "fa-solid fa-bell-concierge",
  "fa-solid fa-shirt",
  "fa-solid fa-dumbbell",
  "fa-regular fa-heart",
  "fa-solid fa-file-invoice",
  "fa-solid fa-file-invoice-dollar",
  "fa-solid fa-laptop",
  'fa-solid fa-gift',
  "fa-solid fa-hand-holding-dollar",
  "fa-solid fa-comments-dollar",
  "fa-solid fa-money-bill-transfer",
  "fa-solid fa-landmark",
  "fa-solid fa-money-bill-trend-up",
  "fa-solid fa-arrow-trend-up",
  "fa-solid fa-money-check-dollar",
  "fa-solid fa-money-bills",
  "fa-solid fa-hospital",
  "fa-solid fa-dollar",
  "fa-solid fa-gamepad",
  //#endregion
]

export default ICONS;