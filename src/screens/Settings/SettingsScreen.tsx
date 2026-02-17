import React, { useContext } from 'react';
import { View, ScrollView } from 'react-native';
import { Icon } from 'react-native-paper';
import Wrap from '@components/Wrap';
import Surface from '@components/ui/Surface';
import Paragraph from '@components/ui/Paragraph';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import palette from '@theme/_palette';
import { authContext } from '@data/context/auth';
import { MainStackParams } from '../../navigation';

interface Props { }

const SettingsScreen: React.FC<Props> = () => {
  const navigation = useNavigation<StackNavigationProp<MainStackParams>>();
  const { isLoggedIn, user } = useContext(authContext);

  return (
    <Wrap>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ paddingLeft: 15, paddingTop: 20, paddingBottom: 10 }}>
          <Paragraph variant='titleLarge'>Settings</Paragraph>
        </View>

        {/* Account Section */}
        <Surface
          onPress={() => navigation.navigate('Account')}
          style={{
            padding: 10,
            // marginVertical: 5,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <Icon
              source={isLoggedIn ? "account-circle" : "account-circle-outline"}
              size={30}
              color={isLoggedIn ? palette.primary : palette.placeholder}
            />
            <View style={{ marginLeft: 15, flex: 1 }}>
              <Paragraph variant="bodyLarge">Account</Paragraph>
              <Paragraph style={{ color: palette.placeholder, fontSize: 12 }}>
                {isLoggedIn ? `Signed in as ${user?.email}` : 'Sign in to sync your data'}
              </Paragraph>
            </View>
          </View>
          <Icon source="chevron-right" size={24} color={palette.placeholder} />
        </Surface>

        {/* Additional Settings Options */}
        <View style={{ paddingLeft: 15, paddingTop: 20, paddingBottom: 10 }}>
          <Paragraph variant='titleMedium'>App Settings</Paragraph>
        </View>

        <Surface
          onPress={() => navigation.navigate('DeviceInfo')}
          style={{
            padding: 10,
            marginVertical: 5,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <Icon source="information" size={30} color={palette.placeholder} />
            <View style={{ marginLeft: 15, flex: 1 }}>
              <Paragraph variant="bodyLarge">About</Paragraph>
              <Paragraph style={{ color: palette.placeholder, fontSize: 12 }}>
                App version and info
              </Paragraph>
            </View>
          </View>
          <Icon source="chevron-right" size={24} color={palette.placeholder} />
        </Surface>
      </ScrollView>
    </Wrap>
  );
};

export default React.memo(SettingsScreen);
