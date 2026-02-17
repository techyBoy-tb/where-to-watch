import React, { useContext, useState } from 'react';
import { View } from 'react-native';
import { Modal, Portal, TextInput, ActivityIndicator } from 'react-native-paper';
import Paragraph from './ui/Paragraph';
import { authContext } from '@data/context/auth';
import palette from '@theme/_palette';
import { Button } from './ui/Button';
import { sendFriendRequest } from '@data/firebase/friends';

interface Props {
  onDismiss: () => void;
  onSuccess?: () => void;
}

const Modal_AddFriend: React.FC<Props> = ({ onDismiss, onSuccess }) => {
  const { user } = useContext(authContext);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSendRequest = async () => {
    if (!user?.uid || !user?.email) {
      setError('You must be logged in to send friend requests');
      return;
    }

    if (!email.trim()) {
      setError('Please enter an email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const result = await sendFriendRequest(user.uid, user.email, email.trim());

    setIsLoading(false);

    if (result.success) {
      setSuccess(result.message || 'Friend request sent successfully!');
      setEmail('');
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
          onDismiss();
        }, 1500);
      }
    } else {
      setError(result.message || 'Failed to send friend request');
    }
  };

  return (
    <Portal>
      <Modal
        visible={true}
        onDismiss={onDismiss}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <View
          style={{
            width: "85%",
            paddingBottom: 10,
            backgroundColor: "rgba(15,25,38,0.92)",
            borderRadius: 22,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.10)",
            shadowColor: "#000",
            shadowOpacity: 0.4,
            shadowRadius: 25,
            shadowOffset: { width: 0, height: 12 },
          }}
        >
          <View style={{ padding: 15 }}>
            <Paragraph
              variant='titleLarge'
              style={{
                textAlign: 'center',
                paddingBottom: 10
              }}
            >
              Add Friend
            </Paragraph>
            <Paragraph style={{ marginBottom: 15, textAlign: 'center', color: palette.placeholder }}>
              Enter your friend's email address to send them a friend request
            </Paragraph>

            <TextInput
              label="Friend's Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setError(null);
                setSuccess(null);
              }}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              disabled={isLoading}
              style={{
                backgroundColor: palette.surface,
                marginBottom: 10
              }}
              textColor={palette.brightWhite}
              outlineColor={palette.white_50}
              activeOutlineColor={palette.primary}
              placeholderTextColor={palette.placeholder}
            />

            {error && (
              <View style={{
                backgroundColor: 'rgba(255, 59, 48, 0.1)',
                padding: 10,
                borderRadius: 8,
                marginBottom: 10,
                borderLeftWidth: 3,
                borderLeftColor: palette.error
              }}>
                <Paragraph style={{ color: palette.error, fontSize: 14 }}>
                  {error}
                </Paragraph>
              </View>
            )}

            {success && (
              <View style={{
                backgroundColor: 'rgba(52, 199, 89, 0.1)',
                padding: 10,
                borderRadius: 8,
                marginBottom: 10,
                borderLeftWidth: 3,
                borderLeftColor: palette.primary
              }}>
                <Paragraph style={{ color: palette.primary, fontSize: 14 }}>
                  {success}
                </Paragraph>
              </View>
            )}

            {isLoading && (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <ActivityIndicator size="small" color={palette.primary} />
                <Paragraph style={{ marginLeft: 10, color: palette.placeholder }}>
                  Sending request...
                </Paragraph>
              </View>
            )}
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <Button
              onPress={onDismiss}
              style={{ width: '45%' }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onPress={handleSendRequest}
              style={{ width: '45%', backgroundColor: palette.primary }}
              icon='account-plus'
              disabled={isLoading}
            >
              Send Request
            </Button>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

export default React.memo(Modal_AddFriend);
