import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import colors from '../../config/colors';
import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view';
import {Root, Container} from 'native-base';
import Orientation from 'react-native-orientation-locker';

import LatestTab from '../TVSubScreens/LatestTab';
import TrendingTab from '../TVSubScreens/TrendingTab';
import CategoriesTab from '../TVSubScreens/CategoriesTab';
import FilterTab from '../TVSubScreens/FilterTab';

import MenuHeader from '../Headers/MenuHeader';

export default class TVScreen extends Component {
  componentDidMount() {
    Orientation.lockToPortrait();
  }

  render() {
    return (
      <Container>
        <MenuHeader {...this.props} />
        <Root>
          <ScrollableTabView
            tabBarBackgroundColor={colors.navigation}
            tabBarUnderlineStyle={{backgroundColor: colors.headerColor}}
            tabBarActiveTextColor={colors.headerColor}
            locked={true}
            scrollWithoutAnimation={false}
            initialPage={0}
            renderTabBar={() => <ScrollableTabBar />}>
            <LatestTab tabLabel="LATEST" {...this.props} />
            <TrendingTab tabLabel="TRENDING" {...this.props} />
            <CategoriesTab tabLabel="GATEGORIES" {...this.props} />
            <FilterTab tabLabel="FILTER" {...this.props} />
          </ScrollableTabView>
        </Root>
      </Container>
    );
  }
}
