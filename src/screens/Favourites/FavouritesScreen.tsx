import { useNavigation } from '@react-navigation/native';
import React, { useContext, useMemo, useState } from 'react';

import Wrap from '@components/Wrap';
import { databaseContext } from '@data/context/database';
import DetailsCard from '@components/DetailsCard';
import { SimpleGrid } from 'react-native-super-grid';
import { ScrollView, View } from 'react-native';
import { MediaType, MovieDetails, PersonDetails, ShowDetails } from '@utils/types';
import SegmentedButtons, { SegmentedButtonsValues } from '@components/SegmentedButtons';
import Paragraph from '@components/ui/Paragraph';
import { Button, Icon, IconButton } from 'react-native-paper';
import palette from '@theme/_palette';
import ModalFilters from '@components/Modal_Filters';
import SvgIconFilter from '@components/svg/icons/SvgIconFilter';

interface Props { }

const FavouritesScreen: React.FC<Props> = () => {
  const navigation = useNavigation();
  const {
    favouriteMovies,
    favouritePeople,
    favouriteShows,
    removeFavouriteMovie,
    removeFavouriteShow,
    refresh
  } = useContext(databaseContext);

  const [viewType, setViewType] = useState<SegmentedButtonsValues>(SegmentedButtonsValues['movie']);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const isEmpty = useMemo(() => {
    if (viewType === SegmentedButtonsValues['movie']) {
      return favouriteMovies.length === 0;
    }

    if (viewType === SegmentedButtonsValues['show']) {
      return favouriteMovies.length === 0;
    }

    return favouritePeople.length === 0;
  }, [viewType, favouriteMovies, favouriteShows]);

  return (
    <>
      <Wrap>
        <ScrollView>
          <View
            style={{
              paddingLeft: 15,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Paragraph variant='titleLarge'>Favourites</Paragraph>
          </View>
          <SegmentedButtons
            selectedValue={viewType}
            onValueChange={setViewType}
            selectionList={
              [
                { value: SegmentedButtonsValues['movie'], label: 'Movies' },
                { value: SegmentedButtonsValues['show'], label: 'Shows' },
                { value: SegmentedButtonsValues['people'], label: 'People' }
              ]
            } />
          {isEmpty ? (
            <View style={{
              alignItems: 'center',
              paddingTop: 20
            }}>
              <Icon
                size={120}
                source={viewType === SegmentedButtonsValues['movie'] ? 'movie-open-outline' : viewType === SegmentedButtonsValues['show'] ? 'television-classic' : 'account-outline'}
                color={palette.white_50}
              />
              <Paragraph variant='bodyLarge'>
                No favourite {viewType === SegmentedButtonsValues['movie'] ? 'movies' : viewType === SegmentedButtonsValues['show'] ? 'shows' : 'people'} yet
              </Paragraph>
              <Paragraph>
                Tap the heart on a {viewType === SegmentedButtonsValues['movie'] ? 'movies' : viewType === SegmentedButtonsValues['show'] ? 'shows' : 'person'} to save it
              </Paragraph>
              <Button
                onPress={() => navigation.navigate('Main', { screen: 'Overview' })}
                mode='outlined'
                compact
                style={{ marginTop: 20 }}
              >
                <Paragraph>Browse shows</Paragraph>
              </Button>
            </View>
          ) : (
            <SimpleGrid
              listKey={'favourite-movie-list'}
              itemDimension={130}
              data={viewType === SegmentedButtonsValues['movie'] ? favouriteMovies : viewType === SegmentedButtonsValues['show'] ? favouriteShows : favouritePeople}
              renderItem={({ item }: { item: MovieDetails | ShowDetails | PersonDetails }) => <DetailsCard details={item} />}
            />
          )}
        </ScrollView>
      </Wrap>
    </>
  );
};

export default React.memo(FavouritesScreen);
