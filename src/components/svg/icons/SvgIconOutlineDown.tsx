import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

import palette from '@theme/_palette';

import { SVGIconProps } from '../_propTypes';

const SvgIconOutlineDown = (props: SVGIconProps) => {

  return (
    <Svg width={props.size} height={props.size} viewBox="0 0 25 25" {...props}>
      <Path
        d="M7.361 9.361a.617.617 0 00-.872.872l5.508 5.506c.24.241.63.241.872 0l5.507-5.506a.617.617 0 10-.872-.872l-5.071 5.07-5.072-5.07z"
        fill={
          props.color
            ? props.color
            : palette.white
        }
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.3 0C5.674 0 .3 5.373.3 12s5.373 12 12 12c6.628 0 12-5.373 12-12s-5.372-12-12-12zM1.535 12c0-5.946 4.82-10.767 10.767-10.767 5.946 0 10.767 4.82 10.767 10.767 0 5.946-4.82 10.767-10.767 10.767-5.947 0-10.767-4.82-10.767-10.767z"
        fill={
          props.color
            ? props.color
            : palette.white
        }
      />
    </Svg>
  );
};

export default React.memo(SvgIconOutlineDown);
