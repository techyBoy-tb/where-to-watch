import React, { useEffect, useState } from 'react';

import Presentational from './OverviewScreen';
import {
  getPopularMovies,
  getUpcomingMovies,
  getTopRatedMovies,
  getPopularShows,
  getUpcomingShows,
  getTopRatedShows,
} from '@data/api';
import { MovieDetails, ShowDetails } from '@utils/types';
import { ActivityIndicator } from 'react-native';

const Container: React.FC = ({ }) => {
  const [upcomingMovies, setUpcomingMovies] = useState<MovieDetails[]>([]);
  const [popularMovies, setPopularMovies] = useState<MovieDetails[]>([]);
  const [topRatedMovies, setTopRateMovies] = useState<MovieDetails[]>([]);
  const [upcomingShows, setUpcomingShows] = useState<ShowDetails[]>([]);
  const [popularShows, setPopularShows] = useState<ShowDetails[]>([]);
  const [topRatedShows, setTopRateShows] = useState<ShowDetails[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function init() {
      setLoading(true);

      const upcomingRespMovies = await getUpcomingMovies();
      setUpcomingMovies(upcomingRespMovies);

      const popularRespMovies = await getPopularMovies();
      setPopularMovies(popularRespMovies);

      const topRatedRespMovies = await getTopRatedMovies();
      setTopRateMovies(topRatedRespMovies);

      const upcomingRespShows = await getUpcomingShows();
      setUpcomingShows(upcomingRespShows);

      const popularRespShows = await getPopularShows();
      setPopularShows(popularRespShows);

      const topRatedShowsResp = await getTopRatedShows();
      setTopRateShows(topRatedShowsResp);

      setLoading(false);
    }

    init();
  }, []);


  if (loading) {
    return <ActivityIndicator />
  }

  return <Presentational
    popularMovies={popularMovies}
    upcomingMovies={upcomingMovies}
    topRatedMovies={topRatedMovies}
    popularShows={popularShows}
    upcomingShows={upcomingShows}
    topRatedShows={topRatedShows}
  />;
};

export default Container;