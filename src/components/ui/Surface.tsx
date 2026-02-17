import palette from "@theme/_palette";
import { FC } from "react"
import { View } from "react-native";
import { Surface as RNPSurface, TouchableRipple } from 'react-native-paper';
import { ForwardRefComponent } from "react-native-paper/lib/typescript/utils/forwardRef";

type RNPSurfaceProps = React.ComponentProps<typeof RNPSurface> & { onPress?: () => void };

const Surface: FC<RNPSurfaceProps> = (props) => {
    if (props.onPress) {
        return (
            <TouchableRipple onPress={props.onPress}
                style={{
                    marginHorizontal: 15,
                    borderRadius: 10,
                    // alignItems: 'center',
                    overflow: 'hidden',
                    backgroundColor: palette.surface,
                    borderColor: palette.white_20,
                }}
            >
                <RNPSurface
                    {...props}
                    style={[{
                        alignItems: 'center',
                        backgroundColor: palette.transparent,
                        padding: 0,
                        margin: 0
                    }, props.style]}
                >
                    {props.children}
                </RNPSurface>
            </TouchableRipple>
        )
    }
    return <RNPSurface
        {...props}
        style={[{
            marginHorizontal: 15,
            borderRadius: 10,
            alignItems: 'center',
            backgroundColor: palette.surface,
            borderColor: palette.white_20,
        }, props.style]}>
        {props.children}
    </RNPSurface>
}

export default Surface;