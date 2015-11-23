System.autoLoad = (name, deps, fn) => {
    deps = deps || [];
    deps = deps.map(n => System.normalizeSync(n, name));
    var loadedModules = [];
    var mustWait = false;
    deps.every(mName => {
        const m = System.get(mName);
        if (!m) {
            mustWait = true;
            return false;
        }
        loadedModules.push(m);
    });
    if (mustWait) {
        System.register(name, deps, fn);
        return System.import(name);
    }
    const module = {exports: {}, id: name};
    const exports = module.exports;
    const declaration = fn(exports, module);
    if (!declaration.setters || !declaration.execute) {
        throw new TypeError('Invalid Module form for ' + name);
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
};