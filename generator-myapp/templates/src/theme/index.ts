

import { windowHeight } from '../utils/device';
import { isIOS } from '@rneui/base';
import { makeStyles } from '@rneui/themed';
import { pTd } from '../utils/unit';
import gSTyles from '../utils/GStyles';
export const defaultColors = {
  primaryColor: '#5B8EF4',
  bg1: '#ffffff',
  bg2: '#FEF6E7',
  bg3: '#F3E4E4',
  bg4: '#F7F8F9',
  bg5: '#5B8EF4',
  bg6: '#F7F7F9',
  bg7: '#DEE2E8',
  bg8: '#34C759',
  bg9: '#E7F0FC',
  bg10: '#F3E4E4',
  bg11: '#FEF6E7',
  bg12: '#BDD2FB',
  bg13: '#0075FF',
  bg14: '#CEDDFC',
  bg15: 'rgba(104, 170, 253, .2)',
  bg16: '#C5CBD5',
  bg17: '#EA4F45',
  bg18: '#F0F1F4',
  bg19: '#000000',
  bg20: '#515A62',
  bg21: '#FDEDEC',
  bg22: '#F6A037',
  bg23: '#FBD09B',
  bg24: '#E79634',
  bg25: '#DAE8FA',
  bg26: '#E6E8ED',

  font1: '#464B53',
  font2: 'white',
  font3: '#515A62',
  font4: '#5B8EF4',
  font5: '#25272A',
  font6: '#FAAD14',
  font7: '#B6BABF',
  font8: '#252525',
  font9: '#000000',
  font10: '#34C759',
  font11: '#ffffff',
  font12: '#B34B4B',
  font13: '#EA4F45',
  font14: '#FFE4C5',
  font15: '#C6A05A',

  icon1: '#515A62',
  icon2: '#ffffff',

  border1: '#C5CBD5',
  border2: '#F7F8F9',
  border3: '#5B8EF4',
  border4: '#F0F2F5',
  border5: '#F2F4F6',
  border6: '#DEE2E8',
  border7: '#C14247',

  error: '#B34B4B',
  error1: '#FF4D4F',

  shadow1: '#4D4E59',
};

export const getGStyles = () => {
  return {
    container: {
      flex: 1,
      backgroundColor: defaultColors.bg1,
      ...gSTyles.paddingArg(0, 16),
    },
    pwTip: {
      marginTop: 3,
      color: defaultColors.font2,
    },
    safeAreaContainer: {
      paddingBottom: !isIOS ? 20 : undefined,
    },
    overlayStyle: {
      height: windowHeight - pTd(isIOS ? 68 : 100),
    },
  };
};