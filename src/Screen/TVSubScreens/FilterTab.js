import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ImageBackground,
  Dimensions,
  Button,
  ActivityIndicator,
} from 'react-native';
import PlayIcon from 'react-native-vector-icons/Feather';
import StarIcon from 'react-native-vector-icons/Entypo';
import {TouchableOpacity} from 'react-native-gesture-handler';
import ActionButton from 'react-native-action-button';
import {Toast} from 'native-base';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';

import ProgressScreen from '../ReferScreens/ProgressScreen';
import API from '../../config/api';
import colors from '../../config/colors';

const screenWidth = Math.round(Dimensions.get('window').width);

const itemsGenres = [
  {
    name: 'Select Genres',
    id: 0,
    children: [
      {
        id: 'action',
        name: 'Action',
      },
      {
        id: 'adventure',
        name: 'Adventure',
      },
      {
        id: 'animation',
        name: 'Animation',
      },
      {
        id: 'comedy',
        name: 'Comedy',
      },
      {
        id: 'drama',
        name: 'Drama',
      },
      {
        id: 'documentary',
        name: 'Documentary',
      },
      {
        id: 'family',
        name: 'Family',
      },
      {
        id: 'history',
        name: 'History',
      },
      {
        id: 'fantasy',
        name: 'Fantasy',
      },
      {
        id: 'horror',
        name: 'Horror',
      },
      {
        id: 'music',
        name: 'Music',
      },
      {
        id: 'mystery',
        name: 'Mystery',
      },
      {
        id: 'romance',
        name: 'Romance',
      },
      {
        id: 'thriller',
        name: 'Thriller',
      },
      {
        id: 'war',
        name: 'War',
      },
      {
        id: 'western',
        name: 'Western',
      },
    ],
  },
];
const itemsYear = [
  {
    name: 'Select Year',
    id: 0,
    children: [],
  },
];
const itemsRating = [
  {
    name: 'Select Genres',
    id: 0,
    children: [
      {
        id: 0,
        name: '1+',
      },
      {
        id: 2,
        name: '2+',
      },
      {
        id: 3,
        name: '3+',
      },
      {
        id: 4,
        name: '4+',
      },
      {
        id: 5,
        name: '5+',
      },
      {
        id: 7,
        name: '6+',
      },
      {
        id: 8,
        name: '7+',
      },
      {
        id: 9,
        name: '8+',
      },
      {
        id: 10,
        name: '9+',
      },
    ],
  },
];
const itemsSo = [
  {
    name: 'Select Sort Order',
    id: 0,
    children: [
      {
        id: 'release_date-3',
        name: 'Newest First',
      },
      {
        id: 'first_air_date-4',
        name: 'Oldest First',
      },
      {
        id: 'imdb_rating-3',
        name: 'Top IMDb',
      },
      {
        id: 'imdb_rating-4',
        name: 'Bottom IMDb',
      },
    ],
  },
];

let numberOfRefresh = 0;

export default class FilterTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isFetch: false,
      isEmpty: false,
      isDownRefresh: false,
      isTopRefresh: false,
      nextPage: '',
      selectedGenresItems: [],
      selectedYearItems: [],
      selectedRatingItems: ['5+'],
      selectedSoItems: [],
      start: true,
      end: false,
      firstLoaded: true,
    };
    for (let i = 2019; i > 1920; i--) {
      itemsYear[0].children.push({
        id: i,
        name: i,
      });
    }
  }
  back = () => {
    this.setState({isLoading: true, isFetch: false});
    return new Promise(resolve =>
      setTimeout(() => {
        this.setState({isLoading: false});
      }, 2000),
    );
  };

  fetchAPI = () => {
    this.setState({firstLoaded: false});
    // param is a highlighted word from the user before it clicked the button
    this.setState({isLoading: true, isFetch: false});
    var params = '';
    if (this.state.selectedGenresItems.length > 0) {
      params += 'g=';
    }
    for (let i = 0; i < this.state.selectedGenresItems.length; i++) {
      params +=
        i !== this.state.selectedGenresItems.length
          ? this.state.selectedGenresItems[i] + ','
          : this.state.selectedGenresItems[i];
    }

    if (this.state.selectedYearItems.length > 0) {
      params += params === '' ? 'y=' : '&y=';
    }
    for (let i = 0; i < this.state.selectedYearItems.length; i++) {
      params +=
        i !== this.state.selectedYearItems.length - 1
          ? this.state.selectedYearItems[i] + ','
          : this.state.selectedYearItems[i];
    }
    if (this.state.selectedRatingItems.length > 0) {
      params +=
        (params === '' ? 'r=' : '&r=') + this.state.selectedRatingItems[0];
    }
    if (this.state.selectedSoItems.length > 0) {
      params +=
        (params === '' ? 'so=' : '&so=') + this.state.selectedSoItems[0];
    }
    return fetch(API.tv_filter + params)
      .then(response => response.json())
      .then(responseJson => {
        //Alert.alert(responseJson.featured_items.collection[0].id_movie);
        var empty = true;
        if (responseJson.items.collection.length > 0) {
          empty = false;
        }

        this.setState(
          {
            isLoading: false,
            isFetch: false,
            isDownRefresh: false,
            isEmpty: empty,
            dataSource: responseJson.items.collection,
            prevPage: responseJson.pagination.prev_page,
            nextPage: responseJson.pagination.next_page,
          },
          function() {},
        );
      })
      .catch(error => {
        this.setState({isFetch: true});
      });
  };

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
    return fetch(this.state.prevPage)
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
    return <ActivityIndicator size="large" style={styles.indecate} />;
  };

  renderSeparator = () => {
    return <View style={styles.separator} />;
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
    //check empty
    if (this.state.isEmpty) {
      return (
        <View style={styles.empty}>
          <Text style={styles.nothing}>Nothing... Please Try Again.</Text>
        </View>
      );
    }
    //filter screen
    if (this.state.isFetch || this.state.firstLoaded) {
      return (
        <View style={styles.container}>
          <SectionedMultiSelect
            items={itemsGenres}
            uniqueKey="id"
            subKey="children"
            iconKey="icon"
            selectText="Select Genres..."
            showDropDowns={true}
            expandDropDowns={true}
            readOnlyHeadings={true}
            colors={{
              selectToggleTextColor: '#ffffff',
              primary: 'rgba(231,76,60,0.8)',
            }}
            style={styles.picker}
            onSelectedItemsChange={this.onSelectedGenresChange}
            selectedItems={this.state.selectedGenresItems}
          />
          <SectionedMultiSelect
            items={itemsYear}
            uniqueKey="id"
            subKey="children"
            iconKey="icon"
            selectText="Select Year..."
            showDropDowns={true}
            expandDropDowns={true}
            readOnlyHeadings={true}
            colors={{
              selectToggleTextColor: '#ffffff',
              primary: 'rgba(231,76,60,0.8)',
            }}
            style={styles.picker}
            onSelectedItemsChange={this.onSelectedYearsChange}
            selectedItems={this.state.selectedYearItems}
          />
          <SectionedMultiSelect
            items={itemsRating}
            uniqueKey="id"
            subKey="children"
            iconKey="icon"
            single={true}
            selectText="Select Rating..."
            showDropDowns={true}
            expandDropDowns={true}
            readOnlyHeadings={true}
            colors={{
              selectToggleTextColor: '#ffffff',
              primary: 'rgba(231,76,60,0.8)',
            }}
            style={styles.picker}
            onSelectedItemsChange={this.onSelectedRatingChange}
            selectedItems={this.state.selectedRatingItems}
          />
          <SectionedMultiSelect
            items={itemsSo}
            uniqueKey="id"
            subKey="children"
            iconKey="icon"
            single={true}
            selectText="Select Sort Order..."
            showDropDowns={true}
            expandDropDowns={true}
            readOnlyHeadings={true}
            colors={{
              selectToggleTextColor: '#ffffff',
              primary: 'rgba(231,76,60,0.8)',
            }}
            style={styles.picker}
            onSelectedItemsChange={this.onSelectedSoChange}
            selectedItems={this.state.selectedSoItems}
          />
          <View style={styles.buttons}>
            <TouchableOpacity
              onPress={this.back.bind(this)}
              style={{width: screenWidth / 2}}
              disabled={this.state.firstLoaded}>
              <Button
                title="BACK"
                color="#9f9f9f"
                accessibilityLabel="Filter movies"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.fetchAPI}
              style={{width: screenWidth / 2}}>
              <Button
                title="SUBMIT"
                color="rgba(231,76,60,0.8)"
                accessibilityLabel="Filter movies"
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    //process screen
    else if (this.state.isLoading) {
      return <ProgressScreen />;
    }
    // movie list screen
    return (
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={styles.contentContainer}
          numColumns={3}
          data={this.state.dataSource}
          extraData={this.state.dataSource}
          renderItem={({item}) => (
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
                  <Text style={styles.flag_quality}>/{item.flag_quality}</Text>
                </View>
                <View style={styles.year}>
                  <Text style={styles.year_dsc}>{item.year}</Text>
                </View>
              </ImageBackground>
              <Text style={styles.title}>{item.title}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          refreshing={this.state.isTopRefresh}
          ItemSeparatorComponent={this.renderSeparator}
          // ListHeaderComponent={this.renderHeader.bind(this)}
          ListFooterComponent={this.renderFooter.bind(this)}
          onEndReachedThreshold={0.4}
          onEndReached={this.handleDownRefresh.bind(this)}
          onRefresh={this.handleTopRefresh.bind(this)}
          ref={ref => {
            this.flatListRef = ref;
          }}
        />
        <ActionButton
          buttonColor="rgba(231,76,60,0.8)"
          shadowStyle={styles.actionButton}
          onPress={() => this.setState({isFetch: true})}
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
  empty: {
    justifyContent: 'center',
    alignItems: 'center',
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
  separator: {
    height: 2,
    width: '100%',
    backgroundColor: '#CED0CE',
  },
  actionButton: {
    shadowColor: '#717a83',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
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
  nothing: {
    color: '#ff9966',
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
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
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
  indecate: {
    color: '#ffffff',
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
    color: '#9f9f9f',
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
    paddingBottom: 20,
    paddingTop: 20,
    paddingRight: 10,
    paddingLeft: 10,
    color: '#9e9e9e',
    fontSize: 10,
  },
});
