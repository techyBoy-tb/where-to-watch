import React, { useContext, useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Icon, IconButton, ActivityIndicator } from 'react-native-paper';
import Surface from './ui/Surface';
import Paragraph from './ui/Paragraph';
import palette from '@theme/_palette';
import { Friend } from '@utils/types';
import { databaseContext } from '@data/context/database';
import {
  getFavouriteMoviesFromFirestore,
  getFavouriteShowsFromFirestore,
  getFavouritePeopleFromFirestore
} from '@data/firebase/firestore';
import Modal_MutualInterests from './Modal_MutualInterests';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

interface Props {
  friend: Friend;
  onRemove: () => void;
}

const FriendCard: React.FC<Props> = ({ friend, onRemove }) => {
  const { favouriteMovies, favouriteShows, favouritePeople } = useContext(databaseContext);
  const [mutualCounts, setMutualCounts] = useState({ movies: 0, shows: 0, people: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [showMutualModal, setShowMutualModal] = useState(false);

  useEffect(() => {
    calculateMutualInterests();
  }, [friend.userId, favouriteMovies, favouriteShows, favouritePeople]);

  const calculateMutualInterests = async () => {
    try {
      setIsLoading(true);

      // Fetch friend's favourites from Firestore
      const [friendMovies, friendShows, friendPeople] = await Promise.all([
        getFavouriteMoviesFromFirestore(friend.userId),
        getFavouriteShowsFromFirestore(friend.userId),
        getFavouritePeopleFromFirestore(friend.userId)
      ]);

      // Create sets of current user's favourite IDs for efficient lookup
      const myMovieIds = new Set(favouriteMovies.map(m => m.id));
      const myShowIds = new Set(favouriteShows.map(s => s.id));
      const myPeopleIds = new Set(favouritePeople.map(p => p.id));

      // Count mutual interests
      const mutualMovies = (friendMovies || []).filter(m => myMovieIds.has(m.id)).length;
      const mutualShows = (friendShows || []).filter(s => myShowIds.has(s.id)).length;
      const mutualPeople = (friendPeople || []).filter(p => myPeopleIds.has(p.id)).length;

      setMutualCounts({
        movies: mutualMovies,
        shows: mutualShows,
        people: mutualPeople
      });
    } catch (error) {
      console.error('Error calculating mutual interests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Surface
        style={{ marginVertical: 8, marginHorizontal: 15 }}
        onPress={() => setShowMutualModal(true)}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Icon source="account-circle" size={40} color={palette.primary} />
              <View style={{ marginLeft: 12, flex: 1 }}>
                {friend.name && (
                  <Paragraph variant="titleMedium" style={{ color: palette.brightWhite }}>
                    {friend.name}
                  </Paragraph>
                )}
                <Paragraph style={{ color: palette.placeholder, fontSize: 14 }}>
                  {friend.email}
                </Paragraph>
              </View>
            </View>

            {isLoading ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                <ActivityIndicator size="small" color={palette.primary} />
                <Paragraph style={{ color: palette.placeholder, fontSize: 12, marginLeft: 8 }}>
                  Loading mutual interests...
                </Paragraph>
              </View>
            ) : (
              <View style={{ marginTop: 8 }}>
                <Paragraph style={{ color: palette.placeholder, fontSize: 12, marginBottom: 6 }}>
                  Mutual interests (tap to view):
                </Paragraph>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon source="movie" size={16} color={palette.primary} />
                    <Paragraph style={{ color: palette.brightWhite, fontSize: 14, marginLeft: 4 }}>
                      {mutualCounts.movies} {mutualCounts.movies === 1 ? 'movie' : 'movies'}
                    </Paragraph>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon source="television" size={16} color={palette.primary} />
                    <Paragraph style={{ color: palette.brightWhite, fontSize: 14, marginLeft: 4 }}>
                      {mutualCounts.shows} {mutualCounts.shows === 1 ? 'show' : 'shows'}
                    </Paragraph>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon source="account" size={16} color={palette.primary} />
                    <Paragraph style={{ color: palette.brightWhite, fontSize: 14, marginLeft: 4 }}>
                      {mutualCounts.people} {mutualCounts.people === 1 ? 'person' : 'people'}
                    </Paragraph>
                  </View>
                </View>
              </View>
            )}
          </View>

          <IconButton
            icon="account-remove"
            iconColor={palette.error}
            size={20}
            onPress={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          />
        </View>
      </Surface>

      {showMutualModal && (
        <Modal_MutualInterests
          friend={friend}
          onDismiss={() => setShowMutualModal(false)}
        />
      )}
    </>
  );
};

export default React.memo(FriendCard);
