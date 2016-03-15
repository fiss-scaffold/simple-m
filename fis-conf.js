//发布路径设置
fis.set('release',{
    'dir':'output',
    /*'watch':true,
    'live':true,*/
    'clean':false,
    /*'lint':true,*/
    'clear':true
});

var urlPre = '/zt/xxx';
var mergeConfg = {
    '/src/index.html': 'index',
    '/src/page1.html': 'page1',
    '/src/page2.html': 'page2'
};



//添加忽略的文件列表
fis.set('project.ignore', [
    'output/**',
    'node_modules/**',
    '.git/**',
    '.svn/**',
    'package.json',
]);


//package 设置
fis.match('::package', {
    spriter: fis.plugin('csssprites-group', {
        margin: 10,
        layout: 'matrix',
        to: '/pkg/img'
    })
});



//资源预处理
fis.match('*.scss', {
    parser: fis.plugin('node-sass'),
    rExt: '.css',
    useSprite: true,
});
fis.match('*.css', {
    useSprite: true,
});

fis.match('src/(**)', {
    release: '$1',
    useHash: true
});
fis.match('**.html', {
    useHash: false
});

fis.match('src/(test/**)', {
    release: '$1',
    useHash: false
});

fis.match('/src/test/server.conf', {
    release: '/config/server.conf'
});

fis.match('src/js/(lib/**)', {
    release: '/pkg/$1',
    useHash: false
});

fis.match('src/fragment/**', {
    release: false,
});

// css javascript 代码校验
fis.match('*.css', {
    lint: fis.plugin('csslint', {
        ignoreFiles: [],
        rules: {
            "known-properties": 2,
            "empty-rules": 1,
            "duplicate-properties": 2
        }
    })
}).match('*.js', {
    lint: fis.plugin('eslint', {
        ignoreFiles: ['lib/**.js', 'fis-conf.js'],
        rules: {
            "no-underscore-dangle": 0,
            "no-unused-expressions": 1,
            "eol-last": 1,
            "curly": 1,
            "no-unused-vars": 1,
            "no-use-before-define": 2,
            "no-undef": 2,
            "block-scoped-var": 2,
        },
        globals: ['zt']
    })
});

// 调试时的配置
fis.media('debug').match('*.{js,css,scss,png}', {
    useHash: false,
    useSprite: false,
    optimizer: null
});

fis.media('test')
    .set('release.dir','output2')
    .match('::package', {
        postpackager: fis.plugin('loader', {
            allInOne: {
                js: function(filepath) {
                    return '/pkg/' + mergeConfg[filepath] + '.js';
                },
                css: function(filepath) {
                    return '/pkg/' + mergeConfg[filepath] + '.css';
                }
            }
        })
    });
  



// 上线时打包配置
fis.media('prod')
    .match('*.{css,scss}', {
        useHash: false,
        optimizer: fis.plugin('clean-css'),
        domain: 'http://c.58cdn.com.cn' + urlPre
    })
    .match('*.png', {
        useHash: true,
        optimizer: fis.plugin('png-compressor'),
        domain: 'http://j2.58cdn.com.cn' + urlPre
    })
    .match('*.js', {
        // fis-optimizer-uglify-js 插件进行压缩，已内置
        useHash: false,
        optimizer: fis.plugin('uglify-js'),
        domain: 'http://j1.58cdn.com.cn' + urlPre
    })
    .match('lib/*.js', {
        domain: 'http://j1.58cdn.com.cn' + urlPre
    })
    .match('::package', {
        postpackager: fis.plugin('loader', {
            allInOne: {
                js: function(filepath) {
                    return '/pkg/' + mergeConfg[filepath] + '.js';
                },
                css: function(filepath) {
                    return '/pkg/' + mergeConfg[filepath] + '.css';
                }
            }
        })
    });
/* .match('*.html', {
     //invoke fis-optimizer-html-minifier
     optimizer: fis.plugin('html-minifier')
 });*/

//deploy
fis.media('qa').match('*', {
    deploy: fis.plugin('http-push', {
        receiver: 'http://192.168.119.5:8999/receiver',
        to: '/home/fe/webs/fis3_demo' // 注意这个是指的是测试机器的路径，而非本地机器
    })
});
