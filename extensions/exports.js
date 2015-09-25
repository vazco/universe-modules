/*
 * Following script allows to import variables exported from Meteor packages
 * @example `import {UniCollection, UniUsers} from '{universe:collection}!exports'`
 * @example `import {DDP} from '{ddp}!exports'`
 */

System.set('exports', System.newModule({
    fetch() {
        // we don't need to fetch anything for this to work
        return '';
    },
    instantiate ({name}) {
        return new Promise((resolve, reject) => {
            // grab author and package name
            let [, author, packageName] = /^\/_modules_\/packages\/([\w-]*?)\/([\w-]+)!exports$/.exec(name);
            let fullPackageName = (author ? author + ':' : '') + packageName;

            if (Package[fullPackageName]) {
                // yay we got a package!
                resolve(Package[fullPackageName]);
            } else {
                // there is no such package
                reject(new Error(`[Universe Modules]: Cannot find Meteor package exports for {${fullPackageName}}`));
            }
        });
    }
}));