import React, {Component} from 'react';
import colors from '../../config/colors';
import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view';
import {Container, Root} from 'native-base';

import FilterTab from '../MovieSubScreens/FilterTab';
import CategoriesTab from '../MovieSubScreens/CategoriesTab';
import GenresTab from '../MovieSubScreens/GenresTab';
import LatestTab from '../MovieSubScreens/LatestTab';
import TrendingTab from '../MovieSubScreens/TrendingTab';
import MenuHeader from '../Headers/MenuHeader';
import Orientation from 'react-native-orientation-locker';

export default class MovieScreen extends Component {
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
            <TrendingTab tabLabel="TRENDING" {...this.props} />
            <LatestTab tabLabel="LATEST" {...this.props} />
            <CategoriesTab tabLabel="CATEGORIES" {...this.props} />
            <GenresTab tabLabel="GENRES" {...this.props} />
            <FilterTab tabLabel="FILTER" {...this.props} />
          </ScrollableTabView>
        </Root>
      </Container>
    );
  }
}
