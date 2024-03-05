import { Dimensions, Platform } from 'react-native';

// Dimensions,width dp
const deviceWidthDp = Dimensions.get('window').width;

// Design draft width (750px here), unit px
const uiWidthPx = 375;

// px to dp (px in the design draft to dp in rn)
export const pTd = (uiElePx: number) => {
  return Math.round((uiElePx * deviceWidthDp) / uiWidthPx);
};

export const isIOS = Platform.OS === 'ios';
export let screenWidth = Dimensions.get('screen').width;
export let screenHeight = Dimensions.get('screen').height;
export let windowWidth = Dimensions.get('window').width;
