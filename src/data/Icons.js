import { library } from '@fortawesome/fontawesome-svg-core';
import { faEye, faEyeSlash, faHeart } from '@fortawesome/free-regular-svg-icons';
import { faArrowLeftLong, faArrowRightArrowLeft, faArrowTrendUp, faBagShopping, faBarcode, faBars, faBowlFood, faBurger, faCalculator, faCalendarDays, faChevronDown, faChevronRight, faClipboard, faCommentsDollar, faDollarSign, faDumbbell, faEllipsis, faEnvelope, faFileInvoice, faFileInvoiceDollar, faGift, faHandHoldingDollar, faHospital, faHouse, faLandmark, faLaptop, faMoneyBills, faMoneyBillTransfer, faMoneyBillTrendUp, faMoneyCheckDollar, faPencil, faPlus, faShirt, faTaxi, faUser } from '@fortawesome/free-solid-svg-icons';

library.add( 
  faBagShopping, faEllipsis, faBars, faPlus, faChevronRight, faDollarSign, faCalendarDays,
  faArrowLeftLong, faCalculator, faBowlFood, faTaxi, faBurger, faShirt, faDumbbell, 
  faHeart, faFileInvoice, faFileInvoiceDollar, faGift, faLaptop, faPencil, faEye,
  faEyeSlash, faArrowTrendUp, faArrowRightArrowLeft, faMoneyBillTrendUp, faMoneyBillTransfer,
  faHandHoldingDollar, faLandmark, faMoneyBills, faMoneyCheckDollar, faCommentsDollar,
  faHospital, faHouse, faUser, faEnvelope, faClipboard, faBarcode, faChevronDown
);

const ICONS = [

  "fa-solid fa-house",
  "fa-solid fa-user",
  "fa-solid fa-envelope",
  "fa-solid fa-clipboard",
  "fa-solid fa-barcode",

  //#region default icons
  "fa-solid fa-bowl-food",
  "fa-solid fa-taxi",
  "fa-solid fa-burger",
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
  //#endregion
]

export default ICONS;