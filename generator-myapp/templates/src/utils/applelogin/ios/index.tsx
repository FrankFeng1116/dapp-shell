import React from 'react';
import AppleLogin from './AppleLogin';
import OverlayModal from '../../../component/OverlayModal';
import { screenWidth } from '../../unit';

const USER_CANCELED = 'user canceled';

async function appleLogin() {
  return new Promise((resolve, reject) => {
    const key = OverlayModal.show(
      <AppleLogin
        headerComponent={null}
        baseUrl={'https://openlogin.portkey.finance/social-login/Apple'}
        onVerify={token => {
          OverlayModal.hideKey(key);
          resolve(token as string);
        }}
        onExpire={() => {
          reject('expire');
        }}
        onClose={type => {
          OverlayModal.hideKey(key);
          if (type !== 'verified') reject('You closed the prompt without any action.');
        }}
        webViewProps={{
          onLoadEnd: () => {},
          onLoadStart: () => {},
        }}
        onError={error => {
          reject(error);
        }}
      />,
      {
        position: 'bottom',
        onDisappearCompleted: () => reject(new Error(USER_CANCELED)),
      },
    );
  });
}

export default appleLogin;
