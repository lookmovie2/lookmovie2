import {combineReducers} from 'redux';

import movie from './MovieReducer';
import tv from './TVReducer';

const reducer = combineReducers({movie, tv});

export default reducer;
