import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';

import Wrap from '@components/Wrap';
import { Credit } from '@utils/types';

interface Props {
  actor: Credit;
}

const ActorScreen: React.FC<Props> = () => {
  const navigation = useNavigation();

  return (
    <Wrap>
      <SafeAreaView style={{ flex: 1 }}>
        <Text>Actor</Text>
      </SafeAreaView>
    </Wrap>
  );
};

export default React.memo(ActorScreen);
