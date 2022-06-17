const spawn = require("cross-spawn");
const execSync = require("child_process").execSync;
const path = require("path")
const fs = require("fs")

function runGit() {
  execSync(
    "git clone https://gitlab.qtrade.com.cn/qtrade-frontend/package-example.git",
    { stdio: "ignore" }
  );
  // const child = spawn(
  //   "git clone https://gitlab.qtrade.com.cn/qtrade-frontend/package-example.git",
  //   [],
  //   { cwd: process.cwd(), stdio: "inherit" }
  // );

  // child.on("close", (code) => {
  //   console.log("code", code);
  // });
}

// runGit();

console.log("-------",path.resolve('package-example','so'))
console.log("fs......",fs.existsSync(path.resolve('package-example','so')))

console.log("readdirSync",fs.readdirSync(path.resolve('package-example','so')))
