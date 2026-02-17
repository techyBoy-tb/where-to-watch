import config from "@data/config";
import palette from "@theme/_palette";
import { getGenres } from "@utils/parse";
import { MediaType, MultiDetails } from "@utils/types";
import React, { FC, useCallback, useMemo, useState } from "react";
import { View, Image } from "react-native";
import { Chip, Icon, List, Text, TouchableRipple } from "react-native-paper";
import ReadMore from "react-native-read-more-text";
import Surface from "@components/ui/Surface";
import { useNavigation } from "@react-navigation/native";
import { success } from "@utils/trace";

interface Props {
    result: MultiDetails;
}

const SearchResultCard: FC<Props> = ({ result }) => {
    const navigation = useNavigation();

    const details = useMemo(() => {
        let icon = 'movie-open-outline';
        let title = result.originalTitle;
        let date = result.releaseDate;

        if (result.mediaType === MediaType['show']) {
            icon = 'television-classic';
            title = result.originalName;
            date = result.firstAirDate;
        }

        return {
            title,
            icon,
            date: date?.slice(0, 4)
        }
    }, []);

    const onPress = useCallback(async () => {
        const { mediaType } = result;
        navigation.navigate('Details', { id: result.id, mediaType })
    }, []);

    return (
        <View style={{ overflow: 'hidden', paddingRight: 10, marginVertical: 5 }}>
            <Surface onPress={onPress}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                        source={{ uri: `${config.imageUrl}${result.posterPath}` }}
                        style={{ height: 150, width: 100 }}
                        resizeMode="contain"
                    />

                    {result.mediaType === MediaType['person'] ? (
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <View style={{ height: 5 }} />
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Icon size={20} source={'account-outline'} color={palette.primary} />
                                <Text
                                    variant="titleMedium"
                                    style={{ color: palette.text, fontWeight: "bold", paddingLeft: 5 }}
                                >
                                    {result.name ?? result.originalName}
                                </Text>
                            </View>
                            <Text
                                variant="labelSmall"
                            >
                                {result.knownForDepartment}
                            </Text>

                            <View
                                style={{
                                    flexDirection: "row",
                                    flexWrap: "wrap",
                                    marginVertical: 6,
                                }}
                            >
                                {(result.knownFor ?? []).map((g) => (
                                    <Chip
                                        key={`${g.id}_${g.title}`}
                                        style={{
                                            marginHorizontal: 4,
                                            marginVertical: 3,
                                            backgroundColor: "rgba(255,255,255,0.12)",
                                            borderColor: "rgba(255,255,255,0.2)",
                                            borderWidth: 1,
                                            borderRadius: 10,
                                            // 
                                            height: undefined,
                                        }}
                                        compact
                                        textStyle={{
                                            color: "white",
                                            fontSize: 10,
                                            lineHeight: 12,
                                        }}
                                    >
                                        {g.title ?? g.originalTitle}
                                    </Chip>
                                ))}
                            </View>
                        </View>
                    ) : (

                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <View style={{ height: 5 }} />
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Icon size={20} source={details.icon} color={palette.primary} />
                                <Text
                                    variant="titleMedium"
                                    style={{ color: palette.text, fontWeight: "bold", paddingLeft: 5 }}
                                >
                                    {details.title}
                                </Text>
                            </View>
                            <View style={{ height: 5 }} />
                            <Text
                                variant="labelSmall"
                            >
                                {details.date} – {getGenres(result.genreIds)}
                            </Text>

                            <View style={{ height: 10 }} />

                            <Text
                                variant="bodyMedium"
                                style={{ color: "#CAC4D0", fontSize: 12 }}
                                numberOfLines={4}
                            >
                                {result.overview}
                            </Text>
                        </View>
                    )}

                </View>
            </Surface>
        </View>

    );
}

export default SearchResultCard;