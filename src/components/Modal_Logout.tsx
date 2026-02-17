import React, { PropsWithChildren, useContext } from 'react';
import { View } from 'react-native';
import { Modal, Portal, Text, TouchableRipple } from 'react-native-paper';
import Paragraph from './ui/Paragraph';
import { authContext } from '@data/context/auth';
import palette from '@theme/_palette';
import { Button } from './ui/Button';
import { databaseContext } from '@data/context/database';

interface Props {
  onDismiss: () => void;
}

const Modal_Logout: React.FC<Props> = ({ onDismiss }) => {
  const { logout } = useContext(authContext);
  const { wipeDatabase } = useContext(databaseContext);

  const handleLogout = async () => {
    await wipeDatabase();
    await logout();
  }

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
              Are you sure you want to logout?
            </Paragraph>
            <Paragraph>
              Logging out means your favourites on this device will be wiped!
            </Paragraph>
            <Paragraph
              style={{
                fontSize: 12,
                fontFamily: 'italic',
                color: palette.primary
              }}
            >
              Not to worry if your favourites are saved to the cloud
            </Paragraph>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <Button onPress={onDismiss} style={{ width: '45%' }}>
              Cancel
            </Button>
            <Button
              onPress={handleLogout}
              style={{ width: '45%', backgroundColor: palette.error }}
              icon='logout'
            >
              Logout
            </Button>
          </View>
        </View>
      </Modal>
    </Portal>
  )
};

export default React.memo(Modal_Logout);
