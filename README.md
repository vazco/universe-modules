<a href="http://unicms.io"><img src="http://unicms.io/banners/standalone.png" /></a>

# Universe Modules

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Use ES6 / ES2015 modules in Meteor today!](#use-es6--es2015-modules-in-meteor-today)
  - [File extensions and universe:modules-entrypoint package](#file-extensions-and-universemodules-entrypoint-package)
  - [Benefits of modules is Meteor](#benefits-of-modules-is-meteor)
- [Installation](#installation)
- [Usage](#usage)
  - [Complete app example](#complete-app-example)
  - [Basic usage](#basic-usage)
  - [Loading file only on the client or server](#loading-file-only-on-the-client-or-server)
  - [Loading modules from packages](#loading-modules-from-packages)
  - [Loading some package exports](#loading-some-package-exports)
  - [Loading from npm repository](#loading-from-npm-repository)
- [SystemJS API](#systemjs-api)
  - [Setting nice module names](#setting-nice-module-names)
- [Troubleshooting](#troubleshooting)
  - [Module XXX does not exist!](#module-xxx-does-not-exist)
- [About](#about)
  - [Roadmap](#roadmap)
  - [Changelog](#changelog)
  - [Issues](#issues)
  - [Copyright and license](#copyright-and-license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Use ES6 / ES2015 modules in Meteor today!

You can read more about new JavaScript modules and see some examples at [JSModules.io](http://jsmodules.io) or [2ality](http://www.2ality.com/2014/09/es6-modules-final.html)

Files written as modules will be bundled with your Meteor app, but won't get executed until you request them.
This is somewhat similar to `*.import.less` files, that you can include inside normal `*.less` files.

All modules have the same ES6 support as core `ecmascript` package + support for `import`/`export` statements.
`jsx` files have also JSX/React support.

API is compatible with new ES6 modules spec.
Under the hood [Babel.js](https://babeljs.io) and [SystemJS](https://github.com/systemjs/systemjs) take care of everything, so you can use modules today!

*This package adds SystemJS to your project.*

### File extensions and universe:modules-entrypoint package

This package use file extensions `*.import.js` and `*.import.jsx` for compatibility reasons.

By default only files with `.import.js(x)` extension are bundled as modules, all other files are processed as usual.   

If you want to use modules in all `*.js` files check out **[universe:modules-entrypoint](https://github.com/vazco/meteor-universe-modules-entrypoint)**. 

*Entrypoint* package parse all `*.js` files and provide one entry point file to run your application.
Check [docs](https://github.com/vazco/meteor-universe-modules-entrypoint) for more info how to setup modules in this mode. 

### Benefits of modules is Meteor

Universe Modules allows you to write your code in modular way, something that Meteor lacks by default.
You also don't have to worry so much about file loading order.

This is especially useful when working with React - creating lots of new components don't have to pollute global namespace.
Also code is much simpler to reason about, and syntax is more friendly.
 

## Installation

Just add this package to your app:

    meteor add universe:modules

#### Upgrading from 0.4 to 0.5 and higher

Version 0.5 introduced some breaking changes, and most probably your app won't work out of the box.
For more details check CHANGELOG.md

All paths need to be either absolute (starting with `/`, `{}/`, `{author:package}` etc.) or relative (starting with `./`, `../` etc.)

If after upgrade you got error `RangeError: Maximum call stack size exceeded` it can be caused by invalid System's package config.
There is no more need for syntax like:
```
System.config({
    packages: {
        '{me:my-package}': {
            main: 'index',
            format: 'register',
            map: {
                '.': System.normalizeSync('{me:my-package}')
            }
        }
    }
});
```
Instead, index module will be loaded by default if you pass only package name inside brackets, or if you end module name with `/` (you will link to directory and not a file)

## Usage

### Complete app example

New example app is in progress, until then you can check out simple game that is using modules - [source code](https://github.com/MacRusher/ColorWars)

##### Outdated examples

This examples use little outdated (<0.5) version of modules, until updated it could work as a simple reference.
Just remember that right now paths to modules need to be either absolute or relative. Check upgrading guide above for more info.

- Source code: https://github.com/vazco/demo_modules
- Live demo: http://universe-modules-demo.meteor.com

You can also check out great `meteor-react-example` app by [optilude](https://github.com/optilude).

- Source code: https://github.com/optilude/meteor-react-example


### Basic usage

Create file `firstComponent.import.js`:

    export default function (){
      return 'Hello';
    }

and `secondComponent.import.js`:

    export default function (){
      return 'World';
    }

Then you can import and make use of them inside some other file, e.g. `finalComponent.import.js`:

    import first from './firstComponent';
    import second from './secondComponent';
    
    export default function(){
      return first() + ' ' + second() + '!';
    }


If you want to execute this inside Meteor app, you need to use SystemJS API:

Some normal `file.js`:

    System.import('/finalComponent').then(function(module){
    
        // default export is attached as default property
        // all named exports are attached by their name
        var sayHello = module.default;
        
        console.log( sayHello() ); // this will log "Hello World!"
        
    });

This assumes that file `finalComponent.import.js` is inside main app directory.  
If you have it somewhere else you have to provide full path starting with meteor app directory,
e.g. `/client/components/finalComponent`.

Of course you can export anything, not only functions.
When using `modules-entrypoint` package the `.import` part in filenames can be omitted.


### Loading file only on the client or server

Because ES2015 specification won't allow you to write `import` statements inside a condition, you cannot import file selectively only on client or server.

In some cases this could be useful, so we introduced syntax that will allow you to do it.
Just add `@client` or `@server` suffix after module name.
On selected platform this will behave like normal import, on the other platform import will return empty module, so every imported variable will be undefined.

### Loading modules from packages

To load files from packages prefix path with full package name in brackets, e.g:

    import foo from '{author:package}'

This will load `index.import.js(x)` file from package `author:package`.

Of course package `author:package` must be using our modules.

You can also load selected module inside package:

    import foo from '{author:package}/foo'

This will load `foo.import.js(x)` file from package `author:package`.

Inside package paths are absolute to package root.

This syntax was also introduced in Meteor 1.2 to allow importing less/stylus files between packages.

Inside package you can also import files from main app with `{}/foo` syntax. `{}` selects main app.
If you wish you can also import modules from other packages (but you need to have dependencies on them!)

#### Extending babel transformers for package files

In your package.js:

```
api.addFiles('externals.npm.json', ['server', 'client'], {babelWhitelist: ['es7.functionBind']})
```

### Loading some package exports

To load variables exported by some Meteor package, add `!exports` after package name in brackets:

```
import {DDP} from '{ddp}!exports'
import {UniCollection, UniUsers} from '{universe:collection}!exports'
```

Remember that if you want to import from another package, you must have dependency on this package.
These packages don't have to use `universe:modules` for this to work.

### Loading from npm repository

There is extension for this package that adds a possibility of importing from npm repositories.
[universe:modules-npm](https://atmospherejs.com/universe/modules-npm) / [Github repo](https://github.com/vazco/meteor-universe-modules-npm/)

Internally it uses browserify, but it also take care of doubled dependencies which is very important when working with React.

## SystemJS API

Full SystemJS API docs can be found [on their Github repo](https://github.com/systemjs/systemjs/blob/master/docs/system-api.md)

### Setting nice module names

You can map alternative name for a module, but remember that you have to provide normalized name as param:

    // some_config_file.js
    System.config({
        map: {
            myComponent: System.normalizeSync('/normal/path/to/my/component')
        }
    });

    // some_component.import.js
    import myComponent from 'myComponent'; // this will load component from /normal/path/to/my/component

## Troubleshooting

### Module XXX does not exist!

You misspelled import name/path. SystemJS tries to download this file from remote location and fails.

Check if all files are at their location and import paths are OK.

**Unfortunately file loading order is still important!**

You need to be sure that all `XXX.import.js` files you want to use are loaded before executing `System.import('XXX')`.  
This normally isn't a issue as putting them into subdirectory is enough (it doesn't have to be a `lib`!)

You also don't have to worry about this when using `import` inside `*.import.js` files - modules will be loaded correctly regardless of file loading order. 


## About

### Roadmap

- [x] Support `*.js` files 
- [ ] Allow opt-in for other Babel modules (decorators etc) 
- [ ] Support for lazy loading modules on the client instead of bundling them with main Meteor app
- [ ] Full tests coverage

### Changelog

You can find changelog and breaking changes in CHANGELOG.md file.

### Issues

Please report all found issues on [GitHub issue tracker](https://github.com/vazco/universe-modules/issues) 

### Copyright and license

Code and documentation &copy; 2015 [Vazco.eu](http://vazco.eu)
Released under the MIT license. 

This package is part of [Universe](http://unicms.io), a package ecosystem based on [Meteor platform](http://meteor.com) maintained by [Vazco](http://www.vazco.eu).
It works as standalone Meteor package, but you can get much more features when using the whole system.
