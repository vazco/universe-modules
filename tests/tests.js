var onFailure = (test, type = 'Failure') => {
    return err => {
        test.fail({type, message: err.message});
    }
};

Tinytest.addAsync('Universe Modules - imports - import js file', (test, next) => {

    System.import('{universe:modules}/tests/test_modules/file1')
        .then(module => {
            test.isTrue(module.default.works);
        }, onFailure(test))
        .then(next, next);

});
Tinytest.add('Universe Modules - imports - import jsx file', test => {
    test.equal(true, true);
});