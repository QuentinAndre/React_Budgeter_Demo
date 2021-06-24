import {List, Map, Record} from 'immutable';

const PROCESS_TRANSACTION = 'app/budget/PROCESS_TRANSACTION';
const PARSE_TRANSACTION = 'app/budget/PARSE_EXPENSE';
const SET_STATE = 'app/budget/SET_STATE';

function splitTransaction(fundBalance, cardBalance, account, amount) {
    const totalBalance = fundBalance + cardBalance;
    const mainBalance = (account == "card") ? cardBalance : fundBalance;
    let status = "";
    let fromCard = 0;
    let fromFund = 0;
    if (totalBalance < amount) {
        fromCard = 0;
        fromFund = 0;
        status = "unaffordable"
    } else if (mainBalance == 0) {
        fromCard = 0;
        fromFund = 0;
        status = "depleted"
    } else if (mainBalance >= amount) {
        fromCard = (account == "card") ? amount : 0;
        fromFund = (account == "fund") ? amount : 0;
        status = "full"
    } else {
        fromCard = (account == "card") ? cardBalance : (amount - fundBalance);
        fromFund = (account == "fund") ? fundBalance : (amount - cardBalance);
        status = "split"
    }
    return {fromCard: fromCard, fromFund: fromFund, status: status}
}

export const Transaction = new Record({
    title: "",
    category: "",
    type: "",
    status: "",
    account: "",
    fromCard: 0,
    fromFund: 0,
    forceDisplayFund: false,
    forceDisplayCard: false,
    callbackId: 0
});


export function parseTransaction(payload) {
    return {
        type: PARSE_TRANSACTION,
        payload: payload,
    }
}


export function processTransaction() {
    return {
        type: PROCESS_TRANSACTION,
    }
}

const initialState = new Map({
    cardBalance: 200,
    displayFund: true,
    fundBalance: 200,
    lines: List([]),
    nextTransaction: Transaction({}),
    fundUses: ["misc"]
});

export function setState(payload) {
    return {
        type: SET_STATE,
        payload: payload
    }
}

export function reducer(state = initialState, action) {
    const fundBalance = state.get("fundBalance");
    const cardBalance = state.get("cardBalance");
    const fundUses = state.get("fundUses");
    switch (action.type) {

        case SET_STATE:
            return state.merge(action.payload);

        case PARSE_TRANSACTION:
            let payload = action.payload;
            let {forceDisplayFund, forceDisplayCard, title, category, type, callbackId, account, amount} = payload;
            let payment = {};
            if (type == "notPurchased") {
                payment = {
                    fromCard: 0,
                    fromFund: 0,
                    status: "notPurchased"
                }
            } else if (type == "income") {
                payment = {
                    fromCard: (account == "card") ? amount : 0,
                    fromFund: (account == "fund") ? amount : 0,
                    status: "full"
                }
            } else if ((account == "fund") && !(fundUses.includes(category))) {
                payment = {
                    fromCard: 0,
                    fromFund: 0,
                    status: "denied"
                }

            } else if ((amount > cardBalance) && !(fundUses.includes(category))) {
                payment = {
                    fromCard: 0,
                    fromFund: 0,
                    status: "unaffordable"
                }
            } else {
                payment = splitTransaction(fundBalance, cardBalance, account, amount);
            }

            let {fromCard, fromFund, status} = payment;
            return state.set("nextTransaction", Transaction({
                title: title,
                category: category,
                type: type,
                account: account,
                fromCard: fromCard,
                fromFund: fromFund,
                status: status,
                forceDisplayFund: forceDisplayFund,
                forceDisplayCard: forceDisplayCard,
                callbackId: callbackId
            }));

        case PROCESS_TRANSACTION:
            let transaction = state.get("nextTransaction");
            let lines = state.get("lines").push(transaction);
            let budget = {};
            if (transaction.get("type") == "income") {
                budget = {
                    lines: lines,
                    cardBalance: parseFloat((cardBalance + transaction.get("fromCard")).toFixed(2)),
                    fundBalance: parseFloat((fundBalance + transaction.get("fromFund")).toFixed(2))
                }
            } else {
                budget = {
                    lines: lines,
                    cardBalance: parseFloat((cardBalance - transaction.get("fromCard")).toFixed(2)),
                    fundBalance: parseFloat((fundBalance - transaction.get("fromFund")).toFixed(2))
                }
            }
            return state.merge(budget);

        default:
            return state

    }
}
