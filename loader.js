// Keep reference to original SystemJS methods
const {
    normalize: originalNormalize,
    normalizeSync: originalNormalizeSync,
    'import': originalImport
    } = System;

// Configure SystemJS to support our modules
System.config({
    meta: {
        '/_modules_/*': {
            format: 'register',
            loader: 'UniverseModulesLoader'
        }
    }
});

// Few useful regular expressions
const appRegex = /^\{}\//;
const packageRegex = /^{([\w-]*?):?([\w-]+)}/;
const onlyPackageRegex = /^{([\w-]*?):?([\w-]+)}$/;
const normalizedRegex = /^\/_modules_\//;
const assetsRegex = /^\/packages\//;
const selectedPlatformRegex = /@(client|server)$/;
const endsWithSlashRegex = /\/$/;


/**
 * Convert Meteor-like friendly module name to real module name.
 * The `/_modules_/packages/abc/xyz/` syntax in an internal implementation that is subject to change!
 * You should never rely on it!
 * @param {string} name - friendly module name with Meteor package syntax
 * @param {string} [parentName] - normalized calling module name
 * @returns {string} - real module name
 */
const normalizeModuleName = function normalizeModuleName (name, parentName) {
    if (name.charAt(0) === '/') {
        // absolute path

        if (normalizedRegex.test(name) || assetsRegex.test(name)) {
            // already normalized name or meteor asset, leave it as is
            return name;
        }

        name = name.replace(endsWithSlashRegex, '/index'); // if name is a directory then load index module

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
            }

            // invalid type
            throw new Error(`[Universe Modules]: Cannot determine parent when loading module from absolute path: ${name} - ${parentName}`);

        } else {
            // no parent provided, treat it as an app module, default behaviour
            return '/_modules_/app' + name;

        }

    } else if (name.charAt(0) === '{') {
        // Meteor syntax

        return name
            // main app file
            .replace(appRegex, '/_modules_/app/') // {}/foo -> /_modules_/app/foo

            // only package name, import index file
            .replace(onlyPackageRegex, '/_modules_/packages/$1/$2/index') // {author:package} -> /_modules_/packages/author/package/index

            // package file
            .replace(packageRegex, '/_modules_/packages/$1/$2') // {author:package}/foo -> /_modules_/packages/author/package/foo

            // link to index if a directory
            .replace(endsWithSlashRegex, '/index'); // /_modules_/packages/author/package/foo/ -> /_modules_/packages/author/package/foo/index

    } else {
        // Other syntax, maybe relative path, leave it as is
        return name;
    }
};


/* Add default error reporting to System.import */
System.import = function (...args) {
    return originalImport.call(this, ...args).catch(console.error.bind(console));
};

/*
 * Overwrite SystemJS normalize with our method
 *
 * normalize : (string, NormalizedModuleName, ModuleAddress) -> Promise<stringable>
 *
 * name: the unnormalized module name
 * parentName: the canonical module name for the requesting module
 * parentAddress: the address of the requesting module
 */
System.normalize = function (name, parentName, parentAddress) {
    if (selectedPlatformRegex.test(name)) {
        // load module only on selected platform
        let [, platform] = selectedPlatformRegex.exec(name);

        if ((Meteor.isServer && platform === 'server') || (Meteor.isClient && platform === 'client')) {
            // correct platform
            name = name.replace(selectedPlatformRegex, '');
        } else {
            // wrong platform, return empty module
            return 'emptyModule';
        }

    }

    return originalNormalize.call(this, normalizeModuleName(name, parentName), parentName, parentAddress);
};

/*
 * Overwrite SystemJS normalizeSync with our method
 *
 * name: the unnormalized module name
 * parentName: the canonical module name for the requesting module
 */
System.normalizeSync = function (name, parentName) {
    return originalNormalizeSync.call(this, normalizeModuleName(name, parentName), parentName);
};


// Our custom loader
/* globals UniverseModulesLoader:true */
UniverseModulesLoader = System.newModule({
    /*
     * locate : ({ name: NormalizedModuleName,
     *             metadata: object })
     *       -> Promise<ModuleAddress>
     *
     * load.name the canonical module name
     * load.metadata a metadata object that can be used to store
     *   derived metadata for reference in other hooks
     */
    //locate (load) {},

    /*
     * fetch : ({ name: NormalizedModuleName,
     *            address: ModuleAddress,
     *            metadata: object })
     *      -> Promise<ModuleSource>
     *
     * load.name: the canonical module name
     * load.address: the URL returned from locate
     * load.metadata: the same metadata object by reference, which can be modified
     */
    fetch (load) {
        // Fetch will only occur when there is no such module.
        // Because we do not support lazy loading yet, this means that module name is invalid.
        return Promise.reject(`[Universe Modules]: Trying to load module "${load.name.replace(/\/_modules_\/[^\/]*/, '')}" that doesn't exist!`);
    }

    /*
     * translate : ({ name: NormalizedModuleName?,
     *                address: ModuleAddress?,
     *                source: ModuleSource,
     *                metadata: object })
     *          -> Promise<string>
     *
     * load.name
     * load.address
     * load.metadata
     * load.source: the fetched source
     */
    //translate (load) {},

    /*
     * instantiate : ({ name: NormalizedModuleName?,
     *                  address: ModuleAddress?,
     *                  source: ModuleSource,
     *                  metadata: object })
     *            -> Promise<ModuleFactory?>
     *
     * load identical to previous hooks, but load.source
     * is now the translated source
     */
    //instantiate (load) {}
});

// Register our loader
System.set('UniverseModulesLoader', UniverseModulesLoader);

// Register empty module
System.set('emptyModule', System.newModule({}));
