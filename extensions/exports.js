/**
 * Following script allows to import variables exported from packages
 * @example import {UniCollection, UniUsers} from '{universe:collection}!exports'
 * import {DDP} from '{ddp}!exports'
 */
var packageRegex = /^\/modules\/packages\/([\w-]*?)\/([\w-]+)!exports$/;

const {locate} = System;

System.locate = function (data) {
    console.info('locate', data);
    if (packageRegex.test(data.name)) {
        console.warn('inside', data.name);
        let packageName = data.name.replace(packageRegex, '$1:$2');
        if (Package[packageName]) {
            //Getting access for exported variables by meteor package
            System.registerDynamic(data, [], true, function (require, exports, module) {
                module.exports = Package[packageName];
            });
        }
    }
    return locate.apply(this, arguments);
};