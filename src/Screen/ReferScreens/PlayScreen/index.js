import React, {Component} from 'react';
import {Platform, Dimensions, BackHandler} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import ProgressScreen from '../ProgressScreen';
import {Container} from 'native-base';
import API from '../../../config/api';
import {TextTrackType} from 'react-native-video';
import ISO6391 from 'iso-639-1';
import BackHeaderNoSearch from '../../Headers/BackHeaderNoSearch';
import AndroidVideo from './AndroidVideo';
import IosVideo from './IosVideo';

const screenWidth = Math.round(Dimensions.get('window').width);

var itemQualities = [
  {
    name: 'Qualities',
    id: 1,
    children: [],
  },
];

export default class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      screenWidth: Dimensions.get('window').width,
      heightScaled: null,
      opacityTopControls: false,
      selectedSubtitle: '',
      SelectedQuality: '',
      videoWidth: screenWidth,
      videoHeight: 250,
      currentPlayUri: '',
      director: '',
      currentTime: 0,
      init: true,
    };
  }

  async componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );
    console.log(API.play + this.props.navigation.state.params.slug);
    return fetch(API.play + this.props.navigation.state.params.slug)
      .then(response => response.json())
      .then(responseJson => {
        if (!responseJson.success) {
          return;
        } else {
          const subtitles = [];
          for (var i in responseJson.subtitles) {
            subtitles.push(responseJson.subtitles[i]);
          }
          // subtitles.reverse();
          this.setState(
            {
              meta: responseJson.meta,
              cast: JSON.parse(responseJson.meta.cast),
              subtitles: subtitles,
              related: responseJson.related,
            },
            function() {
              const tm_related = [];
              for (i = 0; i < this.state.related.length; i += 2) {
                tm_related.push(i);
              }
              this.setState({tm_related: tm_related});

              var director = '';
              for (i = 0; i < this.state.cast.length; i++) {
                if (this.state.cast[i].role === 'director') {
                  if (director !== '') {
                    director += ', ';
                  }
                  director += this.state.cast[i].name;
                }
              }
              this.setState({director: director});

              return fetch(API.tokenExpires + this.state.meta.id_movie).then(
                response =>
                  response.json().then(responseJson_auth => {
                    if (!responseJson_auth.success) {
                      return;
                    } else {
                      this.setState(
                        {
                          expires: responseJson_auth.expires,
                          accessToken: responseJson_auth.accessToken,
                        },
                        function() {
                          return fetch(
                            API.stream +
                              this.state.meta.id_movie +
                              '/' +
                              responseJson_auth.expires +
                              '/' +
                              responseJson_auth.accessToken +
                              '/master.m3u8',
                          ).then(response_url =>
                            response_url.json().then(responseJson_url => {
                              const streamUrls = [];
                              const qualities = [];
                              itemQualities = [
                                {
                                  name: 'Qualities',
                                  id: 1,
                                  children: [],
                                },
                              ];
                              let currentPlayUri = null;
                              let SelectedQuality = null;
                              for (var index in responseJson_url) {
                                qualities.push(index);
                                streamUrls.push(responseJson_url[index]);
                                itemQualities[0].children.push({
                                  id: responseJson_url[index],
                                  name: index,
                                });
                                console.log(index);
                                if (index === '480p') {
                                  SelectedQuality = responseJson_url[index];
                                  currentPlayUri = responseJson_url[index];
                                }
                              }
                              console.log(SelectedQuality, currentPlayUri);
                              if (SelectedQuality == null) {
                                SelectedQuality =
                                  streamUrls[qualities.length - 1];
                                currentPlayUri =
                                  streamUrls[qualities.length - 1];
                              }

                              const textTracks = [];
                              for (
                                i = 0;
                                i < this.state.subtitles.length;
                                i++
                              ) {
                                const code = ISO6391.getCode(
                                  this.state.subtitles[i].language,
                                );
                                if (code === '') {
                                  continue;
                                }
                                const subtitleItem =
                                  API.root_track +
                                  '/' +
                                  this.state.accessToken +
                                  '/' +
                                  this.state.expires +
                                  this.state.meta.shard_url +
                                  this.state.subtitles[i].url;
                                textTracks.push({
                                  title: this.state.subtitles[i].language,
                                  language: code,
                                  type: TextTrackType.VTT,
                                  uri: subtitleItem,
                                });
                              }
                              this.setState({
                                currentPlayUri: currentPlayUri,
                                SelectedQuality: SelectedQuality,
                                qualities: qualities,
                                streamUrls: streamUrls,
                                textTracks: textTracks,
                                isLoading: false,
                              });
                            }),
                          );
                        },
                      );
                    }
                  }),
              );
            },
          );
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  handleBackPress = () => {
    // this.goBack(); // works best when the goBack is async
    this.props.navigation.pop();
    Orientation.lockToPortrait();
    return true;
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
      <Container>
        {Platform.OS === 'android' && (
          <AndroidVideo
            state={this.state}
            {...this.props}
            imageBKstyle={this.imageBKstyle}
            videoLoad={this.videoLoad}
          />
        )}
        {Platform.OS === 'ios' && (
          <IosVideo state={this.state} {...this.props} />
        )}
      </Container>
    );
  }
}
