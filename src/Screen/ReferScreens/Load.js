import React, {Component} from 'react';
import {
  StyleSheet,
  StatusBar,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import Orientation from 'react-native-orientation-locker';

import colors from '../../config/colors';

import {
  get_mv_treding,
  get_mv_latest,
  get_mv_genres,
  get_tv_latest,
  get_tv_treding,
} from '../../redux/actions/CallApiAction';
import {Container} from 'native-base';

const load_step = 0.3;

class Load extends Component {
  constructor(props) {
    super(props);

    this.state = {
      progress: 0,
      indeterminate: false,
    };
  }

  componentDidMount() {
    Orientation.lockToPortrait();
    this.bootstrapAsync();
  }

  bootstrapAsync = async () => {
    try {
      const dispatch = this.props.dispatch;

      await Promise.all([
        dispatch(get_mv_treding()),
        dispatch(get_mv_latest()),
        dispatch(get_mv_genres()),
        dispatch(get_tv_latest()),
        dispatch(get_tv_treding()),
      ]);
      this.props.navigation.navigate('Draw');
    } catch (error) {
      console.log(error);
      this.bootstrapAsync();
    }
  };

  render() {
    return (
      <Container>
        <StatusBar
          backgroundColor={colors.subScreen}
          barStyle="light-content"
        />
        <ImageBackground
          source={require('../../assets/splash.png')}
          style={styles.viewStyles}>
          <StatusBar
            barStyle="light-content"
            backgroundColor={colors.headerColor}
          />
          <ActivityIndicator size="large" color={colors.progress} />
        </ImageBackground>
      </Container>
    );
  }
}

Load.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  viewStyles: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progress: {
    color: colors.progress,
  },
});

export default connect()(Load);
