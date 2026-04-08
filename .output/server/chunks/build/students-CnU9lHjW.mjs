import { defineComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "students",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><h2 style="${ssrRenderStyle({ "margin": "0 0 6px" })}">\xC9l\xE8ves</h2><p class="muted" style="${ssrRenderStyle({ "margin": "0 0 16px" })}">Liste / recherche / fiche \xE9l\xE8ve \xE0 impl\xE9menter.</p></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/backoffice/students.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=students-CnU9lHjW.mjs.map
