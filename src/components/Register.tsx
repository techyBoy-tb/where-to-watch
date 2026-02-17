import React, { useContext, useState } from 'react';
import { View } from 'react-native';
import { Icon, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Surface from './ui/Surface';
import palette from '@theme/_palette';
import Paragraph from './ui/Paragraph';
import { Button } from './ui/Button';
import { authContext } from '@data/context/auth';
import { MainStackParams } from '../navigation';

interface Props { }

const Register: React.FC<Props> = () => {
  const { register } = useContext(authContext);
  const navigation = useNavigation<StackNavigationProp<MainStackParams>>();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleRegister = async () => {
    setErrorMessage(undefined);

    // Validation
    if (!email || !password || !confirmPassword) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    setIsRegistering(true);
    const success = await register(email, password, displayName || undefined);
    setIsRegistering(false);

    if (success) {
      setDisplayName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      navigation.goBack();
      // User will be automatically logged in and redirected
    } else {
      setErrorMessage("Registration failed. Email may already be in use.");
    }
  };

  return (
    <View style={{ paddingTop: 10 }}>
      <Surface style={{ padding: 10, marginVertical: 10 }}>
        <View style={{ width: '100%' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon source="account-plus" size={60} color={palette.success} />
            <View style={{ marginLeft: 5 }}>
              <Paragraph variant="titleMedium" style={{ marginTop: 10, marginBottom: 5 }}>
                Create your account
              </Paragraph>
              <Paragraph style={{ color: palette.placeholder, marginBottom: 20 }}>
                Start syncing your favourites
              </Paragraph>
            </View>
          </View>

          <TextInput
            label="Display Name (Optional)"
            value={displayName}
            onChangeText={setDisplayName}
            mode="outlined"
            autoCapitalize="words"
            style={{
              width: '100%',
              marginBottom: 15,
              backgroundColor: palette.surface,
              borderRadius: 10,
            }}
            underlineStyle={{ display: 'none' }}
            textColor={palette.brightWhite}
            placeholderTextColor={palette.white_50}
            left={<TextInput.Icon icon="account" color={palette.brightWhite} />}
          />

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
              marginBottom: 15,
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

          <TextInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            mode="outlined"
            secureTextEntry={!showConfirmPassword}
            style={{
              width: '100%',
              marginBottom: 20,
              backgroundColor: palette.surface,
              borderRadius: 10,
            }}
            underlineStyle={{ display: 'none' }}
            textColor={palette.brightWhite}
            placeholderTextColor={palette.white_50}
            left={<TextInput.Icon icon="lock-check" color={palette.brightWhite} />}
            right={
              <TextInput.Icon
                icon={showConfirmPassword ? "eye-off" : "eye"}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                color={palette.brightWhite}
              />
            }
          />

          <Button
            onPress={handleRegister}
            loading={isRegistering}
          >
            Create Account
          </Button>

          {errorMessage && (
            <Paragraph style={{ color: palette.error, fontWeight: 'bold', marginTop: 20 }}>
              {errorMessage}
            </Paragraph>
          )}

          <View style={{ flexDirection: 'row', marginTop: 15, width: '100%', justifyContent: 'center' }}>
            <Paragraph style={{ color: palette.placeholder, fontSize: 12 }}>
              Already have an account?{' '}
            </Paragraph>
            <Paragraph
              onPress={() => navigation.goBack()}
              style={{ color: palette.primary, fontSize: 12, fontWeight: 'bold' }}
            >
              Sign In
            </Paragraph>
          </View>
        </View>
      </Surface>

      <Surface style={{ padding: 15, marginVertical: 10 }}>
        <View style={{ width: '100%' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon source="shield-check" size={40} color={palette.success} />
            <Paragraph variant="titleSmall" style={{ marginTop: 10, marginBottom: 5, marginLeft: 5 }}>
              Your data is secure
            </Paragraph>
          </View>
          <View style={{ marginTop: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Icon source="check-circle" size={20} color={palette.success} />
              <Paragraph style={{ marginLeft: 10, flex: 1 }}>
                Encrypted cloud storage
              </Paragraph>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Icon source="check-circle" size={20} color={palette.success} />
              <Paragraph style={{ marginLeft: 10, flex: 1 }}>
                No personal data collection
              </Paragraph>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Icon source="check-circle" size={20} color={palette.success} />
              <Paragraph style={{ marginLeft: 10, flex: 1 }}>
                Your favourites stay private
              </Paragraph>
            </View>
          </View>
        </View>
      </Surface>
    </View>
  );
};

export default React.memo(Register);
