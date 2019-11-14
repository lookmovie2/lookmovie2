/**
 * @providesModule APIs
 */

const api = {
  //root
  root: 'https://fe3.lookmovie.ag',
  //movie
  base_home_img: 'https://image.tmdb.org/t/p/w780',
  base_filter_img: 'https://image.tmdb.org/t/p/w154',
  base_filter_img_genres: 'https://image.tmdb.org/t/p/w185',
  base_filter_img_latest: 'https://image.tmdb.org/t/p/w185',
  base_play_img: 'https://image.tmdb.org/t/p/w185',
  filters_key: 'https://lookmovie.ag/web-api/v1/movies',
  trending: 'https://lookmovie.ag/web-api/v1/movies/trending?pp=30',
  filter: 'https://lookmovie.ag/web-api/v1/movies/list//?pp=30',
  latest: 'https://lookmovie.ag/web-api/v1/movies/list?so=date_added-3&pp=12',
  genres: 'https://lookmovie.ag/web-api/v1/movies/genres',
  adventure: 'https://lookmovie.ag/web-api/v1/movies/genre-collection?id=3',
  animation: 'https://lookmovie.ag/web-api/v1/movies/genre-collection?id=4',
  comedy: 'https://lookmovie.ag/web-api/v1/movies/genre-collection?id=5',
  crime: 'https://lookmovie.ag/web-api/v1/movies/genre-collection?id=6',
  drama: 'https://lookmovie.ag/web-api/v1/movies/genre-collection?id=7',
  family: 'https://lookmovie.ag/web-api/v1/movies/genre-collection?id=8',
  fantasy: 'https://lookmovie.ag/web-api/v1/movies/genre-collection?id=9',
  horror: 'https://lookmovie.ag/web-api/v1/movies/genre-collection?id=10',
  romance: 'https://lookmovie.ag/web-api/v1/movies/genre-collection?id=11',

  //TV
  tv_latest: 'https://lookmovie.ag/web-api/v1/shows/episodes/?pp=15',
  tv_trending: 'https://lookmovie.ag/web-api/v1/shows/trending/?pp=15',
  tv_filter: 'https://lookmovie.ag/web-api/v1/shows/list//?pp=30',
  tv_category:
    'https://lookmovie.ag/web-api/v1/shows/list?so=date_added-3&pp=30',

  //Movie Play
  play: 'https://lookmovie.ag/web-api/v1/movies/view?slug=',
  tokenExpires: 'https://lookmovie.ag/web-api/v1/movies/storage?id_movie=',
  subTitle: 'https://lookmovie.ag/query-storage/?',
  stream: 'https://lookmovie.ag/manifests/movies/json/',
  poster_img_root: 'https://image.tmdb.org/t/p/w500/',
  root_track: 'https://fe4.lookmovie.ag',

  //tv screen
  tvShow: 'https://lookmovie.ag/web-api/v1/shows/view?slug=',
  tv_tokenExpires: 'https://lookmovie.ag/web-api/v1/shows/storage?id_show=',
  show_stream: 'https://lookmovie.ag/manifests/shows/',
  show_subtitle:
    'https://lookmovie.ag/web-api/v1/shows/episode-subtitles/?id_episode=',
  //search
  movie_search: 'https://lookmovie.ag/web-api/v1/movies/list?q=',
  show_search: 'https://lookmovie.ag/web-api/v1/shows/list?q=',

  backdrop: 'https://lookmovie.ag/images/universal.jpg',
  cast: 'https://lookmovie.ag/uploads/cast_placeholder.png',
};

export default api;
