import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

import palette from '@theme/_palette';

import { SVGIconProps } from '../_propTypes';

const SvgIconRight = (props: SVGIconProps) => {
  return (
    <Svg width={props.size} height={props.size} viewBox="0 0 25 25" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.293 19.007a1 1 0 010-1.414l5.292-5.293-5.292-5.293a1 1 0 111.414-1.414l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0z"
        fill={
          props.color
            ? props.color
            : palette.white
        }
      />
    </Svg>
  );
};

export default React.memo(SvgIconRight);
