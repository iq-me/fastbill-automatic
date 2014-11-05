// Generated on 2014-03-22 using generator-nodeapp 0.0.1
'use strict';

var host = 'localhost';
var serverPorts = {
    client: '3000',
    debug: '5858',
    inspector: '8080'
};

module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        nodemon: {
            debug: {
                options: {
                    file: 'server/index.js',
                    nodeArgs: ['--debug'],
                    ignoredFiles: ['node_modules/**'],
                    env: {
                        PORT: serverPorts.client
                    }
                }
            }
        },
        'node-inspector': {
            debug: {
                options: {
                    'web-port': serverPorts.inspector,
                    'web-host': host,
                    'debug-port': serverPorts.debug,
                    'save-live-edit': true
                }
            }
        },
        open: {
            debug: {
                path: 'http://' + host + ':' + serverPorts.inspector + '/debug?port=' + serverPorts.debug,
                app: 'Safari'
            },
            dev: {
                path: 'http://' + host + ':' + serverPorts.client,
                app: 'Safari'
            }
        },
        wait: {
            postDebug: {
                options: {
                    delay: 100
                }
            }
        },
        concurrent: {
            debug: {
                tasks: ['nodemon:debug', 'node-inspector:debug', 'open:debug', 'wait:postDebug', 'open:dev'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
        mochaTest: {
            test: {
                options: {
                    timeout: 3000,
                    ignoreLeaks: true,
                    ui: 'bdd',
                    reporter: 'spec'
                },
                src: ['test/*.js']
            }
        }
    });

    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-node-inspector');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-wait');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('default', ['concurrent:debug']);
    grunt.registerTask('test', ['mochaTest']);

};

