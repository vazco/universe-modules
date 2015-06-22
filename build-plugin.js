var handler = function (compileStep) {
    var source = compileStep.read().toString('utf8');
    var outputFile = compileStep.inputPath + '.js';

    var ext = compileStep.inputPath.split('.import.');
    var moduleId = ext[0];

    // @todo: add package prefix support

    var extraWhitelist = ['es6.modules'];
    if(ext[1] === 'jsx'){
        extraWhitelist.push('react')
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
