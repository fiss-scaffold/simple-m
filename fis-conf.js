// fis 配置文件

fis
.match('*.{js,css,png,jpeg,gif,jpg}', {
	useHash: true,
	release: 'static/$0'
})
.match('js/*.js', {
  optimizer: fis.plugin('uglify-js')
})
.match('css/*.css', {
  optimizer: fis.plugin('clean-css'),
  useSprite: true
})
.match('images/*.png', {
  optimizer: fis.plugin('png-compressor')
});



// lint
fis.media('lint')
.match('js/*.js', {
  lint: fis.plugin('eslint', {
      env: {
        "browser": true
      },
      ignore: [/*忽略的文件列表*/],
      userEslintrc: false,
      rules: {
        "semi": 2,
        "no-underscore-dangle": 0,
        "no-unused-expressions": 1,
        "eol-last": 1,
        "curly": 1,
        "no-unused-vars": 2,
        "no-use-before-define": 2,
        "no-multi-spaces": 1,
        "no-shadow": 2,
        "dot-notation": 2,
        "no-undef": 2,
        "block-scoped-var": 2,
        "no-empty": 1,
        "quotes": [2, "single", "avoid-escape"]
      }
  })
})
.match('css/*.css', {
  lint: fis.plugin('csslint', {
  	ignore:[/*忽略的文件列表*/],
  	rules: {
      'box-model': 1,
      'known-properties': 2,
      'empty-rules': 1,
      'display-property-grouping': 2,
      'duplicate-properties': 2,

      'adjoining-classes': 0,
      'box-sizing': 0,
      'compatible-vendor-prefixes': 1,
      'gradients': 1,
      'text-indent': 1,
      'vendor-prefix': 1,
      'fallback-colors': 2,
      'star-property-hack': 2,
      'underscore-property-hack': 2,
      'bulletproof-font-face': 0,

      'font-faces': 1,
      'import': 0,
      'regex-selectors': 1,
      'universal-selector': 1,
      'unqualified-attributes': 1,
      'zero-units': 1,
      'overqualified-elements': 1,
      'shorthand': 1,
      'duplicate-background-images': 1,

      'float': 1,
      'font-sizes': 1,
      'ids': 1,
      'important': 1,

      'outline-none': 1,

      'qualified-headings': 1,
      'unique-headings': 1
  	}
  })
});