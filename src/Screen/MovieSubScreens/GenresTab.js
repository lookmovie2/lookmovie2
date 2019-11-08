import React, {Component, PureComponent} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
} from 'react-native';
import StarIcon from 'react-native-vector-icons/Entypo';
import {TouchableOpacity, ScrollView} from 'react-native-gesture-handler';
import Swiper from 'react-native-swiper';
import {connect} from 'react-redux';

import API from '../../config/api';
import colors from '../../config/colors';

const screenWidth = Math.round(Dimensions.get('window').width);

class AdventureItem extends PureComponent {
  render() {
    const index = this.props.index;
    const data = this.props.data;
    return (
      <View style={styles.genres}>
        <View style={styles.MovieItem}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('Play', {slug: data[index].url});
            }}>
            <ImageBackground
              style={styles.ImageBk}
              resizeMode={'cover'}
              source={{
                uri: API.base_filter_img_genres + data[index].cover,
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
              <View style={styles.year}>
                <Text style={styles.year_dsc}>{data[index].year}</Text>
              </View>
            </ImageBackground>
            <Text style={styles.title} numberOfLines={1}>
              {data[index].title}
            </Text>
          </TouchableOpacity>
        </View>
        {index + 1 < data.length && (
          <View style={styles.MovieItem}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('Play', {
                  slug: data[index + 1].url,
                });
              }}>
              <ImageBackground
                style={styles.ImageBk}
                resizeMode={'cover'}
                source={{
                  uri: API.base_filter_img_genres + data[index + 1].cover,
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
                <View style={styles.year}>
                  <Text style={styles.year_dsc}>{data[index + 1].year}</Text>
                </View>
              </ImageBackground>
              <Text style={styles.title} numberOfLines={1}>
                {data[index + 1].title}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

class AnimationItem extends PureComponent {
  render() {
    const index = this.props.index;
    const data = this.props.data;
    return (
      <View style={styles.genres}>
        <View style={styles.MovieItem}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('Play', {slug: data[index].url});
            }}>
            <ImageBackground
              style={styles.ImageBk}
              resizeMode={'cover'}
              source={{
                uri: API.base_filter_img_genres + data[index].cover,
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
              <View style={styles.year}>
                <Text style={styles.year_dsc}>{data[index].year}</Text>
              </View>
            </ImageBackground>
            <Text style={styles.title} numberOfLines={1}>
              {data[index].title}
            </Text>
          </TouchableOpacity>
        </View>
        {index + 1 < data.length && (
          <View style={styles.MovieItem}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('Play', {
                  slug: data[index + 1].url,
                });
              }}>
              <ImageBackground
                style={styles.ImageBk}
                resizeMode={'cover'}
                source={{
                  uri: API.base_filter_img_genres + data[index + 1].cover,
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
                <View style={styles.year}>
                  <Text style={styles.year_dsc}>{data[index + 1].year}</Text>
                </View>
              </ImageBackground>
              <Text style={styles.title} numberOfLines={1}>
                {data[index + 1].title}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

class ComedyItem extends PureComponent {
  render() {
    const index = this.props.index;
    const data = this.props.data;
    return (
      <View key={index} style={styles.genres}>
        <View style={styles.MovieItem}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('Play', {slug: data[index].url});
            }}>
            <ImageBackground
              style={styles.ImageBk}
              resizeMode={'cover'}
              source={{
                uri: API.base_filter_img_genres + data[index].cover,
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
              <View style={styles.year}>
                <Text style={styles.year_dsc}>{data[index].year}</Text>
              </View>
            </ImageBackground>
            <Text style={styles.title} numberOfLines={1}>
              {data[index].title}
            </Text>
          </TouchableOpacity>
        </View>
        {index + 1 < data.length && (
          <View style={styles.MovieItem}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('Play', {
                  slug: data[index + 1].url,
                });
              }}>
              <ImageBackground
                style={styles.ImageBk}
                resizeMode={'cover'}
                source={{
                  uri: API.base_filter_img_genres + data[index + 1].cover,
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
                <View style={styles.year}>
                  <Text style={styles.year_dsc}>{data[index + 1].year}</Text>
                </View>
              </ImageBackground>
              <Text style={styles.title} numberOfLines={1}>
                {data[index + 1].title}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

class CrimeItem extends PureComponent {
  render() {
    const index = this.props.index;
    const data = this.props.data;
    return (
      <View key={index} style={styles.genres}>
        <View style={styles.MovieItem}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('Play', {slug: data[index].url});
            }}>
            <ImageBackground
              style={styles.ImageBk}
              resizeMode={'cover'}
              source={{
                uri: API.base_filter_img_genres + data[index].cover,
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
              <View style={styles.year}>
                <Text style={styles.year_dsc}>{data[index].year}</Text>
              </View>
            </ImageBackground>
            <Text style={styles.title} numberOfLines={1}>
              {data[index].title}
            </Text>
          </TouchableOpacity>
        </View>
        {index + 1 < data.length && (
          <View style={styles.MovieItem}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('Play', {
                  slug: data[index + 1].url,
                });
              }}>
              <ImageBackground
                style={styles.ImageBk}
                resizeMode={'cover'}
                source={{
                  uri: API.base_filter_img_genres + data[index + 1].cover,
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
                <View style={styles.year}>
                  <Text style={styles.year_dsc}>{data[index + 1].year}</Text>
                </View>
              </ImageBackground>
              <Text style={styles.title} numberOfLines={1}>
                {data[index + 1].title}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

class DramaItem extends PureComponent {
  render() {
    const index = this.props.index;
    const data = this.props.data;
    return (
      <View key={index} style={styles.genres}>
        <View style={styles.MovieItem}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('Play', {slug: data[index].url});
            }}>
            <ImageBackground
              style={styles.ImageBk}
              resizeMode={'cover'}
              source={{
                uri: API.base_filter_img_genres + data[index].cover,
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
              <View style={styles.year}>
                <Text style={styles.year_dsc}>{data[index].year}</Text>
              </View>
            </ImageBackground>
            <Text style={styles.title} numberOfLines={1}>
              {data[index].title}
            </Text>
          </TouchableOpacity>
        </View>
        {index + 1 < data.length && (
          <View style={styles.MovieItem}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('Play', {
                  slug: data[index + 1].url,
                });
              }}>
              <ImageBackground
                style={styles.ImageBk}
                resizeMode={'cover'}
                source={{
                  uri: API.base_filter_img_genres + data[index + 1].cover,
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
                <View style={styles.year}>
                  <Text style={styles.year_dsc}>{data[index + 1].year}</Text>
                </View>
              </ImageBackground>
              <Text style={styles.title} numberOfLines={1}>
                {data[index + 1].title}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

class FamilyItem extends PureComponent {
  render() {
    const index = this.props.index;
    const data = this.props.data;
    return (
      <View key={index} style={styles.genres}>
        <View style={styles.MovieItem}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('Play', {slug: data[index].url});
            }}>
            <ImageBackground
              style={styles.ImageBk}
              resizeMode={'cover'}
              source={{
                uri: API.base_filter_img_genres + data[index].cover,
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
              <View style={styles.year}>
                <Text style={styles.year_dsc}>{data[index].year}</Text>
              </View>
            </ImageBackground>
            <Text style={styles.title} numberOfLines={1}>
              {data[index].title}
            </Text>
          </TouchableOpacity>
        </View>
        {index + 1 < data.length && (
          <View style={styles.MovieItem}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('Play', {
                  slug: data[index + 1].url,
                });
              }}>
              <ImageBackground
                style={styles.ImageBk}
                resizeMode={'cover'}
                source={{
                  uri: API.base_filter_img_genres + data[index + 1].cover,
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
                <View style={styles.year}>
                  <Text style={styles.year_dsc}>{data[index + 1].year}</Text>
                </View>
              </ImageBackground>
              <Text style={styles.title} numberOfLines={1}>
                {data[index + 1].title}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

class FantasyItem extends PureComponent {
  render() {
    const index = this.props.index;
    const data = this.props.data;
    return (
      <View key={index} style={styles.genres}>
        <View style={styles.MovieItem}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('Play', {slug: data[index].url});
            }}>
            <ImageBackground
              style={styles.ImageBk}
              resizeMode={'cover'}
              source={{
                uri: API.base_filter_img_genres + data[index].cover,
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
              <View style={styles.year}>
                <Text style={styles.year_dsc}>{data[index].year}</Text>
              </View>
            </ImageBackground>
            <Text style={styles.title} numberOfLines={1}>
              {data[index].title}
            </Text>
          </TouchableOpacity>
        </View>
        {index + 1 < data.length && (
          <View style={styles.MovieItem}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('Play', {
                  slug: data[index + 1].url,
                });
              }}>
              <ImageBackground
                style={styles.ImageBk}
                resizeMode={'cover'}
                source={{
                  uri: API.base_filter_img_genres + data[index + 1].cover,
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
                <View style={styles.year}>
                  <Text style={styles.year_dsc}>{data[index + 1].year}</Text>
                </View>
              </ImageBackground>
              <Text style={styles.title} numberOfLines={1}>
                {data[index + 1].title}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

class HorrorItem extends PureComponent {
  render() {
    const index = this.props.index;
    const data = this.props.data;
    return (
      <View key={index} style={styles.genres}>
        <View style={styles.MovieItem}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('Play', {slug: data[index].url});
            }}>
            <ImageBackground
              style={styles.ImageBk}
              resizeMode={'cover'}
              source={{
                uri: API.base_filter_img_genres + data[index].cover,
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
              <View style={styles.year}>
                <Text style={styles.year_dsc}>{data[index].year}</Text>
              </View>
            </ImageBackground>
            <Text style={styles.title} numberOfLines={1}>
              {data[index].title}
            </Text>
          </TouchableOpacity>
        </View>
        {index + 1 < data.length && (
          <View style={styles.MovieItem}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('Play', {
                  slug: data[index + 1].url,
                });
              }}>
              <ImageBackground
                style={styles.ImageBk}
                resizeMode={'cover'}
                source={{
                  uri: API.base_filter_img_genres + data[index + 1].cover,
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
                <View style={styles.year}>
                  <Text style={styles.year_dsc}>{data[index + 1].year}</Text>
                </View>
              </ImageBackground>
              <Text style={styles.title} numberOfLines={1}>
                {data[index + 1].title}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

class RomanceItem extends PureComponent {
  render() {
    const index = this.props.index;
    const data = this.props.data;
    return (
      <View key={index} style={styles.genres}>
        <View style={styles.MovieItem}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('Play', {slug: data[index].url});
            }}>
            <ImageBackground
              style={styles.ImageBk}
              resizeMode={'cover'}
              source={{
                uri: API.base_filter_img_genres + data[index].cover,
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
              <View style={styles.year}>
                <Text style={styles.year_dsc}>{data[index].year}</Text>
              </View>
            </ImageBackground>
            <Text style={styles.title} numberOfLines={1}>
              {data[index].title}
            </Text>
          </TouchableOpacity>
        </View>
        {index + 1 < data.length && (
          <View style={styles.MovieItem}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('Play', {
                  slug: data[index + 1].url,
                });
              }}>
              <ImageBackground
                style={styles.ImageBk}
                resizeMode={'cover'}
                source={{
                  uri: API.base_filter_img_genres + data[index + 1].cover,
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
                <View style={styles.year}>
                  <Text style={styles.year_dsc}>{data[index + 1].year}</Text>
                </View>
              </ImageBackground>
              <Text style={styles.title} numberOfLines={1}>
                {data[index + 1].title}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

class GenresTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      nextPage: '',
      adventure: this.props.genres_data.adventure,
      animation: this.props.genres_data.animation,
      comedy: this.props.genres_data.comedy,
      crime: this.props.genres_data.crime,
      drama: this.props.genres_data.drama,
      family: this.props.genres_data.family,
      fantasy: this.props.genres_data.fantasy,
      horror: this.props.genres_data.horror,
      romance: this.props.genres_data.romance,
      tmp_adventure: this.props.genres_data.tmp_adventure,
      tmp_animation: this.props.genres_data.tmp_animation,
      tmp_comedy: this.props.genres_data.tmp_comedy,
      tmp_crime: this.props.genres_data.tmp_crime,
      tmp_drama: this.props.genres_data.tmp_drama,
      tmp_family: this.props.genres_data.tmp_family,
      tmp_fantasy: this.props.genres_data.tmp_fantasy,
      tmp_horror: this.props.genres_data.tmp_horror,
      tmp_romance: this.props.genres_data.tmp_romance,
    };
  }

  render() {
    const {
      adventure,
      animation,
      comedy,
      crime,
      drama,
      family,
      fantasy,
      horror,
      romance,
      tmp_adventure,
      tmp_animation,
      tmp_comedy,
      tmp_crime,
      tmp_drama,
      tmp_family,
      tmp_fantasy,
      tmp_horror,
      tmp_romance,
    } = this.state;
    return (
      <ScrollView style={{backgroundColor: colors.subScreen}}>
        {/* adventure */}
        <View style={styles.genresHeader}>
          <Text style={styles.genresTitle}>ADVENTURE</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>VIEW ALL</Text>
          </TouchableOpacity>
        </View>
        <Swiper
          showsButtons={false}
          autoplay={true}
          dotColor={colors.navBarColor}
          activeDotColor={colors.textColor01}
          style={styles.swiper}>
          {tmp_adventure.map(index => (
            <AdventureItem
              key={index}
              index={index}
              data={adventure}
              {...this.props}
            />
          ))}
        </Swiper>
        {/* animation */}
        <View style={styles.genresHeader}>
          <Text style={styles.genresTitle}>ANIMATION</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>VIEW ALL</Text>
          </TouchableOpacity>
        </View>
        <Swiper
          showsButtons={false}
          autoplay={true}
          dotColor={colors.navBarColor}
          activeDotColor={colors.textColor01}
          style={styles.swiper}>
          {tmp_animation.map(index => (
            <AnimationItem
              key={index}
              index={index}
              data={animation}
              {...this.props}
            />
          ))}
        </Swiper>
        {/* comedy */}
        <View style={styles.genresHeader}>
          <Text style={styles.genresTitle}>COMEDY</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>VIEW ALL</Text>
          </TouchableOpacity>
        </View>
        <Swiper
          showsButtons={false}
          autoplay={true}
          dotColor={colors.navBarColor}
          activeDotColor={colors.textColor01}
          style={styles.swiper}>
          {tmp_comedy.map(index => (
            <ComedyItem
              key={index}
              index={index}
              data={comedy}
              {...this.props}
            />
          ))}
        </Swiper>
        {/* crime */}
        <View style={styles.genresHeader}>
          <Text style={styles.genresTitle}>CRIME</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>VIEW ALL</Text>
          </TouchableOpacity>
        </View>
        <Swiper
          showsButtons={false}
          autoplay={true}
          dotColor={colors.navBarColor}
          activeDotColor={colors.textColor01}
          style={styles.swiper}>
          {tmp_crime.map(index => (
            <CrimeItem key={index} index={index} data={crime} {...this.props} />
          ))}
        </Swiper>
        {/* DRAMA */}
        <View style={styles.genresHeader}>
          <Text style={styles.genresTitle}>DRAMA</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>VIEW ALL</Text>
          </TouchableOpacity>
        </View>
        <Swiper
          showsButtons={false}
          autoplay={true}
          dotColor={colors.navBarColor}
          activeDotColor={colors.textColor01}
          style={styles.swiper}>
          {tmp_drama.map(index => (
            <DramaItem key={index} index={index} data={drama} {...this.props} />
          ))}
        </Swiper>
        {/* family */}
        <View style={styles.genresHeader}>
          <Text style={styles.genresTitle}>FAMILY</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>VIEW ALL</Text>
          </TouchableOpacity>
        </View>
        <Swiper
          showsButtons={false}
          autoplay={true}
          dotColor={colors.navBarColor}
          activeDotColor={colors.textColor01}
          style={styles.swiper}>
          {tmp_family.map(index => (
            <FamilyItem
              key={index}
              index={index}
              data={family}
              {...this.props}
            />
          ))}
        </Swiper>
        {/* fantasy */}
        <View style={styles.genresHeader}>
          <Text style={styles.genresTitle}>FANTASY</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>VIEW ALL</Text>
          </TouchableOpacity>
        </View>
        <Swiper
          showsButtons={false}
          autoplay={true}
          dotColor={colors.navBarColor}
          activeDotColor={colors.textColor01}
          style={styles.swiper}>
          {tmp_fantasy.map(index => (
            <FantasyItem
              key={index}
              index={index}
              data={fantasy}
              {...this.props}
            />
          ))}
        </Swiper>
        {/* horror */}
        <View style={styles.genresHeader}>
          <Text style={styles.genresTitle}>HORROR</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>VIEW ALL</Text>
          </TouchableOpacity>
        </View>
        <Swiper
          showsButtons={false}
          autoplay={true}
          dotColor={colors.navBarColor}
          activeDotColor={colors.textColor01}
          style={styles.swiper}>
          {tmp_horror.map(index => (
            <HorrorItem
              key={index}
              index={index}
              data={horror}
              {...this.props}
            />
          ))}
        </Swiper>
        {/* romance */}
        <View style={styles.genresHeader}>
          <Text style={styles.genresTitle}>ROMANCE</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>VIEW ALL</Text>
          </TouchableOpacity>
        </View>
        <Swiper
          showsButtons={false}
          autoplay={true}
          dotColor={colors.navBarColor}
          activeDotColor={colors.textColor01}
          style={styles.swiper}>
          {tmp_romance.map(index => (
            <RomanceItem
              key={index}
              index={index}
              data={romance}
              {...this.props}
            />
          ))}
        </Swiper>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  ImageBk: {
    width: screenWidth / 2 - 10,
    height: ((screenWidth / 2 - 10) * 424) / 300,

    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    padding: 10,
    color: '#9f9f9f',
    fontSize: 13,
  },
  movieItem: {
    flexDirection: 'row',
    width: screenWidth / 2 - 10,
    height: ((screenWidth / 2 - 10) * 424) / 300,
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
    alignItems: 'center',
  },
  picker: {
    margin: 5,
  },
  genres: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  swiper: {
    height: ((screenWidth / 2) * 424) / 300 + 100,
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
  year_dsc: {
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
    height: 100,
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
  genresHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genresTitle: {
    paddingBottom: 20,
    paddingTop: 20,
    paddingRight: 10,
    paddingLeft: 15,
    color: '#f9f9f9',
    fontSize: 20,
  },
  viewAll: {
    paddingBottom: 20,
    paddingTop: 20,
    paddingRight: 10,
    paddingLeft: 10,
    color: '#9e9e9e',
    fontSize: 12,
  },
});

const mapStatetoProps = ({movie: {genres_data}}) => ({
  genres_data,
});

export default connect(mapStatetoProps)(GenresTab);
