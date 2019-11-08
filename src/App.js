/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {YellowBox} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {connect} from 'react-redux';
import SplashScreen from 'react-native-splash-screen';

import AppNavigator from './Navigations/index';

YellowBox.ignoreWarnings(['RCTRootView cancelTouches']);

const AppContainer = createAppContainer(AppNavigator);

class App extends Component {
  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    return <AppContainer />;
  }
}

export default connect()(App);
