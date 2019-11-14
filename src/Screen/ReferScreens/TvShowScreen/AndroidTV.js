import React, {Component, PureComponent} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
  Picker,
  TouchableWithoutFeedback,
  Linking,
} from 'react-native';
import ProgressScreen from '../../ReferScreens/ProgressScreen';
import API from '../../../config/api';
import colors from '../../../config/colors';
import PlayIcon from 'react-native-vector-icons/Feather';
import {TouchableOpacity, ScrollView} from 'react-native-gesture-handler';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Slider} from 'react-native-elements';
import Video from 'react-native-video';
import {TextTrackType} from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import {StatusBar} from 'react-native';
import ISO6391 from 'iso-639-1';
import BackHeaderNoSearch from '../../Headers/BackHeaderNoSearch';
import {Container} from 'native-base';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

var itemsShow = [];

class Cast extends PureComponent {
  render() {
    const item = this.props.item;
    return (
      <View style={styles.stars}>
        <Image
          style={styles.ImageBk_cast}
          source={{
            uri:
              item.profile_path === ''
                ? API.cast
                : API.base_filter_img + item.profile_path,
          }}
        />
        <Text style={styles.star_name}>{item.name}</Text>
        <Text style={styles.star_hero}>{item.hero}</Text>
      </View>
    );
  }
}

function secondsToTime(time) {
  time = Number(time);
  let h = Math.floor(time / 3600);
  let m = Math.floor((time % 3600) / 60);
  let s = Math.floor((time % 3600) % 60);

  let hDisplay = '';
  if (h === 0) {
    hDisplay = '00:';
  } else if (h < 10) {
    hDisplay = '0' + h + ':';
  } else {
    hDisplay = h + ':';
  }
  let mDisplay = '';
  if (m === 0) {
    mDisplay = '00:';
  } else if (m < 10) {
    mDisplay = '0' + m + ':';
  } else {
    mDisplay = m + ':';
  }
  let sDisplay = '';
  if (s === 0) {
    sDisplay = '00';
  } else if (s < 10) {
    sDisplay = '0' + s;
  } else {
    sDisplay = s + '';
  }

  return hDisplay + mDisplay + sDisplay;
}

const STEP = 5;

export default class AndroidTV extends Component {
  constructor(props) {
    super(props);

    this.state = this.props.state;
    this.state.isSliding = false;
  }

  fetchSubtitles = () => {
    return fetch(API.show_subtitle + this.state.selectedItems[0]).then(
      response =>
        response.json().then(responseJson => {
          const textTracks = [];
          for (let i = 0; i < responseJson.length; i++) {
            const code = ISO6391.getCode(responseJson[i].language);
            if (code === '') {
              continue;
            }
            textTracks.push({
              title: responseJson[i].language,
              language: code,
              type: TextTrackType.VTT,
              uri: responseJson[i].url,
            });
          }
          this.setState({
            textTracks: textTracks,
          });
        }),
    );
  };

  playerControlClickFullScreen = () => {
    this.setState(
      {
        fullScreenFlag: !this.state.fullScreenFlag,
      },
      () => {
        this.state.fullScreenFlag
          ? this.entryFullScreen()
          : this.exitFullScreen();
      },
    );
  };
  entryFullScreen = () => {
    StatusBar.setHidden(true, true);
    Orientation.lockToLandscape();
    this.setState({
      videoWidth: screenHeight,
      videoHeight: screenWidth,
    });
  };
  exitFullScreen = () => {
    StatusBar.setHidden(false, true);
    Orientation.lockToPortrait();
    this.setState({
      videoWidth: screenWidth,
      videoHeight: 250,
    });
  };
  back = () => {
    Orientation.lockToPortrait();
    this.props.navigation.pop();
  };

  handleSubtitleChange = (itemValue, itemIndex) => {
    if (itemIndex === 0) {
      this.setState({
        selectedSubtitle: itemValue,
        currentSubtitle: {type: 'title', value: ''},
      });
    } else {
      this.setState({
        selectedSubtitle: itemValue,
        currentSubtitle: {
          type: 'title',
          value: itemValue,
        },
      });
    }
  };

  handleQualityChange = (itemValue, itemIndex) => {
    if (itemIndex === 0) {
      this.setState({
        SelectedQuality: itemValue,
        currentPlayUri: this.state.streamUrls[0],
      });
    } else {
      this.setState({
        SelectedQuality: itemValue,
        currentPlayUri: this.state.streamUrls[itemIndex - 1],
      });
    }
  };

  onProgress = data => {
    this.setState({
      currentTime: data.currentTime,
    });
    if (!this.state.isSliding) {
      this.setState({progress: data.currentTime / this.state.duration});
    }
  };

  onLoad = e => {
    this.setState({
      videoLoading: false,
      currentTime: e.currentTime,
      duration: e.duration,
    });
  };

  onLoadStart = data => {
    this.setState({videoLoading: true});
  };

  playYoutube = () => {
    this.setState({paused: true});
    // this.props.navigation.navigate('Youtube', {
    //   youtubeId: this.state.meta.youtube,
    //   youtubeTitle: this.state.meta.title,
    //   youtubeDesc: this.state.meta.description,
    // });
    const url = 'https://www.youtube.com/watch?v=' + this.state.meta.youtube;
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          console.log("Can't handle url: " + url);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(err => console.error('An error occurred', err));
  };

  onSelectedChange = selectedItems => {
    this.setState({selectedItems}, () => {
      const selected = selectedItems[0];
      this.setState(
        {
          currentPlayUri:
            API.show_stream +
            this.state.accessToken +
            '/' +
            this.state.expires +
            '/' +
            selected +
            '/master.m3u8',
        },
        () => {
          this.fetchSubtitles;
        },
      );
    });
  };

  indecator = () => {
    return {
      position: 'absolute',
      left: this.state.videoWidth / 2 - 20,
      top: this.state.videoHeight / 2 - 20,
    };
  };

  youtube = () => {
    return {
      width: screenWidth / 3,
      height: 25,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ff1000',
    };
  };

  imgBK = () => {
    return {
      width: this.state.videoWidth,
      height: this.state.videoHeight,
      alignItems: 'center',
      justifyContent: 'center',
    };
  };

  video_ = () => {
    return {
      width: this.state.videoWidth,
      height: this.state.videoHeight,
      backgroundColor: 'black',
    };
  };

  topController = () => {
    if (!this.state.videoLoading) {
      this.setState({hideTopControll: !this.state.hideTopControll});
    }
  };

  PlayOrPause = () => {
    this.setState({paused: !this.state.paused});
  };

  handleMainButtonTouch = () => {
    if (this.state.progress >= 1) {
      this.player.seek(0);
    }

    this.setState(state => {
      return {
        paused: !state.paused,
      };
    });
  };

  handleProgressPress = e => {
    const position = e.nativeEvent.locationX;
    const progress =
      (position / (this.state.fullScreenFlag ? 500 : 200)) *
      this.state.duration;

    this.player.seek(progress);
  };

  seekVideo = value => {
    console.log(value);
    const progress = this.state.duration * value;
    this.player.seek(progress);
    this.setState({isSliding: false});
  };

  handleEnd = () => {
    this.setState({paused: true});
  };

  handleLoad = meta => {
    this.setState({
      duration: meta.duration,
    });
  };

  forward = () => {
    if (this.state.currentTime + STEP < this.state.duration) {
      this.player.seek(this.state.currentTime + STEP);
    }
  };

  backward = () => {
    if (this.state.currentTime - STEP < 0) {
      this.player.seek(this.state.currentTime - STEP);
    }
  };

  render() {
    if (this.state.isLoading) {
      return (
        <Container>
          <BackHeaderNoSearch {...this.props} />
          <ProgressScreen />
        </Container>
      );
    }
    return (
      <View style={styles.container}>
        {this.state.init && (
          <View>
            <ImageBackground
              style={this.imgBK()}
              resizeMode={'cover'}
              source={{
                uri:
                  this.state.meta.backdrop === ''
                    ? API.backdrop
                    : API.base_home_img + this.state.meta.backdrop,
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({init: false});
                }}>
                <PlayIcon
                  name="play-circle"
                  color="rgba(255,255,255,0.8)"
                  size={60}
                />
              </TouchableOpacity>
            </ImageBackground>
            <View style={styles.backContainer}>
              <TouchableOpacity onPress={this.back}>
                <Icon name="chevron-left" size={35} style={styles.left_} />
              </TouchableOpacity>
            </View>
            <View style={styles.year_container}>
              <Text style={styles.year_}>{this.state.meta.year}</Text>
            </View>
            <View style={styles.rating_}>
              <Text style={styles.imdb}>IMDB</Text>
              <Text style={styles.rating_content}>
                {this.state.meta.imdb_rating}
              </Text>
            </View>
          </View>
        )}
        {!this.state.init && (
          <View
            style={{
              width: this.state.videoWidth,
              height: this.state.videoHeight,
            }}>
            <TouchableWithoutFeedback
              onPress={() => {
                this.topController();
              }}>
              <Video
                source={{uri: this.state.currentPlayUri}}
                repeat={true}
                resizeMode={'contain'}
                paused={this.state.paused}
                currentTime={this.state.currentTime}
                style={this.video_()}
                fullscreenOrientation={'landscape'}
                selectedTextTrack={this.state.currentSubtitle}
                textTracks={this.state.textTracks}
                ref={ref => (this.player = ref)}
                onProgress={this.onProgress}
                onLoad={this.onLoad}
                onLoadStart={this.onLoadStart}
              />
            </TouchableWithoutFeedback>

            {this.state.videoLoading && (
              <ActivityIndicator
                size={40}
                color={colors.progress}
                style={this.indecator()}
              />
            )}
            {this.state.hideTopControll && (
              <View style={styles.topControls}>
                <TouchableOpacity
                  style={styles.backstyle}
                  onPress={() => {
                    this.back();
                  }}>
                  <Icon name="chevron-left" size={35} style={styles.back} />
                </TouchableOpacity>
                <View style={styles.topControlItems}>
                  <Picker
                    selectedValue={this.state.selectedSubtitle}
                    style={styles.picker_subtitle}
                    itemStyle={styles.pickerItem}
                    onValueChange={this.handleSubtitleChange}>
                    <Picker.Item label="No Subtitle" value="" />
                    {this.state.textTracks.map((item, index) => {
                      return (
                        <Picker.Item
                          key={index}
                          label={item.title}
                          value={item.title}
                        />
                      );
                    })}
                  </Picker>
                  <TouchableOpacity
                    onPress={this.playerControlClickFullScreen}
                    style={styles.fullScreen}>
                    <Icon
                      name={
                        this.state.fullScreenFlag
                          ? 'fullscreen-exit'
                          : 'fullscreen'
                      }
                      size={30}
                      style={styles.topControlFullScreen}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {this.state.hideTopControll && (
              <View style={styles.bottomControls}>
                <View style={styles.playnext}>
                  <View style={styles.backward}>
                    <TouchableWithoutFeedback
                      style={styles.backward}
                      onPress={this.backward}>
                      <Icon name="skip-backward" size={30} color="#FFF" />
                    </TouchableWithoutFeedback>
                  </View>
                  <TouchableWithoutFeedback
                    onPress={this.handleMainButtonTouch}>
                    <Icon
                      name={!this.state.paused ? 'pause' : 'play'}
                      size={60}
                      color="#FFF"
                    />
                  </TouchableWithoutFeedback>
                  <View style={styles.forward}>
                    <TouchableWithoutFeedback
                      onPress={this.forward}
                      style={styles.forward}>
                      <Icon name="skip-forward" size={30} color="#FFF" />
                    </TouchableWithoutFeedback>
                  </View>
                </View>
                <View style={styles.controls}>
                  <Text style={styles.duration}>
                    {secondsToTime(
                      Math.floor(this.state.progress * this.state.duration),
                    )}
                  </Text>
                  <TouchableWithoutFeedback onPress={this.handleProgressPress}>
                    <View>
                      <Slider
                        value={this.state.progress}
                        color="#FFF"
                        thumbTouchSize={{width: 20, height: 20}}
                        thumbTintColor={'#fff'}
                        unfilledColor="rgba(255,255,255,.5)"
                        borderColor="#FFF"
                        width={this.state.fullScreenFlag ? 500 : 200}
                        height={20}
                        onSlidingComplete={this.seekVideo}
                        onValueChange={value => {
                          this.setState({isSliding: true});
                        }}
                      />
                    </View>
                  </TouchableWithoutFeedback>

                  <Text style={styles.duration}>
                    {secondsToTime(Math.floor(this.state.duration))}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}
        <SectionedMultiSelect
          items={this.state.itemsShow}
          uniqueKey="id"
          single={true}
          subKey="children"
          iconKey="icon"
          selectText="Select Genres..."
          showDropDowns={true}
          readOnlyHeadings={true}
          colors={{
            selectToggleTextColor: '#ffffff',
            primary: 'rgba(231,76,60,0.8)',
          }}
          style={styles.picker}
          onSelectedItemsChange={this.onSelectedChange}
          selectedItems={this.state.selectedItems}
        />
        <ScrollView>
          <View style={styles.poster}>
            <View style={{width: screenWidth / 3}}>
              <Image
                style={styles.ImageBk_poster}
                source={{uri: API.base_filter_img + this.state.meta.poster}}
              />
              <TouchableOpacity
                onPress={this.playYoutube}
                style={this.youtube()}>
                <Text style={styles.youtube_text}>WATCH TRAILER</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dsc}>
              <Text style={styles.title}>{this.state.meta.title}</Text>
              <View style={styles.duration_h}>
                <Icon name="av-timer" color="#fff" size={14} />
                <Text style={styles.duration}>
                  {this.state.meta.duration} minutes
                </Text>
              </View>
              <ScrollView>
                <Text style={styles.item_description}>
                  {this.state.meta.description}
                </Text>
              </ScrollView>
            </View>
          </View>
          {this.state.cast.length > 0 && (
            <View>
              <View style={styles.div_header}>
                <Text style={styles.div_txt}>CAST</Text>
              </View>
              <View style={styles.sub_div_h}>
                <Text style={styles.cast_sub}>Stars:</Text>
              </View>
              <ScrollView horizontal={true}>
                {this.state.cast.map((item, index) => {
                  if (item.picture_url !== '') {
                    <Cast key={index} item={item} />;
                  }
                })}
              </ScrollView>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.subScreen,
  },
  sliderContainer: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  controls: {
    height: 48,
    left: 0,
    bottom: 0,
    right: 0,
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  mainButton: {
    marginRight: 15,
  },
  playnext: {
    marginBottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 30,
  },
  duration: {
    color: '#FFF',
  },
  topControls: {
    position: 'absolute',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  bottomControls: {
    position: 'absolute',
    width: '100%',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    flex: 1,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  topControls_ios: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  leftButton: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  backContainer: {
    position: 'absolute',
    left: 3,
    top: 3,
  },
  playbuttonContainer: {
    position: 'absolute',
    left: 5,
    top: 3,
  },
  back: {
    color: 'rgba(255,255,255,0.5)',
  },
  topControlFullScreen: {
    color: 'rgba(255,255,255,0.5)',
  },
  topControlItems: {
    position: 'absolute',
    flexDirection: 'row',
    alignSelf: 'flex-end',
    top: 4,
    right: 0,
    flex: 1,
  },
  picker_quality: {
    height: 30,
    width: 110,
    marginTop: 2,
    color: 'rgba(255,255,255,0.5)',
    transform: [{scaleX: 1}, {scaleY: 1}],
  },
  picker_subtitle: {
    height: 30,
    width: 150,
    marginTop: 2,
    color: 'rgba(255,255,255,0.5)',
    transform: [{scaleX: 1}, {scaleY: 1}],
  },
  picker_ios: {
    height: 30,
    width: 100,
    color: 'rgba(255,255,255,1)',
  },
  fullscreen: {
    width: 30,
  },
  selectSeasonEpisode: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  pickerItem: {
    transform: [{scaleX: 0.6}, {scaleY: 0.6}],
  },
  //scroll view
  poster: {
    flexDirection: 'row',
    width: screenWidth,
    height: ((screenWidth / 3 - 10) * 424) / 300 + 25,
    backgroundColor: colors.movieItem,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 3,
    marginRight: 3,
    shadowColor: '#717a83',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    // borderWidth: 1,
    // borderRadius: 2,
    // borderColor: '#616161',
    // borderTopWidth: 0,
    // borderLeftWidth: 0,
    // borderRightWidth: 0,
    justifyContent: 'space-between',
  },
  cast: {
    flex: 1,
    width: screenWidth / 4 - 10,
    backgroundColor: colors.movieItem,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 3,
    marginRight: 3,
    shadowColor: '#717a83',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    justifyContent: 'space-around',
  },
  ImageBk_poster: {
    width: screenWidth / 3,
    height: ((screenWidth / 3 - 10) * 424) / 300,
    alignItems: 'baseline',
  },
  sustitle_content: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.4)',
    width: 50,
  },
  sustitle_: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 130,
  },
  ImageBk_cast: {
    width: screenWidth / 4 - 10,
    height: ((screenWidth / 4 - 10) * 424) / 300,

    justifyContent: 'center',
    alignItems: 'center',
  },
  ImageBk_related: {
    width: screenWidth / 2 - 10,
    height: ((screenWidth / 2 - 10) * 424) / 300,

    justifyContent: 'center',
    alignItems: 'center',
  },
  dsc: {
    width: (screenWidth * 2) / 3,
    padding: 16,
  },
  title_related: {
    color: '#f9f9f9',
    fontSize: 12,
    marginBottom: 10,
  },
  youtube_text: {
    fontSize: 12,
    color: 'white',
  },
  title: {
    color: '#f9f9f9',
    fontSize: 18,
    marginBottom: 15,
  },
  duration_h: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  item_description: {
    color: '#9f9f9f',
    fontSize: 10,
  },
  stars: {
    width: screenWidth / 4 - 10,
    backgroundColor: colors.movieItem,
    margin: 3,
    shadowColor: '#717a83',
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  chevron_left: {
    width: 30,
  },
  rating_content: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  year_: {
    fontSize: 17,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  star_name: {
    fontSize: 10,
    color: '#ffff',
  },
  rating_: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    backgroundColor: 'rgba(16, 33, 51, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  year_container: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: 'rgba(16, 33, 51, 0.8)',
  },
  star_hero: {
    fontSize: 8,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  related: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  MovieItem: {
    flex: 1,
    width: screenWidth / 2 - 10,
    backgroundColor: colors.movieItem,
    marginBottom: 20,
    shadowColor: '#717a83',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  rating: {
    flexDirection: 'row',
    flex: 1,
    position: 'absolute',
    padding: 2,
    left: 1,
    top: 1,
    backgroundColor: 'rgba(16, 33, 51, 0.9)',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 3,
  },
  ibmd_rating: {
    color: '#ffffff',
    fontSize: 15,
  },
  flag_quality: {
    color: '#9f9f9f',
    fontSize: 12,
  },
  year: {
    flexDirection: 'row',
    flex: 1,
    position: 'absolute',
    padding: 2,
    right: 1,
    bottom: 1,
    backgroundColor: 'rgba(16, 33, 51, 0.9)',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 3,
  },
  bk: {
    position: 'absolute',
    left: 3,
    top: 3,
  },
  imdb: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  year_dsc: {
    color: '#9f9f9f',
    fontSize: 15,
  },
  swiper: {
    height: ((screenWidth / 2) * 424) / 300 + 60,
    marginTop: 10,
  },
  div_header: {
    marginTop: 10,
    width: screenWidth,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  div_header_r: {
    marginTop: 20,
    marginBottom: 25,
    width: screenWidth,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  left_: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  div_txt: {
    padding: 5,
    fontSize: 18,
    color: '#9f9f9f',
  },
  sub_div_h: {
    marginTop: 10,
    marginLeft: 10,
    width: screenWidth,
  },
  cast_sub: {
    padding: 5,
    fontSize: 15,
    color: colors.textColor01,
  },
  director: {
    marginLeft: 15,
    fontSize: 12,
    color: 'rgb(50,72,200)',
  },
});
