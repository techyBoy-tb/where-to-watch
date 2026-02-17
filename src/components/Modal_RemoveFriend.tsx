import React, { PropsWithChildren, useContext } from 'react';
import { View } from 'react-native';
import { Modal, Portal, Text, TouchableRipple } from 'react-native-paper';
import Paragraph from './ui/Paragraph';
import { authContext } from '@data/context/auth';
import palette from '@theme/_palette';
import { Button } from './ui/Button';
import { databaseContext } from '@data/context/database';
import { Friend } from '@utils/types';

interface Props {
  friend: Friend;
  onDismiss: () => void;
  onRemove: () => void;
}

const Modal_RemoveFriend: React.FC<Props> = ({ friend, onDismiss, onRemove }) => {

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
              Are you sure you want to remove friend?
            </Paragraph>
            <Paragraph>
              Removing {friend.name ?? friend.email} as a friend will mean you will no longer be able to share your common movies/shows/people.
            </Paragraph>
            <Paragraph
              style={{
                fontSize: 12,
                fontFamily: 'italic',
                color: palette.primary
              }}
            >
              Not to worry you can always re-add {friend.name ?? friend.email} as a friend later.
            </Paragraph>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <Button onPress={onDismiss} style={{ width: '45%' }}>
              Cancel
            </Button>
            <Button
              onPress={onRemove}
              style={{ width: '45%', backgroundColor: palette.error }}
            >
              Remove
            </Button>
          </View>
        </View>
      </Modal>
    </Portal>
  )
};

export default React.memo(Modal_RemoveFriend);
