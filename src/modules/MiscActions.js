import {List, Map, Record} from 'immutable';

const TOGGLE_ITEM = 'app/misc/TOGGLE_ITEM';
const REVIEW_ITEM = 'app/misc/REVIEW_ITEM';
const UPDATE_AMOUNT = 'app/misc/UPDATE_AMOUNT';
const SET_ACTIVE = 'app/misc/SET_ACTIVE';
const SET_STATE = 'app/misc/SET_STATE';



export const Selector = new Record({
    value: 0,
    type: "binary", /* Can be binary, category, or slider */
    data: [], /* Range of text choices for category type */
    unitPrice: 1, /* Unit price for Slider */
    props: {}, /* Other props to pass */
    prefix: '',
    suffix: ''
});

export const MiscItem = new Record({
    title: "",
    text: "",
    amount: 0,
    buttonDeclinedText: "",
    category: "",
    opened: false,
    reviewed: false,
    selector: Selector({})
});

const initialState = new Map({
    items: List([])
});


export function toggleItem(id) {
    return {
        type: TOGGLE_ITEM,
        id: id
    }
}

export function reviewItem(id) {
    return {
        type: REVIEW_ITEM,
        id: id
    }
}

export function setActive(id) {
    return {
        type: SET_ACTIVE,
        id: id
    }
}

export function updateAmount(id, value) {
    return {
        type: UPDATE_AMOUNT,
        id: id,
        value: value
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
        case TOGGLE_ITEM:
            return state.setIn(["items", action.id, "opened"], !state.getIn(["items", action.id, "opened"]));

        case REVIEW_ITEM:
            return state.setIn(["items", action.id, "reviewed"], true);

        case SET_ACTIVE:
            return state.set("active", action.id);

        case SET_STATE:
            function mapItem(item) {
                item.selector = Selector(item.selector);
                return MiscItem(item)
            }
            const items = action.payload.items.map((item) => mapItem(item));
            const newState = action.payload;
            newState.items = items;
            return state.merge(newState);

        case UPDATE_AMOUNT:
            var item = state.getIn(["items", action.id]);
            const selector = item.get("selector");
            const type = selector.get("type");
            let s = null;
            if (type == "binary") {
                s = state
            } else if (type == "category") {
                s = state.setIn(["items", action.id, "amount"], action.value).setIn(["items", action.id, "selector", "value"], action.value)
            } else if (type == "slider") {
                let amount = selector.get("unitPrice") * action.value;
                s = state.setIn(["items", action.id, "amount"], amount)
                    .setIn(["items", action.id, "selector", "value"], action.value)
            }

            return s;

        default:
            return state

    }
}
