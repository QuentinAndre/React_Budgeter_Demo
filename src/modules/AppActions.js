import {Map} from 'immutable';
import {setState as setBudgetState} from './BudgetActions'
import {setState as setMiscState} from './MiscActions'
import {setState as setRecurrentState} from './RecurrentActions'
import {setState as setGroceryState} from './GroceryActions'
require('isomorphic-fetch');
require('es6-promise').polyfill();

const CHANGE_TAB = 'app/app/CHANGE_TAB';
const CLOSE_MODAL = 'app/app/CLOSE_MODAL';
const OPEN_MODAL = 'app/app/OPEN_MODAL';
const INIT_APP = 'app/app/INIT_APP';
const SET_FETCHING = 'app/app/SET_FETCHING';
const SET_STATE = 'app/app/SET_STATE';
const SET_LOADED = 'app/app/SET_LOADED';
const SET_FAIL_FETCHING = 'app/app/SET_FAIL_FETCHING';
const INCREMENT_WEEK = 'app/app/INCREMENT_WEEK';

const initialState = new Map({
    participantId: "",
    fundName: "",
    weekNumber: 1,
    modalState: "closed",
    activeTab: "recurrent",
    isLoaded: false,
    isFetching: false,
    hasFailedFetching: false,
    fetchErrors: 0,
    gameEnded: false
});

export function openModal() {
    return {
        type: OPEN_MODAL
    }
}

export function closeModal() {
    return {
        type: CLOSE_MODAL
    }
}

export function changeTab(tabName) {
    return {
        type: CHANGE_TAB,
        tabName: tabName
    }
}

export function setFetching(status) {
    return {
        type: SET_FETCHING,
        status: status
    }
}

export function setState(payload) {
    return {
        type: SET_STATE,
        payload: payload
    }
}

export function setLoaded(status) {
    return {
        type: SET_LOADED,
        status: status
    }
}

export function setFailFetching(status) {
    return {
        type: SET_FAIL_FETCHING,
        status: status
    }
}

function fetchStateFromLocalStorage() {
    const json = JSON.parse(localStorage.getItem('applicationState'));
    var {misc, grocery, app, recurrent, budget} = json;

    return ({miscState: misc, groceryState: grocery, appState: app, recurrentState: recurrent, budgetState: budget})
}


function fetchStateFromAPI(endpoint, payload) {
    return fetch(`/game/${endpoint}/`,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, method: 'POST',
            body: JSON.stringify(payload)
        }).then((res) => res.json()).then((json) => {
        return {
            miscState: json.misc,
            groceryState: json.grocery,
            appState: json.app,
            recurrentState: json.recurrent,
            budgetState: json.budget
        }
    })
}

function getInitialState(isLoaded) {
    const endpoint = "fetch_init_data";
    const payload = JSON.parse(localStorage.getItem('conditionInformation'));
    const loadedState = new Promise(function (resolve, reject) {
        if (isLoaded) {
            resolve(fetchStateFromLocalStorage())
        } else {
            resolve(fetchStateFromAPI(endpoint, payload))
        }
    });
    return loadedState
}


export function initialize() {
    return function (dispatch, getState) {
        const locallyStoredState = JSON.parse(localStorage.getItem('applicationState'));
        const isLoaded = locallyStoredState ? locallyStoredState.app.isLoaded : false;
        const loadedState = getInitialState(isLoaded);
        loadedState.then((state) => {
            var {miscState, groceryState, appState, recurrentState, budgetState} = state;
            dispatch(setBudgetState(budgetState));
            dispatch(setMiscState(miscState));
            dispatch(setRecurrentState(recurrentState));
            dispatch(setGroceryState(groceryState));
            dispatch(setState(appState));
            dispatch(setLoaded(true));
            dispatch(setFetching(false));
            dispatch(setFailFetching(false));
        }).catch((err) => {
            dispatch(setFetching(false));
            dispatch(setFailFetching(true));
        });
    }
}


export function storeWeekChoices(state) {
    const turkid = state.app.get("participantId");
    const fundName = state.app.get("fundName");
    const weekNumber = state.app.get("weekNumber");
    const budgetState = state.budget.toJS();
    const groceryState = state.grocery.toJS();
    const cardBalance = budgetState.cardBalance;
    const fundBalance = budgetState.fundBalance;
    const budgetLines = budgetState.lines;
    const payload = {
        turkid: turkid,
        weekNumber: weekNumber,
        fundName: fundName,
        cardBalance: cardBalance,
        fundBalance: fundBalance,
        budgetLines: budgetLines,
        groceryChoices: groceryState.choices

    };
    return fetch("/game/save_data/",
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, method: 'POST',
            body: JSON.stringify(payload)
        }).then((res) => res.json()).then((json) => {
        return {
            miscState: json.misc,
            groceryState: json.grocery,
            appState: json.app,
            recurrentState: json.recurrent,
            budgetState: json.budget
        }
    })
}

export function getNextWeekData() {
    return function (dispatch, getState) {
        const state = getState();
        dispatch(setFetching(true));
        const loadedState = storeWeekChoices(state);
        loadedState.then((state) => {
            var {miscState, groceryState, appState, recurrentState, budgetState} = state;
            const weekNumber = appState.weekNumber;
            if (appState) {
                dispatch(setState(appState));
            }
            if (groceryState) {
                dispatch(setGroceryState(groceryState));
            }

            if (budgetState) {
                dispatch(setBudgetState(budgetState));
            }

            if (miscState) {
                dispatch(setMiscState(miscState));
            }

            if (recurrentState) {
                dispatch(setRecurrentState(recurrentState));
            }
            dispatch(setFetching(false));
            dispatch(setFailFetching(false));
            if (weekNumber) {
                alert("Now starting week " + appState.weekNumber);
            } else {
                alert("The game is over!")
            }
        }).catch((err) => {
            dispatch(setFetching(false));
            dispatch(setFailFetching(true));
        });

    }
}


export function reducer(state = initialState, action) {
    switch (action.type) {

        case OPEN_MODAL:
            return state.set("modalState", "open");

        case CLOSE_MODAL:
            return state.set("modalState", "closed");

        case INCREMENT_WEEK:
            const weekNumber = state.get("weekNumber");
            return state.set("weekNumber", weekNumber + 1);

        case CHANGE_TAB:
            return state.set("activeTab", action.tabName);

        case SET_STATE:
            return state.merge(action.payload);

        case SET_FETCHING:
            return state.set("isFetching", action.status);

        case SET_LOADED:
            return state.set("isLoaded", action.status);

        case SET_FAIL_FETCHING:
            if (action.status == true) {
                const fetchErrors = state.get("fetchErrors");
                return state.merge({fetchErrors: fetchErrors + 1, hasFailedFetching: true});
            } else {
                return state.merge({fetchErrors: 0, hasFailedFetching: false})
            }


        default:
            return state

    }
}




