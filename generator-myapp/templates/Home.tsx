import WebView, { WebViewMessageEvent, WebViewProps } from 'react-native-webview';
import React, { useCallback, useEffect, useState } from 'react';
import { useNetInfo } from "@react-native-community/netinfo";
import { StyleSheet, View } from 'react-native';
import { useLogin } from './hook';

const injectedJavaScript = `
(function clientMethod() {
  var portkeyShellApp = {
      __GLOBAL_FUNC_INDEX__: 0,
      invokeClientMethod: function (request, callback) {
          const {type, params} = request;
          var callbackName;
          if (typeof callback === 'function') {
              callbackName = '__CALLBACK__' + (portkeyShellApp.__GLOBAL_FUNC_INDEX__++);
              portkeyShellApp[callbackName] = callback;
          }
          window.ReactNativeWebView.postMessage(JSON.stringify({type, params, callback: callbackName }));
      },
      invokeWebMethod: function (callback, args) {
          if (typeof callback==='string') {
              var func = portkeyShellApp[callback];
              if (typeof func === 'function') {
                  setTimeout(function () {
                      func.call(this, args);
                  }, 0);
              }
          }
      },
  };
  window.portkeyShellApp = portkeyShellApp;
  window.webviewCallback = function(data) {
      console.log('webviewCallback', data);
      window.portkeyShellApp['invokeWebMethod'](data.callback, data.args);
  };
})();true;
`;

interface CommonWebViewProps extends WebViewProps {
  width?: number;
  height?: number;
  wallet?: any;
  aelfInstance?: any;
}

const CommonWebView: React.FC<CommonWebViewProps> = props => {
  const {
    width = '100%',
    height = '100%',
    source = { uri: 'http://localhost:3000' },
  } = props;
  const webViewRef = React.useRef<WebView>(null);
  const [loadSuccess, setLoadSuccess] = useState(false);
  const { type, isConnected } = useNetInfo();
  useEffect(() => {
    if (!isConnected) return;
    if (loadSuccess) return;
    webViewRef?.current?.reload();
  }, [type, isConnected]);
  const handleMessage = useCallback(
    async (content: WebViewMessageEvent) => {
      console.log('from webview msg is:', JSON.stringify(content.nativeEvent.data));
      const payload = JSON.parse(content.nativeEvent.data) as IRequest<ILoginParams>;
      try {
        if(payload.type === 'login'){
          const token  = await useLogin(payload.params?.type)
          const args: IResponse<ILoginResponse> = {
            status: 1,
            data: { token },
          }
          const callbackData = {callback: payload.callback, args};
          console.log('return to webview msg is:', JSON.stringify(callbackData));
          webViewRef.current?.injectJavaScript(`window.webviewCallback(${JSON.stringify(callbackData)})`)
        }
      } catch (err: any) {
        console.warn(err.toString());
        const args: IResponse<ILoginResponse> = {
          status: 0,
          msg: err.toString(),
        }
        const callbackData = {callback: payload.callback, args};
        console.log('return to webview msg is:', JSON.stringify(callbackData));
        webViewRef.current?.injectJavaScript(`window.webviewCallback(${JSON.stringify(callbackData)})`)
      }
    },
    [],
  );

  return (
    <View style={styles.sectionContainer}>
      <MemoizedWebView
        ref={webViewRef}
        source={source}
        onLoadEnd={(event)=>{
          if (Boolean(event?.nativeEvent?.url)) {
            setLoadSuccess(true);
          }
        }}
        style={{ height: height, width: width }}
        onMessage={handleMessage}
        {...props}
        injectedJavaScript={injectedJavaScript}
      />
    </View>
  );
};
const MemoizedWebView = React.memo(WebView, ()=>true);
export default CommonWebView;

const styles = StyleSheet.create({
  sectionContainer: {
    height: '100%',
    width: '100%',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
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
});
