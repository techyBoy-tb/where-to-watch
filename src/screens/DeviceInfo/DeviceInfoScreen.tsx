import React from 'react';
import { View, ScrollView, Linking, Platform, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-paper';
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import Constants from 'expo-constants';

import Wrap from '@components/Wrap';
import ScreenHeader from '@components/ui/ScreenHeader';
import Surface from '@components/ui/Surface';
import Paragraph from '@components/ui/Paragraph';
import palette from '@theme/_palette';
import { log, warn } from '@utils/trace';

interface Props { }

const DeviceInfoScreen: React.FC<Props> = () => {
  let RAM: string = 'Unknown';

  if (Device.totalMemory) {
    try {
      const mem = Number(Device.totalMemory) / 1024 / 1024 / 1024; // gigabytes
      const fixed = mem.toFixed(1);
      RAM = `${fixed} GB`;
    } catch (e) {
      warn('Could not read `Device.totalMemory`');
      log(e);
    }
  }

  const handleEmailPress = () => {
    const email = 'EMAIL@ADDRESS.com';
    const subject = 'Where2Watch App Feedback';
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          warn('Cannot open email client');
        }
      })
      .catch((err) => {
        warn('Error opening email');
        log(err);
      });
  };

  const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: palette.dark_50,
      width: '100%',
      gap: 10,
    }}>
      <Paragraph style={{ color: palette.placeholder, fontSize: 13, flex: 1 }}>{label}</Paragraph>
      <Paragraph style={{ fontSize: 13, fontWeight: '500', flex: 1, textAlign: 'right' }}>{value}</Paragraph>
    </View>
  );

  return (
    <Wrap>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <ScreenHeader showBackLink />

        {/* App Info Section */}
        <Surface style={{ padding: 10, marginVertical: 10 }}>
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <Icon source="information" size={60} color={palette.primary} />
            <Paragraph variant="titleLarge" style={{ marginTop: 10 }}>
              Where2Watch
            </Paragraph>
            <Paragraph style={{ color: palette.placeholder, fontSize: 12 }}>
              Discover where to watch your favorites
            </Paragraph>
          </View>

          <View style={{ marginTop: 10, width: '100%' }}>
            <InfoRow label="Version" value={Constants.expoConfig?.version || '1.0.0'} />
            <InfoRow
              label="Build"
              value={Application.nativeBuildVersion || 'N/A'}
            />
            <InfoRow
              label="Package"
              value={Application.applicationId || 'com.cliffordgareth9519.where2watch'}
            />
            <InfoRow
              label="Platform"
              value={Platform.OS === 'ios' ? 'iOS' : Platform.OS === 'android' ? 'Android' : 'Web'}
            />
          </View>
        </Surface>

        {/* Device Info Section */}
        <Surface style={{ padding: 10, marginVertical: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
            <Icon source="cellphone" size={30} color={palette.blue} />
            <Paragraph variant="titleMedium" style={{ marginLeft: 10 }}>
              Device Information
            </Paragraph>
          </View>

          <View style={{ width: '100%' }}>
            <InfoRow label="Manufacturer" value={Device.manufacturer ?? 'Unknown'} />
            <InfoRow label="Model" value={Device.modelName ?? 'Unknown'} />
            <InfoRow label="Brand" value={Device.brand ?? 'Unknown'} />
            <InfoRow label="Device Name" value={Device.deviceName ?? 'Unknown'} />
            <InfoRow label="Year Class" value={String(Device.deviceYearClass ?? 'Unknown')} />
            <InfoRow label="Memory" value={RAM} />
            <InfoRow
              label="OS Version"
              value={Device.osVersion ?? 'Unknown'}
            />
          </View>
        </Surface>

        {/* Contact Developer Section */}
        <Surface
          onPress={handleEmailPress}
          style={{
            padding: 10,
            marginVertical: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <Icon source="email" size={30} color={palette.success} />
            <View style={{ marginLeft: 15, flex: 1 }}>
              <Paragraph variant="bodyLarge">Contact Developer</Paragraph>
              <Paragraph style={{ color: palette.placeholder, fontSize: 12 }}>
                EMAIL@ADDRESS.com
              </Paragraph>
            </View>
          </View>
          <Icon source="open-in-new" size={20} color={palette.placeholder} />
        </Surface>

        {/* Legal Info */}
        <Surface style={{ padding: 10, marginVertical: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Icon source="shield-check" size={24} color={palette.yellow} />
            <Paragraph variant="titleSmall" style={{ marginLeft: 10 }}>
              Legal
            </Paragraph>
          </View>
          <Paragraph style={{ color: palette.placeholder, fontSize: 12, lineHeight: 18 }}>
            This app uses The Movie Database (TMDB) API but is not endorsed or certified by TMDB. All movie and TV show data is provided by TMDB.
          </Paragraph>
          <Paragraph style={{ color: palette.placeholder, fontSize: 12, marginTop: 10 }}>
            © 2026 Where2Watch. All rights reserved.
          </Paragraph>
        </Surface>
      </ScrollView>
    </Wrap>
  );
};

export default React.memo(DeviceInfoScreen);
