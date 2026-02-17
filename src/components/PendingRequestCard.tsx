import React, { useState } from 'react';
import { View } from 'react-native';
import { Icon, ActivityIndicator } from 'react-native-paper';
import Surface from './ui/Surface';
import Paragraph from './ui/Paragraph';
import { Button } from './ui/Button';
import palette from '@theme/_palette';
import { Friend } from '@utils/types';

interface Props {
  request: Friend;
  onAccept: () => Promise<void>;
  onReject: () => Promise<void>;
}

const PendingRequestCard: React.FC<Props> = ({ request, onAccept, onReject }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [action, setAction] = useState<'accept' | 'reject' | null>(null);

  const handleAccept = async () => {
    setIsLoading(true);
    setAction('accept');
    await onAccept();
    setIsLoading(false);
  };

  const handleReject = async () => {
    setIsLoading(true);
    setAction('reject');
    await onReject();
    setIsLoading(false);
  };

  return (
    <Surface style={{ padding: 15, marginVertical: 8, marginHorizontal: 15 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <Icon source="account-clock" size={40} color={palette.warning} />
        <View style={{ marginLeft: 12, flex: 1 }}>
          {request.name && (
            <Paragraph variant="titleMedium" style={{ color: palette.brightWhite }}>
              {request.name}
            </Paragraph>
          )}
          <Paragraph style={{ color: palette.placeholder, fontSize: 14 }}>
            {request.email}
          </Paragraph>
          <Paragraph style={{ color: palette.warning, fontSize: 12, marginTop: 4 }}>
            Wants to be friends
          </Paragraph>
        </View>
      </View>

      {isLoading ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8 }}>
          <ActivityIndicator size="small" color={palette.primary} />
          <Paragraph style={{ marginLeft: 10, color: palette.placeholder }}>
            {action === 'accept' ? 'Accepting...' : 'Rejecting...'}
          </Paragraph>
        </View>
      ) : (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
          <Button
            onPress={handleReject}
            style={{ flex: 1, backgroundColor: palette.surface }}
            icon="close"
          >
            Reject
          </Button>
          <Button
            onPress={handleAccept}
            style={{ flex: 1, backgroundColor: palette.primary }}
            icon="check"
          >
            Accept
          </Button>
        </View>
      )}
    </Surface>
  );
};

export default React.memo(PendingRequestCard);
