#!/usr/bin/env node
const { isExpoProject } = require("./doctor");
const path = require('path');
const fs = require('fs');
function searchDappURL() {
  let content = fs.readFileSync(path.join(process.cwd(), 'App.tsx'), 'utf8');
  content = content.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1');
  const regex = /source=\{{uri: '([^']+)'\}\}/;
  const match = content.match(regex);

  return match ? match[1]: undefined;
}
function searchClientId() {
  let content = fs.readFileSync(path.join(process.cwd(), './src/utils/googleLogin.ts'), 'utf8');
  content = content.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1');
  const regex = /(GOOGLE_IOS_CLIENT_ID|GOOGLE_WEB_CLIENT_ID|GOOGLE_ANDROID_CLIENT_ID)\s*:\s*'([^']+)'/g;
  let match;
  let GOOGLE_IOS_CLIENT_ID, GOOGLE_WEB_CLIENT_ID, GOOGLE_ANDROID_CLIENT_ID;
  while ((match = regex.exec(content)) !== null) {
    switch(match[1]) {
      case 'GOOGLE_IOS_CLIENT_ID':
        GOOGLE_IOS_CLIENT_ID = match[2];
        break;
      case 'GOOGLE_WEB_CLIENT_ID':
        GOOGLE_WEB_CLIENT_ID = match[2];
        break;
      case 'GOOGLE_ANDROID_CLIENT_ID':
        GOOGLE_ANDROID_CLIENT_ID = match[2];
        break;
    }
  }
  return {
    GOOGLE_IOS_CLIENT_ID,
    GOOGLE_WEB_CLIENT_ID,
    GOOGLE_ANDROID_CLIENT_ID
  }
}
async function runConfigShow(){
  const chalk = await import('chalk');
  if(isExpoProject()){
    const currentDir = process.cwd();
    const appJsonPath = path.join(currentDir, 'app.json');
    const appJson = require(appJsonPath);
    const {
      expo: {
        name,
        version,
        icon,
        splash: { image },
        ios: { bundleIdentifier },
        android: { package }
      },
      dappUrl,
      googleClientId: {
        ios,
        web
      } = {}
    } = appJson;
    const { GOOGLE_IOS_CLIENT_ID, GOOGLE_WEB_CLIENT_ID } = searchClientId();
    const dappURL = searchDappURL();
    console.log(chalk.default.green('Config:'));
    console.log(chalk.default.green('\r ',' AppName: ', name));
    console.log(chalk.default.green('\r ',' Version: ', version));
    console.log(chalk.default.green('\r ',' Icon Path: ', icon));
    console.log(chalk.default.green('\r ',' Splash Image Path: ', image));
    console.log(chalk.default.green('\r ',' iOS Bundle ID: ', bundleIdentifier));
    console.log(chalk.default.green('\r ',' Android Application ID: ', package));
    console.log(chalk.default.green('\r ',' Dapp URL: ', dappURL ? dappURL: dappUrl));
    console.log(chalk.default.green('\r ',' Google IOS CLIENT ID: ', GOOGLE_IOS_CLIENT_ID ? GOOGLE_IOS_CLIENT_ID: ios));
    console.log(chalk.default.green('\r ',' Google WEB CLIENT ID: ', GOOGLE_WEB_CLIENT_ID ? GOOGLE_WEB_CLIENT_ID: web));
  } else {
    console.log(chalk.default.red('Error: Make sure to run this command in your project directory!'));
  }
}
module.exports = runConfigShow;