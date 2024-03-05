// const { program } = require('commander');
// // program.version('0.0.1') .parse(process.argv);
// program
//   .version('0.0.1')
//   .option('-p, --peppers', 'Add peppers')
//   .option('-P, --pineapple', 'Add pineapple')
//   .option('-b, --bbq-sauce', 'Add bbq sauce')
//   .option('-c, --cheese [type]', 'Add the specified type of cheese', 'marble')
//   .parse(process.argv);
// console.log('program', JSON.stringify(Object.keys(program)));
// console.log('you ordered a pizza with:');
// if (program.peppers) console.log('  - peppers');
// if (program.pineapple) console.log('  - pineapple');
// if (program.bbqSauce) console.log('  - bbq-sauce');
// console.log('  - %s cheese', program.cheese);


// const { program } = require('commander');

// function increaseVerbosity(dummyValue, previous) {
//   console.log('dummyValue',dummyValue);
//   return previous + 1;
// }

// program
//   .option('-d, --debug', 'output extra debugging')
//   .option('-s, --small', 'small pizza size')
//   .option('-p, --pizza-type <type>', 'flavour of pizza')
//   .option('-v, --verbose <a>', 'verbosity that can be increased', increaseVerbosity, 0)
//   .option('-c, --cheese <type>', 'add the specified type of cheese', 'blue');

// program.parse(process.argv);
// const options = program.opts();

// if (options.debug) console.log(options);
// if (options.small) console.log('- small pizza size');
// if (options.pizzaType) console.log(`- ${options.pizzaType}`);
// if (options.cheese)
// console.log(`cheese: ${options.cheese}`);
// if (options.verbose > 0) console.log(`verbosity: ${options.verbose}`);

// const { program } = require('commander');


// 通过绑定处理函数实现命令（这里的指令描述为放在`.command`中）
// 返回新生成的命令（即该子命令）以供继续配置
// program
//   .command('clone <source> [destination]')
//   .description('clone a repository into a newly created directory')
//   .action((source, destination) => {
//     console.log('clone command called', source);
//   });

// 通过独立的的可执行文件实现命令 (注意这里指令描述是作为`.command`的第二个参数)
// 返回最顶层的命令以供继续添加子命令
// const build = program
//   .command('start <service>', 'start named service')
//   .command('stop [service]', 'stop named service, or all if no name supplied');

// // 分别装配命令
// // 返回最顶层的命令以供继续添加子命令
// program
//   .addCommand(build);  
// program.parse(process.argv);
// const chalk = require('chalk');
// console.log(chalk.cyan('⭐️ Hi,welcome to create your project by create-aelf-cli'));




// const { Command } = require('commander');
// const program = new Command();

// const service = new Command('init')
//   .option('-u, --url <value>', 'the source url')
//   .action(async (options) => {
//     const chalk = await import('chalk');
//     console.log(chalk.default.cyan('⭐️ Hi,welcome to create your project by create-dapp-app-cli'));
//     let url = options.url;
//     if (!url) {
//       const inquirer = await import('inquirer');
//       const answers = await inquirer.default.prompt([
//         {
//           type: 'input',
//           name: 'url',
//           message: 'What is the URL?',
//         },
//       ]);
//       url = answers.url;
//     }
//     console.log('URL is', url);
//   });

// program.addCommand(service);

// program.parse(process.argv);
var shell = require('shelljs');
const path = require('path');

var yeoman = require('yeoman-environment');
const Demo = require('./generator-myapp');

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
  const name = answers.root;
  var env = yeoman.createEnv();
  env.register(require.resolve('./generator-myapp'), 'myapp');
  const generator = new Demo({
    name,
    env,
    resolved: require.resolve('./generator-myapp'),
  });
  const cwd = path.join(process.cwd(), name);
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
    });
  });
}
(async () => {
  await runGenerator();
})();