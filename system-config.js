// Backup original SystemJS methods
var _System = {
    normalize: System.normalize,
    normalizeSync: System.normalizeSync,
    locate: System.locate,
    fetch: System.fetch,
    translate: System.translate,
    instantiate: System.instantiate
};

// Make `register` the default module format
System.config({
    meta: {
        '*': {
            format: 'register'
        }
    }
});

// Regular expressions for Meteor package import syntax
var appRegex = /^\{}\//;
var packageRegex = /^{([\w-]*?):?([\w-]+)}/;
var packageRegexBC = /^([\w-]+):([\w-]+)/;

/**
 * Convert Meteor package syntax to System.normalize friendly string.
 * The `__author_package/foo` syntax in an internal implementation that is subject to change.
 * You should never rely on it! Instead pass all your module names through System.normalizeSync
 * @param {string} name - unnormalized module name with Meteor package syntax
 * @returns {string} - unnormalized module name without Meteor package syntax
 */
var normalizeMeteorPackageName = function (name) {
    name = name
        .replace(appRegex, '') // {}/foo -> foo
        .replace(packageRegex, '__$1_$2'); // {author:package}/foo -> __author_package/foo

    if(packageRegexBC.test(name)){
        // provide temporary backward compatibility for versions < 0.4 package syntax
        console.warn([
            '[Universe Modules]',
            'You are using deprecated syntax for importing modules from a package.',
            'Instead of', name, 'you should use', name.replace(packageRegexBC, '{$1:$2}')
        ].join(' '));
        return name.replace(packageRegexBC, '__$1_$2'); // author:package/foo -> __author_package/foo
    }
    return name;
};

/*
 * name: the unnormalized module name
 * parentName: the canonical module name for the requesting module
 * parentAddress: the address of the requesting module
 */
System.normalize = function (name, parentName, parentAddress) {

    // Allow foomodule.import syntax in import name (TypeScript support)
    if (name.slice(-7) === '.import') {
        name = name.slice(0, -7);
    }

    // Load original normalize
    return _System.normalize.call(this, normalizeMeteorPackageName(name), parentName, parentAddress);
};

/*
 * name: the unnormalized module name
 * parentName: the canonical module name for the requesting module
 */
System.normalizeSync = function (name, parentName) {
    return _System.normalizeSync.call(this, normalizeMeteorPackageName(name), parentName);
};

/*
 * load.name the canonical module name
 * load.metadata a metadata object that can be used to store
 *   derived metadata for reference in other hooks
 */
//System.locate = function (load) {
//    return _System.locate.call(this, load);
//};

/*
 * load.name: the canonical module name
 * load.address: the URL returned from locate
 * load.metadata: the same metadata object by reference, which
 *   can be modified
 */
System.fetch = function (load) {
    var promise = _System.fetch.call(this, load);

    if (!promise) {
        // not really a promise
        return promise;
    }

    // Add our warning
    return promise.catch(function (err) {
        console.warn('[Universe Modules]: Module ' + load.name.replace(System.baseURL, '') + ' does not exist! You will probably see other errors in the console because of that.');
    });
};

/*
 * load.name
 * load.address
 * load.metadata
 * load.source: the fetched source
 */
//System.translate = function (load) {
//    return _System.translate.call(this, load);
//};

/*
 * load identical to previous hooks, but load.source
 * is now the translated source
 */
//System.instantiate = function (load) {
//    return _System.instantiate.call(this, load);
//};