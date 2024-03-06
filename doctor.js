#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

function isExpoProject() {
  const currentDir = process.cwd();
  const appJsonPath = path.join(currentDir, 'app.json');
  if (fs.existsSync(appJsonPath)) {
    const appJson = require(appJsonPath);
    if (appJson.expo) {
      return true;
    } else {
      return false;
    }
  } else {
      return false;
  }
}
function checkAndroidEnvironment() {
  const result = {};
  try {
    result.adb = {};
    const output = execSync('adb devices', { encoding: 'utf8' });
    result.adb.hasAdb = true;
    if (!output.includes('No devices/emulators found')) {
      result.adb.devicesConnected = true;
    } else {
      result.devicesConnected = false;
    }
  } catch (error) {
    result.adb.hasAdb = false;
  }
  try {
    // execSync('java -version', { stdio: 'ignore' });
    const output = execSync('java -version 2>&1', { encoding: 'utf8' });
    result.jdk = true;
    const match = output.match(/version "(.*?)"/);
    if (match) {
      result.jdkVersion = match[1];
    }
  } catch (error) {
    result.jdk = false;
  }

  if (!process.env.ANDROID_HOME) {
    result.sdk = false;
  } else {
    result.sdk = true;
  }

  try {
    execSync('gradle -v', { stdio: 'ignore' });
    result.gradle = true;
  } catch (error) {
    result.gradle = false;
  }

  return result;
}

function checkIOSEnvironment() {
  const result = {};

  if (os.type() !== 'Darwin') {
    result.macOS = false;
  } else {
    result.macOS = true;
  }

  try {
    execSync('xcodebuild -version', { stdio: 'ignore' });
    result.xcode = true;
  } catch (error) {
    result.xcode = false;
  }

  try {
    execSync('pod --version', { stdio: 'ignore' });
    result.cocoapods = true;
  } catch (error) {
    result.cocoapods = false;
  }
  try {
    execSync('ruby --version', { stdio: 'ignore' });
    result.ruby = true;
  } catch (error) {
    result.ruby = false;
  }
  try {
    execSync('ios-deploy --version', { stdio: 'ignore' });
    result.iosDeploy = true;
  } catch (error) {
    result.iosDeploy = false;
  }
  return result;
}
function checkRNEnvironment() {
  const result = {};

  try {
    execSync('node -v', { stdio: 'ignore' });
    result.node = true;
  } catch (error) {
    result.node = false;
  }

  try {
    execSync('npm -v', { stdio: 'ignore' });
    result.npm = true;
  } catch (error) {
    result.npm = false;
  }
  try {
    execSync('yarn -v', { stdio: 'ignore' });
    result.yarn = true;
  } catch (error) {
    result.yarn = false;
  }
  try {
    execSync('react-native -v', { stdio: 'ignore' });
    result.reactNativeCLI = true;
  } catch (error) {
    result.reactNativeCLI = false;
  }
  try {
    execSync('watchman -v', { stdio: 'ignore' });
    result.watchman = true;
  } catch (error) {
    result.watchman = false;
  }
  return result;
}
async function runDoctor(){
  const chalk = await import('chalk');
  if(isExpoProject()){
    execSync('react-native doctor', { stdio: 'inherit' });
  } else {
    const result = checkAndroidEnvironment();
    const iOSResult = checkIOSEnvironment();
    const rnResult = checkRNEnvironment();
    console.log('');
    console.log(chalk.default.green('Android:'));
    console.log(chalk.default.green('\r ',result.adb.devicesConnected ? '✓': '✖', result.adb.devicesConnected ? ' Adb - Required to verify if the android device is attached correctly': (result.adb.hasAdb ? ' Adb - No devices and/or emulators connected. Please create emulator with Android Studio or connect Android device.': ' Adb - No Adb')));
    console.log(chalk.default.green('\r ',result.jdk ? '✓': '✖',' JDK - Required to compile Java code', '\n\t\t- Version found: ', result.jdkVersion));
    console.log(chalk.default.green('\r ',result.sdk ? '✓': '✖',' ANDROID_HOME - Environment variable that points to your Android SDK installation'));
    console.log(chalk.default.green('\r ',result.gradle ? '✓': '✖',' Gradlew - Build tool required for Android builds'));
    console.log('');
    console.log(chalk.default.green('iOS:'));
    console.log(chalk.default.green('\r ',iOSResult.xcode ? '✓': '✖',' Xcode - Required for building and installing your app on iOS'));
    console.log(chalk.default.green('\r ',iOSResult.ruby ? '✓': '✖',' Ruby'));
    console.log(chalk.default.green('\r ',iOSResult.cocoapods ? '✓': '✖',' CocoaPods - Required for installing iOS dependencies'));
    console.log(chalk.default.green('\r ',iOSResult.iosDeploy ? '✓': '✖',' ios-deploy - Required for installing your app on a physical device with the CLI'));
    console.log('');
    console.log(chalk.default.green('React Native:'));
    console.log(chalk.default.green('\r ',rnResult.node ? '✓': '✖',' Node.js - Required to execute JavaScript code'));
    console.log(chalk.default.green('\r ',rnResult.npm ? '✓': '✖', ' npm - Required to install NPM dependencies'));
    console.log(chalk.default.green('\r ',rnResult.yarn ? '✓': '✖', ' yarn - Required to install NPM dependencies'));
    console.log(chalk.default.green('\r ',rnResult.reactNativeCLI ? '✓': '✖', ' react-native-cli - Required to develop react native project'));
    console.log(chalk.default.green('\r ',rnResult.watchman ? '✓': '✖', ' Watchman - Used for watching changes in the filesystem when in development mode'));
  }

}
module.exports = {
  runDoctor,
  isExpoProject
};