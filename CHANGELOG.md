
## 0.5

### 0.5.1

- Bring back compatibility for `filename.import` syntax (TypeScript support)
- Allow loading assets from packages through SystemJS

### 0.5.0

- [BREAKING CHANGE] Meteor 1.2 is required
- [BREAKING CHANGE] **All non-relative paths to modules must be absolute and start with `/`, `{}` or `{package:name}`**
- [BREAKING CHANGE] There is no more need to configure System's package to load default file, and some settings like `map: {'.': System.normalizeSync('XXX')}` can cause infinite loop!
- [BREAKING CHANGE] `!vars` was rewritten and replaced by `!exports`
- [BREAKING CHANGE] Remove backward compatibility for deprecated package syntax `author:package`
- [BREAKING CHANGE] Remove compatibility for `filename.import` syntax 

- Change in internal module naming (Potentially breaking change)
- Make use of new build plugins API
- Option to import file only on selected platform with `@client` `@server` syntax
- Loading a directory (ending module name with `/`) will load `index` module from this directory 
- Providing only package name `{me:my-package}` will load index module from package
- Use Meteor Promise polyfill instead of this shipped with SystemJS
- Improve error handling (stack traces are now easier to read when errors are thrown inside module)
- Provide loader as a module instead of overwriting System's methods (but we still overwrite import, normalize etc.)
- Update `SystemJS` to 0.19.0
- Update `babel-compiler` to 5.8.24_1

## 0.4

### 0.4.1

- Add Windows support (replace backslashes with forward slashes in module names)

### 0.4.0

- Introduce new syntax `{author:package}/foo` for importing modules from packages (compatible with MDG less/stylus import syntax)
- Provide backward compatibility with warning message for previous syntax
- Better handling of SystemJS module normalization
- Support for System map/packages api with `System.normalizeSync`
- Remove `meteor://` protocol
- Update `babel-compiler` to 5.8.3_1 
- Update `babel-runtime` to 0.1.2

## 0.3

### 0.3.0

- Update SystemJS to 0.18.4
- Remove dependency on xhr2
- Use `meteor://` protocol on modules
- Alternative import name `foomodule.import` to allow TypeScript support
- Improve error reporting

## 0.2

### 0.2.1

- Update babel-compiler to 5.6.15

### 0.2.0

- Switch to MDG Babel compiler package

## 0.1

### 0.1.0

- Change name to `universe:modules`
- Add support for packages
