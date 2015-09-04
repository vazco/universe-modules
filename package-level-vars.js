/**
 * Following script, adds possibility of import of exported variables from packages
 * @example import {UniCollection, UniUsers} from '{vazco:universe-collection}!vars'
 * import {DDP} from '{ddp}!vars'
 */
var packageRegex = /^{\s*([\w-]*?):?([\w-]+)\s*}\s*!vars$/;
var _normalize = System.normalize;

System.normalize = function (name) {
    var packageName;
    if (packageRegex.test(name)) {
        packageName = name.replace(packageRegex, '$1');
        if (Package[packageName]) {
            //Getting access for exported variables by meteor package
            System.registerDynamic(name, [], true, function (require, exports, module) {
                module.exports = Package[packageName];
            });
        }
    }
    return _normalize.apply(this, arguments);
};