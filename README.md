<a href="http://unicms.io"><img src="http://unicms.io/banners/standalone.png" /></a>

# Universe Modules

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Use ES6 / ES2015 modules in Meteor today!](#use-es6--es2015-modules-in-meteor-today)
  - [Benefits of this approach](#benefits-of-this-approach)
- [Installation](#installation)
- [Usage](#usage)
  - [Complete app example](#complete-app-example)
  - [Basic usage](#basic-usage)
  - [Loading modules from packages](#loading-modules-from-packages)
  - [Loading package-level variables](#user-content-loading-package-level-variables)
  - [Loading from npm repository](#user-content-loading-from-npm-repository)
- [SystemJS API](#systemjs-api)
  - [Setting nice module names](#setting-nice-module-names)
  - [SystemJS packages](#systemjs-packages)
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

**This package add new file extensions:** `*.import.js` and `*.import.jsx`.  
These files will be bundled with your Meteor app, but won't get executed until you request them.
This is somewhat similar to `*.import.less` files, that you can include inside normal `*.less` files.

All `*.import.js` files **have full ES6 support** provided by Meteor's Babel.js implementation.
`*.import.jsx` files also have JSX/React support.

API is compatible with new ES6 modules spec.
Under the hood [Babel.js](https://babeljs.io) and [SystemJS](https://github.com/systemjs/systemjs) take care of everything, so you can use modules today!

*This package adds SystemJS to your project.*

### Benefits of this approach

Universe Modules allows you to write your code in modular way, something that Meteor lacks by default.
You also don't have to worry so much about file loading order.

This is especially useful when working with React - creating lots of new components don't have to pollute global namespace.
Also code is much simpler to reason about, and syntax is more friendly.
 
Code you write inside `*.import.js(x)` is compiled using Babel, so **you can also use other ES2015 features!** 

## Installation

Just add this package to your app:

    meteor add universe:modules


## Usage

### Complete app example

If you want to see it in action, see our todo example app:

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

    System.import('finalComponent').then(function(module){
    
        // default export is attached as default property
        // all named exports are attached by their name
        var sayHello = module.default;
        
        console.log( sayHello() ); // this will log "Hello World!"
        
    });

This assumes that file `finalComponent.import.js` is inside main app directory.  
If you have it somewhere else you have to provide full path relative to meteor app directory,
e.g. `client/components/finalComponent`.


### Loading modules from packages

To load files from packages prefix path with full package name in brackets, e.g:

    import Lib from '{author:package}/lib'
    
This syntax will be also introduced in Meteor 1.2 to allow importing less/stylus files between packages.

Packages can also register nice module names in SystemJS.

An example could be [universe:react-bootstrap](https://atmospherejs.com/universe/react-bootstrap).
Once added to Meteor project, you can write:

    import { Button } from 'bootstrap';

and use components from [ReactBootstrap](https://react-bootstrap.github.io/) packaged for Meteor projects.

### Loading package-level variables
To load exported variables by meteor package, prefix package name like before and add `!vars` on the end(after bracket):

```
import {DDP} from '{ddp}!vars'
import {UniCollection, UniUsers} from '{vazco:universe-collection}!vars'
```
be sure that if you use import from another package, you must have dependency to this package.

### Loading from npm repository
There is extension for this package that adds a possibility of importing from npm repositories.
[universe:modules-npm](https://atmospherejs.com/universe/modules-npm) / [Github repo](https://github.com/vazco/meteor-universe-modules-npm/)

## SystemJS API

Full SystemJS API docs can be found [on their Github repo](https://github.com/systemjs/systemjs/blob/master/docs/system-api.md)

### Setting nice module names

You can map alternative name for a module, but remember that you have to provide normalized name as param:

    // some_config_file.js
    System.config({
        map: {
            myComponent: System.normalizeSync('normal/path/to/my/component')
        }
    });

    // some_component.import.js
    import myComponent from 'myComponent'; // this will load component from normal/path/to/my/component

### SystemJS packages

SystemJS has a packages concept that plays well with Meteor idea of packages.

Example usage from [universe:react-bootstrap](https://atmospherejs.com/universe/react-bootstrap):

    System.config({
        packages: {
            bootstrap: {
                main: 'main',
                format: 'register',
                map: {
                    '.': System.normalizeSync('{universe:react-bootstrap}')
                }
            }
        }
    });

This will map:

- `bootstrap` -> `{universe:react-bootstrap}/main` (main is set as a default by... `main` config option :))
- `bootstrap/foo` -> `{universe:react-bootstrap}/foo`
- `bootstrap/foo/bar` -> `{universe:react-bootstrap}/foo/bar`

etc...

## Troubleshooting

### Module XXX does not exist!

You misspelled import name/path. SystemJS tries to download this file from remote location and fails.

Check if all files are at their location and import paths are OK.

Unfortunately file loading order is still important!

You need to be sure that all `XXX.import.js` files you want to use are loaded before executing `System.import('XXX')`.  
This normally isn't a issue as putting them into subdirectory is enough (it doesn't have to be a `lib`!)

You also don't have to worry about this when using `import` inside `*.import.js` files - modules will be loaded correctly regardless of file loading order. 


## About

### Roadmap

- [ ] Full tests coverage
- [ ] Allow opt-in for other Babel modules (decorators etc) 
- [ ] Support for lazy loading modules on the client instead of bundling them with main Meteor app

### Changelog

You can find changelog in CHANGELOG.md file.

### Issues

Please report all found issues on [GitHub issue tracker](https://github.com/vazco/universe-modules/issues) 

### Copyright and license

Code and documentation &copy; 2015 [Vazco.eu](http://vazco.eu)
Released under the MIT license. 

This package is part of [Universe](http://unicms.io), a package ecosystem based on [Meteor platform](http://meteor.com) maintained by [Vazco](http://www.vazco.eu).
It works as standalone Meteor package, but you can get much more features when using the whole system.
