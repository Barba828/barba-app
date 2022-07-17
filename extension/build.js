/**
 * 暂时先做一个简单的方案
 * 将 build 文件夹下的需要的静态文件粘贴到 extension 中
 */
const path = require("path");
const fs = require("fs");
const fsEx = require("fs-extra");

function copyFile(src, dist) {
  fs.writeFileSync(dist, fs.readFileSync(src));
}

copyFile(
  path.resolve("./build/index.html"),
  path.resolve("./extension/index.html")
);

fsEx.copy(path.resolve("./build/static"), path.resolve("./extension/static"));
