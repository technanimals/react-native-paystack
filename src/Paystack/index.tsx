import React, {
  useState,
  useEffect,
  forwardRef,
  useRef,
  useImperativeHandle,
  useCallback,
  useMemo,
} from 'react';
import { Modal, View, ActivityIndicator, SafeAreaView } from 'react-native';
import {
  WebView,
  WebViewNavigation,
  WebViewMessageEvent,
} from 'react-native-webview';
import { PaystackProps, ResponseEvent, ResponseEventType } from './helpers';
import { getHtmlContent } from './html';

const CLOSE_URL = 'https://standard.paystack.co/close';
export const Ref: React.ForwardRefRenderFunction<
  PaystackRef,
  PaystackComponentProps
> = (props, ref) => {
  const { autoStart, onCancel, onSuccess, publicKey, ...rest } = props;
  const html = getHtmlContent({ key: publicKey, ...rest });
  const [loading, setLoading] = useState(true);
  const [isOpen, showModal] = useState(false);
  useImperativeHandle(ref, () => ({
    startTransaction() {
      showModal(true);
    },
    endTransaction() {
      showModal(false);
    },
  }));
  const onLoadStart = useCallback(() => {
    setLoading(true);
  }, []);

  const onLoadEnd = useCallback(() => {
    setLoading(false);
  }, []);
  const webView = useRef(null);

  const onNavigationStateChange = useCallback((state: WebViewNavigation) => {
    const { url } = state;
    if (url === CLOSE_URL) {
      showModal(false);
    }
  }, []);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const handlers: Handlers = useMemo(
    () => ({
      CANCELLED: (_event: CancelEvent) => {
        showModal(false);
        onCancel({
          status: ResponseEventType.Cancelled,
        });
      },
      // PENDING: (_: SuccessEvent) => {
      //   showModal(false);
      // },
      SUCCESS: (event: SuccessEvent) => {
        onSuccess(event);
        showModal(false);
      },
    }),
    [onSuccess, onCancel]
  );
  const onMessage = useCallback(
    (e: WebViewMessageEvent) => {
      const { data } = e.nativeEvent;
      const response = JSON.parse(data) as ResponseEvent;
      const status = response.eventType;
      const handler = handlers[status];
      const reference = response.data?.reference;
      const event: HandlerEvent = {
        status,
        reference,
      };
      handler(event);
    },
    [handlers]
  );

  useEffect(() => {
    if (autoStart) {
      showModal(true);
    }
  }, []);

  return (
    <Modal
      // @ts-ignore
      style={{ flex: 1 }}
      visible={isOpen}
      animationType="slide"
      transparent={false}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <WebView
          style={[{ flex: 1 }]}
          source={{ html }}
          onMessage={onMessage}
          onLoadStart={onLoadStart}
          onLoadEnd={onLoadEnd}
          onNavigationStateChange={onNavigationStateChange}
          ref={webView}
        />
        {loading && (
          <View>
            <ActivityIndicator size="large" color="green" />
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

export interface PaystackRef {
  startTransaction: () => void;
  endTransaction: () => void;
}

export interface BaseHandlerEvent {
  status: ResponseEventType;
}

export type CancelEvent = BaseHandlerEvent;
export interface SuccessEvent extends BaseHandlerEvent {
  reference: string;
}
type HandlerEvent = SuccessEvent | CancelEvent;
type Handler = (event: BaseHandlerEvent) => void;
type Handlers = Record<ResponseEventType, Handler>;
export interface PaystackComponentProps extends Omit<PaystackProps, 'key'> {
  onCancel(event: BaseHandlerEvent): void;
  onSuccess(event: SuccessEvent): void;
  autoStart?: boolean;
  publicKey: string;
}

export const Paystack = forwardRef(Ref);
