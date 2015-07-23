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

/**
 * Convert author:package/module to author_package/module
 * @param {string} name - unnormalized module name with colon
 * @returns {string} - unnormalized module name without unnecessary colon
 */
var normalizeMeteorPackageName = function (name) {
    // @todo replace this with a regexp
    return name.replace(':', '_');
};

/*
 * name: the unnormalized module name
 * parentName: the canonical module name for the requesting module
 * parentAddress: the address of the requesting module
 */
System.normalize = function (name, parentName, parentAddress) {

    // Remove colon from package name
    name = normalizeMeteorPackageName(name);

    // Allow foomodule.import syntax in import name (TypeScript support)
    if (name.slice(-7) === '.import') {
        name = name.slice(0, -7);
    }

    // Load original normalize
    return _System.normalize.call(this, name, parentName, parentAddress);
};

/*
 * name: the unnormalized module name
 * parentName: the canonical module name for the requesting module
 * parentAddress: the address of the requesting module
 */
System.normalizeSync = function (name, parentName, parentAddress) {
    return _System.normalizeSync.call(this, normalizeMeteorPackageName(name), parentName, parentAddress);
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