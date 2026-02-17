import { FC, useEffect } from "react"
import { IconButton } from "react-native-paper";
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from "react-native-reanimated";

interface Props {
    isFavourite: boolean;
    onFavouritePress: () => void
}

const FavouriteIcon: FC<Props> = ({ isFavourite, onFavouritePress }) => {
    const progress = useSharedValue(isFavourite ? 1 : 0);
    const scale = useSharedValue(1);

    // Sync animation when parent changes isFavourite
    useEffect(() => {
        progress.value = withTiming(isFavourite ? 1 : 0, { duration: 250 });

        if (isFavourite) {
            scale.value = withSequence(
                withTiming(1.4, { duration: 120 }),
                withTiming(1, { duration: 150 })
            );
        } else {
            scale.value = withTiming(1, { duration: 200 });
        }
    }, [isFavourite]);

    const animatedScale = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const filledStyle = useAnimatedStyle(() => ({
        opacity: progress.value,
    }));

    const outlineStyle = useAnimatedStyle(() => ({
        opacity: 1 - progress.value,
    }));

    return (
        <Animated.View style={animatedScale}>
            {/* Outline Icon */}
            <Animated.View style={[{ position: "absolute" }, outlineStyle]}>
                <IconButton
                    icon="heart-outline"
                    iconColor="red"
                    size={28}
                    onPress={onFavouritePress}
                />
            </Animated.View>

            {/* Filled Icon */}
            <Animated.View style={filledStyle}>
                <IconButton
                    icon="heart"
                    iconColor="red"
                    size={28}
                    onPress={onFavouritePress}
                />
            </Animated.View>
        </Animated.View>
    );
};

export default FavouriteIcon