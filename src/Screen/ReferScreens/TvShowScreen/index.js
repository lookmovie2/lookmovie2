import React, {Component} from 'react';
import {Platform, Dimensions, BackHandler, Alert} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import ProgressScreen from '../../ReferScreens/ProgressScreen';
import API from '../../../config/api';
import {TextTrackType} from 'react-native-video';
import ISO6391 from 'iso-639-1';
import BackHeaderNoSearch from '../../Headers/BackHeaderNoSearch';
import {Container} from 'native-base';
import AndroidTV from './AndroidTV';
import IosTV from './IosTV';

const screenWidth = Math.round(Dimensions.get('window').width);

export default class index extends Component {
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
      selectedItems: [],
      itemsShow: [],
    };
  }

  componentDidMount() {
    return fetch(API.tvShow + this.props.navigation.state.params.slug)
      .then(response => response.json())
      .then(responseJson => {
        var selected = '';
        if (!responseJson.success) {
          return;
        } else {
          let itemsShow = [];
          for (var i in responseJson.seasons) {
            var episodes = [];
            for (var j in responseJson.seasons[i].episodes) {
              if (selected === '') {
                selected = responseJson.seasons[i].episodes[j].id_episode;
              }
              episodes.push({
                id: responseJson.seasons[i].episodes[j].id_episode,
                name: 'SEASON ' + i + ' - ' + 'EPISODE ' + j,
              });
            }
            itemsShow.push({
              name: 'SEASON' + i,
              id: i,
              children: episodes,
            });
          }
          this.setState(
            {
              meta: responseJson.meta,
              cast: JSON.parse(responseJson.meta.cast),
              seasons: responseJson.seasons,
              selectedItems: [selected],
              itemsShow: itemsShow,
            },
            function() {
              return fetch(API.tv_tokenExpires + this.state.meta.id_show).then(
                response =>
                  response.json().then(responseJson_auth => {
                    if (!responseJson_auth.success) {
                      return;
                    } else {
                      this.setState(
                        {
                          expires: responseJson_auth.data.expires,
                          accessToken: responseJson_auth.data.accessToken,
                          currentPlayUri:
                            API.show_stream +
                            responseJson_auth.data.accessToken +
                            '/' +
                            responseJson_auth.data.expires +
                            '/' +
                            this.state.selectedItems[0] +
                            '/master.m3u8',
                        },
                        () => {
                          return fetch(
                            API.show_subtitle + this.state.selectedItems[0],
                          ).then(response_sub =>
                            response_sub.json().then(responseJson_sub => {
                              const textTracks = [];
                              for (i = 0; i < responseJson_sub.length; i++) {
                                console.log('fetch', responseJson_sub[i]);
                                const code = ISO6391.getCode(
                                  responseJson_sub[i].languageName,
                                );
                                if (code === '') {
                                  continue;
                                }
                                textTracks.push({
                                  title: responseJson_sub[i].languageName,
                                  language: code,
                                  type: TextTrackType.VTT,
                                  uri: responseJson_sub[i].url,
                                });
                              }
                              this.setState({
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
        // this.setState({
        //   isLoading: false,
        // });
        console.error(error);
      });
  }

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
          <AndroidTV
            state={this.state}
            {...this.props}
            imageBKstyle={this.imageBKstyle}
            videoLoad={this.videoLoad}
          />
        )}
        {Platform.OS === 'ios' && <IosTV state={this.state} {...this.props} />}
      </Container>
    );
  }
}
