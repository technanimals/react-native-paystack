import React, {
  useState,
  useEffect,
  forwardRef,
  useRef,
  useImperativeHandle,
  useCallback,
} from 'react';
import {
  Modal,
  View,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import {
  getHtmlContent,
  PaystackScriptProps,
  SuccessEvent,
  ResponseEvent,
  ResponseEventType,
} from './html';

const CLOSE_URL = 'https://standard.paystack.co/close';

const Paystack: React.ForwardRefRenderFunction<
  PaystackViewRef,
  PaystackViewProps
> = (props, ref) => {
  const {
    handleWebViewMessage,
    onCancel,
    autoStart = false,
    onSuccess,
    activityIndicatorColor = 'green',
  } = props;
  const [isLoading, setLoading] = useState(true);
  const [isModalVisible, setModalVisibility] = useState(false);
  const webView = useRef(null);

  useEffect(() => {
    autoStartCheck();
  }, []);

  useImperativeHandle(ref, () => ({
    startTransaction() {
      setModalVisibility(true);
    },
    endTransaction() {
      setModalVisibility(false);
    },
  }));

  const autoStartCheck = () => {
    if (autoStart) {
      setModalVisibility(true);
    }
  };

  const messageReceived = (data: string) => {
    const response = JSON.parse(data) as ResponseEvent<SuccessEvent>;
    if (handleWebViewMessage) {
      handleWebViewMessage(data);
    }
    switch (response.eventType) {
      case ResponseEventType.Cancelled:
        setModalVisibility(false);
        onCancel();
        break;

      case ResponseEventType.Success:
        setModalVisibility(false);
        console.log({ response });
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
      setModalVisibility(false);
    }
  };
  const { container } = styles;
  const html = getHtmlContent(props.payment);
  return (
    <Modal
      //@ts-ignore
      style={container}
      visible={isModalVisible}
      animationType="slide"
      transparent={false}
    >
      <SafeAreaView style={container}>
        <WebView
          style={[container]}
          source={{ html }}
          onMessage={onMessage}
          onLoadStart={onLoadStart}
          onLoadEnd={onLoadEnd}
          onNavigationStateChange={onNavigationStateChange}
          ref={webView}
        />

        {isLoading && (
          <View>
            <ActivityIndicator size="large" color={activityIndicatorColor} />
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export interface PaystackViewRef {
  startTransaction: () => void;
  endTransaction: () => void;
}

export interface PaystackViewProps {
  payment: PaystackScriptProps;
  handleWebViewMessage?: (message: string) => void;
  onCancel: () => void;
  onSuccess: (event: SuccessEvent) => void;
  autoStart?: boolean;
  activityIndicatorColor?: string;
}
export const PaystackView = forwardRef(Paystack);
