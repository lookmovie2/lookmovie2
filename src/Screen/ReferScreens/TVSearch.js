import React, {Component, PureComponent} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {SearchBar} from 'react-native-elements';
import colors from '../../config/colors';
import API from '../../config/api';
import PlayIcon from 'react-native-vector-icons/Feather';
import StarIcon from 'react-native-vector-icons/Entypo';
import {TouchableOpacity} from 'react-native-gesture-handler';
import BackHeaderNoSearch from '../Headers/BackHeaderNoSearch';

const screenWidth = Math.round(Dimensions.get('window').width);

let numberOfRefresh = 0;

class RenderItem extends PureComponent {
  render() {
    const item = this.props.item;
    return (
      <TouchableOpacity
        style={styles.movieItem}
        onPress={() => {
          this.props.navigation.navigate('TVPlay', {slug: item.slug});
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

export default class TVSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: this.props.navigation.props.state.params.searchKey,
      empty: true,
      isDownRefresh: false,
      isTopRefresh: false,
      isLoading: true,
      movie_dataSource: [],
      show_dataSource: [],
    };
  }

  async componentDidMount() {
    return fetch(API.show_search + this.state.search)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          isLoading: false,
          isDownRefresh: false,
          isTopRefresh: false,
          dataSource: responseJson.items.collection,
          prevPage: responseJson.pagination.prev_page,
          nextPage: responseJson.pagination.next_page,
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  fetchAPI = () => {
    const search = this.state.search;
    if (search < 1) {
      return;
    }
    this.setState({isLoading: true});
    return fetch(API.show_search + this.state.search)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          isLoading: false,
          isDownRefresh: false,
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

  fetchNextPage = () => {
    if (this.state.nextPage === '') {
      return;
    }
    return fetch(this.state.nextPage)
      .then(response => response.json())
      .then(responseJson => {
        this.setState(
          {
            isLoading: false,
            isDownRefresh: false,
            isTopRefresh: false,
            dataSource: responseJson.items.collection,
            prevPage: responseJson.pagination.prev_page,
            nextPage: responseJson.pagination.next_page,
          },
          function() {
            this.flatListRef.scrollToIndex({
              animated: false,
              index: 0,
              viewOffset: 0,
              viewPosition: 0,
            });
          },
        );
      })
      .catch(error => {
        console.error(error);
      });
  };

  fetchPrevPage = () => {
    if (this.state.prevPage === '') {
      this.setState({isTopRefresh: false});
      return;
    }
    return fetch(this.state.prevPage)
      .then(response => response.json())
      .then(responseJson => {
        // Alert.alert(this.state.dataSource.length);
        this.setState(
          {
            isLoading: false,
            isFetch: false,
            isTopRefresh: false,
            dataSource: responseJson.items.collection,
            prevPage: responseJson.pagination.prev_page,
            nextPage: responseJson.pagination.next_page,
          },
          function() {
            // Alert.alert(this.state.dataSource.length);
            // this.flatListRef.scrollToEnd();
          },
        );
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
    return <ActivityIndicator size="large" style={styles.indicator} />;
  };

  renderSeparator = () => {
    return <View style={styles.separator} />;
  };

  updateSearch = search => {
    this.setState({search}, () => {
      if (search.length > 1) {
        this.fetchAPI();
      }
    });
  };
  render() {
    const {search} = this.state;
    return (
      <View style={styles.container}>
        <BackHeaderNoSearch {...this.props} />
        <SearchBar
          containerStyle={{
            backgroundColor:
              Platform.OS === 'ios'
                ? colors.contentColor
                : colors.searchContainColor,
          }}
          platform={Platform.OS === 'ios' ? 'ios' : 'android'}
          placeholder="Type Here..."
          onChangeText={this.updateSearch}
          value={search}
        />
        <FlatList
          contentContainerStyle={styles.contentContainer}
          numColumns={2}
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
    backgroundColor: colors.contentColor,
  },
  total: {
    fontSize: 20,
    textAlign: 'center',
    color: '#fff',
    padding: 10,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  ImageBk: {
    width: screenWidth / 2 - 10,
    height: ((screenWidth / 2 - 10) * 424) / 300,

    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    height: 2,
    width: '100%',
    backgroundColor: '#CED0CE',
  },
  title: {
    padding: 10,
    color: '#9f9f9f',
    fontSize: 10,
  },
  indicator: {
    color: '#ffffff',
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
});
