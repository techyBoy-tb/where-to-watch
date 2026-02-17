import React, { useState } from "react";
import { View, Image } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";
import { ProviderInfo } from "@utils/types";
import config from "@data/config";
import ModalProviderInfo from "./Modal_ProviderInfo";

interface Props {
    title: string;
    provider: ProviderInfo;
    providerType: 'free' | 'rent' | 'ads' | 'flatrate' | 'buy'
}

const ProviderCard: React.FC<Props> = ({ title, provider, providerType }) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <View
                style={{
                    borderRadius: 16,
                    backgroundColor: "rgba(255,255,255,0.12)",
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.15)",
                    justifyContent: "center",
                    overflow: 'hidden'
                }}
            >
                <TouchableRipple
                    onPress={() => setShowModal(true)}
                    style={{
                        padding: 10,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <>
                        <Image
                            source={{ uri: `${config.imageUrl}${provider.logoPath}` }}
                            style={{
                                width: 45,
                                height: 45,
                                borderRadius: 8,
                            }}
                            resizeMode="contain"
                        />

                        <Text
                            numberOfLines={2}
                            style={{
                                marginTop: 6,
                                textAlign: "center",
                                color: "white",
                                fontSize: 12,
                                fontWeight: "500",
                            }}
                        >
                            {provider.providerName}
                        </Text>
                    </>
                </TouchableRipple>
            </View>

            {showModal && (
                <ModalProviderInfo
                    isModalVisible={showModal}
                    logo={`${config.imageUrl}${provider.logoPath}`}
                    name={provider.providerName}
                    type={providerType}
                    title={title}
                    onDismiss={() => setShowModal(false)} />
            )}
        </>
    );
};

export default ProviderCard;
