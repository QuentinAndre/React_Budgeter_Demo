import {List, Map, Record} from 'immutable';

const NEXT_PANEL = 'app/recurrent/NEXT_PANEL';
const SET_STATE = 'app/recurrent/SET_STATE';


export const RecurrentItem = new Record({
    title: "",
    text: "",
    account: "card",
    amount: 0,
    buttonText: "",
    forceDisplayCard: false,
    forceDisplayFund: false,
    category: "recurrent",
    type: "income"
});


const initialState = new Map({
    items: List([]),
    prompt: "",
    visibility: List([])
});



export function nextPanel(id) {
    return {
        type: NEXT_PANEL,
        id: id
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
        case NEXT_PANEL:
            return state.set("visibility", state.get("visibility").map((item, i) => ((action.id+1) == i) ? 1 : 0));

        case SET_STATE:
            const loadedItems = action.payload.items;
            const items = List(loadedItems.map((item) => RecurrentItem(item)));
            var { prompt, visibility } = action.payload;
            if (!visibility) {
                visibility = List((loadedItems.map((item, i)=> i == 0 ? 1 : 0)));
            }
            return state.merge({prompt: prompt, visibility: visibility, items: items});

        default:
            return state

    }
}
