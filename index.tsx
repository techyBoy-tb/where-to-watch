import './gesture-handler';

import '@expo/metro-runtime'; // Necessary for Fast Refresh on Web
import { registerRootComponent } from 'expo';

import { App } from './src/App';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';

// Initialize Firebase (imported to ensure it's initialized at app start)
import './src/data/firebase/config';


// This is the default configuration
configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false, // Reanimated runs in strict mode by default
});

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
