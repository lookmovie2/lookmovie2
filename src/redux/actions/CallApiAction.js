import {
  MOVIE_TREDING_DATA,
  MOVIE_LATEST_DATA,
  MOVIE_GENRES_DATA,
  TV_TREDING_DATA,
  TV_LATEST_DATA,
} from '../actions/ActionTypes';
import {get} from '../../utils/httpRequest';

import API from '../../config/api';

// movie treding data
export const get_mv_treding = () => async dispatch => {
  try {
    const response = await get(API.trending);
    dispatch({type: MOVIE_TREDING_DATA, payload: response});
  } catch (error) {
    throw error;
  }
};

// movie latest data
export const get_mv_latest = () => async dispatch => {
  try {
    const response = await get(API.latest);
    dispatch({type: MOVIE_LATEST_DATA, payload: response});
  } catch (error) {
    throw error;
  }
};

// movie genres data
export const get_mv_genres = () => async dispatch => {
  try {
    let adventure = await get(API.adventure);
    adventure = adventure.collection;
    const tmp_adventure = [];
    for (let i = 0; i < adventure.length; i += 2) {
      tmp_adventure.push(i);
    }
    let animation = await get(API.animation);
    animation = animation.collection;
    const tmp_animation = [];
    for (let i = 0; i < animation.length; i += 2) {
      tmp_animation.push(i);
    }
    let comedy = await get(API.comedy);
    comedy = comedy.collection;
    const tmp_comedy = [];
    for (let i = 0; i < comedy.length; i += 2) {
      tmp_comedy.push(i);
    }
    let crime = await get(API.crime);
    crime = crime.collection;
    const tmp_crime = [];
    for (let i = 0; i < crime.length; i += 2) {
      tmp_crime.push(i);
    }
    let drama = await get(API.drama);
    drama = drama.collection;
    const tmp_drama = [];
    for (let i = 0; i < drama.length; i += 2) {
      tmp_drama.push(i);
    }
    let family = await get(API.family);
    family = family.collection;
    const tmp_family = [];
    for (let i = 0; i < family.length; i += 2) {
      tmp_family.push(i);
    }
    let fantasy = await get(API.fantasy);
    fantasy = fantasy.collection;
    const tmp_fantasy = [];
    for (let i = 0; i < fantasy.length; i += 2) {
      tmp_fantasy.push(i);
    }
    let horror = await get(API.horror);
    horror = horror.collection;
    const tmp_horror = [];
    for (let i = 0; i < horror.length; i += 2) {
      tmp_horror.push(i);
    }
    let romance = await get(API.romance);
    romance = romance.collection;
    const tmp_romance = [];
    for (let i = 0; i < romance.length; i += 2) {
      tmp_romance.push(i);
    }
    const data = {
      adventure: adventure,
      tmp_adventure: tmp_adventure,
      animation: animation,
      tmp_animation: tmp_animation,
      comedy: comedy,
      tmp_comedy: tmp_comedy,
      crime: crime,
      tmp_crime: tmp_crime,
      drama: drama,
      tmp_drama: tmp_drama,
      family: family,
      tmp_family: tmp_family,
      fantasy: fantasy,
      tmp_fantasy: tmp_fantasy,
      horror: horror,
      tmp_horror: tmp_horror,
      romance: romance,
      tmp_romance: tmp_romance,
    };
    dispatch({type: MOVIE_GENRES_DATA, payload: data});
  } catch (error) {
    throw error;
  }
};

// tv treding data
export const get_tv_treding = () => async dispatch => {
  try {
    const response = await get(API.tv_trending);
    dispatch({type: TV_TREDING_DATA, payload: response});
  } catch (error) {
    throw error;
  }
};

// tv latest data
export const get_tv_latest = () => async dispatch => {
  try {
    const response = await get(API.tv_latest);
    dispatch({type: TV_LATEST_DATA, payload: response});
  } catch (error) {
    throw error;
  }
};
