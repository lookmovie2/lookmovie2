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
import {TouchableOpacity} from 'react-native-gesture-handler';
import {connect} from 'react-redux';

import API from '../../config/api';
import colors from '../../config/colors';

const screenWidth = Math.round(Dimensions.get('window').width);

const months = {
  '01': 'January',
  '02': 'February',
  '03': 'March',
  '04': 'April',
  '05': 'May',
  '06': 'June',
  '07': 'July',
  '08': 'August',
  '09': 'September',
  '10': 'October',
  '11': 'November',
  '12': 'December',
};

let numberOfRefresh = 0;

class RenderItem extends PureComponent {
  render() {
    const item = this.props.item_data;
    return (
      <View style={styles.movieItem}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('TVPlay', {slug: item.slug});
          }}>
          <ImageBackground
            style={styles.ImageBk}
            resizeMode={'cover'}
            source={{uri: API.base_filter_img_genres + item.poster}}
          />
        </TouchableOpacity>
        <View style={styles.dsc}>
          <Text style={styles.title}>{item.show_title}</Text>
          <Text style={styles.season}>
            Season {item.season}, Episode {item.episode}
          </Text>
          <Text style={styles.s_dsc} numberOfLines={4}>
            {item.show_description}
          </Text>
          <View style={styles.date}>
            <Text style={styles.air_month}>
              {months[item.air_date.substring(5, 7)]}
            </Text>
            <Text style={styles.air_date}>
              {item.air_date.substring(8, 10)}
            </Text>
            <Text style={styles.air_year}>{item.air_date.substring(0, 4)}</Text>
          </View>
        </View>
      </View>
    );
  }
}

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
    return (
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={styles.contentContainer}
          numColumns={1}
          data={this.state.dataSource}
          extraData={this.state.dataSource}
          renderItem={({item, index}) => (
            <RenderItem key={index} item_data={item} {...this.props} />
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
    flexDirection: 'column',
    backgroundColor: colors.subScreen,
  },
  ImageBk: {
    width: screenWidth / 3,
    height: ((screenWidth / 3 - 10) * 424) / 300,

    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#4280bf',
    fontSize: 17,
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
  indecator: {
    color: '#ffffff',
  },
  dsc: {
    width: (screenWidth * 2) / 3,
    padding: 16,
  },
  season: {
    marginTop: 20,
    color: '#9f9f9f',
    fontSize: 15,
  },
  s_dsc: {
    marginTop: 5,
    color: '#8f8f8f',
    fontSize: 12,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
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
  seperate: {
    height: 2,
    width: '100%',
    backgroundColor: '#CED0CE',
  },
});

const mapStatetoProps = ({tv: {latest_data}}) => ({
  latest_data,
});

export default connect(mapStatetoProps)(LatestTab);
