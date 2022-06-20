const { program } = require("commander");
const validatePackageName = require("validate-npm-package-name");
const chalk = require("chalk");
const fs = require("fs-extra");
const path = require("path");
const nodeFs = require("fs");
const inquirer = require("inquirer");
const spawn = require("cross-spawn");
const execSync = require("child_process").execSync;
const os = require('os');

const packageInfo = require("./package.json");

const templatePackageName = "cli";

function cloneTemplateRepo() {
  // 先判断是否已经存在这个文件夹？
  return new Promise((resolve, reject) => {
    try {
      execSync(
        "git clone https://github.com/tanqq1/cli-test.git",
        { stdio: "ignore" }
      );
      resolve();
    } catch (error) {
      reject({ error });
      // 如果抛出异常， 则移除文件，并且退出进程
      process.exit(1)
    }
  });
}

async function fetchTemplateList() {
  console.log(
    `${chalk.green("Query Template List. This might take a while...")}`
  );
  await cloneTemplateRepo();
  const templatePath = path.resolve(templatePackageName, "template");
  if (nodeFs.existsSync(templatePath)) {
    return nodeFs.readdirSync(templatePath);
  }
  return [];
}

/**
 * 1. 校验项目名称
 * 2. 判断当前 是否在一个git仓库下 (没有git init?)
 * 3. clone example repo （给出提示跟进度）
 * 4. 模板选择
 * 5. 对应模板文件复制
 * 6. package.json 中package-name修改
 * 7. 移除 example repo dir
 */
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

async function createPackage(packageName) {
  checkPackageName(packageName);
  const root = path.resolve(packageName);

  // 文件夹如果不存在则创建
  fs.ensureDirSync(packageName);
  process.chdir(root);

  // 这里给一个加载模板的提示
  const list = await fetchTemplateList();
  showInquirer(list).then((template) => {
    try {
      const tempFilePath = path.resolve(templatePackageName, "template", template);
      console.log("tempFilePath", tempFilePath);
      if (fs.existsSync(tempFilePath)) {
        fs.copySync(tempFilePath, root);
      } else {
        console.error(
          `Could not locate supplied template: ${chalk.green(template)}`
        );
        process.exit(1);
        return;
      }

      // 移除template目录
      fs.removeSync(path.resolve(templatePackageName));
      // json文件修改
      const packageJson = require(path.join(root, "package.json"));
      packageJson.name = `@qtrade/${packageName}`;
      fs.writeFileSync(
        path.join(root, "package.json"),
        JSON.stringify(packageJson, null, 2) + os.EOL
      );

      console.log(chalk.green("Package Created Success"));
    } catch (error) {
      console.log(chalk.red("Package Created Failed"), error);
      // 移除整个文件
      fs.removeSync(path.resolve(packageName));
      process.exit(1);
    }
  });
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

function showInquirer(templateList) {
  return inquirer
    .prompt([
      {
        type: "list",
        name: "template",
        message: "which package template do you need?",
        choices: templateList,
      },
    ])
    .then((answers) => {
      console.log("answers", answers);
      return Promise.resolve(answers.template);
    })
    .catch((error) => {
      console.log("error....", error);
    });
}

module.exports = {
  init,
};
