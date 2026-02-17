import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

import palette from '@theme/_palette';

import { SVGIconProps } from '../_propTypes';

const SvgIconLeft = (props: SVGIconProps) => {

  return (
    <Svg width={props.size} height={props.size} viewBox="0 0 25 25" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.707 19.007a1 1 0 000-1.414L10.415 12.3l5.292-5.293a1 1 0 10-1.414-1.414l-5.999 6a1 1 0 000 1.414l5.999 6a1 1 0 001.414 0z"
        fill={
          props.color
            ? props.color
            : palette.white
        }
      />
    </Svg>
  );
};

export default React.memo(SvgIconLeft);
