import queryString   from 'query-string';
import base64 from 'react-native-base64';
export enum TG_FUN {
  LoginCancel = 'tg_loginCancel',
  DeclineRequest = 'tg_declineRequest',
  RequestConfirmation = 'tg_requestConfirmation',
  ConfirmRequest = 'tg_confirmRequest',
  Error = 'tg_error',
  Open = 'tg_open',
}
export const InjectTelegramLoginJavaScript = `(()=>{
  try {
    const tmpConfirmRequest = window.confirmRequest;
    const tmpRequestConfirmation = window.requestConfirmation;
    const tmpDeclineRequest = window.declineRequest;
    const tmpLoginCancel = window.loginCancel;
    window.confirmRequest = (...args)=>{
      tmpConfirmRequest(...args);
      window.ReactNativeWebView.postMessage(JSON.stringify({type:'${TG_FUN.ConfirmRequest}'}));
    }
    window.requestConfirmation = (...args)=>{
      tmpRequestConfirmation(...args);
      window.ReactNativeWebView.postMessage(JSON.stringify({type:'${TG_FUN.RequestConfirmation}'}));
    }
    window.declineRequest = (...args)=>{
      window.ReactNativeWebView.postMessage(JSON.stringify({type:'${TG_FUN.DeclineRequest}'}));
    }
    window.loginCancel = (...args)=>{
      window.ReactNativeWebView.postMessage(JSON.stringify({type:'${TG_FUN.LoginCancel}'}));
    }
  } catch (error) {
    window.ReactNativeWebView.postMessage(JSON.stringify({type:'${TG_FUN.Error}',error}));
  }
})()`;

export const InjectTelegramOpenJavaScript = `(()=>{
  try {
    window.open = (url)=>{
      window.ReactNativeWebView.postMessage(JSON.stringify({url,type:'${TG_FUN.Open}'}));
    }
  } catch (error) {
    window.ReactNativeWebView.postMessage(JSON.stringify({type:'${TG_FUN.Error}'}));
  }
})()`;

export enum PATHS {
  CallPortkey = '/api/app/telegramAuth/receive/portkey',
  Load = '/social-login/Telegram?from=portkey',
}

export const TGAuthResult = '#tgAuthResult=';
export const TGAuthPush = 'oauth.telegram.org/auth/push';

export const TGAuthCallBack = 'auth-callback';

export function parseTGAuthResult(url: string) {
  const tgAuthResult = Buffer.from(url.split(TGAuthResult)[1], 'base64').toString('utf8');
  return queryString.stringify(JSON.parse(tgAuthResult));
}
// export function parseTGAuthResult(url: string) {
//   const tgAuthResult = base64.decode(url.split(TGAuthResult)[1]);
//   console.log('tgAuthResult', tgAuthResult);
//   try {
//     const result = JSON.parse(tgAuthResult);
//     return JSON.stringify(result);
//   } catch (error) {
//     console.error('Invalid JSON:', tgAuthResult);
//     throw error;
//   }
// }
export const TelegramUrl = 'tg://resolve?phone=42777';
