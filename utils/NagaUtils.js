import moment from "moment";
import auth from "@react-native-firebase/auth"

String.prototype.capitalize = function() {
  if (this.length === 0) return this;
  else if (this.length === 1) return this.toUpperCase();
  else return this[0].toUpperCase() + this.substring(1, this.length);
}

export function groupTransactionsByCategory(transactions) {
  return transactions.reduce((acc, t) => {
    (acc[t.categoryID] = acc[t.categoryID] || []).push(t);

    return acc;
  }, {});
}

export function groupTransactionsByTime(transactions, timeFrame) {
  return transactions.reduce((acc, t) => {

    let date; 
    
    if (timeFrame === "week") {
      date = moment(t.date).startOf("isoWeek").toDate();
    } else {
      date = moment(t.date).startOf(timeFrame).toDate();
    }

    (acc[date.getTime()] = acc[date.getTime()] || []).push(t);

    return acc;

  } , {})?? {};
}

export function groupTransactionsByTimeToGraphArr(transactions, timeFrame, rangeInUnitsOfTimeFrame) {
  transactions = [...transactions];

  let minDate = 
    moment()
      .startOf(timeFrame === "week"? "isoWeek" : timeFrame)
      .subtract(rangeInUnitsOfTimeFrame - 1, timeFrame)
      .toDate();

  let filtered = transactions.filter(t => t.date >= minDate.getTime() && t.date <= Date.now());

  let groupedByTime = groupTransactionsByTime(filtered, timeFrame); 

  let res = Object.keys(groupedByTime).map(key => ({
    x: parseInt(key),
    y: groupedByTime[key].reduce((acc, t) => acc + t.amount, 0)
  }));

  for(let i = 0; i < rangeInUnitsOfTimeFrame; i++) {
    let unix = 
      moment()
        .startOf(timeFrame === "week"? "isoWeek" : timeFrame)
        .subtract(i, timeFrame)
        .unix() * 1000;

    let hasDate = false;

    res.forEach(obj => {
      if (obj.x === unix)
        hasDate = true;
    })

    if (!hasDate) {
      res.push({ x: unix, y: 0});
    }
  }

  return res;
}

export function getExpenseGroupsArr(groupedTransactions) {
  let expenseGroupsArr = Object.values(groupedTransactions).sort((a, b) => {
    //Sum of a's transactions > sum of b's transactions
    return -a.reduce((acc, t) => acc + t.amount, 0) + b.reduce((acc, t) => acc + t.amount, 0);
  });

  let categoryAmounts = {};

  let totalAmount = expenseGroupsArr.reduce((acc, categoryGroup) => {
    let categoryAmount = categoryGroup.reduce((acc, t) => acc + t.amount, 0);
    categoryAmounts[categoryGroup[0].categoryID] = categoryAmount;
    return acc + categoryAmount
  }, 0);

  //Right now is an array of array of transactions
  expenseGroupsArr = expenseGroupsArr.map(categoryGroup => {
    return {
      categoryID: categoryGroup[0].categoryID,
      amount: categoryAmounts[categoryGroup[0].categoryID],
      numberOfTransactions: categoryGroup.length,
      percentageOfTotal: categoryAmounts[categoryGroup[0].categoryID] / totalAmount * 100
    }
  });

  return [expenseGroupsArr, totalAmount];
}

export function getDays(year, month) {
  return new Date(year, month, 0).getDate();
};

export function reauthenticate(currentPassword) {
  var user = auth().currentUser;
  var cred = auth.EmailAuthProvider.credential(user.email, currentPassword);
  return user.reauthenticateWithCredential(cred);
}

export function isSignedInWithPassword() {
  let providerData = auth().currentUser?.providerData

  if (providerData == undefined || providerData == null) {
    console.warn("Current user is null or undefined");
  }

  for (let data of providerData) {
    if (data.providerId === "password") {
      return true;
    }
  }

  return false;
}