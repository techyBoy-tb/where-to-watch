import config from '@data/config';
import { useNavigation } from '@react-navigation/native';
import { Cast as CastType, MediaType } from '@utils/types';
import React from 'react';
import { View, Image, FlatList } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';

interface Props {
    cast: CastType[];
    onPress?: (id: number) => void;
}

const Cast: React.FC<Props> = ({ cast, onPress }) => {
    const navigation = useNavigation();

    return (
        <View style={{ marginTop: 30 }}>
            <Text
                style={{
                    color: "white",
                    fontSize: 20,
                    fontWeight: "700",
                    marginBottom: 10,
                }}
            >
                Cast
            </Text>
            <FlatList
                data={cast}
                horizontal
                keyExtractor={({ id, castId }, index) => `cast-${id}-${castId}-${index}`}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View
                        style={{
                            width: 110,
                            marginRight: 16,
                        }}
                    >
                        <View style={{ borderRadius: 12, overflow: 'hidden' }}>
                            <TouchableRipple
                                onPress={() => {
                                    if (onPress) {
                                        onPress(item.id ?? -1);
                                    } else {
                                        navigation.navigate('Details', { id: item.id ?? -1, mediaType: MediaType['person'] })
                                    }
                                }
                                }
                            >
                                <Image
                                    source={{ uri: `${config.imageUrl}${item.posterPath}` }}
                                    style={{
                                        width: 110,
                                        height: 150,
                                        borderRadius: 12,
                                        backgroundColor: "#1b2c3a",
                                    }}
                                    resizeMode="cover"
                                />
                            </TouchableRipple>
                        </View>

                        <Text
                            style={{
                                color: "white",
                                marginTop: 6,
                                fontSize: 14,
                                fontWeight: "600",
                            }}
                        >
                            {item.name}
                        </Text>
                        <Text
                            style={{
                                color: "#89a0b7",
                                fontSize: 12,
                                marginTop: 2,
                            }}
                        >
                            {item.character}
                        </Text>
                    </View>
                )
                }
            />
        </View>
    );
};

export default Cast;
