import React, {Component, PureComponent} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import {Slider} from 'react-native-elements';
import {Picker} from 'native-base';
import ProgressBar from 'react-native-progress/Bar';
import API from '../../../config/api';
import colors from '../../../config/colors';
import PlayIcon from 'react-native-vector-icons/Feather';
import StarIcon from 'react-native-vector-icons/Entypo';
import {TouchableOpacity, ScrollView} from 'react-native-gesture-handler';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Orientation from 'react-native-orientation-locker';
import Video from 'react-native-video';
import {StatusBar} from 'react-native';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

class CastItem extends PureComponent {
  render() {
    const item = this.props.item;
    return (
      <View style={styles.stars}>
        <Image
          style={styles.ImageBk_cast}
          source={{
            uri:
              item.picture_url === ''
                ? API.cast
                : API.base_filter_img + item.picture_url,
          }}
        />
        <Text style={styles.star_name}>{item.name}</Text>
        <Text style={styles.star_hero}>{item.hero}</Text>
      </View>
    );
  }
}

class SwipeItem extends PureComponent {
  render() {
    const index = this.props.index;
    const data = this.props.data;
    return (
      <View style={styles.related}>
        <View style={styles.MovieItem}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.pop();
              this.props.navigation.navigate('Play', {slug: data[index].slug});
            }}>
            <ImageBackground
              style={styles.ImageBk_related}
              resizeMode={'cover'}
              source={{
                uri: API.base_play_img + data[index].poster,
              }}>
              <View style={styles.rating}>
                <StarIcon name="star" color="#cccc00" size={15} />
                <Text style={styles.ibmd_rating}>
                  {data[index].imdb_rating}
                </Text>
                <Text style={styles.flag_quality}>
                  /{data[index].flag_quality}
                </Text>
              </View>
              <View style={styles.year_}>
                <Text style={styles.year_dsc}>{data[index].year}</Text>
              </View>
            </ImageBackground>
            <Text style={styles.title_related} numberOfLines={1}>
              {data[index].title}
            </Text>
          </TouchableOpacity>
        </View>
        {index + 1 < data.length && (
          <View style={styles.MovieItem}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.pop();
                this.props.navigation.navigate('Play', {
                  slug: data[index + 1].slug,
                });
              }}>
              <ImageBackground
                style={styles.ImageBk_related}
                resizeMode={'cover'}
                source={{
                  uri: API.base_play_img + data[index + 1].poster,
                }}>
                <View style={styles.rating}>
                  <StarIcon name="star" color="#cccc00" size={12} />
                  <Text style={styles.ibmd_rating}>
                    {data[index + 1].imdb_rating}
                  </Text>
                  <Text style={styles.flag_quality}>
                    /{data[index + 1].flag_quality}
                  </Text>
                </View>
                <View style={styles.year_}>
                  <Text style={styles.year_dsc}>{data[index + 1].year}</Text>
                </View>
              </ImageBackground>
              <Text style={styles.title_related} numberOfLines={1}>
                {data[index + 1].title}
              </Text>
            </TouchableOpacity>
          </View>
        )}
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

export default class AndroidVideo extends Component {
  constructor(props) {
    super(props);

    this.state = this.props.state;
    this.state.isSliding = false;
  }

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
    this.setState({
      videoWidth: screenHeight,
      videoHeight: screenWidth,
    });
    Orientation.lockToLandscape();
  };
  exitFullScreen = () => {
    StatusBar.setHidden(false, true);
    this.setState({
      videoWidth: screenWidth,
      videoHeight: 250,
    });
    Orientation.lockToPortrait();
  };

  handleSubtitleChange = (itemValue, itemIndex) => {
    if (itemIndex === 0) {
      this.setState({
        selectedSubtitle: itemValue,
        currentSubtitle: {type: 'title', value: ''},
      });
    } else {
      this.setState(
        {
          selectedSubtitle: itemValue,
          currentSubtitle: {
            type: 'title',
            value: itemValue,
          },
        },
        () => {
          console.log('subtitle', this.state.currentSubtitle);
        },
      );
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
    const currentTime = this.state.currentTime;
    this.setState(
      {
        videoLoading: false,
        currentTime: e.currentTime,
        duration: e.duration,
      },
      () => {
        if (currentTime != null && currentTime !== 0) {
          this.player.seek(currentTime);
        }
      },
    );
  };
  onLoadStart = data => {
    this.setState({videoLoading: true});
  };

  playYoutube = () => {
    this.setState({paused: true});
    this.props.navigation.navigate('Youtube', {
      youtubeId: this.state.meta.youtube,
      youtubeTitle: this.state.meta.title,
      youtubeDesc: this.state.meta.description,
    });
  };

  onSelectedQualityChange = selectedQualityItem => {
    this.setState({selectedQualityItem}, () => {
      this.setState({
        currentPlayUri: selectedQualityItem[0],
      });
    });
  };

  imageBKstyle = () => {
    return {
      width: this.state.videoWidth,
      height: this.state.videoHeight,
      alignItems: 'center',
      justifyContent: 'center',
    };
  };

  videoStyle = () => {
    return {
      width: this.state.videoWidth,
      height: this.state.videoHeight,
      backgroundColor: 'black',
    };
  };

  videoLoading = () => {
    return {
      position: 'absolute',
      left: this.state.videoWidth / 2 - 20,
      top: this.state.videoHeight / 2 - 20,
    };
  };

  back = () => {
    this.props.navigation.pop();
    Orientation.lockToPortrait();
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
    return (
      <View style={styles.container}>
        {this.state.init && (
          <View>
            <ImageBackground
              style={this.imageBKstyle()}
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
              <TouchableOpacity
                onPress={() => {
                  this.back();
                }}>
                <Icon name="chevron-left" size={35} style={styles.leftButton} />
              </TouchableOpacity>
            </View>
            <View style={styles.yearContainer}>
              <Text style={styles.year_}>{this.state.meta.year}</Text>
            </View>
            <View style={styles.ratingContainer}>
              <Text style={styles.imdb}>IMDB</Text>
              <Text style={styles.ibmdRating}>
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
                style={this.videoStyle()}
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
                style={this.videoLoading()}
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
                    <Picker.Item label="Subtitle" value="" />
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
                  <Picker
                    selectedValue={this.state.SelectedQuality}
                    style={styles.picker_quality}
                    itemStyle={styles.pickerItem}
                    onValueChange={this.handleQualityChange}>
                    {this.state.qualities.map((item, index) => {
                      return (
                        <Picker.Item
                          key={index}
                          label={item}
                          value={this.state.streamUrls[index]}
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
        <ScrollView>
          <View style={styles.poster}>
            <View style={{width: screenWidth / 3}}>
              <Image
                style={styles.ImageBk_poster}
                source={{uri: API.base_filter_img + this.state.meta.poster}}
              />
              <TouchableOpacity
                onPress={this.playYoutube}
                style={styles.watchTailerContainer}>
                <Text style={styles.watchTailer}>WATCH TRAILER</Text>
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
                    <CastItem key={index} item={item} {...this.props} />;
                  }
                })}
              </ScrollView>
              <View style={styles.sub_div_h}>
                <Text style={styles.cast_sub}>Directors:</Text>
                <Text style={styles.director}>{this.state.director}</Text>
              </View>
            </View>
          )}
          {this.state.tm_related.length > 0 && (
            <View>
              <View style={styles.div_header_r}>
                <Text style={styles.div_txt}>YOU MAY ALSO LIKE:</Text>
              </View>
              <Swiper
                showsButtons={false}
                autoplay={true}
                dotColor={colors.navBarColor}
                activeDotColor={colors.textColor01}
                style={styles.swiper}>
                {this.state.tm_related.map(index => {
                  return (
                    <SwipeItem
                      key={index}
                      index={index}
                      data={this.state.related}
                      {...this.props}
                    />
                  );
                })}
              </Swiper>
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
  pickerItem: {
    transform: [{scaleX: 0.6}, {scaleY: 0.6}],
  },
  qualityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 130,
  },
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
    justifyContent: 'space-between',
  },
  backstyle: {
    width: 50,
    marginTop: 3,
    marginLeft: 3,
  },
  paybuttonContainer: {
    width: 50,
    marginTop: 3,
    marginLeft: 5,
  },
  yearContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: 'rgba(16, 33, 51, 0.8)',
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
  imd: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  ImageBk_poster: {
    width: screenWidth / 3,
    height: ((screenWidth / 3 - 10) * 424) / 300,
    alignItems: 'baseline',
  },
  subtitles: {
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
  backward: {
    width: 100,
    alignItems: 'center',
  },
  forward: {
    width: 100,
    alignItems: 'center',
  },
  ImageBk_related: {
    width: screenWidth / 2 - 10,
    height: ((screenWidth / 2 - 10) * 424) / 300,

    justifyContent: 'center',
    alignItems: 'center',
  },
  ibmdRating: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  dsc: {
    width: (screenWidth * 2) / 3,
    padding: 16,
  },
  year: {
    fontSize: 17,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  title_related: {
    color: '#f9f9f9',
    fontSize: 12,
    marginBottom: 10,
  },
  subTitleContent: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.4)',
    width: 50,
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
  quality: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.4)',
    width: 50,
  },
  star_name: {
    fontSize: 10,
    color: '#ffff',
  },
  star_hero: {
    fontSize: 8,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  fullScreen: {
    width: 50,
    marginTop: 3,
    marginRight: 5,
    alignItems: 'flex-end',
  },
  related: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  watchTailer: {
    fontSize: 12,
    color: 'white',
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
  watchTailerContainer: {
    width: screenWidth / 3,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff1000',
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
  year_: {
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
  ratingContainer: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    backgroundColor: 'rgba(16, 33, 51, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
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
