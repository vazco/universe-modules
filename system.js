// Keep reference to original SystemJS methods
const {
    normalize,
    normalizeSync,
    locate,
    fetch,
    translate,
    instantiate,
    'import': importFn
    } = System;

// Make `register` the default module format
System.config({
    meta: {
        '/_modules_/*': {
            format: 'register'
        }
    }
});

// Regular expressions for Meteor package import syntax
const appRegex = /^\{}\//;
const packageRegex = /^{([\w-]*?):?([\w-]+)}/;
const normalizedRegex = /^\/_modules_\//;

/**
 * Convert Meteor-like friendly module name to real module name.
 * The `/_modules_/packages/abc/xyz/` syntax in an internal implementation that is subject to change!
 * You should never rely on it! Instead pass all your module names through System.normalizeSync
 * @param {string} name - friendly module name with Meteor package syntax
 * @returns {string} - real module name
 */
const convertMeteorModuleName = function convertMeteorModuleName (name, parentName) {
    if (name.charAt(0) === '/') {
        // absolute path

        if (normalizedRegex.test(name)) {
            // already normalized name, leave it as is
            return name;
        }

        if (parentName) {

            let [, dir, type, author, packageName] = parentName.split('/');

            if (dir !== '_modules_') {
                // invalid parent name, not our module!
                throw new Error(`[Universe Modules]: Invalid parent while loading module from absolute path: ${name} - ${parentName}`);
            }
            if (type === 'app') {
                // inside app
                return '/_modules_/app' + name;
            } else if (type === 'packages') {
                // inside a package
                return `/_modules_/packages/${author}/${packageName}${name}`;
            } else {
                // invalid type
                throw new Error(`[Universe Modules]: Cannot determine parent when loading module from absolute path: ${name} - ${parentName}`);
            }

        } else {
            // no parent provided, treat it as an app module, default behaviour
            return '/_modules_/app' + name;

        }

    } else if (name.charAt(0) === '{') {
        // Meteor syntax

        return name
            // main app file
            .replace(appRegex, '/_modules_/app/') // {}/foo -> /_modules_/app/foo
            // package file
            .replace(packageRegex, '/_modules_/packages/$1/$2'); // {author:package}/foo -> /_modules_/packages/author/package/foo

    } else {
        // Other syntax, maybe relative path, leave it as is
        return name;
    }
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
    return normalize.call(this, convertMeteorModuleName(name, parentName), parentName, parentAddress);
};

/*
 * name: the unnormalized module name
 * parentName: the canonical module name for the requesting module
 */
System.normalizeSync = function (name, parentName) {
    return normalizeSync.call(this, convertMeteorModuleName(name, parentName), parentName);
};

/*
 * load.name the canonical module name
 * load.metadata a metadata object that can be used to store
 *   derived metadata for reference in other hooks
 */
//System.locate = function (load) {
//    return locate.call(this, load);
//};

/*
 * load.name: the canonical module name
 * load.address: the URL returned from locate
 * load.metadata: the same metadata object by reference, which
 *   can be modified
 */
System.fetch = function (load) {
    return new Promise((resolve, reject) => {
        var response = fetch.call(this, load);

        if (response instanceof Promise) {
            // we got a promise, so there must be some fetching in progress

            response.then(resolve, err => {
                // in case of error show our message
                reject(new Error(`[Universe Modules]: There was an error while fetching module "${load.name.replace(/\/_modules_\/[^\/]*/, '')}". Are you sure that this module exists? Expand for more info:\n\tOriginal error: ${err}`));
            })

        } else {
            // not a promise, return what we got
            resolve(response);
        }
    });
};

/*
 * load.name
 * load.address
 * load.metadata
 * load.source: the fetched source
 */
//System.translate = function (load) {
//    return translate.call(this, load);
//};

/*
 * load identical to previous hooks, but load.source
 * is now the translated source
 */
//System.instantiate = function (load) {
//    return instantiate.call(this, load);
//};

/*
 * Wrap system.import and add default error reporting
 */
System.import = function (...args) {
    return importFn.call(this, ...args).catch(console.error.bind(console));
};