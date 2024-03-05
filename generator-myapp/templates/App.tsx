import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView } from 'react-native';
import CommonWebView from './Home';
import { useFonts } from 'expo-font';
global.Buffer = require('buffer').Buffer;

export default function App() {
  useFonts({
    'Roboto-Regular': require('./src/assets/fonts/Roboto-Regular.ttf'),
    'Roboto-Medium': require('./src/assets/fonts/Roboto-Medium.ttf'),
  });
  return (
    <SafeAreaView style={styles.container}>
      {/* <CommonWebView source={{uri: 'http://192.168.11.13:3000/sign'}}/> */}
      <CommonWebView source={{uri: '<%= dappUrl %>'}}/>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: '100%',
    width: '100%',
  },
});
