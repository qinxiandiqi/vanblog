const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const pkgPath = path.join(__dirname, '../package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

// 解析当前版本
const versionParts = pkg.version.split('-');
const baseVersion = versionParts[0];
let nanVersion = 1;

if (versionParts[1]) {
  const nanMatch = versionParts[1].match(/nan\.(\d+)/);
  if (nanMatch) {
    nanVersion = parseInt(nanMatch[1]) + 1;
  }
}

// 更新版本号
pkg.version = `${baseVersion}-nan.${nanVersion}`;

// 写回package.json
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

console.log(`版本号已更新为: ${pkg.version}`);

// 在文件最后添加：
execSync('git add package.json');
console.log('已暂存package.json版本号变更');