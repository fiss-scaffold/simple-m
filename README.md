# simple-m

一个基于 fiss 的简单 M 端工程模板。初始化后请替换的你的 README.md 内容。

## 使用方法
### 安装依赖
```bash
# rootdir 是你fis-confi.js所在的目录
cd /rootdir
npm install --registry=https://registry.npm.taobao.org
```
### 打包
```bash
# output是你打包后的文件存放的目录
cd /rootdir
# 打包dev版本
rm -rf ./output #不是必须，为了每次产出都是干净的版本，可以先清空下output目录
fiss release -d ./output

# 打包debug版本
fiss release debug -d ./output

# 打包本地自测版本
fiss release test -d ./output

# 打包上线版本
fiss release prod -d ./output

```

