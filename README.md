# ember-qunit-nice-errors
[![CI](https://github.com/adopted-ember-addons/ember-qunit-nice-errors/actions/workflows/ci.yml/badge.svg)](https://github.com/adopted-ember-addons/ember-qunit-nice-errors/actions/workflows/ci.yml)

Because expected true, result false is not enough!

This addon aims to improve the testing experience by defining a nice
message on those asserts that don't have one set by you.

 ## Compatibility

 - Ember.js v4.12 or above
 - Ember CLI v4.12 or above
 - Node.js v18 or above

## Installation

As easy as `ember install ember-qunit-nice-errors`

## Example

When you have a test with a failing assertion and no custom message, the default error doesn't say much.
As you can see by the following example test and the default ouput below:

```js
import { module, test } from 'qunit';

module('Unit | ok test');

test('it works', function(assert) {
  assert.ok(1===3);
});
```
![Test failed output without addon](https://github.com/wyeworks/ember-qunit-nice-errors/raw/gh-pages/images/before.png)

But with **ember-qunit-nice-errors** the message is way nicer!
![Test failed output with addon](https://github.com/wyeworks/ember-qunit-nice-errors/raw/gh-pages/images/after.png)

## Configuration

### showFileInfo

If you want your error messages to include the original test file, line and column where the failed assertion is, just add the following configuration on your `config/environment.js` file:

```js
ENV['ember-qunit-nice-errors'] = {
  showFileInfo: true
};
```

##### Before
```js
assert.ok(false)
```

##### After
```js
assert.ok(false) at my-app/tests/unit/ok-test.js:17:2
```

Also note you can enable this only for certain environments:

```js
if (environment === 'development') {
  ENV['ember-qunit-nice-errors'] = {
    showFileInfo: true
  };
}
```

### completeExistingMessages

If you fully trust us you can add this option to replace all assertions within your project tests, just add this to your configuration on your `config/environment.js` file:

```js
ENV['ember-qunit-nice-errors'] = {
  completeExistingMessages: true
};
```

Don't worry, the override will still show your orginal messages, it is not a destructive operation!

The following example illustrates what is the result of using the option `completeExistingMessages`.

##### Before
```js
assert.ok(1 === 1, 'one should be one');
```

##### After
```js
assert.ok(1 === 1, "assert.ok(1 === 1, 'one should be one')");
```

### include

By default only test files that match the glob `**/*-test.js` are processed by the
addon. You can include/exclude files from being processed by setting custom glob
rules.

```js
ENV['ember-qunit-nice-errors'] = {
  include: ["**/*-foo.js"]
};
```

Note that by changing the `include` configuration you are overriding the default
glob `**/*-test.js`. If you want to include files and keep the default rules,
you can write it as follows.

```js
ENV['ember-qunit-nice-errors'] = {
  include: [
    "**/*-test.js",
    "**/*-foo.js",
  ]
};
```

You can use any expression supported by `minimatch`, see https://www.npmjs.com/package/minimatch for more info.

### exclude

You can exclude specific test files from beign processed by adding exclude
rules.

```js
ENV['ember-qunit-nice-errors'] = {
  exclude: ["**/my-special-test.js"]
};
```

You can use any expression supported by `minimatch`, see https://www.npmjs.com/package/minimatch for more info.

## Supported assertions

We are currently supporting all the assertions provided by QUnit, those are:

* `ok`
* `notOk`
* `equal`
* `notEqual`
* `deepEqual`
* `notDeepEqual`
* `propEqual`
* `notPropEqual`
* `strictEqual`
* `notStrictEqual`


## Maintainers

- Diego Acosta ([@acostami](https://github.com/acostami))
- Federico Kauffman ([@fedekau](https://github.com/fedekau))
- Samanta de Barros ([@sdebarros](https://github.com/sdebarros))
- Santiago Ferreira ([@san650](https://github.com/san650))

## Credits

We got inspiration from

- [qunit-helpful](https://github.com/bahmutov/qunit-helpful)
- [ember-watson](https://github.com/abuiles/ember-watson)

## License

ember-qunit-nice-errors is licensed under the MIT license.

See [LICENSE](./LICENSE.md) for the full license text.
