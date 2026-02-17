import React, { FC, useContext, useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Image,
  FlatList,
} from "react-native";
import { Text, Chip, IconButton, TouchableRipple } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

import { MediaType, PersonDetails } from "@utils/types";
import { databaseContext } from "@data/context/database";
import FavouriteIcon from "./FavouriteIcon";
import SvgIconLeft from "./svg/icons/SvgIconLeft";
import { useNavigation } from "@react-navigation/native";
import config from "@data/config";
import ReadMore from "react-native-read-more-text";
import palette from "@theme/_palette";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import ModalCredits from "@components/Modal_Credits";
import { success } from "@utils/trace";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParams } from "../navigation";

interface Props {
  person: PersonDetails;
}

const DetailsPerson: FC<Props> = ({ person }) => {
  const navigation = useNavigation<StackNavigationProp<MainStackParams, 'Details'>>();
  const {
    favouritePeople,
    addFavouritePerson,
    removeFavouritePerson,
    refresh
  } = useContext(databaseContext);

  const [isFavourite, setIsFavourite] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setIsFavourite(!!favouritePeople.find(({ id }) => id === person.id));
  }, [favouritePeople]);

  const toggleFavourite = async () => {
    if (isFavourite) {
      await removeFavouritePerson(person.id);
    } else {
      await addFavouritePerson(person);
    }
    await refresh();
  };

  const credits = (() => {
    return [...person.movieCredits, ...person.showCredits]
      .sort((a, b) => {
        const aDate =
          a.mediaType === MediaType.movie ? a.releaseDate : a.firstAirDate;
        const bDate =
          b.mediaType === MediaType.movie ? b.releaseDate : b.firstAirDate;

        const aTime = aDate ? new Date(aDate).getTime() : 0;
        const bTime = bDate ? new Date(bDate).getTime() : 0;

        return bTime - aTime; // most recent first
      });
  })();

  const [showMore, setShowMore] = useState(false);

  const knownForLabel = person.knownForDepartment;

  return (
    <BottomSheetModalProvider>
      <ScrollView
        style={{ flex: 1, backgroundColor: "#0B1A2A" }}
        contentContainerStyle={{ paddingBottom: 60 }}
        scrollIndicatorInsets={{ right: 5 }}
      >
        {/* BACKDROP */}
        <View style={{ width: "100%", height: 400, position: "relative" }}>
          <Image
            source={{ uri: `${config.imageUrl}${person.posterPath}` }}
            style={{ width: "100%", height: "100%", position: "absolute" }}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.6)", "#0B1A2A"]}
            start={{ x: 0.5, y: 0.2 }}
            end={{ x: 0.5, y: 1 }}
            style={{ position: "absolute", bottom: 0, width: "100%", height: "60%" }}
          />

          {/* Top buttons */}
          <View style={{ position: "absolute", left: 10, top: 40 }}>
            <IconButton
              icon={() => <SvgIconLeft size={28} />}
              iconColor="white"
              size={28}
              onPress={() => navigation.goBack()}
            />
          </View>

          <View style={{ position: "absolute", right: 10, top: 40 }}>
            <FavouriteIcon isFavourite={isFavourite} onFavouritePress={toggleFavourite} />
          </View>

          {/* Name & Known For */}
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
                marginBottom: 6,
                textShadowColor: "rgba(0,0,0,0.6)",
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 4,
              }}
            >
              {person.name}
            </Text>

            <Chip
              style={{
                backgroundColor: "rgba(255,255,255,0.12)",
                borderColor: "rgba(255,255,255,0.2)",
                borderWidth: 1,
                borderRadius: 10,
                alignSelf: "flex-start",
              }}
              textStyle={{ color: "white" }}
            >
              {knownForLabel}
            </Chip>
          </View>
        </View>

        {/* Main content */}
        <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
          {/* Biography */}
          <Text
            style={{ color: "white", fontSize: 20, fontWeight: "700", marginBottom: 10 }}
          >
            Biography
          </Text>
          {/* <Text style={{ color: "#d4e0ed", fontSize: 15, lineHeight: 20 }}>
          
        </Text> */}
          <ReadMore
            numberOfLines={3}

            renderRevealedFooter={(handleShow) =>
              <Text
                onPress={handleShow}
                style={{ color: palette.primary }}
              >
                Show less
              </Text>
            }
            renderTruncatedFooter={(handleShow) =>
              <Text
                onPress={handleShow}
                style={{ color: palette.primary }}
              >
                Show more
              </Text>
            }
          >
            <Text style={{ color: "#d4e0ed", fontSize: 15, lineHeight: 20 }}>
              {person.biography || "No biography available."}
            </Text>
          </ReadMore>

          {/* Birth / Death */}
          <View style={{ flexDirection: "row", marginTop: 12 }}>
            <Text style={{ color: "white", fontSize: 14 }}>
              🎂 {person.birthday} • {person.birthplace}
            </Text>
            {person.deathDay && (
              <Text style={{ color: "white", marginLeft: 10 }}>
                ⚰️ {person.deathDay}
              </Text>
            )}
          </View>

          {/* Credits */}
          {credits.length > 0 && (
            <>
              <View style={{
                flexDirection: 'row',
                marginTop: 20,
                marginBottom: 15,
                alignItems: 'flex-end'
              }}>

                <Text
                  style={{
                    color: "white",
                    fontSize: 20,
                    fontWeight: "700",
                  }}
                >
                  Credits
                </Text>
                <Text
                  onPress={() => setShowModal(true)}
                  style={{
                    color: palette.primary, paddingLeft: 15
                  }}
                >
                  Show all
                </Text>
              </View>

              {/* {credits.map((credit, index) => {
              const date = (credit.releaseDate ?? credit.firstAirDate).slice(0, 4);
              return (
                <View key={`${index}_${credit.mediaType}_${credit.id}`}>
                  <TouchableRipple
                    onPress={() => { }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 8,
                      borderBottomWidth: 1,
                      borderBottomColor: "rgba(255,255,255,0.1)",
                    }}
                  >
                    <>
                      <Text style={{ color: "white", marginRight: 10 }}>
                        {credit.mediaType === MediaType["movie"] ? "🎬" : "📺"}
                      </Text>

                      <View style={{ flex: 1 }}>
                        <Text style={{ color: "white", fontSize: 16 }}>
                          {credit.title ?? credit.name}
                        </Text>
                        {credit.character && (
                          <Text style={{ color: "#9fb6ca", fontSize: 12 }}>
                            {credit.character}
                          </Text>
                        )}
                      </View>

                      <Text style={{ color: "#9fb6ca", fontSize: 12 }}>
                        {date}
                      </Text>
                    </>
                  </TouchableRipple>
                </View>
              );
            })} */}
              <FlatList
                data={credits}
                horizontal
                keyExtractor={({ id, castId }, index) => `cast-${id}-${castId}-${index}`}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => {
                  return (
                    <View
                      style={{
                        width: 110,
                        marginRight: 16,
                      }}
                    >
                      <View style={{ borderRadius: 12, overflow: 'hidden' }}>
                        <TouchableRipple onPress={() => navigation.push('Details', { id: item.id ?? -1, mediaType: item.mediaType })}>
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
                        {item.name ?? item.originalName ?? item.title ?? item.originalTitle}
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
                }
              />
            </>
          )}
        </View>
      </ScrollView>
      {showModal && <ModalCredits
        onDismiss={() => setShowModal(false)}
        personId={person.id ?? -1}
      />}
    </BottomSheetModalProvider>
  );
};

export default React.memo(DetailsPerson);
