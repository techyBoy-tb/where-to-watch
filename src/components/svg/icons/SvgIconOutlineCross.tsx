import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

import palette from '@theme/_palette';

import { SVGIconProps } from '../_propTypes';

const SvgIconOutlineCross = (props: SVGIconProps) => {

  return (
    <Svg width={props.size} height={props.size} viewBox="0 0 25 25" {...props}>
      <Path
        d="M17.738 8.531c.241.241.241.631 0 .872l-3.733 3.733 3.733 3.733a.617.617 0 11-.872.872l-3.733-3.733L9.4 17.741a.617.617 0 11-.872-.872l3.733-3.733-3.733-3.733a.617.617 0 01.872-.872l3.733 3.733 3.733-3.733c.241-.24.632-.24.872 0z"
        fill={
          props.color
            ? props.color
            : palette.white
        }
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 13.3c0-6.627 5.373-12 12-12s12 5.373 12 12-5.373 12-12 12-12-5.373-12-12zM13 2.533c-5.946 0-10.767 4.82-10.767 10.767 0 5.946 4.82 10.767 10.767 10.767 5.946 0 10.767-4.82 10.767-10.767 0-5.946-4.82-10.767-10.767-10.767z"
        fill={
          props.color
            ? props.color
            : palette.white
        }
      />
    </Svg>
  );
};

export default React.memo(SvgIconOutlineCross);
