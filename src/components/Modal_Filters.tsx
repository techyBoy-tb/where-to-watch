import React, { PropsWithChildren, useState } from 'react';
import { Chip, Divider, List, Modal, Surface } from 'react-native-paper';
import { Dimensions, ScrollView, View } from 'react-native';
import palette from '@theme/_palette';
import { FavouriteFilters, Genre } from '@utils/types';
import theme from '@theme';
import Paragraph from './ui/Paragraph';
import { err, success } from '@utils/trace';
import { SimpleGrid } from 'react-native-super-grid';
import Dropdown from './Dropdown';
import { PillDropdown } from './PillDropdown';

interface Props extends PropsWithChildren {
  isModalVisible: boolean;
  onDismiss: () => void;
  //
  hasFiltersApplied: boolean;
  appliedFilters: FavouriteFilters;
  setFilters: (filters: FavouriteFilters) => void;
}

const ModalFilters: React.FC<Props> = ({
  isModalVisible,
  onDismiss,
  //
  hasFiltersApplied,
  appliedFilters,
  setFilters,

}) => {
  const [selectedFilters, setSelectedFilters] = useState(appliedFilters);
  const [showAdvanced, setShowAdvanced] = useState(false);


  return (
    <Modal
      visible={isModalVisible}
      onDismiss={onDismiss}>
      <Surface
        style={{
          width: '90%',
          maxWidth: 500,
          alignSelf: 'center',
          borderRadius: theme.roundness,
          backgroundColor: theme.colors.background,
          // overflow: 'hidden',
          borderWidth: 1,
          borderColor: palette.dark,
          maxHeight: Dimensions.get('screen').height * 0.7,
          height: Dimensions.get('screen').height * 0.5
        }}
      >
        <ScrollView>
          <Paragraph
            style={{ paddingTop: 15, paddingLeft: 25, color: palette.white_50 }}
          >
            Genre
          </Paragraph>
          {/* <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 5 }}> */}

          {/* {Object.keys(Genre).map((d, index) => {
            const item = d as keyof typeof Genre;

            const isSelected = selectedFilters.genres?.includes(Genre[item]) ?? false;

            return (
              <Chip
                key={`${index}_genre_chip_${item}`}
                compact
                mode={isSelected ? 'flat' : 'outlined'}
                style={{ marginRight: 0 }}
                textStyle={{ color: isSelected ? palette.black : palette.white }}
                onPress={() => {
                  setSelectedFilters(prev => {
                    let prevGenres = prev.genres ?? [];
                    let newGenres;
                    if (isSelected) {
                      newGenres = prevGenres.filter(i => i !== Genre[item]);
                    } else {
                      prevGenres.push(Genre[item]);
                      newGenres = prevGenres;
                    }
                    return {
                      ...prev,
                      genres: newGenres
                    }
                  })
                }}
              >
                {item}
              </Chip>
            );
          })} */}
          {/* </View> */}

          <Dropdown
            items={Object.keys(Genre).map(i => ({ label: i, value: i }))}
            onSelectItem={({ value: v }) => {
              if (!v) return;
              const value = v as Genre;
              const isSelected = selectedFilters.genres?.includes(value) ?? false;
              setSelectedFilters(prev => {
                let prevGenres = prev.genres ?? [];
                let newGenres;
                if (isSelected) {
                  newGenres = prevGenres.filter(i => i !== value);
                } else {
                  prevGenres.push(value);
                  newGenres = prevGenres;
                }
                return {
                  ...prev,
                  genres: newGenres
                }
              })
            }}
            placeholder='Select genre'
            value={(selectedFilters.genres ?? [])?.toString()}
          />

          <PillDropdown
            defaultValue
            isFocused
            items={Object.keys(Genre).map(i => ({ label: i, value: i }))}
            onChange={(v) => {
              if (!v) return;
              const value = v as Genre;
              const isSelected = selectedFilters.genres?.includes(value) ?? false;
              setSelectedFilters(prev => {
                let prevGenres = prev.genres ?? [];
                let newGenres;
                if (isSelected) {
                  newGenres = prevGenres.filter(i => i !== value);
                } else {
                  prevGenres.push(value);
                  newGenres = prevGenres;
                }
                return {
                  ...prev,
                  genres: newGenres
                }
              })
            }}
            onFocus={() => { }}
            placeholder='Select Genre'
            testID=''
          />
        </ScrollView>

        <Divider />
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 3, flexDirection: 'row' }}>
            <List.Item
              style={{
                flex: 1,
                borderRightWidth: 1,
                borderRightColor: palette.surface,
              }}
              title={showAdvanced ? '' : 'Advanced'}
              accessibilityHint={
                showAdvanced
                  ? 'Show simple filter options'
                  : 'Show advanced filter options'
              }
              left={() =>
                showAdvanced ? <List.Icon icon="arrow-left" /> : null
              }
              titleStyle={{ textAlign: 'center' }}
              onPress={() => {
                setShowAdvanced(!showAdvanced);
              }}
            />
            {showAdvanced && (
              <List.Item
                style={{
                  flex: 1,
                  borderRightWidth: 1,
                  borderRightColor: palette.surface,
                }}
                accessibilityHint="Clear all filters"
                title=""
                left={() => <List.Icon icon="close" />}
                rippleColor={palette.red}
                onPress={() => {
                  setFilters({});
                  onDismiss();
                }}
              />
            )}
          </View>
          <List.Item
            style={{ flex: 4 }}
            title={showAdvanced ? 'Apply filters' : 'Show all workouts'}
            accessibilityHint={
              showAdvanced ? 'Apply filters' : 'Show all workouts'
            }
            titleStyle={{ textAlign: showAdvanced ? 'left' : 'center' }}
            left={() => (showAdvanced ? <List.Icon icon="check" /> : null)}
            rippleColor={showAdvanced ? palette.success : undefined}
            onPress={() => {
              if (showAdvanced) {
                setFilters(selectedFilters);
              } else {
                setFilters({});
              }
              onDismiss();
            }}
          />
        </View>
      </Surface>
    </Modal>
  )
};

export default React.memo(ModalFilters);
