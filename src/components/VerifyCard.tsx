import React, { PropsWithChildren, useContext } from 'react';
import { Icon, IconButton, Text } from 'react-native-paper';
import Surface from './ui/Surface';
import { View } from 'react-native';
import Paragraph from './ui/Paragraph';
import palette from '@theme/_palette';
import { authContext } from '@data/context/auth';

interface Props {

}

const VerifyCard: React.FC<Props> = () => {
  const { refreshUserData, sendVerificationEmail } = useContext(authContext);

  return (
    <View>
      <Surface style={{ padding: 10, marginVertical: 10 }}>
        <View style={{ width: '100%', alignItems: 'flex-start' }}>
          <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'space-between', width: '100%' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon source="security" size={40} color={palette.orange} />
              <Paragraph variant="titleMedium" style={{ marginLeft: 10 }}>
                Account verification
              </Paragraph>
            </View>
            <IconButton icon={'refresh'} iconColor={palette.primary} onPress={refreshUserData} />
          </View>
          <Paragraph style={{ color: palette.placeholder, marginTop: 10, fontSize: 14 }}>
            You have not verified your account yet. Please check your emails for the verification link.
          </Paragraph>
          <Paragraph style={{ color: palette.placeholder, fontSize: 12 }}>
            If you have not received the email please check your spam/junk folder.
          </Paragraph>
          <Paragraph style={{ color: palette.primary, marginTop: 10 }} onPress={() => sendVerificationEmail()}>
            Resend email
          </Paragraph>
        </View>
      </Surface>

      <Surface style={{ padding: 20, marginVertical: 10, alignItems: 'center' }}>
        <Icon source="account-group-outline" size={80} color={palette.placeholder} />
        <Paragraph variant="titleLarge" style={{ marginTop: 20, textAlign: 'center', color: palette.placeholder }}>
          Verification Required
        </Paragraph>
        <Paragraph style={{ color: palette.placeholder, marginTop: 15, fontSize: 14, textAlign: 'center', lineHeight: 22 }}>
          The Friends feature allows you to connect with other users, share your watchlists, and discover what your friends are watching.
        </Paragraph>
        <Paragraph style={{ color: palette.placeholder, marginTop: 10, fontSize: 14, textAlign: 'center', lineHeight: 22 }}>
          To access this feature and start connecting with friends, you'll need to verify your email address first.
        </Paragraph>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
          <Icon source="email-check" size={24} color={palette.primary} />
          <Paragraph style={{ color: palette.primary, marginLeft: 8, fontSize: 14 }}>
            Verify your email to unlock Friends
          </Paragraph>
        </View>
      </Surface>
    </View>
  )
};

export default React.memo(VerifyCard);
