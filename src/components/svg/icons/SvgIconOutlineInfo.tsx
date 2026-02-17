import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

import palette from '@theme/_palette';

import { SVGIconProps } from '../_propTypes';

const SvgIconOutlineInfo = (props: SVGIconProps) => {
  return (
    <Svg width={props.size} height={props.size} viewBox="0 0 25 25" {...props}>
      <Path
        d="M12.3 5.55a.95.95 0 01.95.95v.2a.95.95 0 11-1.9 0v-.2a.95.95 0 01.95-.95zM12.3 9.8a.7.7 0 01.7.7v8a.7.7 0 11-1.4 0v-8a.7.7 0 01.7-.7z"
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

export default React.memo(SvgIconOutlineInfo);
