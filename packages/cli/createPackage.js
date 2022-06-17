const { program } = require("commander");
const validatePackageName = require("validate-npm-package-name");
const chalk = require("chalk");
const fs = require("fs-extra");
const path = require("path");
const inquirer = require("inquirer");

const packageInfo = require("./package.json");

console.log("version....", packageInfo.version);

// TODO: 下拉选择模板
// TODO:  shouldInit 判断

// npm install
// git add  、 git commit

function init() {
  console.log("这里添加命令并进行处理");
  program
    .version(packageInfo.version)
    .description("create a npm package with template")
    .command("create <package-name>")
    .option("-h, --help", "some help info")
    .action((packageName) => {
      createPackage(packageName);
    });

  program.parse(process.argv);
}

function createPackage(packageName) {
  checkPackageName(packageName);
  showInquirer().then((template) => {
   console.log("------",process.cwd())
  });

  // const root = path.resolve(packageName);
  // const appName = path.basename(root);

  // 文件夹如果不存在则创建
  // fs.ensureDirSync(packageName);
}

function checkPackageName(packageName) {
  const validationResult = validatePackageName(packageName);
  console.log("validateResult", validationResult);
  if (!validationResult.validForNewPackages) {
    console.error(
      chalk.red(
        `Cannot create a npm package named ${chalk.green(
          `"${packageName}"`
        )} because of npm naming restrictions:\n`
      )
    );
    [
      ...(validationResult.errors || []),
      ...(validationResult.warnings || []),
    ].forEach((error) => {
      console.error(chalk.red(`  * ${error}`));
    });
    console.error(chalk.red("\nPlease choose a different package name."));
    process.exit(1);
  }
}

function showInquirer() {
  return inquirer
    .prompt([
      {
        type: "list",
        name: "template",
        message: "which package template do you need?",
        choices: ["js", "ts"],
      },
    ])
    .then((answers) => {
      console.log("answers", answers);
      return Promise.resolve(answers);
    })
    .catch((error) => {
      console.log("error....", error);
    });
}

module.exports = {
  init,
};
