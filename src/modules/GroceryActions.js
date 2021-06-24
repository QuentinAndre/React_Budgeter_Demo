import {List, Map} from 'immutable';

const CHANGE_MENU = 'app/grocery/CHANGE_MENU';
const TO_CHECKOUT = 'app/grocery/TO_CHECKOUT';
const TO_STORE = 'app/grocery/TO_STORE';
const TO_MISC_BUTTON = 'app/grocery/TO_MISC_BUTTON';
const SET_STATE = 'app/grocery/SET_STATE';


const initialState = new Map({
    choices: List([]),
    prices: List([]),
    activePanel: "store"
});



export function changeMenu(id, value) {
    return {
        type: CHANGE_MENU,
        id: id,
        value: value
    }
}

export function toStore() {
    return {
        type: TO_STORE
    }
}

export function toCheckout() {
    return {
        type: TO_CHECKOUT
    }
}

export function toMiscButton() {
    return {
        type: TO_MISC_BUTTON
    }
}

export function setState(payload) {
    return {
        type: SET_STATE,
        payload: payload
    }
}

export function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_STATE:
            var { choices, prices, tooltips, names, activePanel, prompt } = action.payload;
            choices = List(choices);
            prices = List(prices);
            tooltips = List(tooltips);
            names = List(names);
            return state.merge({prices: prices, choices: choices, tooltips: tooltips, names: names, prompt: prompt, activePanel: activePanel});

        case CHANGE_MENU:
            return state.setIn(["choices", action.id], action.value);

        case TO_CHECKOUT:
            return state.set("activePanel", "checkout");

        case TO_STORE:
            return state.set("activePanel", "store");

        case TO_MISC_BUTTON:
            return state.set("activePanel", "toMiscButton");

        default:
            return state

    }
}
