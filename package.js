Package.describe({
    name: 'universe:modules',
    version: '0.1.0',
    summary: 'Use ES6 / ES2015 modules in Meteor with SystemJS!',
    git: 'https://github.com/vazco/universe-modules',
    documentation: 'README.md'
});

Package.registerBuildPlugin({
    name: 'UniverseModulesBuilder',
    use: ['unofficial:babel-compiler@5.4.7'],
    sources: ['build-plugin.js']
});

Npm.depends({
    'xhr2': '0.1.2'
});

Package.onUse(function (api) {

    // We need XMLHttpRequest on the server side for SystemJS remote fetching (or SystemJS won't run)
    // This may change in near future if we find better way to run SystemJS
    api.addFiles('vendor/xhr2.js', 'server');

    // Load SystemJS
    api.addFiles([
        'vendor/system-polyfills.js',
        'vendor/system.js' // There is a core change in this file! Meteor uses `Npm.require` instead of `require`
    ]);

});

Package.onTest(function (api) {
    // @todo: Write some tests
});
