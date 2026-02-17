import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import palette from "@theme/_palette";
import React, { useEffect, useMemo } from "react";
import {
    BackHandler,
    NativeEventSubscription,
    Text,
    TextStyle,
    View,
    ViewStyle
} from "react-native";
import DropDownPicker, { ValueType } from "react-native-dropdown-picker";

export interface DropdownItem {
    label: string;
    value: ValueType;
}

interface PillDropdownProps {
    items: DropdownItem[];
    isFocused: boolean;
    defaultValue: ValueType;
    testID: string;
    onChange: (value: ValueType) => void;
    onFocus: (isOpen: boolean) => void;

    shouldForceUpdate?: boolean;
    placeholder: string;
}

export const PillDropdown: React.FC<PillDropdownProps> = ({
    placeholder,
    items,
    defaultValue,
    shouldForceUpdate = false,
    isFocused,
    onChange,
    onFocus,
    testID
}) => {
    const navigation = useNavigation();

    const [dropdownValue, setDropdownValue] =
        React.useState<ValueType>(defaultValue);
    const [isOpen, setIsOpen] = React.useState<boolean>(isFocused);

    const [dynamicWidth, setDynamicWidth] = React.useState<number>(0);

    useEffect(() => {
        let backPressListener: null | NativeEventSubscription = null;
        const onBlurListener = navigation.addListener("blur", () => {
            setIsOpen(false);
        });

        // if (!isIOS()) {
        //     backPressListener = BackHandler.addEventListener(
        //         "hardwareBackPress",
        //         () => {
        //             if (isOpen) {
        //                 setIsOpen(false);
        //             }
        //             return isOpen;
        //         }
        //     );
        // }

        return (): void => {
            navigation.removeListener("blur", onBlurListener);
            // if (!isIOS() && backPressListener !== null) {
            //     backPressListener.remove();
            // }
        };
    }, [isOpen, navigation]);

    useEffect(() => {
        onChange(dropdownValue);
    }, [dropdownValue, onChange]);

    useEffect(() => {
        if (onFocus) {
            onFocus(isOpen);
        }
    }, [isOpen, onFocus]);

    useEffect(() => {
        if (shouldForceUpdate && isFocused !== isOpen) {
            setIsOpen(isFocused);
        }
    }, [isFocused, shouldForceUpdate]);

    const hasDropdownValue = useMemo((): boolean => {
        let hasValue = !!dropdownValue;

        if (typeof dropdownValue === "number") {
            hasValue = dropdownValue !== -1;
        }

        return hasValue;
    }, [dropdownValue]);

    const DropDownStyle = useMemo((): ViewStyle => {
        return {
            // ..._DropDownStyle,
            backgroundColor: isOpen ? palette.white : hasDropdownValue ? palette.highlight : palette.white,
            minHeight: 32,
            justifyContent: "flex-start"
        };
    }, [isOpen, hasDropdownValue, dynamicWidth]);

    const ContainerStyle = useMemo((): ViewStyle => {
        return {
            // ..._ContainerStyle,
            borderColor: isOpen ? palette.highlight : palette.white_50,
            minHeight: 32,
        };
    }, [isOpen, dynamicWidth]);

    const TextStyle = useMemo((): TextStyle => {
        return {
            color: isOpen
                ? palette.red
                : hasDropdownValue
                    ? palette.white
                    : palette.red
        };
    }, [isOpen, hasDropdownValue, palette.white]);

    const ArrowIconStyle = useMemo(() => {
        return {
            tintColor: isOpen ? palette.highlight : hasDropdownValue ? palette.white : palette.red
        };
    }, [isOpen, palette.highlight, hasDropdownValue, palette.white]);

    return (
        <View testID={testID}>
            <View style={{ opacity: 0, position: 'absolute', flexDirection: 'row' }}>
                <View onLayout={(event) => {
                    setDynamicWidth(event.nativeEvent.layout.width);
                }}>
                    <Text testID={'placeholder-text'}>
                        {items.find((v) => v.value === dropdownValue)?.label ?? placeholder}
                    </Text>
                </View>
            </View>

            <DropDownPicker
                // arrowIconStyle={ArrowIconStyle}
                containerStyle={ContainerStyle}
                disableBorderRadius={false}
                // dropDownContainerStyle={DropDownContainerStyle}
                itemSeparator={true}
                // itemSeparatorStyle={ItemSeparatorStyle}
                items={items}
                labelProps={{ numberOfLines: 1 }}
                listItemLabelStyle={{ color: palette.red }}
                // maxHeight={GetWidth()}
                open={isOpen}
                placeholder={placeholder}
                selectedItemLabelStyle={{ color: palette.highlight }}
                setOpen={setIsOpen}
                setValue={setDropdownValue}
                showTickIcon={false}
                style={DropDownStyle}
                textStyle={TextStyle}
                value={dropdownValue} />
        </View>
    );
};

// const _DropDownStyle: ViewStyle = {
//     borderRadius: 30,
//     paddingVertical: 4,
//     paddingHorizontal: 12,
//     justifyContent: "center",
//     borderWidth: 0
// };

// const _ContainerStyle: ViewStyle = {
//     borderWidth: 1,
//     borderRadius: 30
// };

// const DropDownContainerStyle: ViewStyle = {
//     backgroundColor: palette.greyscale.palette.white,
//     borderWidth: 0,
//     marginTop: getGutter.BIG,
//     width: getGutter.LARGE * 6,
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 2,
//     overflow: "visible"
// };

// const ItemSeparatorStyle: ViewStyle = {
//     marginHorizontal: getGutter.DEFAULT,
//     backgroundColor: palette.greyscale.lightGrey,
//     height: 1
// };
