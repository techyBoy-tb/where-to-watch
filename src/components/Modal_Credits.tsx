import { getEpisodes } from '@data/api';
import { Cast, Episode, Season } from '@utils/types';
import React, { PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { SegmentedButtons, Text } from 'react-native-paper';
import { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet';
import { SegmentedButtonsValues } from './SegmentedButtons';

interface Props extends PropsWithChildren {
  onDismiss: () => void;
  personId: number;
}

const ModalCredits: React.FC<Props> = ({ onDismiss, personId }) => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [moviePage, setMoviePage] = useState(1);
  const [showPage, setShowPage] = useState(1);
  const [movieCredits, setMovieCredits] = useState<Cast[]>([]);
  const [showCredits, setShowCredits] = useState<Cast[]>([]);
  const [movieOrShow, setMovieOrShow] = useState<SegmentedButtonsValues>(SegmentedButtonsValues['movie']);

  useEffect(() => {
    async function init() {
      const [foundMovieCredits, foundShowCredits] = Promise.all([
        getMovieCredits(personId, 1),
        getShowCredits(personId, 1)
      ]);
      setMovieCredits(foundMovieCredits);
      setShowCredits(foundShowCredits)

      bottomSheetRef.current?.present();
    }

    init();
  }, []);
  const credits = (() => {
    if (movieOrShow === SegmentedButtonsValues['movie']) return movieCredits;

    return showCredits
  })()

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
      <SegmentedButtons
        selectedValue={movieOrShow}
        onValueChange={(newVal) => setMovieOrShow}
        selectionList={credits}
      />
      {/* <Text
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
      </Text> */}

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

export default React.memo(ModalCredits);
