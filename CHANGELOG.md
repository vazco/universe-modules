
## 0.4

- Introduce new syntax `{author:package}/foo` for importing modules from packages (compatible with MDG less/stylus import syntax)
- Provide backward compatibility with warning message for previous syntax
- Better handling of SystemJS module normalization
- Support for System map/packages api with `System.normalizeSync`
- Remove `meteor://` protocol
- Update `babel-compiler` to 5.8.3_1 
- Update `babel-runtime` to 0.1.2

## 0.3

- Update SystemJS to 0.18.4
- Remove dependency on xhr2
- Use `meteor://` protocol on modules
- Alternative import name `foomodule.import` to allow TypeScript support
- Improve error reporting

## 0.2.1

- Update babel-compiler to 5.6.15

## 0.2.0

- Switch to MDG Babel compiler package

## 0.1

- Change name to `universe:modules`
- Add support for packages

