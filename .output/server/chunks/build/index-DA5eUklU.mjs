import { defineComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><h2 style="${ssrRenderStyle({ "margin": "0 0 6px" })}">Dashboard</h2><p class="muted" style="${ssrRenderStyle({ "margin": "0 0 16px" })}">Bienvenue. Cette zone est prot\xE9g\xE9e par le middleware \`backoffice\`.</p><div class="grid"><div class="card" style="${ssrRenderStyle({ "grid-column": "span 4" })}"><div style="${ssrRenderStyle({ "font-weight": "800" })}">\xC9l\xE8ves</div><div class="muted">0</div></div><div class="card" style="${ssrRenderStyle({ "grid-column": "span 4" })}"><div style="${ssrRenderStyle({ "font-weight": "800" })}">Classes</div><div class="muted">0</div></div><div class="card" style="${ssrRenderStyle({ "grid-column": "span 4" })}"><div style="${ssrRenderStyle({ "font-weight": "800" })}">Alertes</div><div class="muted">0</div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/backoffice/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DA5eUklU.mjs.map
