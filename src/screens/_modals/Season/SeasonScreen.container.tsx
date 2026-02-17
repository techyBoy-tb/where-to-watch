import React, { useEffect, useState } from 'react';

import Presentational from './SeasonScreen';
import { StaticScreenProps } from '@react-navigation/native';
import { Episode, Season } from '@utils/types';
import { getEpisodes } from '@data/api';
import { ActivityIndicator } from 'react-native-paper';

type Props = StaticScreenProps<{
  showId: number;
  season: Season;
}>

const Container: React.FC<Props> = ({ route: { params } }) => {
  const { showId, season } = params;

  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function init() {
      setLoading(true);

      const foundEpisodes = await getEpisodes(showId, season.seasonNumber);
      setEpisodes(foundEpisodes);

      setLoading(false);
    }

    init();
  }, []);

  if (loading) {
    return <ActivityIndicator />
  }


  return <Presentational season={season} episodes={episodes} />;
};

export default Container;
