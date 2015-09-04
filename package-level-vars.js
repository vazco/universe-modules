/**
 * Following script, adds possibility of import of exported variables from packages
 * @example import {UniCollection, UniUsers} from 'packages/vazco:universe-collection'
 * import {DDP} from 'packages/ddp'
 */

//pass: packages:ddp & packages/universe:collection
var packageRegex = /^packages\/((?:[\w-]+$)|(?:[\w-]+:[\w-]+$))/;
var _normalize = System.normalize;

System.normalize = function (name) {
    var packageName;
    if (packageRegex.test(name)) {
        packageName = name.replace('packages/', '');
        if (Package[packageName]) {
            //Getting access for exported variables by meteor package
            System.registerDynamic(name, [], true, function (require, exports, module) {
                module.exports = Package[packageName];
            });
        }
    }
    return _normalize.apply(this, arguments);
};