import React, {Component, PureComponent} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {Toast} from 'native-base';
import PlayIcon from 'react-native-vector-icons/Feather';
import StarIcon from 'react-native-vector-icons/Entypo';
import {TouchableOpacity, ScrollView} from 'react-native-gesture-handler';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';

import API from '../../config/api';
import colors from '../../config/colors';

const screenWidth = Math.round(Dimensions.get('window').width);

class SwiperItem extends PureComponent {
  render() {
    const tv = this.props.tv;
    return (
      <View key={tv.id_movie} style={styles.MovieItem}>
        <Text style={styles.header}>{tv.title}</Text>
        <ImageBackground
          style={styles.ImageBk_Header}
          resizeMode={'cover'}
          source={{uri: API.base_home_img + tv.backdrop}}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('TVPlay', {slug: tv.slug});
            }}>
            <PlayIcon
              name="play-circle"
              color="rgba(255,255,255,0.8)"
              size={60}
            />
          </TouchableOpacity>
          <View style={styles.rating_s}>
            <StarIcon name="star" color="#cccc00" size={14} />
            <Text style={styles.ibmd_rating_h}>{tv.imdb_rating}</Text>
          </View>
          <View style={styles.year_s}>
            <Text style={styles.year_dsc_h}>{tv.year}</Text>
          </View>
          <View style={styles.genres_s}>
            <Text style={styles.year_dsc_h}>{tv.genres}</Text>
          </View>
        </ImageBackground>
        <Text style={styles.description} numberOfLines={2}>
          {tv.description}
        </Text>
        <TouchableOpacity
          style={styles.watchMovie}
          onPress={() => {
            this.props.navigation.navigate('TVPlay', {slug: tv.slug});
          }}>
          <Text style={styles.watchMovieItem}>Watch now</Text>
          <Icon
            name="chevron-right"
            size={70}
            color="rgba(231,76,60,0.8)"
            style={styles.watchMovieItem}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

class RenderItem extends PureComponent {
  render() {
    const item = this.props.item;
    return (
      <View style={styles.movieItem}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('TVPlay', {slug: item.slug});
          }}>
          <ImageBackground
            style={styles.ImageBk}
            resizeMode={'cover'}
            source={{
              uri: API.base_filter_img + item.poster,
            }}
          />
        </TouchableOpacity>

        <View style={styles.dsc}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.rating_h}>
            <Text style={styles.item_header}>Rating: </Text>
            <StarIcon name="star" color="#cccc00" size={14} />
            <Text style={styles.ibmd_rating_h}>{item.imdb_rating}</Text>
          </View>
          <View style={styles.generes_i}>
            <Text style={styles.item_header}>Genres: </Text>
            <View style={styles.generesContainer}>
              {JSON.parse(item.genres).map((genres_i, g_index, array) => {
                if (g_index === 0) {
                  return (
                    <Text key={g_index} style={styles.ibmd_rating_h}>
                      genres_i.title
                    </Text>
                  );
                }
                return (
                  <Text key={g_index} style={styles.ibmd_rating_h}>
                    , generes_i.title
                  </Text>
                );
              })}
            </View>
          </View>
          <ScrollView>
            <Text style={styles.item_description}>{item.description}</Text>
          </ScrollView>
        </View>
      </View>
    );
  }
}

let numberOfRefresh = 0;

class TrendingTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      isDownRefresh: false,
      isTopRefresh: false,
      dataSliderSource: this.props.treding_data.featured_items.collection,
      dataSource: this.props.treding_data.items.collection,
      prevPage: this.props.treding_data.pagination.prev_page,
      nextPage: this.props.treding_data.pagination.next_page,
    };
  }

  back = () => {
    this.setState({isLoading: true, isFetch: false});
    return new Promise(resolve =>
      setTimeout(() => {
        this.setState({isLoading: false});
      }, 2000),
    );
  };

  fetchNextPage = () => {
    if (this.state.nextPage === '') {
      this.setState({isDownRefresh: false});
      return;
    }
    return fetch(this.state.nextPage + '&pp=15')
      .then(response => response.json())
      .then(responseJson => {
        if (
          responseJson.pagination.current_page >=
          responseJson.pagination.total_pages
        ) {
          this.setState({
            end: true,
          });
        }
        if (responseJson.pagination.current_page > 2) {
          this.setState({
            start: false,
          });
        } else {
          this.setState({
            start: true,
          });
        }
        var dataSource = [];
        var prevPage = this.state.prevPage;
        if (this.state.dataSource.length >= 45) {
          dataSource = responseJson.items.collection;
          prevPage = responseJson.pagination.prev_page;
          Toast.show({
            text: 'Refreshed with a new page...',
            position: 'top',
            duration: 4000,
          });
          setTimeout(() => {
            this.flatListRef.scrollToIndex({
              animated: true,
              index: 2,
              viewOffset: 0,
              viewPosition: 0,
            });
          }, 1000);
        } else {
          dataSource = this.state.dataSource.concat(
            responseJson.items.collection,
          );
        }
        this.setState({
          isLoading: false,
          isFetch: false,
          isDownRefresh: false,
          dataSource: dataSource,
          prevPage: prevPage,
          nextPage: responseJson.pagination.next_page,
        });
      })
      .catch(error => {
        console.error(error);
      });
  };

  fetchPrevPage = () => {
    if (this.state.start) {
      this.setState({isTopRefresh: false});
      return;
    }
    return fetch(this.state.prevPage + '&pp=15')
      .then(response => response.json())
      .then(responseJson => {
        if (
          responseJson.pagination.current_page <
          responseJson.pagination.total_pages
        ) {
          this.setState({
            end: false,
          });
        } else {
          this.setState({
            end: true,
          });
        }
        if (responseJson.pagination.current_page > 2) {
          this.setState({
            start: false,
          });
        } else {
          this.setState({
            start: true,
          });
        }
        Toast.show({
          text: 'Refreshed with a previous page...',
          position: 'top',
          duration: 4000,
        });
        this.setState({
          isLoading: false,
          isFetch: false,
          isTopRefresh: false,
          dataSource: responseJson.items.collection,
          prevPage: responseJson.pagination.prev_page,
          nextPage: responseJson.pagination.next_page,
        });
      })
      .catch(error => {
        console.error(error);
      });
  };

  handleDownRefresh = () => {
    this.setState(
      {
        isDownRefresh: true,
      },
      () => {
        if (++numberOfRefresh > 1) {
          this.fetchNextPage();
          numberOfRefresh = 0;
        }
      },
    );
  };
  handleTopRefresh = () => {
    this.setState(
      {
        isTopRefresh: true,
      },
      () => {
        this.fetchPrevPage();
      },
    );
  };

  renderHeader = () => {
    const dataSliderSource = this.state.dataSliderSource;
    return (
      <View style={styles.headerContainer}>
        <Swiper
          showsButtons={false}
          autoplay={true}
          autoplayTimeout={5}
          dotColor={colors.navBarColor}
          activeDotColor={colors.textColor01}>
          {dataSliderSource.map((tv, index) => {
            return <SwiperItem tv={tv} key={index} {...this.props} />;
          })}
        </Swiper>
      </View>
    );
  };

  renderFooter = () => {
    if (!this.state.isDownRefresh) {
      return null;
    }
    return <ActivityIndicator size="large" style={styles.indecator} />;
  };

  renderSeparator = () => {
    return <View style={styles.seperate} />;
  };

  onSelectedGenresChange = selectedGenresItems => {
    this.setState({selectedGenresItems});
  };
  onSelectedYearsChange = selectedYearItems => {
    this.setState({selectedYearItems});
  };
  onSelectedRatingChange = selectedRatingItems => {
    this.setState({selectedRatingItems});
  };
  onSelectedSoChange = selectedSoItems => {
    this.setState({selectedSoItems});
  };
  render() {
    return (
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={styles.flatContainer}
          numColumns={1}
          data={this.state.dataSource}
          extraData={this.state.dataSource}
          renderItem={({item, index}) => (
            <RenderItem key={index} item={item} {...this.props} />
          )}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          refreshing={this.state.isTopRefresh}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={this.renderHeader.bind(this)}
          ListFooterComponent={this.renderFooter.bind(this)}
          onEndReachedThreshold={0.4}
          onEndReached={this.handleDownRefresh.bind(this)}
          onRefresh={this.handleTopRefresh.bind(this)}
          ref={ref => {
            this.flatListRef = ref;
          }}
        />
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
  rating_h: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  more: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'absolute',
    right: 2,
    bottom: 2,
  },
  generes_i: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 5,
  },
  ibmd_rating_h: {
    color: '#ffffff',
    fontSize: 10,
  },
  item_header: {
    color: '#ffffff',
    fontSize: 13,
    width: 60,
  },
  flag_quality_h: {
    color: '#9f9f9f',
    fontSize: 15,
  },
  item_description: {
    color: '#9f9f9f',
    fontSize: 10,
    width: (screenWidth * 2) / 3 - 70,
    marginTop: 5,
  },
  year_h: {
    flexDirection: 'row',
    flex: 1,
    position: 'absolute',
    padding: 2,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(16, 33, 51, 0.9)',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  genres_h: {
    flexDirection: 'row',
    flex: 1,
    position: 'absolute',
    padding: 2,
    right: 0,
    top: 0,
    backgroundColor: 'rgba(16, 33, 51, 0.9)',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  year_dsc_h: {
    color: '#9f9f9f',
    fontSize: 15,
  },

  ImageBk: {
    width: screenWidth / 3,
    height: ((screenWidth / 3 - 10) * 424) / 300,

    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#f9f9f9',
    fontSize: 17,
    marginBottom: 10,
  },
  movieItem: {
    flexDirection: 'row',
    width: screenWidth,
    height: ((screenWidth / 3 - 10) * 424) / 300,
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
  picker: {
    margin: 5,
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
  flatContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ibmd_rating: {
    color: '#ffffff',
    fontSize: 13,
  },
  flag_quality: {
    color: '#9f9f9f',
    fontSize: 10,
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
  year_dsc: {
    color: '#9f9f9f',
    fontSize: 10,
  },
  buttons: {
    flexDirection: 'row',
    flex: 1,
    position: 'absolute',
    bottom: 0,
    width: screenWidth,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  dsc: {
    width: (screenWidth * 2) / 3,
    padding: 16,
  },
  indecator: {
    color: '#ffffff',
  },
  season: {
    marginTop: 20,
    color: '#9f9f9f',
    fontSize: 15,
  },
  generesContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  s_dsc: {
    marginTop: 5,
    color: '#8f8f8f',
    fontSize: 12,
  },
  air_year: {
    fontSize: 10,
    textAlign: 'center',
    backgroundColor: '#32485e',
    width: 30,
    color: '#ffff',
  },
  air_month: {
    fontSize: 10,
    textAlign: 'center',
    backgroundColor: '#32485e',
    width: 30,
    color: '#ffff',
  },
  air_date: {
    fontSize: 10,
    textAlign: 'center',
    backgroundColor: '#9f9f9f',
    width: 30,
    color: '#000000',
  },
  date: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  MovieItem: {
    flex: 1,
    backgroundColor: colors.movieItem,
    marginBottom: 20,
    shadowColor: '#717a83',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  ImageBk_Header: {
    width: screenWidth,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 10,
    color: '#4280bf',
    fontSize: 20,
  },
  description: {
    padding: 10,
    color: '#9e9e9e',
    fontSize: 16,
  },
  headerContainer: {
    width: screenWidth,
    height: 450,
  },
  watchMovie: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#616161',
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  watchMovieItem: {
    paddingBottom: 18,
    paddingTop: 18,
    paddingRight: 10,
    paddingLeft: 10,
    color: 'rgba(231,76,60,0.8)',
    fontSize: 13,
  },
  rating_s: {
    flexDirection: 'row',
    flex: 1,
    position: 'absolute',
    padding: 2,
    left: 0,
    top: 0,
    backgroundColor: 'rgba(16, 33, 51, 0.9)',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ibmd_rating_s: {
    color: '#ffffff',
    fontSize: 20,
  },
  year_s: {
    flexDirection: 'row',
    flex: 1,
    position: 'absolute',
    padding: 2,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(16, 33, 51, 0.9)',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  genres_s: {
    flexDirection: 'row',
    flex: 1,
    position: 'absolute',
    padding: 2,
    right: 0,
    top: 0,
    backgroundColor: 'rgba(16, 33, 51, 0.9)',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  seperate: {
    height: 2,
    width: '100%',
    backgroundColor: '#CED0CE',
  },
});

const mapStatetoProps = ({tv: {treding_data}}) => ({
  treding_data,
});

export default connect(mapStatetoProps)(TrendingTab);
