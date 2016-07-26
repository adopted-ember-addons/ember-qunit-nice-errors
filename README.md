# ember-qunit-nice-errors
[![Build Status](https://travis-ci.org/wyeworks/ember-qunit-nice-errors.svg?branch=master)](https://travis-ci.org/wyeworks/ember-qunit-nice-errors)
[![CodeClimate](https://codeclimate.com/repos/5787c7854f9655117c000601/badges/952448cd7794cef82460/gpa.svg)](https://codeclimate.com/repos/5787c7854f9655117c000601/feed)

 Because expected true, result false is not enough!

 This addon aims to improve the testing experience by defining a nice
 message on those asserts that don't have one set by you.

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

## Supported assertions

We are currently supporting the following assertions

* `ok`
* `notOk`
* `equal`
* `notEqual`
* `deepEqual`
* `notDeepEqual`

But plan to keep adding more.

## Maintainers

- Diego Acosta ([@acostami](https://github.com/acostami))
- Samanta de Barros ([@sdebarros](https://github.com/sdebarros))
- Federico Kauffman ([@fedekau](https://github.com/fedekau))

## Credits

We got inspiration from

- [qunit-helpful](https://github.com/bahmutov/qunit-helpful)
- [ember-watson](https://github.com/abuiles/ember-watson)

## License

ember-qunit-nice-errors is licensed under the MIT license.

See [LICENSE](./LICENSE.md) for the full license text.
