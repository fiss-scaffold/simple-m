// fis 配置文件
// 开发阶段构建配置
fis.media('pro').match('*.{css,js,png,jpg,gif}',{
  // useHash: true,
  release: 'static/$0'
});




// 发布阶段构建配置
fis.match('*.{css,js,png,jpg,gif}',{
  // useHash: true,
  release: 'static/$0'

}).match('*.scss', {
  // parser: fis.plugin('node-sass'),
  rExt: '.css'

}).match('js/*.js', {
  optimizer: fis.plugin('uglify-js')

}).match('css/*.css', {
  optimizer: fis.plugin('clean-css'),
  useSprite: true

}).match('images/*.png', {
  optimizer: fis.plugin('png-compressor')

}).match('::package', {
  spriter: fis.plugin('csssprites'),
  postpackager: fis.plugin('loader', {
    allinone: true
  })

});

// index 发布打包操作
fis.media('proIndex').match('*.{css,scss}', {
  packTo: 'index.pro.css'

}).match('*.js', {
  packTo: 'index.pro.js'

});

// about 发布打包操作
fis.media('proAbout').match('*.{css,scss}', {
  packTo: 'about.pro.css'

}).match('*.js', {
  packTo: 'about.pro.js'

});