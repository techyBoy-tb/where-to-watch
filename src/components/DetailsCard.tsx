import config from "@data/config";
import { useNavigation } from "@react-navigation/native";
import palette from "@theme/_palette";
import { getGenres } from "@utils/parse";
import React, { useMemo } from "react";
import { View } from "react-native";
import { MediaType, MovieDetails, PersonDetails, ShowDetails } from "@utils/types";
import { Card, Text, TouchableRipple } from "react-native-paper";

interface Props {
    details: MovieDetails | ShowDetails | PersonDetails;
    showIcon?: boolean;
}

const DetailsCard: React.FC<Props> = ({ details, showIcon }) => {
    const navigation = useNavigation();

    const displayInfo = useMemo(() => {
        let title = '';
        let genres: number[] | undefined;
        let subtitle: string | undefined;

        if (details.mediaType === MediaType['movie']) {
            title = (details as MovieDetails).originalTitle;
            genres = (details as MovieDetails).genreIds

        }
        if (details.mediaType === MediaType['show']) {
            title = (details as ShowDetails).originalName;
            genres = (details as ShowDetails).genres
        }
        if (details.mediaType === MediaType['person']) {
            title = (details as PersonDetails).name;
            subtitle = (details as PersonDetails).knownForDepartment;
        }

        return {
            title,
            genres,
            subtitle,
        }
    }, [details]);


    return (
        <View style={{
            borderRadius: 10,
            overflow: 'hidden'
        }}>
            <TouchableRipple
                onPress={() =>
                    navigation.navigate('Details', { id: details.id, mediaType: details.mediaType })
                }
            >
                <>
                    <Card.Cover
                        source={{
                            uri: `${config.imageUrl}${details.posterPath}`,
                            height: 300,
                        }}
                        style={{
                            borderRadius: 10,
                            height: 300
                        }}

                    />
                    <View style={{
                        position: 'absolute',
                        backgroundColor: palette.black_80,
                        bottom: 0,
                        width: '100%',
                        paddingBottom: 10,
                        paddingLeft: 5
                    }}>
                        <Text
                            variant="titleMedium"
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {displayInfo.title}
                        </Text>
                        {displayInfo.genres &&
                            <Text
                                variant="bodySmall"
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={{ width: 175 }}
                            >
                                {getGenres(displayInfo.genres)}
                            </Text>
                        }
                        {displayInfo.subtitle &&
                            <Text
                                variant="bodySmall"
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={{ width: 175 }}
                            >
                                {displayInfo.subtitle}
                            </Text>
                        }
                    </View>
                </>
            </TouchableRipple>
        </View>

    )
}

export default DetailsCard;