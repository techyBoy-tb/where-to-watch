import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { View, Image } from 'react-native';
import { ActivityIndicator, Icon } from 'react-native-paper';
import { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet';
import { Friend, MovieDetails, ShowDetails, PersonDetails, MediaType } from '@utils/types';
import { databaseContext } from '@data/context/database';
import {
  getFavouriteMoviesFromFirestore,
  getFavouriteShowsFromFirestore,
  getFavouritePeopleFromFirestore
} from '@data/firebase/firestore';
import Paragraph from './ui/Paragraph';
import Surface from './ui/Surface';
import palette from '@theme/_palette';
import config from '@data/config';
import SegmentedButtons, { SegmentedButtonsValues } from './SegmentedButtons';
import { useNavigation } from '@react-navigation/native';
import { err, log } from '@utils/trace';

interface Props {
  onDismiss: () => void;
  friend: Friend;
}

type MutualItem = (MovieDetails | ShowDetails | PersonDetails) & {
  mutualMediaType: MediaType;
};

const Modal_MutualInterests: React.FC<Props> = ({ onDismiss, friend }) => {
  const navigation = useNavigation();
  const { favouriteMovies, favouriteShows, favouritePeople } = useContext(databaseContext);

  const [isLoading, setIsLoading] = useState(true);
  const [mutualMovies, setMutualMovies] = useState<MovieDetails[]>([]);
  const [mutualShows, setMutualShows] = useState<ShowDetails[]>([]);
  const [mutualPeople, setMutualPeople] = useState<PersonDetails[]>([]);
  const [selectedTab, setSelectedTab] = useState<SegmentedButtonsValues>(SegmentedButtonsValues.movie);

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["50%", "90%"], []);

  useEffect(() => {
    loadMutualInterests();
  }, [friend.userId]);

  const loadMutualInterests = async () => {
    try {
      setIsLoading(true);

      // Fetch friend's favourites from Firestore
      const [friendMovies, friendShows, friendPeople] = await Promise.all([
        getFavouriteMoviesFromFirestore(friend.userId),
        getFavouriteShowsFromFirestore(friend.userId),
        getFavouritePeopleFromFirestore(friend.userId)
      ]);

      // Create maps of current user's favourite IDs for efficient lookup
      const myMovieIds = new Set(favouriteMovies.map(m => m.id));
      const myShowIds = new Set(favouriteShows.map(s => s.id));
      const myPeopleIds = new Set(favouritePeople.map(p => p.id));

      // Find mutual items
      const mutualMoviesList = (friendMovies || []).filter(m => myMovieIds.has(m.id));
      const mutualShowsList = (friendShows || []).filter(s => myShowIds.has(s.id));
      const mutualPeopleList = (friendPeople || []).filter(p => myPeopleIds.has(p.id));

      setMutualMovies(mutualMoviesList);
      setMutualShows(mutualShowsList);
      setMutualPeople(mutualPeopleList);

      // Auto-select tab with most content
      if (mutualMoviesList.length >= mutualShowsList.length && mutualMoviesList.length >= mutualPeopleList.length) {
        setSelectedTab(SegmentedButtonsValues.movie);
      } else if (mutualShowsList.length >= mutualPeopleList.length) {
        setSelectedTab(SegmentedButtonsValues.show);
      } else if (mutualPeopleList.length > 0) {
        setSelectedTab(SegmentedButtonsValues.people);
      }

      bottomSheetRef.current?.present();
    } catch (error) {
      err('[Modal_MutualInterests]', 'Error loading mutual interests');
      log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.8}
      />
    ),
    []
  );

  const currentItems = useMemo((): MutualItem[] => {
    if (selectedTab === SegmentedButtonsValues.movie) {
      return mutualMovies.map(m => ({ ...m, mutualMediaType: MediaType.movie }));
    } else if (selectedTab === SegmentedButtonsValues.show) {
      return mutualShows.map(s => ({ ...s, mutualMediaType: MediaType.show }));
    } else {
      return mutualPeople.map(p => ({ ...p, mutualMediaType: MediaType.person }));
    }
  }, [selectedTab, mutualMovies, mutualShows, mutualPeople]);

  const handleItemPress = useCallback((item: MutualItem) => {
    bottomSheetRef.current?.dismiss();
    setTimeout(() => {
      // if (item.mutualMediaType === MediaType.person) {
      //   navigation.navigate('Actor', { id: item.id });
      // } else {
      navigation.navigate('Details', { id: item.id, mediaType: item.mutualMediaType });
      // }
    }, 300);
  }, [navigation]);

  const renderItem = useCallback(({ item }: { item: MutualItem }) => {
    const isPerson = item.mutualMediaType === MediaType.person;
    const isMovie = item.mutualMediaType === MediaType.movie;

    const title = isPerson
      ? (item as PersonDetails).name
      : isMovie
        ? (item as MovieDetails).title
        : (item as ShowDetails).name;

    const subtitle = isPerson
      ? (item as PersonDetails).knownForDepartment
      : isMovie
        ? (item as MovieDetails).releaseDate?.slice(0, 4)
        : (item as ShowDetails).firstAirDate?.slice(0, 4);

    return (
      <View style={{ marginVertical: 5 }}>
        <Surface onPress={() => handleItemPress(item)}>
          <View style={{ flexDirection: 'row', padding: 10 }}>
            <Image
              source={{ uri: `${config.imageUrl}${item.posterPath}` }}
              style={{ height: 120, width: 80, borderRadius: 8 }}
              resizeMode="cover"
            />
            <View style={{ flex: 1, marginLeft: 12, justifyContent: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Icon
                  source={
                    isPerson ? 'account' :
                      isMovie ? 'movie' :
                        'television'
                  }
                  size={18}
                  color={palette.primary}
                />
                <Paragraph
                  variant="titleSmall"
                  numberOfLines={2}
                  style={{ marginLeft: 6, flex: 1, color: palette.brightWhite }}
                >
                  {title}
                </Paragraph>
              </View>
              {subtitle && (
                <Paragraph style={{ color: palette.placeholder, fontSize: 12, marginBottom: 8 }}>
                  {subtitle}
                </Paragraph>
              )}
              {!isPerson && (
                <Paragraph
                  numberOfLines={3}
                  style={{ color: palette.placeholder, fontSize: 12, lineHeight: 16 }}
                >
                  {(item as MovieDetails | ShowDetails).overview}
                </Paragraph>
              )}
            </View>
          </View>
        </Surface>
      </View>
    );
  }, [handleItemPress]);

  const renderEmptyState = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
      <Icon
        source={
          selectedTab === SegmentedButtonsValues.movie ? 'movie-off' :
            selectedTab === SegmentedButtonsValues.show ? 'television-off' :
              'account-off'
        }
        size={60}
        color={palette.placeholder}
      />
      <Paragraph style={{ color: palette.placeholder, marginTop: 20, textAlign: 'center' }}>
        No mutual {selectedTab === SegmentedButtonsValues.movie ? 'movies' : selectedTab === SegmentedButtonsValues.show ? 'shows' : 'people'} yet
      </Paragraph>
    </View>
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      onDismiss={onDismiss}
      backgroundStyle={{ backgroundColor: palette.background }}
      handleIndicatorStyle={{ backgroundColor: palette.white_50 }}
    >
      <View style={{ flex: 1, paddingTop: 10 }}>
        {/* Header */}
        <View style={{ paddingHorizontal: 15, marginBottom: 15 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Icon source="account-heart" size={28} color={palette.primary} />
            <Paragraph variant="titleLarge" style={{ marginLeft: 10, color: palette.brightWhite }}>
              Mutual Interests
            </Paragraph>
          </View>
          <Paragraph style={{ color: palette.placeholder, fontSize: 14 }}>
            Things you both like with {friend.name || friend.email}
          </Paragraph>
        </View>

        {/* Tabs */}
        <View style={{ marginBottom: 5 }}>
          <SegmentedButtons
            selectedValue={selectedTab}
            onValueChange={setSelectedTab}
            selectionList={[
              {
                value: SegmentedButtonsValues.movie,
                label: `Movies (${mutualMovies.length})`
              },
              {
                value: SegmentedButtonsValues.show,
                label: `Shows (${mutualShows.length})`
              },
              {
                value: SegmentedButtonsValues.people,
                label: `People (${mutualPeople.length})`
              }
            ]}
          />
        </View>

        {/* Content */}
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={palette.primary} />
            <Paragraph style={{ marginTop: 10, color: palette.placeholder }}>
              Loading mutual interests...
            </Paragraph>
          </View>
        ) : currentItems.length === 0 ? (
          renderEmptyState()
        ) : (
          <BottomSheetFlatList
            data={currentItems}
            keyExtractor={(item: MutualItem) => `${item.mutualMediaType}-${item.id}`}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </BottomSheetModal>
  );
};

export default React.memo(Modal_MutualInterests);
