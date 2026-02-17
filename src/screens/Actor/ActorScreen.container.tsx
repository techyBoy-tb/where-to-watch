import React, { useEffect, useState } from 'react';

import Presentational from './ActorScreen';
import { StaticScreenProps } from '@react-navigation/native';
import { Credit } from '@utils/types';

type Props = StaticScreenProps<{
  actorId: number;
}>

const Container: React.FC<Props> = ({ route: { params } }) => {
  const { actorId } = params;
  const [actor, setactor] = useState<Credit>();

  useEffect(() => {
    async function init() {

    }

  }, []);

  return <Presentational actor={actor as any} />;
};

export default Container;
