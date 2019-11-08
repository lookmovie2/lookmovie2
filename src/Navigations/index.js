/**
 * React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import {createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import LoadNavigator from './LoadNavigator';
import DrawNavigator from './DrawNavigator';
import SearchScreen from '../Screen/ReferScreens/SearchScreen';
import MovieSearch from '../Screen/ReferScreens/MovieSearch';
import TVSearch from '../Screen/ReferScreens/TVSearch';
import PlayScreen from '../Screen/ReferScreens/PlayScreen/index';
import TvShowScreen from '../Screen/ReferScreens/TvShowScreen/index';
import YoutubePlayScreen from '../Screen/ReferScreens/YoutubePlayScreen';

const MainNavigator = createStackNavigator(
  {
    Draw: DrawNavigator,
    Search: SearchScreen,
    MovieSearch: MovieSearch,
    TVSearch: TVSearch,
    Play: PlayScreen,
    TVPlay: TvShowScreen,
    Youtube: YoutubePlayScreen,
  },
  {
    initialRouteName: 'Draw',
    headerMode: 'none',
  },
);

const AppNavigator = createSwitchNavigator(
  {
    Load: LoadNavigator,
    Main: MainNavigator,
  },
  {
    initialRouteName: 'Load',
  },
);

export default AppNavigator;
