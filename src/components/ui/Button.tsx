import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Button as RNPButton, useTheme, ButtonProps as RNPButtonProps } from 'react-native-paper';

interface ButtonProps extends RNPButtonProps {
    loading?: boolean;
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
    disabledOpacity?: number; // optional customization
};

export const Button: React.FC<ButtonProps> = ({
    loading = false,
    onPress,
    style,
    disabledOpacity = 0.6,
    ...props
}) => {
    const theme = useTheme();

    const backgroundColor = loading
        ? `${theme.colors.primary}${Math.round(disabledOpacity * 255)
            .toString(16)
            .padStart(2, '0')}`
        : theme.colors.primary;

    return (
        <RNPButton
            mode="contained"
            onPress={loading ? undefined : onPress}
            loading={loading}
            buttonColor={backgroundColor}
            style={[
                {
                    width: '100%',
                    borderRadius: 10,
                },
                style,
            ]}
            accessibilityState={{ disabled: loading }}
            {...props}
        >
            {props.children}
        </RNPButton>
    );
};
