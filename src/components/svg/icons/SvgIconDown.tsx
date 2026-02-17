import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

import palette from '@theme/_palette';

import { SVGIconProps } from '../_propTypes';

const SvgIconDown = (props: SVGIconProps) => {

  return (
    <Svg width={props.size} height={props.size} viewBox="0 0 25 25" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.293 9.594a1 1 0 011.414 0L12 14.884l5.293-5.292a1 1 0 111.414 1.415l-6 5.999a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.413z"
        fill={
          props.color
            ? props.color
            : palette.white
        }
      />
    </Svg>
  );
};

export default React.memo(SvgIconDown);
