import { DefaultTheme, MD3Theme } from 'react-native-paper';

import palette from './_palette';

const theme: MD3Theme = {
    ...DefaultTheme,
    version: 3,
    isV3: true,

    roundness: 10,

    dark: true,

    colors: {
        ...DefaultTheme.colors,

        primary: palette.primary,
        // secondary: palette.secondary,
        // tertiary: palette.tertiary,

        background: palette.black,

        surface: palette.surface,
        onSurface: palette.white,

        error: palette.error,
        backdrop: palette.brightBlack_50,
    },

    // These families are loaded in Root.tsx
    // fonts: {
    //     thin: {
    //         fontFamily: 'light',
    //         fontWeight: '300',
    //     },
    //     light: {
    //         fontFamily: 'light',
    //         fontWeight: '400',
    //     },
    //     regular: {
    //         fontFamily: 'regular',
    //         fontWeight: '500',
    //     },
    //     medium: {
    //         fontFamily: 'medium',
    //         fontWeight: '700',
    //     },
    // },
    fonts: {
        ...DefaultTheme.fonts,
        default: {
            letterSpacing: 1,
            fontFamily: 'regular',
            fontWeight: "normal",
            fontStyle: 'normal'
        }
    },

    // Modal fades
    animation: {
        scale: 2,
    },
};

export default theme;
