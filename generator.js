#!/usr/bin/env node
var shell = require('shelljs');
const path = require('path');
var yeoman = require('yeoman-environment');
const Demo = require('./generator-myapp');
function toCamelCase(str) {
  return str.split(' ').map((word, index) => {
    if (index == 0) {
      return word.toLowerCase();
    }
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join('');
}
async function runGenerator(){
  const inquirer = await import('inquirer');
  const answers = await inquirer.default.prompt([
    {
      type: 'input',
      name: 'root',
      message: 'Project name:',
      default: 'test-project',
    },
  ]);
  const appName = answers.root;
  const rootName = toCamelCase(answers.root);
  var env = yeoman.createEnv();
  env.register(require.resolve('./generator-myapp'), 'myapp');
  const generator = new Demo({
    appName,
    rootName,
    env,
    resolved: require.resolve('./generator-myapp'),
  });
  const cwd = path.join(process.cwd(), rootName);
  generator.run(async () => {
    const chalk = await import('chalk');
    shell.cd(cwd);
    const cmd = shell.which('yarn') ? 'yarn' : 'npm install';
  
    shell.exec(cmd, { cwd }, () => {
      console.log('');
      console.log(chalk.default.green('🎉  Successfully generated your project.'));
      console.log('');
      console.log(chalk.default.cyan('✨ File Generate Done'), cwd);
      console.log('');
      console.log('Next steps:');
      console.log(chalk.default.green('1. cd', cwd, ' - Navigate to the project directory'));
      console.log(chalk.default.green('2. yarn - Install the dependencies(already executed)'));
      console.log(chalk.default.green('3. yarn android - Run the project on Android'));
      console.log(chalk.default.green('4. yarn ios - Run the project on iOS'));
      console.log(chalk.default.green('5. yarn start - Start the project'));
    });
  });
}

module.exports = runGenerator;