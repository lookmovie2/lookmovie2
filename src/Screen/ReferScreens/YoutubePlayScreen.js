import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  PixelRatio,
  TouchableOpacity,
} from 'react-native';
import YouTube from 'react-native-youtube';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../config/colors';

export default class YoutubePlayScreen extends React.Component {
  state = {
    isReady: false,
    status: null,
    quality: null,
    error: null,
    isPlaying: true,
    isLooping: true,
    duration: 0,
    currentTime: 0,
    fullscreen: false,
    containerMounted: false,
    containerWidth: null,
  };

  back = () => {
    this.props.navigation.pop();
  };

  render() {
    const youtubeId = this.props.navigation.state.params.youtubeId;
    const youtubeTitle = this.props.navigation.state.params.youtubeTitle;
    const youtubeDesc = this.props.navigation.state.params.youtubeDesc;
    return (
      <View
        style={styles.container}
        onLayout={({
          nativeEvent: {
            layout: {width},
          },
        }) => {
          if (!this.state.containerMounted) {
            this.setState({containerMounted: true});
          }
          if (this.state.containerWidth !== width) {
            this.setState({containerWidth: width});
          }
        }}>
        <View>
          {this.state.containerMounted && (
            <YouTube
              ref={component => {
                this._youTubeRef = component;
              }}
              apiKey="AIzaSyCaYPGxQfJf-KRJ-PzsgXNCejIm0W2qNgc"
              videoId={youtubeId}
              play={this.state.isPlaying}
              loop={this.state.isLooping}
              fullscreen={this.state.fullscreen}
              controls={1}
              style={[
                {
                  height: PixelRatio.roundToNearestPixel(
                    this.state.containerWidth / (16 / 9),
                  ),
                },
                styles.player,
              ]}
              onError={e => this.setState({error: e.error})}
              onReady={e => this.setState({isReady: true})}
              onChangeState={e => this.setState({status: e.state})}
              onChangeQuality={e => this.setState({quality: e.quality})}
              onChangeFullscreen={e =>
                this.setState({fullscreen: e.isFullscreen})
              }
              onProgress={e =>
                this.setState({
                  duration: e.duration,
                  currentTime: e.currentTime,
                })
              }
            />
          )}
          <View style={styles.backContainer}>
            <TouchableOpacity
              onPress={() => {
                this.back();
              }}>
              <Icon name="chevron-left" size={30} style={styles.leftButton} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.dsc}>
          <Text style={styles.title}>{youtubeTitle}</Text>
          <ScrollView>
            <Text style={styles.item_description}>{youtubeDesc}</Text>
          </ScrollView>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.subScreen,
    flex: 1,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  leftButton: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  button: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#ffff',
  },
  buttonTextSmall: {
    fontSize: 15,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  player: {
    alignSelf: 'stretch',
    marginVertical: 10,
  },
  backContainer: {
    position: 'absolute',
    left: 3,
    top: 3,
  },
  dsc: {
    marginTop: 20,
    padding: 16,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  title: {
    color: 'rgba(255, 8, 120, 0.6)',
    fontSize: 20,
    marginBottom: 15,
  },
  item_description: {
    color: '#7f7f7f',
    fontSize: 15,
  },
  palyButton: {
    marginRight: 30,
  },
  fullButton: {
    marginLeft: 30,
  },
});
