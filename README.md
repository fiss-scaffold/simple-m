# simple-m

一个基于 fiss 的简单 M 端工程模板。

## 适用场景
* 适用于移动端的简单小型项目的开发，利润专题页，运营活动页，项目可能只包含若干个页面，几个js，几个css等
* 不采用模块化来管理你的js的项目

## 采用此模版的项目推荐采用如下代码组织形式
* 把css/js/img都拆分成最小化模块开发
* js采用自执行函数把每一个模块封装在里面，不要暴露全局变量
```js
//你的js应该包含在一个自执行函数里面
;(function() {
    var a = 1;
    console.info('bar.js 业务逻辑代码在这里,%s！', a);
})();
```
* css推荐用scss来开发和管理依赖
* html源码把所有用到的css和js都通过link/script标签引入，最后构建时合成成一个文件
```html
<link rel="stylesheet" type="text/css" href="css/one.css">
<link rel="stylesheet" type="text/css" href="css/another.css">
<link rel="stylesheet" type="text/css" href="css/...css">


<script src="js/busi/foo.js"></script>
<script src="js/busi/bar.js"></script>
   ...
```

## 安装方法
>注意：因为部分插件不支持最新的nodejs，建议**nodejs <= 4.x**

```bash
#首先安装fiss
npm install fiss -g 

#安装本模版
fiss init simple-m

## 另外一种方法
# git clone之后，用npm安装，因为gfw，非常建议使用cnpm来安装，否则某些模块安装不了
git clone https://github.com/fiss-scaffold/simple-m.git

#安装cnpm，如果已经安装跳过此步
npm install cnpm -g

#安装需要的插件
cnpm intall

```

## 打包方法
考虑到开发过程各阶段的需求，本模版的配置文件默认配置好了几种打包方案，分别如下：
### dev (默认打包配置)
dev是默认的打包配置
```bash
# 不带参数，默认用dev配置
fiss release
```

dev（开发阶段）打包时：
 * 不对css/js/img进行合并，一切都是按需加载
 * scss之类的文件会编译成最终产物css等
 * inline内嵌的资源会被自动合并进宿主文件
 * 为了防止缓存，所有资源打包时添加hash值（只用于开发阶段，上线时通过版本系统来控制更新)
 * 打开html/css/js的语法检查提示，当修改文件时，你可以马上得到是否有语法错误的反馈
 * 默认开启文件修改自动刷新浏览器机制，自动刷新浏览器，看到修改后的效果
 * 默认的构建后的文件放在系统默认的输出路径（通过fiss server open查看）

### test (自测环节)
```bash
#打包test配置
fiss release test
```
test（自测环节）打包时在dev配置的基础上增加：
 * 对css/js/img进行合并，对已合并的资源不删除
 * 默认的构建后的文件放在系统默认的输出路径（通过fiss server open查看）

### pre-qa (提交qa测试之前本地确认)
```bash
#打包pre-qa配置
fiss release pre-qa
```
pre-qa(提交qa测试之前本地确认)打包时在test配置的基础上增加：
 * css/js/img进行合并后，`对已合并的资源进行删除`，
 * 默认的构建后的文件放在系统默认的输出路径（通过fiss server open查看）

pre-qa 跟下面的qa的配置*不同的*是没有把所有资源的引用路径换成线上的路径，方便在本地测试下完整的版本。


### qa (提交qa测试的配置)
```bash
#打包qa配置
fiss release qa
```
qa(提交qa测试的配置)打包时在pre-qa配置的基础上增加：
 * 所有资源的引用地址替换domain/url/hash
 * 移除test下面的东西
 * 所有资源发布到publish路径
 * 所有资源不压缩

qa的版本跟prod的区别就是`静态资源没有压缩`，是为了方便qa测试，定位问题，。


### prod (上线打包配置)
```bash
#打包prod配置
fiss release prod
```
prod(上线打包配置)打包时在qa配置的基础上增加：
 * 所有资源压缩

### deploy-ftp (把prod版本部署到ftp服务器)
```bash
#打包deploy-ftp配置
fiss release deploy-ftp
```
deploy-ftp(把prod版本部署到ftp服务器)是把prod版本部署到ftp服务器上，不建议使用，建议在本地测试，只有有必要时才需要这么做。




