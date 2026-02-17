import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import KeyboardAwareScrollView from '@components/ui/KeyboardAwareScrollView';
import { FAB, ActivityIndicator } from 'react-native-paper';

import Wrap from '@components/Wrap';
import { authContext } from '@data/context/auth';
import { View } from 'react-native';
import palette from '@theme/_palette';
import VerifyCard from '@components/VerifyCard';
import FeatureLock from '@components/FeatureLock';
import { Friend, FriendStatus } from '@utils/types';
import FriendCard from '@components/FriendCard';
import PendingRequestCard from '@components/PendingRequestCard';
import Modal_AddFriend from '@components/Modal_AddFriend';
import Paragraph from '@components/ui/Paragraph';
import {
  getFriends,
  removeFriend,
  getPendingFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest
} from '@data/firebase/friends';
import { err, log, success } from '@utils/trace';
import Modal_RemoveFriend from '@components/Modal_RemoveFriend';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

interface Props { }

const FriendsScreen: React.FC<Props> = () => {
  const navigation = useNavigation();

  const { user } = useContext(authContext);

  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [friendDetails, setFriendDetails] = useState<Friend>();

  useEffect(() => {
    if (user?.uid && user?.isVerified) {
      loadFriendsData();
    }
  }, [user?.uid, user?.isVerified]);

  const loadFriendsData = async () => {
    if (!user?.uid) return;

    try {
      setIsLoading(true);
      const [friendsList, requestsList] = await Promise.all([
        getFriends(user.uid),
        getPendingFriendRequests(user.uid)
      ]);
      setFriends(friendsList);
      setPendingRequests(requestsList);
    } catch (error) {
      err('[FriendsScreen]', 'Error loading friends');
      log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFriend = async (friendUserId: string) => {
    if (!user?.uid) return;

    try {
      const result = await removeFriend(user.uid, friendUserId);
      if (result) {
        success('[FriendsScreen]', 'Friend removed successfully');
        // Refresh friends list
        await loadFriendsData();
      }
    } catch (error) {
      err('[FriendsScreen]', 'Error removing friend');
      log(error);
    }
  };

  const handleAcceptRequest = async (friendUserId: string) => {
    if (!user?.uid) return;

    try {
      const result = await acceptFriendRequest(user.uid, friendUserId);
      if (result) {
        success('[FriendsScreen]', 'Friend request accepted');
        // Refresh friends list
        await loadFriendsData();
      }
    } catch (error) {
      err('[FriendsScreen]', 'Error accepting friend request');
      log(error);
    }
  };

  const handleRejectRequest = async (friendUserId: string) => {
    if (!user?.uid) return;

    try {
      const result = await rejectFriendRequest(user.uid, friendUserId);
      if (result) {
        success('[FriendsScreen]', 'Friend request rejected');
        // Refresh friends list
        await loadFriendsData();
      }
    } catch (error) {
      err('[FriendsScreen]', 'Error rejecting friend request');
      log(error);
    }
  };

  return (
    <Wrap>
      <BottomSheetModalProvider>
        <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {user ? (
            <>
              {!user?.isVerified ? (
                <VerifyCard />
              ) : (
                <View style={{ flex: 1 }}>
                  {isLoading ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                      <ActivityIndicator size="large" color={palette.primary} />
                      <Paragraph style={{ marginTop: 10, color: palette.placeholder }}>
                        Loading friends...
                      </Paragraph>
                    </View>
                  ) : friends.length === 0 && pendingRequests.length === 0 ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                      <Paragraph variant="titleLarge" style={{ color: palette.placeholder, textAlign: 'center' }}>
                        No friends yet
                      </Paragraph>
                      <Paragraph style={{ color: palette.placeholder, textAlign: 'center', marginTop: 10 }}>
                        Tap the + button below to add your first friend!
                      </Paragraph>
                    </View>
                  ) : (
                    <View style={{ paddingBottom: 80 }}>
                      {pendingRequests.length > 0 && (
                        <View>
                          <Paragraph
                            variant="titleMedium"
                            style={{ marginHorizontal: 15, marginTop: 10, marginBottom: 5, color: palette.warning }}
                          >
                            Pending Requests ({pendingRequests.length})
                          </Paragraph>
                          {pendingRequests.map((request) => (
                            <PendingRequestCard
                              key={request.id}
                              request={request}
                              onAccept={() => handleAcceptRequest(request.userId)}
                              onReject={() => handleRejectRequest(request.userId)}
                            />
                          ))}
                        </View>
                      )}

                      {friends.length > 0 && (
                        <View>
                          <Paragraph
                            variant="titleMedium"
                            style={{
                              marginHorizontal: 15,
                              marginTop: pendingRequests.length > 0 ? 20 : 10,
                              marginBottom: 5,
                              color: palette.brightWhite
                            }}
                          >
                            Friends ({friends.length})
                          </Paragraph>
                          {friends.map((friend) => (
                            <FriendCard
                              key={friend.id}
                              friend={friend}
                              onRemove={() => setFriendDetails(friend)}
                            />
                          ))}
                        </View>
                      )}
                    </View>
                  )}
                </View>
              )}
            </>
          ) : (
            <FeatureLock />
          )}
        </KeyboardAwareScrollView>

        {user?.isVerified && (
          <FAB
            icon="account-plus"
            style={{
              position: 'absolute',
              margin: 16,
              right: 0,
              bottom: 100,
              backgroundColor: palette.primary,
            }}
            color={palette.brightWhite}
            onPress={() => setShowAddFriendModal(true)}
          />
        )}

        {showAddFriendModal && (
          <Modal_AddFriend
            onDismiss={() => setShowAddFriendModal(false)}
            onSuccess={loadFriendsData}
          />
        )}

        {friendDetails && (
          <Modal_RemoveFriend
            friend={friendDetails}
            onDismiss={() => setFriendDetails(undefined)}
            onRemove={() => () => {
              handleRemoveFriend(friendDetails.id);
              setFriendDetails(undefined);
            }}
          />
        )}
      </BottomSheetModalProvider>
    </Wrap>
  );
};

export default React.memo(FriendsScreen);
