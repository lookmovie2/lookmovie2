import {
  MOVIE_TREDING_DATA,
  MOVIE_LATEST_DATA,
  MOVIE_GENRES_DATA,
} from '../actions/ActionTypes';

const initialState = {
  treding_data: {},
  latest_data: {},
  genres_data: {},
};

const MovieReducer = (state = initialState, action) => {
  switch (action.type) {
    case MOVIE_TREDING_DATA:
      return {...state, treding_data: action.payload};
    case MOVIE_LATEST_DATA:
      return {...state, latest_data: action.payload};
    case MOVIE_GENRES_DATA:
      return {...state, genres_data: action.payload};
    default:
      return state;
  }
};

export default MovieReducer;
