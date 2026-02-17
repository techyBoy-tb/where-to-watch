import palette from '@theme/_palette';
import React from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-paper';
import Paragraph from './ui/Paragraph';
import { useNavigation } from '@react-navigation/native';
import Surface from './ui/Surface';

interface Props {

}

const FeatureLock: React.FC<Props> = ({ }) => {
  const navigation = useNavigation();

  return (
    <Surface style={{ padding: 10, marginVertical: 10, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ alignItems: 'center', maxWidth: 400 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          <Icon source="account-lock" size={60} color={palette.placeholder} />
          <View style={{ marginHorizontal: 10 }} />
          <Icon source="account-group-outline" size={80} color={palette.placeholder} />
        </View>
        <Paragraph variant="titleLarge" style={{ marginTop: 10, textAlign: 'center', color: palette.placeholder }}>
          Friends Feature Locked
        </Paragraph>
        <Paragraph style={{ color: palette.placeholder, marginTop: 15, fontSize: 14, textAlign: 'center', lineHeight: 22 }}>
          Connect with friends, share your favorite movies and shows, and discover what others are watching!
        </Paragraph>
        <Paragraph style={{ color: palette.placeholder, marginTop: 15, fontSize: 14, textAlign: 'center', lineHeight: 22 }}>
          To access the Friends feature, you'll need to:
        </Paragraph>
        <View style={{ marginTop: 15, width: '100%' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Icon source="account-plus" size={24} color={palette.primary} />
            <Paragraph style={{ color: palette.placeholder, marginLeft: 12, fontSize: 14, }}>
              Create an account or log in
            </Paragraph>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Icon source="email-check" size={24} color={palette.primary} />
            <Paragraph style={{ color: palette.placeholder, marginLeft: 12, fontSize: 14, }}>
              Verify your email address
            </Paragraph>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon source="check-circle" size={24} color={palette.primary} />
            <Paragraph style={{ color: palette.placeholder, marginLeft: 12, fontSize: 14, }}>
              Start connecting with friends!
            </Paragraph>
          </View>
        </View>
        <Paragraph style={{ color: palette.primary, marginTop: 25, fontSize: 16, fontWeight: '600' }} onPress={() => navigation.navigate('Account' as never)}>
          Go to Account
        </Paragraph>
      </View>
    </Surface>
  )
};

export default React.memo(FeatureLock);
