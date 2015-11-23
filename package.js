Package.describe({
    name: 'universe:modules',
    version: '0.6.3',
    summary: 'Use ES6 / ES2015 modules in Meteor with SystemJS!',
    git: 'https://github.com/vazco/universe-modules',
    documentation: 'README.md'
});

Package.registerBuildPlugin({
    name: 'compile-universe-modules',
    use: ['universe:modules-compiler@1.0.3'],
    sources: ['plugin.js']
});

Package.onUse(function (api) {
    api.versionsFrom('1.2.0.2');

    // Write ES2015 code inside package itself
    api.use('ecmascript');

    // Use Meteor 1.2 build plugin
    api.use('isobuild:compiler-plugin@1.0.0');

    // Use Meteor-aware Promise polyfill
    api.use('promise');

    // Babel runtime is required for some compiled syntax to work
    api.imply('babel-runtime');

    // We need `require` for System.js to run on the server
    api.addFiles('polyfills/require.js', 'server');

    // Load SystemJS
    api.addFiles([
        'polyfills/URLPolyfill.js',
        'vendor/system.js', // @todo: Use system as a dependency
        'loader.js',
        'extensions/exports.js',
        'extensions/autoLoader.js'
    ]);

});

Package.onTest(function (api) {
    // @todo: Write some tests
});
