import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

import { SVGIconProps } from '@components/svg/_propTypes';

import palette from '@theme/_palette';

const SvgIconArrowUp = (props: SVGIconProps) => {

  return (
    <Svg width={props.size} height={props.size} viewBox="0 0 15 20">
      <Path
        d="M5.75 11a.75.75 0 001.5 0h-1.5zM7.03.47a.75.75 0 00-1.06 0L1.197 5.243a.75.75 0 101.06 1.06L6.5 2.061l4.243 4.242a.75.75 0 001.06-1.06L7.03.47zM7.25 11V1h-1.5v10h1.5z"
        fill={
          props.color
            ? props.color
            : palette.white
        }
      />
    </Svg>
  );
};

export default React.memo(SvgIconArrowUp);
