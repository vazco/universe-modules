Plugin.registerCompiler({
    extensions: ['import.js', 'import.jsx'],
    filenames: []
}, function () {
    return new UniverseModulesCompiler();
});