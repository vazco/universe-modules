/*
 * Following script allows to import variables exported from Meteor packages
 * @example `import {UniCollection, UniUsers} from '{universe:collection}!exports'`
 * @example `import {DDP} from '{ddp}!exports'`
 */

System.set('exports', System.newModule({
    locate ({name, metadata}) {
        return new Promise((resolve, reject) => {
            let [, dir,, author, packageName] = name.split('/');

            // check if we're in valid namespace
            if (dir !== '_modules_') {
                reject(new Error('[Universe Modules]: trying to get exported values from invalid package: ' + name));
                return;
            }

            // construct package name in Meteor's format
            let meteorPackageName = (author ? author + ':' : '') + packageName;

            if (!Package[meteorPackageName]) {
                // ups, there is no such package
                reject(new Error(`[Universe Modules]: Cannot find Meteor package exports for {${meteorPackageName}}`));
                return;
            }

            // everything is ok, proceed
            metadata.meteorPackageName = meteorPackageName;
            resolve(name);
        });
    },
    fetch () {
        // we don't need to fetch anything for this to work
        return '';
    },
    instantiate ({metadata}) {
        return Package[metadata.meteorPackageName];
    }
}));