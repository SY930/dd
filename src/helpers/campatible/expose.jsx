// expose common library
window.jQuery = window.$ = require('jquery');
window._ = require('underscore');
window._uuid = require('uuid/v4');

require('lodash').noConflict()
