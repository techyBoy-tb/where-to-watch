import 'react-native-reanimated';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import { StatusBar } from 'react-native';
import { createAppNavigator } from './navigation';
import theme from '@theme';
import palette from '@theme/_palette';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { initialiseDatabase } from '@data/sqlite';
import { useEffect } from 'react';
import { DatabaseProvider } from '@data/context/database';
import { AuthProvider } from '@data/context/auth';
import { EventProvider } from 'react-native-outside-press';
SplashScreen.preventAutoHideAsync();

export function App() {
  const [loaded] = useFonts({
    mono: require('@assets/fonts/RobotoMono-Regular.ttf'),
    bold: require('@assets/fonts/Nunito-Bold.ttf'),
    light: require('@assets/fonts/Nunito-Light.ttf'),
    medium: require('@assets/fonts/Nunito-Medium.ttf'),
    regular: require('@assets/fonts/Nunito-Regular.ttf'),
    italic: require('@assets/fonts/Nunito-Italic.ttf'),
  });

  useEffect(() => {
    async function init() {
      initialiseDatabase();
    }

    init();
  }, []);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  const AppNavigator = createAppNavigator();

  return (
    <>
      <StatusBar barStyle={'light-content'} />
      <PaperProvider theme={theme}>
        <NavigationContainer
          theme={{
            dark: false, colors: {
              primary: palette.primary,
              text: palette.text,
              notification: palette.blue,
              background: palette.background,
              border: palette.white,
              card: palette.surface
            },
            fonts: {
              medium: {
                fontFamily: 'regular',
                fontWeight: '700',
              },
              bold: {
                fontFamily: 'bold',
                fontWeight: '800',
              },
              heavy: {
                fontFamily: 'bold',
                fontWeight: '900',
              },
              regular: {
                fontFamily: 'light',
                fontWeight: '500',
              },
            }
          }}
          onReady={() => {
            SplashScreen.hideAsync();
          }}>
          <AuthProvider>
            <DatabaseProvider>
              <EventProvider>
                <AppNavigator />
              </EventProvider>
            </DatabaseProvider>
          </AuthProvider>
        </NavigationContainer>
      </PaperProvider>
    </>

  );
}
