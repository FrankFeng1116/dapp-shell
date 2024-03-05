import { appleLogin, googleLogin, telegramLogin } from './src/utils/login';

export async function useLogin(type: 'Google'| 'Apple' | 'Telegram' | undefined ) {
  if(type === 'Google'){
    return await googleLogin.login();
  } else if(type === 'Apple'){
    return await appleLogin.login();
  } else if(type === 'Telegram') {
    return await telegramLogin.login();
  }
  throw 'Unsupported login method';
}
