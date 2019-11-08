import {TV_TREDING_DATA, TV_LATEST_DATA} from '../actions/ActionTypes';

const initialState = {
  treding_data: {},
  latest_data: {},
  genres_data: {},
};

const MovieReducer = (state = initialState, action) => {
  switch (action.type) {
    case TV_TREDING_DATA:
      return {...state, treding_data: action.payload};
    case TV_LATEST_DATA:
      return {...state, latest_data: action.payload};
    default:
      return state;
  }
};

export default MovieReducer;
