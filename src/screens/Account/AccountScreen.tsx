import React, { useContext, useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { TextInput, Icon, ActivityIndicator, Searchbar } from 'react-native-paper';
import Wrap from '@components/Wrap';
import Surface from '@components/ui/Surface';
import Paragraph from '@components/ui/Paragraph';
import { authContext } from '@data/context/auth';
import palette from '@theme/_palette';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ScreenHeader from '@components/ui/ScreenHeader';
import theme from '@theme';
import { Button } from '@components/ui/Button';
import { databaseContext } from '@data/context/database';
import Login from '@components/Login';
import AccountDetails from '@components/AccountDetails';

interface Props { }

const AccountScreen: React.FC<Props> = () => {
  const { isLoading, isLoggedIn } = useContext(authContext);

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

        {!isLoggedIn ? (
          <Login />
        ) : (
          <AccountDetails />
        )}
      </KeyboardAwareScrollView>
    </Wrap>
  );
};

export default React.memo(AccountScreen);
