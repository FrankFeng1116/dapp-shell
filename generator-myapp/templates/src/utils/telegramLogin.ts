import TelegramOverlay from "../component/TelegramOverlay";
import { ILoginHandler } from "./login";

export class TelegramLogin implements ILoginHandler{
  async login(): Promise<string> {
    const telegramSign = TelegramOverlay.sign;
    const info = await telegramSign();
    return info.accessToken;
  }
}