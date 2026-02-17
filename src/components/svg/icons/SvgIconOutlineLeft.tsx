import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

import palette from '@theme/_palette';

import { SVGIconProps } from '../_propTypes';

const SvgIconOutlineLeft = (props: SVGIconProps) => {

  return (
    <Svg width={props.size} height={props.size} viewBox="0 0 25 25" {...props}>
      <Path
        d="M14.94 16.94a.617.617 0 01-.872.871L8.56 12.304a.617.617 0 010-.872l5.507-5.507a.617.617 0 01.872.872l-5.07 5.071 5.07 5.071z"
        fill={
          props.color
            ? props.color
            : palette.white
        }
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24.3 12c0 6.627-5.372 12-12 12-6.627 0-12-5.373-12-12s5.373-12 12-12c6.628 0 12 5.373 12 12zm-12 10.767c5.947 0 10.768-4.82 10.768-10.767 0-5.946-4.82-10.767-10.767-10.767C6.354 1.233 1.534 6.053 1.534 12c0 5.946 4.82 10.767 10.767 10.767z"
        fill={
          props.color
            ? props.color
            : palette.white
        }
      />
    </Svg>
  );
};

export default React.memo(SvgIconOutlineLeft);
