# Universe Modules

### Use ES2015 modules in Meteor today! ###

You can read more about new JavaScript modules and see some examples on [JSModules.io](http://jsmodules.io) or [2ality](http://www.2ality.com/2014/09/es6-modules-final.html)

This package add new file extensions: `*.import.js` and `*.import.jsx`.  
These files will be bundled with your Meteor app, but won't be executed until you request them.
This is somewhat similar to `*.import.less` files, that you can include inside normal `*.less` files.

API is compatible with new ES6/ES2015 modules spec.
Under the hood [Babel.js](https://babeljs.io) and [System.js](https://github.com/systemjs/systemjs) take
care of everything, so you can write future-proof code today!

All `*.import.js` files have ES2015 support provided by Meteor's Babel.js implementation.
`*.import.jsx` files have also JSX/React support.

## Installation

First add this package to your app:

```
meteor add vazco:universe-modules
```

Universe Modules uses core package `babel-compiler`.  
Unfortunately at the moment this package is still work in progress and MDG is not providing it from the official repositories.
You have to download it manually from https://github.com/meteor/react-packages/tree/master/babel-compiler

The same way you add official but not yet released React support.

This will change in near future and this package won't have any non-core dependencies.

## Usage

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


If you want to execute this inside Meteor app, you need to use System.js API:

Some normal **file.js**:

    System.import('say_hello').then(function(module){
    
        var sayHello = module.default; // default export is attached as default property, all named exports are attached by their name
        
        console.log( sayHello() ); // this will log "Hello World!"
        
    });

This assumes that file say_hello.import.js is inside main app directory.  
If you have it somewhere else you have to provide full path relative to meteor app directory,
e.g. `client/components/say_hello`.


More about System.js API can be found [on their Github documentation](https://github.com/systemjs/systemjs/blob/master/docs/system-api.md)

