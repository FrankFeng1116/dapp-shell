#!/usr/bin/env node
const { Command } = require('commander');
const { version } = require('./package.json');
const runConfigShow = require('./config');
const { runDoctor } = require('./doctor');
const runGenerator = require('./generator');
const axios = require('axios');
const semver = require('semver');
const program = new Command();
program
  .option('-v, --version', 'output the current version and check for updates')
  .action(async () => {
    const chalk = await import('chalk');
    if (program.opts().version) {
      console.log('Version:', version);
      try {
        const { data } = await axios.get('https://registry.npmjs.org/dapp-shell');
        const latestVersion = data['dist-tags'].latest;
        if (semver.lt(version, latestVersion)) {
          console.log(chalk.default.yellow(`A newer version of dapp-shell is available (${latestVersion}). Please consider upgrading.`));
        } else {
          console.log(chalk.default.green('🎉 You are using the latest version!'));
        }
      } catch (error) {
        console.error('Failed to check for updates:', error);
      }
    }
  });
const service = new Command('init')
  .action(async (options) => {
    const chalk = await import('chalk');
    console.log(chalk.default.cyan('⭐️ Hi,welcome to create your app by dapp-shell'));
    await runGenerator();
  });

const doctor = new Command('doctor')
  .action(async (options) => {
    const chalk = await import('chalk');
    console.log(chalk.default.cyan('🔍 Starting project validation...'));
    runDoctor();
  });

const configShow = new Command('config')
  .action(async (options) => {
    const chalk = await import('chalk');
    console.log(chalk.default.cyan('🔍 Starting project validation...'));
    runConfigShow();
  });
program.addCommand(service).addCommand(doctor).addCommand(configShow).parse(process.argv);


