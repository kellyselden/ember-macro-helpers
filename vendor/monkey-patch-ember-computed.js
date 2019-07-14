(function() {
  let computedStore = new WeakMap();

  define('ember-macro-helpers/-computed-store', () => ({
    'default': computedStore,
    __esModule: true,
  }));

  let _computed = Ember.computed;

  // attempt to monkey patch before anything else runs
  Ember.computed = function computed(...args) {
    let cp = _computed.apply(this, args);
    let dependentKeys = args.slice(0, args.length - 1);
    let getter = args[args.length - 1];
    computedStore.set(cp, { dependentKeys, getter });
    return cp;
  };

  // support built-in macros
  for (let _macro in _computed) {
    if (_computed.hasOwnProperty(_macro)) {
      Ember.computed[_macro] = function macro(...args) {
        let cp = _computed[_macro].apply(this, args);
        let dependentKeys = args;
        let getter = cp._getter; // unfortunate private access (is there a better way?)
        computedStore.set(cp, { dependentKeys, getter });
        return cp;
      };
    }
  }
})();
