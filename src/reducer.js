import {combineReducers, createStore, applyMiddleware, compose} from 'redux'
import {reducer as groceryReducer} from './modules/GroceryActions'
import {reducer as appReducer} from './modules/AppActions'
import {reducer as budgetReducer} from './modules/BudgetActions'
import {reducer as recurrentReducer} from './modules/RecurrentActions'
import {reducer as miscReducer} from './modules/MiscActions'
import thunkMiddleware from 'redux-thunk'
import {initialState} from './initialState'

const localStorageMiddleware = ({getState}) => {
    return (next) => (action) => {
        const result = next(action);
        localStorage.setItem('applicationState', JSON.stringify(
            getState()
        ));
        return result;
    };
};

const reducer = combineReducers({
    app: appReducer,
    grocery: groceryReducer,
    budget: budgetReducer,
    recurrent: recurrentReducer,
    misc: miscReducer
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/*const composeEnhancers = compose;*/
export const store = createStore(reducer, initialState, composeEnhancers(applyMiddleware(thunkMiddleware), applyMiddleware(localStorageMiddleware)));