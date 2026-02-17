import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

import palette from '@theme/_palette';

import { SVGIconProps } from '../_propTypes';

const SvgIconUp = (props: SVGIconProps) => {

  return (
    <Svg width={props.size} height={props.size} viewBox="0 0 25 25" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.293 16.007a1 1 0 001.414 0L12 10.715l5.293 5.292a1 1 0 101.414-1.415l-6-5.998a1 1 0 00-1.414 0l-6 5.998a1 1 0 000 1.415z"
        fill={
          props.color
            ? props.color
            : palette.white
        }
      />
    </Svg>
  );
};

export default React.memo(SvgIconUp);
