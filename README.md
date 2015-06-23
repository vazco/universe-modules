# Universe Modules

### Use ES6 / ES2015 modules in Meteor today!

You can read more about new JavaScript modules and see some examples at [JSModules.io](http://jsmodules.io) or [2ality](http://www.2ality.com/2014/09/es6-modules-final.html)

This package add new file extensions: `*.import.js` and `*.import.jsx`.  
These files will be bundled with your Meteor app, but won't get executed until you request them.
This is somewhat similar to `*.import.less` files, that you can include inside normal `*.less` files.

API is compatible with new ES6 modules spec.
Under the hood [Babel.js](https://babeljs.io) and [SystemJS](https://github.com/systemjs/systemjs) take care of everything, so you can write future-proof code today!

All `*.import.js` files have ES6 support provided by Meteor's Babel.js implementation.
`*.import.jsx` files have also JSX/React support.

This package also adds SystemJS to your project.

## Benefits of this approach

Universe Modules allows you to write your code in modular way, something that Meteor lacks by default.

This is especially useful when working with React - creating lots of new components don't have to pollute global namespace.
Also code is much simpler to reason about, and syntax is more friendly.
 
Code you write inside `*.import.js(x)` files is future-proof - when Meteor introduces full support for ECMAScript 2015 in the future, your code will be ready for it.

#### Roadmap

In the future we can add loading assets from external sources, e.g. you won't have to include all your modules in main Meteor bundle.
Some files (e.g. admin panel) could be loaded on demand, reducing initial load time.

## Installation

Just add this package to your app:

    meteor add universe:modules

Universe Modules uses core package `babel-compiler`.  
Unfortunately at the moment this package is still work in progress and MDG is not providing it from the official repositories.
We have to put it temporary on atmosphere as an unofficial package.   

This will change in near future and Universe Module won't have any non-core dependencies.

## Usage

### Basic usage inside app

Create file **something1.import.js**:

    export default function (){
      return 'Hello';
    }

and **something2.import.js**:

    export default function (){
      return 'World';
    }

Then you can import and make use of them inside some other file, e.g. **say_hello.import.js**:

    import hello from './something1';
    import world from './something2';
    
    export default function(){
      return hello() + ' ' + world() + '!';
    }


If you want to execute this inside Meteor app, you need to use SystemJS API:

Some normal **file.js**:

    System.import('say_hello').then(function(module){
    
        var sayHello = module.default; // default export is attached as default property, all named exports are attached by their name
        
        console.log( sayHello() ); // this will log "Hello World!"
        
    });

This assumes that file say_hello.import.js is inside main app directory.  
If you have it somewhere else you have to provide full path relative to meteor app directory,
e.g. `client/components/say_hello`.

You can also see some really basic example project at [Github](https://github.com/vazco/demo_modules).
This example will be expanded in near future.

### Loading modules from packages

To load files from packages prefix path with full package name, e.g:

    import Lib from 'author:package/lib' 

Some Meteor packages are compatible with Universe Modules and also register nice module names in SystemJS

An example could be `universe:react-bootstrap`.
Once added to Meteor project, you can write:

    import { Button } from 'bootstrap';

and use components from [ReactBootstrap](https://react-bootstrap.github.io/) packaged for Meteor projects.

### SystemJS API

SystemJS is very powerful tool.

More about SystemJS API can be found [on their Github documentation](https://github.com/systemjs/systemjs/blob/master/docs/system-api.md)

#### Setting nice module names

You can set alternative name for a module, below is an example from `universe:react-bootstrap` package:

    System.config({
        map: {
            bootstrap: 'universe:react-bootstrap/main'
        }
    });


## Troubleshooting

### `Uncaught SyntaxError: Unexpected token <` or `Potentially unhandled rejection [2] Uncaught SyntaxError: Unexpected token <`

You misspelled import name/path. SystemJS tries to download this file from remote location and fails.

Check if all files are at their location and import paths are OK.
You'll find misspelled code in the error stack trace.



----

> This package is part of Universe, a framework based on [Meteor platform](http://meteor.com) maintained by [Vazco](http://www.vazco.eu).
> It works as standalone Meteor package, but you can get much more features when using the whole system.