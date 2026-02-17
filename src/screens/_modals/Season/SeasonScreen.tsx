import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Button, Text } from 'react-native-paper';

import Wrap from '@components/Wrap';
import { Episode, Season } from '@utils/types';
import { FlatList, View } from 'react-native';

interface Props {
  season: Season;
  episodes: Episode[]
}

const SeasonScreen: React.FC<Props> = ({ season, episodes }) => {
  const navigation = useNavigation();

  const onDismiss = () => {
    navigation.goBack();
  }

  return (
    <View
      style={{
        flex: 1,
        // backgroundColor: "rgba(0,0,0,0.8)",
        justifyContent: "flex-end"
      }}
    >
      <View
        style={{
          backgroundColor: "#0B1A2A",
          padding: 20,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          maxHeight: "70%"
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 22,
            fontWeight: "700",
            marginBottom: 10
          }}
        >
          {season.name}
        </Text>

        <FlatList
          data={episodes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderColor:
                  "rgba(255,255,255,0.1)"
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between'
                }}
              >

                <Text
                  style={{
                    color: "white",
                    fontSize: 16
                  }}
                >
                  {item.episodeNumber}.{" "}
                  {item.name}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                  }}
                >
                  {item.runtime} mins
                </Text>
              </View>
              <Text
                style={{
                  color: "#9fb6ca",
                  fontSize: 12,
                  marginTop: 4
                }}
              >
                {item.overview}
              </Text>
            </View>
          )}
        />

        <Button
          mode="contained"
          onPress={onDismiss}
          style={{ marginTop: 15 }}
        >
          Close
        </Button>
      </View>
    </View>
  );
};

export default React.memo(SeasonScreen);
