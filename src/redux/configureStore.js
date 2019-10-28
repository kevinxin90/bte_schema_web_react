import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Dishes } from './dishes';
import { createForms } from 'react-redux-form';
import { InitialFeedback } from './forms';
import { Comments } from './comments';
import { Promotions } from './promotions';
import { Leaders } from './leaders';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

// enhancer is the second parameter for createStore
// applyMiddleware is an enhancer
export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            dishes: Dishes,
            comments: Comments,
            promotions: Promotions,
            leaders: Leaders,
            ...createForms({
                feedback: InitialFeedback
            })

        }),
        applyMiddleware(thunk, logger)
    );

    return store;
}