'use strict';

function any(array, fun) {
  for (let i = 0; i < array.length; i++) {
    if (fun.call(null, array[i])) {
      return true;
    }
  }

  return false;
}

module.exports = {
  any
}
