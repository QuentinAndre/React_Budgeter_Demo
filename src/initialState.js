import {Map, List} from 'immutable'
import {Transaction} from './modules/BudgetActions'

const grocery = new Map({
    choices: List([0]),
    prices: List([0]),
    tooltips: List([0]),
    names: List([0]),
    activePanel: "store",
    prompt: "",
    gameEnded: false
});


const recurrent = new Map({
    items: List([0]),
    visibility: [0],
    prompt: ""
});

const misc = new Map({
    items: List([0])
});

const app = new Map({
    participantId: "",
    fundName: "",
    weekNumber: 0,
    modalState: "closed",
    activeTab: "recurrent",
    isLoaded: false,
    isFetching: false,
    hasFailedFetching: false,
    fetchErrors: 0,
    enableFund: true
});

const budget = new Map({
    cardBalance: 0,
    fundBalance: 0,
    lines: List([0]),
    nextTransaction: Transaction({}),
    fundUses: ["misc"]
});

export const initialState = {
    grocery: grocery,
    budget: budget,
    app: app,
    recurrent: recurrent,
    misc: misc
};

