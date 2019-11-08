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
import PlayIcon from 'react-native-vector-icons/Feather';
import StarIcon from 'react-native-vector-icons/Entypo';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import {Toast} from 'native-base';
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
          source={{uri: API.base_filter_img_latest + item.poster}}>
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
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  }
}

let numberOfRefresh = 0;

class LatestTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      isDownRefresh: false,
      isTopRefresh: false,
      dataSource: this.props.latest_data.items.collection,
      prevPage: this.props.latest_data.pagination.prev_page,
      nextPage: this.props.latest_data.pagination.next_page,
    };
  }

  fetchNextPage = () => {
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
        if (responseJson.pagination.current_page > 12) {
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
        if (this.state.dataSource.length >= 36) {
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
              index: 0,
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
          isDownRefresh: false,
          isTopRefresh: false,
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
    return fetch(this.state.prevPage + '&pp=12')
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
          numColumns={2}
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
          ListFooterComponent={this.renderFooter.bind(this)}
          onEndReachedThreshold={0.4}
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
  ImageBk: {
    width: screenWidth / 2 - 10,
    height: ((screenWidth / 2 - 10) * 424) / 300,

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
    width: screenWidth / 2 - 10,
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
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  seperate: {
    height: 2,
    width: '100%',
    backgroundColor: '#CED0CE',
  },
  indecator: {
    color: '#ffffff',
  },
});

const mapStatetoProps = ({movie: {latest_data}}) => ({
  latest_data,
});

export default connect(mapStatetoProps)(LatestTab);
