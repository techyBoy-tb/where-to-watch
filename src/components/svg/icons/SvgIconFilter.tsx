import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

import palette from '@theme/_palette';

import { SVGIconProps } from '../_propTypes';

const SvgIconFilter = (props: SVGIconProps) => {

  return (
    <Svg width={props.size} height={props.size} viewBox="0 0 25 25" {...props}>
      <Path
        d="M2 5.8a1.5 1.5 0 011.5-1.5h17A1.5 1.5 0 0122 5.8v1a1.5 1.5 0 01-1.5 1.5h-17A1.5 1.5 0 012 6.8v-1zM4 11.8a1.5 1.5 0 011.5-1.5h13a1.5 1.5 0 011.5 1.5v1a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 014 12.8v-1zM8.5 16.3A1.5 1.5 0 007 17.8v1a1.5 1.5 0 001.5 1.5h7a1.5 1.5 0 001.5-1.5v-1a1.5 1.5 0 00-1.5-1.5h-7z"
        fill={
          props.color
            ? props.color
            : palette.white
        }
      />
    </Svg>
  );
};

export default React.memo(SvgIconFilter);
