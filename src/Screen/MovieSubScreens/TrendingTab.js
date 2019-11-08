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
import {connect} from 'react-redux';
import {TouchableOpacity} from 'react-native-gesture-handler';
import PlayIcon from 'react-native-vector-icons/Feather';
import StarIcon from 'react-native-vector-icons/Entypo';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import API from '../../config/api';
import colors from '../../config/colors';

const screenWidth = Math.round(Dimensions.get('window').width);

class RenderItem extends PureComponent {
  render() {
    const {item} = this.props.item_data;
    return (
      <TouchableOpacity
        style={styles.movieItem}
        onPress={() => {
          this.props.navigation.navigate('Play', {slug: item.slug});
        }}>
        <ImageBackground
          style={styles.ImageBk}
          resizeMode={'cover'}
          source={{uri: API.base_filter_img + item.poster}}>
          <PlayIcon
            name="play-circle"
            color="rgba(255,255,255,0.7)"
            size={35}
          />
          <View style={styles.rating}>
            <StarIcon name="star" color="#cccc00" size={12} />
            <Text style={styles.ibmd_rating}>{item.imdb_rating}</Text>
            <Text style={styles.flag_quality}>/{item.flag_quality}</Text>
          </View>
          <View style={styles.year}>
            <Text style={styles.year_dsc}>{item.year}</Text>
          </View>
        </ImageBackground>
        <Text style={styles.title}>{item.title}</Text>
      </TouchableOpacity>
    );
  }
}

class SliderItem extends PureComponent {
  render() {
    const mv = this.props.mv;
    return (
      <View style={styles.MovieItem}>
        <Text style={styles.header}>{mv.title}</Text>
        <ImageBackground
          style={styles.ImageBk_Header}
          resizeMode={'cover'}
          source={{uri: API.base_home_img + mv.backdrop}}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('Play', {slug: mv.slug});
            }}>
            <PlayIcon
              name="play-circle"
              color="rgba(255,255,255,0.8)"
              size={60}
            />
          </TouchableOpacity>
          <View style={styles.rating_h}>
            <StarIcon name="star" color="#cccc00" size={14} />
            <Text style={styles.ibmd_rating_h}>{mv.imdb_rating}</Text>
            <Text style={styles.flag_quality_h}>/{mv.flag_quality}</Text>
          </View>
          <View style={styles.year_h}>
            <Text style={styles.year_dsc_h}>{mv.year}</Text>
          </View>
          <View style={styles.genres_h}>
            <Text style={styles.year_dsc_h}>{mv.genres}</Text>
          </View>
        </ImageBackground>
        <Text style={styles.description} numberOfLines={2}>
          {mv.description}
        </Text>
        <TouchableOpacity style={styles.watchMovie}>
          <Text style={styles.watchMovieItem}>Watch now</Text>
          <Icon name="chevron-right" size={50} style={styles.watchMovieItem} />
        </TouchableOpacity>
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

  fetchNextPage = () => {
    return fetch(this.state.nextPage + '&pp=30')
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
        if (this.state.dataSource.length >= 90) {
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
    return fetch(this.state.prevPage + '&pp=30')
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
    if (this.state.end) {
      return;
    }
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
    if (this.state.start) {
      return;
    }
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
          dotColor={colors.navBarColor}
          activeDotColor={colors.textColor01}>
          {dataSliderSource.map((mv, index) => {
            return <SliderItem mv={mv} key={index} {...this.props} />;
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

  render() {
    const dataSource = this.state.dataSource;
    return (
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={styles.contentContainer}
          numColumns={3}
          data={dataSource}
          extraData={dataSource}
          renderItem={(item, index) => (
            <RenderItem key={index} item_data={item} {...this.props} />
          )}
          keyExtractor={(item, index) => {
            return index;
          }}
          refreshing={this.state.isTopRefresh}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={this.renderHeader.bind(this)}
          ListFooterComponent={this.renderFooter.bind(this)}
          onEndReachedThreshold={0.5}
          onRefresh={this.handleTopRefresh.bind(this)}
          onEndReached={this.handleDownRefresh.bind(this)}
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
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    width: screenWidth,
    height: 450,
  },
  indecator: {
    color: '#ffffff',
  },
  ImageBk: {
    width: screenWidth / 3 - 10,
    height: ((screenWidth / 3 - 10) * 424) / 300,

    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    padding: 10,
    color: '#9f9f9f',
    fontSize: 10,
  },
  movieItem: {
    flex: 1,
    width: screenWidth / 3 - 10,
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
  },
  rating_h: {
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
  ibmd_rating_h: {
    color: '#ffffff',
    fontSize: 20,
  },
  flag_quality_h: {
    color: '#9f9f9f',
    fontSize: 18,
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
  year_dsc: {
    color: '#9f9f9f',
    fontSize: 10,
  },
  year_dsc_h: {
    color: '#9f9f9f',
    fontSize: 15,
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
  wrapper: {
    height: 50,
    backgroundColor: 'white',
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
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
  seperate: {
    height: 2,
    width: '100%',
    backgroundColor: '#CED0CE',
  },
});

const mapStatetoProps = ({movie: {treding_data}}) => ({
  treding_data,
});

export default connect(mapStatetoProps)(TrendingTab);
