import React, { useCallback, useRef, useState } from 'react';
import OverlayModal from '../OverlayModal';
import { Keyboard, View } from 'react-native';
import { ModalBody } from '../ModalBody';
import WebView from 'react-native-webview';
import Lottie from 'lottie-react-native';
import { pTd } from '../../utils/unit';
import { StyleSheet } from 'react-native';
import GStyles from '../../utils/GStyles';
import { BGStyles } from '../../theme/styles';
import queryString from 'query-string';
import { WebViewNavigationEvent } from 'react-native-webview/lib/WebViewTypes';
import { WebViewMessageEvent } from 'react-native-webview';
import {
  InjectTelegramLoginJavaScript,
  InjectTelegramOpenJavaScript,
  PATHS,
  TGAuthCallBack,
  TGAuthPush,
  TGAuthResult,
  TG_FUN,
  parseTGAuthResult,
} from './config';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { isIOS } from '../../utils/device';
import { TelegramAuthentication, parseTelegramToken } from '../../utils/logic';
import { useCurrentNetworkInfo } from '../../hooks';


const USER_CANCELED = 'user canceled';
const OpenLogin = `https://openlogin.portkey.finance`;
type TelegramSignProps = {
  onConfirm: (userInfo: TelegramAuthentication) => void;
  onReject: (reason: any) => void;
};

function TelegramSign({ onConfirm, onReject }: TelegramSignProps) {
  const [loading, setLoading] = useState(true);
  const { networkType, apiUrl } = useCurrentNetworkInfo();
  const [uri, go] = useState(`${OpenLogin}${PATHS.Load}&network=${networkType}`);
  const ref = useRef<WebView>();
  const onLoadStart = useCallback(
    ({ nativeEvent }: WebViewNavigationEvent) => {
      try {
        if (nativeEvent.url.includes(TGAuthPush)) {
          setLoading(true);
        } else if (nativeEvent.url.includes(TGAuthResult)) {
          setLoading(true);
          go(`${apiUrl}${PATHS.CallPortkey}?${parseTGAuthResult(nativeEvent.url)}`);
        } else if (nativeEvent.url.includes(TGAuthCallBack)) {
          try {
            if (nativeEvent.url.includes(TGAuthCallBack)) {
              const parseData = queryString.parseUrl(nativeEvent.url);
              const { token } = parseData.query || {};
              if (typeof token === 'string') {
                const user = parseTelegramToken(token);
                if (!user) return onReject(new Error('Invalid Token'));
                const userInfo: TelegramAuthentication = {
                  user,
                  accessToken: token,
                };
                onConfirm(userInfo);
              }
            }
          } catch (error) {
            onReject(error);
          } finally {
            OverlayModal.hide(false);
          }
        }
      } catch (error) {
        onReject(error);
        OverlayModal.hide(false);
      }
    },
    [apiUrl, onConfirm, onReject],
  );

  const onMessage = useCallback(
    ({ nativeEvent }: WebViewMessageEvent) => {
      const { data } = nativeEvent;
      try {
        const obj = JSON.parse(data);
        const { type } = obj;
        if (type === TG_FUN.LoginCancel || type === TG_FUN.DeclineRequest || type === TG_FUN.Error) {
          onReject(USER_CANCELED);
          OverlayModal.hide();
        } else if (!isIOS && type === TG_FUN.Open) {
          go(obj.url);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [onReject],
  );
  console.log( 'url', uri);
  return (
    <ModalBody title="Telegram Login" modalBodyType="bottom">
      <KeyboardAwareScrollView enableOnAndroid={true} contentContainerStyle={styles.container}>
        {loading && (
          <View style={styles.loadingBox}>
            <Lottie
              source={require('../../assets/lottieFiles/globalLoading.json')}
              style={styles.loadingStyle}
              autoPlay
              loop
            />
          </View>
        )}
        <WebView
          ref={ref as any}
          source={{ uri }}
          originWhitelist={['*']}
          injectedJavaScript={!isIOS ? InjectTelegramOpenJavaScript : undefined}
          javaScriptCanOpenWindowsAutomatically={true}
          onLoadProgress={({ nativeEvent }) => {
            if (nativeEvent.url.includes('telegram.org') && nativeEvent.progress > 0.7) setLoading(false);
          }}
          onMessage={onMessage}
          onLoadEnd={() => {
            ref.current?.injectJavaScript(InjectTelegramLoginJavaScript);
          }}
          onLoadStart={onLoadStart}
        />
      </KeyboardAwareScrollView>
    </ModalBody>
  );
}

const sign = () => {
  Keyboard.dismiss();
  return new Promise<TelegramAuthentication>((resolve, reject) => {
    OverlayModal.show(<TelegramSign onConfirm={resolve} onReject={reject} />, {
      position: 'bottom',
      onDisappearCompleted: () => reject(new Error(USER_CANCELED)),
    });
  });
};

export default {
  sign,
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
});
