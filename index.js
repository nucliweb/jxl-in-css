const DEFAULT_OTIONS = {
  modules: false,
  noJxlClass: "no-jxl",
  jxlClass: "jxl",
  rename: (oldName) => oldName.replace(/\.(jpe?g|png|webp)/gi, ".jxl"),
};

module.exports = (opts = {}) => {
  const { modules, noJxlClass, jxlClass, rename } = {
    ...DEFAULT_OTIONS,
    ...opts,
  };

  function addClass(selector, className) {
    className = modules ? `:global(.${className})` : `.${className}`;

    return selector.includes("html")
      ? selector.replace(/html[^ ]*/, `$& body${className}`)
      : `body${className} ` + selector;
  }

  return {
    postcssPlugin: "jxl-in-css",
    Declaration(decl) {
      if (/\.(jpe?g|png|webp)(?!(\.jxl|.*[&?]format=jxl))/i.test(decl.value)) {
        const rule = decl.parent;
        if (rule.selector.includes(`.${noJxlClass}`)) return;
        const jxl = rule.cloneAfter();
        jxl.each((i) => {
          if (i.prop !== decl.prop && i.value !== decl.value) i.remove();
        });
        jxl.selectors = jxl.selectors.map((i) => addClass(i, jxlClass));
        jxl.each((i) => {
          if (
            rename &&
            Object.prototype.toString.call(rename) === "[object Function]"
          ) {
            i.value = rename(i.value);
          }
        });
        const noJxl = rule.cloneAfter();
        noJxl.each((i) => {
          if (i.prop !== decl.prop && i.value !== decl.value) i.remove();
        });
        noJxl.selectors = noJxl.selectors.map((i) => addClass(i, noJxlClass));
        decl.remove();
        if (rule.nodes.length === 0) rule.remove();
      }
    },
  };
};

module.exports.postcss = true;
