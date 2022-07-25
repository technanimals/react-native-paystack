import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import {
  getHtmlContent,
  PaystackScriptProps,
  SuccessEvent,
  ResponseEvent,
  ResponseEventType,
} from './html';

const CLOSE_URL = 'https://standard.paystack.co/close';

const Paystack: React.FC<PaystackViewProps> = (props) => {
  const { handleWebViewMessage, onCancel, onSuccess, onClose } = props;

  const messageReceived = (data: string) => {
    const response = JSON.parse(data) as ResponseEvent<SuccessEvent>;
    if (handleWebViewMessage) {
      handleWebViewMessage(data);
    }
    switch (response.eventType) {
      case ResponseEventType.Cancelled:
        onCancel();
        break;

      case ResponseEventType.Success:
        if (onSuccess) {
          onSuccess(response.data);
        }
        break;

      default:
        if (handleWebViewMessage) {
          handleWebViewMessage(data);
        }
        break;
    }
  };

  const onMessage = useCallback((e) => {
    messageReceived(e.nativeEvent?.data);
  }, []);

  const onNavigationStateChange = (state: WebViewNavigation) => {
    const { url } = state;
    if (url === CLOSE_URL) {
      onClose();
    }
  };

  const html = getHtmlContent(props.payment);

  return (
    <View style={styles.container}>
      <WebView
        style={[styles.container]}
        source={{ html }}
        onMessage={onMessage}
        onNavigationStateChange={onNavigationStateChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export interface PaystackViewProps {
  payment: PaystackScriptProps;
  handleWebViewMessage?: (message: string) => void;
  onCancel: () => void;
  onSuccess: (event: SuccessEvent) => void;
  onClose: () => void;
}
export const PaystackView = Paystack;
