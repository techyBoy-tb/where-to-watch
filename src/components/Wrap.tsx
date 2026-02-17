import React, { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import palette from '@theme/_palette';
import { LinearGradient } from 'expo-linear-gradient';

interface Props extends PropsWithChildren {
    fullscreen?: boolean;
    center?: boolean;
}

const Wrap: React.FC<Props> = ({ fullscreen = true, center, children }) => {
    const { top } = useSafeAreaInsets();

    return (
        <View
            style={{
                flex: fullscreen ? 1 : 0,
                paddingTop: fullscreen ? top : 0,
                justifyContent: center ? 'center' : 'flex-start',
            }}
        >
            <LinearGradient
                colors={[
                    "rgba(0,0,0,0)",
                    "#0B1A2A",
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.1, y: 1 }}
                style={{
                    position: "absolute",
                    // bottom: 0,
                    width: "100%",
                    height: "100%",
                }}
            />
            {children}
        </View>
    );
};

export default Wrap;
