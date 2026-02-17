import React, { PropsWithChildren, useContext, useState } from 'react';
import { View } from 'react-native';
import { Icon, Text, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Surface from './ui/Surface';
import palette from '@theme/_palette';
import Paragraph from './ui/Paragraph';
import { Button } from './ui/Button';
import { authContext } from '@data/context/auth';
import { MainStackParams } from '../navigation';

interface Props {

}

const Login: React.FC<Props> = () => {
  const { login } = useContext(authContext);
  const navigation = useNavigation<StackNavigationProp<MainStackParams>>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleLogin = async () => {
    setErrorMessage(undefined);

    if (!email || !password) {
      setErrorMessage("Please enter both email and password");
      return;
    }

    setIsLoggingIn(true);
    const success = await login(email, password);
    setIsLoggingIn(false);

    if (success) {
      setEmail('');
      setPassword('');
    } else {
      setErrorMessage("Login failed. Please check your credentials.");
    }
  };

  return (
    <View style={{ paddingTop: 10 }}>
      <Surface style={{ padding: 10, marginVertical: 10 }}>
        <View style={{ width: '100%' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon source="account-circle" size={60} color={palette.primary} />
            <View style={{
              marginLeft: 5
            }}>
              <Paragraph variant="titleMedium" style={{ marginTop: 10, marginBottom: 5 }}>
                Sign in to your account
              </Paragraph>
              <Paragraph style={{ color: palette.placeholder, marginBottom: 20 }}>
                Sync your favourites across devices
              </Paragraph>
            </View>
          </View>

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={{
              width: '100%',
              marginBottom: 15,
              backgroundColor: palette.surface,
              borderRadius: 10,
            }}
            contentStyle={{
              overflow: 'hidden',
            }}
            multiline={false}
            numberOfLines={1}
            underlineStyle={{ display: 'none' }}
            textColor={palette.brightWhite}
            placeholderTextColor={palette.white_50}
            left={<TextInput.Icon icon="email" color={palette.brightWhite} />}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry={!showPassword}
            style={{
              width: '100%',
              marginBottom: 20,
              backgroundColor: palette.surface,
              borderRadius: 10,
            }}
            underlineStyle={{ display: 'none' }}
            textColor={palette.brightWhite}
            placeholderTextColor={palette.white_50}
            left={<TextInput.Icon icon="lock" color={palette.brightWhite} />}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
                color={palette.brightWhite}
              />
            }
          />

          <Button
            onPress={handleLogin}
            loading={isLoggingIn}
          >
            Sign In
          </Button>

          {errorMessage && (
            <Paragraph style={{ color: palette.error, fontWeight: 'bold', marginTop: 20 }}>
              {errorMessage}
            </Paragraph>
          )}

          <View style={{ flexDirection: 'row', marginTop: 15, width: '100%', justifyContent: 'center' }}>
            <Paragraph style={{ color: palette.placeholder, fontSize: 12 }}>
              Don't have an account?{' '}
            </Paragraph>
            <Paragraph
              onPress={() => navigation.navigate('Register')}
              style={{ color: palette.primary, fontSize: 12, fontWeight: 'bold' }}
            >
              Sign Up
            </Paragraph>
          </View>


        </View>
      </Surface>

      <Surface style={{ padding: 15, marginVertical: 10 }}>
        <View style={{ width: '100%' }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}>

            <Icon source="cloud-sync" size={40} color={palette.blue} />
            <Paragraph variant="titleSmall" style={{
              marginTop: 10,
              marginBottom: 5,
              marginLeft: 5
            }}>
              Why sign in?
            </Paragraph>
          </View>
          <View style={{ marginTop: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Icon source="check-circle" size={20} color={palette.success} />
              <Paragraph style={{ marginLeft: 10, flex: 1 }}>
                Sync favourites across all your devices
              </Paragraph>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Icon source="check-circle" size={20} color={palette.success} />
              <Paragraph style={{ marginLeft: 10, flex: 1 }}>
                Backup your data to the cloud
              </Paragraph>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Icon source="check-circle" size={20} color={palette.success} />
              <Paragraph style={{ marginLeft: 10, flex: 1 }}>
                Share your favourites with your friends
              </Paragraph>
            </View>
          </View>
        </View>
      </Surface>
    </View>
  )
};

export default React.memo(Login);
