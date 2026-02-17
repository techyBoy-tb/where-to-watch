import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SettingsScreen from '@screens/Settings';
import AccountScreen from '@screens/Account';
import DeviceInfoScreen from '@screens/DeviceInfo';
import RegisterScreen from '@screens/Register';
import React from 'react';
import AnimatedTabBar, { TabsConfigsType } from 'curved-bottom-navigation-bar';
import { Icon } from 'react-native-paper';
import palette from '@theme/_palette';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigatorScreenParams } from '@react-navigation/native';
import { MediaType, Season } from '@utils/types';
import OverviewScreen from '@screens/Overview';
import DetailsScreen from '@screens/Details';
import FavouritesScreen from '@screens/Favourites';
import FriendsScreen from '@screens/Friends';
import SeasonScreen from '@screens/_modals/Season';

export type MainTabsParams = {
  Overview: undefined;
  Favourites: undefined;
  Settings: undefined;
};

export type MainStackParams = {
  Main: NavigatorScreenParams<MainTabsParams>;
  Details: { id: number; mediaType: MediaType };
  Account: undefined;
  Register: undefined;
  Modal_Season: {
    showId: number;
    season: Season;
  }
  DeviceInfo: undefined;
};

const Stack = createStackNavigator<MainStackParams>();
const Tab = createBottomTabNavigator();

export const createAppNavigator = () => {
  const tabs: TabsConfigsType = {
    Overview: {
      icon: ({ progress, focused }) => <Icon source={'movie-outline'} size={25} />,
    },
    Favourites: {
      icon: ({ progress, focused }) => <Icon source={'heart-outline'} size={25} />,
    },
    Settings: {
      icon: ({ progress, focused }) => <Icon source={'cog-outline'} size={25} />,
    },
    Friends: {
      icon: ({ progress, focused }) => <Icon source={'account-group-outline'} size={25} />,
    },
  }

  const MainTabs = () => (
    <Tab.Navigator
      tabBar={props => (
        <AnimatedTabBar
          {...props}
          tabs={tabs}
          barColor={palette.surface}
          dotColor={palette.primary}

        />
      )}
      initialRouteName='Overview'
    >
      <Tab.Screen
        name="Overview"
        component={OverviewScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Favourites"
        component={FavouritesScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Friends"
        component={FriendsScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  )

  const AppNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Group>
        <Stack.Screen
          name="Main"
          component={MainTabs} />

        <Stack.Screen
          name="Details"
          component={DetailsScreen} />

        <Stack.Screen
          name="Account"
          component={AccountScreen} />

        <Stack.Screen
          name="Register"
          component={RegisterScreen} />

        <Stack.Screen
          name="DeviceInfo"
          component={DeviceInfoScreen} />

        <Stack.Group
          screenOptions={{
            presentation: 'modal',
            cardOverlayEnabled: true,
            detachPreviousScreen: false,
            animation: 'slide_from_bottom',
            cardStyle: { backgroundColor: palette.transparent },
          }}
        >
          <Stack.Screen
            name="Modal_Season"
            component={SeasonScreen} />
        </Stack.Group>

      </Stack.Group>
    </Stack.Navigator>
  );

  return AppNavigator;
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends MainStackParams { }
  }
}