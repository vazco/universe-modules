Package.describe({
    name: 'universe:modules',
    version: '0.3.0',
    summary: 'Use ES6 / ES2015 modules in Meteor with SystemJS!',
    git: 'https://github.com/vazco/universe-modules',
    documentation: 'README.md'
});

Package.registerBuildPlugin({
    name: 'UniverseModulesBuilder',
    use: ['babel-compiler@5.6.15'],
    sources: ['build-plugin.js']
});

Package.onUse(function (api) {

    api.imply('babel-runtime@0.1.1');

    // we need this for System.js to run on the server side without core changes
    api.addFiles('require-polyfill.js', 'server');

    // Load SystemJS
    api.addFiles([
        'vendor/system-polyfills.js',
        'vendor/system.js',
        'system-config.js'
    ]);

});

Package.onTest(function (api) {
    // @todo: Write some tests
});
