# Universe Modules

### Use ES6 / ES2015 modules in Meteor today!

You can read more about new JavaScript modules and see some examples at [JSModules.io](http://jsmodules.io) or [2ality](http://www.2ality.com/2014/09/es6-modules-final.html)

**This package add new file extensions:** `*.import.js` and `*.import.jsx`.  
These files will be bundled with your Meteor app, but won't get executed until you request them.
This is somewhat similar to `*.import.less` files, that you can include inside normal `*.less` files.

All `*.import.js` files **have full ES6 support** provided by Meteor's Babel.js implementation.
`*.import.jsx` files also have JSX/React support.

API is compatible with new ES6 modules spec.
Under the hood [Babel.js](https://babeljs.io) and [SystemJS](https://github.com/systemjs/systemjs) take care of everything, so you can use modules today!

This package adds SystemJS to your project.

## Benefits of this approach

Universe Modules allows you to write your code in modular way, something that Meteor lacks by default.

This is especially useful when working with React - creating lots of new components don't have to pollute global namespace.
Also code is much simpler to reason about, and syntax is more friendly.
 
Code you write inside `*.import.js(x)` is compiled using Babel, so **you can also use other ES2015 features!** 

#### Roadmap

In the future we can add loading assets from external sources, e.g. you won't have to include all your modules in main Meteor bundle.
Some files (e.g. admin panel) could be loaded on demand, reducing initial load time.

## Installation

Just add this package to your app:

    meteor add universe:modules


## Usage

### Complete app example

If you want to see it in action, see our todo example app:

- Source code: https://github.com/vazco/demo_modules
- Live demo: http://universe-modules-demo.meteor.com

You can also check out great `meteor-react-example` app by [optilude](https://github.com/optilude).

- Source code: https://github.com/optilude/meteor-react-example/tree/modules


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

To load files from packages prefix path with full package name, e.g:

    import Lib from 'author:package/lib' 

Some Meteor packages are compatible with Universe Modules and also register nice module names in SystemJS

An example could be [universe:react-bootstrap](https://atmospherejs.com/universe/react-bootstrap).
Once added to Meteor project, you can write:

    import { Button } from 'bootstrap';

and use components from [ReactBootstrap](https://react-bootstrap.github.io/) packaged for Meteor projects.

### SystemJS API

More about SystemJS API can be found [on their Github documentation](https://github.com/systemjs/systemjs/blob/master/docs/system-api.md)

#### Setting nice module names

You can set alternative name for a module, below is an example from `universe:react-bootstrap` package:

    System.config({
        map: {
            bootstrap: 'universe:react-bootstrap/main'
        }
    });


## Troubleshooting

- `Uncaught SyntaxError: Unexpected token <` or `Potentially unhandled rejection [2] Uncaught SyntaxError: Unexpected token <`

You misspelled import name/path. SystemJS tries to download this file from remote location and fails.

Check if all files are at their location and import paths are OK.
You'll find misspelled code in the error stack trace.



----

> This package is part of [Universe](http://unicms.io), a framework based on [Meteor platform](http://meteor.com) maintained by [Vazco](http://www.vazco.eu).
> It works as standalone Meteor package, but you can get much more features when using the whole system.