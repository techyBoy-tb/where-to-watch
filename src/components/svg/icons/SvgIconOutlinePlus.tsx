import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

import palette from '@theme/_palette';

import { SVGIconProps } from '../_propTypes';

const SvgIconOutlinePlus = (props: SVGIconProps) => {

  return (
    <Svg width={props.size} height={props.size} viewBox="0 0 25 25" {...props}>
      <Path
        d="M5.677 12c0-.34.276-.617.616-.617h5.391v-5.39a.617.617 0 111.234 0v5.39h5.391a.617.617 0 110 1.234h-5.391v5.39a.617.617 0 01-1.233 0v-5.39H6.292A.617.617 0 015.677 12z"
        fill={
          props.color
            ? props.color
            : palette.white
        }
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M.3 12c0-6.627 5.373-12 12-12 6.628 0 12 5.373 12 12s-5.372 12-12 12c-6.627 0-12-5.373-12-12zm12-10.767C6.355 1.233 1.535 6.053 1.535 12c0 5.946 4.82 10.767 10.767 10.767 5.946 0 10.767-4.82 10.767-10.767 0-5.946-4.82-10.767-10.767-10.767z"
        fill={
          props.color
            ? props.color
            : palette.white
        }
      />
    </Svg>
  );
};

export default React.memo(SvgIconOutlinePlus);
