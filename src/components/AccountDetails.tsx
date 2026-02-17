import React, { PropsWithChildren, useContext, useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { ActivityIndicator, Icon, IconButton, Text, TextInput } from 'react-native-paper';
import Surface from './ui/Surface';
import Paragraph from './ui/Paragraph';
import { Button } from './ui/Button';
import { authContext } from '@data/context/auth';
import { databaseContext } from '@data/context/database';
import palette from '@theme/_palette';
import Modal_Logout from './Modal_Logout';

interface Props {

}

const AccountDetails: React.FC<Props> = ({ }) => {
  const { sendVerificationEmail, isLoggedIn, user, refreshUserData, updateDisplayName } = useContext(authContext);
  const { syncWithCloud, getSyncStatusData, syncStatus, lastSyncDate } = useContext(databaseContext)

  const [isSyncing, setIsSyncing] = useState(false);
  const [isCheckingSync, setIsCheckingSync] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  const checkSyncStatus = (async () => {
    setIsCheckingSync(true);
    await getSyncStatusData();
    setIsCheckingSync(false);
  });

  // Check sync status when user logs in
  useEffect(() => {
    if (isLoggedIn && user) {
      checkSyncStatus();
    }
  }, [isLoggedIn, user]);

  const handleSync = async () => {
    setIsSyncing(true);
    const success = await syncWithCloud();
    setIsSyncing(false);

    if (success) {
      // TODO Change this Alert to be a TOAST
      Alert.alert('Success', 'Your data has been synced to the cloud!');
      // Refresh sync status after syncing
      await checkSyncStatus();
    } else {
      // TODO Change this Alert to be a TOAST
      Alert.alert('Error', 'Failed to sync data. Please try again.');
    }
  };

  const handleUpdateDisplayName = async () => {
    if (!newDisplayName.trim()) {
      Alert.alert('Error', 'Please enter a display name');
      return;
    }

    setIsUpdatingName(true);
    const success = await updateDisplayName(newDisplayName);
    setIsUpdatingName(false);

    if (success) {
      Alert.alert('Success', 'Your display name has been updated!');
      setIsEditingName(false);
      setNewDisplayName('');
    } else {
      Alert.alert('Error', 'Failed to update display name. Please try again.');
    }
  };

  const startEditingName = () => {
    setNewDisplayName(user?.name || '');
    setIsEditingName(true);
  };

  const cancelEditingName = () => {
    setIsEditingName(false);
    setNewDisplayName('');
  };

  return (
    <>
      <View style={{ paddingTop: 10 }}>
        <Surface style={{ padding: 10, marginVertical: 10 }}>
          <View style={{ width: '100%', alignItems: 'flex-start' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
              <Icon source="account-circle" size={50} color={palette.primary} />
              <View style={{ marginLeft: 15, flex: 1 }}>
                {isEditingName ? (
                  <TextInput
                    value={newDisplayName}
                    onChangeText={setNewDisplayName}
                    mode="outlined"
                    placeholder="Enter display name"
                    style={{
                      backgroundColor: palette.surface,
                      marginBottom: 5,
                    }}
                    textColor={palette.brightWhite}
                    placeholderTextColor={palette.white_50}
                    dense
                  />
                ) : (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Paragraph variant="titleMedium">{user?.name || 'No display name'}</Paragraph>
                    <IconButton
                      icon="pencil"
                      size={16}
                      iconColor={palette.primary}
                      onPress={startEditingName}
                    />
                  </View>
                )}
                <Paragraph style={{ color: palette.placeholder }}>{user?.email}</Paragraph>
              </View>
            </View>

            {isEditingName ? (
              <View style={{ flexDirection: 'row', width: '100%', gap: 10, marginBottom: 10 }}>
                <Button
                  onPress={cancelEditingName}
                  style={{ flex: 1 }}
                  disabled={isUpdatingName}
                >
                  Cancel
                </Button>
                <Button
                  onPress={handleUpdateDisplayName}
                  loading={isUpdatingName}
                  style={{ flex: 1, backgroundColor: palette.primary }}
                  icon="check"
                >
                  Save
                </Button>
              </View>
            ) : null}

            <Button
              onPress={() => setShowLogoutModal(true)}
              style={{ width: '100%' }}
              icon="logout"
            >
              Logout
            </Button>
          </View>
        </Surface>

        {!user?.isVerified && (
          <Surface style={{ padding: 10, marginVertical: 10 }}>
            <View style={{ width: '100%', alignItems: 'flex-start' }}>
              <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'space-between', width: '100%' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon source="security" size={40} color={palette.orange} />
                  <Paragraph variant="titleMedium" style={{ marginLeft: 10 }}>
                    Account verification
                  </Paragraph>
                </View>

                <IconButton icon={'refresh'} iconColor={palette.primary} onPress={refreshUserData} />
              </View>
              <Paragraph style={{ color: palette.placeholder, marginTop: 10, fontSize: 14 }}>
                You have not verified your account yet. Please check your emails for the verification link.
              </Paragraph>
              <Paragraph style={{ color: palette.placeholder, fontSize: 12 }}>
                If you have not received the email please check your spam/junk folder.
              </Paragraph>
              <Paragraph style={{ color: palette.primary, marginTop: 10 }} onPress={() => sendVerificationEmail()}>
                Resend email
              </Paragraph>
            </View>
          </Surface>
        )}

        <Surface style={{ padding: 10, marginVertical: 10 }}>
          <View style={{ width: '100%', alignItems: 'flex-start' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon source="cloud-sync" size={40} color={palette.blue} />
                <Paragraph variant="titleMedium" style={{ marginLeft: 10 }}>
                  Cloud Sync
                </Paragraph>
              </View>
              {isCheckingSync && <ActivityIndicator size="small" color={palette.primary} />}
            </View>
            <Paragraph style={{ color: palette.placeholder, marginTop: 5, marginBottom: 20 }}>
              Keep your favourites backed up and synced
            </Paragraph>

            {/* Sync Status Card */}
            {syncStatus && (
              <View style={{
                backgroundColor: palette.dark,
                padding: 15,
                borderRadius: 8,
                width: '100%',
                marginBottom: 15
              }}>
                {syncStatus.inSync ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <Icon source="check-circle" size={20} color={palette.success} />
                    <Paragraph style={{ color: palette.success, marginLeft: 8, fontWeight: 'bold' }}>
                      In Sync
                    </Paragraph>
                  </View>
                ) : (
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <Icon source="alert-circle" size={20} color={palette.warning} />
                    <Paragraph style={{ color: palette.warning, marginLeft: 8, fontWeight: 'bold' }}>
                      Out of Sync
                    </Paragraph>
                  </View>
                )}

                {/* Database Counts */}
                <View style={{ marginTop: 10 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Paragraph style={{ color: palette.placeholder, fontSize: 12 }}>
                      Local Device
                    </Paragraph>
                    <Paragraph style={{ color: palette.white, fontSize: 12, fontWeight: 'bold' }}>
                      {syncStatus.totalLocal} items
                    </Paragraph>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                    <Paragraph style={{ color: palette.placeholder, fontSize: 12 }}>
                      Cloud Storage
                    </Paragraph>
                    <Paragraph style={{ color: palette.white, fontSize: 12, fontWeight: 'bold' }}>
                      {syncStatus.totalCloud} items
                    </Paragraph>
                  </View>

                  {/* Breakdown */}
                  {!syncStatus.inSync && (
                    <>
                      <View style={{ height: 1, backgroundColor: palette.placeholder, opacity: 0.2, marginVertical: 10 }} />

                      {(syncStatus.moviesToUpload + syncStatus.showsToUpload + syncStatus.peopleToUpload) > 0 && (
                        <View style={{ marginBottom: 8 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                            <Icon source="cloud-upload-outline" size={16} color={palette.primary} />
                            <Paragraph style={{ color: palette.primary, marginLeft: 8, fontSize: 12, fontWeight: 'bold' }}>
                              To Upload: {syncStatus.moviesToUpload + syncStatus.showsToUpload + syncStatus.peopleToUpload}
                            </Paragraph>
                          </View>
                          {syncStatus.moviesToUpload > 0 && (
                            <Paragraph style={{ color: palette.placeholder, fontSize: 11, marginLeft: 24 }}>
                              • {syncStatus.moviesToUpload} {syncStatus.moviesToUpload === 1 ? 'movie' : 'movies'}
                            </Paragraph>
                          )}
                          {syncStatus.showsToUpload > 0 && (
                            <Paragraph style={{ color: palette.placeholder, fontSize: 11, marginLeft: 24 }}>
                              • {syncStatus.showsToUpload} {syncStatus.showsToUpload === 1 ? 'show' : 'shows'}
                            </Paragraph>
                          )}
                          {syncStatus.peopleToUpload > 0 && (
                            <Paragraph style={{ color: palette.placeholder, fontSize: 11, marginLeft: 24 }}>
                              • {syncStatus.peopleToUpload} {syncStatus.peopleToUpload === 1 ? 'person' : 'people'}
                            </Paragraph>
                          )}
                        </View>
                      )}

                      {(syncStatus.moviesToDownload + syncStatus.showsToDownload + syncStatus.peopleToDownload) > 0 && (
                        <View>
                          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                            <Icon source="cloud-download-outline" size={16} color={palette.blue} />
                            <Paragraph style={{ color: palette.blue, marginLeft: 8, fontSize: 12, fontWeight: 'bold' }}>
                              To Download: {syncStatus.moviesToDownload + syncStatus.showsToDownload + syncStatus.peopleToDownload}
                            </Paragraph>
                          </View>
                          {syncStatus.moviesToDownload > 0 && (
                            <Paragraph style={{ color: palette.placeholder, fontSize: 11, marginLeft: 24 }}>
                              • {syncStatus.moviesToDownload} {syncStatus.moviesToDownload === 1 ? 'movie' : 'movies'}
                            </Paragraph>
                          )}
                          {syncStatus.showsToDownload > 0 && (
                            <Paragraph style={{ color: palette.placeholder, fontSize: 11, marginLeft: 24 }}>
                              • {syncStatus.showsToDownload} {syncStatus.showsToDownload === 1 ? 'show' : 'shows'}
                            </Paragraph>
                          )}
                          {syncStatus.peopleToDownload > 0 && (
                            <Paragraph style={{ color: palette.placeholder, fontSize: 11, marginLeft: 24 }}>
                              • {syncStatus.peopleToDownload} {syncStatus.peopleToDownload === 1 ? 'person' : 'people'}
                            </Paragraph>
                          )}
                        </View>
                      )}
                    </>
                  )}
                </View>
              </View>
            )}

            {lastSyncDate && (
              <View style={{
                backgroundColor: palette.dark,
                padding: 12,
                borderRadius: 8,
                width: '100%',
                marginBottom: 15
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon source="clock-outline" size={16} color={palette.placeholder} />
                  <Paragraph style={{ color: palette.placeholder, marginLeft: 8, fontSize: 12 }}>
                    Last synced: {lastSyncDate.toLocaleString()}
                  </Paragraph>
                </View>
              </View>
            )}

            <View style={{ flexDirection: 'row', width: '100%', gap: 10 }}>
              <Button
                onPress={checkSyncStatus}
                loading={isCheckingSync}
                style={{ flex: 1 }}
                icon="refresh"
              >
                Check Status
              </Button>
              <Button
                onPress={handleSync}
                loading={isSyncing}
                style={{ flex: 1 }}
                icon="cloud-upload"
              >
                Sync Now
              </Button>
            </View>
          </View>
        </Surface>

        <Surface style={{ padding: 10, marginVertical: 10 }}>
          <View style={{ width: '100%', alignItems: 'flex-start' }}>
            <Icon source="information" size={40} color={palette.yellow} />
            <Paragraph variant="titleSmall" style={{ marginTop: 10, marginBottom: 5 }}>
              About Cloud Sync
            </Paragraph>
            <Paragraph style={{ color: palette.placeholder, marginTop: 10, fontSize: 12 }}>
              Your favourite movies, shows, and people are automatically synced when you sign in.
              You can also manually sync using the button above.
            </Paragraph>
          </View>
        </Surface>
      </View>

      {showLogoutModal && (
        <Modal_Logout
          onDismiss={() => setShowLogoutModal(false)}
        />
      )}
    </>

  )
};

export default React.memo(AccountDetails);
