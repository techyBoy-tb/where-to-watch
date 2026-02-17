import { getEpisodes } from '@data/api';
import { Episode, Season } from '@utils/types';
import React, { PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet';

interface Props extends PropsWithChildren {
  onDismiss: () => void;
  showId: number;
  season: Season;
}

const ModalShowSeason: React.FC<Props> = ({ onDismiss, showId, season }) => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function init() {
      const foundEpisodes = await getEpisodes(showId, season.seasonNumber);
      setEpisodes(foundEpisodes);

      bottomSheetRef.current?.present();
    }

    init();
  }, []);

  // render
  // --- Bottom Sheet Ref ---
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  // Snap points for bottom sheet
  const snapPoints = useMemo(() => ["50%", "80%"], []);

  // Enable backdrop behind sheet
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.7}
      />
    ),
    []
  );
  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: "#0E2236",
      }}
      onDismiss={onDismiss}
      handleIndicatorStyle={{ backgroundColor: "#89A6C8" }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 20,
          fontWeight: "bold",
          marginBottom: 16,
          paddingHorizontal: 16,
        }}
      >
        {season.name}
      </Text>
      <Text
        style={{
          color: "white",
          fontSize: 14,
          marginBottom: 16,
          paddingHorizontal: 16,
        }}
      >
        {season.overview}
      </Text>

      <BottomSheetFlatList
        data={episodes}
        keyExtractor={(item: Episode) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: "rgba(255,255,255,0.1)" }} />
        )}
        renderItem={({ item }: { item: Episode }) => (
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
                justifyContent: 'space-between',
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
    </BottomSheetModal>
  )
};

export default React.memo(ModalShowSeason);
