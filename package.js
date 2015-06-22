Package.describe({
    name: 'vazco:universe-modules',
    version: '0.0.1',
    summary: 'Use ES2015 modules in Meteor today!',
    git: 'https://github.com/vazco/universe-modules',
    documentation: 'README.md'
});

Package.registerBuildPlugin({
    name: 'UniverseModulesBuilder',
    use: ['babel-compiler'],
    sources: ['build-plugin.js']
});

Npm.depends({
    'xhr2': '0.1.2'
});

Package.onUse(function (api) {

    // We need XMLHttpRequest on the server side for System.js
    api.addFiles('xhr2.server.js', 'server');

    // Load System.js
    api.addFiles([
        'system-polyfills.js',
        'system.js' // There is a core change in this file! Meteor uses `Npm.require` instead of `require`
    ]);

});

Package.onTest(function (api) {
    // @todo: Write some tests
});
