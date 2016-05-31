//发布路径设置
fis.set('release', {
    //'dir': 'output',
    'watch': true,
    'live': true,
    'clean': false,
    'lint': true,
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

/**
 * 开发阶段(dev)打包配置
 * 不对css/js/img进行合并，一切都是按需加载
 * 为了防止缓存，所有资源打包时添加hash值（只用于开发阶段，上线时通过版本系统来控制更新)
 * 打开html/css/js的语法检查提示
 * 默认开启文件修改自动刷新浏览器机制
 * 默认的构建后的文件放在系统默认的输出路径（通过fiss server open查看）
 */

//资源预处理
//通用资源处理
fis.match('src/(**)', {
    release: '$1',
    useHash: true
});

fis.match('**.html', {
    useHash: false
});

//特殊路径下的资源处理
fis.match('src/(test/**)', {
    useHash: false
});

fis.match('scss/(*.scss)', {
    parser: fis.plugin('node-sass-x'),
    rExt: '.css',
    release:'/css/$1'
});

fis.match('/src/test/server.conf', {
    release: '/config/server.conf'
});

fis.match('src/js/(lib/**)', {
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
            globals: [ //这里配置你自己的全局变量
                'zt',
            ]
        })
    });
//------------------------------------代码校验END----------------------------

/**
 * 自测(test)打包配置
 * 对css/js/img进行合并，对已合并的资源不删除
 * 默认的构建后的文件放在系统默认的输出路径（通过fiss server open查看）
 */
fis.media('test')
    .match('*.{css,scss}', {
        useSprite: true,
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
    });

/**
 * 预提测(pre-qa)打包配置，在本地能进行完整的测试，保留模拟配置，提测前最后的检查
 * 对css/js/img进行合并，对已合并的资源进行删除，
 * 默认的构建后的文件放在系统默认的输出路径（通过fiss server open查看）
 */

fis.media('pre-qa')
    .match('src/(**)', {
        useHash:false
    })
    .match('*.{css,scss}', {
        useSprite: true,
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
            }),
            //发布到output目录
            fis.plugin('local-deliver', {
                to: 'preview'
            })
        ]
    });

/**
 * 提测(qa)打包配置，除了资源不压缩，其他跟prod一样
 * 对css/js/img进行合并，对已合并的资源进行删除
 * 所有资源的引用地址替换domain/url/hash
 * 移除test下面的东西
 * 所有资源发布到publish路径
 * 所有资源不压缩
 */
fis.media('qa')
    .set('release', {
        //'dir': 'output',
        'watch': false,
        'live': false,
        'clean': false,
        'lint': true,
        'clear': true
    })
    .match('{test/*,config/*}', {
        release: false
    })
    .match('*.{css,scss}', {
        useSprite: true,
        useHash:false,
        domain: 'http://c.58cdn.com.cn' + urlPre
    })
    .match('*{.png,.jpg,.gif}', {
        useHash: true,
        domain: 'http://j2.58cdn.com.cn' + urlPre
    })
    .match('*.js', {
        useHash:false,
        domain: 'http://j1.58cdn.com.cn' + urlPre
    })
    .match('lib/*.js', {
        useHash:false,
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
            //发布到output目录
            fis.plugin('local-deliver', {
                to: 'publish'
            })
        ]
    });

/**
 * 上线(prod)打包配置
 * 对css/js/img进行合并，对已合并的资源进行删除
 * 所有资源的引用地址替换domain/url/hash
 * 移除test下面的东西
 * 所有资源发布到publish路径
 * 所有资源压缩
 */
fis.media('prod')
    .set('release', {
        //'dir': 'output',
        'watch': false,
        'live': false,
        'clean': false,
        'lint': true,
        'clear': true
    })
    .match('{test/*,config/*}', {
        release: false
    })
    .match('*.{css,scss}', {
        useHash:false,
        useSprite: true,
        optimizer: fis.plugin('clean-css'),
        domain: 'http://c.58cdn.com.cn' + urlPre
    })
    .match('*{.png,.jpg,.gif}', {
        useHash: true,
        domain: 'http://j2.58cdn.com.cn' + urlPre
    })
    .match('*.png', {
        optimizer: fis.plugin('png-compressor'),
    })
    .match('*.js', {
        // fis-optimizer-uglify-js 插件进行压缩，已内置
        useHash: false,
        optimizer: fis.plugin('uglify-js'),
        domain: 'http://j1.58cdn.com.cn' + urlPre
    })
    .match('lib/*.js', {
        useHash:false,
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
         //需要自己安装fis-optimizer-html-minifier插件
         optimizer: fis.plugin('html-minifier')
     });*/

/**
 * 上线(deploy-ftp)配置，并部署到ftp服务器
 * 对css/js/img进行合并，对已合并的资源进行删除
 * 所有资源的引用地址替换domain/url/hash
 * 移除test下面的东西
 * 所有资源压缩
 * 所有资源发布到ftp
 */
fis.media('deploy-ftp')
    .set('release', {
        //'dir': 'output',
        'watch': false,
        'live': false,
        'clean': false,
        'lint': true,
        'clear': true
    })
    .match('{test/*,config/*}', {
        release: false
    })
    .match('*.{css,scss}', {
        useHash:false,
        useSprite: true,
        optimizer: fis.plugin('clean-css'),
        domain: 'http://c.58cdn.com.cn' + urlPre
    })
    .match('*{.png,.jpg,.gif}', {
        useHash: true,
        domain: 'http://j2.58cdn.com.cn' + urlPre
    })
    .match('*.png', {
        optimizer: fis.plugin('png-compressor'),
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
    /* .match('*.html', {
         //需要自己安装fis-optimizer-html-minifier插件
         optimizer: fis.plugin('html-minifier')
     });*/
    .match('*', {
        deploy: [
            fis.plugin('skip-packed', {
                // 配置项
                //ignore:[]
            }),
            fis.plugin('ftp-x', {
                //'console':true,
                remoteDir: '/static.58.com/zt/xxx/',
                exclude: ['/img/'],
                connect: {
                    host: '192.168.*',
                    port: '21',
                    user: 'xxx',
                    password: 'xxx'
                }
            }),
            fis.plugin('ftp-x', {
                //'console':true,
                remoteDir: '/pic2.58.com/zt/xxx/',
                include: ['/img/'],
                connect: {
                    host: '192.168.*',
                    port: '21',
                    user: 'xxx',
                    password: 'xxx'
                }
            })
        ]
    });







