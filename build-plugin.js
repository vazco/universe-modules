class UniverseBabelCompiler extends BabelCompiler {

    processFilesForTarget (inputFiles) {
        inputFiles.forEach(this.processFile);
    }

    processFile (inputFile) {

        // Full contents of the file as a string
        const source = inputFile.getContentsAsString();

        // Relative path of file to the package or app root directory (always uses forward slashes)
        const filePath = inputFile.getPathInPackage();

        // Options from api.addFile
        const fileOptions = inputFile.getFileOptions();

        // Name of the package or null if the file is not in a package.
        const packageName = inputFile.getPackageName();

        // moduleId - Module name (full patch without extension)
        // ext - File extension (either js or jsx)
        let [moduleId, ext] = filePath.split('.import.');

        // prefix module name accordingly
        if (packageName) {
            // inside package
            moduleId = '/_modules_/packages/' + packageName.replace(':', '/') + '/' + moduleId;
        } else {
            // inside main app
            moduleId = '/_modules_/app/' + moduleId;
        }

        const extraWhitelist = [
            'es6.modules',
            // @todo make this configurable:
            'es7.decorators'
        ];

        if (ext === 'jsx') {
            // add support for React in *.import.jsx files
            extraWhitelist.push('react');
        }

        const babelDefaultOptions = Babel.getDefaultOptions(this.extraFeatures);

        const babelOptions = _({}).extend(babelDefaultOptions, {
            sourceMap: true,
            filename: filePath,
            sourceFileName: '/' + filePath,
            sourceMapName: '/' + filePath + '.map',
            modules: 'system',
            moduleIds: true,
            moduleId,
            whitelist: _.union(babelDefaultOptions.whitelist, extraWhitelist)
        });

        try {
            var result = Babel.compile(source, babelOptions);
        } catch (e) {
            if (e.loc) {
                inputFile.error({
                    message: e.message,
                    sourcePath: filePath,
                    line: e.loc.line,
                    column: e.loc.column
                });
                return;
            }
            throw e;
        }

        inputFile.addJavaScript({
            sourcePath: filePath,
            path: filePath,
            data: result.code,
            hash: result.hash,
            sourceMap: result.map,
            bare: !!fileOptions.bare
        });
    }
}

Plugin.registerCompiler({
    extensions: ['import.js', 'import.jsx'],
    filenames: []
}, function () {
    return new UniverseBabelCompiler();
});