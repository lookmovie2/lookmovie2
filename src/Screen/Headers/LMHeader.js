import React, {Component} from 'react';
import {StyleSheet, Platform} from 'react-native';
import {Header} from 'react-native-elements';

import Logo from '../../widgets/Logo';

import colors from '../../config/colors';

export default class LMHeader extends Component {
  render() {
    return (
      <Header
        backgroundColor={colors.headerColor}
        containerStyle={styles.header_container}
        centerComponent={<Logo {...this.props} />}
      />
    );
  }
}

const styles = StyleSheet.create({
  header_container: {
    marginTop: Platform.OS === 'ios' ? 0 : -24,
  },
});
