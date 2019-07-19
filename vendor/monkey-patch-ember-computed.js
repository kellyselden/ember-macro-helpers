(function() {
  var computedStore = new WeakMap();

  define('ember-macro-helpers/-computed-store', function() {
    return {
      'default': computedStore,
      __esModule: true
    };
  });

  var _computed = Ember.computed;

  // attempt to monkey patch before anything else runs
  Ember.computed = function computed() {
    var args = Array.prototype.slice.call(arguments);
    var cp = _computed.apply(this, args);
    var dependentKeys = args.slice(0, args.length - 1);
    var getter = args[args.length - 1];
    computedStore.set(cp, {
      dependentKeys: dependentKeys,
      getter: getter
    });
    return cp;
  };

  // support built-in macros
  Object.keys(_computed).forEach(function(_macro) {
    Ember.computed[_macro] = function macro() {
      var args = Array.prototype.slice.call(arguments);
      var cp = _computed[_macro].apply(this, args);
      var dependentKeys = args;
      var getter = cp._getter; // unfortunate private access (is there a better way?)
      computedStore.set(cp, {
        dependentKeys: dependentKeys,
        getter: getter
      });
      return cp;
    };
  });
})();
