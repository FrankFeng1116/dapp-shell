import { appleAuthAndroid } from '@invertase/react-native-apple-authentication';
import appleLoginOnIOS from './ios';
import { isIOS } from '../utils';

const appleLogin = async () => {
  if (isIOS) {
    const token = (await appleLoginOnIOS()) as string;
    return token;
  } else {
    return (await appleLoginAndroid());
  }
};

const appleLoginAndroid = async () => {
  appleAuthAndroid.configure({
    clientId: 'com.portkey.did.extension.service',
    redirectUri: 'https://did-portkey.portkey.finance/api/app/AppleAuth/receive',
    scope: appleAuthAndroid.Scope.ALL,
    responseType: appleAuthAndroid.ResponseType.ALL,
  });
  const appleInfo = await appleAuthAndroid.signIn();
  return appleInfo.id_token ?? '';
};

export default appleLogin;