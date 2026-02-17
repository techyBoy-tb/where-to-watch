import { useMemo } from "react";
import { Image, View } from "react-native";
import { Button, Modal, Portal, Text } from "react-native-paper";
import React from "react";

interface Props {
    isModalVisible: boolean;
    logo: string;
    title: string;
    name: string;
    type: "free" | "rent" | "ads" | "flatrate" | "buy";
    onDismiss: () => void;
}

const ModalProviderInfo: React.FC<Props> = ({
    isModalVisible,
    logo,
    title,
    name,
    type,
    onDismiss,
}) => {
    const modalInfo = useMemo(() => {
        let subtitle = "";
        let description = "";

        switch (type) {
            case "ads":
                subtitle = "Watch with adverts";
                description = `${title} is available on ${name}. Limited adverts will play during streaming.`;
                break;

            case "buy":
                subtitle = "Purchase to watch";
                description = `${title} is available to buy on ${name}. Visit the provider for pricing.`;
                break;

            case "flatrate":
                subtitle = "Included in your plan";
                description = `${title} is available on ${name}, included in your streaming subscription.`;
                break;

            case "free":
                subtitle = "Watch for FREE";
                description = `${title} is available to watch free on ${name}.`;
                break;

            case "rent":
                subtitle = "Rent to watch";
                description = `${title} is available to rent on ${name}. Visit the provider for pricing.`;
                break;
        }

        return { subtitle, description };
    }, []);

    return (
        <Portal>
            <Modal
                visible={isModalVisible}
                onDismiss={onDismiss}
                contentContainerStyle={{
                    padding: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                }}
            >
                <View
                    style={{
                        width: "85%",
                        backgroundColor: "rgba(15,25,38,0.92)",
                        borderRadius: 22,
                        padding: 26,
                        borderWidth: 1,
                        borderColor: "rgba(255,255,255,0.10)",
                        shadowColor: "#000",
                        shadowOpacity: 0.4,
                        shadowRadius: 25,
                        shadowOffset: { width: 0, height: 12 },
                    }}
                >
                    <View
                        style={{
                            alignItems: "center",
                            marginBottom: 20,
                        }}
                    >
                        <Image
                            source={{ uri: logo }}
                            style={{
                                width: 70,
                                height: 70,
                                borderRadius: 14,
                            }}
                            resizeMode="contain"
                        />
                    </View>

                    <Text
                        style={{
                            textAlign: "center",
                            color: "white",
                            fontSize: 22,
                            fontWeight: "700",
                        }}
                    >
                        {name}
                    </Text>

                    <Text
                        style={{
                            textAlign: "center",
                            color: "#A7C2D9",
                            marginTop: 4,
                            fontSize: 14,
                            fontWeight: "500",
                        }}
                    >
                        {modalInfo.subtitle}
                    </Text>

                    <Text
                        style={{
                            textAlign: "center",
                            color: "#DCE7F2",
                            marginTop: 16,
                            lineHeight: 20,
                            fontSize: 15,
                        }}
                    >
                        {modalInfo.description}
                    </Text>

                    <Button
                        mode="contained"
                        onPress={onDismiss}
                        style={{
                            marginTop: 26,
                            borderRadius: 12,
                            backgroundColor: "rgba(255,255,255,0.20)",
                        }}
                        textColor="white"
                    >
                        Close
                    </Button>
                </View>
            </Modal>
        </Portal>
    );
};

export default React.memo(ModalProviderInfo);
