import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
    View,
    TouchableOpacity,
    StyleProp,
    TextStyle,
} from 'react-native';
import { Divider, IconButton, Text } from 'react-native-paper';

import palette from '@theme/_palette';
import { SafeAreaView } from 'react-native-safe-area-context';
import SvgIconLeft from '@components/svg/icons/SvgIconLeft';

type Colours = keyof typeof palette;

interface Props {
    title?: string;
    showBackLink: boolean;
    subtitle?: string;
    colour?: Colours;
    titleStyle?: StyleProp<TextStyle>;
    subtitleStyle?: StyleProp<TextStyle>;
}

const ScreenHeader: React.FC<Props> = ({
    title = 'Back',
    subtitle,
    showBackLink,
    colour = 'white',
    titleStyle,
    subtitleStyle,
}) => {
    const navigation = useNavigation();

    const TitleAndSubtitle = () => (
        <>
            <Text style={[{ fontSize: 18, color: palette[colour] }, titleStyle]}>
                {title}
            </Text>
            {subtitle?.length && (
                <Text
                    style={[
                        {
                            marginVertical: 0,
                            color: palette.white_50,
                        },
                        subtitleStyle,
                    ]}
                >
                    {subtitle}
                </Text>
            )}
        </>
    );

    return (
        <>
            <SafeAreaView
                edges={[]}
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <View
                    style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start' }}
                >
                    <View style={{ height: 42 }}>
                        {showBackLink && (
                            <IconButton
                                icon={() => <SvgIconLeft size={25} />}
                                onPress={() => navigation.goBack()}
                            />
                        )}
                    </View>
                    <View
                        style={{
                            paddingHorizontal: showBackLink ? 0 : 15,
                            justifyContent: 'center',
                            height: 50,
                        }}
                    >
                        {showBackLink ? (
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.goBack();
                                }}
                            >
                                <TitleAndSubtitle />
                            </TouchableOpacity>
                        ) : (
                            <TitleAndSubtitle />
                        )}
                    </View>
                </View>
            </SafeAreaView>

            <Divider />
        </>
    );
};

export default ScreenHeader;
