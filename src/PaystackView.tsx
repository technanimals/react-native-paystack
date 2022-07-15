import React, { useState, useCallback, ReactNode } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
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
  const { handleWebViewMessage, onCancel, onSuccess, onClose, loader } = props;
  const [isLoading, setLoading] = useState(true);

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

  const onLoadStart = useCallback(() => {
    setLoading(true);
  }, []);

  const onLoadEnd = useCallback(() => {
    setLoading(false);
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
        onLoadStart={onLoadStart}
        onLoadEnd={onLoadEnd}
        onNavigationStateChange={onNavigationStateChange}
      />

      {isLoading && (loader || <ActivityIndicator size="large" color="#000" />)}
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
  loader?: ReactNode;
}
export const PaystackView = Paystack;
