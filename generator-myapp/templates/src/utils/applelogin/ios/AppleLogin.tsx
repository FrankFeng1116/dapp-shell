import React from 'react';
import { forwardRef, useMemo, useState, useCallback, useRef, useImperativeHandle, ReactNode } from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import WebView, { WebViewMessageEvent, WebViewProps } from 'react-native-webview';
import { LoadingBody } from '../../../component/Loading';
import { ModalBody } from '../../../component/ModalBody';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import GStyles from '../../../utils/GStyles';
import { BGStyles } from '../../../theme/styles';
import { pTd } from '../../../utils/unit';
import Lottie from 'lottie-react-native';

export declare type AppleLoginInterface = {
  open(): void;
  close(): void;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  loadingStyle: {
    width: pTd(50),
  },
  loadingBox: {
    ...GStyles.center,
    ...BGStyles.bg1,
    zIndex: 999,
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
  },
  webView: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transparentHeader: {
    height: '20%',
    width: '100%',
    backgroundColor: 'transparent',
  },
});

export type AppleLoginProps = {
  headerComponent?: ReactNode;
  footerComponent?: ReactNode;
  webViewProps?: Omit<WebViewProps, 'source' | 'style' | 'onMessage' | 'ref'>;
  onVerify: (token: string) => void;
  onExpire?: (...args: any[]) => void;
  onError?: (error: string) => void;
  onClose?: (...args: any[]) => void;
  onLoad?: (...args: any[]) => void;
  theme?: 'dark' | 'light';
  size?: 'invisible' | 'normal' | 'compact';
  baseUrl: string;
  style?: StyleProp<ViewStyle>;
  enterprise?: boolean;
  appleLoginDomain?: string;
  gstaticDomain?: string;
  hideBadge?: boolean;
  action?: string;
};

const AppleLogin = forwardRef(function AppleLogin(
  { onVerify, onExpire, onError, onClose, onLoad, size, baseUrl, style }: AppleLoginProps,
  ref,
) {
  const isClosed = useRef(false);
  const webViewRef = useRef<any>();
  const [, setVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  const isInvisibleSize = size === 'invisible';

  const handleLoad = useCallback(
    (...args: any[]) => {
      onLoad?.(...args);

      setLoading(false);
    },
    [onLoad],
  );

  const handleClose = useCallback(
    (...args: any[]) => {
      if (isClosed.current) return;
      isClosed.current = true;
      setVisible(false);
      onClose?.(...args);
    },
    [onClose],
  );

  const handleMessage = useCallback(
    (content: WebViewMessageEvent) => {
      try {
        const payload = JSON.parse(content.nativeEvent.data);
        console.log('payload', payload);

        if (payload.close && isInvisibleSize) {
          handleClose();
        }
        if (payload.closeWebView) {
          handleClose();
        }
        if (payload.load) {
          handleLoad(...payload.load);
        }
        if (payload.expire) {
          onExpire?.(payload.expire);
        }
        if (payload.error) {
          handleClose();
          onError?.(payload.error[0]);
        }
        if (
          payload?.type === 'PortkeySocialLoginOnSuccess' &&
          payload?.data?.provider === 'Apple' &&
          payload?.data?.token
        ) {
          handleClose('verified');
          onVerify?.(payload?.data?.token);
        }
      } catch (err) {
        console.warn(err);
      }
    },
    [onVerify, onExpire, onError, handleClose, handleLoad, isInvisibleSize],
  );

  useImperativeHandle(
    ref,
    () => ({
      open: () => {
        setVisible(true);
        setLoading(true);
        isClosed.current = false;
      },
      close: handleClose,
    }),
    [handleClose],
  );

  const webViewStyles = useMemo(() => [styles.webView, style], [style]);

  const renderLoading = () => {
    if (!loading) return null;
    return (
      <View style={styles.loadingContainer}>
        <LoadingBody iconType="loading" />
      </View>
    );
  };

  return (
    <ModalBody title="Apple Login" modalBodyType="bottom">
      <KeyboardAwareScrollView enableOnAndroid={true} contentContainerStyle={styles.container}>
        {loading && (
          <View style={styles.loadingBox}>
            <Lottie
              source={require('../../../assets/lottieFiles/globalLoading.json')}
              style={styles.loadingStyle}
              autoPlay
              loop
            />
          </View>
        )}
      <WebView
        ref={webViewRef}
        source={{ uri: baseUrl }}
        style={webViewStyles}
        onLoadEnd={() => setLoading(false)}
        onMessage={handleMessage}
        injectedJavaScript={`(()=>{
          try {
            if(!window.opener) window.opener = {}
            window.opener.postMessage = obj => {
              window.ReactNativeWebView.postMessage(JSON.stringify(obj));
            };
          } catch (error) {
            alert(JSON.stringify(error));
          }
        })()`}
      />
      {renderLoading()}
      </KeyboardAwareScrollView>
    </ModalBody>
  );
});

export default AppleLogin;
