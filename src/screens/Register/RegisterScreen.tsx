import React, { useContext } from 'react';
import { ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Wrap from '@components/Wrap';
import ScreenHeader from '@components/ui/ScreenHeader';
import Register from '@components/Register';
import { authContext } from '@data/context/auth';
import palette from '@theme/_palette';

interface Props {}

const RegisterScreen: React.FC<Props> = () => {
  const { isLoading } = useContext(authContext);

  if (isLoading) {
    return (
      <Wrap center>
        <ActivityIndicator size="large" color={palette.primary} />
      </Wrap>
    );
  }

  return (
    <Wrap>
      <KeyboardAwareScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <ScreenHeader showBackLink />
        <Register />
      </KeyboardAwareScrollView>
    </Wrap>
  );
};

export default React.memo(RegisterScreen);
