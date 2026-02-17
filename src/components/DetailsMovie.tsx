import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import { View, ScrollView, Image, Text as RNText } from "react-native";
import { Text, Chip, Button, IconButton } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

import { Cast as CastType, Crew, MediaType, MovieDetails } from "@utils/types";
import { getGenres } from "@utils/parse";
import config from "@data/config";
import { databaseContext } from "@data/context/database";
import FavouriteIcon from "./FavouriteIcon";
import SvgIconLeft from "./svg/icons/SvgIconLeft";
import { useNavigation } from "@react-navigation/native";
import palette from "@theme/_palette";
import Providers from "./Providers";
import Cast from "./Cast";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParams } from "../navigation";

interface Props {
    movie: MovieDetails;
    cast: CastType[];
    director?: Crew;
}

const DetailsMovie: FC<Props> = ({ movie, cast, director }) => {
    const navigation = useNavigation<StackNavigationProp<MainStackParams, 'Details'>>();
    const {
        favouriteMovies,
        addFavouriteMovie,
        removeFavouriteMovie,
        refresh
    } = useContext(databaseContext);

    const [isFavourite, setIsFavourite] = useState(false);

    useEffect(() => {
        setIsFavourite(!!favouriteMovies.find(({ id }) => id === movie.id))
    }, [favouriteMovies]);

    const addFavourite = useCallback(async () => {
        if (isFavourite) {
            await removeFavouriteMovie(movie.id);
            await refresh();

        } else {
            await addFavouriteMovie(movie);
            await refresh();

        }
    }, [refresh, isFavourite]);

    const genreNames = getGenres(movie.genreIds).split(",");

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: "#0B1A2A" }}
            contentContainerStyle={{ paddingBottom: 60 }}
            scrollIndicatorInsets={{ right: 5 }}
        >
            <View
                style={{
                    width: "100%",
                    height: 560,
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <Image
                    source={{ uri: `${config.imageUrl}${movie.backdropPath}` }}
                    style={{
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                    }}
                    resizeMode="cover"
                />

                <LinearGradient
                    colors={[
                        "rgba(0,0,0,0)",
                        "rgba(0,0,0,0.6)",
                        "#0B1A2A",
                    ]}
                    start={{ x: 0.5, y: 0.2 }}
                    end={{ x: 0.5, y: 1 }}
                    style={{
                        position: "absolute",
                        bottom: 0,
                        width: "100%",
                        height: "60%",
                    }}
                />

                <View
                    style={{
                        position: "absolute",
                        bottom: 0,
                        width: "100%",
                        paddingHorizontal: 20,
                    }}
                >
                    <Text
                        variant="headlineMedium"
                        style={{
                            color: "white",
                            fontWeight: "700",
                            marginBottom: 10,
                            textShadowColor: "rgba(0,0,0,0.6)",
                            textShadowOffset: { width: 0, height: 1 },
                            textShadowRadius: 4,
                            paddingHorizontal: 20,
                        }}
                    >
                        {movie.title}
                    </Text>

                    <Button
                        mode="contained-tonal"
                        onPress={addFavourite}
                        icon={isFavourite ? "heart" : "heart-outline"}
                        style={{
                            borderRadius: 10,
                            marginBottom: 12,
                            backgroundColor: palette.white_50,
                        }}
                        textColor="#0B1A2A"
                    >
                        {isFavourite ? "Added to Favorites" : "Add to Favorites"}
                    </Button>

                    <View
                        style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            marginVertical: 6,
                        }}
                    >
                        {genreNames.map((g) => (
                            <Chip
                                key={g}
                                style={{
                                    marginHorizontal: 4,
                                    marginVertical: 3,
                                    backgroundColor: "rgba(255,255,255,0.12)",
                                    borderColor: "rgba(255,255,255,0.2)",
                                    borderWidth: 1,
                                    borderRadius: 10,
                                }}
                                textStyle={{ color: "white" }}
                            >
                                {g}
                            </Chip>
                        ))}
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            marginTop: 6,
                        }}
                    >
                        <RNText style={{ color: "white", fontSize: 14 }}>
                            ⭐ {movie.averageVote}
                        </RNText>
                        <RNText
                            style={{ color: "white", marginHorizontal: 6 }}
                        >
                            •
                        </RNText>
                        <RNText style={{ color: "white", fontSize: 14 }}>
                            {movie.runtime} mins
                        </RNText>
                        <RNText
                            style={{ color: "white", marginHorizontal: 6 }}
                        >
                            •
                        </RNText>
                        <RNText style={{ color: "white", fontSize: 14 }}>
                            {movie.releaseDate?.slice(0, 4)}
                        </RNText>
                    </View>
                    {director && (
                        <View style={{
                            marginTop: 10,
                        }}>
                            <Text>Directed by</Text>
                            <Text style={{ fontWeight: 'bold' }}>{director.name}</Text>
                        </View>
                    )}
                </View>
            </View>

            <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
                <Text
                    style={{
                        color: "white",
                        fontSize: 20,
                        fontWeight: "700",
                        marginTop: 16,
                    }}
                >
                    Storyline
                </Text>

                <Text
                    style={{
                        color: "#d4e0ed",
                        marginTop: 8,
                        lineHeight: 20,
                        fontSize: 15,
                    }}
                >
                    {movie.overview}
                </Text>

                {cast.length !== 0 && (
                    <Cast
                        cast={cast}
                        onPress={(id) => {
                            navigation.push('Details', {
                                id,
                                mediaType: MediaType['person']
                            })
                        }} />
                )}


                {movie.providers && (
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <Providers
                            providers={movie.providers}
                            title={movie.originalTitle ?? movie.title ?? ""}
                        />
                    </View>
                )}

            </View>

            <View style={{
                position: "absolute",
                right: 10,
                top: 40,
            }}>
                <FavouriteIcon
                    isFavourite={isFavourite}
                    onFavouritePress={addFavourite} />
            </View>
            <View style={{
                position: "absolute",
                left: 10,
                top: 40,
            }}>
                <IconButton
                    icon={() => <SvgIconLeft size={28} />}
                    iconColor="white"
                    size={28}
                    onPress={() => navigation.goBack()}
                />
            </View>
        </ScrollView>
    );
};

export default React.memo(DetailsMovie);
