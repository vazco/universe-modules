Package.describe({
    name: 'universe:modules',
    version: '0.4.0-rc.1',
    summary: 'Use ES6 / ES2015 modules in Meteor with SystemJS!',
    git: 'https://github.com/vazco/universe-modules',
    documentation: 'README.md'
});

Package.registerBuildPlugin({
    name: 'UniverseModulesBuilder',
    use: ['babel-compiler@5.8.3_1'],
    sources: ['build-plugin.js']
});

Package.onUse(function (api) {

    // Babel runtime is required for some compiled syntax to work
    api.imply('babel-runtime@0.1.2');

    // We need `require` for System.js to run on the server
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
