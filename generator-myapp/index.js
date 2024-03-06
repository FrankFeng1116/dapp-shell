#!/usr/bin/env node
const Generator = require('yeoman-generator');
module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.appName = args.appName;
    this.rootName = args.rootName;
  }

  writing(){
    this.fs.copyTpl(
      this.templatePath(),
      this.destinationPath(this.rootName),
      {
        dappUrl: this.dappUrl,
        appName: this.appName,
        applicationId: this.applicationId,
        bundleId: this.bundleId,
        googleIosClientId: this.googleIosClientId,
        googleWebClientId: this.googleWebClientId
      }
    );
  }
  async prompting() {
    const prompts = [
      {
        type: 'input',
        name: 'dappUrl',
        message: 'Dapp URL:',
        default: 'https://www.beangotown.com/'
      },
      {
        type: 'input',
        name: 'applicationId',
        message: 'Android ApplicationId:',
        default: 'com.demo.dapp'
      },
      {
        type: 'input',
        name: 'bundleId',
        message: 'iOS BundleId:',
        default: 'com.demo.dapp'
      },
      {
        type: 'input',
        name: 'googleIosClientId',
        message: 'Google iOS Client Id(for google login):',
        default: '183226380326-38oi8hev1fug9js9gpbtdicgqgb81a78.apps.googleusercontent.com'
      },
      {
        type: 'input',
        name: 'googleWebClientId',
        message: 'Google Web Client Id(for google login):',
        default: '183226380326-ei86f6dh7v541u6m8c5karu57g00mu56.apps.googleusercontent.com'
      }
    ];

    const answers =  await this.prompt(prompts);
    // this.name = answers.name;
    this.dappUrl = answers.dappUrl;
    this.applicationId = answers.applicationId;
    this.bundleId = answers.bundleId;
    this.googleIosClientId = answers.googleIosClientId;
    this.googleWebClientId = answers.googleWebClientId;
  }
};