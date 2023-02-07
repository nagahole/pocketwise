import chroma from "chroma-js";
import COLORS from "./Colors";

const DEFAULT_CATEGORIES = {

  //#region EXPENSES
  expense_bills: {
    color: COLORS.green, 
    icon: "fa-solid fa-file-invoice", 
    id: "expense_bills", 
    name: "bills", 
    type: "expenses"
  }, 
  expense_clothes: {
    color: COLORS.violet, 
    icon: "fa-solid fa-shirt", 
    id: "expense_clothes", 
    name: "Clothes", 
    type: "expenses"
  }, 
  'expense_eating out': {
    color: COLORS.orange, 
    icon: "fa-solid fa-bell-concierge", 
    id: "expense_eating out", 
    name: "Eating out", 
    type: "expenses"
  }, 
  expense_groceries: {
    color: COLORS.orange, 
    icon: "fa-solid fa-basket-shopping", 
    id: "expense_groceries", 
    name: "Groceries", 
    type: "expenses"
  }, 
  expense_gifts: {
    color: COLORS.turqoise, 
    icon: "fa-solid fa-gift", 
    id: "expense_gifts", 
    name: "Gifts", 
    type: "expenses"}, 
  expense_health: {
    color: COLORS.red,
    icon: "fa-regular fa-heart",
    id: "expense_health",
    name: "Health",
    type: "expenses"
  },
  expense_sport: {
    color: COLORS.green,
    icon: "fa-solid fa-dumbbell",
    id: "expense_sport",
    name: "Sport",
    type: "expenses"
  },
  expense_taxes: {
    color: COLORS.green,
    icon: "fa-solid fa-file-invoice-dollar",
    id: "expense_taxes",
    name: "Taxes",
    type: "expenses"
  },
  expense_tech: {
    color: COLORS.blue,
    icon: "fa-solid fa-laptop",
    id: "expense_tech",
    name: "Tech",
    type: "expenses"
  },
  expense_transport: {
    color: COLORS.lightBlue,
    icon: "fa-solid fa-taxi",
    id: "expense_transport",
    name: "Transport",
    type: "expenses"
  },
  expense_entertainment: {
    color: COLORS.violet,
    icon: "fa-solid fa-gamepad",
    id: "expense_entertainment",
    name: "Entertainment",
    type: "expenses"
  },
  //#endregion


  //Can't be bothered making look good

  //#region INCOMES
  "income_allowance": {
    "color": COLORS.green,
    "icon": "fa-solid fa-hand-holding-dollar",
    "id": "income_allowance",
    "name": "Allowance",
    "type": "incomes"
  },
  "income_commission": {
    "color": COLORS.green,
    "icon": "fa-solid fa-comments-dollar",
    "id": "income_commission",
    "name": "Commission",
    "type": "incomes"
  },
  "income_exchange": {
    "color": COLORS.green,
    "icon": "fa-solid fa-money-bill-transfer",
    "id": "income_exchange",
    "name": "Exchange",
    "type": "incomes"
  },
  "income_gifts": {
    "color": COLORS.green,
    "icon": "fa-solid fa-gift",
    "id": "income_gifts",
    "name": "Gifts",
    "type": "incomes"
  },
  "income_interest": {
    "color": COLORS.green,
    "icon": "fa-solid fa-money-bill-trend-up",
    "id": "income_interest",
    "name": "Interest",
    "type": "incomes"
  },
  "income_investment": {
    "color": COLORS.green,
    "icon": "fa-solid fa-arrow-trend-up",
    "id": "income_investment",
    "name": "Investment",
    "type": "incomes"
  },
  "income_salary": {
    "color": COLORS.green,
    "icon": "fa-solid fa-money-check-dollar",
    "id": "income_salary",
    "name": "Salary",
    "type": "incomes"
  },
  "income_wage": {
    "color": COLORS.green,
    "icon": "fa-solid fa-money-bills",
    "id": "income_wage",
    "name": "Wage",
    "type": "incomes"
  },
  "income_government payment": {
    "color": COLORS.green,
    "icon": "fa-solid fa-landmark",
    "id": "income_government payment",
    "name": "Government payment",
    "type": "incomes"
  },
  //#endregion

  //#region SAVINGS
  "saving_emergency": {
    "color": COLORS.green,
    "icon": "fa-solid fa-hospital",
    "id": "saving_emergency",
    "name": "Emergency",
    "type": "savings"
  },
  "saving_long term": {
    "color": COLORS.green,
    "icon": "fa-solid fa-arrow-trend-up",
    "id": "saving_long term",
    "name": "Long Term",
    "type": "savings"
  },
  "saving_short term": {
    "color": COLORS.green,
    "icon": "fa-solid fa-dollar",
    "id": "saving_short term",
    "name": "Short Term",
    "type": "savings"
  }
  //#endregion
}

export default DEFAULT_CATEGORIES;