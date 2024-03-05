import TelegramOverlay from "../component/TelegramOverlay";
import { TelegramLogin } from "./telegramLogin";
import appleLoginCall from './applelogin';
import googleLoginCall from './googleLogin';

export interface ILoginHandler{
  login(): Promise<string>;
}

class GoogleLogin implements ILoginHandler {
  async login(): Promise<string> {
    return googleLoginCall();
  }
}

class AppleLogin implements ILoginHandler {
  login(): Promise<string> {
    return appleLoginCall();
  }
}

const googleLogin = new GoogleLogin();
const appleLogin = new AppleLogin();
const telegramLogin = new TelegramLogin();
export { googleLogin, appleLogin, telegramLogin };
