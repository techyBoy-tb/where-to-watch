import React from "react";
import { FlatList, View } from "react-native";
import { Text } from "react-native-paper";
import { ProviderInfo, ProviderResponse } from "@utils/types";
import ProviderCard from "./ProviderCard";

interface Props {
    providers: ProviderResponse;
    title: string;
}

const Providers: React.FC<Props> = ({ providers, title }) => {
    const sections: { label: string; value: 'free' | 'rent' | 'ads' | 'flatrate' | 'buy'; data: ProviderInfo[] }[] = [
        { label: "Rent", value: 'rent', data: providers.rent ?? [] },
        { label: "Buy", value: 'buy', data: providers.buy ?? [] },
        { label: "Stream", value: 'flatrate', data: providers.flatrate ?? [] },
        { label: "Stream with Ads", value: 'ads', data: providers.ads ?? [] },
        { label: "Free", value: 'free', data: providers.free ?? [] },
    ];

    return (
        <View>
            <Text
                style={{
                    color: "white",
                    fontSize: 20,
                    fontWeight: "700",
                    marginBottom: 8,
                    marginTop: 16,
                }}
            >
                Watch Options
            </Text>

            {sections.map(
                (section) =>
                    section.data?.length > 0 && (
                        <View
                            key={section.label}
                            style={{ marginBottom: 24 }}
                        >
                            <Text
                                style={{
                                    color: "white",
                                    fontSize: 16,
                                    fontWeight: "600",
                                    marginBottom: 10,
                                }}
                            >
                                {section.label}
                            </Text>

                            <FlatList
                                horizontal
                                data={section.data}
                                keyExtractor={(item, i) =>
                                    `${section.label.toLowerCase()}-${i}-${item.providerName}`
                                }
                                showsHorizontalScrollIndicator={false}
                                ItemSeparatorComponent={() => (
                                    <View style={{ width: 12 }} />
                                )}
                                renderItem={({ item }) => (
                                    <ProviderCard provider={item} providerType={section.value} title={title} />
                                )}
                            />
                        </View>
                    )
            )}
        </View>
    );
};

export default Providers;
