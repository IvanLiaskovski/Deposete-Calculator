"use strict";

class Column {
    constructor(number, date, day, sum, dod, currency, procentAfter) {
        this.number = number;
        this.date = date;
        this.day = day;
        this.sum = sum;
        this.dod = dod;
        this.currency = currency;
        this.procentAfter = procentAfter;
    }
    toTable() {
        const globalTabel = selectElement("#global-tabel");

        let element = document.createElement("tbody");
        element.className = "count-result";
        element.innerHTML = `<tr>
        <td>${this.number}</td>
        <td>${this.date}</td>
        <td>${this.day}</td>
        <td>${this.sum.toDivide()} ${this.currency}</td>
        <td>${this.dod.toDivide()} ${this.currency}</td>
        <td>${this.procentAfter.toDivide()} ${this.currency}</td></tr>`;
        globalTabel.append(element);
    }
}

class Count {
    constructor(am) {
        this.betaMoney = am;
        this.endResult = am;
        this.monthResult = 0;
        this.countDay = 0;
        this.countMonth = 0;
    }
}

class SecondCount {
    constructor() {
        this.day = [];
        this.procent = [];
        this.extraMoney = [];
    }
}