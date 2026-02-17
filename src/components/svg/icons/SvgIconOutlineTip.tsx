import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

import palette from '@theme/_palette';

import { SVGIconProps } from '../_propTypes';

const SvgIconOutlineTip = (props: SVGIconProps) => {

  return (
    <Svg width={props.size} height={props.size} viewBox="0 0 25 25" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.3 1.233C6.355 1.233 1.535 6.053 1.535 12c0 5.946 4.82 10.767 10.767 10.767 5.946 0 10.767-4.82 10.767-10.767 0-5.946-4.82-10.767-10.767-10.767zM.3 12c0-6.627 5.373-12 12-12 6.628 0 12 5.373 12 12s-5.372 12-12 12c-6.627 0-12-5.373-12-12z"
        fill={
          props.color
            ? props.color
            : palette.white
        }
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.68 9.474c0-2.003 1.722-3.598 3.62-3.598 1.996 0 3.62 1.606 3.62 3.598 0 1.08-.552 2.147-1.935 3.062-.665.44-.971.646-1.153.885-.141.185-.238.438-.238 1.082a.617.617 0 01-1.233 0c0-.759.111-1.333.49-1.83.318-.416.8-.734 1.34-1.09l.113-.075c1.117-.74 1.384-1.455 1.384-2.034A2.375 2.375 0 0012.3 7.109c-1.248 0-2.387 1.074-2.387 2.365a.617.617 0 11-1.233 0z"
        fill={
          props.color
            ? props.color
            : palette.white
        }
      />
      <Path
        d="M11.999 18.509a.901.901 0 100-1.803.901.901 0 000 1.803z"
        fill={
          props.color
            ? props.color
            : palette.white
        }
      />
    </Svg>
  );
};

export default React.memo(SvgIconOutlineTip);
