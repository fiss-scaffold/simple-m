//发布路径设置
fis.set('release', {
    'dir': 'output',
    /*'watch':true,
    'live':true,*/
    'clean': false,
    /*'lint':true,*/
    'clear': true
});

var urlPre = '/zt/xxx';
var mergeConfg = {
    '/src/index.html': 'index',
    '/src/page1.html': 'page1',
    '/src/page2.html': 'page2'
};

fis.set('project.files', [
    'src/**'
]);


//添加忽略的文件列表
/*fis.set('project.ignore', [
    'output/**',
    'node_modules/**',
    '.git/**',
    '.svn/**',
    'package.json',
]);*/


//package 设置
fis.match('::package', {
    spriter: fis.plugin('csssprites-plus', {
        margin: 10,
        layout: 'matrix',
        to: '/img'
    })
});



//资源预处理
fis.match('*.scss', {
    parser: fis.plugin('node-sass-x'),
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
    //release: '/pkg/$1',
    useHash: false
});

fis.match('src/fragment/**', {
    release: false,
});

//------------------------------------代码校验BEGIN----------------------------

fis
//html 校验
.match('*.html', {
    lint: fis.plugin('html-hint', {
        // HTMLHint Options
        ignoreFiles: [],
        rules: {
            "tag-pair": true,
            "doctype-first": true,
            "spec-char-escape": true,
            "id-unique": true,
        }
    })
})
// css 校验
.match('*.css', {
    lint: fis.plugin('csslint', {
        ignoreFiles: [],
        rules: {
            "known-properties": 2,
            "empty-rules": 1,
            "duplicate-properties": 2
        }
    })
})
//js 校验
.match('*.js', {
    lint: fis.plugin('eslint', {
        ignoreFiles: ['lib/**.js', 'fis-conf.js', 'test/**.js'],
        rules: {
            "no-unused-expressions": 1,
            "no-unused-vars": 1,
            "no-use-before-define": 2,
            "no-undef": 2,
        },
        //envs:[],
        globals: [
            'zt',
        ]
    })
});
//------------------------------------代码校验END----------------------------


// 调试时的配置
fis.media('debug').match('*.{js,css,scss,png}', {
    useHash: false,
    useSprite: false,
    optimizer: null
});

fis.media('test')
    .match('{test/*,config/*}', {
        release: false
    })
    .set('release.dir', 'output2')
    .match('*.{js,css,scss,png}', {
        useHash: false,
    })
    .match('::package', {
        postpackager: fis.plugin('loader-x', {
            allInOne: {
                js: function(filepath) {
                    return '/js/' + mergeConfg[filepath] + '.js';
                },
                css: function(filepath) {
                    return '/css/' + mergeConfg[filepath] + '.css';
                }
            }
        })
    })
     .match('*', {
        deploy: [
            fis.plugin('skip-packed', {
                // 配置项
                //ignore:[]
            }),
           /* fis.plugin('local-deliver', {
              to: '/publish/'
            }),*/
            fis.plugin('ftp-x', {
                //'console':true,
                remoteDir : '/static.58.com/zt/xxx/',
                exclude:['/img/'],
                connect : {
                    host : '192.168.119.5',
                    port : '21',
                    user : 'qatest',
                    password : 'ftp@fe'
                }
            }),
            fis.plugin('ftp-x', {
                //'console':true,
                remoteDir : '/pic2.58.com/zt/xxx/',
                include:['/img/'],
                connect : {
                    host : '192.168.119.5',
                    port : '21',
                    user : 'qatest',
                    password : 'ftp@fe'
                }
            })
        ]
    });





// 上线时打包配置
fis.media('prod')
    .match('{test/*,config/*}', {
        release: false
    })
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
        postpackager: fis.plugin('loader-x', {
            allInOne: {
                js: function(filepath) {
                    return '/js/' + mergeConfg[filepath] + '.js';
                },
                css: function(filepath) {
                    return '/css/' + mergeConfg[filepath] + '.css';
                }
            }
        })
    })
    .match('**', {
      deploy: [
        fis.plugin('skip-packed', {
          // 配置项
        }),

        fis.plugin('local-deliver', {
          to: 'publish'
        })
      ]
    })
/* .match('*.html', {
     //invoke fis-optimizer-html-minifier
     optimizer: fis.plugin('html-minifier')
 });*/



