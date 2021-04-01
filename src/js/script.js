"use strict";

//This methods divide tausends hundreds milions... return string

Number.prototype.toDivide = function () {
    let num = String(this.toFixed(2));
    let rest = num.slice(num.length - 3, num.length);
    num = String(Math.trunc(num)).split("").reverse();
    if (num.length >= 5) {
        let result = [];
        num.forEach((el, index) => {
            if (result.length % 3 == 0 && result.length != 0) {
                result.unshift(num[index] + " ");
            }
            else result.unshift(num[index]);
        });
        return result.join("") + rest;
    }
    else return String(this.toFixed(2));;
}


//Functions for select element/elements

function selectElement(el) {
    return document.querySelector(el);
}

function selectElements(el) {
    return document.querySelectorAll(el);
}

//Scroll to main table after count click
selectElement("#count-deposite").addEventListener("click", () => {
    setTimeout(() => {
        selectElement("#global-tabel").scrollIntoView({ behavior: "smooth" });
    }, 200);
});

selectElement("#count-deposite").addEventListener("click", () => {
    //Data to count deposite
    let currency = selectElement("#currency").value;
    let amount = +selectElement("#deposit-amount").value;
    let annualRate = +selectElement("#annual-rate").value;
    let depositDate = selectElement("#deposit-date").value;
    let term = selectElement("#deposit-term").value;

    let regRep = selectElement("#regular-replenishment").value;
    let regAmount = +selectElement("#regular-amount").value;
    let capTime = selectElement("#capitalization-time").value;

    //If data is failed break function
    if (!checkError(amount, annualRate, depositDate, term)) {
        return false;
    }
    showTables();

    //Array with main counting variables 
    let count = new Count(amount);

    //Arrays to count all days, procent money and extra money
    let secondCount = new SecondCount();

    //Count a difference between start and end date in days
    let startDate = new Date(depositDate);
    let endDate = new Date(term);
    let difference = daysDifference(startDate, endDate);

    vanishTable();

    //Cycle to create a result tabel
    for (let i = 0; i < difference; i++) {

        /* Increase a date, create next date and previous 
        date to check if months is different*/
        startDate.setDate(startDate.getDate() + 1);
        let prevDate = new Date(startDate);
        prevDate.setDate(prevDate.getDate() - 1);

        let countProcent = (count.betaMoney * annualRate * 1) / (365 * 100);

        count.endResult += countProcent;
        count.monthResult += countProcent;
        count.countDay++;

        //Check if this is a new year and our capital is every year
        if (count.countMonth % 12 == 0 && count.countMonth != 0 && capTime == "3") {
            count.betaMoney = count.endResult;
        }

        //Check if this month != prev month and create tabel column
        if (startDate.getMonth() != prevDate.getMonth() || i == difference - 1) {
            let extraMoney = 0;
            //Check if regular rep is every year or month
            if (count.countMonth % 12 == 0 && count.countMonth != 0 && regRep == "3" || regRep == "2") {
                count.endResult += regAmount;
                extraMoney = regAmount;
                secondCount.extraMoney.push(extraMoney);
            }
            //Check if capitalisation is every month
            if (capTime == "2") count.betaMoney = count.endResult;

            count.countMonth++;

            //Create column
            let column = new Column(count.countMonth, startDate.format("dd-mm-yyyy"), count.countDay,
                count.endResult, extraMoney, currency, count.monthResult);
            column.toTable();

            secondCount.day.push(count.countDay);
            secondCount.procent.push(count.monthResult);
            count.monthResult = 0;
            count.countDay = 0;
        }
    }
    finallyTable(secondCount, currency, amount, count.endResult);
});

function checkError(amount, rate, date, term) {
    const depositError = selectElements(".deposit-error");

    //Hide error text
    for (let erElement of depositError) {
        erElement.classList.remove("active");
    }

    //Check if input value is wrong
    let check = 1;
    if (amount == "" || amount < 0) {
        depositError[0].classList.add("active");
        check = 0;
    }
    if (rate == "" || rate < 0 || rate > 100) {
        depositError[1].classList.add("active");
        check = 0;
    }
    if (date == "") {
        depositError[2].classList.add("active");
        check = 0;
    }
    if (term == "") {
        depositError[3].classList.add("active");
        check = 0;
    }

    if (!check) { return false; }
    else { return true; }
}

function showTables() {
    const finallyContainer = selectElement(".finally-results-container");
    const globalTabel = selectElement("#global-tabel");
    globalTabel.classList.add("active");
    finallyContainer.classList.add("active");
}

function vanishTable() {
    const tabelElements = selectElements(".count-result");
    for (let element of tabelElements) element.remove();
}

function daysDifference(start, end) {
    return Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 3600 * 24));
}

//Function to fill finally result tables

function finallyTable(countArr, currency, amount, endResult) {
    //Finally result containers

    const finallySum = selectElement("#finally-sum");
    const finallyProcent = selectElement("#finnaly-procent");
    const finallyResult = selectElement("#finally-result");
    const finallyCurrency = selectElement("#finally-currency");


    let allDays = 0;
    let allProcent = 0;
    let allExtraMoney = 0;

    countArr.day.map(el => allDays += el);
    countArr.procent.map(el => allProcent += el);
    countArr.extraMoney.map(el => allExtraMoney += el);

    //Create finally column
    let column = new Column("", "Razem", allDays, endResult,
        allExtraMoney, currency, allProcent);
    column.toTable();

    let finallyCurContent = (currency == "zł") ? "Złotych" : (currency == "$") ? "Dolarów" :
        (currency == "€") ? "Euro" : (currency == "₴") ? "Gryweń" : (currency == "₽") ? "Rubli" : "Waluta";

    finallySum.textContent = (amount + allExtraMoney).toDivide();
    finallyProcent.textContent = allProcent.toDivide();
    finallyResult.textContent = (amount + allExtraMoney + allProcent).toDivide();
    finallyCurrency.textContent = finallyCurContent;
}