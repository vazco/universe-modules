// backup original SystemJS methods
var _System = {
    normalize: System.normalize,
    locate: System.locate,
    fetch: System.fetch,
    translate: System.translate,
    instantiate: System.instantiate
};

System.baseURL = 'meteor://';
System.config({
    meta: {
        'meteor://*': {
            format: 'register'
        }
    }
});

/*
 * name: the unnormalized module name
 * parentName: the canonical module name for the requesting module
 * parentAddress: the address of the requesting module
 */
System.normalize = function (name, parentName, parentAddress) {
    // add meteor prefix
    if (name[0] !== '.' && name[0] !== '/' && name.indexOf('://') === -1) {
        name = 'meteor://' + name;
    }

    // allow foomodule.import syntax in import name
    if (name.slice(-7) === '.import') {
        name = name.slice(0, -7);
    }

    // load original normalize
    return _System.normalize.call(this, name, parentName, parentAddress);
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

    if(load.name.slice(0, 9) !== 'meteor://'){
        // not our protocol, ignore
        return promise;
    }

    // show our warning
    return promise.catch(function (err) {
        console.warn('[Universe Modules]: Module ' + load.name.slice(9) + ' does not exist! You will probably see other errors in the console because of that.');
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