import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import React, { RefObject } from 'react';
import { KeyboardAwareScrollView as RNKeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type RNKeyboardAwareScrollViewProps = React.ComponentProps<
  typeof RNKeyboardAwareScrollView
> & { shouldUseBottomInset?: boolean; scrollRef?: RefObject<RNKeyboardAwareScrollView> };

const KeyboardAwareScrollView: React.FC<RNKeyboardAwareScrollViewProps> = (
  { shouldUseBottomInset = true, ...props }
) => {
  const bottomBarHeight = useBottomTabBarHeight();

  return (
    <RNKeyboardAwareScrollView
      keyboardShouldPersistTaps="always"
      ref={props.scrollRef}
      contentInset={{ bottom: shouldUseBottomInset ? bottomBarHeight + 20 : 0 }}
      {...props}
    >
      {props.children}
    </RNKeyboardAwareScrollView>
  );
};

export default React.memo(KeyboardAwareScrollView);
