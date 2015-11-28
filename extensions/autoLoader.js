System.autoLoad = (name, deps, fn) => {
    deps = deps || [];
    deps = deps.map(n => System.normalizeSync(n, name));
    var loadedModules = [];
    var mustWait = deps.some(mName => {
        const m = System.get(mName);
        if (!m) {
            mustWait = true;
            return true;
        }
        loadedModules.push(m);
    });

    if (mustWait) {
        System.register(name, deps, fn);
        const p = System.import(name);
        p.catch(console.error.bind(console));
        return p;
    }

    try {
        const exports = {};
        const registerExport = (key, value) => {
            if (typeof  key === 'object') {
                Object.keys(key).forEach((k) => exports[k] = key[k]);
                return;
            }
            exports[key] = value;
        };
        const declaration = fn(registerExport, exports);
        if (!declaration.setters || !declaration.execute) {
            const msg = 'Invalid Module form for ' + name;
            console.error(msg);
            return Promise.reject(new Error(msg));
        }
        declaration.setters.forEach((setFn, index) => {
            setFn(loadedModules[index]);
        });
        const output = declaration.execute.call(this);
        if (output) {
            declaration.exports = output;
        }
        const newModule = System.newModule(exports);
        System.set(name, newModule);
        return Promise.resolve(newModule);
    } catch(err) {
        console.error(err);
        return Promise.reject(err);
    }
};