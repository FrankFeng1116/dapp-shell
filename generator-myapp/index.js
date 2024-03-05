const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.name = args.name;
  }

  writing(){
    console.log('this.name', this.name);
    console.log('this.name', this.prompts);
    this.fs.copyTpl(
      this.templatePath(),
      this.destinationPath(this.name),
      {
        dappUrl: this.dappUrl,
      }
    );
  }
  async prompting() {
    const prompts = [
      {
        type: 'input',
        name: 'dappUrl',
        message: 'Dapp URL:',
        default: 'https://beangotown.com/'
      }
    ];

    const answers =  await this.prompt(prompts);
    // this.name = answers.name;
    this.dappUrl = answers.dappUrl;
  }
};