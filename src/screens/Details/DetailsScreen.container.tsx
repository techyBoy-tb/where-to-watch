import React, { useEffect, useState } from 'react';

import Presentational from './DetailsScreen';
import { StaticScreenProps } from '@react-navigation/native';
import { Credit, MediaType, MovieDetails, PersonDetails, ShowDetails } from '@utils/types';
import { getCredits, getMovieDetails, getShowDetails, getPersonDetails } from '@data/api';
import { ActivityIndicator } from 'react-native-paper';
import Wrap from '@components/Wrap';
import ScreenHeader from '@components/ui/ScreenHeader';
import Paragraph from '@components/ui/Paragraph';
import { View } from 'react-native';
import { success } from '@utils/trace';

type Props = StaticScreenProps<{
  id: number;
  mediaType: MediaType
}>

const Container: React.FC<Props> = ({ route: { params } }) => {
  const { id, mediaType } = params;

  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<MovieDetails | ShowDetails | PersonDetails>();
  const [credits, setCredits] = useState<Credit>();

  useEffect(() => {
    async function init() {
      setLoading(true);

      let isShow = true;

      if (mediaType === MediaType['movie']) {
        const movieResp = await getMovieDetails(id);
        if (movieResp) {
          setDetails(movieResp);
          isShow = false
        }
      }

      if (mediaType === MediaType['show']) {
        const showResp = await getShowDetails(id);
        if (showResp) {
          setDetails(showResp);
        }
      }

      if (mediaType === MediaType['person']) {
        const personResp = await getPersonDetails(id);
        if (personResp) {
          setDetails(personResp);
        }
      }

      if (mediaType !== MediaType['person']) {
        const creditResp = await getCredits(id, isShow);
        if (creditResp) {
          setCredits(creditResp)
        }
      }

      setLoading(false);
    }

    init();
  }, [id]);

  if (loading) {
    return (
      <Wrap>
        <ScreenHeader showBackLink />
        <View style={{ justifyContent: 'center', flex: 1 }}>
          <ActivityIndicator />
        </View>
      </Wrap>
    )
  }

  if (!details) {
    return (
      <Wrap>
        <ScreenHeader showBackLink />
        <Paragraph>Could not find the {mediaType} you are looking for.</Paragraph>
      </Wrap>
    )
  }

  return <Presentational
    details={details}
    mediaType={mediaType}
    credits={credits}
  />;
};

export default Container;
