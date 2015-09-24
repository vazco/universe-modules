var handler = function (compileStep) {
    var source = compileStep.read().toString('utf8');
    var outputFile = compileStep.inputPath + '.js';

    var path = compileStep.inputPath.split('.import.');
    var moduleId = path[0];

    if(process.platform === 'win32') {
        // windows support, replace backslashes with forward slashes
        moduleId = moduleId.replace(/\\/g, '/');
    }

    if (compileStep.packageName) {
        // inside package, prefix module
        moduleId = '{' + compileStep.packageName + '}/' + moduleId;
    }

    var extraWhitelist = [
        'es6.modules',
        // @todo make this configurable:
        'es7.decorators',
        'regenerator'
    ];
    if (path[1] === 'jsx') {
        // add support for React in *.import.jsx files
        extraWhitelist.push('react');
    }

    try {
        var result = Babel.transformMeteor(source, {
            sourceMap: true,
            filename: compileStep.pathForSourceMap,
            sourceMapName: compileStep.pathForSourceMap,
            extraWhitelist: extraWhitelist,
            modules: 'system',
            moduleIds: true,
            moduleId: moduleId
        });
    } catch (e) {
        if (e.loc) {
            // Babel error
            compileStep.error({
                message: e.message,
                sourcePath: compileStep.inputPath,
                line: e.loc.line,
                column: e.loc.column
            });
            return;
        } else {
            throw e;
        }
    }

    compileStep.addJavaScript({
        path: outputFile,
        sourcePath: compileStep.inputPath,
        data: result.code,
        sourceMap: JSON.stringify(result.map)
    });
};

Plugin.registerSourceHandler('import.js', handler);
Plugin.registerSourceHandler('import.jsx', handler);
