import React, { useContext } from 'react';
import { View } from 'react-native';
import { TouchableRipple, Text, Icon } from 'react-native-paper';

import Paragraph from '@components/ui/Paragraph';
import Surface from '@components/ui/Surface';

import palette from '@theme/_palette';

export enum SegmentedButtonsValues {
  'movie' = 'movie',
  'show' = 'show',
  'people' = 'people',
}

// interface Props<T> {
//   selectionList: { value: T; label: string }[];
//   selectedValue: T;
//   onValueChange: (newVal: T) => void;
// }

// const SegmentedButtons = <T extends SegmentedButtonsValues>({
//   selectionList,
//   selectedValue,
//   onValueChange,
// }: Props<T>) => {

//   return (
//     <View style={{
//       overflow: 'hidden',
//     }}>
//       <Surface
//         style={{
//           flexDirection: 'row',
//           marginHorizontal: 15,
//           paddingVertical: 2,
//           borderRadius: 10,
//           paddingHorizontal: 2,
//           marginTop: 20,
//           borderWidth: 0.5,
//           borderColor: palette.white_20,
//         }}
//       >
//         {selectionList.map(({ value, label }, index) => {
//           const isSelected = value === selectedValue;

//           let backgroundColor = palette.transparent;
//           let textColor = palette.white;

//           if (isSelected) {
//             backgroundColor = palette.primary;
//             textColor = palette.white;
//           }

//           return (
//             <View
//               key={`${index}_${value}_${label}`}
//               style={{
//                 flexDirection: 'row',
//                 flex: 1,
//                 borderRadius: 10,
//                 overflow: 'hidden',
//               }}
//             >
//               <TouchableRipple
//                 style={{
//                   backgroundColor,
//                   paddingHorizontal: 10,
//                   paddingVertical: 5,
//                   flex: 1,
//                   alignItems: 'center',
//                 }}
//                 onPress={() => onValueChange(value as T)}
//               >
//                 <View style={{ flexDirection: 'row' }}>
//                   <Icon size={20} source={value === SegmentedButtonsValues['movie'] ? 'movie-open-outline' : 'television-classic'} color={palette.white} />
//                   <Paragraph
//                     style={{
//                       color: textColor,
//                       paddingHorizontal: 5,
//                     }}
//                   >
//                     {label}
//                   </Paragraph>
//                 </View>
//               </TouchableRipple>
//               {index !== selectionList.length - 1 && (
//                 <View
//                   style={{
//                     height: '50%',
//                     width: 1,
//                     backgroundColor: palette.black_20,
//                     alignSelf: 'center',
//                     margin: 2,
//                   }}
//                 />
//               )}
//             </View>
//           );
//         })}
//       </Surface>
//     </View>
//   );
// };

// export default React.memo(SegmentedButtons);

interface Props<T> {
  selectionList: { value: T; label: string }[];
  selectedValue: T;
  onValueChange: (newVal: T) => void;
}

const SegmentedButtons = <T extends SegmentedButtonsValues>({
  selectionList,
  selectedValue,
  onValueChange,
}: Props<T>) => {

  return (
    <View style={{
      overflow: 'hidden',
    }}>
      <Surface
        style={{
          flexDirection: 'row',
          marginHorizontal: 15,
          paddingVertical: 2,
          borderRadius: 10,
          paddingHorizontal: 2,
          marginTop: 20,
          borderWidth: 0.5,
          borderColor: palette.white_20,
          // backgroundColor: palette.grey,
        }}
      >
        {selectionList.map(({ value, label }, index) => {
          const isSelected = value === selectedValue;

          let backgroundColor = palette.transparent;
          let textColor = palette.white;

          if (isSelected) {
            backgroundColor = palette.primary;
            textColor = palette.white;
          }

          let borderTopLeftRadius = 0;
          let borderBottomLeftRadius = 0;
          let borderTopRightRadius = 0;
          let borderBottomRightRadius = 0;

          if (index === 0) {
            borderTopLeftRadius = 8
            borderBottomLeftRadius = 8
          }
          if (index === selectionList.length - 1) {
            borderTopRightRadius = 8
            borderBottomRightRadius = 8
          }

          return (
            <View
              key={`${index}_${value}_${label}`}
              style={{
                flexDirection: 'row',
                flex: 1,
                borderTopLeftRadius,
                borderBottomLeftRadius,
                borderTopRightRadius,
                borderBottomRightRadius,
                overflow: 'hidden',
              }}
            >
              <TouchableRipple
                style={{
                  backgroundColor,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  flex: 1,
                  alignItems: 'center',
                }}
                onPress={() => onValueChange(value as T)}
              >
                <View style={{ flexDirection: 'row' }}>
                  <Paragraph
                    style={{
                      color: textColor,
                      paddingHorizontal: 5,
                    }}
                  >
                    {label}
                  </Paragraph>
                </View>
              </TouchableRipple>
              {index !== selectionList.length - 1 && (
                <View
                  style={{
                    height: '50%',
                    width: 1,
                    backgroundColor: palette.black_20,
                    alignSelf: 'center',
                    margin: 2,
                  }}
                />
              )}
            </View>
          );
        })}
      </Surface>
    </View>
  );
};

export default React.memo(SegmentedButtons);
