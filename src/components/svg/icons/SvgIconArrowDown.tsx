import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

import { SVGIconProps } from '@components/svg/_propTypes';

import palette from '@theme/_palette';

const SvgIconArrowDown = (props: SVGIconProps) => {

  return (
    <Svg width={props.size} height={props.size} viewBox="0 0 15 20">
      <Path
        d="M5.97 11.53a.75.75 0 001.06 0l4.773-4.773a.75.75 0 10-1.06-1.06L6.5 9.939 2.257 5.697a.75.75 0 00-1.06 1.06L5.97 11.53zM7.25 1a.75.75 0 00-1.5 0h1.5zm0 10V1h-1.5v10h1.5z"
        fill={
          props.color
            ? props.color
            : palette.white
        }
      />
    </Svg>
  );
};

export default React.memo(SvgIconArrowDown);
