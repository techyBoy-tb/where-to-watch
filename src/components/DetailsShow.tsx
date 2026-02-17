import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import {
    View,
    ScrollView,
    Image,
    Text as RNText,
} from "react-native";
import { Text, Chip, Button, IconButton, TouchableRipple } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

import { Cast as CastType, ShowDetails, Season, MediaType } from "@utils/types";
import { getGenres } from "@utils/parse";
import config from "@data/config";
import { databaseContext } from "@data/context/database";
import FavouriteIcon from "./FavouriteIcon";
import SvgIconLeft from "./svg/icons/SvgIconLeft";
import { useNavigation } from "@react-navigation/native";
import palette from "@theme/_palette";
import Providers from "./Providers";
import Cast from "./Cast";
import ModalShowSeason from "./Modal_ShowSeason";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParams } from "../navigation";

interface Props {
    show: ShowDetails;
    cast: CastType[];
}

const DetailsShow: FC<Props> = ({ show, cast }) => {
    const navigation = useNavigation<StackNavigationProp<MainStackParams, 'Details'>>();
    const {
        favouriteShows,
        removeFavouriteShow,
        addFavouriteShow,
        refresh
    } = useContext(databaseContext);

    const [isFavourite, setIsFavourite] = useState(false);

    useEffect(() => {
        setIsFavourite(!!favouriteShows.find(({ id }) => id === show.id));
    }, [favouriteShows]);

    const addFavourite = useCallback(async () => {
        if (isFavourite) {
            await removeFavouriteShow(show.id);
        } else {
            await addFavouriteShow(show);
        }
        await refresh();
    }, [refresh, isFavourite]);

    const genreNames = getGenres(show.genres).split(",");

    // Compute years
    const startYear = show.firstAirDate?.slice(0, 4);
    const endYear =
        show.lastAirDate?.slice(0, 4) ??
        (show.status === "Ended" ? startYear : "Present");

    const totalEpisodes = show.seasons?.reduce(
        (sum, s) => sum + (s.episodeCount ?? 0),
        0
    );

    const [season, setSeason] = useState<Season>();
    const [isVisible, setIsVisible] = useState(false);

    // Open Season Modal
    const openSeason = useCallback((newSeason: Season) => {
        setIsVisible(true)
        setSeason(newSeason);
    }, []);

    return (
        <BottomSheetModalProvider>
            <ScrollView
                style={{ flex: 1, backgroundColor: "#0B1A2A" }}
                contentContainerStyle={{ paddingBottom: 60 }}
                scrollIndicatorInsets={{ right: 5 }}
            >
                {/* BACKDROP */}
                <View
                    style={{
                        width: "100%",
                        height: 560,
                        position: "relative",
                        overflow: "hidden"
                    }}
                >
                    <Image
                        source={{ uri: `${config.imageUrl}${show.backdropPath}` }}
                        style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute"
                        }}
                        resizeMode="cover"
                    />

                    <LinearGradient
                        colors={[
                            "rgba(0,0,0,0)",
                            "rgba(0,0,0,0.6)",
                            "#0B1A2A"
                        ]}
                        start={{ x: 0.5, y: 0.2 }}
                        end={{ x: 0.5, y: 1 }}
                        style={{
                            position: "absolute",
                            bottom: 0,
                            width: "100%",
                            height: "60%"
                        }}
                    />

                    {/* Title & Genres Section */}
                    <View
                        style={{
                            position: "absolute",
                            bottom: 0,
                            width: "100%",
                            paddingHorizontal: 20
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
                                paddingHorizontal: 20
                            }}
                        >
                            {show.name}
                        </Text>

                        {/* FAV BUTTON */}
                        <Button
                            mode="contained-tonal"
                            onPress={addFavourite}
                            icon={isFavourite ? "heart" : "heart-outline"}
                            style={{
                                borderRadius: 10,
                                marginBottom: 12,
                                backgroundColor: palette.white_50
                            }}
                            textColor="#0B1A2A"
                        >
                            {isFavourite
                                ? "Added to Favorites"
                                : "Add to Favorites"}
                        </Button>

                        {/* GENRES */}
                        <View
                            style={{
                                flexDirection: "row",
                                flexWrap: "wrap",
                                marginVertical: 6
                            }}
                        >
                            {genreNames.map((g) => (
                                <Chip
                                    key={g}
                                    style={{
                                        marginHorizontal: 4,
                                        marginVertical: 3,
                                        backgroundColor:
                                            "rgba(255,255,255,0.12)",
                                        borderColor:
                                            "rgba(255,255,255,0.2)",
                                        borderWidth: 1,
                                        borderRadius: 10
                                    }}
                                    textStyle={{ color: "white" }}
                                >
                                    {g}
                                </Chip>
                            ))}
                        </View>

                        {/* YEAR • SEASONS • EPISODES */}
                        <View style={{ flexDirection: "row", marginTop: 6 }}>
                            <RNText style={{ color: "white", fontSize: 14 }}>
                                ⭐ {show.voteAverage}
                            </RNText>

                            <RNText
                                style={{
                                    color: "white",
                                    marginHorizontal: 6
                                }}
                            >
                                •
                            </RNText>

                            <RNText style={{ color: "white", fontSize: 14 }}>
                                {startYear} - {endYear}
                            </RNText>

                            <RNText
                                style={{
                                    color: "white",
                                    marginHorizontal: 6
                                }}
                            >
                                •
                            </RNText>

                            <RNText style={{ color: "white", fontSize: 14 }}>
                                {show.seasons?.length} Seasons •{" "}
                                {totalEpisodes} Episodes
                            </RNText>
                        </View>
                    </View>
                </View>

                {/* MAIN CONTENT */}
                <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
                    <Text
                        style={{
                            color: "white",
                            fontSize: 20,
                            fontWeight: "700",
                            marginTop: 16
                        }}
                    >
                        Storyline
                    </Text>

                    <Text
                        style={{
                            color: "#d4e0ed",
                            marginTop: 8,
                            lineHeight: 20,
                            fontSize: 15
                        }}
                    >
                        {show.overview}
                    </Text>

                    {/* CAST */}
                    {cast.length !== 0 && <Cast
                        cast={cast}
                        onPress={(id) => {
                            navigation.push('Details', {
                                id,
                                mediaType: MediaType['person']
                            })
                        }} />}

                    {/* SEASON SELECTOR */}
                    {show.seasons && (
                        <>
                            <Text
                                style={{
                                    color: "white",
                                    fontSize: 20,
                                    fontWeight: "700",
                                    marginTop: 20
                                }}
                            >
                                Seasons
                            </Text>

                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={{ marginTop: 10 }}
                            >
                                {show.seasons.map((season) => (
                                    <TouchableRipple
                                        key={season.id}
                                        onPress={() => openSeason(season)}
                                        style={{
                                            backgroundColor:
                                                "#162B40",
                                            padding: 12,
                                            borderRadius: 12,
                                            marginRight: 10,
                                            borderWidth: 1,
                                            borderColor:
                                                "rgba(255,255,255,0.2)"
                                        }}
                                    >
                                        <>
                                            <Text style={{ color: "white" }}>
                                                {season.name}
                                            </Text>
                                            <Text
                                                style={{
                                                    color: "#9fb6ca",
                                                    fontSize: 12
                                                }}
                                            >
                                                {season.episodeCount} Episodes
                                            </Text>
                                        </>
                                    </TouchableRipple>
                                ))}
                            </ScrollView>
                        </>
                    )}

                    {/* PROVIDERS */}
                    {show.providers && (
                        <View style={{ paddingTop: 10 }}>
                            <Providers
                                providers={show.providers}
                                title={
                                    show.name ??
                                    show.originalName ??
                                    ""
                                }
                            />
                        </View>
                    )}
                </View>

                {/* TOP BUTTONS */}
                <View
                    style={{
                        position: "absolute",
                        right: 10,
                        top: 40
                    }}
                >
                    <FavouriteIcon
                        isFavourite={isFavourite}
                        onFavouritePress={addFavourite}
                    />
                </View>

                <View
                    style={{
                        position: "absolute",
                        left: 10,
                        top: 40
                    }}
                >
                    <IconButton
                        icon={() => <SvgIconLeft size={28} />}
                        iconColor="white"
                        size={28}
                        onPress={() => navigation.goBack()}
                    />
                </View>
            </ScrollView>

            {/* SEASON EPISODE MODAL */}
            {isVisible && !!season && <ModalShowSeason
                onDismiss={async () => {
                    setSeason(undefined);
                    setIsVisible(true);
                }}
                season={season}
                showId={show.id}
            />}
        </BottomSheetModalProvider>
    );
};

export default React.memo(DetailsShow);
