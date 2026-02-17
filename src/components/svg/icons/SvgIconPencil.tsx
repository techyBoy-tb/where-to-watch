import * as React from 'react';
import Svg, { ClipPath, Defs, G, Path } from 'react-native-svg';

import palette from '@theme/_palette';

import { SVGIconProps } from '../_propTypes';

const SvgIconPencil = (props: SVGIconProps) => {

  return (
    <Svg width={props.size} height={props.size} viewBox="0 0 25 25" {...props}>
      <G clipPath="url(#clip0_263_13175)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M18.558 4.886a2 2 0 00-2.828 0l-9.878 9.878a3.211 3.211 0 00-.776 1.255l-1.028 3.083a.909.909 0 001.15 1.15l3.083-1.028a3.212 3.212 0 001.255-.776l9.878-9.878a2 2 0 000-2.827l-.857-.857zM16.844 6a.424.424 0 01.6 0l.856.857a.424.424 0 010 .6l-.593.593-1.457-1.457.594-.593zm-1.708 1.707l-8.17 8.17c-.18.18-.315.4-.396.64l-.606 1.819 1.819-.606c.24-.08.46-.216.64-.396l8.17-8.17-1.457-1.457z"
          fill={
            props.color
              ? props.color
              : palette.white
          }
        />
      </G>
      <Defs>
        <ClipPath id="clip0_263_13175">
          <Path
            fill={palette.white}
            transform="translate(0 .3)"
            d="M0 0H24V24H0z"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default React.memo(SvgIconPencil);
