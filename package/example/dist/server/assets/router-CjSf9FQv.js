import { ssr, ssrHydrationKey, ssrElement, escape, createComponent, Dynamic, mergeProps, isServer, spread, useAssets, render, Show, Portal, ssrStyleProperty, ssrAttribute, ssrStyle, For as For$1, NoHydration } from "solid-js/web";
import * as Solid from "solid-js";
import { createResource, sharedConfig, createContext, createUniqueId, useContext, createRenderEffect, onCleanup, onMount, For, getOwner, DEV, createSignal, createEffect, Show as Show$1, splitProps } from "solid-js";
import { r as rootRouteId, i as invariant, t as trimPathLeft, j as joinPaths, a as trimPathRight, b as redirect, u as useRouter, c as isDangerousProtocol, e as exactPathTest, d as removeTrailingSlash, f as deepEqual, g as functionalUpdate, n as nearestMatchContext, h as replaceEqualDeep, k as isModuleNotFoundError, l as createNonReactiveReadonlyStore, m as createNonReactiveMutableStore, R as RouterCore, o as escapeHtml, p as getAssetCrossOrigin, q as resolveManifestAssetLink, O as Outlet } from "../server.js";
import { mergeRefs } from "@solid-primitives/refs";
import "node:async_hooks";
import "node:stream";
import "seroval";
import "seroval-plugins/web";
import "node:stream/web";
var preloadWarning = "Error preloading route! ☝️";
var BaseRoute = class {
  get to() {
    return this._to;
  }
  get id() {
    return this._id;
  }
  get path() {
    return this._path;
  }
  get fullPath() {
    return this._fullPath;
  }
  constructor(options) {
    this.init = (opts) => {
      this.originalIndex = opts.originalIndex;
      const options2 = this.options;
      const isRoot = !options2?.path && !options2?.id;
      this.parentRoute = this.options.getParentRoute?.();
      if (isRoot) this._path = rootRouteId;
      else if (!this.parentRoute) {
        invariant();
      }
      let path = isRoot ? rootRouteId : options2?.path;
      if (path && path !== "/") path = trimPathLeft(path);
      const customId = options2?.id || path;
      let id = isRoot ? rootRouteId : joinPaths([this.parentRoute.id === "__root__" ? "" : this.parentRoute.id, customId]);
      if (path === "__root__") path = "/";
      if (id !== "__root__") id = joinPaths(["/", id]);
      const fullPath = id === "__root__" ? "/" : joinPaths([this.parentRoute.fullPath, path]);
      this._path = path;
      this._id = id;
      this._fullPath = fullPath;
      this._to = trimPathRight(fullPath);
    };
    this.addChildren = (children) => {
      return this._addFileChildren(children);
    };
    this._addFileChildren = (children) => {
      if (Array.isArray(children)) this.children = children;
      if (typeof children === "object" && children !== null) this.children = Object.values(children);
      return this;
    };
    this._addFileTypes = () => {
      return this;
    };
    this.updateLoader = (options2) => {
      Object.assign(this.options, options2);
      return this;
    };
    this.update = (options2) => {
      Object.assign(this.options, options2);
      return this;
    };
    this.lazy = (lazyFn) => {
      this.lazyFn = lazyFn;
      return this;
    };
    this.redirect = (opts) => redirect({
      from: this.fullPath,
      ...opts
    });
    this.options = options || {};
    this.isRoot = !options?.getParentRoute;
    if (options?.id && options?.path) throw new Error(`Route cannot have both an 'id' and a 'path' option.`);
  }
};
var BaseRootRoute = class extends BaseRoute {
  constructor(options) {
    super(options);
  }
};
function useHydrated() {
  const [hydrated, setHydrated] = Solid.createSignal(false);
  Solid.onMount(() => {
    setHydrated(true);
  });
  return hydrated;
}
function useIntersectionObserver(ref, callback, intersectionObserverOptions = {}, options = {}) {
  const isIntersectionObserverAvailable = typeof IntersectionObserver === "function";
  let observerRef = null;
  Solid.createEffect(() => {
    const r = ref();
    if (!r || !isIntersectionObserverAvailable || options.disabled) {
      return;
    }
    observerRef = new IntersectionObserver(([entry]) => {
      callback(entry);
    }, intersectionObserverOptions);
    observerRef.observe(r);
    Solid.onCleanup(() => {
      observerRef?.disconnect();
    });
  });
  return () => observerRef;
}
var _tmpl$$1 = ["<svg", ">", "</svg>"];
const timeoutMap = /* @__PURE__ */ new WeakMap();
function useLinkProps(options) {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = Solid.createSignal(false);
  useHydrated();
  let hasRenderFetched = false;
  const [local, rest] = Solid.splitProps(Solid.mergeProps({
    activeProps: STATIC_ACTIVE_PROPS_GET,
    inactiveProps: STATIC_INACTIVE_PROPS_GET
  }, options), ["activeProps", "inactiveProps", "activeOptions", "to", "preload", "preloadDelay", "hashScrollIntoView", "replace", "startTransition", "resetScroll", "viewTransition", "target", "disabled", "style", "class", "onClick", "onBlur", "onFocus", "onMouseEnter", "onMouseLeave", "onMouseOver", "onMouseOut", "onTouchStart", "ignoreBlocker"]);
  const [_, propsSafeToSpread] = Solid.splitProps(rest, ["params", "search", "hash", "state", "mask", "reloadDocument", "unsafeRelative"]);
  const currentLocation = Solid.createMemo(() => router.stores.location.state, void 0, {
    equals: (prev, next2) => prev.href === next2.href
  });
  const _options = () => options;
  const next = Solid.createMemo(() => {
    const _fromLocation = currentLocation();
    const options2 = {
      _fromLocation,
      ..._options()
    };
    return Solid.untrack(() => router.buildLocation(options2));
  });
  const hrefOption = Solid.createMemo(() => {
    if (_options().disabled) return void 0;
    const location = next().maskedLocation ?? next();
    const publicHref = location.publicHref;
    const external = location.external;
    if (external) {
      return {
        href: publicHref,
        external: true
      };
    }
    return {
      href: router.history.createHref(publicHref) || "/",
      external: false
    };
  });
  const externalLink = Solid.createMemo(() => {
    const _href = hrefOption();
    if (_href?.external) {
      if (isDangerousProtocol(_href.href, router.protocolAllowlist)) {
        return void 0;
      }
      return _href.href;
    }
    const to = _options().to;
    const safeInternal = isSafeInternal(to);
    if (safeInternal) return void 0;
    if (typeof to !== "string" || to.indexOf(":") === -1) return void 0;
    try {
      new URL(to);
      if (isDangerousProtocol(to, router.protocolAllowlist)) {
        if (false) ;
        return void 0;
      }
      return to;
    } catch {
    }
    return void 0;
  });
  const preload = Solid.createMemo(() => {
    if (_options().reloadDocument || externalLink()) {
      return false;
    }
    return local.preload ?? router.options.defaultPreload;
  });
  const preloadDelay = () => local.preloadDelay ?? router.options.defaultPreloadDelay ?? 0;
  const isActive = Solid.createMemo(() => {
    if (externalLink()) return false;
    const activeOptions = local.activeOptions;
    const current = currentLocation();
    const nextLocation = next();
    if (activeOptions?.exact) {
      const testExact = exactPathTest(current.pathname, nextLocation.pathname, router.basepath);
      if (!testExact) {
        return false;
      }
    } else {
      const currentPath = removeTrailingSlash(current.pathname, router.basepath);
      const nextPath = removeTrailingSlash(nextLocation.pathname, router.basepath);
      const pathIsFuzzyEqual = currentPath.startsWith(nextPath) && (currentPath.length === nextPath.length || currentPath[nextPath.length] === "/");
      if (!pathIsFuzzyEqual) {
        return false;
      }
    }
    if (activeOptions?.includeSearch ?? true) {
      const searchTest = deepEqual(current.search, nextLocation.search, {
        partial: !activeOptions?.exact,
        ignoreUndefined: !activeOptions?.explicitUndefined
      });
      if (!searchTest) {
        return false;
      }
    }
    if (activeOptions?.includeHash) {
      const currentHash = current.hash;
      return currentHash === nextLocation.hash;
    }
    return true;
  });
  const doPreload = () => router.preloadRoute({
    ..._options(),
    _builtLocation: next()
  }).catch((err) => {
    console.warn(err);
    console.warn(preloadWarning);
  });
  const preloadViewportIoCallback = (entry) => {
    if (entry?.isIntersecting) {
      doPreload();
    }
  };
  const [ref, setRef] = Solid.createSignal(null);
  useIntersectionObserver(ref, preloadViewportIoCallback, {
    rootMargin: "100px"
  }, {
    disabled: !!local.disabled || !(preload() === "viewport")
  });
  Solid.createEffect(() => {
    if (hasRenderFetched) {
      return;
    }
    if (!local.disabled && preload() === "render") {
      doPreload();
      hasRenderFetched = true;
    }
  });
  if (externalLink()) {
    return Solid.mergeProps(propsSafeToSpread, {
      ref: mergeRefs(setRef, _options().ref),
      href: externalLink()
    }, Solid.splitProps(local, ["target", "disabled", "style", "class", "onClick", "onBlur", "onFocus", "onMouseEnter", "onMouseLeave", "onMouseOut", "onMouseOver", "onTouchStart"])[0]);
  }
  const handleClick = (e) => {
    const elementTarget = e.currentTarget.getAttribute("target");
    const effectiveTarget = local.target !== void 0 ? local.target : elementTarget;
    if (!local.disabled && !isCtrlEvent(e) && !e.defaultPrevented && (!effectiveTarget || effectiveTarget === "_self") && e.button === 0) {
      e.preventDefault();
      setIsTransitioning(true);
      const unsub = router.subscribe("onResolved", () => {
        unsub();
        setIsTransitioning(false);
      });
      router.navigate({
        ..._options(),
        replace: local.replace,
        resetScroll: local.resetScroll,
        hashScrollIntoView: local.hashScrollIntoView,
        startTransition: local.startTransition,
        viewTransition: local.viewTransition,
        ignoreBlocker: local.ignoreBlocker
      });
    }
  };
  const enqueueIntentPreload = (e) => {
    if (local.disabled || preload() !== "intent") return;
    if (!preloadDelay()) {
      doPreload();
      return;
    }
    const eventTarget = e.currentTarget || e.target;
    if (!eventTarget || timeoutMap.has(eventTarget)) return;
    timeoutMap.set(eventTarget, setTimeout(() => {
      timeoutMap.delete(eventTarget);
      doPreload();
    }, preloadDelay()));
  };
  const handleTouchStart = (_2) => {
    if (local.disabled || preload() !== "intent") return;
    doPreload();
  };
  const handleLeave = (e) => {
    if (local.disabled) return;
    const eventTarget = e.currentTarget || e.target;
    if (eventTarget) {
      const id = timeoutMap.get(eventTarget);
      clearTimeout(id);
      timeoutMap.delete(eventTarget);
    }
  };
  const simpleStyling = Solid.createMemo(() => local.activeProps === STATIC_ACTIVE_PROPS_GET && local.inactiveProps === STATIC_INACTIVE_PROPS_GET && local.class === void 0 && local.style === void 0);
  const onClick = createComposedHandler(() => local.onClick, handleClick);
  const onBlur = createComposedHandler(() => local.onBlur, handleLeave);
  const onFocus = createComposedHandler(() => local.onFocus, enqueueIntentPreload);
  const onMouseEnter = createComposedHandler(() => local.onMouseEnter, enqueueIntentPreload);
  const onMouseOver = createComposedHandler(() => local.onMouseOver, enqueueIntentPreload);
  const onMouseLeave = createComposedHandler(() => local.onMouseLeave, handleLeave);
  const onMouseOut = createComposedHandler(() => local.onMouseOut, handleLeave);
  const onTouchStart = createComposedHandler(() => local.onTouchStart, handleTouchStart);
  const resolvedProps = Solid.createMemo(() => {
    const active = isActive();
    const base = {
      href: hrefOption()?.href,
      ref: mergeRefs(setRef, _options().ref),
      onClick,
      onBlur,
      onFocus,
      onMouseEnter,
      onMouseOver,
      onMouseLeave,
      onMouseOut,
      onTouchStart,
      disabled: !!local.disabled,
      target: local.target,
      ...local.disabled && STATIC_DISABLED_PROPS,
      ...isTransitioning() && STATIC_TRANSITIONING_ATTRIBUTES
    };
    if (simpleStyling()) {
      return {
        ...base,
        ...active && STATIC_DEFAULT_ACTIVE_ATTRIBUTES
      };
    }
    const activeProps = active ? functionalUpdate(local.activeProps, {}) ?? EMPTY_OBJECT : EMPTY_OBJECT;
    const inactiveProps = active ? EMPTY_OBJECT : functionalUpdate(local.inactiveProps, {});
    const style = {
      ...local.style,
      ...activeProps.style,
      ...inactiveProps.style
    };
    const className = [local.class, activeProps.class, inactiveProps.class].filter(Boolean).join(" ");
    return {
      ...activeProps,
      ...inactiveProps,
      ...base,
      ...Object.keys(style).length ? {
        style
      } : void 0,
      ...className ? {
        class: className
      } : void 0,
      ...active && STATIC_ACTIVE_ATTRIBUTES
    };
  });
  return Solid.mergeProps(propsSafeToSpread, resolvedProps);
}
const STATIC_ACTIVE_PROPS = {
  class: "active"
};
const STATIC_ACTIVE_PROPS_GET = () => STATIC_ACTIVE_PROPS;
const EMPTY_OBJECT = {};
const STATIC_INACTIVE_PROPS_GET = () => EMPTY_OBJECT;
const STATIC_DEFAULT_ACTIVE_ATTRIBUTES = {
  class: "active",
  "data-status": "active",
  "aria-current": "page"
};
const STATIC_DISABLED_PROPS = {
  role: "link",
  "aria-disabled": true
};
const STATIC_ACTIVE_ATTRIBUTES = {
  "data-status": "active",
  "aria-current": "page"
};
const STATIC_TRANSITIONING_ATTRIBUTES = {
  "data-transitioning": "transitioning"
};
function callHandler(event, handler) {
  if (typeof handler === "function") {
    handler(event);
  } else {
    handler[0](handler[1], event);
  }
  return event.defaultPrevented;
}
function createComposedHandler(getHandler, fallback) {
  return (event) => {
    const handler = getHandler();
    if (!handler || !callHandler(event, handler)) fallback(event);
  };
}
const Link$1 = (props) => {
  const [local, rest] = Solid.splitProps(props, ["_asChild", "children"]);
  const [_, linkProps] = Solid.splitProps(useLinkProps(rest), ["type"]);
  const children = Solid.createMemo(() => {
    const ch = local.children;
    if (typeof ch === "function") {
      return ch({
        get isActive() {
          return linkProps["data-status"] === "active";
        },
        get isTransitioning() {
          return linkProps["data-transitioning"] === "transitioning";
        }
      });
    }
    return ch;
  });
  if (local._asChild === "svg") {
    const [_2, svgLinkProps] = Solid.splitProps(linkProps, ["class"]);
    return ssr(_tmpl$$1, ssrHydrationKey(), ssrElement("a", svgLinkProps, () => escape(children()), false));
  }
  if (!local._asChild) {
    return ssrElement("a", linkProps, () => escape(children()), true);
  }
  return createComponent(Dynamic, mergeProps({
    get component() {
      return local._asChild;
    }
  }, linkProps, {
    get children() {
      return children();
    }
  }));
};
function isCtrlEvent(e) {
  return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
}
function isSafeInternal(to) {
  if (typeof to !== "string") return false;
  const zero = to.charCodeAt(0);
  if (zero === 47) return to.charCodeAt(1) !== 47;
  return zero === 46;
}
function useMatch(opts) {
  const router = useRouter();
  const nearestMatch = opts.from ? void 0 : Solid.useContext(nearestMatchContext);
  const match = () => {
    if (opts.from) {
      return router.stores.getMatchStoreByRouteId(opts.from).state;
    }
    return nearestMatch?.match();
  };
  Solid.createEffect(() => {
    if (match() !== void 0) {
      return;
    }
    const hasPendingMatch = opts.from ? Boolean(router.stores.pendingRouteIds.state[opts.from]) : nearestMatch?.hasPending() ?? false;
    if (!hasPendingMatch && !router.stores.isTransitioning.state && (opts.shouldThrow ?? true)) {
      invariant();
    }
  });
  return Solid.createMemo((prev) => {
    const selectedMatch = match();
    if (selectedMatch === void 0) return void 0;
    const res = opts.select ? opts.select(selectedMatch) : selectedMatch;
    if (prev === void 0) return res;
    return replaceEqualDeep(prev, res);
  });
}
function useLoaderData(opts) {
  return useMatch({
    from: opts.from,
    strict: opts.strict,
    select: (s) => {
      return opts.select ? opts.select(s.loaderData) : s.loaderData;
    }
  });
}
function useLoaderDeps(opts) {
  return useMatch({
    ...opts,
    select: (s) => {
      return opts.select ? opts.select(s.loaderDeps) : s.loaderDeps;
    }
  });
}
function useParams(opts) {
  return useMatch({
    from: opts.from,
    strict: opts.strict,
    shouldThrow: opts.shouldThrow,
    select: (match) => {
      const params = opts.strict === false ? match.params : match._strictParams;
      return opts.select ? opts.select(params) : params;
    }
  });
}
function useSearch(opts) {
  return useMatch({
    from: opts.from,
    strict: opts.strict,
    shouldThrow: opts.shouldThrow,
    select: (match) => {
      const search = match.search;
      return opts.select ? opts.select(search) : search;
    }
  });
}
function useNavigate(_defaultOpts) {
  const router = useRouter();
  return (options) => {
    return router.navigate({
      ...options,
      from: options.from ?? _defaultOpts?.from
    });
  };
}
function useRouteContext(opts) {
  return useMatch({
    ...opts,
    select: (match) => opts.select ? opts.select(match.context) : match.context
  });
}
let Route$3 = class Route extends BaseRoute {
  /**
   * @deprecated Use the `createRoute` function instead.
   */
  constructor(options) {
    super(options);
    this.useMatch = (opts) => {
      return useMatch({
        select: opts?.select,
        from: this.id
      });
    };
    this.useRouteContext = (opts) => {
      return useRouteContext({
        ...opts,
        from: this.id
      });
    };
    this.useSearch = (opts) => {
      return useSearch({
        select: opts?.select,
        from: this.id
      });
    };
    this.useParams = (opts) => {
      return useParams({
        select: opts?.select,
        from: this.id
      });
    };
    this.useLoaderDeps = (opts) => {
      return useLoaderDeps({
        ...opts,
        from: this.id
      });
    };
    this.useLoaderData = (opts) => {
      return useLoaderData({
        ...opts,
        from: this.id
      });
    };
    this.useNavigate = () => {
      return useNavigate({
        from: this.fullPath
      });
    };
    this.Link = (props) => {
      const _self$ = this;
      return createComponent(Link$1, mergeProps({
        get from() {
          return _self$.fullPath;
        }
      }, props));
    };
  }
};
function createRoute(options) {
  return new Route$3(options);
}
class RootRoute extends BaseRootRoute {
  /**
   * @deprecated `RootRoute` is now an internal implementation detail. Use `createRootRoute()` instead.
   */
  constructor(options) {
    super(options);
    this.useMatch = (opts) => {
      return useMatch({
        select: opts?.select,
        from: this.id
      });
    };
    this.useRouteContext = (opts) => {
      return useRouteContext({
        ...opts,
        from: this.id
      });
    };
    this.useSearch = (opts) => {
      return useSearch({
        select: opts?.select,
        from: this.id
      });
    };
    this.useParams = (opts) => {
      return useParams({
        select: opts?.select,
        from: this.id
      });
    };
    this.useLoaderDeps = (opts) => {
      return useLoaderDeps({
        ...opts,
        from: this.id
      });
    };
    this.useLoaderData = (opts) => {
      return useLoaderData({
        ...opts,
        from: this.id
      });
    };
    this.useNavigate = () => {
      return useNavigate({
        from: this.fullPath
      });
    };
    this.Link = (props) => {
      const _self$2 = this;
      return createComponent(Link$1, mergeProps({
        get from() {
          return _self$2.fullPath;
        }
      }, props));
    };
  }
}
function createRootRoute(options) {
  return new RootRoute(options);
}
function createFileRoute(path) {
  if (typeof path === "object") {
    return new FileRoute(path, {
      silent: true
    }).createRoute(path);
  }
  return new FileRoute(path, {
    silent: true
  }).createRoute;
}
class FileRoute {
  constructor(path, _opts) {
    this.path = path;
    this.createRoute = (options) => {
      const route = createRoute(options);
      route.isRoot = false;
      return route;
    };
    this.silent = _opts?.silent;
  }
}
class LazyRoute {
  constructor(opts) {
    this.useMatch = (opts2) => {
      return useMatch({
        select: opts2?.select,
        from: this.options.id
      });
    };
    this.useRouteContext = (opts2) => {
      return useRouteContext({ ...opts2, from: this.options.id });
    };
    this.useSearch = (opts2) => {
      return useSearch({
        select: opts2?.select,
        from: this.options.id
      });
    };
    this.useParams = (opts2) => {
      return useParams({
        select: opts2?.select,
        from: this.options.id
      });
    };
    this.useLoaderDeps = (opts2) => {
      return useLoaderDeps({ ...opts2, from: this.options.id });
    };
    this.useLoaderData = (opts2) => {
      return useLoaderData({ ...opts2, from: this.options.id });
    };
    this.useNavigate = () => {
      const router = useRouter();
      return useNavigate({ from: router.routesById[this.options.id].fullPath });
    };
    this.options = opts;
  }
}
function createLazyFileRoute(id) {
  if (typeof id === "object") {
    return new LazyRoute(id);
  }
  return (opts) => new LazyRoute({ id, ...opts });
}
function lazyRouteComponent(importer, exportName) {
  let loadPromise;
  let comp;
  let error;
  const load = () => {
    if (!loadPromise) {
      loadPromise = importer().then((res) => {
        loadPromise = void 0;
        comp = res[exportName];
        return comp;
      }).catch((err) => {
        error = err;
      });
    }
    return loadPromise;
  };
  const lazyComp = function Lazy(props) {
    if (error) {
      if (isModuleNotFoundError(error)) {
        if (error instanceof Error && typeof window !== "undefined" && typeof sessionStorage !== "undefined") {
          const storageKey = `tanstack_router_reload:${error.message}`;
          if (!sessionStorage.getItem(storageKey)) {
            sessionStorage.setItem(storageKey, "1");
            window.location.reload();
            return {
              default: () => null
            };
          }
        }
      }
      throw error;
    }
    if (!comp) {
      const [compResource] = createResource(load, {
        initialValue: comp,
        ssrLoadFrom: "initial"
      });
      return createComponent(Dynamic, mergeProps({
        get component() {
          return compResource();
        }
      }, props));
    }
    return createComponent(Dynamic, mergeProps({
      component: comp
    }, props));
  };
  lazyComp.preload = load;
  return lazyComp;
}
function initRouterStores(stores, createReadonlyStore) {
  stores.childMatchIdByRouteId = createReadonlyStore(() => {
    const ids = stores.matchesId.state;
    const obj = {};
    for (let i = 0; i < ids.length - 1; i++) {
      const parentStore = stores.activeMatchStoresById.get(ids[i]);
      if (parentStore?.routeId) {
        obj[parentStore.routeId] = ids[i + 1];
      }
    }
    return obj;
  });
  stores.pendingRouteIds = createReadonlyStore(() => {
    const ids = stores.pendingMatchesId.state;
    const obj = {};
    for (const id of ids) {
      const store = stores.pendingMatchStoresById.get(id);
      if (store?.routeId) {
        obj[store.routeId] = true;
      }
    }
    return obj;
  });
}
if (typeof globalThis !== "undefined" && "FinalizationRegistry" in globalThis) {
  new FinalizationRegistry((cb) => cb());
}
const getStoreFactory = (opts) => {
  {
    return {
      createMutableStore: createNonReactiveMutableStore,
      createReadonlyStore: createNonReactiveReadonlyStore,
      batch: (fn) => fn(),
      init: (stores) => initRouterStores(stores, createNonReactiveReadonlyStore)
    };
  }
};
const createRouter = (options) => {
  return new Router(options);
};
class Router extends RouterCore {
  constructor(options) {
    super(options, getStoreFactory);
  }
}
if (typeof globalThis !== "undefined") {
  globalThis.createFileRoute = createFileRoute;
  globalThis.createLazyFileRoute = createLazyFileRoute;
} else if (typeof window !== "undefined") {
  window.createFileRoute = createFileRoute;
  window.createLazyFileRoute = createLazyFileRoute;
}
const MetaContext = createContext();
const cascadingTags = ["title", "meta"];
const titleTagProperties = [];
const metaTagProperties = (
  // https://html.spec.whatwg.org/multipage/semantics.html#the-meta-element
  ["name", "http-equiv", "content", "charset", "media"].concat(["property"])
);
const getTagKey = (tag, properties) => {
  const tagProps = Object.fromEntries(Object.entries(tag.props).filter(([k]) => properties.includes(k)).sort());
  if (Object.hasOwn(tagProps, "name") || Object.hasOwn(tagProps, "property")) {
    tagProps.name = tagProps.name || tagProps.property;
    delete tagProps.property;
  }
  return tag.tag + JSON.stringify(tagProps);
};
function initClientProvider() {
  if (!sharedConfig.context) {
    const ssrTags = document.head.querySelectorAll(`[data-sm]`);
    Array.prototype.forEach.call(ssrTags, (ssrTag) => ssrTag.parentNode.removeChild(ssrTag));
  }
  const cascadedTagInstances = /* @__PURE__ */ new Map();
  function getElement(tag) {
    if (tag.ref) {
      return tag.ref;
    }
    let el = document.querySelector(`[data-sm="${tag.id}"]`);
    if (el) {
      if (el.tagName.toLowerCase() !== tag.tag) {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
        el = document.createElement(tag.tag);
      }
      el.removeAttribute("data-sm");
    } else {
      el = document.createElement(tag.tag);
    }
    return el;
  }
  return {
    addTag(tag) {
      if (cascadingTags.indexOf(tag.tag) !== -1) {
        const properties = tag.tag === "title" ? titleTagProperties : metaTagProperties;
        const tagKey = getTagKey(tag, properties);
        if (!cascadedTagInstances.has(tagKey)) {
          cascadedTagInstances.set(tagKey, []);
        }
        let instances = cascadedTagInstances.get(tagKey);
        let index = instances.length;
        instances = [...instances, tag];
        cascadedTagInstances.set(tagKey, instances);
        let element2 = getElement(tag);
        tag.ref = element2;
        spread(element2, tag.props);
        let lastVisited = null;
        for (var i = index - 1; i >= 0; i--) {
          if (instances[i] != null) {
            lastVisited = instances[i];
            break;
          }
        }
        if (element2.parentNode != document.head) {
          document.head.appendChild(element2);
        }
        if (lastVisited && lastVisited.ref && lastVisited.ref.parentNode) {
          document.head.removeChild(lastVisited.ref);
        }
        return index;
      }
      let element = getElement(tag);
      tag.ref = element;
      spread(element, tag.props);
      if (element.parentNode != document.head) {
        document.head.appendChild(element);
      }
      return -1;
    },
    removeTag(tag, index) {
      const properties = tag.tag === "title" ? titleTagProperties : metaTagProperties;
      const tagKey = getTagKey(tag, properties);
      if (tag.ref) {
        const t = cascadedTagInstances.get(tagKey);
        if (t) {
          if (tag.ref.parentNode) {
            tag.ref.parentNode.removeChild(tag.ref);
            for (let i = index - 1; i >= 0; i--) {
              if (t[i] != null) {
                document.head.appendChild(t[i].ref);
              }
            }
          }
          t[index] = null;
          cascadedTagInstances.set(tagKey, t);
        } else {
          if (tag.ref.parentNode) {
            tag.ref.parentNode.removeChild(tag.ref);
          }
        }
      }
    }
  };
}
function initServerProvider() {
  const tags = [];
  useAssets(() => ssr(renderTags(tags)));
  return {
    addTag(tagDesc) {
      if (cascadingTags.indexOf(tagDesc.tag) !== -1) {
        const properties = tagDesc.tag === "title" ? titleTagProperties : metaTagProperties;
        const tagDescKey = getTagKey(tagDesc, properties);
        const index = tags.findIndex((prev) => prev.tag === tagDesc.tag && getTagKey(prev, properties) === tagDescKey);
        if (index !== -1) {
          tags.splice(index, 1);
        }
      }
      tags.push(tagDesc);
      return tags.length;
    },
    removeTag(tag, index) {
    }
  };
}
const MetaProvider = (props) => {
  const actions = !isServer ? initClientProvider() : initServerProvider();
  return createComponent(MetaContext.Provider, {
    value: actions,
    get children() {
      return props.children;
    }
  });
};
const MetaTag = (tag, props, setting) => {
  useHead({
    tag,
    props,
    setting,
    id: createUniqueId(),
    get name() {
      return props.name || props.property;
    }
  });
  return null;
};
function useHead(tagDesc) {
  const c = useContext(MetaContext);
  if (!c) throw new Error("<MetaProvider /> should be in the tree");
  createRenderEffect(() => {
    const index = c.addTag(tagDesc);
    onCleanup(() => c.removeTag(tagDesc, index));
  });
}
function renderTags(tags) {
  return tags.map((tag) => {
    const keys = Object.keys(tag.props);
    const props = keys.map((k) => k === "children" ? "" : ` ${k}="${// @ts-expect-error
    escape(tag.props[k], true)}"`).join("");
    let children = tag.props.children;
    if (Array.isArray(children)) {
      children = children.join("");
    }
    if (tag.setting?.close) {
      return `<${tag.tag} data-sm="${tag.id}"${props}>${// @ts-expect-error
      tag.setting?.escape ? escape(children) : children || ""}</${tag.tag}>`;
    }
    return `<${tag.tag} data-sm="${tag.id}"${props}/>`;
  }).join("");
}
const Title = (props) => MetaTag("title", props, {
  escape: true,
  close: true
});
const Style = (props) => MetaTag("style", props, {
  close: true
});
const Meta = (props) => MetaTag("meta", props);
const Link = (props) => MetaTag("link", props);
function Asset({
  tag,
  attrs,
  children
}) {
  switch (tag) {
    case "title":
      return createComponent(Title, mergeProps(attrs, {
        children
      }));
    case "meta":
      return createComponent(Meta, attrs);
    case "link":
      return createComponent(Link, attrs);
    case "style":
      return createComponent(Style, mergeProps(attrs, {
        children
      }));
    case "script":
      return createComponent(Script, {
        attrs,
        children
      });
    default:
      return null;
  }
}
function Script({
  attrs,
  children
}) {
  useRouter();
  const dataScript = typeof attrs?.type === "string" && attrs.type !== "" && attrs.type !== "text/javascript" && attrs.type !== "module";
  onMount(() => {
    if (dataScript) return;
    if (attrs?.src) {
      const normSrc = (() => {
        try {
          const base = document.baseURI || window.location.href;
          return new URL(attrs.src, base).href;
        } catch {
          return attrs.src;
        }
      })();
      const existingScript = Array.from(document.querySelectorAll("script[src]")).find((el) => el.src === normSrc);
      if (existingScript) {
        return;
      }
      const script = document.createElement("script");
      for (const [key, value] of Object.entries(attrs)) {
        if (value !== void 0 && value !== false) {
          script.setAttribute(key, typeof value === "boolean" ? "" : String(value));
        }
      }
      document.head.appendChild(script);
      onCleanup(() => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    }
    if (typeof children === "string") {
      const typeAttr = typeof attrs?.type === "string" ? attrs.type : "text/javascript";
      const nonceAttr = typeof attrs?.nonce === "string" ? attrs.nonce : void 0;
      const existingScript = Array.from(document.querySelectorAll("script:not([src])")).find((el) => {
        if (!(el instanceof HTMLScriptElement)) return false;
        const sType = el.getAttribute("type") ?? "text/javascript";
        const sNonce = el.getAttribute("nonce") ?? void 0;
        return el.textContent === children && sType === typeAttr && sNonce === nonceAttr;
      });
      if (existingScript) {
        return;
      }
      const script = document.createElement("script");
      script.textContent = children;
      if (attrs) {
        for (const [key, value] of Object.entries(attrs)) {
          if (value !== void 0 && value !== false) {
            script.setAttribute(key, typeof value === "boolean" ? "" : String(value));
          }
        }
      }
      document.head.appendChild(script);
      onCleanup(() => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    }
  });
  if (attrs?.src && typeof attrs.src === "string") {
    return ssrElement("script", attrs, void 0, true);
  }
  if (typeof children === "string") {
    return ssrElement("script", mergeProps(attrs, {
      innerHTML: children
    }), void 0, true);
  }
  return null;
}
const useTags = (assetCrossOrigin) => {
  const router = useRouter();
  const nonce = router.options.ssr?.nonce;
  const activeMatches = Solid.createMemo(() => router.stores.activeMatchesSnapshot.state);
  const routeMeta = Solid.createMemo(() => activeMatches().map((match) => match.meta).filter(Boolean));
  const meta = Solid.createMemo(() => {
    const resultMeta = [];
    const metaByAttribute = {};
    let title;
    const routeMetasArray = routeMeta();
    for (let i = routeMetasArray.length - 1; i >= 0; i--) {
      const metas = routeMetasArray[i];
      for (let j = metas.length - 1; j >= 0; j--) {
        const m = metas[j];
        if (!m) continue;
        if (m.title) {
          if (!title) {
            title = {
              tag: "title",
              children: m.title
            };
          }
        } else if ("script:ld+json" in m) {
          try {
            const json = JSON.stringify(m["script:ld+json"]);
            resultMeta.push({
              tag: "script",
              attrs: {
                type: "application/ld+json"
              },
              children: escapeHtml(json)
            });
          } catch {
          }
        } else {
          const attribute = m.name ?? m.property;
          if (attribute) {
            if (metaByAttribute[attribute]) {
              continue;
            } else {
              metaByAttribute[attribute] = true;
            }
          }
          resultMeta.push({
            tag: "meta",
            attrs: {
              ...m,
              nonce
            }
          });
        }
      }
    }
    if (title) {
      resultMeta.push(title);
    }
    if (router.options.ssr?.nonce) {
      resultMeta.push({
        tag: "meta",
        attrs: {
          property: "csp-nonce",
          content: router.options.ssr.nonce
        }
      });
    }
    resultMeta.reverse();
    return resultMeta;
  });
  const links = Solid.createMemo(() => {
    const matches = activeMatches();
    const constructed = matches.map((match) => match.links).filter(Boolean).flat(1).map((link) => ({
      tag: "link",
      attrs: {
        ...link,
        nonce
      }
    }));
    const manifest = router.ssr?.manifest;
    const assets = matches.map((match) => manifest?.routes[match.routeId]?.assets ?? []).filter(Boolean).flat(1).filter((asset) => asset.tag === "link").map((asset) => ({
      tag: "link",
      attrs: {
        ...asset.attrs,
        crossOrigin: getAssetCrossOrigin(assetCrossOrigin, "stylesheet") ?? asset.attrs?.crossOrigin,
        nonce
      }
    }));
    return [...constructed, ...assets];
  });
  const preloadLinks = Solid.createMemo(() => {
    const matches = activeMatches();
    const preloadLinks2 = [];
    matches.map((match) => router.looseRoutesById[match.routeId]).forEach((route) => router.ssr?.manifest?.routes[route.id]?.preloads?.filter(Boolean).forEach((preload) => {
      const preloadLink = resolveManifestAssetLink(preload);
      preloadLinks2.push({
        tag: "link",
        attrs: {
          rel: "modulepreload",
          href: preloadLink.href,
          crossOrigin: getAssetCrossOrigin(assetCrossOrigin, "modulepreload") ?? preloadLink.crossOrigin,
          nonce
        }
      });
    }));
    return preloadLinks2;
  });
  const styles = Solid.createMemo(() => activeMatches().map((match) => match.styles).flat(1).filter(Boolean).map(({
    children,
    ...style
  }) => ({
    tag: "style",
    attrs: {
      ...style,
      nonce
    },
    children
  })));
  const headScripts = Solid.createMemo(() => activeMatches().map((match) => match.headScripts).flat(1).filter(Boolean).map(({
    children,
    ...script
  }) => ({
    tag: "script",
    attrs: {
      ...script,
      nonce
    },
    children
  })));
  return Solid.createMemo((prev) => {
    const next = uniqBy([...meta(), ...preloadLinks(), ...links(), ...styles(), ...headScripts()], (d) => {
      return JSON.stringify(d);
    });
    if (prev === void 0) {
      return next;
    }
    return replaceEqualDeep(prev, next);
  });
};
function uniqBy(arr, fn) {
  const seen = /* @__PURE__ */ new Set();
  return arr.filter((item) => {
    const key = fn(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}
function HeadContent(props) {
  const tags = useTags(props.assetCrossOrigin);
  return createComponent(MetaProvider, {
    get children() {
      return createComponent(For, {
        get each() {
          return tags();
        },
        children: (tag) => createComponent(Asset, tag)
      });
    }
  });
}
const Scripts = () => {
  const router = useRouter();
  const nonce = router.options.ssr?.nonce;
  const activeMatches = Solid.createMemo(() => router.stores.activeMatchesSnapshot.state);
  const assetScripts = Solid.createMemo(() => {
    const assetScripts2 = [];
    const manifest = router.ssr?.manifest;
    if (!manifest) {
      return [];
    }
    activeMatches().map((match) => router.looseRoutesById[match.routeId]).forEach((route) => manifest.routes[route.id]?.assets?.filter((d) => d.tag === "script").forEach((asset) => {
      assetScripts2.push({
        tag: "script",
        attrs: {
          ...asset.attrs,
          nonce
        },
        children: asset.children
      });
    }));
    return assetScripts2;
  });
  const scripts = Solid.createMemo(() => activeMatches().map((match) => match.scripts).flat(1).filter(Boolean).map(({
    children,
    ...script
  }) => ({
    tag: "script",
    attrs: {
      ...script,
      nonce
    },
    children
  })));
  let serverBufferedScript = void 0;
  if (router.serverSsr) {
    serverBufferedScript = router.serverSsr.takeBufferedScripts();
  }
  const allScripts = [...scripts(), ...assetScripts()];
  if (serverBufferedScript) {
    allScripts.unshift(serverBufferedScript);
  }
  return allScripts.map((asset, i) => createComponent(Asset, asset));
};
var _tmpl$2$1 = ["<svg", ' viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path></svg>'], _tmpl$5 = ["<svg", ' viewBox="0 0 24 24" fill="none" style="', '"><g clip-path="url(#clip0_list_sparkle)"><path d="M11.5 12L5.5 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M18.5 6.75L5.5 6.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M9.25 17.25L5.5 17.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M16 12.75L16.5179 13.9677C16.8078 14.6494 17.3506 15.1922 18.0323 15.4821L19.25 16L18.0323 16.5179C17.3506 16.8078 16.8078 17.3506 16.5179 18.0323L16 19.25L15.4821 18.0323C15.1922 17.3506 14.6494 16.8078 13.9677 16.5179L12.75 16L13.9677 15.4821C14.6494 15.1922 15.1922 14.6494 15.4821 13.9677L16 12.75Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path></g><defs><clipPath id="clip0_list_sparkle"><rect width="24" height="24" fill="white"></rect></clipPath></defs></svg>'], _tmpl$6 = '<circle cx="10" cy="10" r="5.375" stroke="currentColor" stroke-width="1.25"></circle>', _tmpl$7 = '<path d="M8.5 8.5C8.73 7.85 9.31 7.49 10 7.5C10.86 7.51 11.5 8.13 11.5 9C11.5 10.08 10 10.5 10 10.5V10.75" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"></path>', _tmpl$8 = '<circle cx="10" cy="12.625" r="0.625" fill="currentColor"></circle>', _tmpl$1 = ["<svg", ' viewBox="0 0 24 24" fill="none" style="', '"><g class="', '"><path d="M4.75 11.25C4.75 10.4216 5.42157 9.75 6.25 9.75H12.75C13.5784 9.75 14.25 10.4216 14.25 11.25V17.75C14.25 18.5784 13.5784 19.25 12.75 19.25H6.25C5.42157 19.25 4.75 18.5784 4.75 17.75V11.25Z" stroke="currentColor" stroke-width="1.5"></path><path d="M17.25 14.25H17.75C18.5784 14.25 19.25 13.5784 19.25 12.75V6.25C19.25 5.42157 18.5784 4.75 17.75 4.75H11.25C10.4216 4.75 9.75 5.42157 9.75 6.25V6.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path></g><g class="', '"><path d="M12 20C7.58172 20 4 16.4182 4 12C4 7.58172 7.58172 4 12 4C16.4182 4 20 7.58172 20 12C20 16.4182 16.4182 20 12 20Z" stroke="var(--agentation-color-green)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M15 10L11 14.25L9.25 12.25" stroke="var(--agentation-color-green)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></g></svg>'], _tmpl$10 = ["<svg", ' viewBox="0 0 24 24" fill="none"><g class="', '"><path d="M9.875 14.125L12.3506 19.6951C12.7184 20.5227 13.9091 20.4741 14.2083 19.6193L18.8139 6.46032C19.0907 5.6695 18.3305 4.90933 17.5397 5.18611L4.38072 9.79174C3.52589 10.0909 3.47731 11.2816 4.30494 11.6494L9.875 14.125ZM9.875 14.125L13.375 10.625" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></g><g class="', '"><path d="M12 20C7.58172 20 4 16.4182 4 12C4 7.58172 7.58172 4 12 4C16.4182 4 20 7.58172 20 12C20 16.4182 16.4182 20 12 20Z" stroke="var(--agentation-color-green)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M15 10L11 14.25L9.25 12.25" stroke="var(--agentation-color-green)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></g><g class="', '"><path d="M12 20C7.58172 20 4 16.4182 4 12C4 7.58172 7.58172 4 12 4C16.4182 4 20 7.58172 20 12C20 16.4182 16.4182 20 12 20Z" stroke="var(--agentation-color-red)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 8V12" stroke="var(--agentation-color-red)" stroke-width="1.5" stroke-linecap="round"></path><circle cx="12" cy="15" r="0.5" fill="var(--agentation-color-red)" stroke="var(--agentation-color-red)" stroke-width="1"></circle></g></svg>'], _tmpl$15 = ["<svg", ' viewBox="0 0 24 24" fill="none"><g class="', '"><path d="M3.91752 12.7539C3.65127 12.2996 3.65037 11.7515 3.9149 11.2962C4.9042 9.59346 7.72688 5.49994 12 5.49994C16.2731 5.49994 19.0958 9.59346 20.0851 11.2962C20.3496 11.7515 20.3487 12.2996 20.0825 12.7539C19.0908 14.4459 16.2694 18.4999 12 18.4999C7.73064 18.4999 4.90918 14.4459 3.91752 12.7539Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 14.8261C13.5608 14.8261 14.8261 13.5608 14.8261 12C14.8261 10.4392 13.5608 9.17392 12 9.17392C10.4392 9.17392 9.17391 10.4392 9.17391 12C9.17391 13.5608 10.4392 14.8261 12 14.8261Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></g><g class="', '"><path d="M18.6025 9.28503C18.9174 8.9701 19.4364 8.99481 19.7015 9.35271C20.1484 9.95606 20.4943 10.507 20.7342 10.9199C21.134 11.6086 21.1329 12.4454 20.7303 13.1328C20.2144 14.013 19.2151 15.5225 17.7723 16.8193C16.3293 18.1162 14.3852 19.2497 12.0008 19.25C11.4192 19.25 10.8638 19.1823 10.3355 19.0613C9.77966 18.934 9.63498 18.2525 10.0382 17.8493C10.2412 17.6463 10.5374 17.573 10.8188 17.6302C11.1993 17.7076 11.5935 17.75 12.0008 17.75C13.8848 17.7497 15.4867 16.8568 16.7693 15.7041C18.0522 14.5511 18.9606 13.1867 19.4363 12.375C19.5656 12.1543 19.5659 11.8943 19.4373 11.6729C19.2235 11.3049 18.921 10.8242 18.5364 10.3003C18.3085 9.98991 18.3302 9.5573 18.6025 9.28503ZM12.0008 4.75C12.5814 4.75006 13.1358 4.81803 13.6632 4.93953C14.2182 5.06741 14.362 5.74812 13.9593 6.15091C13.7558 6.35435 13.4589 6.42748 13.1771 6.36984C12.7983 6.29239 12.4061 6.25006 12.0008 6.25C10.1167 6.25 8.51415 7.15145 7.23028 8.31543C5.94678 9.47919 5.03918 10.8555 4.56426 11.6729C4.43551 11.8945 4.43582 12.1542 4.56524 12.375C4.77587 12.7343 5.07189 13.2012 5.44718 13.7105C5.67623 14.0213 5.65493 14.4552 5.38193 14.7282C5.0671 15.0431 4.54833 15.0189 4.28292 14.6614C3.84652 14.0736 3.50813 13.5369 3.27129 13.1328C2.86831 12.4451 2.86717 11.6088 3.26739 10.9199C3.78185 10.0345 4.77959 8.51239 6.22247 7.2041C7.66547 5.89584 9.61202 4.75 12.0008 4.75Z" fill="currentColor"></path><path d="M5 19L19 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path></g></svg>'], _tmpl$16 = ["<svg", ' viewBox="0 0 24 24" fill="none"><g class="', '"><path d="M8 6L8 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path><path d="M16 18L16 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path></g><path class="', '" d="M17.75 10.701C18.75 11.2783 18.75 12.7217 17.75 13.299L8.75 18.4952C7.75 19.0725 6.5 18.3509 6.5 17.1962L6.5 6.80384C6.5 5.64914 7.75 4.92746 8.75 5.50481L17.75 10.701Z" stroke="currentColor" stroke-width="1.5"></path></svg>'], _tmpl$18 = ["<svg", ' viewBox="0 0 24 24" fill="none"><path d="M10.6504 5.81117C10.9939 4.39628 13.0061 4.39628 13.3496 5.81117C13.5715 6.72517 14.6187 7.15891 15.4219 6.66952C16.6652 5.91193 18.0881 7.33479 17.3305 8.57815C16.8411 9.38134 17.2748 10.4285 18.1888 10.6504C19.6037 10.9939 19.6037 13.0061 18.1888 13.3496C17.2748 13.5715 16.8411 14.6187 17.3305 15.4219C18.0881 16.6652 16.6652 18.0881 15.4219 17.3305C14.6187 16.8411 13.5715 17.2748 13.3496 18.1888C13.0061 19.6037 10.9939 19.6037 10.6504 18.1888C10.4285 17.2748 9.38135 16.8411 8.57815 17.3305C7.33479 18.0881 5.91193 16.6652 6.66952 15.4219C7.15891 14.6187 6.72517 13.5715 5.81117 13.3496C4.39628 13.0061 4.39628 10.9939 5.81117 10.6504C6.72517 10.4285 7.15891 9.38134 6.66952 8.57815C5.91193 7.33479 7.33479 5.91192 8.57815 6.66952C9.38135 7.15891 10.4285 6.72517 10.6504 5.81117Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><circle cx="12" cy="12" r="2.5" stroke="currentColor" stroke-width="1.5"></circle></svg>'], _tmpl$22 = ["<svg", ' viewBox="0 0 24 24" fill="none"><path d="M13.5 4C14.7426 4 15.75 5.00736 15.75 6.25V7H18.5C18.9142 7 19.25 7.33579 19.25 7.75C19.25 8.16421 18.9142 8.5 18.5 8.5H17.9678L17.6328 16.2217C17.61 16.7475 17.5912 17.1861 17.5469 17.543C17.5015 17.9087 17.4225 18.2506 17.2461 18.5723C16.9747 19.0671 16.5579 19.4671 16.0518 19.7168C15.7227 19.8791 15.3772 19.9422 15.0098 19.9717C14.6514 20.0004 14.2126 20 13.6865 20H10.3135C9.78735 20 9.34856 20.0004 8.99023 19.9717C8.62278 19.9422 8.27729 19.8791 7.94824 19.7168C7.44205 19.4671 7.02532 19.0671 6.75391 18.5723C6.57751 18.2506 6.49853 17.9087 6.45312 17.543C6.40883 17.1861 6.39005 16.7475 6.36719 16.2217L6.03223 8.5H5.5C5.08579 8.5 4.75 8.16421 4.75 7.75C4.75 7.33579 5.08579 7 5.5 7H8.25V6.25C8.25 5.00736 9.25736 4 10.5 4H13.5ZM7.86621 16.1562C7.89013 16.7063 7.90624 17.0751 7.94141 17.3584C7.97545 17.6326 8.02151 17.7644 8.06934 17.8516C8.19271 18.0763 8.38239 18.2577 8.6123 18.3711C8.70153 18.4151 8.83504 18.4545 9.11035 18.4766C9.39482 18.4994 9.76335 18.5 10.3135 18.5H13.6865C14.2367 18.5 14.6052 18.4994 14.8896 18.4766C15.165 18.4545 15.2985 18.4151 15.3877 18.3711C15.6176 18.2577 15.8073 18.0763 15.9307 17.8516C15.9785 17.7644 16.0245 17.6326 16.0586 17.3584C16.0938 17.0751 16.1099 16.7063 16.1338 16.1562L16.4668 8.5H7.5332L7.86621 16.1562ZM9.97656 10.75C10.3906 10.7371 10.7371 11.0626 10.75 11.4766L10.875 15.4766C10.8879 15.8906 10.5624 16.2371 10.1484 16.25C9.73443 16.2629 9.38794 15.9374 9.375 15.5234L9.25 11.5234C9.23706 11.1094 9.56255 10.7629 9.97656 10.75ZM14.0244 10.75C14.4384 10.7635 14.7635 11.1105 14.75 11.5244L14.6201 15.5244C14.6066 15.9384 14.2596 16.2634 13.8457 16.25C13.4317 16.2365 13.1067 15.8896 13.1201 15.4756L13.251 11.4756C13.2645 11.0617 13.6105 10.7366 14.0244 10.75ZM10.5 5.5C10.0858 5.5 9.75 5.83579 9.75 6.25V7H14.25V6.25C14.25 5.83579 13.9142 5.5 13.5 5.5H10.5Z" fill="currentColor"></path></svg>'], _tmpl$27 = ["<svg", ' viewBox="0 0 24 24" fill="none"><g clip-path="url(#clip0_2_53)"><path d="M16.25 16.25L7.75 7.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M7.75 16.25L16.25 7.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></g><defs><clipPath id="clip0_2_53"><rect width="24" height="24" fill="white"></rect></clipPath></defs></svg>'], _tmpl$28 = ["<svg", ' viewBox="0 0 24 24" fill="none"><path d="M16.7198 6.21973C17.0127 5.92683 17.4874 5.92683 17.7803 6.21973C18.0732 6.51262 18.0732 6.9874 17.7803 7.28027L13.0606 12L17.7803 16.7197C18.0732 17.0126 18.0732 17.4874 17.7803 17.7803C17.4875 18.0731 17.0127 18.0731 16.7198 17.7803L12.0001 13.0605L7.28033 17.7803C6.98746 18.0731 6.51268 18.0731 6.21979 17.7803C5.92689 17.4874 5.92689 17.0126 6.21979 16.7197L10.9395 12L6.21979 7.28027C5.92689 6.98738 5.92689 6.51262 6.21979 6.21973C6.51268 5.92683 6.98744 5.92683 7.28033 6.21973L12.0001 10.9395L16.7198 6.21973Z" fill="currentColor"></path></svg>'], _tmpl$29 = ["<svg", ' viewBox="0 0 20 20" fill="none"><path d="M9.99999 12.7082C11.4958 12.7082 12.7083 11.4956 12.7083 9.99984C12.7083 8.50407 11.4958 7.2915 9.99999 7.2915C8.50422 7.2915 7.29166 8.50407 7.29166 9.99984C7.29166 11.4956 8.50422 12.7082 9.99999 12.7082Z" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10 3.9585V5.05698" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10 14.9429V16.0414" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"></path><path d="M5.7269 5.72656L6.50682 6.50649" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"></path><path d="M13.4932 13.4932L14.2731 14.2731" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"></path><path d="M3.95834 10H5.05683" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"></path><path d="M14.9432 10H16.0417" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"></path><path d="M5.7269 14.2731L6.50682 13.4932" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"></path><path d="M13.4932 6.50649L14.2731 5.72656" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"></path></svg>'], _tmpl$30 = ["<svg", ' viewBox="0 0 20 20" fill="none"><path d="M15.5 10.4955C15.4037 11.5379 15.0124 12.5314 14.3721 13.3596C13.7317 14.1878 12.8688 14.8165 11.8841 15.1722C10.8995 15.5278 9.83397 15.5957 8.81217 15.3679C7.79038 15.1401 6.8546 14.6259 6.11434 13.8857C5.37408 13.1454 4.85995 12.2096 4.63211 11.1878C4.40427 10.166 4.47215 9.10048 4.82781 8.11585C5.18346 7.13123 5.81218 6.26825 6.64039 5.62791C7.4686 4.98756 8.46206 4.59634 9.5045 4.5C8.89418 5.32569 8.60049 6.34302 8.67685 7.36695C8.75321 8.39087 9.19454 9.35339 9.92058 10.0794C10.6466 10.8055 11.6091 11.2468 12.6331 11.3231C13.657 11.3995 14.6743 11.1058 15.5 10.4955Z" stroke="currentColor" stroke-width="1.13793" stroke-linecap="round" stroke-linejoin="round"></path></svg>'], _tmpl$31 = ["<svg", ' viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.3799 6.9572L9.05645 4.63375M11.3799 6.9572L6.74949 11.5699C6.61925 11.6996 6.45577 11.791 6.277 11.8339L4.29549 12.3092C3.93194 12.3964 3.60478 12.0683 3.69297 11.705L4.16585 9.75693C4.20893 9.57947 4.29978 9.4172 4.42854 9.28771L9.05645 4.63375M11.3799 6.9572L12.3455 5.98759C12.9839 5.34655 12.9839 4.31002 12.3455 3.66897C11.7033 3.02415 10.6594 3.02415 10.0172 3.66897L9.06126 4.62892L9.05645 4.63375" stroke="currentColor" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round"></path></svg>'], _tmpl$32 = ["<svg", ' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 4C14.7426 4 15.75 5.00736 15.75 6.25V7H18.5C18.9142 7 19.25 7.33579 19.25 7.75C19.25 8.16421 18.9142 8.5 18.5 8.5H17.9678L17.6328 16.2217C17.61 16.7475 17.5912 17.1861 17.5469 17.543C17.5015 17.9087 17.4225 18.2506 17.2461 18.5723C16.9747 19.0671 16.5579 19.4671 16.0518 19.7168C15.7227 19.8791 15.3772 19.9422 15.0098 19.9717C14.6514 20.0004 14.2126 20 13.6865 20H10.3135C9.78735 20 9.34856 20.0004 8.99023 19.9717C8.62278 19.9422 8.27729 19.8791 7.94824 19.7168C7.44205 19.4671 7.02532 19.0671 6.75391 18.5723C6.57751 18.2506 6.49853 17.9087 6.45312 17.543C6.40883 17.1861 6.39005 16.7475 6.36719 16.2217L6.03223 8.5H5.5C5.08579 8.5 4.75 8.16421 4.75 7.75C4.75 7.33579 5.08579 7 5.5 7H8.25V6.25C8.25 5.00736 9.25736 4 10.5 4H13.5ZM7.86621 16.1562C7.89013 16.7063 7.90624 17.0751 7.94141 17.3584C7.97545 17.6326 8.02151 17.7644 8.06934 17.8516C8.19271 18.0763 8.38239 18.2577 8.6123 18.3711C8.70153 18.4151 8.83504 18.4545 9.11035 18.4766C9.39482 18.4994 9.76335 18.5 10.3135 18.5H13.6865C14.2367 18.5 14.6052 18.4994 14.8896 18.4766C15.165 18.4545 15.2985 18.4151 15.3877 18.3711C15.6176 18.2577 15.8073 18.0763 15.9307 17.8516C15.9785 17.7644 16.0245 17.6326 16.0586 17.3584C16.0938 17.0751 16.1099 16.7063 16.1338 16.1562L16.4668 8.5H7.5332L7.86621 16.1562ZM9.97656 10.75C10.3906 10.7371 10.7371 11.0626 10.75 11.4766L10.875 15.4766C10.8879 15.8906 10.5624 16.2371 10.1484 16.25C9.73443 16.2629 9.38794 15.9374 9.375 15.5234L9.25 11.5234C9.23706 11.1094 9.56255 10.7629 9.97656 10.75ZM14.0244 10.75C14.4383 10.7635 14.7635 11.1105 14.75 11.5244L14.6201 15.5244C14.6066 15.9384 14.2596 16.2634 13.8457 16.25C13.4317 16.2365 13.1067 15.8896 13.1201 15.4756L13.251 11.4756C13.2645 11.0617 13.6105 10.7366 14.0244 10.75ZM10.5 5.5C10.0858 5.5 9.75 5.83579 9.75 6.25V7H14.25V6.25C14.25 5.83579 13.9142 5.5 13.5 5.5H10.5Z" fill="currentColor"></path></svg>'], _tmpl$33 = ["<svg", ' viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.5 3.5L4 8L8.5 12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>'], _tmpl$36 = ["<svg", ' viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5"></rect><line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" stroke-width="1.5"></line><line x1="9" y1="9" x2="9" y2="21" stroke="currentColor" stroke-width="1.5"></line></svg>'], _tmpl$37 = ["<button", ' type="button"><svg class="', '" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 10.25L9 7.25L5.75 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg><span', ">", "</span></button>"], _tmpl$38 = ["<span", ">", "</span>"], _tmpl$39 = ["<div", ' class="', '"><div', "><div", ">", "</div></div></div>"], _tmpl$40 = ["<div", ">&ldquo;<!--$-->", "<!--/--><!--$-->", "<!--/-->&rdquo;</div>"], _tmpl$41 = ["<div", "><button", ' type="button">', "</button></div>"], _tmpl$42 = ["<div", ' data-annotation-popup style="', '"><div', "><!--$-->", "<!--/--><!--$-->", "<!--/--></div><!--$-->", "<!--/--><!--$-->", "<!--/--><textarea", ' style="', '"', ' rows="2"></textarea><div', "><!--$-->", "<!--/--><button", ">Cancel</button><button", ' style="', '"', ">", "</button></div></div>"], _tmpl$43 = ["<div", "><span", ">", "</span>: <span", ">", "</span>;</div>"], _tmpl$44 = ["<div", ' data-feedback-toolbar style="', '">', "</div>"], _tmpl$45 = ["<div", ' style="', '"></div>'], _tmpl$46 = ["<div", ' style="', '"><!--$-->', '<!--/--><div style="', '"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--></div><!--$-->", "<!--/--></div>"], _tmpl$47 = ["<div", ' style="', '"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--></div>"], _tmpl$48 = ["<span", ' style="', '">', "</span>"], _tmpl$49 = ["<div", ' style="', '"><!--$-->', "<!--/--><!--$-->", "<!--/--></div>"], _tmpl$50 = ["<div", ' style="', '">', "</div>"], _tmpl$51 = ["<div", ' style="', '"><div style="', '"><!--$-->', '<!--/--><div style="', '"></div></div><div style="', '"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", '<!--/--></div><div style="', '"><!--$-->', "<!--/--><!--$-->", "<!--/--></div></div>"], _tmpl$52 = ["<div", ' style="', '"><div style="', '"></div><div style="', '"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--></div></div>"], _tmpl$53 = ["<div", ' style="', '"><svg width="100%" height="100%" viewBox="', '" preserveAspectRatio="none" fill="none"><line x1="0" y1="0"', ' stroke="var(--agd-stroke)" stroke-width="1"></line><line', ' y1="0" x2="0"', ' stroke="var(--agd-stroke)" stroke-width="1"></line><circle', ' fill="var(--agd-fill)" stroke="var(--agd-stroke)" stroke-width="0.8"></circle></svg></div>'], _tmpl$54 = ["<div", ' style="', '"><div style="', '">', "</div><!--$-->", "<!--/--></div>"], _tmpl$55 = ["<div", ' style="', '"><!--$-->', '<!--/--><div style="', '">', "</div></div>"], _tmpl$56 = ["<div", ' style="', '"><div style="', '">', '</div><div style="', '"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--></div></div>"], _tmpl$57 = ["<svg", ' width="100%" height="100%" viewBox="', '" fill="none"><circle', ' stroke="var(--agd-stroke)" fill="var(--agd-fill)" stroke-width="1.5" stroke-dasharray="3 2"></circle><circle', ' stroke="var(--agd-stroke)" fill="var(--agd-fill)" stroke-width="0.8"></circle><path d="', '" stroke="var(--agd-stroke)" fill="var(--agd-fill)" stroke-width="0.8"></path></svg>'], _tmpl$58 = ["<div", ' style="', '"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", '<!--/--><div style="', '"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--></div></div>"], _tmpl$59 = ["<div", ' style="', '"><div style="', '">', '</div><div style="', '">', "</div></div>"], _tmpl$60 = ["<svg", ' width="100%" height="100%" viewBox="', '" fill="none"><rect x="1" y="1"', ' stroke="var(--agd-stroke)" stroke-width="1"></rect><circle', ' fill="var(--agd-bar)"></circle></svg>'], _tmpl$61 = ["<div", ' style="', '"><!--$-->', '<!--/--><div style="', '"><!--$-->', "<!--/--><!--$-->", '<!--/--></div><div style="', '"></div></div>'], _tmpl$62 = ["<svg", ' width="100%" height="100%" viewBox="', '" fill="none"><rect x="0" y="0"', ' stroke="var(--agd-stroke)" stroke-width="0.8"></rect><rect x="1" y="1"', ' fill="var(--agd-bar)"></rect></svg>'], _tmpl$63 = ["<div", ' style="', '"><!--$-->', '<!--/--><div style="', '"><div style="', '"></div></div></div>'], _tmpl$64 = ["<div", ' style="', '"><div style="', '">', '</div><div style="', '"></div></div>'], _tmpl$65 = ["<span", ' style="', '">/</span>'], _tmpl$66 = ["<div", ' style="', '"><div style="', '"></div></div>'], _tmpl$67 = ["<div", ' style="', '"><!--$-->', '<!--/--><span style="', '">', "</span></div>"], _tmpl$68 = ["<div", ' style="', '"><div style="', '"><span style="', '">‹</span><!--$-->', '<!--/--><span style="', '">›</span></div><div style="', '"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--></div></div>"], _tmpl$69 = ["<div", ' style="', '"><!--$-->', "<!--/--><!--$-->", '<!--/--><div style="', '">', "</div><!--$-->", "<!--/--></div>"], _tmpl$70 = ["<div", ' style="', '"><span style="', '">&ldquo;</span><div style="', '"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", '<!--/--></div><div style="', '"><!--$-->', '<!--/--><div style="', '"><!--$-->', "<!--/--><!--$-->", "<!--/--></div></div></div>"], _tmpl$71 = ["<div", ' style="', '"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--></div>"], _tmpl$72 = ["<div", ' style="', '"><div style="', '"><div style="', '"></div></div><div style="', '"><!--$-->', "<!--/--><!--$-->", "<!--/--></div></div>"], _tmpl$73 = ["<div", ' style="', '"><div style="', '"></div><!--$-->', "<!--/--></div>"], _tmpl$74 = ["<div", ' style="', '"><!--$-->', '<!--/--><div style="', '"></div></div>'], _tmpl$75 = ["<svg", ' viewBox="0 0 16 16" fill="none"><path d="M8 1.5l2 4 4.5.7-3.25 3.1.75 4.5L8 11.4l-4 2.4.75-4.5L1.5 6.2 6 5.5z" stroke="var(--agd-stroke)" stroke-width="0.8"', "></path></svg>"], _tmpl$76 = ["<div", ' style="', '"><svg width="100%" height="100%" viewBox="', '" fill="none" style="', '"><line x1="0"', ' stroke="var(--agd-stroke)" stroke-width="0.5" opacity=".2"></line><line x1="0"', ' stroke="var(--agd-stroke)" stroke-width="0.5" opacity=".15"></line><line', ' y1="0"', ' stroke="var(--agd-stroke)" stroke-width="0.5" opacity=".15"></line></svg><div style="', '"><svg width="16" height="22" viewBox="0 0 16 22" fill="none"><path d="M8 0C3.6 0 0 3.6 0 8c0 6 8 14 8 14s8-8 8-14c0-4.4-3.6-8-8-8z" fill="var(--agd-bar)" opacity=".4"></path><circle cx="8" cy="8" r="3" fill="var(--agd-fill)"></circle></svg></div></div>'], _tmpl$77 = ["<div", ' style="', '"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 16V4m0 0l-4 4m4-4l4 4" stroke="var(--agd-stroke)" stroke-width="1.5"></path><path d="M4 17v2a1 1 0 001 1h14a1 1 0 001-1v-2" stroke="var(--agd-stroke)" stroke-width="1.5"></path></svg><!--$-->', "<!--/--><!--$-->", "<!--/--></div>"], _tmpl$78 = ["<div", ' style="', '"><div style="', '"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--></div><!--$-->", "<!--/--></div>"], _tmpl$79 = ["<div", ' style="', '"><div style="', '"><span style="', '">‹</span><!--$-->', '<!--/--><span style="', '">›</span></div><div style="', '"><!--$-->', "<!--/--><!--$-->", "<!--/--></div></div>"], _tmpl$80 = ["<div", ' style="', '"><div style="', '"><div style="', '"></div></div></div>'], _tmpl$81 = ["<div", ' style="', '"><!--$-->', '<!--/--><div style="', '"><!--$-->', "<!--/--><!--$-->", "<!--/--></div><!--$-->", "<!--/--></div>"], _tmpl$82 = ["<div", ' style="', '"><div style="', '"></div><div style="', '"><!--$-->', "<!--/--><!--$-->", '<!--/--><div style="', '"></div><div style="', '"><!--$-->', "<!--/--><!--$-->", "<!--/--></div></div></div>"], _tmpl$83 = ["<div", ' style="', '"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", '<!--/--><div style="', '"><div style="', '"><!--$-->', "<!--/--><!--$-->", '<!--/--></div><div style="', '"><!--$-->', "<!--/--><!--$-->", '<!--/--></div><div style="', '"><!--$-->', "<!--/--><!--$-->", "<!--/--></div></div></div>"], _tmpl$84 = ["<div", ' style="', '"><div style="', '"></div><div style="', '"><div style="', '"><!--$-->', '<!--/--><div style="', '"></div></div><!--$-->', "<!--/--></div></div>"], _tmpl$85 = ["<div", ' style="', '"><div style="', '"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", '<!--/--></div><div style="', '"></div></div>'], _tmpl$86 = ["<div", ' style="', '"><div style="', '"><span style="', '">Q</span><!--$-->', '<!--/--></div><span style="', '">', "</span></div>"], _tmpl$87 = ["<div", ' style="', '"><svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none"><line x1="0" y1="0" x2="100" y2="100" stroke="var(--agd-stroke)" stroke-width="0.5"></line><line x1="100" y1="0" x2="0" y2="100" stroke="var(--agd-stroke)" stroke-width="0.5"></line></svg></div>'], _tmpl$88 = ["<svg", ' width="100%" height="100%" viewBox="', '" fill="none"><rect x="1"', ' stroke="var(--agd-stroke)" stroke-width="1.5"></rect><path d="', '" stroke="var(--agd-bar)" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"></path></svg>'], _tmpl$89 = ["<svg", ' width="100%" height="100%" viewBox="', '" fill="none"><circle', ' stroke="var(--agd-stroke)" stroke-width="1.5"></circle><circle', ' fill="var(--agd-bar)"></circle></svg>'], _tmpl$90 = ["<div", ' style="', '"><div style="', '"><div style="', '"></div></div><div style="', '"></div></div>'], _tmpl$91 = ["<div", ' style="', '"><div style="', '"><!--$-->', '<!--/--><svg width="12" height="12" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="1" stroke="var(--agd-stroke)" stroke-width="1"></rect><line x1="2" y1="6" x2="14" y2="6" stroke="var(--agd-stroke)" stroke-width="0.5"></line></svg></div><div style="', '"><div style="', '"><span style="', '">‹</span><!--$-->', '<!--/--><span style="', '">›</span></div><div style="', '">', "</div></div></div>"], _tmpl$92 = ["<div", ' style="', '"><div style="', '"><div style="', '"><div style="', '"></div></div></div></div>'], _tmpl$93 = ["<div", ' style="', '"><div style="', '"></div><div style="', '"></div><div style="', '"></div><div style="', '"></div></div>'], _tmpl$94 = ["<div", ' style="', '"><div style="', '"><!--$-->', '<!--/--><div style="', '"></div></div></div>'], _tmpl$95 = ["<svg", ' width="100%" height="100%" viewBox="', '" fill="none"><path d="', '" stroke="var(--agd-stroke)" stroke-width="1" fill="var(--agd-fill)"></path></svg>'], _tmpl$96 = ["<svg", ' width="100%" height="100%" viewBox="', '" fill="none"><circle', ' stroke="var(--agd-stroke)" stroke-width="1.5" opacity=".2"></circle><path d="', '" stroke="var(--agd-bar-strong)" stroke-width="1.5" stroke-linecap="round"></path></svg>'], _tmpl$97 = ["<div", ' style="', '"><!--$-->', '<!--/--><div style="', '"><!--$-->', "<!--/--><!--$-->", "<!--/--></div></div>"], _tmpl$98 = ["<div", ' style="', '"><!--$-->', "<!--/--><!--$-->", '<!--/--><div style="', '">', "</div><!--$-->", "<!--/--><!--$-->", "<!--/--></div>"], _tmpl$99 = ["<div", ' style="', '"><!--$-->', "<!--/--><!--$-->", '<!--/--><div style="', '"><div style="', '"><!--$-->', "<!--/--><!--$-->", '<!--/--></div><div style="', '"><!--$-->', "<!--/--><!--$-->", '<!--/--></div></div><div style="', '"><!--$-->', "<!--/--><!--$-->", '<!--/--></div><div style="', '"><!--$-->', "<!--/--><!--$-->", "<!--/--></div><!--$-->", "<!--/--></div>"], _tmpl$100 = ["<div", ' style="', '"><span style="', '">', "</span></div>"], _tmpl$101 = ["<svg", ' width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M4 0.5L1 4.5h6z"', "></path></svg>"], _tmpl$102 = ["<svg", ' width="6" height="8" viewBox="0 0 6 8" fill="none"><path d="M5.5 4L1.5 1v6z"', "></path></svg>"], _tmpl$103 = ["<svg", ' width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M4 5.5L1 1.5h6z"', "></path></svg>"], _tmpl$104 = ["<svg", ' width="6" height="8" viewBox="0 0 6 8" fill="none"><path d="M0.5 4L4.5 1v6z"', "></path></svg>"], _tmpl$105 = ["<div", ' class="', '" data-feedback-toolbar>', "</div>"], _tmpl$106 = ["<div", ' class="', '" style="', '"><span', ">", '</span><span class="', '">', "</span><div", ">", "</div><div", ">✕</div><!--$-->", "<!--/--><!--$-->", "<!--/--></div>"], _tmpl$107 = ["<div", ' class="', '"></div>'], _tmpl$108 = ["<div", ' class="', '">', "</div>"], _tmpl$109 = ["<div", ' style="', '" data-feedback-toolbar></div>'], _tmpl$110 = ["<div", ' style="', '" data-feedback-toolbar>', "</div>"], _tmpl$111 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="1" y="4" width="18" height="8" rx="1" stroke="currentColor" stroke-width="0.5"></rect><rect x="2.5" y="7" width="3" height="1.5" rx=".5" fill="currentColor" opacity=".4"></rect><rect x="7" y="7" width="2.5" height="1.5" rx=".5" fill="currentColor" opacity=".25"></rect><rect x="11" y="7" width="2.5" height="1.5" rx=".5" fill="currentColor" opacity=".25"></rect></svg>'], _tmpl$112 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="1" y="2" width="18" height="12" rx="1" stroke="currentColor" stroke-width="0.5"></rect><rect x="3" y="5.5" width="8" height="2" rx=".5" fill="currentColor" opacity=".35"></rect><rect x="3" y="9" width="12" height="1" rx=".5" fill="currentColor" opacity=".15"></rect></svg>'], _tmpl$113 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="1" y="1" width="18" height="14" rx="1" stroke="currentColor" stroke-width="0.5"></rect><rect x="5" y="5" width="10" height="1.5" rx=".5" fill="currentColor" opacity=".35"></rect><rect x="7" y="8" width="6" height="1" rx=".5" fill="currentColor" opacity=".15"></rect><rect x="7.5" y="10.5" width="5" height="2.5" rx="1" stroke="currentColor" stroke-width="0.5"></rect></svg>'], _tmpl$114 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="1" y="1" width="18" height="14" rx="1" stroke="currentColor" stroke-width="0.5"></rect><rect x="3" y="4" width="6" height="1" rx=".5" fill="currentColor" opacity=".3"></rect><rect x="3" y="6.5" width="14" height="1" rx=".5" fill="currentColor" opacity=".15"></rect><rect x="3" y="9" width="10" height="1" rx=".5" fill="currentColor" opacity=".15"></rect></svg>'], _tmpl$115 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="1" y="1" width="7" height="14" rx="1" stroke="currentColor" stroke-width="0.5"></rect><rect x="2.5" y="4" width="4" height="1" rx=".5" fill="currentColor" opacity=".3"></rect><rect x="2.5" y="6.5" width="3.5" height="1" rx=".5" fill="currentColor" opacity=".15"></rect><rect x="2.5" y="9" width="4" height="1" rx=".5" fill="currentColor" opacity=".15"></rect></svg>'], _tmpl$116 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="1" y="7" width="18" height="8" rx="1" stroke="currentColor" stroke-width="0.5"></rect><rect x="3" y="9.5" width="4" height="1" rx=".5" fill="currentColor" opacity=".25"></rect><rect x="9" y="9.5" width="4" height="1" rx=".5" fill="currentColor" opacity=".25"></rect><rect x="15" y="9.5" width="3" height="1" rx=".5" fill="currentColor" opacity=".2"></rect></svg>'], _tmpl$117 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="3" y="2" width="14" height="12" rx="1.5" stroke="currentColor" stroke-width="0.5"></rect><rect x="5" y="4.5" width="7" height="1" rx=".5" fill="currentColor" opacity=".3"></rect><rect x="5" y="7" width="10" height="1" rx=".5" fill="currentColor" opacity=".15"></rect><rect x="11" y="11" width="5" height="2" rx=".75" stroke="currentColor" stroke-width="0.5"></rect></svg>'], _tmpl$118 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><line x1="2" y1="8" x2="18" y2="8" stroke="currentColor" stroke-width="0.5" opacity=".3"></line></svg>'], _tmpl$119 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="2" y="1" width="16" height="14" rx="1.5" stroke="currentColor" stroke-width="0.5"></rect><rect x="2" y="1" width="16" height="5.5" rx="1" fill="currentColor" opacity=".04"></rect><rect x="4" y="8.5" width="8" height="1" rx=".5" fill="currentColor" opacity=".25"></rect><rect x="4" y="11" width="11" height="1" rx=".5" fill="currentColor" opacity=".12"></rect></svg>'], _tmpl$120 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="2" y="4" width="14" height="1.5" rx=".5" fill="currentColor" opacity=".3"></rect><rect x="2" y="7" width="11" height="1" rx=".5" fill="currentColor" opacity=".15"></rect><rect x="2" y="9.5" width="13" height="1" rx=".5" fill="currentColor" opacity=".15"></rect><rect x="2" y="12" width="8" height="1" rx=".5" fill="currentColor" opacity=".12"></rect></svg>'], _tmpl$121 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="2" y="2" width="16" height="12" rx="1" stroke="currentColor" stroke-width="0.5"></rect><line x1="2" y1="2" x2="18" y2="14" stroke="currentColor" stroke-width=".3" opacity=".25"></line><line x1="18" y1="2" x2="2" y2="14" stroke="currentColor" stroke-width=".3" opacity=".25"></line></svg>'], _tmpl$122 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="2" y="2" width="16" height="12" rx="1" stroke="currentColor" stroke-width="0.5"></rect><path d="M8.5 5.5v5l4.5-2.5z" stroke="currentColor" stroke-width="0.5" fill="currentColor" opacity=".15"></path></svg>'], _tmpl$123 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="1" y="2" width="18" height="12" rx="1" stroke="currentColor" stroke-width="0.5"></rect><line x1="1" y1="5.5" x2="19" y2="5.5" stroke="currentColor" stroke-width=".3" opacity=".25"></line><line x1="1" y1="9" x2="19" y2="9" stroke="currentColor" stroke-width=".3" opacity=".25"></line><line x1="7" y1="2" x2="7" y2="14" stroke="currentColor" stroke-width=".3" opacity=".25"></line><line x1="13" y1="2" x2="13" y2="14" stroke="currentColor" stroke-width=".3" opacity=".25"></line></svg>'], _tmpl$124 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="1.5" y="2" width="7" height="5.5" rx="1" stroke="currentColor" stroke-width="0.5"></rect><rect x="11.5" y="2" width="7" height="5.5" rx="1" stroke="currentColor" stroke-width="0.5"></rect><rect x="1.5" y="9.5" width="7" height="5.5" rx="1" stroke="currentColor" stroke-width="0.5"></rect><rect x="11.5" y="9.5" width="7" height="5.5" rx="1" stroke="currentColor" stroke-width="0.5"></rect></svg>'], _tmpl$125 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><circle cx="3.5" cy="4.5" r="1" stroke="currentColor" stroke-width="0.5"></circle><rect x="6.5" y="4" width="10" height="1" rx=".5" fill="currentColor" opacity=".2"></rect><circle cx="3.5" cy="8" r="1" stroke="currentColor" stroke-width="0.5"></circle><rect x="6.5" y="7.5" width="8" height="1" rx=".5" fill="currentColor" opacity=".2"></rect><circle cx="3.5" cy="11.5" r="1" stroke="currentColor" stroke-width="0.5"></circle><rect x="6.5" y="11" width="11" height="1" rx=".5" fill="currentColor" opacity=".2"></rect></svg>'], _tmpl$126 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="3" y="9" width="2.5" height="4" rx=".5" fill="currentColor" opacity=".2"></rect><rect x="7" y="6" width="2.5" height="7" rx=".5" fill="currentColor" opacity=".25"></rect><rect x="11" y="3" width="2.5" height="10" rx=".5" fill="currentColor" opacity=".3"></rect><rect x="15" y="5" width="2.5" height="8" rx=".5" fill="currentColor" opacity=".2"></rect></svg>'], _tmpl$127 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="1.5" y="2" width="17" height="4" rx="1" stroke="currentColor" stroke-width="0.5"></rect><rect x="3" y="3.5" width="6" height="1" rx=".5" fill="currentColor" opacity=".25"></rect><rect x="1.5" y="7.5" width="17" height="3" rx="1" stroke="currentColor" stroke-width="0.5"></rect><rect x="1.5" y="12" width="17" height="3" rx="1" stroke="currentColor" stroke-width="0.5"></rect></svg>'], _tmpl$128 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="3" y="2" width="14" height="10" rx="1" stroke="currentColor" stroke-width="0.5"></rect><path d="M1.5 7L3 8.5 1.5 10" stroke="currentColor" stroke-width="0.5" opacity=".35"></path><path d="M18.5 7L17 8.5 18.5 10" stroke="currentColor" stroke-width="0.5" opacity=".35"></path><circle cx="8.5" cy="14" r=".6" fill="currentColor" opacity=".35"></circle><circle cx="10" cy="14" r=".6" fill="currentColor" opacity=".15"></circle><circle cx="11.5" cy="14" r=".6" fill="currentColor" opacity=".15"></circle></svg>'], _tmpl$129 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="3" y="5" width="14" height="6" rx="2" stroke="currentColor" stroke-width="0.5"></rect><rect x="6.5" y="7.5" width="7" height="1" rx=".5" fill="currentColor" opacity=".25"></rect></svg>'], _tmpl$130 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="2" y="4" width="5.5" height="1" rx=".5" fill="currentColor" opacity=".25"></rect><rect x="2" y="6.5" width="16" height="5.5" rx="1" stroke="currentColor" stroke-width="0.5"></rect><rect x="3.5" y="8.5" width="7" height="1" rx=".5" fill="currentColor" opacity=".12"></rect></svg>'], _tmpl$131 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="2" y="4.5" width="16" height="7" rx="3.5" stroke="currentColor" stroke-width="0.5"></rect><circle cx="6" cy="8" r="2" stroke="currentColor" stroke-width="0.5" opacity=".3"></circle><line x1="7.5" y1="9.5" x2="9" y2="11" stroke="currentColor" stroke-width="0.5" opacity=".3"></line><rect x="9.5" y="7.5" width="6" height="1" rx=".5" fill="currentColor" opacity=".12"></rect></svg>'], _tmpl$132 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="2" y="1.5" width="5.5" height="1" rx=".5" fill="currentColor" opacity=".25"></rect><rect x="2" y="3.5" width="16" height="3" rx=".75" stroke="currentColor" stroke-width="0.5"></rect><rect x="2" y="8" width="7" height="1" rx=".5" fill="currentColor" opacity=".25"></rect><rect x="2" y="10" width="16" height="3" rx=".75" stroke="currentColor" stroke-width="0.5"></rect><rect x="12" y="14" width="6" height="2" rx=".75" stroke="currentColor" stroke-width="0.5"></rect></svg>'], _tmpl$133 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="1" y="5" width="18" height="10" rx="1" stroke="currentColor" stroke-width="0.5"></rect><rect x="1" y="2" width="6" height="3.5" rx=".75" stroke="currentColor" stroke-width="0.5"></rect><rect x="2.5" y="3.25" width="3" height="1" rx=".5" fill="currentColor" opacity=".25"></rect><rect x="7" y="2" width="6" height="3.5" rx=".75" stroke="currentColor" stroke-width="0.5"></rect></svg>'], _tmpl$134 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="2" y="2" width="16" height="4" rx="1" stroke="currentColor" stroke-width="0.5"></rect><rect x="3.5" y="3.5" width="7" height="1" rx=".5" fill="currentColor" opacity=".2"></rect><path d="M15 3.5l1.5 1.5L18 3.5" stroke="currentColor" stroke-width="0.5" opacity=".3"></path><rect x="2" y="7" width="16" height="7" rx="1" stroke="currentColor" stroke-width="0.5" stroke-dasharray="2 1" opacity=".3"></rect></svg>'], _tmpl$135 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="4" y="5" width="12" height="6" rx="3" stroke="currentColor" stroke-width="0.5"></rect><circle cx="13" cy="8" r="2" fill="currentColor" opacity=".3"></circle></svg>'], _tmpl$136 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><circle cx="10" cy="8" r="6" stroke="currentColor" stroke-width="0.5"></circle><circle cx="10" cy="6.5" r="2" stroke="currentColor" stroke-width="0.5"></circle><path d="M6.5 13c0-2 1.5-3.5 3.5-3.5s3.5 1.5 3.5 3.5" stroke="currentColor" stroke-width="0.5"></path></svg>'], _tmpl$137 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="3" y="5" width="14" height="6" rx="3" stroke="currentColor" stroke-width="0.5"></rect><rect x="6" y="7.5" width="8" height="1" rx=".5" fill="currentColor" opacity=".25"></rect></svg>'], _tmpl$138 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="1.5" y="7" width="3.5" height="1" rx=".5" fill="currentColor" opacity=".3"></rect><path d="M6.5 7l1 1-1 1" stroke="currentColor" stroke-width="0.5" opacity=".2"></path><rect x="9" y="7" width="3.5" height="1" rx=".5" fill="currentColor" opacity=".2"></rect><path d="M14 7l1 1-1 1" stroke="currentColor" stroke-width="0.5" opacity=".2"></path><rect x="16.5" y="7" width="2" height="1" rx=".5" fill="currentColor" opacity=".15"></rect></svg>'], _tmpl$139 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="2" y="5.5" width="3.5" height="5" rx="1" stroke="currentColor" stroke-width="0.5"></rect><rect x="6.5" y="5.5" width="3.5" height="5" rx="1" stroke="currentColor" stroke-width="0.5"></rect><rect x="11" y="5.5" width="3.5" height="5" rx="1" fill="currentColor" opacity=".15" stroke="currentColor" stroke-width="0.5"></rect><rect x="15.5" y="5.5" width="3.5" height="5" rx="1" stroke="currentColor" stroke-width="0.5"></rect></svg>'], _tmpl$140 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="2" y="7" width="16" height="2" rx="1" stroke="currentColor" stroke-width="0.5"></rect><rect x="2" y="7" width="10" height="2" rx="1" fill="currentColor" opacity=".2"></rect></svg>'], _tmpl$141 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="2" y="4" width="16" height="8" rx="1.5" stroke="currentColor" stroke-width="0.5"></rect><circle cx="5" cy="8" r="1.5" stroke="currentColor" stroke-width="0.5" opacity=".3"></circle><rect x="8" y="6.5" width="7" height="1" rx=".5" fill="currentColor" opacity=".25"></rect><rect x="8" y="9" width="5" height="1" rx=".5" fill="currentColor" opacity=".12"></rect></svg>'], _tmpl$142 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="3" y="3" width="14" height="7" rx="1.5" stroke="currentColor" stroke-width="0.5"></rect><rect x="5.5" y="5.5" width="9" height="1" rx=".5" fill="currentColor" opacity=".25"></rect><path d="M9 10l1 2.5 1-2.5" stroke="currentColor" stroke-width="0.5"></path></svg>'], _tmpl$143 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="2" y="1" width="16" height="14" rx="1.5" stroke="currentColor" stroke-width="0.5"></rect><rect x="6" y="3" width="8" height="1.5" rx=".5" fill="currentColor" opacity=".25"></rect><rect x="7" y="5.5" width="6" height="2" rx=".5" fill="currentColor" opacity=".15"></rect><rect x="5" y="9" width="10" height="1" rx=".5" fill="currentColor" opacity=".1"></rect><rect x="5" y="11" width="10" height="1" rx=".5" fill="currentColor" opacity=".1"></rect><rect x="6" y="13" width="8" height="1.5" rx=".5" fill="currentColor" opacity=".2"></rect></svg>'], _tmpl$144 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="2" y="1" width="16" height="14" rx="1.5" stroke="currentColor" stroke-width="0.5"></rect><text x="4" y="5.5" font-size="4" fill="currentColor" opacity=".2" font-family="serif">&ldquo;</text><rect x="4" y="7" width="12" height="1" rx=".5" fill="currentColor" opacity=".15"></rect><rect x="4" y="9" width="9" height="1" rx=".5" fill="currentColor" opacity=".12"></rect><circle cx="5.5" cy="12.5" r="1.5" stroke="currentColor" stroke-width="0.5" opacity=".25"></circle><rect x="8" y="12" width="5" height="1" rx=".5" fill="currentColor" opacity=".15"></rect></svg>'], _tmpl$145 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="1" y="2" width="18" height="12" rx="1" stroke="currentColor" stroke-width="0.5"></rect><rect x="5" y="4.5" width="10" height="1.5" rx=".5" fill="currentColor" opacity=".3"></rect><rect x="6" y="7.5" width="8" height="1" rx=".5" fill="currentColor" opacity=".15"></rect><rect x="7" y="10" width="6" height="2.5" rx="1" stroke="currentColor" stroke-width="0.5"></rect></svg>'], _tmpl$146 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="2" y="4" width="16" height="8" rx="1.5" stroke="currentColor" stroke-width="0.5"></rect><circle cx="6" cy="8" r="2" stroke="currentColor" stroke-width="0.5" opacity=".3"></circle><line x1="6" y1="7" x2="6" y2="8.5" stroke="currentColor" stroke-width="0.6" opacity=".5"></line><circle cx="6" cy="9.3" r=".3" fill="currentColor" opacity=".5"></circle><rect x="9.5" y="7" width="6" height="1" rx=".5" fill="currentColor" opacity=".2"></rect></svg>'], _tmpl$147 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="1" y="5" width="18" height="6" rx="1" stroke="currentColor" stroke-width="0.5"></rect><rect x="4" y="7.5" width="8" height="1" rx=".5" fill="currentColor" opacity=".25"></rect><rect x="14" y="7" width="3.5" height="2" rx=".75" stroke="currentColor" stroke-width="0.5"></rect></svg>'], _tmpl$148 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="3" y="2" width="14" height="12" rx="1.5" stroke="currentColor" stroke-width="0.5"></rect><rect x="6" y="4.5" width="8" height="1" rx=".5" fill="currentColor" opacity=".15"></rect><rect x="5" y="7" width="10" height="2.5" rx=".5" fill="currentColor" opacity=".3"></rect><rect x="7" y="11" width="6" height="1" rx=".5" fill="currentColor" opacity=".12"></rect></svg>'], _tmpl$149 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><circle cx="4" cy="8" r="2" fill="currentColor" opacity=".2" stroke="currentColor" stroke-width="0.5"></circle><line x1="6" y1="8" x2="8" y2="8" stroke="currentColor" stroke-width=".4" opacity=".3"></line><circle cx="10" cy="8" r="2" stroke="currentColor" stroke-width="0.5"></circle><line x1="12" y1="8" x2="14" y2="8" stroke="currentColor" stroke-width=".4" opacity=".3"></line><circle cx="16" cy="8" r="2" stroke="currentColor" stroke-width="0.5"></circle></svg>'], _tmpl$150 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="3" y="5" width="14" height="6" rx="1.5" stroke="currentColor" stroke-width="0.5"></rect><rect x="5.5" y="7.5" width="6" height="1" rx=".5" fill="currentColor" opacity=".25"></rect><line x1="14" y1="6.5" x2="15.5" y2="9.5" stroke="currentColor" stroke-width="0.5" opacity=".2"></line><line x1="15.5" y1="6.5" x2="14" y2="9.5" stroke="currentColor" stroke-width="0.5" opacity=".2"></line></svg>'], _tmpl$151 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><path d="M4 5.5l1 2 2.2.3-1.6 1.5.4 2.2L4 10.3l-2 1.2.4-2.2L.8 7.8 3 7.5z" fill="currentColor" opacity=".25"></path><path d="M10 5.5l1 2 2.2.3-1.6 1.5.4 2.2L10 10.3l-2 1.2.4-2.2L6.8 7.8 9 7.5z" fill="currentColor" opacity=".25"></path><path d="M16 5.5l1 2 2.2.3-1.6 1.5.4 2.2L16 10.3l-2 1.2.4-2.2-1.6-1.5 2.2-.3z" stroke="currentColor" stroke-width="0.5" opacity=".25"></path></svg>'], _tmpl$152 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="2" y="2" width="16" height="12" rx="1" stroke="currentColor" stroke-width="0.5"></rect><line x1="2" y1="6" x2="18" y2="10" stroke="currentColor" stroke-width=".3" opacity=".15"></line><line x1="7" y1="2" x2="11" y2="14" stroke="currentColor" stroke-width=".3" opacity=".15"></line><path d="M10 5c-1.7 0-3 1.3-3 3 0 2.5 3 5 3 5s3-2.5 3-5c0-1.7-1.3-3-3-3z" fill="currentColor" opacity=".15" stroke="currentColor" stroke-width="0.5"></path></svg>'], _tmpl$153 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><line x1="5" y1="2" x2="5" y2="14" stroke="currentColor" stroke-width=".4" opacity=".25"></line><circle cx="5" cy="4" r="1.5" fill="currentColor" opacity=".2" stroke="currentColor" stroke-width="0.5"></circle><rect x="8" y="3" width="8" height="1" rx=".5" fill="currentColor" opacity=".25"></rect><circle cx="5" cy="8.5" r="1.5" stroke="currentColor" stroke-width="0.5"></circle><rect x="8" y="7.5" width="6" height="1" rx=".5" fill="currentColor" opacity=".15"></rect><circle cx="5" cy="13" r="1.5" stroke="currentColor" stroke-width="0.5"></circle><rect x="8" y="12" width="7" height="1" rx=".5" fill="currentColor" opacity=".15"></rect></svg>'], _tmpl$154 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="3" y="2" width="14" height="12" rx="1.5" stroke="currentColor" stroke-width="0.5" stroke-dasharray="2 1"></rect><path d="M10 10V5.5m0 0L7.5 8m2.5-2.5L12.5 8" stroke="currentColor" stroke-width="0.5" opacity=".3"></path><rect x="7" y="11.5" width="6" height="1" rx=".5" fill="currentColor" opacity=".15"></rect></svg>'], _tmpl$155 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="2" y="2" width="16" height="12" rx="1" stroke="currentColor" stroke-width="0.5"></rect><circle cx="4" cy="4" r=".6" fill="currentColor" opacity=".3"></circle><circle cx="5.5" cy="4" r=".6" fill="currentColor" opacity=".3"></circle><circle cx="7" cy="4" r=".6" fill="currentColor" opacity=".3"></circle><rect x="4" y="7" width="7" height="1" rx=".5" fill="currentColor" opacity=".2"></rect><rect x="6" y="9" width="5" height="1" rx=".5" fill="currentColor" opacity=".15"></rect><rect x="4" y="11" width="8" height="1" rx=".5" fill="currentColor" opacity=".12"></rect></svg>'], _tmpl$156 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="2" y="3" width="16" height="12" rx="1" stroke="currentColor" stroke-width="0.5"></rect><line x1="2" y1="6.5" x2="18" y2="6.5" stroke="currentColor" stroke-width=".4" opacity=".25"></line><rect x="5" y="4" width="1" height="1.5" rx=".3" fill="currentColor" opacity=".2"></rect><rect x="14" y="4" width="1" height="1.5" rx=".3" fill="currentColor" opacity=".2"></rect><circle cx="7" cy="9" r=".6" fill="currentColor" opacity=".2"></circle><circle cx="10" cy="9" r=".6" fill="currentColor" opacity=".2"></circle><circle cx="13" cy="9" r=".6" fill="currentColor" opacity=".3"></circle><circle cx="7" cy="12" r=".6" fill="currentColor" opacity=".2"></circle><circle cx="10" cy="12" r=".6" fill="currentColor" opacity=".2"></circle></svg>'], _tmpl$157 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="2" y="3" width="16" height="10" rx="1.5" stroke="currentColor" stroke-width="0.5"></rect><circle cx="5.5" cy="8" r="2" stroke="currentColor" stroke-width="0.5" opacity=".25"></circle><rect x="9" y="6" width="6" height="1" rx=".5" fill="currentColor" opacity=".25"></rect><rect x="9" y="8.5" width="4.5" height="1" rx=".5" fill="currentColor" opacity=".12"></rect><circle cx="16.5" cy="4.5" r="1.5" fill="currentColor" opacity=".25"></circle></svg>'], _tmpl$158 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="3" y="1" width="14" height="14" rx="1.5" stroke="currentColor" stroke-width="0.5"></rect><rect x="3" y="1" width="14" height="6" rx="1" fill="currentColor" opacity=".04"></rect><rect x="5" y="8.5" width="7" height="1" rx=".5" fill="currentColor" opacity=".25"></rect><rect x="5" y="10.5" width="4" height="1.5" rx=".5" fill="currentColor" opacity=".15"></rect><rect x="12" y="12" width="4" height="2" rx=".75" stroke="currentColor" stroke-width="0.5"></rect></svg>'], _tmpl$159 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><circle cx="10" cy="5" r="3" stroke="currentColor" stroke-width="0.5"></circle><rect x="5" y="10" width="10" height="1.5" rx=".5" fill="currentColor" opacity=".25"></rect><rect x="7" y="12.5" width="6" height="1" rx=".5" fill="currentColor" opacity=".12"></rect></svg>'], _tmpl$160 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="9" y="1" width="10" height="14" rx="1" stroke="currentColor" stroke-width="0.5"></rect><rect x="10.5" y="4" width="5" height="1" rx=".5" fill="currentColor" opacity=".25"></rect><rect x="10.5" y="6.5" width="7" height="1" rx=".5" fill="currentColor" opacity=".15"></rect><rect x="10.5" y="9" width="6" height="1" rx=".5" fill="currentColor" opacity=".15"></rect><rect x="1" y="1" width="7" height="14" rx="1" stroke="currentColor" stroke-width="0.5" opacity=".15"></rect></svg>'], _tmpl$161 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="3" y="2" width="14" height="9" rx="1.5" stroke="currentColor" stroke-width="0.5"></rect><rect x="5" y="4.5" width="8" height="1" rx=".5" fill="currentColor" opacity=".25"></rect><rect x="5" y="7" width="6" height="1" rx=".5" fill="currentColor" opacity=".15"></rect><path d="M9 11l1 2.5 1-2.5" stroke="currentColor" stroke-width="0.5"></path></svg>'], _tmpl$162 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="2" y="3" width="10" height="10" rx="2" stroke="currentColor" stroke-width="0.5"></rect><path d="M5 9.5l2-4 2 4" stroke="currentColor" stroke-width="0.5" opacity=".3"></path><rect x="14" y="6" width="4" height="1" rx=".5" fill="currentColor" opacity=".2"></rect><rect x="14" y="8.5" width="3" height="1" rx=".5" fill="currentColor" opacity=".12"></rect></svg>'], _tmpl$163 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><text x="2.5" y="5.5" font-size="4" fill="currentColor" opacity=".3" font-weight="bold">?</text><rect x="7" y="3" width="10" height="1" rx=".5" fill="currentColor" opacity=".25"></rect><rect x="7" y="5.5" width="8" height="1" rx=".5" fill="currentColor" opacity=".12"></rect><text x="2.5" y="11.5" font-size="4" fill="currentColor" opacity=".3" font-weight="bold">?</text><rect x="7" y="9" width="9" height="1" rx=".5" fill="currentColor" opacity=".25"></rect><rect x="7" y="11.5" width="7" height="1" rx=".5" fill="currentColor" opacity=".12"></rect></svg>'], _tmpl$164 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="1.5" y="1.5" width="5" height="5" rx=".75" stroke="currentColor" stroke-width="0.5"></rect><rect x="7.5" y="1.5" width="5" height="5" rx=".75" stroke="currentColor" stroke-width="0.5"></rect><rect x="13.5" y="1.5" width="5" height="5" rx=".75" stroke="currentColor" stroke-width="0.5"></rect><rect x="1.5" y="9.5" width="5" height="5" rx=".75" stroke="currentColor" stroke-width="0.5"></rect><rect x="7.5" y="9.5" width="5" height="5" rx=".75" stroke="currentColor" stroke-width="0.5"></rect><rect x="13.5" y="9.5" width="5" height="5" rx=".75" stroke="currentColor" stroke-width="0.5"></rect></svg>'], _tmpl$165 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="5" y="4" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="0.5"></rect><path d="M7.5 8l1.5 1.5 3-3" stroke="currentColor" stroke-width="0.5" opacity=".35"></path></svg>'], _tmpl$166 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><circle cx="10" cy="8" r="4" stroke="currentColor" stroke-width="0.5"></circle><circle cx="10" cy="8" r="2" fill="currentColor" opacity=".3"></circle></svg>'], _tmpl$167 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="2" y="7.5" width="16" height="1" rx=".5" fill="currentColor" opacity=".15"></rect><rect x="2" y="7.5" width="10" height="1" rx=".5" fill="currentColor" opacity=".25"></rect><circle cx="12" cy="8" r="2.5" stroke="currentColor" stroke-width="0.5"></circle></svg>'], _tmpl$168 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="2" y="1" width="16" height="5" rx="1" stroke="currentColor" stroke-width="0.5"></rect><rect x="3.5" y="3" width="5" height="1" rx=".5" fill="currentColor" opacity=".2"></rect><rect x="14" y="2.5" width="2.5" height="2" rx=".5" fill="currentColor" opacity=".12"></rect><rect x="2" y="7" width="16" height="8" rx="1" stroke="currentColor" stroke-width="0.5" stroke-dasharray="2 1" opacity=".3"></rect><circle cx="6" cy="10" r=".6" fill="currentColor" opacity=".2"></circle><circle cx="10" cy="10" r=".6" fill="currentColor" opacity=".3"></circle><circle cx="14" cy="10" r=".6" fill="currentColor" opacity=".2"></circle><circle cx="6" cy="13" r=".6" fill="currentColor" opacity=".2"></circle><circle cx="10" cy="13" r=".6" fill="currentColor" opacity=".2"></circle></svg>'], _tmpl$169 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="2" y="2" width="16" height="3" rx="1" fill="currentColor" opacity=".08"></rect><rect x="2" y="7" width="10" height="2" rx=".75" fill="currentColor" opacity=".08"></rect><rect x="2" y="11" width="13" height="2" rx=".75" fill="currentColor" opacity=".08"></rect></svg>'], _tmpl$170 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="1.5" y="5" width="10" height="6" rx="3" fill="currentColor" opacity=".08" stroke="currentColor" stroke-width="0.5"></rect><rect x="4" y="7.5" width="4" height="1" rx=".5" fill="currentColor" opacity=".25"></rect><line x1="9.5" y1="6.5" x2="10.5" y2="9.5" stroke="currentColor" stroke-width="0.5" opacity=".2"></line><line x1="10.5" y1="6.5" x2="9.5" y2="9.5" stroke="currentColor" stroke-width="0.5" opacity=".2"></line><rect x="13" y="5" width="5.5" height="6" rx="3" stroke="currentColor" stroke-width="0.5" opacity=".25"></rect></svg>'], _tmpl$171 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><path d="M10 3l1.5 3 3.5.5-2.5 2.5.5 3.5L10 11l-3 1.5.5-3.5L5 6.5l3.5-.5z" stroke="currentColor" stroke-width="0.5" opacity=".3"></path></svg>'], _tmpl$172 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><circle cx="10" cy="8" r="5" stroke="currentColor" stroke-width="0.5" opacity=".12"></circle><path d="M10 3a5 5 0 0 1 5 5" stroke="currentColor" stroke-width="0.5" opacity=".35" stroke-linecap="round"></path></svg>'], _tmpl$173 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="2" y="2" width="5" height="5" rx="1.5" stroke="currentColor" stroke-width="0.5"></rect><path d="M4.5 3.5v3m-1.5-1.5h3" stroke="currentColor" stroke-width="0.5" opacity=".25"></path><rect x="9" y="2.5" width="8" height="1.5" rx=".5" fill="currentColor" opacity=".25"></rect><rect x="9" y="5.5" width="6" height="1" rx=".5" fill="currentColor" opacity=".12"></rect><rect x="2" y="10" width="5" height="5" rx="1.5" stroke="currentColor" stroke-width="0.5"></rect><rect x="9" y="10.5" width="7" height="1.5" rx=".5" fill="currentColor" opacity=".25"></rect><rect x="9" y="13.5" width="5" height="1" rx=".5" fill="currentColor" opacity=".12"></rect></svg>'], _tmpl$174 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><circle cx="5" cy="5" r="2.5" stroke="currentColor" stroke-width="0.5"></circle><rect x="2.5" y="9" width="5" height="1" rx=".5" fill="currentColor" opacity=".2"></rect><circle cx="15" cy="5" r="2.5" stroke="currentColor" stroke-width="0.5"></circle><rect x="12.5" y="9" width="5" height="1" rx=".5" fill="currentColor" opacity=".2"></rect><circle cx="10" cy="5" r="2.5" stroke="currentColor" stroke-width="0.5" opacity=".5"></circle><rect x="7.5" y="9" width="5" height="1" rx=".5" fill="currentColor" opacity=".15"></rect><rect x="4" y="12" width="12" height="1" rx=".5" fill="currentColor" opacity=".1"></rect></svg>'], _tmpl$175 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="3" y="1" width="14" height="14" rx="1.5" stroke="currentColor" stroke-width="0.5"></rect><rect x="6" y="3" width="8" height="1.5" rx=".5" fill="currentColor" opacity=".25"></rect><rect x="5" y="5.5" width="10" height="3" rx=".75" stroke="currentColor" stroke-width="0.5"></rect><rect x="5" y="9.5" width="10" height="3" rx=".75" stroke="currentColor" stroke-width="0.5"></rect><rect x="6.5" y="13.5" width="7" height="2" rx=".75" fill="currentColor" opacity=".2"></rect></svg>'], _tmpl$176 = ["<svg", ' viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="2" y="1" width="16" height="14" rx="1.5" stroke="currentColor" stroke-width="0.5"></rect><rect x="4" y="3" width="5" height="1" rx=".5" fill="currentColor" opacity=".2"></rect><rect x="4" y="5" width="12" height="2.5" rx=".75" stroke="currentColor" stroke-width="0.5"></rect><rect x="4" y="8.5" width="12" height="4" rx=".75" stroke="currentColor" stroke-width="0.5"></rect><rect x="11" y="13.5" width="5" height="1.5" rx=".5" fill="currentColor" opacity=".2"></rect></svg>'], _tmpl$177 = ["<div", "><div", ">", "</div><!--$-->", "<!--/--></div>"], _tmpl$178 = ["<div", ' class="', '"><div', ">", "</div><span", ">", "</span></div>"], _tmpl$179 = ["<span", '><span style="', '"><!--$-->', "<!--/--> <!--$-->", '<!--/--></span><span class="', '"><!--$-->', "<!--/--> <!--$-->", '<!--/--></span><span class="', '"><!--$-->', "<!--/--> <!--$-->", "<!--/--></span></span>"], _tmpl$180 = ["<span", '><span style="', '">', '</span><span class="', '">', '</span><span class="', '">', "</span></span>"], _tmpl$181 = ["<div", ' class="', '"><div', "><div", "><div", "><span", ">", "</span><button", ">Clear</button></div></div></div></div>"], _tmpl$182 = ["<div", ' class="', '" data-feedback-toolbar data-agentation-palette><div', "><div", ">Layout Mode</div><div", '>Rearrange and resize existing elements, add new components, and explore layout ideas. Agent results may vary. <a href="https://agentation.dev/features#layout-mode" target="_blank" rel="noopener noreferrer">Learn more.</a></div></div><div class="', '"><span', '><svg viewBox="0 0 14 14" width="14" height="14" fill="none"><rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1"></rect><circle cx="4.5" cy="4.5" r="0.8" fill="currentColor" opacity=".6"></circle><circle cx="7" cy="4.5" r="0.8" fill="currentColor" opacity=".6"></circle><circle cx="9.5" cy="4.5" r="0.8" fill="currentColor" opacity=".6"></circle><circle cx="4.5" cy="7" r="0.8" fill="currentColor" opacity=".6"></circle><circle cx="7" cy="7" r="0.8" fill="currentColor" opacity=".6"></circle><circle cx="9.5" cy="7" r="0.8" fill="currentColor" opacity=".6"></circle><circle cx="4.5" cy="9.5" r="0.8" fill="currentColor" opacity=".6"></circle><circle cx="7" cy="9.5" r="0.8" fill="currentColor" opacity=".6"></circle><circle cx="9.5" cy="9.5" r="0.8" fill="currentColor" opacity=".6"></circle></svg></span><span', '>Wireframe New Page</span></div><div class="', '"><div', "><textarea", ' placeholder="Describe this page to provide additional context for your agent."', ' rows="2"></textarea></div></div><!--$-->', "<!--/--><!--$-->", "<!--/--></div>"], _tmpl$183 = ["<div", ' class="', '" data-feedback-toolbar><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--></div>"], _tmpl$184 = ["<div", ' class="', '" style="', '"><span', ' style="', '">', '</span><span class="', '">', "</span><span", "><!--$-->", "<!--/--> &times; <!--$-->", "<!--/--></span><div", ">✕</div><!--$-->", "<!--/--></div>"], _tmpl$185 = ["<div", ' class="', '" style="', '"><span', ' style="', '">', '</span><span class="', '">', "</span><span", "><!--$-->", "<!--/--> &times; <!--$-->", "<!--/--></span><div", ">✕</div><!--$-->", "<!--/--><span", ">", "</span></div>"], _tmpl$186 = ["<span", ">&amp; <!--$-->", "<!--/--></span>"], _tmpl$187 = ["<svg", ' class="', '"><!--$-->', '<!--/--><defs><filter id="connDotShadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0.5" stdDeviation="1" flood-opacity="0.15"></feDropShadow></filter></defs></svg>'], _tmpl$188 = ["<g", "><path", ' d="', '" fill="none" stroke="rgba(59, 130, 246, 0.45)" stroke-width="1.5"', "></path><circle", ' fill="rgba(59, 130, 246, 0.8)" stroke="#fff" stroke-width="1.5"', ' filter="url(#connDotShadow)"></circle><circle', ' fill="rgba(59, 130, 246, 0.8)" stroke="#fff" stroke-width="1.5"', ' filter="url(#connDotShadow)"></circle></g>'], _tmpl$189 = ["<div", ' class="', '" style="', '"><span', "><!--$-->", "<!--/--><!--$-->", "<!--/--></span><span", ">", "</span></div>"], _tmpl$190 = ["<div", ' class="', '" data-annotation-marker style="', '"><!--$-->', "<!--/--><!--$-->", "<!--/--></div>"], _tmpl$191 = ["<div", ' class="', '" style="', '">', "</div>"], _tmpl$192 = ["<div", ' class="', '" data-annotation-marker style="', '">', "</div>"], _tmpl$193 = ["<div", ' class="', '">', "<div", "></div></div>"], _tmpl$194 = ["<div", ' class="', '">', "<svg", ' width="14" height="14" viewBox="0 0 14 14" fill="none"><path', ' d="M3.94 7L6.13 9.19L10.5 4.81" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></div>'], _tmpl$195 = ["<label", ">", "</label>"], _tmpl$196 = ["<span", ' class="', '"></span>'], _tmpl$197 = ["<div", ' class="', '"', "></div>"], _tmpl$198 = ["<div", ' class="', '" style="', '" data-agentation-settings-panel><div', '><div class="', '"><div', "><a", ' href="https://agentation.com" target="_blank" rel="noopener noreferrer"><svg width="72" height="16" viewBox="0 0 676 151" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M79.6666 100.561L104.863 15.5213C107.828 4.03448 99.1201 -3.00582 88.7449 1.25541L3.52015 39.6065C1.48217 40.5329 0 42.7562 0 45.1647C0 48.6848 2.77907 51.4639 6.29922 51.4639C7.22558 51.4639 8.15193 51.2786 9.07829 50.9081L93.7472 12.7422C97.2674 11.0748 93.7472 8.29572 92.6356 12.1864L67.624 97.2259C66.5123 100.931 69.4767 105.193 73.7379 105.193C76.517 105.193 79.1108 103.155 79.6666 100.561ZM663.641 100.005C665.679 107.231 677.537 104.081 675.499 96.8553L666.05 66.2856C663.456 57.7631 655.489 55.7251 648.82 61.098L618.991 86.6654C617.324 87.9623 621.029 89.815 621.214 88.1476L625.846 61.6538C626.958 55.3546 624.179 50.5375 615.841 50.5375L579.158 51.0934C576.008 51.0934 578.417 53.8724 578.417 57.022C578.417 60.1716 580.825 61.6538 583.975 61.6538L616.212 60.9127C616.397 60.9127 614.544 59.6158 614.544 59.8011L609.727 88.7034C607.875 99.6344 617.694 102.784 626.031 95.7437L655.86 70.1763L654.192 69.6205L663.641 100.005ZM571.191 89.0739C555.443 88.7034 562.298 61.4685 578.787 61.8391C594.72 62.0243 587.124 89.2592 571.191 89.0739ZM571.006 100.375C601.575 100.931 611.024 51.6492 579.158 51.0934C547.847 50.5375 540.065 99.8197 571.006 100.375ZM521.909 46.4616C525.985 46.4616 529.505 42.9414 529.505 38.6802C529.505 34.4189 525.985 31.0841 521.909 31.0841C517.833 31.0841 514.127 34.6042 514.127 38.6802C514.127 42.7562 517.648 46.4616 521.909 46.4616ZM472.256 103.525C493.192 103.71 515.98 73.3259 519.13 62.3949L509.866 60.9127C505.234 73.3259 497.638 101.672 519.871 102.043C536.545 102.228 552.479 85.3685 563.595 70.1763C564.151 69.2499 564.706 68.1383 564.706 66.8414C564.706 63.6918 563.965 61.098 560.816 61.098C558.963 61.098 557.296 62.0243 556.184 63.5065C546.365 77.0313 530.802 90.9266 522.094 90.7414C511.904 90.5561 517.462 71.4732 519.871 64.9887C523.391 55.7251 512.831 53.5019 509.681 60.9127C506.531 68.6941 488.19 92.4088 475.035 92.2235C467.439 92.0383 464.29 83.8863 472.441 59.9864L486.707 17.7445C487.634 14.4097 485.41 10.519 481.334 10.519C478.741 10.519 476.517 12.1864 475.962 14.4097L461.696 56.4662C451.506 86.4801 455.211 103.155 472.256 103.525ZM447.43 42.5709L496.527 41.4593C499.306 41.4593 501.529 39.0507 501.529 36.2717C501.529 33.3073 499.306 31.0841 496.341 31.0841L447.245 32.1957C444.466 32.1957 442.242 34.4189 442.242 37.3833C442.242 40.1624 444.466 42.5709 447.43 42.5709ZM422.974 106.304C435.387 106.489 457.249 94.8173 472.441 53.8724C473.553 50.7228 472.071 48.3143 468.365 48.3143C466.142 48.3143 464.29 49.6112 463.548 51.6492C450.394 87.2212 431.682 96.1142 424.456 95.929C419.454 95.929 417.972 93.3352 418.713 85.5538C419.454 78.1429 410.376 74.9933 406.114 81.1073C401.297 87.777 394.442 94.2615 385.549 94.0763C370.172 93.891 376.471 67.0267 399.815 67.3972C408.338 67.5825 414.452 71.4732 417.045 76.6608C417.786 78.3282 419.454 79.6251 421.492 79.6251C424.271 79.6251 426.679 77.2166 426.679 74.4375C426.679 73.6964 426.494 72.9553 426.124 72.2143C421.862 63.6918 412.414 57.3926 400 57.2073C363.502 56.6515 353.497 104.451 383.326 104.822C397.036 105.193 410.005 94.0763 413.34 85.9243C412.599 86.8507 408.338 86.6654 408.523 84.4422C407.411 97.4111 410.931 106.119 422.974 106.304ZM335.897 104.266C335.897 115.012 347.569 117.606 347.569 103.34C347.569 89.0739 358.5 54.4282 361.464 45.1647L396.666 43.6825C405.929 43.1267 404.262 33.1221 397.036 33.3073L364.984 34.4189L368.875 22.7469C369.801 20.1531 370.542 17.9298 370.542 16.2624C370.542 13.4833 368.504 11.8159 365.911 11.8159C362.946 11.8159 360.352 12.7422 357.573 21.0794L352.942 35.16L330.153 36.0864C326.263 36.4569 323.483 38.1244 323.483 41.6445C323.483 45.5352 326.448 47.0174 330.709 46.8321L349.421 45.9058C345.901 56.6515 335.897 90.7414 335.897 104.266ZM186.939 78.6988C193.979 56.4662 212.877 54.984 212.877 62.9507C212.877 68.3236 203.984 77.0313 186.939 78.6988ZM113.942 150.955C142.844 152.437 159.704 111.492 160.63 80.5515C161.556 73.3259 153.96 70.3616 148.773 75.7344C141.918 83.1453 129.505 93.1499 119.685 93.1499C103.011 93.1499 116.165 59.8011 143.956 59.8011C149.514 59.8011 153.59 61.6538 156.184 64.0623C160.815 68.3236 170.82 62.0243 165.818 56.0957C161.927 51.4639 155.072 48.129 144.882 48.129C102.455 48.129 83.7426 105.007 116.721 105.007C134.692 105.007 151.367 88.3329 155.257 82.7747C154.516 83.5158 149.329 81.2925 149.699 79.4398L149.143 83.5158C148.958 107.045 134.322 141.506 116.536 139.838C113.386 139.468 112.089 137.43 112.089 134.836C112.089 128.907 122.094 119.273 145.067 113.53C159.518 109.824 152.293 101.487 143.4 104.081C111.163 113.53 99.6759 127.425 99.6759 137.8C99.6759 145.026 105.605 150.584 113.942 150.955ZM194.72 109.454C214.359 109.454 239 95.3732 251.228 77.9577C250.301 82.96 246.596 96.8553 246.596 101.487C246.596 110.01 254.748 109.454 261.232 102.784L288.097 75.5491L290.32 85.7391C293.284 99.4491 299.213 104.822 308.847 104.822C326.263 104.822 342.196 85.7391 349.421 74.8081L344.049 63.6918C339.787 74.8081 321.631 92.5941 311.626 92.5941C306.994 92.5941 304.771 89.815 303.289 83.7011L300.325 71.2879C297.916 60.7275 289.023 58.3189 279.018 68.1383L261.788 84.8127L264.382 69.991C266.235 59.2453 255.674 58.1337 250.116 65.915C241.779 77.0313 216.767 97.7817 196.387 97.7817C187.865 97.7817 185.456 93.7057 185.456 88.3329C230.848 84.998 239.185 47.2027 208.986 47.2027C172.858 47.2027 157.11 109.454 194.72 109.454Z" fill="currentColor"></path></svg></a><p', ">v0.1.4</p><button", "><span", "><span", ">", "</span></span></button></div><div", "></div><div", "><div", "><div", ">Output Detail<!--$-->", "<!--/--></div><button", "><span", ">", "</span><span", ">", '</span></button></div><div class="', '"><div', ">Solid Components<!--$-->", "<!--/--></div><!--$-->", '<!--/--></div><div class="', '"><div', ">Hide Until Restart<!--$-->", "<!--/--></div><!--$-->", "<!--/--></div></div><div", "></div><div", '><div class="', '">Marker Color</div><div', ">", "</div></div><div", "></div><div", "><!--$-->", "<!--/--><!--$-->", "<!--/--></div><div", "></div><button", "><span>Manage MCP & Webhooks</span><span", "><!--$-->", '<!--/--><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 12.5L12 8L7.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></span></button></div><div class="', '"><button', "><!--$-->", "<!--/--><span>Manage MCP & Webhooks</span></button><div", "></div><div", "><div", "><span", ">MCP Connection<!--$-->", "<!--/--></span><!--$-->", "<!--/--></div><p", ' style="', '">MCP connection allows agents to receive and act on annotations. <a href="https://agentation.dev/mcp" target="_blank" rel="noopener noreferrer"', ">Learn more</a></p></div><div", '></div><div class="', '"><div', "><span", ">Webhooks<!--$-->", "<!--/--></span><div", '><label for="agentation-auto-send" class="', '">Auto-Send</label><!--$-->', "<!--/--></div></div><p", ">The webhook URL will receive live annotation changes and annotation data.</p><textarea", ' placeholder="Webhook URL"', "></textarea></div></div></div></div>"], _tmpl$199 = ["<button", ' class="', '" style="', '"', ' type="button"></button>'], _tmpl$200 = ["<span", ' class="', '">', "</span>"], _tmpl$201 = ["<span", ' class="', '"', "></span>"], _tmpl$202 = ["<div", ' class="', '" style="', '" data-feedback-toolbar></div>'], _tmpl$203 = ["<div", " data-feedback-toolbar><div", "><span", '>Toggle Opacity</span><input type="range"', ' min="0" max="1" step="0.01"', "></div><div", "><span", ">Wireframe Mode</span><span", "></span><button", ">Start Over</button></div>Drag components onto the canvas.<br>Copied output will only include the wireframed layout.</div>"], _tmpl$204 = ["<div", "></div>"], _tmpl$205 = ["<div", ' data-feedback-toolbar style="', '"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--></div>"], _tmpl$206 = ["<div", ' style="', '"', ' data-agentation-root><div class="', '" data-feedback-toolbar data-agentation-toolbar style="', '"><div class="', '"', '><div class="', '"><!--$-->', "<!--/--><!--$-->", '<!--/--></div><div class="', '"><div class="', '"><button', ">", "</button><span", "><!--$-->", "<!--/--><span", ">P</span></span></div><div", '><button class="', '"', ' style="', '">', "</button><span", "><!--$-->", "<!--/--><span", ">L</span></span></div><div", "><button", "", ">", "</button><span", "><!--$-->", "<!--/--><span", ">H</span></span></div><div", '><button class="', '"', ">", "</button><span", "><!--$-->", "<!--/--><span", '>C</span></span></div><div class="', '"><button class="', '"', "><!--$-->", "<!--/--><!--$-->", "<!--/--></button><span", ">Send Annotations<span", ">S</span></span></div><div", "><button", "", " data-danger>", "</button><span", ">Clear all<span", ">X</span></span></div><div", "><button", ">", "</button><!--$-->", "<!--/--><span", ">Settings</span></div><div", '></div><div class="', '"><button', ">", "</button><span", ">Exit<span", ">Esc</span></span></div></div><!--$-->", "<!--/--><!--$-->", "<!--/--></div></div><!--$-->", "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--><!--$-->", '<!--/--><canvas class="', '" style="', '" data-feedback-toolbar></canvas><div', " data-feedback-toolbar>", "</div><div", " data-feedback-toolbar>", "</div><!--$-->", "<!--/--></div>"], _tmpl$207 = ["<div", ' class="', '" style="', '"></div>'], _tmpl$208 = ["<div", ">", "</div>"], _tmpl$209 = ["<div", ' class="', '" style="', '"><!--$-->', "<!--/--><div", ">", "</div></div>"];
var css = '.styles-module__popup___IhzrD svg[fill=none] {\n  fill: none !important;\n}\n.styles-module__popup___IhzrD svg[fill=none] :not([fill]) {\n  fill: none !important;\n}\n\n@keyframes styles-module__popupEnter___AuQDN {\n  from {\n    opacity: 0;\n    transform: translateX(-50%) scale(0.95) translateY(4px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(-50%) scale(1) translateY(0);\n  }\n}\n@keyframes styles-module__popupExit___JJKQX {\n  from {\n    opacity: 1;\n    transform: translateX(-50%) scale(1) translateY(0);\n  }\n  to {\n    opacity: 0;\n    transform: translateX(-50%) scale(0.95) translateY(4px);\n  }\n}\n@keyframes styles-module__shake___jdbWe {\n  0%, 100% {\n    transform: translateX(-50%) scale(1) translateY(0) translateX(0);\n  }\n  20% {\n    transform: translateX(-50%) scale(1) translateY(0) translateX(-3px);\n  }\n  40% {\n    transform: translateX(-50%) scale(1) translateY(0) translateX(3px);\n  }\n  60% {\n    transform: translateX(-50%) scale(1) translateY(0) translateX(-2px);\n  }\n  80% {\n    transform: translateX(-50%) scale(1) translateY(0) translateX(2px);\n  }\n}\n.styles-module__popup___IhzrD {\n  position: fixed;\n  transform: translateX(-50%);\n  width: 280px;\n  padding: 0.75rem 1rem 14px;\n  background: #1a1a1a;\n  border-radius: 16px;\n  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.08);\n  z-index: 100001;\n  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n  will-change: transform, opacity;\n  opacity: 0;\n}\n.styles-module__popup___IhzrD.styles-module__enter___L7U7N {\n  animation: styles-module__popupEnter___AuQDN 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;\n}\n.styles-module__popup___IhzrD.styles-module__entered___COX-w {\n  opacity: 1;\n  transform: translateX(-50%) scale(1) translateY(0);\n}\n.styles-module__popup___IhzrD.styles-module__exit___5eGjE {\n  animation: styles-module__popupExit___JJKQX 0.15s ease-in forwards;\n}\n.styles-module__popup___IhzrD.styles-module__entered___COX-w.styles-module__shake___jdbWe {\n  animation: styles-module__shake___jdbWe 0.25s ease-out;\n}\n\n.styles-module__header___wWsSi {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-bottom: 0.5625rem;\n}\n\n.styles-module__element___fTV2z {\n  font-size: 0.75rem;\n  font-weight: 400;\n  color: rgba(255, 255, 255, 0.5);\n  max-width: 100%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  flex: 1;\n}\n\n.styles-module__headerToggle___WpW0b {\n  display: flex;\n  align-items: center;\n  gap: 0.25rem;\n  background: none;\n  border: none;\n  padding: 0;\n  cursor: pointer;\n  flex: 1;\n  min-width: 0;\n  text-align: left;\n}\n.styles-module__headerToggle___WpW0b .styles-module__element___fTV2z {\n  flex: 1;\n}\n\n.styles-module__chevron___ZZJlR {\n  color: rgba(255, 255, 255, 0.5);\n  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);\n  flex-shrink: 0;\n}\n.styles-module__chevron___ZZJlR.styles-module__expanded___2Hxgv {\n  transform: rotate(90deg);\n}\n\n.styles-module__stylesWrapper___pnHgy {\n  display: grid;\n  grid-template-rows: 0fr;\n  transition: grid-template-rows 0.3s cubic-bezier(0.16, 1, 0.3, 1);\n}\n.styles-module__stylesWrapper___pnHgy.styles-module__expanded___2Hxgv {\n  grid-template-rows: 1fr;\n}\n\n.styles-module__stylesInner___YYZe2 {\n  overflow: hidden;\n}\n\n.styles-module__stylesBlock___VfQKn {\n  background: rgba(255, 255, 255, 0.05);\n  border-radius: 0.375rem;\n  padding: 0.5rem 0.625rem;\n  margin-bottom: 0.5rem;\n  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;\n  font-size: 0.6875rem;\n  line-height: 1.5;\n}\n\n.styles-module__styleLine___1YQiD {\n  color: rgba(255, 255, 255, 0.85);\n  word-break: break-word;\n}\n\n.styles-module__styleProperty___84L1i {\n  color: #c792ea;\n}\n\n.styles-module__styleValue___q51-h {\n  color: rgba(255, 255, 255, 0.85);\n}\n\n.styles-module__timestamp___Dtpsv {\n  font-size: 0.625rem;\n  font-weight: 500;\n  color: rgba(255, 255, 255, 0.35);\n  font-variant-numeric: tabular-nums;\n  margin-left: 0.5rem;\n  flex-shrink: 0;\n}\n\n.styles-module__quote___mcMmQ {\n  font-size: 12px;\n  font-style: italic;\n  color: rgba(255, 255, 255, 0.6);\n  margin-bottom: 0.5rem;\n  padding: 0.4rem 0.5rem;\n  background: rgba(255, 255, 255, 0.05);\n  border-radius: 0.25rem;\n  line-height: 1.45;\n}\n\n.styles-module__textarea___jrSae {\n  width: 100%;\n  padding: 0.5rem 0.625rem;\n  font-size: 0.8125rem;\n  font-family: inherit;\n  background: rgba(255, 255, 255, 0.05);\n  color: #fff;\n  border: 1px solid rgba(255, 255, 255, 0.15);\n  border-radius: 8px;\n  resize: none;\n  outline: none;\n  transition: border-color 0.15s ease;\n}\n.styles-module__textarea___jrSae:focus {\n  border-color: var(--agentation-color-blue);\n}\n.styles-module__textarea___jrSae.styles-module__green___99l3h:focus {\n  border-color: var(--agentation-color-green);\n}\n.styles-module__textarea___jrSae::placeholder {\n  color: rgba(255, 255, 255, 0.35);\n}\n.styles-module__textarea___jrSae::-webkit-scrollbar {\n  width: 6px;\n}\n.styles-module__textarea___jrSae::-webkit-scrollbar-track {\n  background: transparent;\n}\n.styles-module__textarea___jrSae::-webkit-scrollbar-thumb {\n  background: rgba(255, 255, 255, 0.2);\n  border-radius: 3px;\n}\n\n.styles-module__actions___D6x3f {\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.375rem;\n  margin-top: 0.5rem;\n}\n\n.styles-module__cancel___hRjnL,\n.styles-module__submit___K-mIR {\n  padding: 0.4rem 0.875rem;\n  font-size: 0.75rem;\n  font-weight: 500;\n  border-radius: 1rem;\n  border: none;\n  cursor: pointer;\n  transition: background-color 0.15s ease, color 0.15s ease, opacity 0.15s ease;\n}\n\n.styles-module__cancel___hRjnL {\n  background: transparent;\n  color: rgba(255, 255, 255, 0.5);\n}\n.styles-module__cancel___hRjnL:hover {\n  background: rgba(255, 255, 255, 0.1);\n  color: rgba(255, 255, 255, 0.8);\n}\n\n.styles-module__submit___K-mIR {\n  color: white;\n}\n.styles-module__submit___K-mIR:hover:not(:disabled) {\n  filter: brightness(0.9);\n}\n.styles-module__submit___K-mIR:disabled {\n  cursor: not-allowed;\n}\n\n.styles-module__deleteWrapper___oSjdo {\n  margin-right: auto;\n}\n\n.styles-module__deleteButton___4VuAE {\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 28px;\n  height: 28px;\n  border-radius: 50%;\n  border: none;\n  background: transparent;\n  color: rgba(255, 255, 255, 0.4);\n  transition: background-color 0.15s ease, color 0.15s ease, transform 0.1s ease;\n}\n.styles-module__deleteButton___4VuAE:hover {\n  background-color: color-mix(in srgb, var(--agentation-color-red) 25%, transparent);\n  color: var(--agentation-color-red);\n}\n.styles-module__deleteButton___4VuAE:active {\n  transform: scale(0.92);\n}\n\n.styles-module__light___6AaSQ.styles-module__popup___IhzrD {\n  background: #fff;\n  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.06);\n}\n.styles-module__light___6AaSQ .styles-module__element___fTV2z {\n  color: rgba(0, 0, 0, 0.6);\n}\n.styles-module__light___6AaSQ .styles-module__timestamp___Dtpsv {\n  color: rgba(0, 0, 0, 0.4);\n}\n.styles-module__light___6AaSQ .styles-module__chevron___ZZJlR {\n  color: rgba(0, 0, 0, 0.4);\n}\n.styles-module__light___6AaSQ .styles-module__stylesBlock___VfQKn {\n  background: rgba(0, 0, 0, 0.03);\n}\n.styles-module__light___6AaSQ .styles-module__styleLine___1YQiD {\n  color: rgba(0, 0, 0, 0.75);\n}\n.styles-module__light___6AaSQ .styles-module__styleProperty___84L1i {\n  color: #7c3aed;\n}\n.styles-module__light___6AaSQ .styles-module__styleValue___q51-h {\n  color: rgba(0, 0, 0, 0.75);\n}\n.styles-module__light___6AaSQ .styles-module__quote___mcMmQ {\n  color: rgba(0, 0, 0, 0.55);\n  background: rgba(0, 0, 0, 0.04);\n}\n.styles-module__light___6AaSQ .styles-module__textarea___jrSae {\n  background: rgba(0, 0, 0, 0.03);\n  color: #1a1a1a;\n  border-color: rgba(0, 0, 0, 0.12);\n}\n.styles-module__light___6AaSQ .styles-module__textarea___jrSae::placeholder {\n  color: rgba(0, 0, 0, 0.4);\n}\n.styles-module__light___6AaSQ .styles-module__textarea___jrSae::-webkit-scrollbar-thumb {\n  background: rgba(0, 0, 0, 0.15);\n}\n.styles-module__light___6AaSQ .styles-module__cancel___hRjnL {\n  color: rgba(0, 0, 0, 0.5);\n}\n.styles-module__light___6AaSQ .styles-module__cancel___hRjnL:hover {\n  background: rgba(0, 0, 0, 0.06);\n  color: rgba(0, 0, 0, 0.75);\n}\n.styles-module__light___6AaSQ .styles-module__deleteButton___4VuAE {\n  color: rgba(0, 0, 0, 0.4);\n}\n.styles-module__light___6AaSQ .styles-module__deleteButton___4VuAE:hover {\n  background-color: color-mix(in srgb, var(--agentation-color-red) 25%, transparent);\n  color: var(--agentation-color-red);\n}';
var classNames = { "popup": "styles-module__popup___IhzrD", "enter": "styles-module__enter___L7U7N", "entered": "styles-module__entered___COX-w", "exit": "styles-module__exit___5eGjE", "shake": "styles-module__shake___jdbWe", "header": "styles-module__header___wWsSi", "element": "styles-module__element___fTV2z", "headerToggle": "styles-module__headerToggle___WpW0b", "chevron": "styles-module__chevron___ZZJlR", "expanded": "styles-module__expanded___2Hxgv", "stylesWrapper": "styles-module__stylesWrapper___pnHgy", "stylesInner": "styles-module__stylesInner___YYZe2", "stylesBlock": "styles-module__stylesBlock___VfQKn", "styleLine": "styles-module__styleLine___1YQiD", "styleProperty": "styles-module__styleProperty___84L1i", "styleValue": "styles-module__styleValue___q51-h", "timestamp": "styles-module__timestamp___Dtpsv", "quote": "styles-module__quote___mcMmQ", "textarea": "styles-module__textarea___jrSae", "actions": "styles-module__actions___D6x3f", "cancel": "styles-module__cancel___hRjnL", "submit": "styles-module__submit___K-mIR", "deleteWrapper": "styles-module__deleteWrapper___oSjdo", "deleteButton": "styles-module__deleteButton___4VuAE", "light": "styles-module__light___6AaSQ" };
if (typeof document !== "undefined") {
  let style = document.getElementById("feedback-tool-styles-annotation-popup-css-styles");
  if (!style) {
    style = document.createElement("style");
    style.id = "feedback-tool-styles-annotation-popup-css-styles";
    style.textContent = css;
    document.head.appendChild(style);
  }
}
var styles_module_default = classNames;
var css2 = ".icon-transitions-module__iconState___uqK9J {\n  transition: opacity 0.2s ease, transform 0.2s ease;\n  transform-origin: center;\n}\n\n.icon-transitions-module__iconStateFast___HxlMm {\n  transition: opacity 0.15s ease, transform 0.15s ease;\n  transform-origin: center;\n}\n\n.icon-transitions-module__iconFade___nPwXg {\n  transition: opacity 0.2s ease;\n}\n\n.icon-transitions-module__iconFadeFast___Ofb2t {\n  transition: opacity 0.15s ease;\n}\n\n.icon-transitions-module__visible___PlHsU {\n  opacity: 1 !important;\n}\n\n.icon-transitions-module__visibleScaled___8Qog- {\n  opacity: 1 !important;\n  transform: scale(1);\n}\n\n.icon-transitions-module__hidden___ETykt {\n  opacity: 0 !important;\n}\n\n.icon-transitions-module__hiddenScaled___JXn-m {\n  opacity: 0 !important;\n  transform: scale(0.8);\n}\n\n.icon-transitions-module__sending___uaLN- {\n  opacity: 0.5 !important;\n  transform: scale(0.8);\n}";
var classNames2 = { "iconState": "icon-transitions-module__iconState___uqK9J", "iconStateFast": "icon-transitions-module__iconStateFast___HxlMm", "iconFade": "icon-transitions-module__iconFade___nPwXg", "iconFadeFast": "icon-transitions-module__iconFadeFast___Ofb2t", "visible": "icon-transitions-module__visible___PlHsU", "visibleScaled": "icon-transitions-module__visibleScaled___8Qog-", "hidden": "icon-transitions-module__hidden___ETykt", "hiddenScaled": "icon-transitions-module__hiddenScaled___JXn-m", "sending": "icon-transitions-module__sending___uaLN-" };
if (typeof document !== "undefined") {
  let style = document.getElementById("feedback-tool-styles-components-icon-transitions");
  if (!style) {
    style = document.createElement("style");
    style.id = "feedback-tool-styles-components-icon-transitions";
    style.textContent = css2;
    document.head.appendChild(style);
  }
}
var icon_transitions_module_default = classNames2;
var IconPlus = ({ size = 16 }) => ssr(_tmpl$2$1, ssrHydrationKey() + ssrAttribute("width", escape(size, true), false) + ssrAttribute("height", escape(size, true), false));
var IconListSparkle = ({ size = 24, style = {} }) => ssr(_tmpl$5, ssrHydrationKey() + ssrAttribute("width", escape(size, true), false) + ssrAttribute("height", escape(size, true), false), ssrStyle(style));
var IconHelp = ({ size = 20, ...props }) => ssrElement("svg", mergeProps({ width: size, height: size, viewBox: "0 0 20 20", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, props), () => [ssr(_tmpl$6), ssr(_tmpl$7), ssr(_tmpl$8)], true);
var IconCopyAnimated = ({ size = 24, copied = false, tint }) => ssr(_tmpl$1, ssrHydrationKey() + ssrAttribute("width", escape(size, true), false) + ssrAttribute("height", escape(size, true), false), ssrStyle(tint ? { color: tint, transition: "color 0.3s ease" } : void 0), `${escape(icon_transitions_module_default.iconState, true)} ${copied ? escape(icon_transitions_module_default.hiddenScaled, true) : escape(icon_transitions_module_default.visibleScaled, true)}`, `${escape(icon_transitions_module_default.iconState, true)} ${copied ? escape(icon_transitions_module_default.visibleScaled, true) : escape(icon_transitions_module_default.hiddenScaled, true)}`);
var IconSendArrow = ({ size = 24, state = "idle" }) => {
  const showArrow = state === "idle";
  const showCheck = state === "sent";
  const showError = state === "failed";
  const isSending = state === "sending";
  return ssr(_tmpl$10, ssrHydrationKey() + ssrAttribute("width", escape(size, true), false) + ssrAttribute("height", escape(size, true), false), `${escape(icon_transitions_module_default.iconStateFast, true)} ${showArrow ? escape(icon_transitions_module_default.visibleScaled, true) : isSending ? escape(icon_transitions_module_default.sending, true) : escape(icon_transitions_module_default.hiddenScaled, true)}`, `${escape(icon_transitions_module_default.iconStateFast, true)} ${showCheck ? escape(icon_transitions_module_default.visibleScaled, true) : escape(icon_transitions_module_default.hiddenScaled, true)}`, `${escape(icon_transitions_module_default.iconStateFast, true)} ${showError ? escape(icon_transitions_module_default.visibleScaled, true) : escape(icon_transitions_module_default.hiddenScaled, true)}`);
};
var IconEyeAnimated = ({ size = 24, isOpen = true }) => ssr(_tmpl$15, ssrHydrationKey() + ssrAttribute("width", escape(size, true), false) + ssrAttribute("height", escape(size, true), false), `${escape(icon_transitions_module_default.iconFade, true)} ${isOpen ? escape(icon_transitions_module_default.visible, true) : escape(icon_transitions_module_default.hidden, true)}`, `${escape(icon_transitions_module_default.iconFade, true)} ${isOpen ? escape(icon_transitions_module_default.hidden, true) : escape(icon_transitions_module_default.visible, true)}`);
var IconPausePlayAnimated = ({ size = 24, isPaused = false }) => ssr(_tmpl$16, ssrHydrationKey() + ssrAttribute("width", escape(size, true), false) + ssrAttribute("height", escape(size, true), false), `${escape(icon_transitions_module_default.iconFadeFast, true)} ${isPaused ? escape(icon_transitions_module_default.hidden, true) : escape(icon_transitions_module_default.visible, true)}`, `${escape(icon_transitions_module_default.iconFadeFast, true)} ${isPaused ? escape(icon_transitions_module_default.visible, true) : escape(icon_transitions_module_default.hidden, true)}`);
var IconGear = ({ size = 16 }) => ssr(_tmpl$18, ssrHydrationKey() + ssrAttribute("width", escape(size, true), false) + ssrAttribute("height", escape(size, true), false));
var IconTrashAlt = ({ size = 16 }) => ssr(_tmpl$22, ssrHydrationKey() + ssrAttribute("width", escape(size, true), false) + ssrAttribute("height", escape(size, true), false));
var IconXmark = ({ size = 16 }) => ssr(_tmpl$27, ssrHydrationKey() + ssrAttribute("width", escape(size, true), false) + ssrAttribute("height", escape(size, true), false));
var IconXmarkLarge = ({ size = 24 }) => ssr(_tmpl$28, ssrHydrationKey() + ssrAttribute("width", escape(size, true), false) + ssrAttribute("height", escape(size, true), false));
var IconSun = ({ size = 16 }) => ssr(_tmpl$29, ssrHydrationKey() + ssrAttribute("width", escape(size, true), false) + ssrAttribute("height", escape(size, true), false));
var IconMoon = ({ size = 16 }) => ssr(_tmpl$30, ssrHydrationKey() + ssrAttribute("width", escape(size, true), false) + ssrAttribute("height", escape(size, true), false));
var IconEdit = ({ size = 16 }) => ssr(_tmpl$31, ssrHydrationKey() + ssrAttribute("width", escape(size, true), false) + ssrAttribute("height", escape(size, true), false));
var IconTrash = ({ size = 24 }) => ssr(_tmpl$32, ssrHydrationKey() + ssrAttribute("width", escape(size, true), false) + ssrAttribute("height", escape(size, true), false));
var IconChevronLeft = ({ size = 16 }) => ssr(_tmpl$33, ssrHydrationKey() + ssrAttribute("width", escape(size, true), false) + ssrAttribute("height", escape(size, true), false));
var IconLayout = ({ size = 24 }) => ssr(_tmpl$36, ssrHydrationKey() + ssrAttribute("width", escape(size, true), false) + ssrAttribute("height", escape(size, true), false));
var EXCLUDE_ATTRS = ["data-feedback-toolbar", "data-annotation-popup", "data-annotation-marker"];
var NOT_SELECTORS = EXCLUDE_ATTRS.flatMap((a) => [`:not([${a}])`, `:not([${a}] *)`]).join("");
var STYLE_ID = "feedback-freeze-styles";
var STATE_KEY = "__agentation_freeze";
function getState() {
  if (typeof window === "undefined") {
    return {
      frozen: false,
      installed: true,
      // prevent patching on server
      origSetTimeout: setTimeout,
      origSetInterval: setInterval,
      origRAF: (cb) => 0,
      pausedAnimations: [],
      frozenTimeoutQueue: [],
      frozenRAFQueue: []
    };
  }
  const w = window;
  if (!w[STATE_KEY]) {
    w[STATE_KEY] = { frozen: false, installed: false, origSetTimeout: null, origSetInterval: null, origRAF: null, pausedAnimations: [], frozenTimeoutQueue: [], frozenRAFQueue: [] };
  }
  return w[STATE_KEY];
}
var _s = getState();
if (typeof window !== "undefined" && !_s.installed) {
  _s.origSetTimeout = window.setTimeout.bind(window);
  _s.origSetInterval = window.setInterval.bind(window);
  _s.origRAF = window.requestAnimationFrame.bind(window);
  window.setTimeout = (handler, timeout, ...args) => {
    if (typeof handler === "string") {
      return _s.origSetTimeout(handler, timeout);
    }
    return _s.origSetTimeout((...a) => {
      if (_s.frozen) {
        _s.frozenTimeoutQueue.push(() => handler(...a));
      } else {
        handler(...a);
      }
    }, timeout, ...args);
  };
  window.setInterval = (handler, timeout, ...args) => {
    if (typeof handler === "string") {
      return _s.origSetInterval(handler, timeout);
    }
    return _s.origSetInterval((...a) => {
      if (!_s.frozen) handler(...a);
    }, timeout, ...args);
  };
  window.requestAnimationFrame = (callback) => {
    return _s.origRAF((timestamp) => {
      if (_s.frozen) {
        _s.frozenRAFQueue.push(callback);
      } else {
        callback(timestamp);
      }
    });
  };
  _s.installed = true;
}
var originalSetTimeout = _s.origSetTimeout;
var originalSetInterval = _s.origSetInterval;
function isAgentationElement(el) {
  if (!el) return false;
  return EXCLUDE_ATTRS.some((attr) => !!el.closest?.(`[${attr}]`));
}
function freeze() {
  if (typeof document === "undefined") return;
  if (_s.frozen) return;
  _s.frozen = true;
  _s.frozenTimeoutQueue = [];
  _s.frozenRAFQueue = [];
  let style = document.getElementById(STYLE_ID);
  if (!style) {
    style = document.createElement("style");
    style.id = STYLE_ID;
  }
  style.textContent = `
    *${NOT_SELECTORS},
    *${NOT_SELECTORS}::before,
    *${NOT_SELECTORS}::after {
      animation-play-state: paused !important;
      transition: none !important;
    }
  `;
  document.head.appendChild(style);
  _s.pausedAnimations = [];
  try {
    document.getAnimations().forEach((anim) => {
      if (anim.playState !== "running") return;
      const target = anim.effect?.target;
      if (!isAgentationElement(target)) {
        anim.pause();
        _s.pausedAnimations.push(anim);
      }
    });
  } catch {
  }
  document.querySelectorAll("video").forEach((video) => {
    if (!video.paused) {
      video.dataset.wasPaused = "false";
      video.pause();
    }
  });
}
function unfreeze() {
  if (typeof document === "undefined") return;
  if (!_s.frozen) return;
  _s.frozen = false;
  const timeoutQueue = _s.frozenTimeoutQueue;
  _s.frozenTimeoutQueue = [];
  for (const cb of timeoutQueue) {
    _s.origSetTimeout(() => {
      if (_s.frozen) {
        _s.frozenTimeoutQueue.push(cb);
        return;
      }
      try {
        cb();
      } catch (e) {
        console.warn("[agentation] Error replaying queued timeout:", e);
      }
    }, 0);
  }
  const rafQueue = _s.frozenRAFQueue;
  _s.frozenRAFQueue = [];
  for (const cb of rafQueue) {
    _s.origRAF((ts) => {
      if (_s.frozen) {
        _s.frozenRAFQueue.push(cb);
        return;
      }
      cb(ts);
    });
  }
  for (const anim of _s.pausedAnimations) {
    try {
      anim.play();
    } catch (e) {
      console.warn("[agentation] Error resuming animation:", e);
    }
  }
  _s.pausedAnimations = [];
  document.getElementById(STYLE_ID)?.remove();
  document.querySelectorAll("video").forEach((video) => {
    if (video.dataset.wasPaused === "false") {
      video.play().catch(() => {
      });
      delete video.dataset.wasPaused;
    }
  });
}
function AnnotationPopupCSS(props) {
  const [text, setText] = createSignal(props.initialValue ?? "");
  const [isShaking, setIsShaking] = createSignal(false);
  const [animState, setAnimState] = createSignal("initial");
  const [isFocused, setIsFocused] = createSignal(false);
  const [isStylesExpanded, setIsStylesExpanded] = createSignal(false);
  let shakeTimerRef = null;
  createEffect(() => {
    if (props.isExiting && animState() !== "exit") {
      setAnimState("exit");
    }
  });
  onMount(() => {
    originalSetTimeout(() => {
      setAnimState("enter");
    }, 0);
    const enterTimer = originalSetTimeout(() => {
      setAnimState("entered");
    }, 200);
    const focusTimer = originalSetTimeout(() => {
    }, 50);
    onCleanup(() => {
      clearTimeout(enterTimer);
      clearTimeout(focusTimer);
      if (shakeTimerRef) clearTimeout(shakeTimerRef);
    });
  });
  const shake = () => {
    if (shakeTimerRef) clearTimeout(shakeTimerRef);
    setIsShaking(true);
    shakeTimerRef = originalSetTimeout(() => {
      setIsShaking(false);
    }, 250);
  };
  props.ref?.({ shake });
  const popupClassName = () => [styles_module_default.popup, props.lightMode ? styles_module_default.light : "", animState() === "enter" ? styles_module_default.enter : "", animState() === "entered" ? styles_module_default.entered : "", animState() === "exit" ? styles_module_default.exit : "", isShaking() ? styles_module_default.shake : ""].filter(Boolean).join(" ");
  return ssr(_tmpl$42, ssrHydrationKey() + ssrAttribute("class", escape(popupClassName(), true), false), ssrStyle(props.style), ssrAttribute("class", escape(styles_module_default.header, true), false), escape(createComponent(Show$1, { get when() {
    return props.computedStyles && Object.keys(props.computedStyles).length > 0;
  }, get fallback() {
    return ssr(_tmpl$38, ssrHydrationKey() + ssrAttribute("class", escape(styles_module_default.element, true), false), escape(props.element));
  }, get children() {
    return ssr(_tmpl$37, ssrHydrationKey() + ssrAttribute("class", escape(styles_module_default.headerToggle, true), false), `${escape(styles_module_default.chevron, true)} ${isStylesExpanded() ? escape(styles_module_default.expanded, true) : ""}`, ssrAttribute("class", escape(styles_module_default.element, true), false), escape(props.element));
  } })), escape(createComponent(Show$1, { get when() {
    return props.timestamp;
  }, get children() {
    return ssr(_tmpl$38, ssrHydrationKey() + ssrAttribute("class", escape(styles_module_default.timestamp, true), false), escape(props.timestamp));
  } })), escape(createComponent(Show$1, { get when() {
    return props.computedStyles && Object.keys(props.computedStyles).length > 0;
  }, get children() {
    return ssr(_tmpl$39, ssrHydrationKey(), `${escape(styles_module_default.stylesWrapper, true)} ${isStylesExpanded() ? escape(styles_module_default.expanded, true) : ""}`, ssrAttribute("class", escape(styles_module_default.stylesInner, true), false), ssrAttribute("class", escape(styles_module_default.stylesBlock, true), false), escape(Object.entries(props.computedStyles).map(([key, value]) => ssr(_tmpl$43, ssrHydrationKey() + ssrAttribute("class", escape(styles_module_default.styleLine, true), false), ssrAttribute("class", escape(styles_module_default.styleProperty, true), false), escape(key.replace(/([A-Z])/g, "-$1").toLowerCase()), ssrAttribute("class", escape(styles_module_default.styleValue, true), false), escape(value)))));
  } })), escape(createComponent(Show$1, { get when() {
    return props.selectedText;
  }, get children() {
    return ssr(_tmpl$40, ssrHydrationKey() + ssrAttribute("class", escape(styles_module_default.quote, true), false), escape(props.selectedText.slice(0, 80)), props.selectedText.length > 80 ? "..." : "");
  } })), ssrAttribute("class", escape(styles_module_default.textarea, true), false), ssrStyleProperty("border-color:", isFocused() ? escape(props.accentColor ?? "#3c82f7", true) : void 0), ssrAttribute("placeholder", escape(props.placeholder ?? "What should change?", true), false) + ssrAttribute("value", escape(text(), true), false), ssrAttribute("class", escape(styles_module_default.actions, true), false), escape(createComponent(Show$1, { get when() {
    return props.onDelete;
  }, get children() {
    return ssr(_tmpl$41, ssrHydrationKey() + ssrAttribute("class", escape(styles_module_default.deleteWrapper, true), false), ssrAttribute("class", escape(styles_module_default.deleteButton, true), false), escape(createComponent(IconTrash, { size: 22 })));
  } })), ssrAttribute("class", escape(styles_module_default.cancel, true), false), ssrAttribute("class", escape(styles_module_default.submit, true), false), ssrStyleProperty("background-color:", escape(props.accentColor ?? "#3c82f7", true)) + ssrStyleProperty(";opacity:", text().trim() ? 1 : 0.4), ssrAttribute("disabled", !text().trim(), true), escape(props.submitLabel ?? "Add"));
}
var Tooltip = (props) => {
  const [local, rest] = splitProps(props, ["content", "children"]);
  const [visible, setVisible] = createSignal(false);
  const [shouldRender, setShouldRender] = createSignal(false);
  const [position, setPosition] = createSignal({ top: 0, right: 0 });
  onCleanup(() => {
  });
  return [ssrElement("span", rest, () => escape(local.children), true), createComponent(Show$1, { get when() {
    return shouldRender();
  }, get children() {
    return createComponent(Portal, { get mount() {
      return document.body;
    }, get children() {
      return ssr(_tmpl$44, ssrHydrationKey(), ssrStyleProperty("position:", "fixed") + ssrStyleProperty(";top:", `${escape(position().top, true)}px`) + ssrStyleProperty(";right:", `${escape(position().right, true)}px`) + ssrStyleProperty(";transform:", "translateY(-50%)") + ssrStyleProperty(";padding:", "6px 10px") + ssrStyleProperty(";background:", "#383838") + ssrStyleProperty(";color:", "rgba(255, 255, 255, 0.7)") + ssrStyleProperty(";font-size:", "11px") + ssrStyleProperty(";font-weight:", 400) + ssrStyleProperty(";line-height:", "14px") + ssrStyleProperty(";border-radius:", "10px") + ssrStyleProperty(";width:", "180px") + ssrStyleProperty(";text-align:", "left") + ssrStyleProperty(";z-index:", 100020) + ssrStyleProperty(";pointer-events:", "none") + ssrStyleProperty(";box-shadow:", "0px 1px 8px rgba(0, 0, 0, 0.28)") + ssrStyleProperty(";opacity:", visible() ? 1 : 0) + ssrStyleProperty(";transition:", "opacity 0.15s ease"), escape(local.content));
    } });
  } })];
};
var css3 = ".styles-module__tooltip___mcXL2 {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  cursor: help;\n}\n\n.styles-module__tooltipIcon___Nq2nD {\n  transform: translateY(0.5px);\n  color: #fff;\n  opacity: 0.2;\n  transition: opacity 0.15s ease;\n  will-change: transform;\n}\n.styles-module__tooltip___mcXL2:hover .styles-module__tooltipIcon___Nq2nD {\n  opacity: 0.5;\n}\n[data-agentation-theme=light] .styles-module__tooltipIcon___Nq2nD {\n  color: #000;\n}";
var classNames3 = { "tooltip": "styles-module__tooltip___mcXL2", "tooltipIcon": "styles-module__tooltipIcon___Nq2nD" };
if (typeof document !== "undefined") {
  let style = document.getElementById("feedback-tool-styles-help-tooltip-styles");
  if (!style) {
    style = document.createElement("style");
    style.id = "feedback-tool-styles-help-tooltip-styles";
    style.textContent = css3;
    document.head.appendChild(style);
  }
}
var styles_module_default2 = classNames3;
var HelpTooltip = (props) => {
  return createComponent(Tooltip, { get ["class"]() {
    return styles_module_default2.tooltip;
  }, get content() {
    return props.content;
  }, get children() {
    return createComponent(IconHelp, { get ["class"]() {
      return styles_module_default2.tooltipIcon;
    } });
  } });
};
var DEFAULT_SIZES = { navigation: { width: 800, height: 56 }, hero: { width: 800, height: 320 }, header: { width: 800, height: 80 }, section: { width: 800, height: 400 }, sidebar: { width: 240, height: 400 }, footer: { width: 800, height: 160 }, modal: { width: 480, height: 300 }, card: { width: 280, height: 240 }, text: { width: 400, height: 120 }, image: { width: 320, height: 200 }, video: { width: 480, height: 270 }, table: { width: 560, height: 220 }, grid: { width: 600, height: 300 }, list: { width: 300, height: 180 }, chart: { width: 400, height: 240 }, button: { width: 140, height: 40 }, input: { width: 280, height: 56 }, form: { width: 360, height: 320 }, tabs: { width: 480, height: 240 }, dropdown: { width: 200, height: 200 }, toggle: { width: 44, height: 24 }, search: { width: 320, height: 44 }, avatar: { width: 48, height: 48 }, badge: { width: 80, height: 28 }, breadcrumb: { width: 300, height: 24 }, pagination: { width: 300, height: 36 }, progress: { width: 240, height: 8 }, divider: { width: 600, height: 1 }, accordion: { width: 400, height: 200 }, carousel: { width: 600, height: 300 }, toast: { width: 320, height: 64 }, tooltip: { width: 180, height: 40 }, pricing: { width: 300, height: 360 }, testimonial: { width: 360, height: 200 }, cta: { width: 600, height: 160 }, alert: { width: 400, height: 56 }, banner: { width: 800, height: 48 }, stat: { width: 200, height: 120 }, stepper: { width: 480, height: 48 }, tag: { width: 72, height: 28 }, rating: { width: 160, height: 28 }, map: { width: 480, height: 300 }, timeline: { width: 360, height: 320 }, fileUpload: { width: 360, height: 180 }, codeBlock: { width: 480, height: 200 }, calendar: { width: 300, height: 300 }, notification: { width: 360, height: 72 }, productCard: { width: 280, height: 360 }, profile: { width: 280, height: 200 }, drawer: { width: 320, height: 400 }, popover: { width: 240, height: 160 }, logo: { width: 120, height: 40 }, faq: { width: 560, height: 320 }, gallery: { width: 560, height: 360 }, checkbox: { width: 20, height: 20 }, radio: { width: 20, height: 20 }, slider: { width: 240, height: 32 }, datePicker: { width: 300, height: 320 }, skeleton: { width: 320, height: 120 }, chip: { width: 96, height: 32 }, icon: { width: 24, height: 24 }, spinner: { width: 32, height: 32 }, feature: { width: 360, height: 200 }, team: { width: 560, height: 280 }, login: { width: 360, height: 360 }, contact: { width: 400, height: 320 } };
var COMPONENT_REGISTRY = [{ section: "Layout", items: [{ type: "navigation", label: "Navigation", ...DEFAULT_SIZES.navigation }, { type: "header", label: "Header", ...DEFAULT_SIZES.header }, { type: "hero", label: "Hero", ...DEFAULT_SIZES.hero }, { type: "section", label: "Section", ...DEFAULT_SIZES.section }, { type: "sidebar", label: "Sidebar", ...DEFAULT_SIZES.sidebar }, { type: "footer", label: "Footer", ...DEFAULT_SIZES.footer }, { type: "modal", label: "Modal", ...DEFAULT_SIZES.modal }, { type: "banner", label: "Banner", ...DEFAULT_SIZES.banner }, { type: "drawer", label: "Drawer", ...DEFAULT_SIZES.drawer }, { type: "popover", label: "Popover", ...DEFAULT_SIZES.popover }, { type: "divider", label: "Divider", ...DEFAULT_SIZES.divider }] }, { section: "Content", items: [{ type: "card", label: "Card", ...DEFAULT_SIZES.card }, { type: "text", label: "Text", ...DEFAULT_SIZES.text }, { type: "image", label: "Image", ...DEFAULT_SIZES.image }, { type: "video", label: "Video", ...DEFAULT_SIZES.video }, { type: "table", label: "Table", ...DEFAULT_SIZES.table }, { type: "grid", label: "Grid", ...DEFAULT_SIZES.grid }, { type: "list", label: "List", ...DEFAULT_SIZES.list }, { type: "chart", label: "Chart", ...DEFAULT_SIZES.chart }, { type: "codeBlock", label: "Code Block", ...DEFAULT_SIZES.codeBlock }, { type: "map", label: "Map", ...DEFAULT_SIZES.map }, { type: "timeline", label: "Timeline", ...DEFAULT_SIZES.timeline }, { type: "calendar", label: "Calendar", ...DEFAULT_SIZES.calendar }, { type: "accordion", label: "Accordion", ...DEFAULT_SIZES.accordion }, { type: "carousel", label: "Carousel", ...DEFAULT_SIZES.carousel }, { type: "logo", label: "Logo", ...DEFAULT_SIZES.logo }, { type: "faq", label: "FAQ", ...DEFAULT_SIZES.faq }, { type: "gallery", label: "Gallery", ...DEFAULT_SIZES.gallery }] }, { section: "Controls", items: [{ type: "button", label: "Button", ...DEFAULT_SIZES.button }, { type: "input", label: "Input", ...DEFAULT_SIZES.input }, { type: "search", label: "Search", ...DEFAULT_SIZES.search }, { type: "form", label: "Form", ...DEFAULT_SIZES.form }, { type: "tabs", label: "Tabs", ...DEFAULT_SIZES.tabs }, { type: "dropdown", label: "Dropdown", ...DEFAULT_SIZES.dropdown }, { type: "toggle", label: "Toggle", ...DEFAULT_SIZES.toggle }, { type: "stepper", label: "Stepper", ...DEFAULT_SIZES.stepper }, { type: "rating", label: "Rating", ...DEFAULT_SIZES.rating }, { type: "fileUpload", label: "File Upload", ...DEFAULT_SIZES.fileUpload }, { type: "checkbox", label: "Checkbox", ...DEFAULT_SIZES.checkbox }, { type: "radio", label: "Radio", ...DEFAULT_SIZES.radio }, { type: "slider", label: "Slider", ...DEFAULT_SIZES.slider }, { type: "datePicker", label: "Date Picker", ...DEFAULT_SIZES.datePicker }] }, { section: "Elements", items: [{ type: "avatar", label: "Avatar", ...DEFAULT_SIZES.avatar }, { type: "badge", label: "Badge", ...DEFAULT_SIZES.badge }, { type: "tag", label: "Tag", ...DEFAULT_SIZES.tag }, { type: "breadcrumb", label: "Breadcrumb", ...DEFAULT_SIZES.breadcrumb }, { type: "pagination", label: "Pagination", ...DEFAULT_SIZES.pagination }, { type: "progress", label: "Progress", ...DEFAULT_SIZES.progress }, { type: "alert", label: "Alert", ...DEFAULT_SIZES.alert }, { type: "toast", label: "Toast", ...DEFAULT_SIZES.toast }, { type: "notification", label: "Notification", ...DEFAULT_SIZES.notification }, { type: "tooltip", label: "Tooltip", ...DEFAULT_SIZES.tooltip }, { type: "stat", label: "Stat", ...DEFAULT_SIZES.stat }, { type: "skeleton", label: "Skeleton", ...DEFAULT_SIZES.skeleton }, { type: "chip", label: "Chip", ...DEFAULT_SIZES.chip }, { type: "icon", label: "Icon", ...DEFAULT_SIZES.icon }, { type: "spinner", label: "Spinner", ...DEFAULT_SIZES.spinner }] }, { section: "Blocks", items: [{ type: "pricing", label: "Pricing", ...DEFAULT_SIZES.pricing }, { type: "testimonial", label: "Testimonial", ...DEFAULT_SIZES.testimonial }, { type: "cta", label: "CTA", ...DEFAULT_SIZES.cta }, { type: "productCard", label: "Product Card", ...DEFAULT_SIZES.productCard }, { type: "profile", label: "Profile", ...DEFAULT_SIZES.profile }, { type: "feature", label: "Feature", ...DEFAULT_SIZES.feature }, { type: "team", label: "Team", ...DEFAULT_SIZES.team }, { type: "login", label: "Login", ...DEFAULT_SIZES.login }, { type: "contact", label: "Contact", ...DEFAULT_SIZES.contact }] }];
var COMPONENT_MAP = {};
for (const section of COMPONENT_REGISTRY) {
  for (const item of section.items) {
    COMPONENT_MAP[item.type] = item;
  }
}
function Bar({ w, h = 3, strong }) {
  return ssr(_tmpl$45, ssrHydrationKey(), ssrStyleProperty("width:", typeof w === "number" ? `${escape(w, true)}px` : escape(w, true)) + ssrStyleProperty(";height:", escape(h, true)) + ssrStyleProperty(";border-radius:", 2) + ssrStyleProperty(";background:", strong ? "var(--agd-bar-strong)" : "var(--agd-bar)") + ssrStyleProperty(";flex-shrink:", 0));
}
function Block({ w, h, radius = 3, style }) {
  return ssr(_tmpl$45, ssrHydrationKey(), ssrStyle({ width: typeof w === "number" ? `${w}px` : w, height: typeof h === "number" ? `${h}px` : h, "border-radius": radius, border: "1px dashed var(--agd-stroke)", background: "var(--agd-fill)", "flex-shrink": 0, ...style }));
}
function Circle({ size }) {
  return ssr(_tmpl$45, ssrHydrationKey(), ssrStyleProperty("width:", escape(size, true)) + ssrStyleProperty(";height:", escape(size, true)) + ssrStyleProperty(";border-radius:", "50%") + ssrStyleProperty(";border:", "1px dashed var(--agd-stroke)") + ssrStyleProperty(";background:", "var(--agd-fill)") + ssrStyleProperty(";flex-shrink:", 0));
}
function NavigationSkeleton({ width, height }) {
  const pad = Math.max(8, height * 0.2);
  return ssr(_tmpl$46, ssrHydrationKey(), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";height:", "100%") + ssrStyleProperty(";padding:", `0 ${escape(pad, true)}px`) + ssrStyleProperty(";gap:", escape(width, true) * 0.02), escape(createComponent(Block, { get w() {
    return Math.max(20, height * 0.5);
  }, get h() {
    return Math.max(12, height * 0.4);
  }, radius: 2 })), ssrStyleProperty("flex:", 1) + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";gap:", escape(width, true) * 0.03) + ssrStyleProperty(";margin-left:", escape(width, true) * 0.04), escape(createComponent(Bar, { w: width * 0.06 })), escape(createComponent(Bar, { w: width * 0.07 })), escape(createComponent(Bar, { w: width * 0.05 })), escape(createComponent(Bar, { w: width * 0.06 })), escape(createComponent(Block, { w: width * 0.1, get h() {
    return Math.min(28, height * 0.5);
  }, radius: 4 })));
}
function HeroSkeleton({ width, height, text }) {
  return ssr(_tmpl$47, ssrHydrationKey(), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";justify-content:", "center") + ssrStyleProperty(";height:", "100%") + ssrStyleProperty(";gap:", escape(height, true) * 0.05), text ? ssr(_tmpl$48, ssrHydrationKey(), ssrStyleProperty("font-size:", escape(Math.min(20, height * 0.08), true)) + ssrStyleProperty(";font-weight:", 600) + ssrStyleProperty(";color:", "var(--agd-text-3)") + ssrStyleProperty(";text-align:", "center") + ssrStyleProperty(";max-width:", "80%"), escape(text)) : escape(createComponent(Bar, { w: width * 0.5, get h() {
    return Math.max(6, height * 0.04);
  }, strong: true })), escape(createComponent(Bar, { w: width * 0.6 })), escape(createComponent(Bar, { w: width * 0.4 })), escape(createComponent(Block, { get w() {
    return Math.min(140, width * 0.2);
  }, get h() {
    return Math.min(36, height * 0.12);
  }, radius: 6, style: { "margin-top": height * 0.06 } })));
}
function SidebarSkeleton({ width, height }) {
  const items = Math.max(3, Math.floor(height / 36));
  return ssr(_tmpl$49, ssrHydrationKey(), ssrStyleProperty("padding:", escape(width, true) * 0.08) + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", escape(height, true) * 0.03), escape(createComponent(Bar, { w: width * 0.6, h: 4, strong: true })), escape(createComponent(For, { get each() {
    return Array.from({ length: items }, (_, i) => i);
  }, children: (i) => ssr(_tmpl$49, ssrHydrationKey(), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", 6), escape(createComponent(Block, { w: 10, h: 10, radius: 2 })), escape(createComponent(Bar, { w: width * (0.4 + i * 17 % 30 / 100) }))) })));
}
function FooterSkeleton({ width, height }) {
  const cols = Math.max(2, Math.min(4, Math.floor(width / 160)));
  return ssr(_tmpl$50, ssrHydrationKey(), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";padding:", `${escape(height, true) * 0.12}px ${escape(width, true) * 0.03}px`) + ssrStyleProperty(";gap:", escape(width, true) * 0.05), escape(createComponent(For, { get each() {
    return Array.from({ length: cols }, (_, i) => i);
  }, children: (i) => ssr(_tmpl$47, ssrHydrationKey(), ssrStyleProperty("flex:", 1) + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", 4), escape(createComponent(Bar, { w: "60%", h: 3, strong: true })), escape(createComponent(Bar, { w: "80%", h: 2 })), escape(createComponent(Bar, { w: "70%", h: 2 })), escape(createComponent(Bar, { w: "60%", h: 2 }))) })));
}
function ModalSkeleton({ width, height }) {
  return ssr(_tmpl$51, ssrHydrationKey(), ssrStyleProperty("height:", "100%") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";flex-direction:", "column"), ssrStyleProperty("padding:", "10px 12px") + ssrStyleProperty(";border-bottom:", "1px solid var(--agd-stroke)") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";justify-content:", "space-between"), escape(createComponent(Bar, { w: width * 0.3, h: 4, strong: true })), ssrStyleProperty("width:", 14) + ssrStyleProperty(";height:", 14) + ssrStyleProperty(";border:", "1px solid var(--agd-stroke)") + ssrStyleProperty(";border-radius:", 3), ssrStyleProperty("flex:", 1) + ssrStyleProperty(";padding:", 12) + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", 6), escape(createComponent(Bar, { w: "90%" })), escape(createComponent(Bar, { w: "70%" })), escape(createComponent(Bar, { w: "80%" })), ssrStyleProperty("padding:", "10px 12px") + ssrStyleProperty(";border-top:", "1px solid var(--agd-stroke)") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";justify-content:", "flex-end") + ssrStyleProperty(";gap:", 8), escape(createComponent(Block, { w: 70, h: 26, radius: 4 })), escape(createComponent(Block, { w: 70, h: 26, radius: 4, style: { background: "var(--agd-bar)" } })));
}
function CardSkeleton({ width, height }) {
  return ssr(_tmpl$52, ssrHydrationKey(), ssrStyleProperty("height:", "100%") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";flex-direction:", "column"), ssrStyleProperty("height:", "40%") + ssrStyleProperty(";background:", "var(--agd-fill)") + ssrStyleProperty(";border-bottom:", "1px dashed var(--agd-stroke)"), ssrStyleProperty("flex:", 1) + ssrStyleProperty(";padding:", 10) + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", 5), escape(createComponent(Bar, { w: "70%", h: 4, strong: true })), escape(createComponent(Bar, { w: "95%", h: 2 })), escape(createComponent(Bar, { w: "85%", h: 2 })), escape(createComponent(Bar, { w: "50%", h: 2 })));
}
function TextSkeleton({ width, height, text }) {
  if (text) {
    return ssr(_tmpl$50, ssrHydrationKey(), ssrStyleProperty("padding:", 4) + ssrStyleProperty(";font-size:", escape(Math.min(14, height * 0.3), true)) + ssrStyleProperty(";line-height:", 1.5) + ssrStyleProperty(";color:", "var(--agd-text-3)") + ssrStyleProperty(";word-break:", "break-word") + ssrStyleProperty(";overflow:", "hidden"), escape(text));
  }
  const lines = Math.max(2, Math.floor(height / 18));
  return ssr(_tmpl$49, ssrHydrationKey(), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", 6) + ssrStyleProperty(";padding:", 4), escape(createComponent(Bar, { w: width * 0.6, h: 5, strong: true })), escape(createComponent(For, { get each() {
    return Array.from({ length: lines }, (_, i) => i);
  }, children: (i) => createComponent(Bar, { w: `${70 + i * 13 % 25}%`, h: 2 }) })));
}
function ImageSkeleton({ width, height }) {
  return ssr(_tmpl$53, ssrHydrationKey(), ssrStyleProperty("height:", "100%") + ssrStyleProperty(";position:", "relative"), `0 0 ${escape(width, true)} ${escape(height, true)}`, ssrAttribute("x2", escape(width, true), false) + ssrAttribute("y2", escape(height, true), false), ssrAttribute("x1", escape(width, true), false), ssrAttribute("y2", escape(height, true), false), ssrAttribute("cx", escape(width, true) * 0.3, false) + ssrAttribute("cy", escape(height, true) * 0.3, false) + ssrAttribute("r", escape(Math.min(width, height), true) * 0.08, false));
}
function TableSkeleton({ width, height }) {
  const cols = Math.max(2, Math.min(5, Math.floor(width / 100)));
  const rows = Math.max(2, Math.min(6, Math.floor(height / 32)));
  return ssr(_tmpl$54, ssrHydrationKey(), ssrStyleProperty("height:", "100%") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";flex-direction:", "column"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";border-bottom:", "1px solid var(--agd-stroke)") + ssrStyleProperty(";padding:", "6px 0"), escape(createComponent(For, { get each() {
    return Array.from({ length: cols }, (_, i) => i);
  }, children: (i) => ssr(_tmpl$50, ssrHydrationKey(), ssrStyleProperty("flex:", 1) + ssrStyleProperty(";padding:", "0 8px"), escape(createComponent(Bar, { w: "70%", h: 3, strong: true }))) })), escape(createComponent(For, { get each() {
    return Array.from({ length: rows }, (_, r) => r);
  }, children: (r) => ssr(_tmpl$50, ssrHydrationKey(), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";border-bottom:", "1px solid rgba(255,255,255,0.03)") + ssrStyleProperty(";padding:", "6px 0"), escape(createComponent(For, { get each() {
    return Array.from({ length: cols }, (_, c) => c);
  }, children: (c) => ssr(_tmpl$50, ssrHydrationKey(), ssrStyleProperty("flex:", 1) + ssrStyleProperty(";padding:", "0 8px"), escape(createComponent(Bar, { w: `${50 + (r * 7 + c * 13) % 40}%`, h: 2 }))) }))) })));
}
function ListSkeleton({ width, height }) {
  const items = Math.max(2, Math.floor(height / 28));
  return ssr(_tmpl$50, ssrHydrationKey(), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", 4) + ssrStyleProperty(";padding:", 4), escape(createComponent(For, { get each() {
    return Array.from({ length: items }, (_, i) => i);
  }, children: (i) => ssr(_tmpl$49, ssrHydrationKey(), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", 8) + ssrStyleProperty(";padding:", "4px 0"), escape(createComponent(Circle, { size: 8 })), escape(createComponent(Bar, { w: `${55 + i * 17 % 35}%`, h: 2 }))) })));
}
function ButtonSkeleton({ width, height, text }) {
  return ssr(_tmpl$50, ssrHydrationKey(), ssrStyleProperty("height:", "100%") + ssrStyleProperty(";border-radius:", escape(Math.min(8, height / 3), true)) + ssrStyleProperty(";border:", "1px solid var(--agd-stroke)") + ssrStyleProperty(";background:", "var(--agd-fill)") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";justify-content:", "center"), text ? ssr(_tmpl$48, ssrHydrationKey(), ssrStyleProperty("font-size:", escape(Math.min(13, height * 0.4), true)) + ssrStyleProperty(";font-weight:", 500) + ssrStyleProperty(";color:", "var(--agd-text-3)") + ssrStyleProperty(";letter-spacing:", "-0.01em"), escape(text)) : escape(createComponent(Bar, { get w() {
    return Math.max(20, width * 0.5);
  }, h: 3, strong: true })));
}
function InputSkeleton({ width, height }) {
  return ssr(_tmpl$55, ssrHydrationKey(), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", 4) + ssrStyleProperty(";height:", "100%") + ssrStyleProperty(";justify-content:", "center"), escape(createComponent(Bar, { get w() {
    return Math.min(80, width * 0.3);
  }, h: 2 })), ssrStyleProperty("height:", escape(Math.min(36, height * 0.6), true)) + ssrStyleProperty(";border-radius:", 4) + ssrStyleProperty(";border:", "1px dashed var(--agd-stroke)") + ssrStyleProperty(";background:", "var(--agd-fill)") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";padding-left:", 8), escape(createComponent(Bar, { w: "40%", h: 2 })));
}
function FormSkeleton({ width, height }) {
  const fields = Math.max(2, Math.min(5, Math.floor(height / 56)));
  return ssr(_tmpl$49, ssrHydrationKey(), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", escape(height, true) * 0.04) + ssrStyleProperty(";padding:", 8), escape(createComponent(For, { get each() {
    return Array.from({ length: fields }, (_, i) => i);
  }, children: (i) => ssr(_tmpl$49, ssrHydrationKey(), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", 4), escape(createComponent(Bar, { w: 60 + i * 17 % 30, h: 2 })), escape(createComponent(Block, { w: "100%", h: 28, radius: 4 }))) })), escape(createComponent(Block, { get w() {
    return Math.min(120, width * 0.35);
  }, h: 30, radius: 6, style: { "margin-top": 8, "align-self": "flex-end", background: "var(--agd-bar)" } })));
}
function TabsSkeleton({ width, height }) {
  const tabCount = Math.max(2, Math.min(4, Math.floor(width / 120)));
  return ssr(_tmpl$56, ssrHydrationKey(), ssrStyleProperty("height:", "100%") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";flex-direction:", "column"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";gap:", 2) + ssrStyleProperty(";border-bottom:", "1px solid var(--agd-stroke)"), escape(createComponent(For, { get each() {
    return Array.from({ length: tabCount }, (_, i) => i);
  }, children: (i) => ssr(_tmpl$50, ssrHydrationKey(), ssrStyleProperty("padding:", "8px 12px") + ssrStyleProperty(";border-bottom:", i === 0 ? "2px solid var(--agd-bar-strong)" : "none"), escape(createComponent(Bar, { w: 60, h: 3, strong: i === 0 }))) })), ssrStyleProperty("flex:", 1) + ssrStyleProperty(";padding:", 12) + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", 6), escape(createComponent(Bar, { w: "80%", h: 2 })), escape(createComponent(Bar, { w: "65%", h: 2 })), escape(createComponent(Bar, { w: "75%", h: 2 })));
}
function AvatarSkeleton({ width, height }) {
  const r = Math.min(width, height) / 2;
  return ssr(_tmpl$57, ssrHydrationKey(), `0 0 ${escape(width, true)} ${escape(height, true)}`, ssrAttribute("cx", escape(width, true) / 2, false) + ssrAttribute("cy", escape(height, true) / 2, false) + ssrAttribute("r", escape(r, true) - 1, false), ssrAttribute("cx", escape(width, true) / 2, false) + ssrAttribute("cy", escape(height, true) * 0.38, false) + ssrAttribute("r", escape(r, true) * 0.28, false), `M${escape(width, true) / 2 - escape(r, true) * 0.55} ${escape(height, true) * 0.78} C${escape(width, true) / 2 - escape(r, true) * 0.55} ${escape(height, true) * 0.55} ${escape(width, true) / 2 + escape(r, true) * 0.55} ${escape(height, true) * 0.55} ${escape(width, true) / 2 + escape(r, true) * 0.55} ${escape(height, true) * 0.78}`);
}
function BadgeSkeleton({ width, height }) {
  return ssr(_tmpl$50, ssrHydrationKey(), ssrStyleProperty("height:", "100%") + ssrStyleProperty(";border-radius:", escape(height, true) / 2) + ssrStyleProperty(";border:", "1px solid var(--agd-stroke)") + ssrStyleProperty(";background:", "var(--agd-fill)") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";justify-content:", "center"), escape(createComponent(Bar, { get w() {
    return Math.max(16, width * 0.5);
  }, h: 2, strong: true })));
}
function HeaderSkeleton({ width, height }) {
  return ssr(_tmpl$49, ssrHydrationKey(), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";justify-content:", "center") + ssrStyleProperty(";height:", "100%") + ssrStyleProperty(";gap:", escape(height, true) * 0.08), escape(createComponent(Bar, { w: width * 0.5, get h() {
    return Math.max(5, height * 0.06);
  }, strong: true })), escape(createComponent(Bar, { w: width * 0.35 })));
}
function SectionSkeleton({ width, height }) {
  return ssr(_tmpl$58, ssrHydrationKey(), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";height:", "100%") + ssrStyleProperty(";gap:", escape(height, true) * 0.04) + ssrStyleProperty(";padding:", escape(width, true) * 0.04), escape(createComponent(Bar, { w: width * 0.3, h: 4, strong: true })), escape(createComponent(Bar, { w: width * 0.7 })), escape(createComponent(Bar, { w: width * 0.5 })), ssrStyleProperty("flex:", 1) + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";gap:", escape(width, true) * 0.03) + ssrStyleProperty(";margin-top:", escape(height, true) * 0.06), escape(createComponent(Block, { w: "33%", h: "100%", radius: 4 })), escape(createComponent(Block, { w: "33%", h: "100%", radius: 4 })), escape(createComponent(Block, { w: "33%", h: "100%", radius: 4 })));
}
function GridSkeleton({ width, height }) {
  const cols = Math.max(2, Math.min(4, Math.floor(width / 140)));
  const rows = Math.max(1, Math.min(3, Math.floor(height / 120)));
  return ssr(_tmpl$50, ssrHydrationKey(), ssrStyleProperty("display:", "grid") + ssrStyleProperty(";grid-template-columns:", `repeat(${escape(cols, true)}, 1fr)`) + ssrStyleProperty(";grid-template-rows:", `repeat(${escape(rows, true)}, 1fr)`) + ssrStyleProperty(";gap:", 6) + ssrStyleProperty(";height:", "100%"), escape(createComponent(For, { get each() {
    return Array.from({ length: cols * rows }, (_, i) => i);
  }, children: (i) => createComponent(Block, { w: "100%", h: "100%", radius: 4 }) })));
}
function DropdownSkeleton({ width, height }) {
  const items = Math.max(2, Math.floor((height - 32) / 28));
  return ssr(_tmpl$59, ssrHydrationKey(), ssrStyleProperty("height:", "100%") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";flex-direction:", "column"), ssrStyleProperty("padding:", "6px 8px") + ssrStyleProperty(";border-bottom:", "1px solid var(--agd-stroke)"), escape(createComponent(Bar, { w: width * 0.5, h: 3, strong: true })), ssrStyleProperty("flex:", 1) + ssrStyleProperty(";padding:", 4) + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", 2), escape(createComponent(For, { get each() {
    return Array.from({ length: items }, (_, i) => i);
  }, children: (i) => ssr(_tmpl$50, ssrHydrationKey(), ssrStyleProperty("padding:", "4px 6px") + ssrStyleProperty(";border-radius:", 3) + ssrStyleProperty(";background:", i === 0 ? "var(--agd-fill)" : "transparent"), escape(createComponent(Bar, { w: `${50 + i * 17 % 35}%`, h: 2, strong: i === 0 }))) })));
}
function ToggleSkeleton({ width, height }) {
  const r = Math.min(width, height) / 2;
  return ssr(_tmpl$60, ssrHydrationKey(), `0 0 ${escape(width, true)} ${escape(height, true)}`, ssrAttribute("width", escape(width, true) - 2, false) + ssrAttribute("height", escape(height, true) - 2, false) + ssrAttribute("rx", escape(r, true), false), ssrAttribute("cx", escape(width, true) - escape(r, true), false) + ssrAttribute("cy", escape(height, true) / 2, false) + ssrAttribute("r", escape(r, true) * 0.7, false));
}
function SearchSkeleton({ width, height }) {
  const r = Math.min(height / 2, 20);
  return ssr(_tmpl$49, ssrHydrationKey(), ssrStyleProperty("height:", "100%") + ssrStyleProperty(";border-radius:", escape(r, true)) + ssrStyleProperty(";border:", "1px dashed var(--agd-stroke)") + ssrStyleProperty(";background:", "var(--agd-fill)") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";padding:", `0 ${escape(r, true) * 0.6}px`) + ssrStyleProperty(";gap:", 6), escape(createComponent(Circle, { get size() {
    return Math.min(14, height * 0.4);
  } })), escape(createComponent(Bar, { w: "50%", h: 2 })));
}
function ToastSkeleton({ width, height }) {
  return ssr(_tmpl$61, ssrHydrationKey(), ssrStyleProperty("height:", "100%") + ssrStyleProperty(";border-radius:", 8) + ssrStyleProperty(";border:", "1px dashed var(--agd-stroke)") + ssrStyleProperty(";background:", "var(--agd-fill)") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";padding:", "0 10px") + ssrStyleProperty(";gap:", 8), escape(createComponent(Circle, { get size() {
    return Math.min(20, height * 0.5);
  } })), ssrStyleProperty("flex:", 1) + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", 3), escape(createComponent(Bar, { w: "60%", h: 3, strong: true })), escape(createComponent(Bar, { w: "80%", h: 2 })), ssrStyleProperty("width:", 14) + ssrStyleProperty(";height:", 14) + ssrStyleProperty(";border:", "1px solid var(--agd-stroke)") + ssrStyleProperty(";border-radius:", 3) + ssrStyleProperty(";flex-shrink:", 0));
}
function ProgressSkeleton({ width, height }) {
  return ssr(_tmpl$62, ssrHydrationKey(), `0 0 ${escape(width, true)} ${escape(height, true)}`, ssrAttribute("width", escape(width, true), false) + ssrAttribute("height", escape(height, true), false) + ssrAttribute("rx", escape(height, true) / 2, false), ssrAttribute("width", escape(width, true) * 0.65, false) + ssrAttribute("height", escape(height, true) - 2, false) + ssrAttribute("rx", (escape(height, true) - 2) / 2, false));
}
function ChartSkeleton({ width, height }) {
  const bars = Math.max(3, Math.min(7, Math.floor(width / 50)));
  const barW = width / (bars * 2);
  return ssr(_tmpl$50, ssrHydrationKey(), ssrStyleProperty("height:", "100%") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";align-items:", "flex-end") + ssrStyleProperty(";justify-content:", "space-around") + ssrStyleProperty(";padding:", "0 4px") + ssrStyleProperty(";border-bottom:", "1px solid var(--agd-stroke)"), escape(createComponent(For, { get each() {
    return Array.from({ length: bars }, (_, i) => i);
  }, children: (i) => {
    const h = 30 + (i * 37 + 17) % 55;
    return createComponent(Block, { w: barW, h: `${h}%`, radius: 2 });
  } })));
}
function VideoSkeleton({ width, height }) {
  const btnR = Math.min(width, height) * 0.12;
  return ssr(_tmpl$63, ssrHydrationKey(), ssrStyleProperty("height:", "100%") + ssrStyleProperty(";position:", "relative") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";justify-content:", "center"), escape(createComponent(Block, { w: "100%", h: "100%", radius: 4 })), ssrStyleProperty("position:", "absolute") + ssrStyleProperty(";width:", escape(btnR, true) * 2) + ssrStyleProperty(";height:", escape(btnR, true) * 2) + ssrStyleProperty(";border-radius:", "50%") + ssrStyleProperty(";border:", "1.5px solid var(--agd-stroke)") + ssrStyleProperty(";background:", "var(--agd-fill)") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";justify-content:", "center"), ssrStyleProperty("width:", 0) + ssrStyleProperty(";height:", 0) + ssrStyleProperty(";border-left:", `${escape(btnR, true) * 0.6}px solid var(--agd-bar-strong)`) + ssrStyleProperty(";border-top:", `${escape(btnR, true) * 0.4}px solid transparent`) + ssrStyleProperty(";border-bottom:", `${escape(btnR, true) * 0.4}px solid transparent`) + ssrStyleProperty(";margin-left:", escape(btnR, true) * 0.15));
}
function TooltipSkeleton({ width, height }) {
  return ssr(_tmpl$64, ssrHydrationKey(), ssrStyleProperty("height:", "100%") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";align-items:", "center"), ssrStyleProperty("flex:", 1) + ssrStyleProperty(";width:", "100%") + ssrStyleProperty(";border-radius:", 6) + ssrStyleProperty(";border:", "1px dashed var(--agd-stroke)") + ssrStyleProperty(";background:", "var(--agd-fill)") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";justify-content:", "center"), escape(createComponent(Bar, { w: "60%", h: 2 })), ssrStyleProperty("width:", 8) + ssrStyleProperty(";height:", 8) + ssrStyleProperty(";background:", "var(--agd-fill)") + ssrStyleProperty(";border:", "1px dashed var(--agd-stroke)") + ssrStyleProperty(";border-top:", "none") + ssrStyleProperty(";border-left:", "none") + ssrStyleProperty(";transform:", "rotate(45deg)") + ssrStyleProperty(";margin-top:", -5));
}
function BreadcrumbSkeleton({ width, height }) {
  const items = Math.max(2, Math.min(4, Math.floor(width / 80)));
  return ssr(_tmpl$50, ssrHydrationKey(), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";height:", "100%") + ssrStyleProperty(";gap:", 4), escape(createComponent(For, { get each() {
    return Array.from({ length: items }, (_, i) => i);
  }, children: (i) => ssr(_tmpl$49, ssrHydrationKey(), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", 4), escape(createComponent(Show$1, { when: i > 0, get children() {
    return ssr(_tmpl$65, ssrHydrationKey(), ssrStyleProperty("color:", "var(--agd-stroke)") + ssrStyleProperty(";font-size:", 10));
  } })), escape(createComponent(Bar, { w: 40 + i * 13 % 20, h: 2, strong: i === items - 1 }))) })));
}
function PaginationSkeleton({ width, height }) {
  const count = Math.max(3, Math.min(5, Math.floor(width / 40)));
  const sz = Math.min(28, height * 0.8);
  return ssr(_tmpl$50, ssrHydrationKey(), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";justify-content:", "center") + ssrStyleProperty(";height:", "100%") + ssrStyleProperty(";gap:", 4), escape(createComponent(For, { get each() {
    return Array.from({ length: count }, (_, i) => i);
  }, children: (i) => createComponent(Block, { w: sz, h: sz, radius: 4, style: i === 1 ? { background: "var(--agd-bar)" } : void 0 }) })));
}
function DividerSkeleton({ width }) {
  return ssr(_tmpl$66, ssrHydrationKey(), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";height:", "100%"), ssrStyleProperty("width:", "100%") + ssrStyleProperty(";height:", 1) + ssrStyleProperty(";background:", "var(--agd-stroke)"));
}
function AccordionSkeleton({ width, height }) {
  const items = Math.max(2, Math.min(4, Math.floor(height / 40)));
  return ssr(_tmpl$50, ssrHydrationKey(), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";height:", "100%"), escape(createComponent(For, { get each() {
    return Array.from({ length: items }, (_, i) => i);
  }, children: (i) => ssr(_tmpl$67, ssrHydrationKey(), ssrStyleProperty("border-bottom:", "1px solid var(--agd-stroke)") + ssrStyleProperty(";padding:", "8px 6px") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";justify-content:", "space-between") + ssrStyleProperty(";flex:", i === 0 ? 2 : 1), escape(createComponent(Bar, { w: `${40 + i * 17 % 25}%`, h: 3, strong: true })), ssrStyleProperty("font-size:", 8) + ssrStyleProperty(";color:", "var(--agd-stroke)"), i === 0 ? "▼" : "▶") })));
}
function CarouselSkeleton({ width, height }) {
  return ssr(_tmpl$68, ssrHydrationKey(), ssrStyleProperty("height:", "100%") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", 6), ssrStyleProperty("flex:", 1) + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";gap:", 6) + ssrStyleProperty(";align-items:", "center"), ssrStyleProperty("font-size:", 12) + ssrStyleProperty(";color:", "var(--agd-stroke)"), escape(createComponent(Block, { w: "100%", h: "100%", radius: 4 })), ssrStyleProperty("font-size:", 12) + ssrStyleProperty(";color:", "var(--agd-stroke)"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";justify-content:", "center") + ssrStyleProperty(";gap:", 4), escape(createComponent(Circle, { size: 5 })), escape(createComponent(Circle, { size: 5 })), escape(createComponent(Circle, { size: 5 })));
}
function PricingSkeleton({ width, height }) {
  return ssr(_tmpl$69, ssrHydrationKey(), ssrStyleProperty("height:", "100%") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";padding:", 10) + ssrStyleProperty(";gap:", escape(height, true) * 0.04), escape(createComponent(Bar, { w: width * 0.4, h: 3, strong: true })), escape(createComponent(Bar, { w: width * 0.3, h: 6, strong: true })), ssrStyleProperty("flex:", 1) + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", 4) + ssrStyleProperty(";width:", "100%") + ssrStyleProperty(";padding:", "8px 0"), escape(createComponent(For, { get each() {
    return Array.from({ length: 4 }, (_, i) => i);
  }, children: (i) => ssr(_tmpl$49, ssrHydrationKey(), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", 4), escape(createComponent(Circle, { size: 5 })), escape(createComponent(Bar, { w: `${50 + i * 17 % 35}%`, h: 2 }))) })), escape(createComponent(Block, { w: width * 0.7, get h() {
    return Math.min(32, height * 0.1);
  }, radius: 6, style: { background: "var(--agd-bar)" } })));
}
function TestimonialSkeleton({ width, height }) {
  return ssr(_tmpl$70, ssrHydrationKey(), ssrStyleProperty("height:", "100%") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";padding:", 10) + ssrStyleProperty(";gap:", 8), ssrStyleProperty("font-size:", 18) + ssrStyleProperty(";line-height:", 1) + ssrStyleProperty(";color:", "var(--agd-stroke)") + ssrStyleProperty(";font-family:", "serif"), ssrStyleProperty("flex:", 1) + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", 4), escape(createComponent(Bar, { w: "90%", h: 2 })), escape(createComponent(Bar, { w: "75%", h: 2 })), escape(createComponent(Bar, { w: "60%", h: 2 })), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", 6), escape(createComponent(Circle, { size: 20 })), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", 2), escape(createComponent(Bar, { w: 60, h: 3, strong: true })), escape(createComponent(Bar, { w: 40, h: 2 })));
}
function CtaSkeleton({ width, height }) {
  return ssr(_tmpl$71, ssrHydrationKey(), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";justify-content:", "center") + ssrStyleProperty(";height:", "100%") + ssrStyleProperty(";gap:", escape(height, true) * 0.08), escape(createComponent(Bar, { w: width * 0.5, get h() {
    return Math.max(4, height * 0.05);
  }, strong: true })), escape(createComponent(Bar, { w: width * 0.35 })), escape(createComponent(Block, { get w() {
    return Math.min(140, width * 0.25);
  }, get h() {
    return Math.min(32, height * 0.15);
  }, radius: 6, style: { "margin-top": height * 0.04, background: "var(--agd-bar)" } })));
}
function AlertSkeleton({ width, height }) {
  return ssr(_tmpl$72, ssrHydrationKey(), ssrStyleProperty("height:", "100%") + ssrStyleProperty(";border-radius:", 6) + ssrStyleProperty(";border:", "1px dashed var(--agd-stroke)") + ssrStyleProperty(";background:", "var(--agd-fill)") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";padding:", "0 10px") + ssrStyleProperty(";gap:", 8), ssrStyleProperty("width:", 16) + ssrStyleProperty(";height:", 16) + ssrStyleProperty(";border-radius:", "50%") + ssrStyleProperty(";border:", "1.5px solid var(--agd-bar-strong)") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";justify-content:", "center") + ssrStyleProperty(";flex-shrink:", 0), ssrStyleProperty("width:", 2) + ssrStyleProperty(";height:", 6) + ssrStyleProperty(";background:", "var(--agd-bar-strong)") + ssrStyleProperty(";border-radius:", 1), ssrStyleProperty("flex:", 1) + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", 3), escape(createComponent(Bar, { w: "40%", h: 3, strong: true })), escape(createComponent(Bar, { w: "70%", h: 2 })));
}
function BannerSkeleton({ width, height }) {
  return ssr(_tmpl$49, ssrHydrationKey(), ssrStyleProperty("height:", "100%") + ssrStyleProperty(";background:", "var(--agd-fill)") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";justify-content:", "center") + ssrStyleProperty(";gap:", 8) + ssrStyleProperty(";padding:", "0 12px"), escape(createComponent(Bar, { w: width * 0.4, h: 3, strong: true })), escape(createComponent(Block, { w: 60, get h() {
    return Math.min(24, height * 0.6);
  }, radius: 4 })));
}
function StatSkeleton({ width, height }) {
  return ssr(_tmpl$71, ssrHydrationKey(), ssrStyleProperty("height:", "100%") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";justify-content:", "center") + ssrStyleProperty(";gap:", escape(height, true) * 0.06), escape(createComponent(Bar, { w: width * 0.5, h: 2 })), escape(createComponent(Bar, { w: width * 0.4, get h() {
    return Math.max(8, height * 0.18);
  }, strong: true })), escape(createComponent(Bar, { w: width * 0.3, h: 2 })));
}
function StepperSkeleton({ width, height }) {
  const steps = Math.max(3, Math.min(5, Math.floor(width / 100)));
  const dotR = Math.min(12, height * 0.35);
  return ssr(_tmpl$50, ssrHydrationKey(), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";justify-content:", "space-between") + ssrStyleProperty(";height:", "100%") + ssrStyleProperty(";padding:", "0 8px"), escape(createComponent(For, { get each() {
    return Array.from({ length: steps }, (_, i) => i);
  }, children: (i) => ssr(_tmpl$73, ssrHydrationKey(), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", 0) + ssrStyleProperty(";flex:", 1), ssrStyleProperty("width:", escape(dotR, true)) + ssrStyleProperty(";height:", escape(dotR, true)) + ssrStyleProperty(";border-radius:", "50%") + ssrStyleProperty(";border:", "1.5px solid var(--agd-stroke)") + ssrStyleProperty(";background:", i === 0 ? "var(--agd-bar)" : "transparent") + ssrStyleProperty(";flex-shrink:", 0), escape(createComponent(Show$1, { when: i < steps - 1, get children() {
    return ssr(_tmpl$45, ssrHydrationKey(), ssrStyleProperty("flex:", 1) + ssrStyleProperty(";height:", 1) + ssrStyleProperty(";background:", "var(--agd-stroke)") + ssrStyleProperty(";margin:", "0 4px"));
  } }))) })));
}
function TagSkeleton({ width, height }) {
  return ssr(_tmpl$74, ssrHydrationKey(), ssrStyleProperty("height:", "100%") + ssrStyleProperty(";border-radius:", 4) + ssrStyleProperty(";border:", "1px solid var(--agd-stroke)") + ssrStyleProperty(";background:", "var(--agd-fill)") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";justify-content:", "center") + ssrStyleProperty(";gap:", 4) + ssrStyleProperty(";padding:", "0 6px"), escape(createComponent(Bar, { get w() {
    return Math.max(16, width * 0.5);
  }, h: 2, strong: true })), ssrStyleProperty("width:", 8) + ssrStyleProperty(";height:", 8) + ssrStyleProperty(";border-radius:", "50%") + ssrStyleProperty(";border:", "1px solid var(--agd-stroke)") + ssrStyleProperty(";flex-shrink:", 0));
}
function RatingSkeleton({ width, height }) {
  const stars = 5;
  const sz = Math.min(height * 0.7, width / (stars * 1.5));
  return ssr(_tmpl$50, ssrHydrationKey(), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";justify-content:", "center") + ssrStyleProperty(";height:", "100%") + ssrStyleProperty(";gap:", escape(sz, true) * 0.2), escape(createComponent(For, { get each() {
    return Array.from({ length: stars }, (_, i) => i);
  }, children: (i) => ssr(_tmpl$75, ssrHydrationKey() + ssrAttribute("width", escape(sz, true), false) + ssrAttribute("height", escape(sz, true), false), ssrAttribute("fill", i < 3 ? "var(--agd-bar)" : "none", false)) })));
}
function MapSkeleton({ width, height }) {
  return ssr(_tmpl$76, ssrHydrationKey(), ssrStyleProperty("height:", "100%") + ssrStyleProperty(";position:", "relative") + ssrStyleProperty(";border-radius:", 4) + ssrStyleProperty(";border:", "1px dashed var(--agd-stroke)") + ssrStyleProperty(";background:", "var(--agd-fill)") + ssrStyleProperty(";overflow:", "hidden"), `0 0 ${escape(width, true)} ${escape(height, true)}`, ssrStyleProperty("position:", "absolute") + ssrStyleProperty(";inset:", 0), ssrAttribute("y1", escape(height, true) * 0.3, false) + ssrAttribute("x2", escape(width, true), false) + ssrAttribute("y2", escape(height, true) * 0.7, false), ssrAttribute("y1", escape(height, true) * 0.6, false) + ssrAttribute("x2", escape(width, true), false) + ssrAttribute("y2", escape(height, true) * 0.2, false), ssrAttribute("x1", escape(width, true) * 0.4, false), ssrAttribute("x2", escape(width, true) * 0.6, false) + ssrAttribute("y2", escape(height, true), false), ssrStyleProperty("position:", "absolute") + ssrStyleProperty(";left:", "50%") + ssrStyleProperty(";top:", "40%") + ssrStyleProperty(";transform:", "translate(-50%, -100%)"));
}
function TimelineSkeleton({ width, height }) {
  const items = Math.max(3, Math.min(5, Math.floor(height / 60)));
  return ssr(_tmpl$59, ssrHydrationKey(), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";height:", "100%") + ssrStyleProperty(";padding:", "8px 0"), ssrStyleProperty("width:", 16) + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";align-items:", "center"), escape(createComponent(For, { get each() {
    return Array.from({ length: items }, (_, i) => i);
  }, children: (i) => ssr(_tmpl$49, ssrHydrationKey(), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";flex:", 1), escape(createComponent(Circle, { size: 8 })), escape(createComponent(Show$1, { when: i < items - 1, get children() {
    return ssr(_tmpl$45, ssrHydrationKey(), ssrStyleProperty("flex:", 1) + ssrStyleProperty(";width:", 1) + ssrStyleProperty(";background:", "var(--agd-stroke)"));
  } }))) })), ssrStyleProperty("flex:", 1) + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";justify-content:", "space-around") + ssrStyleProperty(";padding-left:", 8), escape(createComponent(For, { get each() {
    return Array.from({ length: items }, (_, i) => i);
  }, children: (i) => ssr(_tmpl$49, ssrHydrationKey(), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", 3), escape(createComponent(Bar, { w: `${35 + i * 13 % 25}%`, h: 3, strong: true })), escape(createComponent(Bar, { w: `${50 + i * 17 % 30}%`, h: 2 }))) })));
}
function FileUploadSkeleton({ width, height }) {
  return ssr(_tmpl$77, ssrHydrationKey(), ssrStyleProperty("height:", "100%") + ssrStyleProperty(";border-radius:", 8) + ssrStyleProperty(";border:", "2px dashed var(--agd-stroke)") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";justify-content:", "center") + ssrStyleProperty(";gap:", escape(height, true) * 0.06), escape(createComponent(Bar, { w: width * 0.4, h: 2 })), escape(createComponent(Bar, { w: width * 0.25, h: 2 })));
}
function CodeBlockSkeleton({ width, height }) {
  const lines = Math.max(3, Math.min(8, Math.floor(height / 20)));
  return ssr(_tmpl$78, ssrHydrationKey(), ssrStyleProperty("height:", "100%") + ssrStyleProperty(";border-radius:", 6) + ssrStyleProperty(";background:", "var(--agd-fill)") + ssrStyleProperty(";border:", "1px solid var(--agd-stroke)") + ssrStyleProperty(";padding:", 8) + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", 4), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";gap:", 3) + ssrStyleProperty(";margin-bottom:", 4), escape(createComponent(Circle, { size: 6 })), escape(createComponent(Circle, { size: 6 })), escape(createComponent(Circle, { size: 6 })), escape(createComponent(For, { get each() {
    return Array.from({ length: lines }, (_, i) => i);
  }, children: (i) => ssr(_tmpl$50, ssrHydrationKey(), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";gap:", 6) + ssrStyleProperty(";padding-left:", i > 0 && i < lines - 1 ? 12 : 0), escape(createComponent(Bar, { w: `${25 + i * 23 % 50}%`, h: 2, strong: i === 0 }))) })));
}
function CalendarSkeleton({ width, height }) {
  const cols = 7;
  const rows = 5;
  const cellSz = Math.min((width - 16) / cols, (height - 40) / (rows + 1));
  return ssr(_tmpl$79, ssrHydrationKey(), ssrStyleProperty("height:", "100%") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";flex-direction:", "column"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";justify-content:", "space-between") + ssrStyleProperty(";padding:", "6px 8px"), ssrStyleProperty("font-size:", 8) + ssrStyleProperty(";color:", "var(--agd-stroke)"), escape(createComponent(Bar, { w: width * 0.3, h: 3, strong: true })), ssrStyleProperty("font-size:", 8) + ssrStyleProperty(";color:", "var(--agd-stroke)"), ssrStyleProperty("display:", "grid") + ssrStyleProperty(";grid-template-columns:", "repeat(7, 1fr)") + ssrStyleProperty(";gap:", 2) + ssrStyleProperty(";padding:", "0 4px") + ssrStyleProperty(";flex:", 1), escape(createComponent(For, { get each() {
    return Array.from({ length: cols }, (_, i) => i);
  }, children: (i) => ssr(_tmpl$50, ssrHydrationKey(), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";justify-content:", "center") + ssrStyleProperty(";height:", escape(cellSz, true) * 0.6), escape(createComponent(Bar, { w: cellSz * 0.5, h: 2 }))) })), escape(createComponent(For, { get each() {
    return Array.from({ length: cols * rows }, (_, i) => i);
  }, children: (i) => ssr(_tmpl$80, ssrHydrationKey(), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";justify-content:", "center") + ssrStyleProperty(";height:", escape(cellSz, true)), ssrStyleProperty("width:", escape(cellSz, true) * 0.6) + ssrStyleProperty(";height:", escape(cellSz, true) * 0.6) + ssrStyleProperty(";border-radius:", "50%") + ssrStyleProperty(";background:", i === 12 ? "var(--agd-bar)" : "transparent") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";justify-content:", "center"), ssrStyleProperty("width:", 2) + ssrStyleProperty(";height:", 2) + ssrStyleProperty(";border-radius:", 1) + ssrStyleProperty(";background:", "var(--agd-bar-strong)") + ssrStyleProperty(";opacity:", i === 12 ? 1 : 0.3)) })));
}
function NotificationSkeleton({ width, height }) {
  return ssr(_tmpl$81, ssrHydrationKey(), ssrStyleProperty("height:", "100%") + ssrStyleProperty(";border-radius:", 8) + ssrStyleProperty(";border:", "1px dashed var(--agd-stroke)") + ssrStyleProperty(";background:", "var(--agd-fill)") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";padding:", "0 10px") + ssrStyleProperty(";gap:", 8), escape(createComponent(Circle, { get size() {
    return Math.min(32, height * 0.55);
  } })), ssrStyleProperty("flex:", 1) + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", 3), escape(createComponent(Bar, { w: "50%", h: 3, strong: true })), escape(createComponent(Bar, { w: "75%", h: 2 })), escape(createComponent(Bar, { w: 30, h: 2 })));
}
function ProductCardSkeleton({ width, height }) {
  return ssr(_tmpl$82, ssrHydrationKey(), ssrStyleProperty("height:", "100%") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";flex-direction:", "column"), ssrStyleProperty("height:", "50%") + ssrStyleProperty(";background:", "var(--agd-fill)") + ssrStyleProperty(";border-bottom:", "1px dashed var(--agd-stroke)"), ssrStyleProperty("flex:", 1) + ssrStyleProperty(";padding:", 10) + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", 5), escape(createComponent(Bar, { w: "65%", h: 4, strong: true })), escape(createComponent(Bar, { w: "40%", h: 3 })), ssrStyleProperty("flex:", 1), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";justify-content:", "space-between"), escape(createComponent(Bar, { w: "30%", h: 5, strong: true })), escape(createComponent(Block, { get w() {
    return Math.min(70, width * 0.3);
  }, h: 26, radius: 4, style: { background: "var(--agd-bar)" } })));
}
function ProfileSkeleton({ width, height }) {
  const avatarSz = Math.min(48, height * 0.3);
  return ssr(_tmpl$83, ssrHydrationKey(), ssrStyleProperty("height:", "100%") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";justify-content:", "center") + ssrStyleProperty(";gap:", escape(height, true) * 0.06), escape(createComponent(Circle, { size: avatarSz })), escape(createComponent(Bar, { w: width * 0.45, h: 4, strong: true })), escape(createComponent(Bar, { w: width * 0.3, h: 2 })), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";gap:", escape(width, true) * 0.08) + ssrStyleProperty(";margin-top:", escape(height, true) * 0.04), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", 2), escape(createComponent(Bar, { w: 20, h: 3, strong: true })), escape(createComponent(Bar, { w: 28, h: 2 })), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", 2), escape(createComponent(Bar, { w: 20, h: 3, strong: true })), escape(createComponent(Bar, { w: 28, h: 2 })), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", 2), escape(createComponent(Bar, { w: 20, h: 3, strong: true })), escape(createComponent(Bar, { w: 28, h: 2 })));
}
function DrawerSkeleton({ width, height }) {
  const panelW = Math.max(width * 0.6, 80);
  const items = Math.max(3, Math.floor(height / 40));
  return ssr(_tmpl$84, ssrHydrationKey(), ssrStyleProperty("height:", "100%") + ssrStyleProperty(";display:", "flex"), ssrStyleProperty("width:", escape(width, true) - escape(panelW, true)) + ssrStyleProperty(";background:", "var(--agd-fill)") + ssrStyleProperty(";opacity:", 0.3), ssrStyleProperty("flex:", 1) + ssrStyleProperty(";border-left:", "1px solid var(--agd-stroke)") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";padding:", escape(width, true) * 0.04), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";justify-content:", "space-between") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";margin-bottom:", escape(height, true) * 0.06), escape(createComponent(Bar, { w: panelW * 0.4, h: 4, strong: true })), ssrStyleProperty("width:", 12) + ssrStyleProperty(";height:", 12) + ssrStyleProperty(";border:", "1px solid var(--agd-stroke)") + ssrStyleProperty(";border-radius:", 3), escape(createComponent(For, { get each() {
    return Array.from({ length: items }, (_, i) => i);
  }, children: (i) => ssr(_tmpl$50, ssrHydrationKey(), ssrStyleProperty("padding:", "6px 0"), escape(createComponent(Bar, { w: `${50 + i * 17 % 35}%`, h: 2, strong: i === 0 }))) })));
}
function PopoverSkeleton({ width, height }) {
  return ssr(_tmpl$85, ssrHydrationKey(), ssrStyleProperty("height:", "100%") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";align-items:", "center"), ssrStyleProperty("flex:", 1) + ssrStyleProperty(";width:", "100%") + ssrStyleProperty(";border-radius:", 8) + ssrStyleProperty(";border:", "1px dashed var(--agd-stroke)") + ssrStyleProperty(";background:", "var(--agd-fill)") + ssrStyleProperty(";padding:", 10) + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", 5), escape(createComponent(Bar, { w: "70%", h: 3, strong: true })), escape(createComponent(Bar, { w: "90%", h: 2 })), escape(createComponent(Bar, { w: "60%", h: 2 })), ssrStyleProperty("width:", 10) + ssrStyleProperty(";height:", 10) + ssrStyleProperty(";background:", "var(--agd-fill)") + ssrStyleProperty(";border:", "1px dashed var(--agd-stroke)") + ssrStyleProperty(";border-top:", "none") + ssrStyleProperty(";border-left:", "none") + ssrStyleProperty(";transform:", "rotate(45deg)") + ssrStyleProperty(";margin-top:", -6));
}
function LogoSkeleton({ width, height }) {
  const iconSz = Math.min(height * 0.7, width * 0.3);
  return ssr(_tmpl$49, ssrHydrationKey(), ssrStyleProperty("height:", "100%") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", escape(width, true) * 0.08), escape(createComponent(Block, { w: iconSz, h: iconSz, radius: iconSz * 0.25 })), escape(createComponent(Bar, { w: width * 0.45, get h() {
    return Math.max(4, height * 0.2);
  }, strong: true })));
}
function FaqSkeleton({ width, height }) {
  const items = Math.max(2, Math.min(5, Math.floor(height / 56)));
  return ssr(_tmpl$50, ssrHydrationKey(), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";height:", "100%"), escape(createComponent(For, { get each() {
    return Array.from({ length: items }, (_, i) => i);
  }, children: (i) => ssr(_tmpl$86, ssrHydrationKey(), ssrStyleProperty("border-bottom:", "1px solid var(--agd-stroke)") + ssrStyleProperty(";padding:", "8px 6px") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";justify-content:", "space-between") + ssrStyleProperty(";flex:", i === 0 ? 2 : 1), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", 6), ssrStyleProperty("font-size:", 9) + ssrStyleProperty(";font-weight:", 700) + ssrStyleProperty(";color:", "var(--agd-stroke)"), escape(createComponent(Bar, { w: width * (0.3 + i * 13 % 25 / 100), h: 3, strong: true })), ssrStyleProperty("font-size:", 8) + ssrStyleProperty(";color:", "var(--agd-stroke)"), i === 0 ? "▼" : "▶") })));
}
function GallerySkeleton({ width, height }) {
  const cols = Math.max(2, Math.min(4, Math.floor(width / 120)));
  const rows = Math.max(1, Math.min(3, Math.floor(height / 120)));
  return ssr(_tmpl$50, ssrHydrationKey(), ssrStyleProperty("display:", "grid") + ssrStyleProperty(";grid-template-columns:", `repeat(${escape(cols, true)}, 1fr)`) + ssrStyleProperty(";grid-template-rows:", `repeat(${escape(rows, true)}, 1fr)`) + ssrStyleProperty(";gap:", 4) + ssrStyleProperty(";height:", "100%"), escape(createComponent(For, { get each() {
    return Array.from({ length: cols * rows }, (_, i) => i);
  }, children: (i) => ssr(_tmpl$87, ssrHydrationKey(), ssrStyleProperty("border-radius:", 4) + ssrStyleProperty(";border:", "1px dashed var(--agd-stroke)") + ssrStyleProperty(";background:", "var(--agd-fill)") + ssrStyleProperty(";position:", "relative") + ssrStyleProperty(";overflow:", "hidden")) })));
}
function CheckboxSkeleton({ width, height }) {
  const sz = Math.min(width, height);
  return ssr(_tmpl$88, ssrHydrationKey(), `0 0 ${escape(width, true)} ${escape(height, true)}`, ssrAttribute("y", (escape(height, true) - escape(sz, true) + 2) / 2, false) + ssrAttribute("width", escape(sz, true) - 2, false) + ssrAttribute("height", escape(sz, true) - 2, false) + ssrAttribute("rx", escape(sz, true) * 0.15, false), `M${escape(sz, true) * 0.25} ${escape(height, true) / 2}l${escape(sz, true) * 0.2} ${escape(sz, true) * 0.2} ${escape(sz, true) * 0.3}-${escape(sz, true) * 0.35}`);
}
function RadioSkeleton({ width, height }) {
  const r = Math.min(width, height) / 2 - 1;
  return ssr(_tmpl$89, ssrHydrationKey(), `0 0 ${escape(width, true)} ${escape(height, true)}`, ssrAttribute("cx", escape(width, true) / 2, false) + ssrAttribute("cy", escape(height, true) / 2, false) + ssrAttribute("r", escape(r, true), false), ssrAttribute("cx", escape(width, true) / 2, false) + ssrAttribute("cy", escape(height, true) / 2, false) + ssrAttribute("r", escape(r, true) * 0.45, false));
}
function SliderSkeleton({ width, height }) {
  const trackH = Math.max(2, height * 0.12);
  const thumbR = Math.min(height * 0.35, 10);
  const fillW = width * 0.55;
  return ssr(_tmpl$90, ssrHydrationKey(), ssrStyleProperty("height:", "100%") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";position:", "relative"), ssrStyleProperty("width:", "100%") + ssrStyleProperty(";height:", escape(trackH, true)) + ssrStyleProperty(";border-radius:", escape(trackH, true) / 2) + ssrStyleProperty(";background:", "var(--agd-fill)") + ssrStyleProperty(";border:", "1px solid var(--agd-stroke)") + ssrStyleProperty(";position:", "relative"), ssrStyleProperty("width:", escape(fillW, true)) + ssrStyleProperty(";height:", "100%") + ssrStyleProperty(";border-radius:", escape(trackH, true) / 2) + ssrStyleProperty(";background:", "var(--agd-bar)"), ssrStyleProperty("position:", "absolute") + ssrStyleProperty(";left:", escape(fillW, true) - escape(thumbR, true)) + ssrStyleProperty(";width:", escape(thumbR, true) * 2) + ssrStyleProperty(";height:", escape(thumbR, true) * 2) + ssrStyleProperty(";border-radius:", "50%") + ssrStyleProperty(";border:", "1.5px solid var(--agd-stroke)") + ssrStyleProperty(";background:", "var(--agd-fill)"));
}
function DatePickerSkeleton({ width, height }) {
  const inputH = Math.min(36, height * 0.15);
  const cols = 7;
  const rows = 4;
  const cellSz = Math.min((width - 16) / cols, (height - inputH - 40) / (rows + 1));
  return ssr(_tmpl$91, ssrHydrationKey(), ssrStyleProperty("height:", "100%") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", 4), ssrStyleProperty("height:", escape(inputH, true)) + ssrStyleProperty(";border-radius:", 4) + ssrStyleProperty(";border:", "1px dashed var(--agd-stroke)") + ssrStyleProperty(";background:", "var(--agd-fill)") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";padding:", "0 8px") + ssrStyleProperty(";justify-content:", "space-between"), escape(createComponent(Bar, { w: "40%", h: 2 })), ssrStyleProperty("flex:", 1) + ssrStyleProperty(";border-radius:", 6) + ssrStyleProperty(";border:", "1px dashed var(--agd-stroke)") + ssrStyleProperty(";background:", "var(--agd-fill)") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";flex-direction:", "column"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";justify-content:", "space-between") + ssrStyleProperty(";padding:", "4px 6px"), ssrStyleProperty("font-size:", 7) + ssrStyleProperty(";color:", "var(--agd-stroke)"), escape(createComponent(Bar, { w: width * 0.25, h: 2, strong: true })), ssrStyleProperty("font-size:", 7) + ssrStyleProperty(";color:", "var(--agd-stroke)"), ssrStyleProperty("display:", "grid") + ssrStyleProperty(";grid-template-columns:", "repeat(7, 1fr)") + ssrStyleProperty(";gap:", 1) + ssrStyleProperty(";padding:", "0 4px") + ssrStyleProperty(";flex:", 1), escape(createComponent(For, { get each() {
    return Array.from({ length: cols * rows }, (_, i) => i);
  }, children: (i) => ssr(_tmpl$92, ssrHydrationKey(), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";justify-content:", "center") + ssrStyleProperty(";height:", escape(cellSz, true)), ssrStyleProperty("width:", escape(cellSz, true) * 0.5) + ssrStyleProperty(";height:", escape(cellSz, true) * 0.5) + ssrStyleProperty(";border-radius:", "50%") + ssrStyleProperty(";background:", i === 10 ? "var(--agd-bar)" : "transparent"), ssrStyleProperty("width:", "100%") + ssrStyleProperty(";height:", "100%") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";justify-content:", "center"), ssrStyleProperty("width:", 1.5) + ssrStyleProperty(";height:", 1.5) + ssrStyleProperty(";border-radius:", 1) + ssrStyleProperty(";background:", "var(--agd-bar-strong)") + ssrStyleProperty(";opacity:", i === 10 ? 1 : 0.25)) })));
}
function SkeletonSkeletonRenderer({ width, height }) {
  return ssr(_tmpl$93, ssrHydrationKey(), ssrStyleProperty("height:", "100%") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", escape(height, true) * 0.08) + ssrStyleProperty(";padding:", 4), ssrStyleProperty("width:", "100%") + ssrStyleProperty(";height:", escape(height, true) * 0.2) + ssrStyleProperty(";border-radius:", 4) + ssrStyleProperty(";background:", "var(--agd-fill)"), ssrStyleProperty("width:", "70%") + ssrStyleProperty(";height:", escape(Math.max(6, height * 0.1), true)) + ssrStyleProperty(";border-radius:", 3) + ssrStyleProperty(";background:", "var(--agd-fill)"), ssrStyleProperty("width:", "90%") + ssrStyleProperty(";height:", escape(Math.max(4, height * 0.06), true)) + ssrStyleProperty(";border-radius:", 3) + ssrStyleProperty(";background:", "var(--agd-fill)"), ssrStyleProperty("width:", "50%") + ssrStyleProperty(";height:", escape(Math.max(4, height * 0.06), true)) + ssrStyleProperty(";border-radius:", 3) + ssrStyleProperty(";background:", "var(--agd-fill)"));
}
function ChipSkeleton({ width, height }) {
  return ssr(_tmpl$94, ssrHydrationKey(), ssrStyleProperty("height:", "100%") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", 6), ssrStyleProperty("height:", "100%") + ssrStyleProperty(";flex:", 1) + ssrStyleProperty(";border-radius:", escape(height, true) / 2) + ssrStyleProperty(";border:", "1px solid var(--agd-stroke)") + ssrStyleProperty(";background:", "var(--agd-fill)") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";padding:", `0 ${escape(height, true) * 0.3}px`) + ssrStyleProperty(";gap:", 4), escape(createComponent(Bar, { w: "60%", h: 2, strong: true })), ssrStyleProperty("width:", escape(Math.max(6, height * 0.3), true)) + ssrStyleProperty(";height:", escape(Math.max(6, height * 0.3), true)) + ssrStyleProperty(";border-radius:", "50%") + ssrStyleProperty(";border:", "1px solid var(--agd-stroke)") + ssrStyleProperty(";flex-shrink:", 0) + ssrStyleProperty(";margin-left:", "auto"));
}
function IconSkeleton({ width, height }) {
  const sz = Math.min(width, height);
  return ssr(_tmpl$95, ssrHydrationKey(), `0 0 ${escape(width, true)} ${escape(height, true)}`, `M${escape(width, true) / 2} ${(escape(height, true) - escape(sz, true)) / 2 + escape(sz, true) * 0.1}l${escape(sz, true) * 0.12} ${escape(sz, true) * 0.25} ${escape(sz, true) * 0.28} ${escape(sz, true) * 0.04}-${escape(sz, true) * 0.2} ${escape(sz, true) * 0.2} ${escape(sz, true) * 0.05} ${escape(sz, true) * 0.28}-${escape(sz, true) * 0.25}-${escape(sz, true) * 0.12}-${escape(sz, true) * 0.25} ${escape(sz, true) * 0.12} ${escape(sz, true) * 0.05}-${escape(sz, true) * 0.28}-${escape(sz, true) * 0.2}-${escape(sz, true) * 0.2} ${escape(sz, true) * 0.28}-${escape(sz, true) * 0.04}z`);
}
function SpinnerSkeleton({ width, height }) {
  const r = Math.min(width, height) / 2 - 2;
  return ssr(_tmpl$96, ssrHydrationKey(), `0 0 ${escape(width, true)} ${escape(height, true)}`, ssrAttribute("cx", escape(width, true) / 2, false) + ssrAttribute("cy", escape(height, true) / 2, false) + ssrAttribute("r", escape(r, true), false), `M${escape(width, true) / 2} ${escape(height, true) / 2 - escape(r, true)}a${escape(r, true)} ${escape(r, true)} 0 0 1 ${escape(r, true)} ${escape(r, true)}`);
}
function FeatureSkeleton({ width, height }) {
  const iconSz = Math.min(36, height * 0.25, width * 0.12);
  const items = Math.max(1, Math.min(3, Math.floor(height / 80)));
  return ssr(_tmpl$50, ssrHydrationKey(), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";height:", "100%") + ssrStyleProperty(";justify-content:", "space-around") + ssrStyleProperty(";padding:", 8), escape(createComponent(For, { get each() {
    return Array.from({ length: items }, (_, i) => i);
  }, children: (i) => ssr(_tmpl$97, ssrHydrationKey(), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";gap:", escape(width, true) * 0.04) + ssrStyleProperty(";align-items:", "flex-start"), escape(createComponent(Block, { w: iconSz, h: iconSz, radius: iconSz * 0.25 })), ssrStyleProperty("flex:", 1) + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", 4), escape(createComponent(Bar, { w: `${40 + i * 13 % 20}%`, h: 3, strong: true })), escape(createComponent(Bar, { w: `${60 + i * 17 % 25}%`, h: 2 }))) })));
}
function TeamSkeleton({ width, height }) {
  const cols = Math.max(2, Math.min(4, Math.floor(width / 120)));
  const avatarSz = Math.min(36, height * 0.25);
  return ssr(_tmpl$55, ssrHydrationKey(), ssrStyleProperty("height:", "100%") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", escape(height, true) * 0.06) + ssrStyleProperty(";padding:", escape(height, true) * 0.06), escape(createComponent(Bar, { w: width * 0.3, h: 4, strong: true })), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";gap:", escape(width, true) * 0.06) + ssrStyleProperty(";justify-content:", "center") + ssrStyleProperty(";flex:", 1) + ssrStyleProperty(";align-items:", "center"), escape(createComponent(For, { get each() {
    return Array.from({ length: cols }, (_, i) => i);
  }, children: (i) => ssr(_tmpl$71, ssrHydrationKey(), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", 6), escape(createComponent(Circle, { size: avatarSz })), escape(createComponent(Bar, { w: width * 0.12, h: 3, strong: true })), escape(createComponent(Bar, { w: width * 0.08, h: 2 }))) })));
}
function LoginSkeleton({ width, height }) {
  const fields = Math.max(2, Math.min(3, Math.floor(height / 80)));
  return ssr(_tmpl$98, ssrHydrationKey(), ssrStyleProperty("height:", "100%") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";padding:", escape(width, true) * 0.06) + ssrStyleProperty(";gap:", escape(height, true) * 0.04), escape(createComponent(Bar, { w: width * 0.5, get h() {
    return Math.max(5, height * 0.04);
  }, strong: true })), escape(createComponent(Bar, { w: width * 0.35, h: 2 })), ssrStyleProperty("width:", "100%") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", escape(height, true) * 0.03) + ssrStyleProperty(";margin-top:", escape(height, true) * 0.04), escape(createComponent(For, { get each() {
    return Array.from({ length: fields }, (_, i) => i);
  }, children: (i) => ssr(_tmpl$49, ssrHydrationKey(), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", 3), escape(createComponent(Bar, { get w() {
    return Math.min(60, width * 0.2);
  }, h: 2 })), escape(createComponent(Block, { w: "100%", get h() {
    return Math.min(32, height * 0.1);
  }, radius: 4 }))) })), escape(createComponent(Block, { w: "100%", get h() {
    return Math.min(36, height * 0.12);
  }, radius: 6, style: { "margin-top": height * 0.03, background: "var(--agd-bar)" } })), escape(createComponent(Bar, { w: width * 0.4, h: 2 })));
}
function ContactSkeleton({ width, height }) {
  return ssr(_tmpl$99, ssrHydrationKey(), ssrStyleProperty("height:", "100%") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";padding:", escape(width, true) * 0.04) + ssrStyleProperty(";gap:", escape(height, true) * 0.03), escape(createComponent(Bar, { w: width * 0.4, h: 4, strong: true })), escape(createComponent(Bar, { w: width * 0.6, h: 2 })), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";gap:", 6) + ssrStyleProperty(";margin-top:", escape(height, true) * 0.03), ssrStyleProperty("flex:", 1) + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", 3), escape(createComponent(Bar, { w: 50, h: 2 })), escape(createComponent(Block, { w: "100%", get h() {
    return Math.min(28, height * 0.1);
  }, radius: 4 })), ssrStyleProperty("flex:", 1) + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", 3), escape(createComponent(Bar, { w: 40, h: 2 })), escape(createComponent(Block, { w: "100%", get h() {
    return Math.min(28, height * 0.1);
  }, radius: 4 })), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", 3), escape(createComponent(Bar, { w: 50, h: 2 })), escape(createComponent(Block, { w: "100%", get h() {
    return Math.min(28, height * 0.1);
  }, radius: 4 })), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", 3) + ssrStyleProperty(";flex:", 1), escape(createComponent(Bar, { w: 60, h: 2 })), escape(createComponent(Block, { w: "100%", h: "100%", radius: 4 })), escape(createComponent(Block, { get w() {
    return Math.min(120, width * 0.3);
  }, get h() {
    return Math.min(30, height * 0.1);
  }, radius: 6, style: { "align-self": "flex-end", background: "var(--agd-bar)" } })));
}
var SKELETON_RENDERERS = { navigation: NavigationSkeleton, hero: HeroSkeleton, sidebar: SidebarSkeleton, footer: FooterSkeleton, modal: ModalSkeleton, card: CardSkeleton, text: TextSkeleton, image: ImageSkeleton, table: TableSkeleton, list: ListSkeleton, button: ButtonSkeleton, input: InputSkeleton, form: FormSkeleton, tabs: TabsSkeleton, avatar: AvatarSkeleton, badge: BadgeSkeleton, header: HeaderSkeleton, section: SectionSkeleton, grid: GridSkeleton, dropdown: DropdownSkeleton, toggle: ToggleSkeleton, search: SearchSkeleton, toast: ToastSkeleton, progress: ProgressSkeleton, chart: ChartSkeleton, video: VideoSkeleton, tooltip: TooltipSkeleton, breadcrumb: BreadcrumbSkeleton, pagination: PaginationSkeleton, divider: DividerSkeleton, accordion: AccordionSkeleton, carousel: CarouselSkeleton, pricing: PricingSkeleton, testimonial: TestimonialSkeleton, cta: CtaSkeleton, alert: AlertSkeleton, banner: BannerSkeleton, stat: StatSkeleton, stepper: StepperSkeleton, tag: TagSkeleton, rating: RatingSkeleton, map: MapSkeleton, timeline: TimelineSkeleton, fileUpload: FileUploadSkeleton, codeBlock: CodeBlockSkeleton, calendar: CalendarSkeleton, notification: NotificationSkeleton, productCard: ProductCardSkeleton, profile: ProfileSkeleton, drawer: DrawerSkeleton, popover: PopoverSkeleton, logo: LogoSkeleton, faq: FaqSkeleton, gallery: GallerySkeleton, checkbox: CheckboxSkeleton, radio: RadioSkeleton, slider: SliderSkeleton, datePicker: DatePickerSkeleton, skeleton: SkeletonSkeletonRenderer, chip: ChipSkeleton, icon: IconSkeleton, spinner: SpinnerSkeleton, feature: FeatureSkeleton, team: TeamSkeleton, login: LoginSkeleton, contact: ContactSkeleton };
function Skeleton({ type, width, height, text }) {
  const Renderer = SKELETON_RENDERERS[type];
  if (!Renderer) {
    return ssr(_tmpl$100, ssrHydrationKey(), ssrStyleProperty("width:", "100%") + ssrStyleProperty(";height:", "100%") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";justify-content:", "center"), ssrStyleProperty("font-size:", 10) + ssrStyleProperty(";font-weight:", 600) + ssrStyleProperty(";color:", "var(--agd-text-3)") + ssrStyleProperty(";text-transform:", "uppercase") + ssrStyleProperty(";letter-spacing:", "0.06em") + ssrStyleProperty(";opacity:", 0.5), escape(type));
  }
  return ssr(_tmpl$50, ssrHydrationKey(), ssrStyleProperty("width:", "100%") + ssrStyleProperty(";height:", "100%") + ssrStyleProperty(";padding:", 8) + ssrStyleProperty(";position:", "relative") + ssrStyleProperty(";pointer-events:", "none"), escape(createComponent(Renderer, { width, height, text })));
}
var css4 = 'svg[fill=none] {\n  fill: none !important;\n}\n\n.styles-module__overlayExiting___iEmYr {\n  opacity: 0 !important;\n  transition: opacity 0.25s ease !important;\n  pointer-events: none !important;\n}\n\n.styles-module__overlay___aWh-q {\n  position: fixed;\n  inset: 0;\n  z-index: 99995;\n  pointer-events: auto;\n  cursor: default;\n  animation: styles-module__overlayFadeIn___aECVy 0.15s ease;\n  --agd-stroke: rgba(59, 130, 246, 0.35);\n  --agd-fill: rgba(59, 130, 246, 0.06);\n  --agd-bar: rgba(59, 130, 246, 0.18);\n  --agd-bar-strong: rgba(59, 130, 246, 0.28);\n  --agd-text-3: rgba(255, 255, 255, 0.6);\n  --agd-surface: #fff;\n}\n.styles-module__overlay___aWh-q.styles-module__light___ORIft {\n  --agd-surface: #fff;\n}\n.styles-module__overlay___aWh-q:not(.styles-module__light___ORIft) {\n  --agd-surface: #141414;\n}\n.styles-module__overlay___aWh-q.styles-module__wireframe___itvQU {\n  --agd-stroke: rgba(249, 115, 22, 0.35);\n  --agd-fill: rgba(249, 115, 22, 0.06);\n  --agd-bar: rgba(249, 115, 22, 0.18);\n  --agd-bar-strong: rgba(249, 115, 22, 0.28);\n}\n.styles-module__overlay___aWh-q.styles-module__placing___45yD8 {\n  cursor: crosshair;\n}\n.styles-module__overlay___aWh-q.styles-module__passthrough___xaFeE {\n  pointer-events: none;\n}\n\n.styles-module__blankCanvas___t2Eue {\n  position: fixed;\n  inset: 0;\n  z-index: 99994;\n  background: #fff;\n  opacity: 0;\n  pointer-events: none;\n  transition: opacity 0.25s ease;\n}\n.styles-module__blankCanvas___t2Eue.styles-module__visible___OKKqX {\n  opacity: var(--canvas-opacity, 1);\n  pointer-events: auto;\n}\n.styles-module__blankCanvas___t2Eue::after {\n  content: "";\n  position: absolute;\n  inset: 0;\n  background-image: radial-gradient(circle, rgba(0, 0, 0, 0.08) 1px, transparent 1px);\n  background-size: 24px 24px;\n  background-position: 12px 12px;\n  pointer-events: none;\n  transition: opacity 0.2s ease;\n}\n.styles-module__blankCanvas___t2Eue.styles-module__gridActive___OZ-cf::after {\n  opacity: 1;\n  background-image: radial-gradient(circle, rgba(0, 0, 0, 0.22) 1px, transparent 1px);\n}\n\n.styles-module__paletteHeader___-Q5gQ {\n  padding: 0 1rem 0.375rem;\n}\n\n.styles-module__paletteHeaderTitle___oHqZC {\n  font-size: 0.8125rem;\n  font-weight: 500;\n  color: #fff;\n  letter-spacing: -0.0094em;\n}\n.styles-module__light___ORIft .styles-module__paletteHeaderTitle___oHqZC {\n  color: rgba(0, 0, 0, 0.85);\n}\n\n.styles-module__paletteHeaderDesc___6i74T {\n  font-size: 0.6875rem;\n  font-weight: 300;\n  color: rgba(255, 255, 255, 0.45);\n  margin-top: 2px;\n  line-height: 14px;\n}\n.styles-module__light___ORIft .styles-module__paletteHeaderDesc___6i74T {\n  color: rgba(0, 0, 0, 0.45);\n}\n.styles-module__paletteHeaderDesc___6i74T a {\n  color: rgba(255, 255, 255, 0.8);\n  text-decoration: underline dotted;\n  text-decoration-color: rgba(255, 255, 255, 0.2);\n  text-underline-offset: 2px;\n  transition: color 0.15s ease;\n}\n.styles-module__paletteHeaderDesc___6i74T a:hover {\n  color: #fff;\n}\n.styles-module__light___ORIft .styles-module__paletteHeaderDesc___6i74T a {\n  color: rgba(0, 0, 0, 0.6);\n  text-decoration-color: rgba(0, 0, 0, 0.2);\n}\n.styles-module__light___ORIft .styles-module__paletteHeaderDesc___6i74T a:hover {\n  color: rgba(0, 0, 0, 0.85);\n}\n\n.styles-module__wireframePurposeWrap___To-tS {\n  display: grid;\n  grid-template-rows: 1fr;\n  transition: grid-template-rows 0.2s ease, opacity 0.15s ease;\n  opacity: 1;\n}\n.styles-module__wireframePurposeWrap___To-tS.styles-module__collapsed___Ms9vS {\n  grid-template-rows: 0fr;\n  opacity: 0;\n}\n\n.styles-module__wireframePurposeInner___Lrahs {\n  overflow: hidden;\n}\n\n.styles-module__wireframePurposeInput___7EtBN {\n  display: block;\n  width: calc(100% - 2rem);\n  margin: 0.25rem 1rem 0.375rem;\n  padding: 0.375rem 0.5rem;\n  font-size: 0.8125rem;\n  font-family: inherit;\n  color: rgba(255, 255, 255, 0.85);\n  background: rgba(255, 255, 255, 0.03);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  border-radius: 0.375rem;\n  resize: none;\n  outline: none;\n  transition: border-color 0.15s ease;\n  letter-spacing: -0.0094em;\n}\n.styles-module__wireframePurposeInput___7EtBN::placeholder {\n  color: rgba(255, 255, 255, 0.3);\n}\n.styles-module__wireframePurposeInput___7EtBN:focus {\n  border-color: rgba(255, 255, 255, 0.3);\n  background: rgba(255, 255, 255, 0.05);\n}\n.styles-module__light___ORIft .styles-module__wireframePurposeInput___7EtBN {\n  color: rgba(0, 0, 0, 0.7);\n  background: rgba(0, 0, 0, 0.03);\n  border-color: rgba(0, 0, 0, 0.1);\n}\n.styles-module__light___ORIft .styles-module__wireframePurposeInput___7EtBN::placeholder {\n  color: rgba(0, 0, 0, 0.3);\n}\n.styles-module__light___ORIft .styles-module__wireframePurposeInput___7EtBN:focus {\n  border-color: rgba(0, 0, 0, 0.25);\n  background: rgba(0, 0, 0, 0.05);\n}\n\n.styles-module__canvasToggle___-QqSy {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.375rem;\n  margin: 0.25rem 1rem 0.25rem;\n  padding: 0.375rem 0.5rem;\n  border-radius: 0.5rem;\n  cursor: pointer;\n  border: 1px dashed rgba(255, 255, 255, 0.1);\n  background: transparent;\n  transition: background 0.15s ease, border-color 0.15s ease;\n}\n.styles-module__canvasToggle___-QqSy:hover {\n  background: rgba(255, 255, 255, 0.04);\n  border-color: rgba(255, 255, 255, 0.15);\n}\n.styles-module__canvasToggle___-QqSy.styles-module__active___hosp7 {\n  background: #f97316;\n  border-color: transparent;\n  border-style: solid;\n  box-shadow: none;\n}\n.styles-module__light___ORIft .styles-module__canvasToggle___-QqSy {\n  border-color: rgba(0, 0, 0, 0.08);\n}\n.styles-module__light___ORIft .styles-module__canvasToggle___-QqSy:hover {\n  background: rgba(0, 0, 0, 0.02);\n  border-color: rgba(0, 0, 0, 0.12);\n}\n.styles-module__light___ORIft .styles-module__canvasToggle___-QqSy.styles-module__active___hosp7 {\n  background: #f97316;\n  border-color: transparent;\n  border-style: solid;\n  box-shadow: none;\n}\n\n.styles-module__canvasToggleIcon___7pJ82 {\n  width: 14px;\n  height: 14px;\n  flex-shrink: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: rgba(255, 255, 255, 0.35);\n}\n.styles-module__active___hosp7 .styles-module__canvasToggleIcon___7pJ82 {\n  color: rgba(255, 255, 255, 0.85);\n}\n.styles-module__light___ORIft .styles-module__canvasToggleIcon___7pJ82 {\n  color: rgba(0, 0, 0, 0.25);\n}\n.styles-module__light___ORIft .styles-module__active___hosp7 .styles-module__canvasToggleIcon___7pJ82 {\n  color: rgba(255, 255, 255, 0.85);\n}\n\n.styles-module__canvasToggleLabel___OanpY {\n  font-size: 0.8125rem;\n  font-weight: 400;\n  color: rgba(255, 255, 255, 0.6);\n  letter-spacing: -0.0094em;\n}\n.styles-module__active___hosp7 .styles-module__canvasToggleLabel___OanpY {\n  color: #fff;\n}\n.styles-module__light___ORIft .styles-module__canvasToggleLabel___OanpY {\n  color: rgba(0, 0, 0, 0.5);\n}\n.styles-module__light___ORIft .styles-module__active___hosp7 .styles-module__canvasToggleLabel___OanpY {\n  color: #fff;\n}\n\n.styles-module__canvasPurposeWrap___hj6zk {\n  display: grid;\n  grid-template-rows: 1fr;\n  transition: grid-template-rows 0.2s ease, opacity 0.15s ease;\n  opacity: 1;\n}\n.styles-module__canvasPurposeWrap___hj6zk.styles-module__collapsed___Ms9vS {\n  grid-template-rows: 0fr;\n  opacity: 0;\n}\n\n.styles-module__canvasPurposeInner___VWiyu {\n  overflow: hidden;\n}\n\n.styles-module__canvasPurposeToggle___byDH2 {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  cursor: pointer;\n  margin: 0.375rem 1rem 0.375rem 1.1875rem;\n}\n.styles-module__canvasPurposeToggle___byDH2 input[type=checkbox] {\n  position: absolute;\n  opacity: 0;\n  width: 0;\n  height: 0;\n}\n\n.styles-module__canvasPurposeCheck___xqd7l {\n  position: relative;\n  width: 14px;\n  height: 14px;\n  border: 1px solid rgba(255, 255, 255, 0.2);\n  border-radius: 4px;\n  background: rgba(255, 255, 255, 0.05);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n  transition: background 0.25s ease, border-color 0.25s ease;\n}\n.styles-module__canvasPurposeCheck___xqd7l svg {\n  color: #1a1a1a;\n  opacity: 1;\n  transition: opacity 0.15s ease;\n}\n.styles-module__canvasPurposeCheck___xqd7l.styles-module__checked___-1JGH {\n  border-color: rgba(255, 255, 255, 0.3);\n  background: rgb(255, 255, 255);\n}\n.styles-module__light___ORIft .styles-module__canvasPurposeCheck___xqd7l {\n  border: 1px solid rgba(0, 0, 0, 0.15);\n  background: #fff;\n}\n.styles-module__light___ORIft .styles-module__canvasPurposeCheck___xqd7l.styles-module__checked___-1JGH {\n  border-color: #1a1a1a;\n  background: #1a1a1a;\n}\n.styles-module__light___ORIft .styles-module__canvasPurposeCheck___xqd7l.styles-module__checked___-1JGH svg {\n  color: #fff;\n}\n\n.styles-module__canvasPurposeLabel___Zu-tD {\n  font-size: 0.8125rem;\n  font-weight: 400;\n  color: rgba(255, 255, 255, 0.5);\n  letter-spacing: -0.0094em;\n  display: flex;\n  align-items: center;\n  gap: 0.25rem;\n}\n.styles-module__light___ORIft .styles-module__canvasPurposeLabel___Zu-tD {\n  color: rgba(0, 0, 0, 0.5);\n}\n\n.styles-module__canvasPurposeHelp___jijwR {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: help;\n}\n.styles-module__canvasPurposeHelp___jijwR svg {\n  color: rgba(255, 255, 255, 0.2);\n  transform: translateY(2px);\n  transition: color 0.15s ease;\n}\n.styles-module__canvasPurposeHelp___jijwR:hover svg {\n  color: rgba(255, 255, 255, 0.5);\n}\n.styles-module__light___ORIft .styles-module__canvasPurposeHelp___jijwR svg {\n  color: rgba(0, 0, 0, 0.2);\n}\n.styles-module__light___ORIft .styles-module__canvasPurposeHelp___jijwR:hover svg {\n  color: rgba(0, 0, 0, 0.5);\n}\n\n.styles-module__placement___zcxv8 {\n  position: absolute;\n  border: 1.5px dashed rgba(59, 130, 246, 0.4);\n  border-radius: 6px;\n  background: rgba(59, 130, 246, 0.08);\n  cursor: grab;\n  transition: box-shadow 0.15s, border-color 0.15s, opacity 0.15s ease, transform 0.15s ease;\n  user-select: none;\n  pointer-events: auto;\n  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);\n  animation: styles-module__placementEnter___TdRhf 0.25s cubic-bezier(0.34, 1.2, 0.64, 1);\n}\n.styles-module__placement___zcxv8:active {\n  cursor: grabbing;\n}\n.styles-module__placement___zcxv8:hover {\n  border-color: rgba(59, 130, 246, 0.5);\n  background: rgba(59, 130, 246, 0.1);\n  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.12);\n}\n.styles-module__placement___zcxv8.styles-module__selected___6yrp6 {\n  border-color: #3c82f7;\n  border-style: solid;\n  background: rgba(59, 130, 246, 0.1);\n  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15), 0 2px 8px rgba(59, 130, 246, 0.15);\n}\n.styles-module__placement___zcxv8.styles-module__selected___6yrp6:hover {\n  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15), 0 2px 8px rgba(59, 130, 246, 0.15);\n}\n.styles-module__wireframe___itvQU .styles-module__placement___zcxv8 {\n  border-color: rgba(249, 115, 22, 0.4);\n  background: rgba(249, 115, 22, 0.08);\n}\n.styles-module__wireframe___itvQU .styles-module__placement___zcxv8:hover {\n  border-color: rgba(249, 115, 22, 0.5);\n  background: rgba(249, 115, 22, 0.1);\n  box-shadow: 0 2px 8px rgba(249, 115, 22, 0.12);\n}\n.styles-module__wireframe___itvQU .styles-module__placement___zcxv8.styles-module__selected___6yrp6 {\n  border-color: #f97316;\n  background: rgba(249, 115, 22, 0.1);\n  box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.15), 0 2px 8px rgba(249, 115, 22, 0.15);\n}\n.styles-module__wireframe___itvQU .styles-module__placement___zcxv8.styles-module__selected___6yrp6:hover {\n  box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.15), 0 2px 8px rgba(249, 115, 22, 0.15);\n}\n.styles-module__placement___zcxv8.styles-module__dragging___le6KZ {\n  opacity: 0.85;\n  z-index: 50;\n}\n.styles-module__placement___zcxv8.styles-module__exiting___YrM8F {\n  opacity: 0;\n  transform: scale(0.97);\n  pointer-events: none;\n  animation: none;\n  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.32, 0.72, 0, 1);\n}\n\n.styles-module__placementContent___f64A4 {\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n  pointer-events: none;\n}\n\n.styles-module__placementLabel___0KvWl {\n  position: absolute;\n  top: -18px;\n  left: 0;\n  font-size: 10px;\n  font-weight: 600;\n  color: rgba(59, 130, 246, 0.7);\n  white-space: nowrap;\n  pointer-events: none;\n  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n  text-shadow: 0 0 4px rgba(255, 255, 255, 0.8), 0 0 8px rgba(255, 255, 255, 0.5);\n}\n.styles-module__selected___6yrp6 .styles-module__placementLabel___0KvWl {\n  color: #3c82f7;\n}\n.styles-module__wireframe___itvQU .styles-module__placementLabel___0KvWl {\n  color: rgba(249, 115, 22, 0.7);\n}\n.styles-module__wireframe___itvQU .styles-module__selected___6yrp6 .styles-module__placementLabel___0KvWl {\n  color: #f97316;\n}\n\n.styles-module__placementAnnotation___78pTr {\n  position: absolute;\n  bottom: -18px;\n  left: 0;\n  right: 0;\n  font-weight: 450;\n  color: rgba(0, 0, 0, 0.5);\n  font-size: 10px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  pointer-events: none;\n  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n  text-shadow: 0 0 4px rgba(255, 255, 255, 0.9), 0 0 8px rgba(255, 255, 255, 0.6);\n  opacity: 0;\n  transform: translateY(-2px);\n  transition: opacity 0.2s ease, transform 0.2s ease;\n}\n.styles-module__placementAnnotation___78pTr.styles-module__annotationVisible___mrUyA {\n  opacity: 1;\n  transform: translateY(0);\n}\n\n.styles-module__sectionAnnotation___aUIs0 {\n  position: absolute;\n  bottom: -18px;\n  left: 0;\n  right: 0;\n  font-weight: 450;\n  color: rgba(59, 130, 246, 0.6);\n  font-size: 10px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  pointer-events: none;\n  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n  text-shadow: 0 0 4px rgba(255, 255, 255, 0.9), 0 0 8px rgba(255, 255, 255, 0.6);\n  opacity: 0;\n  transform: translateY(-2px);\n  transition: opacity 0.2s ease, transform 0.2s ease;\n}\n.styles-module__sectionAnnotation___aUIs0.styles-module__annotationVisible___mrUyA {\n  opacity: 1;\n  transform: translateY(0);\n}\n\n.styles-module__handle___Ikbxm {\n  position: absolute;\n  width: 8px;\n  height: 8px;\n  background: #fff;\n  border: 1.5px solid #3c82f7;\n  border-radius: 2px;\n  z-index: 12;\n  box-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.12);\n  opacity: 0;\n  transform: scale(0.3);\n  pointer-events: none;\n  will-change: opacity, transform;\n  transition: opacity 0.2s ease-out, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);\n}\n.styles-module__placement___zcxv8:hover .styles-module__handle___Ikbxm, .styles-module__sectionOutline___s0hy-:hover .styles-module__handle___Ikbxm, .styles-module__ghostOutline___po-kO:hover .styles-module__handle___Ikbxm, .styles-module__placement___zcxv8:active .styles-module__handle___Ikbxm, .styles-module__sectionOutline___s0hy-:active .styles-module__handle___Ikbxm, .styles-module__ghostOutline___po-kO:active .styles-module__handle___Ikbxm, .styles-module__selected___6yrp6 .styles-module__handle___Ikbxm {\n  opacity: 1;\n  transform: scale(1);\n  pointer-events: auto;\n}\n.styles-module__sectionOutline___s0hy- .styles-module__handle___Ikbxm {\n  border-color: inherit;\n}\n.styles-module__wireframe___itvQU .styles-module__handle___Ikbxm {\n  border-color: #f97316;\n}\n\n.styles-module__handleNw___4TMIj {\n  top: -4px;\n  left: -4px;\n  cursor: nw-resize;\n}\n\n.styles-module__handleNe___mnsTh {\n  top: -4px;\n  right: -4px;\n  cursor: ne-resize;\n}\n\n.styles-module__handleSe___oSFnk {\n  bottom: -4px;\n  right: -4px;\n  cursor: se-resize;\n}\n\n.styles-module__handleSw___pi--Z {\n  bottom: -4px;\n  left: -4px;\n  cursor: sw-resize;\n}\n\n.styles-module__handleN___aBA-Q, .styles-module__handleE___0hM5u, .styles-module__handleS___JjDRv, .styles-module__handleW___ERWGQ {\n  opacity: 0 !important;\n  pointer-events: none !important;\n}\n\n.styles-module__edgeHandle___XxXdT {\n  position: absolute;\n  z-index: 11;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.styles-module__edgeHandle___XxXdT::after {\n  content: "";\n  position: absolute;\n  border-radius: 4px;\n  background: #3c82f7;\n}\n.styles-module__wireframe___itvQU .styles-module__edgeHandle___XxXdT::after {\n  background: #f97316;\n}\n.styles-module__edgeHandle___XxXdT::after {\n  opacity: 0;\n  transition: opacity 0.1s ease, transform 0.1s ease;\n  transform: scale(0.8);\n}\n.styles-module__edgeHandle___XxXdT:hover::after {\n  opacity: 0.85;\n  transform: scale(1);\n}\n.styles-module__edgeHandle___XxXdT svg {\n  position: relative;\n  z-index: 1;\n  opacity: 0;\n  transition: opacity 0.1s ease;\n  filter: drop-shadow(0 0 2px var(--agd-surface));\n}\n.styles-module__edgeHandle___XxXdT:hover svg {\n  opacity: 1;\n}\n\n.styles-module__edgeN___-JJDj, .styles-module__edgeS___66lMX {\n  left: 12px;\n  right: 12px;\n  height: 12px;\n  cursor: n-resize;\n}\n.styles-module__edgeN___-JJDj::after, .styles-module__edgeS___66lMX::after {\n  width: 24px;\n  height: 4px;\n}\n\n.styles-module__edgeN___-JJDj {\n  top: -6px;\n}\n\n.styles-module__edgeS___66lMX {\n  bottom: -6px;\n  cursor: s-resize;\n}\n\n.styles-module__edgeE___1bGDa, .styles-module__edgeW___lHQNo {\n  top: 12px;\n  bottom: 12px;\n  width: 12px;\n  cursor: e-resize;\n}\n.styles-module__edgeE___1bGDa::after, .styles-module__edgeW___lHQNo::after {\n  width: 4px;\n  height: 24px;\n}\n\n.styles-module__edgeE___1bGDa {\n  right: -6px;\n}\n\n.styles-module__edgeW___lHQNo {\n  left: -6px;\n  cursor: w-resize;\n}\n\n.styles-module__deleteButton___LkGCb {\n  position: absolute;\n  top: -8px;\n  right: -8px;\n  width: 18px;\n  height: 18px;\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.9);\n  backdrop-filter: blur(8px);\n  border: 1px solid rgba(0, 0, 0, 0.08);\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);\n  color: rgba(0, 0, 0, 0.35);\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 10px;\n  line-height: 1;\n  z-index: 15;\n  pointer-events: none;\n  opacity: 0;\n  transform: scale(0.8);\n  will-change: opacity, transform;\n  transition: opacity 0.2s ease-out, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.12s ease, color 0.12s ease, border-color 0.12s ease, box-shadow 0.12s ease;\n}\n.styles-module__placement___zcxv8:hover .styles-module__deleteButton___LkGCb, .styles-module__selected___6yrp6 .styles-module__deleteButton___LkGCb, .styles-module__sectionOutline___s0hy-:hover .styles-module__deleteButton___LkGCb, .styles-module__sectionOutline___s0hy-.styles-module__selected___6yrp6 .styles-module__deleteButton___LkGCb, .styles-module__ghostOutline___po-kO:hover .styles-module__deleteButton___LkGCb, .styles-module__ghostOutline___po-kO.styles-module__selected___6yrp6 .styles-module__deleteButton___LkGCb {\n  opacity: 1;\n  transform: scale(1);\n  pointer-events: auto;\n}\n.styles-module__deleteButton___LkGCb:hover {\n  background: #ef4444;\n  color: #fff;\n  border-color: #ef4444;\n  box-shadow: 0 1px 4px rgba(239, 68, 68, 0.3);\n  transform: scale(1.1);\n}\n.styles-module__overlay___aWh-q:not(.styles-module__light___ORIft) .styles-module__deleteButton___LkGCb, .styles-module__rearrangeOverlay___-3R3t:not(.styles-module__light___ORIft) .styles-module__deleteButton___LkGCb {\n  background: rgba(40, 40, 40, 0.9);\n  border-color: rgba(255, 255, 255, 0.1);\n  color: rgba(255, 255, 255, 0.5);\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);\n}\n.styles-module__overlay___aWh-q:not(.styles-module__light___ORIft) .styles-module__deleteButton___LkGCb:hover, .styles-module__rearrangeOverlay___-3R3t:not(.styles-module__light___ORIft) .styles-module__deleteButton___LkGCb:hover {\n  background: #ef4444;\n  color: #fff;\n  border-color: #ef4444;\n}\n\n.styles-module__drawBox___BrVAa {\n  position: fixed;\n  pointer-events: none;\n  z-index: 99996;\n  border: 2px solid #3c82f7;\n  border-radius: 6px;\n  background: rgba(59, 130, 246, 0.15);\n}\n\n.styles-module__selectBox___Iu8kB {\n  position: fixed;\n  pointer-events: none;\n  z-index: 99996;\n  border: 1px dashed #3c82f7;\n  background: rgba(59, 130, 246, 0.08);\n  border-radius: 2px;\n}\n\n.styles-module__sizeIndicator___7zJ4y {\n  position: fixed;\n  pointer-events: none;\n  z-index: 100001;\n  font-size: 10px;\n  color: #fff;\n  background: #3c82f7;\n  padding: 2px 6px;\n  border-radius: 4px;\n  white-space: nowrap;\n  font-weight: 500;\n  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);\n}\n\n.styles-module__guideLine___DUQY2 {\n  pointer-events: none;\n  z-index: 100001;\n  background: #f0f;\n  opacity: 0.5;\n}\n\n.styles-module__dragPreview___onPbU {\n  position: fixed;\n  z-index: 100002;\n  pointer-events: none;\n  border: 1.5px dashed #3c82f7;\n  border-radius: 6px;\n  background: rgba(59, 130, 246, 0.1);\n  backdrop-filter: blur(8px);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 9px;\n  font-weight: 600;\n  color: #3c82f7;\n  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.15);\n  transition: width 0.08s ease, height 0.08s ease, opacity 0.08s ease;\n}\n\n.styles-module__dragPreviewWireframe___jsg0G {\n  border-color: #f97316;\n  background: rgba(249, 115, 22, 0.1);\n  color: #f97316;\n  box-shadow: 0 4px 16px rgba(249, 115, 22, 0.15);\n}\n\n.styles-module__palette___C7iSH {\n  position: absolute;\n  right: 5px;\n  bottom: calc(100% + 0.5rem);\n  width: 256px;\n  overflow: hidden;\n  background: #1c1c1c;\n  border: none;\n  border-radius: 1rem;\n  padding: 13px 0 16px;\n  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.04);\n  z-index: 100001;\n  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n  cursor: default;\n  opacity: 0;\n  filter: blur(5px);\n}\n.styles-module__palette___C7iSH .styles-module__paletteItem___6TlnA,\n.styles-module__palette___C7iSH .styles-module__paletteItemLabel___6ncO4,\n.styles-module__palette___C7iSH .styles-module__paletteSectionTitle___PqnjX,\n.styles-module__palette___C7iSH .styles-module__paletteFooter___QYnAG {\n  transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease;\n}\n.styles-module__palette___C7iSH.styles-module__enter___6LYk5 {\n  opacity: 1;\n  transform: translateY(0);\n  filter: blur(0px);\n  transition: opacity 0.2s ease, transform 0.2s ease, filter 0.2s ease;\n}\n.styles-module__palette___C7iSH.styles-module__exit___iSGRw {\n  opacity: 0;\n  transform: translateY(6px);\n  filter: blur(5px);\n  pointer-events: none;\n  transition: opacity 0.1s ease, transform 0.1s ease, filter 0.1s ease;\n}\n.styles-module__palette___C7iSH.styles-module__light___ORIft {\n  background: #fff;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04);\n}\n\n.styles-module__paletteSection___V8DEA {\n  padding: 0 1rem;\n}\n.styles-module__paletteSection___V8DEA + .styles-module__paletteSection___V8DEA {\n  margin-top: 0.5rem;\n  padding-top: 0.5rem;\n  border-top: 1px solid rgba(255, 255, 255, 0.07);\n}\n.styles-module__light___ORIft .styles-module__paletteSection___V8DEA + .styles-module__paletteSection___V8DEA {\n  border-top-color: rgba(0, 0, 0, 0.07);\n}\n\n.styles-module__paletteSectionTitle___PqnjX {\n  font-size: 0.6875rem;\n  font-weight: 500;\n  color: rgba(255, 255, 255, 0.5);\n  letter-spacing: -0.0094em;\n  padding: 0 0 3px 3px;\n}\n.styles-module__light___ORIft .styles-module__paletteSectionTitle___PqnjX {\n  color: rgba(0, 0, 0, 0.4);\n}\n\n.styles-module__paletteItem___6TlnA {\n  display: flex;\n  align-items: center;\n  gap: 0.375rem;\n  padding: 0.25rem 0.25rem;\n  margin-bottom: 1px;\n  border-radius: 0.375rem;\n  cursor: pointer;\n  transition: background-color 0.15s ease, border-color 0.15s ease;\n  border: 1px solid transparent;\n  user-select: none;\n  min-height: 24px;\n}\n.styles-module__paletteItem___6TlnA:hover {\n  background: rgba(255, 255, 255, 0.1);\n}\n.styles-module__paletteItem___6TlnA.styles-module__active___hosp7 {\n  background: #3c82f7;\n  border-color: transparent;\n}\n.styles-module__paletteItem___6TlnA.styles-module__wireframe___itvQU.styles-module__active___hosp7 {\n  background: #f97316;\n}\n.styles-module__light___ORIft .styles-module__paletteItem___6TlnA:hover {\n  background: rgba(0, 0, 0, 0.05);\n}\n.styles-module__light___ORIft .styles-module__paletteItem___6TlnA.styles-module__active___hosp7 {\n  background: #3c82f7;\n  border-color: transparent;\n}\n.styles-module__light___ORIft .styles-module__paletteItem___6TlnA.styles-module__wireframe___itvQU.styles-module__active___hosp7 {\n  background: #f97316;\n}\n\n.styles-module__paletteItemIcon___0NPQK {\n  width: 20px;\n  height: 16px;\n  border-radius: 2px;\n  border: 1px dashed rgba(255, 255, 255, 0.15);\n  background: rgba(255, 255, 255, 0.04);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n  overflow: hidden;\n  color: rgba(255, 255, 255, 0.45);\n}\n.styles-module__paletteItemIcon___0NPQK svg {\n  display: block;\n  width: 20px;\n  height: 16px;\n}\n.styles-module__active___hosp7 .styles-module__paletteItemIcon___0NPQK {\n  border-color: rgba(255, 255, 255, 0.3);\n  background: rgba(255, 255, 255, 0.15);\n  color: #fff;\n}\n.styles-module__light___ORIft .styles-module__paletteItemIcon___0NPQK {\n  border-color: rgba(0, 0, 0, 0.12);\n  background: rgba(0, 0, 0, 0.02);\n  color: rgba(0, 0, 0, 0.4);\n}\n.styles-module__light___ORIft .styles-module__active___hosp7 .styles-module__paletteItemIcon___0NPQK {\n  border-color: rgba(255, 255, 255, 0.3);\n  background: rgba(255, 255, 255, 0.15);\n  color: #fff;\n}\n\n.styles-module__paletteItemLabel___6ncO4 {\n  font-size: 0.8125rem;\n  font-weight: 500;\n  color: rgba(255, 255, 255, 0.85);\n  letter-spacing: -0.0094em;\n  line-height: 1;\n  min-width: 0;\n}\n.styles-module__active___hosp7 .styles-module__paletteItemLabel___6ncO4 {\n  color: #fff;\n  font-weight: 600;\n}\n.styles-module__light___ORIft .styles-module__paletteItemLabel___6ncO4 {\n  color: rgba(0, 0, 0, 0.7);\n}\n.styles-module__light___ORIft .styles-module__active___hosp7 .styles-module__paletteItemLabel___6ncO4 {\n  color: #fff;\n  font-weight: 600;\n}\n\n.styles-module__placeScroll___7sClM {\n  max-height: 240px;\n  overflow-y: auto;\n  overflow-x: hidden;\n  padding-top: 0.25rem;\n}\n.styles-module__placeScroll___7sClM.styles-module__fadeTop___KT9tF {\n  -webkit-mask-image: linear-gradient(to bottom, transparent 0, black 32px);\n  mask-image: linear-gradient(to bottom, transparent 0, black 32px);\n}\n.styles-module__placeScroll___7sClM.styles-module__fadeBottom___x3ShT {\n  -webkit-mask-image: linear-gradient(to bottom, black calc(100% - 32px), transparent 100%);\n  mask-image: linear-gradient(to bottom, black calc(100% - 32px), transparent 100%);\n}\n.styles-module__placeScroll___7sClM.styles-module__fadeTop___KT9tF.styles-module__fadeBottom___x3ShT {\n  -webkit-mask-image: linear-gradient(to bottom, transparent 0, black 32px, black calc(100% - 32px), transparent 100%);\n  mask-image: linear-gradient(to bottom, transparent 0, black 32px, black calc(100% - 32px), transparent 100%);\n}\n.styles-module__placeScroll___7sClM::-webkit-scrollbar {\n  width: 3px;\n}\n.styles-module__placeScroll___7sClM::-webkit-scrollbar-thumb {\n  background: rgba(255, 255, 255, 0.12);\n  border-radius: 2px;\n}\n.styles-module__light___ORIft .styles-module__placeScroll___7sClM::-webkit-scrollbar-thumb {\n  background: rgba(0, 0, 0, 0.1);\n}\n\n.styles-module__paletteFooterWrap___71-fI {\n  display: grid;\n  grid-template-rows: 1fr;\n  transition: grid-template-rows 0.25s cubic-bezier(0.32, 0.72, 0, 1);\n}\n.styles-module__paletteFooterWrap___71-fI.styles-module__footerHidden___fJUik {\n  grid-template-rows: 0fr;\n}\n\n.styles-module__paletteFooterInnerContent___VC26h {\n  opacity: 1;\n  transform: translateY(0);\n  transition: opacity 0.15s ease, transform 0.15s ease;\n}\n.styles-module__footerHidden___fJUik .styles-module__paletteFooterInnerContent___VC26h {\n  opacity: 0;\n  transform: translateY(4px);\n}\n\n.styles-module__paletteFooterInner___dfylY {\n  overflow: hidden;\n}\n\n.styles-module__paletteFooter___QYnAG {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  min-height: 24px;\n  padding: 0 1rem;\n  margin-top: 0.5rem;\n  padding-top: 0.5rem;\n  border-top: 1px solid rgba(255, 255, 255, 0.07);\n}\n.styles-module__light___ORIft .styles-module__paletteFooter___QYnAG {\n  border-top-color: rgba(0, 0, 0, 0.07);\n}\n\n.styles-module__paletteFooterCount___D3Fia {\n  font-size: 0.8125rem;\n  font-weight: 400;\n  letter-spacing: -0.0094em;\n  color: rgba(255, 255, 255, 0.5);\n}\n.styles-module__light___ORIft .styles-module__paletteFooterCount___D3Fia {\n  color: rgba(0, 0, 0, 0.5);\n}\n\n.styles-module__paletteFooterClear___ybBoa {\n  font-size: 0.8125rem;\n  font-weight: 400;\n  letter-spacing: -0.0094em;\n  color: rgba(255, 255, 255, 0.5);\n  background: none;\n  border: none;\n  cursor: pointer;\n  padding: 0;\n  font-family: inherit;\n  transition: color 0.15s ease;\n}\n.styles-module__paletteFooterClear___ybBoa:hover {\n  color: rgba(255, 255, 255, 0.7);\n}\n.styles-module__light___ORIft .styles-module__paletteFooterClear___ybBoa {\n  color: rgba(0, 0, 0, 0.5);\n}\n.styles-module__light___ORIft .styles-module__paletteFooterClear___ybBoa:hover {\n  color: rgba(0, 0, 0, 0.6);\n}\n\n.styles-module__paletteFooterActions___fLzv8 {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n}\n\n.styles-module__rollingWrap___S75jM {\n  display: inline-block;\n  overflow: hidden;\n  height: 1.15em;\n  position: relative;\n  vertical-align: bottom;\n}\n\n.styles-module__rollingNum___1RKDx {\n  position: absolute;\n  left: 0;\n  top: 0;\n}\n\n.styles-module__exitUp___AFDRW {\n  animation: styles-module__numExitUp___FRQqx 0.25s cubic-bezier(0.32, 0.72, 0, 1) forwards;\n}\n\n.styles-module__enterUp___CPlXb {\n  animation: styles-module__numEnterUp___2Yd-w 0.25s cubic-bezier(0.32, 0.72, 0, 1) forwards;\n}\n\n.styles-module__exitDown___-1yAy {\n  animation: styles-module__numExitDown___xm5by 0.25s cubic-bezier(0.32, 0.72, 0, 1) forwards;\n}\n\n.styles-module__enterDown___DDuFR {\n  animation: styles-module__numEnterDown___hpxBk 0.25s cubic-bezier(0.32, 0.72, 0, 1) forwards;\n}\n\n@keyframes styles-module__numExitUp___FRQqx {\n  from {\n    transform: translateY(0);\n    opacity: 1;\n  }\n  to {\n    transform: translateY(-110%);\n    opacity: 0;\n  }\n}\n@keyframes styles-module__numEnterUp___2Yd-w {\n  from {\n    transform: translateY(110%);\n    opacity: 0;\n  }\n  to {\n    transform: translateY(0);\n    opacity: 1;\n  }\n}\n@keyframes styles-module__numExitDown___xm5by {\n  from {\n    transform: translateY(0);\n    opacity: 1;\n  }\n  to {\n    transform: translateY(110%);\n    opacity: 0;\n  }\n}\n@keyframes styles-module__numEnterDown___hpxBk {\n  from {\n    transform: translateY(-110%);\n    opacity: 0;\n  }\n  to {\n    transform: translateY(0);\n    opacity: 1;\n  }\n}\n.styles-module__rearrangeOverlay___-3R3t {\n  position: fixed;\n  inset: 0;\n  z-index: 99995;\n  pointer-events: none;\n  cursor: default;\n  user-select: none;\n  animation: styles-module__overlayFadeIn___aECVy 0.15s ease;\n}\n\n.styles-module__hoverHighlight___8eT-v {\n  position: fixed;\n  pointer-events: none;\n  z-index: 99994;\n  border: 2px dashed rgba(59, 130, 246, 0.5);\n  border-radius: 4px;\n  background: rgba(59, 130, 246, 0.06);\n  animation: styles-module__highlightFadeIn___Lg7KY 0.12s ease;\n}\n\n.styles-module__sectionOutline___s0hy- {\n  position: fixed;\n  border: 2px solid;\n  border-radius: 4px;\n  cursor: grab;\n}\n.styles-module__sectionOutline___s0hy-:active {\n  cursor: grabbing;\n}\n.styles-module__sectionOutline___s0hy- {\n  transition: box-shadow 0.15s, border-color 0.3s, background-color 0.3s, border-style 0s;\n  user-select: none;\n  pointer-events: auto;\n  animation: styles-module__sectionEnter___-8BXT 0.2s ease;\n}\n.styles-module__sectionOutline___s0hy-:hover {\n  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1), 0 4px 12px rgba(0, 0, 0, 0.15);\n}\n.styles-module__sectionOutline___s0hy-.styles-module__selected___6yrp6 {\n  border-style: solid;\n  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15), 0 2px 8px rgba(59, 130, 246, 0.15);\n}\n.styles-module__sectionOutline___s0hy-.styles-module__selected___6yrp6:hover {\n  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15), 0 2px 8px rgba(59, 130, 246, 0.15);\n}\n.styles-module__sectionOutline___s0hy-.styles-module__settled___b5U5o:not(.styles-module__selected___6yrp6) {\n  border: 1.5px dashed rgba(150, 150, 150, 0.35);\n  background-color: transparent !important;\n  box-shadow: none;\n}\n.styles-module__sectionOutline___s0hy-.styles-module__settled___b5U5o:not(.styles-module__selected___6yrp6):hover {\n  border-color: rgba(150, 150, 150, 0.6);\n  box-shadow: none;\n}\n.styles-module__sectionOutline___s0hy-.styles-module__settled___b5U5o:not(.styles-module__selected___6yrp6) .styles-module__sectionLabel___F80HQ {\n  opacity: 0;\n  transition: opacity 0.15s ease;\n}\n.styles-module__sectionOutline___s0hy-.styles-module__settled___b5U5o:not(.styles-module__selected___6yrp6):hover .styles-module__sectionLabel___F80HQ {\n  opacity: 1;\n}\n.styles-module__sectionOutline___s0hy-.styles-module__settled___b5U5o:not(.styles-module__selected___6yrp6) .styles-module__movedBadge___s8z-q,\n.styles-module__sectionOutline___s0hy-.styles-module__settled___b5U5o:not(.styles-module__selected___6yrp6) .styles-module__sectionDimensions___RcJSL {\n  opacity: 0;\n  transition: opacity 0.15s ease;\n}\n.styles-module__sectionOutline___s0hy-.styles-module__settled___b5U5o:not(.styles-module__selected___6yrp6):hover .styles-module__sectionDimensions___RcJSL {\n  opacity: 1;\n}\n.styles-module__sectionOutline___s0hy-.styles-module__exiting___YrM8F {\n  opacity: 0;\n  transform: scale(0.97);\n  pointer-events: none;\n  animation: none;\n  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.32, 0.72, 0, 1);\n}\n\n.styles-module__sectionLabel___F80HQ {\n  position: absolute;\n  top: 4px;\n  left: 4px;\n  font-size: 10px;\n  font-weight: 600;\n  color: #fff;\n  padding: 2px 8px;\n  border-radius: 4px;\n  white-space: nowrap;\n  pointer-events: none;\n  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);\n  max-width: calc(100% - 8px);\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.styles-module__movedBadge___s8z-q {\n  position: absolute;\n  bottom: 22px;\n  right: 4px;\n  font-size: 9px;\n  font-weight: 700;\n  color: #fff;\n  background: #22c55e;\n  padding: 2px 6px;\n  border-radius: 4px;\n  white-space: nowrap;\n  pointer-events: none;\n  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);\n  opacity: 0;\n  transform: scale(0.8);\n  transition: opacity 0.15s ease, transform 0.15s ease;\n}\n.styles-module__movedBadge___s8z-q.styles-module__badgeVisible___npbdS {\n  opacity: 1;\n  transform: scale(1);\n  transition: opacity 0.2s cubic-bezier(0.34, 1.2, 0.64, 1), transform 0.2s cubic-bezier(0.34, 1.2, 0.64, 1);\n}\n\n.styles-module__resizedBadge___u51V8 {\n  background: #3c82f7;\n  bottom: 40px;\n}\n\n.styles-module__sectionDimensions___RcJSL {\n  position: absolute;\n  bottom: 4px;\n  right: 4px;\n  font-size: 9px;\n  font-weight: 500;\n  color: rgba(255, 255, 255, 0.7);\n  background: rgba(0, 0, 0, 0.5);\n  padding: 1px 5px;\n  border-radius: 3px;\n  white-space: nowrap;\n  pointer-events: none;\n  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n}\n.styles-module__light___ORIft .styles-module__sectionDimensions___RcJSL {\n  color: rgba(0, 0, 0, 0.5);\n  background: rgba(255, 255, 255, 0.7);\n}\n\n.styles-module__wireframeNotice___4GJyB {\n  position: fixed;\n  bottom: 16px;\n  left: 24px;\n  z-index: 99995;\n  font-size: 9.5px;\n  font-weight: 400;\n  color: rgba(0, 0, 0, 0.4);\n  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n  pointer-events: auto;\n  animation: styles-module__overlayFadeIn___aECVy 0.3s ease;\n  line-height: 1.5;\n  max-width: 280px;\n}\n\n.styles-module__wireframeOpacityRow___CJXzi {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin-bottom: 8px;\n}\n\n.styles-module__wireframeOpacityLabel___afkfT {\n  font-size: 9px;\n  font-weight: 500;\n  color: rgba(0, 0, 0, 0.32);\n  letter-spacing: 0.02em;\n  white-space: nowrap;\n  user-select: none;\n}\n\n.styles-module__wireframeOpacitySlider___YcoEs {\n  -webkit-appearance: none;\n  appearance: none;\n  width: 56px;\n  height: 4px;\n  background: rgba(0, 0, 0, 0.08);\n  border-radius: 2px;\n  outline: none;\n  cursor: pointer;\n  flex-shrink: 0;\n  transition: background 0.15s ease;\n}\n.styles-module__wireframeOpacitySlider___YcoEs:hover {\n  background: rgba(0, 0, 0, 0.13);\n}\n.styles-module__wireframeOpacitySlider___YcoEs::-webkit-slider-thumb {\n  -webkit-appearance: none;\n  appearance: none;\n  width: 10px;\n  height: 10px;\n  border-radius: 50%;\n  background: #f97316;\n  cursor: pointer;\n  transition: background 0.15s ease;\n}\n.styles-module__wireframeOpacitySlider___YcoEs::-webkit-slider-thumb:hover {\n  background: #e56b0a;\n}\n.styles-module__wireframeOpacitySlider___YcoEs::-moz-range-thumb {\n  width: 10px;\n  height: 10px;\n  border-radius: 50%;\n  background: #f97316;\n  border: none;\n  cursor: pointer;\n}\n.styles-module__wireframeOpacitySlider___YcoEs::-moz-range-track {\n  background: rgba(0, 0, 0, 0.08);\n  height: 4px;\n  border-radius: 2px;\n}\n\n.styles-module__wireframeNoticeTitleRow___PJqyG {\n  display: flex;\n  align-items: center;\n  gap: 0;\n  margin-bottom: 2px;\n}\n\n.styles-module__wireframeNoticeTitle___okr08 {\n  font-weight: 600;\n  color: rgba(0, 0, 0, 0.55);\n}\n\n.styles-module__wireframeNoticeDivider___PNKQ6 {\n  width: 1px;\n  height: 8px;\n  background: rgba(0, 0, 0, 0.12);\n  margin: 0 8px;\n  flex-shrink: 0;\n}\n\n.styles-module__wireframeStartOver___YFk-I {\n  font-size: 9.5px;\n  font-weight: 500;\n  color: rgba(0, 0, 0, 0.35);\n  cursor: pointer;\n  background: none;\n  border: none;\n  padding: 0;\n  font-family: inherit;\n  text-decoration: none;\n  transition: color 0.12s ease;\n  white-space: nowrap;\n}\n.styles-module__wireframeStartOver___YFk-I:hover {\n  color: rgba(0, 0, 0, 0.6);\n}\n\n.styles-module__ghostOutline___po-kO {\n  position: fixed;\n  border: 1.5px dashed rgba(59, 130, 246, 0.4);\n  border-radius: 4px;\n  background: rgba(59, 130, 246, 0.04);\n  cursor: grab;\n  opacity: 0.5;\n  user-select: none;\n  pointer-events: auto;\n  animation: styles-module__ghostEnter___EC3Mb 0.25s ease;\n  transition: box-shadow 0.15s, border-color 0.3s, opacity 0.25s;\n}\n.styles-module__ghostOutline___po-kO:active {\n  cursor: grabbing;\n}\n.styles-module__ghostOutline___po-kO:hover {\n  opacity: 0.7;\n  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.1), 0 4px 12px rgba(0, 0, 0, 0.08);\n}\n.styles-module__ghostOutline___po-kO.styles-module__selected___6yrp6 {\n  opacity: 1;\n  border-style: solid;\n  border-width: 2px;\n  border-color: #3c82f7;\n  background: rgba(59, 130, 246, 0.08);\n  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15), 0 2px 8px rgba(59, 130, 246, 0.15);\n}\n.styles-module__ghostOutline___po-kO.styles-module__exiting___YrM8F {\n  opacity: 0;\n  transform: scale(0.97);\n  pointer-events: none;\n  animation: none;\n  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.32, 0.72, 0, 1);\n}\n\n.styles-module__ghostBadge___tsQUK {\n  position: absolute;\n  bottom: calc(100% + 4px);\n  left: -1px;\n  font-size: 9px;\n  font-weight: 600;\n  color: rgba(59, 130, 246, 0.9);\n  background: rgba(59, 130, 246, 0.08);\n  border: 1px solid rgba(59, 130, 246, 0.2);\n  padding: 1px 5px;\n  border-radius: 3px;\n  white-space: nowrap;\n  pointer-events: none;\n  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n  letter-spacing: 0.02em;\n  line-height: 1.2;\n  animation: styles-module__badgeSlideIn___typJ7 0.2s ease both;\n}\n\n@keyframes styles-module__badgeSlideIn___typJ7 {\n  from {\n    opacity: 0;\n    transform: translateY(4px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.styles-module__ghostBadgeExtra___6CVoD {\n  display: inline;\n  animation: styles-module__badgeExtraIn___i4W8F 0.2s ease both;\n}\n\n@keyframes styles-module__badgeExtraIn___i4W8F {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n.styles-module__originalOutline___Y6DD1 {\n  position: fixed;\n  border: 1.5px dashed rgba(150, 150, 150, 0.3);\n  border-radius: 4px;\n  background: transparent;\n  pointer-events: none;\n  user-select: none;\n  animation: styles-module__sectionEnter___-8BXT 0.2s ease;\n}\n\n.styles-module__originalLabel___HqI9g {\n  position: absolute;\n  top: 4px;\n  left: 4px;\n  font-size: 9px;\n  font-weight: 500;\n  color: rgba(150, 150, 150, 0.5);\n  padding: 1px 6px;\n  border-radius: 3px;\n  white-space: nowrap;\n  pointer-events: none;\n  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n  background: rgba(150, 150, 150, 0.08);\n}\n\n.styles-module__connectorSvg___Lovld {\n  position: fixed;\n  inset: 0;\n  width: 100vw;\n  height: 100vh;\n  pointer-events: none;\n  z-index: 99996;\n}\n\n.styles-module__connectorLine___XeWh- {\n  transition: opacity 0.2s ease;\n  animation: styles-module__connectorDraw___8sK5I 0.3s ease both;\n}\n\n.styles-module__connectorDot___yvf7C {\n  transform-box: fill-box;\n  transform-origin: center;\n  animation: styles-module__connectorDotIn___NwTUq 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both;\n}\n\n@keyframes styles-module__connectorDraw___8sK5I {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes styles-module__connectorDotIn___NwTUq {\n  from {\n    transform: scale(0);\n    opacity: 0;\n  }\n  to {\n    transform: scale(1);\n    opacity: 1;\n  }\n}\n.styles-module__connectorExiting___2lLOs {\n  animation: styles-module__connectorOut___5QoPl 0.2s ease forwards;\n}\n.styles-module__connectorExiting___2lLOs .styles-module__connectorDot___yvf7C {\n  animation: styles-module__connectorDotOut___FEq7e 0.2s ease forwards;\n}\n\n@keyframes styles-module__connectorOut___5QoPl {\n  from {\n    opacity: 1;\n  }\n  to {\n    opacity: 0;\n  }\n}\n@keyframes styles-module__connectorDotOut___FEq7e {\n  from {\n    transform: scale(1);\n    opacity: 1;\n  }\n  to {\n    transform: scale(0);\n    opacity: 0;\n  }\n}\n@keyframes styles-module__placementEnter___TdRhf {\n  from {\n    opacity: 0;\n    transform: scale(0.85);\n  }\n  to {\n    opacity: 1;\n    transform: scale(1);\n  }\n}\n@keyframes styles-module__sectionEnter___-8BXT {\n  from {\n    opacity: 0;\n    transform: scale(0.96);\n  }\n  to {\n    opacity: 1;\n    transform: scale(1);\n  }\n}\n@keyframes styles-module__highlightFadeIn___Lg7KY {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes styles-module__overlayFadeIn___aECVy {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes styles-module__ghostEnter___EC3Mb {\n  from {\n    opacity: 0;\n    transform: scale(0.96);\n  }\n  to {\n    opacity: 0.6;\n    transform: scale(1);\n  }\n}';
var classNames4 = { "overlayExiting": "styles-module__overlayExiting___iEmYr", "overlay": "styles-module__overlay___aWh-q", "overlayFadeIn": "styles-module__overlayFadeIn___aECVy", "light": "styles-module__light___ORIft", "wireframe": "styles-module__wireframe___itvQU", "placing": "styles-module__placing___45yD8", "passthrough": "styles-module__passthrough___xaFeE", "blankCanvas": "styles-module__blankCanvas___t2Eue", "visible": "styles-module__visible___OKKqX", "gridActive": "styles-module__gridActive___OZ-cf", "paletteHeader": "styles-module__paletteHeader___-Q5gQ", "paletteHeaderTitle": "styles-module__paletteHeaderTitle___oHqZC", "paletteHeaderDesc": "styles-module__paletteHeaderDesc___6i74T", "wireframePurposeWrap": "styles-module__wireframePurposeWrap___To-tS", "collapsed": "styles-module__collapsed___Ms9vS", "wireframePurposeInner": "styles-module__wireframePurposeInner___Lrahs", "wireframePurposeInput": "styles-module__wireframePurposeInput___7EtBN", "canvasToggle": "styles-module__canvasToggle___-QqSy", "active": "styles-module__active___hosp7", "canvasToggleIcon": "styles-module__canvasToggleIcon___7pJ82", "canvasToggleLabel": "styles-module__canvasToggleLabel___OanpY", "canvasPurposeWrap": "styles-module__canvasPurposeWrap___hj6zk", "canvasPurposeInner": "styles-module__canvasPurposeInner___VWiyu", "canvasPurposeToggle": "styles-module__canvasPurposeToggle___byDH2", "canvasPurposeCheck": "styles-module__canvasPurposeCheck___xqd7l", "checked": "styles-module__checked___-1JGH", "canvasPurposeLabel": "styles-module__canvasPurposeLabel___Zu-tD", "canvasPurposeHelp": "styles-module__canvasPurposeHelp___jijwR", "placement": "styles-module__placement___zcxv8", "placementEnter": "styles-module__placementEnter___TdRhf", "selected": "styles-module__selected___6yrp6", "dragging": "styles-module__dragging___le6KZ", "exiting": "styles-module__exiting___YrM8F", "placementContent": "styles-module__placementContent___f64A4", "placementLabel": "styles-module__placementLabel___0KvWl", "placementAnnotation": "styles-module__placementAnnotation___78pTr", "annotationVisible": "styles-module__annotationVisible___mrUyA", "sectionAnnotation": "styles-module__sectionAnnotation___aUIs0", "handle": "styles-module__handle___Ikbxm", "sectionOutline": "styles-module__sectionOutline___s0hy-", "ghostOutline": "styles-module__ghostOutline___po-kO", "handleNw": "styles-module__handleNw___4TMIj", "handleNe": "styles-module__handleNe___mnsTh", "handleSe": "styles-module__handleSe___oSFnk", "handleSw": "styles-module__handleSw___pi--Z", "handleN": "styles-module__handleN___aBA-Q", "handleE": "styles-module__handleE___0hM5u", "handleS": "styles-module__handleS___JjDRv", "handleW": "styles-module__handleW___ERWGQ", "edgeHandle": "styles-module__edgeHandle___XxXdT", "edgeN": "styles-module__edgeN___-JJDj", "edgeS": "styles-module__edgeS___66lMX", "edgeE": "styles-module__edgeE___1bGDa", "edgeW": "styles-module__edgeW___lHQNo", "deleteButton": "styles-module__deleteButton___LkGCb", "rearrangeOverlay": "styles-module__rearrangeOverlay___-3R3t", "drawBox": "styles-module__drawBox___BrVAa", "selectBox": "styles-module__selectBox___Iu8kB", "sizeIndicator": "styles-module__sizeIndicator___7zJ4y", "guideLine": "styles-module__guideLine___DUQY2", "dragPreview": "styles-module__dragPreview___onPbU", "dragPreviewWireframe": "styles-module__dragPreviewWireframe___jsg0G", "palette": "styles-module__palette___C7iSH", "paletteItem": "styles-module__paletteItem___6TlnA", "paletteItemLabel": "styles-module__paletteItemLabel___6ncO4", "paletteSectionTitle": "styles-module__paletteSectionTitle___PqnjX", "paletteFooter": "styles-module__paletteFooter___QYnAG", "enter": "styles-module__enter___6LYk5", "exit": "styles-module__exit___iSGRw", "paletteSection": "styles-module__paletteSection___V8DEA", "paletteItemIcon": "styles-module__paletteItemIcon___0NPQK", "placeScroll": "styles-module__placeScroll___7sClM", "fadeTop": "styles-module__fadeTop___KT9tF", "fadeBottom": "styles-module__fadeBottom___x3ShT", "paletteFooterWrap": "styles-module__paletteFooterWrap___71-fI", "footerHidden": "styles-module__footerHidden___fJUik", "paletteFooterInnerContent": "styles-module__paletteFooterInnerContent___VC26h", "paletteFooterInner": "styles-module__paletteFooterInner___dfylY", "paletteFooterCount": "styles-module__paletteFooterCount___D3Fia", "paletteFooterClear": "styles-module__paletteFooterClear___ybBoa", "paletteFooterActions": "styles-module__paletteFooterActions___fLzv8", "rollingWrap": "styles-module__rollingWrap___S75jM", "rollingNum": "styles-module__rollingNum___1RKDx", "exitUp": "styles-module__exitUp___AFDRW", "numExitUp": "styles-module__numExitUp___FRQqx", "enterUp": "styles-module__enterUp___CPlXb", "numEnterUp": "styles-module__numEnterUp___2Yd-w", "exitDown": "styles-module__exitDown___-1yAy", "numExitDown": "styles-module__numExitDown___xm5by", "enterDown": "styles-module__enterDown___DDuFR", "numEnterDown": "styles-module__numEnterDown___hpxBk", "hoverHighlight": "styles-module__hoverHighlight___8eT-v", "highlightFadeIn": "styles-module__highlightFadeIn___Lg7KY", "sectionEnter": "styles-module__sectionEnter___-8BXT", "settled": "styles-module__settled___b5U5o", "sectionLabel": "styles-module__sectionLabel___F80HQ", "movedBadge": "styles-module__movedBadge___s8z-q", "sectionDimensions": "styles-module__sectionDimensions___RcJSL", "badgeVisible": "styles-module__badgeVisible___npbdS", "resizedBadge": "styles-module__resizedBadge___u51V8", "wireframeNotice": "styles-module__wireframeNotice___4GJyB", "wireframeOpacityRow": "styles-module__wireframeOpacityRow___CJXzi", "wireframeOpacityLabel": "styles-module__wireframeOpacityLabel___afkfT", "wireframeOpacitySlider": "styles-module__wireframeOpacitySlider___YcoEs", "wireframeNoticeTitleRow": "styles-module__wireframeNoticeTitleRow___PJqyG", "wireframeNoticeTitle": "styles-module__wireframeNoticeTitle___okr08", "wireframeNoticeDivider": "styles-module__wireframeNoticeDivider___PNKQ6", "wireframeStartOver": "styles-module__wireframeStartOver___YFk-I", "ghostEnter": "styles-module__ghostEnter___EC3Mb", "ghostBadge": "styles-module__ghostBadge___tsQUK", "badgeSlideIn": "styles-module__badgeSlideIn___typJ7", "ghostBadgeExtra": "styles-module__ghostBadgeExtra___6CVoD", "badgeExtraIn": "styles-module__badgeExtraIn___i4W8F", "originalOutline": "styles-module__originalOutline___Y6DD1", "originalLabel": "styles-module__originalLabel___HqI9g", "connectorSvg": "styles-module__connectorSvg___Lovld", "connectorLine": "styles-module__connectorLine___XeWh-", "connectorDraw": "styles-module__connectorDraw___8sK5I", "connectorDot": "styles-module__connectorDot___yvf7C", "connectorDotIn": "styles-module__connectorDotIn___NwTUq", "connectorExiting": "styles-module__connectorExiting___2lLOs", "connectorOut": "styles-module__connectorOut___5QoPl", "connectorDotOut": "styles-module__connectorDotOut___FEq7e" };
if (typeof document !== "undefined") {
  let style = document.getElementById("feedback-tool-styles-design-mode-styles");
  if (!style) {
    style = document.createElement("style");
    style.id = "feedback-tool-styles-design-mode-styles";
    style.textContent = css4;
    document.head.appendChild(style);
  }
}
var styles_module_default3 = classNames4;
function DesignMode(props) {
  const [selectedIds, setSelectedIds] = createSignal(/* @__PURE__ */ new Set());
  const [drawBox, setDrawBox] = createSignal(null);
  const [selectBox, setSelectBox] = createSignal(null);
  const [sizeIndicator, setSizeIndicator] = createSignal(null);
  const [guides, setGuides] = createSignal([]);
  const [editingId, setEditingId] = createSignal(null);
  const [editExiting, setEditExiting] = createSignal(false);
  const [exitingIds, setExitingIds] = createSignal(/* @__PURE__ */ new Set());
  let lastAnnotationText = /* @__PURE__ */ new Map();
  let deselectRef = props.deselectSignal;
  createEffect(() => {
    if (props.deselectSignal !== deselectRef) {
      deselectRef = props.deselectSignal;
      setSelectedIds(/* @__PURE__ */ new Set());
    }
  });
  let clearRef = props.clearSignal;
  createEffect(() => {
    if (props.clearSignal !== void 0 && props.clearSignal !== clearRef) {
      clearRef = props.clearSignal;
      const allIds = new Set(props.placements.map((p) => p.id));
      if (allIds.size > 0) {
        setExitingIds(allIds);
        setSelectedIds(/* @__PURE__ */ new Set());
        setTimeout(() => {
          props.onChange([]);
          setExitingIds(/* @__PURE__ */ new Set());
        }, 180);
      }
    }
  });
  createEffect(() => {
    const currentSelectedIds = selectedIds();
    const currentActiveComponent = props.activeComponent;
    const currentPlacements = props.placements;
    const handleKeyDown = (e) => {
      const target = e.target;
      const isTyping = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
      if (isTyping) return;
      if ((e.key === "Backspace" || e.key === "Delete") && currentSelectedIds.size > 0) {
        e.preventDefault();
        const toDelete = new Set(currentSelectedIds);
        setExitingIds(toDelete);
        setSelectedIds(/* @__PURE__ */ new Set());
        setTimeout(() => {
          props.onChange(props.placements.filter((p) => !toDelete.has(p.id)));
          setExitingIds(/* @__PURE__ */ new Set());
        }, 180);
        return;
      }
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key) && currentSelectedIds.size > 0) {
        e.preventDefault();
        const step = e.shiftKey ? 20 : 1;
        const dx = e.key === "ArrowLeft" ? -step : e.key === "ArrowRight" ? step : 0;
        const dy = e.key === "ArrowUp" ? -step : e.key === "ArrowDown" ? step : 0;
        props.onChange(currentPlacements.map((p) => currentSelectedIds.has(p.id) ? { ...p, x: Math.max(0, p.x + dx), y: Math.max(0, p.y + dy) } : p));
        return;
      }
      if (e.key === "Escape") {
        if (currentActiveComponent) {
          props.onActiveComponentChange(null);
        } else if (currentSelectedIds.size > 0) {
          setSelectedIds(/* @__PURE__ */ new Set());
        }
        return;
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    onCleanup(() => document.removeEventListener("keydown", handleKeyDown));
  });
  const TEXT_PLACEHOLDERS = { hero: "Headline text", button: "Button label", badge: "Badge label", cta: "Call to action text", toast: "Notification message", modal: "Dialog title", card: "Card title", navigation: "Brand / nav items", tabs: "Tab labels", input: "Placeholder text", search: "Search placeholder", pricing: "Plan name or price", testimonial: "Quote text", alert: "Alert message", banner: "Banner text", tag: "Tag label", notification: "Notification message", stat: "Metric value", productCard: "Product name" };
  const dismissEdit = () => {
    if (!editingId()) return;
    setEditExiting(true);
    setTimeout(() => {
      setEditingId(null);
      setEditExiting(false);
    }, 150);
  };
  createEffect(() => {
    if (props.exiting && editingId()) dismissEdit();
  });
  const submitEdit = (text) => {
    if (!editingId()) return;
    props.onChange(props.placements.map((p) => p.id === editingId() ? { ...p, text: text.trim() || void 0 } : p));
    dismissEdit();
  };
  const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
  const cornerHandles = ["nw", "ne", "se", "sw"];
  const arrowColor = () => props.wireframe ? "#f97316" : "#3c82f7";
  const edgeHandles = () => [{ dir: "n", cls: styles_module_default3.edgeN, arrow: ssr(_tmpl$101, ssrHydrationKey(), ssrAttribute("fill", escape(arrowColor(), true), false)) }, { dir: "e", cls: styles_module_default3.edgeE, arrow: ssr(_tmpl$102, ssrHydrationKey(), ssrAttribute("fill", escape(arrowColor(), true), false)) }, { dir: "s", cls: styles_module_default3.edgeS, arrow: ssr(_tmpl$103, ssrHydrationKey(), ssrAttribute("fill", escape(arrowColor(), true), false)) }, { dir: "w", cls: styles_module_default3.edgeW, arrow: ssr(_tmpl$104, ssrHydrationKey(), ssrAttribute("fill", escape(arrowColor(), true), false)) }];
  return [ssr(_tmpl$105, ssrHydrationKey(), `${escape(styles_module_default3.overlay, true)} ${!props.isDarkMode ? escape(styles_module_default3.light, true) : ""} ${props.activeComponent ? escape(styles_module_default3.placing, true) : ""} ${props.passthrough ? escape(styles_module_default3.passthrough, true) : ""} ${props.exiting ? escape(styles_module_default3.overlayExiting, true) : ""} ${props.wireframe ? escape(styles_module_default3.wireframe, true) : ""}${props.class ? ` ${escape(props.class, true)}` : ""}`, escape(createComponent(For, { get each() {
    return props.placements;
  }, children: (p) => {
    const isSelected = () => selectedIds().has(p.id);
    const label = () => COMPONENT_MAP[p.type]?.label || p.type;
    const screenY = () => p.y - scrollY;
    return ssr(_tmpl$106, ssrHydrationKey() + ssrAttribute("data-design-placement", escape(p.id, true), false), `${escape(styles_module_default3.placement, true)} ${isSelected() ? escape(styles_module_default3.selected, true) : ""} ${exitingIds().has(p.id) ? escape(styles_module_default3.exiting, true) : ""}`, ssrStyleProperty("left:", `${escape(p.x, true)}px`) + ssrStyleProperty(";top:", `${escape(screenY(), true)}px`) + ssrStyleProperty(";width:", `${escape(p.width, true)}px`) + ssrStyleProperty(";height:", `${escape(p.height, true)}px`) + ssrStyleProperty(";position:", "fixed"), ssrAttribute("class", escape(styles_module_default3.placementLabel, true), false), escape(label()), `${escape(styles_module_default3.placementAnnotation, true)} ${p.text ? escape(styles_module_default3.annotationVisible, true) : ""}`, (() => {
      if (p.text) lastAnnotationText.set(p.id, p.text);
      return escape(p.text || lastAnnotationText.get(p.id) || "");
    })(), ssrAttribute("class", escape(styles_module_default3.placementContent, true), false), escape(createComponent(Skeleton, { get type() {
      return p.type;
    }, get width() {
      return p.width;
    }, get height() {
      return p.height;
    }, get text() {
      return p.text;
    } })), ssrAttribute("class", escape(styles_module_default3.deleteButton, true), false), escape(createComponent(For, { each: cornerHandles, children: (dir) => ssr(_tmpl$107, ssrHydrationKey(), `${escape(styles_module_default3.handle, true)} ${escape(styles_module_default3[`handle${dir.charAt(0).toUpperCase()}${dir.slice(1)}`], true)}`) })), escape(createComponent(For, { get each() {
      return edgeHandles();
    }, children: (edge) => ssr(_tmpl$108, ssrHydrationKey(), `${escape(styles_module_default3.edgeHandle, true)} ${escape(edge.cls, true)}`, escape(edge.arrow)) })));
  } }))), createComponent(Show$1, { get when() {
    return editingId();
  }, get children() {
    return (() => {
      const ep = () => props.placements.find((p) => p.id === editingId());
      return createComponent(Show$1, { get when() {
        return ep();
      }, children: (epVal) => {
        const ey = () => epVal().y - scrollY;
        const centerX = () => epVal().x + epVal().width / 2;
        const aboveY = () => ey() - 8;
        const belowY = () => ey() + epVal().height + 8;
        const fitsAbove = () => aboveY() > 200;
        const fitsBelow = () => belowY() < window.innerHeight - 100;
        const popupLeft = () => Math.max(160, Math.min(window.innerWidth - 160, centerX()));
        const popupStyle = () => {
          if (fitsAbove()) {
            return { left: `${popupLeft()}px`, bottom: `${window.innerHeight - aboveY()}px` };
          } else if (fitsBelow()) {
            return { left: `${popupLeft()}px`, top: `${belowY()}px` };
          } else {
            return { left: `${popupLeft()}px`, top: `${Math.max(80, window.innerHeight / 2 - 80)}px` };
          }
        };
        return createComponent(AnnotationPopupCSS, { get element() {
          return COMPONENT_MAP[epVal().type]?.label || epVal().type;
        }, get placeholder() {
          return TEXT_PLACEHOLDERS[epVal().type] || "Label or content text";
        }, get initialValue() {
          return epVal().text ?? "";
        }, submitLabel: "Set", onSubmit: submitEdit, onCancel: dismissEdit, onDelete: void 0, get isExiting() {
          return editExiting();
        }, get lightMode() {
          return !props.isDarkMode;
        }, get style() {
          return popupStyle();
        } });
      } });
    })();
  } }), createComponent(Show$1, { get when() {
    return drawBox();
  }, children: (db) => ssr(_tmpl$109, ssrHydrationKey() + ssrAttribute("class", escape(styles_module_default3.drawBox, true), false), ssrStyleProperty("left:", `${escape(db().x, true)}px`) + ssrStyleProperty(";top:", `${escape(db().y, true)}px`) + ssrStyleProperty(";width:", `${escape(db().w, true)}px`) + ssrStyleProperty(";height:", `${escape(db().h, true)}px`)) }), createComponent(Show$1, { get when() {
    return selectBox();
  }, children: (sb) => ssr(_tmpl$109, ssrHydrationKey() + ssrAttribute("class", escape(styles_module_default3.selectBox, true), false), ssrStyleProperty("left:", `${escape(sb().x, true)}px`) + ssrStyleProperty(";top:", `${escape(sb().y, true)}px`) + ssrStyleProperty(";width:", `${escape(sb().w, true)}px`) + ssrStyleProperty(";height:", `${escape(sb().h, true)}px`)) }), createComponent(Show$1, { get when() {
    return sizeIndicator();
  }, children: (si) => ssr(_tmpl$110, ssrHydrationKey() + ssrAttribute("class", escape(styles_module_default3.sizeIndicator, true), false), ssrStyleProperty("left:", `${escape(si().x, true)}px`) + ssrStyleProperty(";top:", `${escape(si().y, true)}px`), escape(si().text)) }), createComponent(For, { get each() {
    return guides();
  }, children: (g) => ssr(_tmpl$109, ssrHydrationKey() + ssrAttribute("class", escape(styles_module_default3.guideLine, true), false), ssrStyle(g.axis === "x" ? { position: "fixed", left: `${g.pos}px`, top: "0", width: "1px", bottom: "0" } : { position: "fixed", left: "0", top: `${g.pos - scrollY}px`, right: "0", height: "1px" })) })];
}
function scrollFadeClass(el) {
  if (!el) return "";
  const top = el.scrollTop > 2;
  const bottom = el.scrollTop + el.clientHeight < el.scrollHeight - 2;
  return `${top ? styles_module_default3.fadeTop : ""} ${bottom ? styles_module_default3.fadeBottom : ""}`;
}
function PaletteIconSvg(props) {
  switch (props.type) {
    case "navigation":
      return ssr(_tmpl$111, ssrHydrationKey());
    case "header":
      return ssr(_tmpl$112, ssrHydrationKey());
    case "hero":
      return ssr(_tmpl$113, ssrHydrationKey());
    case "section":
      return ssr(_tmpl$114, ssrHydrationKey());
    case "sidebar":
      return ssr(_tmpl$115, ssrHydrationKey());
    case "footer":
      return ssr(_tmpl$116, ssrHydrationKey());
    case "modal":
      return ssr(_tmpl$117, ssrHydrationKey());
    case "divider":
      return ssr(_tmpl$118, ssrHydrationKey());
    case "card":
      return ssr(_tmpl$119, ssrHydrationKey());
    case "text":
      return ssr(_tmpl$120, ssrHydrationKey());
    case "image":
      return ssr(_tmpl$121, ssrHydrationKey());
    case "video":
      return ssr(_tmpl$122, ssrHydrationKey());
    case "table":
      return ssr(_tmpl$123, ssrHydrationKey());
    case "grid":
      return ssr(_tmpl$124, ssrHydrationKey());
    case "list":
      return ssr(_tmpl$125, ssrHydrationKey());
    case "chart":
      return ssr(_tmpl$126, ssrHydrationKey());
    case "accordion":
      return ssr(_tmpl$127, ssrHydrationKey());
    case "carousel":
      return ssr(_tmpl$128, ssrHydrationKey());
    case "button":
      return ssr(_tmpl$129, ssrHydrationKey());
    case "input":
      return ssr(_tmpl$130, ssrHydrationKey());
    case "search":
      return ssr(_tmpl$131, ssrHydrationKey());
    case "form":
      return ssr(_tmpl$132, ssrHydrationKey());
    case "tabs":
      return ssr(_tmpl$133, ssrHydrationKey());
    case "dropdown":
      return ssr(_tmpl$134, ssrHydrationKey());
    case "toggle":
      return ssr(_tmpl$135, ssrHydrationKey());
    case "avatar":
      return ssr(_tmpl$136, ssrHydrationKey());
    case "badge":
      return ssr(_tmpl$137, ssrHydrationKey());
    case "breadcrumb":
      return ssr(_tmpl$138, ssrHydrationKey());
    case "pagination":
      return ssr(_tmpl$139, ssrHydrationKey());
    case "progress":
      return ssr(_tmpl$140, ssrHydrationKey());
    case "toast":
      return ssr(_tmpl$141, ssrHydrationKey());
    case "tooltip":
      return ssr(_tmpl$142, ssrHydrationKey());
    case "pricing":
      return ssr(_tmpl$143, ssrHydrationKey());
    case "testimonial":
      return ssr(_tmpl$144, ssrHydrationKey());
    case "cta":
      return ssr(_tmpl$145, ssrHydrationKey());
    case "alert":
      return ssr(_tmpl$146, ssrHydrationKey());
    case "banner":
      return ssr(_tmpl$147, ssrHydrationKey());
    case "stat":
      return ssr(_tmpl$148, ssrHydrationKey());
    case "stepper":
      return ssr(_tmpl$149, ssrHydrationKey());
    case "tag":
      return ssr(_tmpl$150, ssrHydrationKey());
    case "rating":
      return ssr(_tmpl$151, ssrHydrationKey());
    case "map":
      return ssr(_tmpl$152, ssrHydrationKey());
    case "timeline":
      return ssr(_tmpl$153, ssrHydrationKey());
    case "fileUpload":
      return ssr(_tmpl$154, ssrHydrationKey());
    case "codeBlock":
      return ssr(_tmpl$155, ssrHydrationKey());
    case "calendar":
      return ssr(_tmpl$156, ssrHydrationKey());
    case "notification":
      return ssr(_tmpl$157, ssrHydrationKey());
    case "productCard":
      return ssr(_tmpl$158, ssrHydrationKey());
    case "profile":
      return ssr(_tmpl$159, ssrHydrationKey());
    case "drawer":
      return ssr(_tmpl$160, ssrHydrationKey());
    case "popover":
      return ssr(_tmpl$161, ssrHydrationKey());
    case "logo":
      return ssr(_tmpl$162, ssrHydrationKey());
    case "faq":
      return ssr(_tmpl$163, ssrHydrationKey());
    case "gallery":
      return ssr(_tmpl$164, ssrHydrationKey());
    case "checkbox":
      return ssr(_tmpl$165, ssrHydrationKey());
    case "radio":
      return ssr(_tmpl$166, ssrHydrationKey());
    case "slider":
      return ssr(_tmpl$167, ssrHydrationKey());
    case "datePicker":
      return ssr(_tmpl$168, ssrHydrationKey());
    case "skeleton":
      return ssr(_tmpl$169, ssrHydrationKey());
    case "chip":
      return ssr(_tmpl$170, ssrHydrationKey());
    case "icon":
      return ssr(_tmpl$171, ssrHydrationKey());
    case "spinner":
      return ssr(_tmpl$172, ssrHydrationKey());
    case "feature":
      return ssr(_tmpl$173, ssrHydrationKey());
    case "team":
      return ssr(_tmpl$174, ssrHydrationKey());
    case "login":
      return ssr(_tmpl$175, ssrHydrationKey());
    case "contact":
      return ssr(_tmpl$176, ssrHydrationKey());
    default:
      return null;
  }
}
function ComponentGrid(props) {
  return ssr(_tmpl$108, ssrHydrationKey(), `${escape(styles_module_default3.placeScroll, true)} ${escape(props.fadeClass || "", true)}`, escape(createComponent(For, { each: COMPONENT_REGISTRY, children: (section) => ssr(_tmpl$177, ssrHydrationKey() + ssrAttribute("class", escape(styles_module_default3.paletteSection, true), false), ssrAttribute("class", escape(styles_module_default3.paletteSectionTitle, true), false), escape(section.section), escape(createComponent(For, { get each() {
    return section.items;
  }, children: (item) => ssr(_tmpl$178, ssrHydrationKey(), `${escape(styles_module_default3.paletteItem, true)} ${props.activeType === item.type ? escape(styles_module_default3.active, true) : ""} ${props.blankCanvas ? escape(styles_module_default3.wireframe, true) : ""}`, ssrAttribute("class", escape(styles_module_default3.paletteItemIcon, true), false), escape(createComponent(PaletteIconSvg, { get type() {
    return item.type;
  } })), ssrAttribute("class", escape(styles_module_default3.paletteItemLabel, true), false), escape(item.label)) }))) })));
}
function RollingCount(props) {
  const [prev, setPrev] = createSignal(null);
  const [prevSuffix, setPrevSuffix] = createSignal(props.suffix);
  const [dir, setDir] = createSignal("up");
  let cur = props.value;
  let curSuffix = props.suffix;
  let timer;
  const suffixChanged = () => prev() !== null && prevSuffix() !== props.suffix;
  createEffect(() => {
    const value = props.value;
    const suffix = props.suffix;
    if (value !== cur) {
      if (value === 0) {
        cur = value;
        curSuffix = suffix;
        setPrev(null);
        return;
      }
      setDir(value > cur ? "up" : "down");
      setPrev(cur);
      setPrevSuffix(curSuffix);
      cur = value;
      curSuffix = suffix;
      clearTimeout(timer);
      timer = setTimeout(() => setPrev(null), 250);
    } else {
      curSuffix = suffix;
    }
  });
  return createComponent(Show$1, { get when() {
    return prev() !== null;
  }, get fallback() {
    return [props.value, props.suffix ? ` ${props.suffix}` : ""];
  }, get children() {
    return createComponent(Show$1, { get when() {
      return suffixChanged();
    }, get fallback() {
      return [ssr(_tmpl$180, ssrHydrationKey() + ssrAttribute("class", escape(styles_module_default3.rollingWrap, true), false), ssrStyleProperty("visibility:", "hidden"), escape(props.value), `${escape(styles_module_default3.rollingNum, true)} ${dir() === "up" ? escape(styles_module_default3.exitUp, true) : escape(styles_module_default3.exitDown, true)}`, escape(prev()), `${escape(styles_module_default3.rollingNum, true)} ${dir() === "up" ? escape(styles_module_default3.enterUp, true) : escape(styles_module_default3.enterDown, true)}`, escape(props.value)), props.suffix ? ` ${props.suffix}` : ""];
    }, get children() {
      return ssr(_tmpl$179, ssrHydrationKey() + ssrAttribute("class", escape(styles_module_default3.rollingWrap, true), false), ssrStyleProperty("visibility:", "hidden"), escape(props.value), escape(props.suffix), `${escape(styles_module_default3.rollingNum, true)} ${dir() === "up" ? escape(styles_module_default3.exitUp, true) : escape(styles_module_default3.exitDown, true)}`, escape(prev()), escape(prevSuffix()), `${escape(styles_module_default3.rollingNum, true)} ${dir() === "up" ? escape(styles_module_default3.enterUp, true) : escape(styles_module_default3.enterDown, true)}`, escape(props.value), escape(props.suffix));
    } });
  } });
}
function DesignPalette(props) {
  const [mounted, setMounted] = createSignal(false);
  const [animClass, setAnimClass] = createSignal("exit");
  const [footerVisible, setFooterVisible] = createSignal(false);
  const [footerCollapsed, setFooterCollapsed] = createSignal(true);
  let lastFooterCount = 0;
  let lastFooterSuffix = "";
  let rafRef = 0;
  let exitTimerRef;
  let placeScrollRef;
  const [placeFade, setPlaceFade] = createSignal("");
  createEffect(() => {
    if (props.visible) {
      setMounted(true);
      clearTimeout(exitTimerRef);
      cancelAnimationFrame(rafRef);
      rafRef = requestAnimationFrame(() => {
        rafRef = requestAnimationFrame(() => {
          setAnimClass("enter");
        });
      });
    } else {
      cancelAnimationFrame(rafRef);
      setAnimClass("exit");
      clearTimeout(exitTimerRef);
      exitTimerRef = setTimeout(() => {
        setMounted(false);
        props.onExited?.();
      }, 200);
    }
    onCleanup(() => cancelAnimationFrame(rafRef));
  });
  createEffect(() => {
    const hasFooterContent = props.placementCount > 0 || props.sectionCount > 0;
    const totalCount = props.placementCount + props.sectionCount;
    if (totalCount > 0) {
      lastFooterCount = totalCount;
      lastFooterSuffix = props.blankCanvas ? totalCount === 1 ? "Component" : "Components" : totalCount === 1 ? "Change" : "Changes";
    }
    if (hasFooterContent) {
      if (!footerVisible()) {
        setFooterCollapsed(true);
        setFooterVisible(true);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setFooterCollapsed(false);
          });
        });
      } else {
        setFooterCollapsed(false);
      }
    } else {
      setFooterCollapsed(true);
      const t = setTimeout(() => setFooterVisible(false), 300);
      onCleanup(() => clearTimeout(t));
    }
  });
  createEffect(() => {
    if (!mounted()) return;
    const el = placeScrollRef;
    if (!el) return;
    const update = () => setPlaceFade(scrollFadeClass(el));
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    onCleanup(() => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    });
  });
  return createComponent(Show$1, { get when() {
    return mounted();
  }, get children() {
    return ssr(_tmpl$182, ssrHydrationKey(), `${escape(styles_module_default3.palette, true)} ${escape(styles_module_default3[animClass()], true)} ${!props.isDarkMode ? escape(styles_module_default3.light, true) : ""}`, ssrAttribute("class", escape(styles_module_default3.paletteHeader, true), false), ssrAttribute("class", escape(styles_module_default3.paletteHeaderTitle, true), false), ssrAttribute("class", escape(styles_module_default3.paletteHeaderDesc, true), false), `${escape(styles_module_default3.canvasToggle, true)} ${props.blankCanvas ? escape(styles_module_default3.active, true) : ""}`, ssrAttribute("class", escape(styles_module_default3.canvasToggleIcon, true), false), ssrAttribute("class", escape(styles_module_default3.canvasToggleLabel, true), false), `${escape(styles_module_default3.wireframePurposeWrap, true)} ${!props.blankCanvas ? escape(styles_module_default3.collapsed, true) : ""}`, ssrAttribute("class", escape(styles_module_default3.wireframePurposeInner, true), false), ssrAttribute("class", escape(styles_module_default3.wireframePurposeInput, true), false), ssrAttribute("value", escape(props.wireframePurpose, true), false), escape(createComponent(ComponentGrid, { get activeType() {
      return props.activeType;
    }, get onSelect() {
      return props.onSelect;
    }, get onDragStart() {
      return props.onDragStart;
    }, scrollRef: (el) => placeScrollRef = el, get fadeClass() {
      return placeFade();
    }, get blankCanvas() {
      return props.blankCanvas;
    } })), escape(createComponent(Show$1, { get when() {
      return footerVisible();
    }, get children() {
      return ssr(_tmpl$181, ssrHydrationKey(), `${escape(styles_module_default3.paletteFooterWrap, true)} ${footerCollapsed() ? escape(styles_module_default3.footerHidden, true) : ""}`, ssrAttribute("class", escape(styles_module_default3.paletteFooterInner, true), false), ssrAttribute("class", escape(styles_module_default3.paletteFooterInnerContent, true), false), ssrAttribute("class", escape(styles_module_default3.paletteFooter, true), false), ssrAttribute("class", escape(styles_module_default3.paletteFooterCount, true), false), escape(createComponent(RollingCount, { value: lastFooterCount, suffix: lastFooterSuffix })), ssrAttribute("class", escape(styles_module_default3.paletteFooterClear, true), false));
    } })));
  } });
}
function getParentElement(element) {
  if (element.parentElement) {
    return element.parentElement;
  }
  const root = element.getRootNode();
  if (root instanceof ShadowRoot) {
    return root.host;
  }
  return null;
}
function closestCrossingShadow(element, selector) {
  let current = element;
  while (current) {
    if (current.matches(selector)) return current;
    current = getParentElement(current);
  }
  return null;
}
function getElementPath(target, maxDepth = 4) {
  const parts = [];
  let current = target;
  let depth = 0;
  while (current && depth < maxDepth) {
    const tag = current.tagName.toLowerCase();
    if (tag === "html" || tag === "body") break;
    let identifier = tag;
    if (current.id) {
      identifier = `#${current.id}`;
    } else if (current.className && typeof current.className === "string") {
      const meaningfulClass = current.className.split(/\s+/).find((c) => c.length > 2 && !c.match(/^[a-z]{1,2}$/) && !c.match(/[A-Z0-9]{5,}/));
      if (meaningfulClass) {
        identifier = `.${meaningfulClass.split("_")[0]}`;
      }
    }
    const nextParent = getParentElement(current);
    if (!current.parentElement && nextParent) {
      identifier = `⟨shadow⟩ ${identifier}`;
    }
    parts.unshift(identifier);
    current = nextParent;
    depth++;
  }
  return parts.join(" > ");
}
function identifyElement(target) {
  const path = getElementPath(target);
  if (target.dataset.element) {
    return { name: target.dataset.element, path };
  }
  const tag = target.tagName.toLowerCase();
  if (["path", "circle", "rect", "line", "g"].includes(tag)) {
    const svg = closestCrossingShadow(target, "svg");
    if (svg) {
      const parent = getParentElement(svg);
      if (parent instanceof HTMLElement) {
        const parentName = identifyElement(parent).name;
        return { name: `graphic in ${parentName}`, path };
      }
    }
    return { name: "graphic element", path };
  }
  if (tag === "svg") {
    const parent = getParentElement(target);
    if (parent?.tagName.toLowerCase() === "button") {
      const btnText = parent.textContent?.trim();
      return { name: btnText ? `icon in "${btnText}" button` : "button icon", path };
    }
    return { name: "icon", path };
  }
  if (tag === "button") {
    const text = target.textContent?.trim();
    const ariaLabel = target.getAttribute("aria-label");
    if (ariaLabel) return { name: `button [${ariaLabel}]`, path };
    return { name: text ? `button "${text.slice(0, 25)}"` : "button", path };
  }
  if (tag === "a") {
    const text = target.textContent?.trim();
    const href = target.getAttribute("href");
    if (text) return { name: `link "${text.slice(0, 25)}"`, path };
    if (href) return { name: `link to ${href.slice(0, 30)}`, path };
    return { name: "link", path };
  }
  if (tag === "input") {
    const type = target.getAttribute("type") || "text";
    const placeholder = target.getAttribute("placeholder");
    const name = target.getAttribute("name");
    if (placeholder) return { name: `input "${placeholder}"`, path };
    if (name) return { name: `input [${name}]`, path };
    return { name: `${type} input`, path };
  }
  if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(tag)) {
    const text = target.textContent?.trim();
    return { name: text ? `${tag} "${text.slice(0, 35)}"` : tag, path };
  }
  if (tag === "p") {
    const text = target.textContent?.trim();
    if (text) return { name: `paragraph: "${text.slice(0, 40)}${text.length > 40 ? "..." : ""}"`, path };
    return { name: "paragraph", path };
  }
  if (tag === "span" || tag === "label") {
    const text = target.textContent?.trim();
    if (text && text.length < 40) return { name: `"${text}"`, path };
    return { name: tag, path };
  }
  if (tag === "li") {
    const text = target.textContent?.trim();
    if (text && text.length < 40) return { name: `list item: "${text.slice(0, 35)}"`, path };
    return { name: "list item", path };
  }
  if (tag === "blockquote") return { name: "blockquote", path };
  if (tag === "code") {
    const text = target.textContent?.trim();
    if (text && text.length < 30) return { name: `code: \`${text}\``, path };
    return { name: "code", path };
  }
  if (tag === "pre") return { name: "code block", path };
  if (tag === "img") {
    const alt = target.getAttribute("alt");
    return { name: alt ? `image "${alt.slice(0, 30)}"` : "image", path };
  }
  if (tag === "video") return { name: "video", path };
  if (["div", "section", "article", "nav", "header", "footer", "aside", "main"].includes(tag)) {
    const className = target.className;
    const role = target.getAttribute("role");
    const ariaLabel = target.getAttribute("aria-label");
    if (ariaLabel) return { name: `${tag} [${ariaLabel}]`, path };
    if (role) return { name: `${role}`, path };
    if (typeof className === "string" && className) {
      const words = className.split(/[\s_-]+/).map((c) => c.replace(/[A-Z0-9]{5,}.*$/, "")).filter((c) => c.length > 2 && !/^[a-z]{1,2}$/.test(c)).slice(0, 2);
      if (words.length > 0) return { name: words.join(" "), path };
    }
    return { name: tag === "div" ? "container" : tag, path };
  }
  return { name: tag, path };
}
function getNearbyText(element) {
  const texts = [];
  const ownText = element.textContent?.trim();
  if (ownText && ownText.length < 100) {
    texts.push(ownText);
  }
  const prev = element.previousElementSibling;
  if (prev) {
    const prevText = prev.textContent?.trim();
    if (prevText && prevText.length < 50) {
      texts.unshift(`[before: "${prevText.slice(0, 40)}"]`);
    }
  }
  const next = element.nextElementSibling;
  if (next) {
    const nextText = next.textContent?.trim();
    if (nextText && nextText.length < 50) {
      texts.push(`[after: "${nextText.slice(0, 40)}"]`);
    }
  }
  return texts.join(" ");
}
function getNearbyElements(element) {
  const parent = getParentElement(element);
  if (!parent) return "";
  const elementRoot = element.getRootNode();
  const children = elementRoot instanceof ShadowRoot && element.parentElement ? Array.from(element.parentElement.children) : Array.from(parent.children);
  const siblings = children.filter((child) => child !== element && child instanceof HTMLElement);
  if (siblings.length === 0) return "";
  const siblingIds = siblings.slice(0, 4).map((sib) => {
    const tag = sib.tagName.toLowerCase();
    const className = sib.className;
    let cls = "";
    if (typeof className === "string" && className) {
      const meaningful = className.split(/\s+/).map((c) => c.replace(/[_][a-zA-Z0-9]{5,}.*$/, "")).find((c) => c.length > 2 && !/^[a-z]{1,2}$/.test(c));
      if (meaningful) cls = `.${meaningful}`;
    }
    if (tag === "button" || tag === "a") {
      const text = sib.textContent?.trim().slice(0, 15);
      if (text) return `${tag}${cls} "${text}"`;
    }
    return `${tag}${cls}`;
  });
  const parentTag = parent.tagName.toLowerCase();
  let parentId = parentTag;
  if (typeof parent.className === "string" && parent.className) {
    const parentCls = parent.className.split(/\s+/).map((c) => c.replace(/[_][a-zA-Z0-9]{5,}.*$/, "")).find((c) => c.length > 2 && !/^[a-z]{1,2}$/.test(c));
    if (parentCls) parentId = `.${parentCls}`;
  }
  const total = parent.children.length;
  const suffix = total > siblingIds.length + 1 ? ` (${total} total in ${parentId})` : "";
  return siblingIds.join(", ") + suffix;
}
function getElementClasses(target) {
  const className = target.className;
  if (typeof className !== "string" || !className) return "";
  const classes = className.split(/\s+/).filter((c) => c.length > 0).map((c) => {
    const match = c.match(/^([a-zA-Z][a-zA-Z0-9_-]*?)(?:_[a-zA-Z0-9]{5,})?$/);
    return match ? match[1] : c;
  }).filter((c, i, arr) => arr.indexOf(c) === i);
  return classes.join(", ");
}
var DEFAULT_STYLE_VALUES = /* @__PURE__ */ new Set(["none", "normal", "auto", "0px", "rgba(0, 0, 0, 0)", "transparent", "static", "visible"]);
var TEXT_ELEMENTS = /* @__PURE__ */ new Set(["p", "span", "h1", "h2", "h3", "h4", "h5", "h6", "label", "li", "td", "th", "blockquote", "figcaption", "caption", "legend", "dt", "dd", "pre", "code", "em", "strong", "b", "i", "a", "time", "cite", "q"]);
var FORM_INPUT_ELEMENTS = /* @__PURE__ */ new Set(["input", "textarea", "select"]);
var MEDIA_ELEMENTS = /* @__PURE__ */ new Set(["img", "video", "canvas", "svg"]);
var CONTAINER_ELEMENTS = /* @__PURE__ */ new Set(["div", "section", "article", "nav", "header", "footer", "aside", "main", "ul", "ol", "form", "fieldset"]);
function getDetailedComputedStyles(target) {
  if (typeof window === "undefined") return {};
  const styles = window.getComputedStyle(target);
  const result = {};
  const tag = target.tagName.toLowerCase();
  let properties;
  if (TEXT_ELEMENTS.has(tag)) {
    properties = ["color", "fontSize", "fontWeight", "fontFamily", "lineHeight"];
  } else if (tag === "button" || tag === "a" && target.getAttribute("role") === "button") {
    properties = ["backgroundColor", "color", "padding", "borderRadius", "fontSize"];
  } else if (FORM_INPUT_ELEMENTS.has(tag)) {
    properties = ["backgroundColor", "color", "padding", "borderRadius", "fontSize"];
  } else if (MEDIA_ELEMENTS.has(tag)) {
    properties = ["width", "height", "objectFit", "borderRadius"];
  } else if (CONTAINER_ELEMENTS.has(tag)) {
    properties = ["display", "padding", "margin", "gap", "backgroundColor"];
  } else {
    properties = ["color", "fontSize", "margin", "padding", "backgroundColor"];
  }
  for (const prop of properties) {
    const cssPropertyName = prop.replace(/([A-Z])/g, "-$1").toLowerCase();
    const value = styles.getPropertyValue(cssPropertyName);
    if (value && !DEFAULT_STYLE_VALUES.has(value)) {
      result[prop] = value;
    }
  }
  return result;
}
var FORENSIC_PROPERTIES = [
  // Colors
  "color",
  "backgroundColor",
  "borderColor",
  // Typography
  "fontSize",
  "fontWeight",
  "fontFamily",
  "lineHeight",
  "letterSpacing",
  "textAlign",
  // Box model
  "width",
  "height",
  "padding",
  "margin",
  "border",
  "borderRadius",
  // Layout & positioning
  "display",
  "position",
  "top",
  "right",
  "bottom",
  "left",
  "zIndex",
  "flexDirection",
  "justifyContent",
  "alignItems",
  "gap",
  // Visual effects
  "opacity",
  "visibility",
  "overflow",
  "boxShadow",
  // Transform
  "transform"
];
function getForensicComputedStyles(target) {
  if (typeof window === "undefined") return "";
  const styles = window.getComputedStyle(target);
  const parts = [];
  for (const prop of FORENSIC_PROPERTIES) {
    const cssPropertyName = prop.replace(/([A-Z])/g, "-$1").toLowerCase();
    const value = styles.getPropertyValue(cssPropertyName);
    if (value && !DEFAULT_STYLE_VALUES.has(value)) {
      parts.push(`${cssPropertyName}: ${value}`);
    }
  }
  return parts.join("; ");
}
function parseComputedStylesString(stylesStr) {
  if (!stylesStr) return void 0;
  const result = {};
  const parts = stylesStr.split(";").map((p) => p.trim()).filter(Boolean);
  for (const part of parts) {
    const colonIndex = part.indexOf(":");
    if (colonIndex > 0) {
      const key = part.slice(0, colonIndex).trim();
      const value = part.slice(colonIndex + 1).trim();
      if (key && value) {
        result[key] = value;
      }
    }
  }
  return Object.keys(result).length > 0 ? result : void 0;
}
function getAccessibilityInfo(target) {
  const parts = [];
  const role = target.getAttribute("role");
  const ariaLabel = target.getAttribute("aria-label");
  const ariaDescribedBy = target.getAttribute("aria-describedby");
  const tabIndex = target.getAttribute("tabindex");
  const ariaHidden = target.getAttribute("aria-hidden");
  if (role) parts.push(`role="${role}"`);
  if (ariaLabel) parts.push(`aria-label="${ariaLabel}"`);
  if (ariaDescribedBy) parts.push(`aria-describedby="${ariaDescribedBy}"`);
  if (tabIndex) parts.push(`tabindex=${tabIndex}`);
  if (ariaHidden === "true") parts.push("aria-hidden");
  const focusable = target.matches("a, button, input, select, textarea, [tabindex]");
  if (focusable) parts.push("focusable");
  return parts.join(", ");
}
function getFullElementPath(target) {
  const parts = [];
  let current = target;
  while (current && current.tagName.toLowerCase() !== "html") {
    const tag = current.tagName.toLowerCase();
    let identifier = tag;
    if (current.id) {
      identifier = `${tag}#${current.id}`;
    } else if (current.className && typeof current.className === "string") {
      const cls = current.className.split(/\s+/).map((c) => c.replace(/[_][a-zA-Z0-9]{5,}.*$/, "")).find((c) => c.length > 2);
      if (cls) identifier = `${tag}.${cls}`;
    }
    const nextParent = getParentElement(current);
    if (!current.parentElement && nextParent) {
      identifier = `⟨shadow⟩ ${identifier}`;
    }
    parts.unshift(identifier);
    current = nextParent;
  }
  return parts.join(" > ");
}
var SECTION_TAGS = /* @__PURE__ */ new Set(["nav", "header", "main", "section", "article", "footer", "aside"]);
var SECTION_ROLES = { banner: "Header", navigation: "Navigation", main: "Main Content", contentinfo: "Footer", complementary: "Sidebar", region: "Section" };
var TAG_LABELS = { nav: "Navigation", header: "Header", main: "Main Content", section: "Section", article: "Article", footer: "Footer", aside: "Sidebar" };
var SKIP_TAGS = /* @__PURE__ */ new Set(["script", "style", "noscript", "link", "meta"]);
var MIN_SECTION_HEIGHT = 40;
function isEffectivelyFixed(el) {
  let current = el;
  while (current && current !== document.body && current !== document.documentElement) {
    const pos = window.getComputedStyle(current).position;
    if (pos === "fixed" || pos === "sticky") return true;
    current = current.parentElement;
  }
  return false;
}
function generateSelector(el) {
  const tag = el.tagName.toLowerCase();
  if (["nav", "header", "footer", "main"].includes(tag)) {
    if (document.querySelectorAll(tag).length === 1) {
      return tag;
    }
  }
  if (el.id) {
    return `#${CSS.escape(el.id)}`;
  }
  if (el.className && typeof el.className === "string") {
    const classes = el.className.split(/\s+/).filter((c) => c.length > 0);
    const meaningful = classes.find((c) => c.length > 2 && !/^[a-zA-Z0-9]{6,}$/.test(c) && !/^[a-z]{1,2}$/.test(c));
    if (meaningful) {
      const selector = `${tag}.${CSS.escape(meaningful)}`;
      if (document.querySelectorAll(selector).length === 1) {
        return selector;
      }
    }
  }
  const parent = el.parentElement;
  if (parent) {
    const children = Array.from(parent.children);
    const index = children.indexOf(el) + 1;
    const parentSelector = parent === document.body ? "body" : generateSelector(parent);
    return `${parentSelector} > ${tag}:nth-child(${index})`;
  }
  return tag;
}
function labelSection(el) {
  const tag = el.tagName.toLowerCase();
  const ariaLabel = el.getAttribute("aria-label");
  if (ariaLabel) return ariaLabel;
  const role = el.getAttribute("role");
  if (role && SECTION_ROLES[role]) return SECTION_ROLES[role];
  if (TAG_LABELS[tag]) return TAG_LABELS[tag];
  const heading = el.querySelector("h1, h2, h3, h4, h5, h6");
  if (heading) {
    const text = heading.textContent?.trim();
    if (text && text.length <= 50) return text;
    if (text) return text.slice(0, 47) + "...";
  }
  const { name } = identifyElement(el);
  return name.charAt(0).toUpperCase() + name.slice(1);
}
function getCleanClassName(el) {
  const className = el.className;
  if (typeof className !== "string" || !className) return null;
  const meaningful = className.split(/\s+/).map((c) => c.replace(/[_][a-zA-Z0-9]{5,}.*$/, "")).find((c) => c.length > 2 && !/^[a-z]{1,2}$/.test(c));
  return meaningful || null;
}
function getTextSnippet(el) {
  const text = el.textContent?.trim();
  if (!text) return null;
  const clean = text.replace(/\s+/g, " ");
  if (clean.length <= 30) return clean;
  return clean.slice(0, 30) + "…";
}
function detectPageSections() {
  const main = document.querySelector("main") || document.body;
  const candidates = Array.from(main.children);
  let allCandidates = candidates;
  if (main !== document.body && candidates.length < 3) {
    allCandidates = Array.from(document.body.children);
  }
  const sections = [];
  allCandidates.forEach((el, index) => {
    if (!(el instanceof HTMLElement)) return;
    const tag = el.tagName.toLowerCase();
    if (SKIP_TAGS.has(tag)) return;
    if (el.hasAttribute("data-feedback-toolbar")) return;
    if (el.closest("[data-feedback-toolbar]")) return;
    const style = window.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") return;
    const rect = el.getBoundingClientRect();
    if (rect.height < MIN_SECTION_HEIGHT) return;
    const isSemantic = SECTION_TAGS.has(tag);
    const hasRole = el.getAttribute("role") && SECTION_ROLES[el.getAttribute("role")];
    const isSignificantDiv = tag === "div" && rect.height >= 60;
    if (!isSemantic && !hasRole && !isSignificantDiv) return;
    const scrollY = window.scrollY;
    const isFixed = isEffectivelyFixed(el);
    const sectionRect = { x: rect.x, y: isFixed ? rect.y : rect.y + scrollY, width: rect.width, height: rect.height };
    sections.push({ id: `rs-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, label: labelSection(el), tagName: tag, selector: generateSelector(el), role: el.getAttribute("role"), className: getCleanClassName(el), textSnippet: getTextSnippet(el), originalRect: sectionRect, currentRect: { ...sectionRect }, originalIndex: index, isFixed });
  });
  return sections;
}
function captureElement(el) {
  const scrollY = window.scrollY;
  const rect = el.getBoundingClientRect();
  const isFixed = isEffectivelyFixed(el);
  const sectionRect = { x: rect.x, y: isFixed ? rect.y : rect.y + scrollY, width: rect.width, height: rect.height };
  const parent = el.parentElement;
  let originalIndex = 0;
  if (parent) {
    originalIndex = Array.from(parent.children).indexOf(el);
  }
  return { id: `rs-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, label: labelSection(el), tagName: el.tagName.toLowerCase(), selector: generateSelector(el), role: el.getAttribute("role"), className: getCleanClassName(el), textSnippet: getTextSnippet(el), originalRect: sectionRect, currentRect: { ...sectionRect }, originalIndex, isFixed };
}
var SECTION_COLOR = { bg: "rgba(59, 130, 246, 0.08)", border: "rgba(59, 130, 246, 0.5)", pill: "#3b82f6" };
var HANDLES = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];
var MIN_CAPTURE_SIZE = 16;
var SNAP_THRESHOLD2 = 5;
function computeSectionSnap(rect, sections, excludeIds, extraRects) {
  let bestDx = Infinity;
  let bestDy = Infinity;
  const mL = rect.x, mR = rect.x + rect.width, mCx = rect.x + rect.width / 2;
  const mT = rect.y, mB = rect.y + rect.height, mCy = rect.y + rect.height / 2;
  const allTargets = [];
  for (const s2 of sections) {
    if (!excludeIds.has(s2.id)) allTargets.push(s2.currentRect);
  }
  if (extraRects) allTargets.push(...extraRects);
  for (const o of allTargets) {
    const oL = o.x, oR = o.x + o.width, oCx = o.x + o.width / 2;
    const oT = o.y, oB = o.y + o.height, oCy = o.y + o.height / 2;
    for (const from of [mL, mR, mCx]) {
      for (const to of [oL, oR, oCx]) {
        const d = to - from;
        if (Math.abs(d) < SNAP_THRESHOLD2 && Math.abs(d) < Math.abs(bestDx)) bestDx = d;
      }
    }
    for (const from of [mT, mB, mCy]) {
      for (const to of [oT, oB, oCy]) {
        const d = to - from;
        if (Math.abs(d) < SNAP_THRESHOLD2 && Math.abs(d) < Math.abs(bestDy)) bestDy = d;
      }
    }
  }
  const dx = Math.abs(bestDx) < SNAP_THRESHOLD2 ? bestDx : 0;
  const dy = Math.abs(bestDy) < SNAP_THRESHOLD2 ? bestDy : 0;
  const guides = [];
  const seen = /* @__PURE__ */ new Set();
  const sL = mL + dx, sR = mR + dx, sCx = mCx + dx;
  const sT = mT + dy, sB = mB + dy, sCy = mCy + dy;
  for (const o of allTargets) {
    const oL = o.x, oR = o.x + o.width, oCx = o.x + o.width / 2;
    const oT = o.y, oB = o.y + o.height, oCy = o.y + o.height / 2;
    for (const xPos of [oL, oCx, oR]) {
      for (const sx of [sL, sCx, sR]) {
        if (Math.abs(sx - xPos) < 0.5) {
          const key = `x:${Math.round(xPos)}`;
          if (!seen.has(key)) {
            seen.add(key);
            guides.push({ axis: "x", pos: xPos });
          }
        }
      }
    }
    for (const yPos of [oT, oCy, oB]) {
      for (const sy of [sT, sCy, sB]) {
        if (Math.abs(sy - yPos) < 0.5) {
          const key = `y:${Math.round(yPos)}`;
          if (!seen.has(key)) {
            seen.add(key);
            guides.push({ axis: "y", pos: yPos });
          }
        }
      }
    }
  }
  return { dx, dy, guides };
}
var SKIP_TAGS2 = /* @__PURE__ */ new Set(["script", "style", "noscript", "link", "meta", "br", "hr"]);
function pickTarget(el) {
  let current = el;
  while (current && current !== document.body && current !== document.documentElement) {
    if (current.closest("[data-feedback-toolbar]")) return null;
    if (SKIP_TAGS2.has(current.tagName.toLowerCase())) {
      current = current.parentElement;
      continue;
    }
    const rect = current.getBoundingClientRect();
    if (rect.width >= MIN_CAPTURE_SIZE && rect.height >= MIN_CAPTURE_SIZE) {
      return current;
    }
    current = current.parentElement;
  }
  return null;
}
function RearrangeOverlay(props) {
  const sections = () => props.rearrangeState.sections;
  let rearrangeStateRef = props.rearrangeState;
  createEffect(() => {
    rearrangeStateRef = props.rearrangeState;
  });
  const [selectedIds, setSelectedIds] = createSignal(/* @__PURE__ */ new Set());
  const [exitingAll, setExitingAll] = createSignal(false);
  let clearRef = props.clearSignal;
  createEffect(() => {
    if (props.clearSignal !== void 0 && props.clearSignal !== clearRef) {
      clearRef = props.clearSignal;
      if (sections().length > 0) {
        setExitingAll(true);
      }
    }
  });
  let deselectRef = props.deselectSignal;
  createEffect(() => {
    if (props.deselectSignal !== deselectRef) {
      deselectRef = props.deselectSignal;
      setSelectedIds(/* @__PURE__ */ new Set());
    }
  });
  const [editingId, setEditingId] = createSignal(null);
  const [editExiting, setEditExiting] = createSignal(false);
  const dismissEdit = () => {
    if (!editingId()) return;
    setEditExiting(true);
    setTimeout(() => {
      setEditingId(null);
      setEditExiting(false);
    }, 150);
  };
  const submitEdit = (text) => {
    if (!editingId()) return;
    props.onChange({ ...props.rearrangeState, sections: sections().map((s2) => s2.id === editingId() ? { ...s2, note: text.trim() || void 0 } : s2) });
    dismissEdit();
  };
  createEffect(() => {
    if (props.exiting && editingId()) dismissEdit();
  });
  const [exitingIds, setExitingIds] = createSignal(/* @__PURE__ */ new Set());
  let lastNoteTextRef = /* @__PURE__ */ new Map();
  const [hoverHighlight, setHoverHighlight] = createSignal(null);
  const [sizeIndicator, setSizeIndicator] = createSignal(null);
  const [snapGuides, setSnapGuides] = createSignal([]);
  const [scrollY, setScrollY] = createSignal(0);
  let interactionRef = null;
  let seenGhostIdsRef = /* @__PURE__ */ new Set();
  let firstActionRef = /* @__PURE__ */ new Map();
  const [dragPositions, setDragPositions] = createSignal(/* @__PURE__ */ new Map());
  const [exitingConnectors, setExitingConnectors] = createSignal(/* @__PURE__ */ new Map());
  let prevChangedIdsRef = /* @__PURE__ */ new Set();
  let lastChangedRectsRef = /* @__PURE__ */ new Map();
  let onSelectionChangeRef = props.onSelectionChange;
  createEffect(() => {
    onSelectionChangeRef = props.onSelectionChange;
  });
  let onDragMoveRef = props.onDragMove;
  createEffect(() => {
    onDragMoveRef = props.onDragMove;
  });
  let onDragEndRef = props.onDragEnd;
  createEffect(() => {
    onDragEndRef = props.onDragEnd;
  });
  createEffect(() => {
    if (props.blankCanvas) setSelectedIds(/* @__PURE__ */ new Set());
  });
  const [outlinesReady, setOutlinesReady] = createSignal(!props.rearrangeState.sections.some((s2) => {
    const o = s2.originalRect, c = s2.currentRect;
    return Math.abs(o.x - c.x) > 1 || Math.abs(o.y - c.y) > 1 || Math.abs(o.width - c.width) > 1 || Math.abs(o.height - c.height) > 1;
  }));
  onMount(() => {
    if (!outlinesReady()) {
      const timer = setTimeout(() => setOutlinesReady(true), 380);
      onCleanup(() => clearTimeout(timer));
    }
  });
  let capturedSelectors = /* @__PURE__ */ new Set();
  createEffect(() => {
    capturedSelectors = new Set(sections().map((s2) => s2.selector));
  });
  onMount(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onCleanup(() => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    });
  });
  onMount(() => {
    const handleMouseMove = (e) => {
      if (interactionRef) {
        setHoverHighlight(null);
        return;
      }
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (!el) {
        setHoverHighlight(null);
        return;
      }
      if (el.closest("[data-feedback-toolbar]")) {
        setHoverHighlight(null);
        return;
      }
      if (el.closest("[data-design-placement]")) {
        setHoverHighlight(null);
        return;
      }
      if (el.closest("[data-annotation-popup]")) {
        setHoverHighlight(null);
        return;
      }
      const target = pickTarget(el);
      if (!target) {
        setHoverHighlight(null);
        return;
      }
      for (const sel of capturedSelectors) {
        try {
          const captured = document.querySelector(sel);
          if (captured && (captured === target || target.contains(captured))) {
            setHoverHighlight(null);
            return;
          }
        } catch {
        }
      }
      const rect = target.getBoundingClientRect();
      setHoverHighlight({ x: rect.x, y: rect.y, w: rect.width, h: rect.height });
    };
    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    onCleanup(() => document.removeEventListener("mousemove", handleMouseMove));
  });
  onMount(() => {
    const prev = document.body.style.userSelect;
    document.body.style.userSelect = "none";
    onCleanup(() => {
      document.body.style.userSelect = prev;
    });
  });
  onMount(() => {
    const handleMouseDown = (e) => {
      if (interactionRef) return;
      if (e.button !== 0) return;
      const el = e.target;
      if (!el || el.closest("[data-feedback-toolbar]")) return;
      if (el.closest("[data-design-placement]")) return;
      if (el.closest("[data-annotation-popup]")) return;
      const target = pickTarget(el);
      let alreadyCaptured = false;
      if (target) {
        for (const sel of capturedSelectors) {
          try {
            const captured = document.querySelector(sel);
            if (captured && (captured === target || target.contains(captured))) {
              alreadyCaptured = true;
              break;
            }
          } catch {
          }
        }
      }
      const isShift = !!(e.shiftKey || e.metaKey || e.ctrlKey);
      if (target && !alreadyCaptured) {
        e.preventDefault();
        e.stopPropagation();
        const section = captureElement(target);
        const newSections = [...sections(), section];
        const newOrder = [...props.rearrangeState.originalOrder, section.id];
        props.onChange({ ...props.rearrangeState, sections: newSections, originalOrder: newOrder });
        const newIds = /* @__PURE__ */ new Set([section.id]);
        setSelectedIds(newIds);
        onSelectionChangeRef?.(newIds, isShift);
        setHoverHighlight(null);
        const startX = e.clientX;
        const startY = e.clientY;
        const startPos = { x: section.currentRect.x, y: section.currentRect.y };
        let moved = false;
        let lastDx = 0, lastDy = 0;
        interactionRef = "move";
        const onMove = (ev) => {
          const dx = ev.clientX - startX;
          const dy = ev.clientY - startY;
          if (!moved && (Math.abs(dx) > 2 || Math.abs(dy) > 2)) moved = true;
          if (!moved) return;
          const rect = { x: startPos.x + dx, y: startPos.y + dy, width: section.currentRect.width, height: section.currentRect.height };
          const snap = computeSectionSnap(rect, newSections, /* @__PURE__ */ new Set([section.id]), props.extraSnapRects);
          setSnapGuides(snap.guides);
          const snappedDx = dx + snap.dx;
          const snappedDy = dy + snap.dy;
          lastDx = snappedDx;
          lastDy = snappedDy;
          const outlineEl = document.querySelector(`[data-rearrange-section="${section.id}"]`);
          if (outlineEl) outlineEl.style.transform = `translate(${snappedDx}px, ${snappedDy}px)`;
          setDragPositions(/* @__PURE__ */ new Map([[section.id, { x: startPos.x + snappedDx, y: startPos.y + snappedDy, width: section.currentRect.width, height: section.currentRect.height }]]));
          onDragMoveRef?.(snappedDx, snappedDy);
        };
        const onUp = () => {
          window.removeEventListener("mousemove", onMove);
          window.removeEventListener("mouseup", onUp);
          interactionRef = null;
          setSnapGuides([]);
          setDragPositions(/* @__PURE__ */ new Map());
          const outlineEl = document.querySelector(`[data-rearrange-section="${section.id}"]`);
          if (outlineEl) outlineEl.style.transform = "";
          if (moved) {
            props.onChange({ ...props.rearrangeState, sections: newSections.map((s2) => s2.id === section.id ? { ...s2, currentRect: { ...s2.currentRect, x: Math.max(0, startPos.x + lastDx), y: Math.max(0, startPos.y + lastDy) } } : s2), originalOrder: newOrder });
          }
          onDragEndRef?.(lastDx, lastDy, moved);
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
      } else if (alreadyCaptured && target) {
        e.preventDefault();
        for (const s2 of sections()) {
          try {
            const captured = document.querySelector(s2.selector);
            if (captured && captured === target) {
              const newIds = /* @__PURE__ */ new Set([s2.id]);
              setSelectedIds(newIds);
              onSelectionChangeRef?.(newIds, isShift);
              return;
            }
          } catch {
          }
        }
        if (!isShift) {
          setSelectedIds(/* @__PURE__ */ new Set());
          onSelectionChangeRef?.(/* @__PURE__ */ new Set(), false);
        }
      } else {
        if (!isShift) {
          setSelectedIds(/* @__PURE__ */ new Set());
          onSelectionChangeRef?.(/* @__PURE__ */ new Set(), false);
        }
      }
    };
    document.addEventListener("mousedown", handleMouseDown, true);
    onCleanup(() => document.removeEventListener("mousedown", handleMouseDown, true));
  });
  onMount(() => {
    const handleKeyDown = (e) => {
      const t = e.target;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable) return;
      if ((e.key === "Backspace" || e.key === "Delete") && selectedIds().size > 0) {
        e.preventDefault();
        const idsToDelete = new Set(selectedIds());
        setExitingIds((prev) => {
          const next = new Set(prev);
          for (const id of idsToDelete) next.add(id);
          return next;
        });
        setSelectedIds(/* @__PURE__ */ new Set());
        setTimeout(() => {
          const rs = rearrangeStateRef;
          props.onChange({ ...rs, sections: rs.sections.filter((s2) => !idsToDelete.has(s2.id)), originalOrder: rs.originalOrder.filter((id) => !idsToDelete.has(id)) });
          setExitingIds((prev) => {
            const next = new Set(prev);
            for (const id of idsToDelete) next.delete(id);
            return next;
          });
        }, 180);
        return;
      }
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key) && selectedIds().size > 0) {
        e.preventDefault();
        const step = e.shiftKey ? 20 : 1;
        const dx = e.key === "ArrowLeft" ? -step : e.key === "ArrowRight" ? step : 0;
        const dy = e.key === "ArrowUp" ? -step : e.key === "ArrowDown" ? step : 0;
        props.onChange({ ...props.rearrangeState, sections: sections().map((s2) => selectedIds().has(s2.id) ? { ...s2, currentRect: { ...s2.currentRect, x: Math.max(0, s2.currentRect.x + dx), y: Math.max(0, s2.currentRect.y + dy) } } : s2) });
        return;
      }
      if (e.key === "Escape" && selectedIds().size > 0) {
        setSelectedIds(/* @__PURE__ */ new Set());
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    onCleanup(() => document.removeEventListener("keydown", handleKeyDown));
  });
  const hasChanged = (s2) => {
    const o = s2.originalRect, c = s2.currentRect;
    return Math.abs(o.x - c.x) > 1 || Math.abs(o.y - c.y) > 1 || Math.abs(o.width - c.width) > 1 || Math.abs(o.height - c.height) > 1;
  };
  const isMoved = (s2) => {
    const o = s2.originalRect, c = s2.currentRect;
    return Math.abs(o.x - c.x) > 1 || Math.abs(o.y - c.y) > 1;
  };
  const isResized = (s2) => {
    const o = s2.originalRect, c = s2.currentRect;
    return Math.abs(o.width - c.width) > 1 || Math.abs(o.height - c.height) > 1;
  };
  const visibleSections = () => sections().filter((s2) => {
    try {
      if (exitingIds().has(s2.id)) return true;
      if (selectedIds().has(s2.id)) return true;
      const el = document.querySelector(s2.selector);
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      const expected = s2.originalRect;
      const sizeDiff = Math.abs(rect.width - expected.width) + Math.abs(rect.height - expected.height);
      return sizeDiff < 200;
    } catch {
      return false;
    }
  });
  const changedSections = () => visibleSections().filter((s2) => hasChanged(s2));
  const unchangedSections = () => visibleSections().filter((s2) => !hasChanged(s2));
  createEffect(() => {
    const secs = sections();
    for (const s2 of secs) {
      if (!firstActionRef.has(s2.id)) {
        if (isMoved(s2)) firstActionRef.set(s2.id, "move");
        else if (isResized(s2)) firstActionRef.set(s2.id, "resize");
      }
    }
    for (const id of firstActionRef.keys()) {
      if (!secs.some((s2) => s2.id === id)) firstActionRef.delete(id);
    }
    const currentChangedIds = new Set(changedSections().map((s2) => s2.id));
    for (const id of seenGhostIdsRef) {
      if (!currentChangedIds.has(id)) seenGhostIdsRef.delete(id);
    }
    for (const s2 of changedSections()) {
      lastChangedRectsRef.set(s2.id, { currentRect: s2.currentRect, originalRect: s2.originalRect, isFixed: s2.isFixed });
    }
    const prev = prevChangedIdsRef;
    prevChangedIdsRef = currentChangedIds;
    const exitingMap = /* @__PURE__ */ new Map();
    for (const id of prev) {
      if (!currentChangedIds.has(id)) {
        if (!secs.some((s2) => s2.id === id)) continue;
        const last = lastChangedRectsRef.get(id);
        if (last) {
          exitingMap.set(id, { orig: last.originalRect, target: last.currentRect, isFixed: last.isFixed });
          lastChangedRectsRef.delete(id);
        }
      }
    }
    if (exitingMap.size > 0) {
      setExitingConnectors((prevMap) => {
        const next = new Map(prevMap);
        for (const [id, data] of exitingMap) next.set(id, data);
        return next;
      });
      const timer = setTimeout(() => {
        setExitingConnectors((prevMap) => {
          const next = new Map(prevMap);
          for (const id of exitingMap.keys()) next.delete(id);
          return next;
        });
      }, 250);
      onCleanup(() => clearTimeout(timer));
    }
  });
  return [ssr(_tmpl$183, ssrHydrationKey(), `${escape(styles_module_default3.rearrangeOverlay, true)} ${!props.isDarkMode ? escape(styles_module_default3.light, true) : ""} ${props.exiting ? escape(styles_module_default3.overlayExiting, true) : ""}${props.className ? ` ${escape(props.className, true)}` : ""}`, escape(createComponent(Show$1, { get when() {
    return hoverHighlight();
  }, children: (hl) => ssr(_tmpl$45, ssrHydrationKey() + ssrAttribute("class", escape(styles_module_default3.hoverHighlight, true), false), ssrStyleProperty("left:", `${escape(hl().x, true)}px`) + ssrStyleProperty(";top:", `${escape(hl().y, true)}px`) + ssrStyleProperty(";width:", `${escape(hl().w, true)}px`) + ssrStyleProperty(";height:", `${escape(hl().h, true)}px`)) })), escape(createComponent(For, { get each() {
    return unchangedSections();
  }, children: (section) => {
    const rect = () => section.currentRect;
    const screenY = () => section.isFixed ? rect().y : rect().y - scrollY();
    const color = SECTION_COLOR;
    const isSelected = () => selectedIds().has(section.id);
    return ssr(_tmpl$184, ssrHydrationKey() + ssrAttribute("data-rearrange-section", escape(section.id, true), false), `${escape(styles_module_default3.sectionOutline, true)} ${isSelected() ? escape(styles_module_default3.selected, true) : ""} ${exitingAll() || props.exiting || exitingIds().has(section.id) ? escape(styles_module_default3.exiting, true) : ""}`, ssrStyle({ left: `${rect().x}px`, top: `${screenY()}px`, width: `${rect().width}px`, height: `${rect().height}px`, "border-color": color.border, "background-color": color.bg, ...outlinesReady() ? {} : { opacity: 0, animation: "none", transition: "none" } }), ssrAttribute("class", escape(styles_module_default3.sectionLabel, true), false), ssrStyleProperty("background-color:", escape(color.pill, true)), escape(section.label), `${escape(styles_module_default3.sectionAnnotation, true)} ${section.note ? escape(styles_module_default3.annotationVisible, true) : ""}`, (() => {
      if (section.note) lastNoteTextRef.set(section.id, section.note);
      return escape(section.note || lastNoteTextRef.get(section.id) || "");
    })(), ssrAttribute("class", escape(styles_module_default3.sectionDimensions, true), false), escape(Math.round(rect().width)), escape(Math.round(rect().height)), ssrAttribute("class", escape(styles_module_default3.deleteButton, true), false), escape(createComponent(For, { each: HANDLES, children: (dir) => ssr(_tmpl$107, ssrHydrationKey(), `${escape(styles_module_default3.handle, true)} ${escape(styles_module_default3[`handle${dir.charAt(0).toUpperCase()}${dir.slice(1)}`], true)}`) })));
  } })), escape(createComponent(For, { get each() {
    return changedSections();
  }, children: (section) => {
    const rect = () => section.currentRect;
    const screenY = () => section.isFixed ? rect().y : rect().y - scrollY();
    const isSelected = () => selectedIds().has(section.id);
    const moved = () => isMoved(section);
    const resized = () => isResized(section);
    const settled = () => !isSelected();
    const isNewGhost = !seenGhostIdsRef.has(section.id);
    if (isNewGhost) seenGhostIdsRef.add(section.id);
    return createComponent(Show$1, { get when() {
      return !(props.blankCanvas && settled());
    }, get children() {
      return ssr(_tmpl$185, ssrHydrationKey() + ssrAttribute("data-rearrange-section", escape(section.id, true), false), `${escape(styles_module_default3.ghostOutline, true)} ${isSelected() ? escape(styles_module_default3.selected, true) : ""} ${exitingAll() || props.exiting || exitingIds().has(section.id) ? escape(styles_module_default3.exiting, true) : ""}`, ssrStyle({ left: `${rect().x}px`, top: `${screenY()}px`, width: `${rect().width}px`, height: `${rect().height}px`, ...outlinesReady() ? {} : { opacity: 0, animation: "none", transition: "none" }, ...!isNewGhost ? { animation: "none" } : {} }), ssrAttribute("class", escape(styles_module_default3.sectionLabel, true), false), ssrStyleProperty("background-color:", escape(SECTION_COLOR.pill, true)), escape(section.label), `${escape(styles_module_default3.sectionAnnotation, true)} ${section.note ? escape(styles_module_default3.annotationVisible, true) : ""}`, (() => {
        if (section.note) lastNoteTextRef.set(section.id, section.note);
        return escape(section.note || lastNoteTextRef.get(section.id) || "");
      })(), ssrAttribute("class", escape(styles_module_default3.sectionDimensions, true), false), escape(Math.round(rect().width)), escape(Math.round(rect().height)), ssrAttribute("class", escape(styles_module_default3.deleteButton, true), false), escape(createComponent(For, { each: HANDLES, children: (dir) => ssr(_tmpl$107, ssrHydrationKey(), `${escape(styles_module_default3.handle, true)} ${escape(styles_module_default3[`handle${dir.charAt(0).toUpperCase()}${dir.slice(1)}`], true)}`) })), ssrAttribute("class", escape(styles_module_default3.ghostBadge, true), false), (() => {
        const first = firstActionRef.get(section.id);
        if (moved() && resized()) {
          const [a, b] = first === "resize" ? ["Resize", "Move"] : ["Move", "Resize"];
          return ["Suggested ", a, " ", ssr(_tmpl$186, ssrHydrationKey() + ssrAttribute("class", escape(styles_module_default3.ghostBadgeExtra, true), false), escape(b))];
        }
        return `Suggested ${resized() ? "Resize" : "Move"}`;
      })());
    } });
  } }))), createComponent(Show$1, { get when() {
    return !props.blankCanvas;
  }, get children() {
    return (() => {
      const connectorSections = () => {
        const result = [];
        for (const s2 of changedSections()) {
          const livePos = dragPositions().get(s2.id);
          result.push({ id: s2.id, orig: s2.originalRect, target: livePos || s2.currentRect, isFixed: s2.isFixed, isSelected: selectedIds().has(s2.id), isExiting: exitingIds().has(s2.id) });
        }
        for (const [id, pos] of dragPositions()) {
          if (!result.some((c) => c.id === id)) {
            const s2 = sections().find((sec) => sec.id === id);
            if (s2) result.push({ id, orig: s2.originalRect, target: pos, isFixed: s2.isFixed, isSelected: selectedIds().has(id) });
          }
        }
        for (const [id, data] of exitingConnectors()) {
          if (!result.some((c) => c.id === id)) {
            result.push({ id, orig: data.orig, target: data.target, isFixed: data.isFixed, isSelected: false, isExiting: true });
          }
        }
        return result;
      };
      return createComponent(Show$1, { get when() {
        return connectorSections().length > 0;
      }, get children() {
        return ssr(_tmpl$187, ssrHydrationKey(), `${escape(styles_module_default3.connectorSvg, true)} ${exitingAll() || props.exiting ? escape(styles_module_default3.connectorExiting, true) : ""}`, escape(createComponent(For, { get each() {
          return connectorSections();
        }, children: ({ id, orig, target, isFixed, isSelected, isExiting: isExitingConn }) => {
          const ox = orig.x + orig.width / 2;
          const oy = (isFixed ? orig.y : orig.y - scrollY()) + orig.height / 2;
          const cx = target.x + target.width / 2;
          const cy = (isFixed ? target.y : target.y - scrollY()) + target.height / 2;
          const ddx = cx - ox;
          const ddy = cy - oy;
          const dist = Math.sqrt(ddx * ddx + ddy * ddy);
          if (dist < 2) return null;
          const proximityScale = Math.min(1, dist / 40);
          const perpOffset = Math.min(dist * 0.3, 60);
          const nx = dist > 0 ? -ddy / dist : 0;
          const ny = dist > 0 ? ddx / dist : 0;
          const cpx = (ox + cx) / 2 + nx * perpOffset;
          const cpy = (oy + cy) / 2 + ny * perpOffset;
          const isDragging = dragPositions().has(id);
          const baseOpacity = isDragging || isSelected ? 1 : 0.4;
          const dotBaseOpacity = isDragging || isSelected ? 1 : 0.5;
          return ssr(_tmpl$188, ssrHydrationKey() + ssrAttribute("class", isExitingConn ? escape(styles_module_default3.connectorExiting, true) : "", false), ssrAttribute("class", escape(styles_module_default3.connectorLine, true), false), `M ${escape(ox, true)} ${escape(oy, true)} Q ${escape(cpx, true)} ${escape(cpy, true)} ${escape(cx, true)} ${escape(cy, true)}`, ssrAttribute("opacity", escape(baseOpacity, true) * escape(proximityScale, true), false), ssrAttribute("class", escape(styles_module_default3.connectorDot, true), false) + ssrAttribute("cx", escape(ox, true), false) + ssrAttribute("cy", escape(oy, true), false) + ssrAttribute("r", 4 * escape(proximityScale, true), false), ssrAttribute("opacity", escape(dotBaseOpacity, true) * escape(proximityScale, true), false), ssrAttribute("class", escape(styles_module_default3.connectorDot, true), false) + ssrAttribute("cx", escape(cx, true), false) + ssrAttribute("cy", escape(cy, true), false) + ssrAttribute("r", 4 * escape(proximityScale, true), false), ssrAttribute("opacity", escape(dotBaseOpacity, true) * escape(proximityScale, true), false));
        } })));
      } });
    })();
  } }), createComponent(Show$1, { get when() {
    return editingId();
  }, children: (eid) => {
    const es = () => sections().find((s2) => s2.id === eid());
    return createComponent(Show$1, { get when() {
      return es();
    }, children: (editSection) => {
      const rect = () => editSection().currentRect;
      const screenY = () => editSection().isFixed ? rect().y : rect().y - scrollY();
      const centerX = () => rect().x + rect().width / 2;
      const aboveY = () => screenY() - 8;
      const belowY = () => screenY() + rect().height + 8;
      const fitsAbove = () => aboveY() > 200;
      const fitsBelow = () => belowY() < window.innerHeight - 100;
      const popupLeft = () => Math.max(160, Math.min(window.innerWidth - 160, centerX()));
      const popupStyle = () => {
        if (fitsAbove()) {
          return { left: `${popupLeft()}px`, bottom: `${window.innerHeight - aboveY()}px` };
        } else if (fitsBelow()) {
          return { left: `${popupLeft()}px`, top: `${belowY()}px` };
        } else {
          return { left: `${popupLeft()}px`, top: `${Math.max(80, window.innerHeight / 2 - 80)}px` };
        }
      };
      return createComponent(AnnotationPopupCSS, { get element() {
        return editSection().label;
      }, placeholder: "Add a note about this section", get initialValue() {
        return editSection().note ?? "";
      }, submitLabel: "Set", onSubmit: submitEdit, onCancel: dismissEdit, onDelete: void 0, get isExiting() {
        return editExiting();
      }, get lightMode() {
        return !props.isDarkMode;
      }, get style() {
        return popupStyle();
      } });
    } });
  } }), createComponent(Show$1, { get when() {
    return sizeIndicator();
  }, children: (si) => ssr(_tmpl$110, ssrHydrationKey() + ssrAttribute("class", escape(styles_module_default3.sizeIndicator, true), false), ssrStyleProperty("left:", `${escape(si().x, true)}px`) + ssrStyleProperty(";top:", `${escape(si().y, true)}px`), escape(si().text)) }), createComponent(For, { get each() {
    return snapGuides();
  }, children: (g) => ssr(_tmpl$45, ssrHydrationKey() + ssrAttribute("class", escape(styles_module_default3.guideLine, true), false), ssrStyle(g.axis === "x" ? { position: "fixed", left: `${g.pos}px`, top: "0", width: "1px", height: "100vh" } : { position: "fixed", left: "0", top: `${g.pos - scrollY()}px`, width: "100vw", height: "1px" })) })];
}
var SKIP_TAGS3 = /* @__PURE__ */ new Set(["script", "style", "noscript", "link", "meta", "br", "hr"]);
function collectDOMCandidates() {
  const main = document.querySelector("main") || document.body;
  const results = [];
  const topLevel = Array.from(main.children);
  const roots = main !== document.body && topLevel.length < 3 ? Array.from(document.body.children) : topLevel;
  for (const el of roots) {
    if (!(el instanceof HTMLElement)) continue;
    if (SKIP_TAGS3.has(el.tagName.toLowerCase())) continue;
    if (el.hasAttribute("data-feedback-toolbar")) continue;
    const style = window.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") continue;
    const rect = el.getBoundingClientRect();
    if (rect.height < 10 || rect.width < 10) continue;
    results.push({ label: labelSection(el), selector: generateSelector(el), top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right, area: rect.width * rect.height });
    for (const child of Array.from(el.children)) {
      if (!(child instanceof HTMLElement)) continue;
      if (SKIP_TAGS3.has(child.tagName.toLowerCase())) continue;
      if (child.hasAttribute("data-feedback-toolbar")) continue;
      const childStyle = window.getComputedStyle(child);
      if (childStyle.display === "none" || childStyle.visibility === "hidden") continue;
      const cr = child.getBoundingClientRect();
      if (cr.height < 10 || cr.width < 10) continue;
      results.push({ label: labelSection(child), selector: generateSelector(child), top: cr.top, bottom: cr.bottom, left: cr.left, right: cr.right, area: cr.width * cr.height });
    }
  }
  return results;
}
function explicitToCandidates(items) {
  const scrollY = window.scrollY;
  return items.map(({ label, selector, rect }) => {
    const top = rect.y - scrollY;
    return { label, selector, top, bottom: top + rect.height, left: rect.x, right: rect.x + rect.width, area: rect.width * rect.height };
  });
}
function toViewportEdges(r) {
  const scrollY = window.scrollY;
  const top = r.y - scrollY;
  const left = r.x;
  return { top, bottom: top + r.height, left, right: left + r.width, area: r.width * r.height };
}
function getSpatialContext(targetRect, siblings) {
  const candidates = siblings ? explicitToCandidates(siblings) : collectDOMCandidates();
  const target = toViewportEdges(targetRect);
  let above = null;
  let below = null;
  let left = null;
  let right = null;
  let containedIn = null;
  for (const c of candidates) {
    if (Math.abs(c.left - target.left) < 2 && Math.abs(c.top - target.top) < 2 && Math.abs(c.right - c.left - targetRect.width) < 2 && Math.abs(c.bottom - c.top - targetRect.height) < 2) {
      continue;
    }
    if (c.left <= target.left + 2 && c.right >= target.right - 2 && c.top <= target.top + 2 && c.bottom >= target.bottom - 2 && c.area > target.area * 1.5) {
      if (!containedIn || c.area < containedIn._area) {
        containedIn = { label: c.label, selector: c.selector, _area: c.area };
      }
    }
    const hOverlap = target.right > c.left + 5 && target.left < c.right - 5;
    const vOverlap = target.bottom > c.top + 5 && target.top < c.bottom - 5;
    if (hOverlap && c.bottom <= target.top + 5) {
      const gap = Math.round(target.top - c.bottom);
      if (!above || gap < above._dist) {
        above = { label: c.label, selector: c.selector, gap: Math.max(0, gap), _dist: gap };
      }
    }
    if (hOverlap && c.top >= target.bottom - 5) {
      const gap = Math.round(c.top - target.bottom);
      if (!below || gap < below._dist) {
        below = { label: c.label, selector: c.selector, gap: Math.max(0, gap), _dist: gap };
      }
    }
    if (vOverlap && c.right <= target.left + 5) {
      const gap = Math.round(target.left - c.right);
      if (!left || gap < left._dist) {
        left = { label: c.label, selector: c.selector, gap: Math.max(0, gap), _dist: gap };
      }
    }
    if (vOverlap && c.left >= target.right - 5) {
      const gap = Math.round(c.left - target.right);
      if (!right || gap < right._dist) {
        right = { label: c.label, selector: c.selector, gap: Math.max(0, gap), _dist: gap };
      }
    }
  }
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const alignment = getAlignment(targetRect, viewportWidth);
  const clean = (n) => {
    if (!n) return null;
    return { label: n.label, selector: n.selector, gap: n.gap };
  };
  const outOfBounds = detectBoundsOverflow(target, targetRect, viewportWidth, viewportHeight, containedIn ? { label: containedIn.label, selector: containedIn.selector, _area: containedIn._area } : null, candidates);
  return { above: clean(above), below: clean(below), left: clean(left), right: clean(right), alignment, containedIn: containedIn ? { label: containedIn.label, selector: containedIn.selector } : null, outOfBounds };
}
function detectBoundsOverflow(targetEdges, targetRect, viewportWidth, viewportHeight, container, candidates) {
  const result = {};
  let hasOverflow = false;
  const vpOverflow = [];
  if (targetEdges.left < -2) vpOverflow.push("left");
  if (targetEdges.right > viewportWidth + 2) vpOverflow.push("right");
  if (targetEdges.top < -2) vpOverflow.push("top");
  if (targetEdges.bottom > viewportHeight + 2) vpOverflow.push("bottom");
  if (vpOverflow.length > 0) {
    result.viewport = vpOverflow;
    hasOverflow = true;
  }
  if (container) {
    const cont = candidates.find((c) => c.label === container.label && c.selector === container.selector && Math.abs(c.area - container._area) < 10);
    if (cont) {
      const contOverflow = [];
      if (targetEdges.left < cont.left - 2) contOverflow.push("left");
      if (targetEdges.right > cont.right + 2) contOverflow.push("right");
      if (targetEdges.top < cont.top - 2) contOverflow.push("top");
      if (targetEdges.bottom > cont.bottom + 2) contOverflow.push("bottom");
      if (contOverflow.length > 0) {
        result.container = { label: container.label, edges: contOverflow };
        hasOverflow = true;
      }
    }
  }
  return hasOverflow ? result : null;
}
function getAlignment(rect, viewportWidth) {
  const ratio = rect.width / viewportWidth;
  if (ratio > 0.85) return "full-width";
  const centerX = rect.x + rect.width / 2;
  const viewportCenter = viewportWidth / 2;
  const offset = centerX - viewportCenter;
  const tolerance = viewportWidth * 0.08;
  if (Math.abs(offset) < tolerance) return "center";
  if (offset < 0) return "left";
  return "right";
}
function formatAlignment(alignment) {
  switch (alignment) {
    case "full-width":
      return "full-width";
    case "center":
      return "centered";
    case "left":
      return "left-aligned";
    case "right":
      return "right-aligned";
  }
}
function formatSpatialLines(ctx, options = {}) {
  const lines = [];
  if (ctx.above) {
    lines.push(`Below \`${ctx.above.label}\`${ctx.above.gap > 0 ? ` (${ctx.above.gap}px gap)` : ""}`);
  }
  if (ctx.below) {
    lines.push(`Above \`${ctx.below.label}\`${ctx.below.gap > 0 ? ` (${ctx.below.gap}px gap)` : ""}`);
  }
  if (options.includeLeftRight) {
    if (ctx.left) {
      lines.push(`Right of \`${ctx.left.label}\`${ctx.left.gap > 0 ? ` (${ctx.left.gap}px gap)` : ""}`);
    }
    if (ctx.right) {
      lines.push(`Left of \`${ctx.right.label}\`${ctx.right.gap > 0 ? ` (${ctx.right.gap}px gap)` : ""}`);
    }
  }
  const alignStr = formatAlignment(ctx.alignment);
  if (ctx.containedIn) {
    lines.push(`${alignStr.charAt(0).toUpperCase() + alignStr.slice(1)} in \`${ctx.containedIn.label}\``);
  } else {
    lines.push(`${alignStr.charAt(0).toUpperCase() + alignStr.slice(1)} in page`);
  }
  if (options.includePixelRef && options.pixelRef) {
    lines.push(`Pixel ref: \`${options.pixelRef}\``);
  }
  if (ctx.outOfBounds) {
    if (ctx.outOfBounds.viewport) {
      lines.push(`**Outside viewport** (${ctx.outOfBounds.viewport.join(", ")} edge${ctx.outOfBounds.viewport.length > 1 ? "s" : ""})`);
    }
    if (ctx.outOfBounds.container) {
      lines.push(`**Outside \`${ctx.outOfBounds.container.label}\`** (${ctx.outOfBounds.container.edges.join(", ")} edge${ctx.outOfBounds.container.edges.length > 1 ? "s" : ""})`);
    }
  }
  return lines;
}
function formatPositionSummary(ctx, coords, size) {
  const parts = [];
  if (ctx.above) parts.push(`below \`${ctx.above.label}\``);
  if (ctx.below) parts.push(`above \`${ctx.below.label}\``);
  if (ctx.left) parts.push(`right of \`${ctx.left.label}\``);
  if (ctx.right) parts.push(`left of \`${ctx.right.label}\``);
  if (ctx.containedIn) parts.push(`inside \`${ctx.containedIn.label}\``);
  parts.push(formatAlignment(ctx.alignment));
  if (ctx.outOfBounds?.viewport) {
    parts.push(`**outside viewport** (${ctx.outOfBounds.viewport.join(", ")})`);
  }
  if (ctx.outOfBounds?.container) {
    parts.push(`**outside \`${ctx.outOfBounds.container.label}\`** (${ctx.outOfBounds.container.edges.join(", ")})`);
  }
  const sizeStr = size ? `, ${Math.round(size.width)}×${Math.round(size.height)}px` : "";
  return `at (${Math.round(coords.x)}, ${Math.round(coords.y)})${sizeStr}: ${parts.join(", ")}`;
}
var GROUP_TOLERANCE = 15;
function detectGroups(items) {
  if (items.length < 2) return [];
  const groups = [];
  const used = /* @__PURE__ */ new Set();
  for (let i = 0; i < items.length; i++) {
    if (used.has(i)) continue;
    const row = [i];
    for (let j = i + 1; j < items.length; j++) {
      if (used.has(j)) continue;
      if (Math.abs(items[i].rect.y - items[j].rect.y) < GROUP_TOLERANCE) {
        row.push(j);
      }
    }
    if (row.length >= 2) {
      const members = row.map((idx) => items[idx]);
      members.sort((a, b) => a.rect.x - b.rect.x);
      const gaps = [];
      for (let k = 0; k < members.length - 1; k++) {
        gaps.push(Math.round(members[k + 1].rect.x - (members[k].rect.x + members[k].rect.width)));
      }
      const avgY = Math.round(members.reduce((sum, m) => sum + m.rect.y, 0) / members.length);
      groups.push({ labels: members.map((m) => m.label), type: "row", sharedEdge: avgY, gaps, avgGap: gaps.length ? Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length) : 0 });
      row.forEach((idx) => used.add(idx));
    }
  }
  for (let i = 0; i < items.length; i++) {
    if (used.has(i)) continue;
    const col = [i];
    for (let j = i + 1; j < items.length; j++) {
      if (used.has(j)) continue;
      if (Math.abs(items[i].rect.x - items[j].rect.x) < GROUP_TOLERANCE) {
        col.push(j);
      }
    }
    if (col.length >= 2) {
      const members = col.map((idx) => items[idx]);
      members.sort((a, b) => a.rect.y - b.rect.y);
      const gaps = [];
      for (let k = 0; k < members.length - 1; k++) {
        gaps.push(Math.round(members[k + 1].rect.y - (members[k].rect.y + members[k].rect.height)));
      }
      const avgX = Math.round(members.reduce((sum, m) => sum + m.rect.x, 0) / members.length);
      groups.push({ labels: members.map((m) => m.label), type: "column", sharedEdge: avgX, gaps, avgGap: gaps.length ? Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length) : 0 });
      col.forEach((idx) => used.add(idx));
    }
  }
  return groups;
}
function analyzeLayoutPatterns(sections) {
  if (sections.length < 2) return [];
  const origGroups = detectGroups(sections.map((s2) => ({ label: s2.label, rect: s2.originalRect })));
  const currGroups = detectGroups(sections.map((s2) => ({ label: s2.label, rect: s2.currentRect })));
  const lines = [];
  const described = /* @__PURE__ */ new Set();
  for (const og of origGroups) {
    const ogSet = new Set(og.labels);
    let bestMatch = null;
    let bestOverlap = 0;
    for (const cg of currGroups) {
      const overlap = cg.labels.filter((l) => ogSet.has(l)).length;
      if (overlap >= 2 && overlap > bestOverlap) {
        bestMatch = cg;
        bestOverlap = overlap;
      }
    }
    if (bestMatch) {
      const sharedLabels = bestMatch.labels.filter((l) => ogSet.has(l));
      const names = sharedLabels.join(", ");
      if (bestMatch.type !== og.type) {
        const fromAxis = og.type === "row" ? "y" : "x";
        const toAxis = bestMatch.type === "row" ? "y" : "x";
        lines.push(`**${names}**: ${og.type} (${fromAxis}≈${og.sharedEdge}, ${og.avgGap}px gaps) → ${bestMatch.type} (${toAxis}≈${bestMatch.sharedEdge}, ${bestMatch.avgGap}px gaps)`);
      } else if (Math.abs(og.sharedEdge - bestMatch.sharedEdge) > 20 || Math.abs(og.avgGap - bestMatch.avgGap) > 5) {
        const axis = og.type === "row" ? "y" : "x";
        const posChange = Math.abs(og.sharedEdge - bestMatch.sharedEdge) > 20 ? ` ${axis}: ${og.sharedEdge} → ${bestMatch.sharedEdge}` : "";
        const gapChange = Math.abs(og.avgGap - bestMatch.avgGap) > 5 ? ` gaps: ${og.avgGap}px → ${bestMatch.avgGap}px` : "";
        lines.push(`**${names}**: ${og.type} shifted —${posChange}${gapChange}`);
      }
      sharedLabels.forEach((l) => described.add(l));
    } else {
      const names = og.labels.join(", ");
      const axis = og.type === "row" ? "y" : "x";
      lines.push(`**${names}**: ${og.type} (${axis}≈${og.sharedEdge}) dissolved`);
      og.labels.forEach((l) => described.add(l));
    }
  }
  for (const cg of currGroups) {
    if (cg.labels.every((l) => described.has(l))) continue;
    const newLabels = cg.labels.filter((l) => !described.has(l));
    if (newLabels.length < 2) continue;
    const wasGrouped = origGroups.some((og) => {
      const overlap = og.labels.filter((l) => cg.labels.includes(l));
      return overlap.length >= 2;
    });
    if (!wasGrouped) {
      const axis = cg.type === "row" ? "y" : "x";
      lines.push(`**${cg.labels.join(", ")}**: new ${cg.type} (${axis}≈${cg.sharedEdge}, ${cg.avgGap}px gaps)`);
      cg.labels.forEach((l) => described.add(l));
    }
  }
  const ungroupedCurr = sections.filter((s2) => !described.has(s2.label));
  if (ungroupedCurr.length >= 2) {
    const byX = {};
    for (const s2 of ungroupedCurr) {
      const x = Math.round(s2.currentRect.x / 5) * 5;
      (byX[x] ??= []).push(s2.label);
    }
    for (const [x, labels] of Object.entries(byX)) {
      if (labels.length >= 2) {
        lines.push(`**${labels.join(", ")}**: shared left edge at x≈${x}`);
      }
    }
  }
  return lines;
}
function getPageLayout(viewport) {
  if (typeof document === "undefined") return { viewport, contentArea: null };
  const candidates = [];
  const seen = /* @__PURE__ */ new Set();
  const addCandidate = (el) => {
    if (seen.has(el)) return;
    if (!(el instanceof HTMLElement)) return;
    if (el.hasAttribute("data-feedback-toolbar")) return;
    if (SKIP_TAGS3.has(el.tagName.toLowerCase())) return;
    seen.add(el);
    candidates.push(el);
  };
  const main = document.querySelector("main");
  if (main) addCandidate(main);
  const roleMain = document.querySelector("[role='main']");
  if (roleMain) addCandidate(roleMain);
  for (const l1 of Array.from(document.body.children)) {
    addCandidate(l1);
    if (l1.children) {
      for (const l2 of Array.from(l1.children)) {
        addCandidate(l2);
        if (l2.children) {
          for (const l3 of Array.from(l2.children)) {
            addCandidate(l3);
          }
        }
      }
    }
  }
  let bestContainer = null;
  for (const el of candidates) {
    const rect = el.getBoundingClientRect();
    if (rect.height < 50) continue;
    const style = getComputedStyle(el);
    if (style.maxWidth && style.maxWidth !== "none" && style.maxWidth !== "0px") {
      if (!bestContainer || rect.width < bestContainer.rect.width) {
        bestContainer = { el, rect };
      }
      continue;
    }
    if (!bestContainer && rect.width < viewport.width - 20 && rect.width > 100) {
      bestContainer = { el, rect };
    }
  }
  if (bestContainer) {
    const { el, rect } = bestContainer;
    return { viewport, contentArea: { width: Math.round(rect.width), left: Math.round(rect.left), right: Math.round(rect.right), centerX: Math.round(rect.left + rect.width / 2), selector: generateSelector(el) } };
  }
  return { viewport, contentArea: null };
}
function getElementCSSContext(selector) {
  if (typeof document === "undefined") return null;
  const el = document.querySelector(selector);
  if (!el?.parentElement) return null;
  const ps = getComputedStyle(el.parentElement);
  const result = { parentDisplay: ps.display, parentSelector: generateSelector(el.parentElement) };
  if (ps.display.includes("flex")) {
    result.flexDirection = ps.flexDirection;
  }
  if (ps.display.includes("grid") && ps.gridTemplateColumns !== "none") {
    result.gridCols = ps.gridTemplateColumns;
  }
  if (ps.gap && ps.gap !== "normal" && ps.gap !== "0px") {
    result.gap = ps.gap;
  }
  return result;
}
function formatCSSPosition(rect, layout) {
  const ref = layout.contentArea;
  const containerWidth = ref ? ref.width : layout.viewport.width;
  const containerLeft = ref ? ref.left : 0;
  const containerCenterX = ref ? ref.centerX : Math.round(layout.viewport.width / 2);
  const leftInContainer = Math.round(rect.x - containerLeft);
  const rightInContainer = Math.round(containerLeft + containerWidth - (rect.x + rect.width));
  const widthPct = (rect.width / containerWidth * 100).toFixed(1);
  const centerX = rect.x + rect.width / 2;
  const isCentered = Math.abs(centerX - containerCenterX) < 20;
  const isFullWidth = rect.width / containerWidth > 0.95;
  const parts = [];
  if (isFullWidth) {
    parts.push("`width: 100%` of container");
  } else {
    parts.push(`left \`${leftInContainer}px\` in container, right \`${rightInContainer}px\`, width \`${widthPct}%\` (\`${Math.round(rect.width)}px\`)`);
  }
  if (isCentered && !isFullWidth) {
    parts.push("centered — `margin-inline: auto`");
  }
  return parts.join(" — ");
}
function formatReferenceFrame(layout) {
  const { viewport, contentArea } = layout;
  let out = "### Reference Frame\n";
  out += `- Viewport: \`${viewport.width}×${viewport.height}px\`
`;
  if (contentArea) {
    const ca = contentArea;
    out += `- Content area: \`${ca.width}px\` wide, left edge at \`x=${ca.left}\`, right at \`x=${ca.right}\` (\`${ca.selector}\`)
`;
    out += `- Pixel → CSS translation:
`;
    out += `  - **Horizontal position in container**: \`element.x - ${ca.left}\` → use as \`margin-left\` or \`left\`
`;
    out += `  - **Width as % of container**: \`element.width / ${ca.width} × 100\` → use as \`width: X%\`
`;
    out += `  - **Vertical gap between elements**: \`nextElement.y - (prevElement.y + prevElement.height)\` → use as \`margin-top\` or \`gap\`
`;
    out += `  - **Centered**: if \`|element.centerX - ${ca.centerX}| < 20px\` → use \`margin-inline: auto\`
`;
  } else {
    out += `- No distinct content container — elements positioned relative to full viewport
`;
    out += `- Pixel → CSS translation:
`;
    out += `  - **Width as % of viewport**: \`element.width / ${viewport.width} × 100\` → use as \`width: X%\`
`;
    out += `  - **Centered**: if \`|(element.x + element.width/2) - ${Math.round(viewport.width / 2)}| < 20px\` → use \`margin-inline: auto\`
`;
  }
  out += "\n";
  return out;
}
function formatParentContext(selector) {
  const ctx = getElementCSSContext(selector);
  if (!ctx) return null;
  let desc = `\`${ctx.parentDisplay}\``;
  if (ctx.flexDirection) desc += `, flex-direction: \`${ctx.flexDirection}\``;
  if (ctx.gridCols) desc += `, grid-template-columns: \`${ctx.gridCols}\``;
  if (ctx.gap) desc += `, gap: \`${ctx.gap}\``;
  return `Parent: ${desc} (\`${ctx.parentSelector}\`)`;
}
function generateDesignOutput(placements, viewport, options, detailLevel = "standard") {
  if (placements.length === 0) return "";
  const sorted = [...placements].sort((a, b) => {
    if (Math.abs(a.y - b.y) < 20) return a.x - b.x;
    return a.y - b.y;
  });
  let out = "";
  if (options?.blankCanvas) {
    out += `## Wireframe: New Page

`;
    if (options.wireframePurpose) {
      out += `> **Purpose:** ${options.wireframePurpose}
>
`;
    }
    out += `> ${placements.length} component${placements.length !== 1 ? "s" : ""} placed — this is a standalone wireframe, not related to the current page.
>
> This wireframe is a rough sketch for exploring ideas.

`;
  } else {
    out += `## Design Layout

> ${placements.length} component${placements.length !== 1 ? "s" : ""} placed

`;
  }
  if (detailLevel === "compact") {
    out += "### Components\n";
    sorted.forEach((c, i) => {
      const label = COMPONENT_MAP[c.type]?.label || c.type;
      out += `${i + 1}. **${label}** — \`${Math.round(c.width)}×${Math.round(c.height)}px\` at \`(${Math.round(c.x)}, ${Math.round(c.y)})\`
`;
    });
    return out;
  }
  const layout = getPageLayout(viewport);
  out += formatReferenceFrame(layout);
  out += "### Components\n";
  sorted.forEach((c, i) => {
    const label = COMPONENT_MAP[c.type]?.label || c.type;
    const rect = { x: c.x, y: c.y, width: c.width, height: c.height };
    out += `${i + 1}. **${label}** — \`${Math.round(c.width)}×${Math.round(c.height)}px\` at \`(${Math.round(c.x)}, ${Math.round(c.y)})\`
`;
    const ctx = getSpatialContext(rect);
    const includeLeftRight = detailLevel === "detailed" || detailLevel === "forensic";
    const lines = formatSpatialLines(ctx, { includeLeftRight });
    for (const line of lines) {
      out += `   - ${line}
`;
    }
    const cssPos = formatCSSPosition(rect, layout);
    if (cssPos) {
      out += `   - CSS: ${cssPos}
`;
    }
  });
  out += "\n### Layout Analysis\n";
  const rows = [];
  for (const c of sorted) {
    const existing = rows.find((r) => Math.abs(r.y - c.y) < 30);
    if (existing) {
      existing.items.push(c);
    } else {
      rows.push({ y: c.y, items: [c] });
    }
  }
  rows.sort((a, b) => a.y - b.y);
  rows.forEach((row, i) => {
    row.items.sort((a, b) => a.x - b.x);
    const labels = row.items.map((c) => COMPONENT_MAP[c.type]?.label || c.type);
    if (row.items.length === 1) {
      const c = row.items[0];
      const isFullWidth = c.width > viewport.width * 0.8;
      out += `- Row ${i + 1} (y≈${Math.round(row.y)}): ${labels[0]}${isFullWidth ? " — full width" : ""}
`;
    } else {
      out += `- Row ${i + 1} (y≈${Math.round(row.y)}): ${labels.join(" | ")} — ${row.items.length} items side by side
`;
    }
  });
  if (detailLevel === "detailed" || detailLevel === "forensic") {
    out += "\n### Spacing & Gaps\n";
    for (let i = 0; i < sorted.length - 1; i++) {
      const a = sorted[i];
      const b = sorted[i + 1];
      const labelA = COMPONENT_MAP[a.type]?.label || a.type;
      const labelB = COMPONENT_MAP[b.type]?.label || b.type;
      const vGap = Math.round(b.y - (a.y + a.height));
      const hGap = Math.round(b.x - (a.x + a.width));
      if (Math.abs(a.y - b.y) < 30) {
        out += `- ${labelA} → ${labelB}: \`${hGap}px\` horizontal gap
`;
      } else {
        out += `- ${labelA} → ${labelB}: \`${vGap}px\` vertical gap
`;
      }
    }
    if (detailLevel === "forensic" && sorted.length > 2) {
      out += "\n### All Pairwise Gaps\n";
      for (let i = 0; i < sorted.length; i++) {
        for (let j = i + 1; j < sorted.length; j++) {
          const a = sorted[i];
          const b = sorted[j];
          const labelA = COMPONENT_MAP[a.type]?.label || a.type;
          const labelB = COMPONENT_MAP[b.type]?.label || b.type;
          const vGap = Math.round(b.y - (a.y + a.height));
          const hGap = Math.round(b.x - (a.x + a.width));
          out += `- ${labelA} ↔ ${labelB}: h=\`${hGap}px\` v=\`${vGap}px\`
`;
        }
      }
    }
    if (detailLevel === "forensic") {
      out += "\n### Z-Order (placement order)\n";
      placements.forEach((c, i) => {
        const label = COMPONENT_MAP[c.type]?.label || c.type;
        out += `${i}. ${label} at \`(${Math.round(c.x)}, ${Math.round(c.y)})\`
`;
      });
    }
  }
  out += "\n### Suggested Implementation\n";
  const hasNav = sorted.some((c) => c.type === "navigation");
  const hasHero = sorted.some((c) => c.type === "hero");
  const hasSidebar = sorted.some((c) => c.type === "sidebar");
  const hasFooter = sorted.some((c) => c.type === "footer");
  const cards = sorted.filter((c) => c.type === "card");
  const forms = sorted.filter((c) => c.type === "form");
  const tables = sorted.filter((c) => c.type === "table");
  const modals = sorted.filter((c) => c.type === "modal");
  if (hasNav) out += "- Top navigation bar with logo + nav links + CTA\n";
  if (hasHero) out += "- Hero section with heading, subtext, and call-to-action\n";
  if (hasSidebar) out += "- Sidebar layout — use CSS Grid with sidebar + main content area\n";
  if (cards.length > 1) out += `- ${cards.length}-column card grid — use CSS Grid or Flexbox
`;
  else if (cards.length === 1) out += "- Card component with image + content area\n";
  if (forms.length > 0) out += `- ${forms.length} form${forms.length > 1 ? "s" : ""} — add proper labels, validation, and submit handling
`;
  if (tables.length > 0) out += "- Data table — consider sortable columns and pagination\n";
  if (modals.length > 0) out += "- Modal dialog — add overlay backdrop and focus trapping\n";
  if (hasFooter) out += "- Multi-column footer with links\n";
  if (detailLevel === "detailed" || detailLevel === "forensic") {
    out += "\n### CSS Suggestions\n";
    if (hasSidebar) {
      const sidebar = sorted.find((c) => c.type === "sidebar");
      out += `- \`display: grid; grid-template-columns: ${Math.round(sidebar.width)}px 1fr;\`
`;
    }
    if (cards.length > 1) {
      const cardW = Math.round(cards[0].width);
      out += `- \`display: grid; grid-template-columns: repeat(${cards.length}, ${cardW}px); gap: 16px;\`
`;
    }
    if (hasNav) {
      out += `- Navigation: \`position: sticky; top: 0; z-index: 50;\`
`;
    }
  }
  return out;
}
function generateRearrangeOutput(state, detailLevel = "standard", viewport) {
  const { sections } = state;
  const changed = [];
  for (const s2 of sections) {
    const o = s2.originalRect;
    const c = s2.currentRect;
    const posMoved = Math.abs(o.x - c.x) > 1 || Math.abs(o.y - c.y) > 1;
    const sizeChanged = Math.abs(o.width - c.width) > 1 || Math.abs(o.height - c.height) > 1;
    if (!posMoved && !sizeChanged) {
      if (detailLevel === "forensic") {
        changed.push({ section: s2, posMoved: false, sizeChanged: false });
      }
      continue;
    }
    changed.push({ section: s2, posMoved, sizeChanged });
  }
  if (changed.length === 0) return "";
  if (detailLevel !== "forensic" && changed.every((e) => !e.posMoved && !e.sizeChanged)) return "";
  let out = "## Suggested Layout Changes\n\n";
  const vw = viewport ? viewport.width : typeof window !== "undefined" ? window.innerWidth : 0;
  const vh = viewport ? viewport.height : typeof window !== "undefined" ? window.innerHeight : 0;
  const layout = getPageLayout({ width: vw, height: vh });
  if (detailLevel !== "compact") {
    out += formatReferenceFrame(layout);
  }
  if (detailLevel === "forensic") {
    out += `> Detected at: \`${new Date(state.detectedAt).toISOString()}\`
`;
    out += `> Total sections: ${sections.length}

`;
  }
  const siblingCandidates = (rects) => sections.map((s2) => ({ label: s2.label, selector: s2.selector, rect: rects === "original" ? s2.originalRect : s2.currentRect }));
  out += "**Changes:**\n";
  for (const { section: s2, posMoved, sizeChanged } of changed) {
    const o = s2.originalRect;
    const c = s2.currentRect;
    if (!posMoved && !sizeChanged) {
      out += `- ${s2.label} — unchanged at (${Math.round(c.x)}, ${Math.round(c.y)}) ${Math.round(c.width)}×${Math.round(c.height)}px
`;
      continue;
    }
    if (detailLevel === "compact") {
      if (posMoved && sizeChanged) {
        out += `- Suggested: move **${s2.label}** to (${Math.round(c.x)}, ${Math.round(c.y)}) ${Math.round(c.width)}×${Math.round(c.height)}px
`;
      } else if (posMoved) {
        out += `- Suggested: move **${s2.label}** to (${Math.round(c.x)}, ${Math.round(c.y)})
`;
      } else {
        out += `- Suggested: resize **${s2.label}** to ${Math.round(c.width)}×${Math.round(c.height)}px
`;
      }
      continue;
    }
    if (posMoved && sizeChanged) {
      out += `- Suggested: move and resize **${s2.label}**
`;
    } else if (posMoved) {
      out += `- Suggested: move **${s2.label}**
`;
    } else {
      out += `- Suggested: resize **${s2.label}** from ${Math.round(o.width)}×${Math.round(o.height)}px to ${Math.round(c.width)}×${Math.round(c.height)}px
`;
    }
    if (posMoved) {
      const origCtx = getSpatialContext(o, siblingCandidates("original"));
      const currCtx = getSpatialContext(c, siblingCandidates("current"));
      const wasSize = sizeChanged ? { width: o.width, height: o.height } : void 0;
      out += `  - Currently ${formatPositionSummary(origCtx, { x: o.x, y: o.y }, wasSize)}
`;
      const nowSize = sizeChanged ? { width: c.width, height: c.height } : void 0;
      const coordStr = `at (${Math.round(c.x)}, ${Math.round(c.y)})`;
      const sizeStr = nowSize ? `, ${Math.round(nowSize.width)}×${Math.round(nowSize.height)}px` : "";
      const includeLeftRight = detailLevel === "detailed" || detailLevel === "forensic";
      const nowLines = formatSpatialLines(currCtx, { includeLeftRight });
      if (nowLines.length > 0) {
        out += `  - Suggested position ${coordStr}${sizeStr}: ${nowLines[0]}
`;
        for (let i = 1; i < nowLines.length; i++) {
          out += `    ${nowLines[i]}
`;
        }
      } else {
        out += `  - Suggested position ${coordStr}${sizeStr}
`;
      }
      const cssPos = formatCSSPosition(c, layout);
      if (cssPos) {
        out += `  - CSS: ${cssPos}
`;
      }
    }
    const parentCtx = formatParentContext(s2.selector);
    if (parentCtx) {
      out += `  - ${parentCtx}
`;
    }
    out += `  - Selector: \`${s2.selector}\`
`;
    if (detailLevel === "detailed" || detailLevel === "forensic") {
      const ident = s2.className ? `${s2.tagName}.${s2.className.split(" ")[0]}` : s2.tagName;
      if (ident !== s2.selector) {
        out += `  - Element: \`${ident}\`
`;
      }
      if (s2.role) out += `  - Role: \`${s2.role}\`
`;
      if (detailLevel === "forensic" && s2.textSnippet) {
        out += `  - Text: "${s2.textSnippet}"
`;
      }
    }
    if (detailLevel === "forensic") {
      out += `  - Original rect: \`{ x: ${Math.round(o.x)}, y: ${Math.round(o.y)}, w: ${Math.round(o.width)}, h: ${Math.round(o.height)} }\`
`;
      out += `  - Current rect: \`{ x: ${Math.round(c.x)}, y: ${Math.round(c.y)}, w: ${Math.round(c.width)}, h: ${Math.round(c.height)} }\`
`;
    }
  }
  if (detailLevel !== "compact") {
    const movedSections = changed.filter((e) => e.posMoved).map((e) => ({ label: e.section.label, originalRect: e.section.originalRect, currentRect: e.section.currentRect }));
    const patterns = analyzeLayoutPatterns(movedSections);
    if (patterns.length > 0) {
      out += "\n### Layout Summary\n";
      for (const line of patterns) {
        out += `- ${line}
`;
      }
    }
  }
  if (detailLevel !== "compact" && sections.length > 1) {
    out += "\n### All Sections (current positions)\n";
    const sortedSections = [...sections].sort((a, b) => {
      if (Math.abs(a.currentRect.y - b.currentRect.y) < 20) return a.currentRect.x - b.currentRect.x;
      return a.currentRect.y - b.currentRect.y;
    });
    for (const s2 of sortedSections) {
      const r = s2.currentRect;
      const moved = Math.abs(r.x - s2.originalRect.x) > 1 || Math.abs(r.y - s2.originalRect.y) > 1 || Math.abs(r.width - s2.originalRect.width) > 1 || Math.abs(r.height - s2.originalRect.height) > 1;
      out += `- ${s2.label}: \`${Math.round(r.width)}×${Math.round(r.height)}px\` at \`(${Math.round(r.x)}, ${Math.round(r.y)})\`${moved ? " ← suggested" : ""}
`;
    }
  }
  return out;
}
var STORAGE_PREFIX = "feedback-annotations-";
var DEFAULT_RETENTION_DAYS = 7;
function getStorageKey(pathname) {
  return `${STORAGE_PREFIX}${pathname}`;
}
function loadAnnotations(pathname) {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(getStorageKey(pathname));
    if (!stored) return [];
    const data = JSON.parse(stored);
    const cutoff = Date.now() - DEFAULT_RETENTION_DAYS * 24 * 60 * 60 * 1e3;
    return data.filter((a) => !a.timestamp || a.timestamp > cutoff);
  } catch {
    return [];
  }
}
function saveAnnotations(pathname, annotations) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(getStorageKey(pathname), JSON.stringify(annotations));
  } catch {
  }
}
function loadAllAnnotations() {
  const result = /* @__PURE__ */ new Map();
  if (typeof window === "undefined") return result;
  try {
    const cutoff = Date.now() - DEFAULT_RETENTION_DAYS * 24 * 60 * 60 * 1e3;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_PREFIX)) {
        const pathname = key.slice(STORAGE_PREFIX.length);
        const stored = localStorage.getItem(key);
        if (stored) {
          const data = JSON.parse(stored);
          const filtered = data.filter((a) => !a.timestamp || a.timestamp > cutoff);
          if (filtered.length > 0) {
            result.set(pathname, filtered);
          }
        }
      }
    }
  } catch {
  }
  return result;
}
function saveAnnotationsWithSyncMarker(pathname, annotations, sessionId) {
  const marked = annotations.map((annotation) => ({ ...annotation, _syncedTo: sessionId }));
  saveAnnotations(pathname, marked);
}
var DESIGN_PREFIX = "agentation-design-";
function loadDesignPlacements(pathname) {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(`${DESIGN_PREFIX}${pathname}`);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}
function saveDesignPlacements(pathname, placements) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${DESIGN_PREFIX}${pathname}`, JSON.stringify(placements));
  } catch {
  }
}
function clearDesignPlacements(pathname) {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(`${DESIGN_PREFIX}${pathname}`);
  } catch {
  }
}
var REARRANGE_PREFIX = "agentation-rearrange-";
function loadRearrangeState(pathname) {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(`${REARRANGE_PREFIX}${pathname}`);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}
function saveRearrangeState(pathname, state) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${REARRANGE_PREFIX}${pathname}`, JSON.stringify(state));
  } catch {
  }
}
function clearRearrangeState(pathname) {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(`${REARRANGE_PREFIX}${pathname}`);
  } catch {
  }
}
var WIREFRAME_PREFIX = "agentation-wireframe-";
function loadWireframeState(pathname) {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(`${WIREFRAME_PREFIX}${pathname}`);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}
function saveWireframeState(pathname, state) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${WIREFRAME_PREFIX}${pathname}`, JSON.stringify(state));
  } catch {
  }
}
function clearWireframeState(pathname) {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(`${WIREFRAME_PREFIX}${pathname}`);
  } catch {
  }
}
var SESSION_PREFIX = "agentation-session-";
function getSessionStorageKey(pathname) {
  return `${SESSION_PREFIX}${pathname}`;
}
function loadSessionId(pathname) {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(getSessionStorageKey(pathname));
  } catch {
    return null;
  }
}
function saveSessionId(pathname, sessionId) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(getSessionStorageKey(pathname), sessionId);
  } catch {
  }
}
function clearSessionId(pathname) {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(getSessionStorageKey(pathname));
  } catch {
  }
}
var TOOLBAR_HIDDEN_SESSION_KEY = `${SESSION_PREFIX}toolbar-hidden`;
function loadToolbarHidden() {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(TOOLBAR_HIDDEN_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}
function saveToolbarHidden(hidden) {
  if (typeof window === "undefined") return;
  try {
    if (hidden) {
      sessionStorage.setItem(TOOLBAR_HIDDEN_SESSION_KEY, "1");
    }
  } catch {
  }
}
async function createSession(endpoint, url) {
  const response = await fetch(`${endpoint}/sessions`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
  if (!response.ok) {
    throw new Error(`Failed to create session: ${response.status}`);
  }
  return response.json();
}
async function getSession(endpoint, sessionId) {
  const response = await fetch(`${endpoint}/sessions/${sessionId}`);
  if (!response.ok) {
    throw new Error(`Failed to get session: ${response.status}`);
  }
  return response.json();
}
async function syncAnnotation(endpoint, sessionId, annotation) {
  const response = await fetch(`${endpoint}/sessions/${sessionId}/annotations`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(annotation) });
  if (!response.ok) {
    throw new Error(`Failed to sync annotation: ${response.status}`);
  }
  return response.json();
}
async function updateAnnotation(endpoint, annotationId, data) {
  const response = await fetch(`${endpoint}/annotations/${annotationId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  if (!response.ok) {
    throw new Error(`Failed to update annotation: ${response.status}`);
  }
  return response.json();
}
async function deleteAnnotation(endpoint, annotationId) {
  const response = await fetch(`${endpoint}/annotations/${annotationId}`, { method: "DELETE" });
  if (!response.ok) {
    throw new Error(`Failed to delete annotation: ${response.status}`);
  }
}
var DEFAULT_SKIP_EXACT = /* @__PURE__ */ new Set([
  "Fragment",
  "Suspense",
  "Routes",
  "Route",
  "Outlet",
  // Framework internals - exact matches
  "Root",
  "ErrorBoundaryHandler",
  "HotReload",
  "Hot",
  // Solid-specific internals
  "Show",
  "For",
  "Index",
  "Switch",
  "Match",
  "Dynamic",
  "Portal",
  "ErrorBoundary"
]);
var DEFAULT_SKIP_PATTERNS = [
  /Boundary$/,
  // ErrorBoundary, RedirectBoundary
  /BoundaryHandler$/,
  // ErrorBoundaryHandler
  /Provider$/,
  // ThemeProvider, Context.Provider
  /Consumer$/,
  // Context.Consumer
  /^(Inner|Outer)/,
  // InnerLayoutRouter
  /Router$/,
  // AppRouter, BrowserRouter
  /Context$/,
  // LayoutRouterContext
  /^Hot(Reload)?$/,
  // HotReload (exact match to avoid false positives)
  /^(Dev|Solid)(Overlay|Tools|Root)/,
  // DevTools, SolidDevOverlay
  /Overlay$/,
  // DevOverlay, ErrorOverlay
  /Handler$/,
  // ScrollAndFocusHandler, ErrorBoundaryHandler
  /^With[A-Z]/,
  // withRouter, WithAuth (HOCs)
  /Wrapper$/,
  // Generic wrappers
  /^Root$/
  // Generic Root component
];
var DEFAULT_USER_PATTERNS = [
  /Page$/,
  // HomePage, InstallPage
  /View$/,
  // ListView, DetailView
  /Screen$/,
  // HomeScreen
  /Section$/,
  // HeroSection
  /Card$/,
  // ProductCard
  /List$/,
  // UserList
  /Item$/,
  // ListItem, MenuItem
  /Form$/,
  // LoginForm
  /Modal$/,
  // ConfirmModal
  /Dialog$/,
  // AlertDialog
  /Button$/,
  // SubmitButton (but not all buttons)
  /Nav$/,
  // SideNav, TopNav
  /Header$/,
  // PageHeader
  /Footer$/,
  // PageFooter
  /Layout$/,
  // MainLayout (careful - could be framework)
  /Panel$/,
  // SidePanel
  /Tab$/,
  // SettingsTab
  /Menu$/
  // DropdownMenu
];
function resolveConfig(config) {
  const mode = config?.mode ?? "filtered";
  let skipExact = DEFAULT_SKIP_EXACT;
  if (config?.skipExact) {
    const additional = config.skipExact instanceof Set ? config.skipExact : new Set(config.skipExact);
    skipExact = /* @__PURE__ */ new Set([...DEFAULT_SKIP_EXACT, ...additional]);
  }
  return { maxComponents: config?.maxComponents ?? 6, maxDepth: config?.maxDepth ?? 30, mode, skipExact, skipPatterns: config?.skipPatterns ? [...DEFAULT_SKIP_PATTERNS, ...config.skipPatterns] : DEFAULT_SKIP_PATTERNS, userPatterns: config?.userPatterns ?? DEFAULT_USER_PATTERNS, filter: config?.filter };
}
function normalizeComponentName(name) {
  return name.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/([A-Z])([A-Z][a-z])/g, "$1-$2").toLowerCase();
}
function getAncestorClasses(element, maxDepth = 10) {
  const classes = /* @__PURE__ */ new Set();
  let current = element;
  let depth = 0;
  while (current && depth < maxDepth) {
    if (current.className && typeof current.className === "string") {
      current.className.split(/\s+/).forEach((cls) => {
        if (cls.length > 1) {
          const normalized = cls.replace(/[_][a-zA-Z0-9]{5,}.*$/, "").toLowerCase();
          if (normalized.length > 1) {
            classes.add(normalized);
          }
        }
      });
    }
    current = current.parentElement;
    depth++;
  }
  return classes;
}
function componentCorrelatesWithDOM(componentName, domClasses) {
  const normalized = normalizeComponentName(componentName);
  for (const cls of domClasses) {
    if (cls === normalized) return true;
    const componentWords = normalized.split("-").filter((w) => w.length > 2);
    const classWords = cls.split("-").filter((w) => w.length > 2);
    for (const cWord of componentWords) {
      for (const dWord of classWords) {
        if (cWord === dWord || cWord.includes(dWord) || dWord.includes(cWord)) {
          return true;
        }
      }
    }
  }
  return false;
}
function shouldIncludeComponent(name, depth, config, domClasses) {
  if (config.filter) {
    return config.filter(name, depth);
  }
  switch (config.mode) {
    case "all":
      return true;
    case "filtered":
      if (config.skipExact.has(name)) {
        return false;
      }
      if (config.skipPatterns.some((p) => p.test(name))) {
        return false;
      }
      return true;
    case "smart":
      if (config.skipExact.has(name)) {
        return false;
      }
      if (config.skipPatterns.some((p) => p.test(name))) {
        return false;
      }
      if (domClasses && componentCorrelatesWithDOM(name, domClasses)) {
        return true;
      }
      if (config.userPatterns.some((p) => p.test(name))) {
        return true;
      }
      return false;
    default:
      return true;
  }
}
var rootOwner = null;
var trackedComponentOwners = /* @__PURE__ */ new Set();
var ownerTrackingInstalled = false;
function initOwnerTracking() {
  if (ownerTrackingInstalled || typeof window === "undefined") return;
  ownerTrackingInstalled = true;
  try {
    if (!DEV?.hooks) return;
    const prev = DEV.hooks.afterCreateOwner;
    DEV.hooks.afterCreateOwner = (owner) => {
      queueMicrotask(() => {
        if (owner && owner.component && owner.name) {
          trackedComponentOwners.add(owner);
        }
      });
      if (typeof prev === "function") prev(owner);
    };
  } catch (err) {
    console.warn("[agentation] initOwnerTracking error:", err);
  }
}
function setRootOwner(owner) {
  if (owner && typeof owner === "object") {
    let current = owner;
    while (current.owner && typeof current.owner === "object") {
      current = current.owner;
    }
    rootOwner = current;
  }
}
var solidDetectionCache = null;
var componentCacheAll = /* @__PURE__ */ new WeakMap();
function isSolidPage() {
  if (solidDetectionCache !== null) {
    return solidDetectionCache;
  }
  if (typeof document === "undefined") {
    return false;
  }
  if (rootOwner) {
    solidDetectionCache = true;
    return true;
  }
  try {
    if (typeof globalThis !== "undefined" && globalThis.Solid$$) {
      solidDetectionCache = true;
      return true;
    }
  } catch {
  }
  try {
    if (typeof window !== "undefined" && window.__SOLID_DEVTOOLS_GLOBAL_HOOK__) {
      solidDetectionCache = true;
      return true;
    }
  } catch {
  }
  if (document.body) {
    for (const child of document.body.children) {
      if (hasOwnerProperty(child)) {
        solidDetectionCache = true;
        return true;
      }
    }
  }
  solidDetectionCache = false;
  return false;
}
function hasOwnerProperty(element) {
  try {
    const keys = Object.keys(element);
    if (keys.some((key) => key === "__$owner" || key.startsWith("__solid") || key.startsWith("__owner"))) {
      return true;
    }
  } catch {
  }
  return false;
}
function ownerContainsElement(owner, target) {
  let dom = owner.tValue !== void 0 ? owner.tValue : owner.value;
  if (!dom) return false;
  if (typeof dom === "function") {
    try {
      dom = dom();
    } catch {
      return false;
    }
  }
  if (!dom) return false;
  if (dom instanceof Node) {
    return dom === target || dom.contains(target);
  }
  if (Array.isArray(dom)) {
    for (const item of dom) {
      if (item instanceof Node && (item === target || item.contains(target))) {
        return true;
      }
    }
  }
  return false;
}
function collectComponentsFromTree(root, target, config, domClasses) {
  const components = [];
  const visited = /* @__PURE__ */ new WeakSet();
  let depth = 0;
  function walk(owner) {
    if (components.length >= config.maxComponents || depth >= config.maxDepth || visited.has(owner)) {
      return;
    }
    visited.add(owner);
    if (owner.component) {
      const rawName = owner.name || owner.componentName;
      if (rawName && typeof rawName === "string") {
        const name = rawName.replace(/^\[solid-refresh\]/, "");
        if (!isMinifiedName(name) && ownerContainsElement(owner, target) && shouldIncludeComponent(name, depth, config, domClasses)) {
          components.push(name);
        }
      }
    }
    depth++;
    if (owner.owned) {
      for (const child of owner.owned) {
        if (child && typeof child === "object") {
          walk(child);
        }
      }
    }
    depth--;
  }
  walk(root);
  return components;
}
function getOwnerFromElement(element) {
  try {
    const record = element;
    if (record.__$owner && typeof record.__$owner === "object") {
      return record.__$owner;
    }
    const keys = Object.keys(element);
    for (const key of keys) {
      if (key.startsWith("__solid") || key.startsWith("__owner") || key.includes("owner")) {
        const value = record[key];
        if (value && typeof value === "object") {
          const candidate = value;
          if ("name" in candidate || "componentName" in candidate || "owner" in candidate || "parent" in candidate) {
            return candidate;
          }
        }
      }
    }
    const symbols = Object.getOwnPropertySymbols(element);
    for (const sym of symbols) {
      const desc = sym.description || String(sym);
      if (desc.includes("solid") || desc.includes("owner") || desc.includes("SOLID")) {
        const value = record[sym];
        if (value && typeof value === "object") {
          const candidate = value;
          if ("name" in candidate || "componentName" in candidate || "owner" in candidate || "parent" in candidate) {
            return candidate;
          }
        }
      }
    }
  } catch {
  }
  return null;
}
function getNameFromOwner(owner) {
  if (owner.componentName && typeof owner.componentName === "string") {
    return owner.componentName;
  }
  if (owner.name && typeof owner.name === "string") {
    return owner.name;
  }
  return null;
}
function getParentOwner(owner) {
  if (owner.owner && typeof owner.owner === "object") {
    return owner.owner;
  }
  if (owner.parent && typeof owner.parent === "object") {
    return owner.parent;
  }
  return null;
}
function isMinifiedName(name) {
  if (name.length <= 2) return true;
  if (name.length <= 3 && name === name.toLowerCase()) return true;
  return false;
}
function getSolidComponentName(element, config) {
  const resolved = resolveConfig(config);
  const useCache = resolved.mode === "all";
  if (useCache) {
    const cached = componentCacheAll.get(element);
    if (cached !== void 0) {
      return cached;
    }
  }
  if (!isSolidPage()) {
    const result2 = { path: null, components: [] };
    if (useCache) {
      componentCacheAll.set(element, result2);
    }
    return result2;
  }
  const domClasses = resolved.mode === "smart" ? getAncestorClasses(element) : void 0;
  let components = [];
  if (rootOwner) {
    try {
      components = collectComponentsFromTree(rootOwner, element, resolved, domClasses);
    } catch {
    }
  }
  if (components.length === 0 && trackedComponentOwners.size > 0) {
    try {
      const matches = [];
      for (const owner of trackedComponentOwners) {
        if (ownerContainsElement(owner, element)) {
          const rawName = owner.name || owner.componentName;
          if (rawName && typeof rawName === "string") {
            const name = rawName.replace(/^\[solid-refresh\]/, "");
            if (!isMinifiedName(name) && shouldIncludeComponent(name, 0, resolved, domClasses)) {
              let depth = 0;
              let p = owner.owner;
              while (p && depth < 50) {
                depth++;
                p = p.owner || p.parent;
              }
              matches.push({ name, depth });
            }
          }
        }
      }
      matches.sort((a, b) => a.depth - b.depth);
      components = matches.slice(0, resolved.maxComponents).map((m) => m.name);
    } catch {
    }
  }
  if (components.length === 0) {
    try {
      let owner = getOwnerFromElement(element);
      let depth = 0;
      while (owner && depth < resolved.maxDepth && components.length < resolved.maxComponents) {
        const name = getNameFromOwner(owner);
        if (name && !isMinifiedName(name) && shouldIncludeComponent(name, depth, resolved, domClasses)) {
          components.push(name);
        }
        owner = getParentOwner(owner);
        depth++;
      }
    } catch {
    }
  }
  if (components.length === 0) {
    const result2 = { path: null, components: [] };
    if (useCache) {
      componentCacheAll.set(element, result2);
    }
    return result2;
  }
  const path = components.map((c) => `<${c}>`).join(" ");
  const result = { path, components };
  if (useCache) {
    componentCacheAll.set(element, result);
  }
  return result;
}
var css5 = '.styles-module__toolbar___wNsdK svg[fill=none],\n.styles-module__markersLayer___-25j1 svg[fill=none],\n.styles-module__fixedMarkersLayer___ffyX6 svg[fill=none] {\n  fill: none !important;\n}\n.styles-module__toolbar___wNsdK svg[fill=none] :not([fill]),\n.styles-module__markersLayer___-25j1 svg[fill=none] :not([fill]),\n.styles-module__fixedMarkersLayer___ffyX6 svg[fill=none] :not([fill]) {\n  fill: none !important;\n}\n\n.styles-module__controlsContent___9GJWU :where(button, input, select, textarea, label) {\n  background: unset;\n  border: unset;\n  border-radius: unset;\n  padding: unset;\n  margin: unset;\n  color: unset;\n  font-family: unset;\n  font-weight: unset;\n  font-style: unset;\n  line-height: unset;\n  letter-spacing: unset;\n  text-transform: unset;\n  text-decoration: unset;\n  box-shadow: unset;\n  outline: unset;\n}\n\n@keyframes styles-module__toolbarEnter___u8RRu {\n  from {\n    opacity: 0;\n    transform: scale(0.5) rotate(90deg);\n  }\n  to {\n    opacity: 1;\n    transform: scale(1) rotate(0deg);\n  }\n}\n@keyframes styles-module__toolbarHide___y8kaT {\n  from {\n    opacity: 1;\n    transform: scale(1);\n  }\n  to {\n    opacity: 0;\n    transform: scale(0.8);\n  }\n}\n@keyframes styles-module__badgeEnter___mVQLj {\n  from {\n    opacity: 0;\n    transform: scale(0);\n  }\n  to {\n    opacity: 1;\n    transform: scale(1);\n  }\n}\n@keyframes styles-module__scaleIn___c-r1K {\n  from {\n    opacity: 0;\n    transform: scale(0.85);\n  }\n  to {\n    opacity: 1;\n    transform: scale(1);\n  }\n}\n@keyframes styles-module__scaleOut___Wctwz {\n  from {\n    opacity: 1;\n    transform: scale(1);\n  }\n  to {\n    opacity: 0;\n    transform: scale(0.85);\n  }\n}\n@keyframes styles-module__slideUp___kgD36 {\n  from {\n    opacity: 0;\n    transform: scale(0.85) translateY(8px);\n  }\n  to {\n    opacity: 1;\n    transform: scale(1) translateY(0);\n  }\n}\n@keyframes styles-module__slideDown___zcdje {\n  from {\n    opacity: 1;\n    transform: scale(1) translateY(0);\n  }\n  to {\n    opacity: 0;\n    transform: scale(0.85) translateY(8px);\n  }\n}\n@keyframes styles-module__fadeIn___b9qmf {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes styles-module__fadeOut___6Ut6- {\n  from {\n    opacity: 1;\n  }\n  to {\n    opacity: 0;\n  }\n}\n@keyframes styles-module__hoverHighlightIn___6WYHY {\n  from {\n    opacity: 0;\n    transform: scale(0.98);\n  }\n  to {\n    opacity: 1;\n    transform: scale(1);\n  }\n}\n@keyframes styles-module__hoverTooltipIn___FYGQx {\n  from {\n    opacity: 0;\n    transform: scale(0.95) translateY(4px);\n  }\n  to {\n    opacity: 1;\n    transform: scale(1) translateY(0);\n  }\n}\n.styles-module__disableTransitions___EopxO :is(*, *::before, *::after) {\n  transition: none !important;\n}\n\n.styles-module__toolbar___wNsdK {\n  position: fixed;\n  bottom: 1.25rem;\n  right: 1.25rem;\n  width: 337px;\n  z-index: 100000;\n  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n  pointer-events: none;\n  transition: left 0s, top 0s, right 0s, bottom 0s;\n}\n\n:where(.styles-module__toolbar___wNsdK) {\n  bottom: 1.25rem;\n  right: 1.25rem;\n}\n\n.styles-module__toolbarContainer___dIhma {\n  position: relative;\n  user-select: none;\n  margin-left: auto;\n  align-self: flex-end;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: #1a1a1a;\n  color: #fff;\n  border: none;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(0, 0, 0, 0.1);\n  pointer-events: auto;\n  transition: width 0.4s cubic-bezier(0.19, 1, 0.22, 1), transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);\n}\n.styles-module__toolbarContainer___dIhma.styles-module__entrance___sgHd8 {\n  animation: styles-module__toolbarEnter___u8RRu 0.5s cubic-bezier(0.34, 1.2, 0.64, 1) forwards;\n}\n.styles-module__toolbarContainer___dIhma.styles-module__hiding___1td44 {\n  animation: styles-module__toolbarHide___y8kaT 0.4s cubic-bezier(0.4, 0, 1, 1) forwards;\n  pointer-events: none;\n}\n.styles-module__toolbarContainer___dIhma.styles-module__collapsed___Rydsn {\n  width: 44px;\n  height: 44px;\n  border-radius: 22px;\n  padding: 0;\n  cursor: pointer;\n}\n.styles-module__toolbarContainer___dIhma.styles-module__collapsed___Rydsn svg {\n  margin-top: -1px;\n}\n.styles-module__toolbarContainer___dIhma.styles-module__collapsed___Rydsn:hover {\n  background: #2a2a2a;\n}\n.styles-module__toolbarContainer___dIhma.styles-module__collapsed___Rydsn:active {\n  transform: scale(0.95);\n}\n.styles-module__toolbarContainer___dIhma.styles-module__expanded___ofKPx {\n  height: 44px;\n  border-radius: 1.5rem;\n  padding: 0.375rem;\n  width: 297px;\n}\n.styles-module__toolbarContainer___dIhma.styles-module__expanded___ofKPx.styles-module__serverConnected___Gfbou {\n  width: 337px;\n}\n\n.styles-module__toggleContent___0yfyP {\n  position: absolute;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: opacity 0.1s cubic-bezier(0.19, 1, 0.22, 1);\n}\n.styles-module__toggleContent___0yfyP.styles-module__visible___KHwEW {\n  opacity: 1;\n  visibility: visible;\n  pointer-events: auto;\n}\n.styles-module__toggleContent___0yfyP.styles-module__hidden___Ae8H4 {\n  opacity: 0;\n  pointer-events: none;\n}\n\n.styles-module__controlsContent___9GJWU {\n  display: flex;\n  align-items: center;\n  gap: 0.375rem;\n  transition: filter 0.8s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.8s cubic-bezier(0.19, 1, 0.22, 1), transform 0.6s cubic-bezier(0.19, 1, 0.22, 1);\n}\n.styles-module__controlsContent___9GJWU.styles-module__visible___KHwEW {\n  opacity: 1;\n  filter: blur(0px);\n  transform: scale(1);\n  visibility: visible;\n  pointer-events: auto;\n}\n.styles-module__controlsContent___9GJWU.styles-module__hidden___Ae8H4 {\n  pointer-events: none;\n  opacity: 0;\n  filter: blur(10px);\n  transform: scale(0.4);\n}\n\n.styles-module__badge___2XsgF {\n  position: absolute;\n  top: -13px;\n  right: -13px;\n  user-select: none;\n  min-width: 18px;\n  height: 18px;\n  padding: 0 5px;\n  border-radius: 9px;\n  background-color: var(--agentation-color-accent);\n  color: white;\n  font-size: 0.625rem;\n  font-weight: 600;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 0.04);\n  opacity: 1;\n  transition: transform 0.3s ease, opacity 0.2s ease;\n  transform: scale(1);\n}\n.styles-module__badge___2XsgF.styles-module__fadeOut___6Ut6- {\n  opacity: 0;\n  transform: scale(0);\n  pointer-events: none;\n}\n.styles-module__badge___2XsgF.styles-module__entrance___sgHd8 {\n  animation: styles-module__badgeEnter___mVQLj 0.3s cubic-bezier(0.34, 1.2, 0.64, 1) 0.4s both;\n}\n\n.styles-module__controlButton___8Q0jc {\n  position: relative;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 34px;\n  height: 34px;\n  border-radius: 50%;\n  border: none;\n  background: transparent;\n  color: rgba(255, 255, 255, 0.85);\n  transition: background-color 0.15s ease, color 0.15s ease, transform 0.1s ease, opacity 0.2s ease;\n}\n.styles-module__controlButton___8Q0jc:hover:not(:disabled):not([data-active=true]):not([data-failed=true]):not([data-auto-sync=true]):not([data-error=true]):not([data-no-hover=true]) {\n  background: rgba(255, 255, 255, 0.12);\n  color: #fff;\n}\n.styles-module__controlButton___8Q0jc:active:not(:disabled) {\n  transform: scale(0.92);\n}\n.styles-module__controlButton___8Q0jc:disabled {\n  opacity: 0.35;\n  cursor: not-allowed;\n}\n.styles-module__controlButton___8Q0jc[data-active=true] {\n  color: var(--agentation-color-blue);\n  background-color: color-mix(in srgb, var(--agentation-color-blue) 25%, transparent);\n}\n.styles-module__controlButton___8Q0jc[data-error=true] {\n  color: var(--agentation-color-red);\n  background-color: color-mix(in srgb, var(--agentation-color-red) 25%, transparent);\n}\n.styles-module__controlButton___8Q0jc[data-danger]:hover:not(:disabled):not([data-active=true]):not([data-failed=true]) {\n  background-color: color-mix(in srgb, var(--agentation-color-red) 25%, transparent);\n  color: var(--agentation-color-red);\n}\n.styles-module__controlButton___8Q0jc[data-no-hover=true], .styles-module__controlButton___8Q0jc.styles-module__statusShowing___te6iu {\n  cursor: default;\n  pointer-events: none;\n  background: transparent !important;\n}\n.styles-module__controlButton___8Q0jc[data-auto-sync=true] {\n  color: var(--agentation-color-green);\n  background: transparent;\n  cursor: default;\n}\n.styles-module__controlButton___8Q0jc[data-failed=true] {\n  color: var(--agentation-color-red);\n  background-color: color-mix(in srgb, var(--agentation-color-red) 25%, transparent);\n}\n\n.styles-module__buttonBadge___NeFWb {\n  position: absolute;\n  top: 0px;\n  right: 0px;\n  min-width: 16px;\n  height: 16px;\n  padding: 0 4px;\n  border-radius: 8px;\n  background-color: var(--agentation-color-accent);\n  color: white;\n  font-size: 0.625rem;\n  font-weight: 600;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  box-shadow: 0 0 0 2px #1a1a1a, 0 1px 3px rgba(0, 0, 0, 0.2);\n  pointer-events: none;\n}\n[data-agentation-theme=light] .styles-module__buttonBadge___NeFWb {\n  box-shadow: 0 0 0 2px #fff, 0 1px 3px rgba(0, 0, 0, 0.2);\n}\n\n@keyframes styles-module__mcpIndicatorPulseConnected___EDodZ {\n  0%, 100% {\n    box-shadow: 0 0 0 0 color-mix(in srgb, var(--agentation-color-green) 50%, transparent);\n  }\n  50% {\n    box-shadow: 0 0 0 5px color-mix(in srgb, var(--agentation-color-green) 0%, transparent);\n  }\n}\n@keyframes styles-module__mcpIndicatorPulseConnecting___cCYte {\n  0%, 100% {\n    box-shadow: 0 0 0 0 color-mix(in srgb, var(--agentation-color-yellow) 50%, transparent);\n  }\n  50% {\n    box-shadow: 0 0 0 5px color-mix(in srgb, var(--agentation-color-yellow) 0%, transparent);\n  }\n}\n.styles-module__mcpIndicator___zGJeL {\n  position: absolute;\n  top: 3px;\n  right: 3px;\n  width: 6px;\n  height: 6px;\n  border-radius: 50%;\n  pointer-events: none;\n  transition: background-color 0.3s ease, opacity 0.15s ease, transform 0.15s ease;\n  opacity: 1;\n  transform: scale(1);\n}\n.styles-module__mcpIndicator___zGJeL.styles-module__connected___7c28g {\n  background-color: var(--agentation-color-green);\n  animation: styles-module__mcpIndicatorPulseConnected___EDodZ 2.5s ease-in-out infinite;\n}\n.styles-module__mcpIndicator___zGJeL.styles-module__connecting___uo-CW {\n  background-color: var(--agentation-color-yellow);\n  animation: styles-module__mcpIndicatorPulseConnecting___cCYte 1.5s ease-in-out infinite;\n}\n.styles-module__mcpIndicator___zGJeL.styles-module__hidden___Ae8H4 {\n  opacity: 0;\n  transform: scale(0);\n  animation: none;\n}\n\n@keyframes styles-module__connectionPulse___-Zycw {\n  0%, 100% {\n    opacity: 1;\n    transform: scale(1);\n  }\n  50% {\n    opacity: 0.6;\n    transform: scale(0.9);\n  }\n}\n.styles-module__connectionIndicatorWrapper___L-e-3 {\n  width: 8px;\n  height: 34px;\n  margin-left: 6px;\n  margin-right: 6px;\n}\n\n.styles-module__connectionIndicator___afk9p {\n  position: relative;\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n  opacity: 0;\n  transition: opacity 0.3s ease, background-color 0.3s ease;\n  cursor: default;\n}\n\n.styles-module__connectionIndicatorVisible___C-i5B {\n  opacity: 1;\n}\n\n.styles-module__connectionIndicatorConnected___IY8pR {\n  background-color: var(--agentation-color-green);\n  animation: styles-module__connectionPulse___-Zycw 2.5s ease-in-out infinite;\n}\n\n.styles-module__connectionIndicatorDisconnected___kmpaZ {\n  background-color: var(--agentation-color-red);\n  animation: none;\n}\n\n.styles-module__connectionIndicatorConnecting___QmSLH {\n  background-color: var(--agentation-color-yellow);\n  animation: styles-module__connectionPulse___-Zycw 1s ease-in-out infinite;\n}\n\n.styles-module__buttonWrapper___rBcdv {\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.styles-module__buttonWrapper___rBcdv:hover .styles-module__buttonTooltip___Burd9 {\n  opacity: 1;\n  visibility: visible;\n  transform: translateX(-50%) scale(1);\n  transition-delay: 0.85s;\n}\n.styles-module__buttonWrapper___rBcdv:has(.styles-module__controlButton___8Q0jc:disabled):hover .styles-module__buttonTooltip___Burd9 {\n  opacity: 0;\n  visibility: hidden;\n}\n\n.styles-module__tooltipsInSession___-0lHH .styles-module__buttonWrapper___rBcdv:hover .styles-module__buttonTooltip___Burd9 {\n  transition-delay: 0s;\n}\n\n.styles-module__sendButtonWrapper___UUxG6 {\n  width: 0;\n  opacity: 0;\n  overflow: hidden;\n  pointer-events: none;\n  margin-left: -0.375rem;\n  transition: width 0.4s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.3s cubic-bezier(0.19, 1, 0.22, 1), margin 0.4s cubic-bezier(0.19, 1, 0.22, 1);\n}\n.styles-module__sendButtonWrapper___UUxG6 .styles-module__controlButton___8Q0jc {\n  transform: scale(0.8);\n  transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);\n}\n.styles-module__sendButtonWrapper___UUxG6.styles-module__sendButtonVisible___WPSQU {\n  width: 34px;\n  opacity: 1;\n  overflow: visible;\n  pointer-events: auto;\n  margin-left: 0;\n}\n.styles-module__sendButtonWrapper___UUxG6.styles-module__sendButtonVisible___WPSQU .styles-module__controlButton___8Q0jc {\n  transform: scale(1);\n}\n\n.styles-module__buttonTooltip___Burd9 {\n  position: absolute;\n  bottom: calc(100% + 14px);\n  left: 50%;\n  transform: translateX(-50%) scale(0.95);\n  padding: 6px 10px;\n  background: #1a1a1a;\n  color: rgba(255, 255, 255, 0.9);\n  font-size: 12px;\n  font-weight: 500;\n  border-radius: 8px;\n  white-space: nowrap;\n  opacity: 0;\n  visibility: hidden;\n  pointer-events: none;\n  z-index: 100001;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);\n  transition: opacity 0.135s ease, transform 0.135s ease, visibility 0.135s ease;\n}\n.styles-module__buttonTooltip___Burd9::after {\n  content: "";\n  position: absolute;\n  top: calc(100% - 4px);\n  left: 50%;\n  transform: translateX(-50%) rotate(45deg);\n  width: 8px;\n  height: 8px;\n  background: #1a1a1a;\n  border-radius: 0 0 2px 0;\n}\n\n.styles-module__shortcut___lEAQk {\n  margin-left: 4px;\n  opacity: 0.5;\n}\n\n.styles-module__tooltipBelow___m6ats .styles-module__buttonTooltip___Burd9 {\n  bottom: auto;\n  top: calc(100% + 14px);\n  transform: translateX(-50%) scale(0.95);\n}\n.styles-module__tooltipBelow___m6ats .styles-module__buttonTooltip___Burd9::after {\n  top: -4px;\n  bottom: auto;\n  border-radius: 2px 0 0 0;\n}\n\n.styles-module__tooltipBelow___m6ats .styles-module__buttonWrapper___rBcdv:hover .styles-module__buttonTooltip___Burd9 {\n  transform: translateX(-50%) scale(1);\n}\n\n.styles-module__tooltipsHidden___VtLJG .styles-module__buttonTooltip___Burd9 {\n  opacity: 0 !important;\n  visibility: hidden !important;\n  transition: none !important;\n}\n\n.styles-module__tooltipVisible___0jcCv,\n.styles-module__tooltipsHidden___VtLJG .styles-module__tooltipVisible___0jcCv {\n  opacity: 1 !important;\n  visibility: visible !important;\n  transform: translateX(-50%) scale(1) !important;\n  transition-delay: 0s !important;\n}\n\n.styles-module__buttonWrapperAlignLeft___myzIp .styles-module__buttonTooltip___Burd9 {\n  left: 50%;\n  transform: translateX(-12px) scale(0.95);\n}\n.styles-module__buttonWrapperAlignLeft___myzIp .styles-module__buttonTooltip___Burd9::after {\n  left: 16px;\n}\n.styles-module__buttonWrapperAlignLeft___myzIp:hover .styles-module__buttonTooltip___Burd9 {\n  transform: translateX(-12px) scale(1);\n}\n\n.styles-module__tooltipBelow___m6ats .styles-module__buttonWrapperAlignLeft___myzIp .styles-module__buttonTooltip___Burd9 {\n  transform: translateX(-12px) scale(0.95);\n}\n.styles-module__tooltipBelow___m6ats .styles-module__buttonWrapperAlignLeft___myzIp:hover .styles-module__buttonTooltip___Burd9 {\n  transform: translateX(-12px) scale(1);\n}\n\n.styles-module__buttonWrapperAlignRight___HCQFR .styles-module__buttonTooltip___Burd9 {\n  left: 50%;\n  transform: translateX(calc(-100% + 12px)) scale(0.95);\n}\n.styles-module__buttonWrapperAlignRight___HCQFR .styles-module__buttonTooltip___Burd9::after {\n  left: auto;\n  right: 8px;\n}\n.styles-module__buttonWrapperAlignRight___HCQFR:hover .styles-module__buttonTooltip___Burd9 {\n  transform: translateX(calc(-100% + 12px)) scale(1);\n}\n\n.styles-module__tooltipBelow___m6ats .styles-module__buttonWrapperAlignRight___HCQFR .styles-module__buttonTooltip___Burd9 {\n  transform: translateX(calc(-100% + 12px)) scale(0.95);\n}\n.styles-module__tooltipBelow___m6ats .styles-module__buttonWrapperAlignRight___HCQFR:hover .styles-module__buttonTooltip___Burd9 {\n  transform: translateX(calc(-100% + 12px)) scale(1);\n}\n\n.styles-module__divider___c--s1 {\n  width: 1px;\n  height: 12px;\n  background: rgba(255, 255, 255, 0.15);\n  margin: 0 0.125rem;\n}\n\n.styles-module__overlay___Q1O9y {\n  position: fixed;\n  inset: 0;\n  z-index: 99997;\n  pointer-events: none;\n}\n.styles-module__overlay___Q1O9y > * {\n  pointer-events: auto;\n}\n\n.styles-module__hoverHighlight___ogakW {\n  position: fixed;\n  border: 2px solid color-mix(in srgb, var(--agentation-color-accent) 50%, transparent);\n  border-radius: 4px;\n  background-color: color-mix(in srgb, var(--agentation-color-accent) 4%, transparent);\n  pointer-events: none !important;\n  box-sizing: border-box;\n  will-change: opacity;\n  contain: layout style;\n}\n.styles-module__hoverHighlight___ogakW.styles-module__enter___WFIki {\n  animation: styles-module__hoverHighlightIn___6WYHY 0.12s ease-out forwards;\n}\n\n.styles-module__multiSelectOutline___cSJ-m {\n  position: fixed;\n  border: 2px dashed color-mix(in srgb, var(--agentation-color-green) 60%, transparent);\n  border-radius: 4px;\n  pointer-events: none !important;\n  background-color: color-mix(in srgb, var(--agentation-color-green) 5%, transparent);\n  box-sizing: border-box;\n  will-change: opacity;\n}\n.styles-module__multiSelectOutline___cSJ-m.styles-module__enter___WFIki {\n  animation: styles-module__fadeIn___b9qmf 0.15s ease-out forwards;\n}\n.styles-module__multiSelectOutline___cSJ-m.styles-module__exit___fyOJ0 {\n  animation: styles-module__fadeOut___6Ut6- 0.15s ease-out forwards;\n}\n\n.styles-module__singleSelectOutline___QhX-O {\n  position: fixed;\n  border: 2px solid color-mix(in srgb, var(--agentation-color-blue) 60%, transparent);\n  border-radius: 4px;\n  pointer-events: none !important;\n  background-color: color-mix(in srgb, var(--agentation-color-blue) 5%, transparent);\n  box-sizing: border-box;\n  will-change: opacity;\n}\n.styles-module__singleSelectOutline___QhX-O.styles-module__enter___WFIki {\n  animation: styles-module__fadeIn___b9qmf 0.15s ease-out forwards;\n}\n.styles-module__singleSelectOutline___QhX-O.styles-module__exit___fyOJ0 {\n  animation: styles-module__fadeOut___6Ut6- 0.15s ease-out forwards;\n}\n\n.styles-module__hoverTooltip___bvLk7 {\n  position: fixed;\n  font-size: 0.6875rem;\n  font-weight: 500;\n  color: #fff;\n  background: rgba(0, 0, 0, 0.85);\n  padding: 0.35rem 0.6rem;\n  border-radius: 0.375rem;\n  pointer-events: none !important;\n  white-space: nowrap;\n  max-width: 280px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.styles-module__hoverTooltip___bvLk7.styles-module__enter___WFIki {\n  animation: styles-module__hoverTooltipIn___FYGQx 0.1s ease-out forwards;\n}\n\n.styles-module__hoverReactPath___gx1IJ {\n  font-size: 0.625rem;\n  color: rgba(255, 255, 255, 0.6);\n  margin-bottom: 0.15rem;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.styles-module__hoverElementName___QMLMl {\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.styles-module__markersLayer___-25j1 {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 0;\n  z-index: 99998;\n  pointer-events: none;\n}\n.styles-module__markersLayer___-25j1 > * {\n  pointer-events: auto;\n}\n\n.styles-module__fixedMarkersLayer___ffyX6 {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 99998;\n  pointer-events: none;\n}\n.styles-module__fixedMarkersLayer___ffyX6 > * {\n  pointer-events: auto;\n}\n\n.styles-module__drawCanvas___7cG9U {\n  position: fixed;\n  inset: 0;\n  z-index: 99996;\n  pointer-events: none !important;\n}\n.styles-module__drawCanvas___7cG9U.styles-module__active___-zoN6 {\n  pointer-events: auto !important;\n  cursor: crosshair !important;\n}\n.styles-module__drawCanvas___7cG9U.styles-module__active___-zoN6[data-stroke-hover] {\n  cursor: pointer !important;\n}\n\n.styles-module__dragSelection___kZLq2 {\n  position: fixed;\n  top: 0;\n  left: 0;\n  border: 2px solid color-mix(in srgb, var(--agentation-color-green) 60%, transparent);\n  border-radius: 4px;\n  background-color: color-mix(in srgb, var(--agentation-color-green) 8%, transparent);\n  pointer-events: none;\n  z-index: 99997;\n  will-change: transform, width, height;\n  contain: layout style;\n}\n\n.styles-module__dragCount___KM90j {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  background-color: var(--agentation-color-green);\n  color: white;\n  font-size: 0.875rem;\n  font-weight: 600;\n  padding: 0.25rem 0.5rem;\n  border-radius: 1rem;\n  min-width: 1.5rem;\n  text-align: center;\n}\n\n.styles-module__highlightsContainer___-0xzG {\n  position: fixed;\n  top: 0;\n  left: 0;\n  pointer-events: none;\n  z-index: 99996;\n}\n\n.styles-module__selectedElementHighlight___fyVlI {\n  position: fixed;\n  top: 0;\n  left: 0;\n  border: 2px solid color-mix(in srgb, var(--agentation-color-green) 50%, transparent);\n  border-radius: 4px;\n  background: color-mix(in srgb, var(--agentation-color-green) 6%, transparent);\n  pointer-events: none;\n  will-change: transform, width, height;\n  contain: layout style;\n}\n\n[data-agentation-theme=light] .styles-module__toolbarContainer___dIhma {\n  background: #fff;\n  color: rgba(0, 0, 0, 0.85);\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04);\n}\n[data-agentation-theme=light] .styles-module__toolbarContainer___dIhma.styles-module__collapsed___Rydsn:hover {\n  background: #f5f5f5;\n}\n[data-agentation-theme=light] .styles-module__controlButton___8Q0jc {\n  color: rgba(0, 0, 0, 0.5);\n}\n[data-agentation-theme=light] .styles-module__controlButton___8Q0jc:hover:not(:disabled):not([data-active=true]):not([data-failed=true]):not([data-auto-sync=true]):not([data-error=true]):not([data-no-hover=true]) {\n  background: rgba(0, 0, 0, 0.06);\n  color: rgba(0, 0, 0, 0.85);\n}\n[data-agentation-theme=light] .styles-module__controlButton___8Q0jc[data-active=true] {\n  color: var(--agentation-color-blue);\n  background: color-mix(in srgb, var(--agentation-color-blue) 15%, transparent);\n}\n[data-agentation-theme=light] .styles-module__controlButton___8Q0jc[data-error=true] {\n  color: var(--agentation-color-red);\n  background: color-mix(in srgb, var(--agentation-color-red) 15%, transparent);\n}\n[data-agentation-theme=light] .styles-module__controlButton___8Q0jc[data-danger]:hover:not(:disabled):not([data-active=true]):not([data-failed=true]) {\n  color: var(--agentation-color-red);\n  background: color-mix(in srgb, var(--agentation-color-red) 15%, transparent);\n}\n[data-agentation-theme=light] .styles-module__controlButton___8Q0jc[data-auto-sync=true] {\n  color: var(--agentation-color-green);\n  background: transparent;\n}\n[data-agentation-theme=light] .styles-module__controlButton___8Q0jc[data-failed=true] {\n  color: var(--agentation-color-red);\n  background: color-mix(in srgb, var(--agentation-color-red) 15%, transparent);\n}\n[data-agentation-theme=light] .styles-module__buttonTooltip___Burd9 {\n  background: #fff;\n  color: rgba(0, 0, 0, 0.85);\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04);\n}\n[data-agentation-theme=light] .styles-module__buttonTooltip___Burd9::after {\n  background: #fff;\n}\n[data-agentation-theme=light] .styles-module__divider___c--s1 {\n  background: rgba(0, 0, 0, 0.1);\n}';
var classNames5 = { "toolbar": "styles-module__toolbar___wNsdK", "markersLayer": "styles-module__markersLayer___-25j1", "fixedMarkersLayer": "styles-module__fixedMarkersLayer___ffyX6", "controlsContent": "styles-module__controlsContent___9GJWU", "disableTransitions": "styles-module__disableTransitions___EopxO", "toolbarContainer": "styles-module__toolbarContainer___dIhma", "entrance": "styles-module__entrance___sgHd8", "toolbarEnter": "styles-module__toolbarEnter___u8RRu", "hiding": "styles-module__hiding___1td44", "toolbarHide": "styles-module__toolbarHide___y8kaT", "collapsed": "styles-module__collapsed___Rydsn", "expanded": "styles-module__expanded___ofKPx", "serverConnected": "styles-module__serverConnected___Gfbou", "toggleContent": "styles-module__toggleContent___0yfyP", "visible": "styles-module__visible___KHwEW", "hidden": "styles-module__hidden___Ae8H4", "badge": "styles-module__badge___2XsgF", "fadeOut": "styles-module__fadeOut___6Ut6-", "badgeEnter": "styles-module__badgeEnter___mVQLj", "controlButton": "styles-module__controlButton___8Q0jc", "statusShowing": "styles-module__statusShowing___te6iu", "buttonBadge": "styles-module__buttonBadge___NeFWb", "mcpIndicator": "styles-module__mcpIndicator___zGJeL", "connected": "styles-module__connected___7c28g", "mcpIndicatorPulseConnected": "styles-module__mcpIndicatorPulseConnected___EDodZ", "connecting": "styles-module__connecting___uo-CW", "mcpIndicatorPulseConnecting": "styles-module__mcpIndicatorPulseConnecting___cCYte", "connectionIndicatorWrapper": "styles-module__connectionIndicatorWrapper___L-e-3", "connectionIndicator": "styles-module__connectionIndicator___afk9p", "connectionIndicatorVisible": "styles-module__connectionIndicatorVisible___C-i5B", "connectionIndicatorConnected": "styles-module__connectionIndicatorConnected___IY8pR", "connectionPulse": "styles-module__connectionPulse___-Zycw", "connectionIndicatorDisconnected": "styles-module__connectionIndicatorDisconnected___kmpaZ", "connectionIndicatorConnecting": "styles-module__connectionIndicatorConnecting___QmSLH", "buttonWrapper": "styles-module__buttonWrapper___rBcdv", "buttonTooltip": "styles-module__buttonTooltip___Burd9", "tooltipsInSession": "styles-module__tooltipsInSession___-0lHH", "sendButtonWrapper": "styles-module__sendButtonWrapper___UUxG6", "sendButtonVisible": "styles-module__sendButtonVisible___WPSQU", "shortcut": "styles-module__shortcut___lEAQk", "tooltipBelow": "styles-module__tooltipBelow___m6ats", "tooltipsHidden": "styles-module__tooltipsHidden___VtLJG", "tooltipVisible": "styles-module__tooltipVisible___0jcCv", "buttonWrapperAlignLeft": "styles-module__buttonWrapperAlignLeft___myzIp", "buttonWrapperAlignRight": "styles-module__buttonWrapperAlignRight___HCQFR", "divider": "styles-module__divider___c--s1", "overlay": "styles-module__overlay___Q1O9y", "hoverHighlight": "styles-module__hoverHighlight___ogakW", "enter": "styles-module__enter___WFIki", "hoverHighlightIn": "styles-module__hoverHighlightIn___6WYHY", "multiSelectOutline": "styles-module__multiSelectOutline___cSJ-m", "fadeIn": "styles-module__fadeIn___b9qmf", "exit": "styles-module__exit___fyOJ0", "singleSelectOutline": "styles-module__singleSelectOutline___QhX-O", "hoverTooltip": "styles-module__hoverTooltip___bvLk7", "hoverTooltipIn": "styles-module__hoverTooltipIn___FYGQx", "hoverReactPath": "styles-module__hoverReactPath___gx1IJ", "hoverElementName": "styles-module__hoverElementName___QMLMl", "drawCanvas": "styles-module__drawCanvas___7cG9U", "active": "styles-module__active___-zoN6", "dragSelection": "styles-module__dragSelection___kZLq2", "dragCount": "styles-module__dragCount___KM90j", "highlightsContainer": "styles-module__highlightsContainer___-0xzG", "selectedElementHighlight": "styles-module__selectedElementHighlight___fyVlI", "scaleIn": "styles-module__scaleIn___c-r1K", "scaleOut": "styles-module__scaleOut___Wctwz", "slideUp": "styles-module__slideUp___kgD36", "slideDown": "styles-module__slideDown___zcdje" };
if (typeof document !== "undefined") {
  let style = document.getElementById("feedback-tool-styles-page-toolbar-css-styles");
  if (!style) {
    style = document.createElement("style");
    style.id = "feedback-tool-styles-page-toolbar-css-styles";
    style.textContent = css5;
    document.head.appendChild(style);
  }
}
var styles_module_default4 = classNames5;
var OUTPUT_DETAIL_OPTIONS = [{ value: "compact", label: "Compact" }, { value: "standard", label: "Standard" }, { value: "detailed", label: "Detailed" }, { value: "forensic", label: "Forensic" }];
function generateOutput(annotations, pathname, detailLevel = "standard") {
  if (annotations.length === 0) return "";
  const viewport = typeof window !== "undefined" ? `${window.innerWidth}×${window.innerHeight}` : "unknown";
  let output = `## Page Feedback: ${pathname}
`;
  if (detailLevel === "forensic") {
    output += `
**Environment:**
`;
    output += `- Viewport: ${viewport}
`;
    if (typeof window !== "undefined") {
      output += `- URL: ${window.location.href}
`;
      output += `- User Agent: ${navigator.userAgent}
`;
      output += `- Timestamp: ${(/* @__PURE__ */ new Date()).toISOString()}
`;
      output += `- Device Pixel Ratio: ${window.devicePixelRatio}
`;
    }
    output += `
---
`;
  } else if (detailLevel !== "compact") {
    output += `**Viewport:** ${viewport}
`;
  }
  output += "\n";
  annotations.forEach((a, i) => {
    const heading = a.reactComponents || a.element;
    const location = a.reactComponents ? `${a.reactComponents} > ${a.elementPath}` : a.elementPath;
    if (detailLevel === "compact") {
      output += `${i + 1}. **${heading}**${a.sourceFile ? ` (${a.sourceFile})` : ""}: ${a.comment}`;
      if (a.selectedText) {
        output += ` (re: "${a.selectedText.slice(0, 30)}${a.selectedText.length > 30 ? "..." : ""}")`;
      }
      output += "\n";
    } else if (detailLevel === "forensic") {
      output += `### ${i + 1}. ${heading}
`;
      if (a.isMultiSelect && a.fullPath) {
        output += `*Forensic data shown for first element of selection*
`;
      }
      if (a.fullPath) {
        output += `**Full DOM Path:** ${a.fullPath}
`;
      }
      if (a.cssClasses) {
        output += `**CSS Classes:** ${a.cssClasses}
`;
      }
      if (a.boundingBox) {
        output += `**Position:** x:${Math.round(a.boundingBox.x)}, y:${Math.round(a.boundingBox.y)} (${Math.round(a.boundingBox.width)}×${Math.round(a.boundingBox.height)}px)
`;
      }
      output += `**Annotation at:** ${a.x.toFixed(1)}% from left, ${Math.round(a.y)}px from top
`;
      if (a.selectedText) {
        output += `**Selected text:** "${a.selectedText}"
`;
      }
      if (a.nearbyText && !a.selectedText) {
        output += `**Context:** ${a.nearbyText.slice(0, 100)}
`;
      }
      if (a.computedStyles) {
        output += `**Computed Styles:** ${a.computedStyles}
`;
      }
      if (a.accessibility) {
        output += `**Accessibility:** ${a.accessibility}
`;
      }
      if (a.nearbyElements) {
        output += `**Nearby Elements:** ${a.nearbyElements}
`;
      }
      if (a.sourceFile) {
        output += `**Source:** ${a.sourceFile}
`;
      }
      output += `**Feedback:** ${a.comment}

`;
    } else {
      output += `### ${i + 1}. ${heading}
`;
      output += `**Location:** ${location}
`;
      if (a.sourceFile) {
        output += `**Source:** ${a.sourceFile}
`;
      }
      if (detailLevel === "detailed") {
        if (a.cssClasses) {
          output += `**Classes:** ${a.cssClasses}
`;
        }
        if (a.boundingBox) {
          output += `**Position:** ${Math.round(a.boundingBox.x)}px, ${Math.round(a.boundingBox.y)}px (${Math.round(a.boundingBox.width)}×${Math.round(a.boundingBox.height)}px)
`;
        }
      }
      if (a.selectedText) {
        output += `**Selected text:** "${a.selectedText}"
`;
      }
      if (detailLevel === "detailed" && a.nearbyText && !a.selectedText) {
        output += `**Context:** ${a.nearbyText.slice(0, 100)}
`;
      }
      output += `**Feedback:** ${a.comment}

`;
    }
  });
  return output.trim();
}
var css6 = '@keyframes styles-module__markerIn___x4G8D {\n  0% {\n    opacity: 0;\n    transform: translate(-50%, -50%) scale(0.3);\n  }\n  100% {\n    opacity: 1;\n    transform: translate(-50%, -50%) scale(1);\n  }\n}\n@keyframes styles-module__markerOut___6VhQN {\n  0% {\n    opacity: 1;\n    transform: translate(-50%, -50%) scale(1);\n  }\n  100% {\n    opacity: 0;\n    transform: translate(-50%, -50%) scale(0.3);\n  }\n}\n@keyframes styles-module__tooltipIn___aJslQ {\n  from {\n    opacity: 0;\n    transform: translateX(-50%) translateY(2px) scale(0.891);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(-50%) translateY(0) scale(0.909);\n  }\n}\n@keyframes styles-module__renumberRoll___akV9B {\n  0% {\n    transform: translateX(-40%);\n    opacity: 0;\n  }\n  100% {\n    transform: translateX(0);\n    opacity: 1;\n  }\n}\n.styles-module__marker___9CKF7 {\n  position: absolute;\n  width: 22px;\n  height: 22px;\n  background: var(--agentation-color-blue);\n  color: white;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 0.6875rem;\n  font-weight: 600;\n  transform: translate(-50%, -50%) scale(1);\n  opacity: 1;\n  cursor: pointer;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(0, 0, 0, 0.04);\n  user-select: none;\n  will-change: transform, opacity;\n  contain: layout style;\n  z-index: 1;\n}\n.styles-module__marker___9CKF7:hover {\n  z-index: 2;\n}\n.styles-module__marker___9CKF7:not(.styles-module__enter___8kI3q):not(.styles-module__exit___KBdR3):not(.styles-module__clearing___8rM7K) {\n  transition: background-color 0.15s ease, transform 0.1s ease;\n}\n.styles-module__marker___9CKF7.styles-module__enter___8kI3q {\n  animation: styles-module__markerIn___x4G8D 0.25s cubic-bezier(0.22, 1, 0.36, 1) both;\n}\n.styles-module__marker___9CKF7.styles-module__exit___KBdR3 {\n  animation: styles-module__markerOut___6VhQN 0.2s ease-out both;\n  pointer-events: none;\n}\n.styles-module__marker___9CKF7.styles-module__clearing___8rM7K {\n  animation: styles-module__markerOut___6VhQN 0.15s ease-out both;\n  pointer-events: none;\n}\n.styles-module__marker___9CKF7:not(.styles-module__enter___8kI3q):not(.styles-module__exit___KBdR3):not(.styles-module__clearing___8rM7K):hover {\n  transform: translate(-50%, -50%) scale(1.1);\n}\n.styles-module__marker___9CKF7.styles-module__pending___BiY-U {\n  position: fixed;\n  background-color: var(--agentation-color-blue);\n  cursor: default;\n}\n.styles-module__marker___9CKF7.styles-module__fixed___aKrQO {\n  position: fixed;\n}\n.styles-module__marker___9CKF7.styles-module__multiSelect___CPfTC {\n  background-color: var(--agentation-color-green);\n  width: 26px;\n  height: 26px;\n  border-radius: 6px;\n  font-size: 0.75rem;\n}\n.styles-module__marker___9CKF7.styles-module__multiSelect___CPfTC.styles-module__pending___BiY-U {\n  background-color: var(--agentation-color-green);\n}\n.styles-module__marker___9CKF7.styles-module__hovered___-mg2N {\n  background-color: var(--agentation-color-red);\n}\n\n.styles-module__renumber___16lvD {\n  display: block;\n  animation: styles-module__renumberRoll___akV9B 0.2s ease-out;\n}\n\n.styles-module__markerTooltip___-VUm- {\n  position: absolute;\n  top: calc(100% + 10px);\n  left: 50%;\n  transform: translateX(-50%) scale(0.909);\n  z-index: 100002;\n  background: #1a1a1a;\n  padding: 8px 0.75rem;\n  border-radius: 0.75rem;\n  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n  font-weight: 400;\n  color: #fff;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.08);\n  min-width: 120px;\n  max-width: 200px;\n  pointer-events: none;\n  cursor: default;\n}\n.styles-module__markerTooltip___-VUm-.styles-module__enter___8kI3q {\n  animation: styles-module__tooltipIn___aJslQ 0.1s ease-out forwards;\n}\n\n.styles-module__markerQuote___tQake {\n  display: block;\n  font-size: 12px;\n  font-style: italic;\n  color: rgba(255, 255, 255, 0.6);\n  margin-bottom: 0.3125rem;\n  line-height: 1.4;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.styles-module__markerNote___Rh4eI {\n  display: block;\n  font-size: 13px;\n  font-weight: 400;\n  line-height: 1.4;\n  color: #fff;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  padding-bottom: 2px;\n}\n\n[data-agentation-theme=light] .styles-module__markerTooltip___-VUm- {\n  background: #fff;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.06);\n}\n[data-agentation-theme=light] .styles-module__markerTooltip___-VUm- .styles-module__markerQuote___tQake {\n  color: rgba(0, 0, 0, 0.5);\n}\n[data-agentation-theme=light] .styles-module__markerTooltip___-VUm- .styles-module__markerNote___Rh4eI {\n  color: rgba(0, 0, 0, 0.85);\n}';
var classNames6 = { "marker": "styles-module__marker___9CKF7", "enter": "styles-module__enter___8kI3q", "exit": "styles-module__exit___KBdR3", "clearing": "styles-module__clearing___8rM7K", "pending": "styles-module__pending___BiY-U", "fixed": "styles-module__fixed___aKrQO", "multiSelect": "styles-module__multiSelect___CPfTC", "hovered": "styles-module__hovered___-mg2N", "renumber": "styles-module__renumber___16lvD", "markerTooltip": "styles-module__markerTooltip___-VUm-", "markerQuote": "styles-module__markerQuote___tQake", "markerNote": "styles-module__markerNote___Rh4eI" };
if (typeof document !== "undefined") {
  let style = document.getElementById("feedback-tool-styles-annotation-marker-styles");
  if (!style) {
    style = document.createElement("style");
    style.id = "feedback-tool-styles-annotation-marker-styles";
    style.textContent = css6;
    document.head.appendChild(style);
  }
}
var styles_module_default5 = classNames6;
function AnnotationMarker(props) {
  const showDeleteState = () => (props.isHovered || props.isDeleting) && !props.isEditingAny;
  const showDeleteHover = () => showDeleteState() && props.markerClickBehavior === "delete";
  const isMulti = () => props.annotation.isMultiSelect;
  const markerColor = () => isMulti() ? "var(--agentation-color-green)" : "var(--agentation-color-accent)";
  const animClass = () => props.isExiting ? styles_module_default5.exit : props.isClearing ? styles_module_default5.clearing : !props.isAnimated ? styles_module_default5.enter : "";
  const animationDelay = () => props.isExiting ? `${(props.layerSize - 1 - props.layerIndex) * 20}ms` : `${props.layerIndex * 20}ms`;
  return ssr(_tmpl$190, ssrHydrationKey(), `${escape(styles_module_default5.marker, true)} ${isMulti() ? escape(styles_module_default5.multiSelect, true) : ""} ${escape(animClass(), true)} ${showDeleteHover() ? escape(styles_module_default5.hovered, true) : ""}`, ssrStyleProperty("left:", `${escape(props.annotation.x, true)}%`) + ssrStyleProperty(";top:", `${escape(props.annotation.y, true)}px`) + ssrStyleProperty(";background-color:", showDeleteHover() ? void 0 : escape(markerColor(), true)) + ssrStyleProperty(";animation-delay:", escape(animationDelay(), true)), escape(createComponent(Show$1, { get when() {
    return showDeleteState();
  }, get fallback() {
    return ssr(_tmpl$38, ssrHydrationKey() + ssrAttribute("class", props.renumberFrom !== null && props.globalIndex >= props.renumberFrom ? escape(styles_module_default5.renumber, true) : void 0, false), escape(props.globalIndex) + 1);
  }, get children() {
    return createComponent(Show$1, { get when() {
      return showDeleteHover();
    }, get fallback() {
      return createComponent(IconEdit, { size: 16 });
    }, get children() {
      return createComponent(IconXmark, { get size() {
        return isMulti() ? 18 : 16;
      } });
    } });
  } })), escape(createComponent(Show$1, { get when() {
    return props.isHovered && !props.isEditingAny;
  }, get children() {
    return ssr(_tmpl$189, ssrHydrationKey(), `${escape(styles_module_default5.markerTooltip, true)} ${escape(styles_module_default5.enter, true)}`, ssrStyle(props.tooltipStyle), ssrAttribute("class", escape(styles_module_default5.markerQuote, true), false), escape(props.annotation.element), props.annotation.selectedText && ` "${escape(props.annotation.selectedText.slice(0, 30))}${props.annotation.selectedText.length > 30 ? "..." : ""}"`, ssrAttribute("class", escape(styles_module_default5.markerNote, true), false), escape(props.annotation.comment));
  } })));
}
function PendingMarker(props) {
  return ssr(_tmpl$191, ssrHydrationKey(), `${escape(styles_module_default5.marker, true)} ${escape(styles_module_default5.pending, true)} ${props.isMultiSelect ? escape(styles_module_default5.multiSelect, true) : ""} ${props.isExiting ? escape(styles_module_default5.exit, true) : escape(styles_module_default5.enter, true)}`, ssrStyleProperty("left:", `${escape(props.x, true)}%`) + ssrStyleProperty(";top:", `${escape(props.y, true)}px`) + ssrStyleProperty(";background-color:", props.isMultiSelect ? "var(--agentation-color-green)" : "var(--agentation-color-accent)"), escape(createComponent(IconPlus, { size: 12 })));
}
function ExitingMarker(props) {
  const isMulti = () => props.annotation.isMultiSelect;
  return ssr(_tmpl$192, ssrHydrationKey(), `${escape(styles_module_default5.marker, true)} ${props.fixed ? escape(styles_module_default5.fixed, true) : ""} ${escape(styles_module_default5.hovered, true)} ${isMulti() ? escape(styles_module_default5.multiSelect, true) : ""} ${escape(styles_module_default5.exit, true)}`, ssrStyleProperty("left:", `${escape(props.annotation.x, true)}%`) + ssrStyleProperty(";top:", `${escape(props.annotation.y, true)}px`), escape(createComponent(IconXmark, { get size() {
    return isMulti() ? 12 : 10;
  } })));
}
var css7 = ".styles-module__switchContainer___Ka-AB {\n  display: flex;\n  align-items: center;\n  position: relative;\n  padding: 2px;\n  width: 24px;\n  height: 16px;\n  border-radius: 8px;\n  background-color: #cdcdcd;\n  transition: background-color 0.15s, opacity 0.15s;\n}\n[data-agentation-theme=dark] .styles-module__switchContainer___Ka-AB {\n  background-color: #484848;\n}\n.styles-module__switchContainer___Ka-AB:has(.styles-module__switchInput___kYDSD:checked) {\n  background-color: var(--agentation-color-blue);\n}\n.styles-module__switchContainer___Ka-AB:has(.styles-module__switchInput___kYDSD:disabled) {\n  opacity: 0.3;\n}\n\n.styles-module__switchInput___kYDSD {\n  position: absolute;\n  z-index: 1;\n  inset: 0;\n  border-radius: inherit;\n  opacity: 0;\n  cursor: pointer;\n}\n.styles-module__switchInput___kYDSD:disabled {\n  cursor: not-allowed;\n}\n\n.styles-module__switchThumb___4sCPH {\n  border-radius: 50%;\n  width: 12px;\n  height: 12px;\n  background-color: #fff;\n  transition: transform 0.15s;\n}\n.styles-module__switchContainer___Ka-AB:has(.styles-module__switchInput___kYDSD:checked) .styles-module__switchThumb___4sCPH {\n  transform: translateX(8px);\n}";
var classNames7 = { "switchContainer": "styles-module__switchContainer___Ka-AB", "switchInput": "styles-module__switchInput___kYDSD", "switchThumb": "styles-module__switchThumb___4sCPH" };
if (typeof document !== "undefined") {
  let style = document.getElementById("feedback-tool-styles-switch-styles");
  if (!style) {
    style = document.createElement("style");
    style.id = "feedback-tool-styles-switch-styles";
    style.textContent = css7;
    document.head.appendChild(style);
  }
}
var styles_module_default6 = classNames7;
var Switch = (props) => {
  const [local, rest] = splitProps(props, ["class"]);
  return ssr(_tmpl$193, ssrHydrationKey(), `${escape(styles_module_default6.switchContainer, true)} ${escape(local.class ?? "", true)}`, ssrElement("input", mergeProps({ get ["class"]() {
    return styles_module_default6.switchInput;
  }, type: "checkbox" }, rest), void 0, false), ssrAttribute("class", escape(styles_module_default6.switchThumb, true), false));
};
var css8 = ".styles-module__checkboxContainer___joqZk {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  position: relative;\n  border: 1px solid rgba(26, 26, 26, 0.2);\n  border-radius: 4px;\n  width: 14px;\n  height: 14px;\n  background-color: #fff;\n  transition: background-color 0.2s ease;\n}\n[data-agentation-theme=dark] .styles-module__checkboxContainer___joqZk {\n  border-color: rgba(255, 255, 255, 0.2);\n  background-color: #252525;\n}\n.styles-module__checkboxContainer___joqZk:has(.styles-module__checkboxInput___ECzzO:checked) {\n  background-color: #1a1a1a;\n}\n[data-agentation-theme=dark] .styles-module__checkboxContainer___joqZk:has(.styles-module__checkboxInput___ECzzO:checked) {\n  background-color: #fff;\n}\n\n.styles-module__checkboxInput___ECzzO {\n  position: absolute;\n  z-index: 1;\n  inset: -1px;\n  border-radius: inherit;\n  opacity: 0;\n  cursor: pointer;\n}\n\n.styles-module__checkboxCheck___fUXpr {\n  color: #fafafa;\n}\n[data-agentation-theme=dark] .styles-module__checkboxCheck___fUXpr {\n  color: #1a1a1a;\n}\n\n.styles-module__checkboxCheckPath___cDyh8 {\n  stroke-dasharray: 9.29px;\n  stroke-dashoffset: 9.29px;\n  color: #fafafa;\n  transition: stroke-dashoffset 0.1s ease;\n}\n[data-agentation-theme=dark] .styles-module__checkboxCheckPath___cDyh8 {\n  color: #1a1a1a;\n}\n.styles-module__checkboxContainer___joqZk:has(.styles-module__checkboxInput___ECzzO:checked) .styles-module__checkboxCheckPath___cDyh8 {\n  transition-duration: 0.2s;\n  stroke-dashoffset: 0;\n}";
var classNames8 = { "checkboxContainer": "styles-module__checkboxContainer___joqZk", "checkboxInput": "styles-module__checkboxInput___ECzzO", "checkboxCheck": "styles-module__checkboxCheck___fUXpr", "checkboxCheckPath": "styles-module__checkboxCheckPath___cDyh8" };
if (typeof document !== "undefined") {
  let style = document.getElementById("feedback-tool-styles-checkbox-styles");
  if (!style) {
    style = document.createElement("style");
    style.id = "feedback-tool-styles-checkbox-styles";
    style.textContent = css8;
    document.head.appendChild(style);
  }
}
var styles_module_default7 = classNames8;
var Checkbox = (props) => {
  const [local, rest] = splitProps(props, ["class"]);
  return ssr(_tmpl$194, ssrHydrationKey(), `${escape(styles_module_default7.checkboxContainer, true)} ${escape(local.class ?? "", true)}`, ssrElement("input", mergeProps({ get ["class"]() {
    return styles_module_default7.checkboxInput;
  }, type: "checkbox" }, rest), void 0, false), ssrAttribute("class", escape(styles_module_default7.checkboxCheck, true), false), ssrAttribute("class", escape(styles_module_default7.checkboxCheckPath, true), false));
};
var css9 = ".styles-module__container___w8eAF {\n  display: flex;\n  align-items: center;\n  height: 24px;\n}\n\n.styles-module__label___J5mxE {\n  padding-inline: 8px 2px;\n  line-height: 20px;\n  font-size: 13px;\n  letter-spacing: -0.15px;\n  color: rgba(26, 26, 26, 0.5);\n  cursor: pointer;\n}\n[data-agentation-theme=dark] .styles-module__label___J5mxE {\n  color: rgba(255, 255, 255, 0.5);\n}";
var classNames9 = { "container": "styles-module__container___w8eAF", "label": "styles-module__label___J5mxE" };
if (typeof document !== "undefined") {
  let style = document.getElementById("feedback-tool-styles-checkbox-field-styles");
  if (!style) {
    style = document.createElement("style");
    style.id = "feedback-tool-styles-checkbox-field-styles";
    style.textContent = css9;
    document.head.appendChild(style);
  }
}
var styles_module_default8 = classNames9;
var CheckboxField = (props) => {
  const [local, rest] = splitProps(props, ["class", "label", "tooltip", "checked", "onChange"]);
  const id = createUniqueId();
  return ssrElement("div", mergeProps({ get ["class"]() {
    return `${styles_module_default8.container} ${local.class ?? ""}`;
  } }, rest), () => ["<!--$-->", escape(createComponent(Checkbox, { id, get onChange() {
    return local.onChange;
  }, get checked() {
    return local.checked;
  } })), "<!--/-->", ssr(_tmpl$195, ssrAttribute("class", escape(styles_module_default8.label, true), false) + ssrAttribute("for", escape(id, true), false), escape(local.label)), "<!--$-->", escape(createComponent(Show$1, { get when() {
    return local.tooltip;
  }, get children() {
    return createComponent(HelpTooltip, { get content() {
      return local.tooltip;
    } });
  } })), "<!--/-->"], true);
};
var css10 = '@keyframes styles-module__cycleTextIn___VBNTi {\n  0% {\n    opacity: 0;\n    transform: translateY(-6px);\n  }\n  100% {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@keyframes styles-module__scaleIn___QpQ8E {\n  from {\n    opacity: 0;\n    transform: scale(0.85);\n  }\n  to {\n    opacity: 1;\n    transform: scale(1);\n  }\n}\n@keyframes styles-module__mcpPulse___5Q3Jj {\n  0% {\n    box-shadow: 0 0 0 0 color-mix(in srgb, var(--agentation-color-green) 50%, transparent);\n  }\n  70% {\n    box-shadow: 0 0 0 6px color-mix(in srgb, var(--agentation-color-green) 0%, transparent);\n  }\n  100% {\n    box-shadow: 0 0 0 0 color-mix(in srgb, var(--agentation-color-green) 0%, transparent);\n  }\n}\n@keyframes styles-module__mcpPulseError___VHxhx {\n  0% {\n    box-shadow: 0 0 0 0 color-mix(in srgb, var(--agentation-color-red) 50%, transparent);\n  }\n  70% {\n    box-shadow: 0 0 0 6px color-mix(in srgb, var(--agentation-color-red) 0%, transparent);\n  }\n  100% {\n    box-shadow: 0 0 0 0 color-mix(in srgb, var(--agentation-color-red) 0%, transparent);\n  }\n}\n@keyframes styles-module__themeIconIn___qUWMV {\n  0% {\n    opacity: 0;\n    transform: scale(0.8) rotate(-30deg);\n  }\n  100% {\n    opacity: 1;\n    transform: scale(1) rotate(0deg);\n  }\n}\n.styles-module__settingsPanel___qNkn- {\n  position: absolute;\n  right: 5px;\n  bottom: calc(100% + 0.5rem);\n  z-index: 1;\n  overflow: hidden;\n  background: #1c1c1c;\n  border-radius: 16px;\n  padding: 12px 0;\n  width: 100%;\n  max-width: 253px;\n  min-width: 205px;\n  cursor: default;\n  opacity: 1;\n  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.04);\n  transition: background-color 0.25s ease, box-shadow 0.25s ease;\n}\n.styles-module__settingsPanel___qNkn-::before, .styles-module__settingsPanel___qNkn-::after {\n  content: "";\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  width: 16px;\n  z-index: 2;\n  pointer-events: none;\n}\n.styles-module__settingsPanel___qNkn-::before {\n  left: 0;\n  background: linear-gradient(to right, #1c1c1c 0%, transparent 100%);\n}\n.styles-module__settingsPanel___qNkn-::after {\n  right: 0;\n  background: linear-gradient(to left, #1c1c1c 0%, transparent 100%);\n}\n.styles-module__settingsPanel___qNkn- .styles-module__settingsHeader___Fn1DP,\n.styles-module__settingsPanel___qNkn- .styles-module__settingsBrand___OoKlM,\n.styles-module__settingsPanel___qNkn- .styles-module__settingsBrandSlash___Q-AU9,\n.styles-module__settingsPanel___qNkn- .styles-module__settingsVersion___rXmL9,\n.styles-module__settingsPanel___qNkn- .styles-module__settingsSection___n5V-4,\n.styles-module__settingsPanel___qNkn- .styles-module__settingsLabel___VCVOQ,\n.styles-module__settingsPanel___qNkn- .styles-module__cycleButton___XMBx3,\n.styles-module__settingsPanel___qNkn- .styles-module__cycleDot___zgSXY,\n.styles-module__settingsPanel___qNkn- .styles-module__dropdownButton___mKHe8,\n.styles-module__settingsPanel___qNkn- .styles-module__sliderLabel___6K5v1,\n.styles-module__settingsPanel___qNkn- .styles-module__slider___v5z-c,\n.styles-module__settingsPanel___qNkn- .styles-module__themeToggle___3imlT {\n  transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease;\n}\n.styles-module__settingsPanel___qNkn-.styles-module__enter___wginS {\n  opacity: 1;\n  transform: translateY(0) scale(1);\n  filter: blur(0px);\n  transition: opacity 0.2s ease, transform 0.2s ease, filter 0.2s ease;\n}\n.styles-module__settingsPanel___qNkn-.styles-module__exit___A4iJc {\n  opacity: 0;\n  transform: translateY(8px) scale(0.95);\n  filter: blur(5px);\n  pointer-events: none;\n  transition: opacity 0.1s ease, transform 0.1s ease, filter 0.1s ease;\n}\n[data-agentation-theme=dark] .styles-module__settingsPanel___qNkn- {\n  background: #1a1a1a;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.08);\n}\n[data-agentation-theme=dark] .styles-module__settingsPanel___qNkn- .styles-module__settingsLabel___VCVOQ {\n  color: rgba(255, 255, 255, 0.6);\n}\n[data-agentation-theme=dark] .styles-module__settingsPanel___qNkn- .styles-module__settingsOption___JoyH- {\n  color: rgba(255, 255, 255, 0.85);\n}\n[data-agentation-theme=dark] .styles-module__settingsPanel___qNkn- .styles-module__settingsOption___JoyH-:hover {\n  background: rgba(255, 255, 255, 0.1);\n}\n[data-agentation-theme=dark] .styles-module__settingsPanel___qNkn- .styles-module__settingsOption___JoyH-.styles-module__selected___k1-Vq {\n  background: rgba(255, 255, 255, 0.15);\n  color: #fff;\n}\n\n.styles-module__settingsPanelContainer___5it-H {\n  overflow: visible;\n  position: relative;\n  display: flex;\n  padding: 0 16px;\n}\n\n.styles-module__settingsPage___BMn-3 {\n  min-width: 100%;\n  flex-shrink: 0;\n  transition: transform 0.2s ease, opacity 0.2s ease;\n  transition-delay: 0s;\n  opacity: 1;\n}\n\n.styles-module__settingsPage___BMn-3.styles-module__slideLeft___qUvW4 {\n  transform: translateX(-24px);\n  opacity: 0;\n  pointer-events: none;\n}\n\n.styles-module__automationsPage___N7By0 {\n  position: absolute;\n  top: 0;\n  left: 24px;\n  width: 100%;\n  height: 100%;\n  padding: 0 16px 4px;\n  box-sizing: border-box;\n  display: flex;\n  flex-direction: column;\n  transition: transform 0.2s ease, opacity 0.2s ease;\n  opacity: 0;\n  pointer-events: none;\n}\n\n.styles-module__automationsPage___N7By0.styles-module__slideIn___uXDSu {\n  transform: translateX(-24px);\n  opacity: 1;\n  pointer-events: auto;\n}\n\n.styles-module__settingsHeader___Fn1DP {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  height: 24px;\n}\n\n.styles-module__settingsBrand___OoKlM {\n  font-size: 0.8125rem;\n  font-weight: 600;\n  letter-spacing: -0.0094em;\n  color: #fff;\n  text-decoration: none;\n}\n\n.styles-module__settingsBrandSlash___Q-AU9 {\n  color: var(--agentation-color-accent);\n  transition: color 0.2s ease;\n}\n\n.styles-module__settingsVersion___rXmL9 {\n  font-size: 11px;\n  font-weight: 400;\n  color: rgba(255, 255, 255, 0.4);\n  margin-left: auto;\n  letter-spacing: -0.0094em;\n}\n\n.styles-module__themeToggle___3imlT {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 22px;\n  height: 22px;\n  margin-left: 8px;\n  border: none;\n  border-radius: 6px;\n  background: transparent;\n  color: rgba(255, 255, 255, 0.4);\n  transition: background-color 0.15s ease, color 0.15s ease;\n  cursor: pointer;\n}\n.styles-module__themeToggle___3imlT:hover {\n  background: rgba(255, 255, 255, 0.1);\n  color: rgba(255, 255, 255, 0.8);\n}\n[data-agentation-theme=light] .styles-module__themeToggle___3imlT {\n  color: rgba(0, 0, 0, 0.4);\n}\n[data-agentation-theme=light] .styles-module__themeToggle___3imlT:hover {\n  background: rgba(0, 0, 0, 0.06);\n  color: rgba(0, 0, 0, 0.7);\n}\n\n.styles-module__themeIconWrapper___pyaYa {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  position: relative;\n  width: 20px;\n  height: 20px;\n}\n\n.styles-module__themeIcon___w7lAm {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  animation: styles-module__themeIconIn___qUWMV 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;\n}\n\n.styles-module__settingsSectionGrow___eZTRw {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n}\n\n.styles-module__settingsRow___y-tDE {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  min-height: 24px;\n}\n.styles-module__settingsRow___y-tDE.styles-module__settingsRowMarginTop___uLpGb {\n  margin-top: 8px;\n}\n\n.styles-module__settingsRowDisabled___ydl3Q .styles-module__settingsLabel___VCVOQ {\n  color: rgba(255, 255, 255, 0.2);\n}\n[data-agentation-theme=light] .styles-module__settingsRowDisabled___ydl3Q .styles-module__settingsLabel___VCVOQ {\n  color: rgba(0, 0, 0, 0.2);\n}\n\n.styles-module__settingsLabel___VCVOQ {\n  display: flex;\n  align-items: center;\n  column-gap: 2px;\n  line-height: 20px;\n  font-size: 13px;\n  font-weight: 400;\n  letter-spacing: -0.15px;\n  color: rgba(255, 255, 255, 0.5);\n}\n[data-agentation-theme=light] .styles-module__settingsLabel___VCVOQ {\n  color: rgba(0, 0, 0, 0.5);\n}\n\n.styles-module__cycleButton___XMBx3 {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 0;\n  border: none;\n  background: transparent;\n  font-size: 0.8125rem;\n  font-weight: 500;\n  color: #fff;\n  cursor: pointer;\n  letter-spacing: -0.0094em;\n}\n[data-agentation-theme=light] .styles-module__cycleButton___XMBx3 {\n  color: rgba(0, 0, 0, 0.85);\n}\n.styles-module__cycleButton___XMBx3:disabled {\n  opacity: 0.35;\n  cursor: not-allowed;\n}\n\n.styles-module__cycleButtonText___mbbnD {\n  display: inline-block;\n  animation: styles-module__cycleTextIn___VBNTi 0.2s ease-out;\n}\n\n.styles-module__cycleDots___ehp6i {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n\n.styles-module__cycleDot___zgSXY {\n  width: 3px;\n  height: 3px;\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.3);\n  transform: scale(0.667);\n  transition: background-color 0.25s ease-out, transform 0.25s ease-out;\n}\n.styles-module__cycleDot___zgSXY.styles-module__active___dpAhM {\n  background: #fff;\n  transform: scale(1);\n}\n[data-agentation-theme=light] .styles-module__cycleDot___zgSXY {\n  background: rgba(0, 0, 0, 0.2);\n}\n[data-agentation-theme=light] .styles-module__cycleDot___zgSXY.styles-module__active___dpAhM {\n  background: rgba(0, 0, 0, 0.7);\n}\n\n.styles-module__colorOptions___pbxZx {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-top: 6px;\n  height: 26px;\n}\n\n.styles-module__colorOption___Co955 {\n  position: relative;\n  border-radius: 50%;\n  width: 20px;\n  height: 20px;\n  background-color: #fff;\n  cursor: pointer;\n}\n[data-agentation-theme=dark] .styles-module__colorOption___Co955 {\n  background-color: #1a1a1a;\n}\n.styles-module__colorOption___Co955::before, .styles-module__colorOption___Co955::after {\n  content: "";\n  position: absolute;\n  inset: 0;\n  border-radius: 50%;\n  background-color: var(--swatch);\n  transition: opacity 0.2s, transform 0.2s;\n}\n@supports (color: color(display-p3 0 0 0)) {\n  .styles-module__colorOption___Co955::before, .styles-module__colorOption___Co955::after {\n    --color: var(--swatch-p3);\n  }\n}\n.styles-module__colorOption___Co955::after {\n  z-index: -1;\n  transform: scale(1.2);\n  opacity: 0;\n}\n.styles-module__colorOption___Co955.styles-module__selected___k1-Vq::before {\n  transform: scale(0.8);\n}\n.styles-module__colorOption___Co955.styles-module__selected___k1-Vq::after {\n  opacity: 1;\n}\n\n.styles-module__settingsNavLink___uYIwM {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  width: 100%;\n  height: 24px;\n  padding: 0;\n  border: none;\n  background: transparent;\n  font-family: inherit;\n  line-height: 20px;\n  font-size: 13px;\n  font-weight: 400;\n  color: rgba(255, 255, 255, 0.5);\n  transition: color 0.15s ease;\n  cursor: pointer;\n}\n.styles-module__settingsNavLink___uYIwM:hover {\n  color: rgba(255, 255, 255, 0.9);\n}\n.styles-module__settingsNavLink___uYIwM svg {\n  color: rgba(255, 255, 255, 0.4);\n  transition: color 0.15s ease;\n}\n.styles-module__settingsNavLink___uYIwM:hover svg {\n  color: #fff;\n}\n[data-agentation-theme=light] .styles-module__settingsNavLink___uYIwM {\n  color: rgba(0, 0, 0, 0.5);\n}\n[data-agentation-theme=light] .styles-module__settingsNavLink___uYIwM:hover {\n  color: rgba(0, 0, 0, 0.8);\n}\n[data-agentation-theme=light] .styles-module__settingsNavLink___uYIwM svg {\n  color: rgba(0, 0, 0, 0.25);\n}\n[data-agentation-theme=light] .styles-module__settingsNavLink___uYIwM:hover svg {\n  color: rgba(0, 0, 0, 0.8);\n}\n\n.styles-module__settingsNavLinkRight___XBUzC {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n}\n\n.styles-module__settingsBackButton___fflll {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  height: 24px;\n  background: transparent;\n  font-family: inherit;\n  line-height: 20px;\n  font-size: 13px;\n  font-weight: 500;\n  letter-spacing: -0.15px;\n  color: #fff;\n  cursor: pointer;\n  transition: transform 0.12s cubic-bezier(0.32, 0.72, 0, 1);\n}\n.styles-module__settingsBackButton___fflll svg {\n  opacity: 0.4;\n  flex-shrink: 0;\n  transition: opacity 0.15s ease, transform 0.18s cubic-bezier(0.32, 0.72, 0, 1);\n}\n.styles-module__settingsBackButton___fflll:hover svg {\n  opacity: 1;\n}\n[data-agentation-theme=light] .styles-module__settingsBackButton___fflll {\n  color: rgba(0, 0, 0, 0.85);\n  border-bottom-color: rgba(0, 0, 0, 0.08);\n}\n\n.styles-module__automationHeader___Avra9 {\n  display: flex;\n  align-items: center;\n  gap: 0.125rem;\n  font-size: 0.8125rem;\n  font-weight: 400;\n  color: #fff;\n}\n[data-agentation-theme=light] .styles-module__automationHeader___Avra9 {\n  color: rgba(0, 0, 0, 0.85);\n}\n\n.styles-module__automationDescription___vFTmJ {\n  font-size: 0.6875rem;\n  font-weight: 300;\n  color: rgba(255, 255, 255, 0.5);\n  margin-top: 2px;\n  line-height: 14px;\n}\n[data-agentation-theme=light] .styles-module__automationDescription___vFTmJ {\n  color: rgba(0, 0, 0, 0.5);\n}\n\n.styles-module__learnMoreLink___cG7OI {\n  color: rgba(255, 255, 255, 0.8);\n  text-decoration-line: underline;\n  text-decoration-style: dotted;\n  text-decoration-color: rgba(255, 255, 255, 0.2);\n  text-underline-offset: 2px;\n  transition: color 0.15s ease;\n}\n.styles-module__learnMoreLink___cG7OI:hover {\n  color: #fff;\n}\n[data-agentation-theme=light] .styles-module__learnMoreLink___cG7OI {\n  color: rgba(0, 0, 0, 0.6);\n  text-decoration-color: rgba(0, 0, 0, 0.2);\n}\n[data-agentation-theme=light] .styles-module__learnMoreLink___cG7OI:hover {\n  color: rgba(0, 0, 0, 0.85);\n}\n\n.styles-module__autoSendContainer___VpkXk {\n  display: flex;\n  align-items: center;\n}\n\n.styles-module__autoSendLabel___ngNdC {\n  padding-inline-end: 8px;\n  font-size: 11px;\n  font-weight: 400;\n  color: rgba(255, 255, 255, 0.4);\n  transition: color 0.15s, opacity 0.15s;\n  cursor: pointer;\n}\n.styles-module__autoSendLabel___ngNdC.styles-module__active___dpAhM {\n  color: #66b8ff;\n  color: color(display-p3 0.4 0.72 1);\n}\n[data-agentation-theme=light] .styles-module__autoSendLabel___ngNdC {\n  color: rgba(0, 0, 0, 0.4);\n}\n[data-agentation-theme=light] .styles-module__autoSendLabel___ngNdC.styles-module__active___dpAhM {\n  color: var(--agentation-color-blue);\n}\n.styles-module__autoSendLabel___ngNdC.styles-module__disabled___9AZYS {\n  opacity: 0.3;\n  cursor: not-allowed;\n}\n\n.styles-module__mcpStatusDot___8AMxP {\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n  flex-shrink: 0;\n}\n.styles-module__mcpStatusDot___8AMxP.styles-module__connecting___QEO1r {\n  background-color: var(--agentation-color-yellow);\n  animation: styles-module__mcpPulse___5Q3Jj 1.5s infinite;\n}\n.styles-module__mcpStatusDot___8AMxP.styles-module__connected___WyFkx {\n  background-color: var(--agentation-color-green);\n  animation: styles-module__mcpPulse___5Q3Jj 2.5s ease-in-out infinite;\n}\n.styles-module__mcpStatusDot___8AMxP.styles-module__disconnected___mvmvQ {\n  background-color: var(--agentation-color-red);\n  animation: styles-module__mcpPulseError___VHxhx 2s infinite;\n}\n\n.styles-module__mcpNavIndicator___auBHI {\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n  flex-shrink: 0;\n}\n.styles-module__mcpNavIndicator___auBHI.styles-module__connected___WyFkx {\n  background-color: var(--agentation-color-green);\n  animation: styles-module__mcpPulse___5Q3Jj 2.5s ease-in-out infinite;\n}\n.styles-module__mcpNavIndicator___auBHI.styles-module__connecting___QEO1r {\n  background-color: var(--agentation-color-yellow);\n  animation: styles-module__mcpPulse___5Q3Jj 1.5s ease-in-out infinite;\n}\n\n.styles-module__webhookUrlInput___WDDDC {\n  display: block;\n  width: 100%;\n  flex: 1;\n  min-height: 60px;\n  box-sizing: border-box;\n  margin-top: 11px;\n  padding: 8px 10px;\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  border-radius: 6px;\n  background: rgba(255, 255, 255, 0.03);\n  font-family: inherit;\n  font-size: 0.75rem;\n  font-weight: 400;\n  color: #fff;\n  outline: none;\n  resize: none;\n  user-select: text;\n  transition: border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease;\n}\n.styles-module__webhookUrlInput___WDDDC::placeholder {\n  color: rgba(255, 255, 255, 0.3);\n}\n.styles-module__webhookUrlInput___WDDDC:focus {\n  border-color: rgba(255, 255, 255, 0.3);\n  background: rgba(255, 255, 255, 0.08);\n}\n[data-agentation-theme=light] .styles-module__webhookUrlInput___WDDDC {\n  border-color: rgba(0, 0, 0, 0.1);\n  background: rgba(0, 0, 0, 0.03);\n  color: rgba(0, 0, 0, 0.85);\n}\n[data-agentation-theme=light] .styles-module__webhookUrlInput___WDDDC::placeholder {\n  color: rgba(0, 0, 0, 0.3);\n}\n[data-agentation-theme=light] .styles-module__webhookUrlInput___WDDDC:focus {\n  border-color: rgba(0, 0, 0, 0.25);\n  background: rgba(0, 0, 0, 0.05);\n}\n\n[data-agentation-theme=light] .styles-module__settingsPanel___qNkn- {\n  background: #fff;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04);\n}\n[data-agentation-theme=light] .styles-module__settingsPanel___qNkn-::before {\n  background: linear-gradient(to right, #fff 0%, transparent 100%);\n}\n[data-agentation-theme=light] .styles-module__settingsPanel___qNkn-::after {\n  background: linear-gradient(to left, #fff 0%, transparent 100%);\n}\n[data-agentation-theme=light] .styles-module__settingsPanel___qNkn- .styles-module__settingsHeader___Fn1DP {\n  border-bottom-color: rgba(0, 0, 0, 0.08);\n}\n[data-agentation-theme=light] .styles-module__settingsPanel___qNkn- .styles-module__settingsBrand___OoKlM {\n  color: #E5484D;\n}\n[data-agentation-theme=light] .styles-module__settingsPanel___qNkn- .styles-module__settingsVersion___rXmL9 {\n  color: rgba(0, 0, 0, 0.4);\n}\n[data-agentation-theme=light] .styles-module__settingsPanel___qNkn- .styles-module__settingsSection___n5V-4 {\n  border-top-color: rgba(0, 0, 0, 0.08);\n}\n[data-agentation-theme=light] .styles-module__settingsPanel___qNkn- .styles-module__settingsLabel___VCVOQ {\n  color: rgba(0, 0, 0, 0.5);\n}\n[data-agentation-theme=light] .styles-module__settingsPanel___qNkn- .styles-module__cycleButton___XMBx3 {\n  color: rgba(0, 0, 0, 0.85);\n}\n[data-agentation-theme=light] .styles-module__settingsPanel___qNkn- .styles-module__cycleDot___zgSXY {\n  background: rgba(0, 0, 0, 0.2);\n}\n[data-agentation-theme=light] .styles-module__settingsPanel___qNkn- .styles-module__cycleDot___zgSXY.styles-module__active___dpAhM {\n  background: rgba(0, 0, 0, 0.7);\n}\n[data-agentation-theme=light] .styles-module__settingsPanel___qNkn- .styles-module__dropdownButton___mKHe8 {\n  color: rgba(0, 0, 0, 0.85);\n}\n[data-agentation-theme=light] .styles-module__settingsPanel___qNkn- .styles-module__dropdownButton___mKHe8:hover {\n  background: rgba(0, 0, 0, 0.05);\n}\n\n.styles-module__checkboxField___ZrSqv:not(:first-child) {\n  margin-top: 8px;\n}\n\n.styles-module__divider___h6Yux {\n  margin-block: 8px;\n  width: 100%;\n  height: 1px;\n  background-color: rgba(26, 26, 26, 0.07);\n}\n[data-agentation-theme=dark] .styles-module__divider___h6Yux {\n  background-color: rgba(255, 255, 255, 0.07);\n}';
var classNames10 = { "settingsPanel": "styles-module__settingsPanel___qNkn-", "settingsHeader": "styles-module__settingsHeader___Fn1DP", "settingsBrand": "styles-module__settingsBrand___OoKlM", "settingsBrandSlash": "styles-module__settingsBrandSlash___Q-AU9", "settingsVersion": "styles-module__settingsVersion___rXmL9", "settingsSection": "styles-module__settingsSection___n5V-4", "settingsLabel": "styles-module__settingsLabel___VCVOQ", "cycleButton": "styles-module__cycleButton___XMBx3", "cycleDot": "styles-module__cycleDot___zgSXY", "dropdownButton": "styles-module__dropdownButton___mKHe8", "sliderLabel": "styles-module__sliderLabel___6K5v1", "slider": "styles-module__slider___v5z-c", "themeToggle": "styles-module__themeToggle___3imlT", "enter": "styles-module__enter___wginS", "exit": "styles-module__exit___A4iJc", "settingsOption": "styles-module__settingsOption___JoyH-", "selected": "styles-module__selected___k1-Vq", "settingsPanelContainer": "styles-module__settingsPanelContainer___5it-H", "settingsPage": "styles-module__settingsPage___BMn-3", "slideLeft": "styles-module__slideLeft___qUvW4", "automationsPage": "styles-module__automationsPage___N7By0", "slideIn": "styles-module__slideIn___uXDSu", "themeIconWrapper": "styles-module__themeIconWrapper___pyaYa", "themeIcon": "styles-module__themeIcon___w7lAm", "themeIconIn": "styles-module__themeIconIn___qUWMV", "settingsSectionGrow": "styles-module__settingsSectionGrow___eZTRw", "settingsRow": "styles-module__settingsRow___y-tDE", "settingsRowMarginTop": "styles-module__settingsRowMarginTop___uLpGb", "settingsRowDisabled": "styles-module__settingsRowDisabled___ydl3Q", "cycleButtonText": "styles-module__cycleButtonText___mbbnD", "cycleTextIn": "styles-module__cycleTextIn___VBNTi", "cycleDots": "styles-module__cycleDots___ehp6i", "active": "styles-module__active___dpAhM", "colorOptions": "styles-module__colorOptions___pbxZx", "colorOption": "styles-module__colorOption___Co955", "settingsNavLink": "styles-module__settingsNavLink___uYIwM", "settingsNavLinkRight": "styles-module__settingsNavLinkRight___XBUzC", "settingsBackButton": "styles-module__settingsBackButton___fflll", "automationHeader": "styles-module__automationHeader___Avra9", "automationDescription": "styles-module__automationDescription___vFTmJ", "learnMoreLink": "styles-module__learnMoreLink___cG7OI", "autoSendContainer": "styles-module__autoSendContainer___VpkXk", "autoSendLabel": "styles-module__autoSendLabel___ngNdC", "disabled": "styles-module__disabled___9AZYS", "mcpStatusDot": "styles-module__mcpStatusDot___8AMxP", "connecting": "styles-module__connecting___QEO1r", "mcpPulse": "styles-module__mcpPulse___5Q3Jj", "connected": "styles-module__connected___WyFkx", "disconnected": "styles-module__disconnected___mvmvQ", "mcpPulseError": "styles-module__mcpPulseError___VHxhx", "mcpNavIndicator": "styles-module__mcpNavIndicator___auBHI", "webhookUrlInput": "styles-module__webhookUrlInput___WDDDC", "checkboxField": "styles-module__checkboxField___ZrSqv", "divider": "styles-module__divider___h6Yux", "scaleIn": "styles-module__scaleIn___QpQ8E" };
if (typeof document !== "undefined") {
  let style = document.getElementById("feedback-tool-styles-settings-panel-styles");
  if (!style) {
    style = document.createElement("style");
    style.id = "feedback-tool-styles-settings-panel-styles";
    style.textContent = css10;
    document.head.appendChild(style);
  }
}
var styles_module_default9 = classNames10;
function SettingsPanel(props) {
  return ssr(_tmpl$198, ssrHydrationKey(), `${escape(styles_module_default9.settingsPanel, true)} ${props.isVisible ? escape(styles_module_default9.enter, true) : escape(styles_module_default9.exit, true)}`, ssrStyle(props.toolbarNearBottom ? { bottom: "auto", top: "calc(100% + 0.5rem)" } : void 0), ssrAttribute("class", escape(styles_module_default9.settingsPanelContainer, true), false), `${escape(styles_module_default9.settingsPage, true)} ${props.settingsPage === "automations" ? escape(styles_module_default9.slideLeft, true) : ""}`, ssrAttribute("class", escape(styles_module_default9.settingsHeader, true), false), ssrAttribute("class", escape(styles_module_default9.settingsBrand, true), false), ssrAttribute("class", escape(styles_module_default9.settingsVersion, true), false), ssrAttribute("class", escape(styles_module_default9.themeToggle, true), false) + ssrAttribute("title", props.isDarkMode ? "Switch to light mode" : "Switch to dark mode", false), ssrAttribute("class", escape(styles_module_default9.themeIconWrapper, true), false), ssrAttribute("class", escape(styles_module_default9.themeIcon, true), false), escape(createComponent(Show$1, { get when() {
    return props.isDarkMode;
  }, get fallback() {
    return createComponent(IconMoon, { size: 20 });
  }, get children() {
    return createComponent(IconSun, { size: 20 });
  } })), ssrAttribute("class", escape(styles_module_default9.divider, true), false), ssrAttribute("class", escape(styles_module_default9.settingsSection, true), false), ssrAttribute("class", escape(styles_module_default9.settingsRow, true), false), ssrAttribute("class", escape(styles_module_default9.settingsLabel, true), false), escape(createComponent(HelpTooltip, { content: "Controls how much detail is included in the copied output" })), ssrAttribute("class", escape(styles_module_default9.cycleButton, true), false), ssrAttribute("class", escape(styles_module_default9.cycleButtonText, true), false), escape(OUTPUT_DETAIL_OPTIONS.find((opt) => opt.value === props.settings.outputDetail)?.label), ssrAttribute("class", escape(styles_module_default9.cycleDots, true), false), escape(createComponent(For, { each: OUTPUT_DETAIL_OPTIONS, children: (option) => ssr(_tmpl$196, ssrHydrationKey(), `${escape(styles_module_default9.cycleDot, true)} ${props.settings.outputDetail === option.value ? escape(styles_module_default9.active, true) : ""}`) })), `${escape(styles_module_default9.settingsRow, true)} ${escape(styles_module_default9.settingsRowMarginTop, true)} ${!props.isDevMode ? escape(styles_module_default9.settingsRowDisabled, true) : ""}`, ssrAttribute("class", escape(styles_module_default9.settingsLabel, true), false), escape(createComponent(HelpTooltip, { get content() {
    return !props.isDevMode ? "Disabled — production builds minify component names, making detection unreliable. Use in development mode." : "Include SolidJS component names in annotations";
  } })), escape(createComponent(Switch, { get checked() {
    return props.isDevMode && props.settings.reactEnabled;
  }, onChange: (e) => props.onSettingsChange({ reactEnabled: e.target.checked }), get disabled() {
    return !props.isDevMode;
  } })), `${escape(styles_module_default9.settingsRow, true)} ${escape(styles_module_default9.settingsRowMarginTop, true)}`, ssrAttribute("class", escape(styles_module_default9.settingsLabel, true), false), escape(createComponent(HelpTooltip, { content: "Hides the toolbar until you open a new tab" })), escape(createComponent(Switch, { checked: false, onChange: (e) => {
    if (e.target.checked) props.onHideToolbar();
  } })), ssrAttribute("class", escape(styles_module_default9.divider, true), false), ssrAttribute("class", escape(styles_module_default9.settingsSection, true), false), `${escape(styles_module_default9.settingsLabel, true)} ${escape(styles_module_default9.settingsLabelMarker, true)}`, ssrAttribute("class", escape(styles_module_default9.colorOptions, true), false), escape(createComponent(For, { each: COLOR_OPTIONS, children: (color) => ssr(_tmpl$199, ssrHydrationKey(), `${escape(styles_module_default9.colorOption, true)} ${props.settings.annotationColorId === color.id ? escape(styles_module_default9.selected, true) : ""}`, ssrStyleProperty("--swatch:", escape(color.srgb, true)) + ssrStyleProperty(";--swatch-p3:", escape(color.p3, true)), ssrAttribute("title", escape(color.label, true), false)) })), ssrAttribute("class", escape(styles_module_default9.divider, true), false), ssrAttribute("class", escape(styles_module_default9.settingsSection, true), false), escape(createComponent(CheckboxField, { "class": "checkbox-field", label: "Clear on copy/send", get checked() {
    return props.settings.autoClearAfterCopy;
  }, onChange: (e) => props.onSettingsChange({ autoClearAfterCopy: e.target.checked }), tooltip: "Automatically clear annotations after copying" })), escape(createComponent(CheckboxField, { get ["class"]() {
    return styles_module_default9.checkboxField;
  }, label: "Block page interactions", get checked() {
    return props.settings.blockInteractions;
  }, onChange: (e) => props.onSettingsChange({ blockInteractions: e.target.checked }) })), ssrAttribute("class", escape(styles_module_default9.divider, true), false), ssrAttribute("class", escape(styles_module_default9.settingsNavLink, true), false), ssrAttribute("class", escape(styles_module_default9.settingsNavLinkRight, true), false), escape(createComponent(Show$1, { get when() {
    return props.endpoint && props.connectionStatus !== "disconnected";
  }, get children() {
    return ssr(_tmpl$196, ssrHydrationKey(), `${escape(styles_module_default9.mcpNavIndicator, true)} ${escape(styles_module_default9[props.connectionStatus], true)}`);
  } })), `${escape(styles_module_default9.settingsPage, true)} ${escape(styles_module_default9.automationsPage, true)} ${props.settingsPage === "automations" ? escape(styles_module_default9.slideIn, true) : ""}`, ssrAttribute("class", escape(styles_module_default9.settingsBackButton, true), false), escape(createComponent(IconChevronLeft, { size: 16 })), ssrAttribute("class", escape(styles_module_default9.divider, true), false), ssrAttribute("class", escape(styles_module_default9.settingsSection, true), false), ssrAttribute("class", escape(styles_module_default9.settingsRow, true), false), ssrAttribute("class", escape(styles_module_default9.automationHeader, true), false), escape(createComponent(HelpTooltip, { content: "Connect via Model Context Protocol to let AI agents like Claude Code receive annotations in real-time." })), escape(createComponent(Show$1, { get when() {
    return props.endpoint;
  }, get children() {
    return ssr(_tmpl$197, ssrHydrationKey(), `${escape(styles_module_default9.mcpStatusDot, true)} ${escape(styles_module_default9[props.connectionStatus], true)}`, ssrAttribute("title", props.connectionStatus === "connected" ? "Connected" : props.connectionStatus === "connecting" ? "Connecting..." : "Disconnected", false));
  } })), ssrAttribute("class", escape(styles_module_default9.automationDescription, true), false), ssrStyleProperty("padding-bottom:", "6px"), ssrAttribute("class", escape(styles_module_default9.learnMoreLink, true), false), ssrAttribute("class", escape(styles_module_default9.divider, true), false), `${escape(styles_module_default9.settingsSection, true)} ${escape(styles_module_default9.settingsSectionGrow, true)}`, ssrAttribute("class", escape(styles_module_default9.settingsRow, true), false), ssrAttribute("class", escape(styles_module_default9.automationHeader, true), false), escape(createComponent(HelpTooltip, { content: "Send annotation data to any URL endpoint when annotations change. Useful for custom integrations." })), ssrAttribute("class", escape(styles_module_default9.autoSendContainer, true), false), `${escape(styles_module_default9.autoSendLabel, true)} ${props.settings.webhooksEnabled ? escape(styles_module_default9.active, true) : ""} ${!props.settings.webhookUrl ? escape(styles_module_default9.disabled, true) : ""}`, escape(createComponent(Switch, { id: "agentation-auto-send", get checked() {
    return props.settings.webhooksEnabled;
  }, onChange: (e) => props.onSettingsChange({ webhooksEnabled: e.target.checked }), get disabled() {
    return !props.settings.webhookUrl;
  } })), ssrAttribute("class", escape(styles_module_default9.automationDescription, true), false), ssrAttribute("class", escape(styles_module_default9.webhookUrlInput, true), false), ssrAttribute("value", escape(props.settings.webhookUrl, true), false));
}
function identifyElementWithComponents(element, componentMode = "filtered") {
  const { name: elementName, path } = identifyElement(element);
  if (componentMode === "off") {
    return { name: elementName, elementName, path, reactComponents: null };
  }
  const info = getSolidComponentName(element, { mode: componentMode });
  return { name: info.path ? `${info.path} ${elementName}` : elementName, elementName, path, reactComponents: info.path };
}
var hasPlayedEntranceAnimation = false;
var DEFAULT_SETTINGS = { outputDetail: "standard", autoClearAfterCopy: false, annotationColorId: "blue", blockInteractions: true, reactEnabled: true, markerClickBehavior: "edit", webhookUrl: "", webhooksEnabled: true };
var isValidUrl = (url) => {
  if (!url || !url.trim()) return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};
var COLOR_OPTIONS = [{ id: "indigo", label: "Indigo", srgb: "#6155F5", p3: "color(display-p3 0.38 0.33 0.96)" }, { id: "blue", label: "Blue", srgb: "#0088FF", p3: "color(display-p3 0.00 0.53 1.00)" }, { id: "cyan", label: "Cyan", srgb: "#00C3D0", p3: "color(display-p3 0.00 0.76 0.82)" }, { id: "green", label: "Green", srgb: "#34C759", p3: "color(display-p3 0.20 0.78 0.35)" }, { id: "yellow", label: "Yellow", srgb: "#FFCC00", p3: "color(display-p3 1.00 0.80 0.00)" }, { id: "orange", label: "Orange", srgb: "#FF8D28", p3: "color(display-p3 1.00 0.55 0.16)" }, { id: "red", label: "Red", srgb: "#FF383C", p3: "color(display-p3 1.00 0.22 0.24)" }];
var injectAgentationColorTokens = () => {
  if (typeof document === "undefined") return;
  if (document.getElementById("agentation-color-tokens")) return;
  const style = document.createElement("style");
  style.id = "agentation-color-tokens";
  style.textContent = [...COLOR_OPTIONS.map((c) => `
      [data-agentation-accent="${c.id}"] {
        --agentation-color-accent: ${c.srgb};
      }

      @supports (color: color(display-p3 0 0 0)) {
        [data-agentation-accent="${c.id}"] {
          --agentation-color-accent: ${c.p3};
        }
      }
    `), `:root {
      ${COLOR_OPTIONS.map((c) => `--agentation-color-${c.id}: ${c.srgb};`).join("\n")}
    }`, `@supports (color: color(display-p3 0 0 0)) {
      :root {
        ${COLOR_OPTIONS.map((c) => `--agentation-color-${c.id}: ${c.p3};`).join("\n")}
      }
    }`].join("");
  document.head.appendChild(style);
};
injectAgentationColorTokens();
function deepElementFromPoint(x, y) {
  let element = document.elementFromPoint(x, y);
  if (!element) return null;
  while (element?.shadowRoot) {
    const deeper = element.shadowRoot.elementFromPoint(x, y);
    if (!deeper || deeper === element) break;
    element = deeper;
  }
  return element;
}
function isElementFixed(element) {
  let current = element;
  while (current && current !== document.body) {
    const style = window.getComputedStyle(current);
    const position = style.position;
    if (position === "fixed" || position === "sticky") {
      return true;
    }
    current = current.parentElement;
  }
  return false;
}
function isRenderableAnnotation(annotation) {
  return annotation.status !== "resolved" && annotation.status !== "dismissed";
}
function detectSourceFile(element) {
  return void 0;
}
function PageFeedbackToolbarCSS(props = {}) {
  const [isActive, setIsActive] = createSignal(false);
  const [annotations, setAnnotations] = createSignal([]);
  const [showMarkers, setShowMarkers] = createSignal(true);
  const [isToolbarHidden, setIsToolbarHidden] = createSignal(loadToolbarHidden());
  const [isToolbarHiding, setIsToolbarHiding] = createSignal(false);
  onMount(() => {
    const mark = (e) => {
    };
    const events = ["mousedown", "click", "pointerdown"];
    events.forEach((evt) => document.body.addEventListener(evt, mark, true));
    onCleanup(() => {
      events.forEach((evt) => document.body.removeEventListener(evt, mark, true));
    });
  });
  const [markersVisible, setMarkersVisible] = createSignal(false);
  const [markersExiting, setMarkersExiting] = createSignal(false);
  const [hoverInfo, setHoverInfo] = createSignal(null);
  const [hoverPosition, setHoverPosition] = createSignal({ x: 0, y: 0 });
  const [pendingAnnotation, setPendingAnnotation] = createSignal(null);
  const [copied, setCopied] = createSignal(false);
  const [sendState, setSendState] = createSignal("idle");
  const [cleared, setCleared] = createSignal(false);
  const [isClearing, setIsClearing] = createSignal(false);
  const [hoveredMarkerId, setHoveredMarkerId] = createSignal(null);
  const [hoveredTargetElement, setHoveredTargetElement] = createSignal(null);
  const [hoveredTargetElements, setHoveredTargetElements] = createSignal([]);
  const [deletingMarkerId, setDeletingMarkerId] = createSignal(null);
  const [renumberFrom, setRenumberFrom] = createSignal(null);
  const [editingAnnotation, setEditingAnnotation] = createSignal(null);
  const [editingTargetElement, setEditingTargetElement] = createSignal(null);
  const [editingTargetElements, setEditingTargetElements] = createSignal([]);
  const [scrollY, setScrollY] = createSignal(0);
  const [isScrolling, setIsScrolling] = createSignal(false);
  const [mounted, setMounted] = createSignal(false);
  const [isFrozen, setIsFrozen] = createSignal(false);
  const [showSettings, setShowSettings] = createSignal(false);
  const [showSettingsVisible, setShowSettingsVisible] = createSignal(false);
  const [settingsPage, setSettingsPage] = createSignal("main");
  const [tooltipsHidden, setTooltipsHidden] = createSignal(false);
  const [isDesignMode, setIsDesignMode] = createSignal(false);
  const [designOverlayExiting, setDesignOverlayExiting] = createSignal(false);
  const [designPlacements, setDesignPlacements] = createSignal([]);
  const [activeDesignComponent, setActiveDesignComponent] = createSignal(null);
  let designPlacementsLoaded = false;
  const [blankCanvas, setBlankCanvas] = createSignal(false);
  const [canvasReady, setCanvasReady] = createSignal(false);
  const [canvasOpacity, setCanvasOpacity] = createSignal(1);
  const [canvasPurpose, setCanvasPurpose] = createSignal("new-page");
  const [wireframePurpose, setWireframePurpose] = createSignal("");
  const [designInteracting, setDesignInteracting] = createSignal(false);
  const [rearrangeState, setRearrangeState] = createSignal(null);
  let rearrangeLoaded = false;
  let exploreStashRef = { rearrange: null, placements: [] };
  let wireframeStashRef = { rearrange: null, placements: [] };
  const [designDeselectSignal, setDesignDeselectSignal] = createSignal(0);
  const [rearrangeDeselectSignal, setRearrangeDeselectSignal] = createSignal(0);
  const [designClearSignal, setDesignClearSignal] = createSignal(0);
  const [rearrangeClearSignal, setRearrangeClearSignal] = createSignal(0);
  let designSelectedIdsRef = /* @__PURE__ */ new Set();
  let rearrangeSelectedIdsRef = /* @__PURE__ */ new Set();
  let crossDragStartRef = null;
  let designExitTimer;
  const [isDrawMode, setIsDrawMode] = createSignal(false);
  const [drawStrokes, setDrawStrokes] = createSignal([]);
  drawStrokes();
  const [hoveredDrawingIdx, setHoveredDrawingIdx] = createSignal(null);
  let placementAnnotationMap = /* @__PURE__ */ new Map();
  let rearrangeAnnotationMap = /* @__PURE__ */ new Map();
  let rearrangeDebounceTimer;
  const [tooltipSessionActive, setTooltipSessionActive] = createSignal(false);
  const [pendingMultiSelectElements, setPendingMultiSelectElements] = createSignal([]);
  let modifiersHeld = { cmd: false, shift: false };
  const hideTooltipsUntilMouseLeave = () => {
    setTooltipsHidden(true);
  };
  onCleanup(() => {
  });
  const [settings, setSettings] = createSignal((() => {
    try {
      const saved = JSON.parse(localStorage.getItem("feedback-toolbar-settings") ?? "");
      return { ...DEFAULT_SETTINGS, ...saved, annotationColorId: COLOR_OPTIONS.find((c) => c.id === saved.annotationColorId) ? saved.annotationColorId : DEFAULT_SETTINGS.annotationColorId };
    } catch {
      return DEFAULT_SETTINGS;
    }
  })());
  const [isDarkMode, setIsDarkMode] = createSignal(true);
  const [showEntranceAnimation, setShowEntranceAnimation] = createSignal(false);
  const toggleTheme = () => {
    setIsDarkMode((previous) => !previous);
    requestAnimationFrame(() => {
    });
  };
  const isDevMode = false;
  const effectiveReactMode = () => "off";
  const [currentSessionId, setCurrentSessionId] = createSignal(props.sessionId ?? null);
  let sessionInitializedRef = false;
  const [connectionStatus, setConnectionStatus] = createSignal(props.endpoint ? "connecting" : "disconnected");
  const [toolbarPosition, setToolbarPosition] = createSignal(null);
  const [isDraggingToolbar, setIsDraggingToolbar] = createSignal(false);
  const [dragStartPos, setDragStartPos] = createSignal(null);
  const [animatedMarkers, setAnimatedMarkers] = createSignal(/* @__PURE__ */ new Set());
  const [exitingMarkers, setExitingMarkers] = createSignal(/* @__PURE__ */ new Set());
  const [pendingExiting, setPendingExiting] = createSignal(false);
  const [editExiting, setEditExiting] = createSignal(false);
  const [isDragging, setIsDragging] = createSignal(false);
  let mouseDownPosRef = null;
  let dragStartRef = null;
  let justFinishedDragRef = false;
  let lastElementUpdateRef = 0;
  let recentlyAddedIdRef = null;
  let prevConnectionStatusRef = null;
  const DRAG_THRESHOLD = 8;
  const ELEMENT_UPDATE_THROTTLE = 50;
  let scrollTimeoutRef = null;
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/";
  createEffect(() => {
    if (showSettings()) {
      setShowSettingsVisible(true);
    } else {
      setTooltipsHidden(false);
      setSettingsPage("main");
      const timer = originalSetTimeout(() => setShowSettingsVisible(false), 0);
      onCleanup(() => clearTimeout(timer));
    }
  });
  createEffect(() => {
    const canvasShouldBeVisible = isDesignMode() && isActive() && !designOverlayExiting() && blankCanvas();
    if (canvasShouldBeVisible) {
      setCanvasReady(false);
      const raf = requestAnimationFrame(() => {
        setCanvasReady(true);
      });
      onCleanup(() => cancelAnimationFrame(raf));
    } else {
      setCanvasReady(false);
    }
  });
  const shouldShowMarkers = () => isActive() && showMarkers() && !isDesignMode();
  createEffect(() => {
    if (shouldShowMarkers()) {
      setMarkersExiting(false);
      setMarkersVisible(true);
      setAnimatedMarkers(/* @__PURE__ */ new Set());
      const timer = originalSetTimeout(() => {
        setAnimatedMarkers((prev) => {
          const newSet = new Set(prev);
          annotations().forEach((a) => newSet.add(a.id));
          return newSet;
        });
      }, 350);
      onCleanup(() => clearTimeout(timer));
    } else if (markersVisible()) {
      setMarkersExiting(true);
      const timer = originalSetTimeout(() => {
        setMarkersVisible(false);
        setMarkersExiting(false);
      }, 250);
      onCleanup(() => clearTimeout(timer));
    }
  });
  onMount(() => {
    setMounted(true);
    setScrollY(window.scrollY);
    const stored = loadAnnotations(pathname);
    setAnnotations(stored.filter(isRenderableAnnotation));
    if (!hasPlayedEntranceAnimation) {
      setShowEntranceAnimation(true);
      hasPlayedEntranceAnimation = true;
      originalSetTimeout(() => setShowEntranceAnimation(false), 750);
    }
    try {
      const savedTheme = localStorage.getItem("feedback-toolbar-theme");
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === "dark");
      }
    } catch (e) {
    }
    try {
      const savedPosition = localStorage.getItem("feedback-toolbar-position");
      if (savedPosition) {
        const pos = JSON.parse(savedPosition);
        if (typeof pos.x === "number" && typeof pos.y === "number") {
          setToolbarPosition(pos);
        }
      }
    } catch (e) {
    }
  });
  createEffect(() => {
    const s2 = settings();
    if (mounted()) {
      localStorage.setItem("feedback-toolbar-settings", JSON.stringify(s2));
    }
  });
  createEffect(() => {
    const dark = isDarkMode();
    if (mounted()) {
      localStorage.setItem("feedback-toolbar-theme", dark ? "dark" : "light");
    }
  });
  let prevDraggingRef = false;
  createEffect(() => {
    const wasDragging = prevDraggingRef;
    prevDraggingRef = isDraggingToolbar();
    if (wasDragging && !isDraggingToolbar() && toolbarPosition() && mounted()) {
      localStorage.setItem("feedback-toolbar-position", JSON.stringify(toolbarPosition()));
    }
  });
  createEffect(() => {
    const endpoint = props.endpoint;
    const initialSessionId = props.sessionId;
    const onSessionCreated = props.onSessionCreated;
    if (!endpoint || !mounted() || sessionInitializedRef) return;
    sessionInitializedRef = true;
    setConnectionStatus("connecting");
    const initSession = async () => {
      try {
        const storedSessionId = loadSessionId(pathname);
        const sessionIdToJoin = initialSessionId || storedSessionId;
        let sessionEstablished = false;
        if (sessionIdToJoin) {
          try {
            const session = await getSession(endpoint, sessionIdToJoin);
            setCurrentSessionId(session.id);
            setConnectionStatus("connected");
            saveSessionId(pathname, session.id);
            sessionEstablished = true;
            const allLocalAnnotations = loadAnnotations(pathname);
            const serverIds = new Set(session.annotations.map((a) => a.id));
            const localToMerge = allLocalAnnotations.filter((a) => {
              if (serverIds.has(a.id)) return false;
              return true;
            });
            if (localToMerge.length > 0) {
              const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
              const pageUrl = `${baseUrl}${pathname}`;
              const results = await Promise.allSettled(localToMerge.map((annotation) => syncAnnotation(endpoint, session.id, { ...annotation, sessionId: session.id, url: pageUrl })));
              const syncedAnnotations = results.map((result, i) => {
                if (result.status === "fulfilled") {
                  return result.value;
                }
                console.warn("[Agentation] Failed to sync annotation:", result.reason);
                return localToMerge[i];
              });
              const allAnnotations = [...session.annotations, ...syncedAnnotations];
              setAnnotations(allAnnotations.filter(isRenderableAnnotation));
              saveAnnotationsWithSyncMarker(pathname, allAnnotations.filter(isRenderableAnnotation), session.id);
            } else {
              setAnnotations(session.annotations.filter(isRenderableAnnotation));
              saveAnnotationsWithSyncMarker(pathname, session.annotations.filter(isRenderableAnnotation), session.id);
            }
          } catch (joinError) {
            console.warn("[Agentation] Could not join session, creating new:", joinError);
            clearSessionId(pathname);
          }
        }
        if (!sessionEstablished) {
          const currentUrl = typeof window !== "undefined" ? window.location.href : "/";
          const session = await createSession(endpoint, currentUrl);
          setCurrentSessionId(session.id);
          setConnectionStatus("connected");
          saveSessionId(pathname, session.id);
          onSessionCreated?.(session.id);
          const allAnnotations = loadAllAnnotations();
          const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
          const syncPromises = [];
          for (const [pagePath, pageAnnotations] of allAnnotations) {
            const unsyncedAnnotations = pageAnnotations.filter((a) => !a._syncedTo);
            if (unsyncedAnnotations.length === 0) continue;
            const pageUrl = `${baseUrl}${pagePath}`;
            const isCurrentPage = pagePath === pathname;
            syncPromises.push((async () => {
              try {
                const targetSession = isCurrentPage ? session : await createSession(endpoint, pageUrl);
                const results = await Promise.allSettled(unsyncedAnnotations.map((annotation) => syncAnnotation(endpoint, targetSession.id, { ...annotation, sessionId: targetSession.id, url: pageUrl })));
                const syncedAnnotations = results.map((result, i) => {
                  if (result.status === "fulfilled") {
                    return result.value;
                  }
                  console.warn("[Agentation] Failed to sync annotation:", result.reason);
                  return unsyncedAnnotations[i];
                });
                const renderableSyncedAnnotations = syncedAnnotations.filter(isRenderableAnnotation);
                saveAnnotationsWithSyncMarker(pagePath, renderableSyncedAnnotations, targetSession.id);
                if (isCurrentPage) {
                  const originalIds = new Set(unsyncedAnnotations.map((a) => a.id));
                  setAnnotations((prev) => {
                    const newDuringSync = prev.filter((a) => !originalIds.has(a.id));
                    return [...renderableSyncedAnnotations, ...newDuringSync];
                  });
                }
              } catch (err) {
                console.warn(`[Agentation] Failed to sync annotations for ${pagePath}:`, err);
              }
            })());
          }
          await Promise.allSettled(syncPromises);
        }
      } catch (error) {
        setConnectionStatus("disconnected");
        console.warn("[Agentation] Failed to initialize session, using local storage:", error);
      }
    };
    initSession();
  });
  createEffect(() => {
    const endpoint = props.endpoint;
    if (!endpoint || !mounted()) return;
    const checkHealth = async () => {
      try {
        const response = await fetch(`${endpoint}/health`);
        if (response.ok) {
          setConnectionStatus("connected");
        } else {
          setConnectionStatus("disconnected");
        }
      } catch {
        setConnectionStatus("disconnected");
      }
    };
    checkHealth();
    const interval = originalSetInterval(checkHealth, 1e4);
    onCleanup(() => clearInterval(interval));
  });
  createEffect(() => {
    const endpoint = props.endpoint;
    const sessId = currentSessionId();
    if (!endpoint || !mounted() || !sessId) return;
    const eventSource = new EventSource(`${endpoint}/sessions/${sessId}/events`);
    const removedStatuses = ["resolved", "dismissed"];
    const handler = (e) => {
      try {
        const event = JSON.parse(e.data);
        if (removedStatuses.includes(event.payload?.status)) {
          const id = event.payload.id;
          const kind = event.payload.kind;
          if (kind === "placement") {
            for (const [placementId, annotationId] of placementAnnotationMap) {
              if (annotationId === id) {
                placementAnnotationMap.delete(placementId);
                setDesignPlacements((prev) => prev.filter((p) => p.id !== placementId));
                break;
              }
            }
          } else if (kind === "rearrange") {
            for (const [sectionId, annotationId] of rearrangeAnnotationMap) {
              if (annotationId === id) {
                rearrangeAnnotationMap.delete(sectionId);
                setRearrangeState((prev) => {
                  if (!prev) return null;
                  const remaining = prev.sections.filter((s2) => s2.id !== sectionId);
                  if (remaining.length === 0) return null;
                  return { ...prev, sections: remaining };
                });
                break;
              }
            }
          } else {
            setExitingMarkers((prev) => new Set(prev).add(id));
            originalSetTimeout(() => {
              setAnnotations((prev) => prev.filter((a) => a.id !== id));
              setExitingMarkers((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
              });
            }, 150);
          }
        }
      } catch {
      }
    };
    eventSource.addEventListener("annotation.updated", handler);
    onCleanup(() => {
      eventSource.removeEventListener("annotation.updated", handler);
      eventSource.close();
    });
  });
  createEffect(() => {
    const endpoint = props.endpoint;
    const status = connectionStatus();
    const sessId = currentSessionId();
    if (!endpoint || !mounted()) return;
    const wasDisconnected = prevConnectionStatusRef === "disconnected";
    const isNowConnected = status === "connected";
    prevConnectionStatusRef = status;
    if (wasDisconnected && isNowConnected) {
      const syncLocalAnnotations = async () => {
        try {
          const localAnnotations = loadAnnotations(pathname);
          if (localAnnotations.length === 0) return;
          const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
          const pageUrl = `${baseUrl}${pathname}`;
          let sessionId = sessId;
          let serverAnnotations = [];
          if (sessionId) {
            try {
              const session = await getSession(endpoint, sessionId);
              serverAnnotations = session.annotations;
            } catch {
              sessionId = null;
            }
          }
          if (!sessionId) {
            const newSession = await createSession(endpoint, pageUrl);
            sessionId = newSession.id;
            setCurrentSessionId(sessionId);
            saveSessionId(pathname, sessionId);
          }
          const serverIds = new Set(serverAnnotations.map((a) => a.id));
          const unsyncedLocal = localAnnotations.filter((a) => !serverIds.has(a.id));
          if (unsyncedLocal.length > 0) {
            const results = await Promise.allSettled(unsyncedLocal.map((annotation) => syncAnnotation(endpoint, sessionId, { ...annotation, sessionId, url: pageUrl })));
            const syncedAnnotations = results.map((result, i) => {
              if (result.status === "fulfilled") {
                return result.value;
              }
              console.warn("[Agentation] Failed to sync annotation on reconnect:", result.reason);
              return unsyncedLocal[i];
            });
            const allAnnotations = [...serverAnnotations, ...syncedAnnotations];
            const renderableAnnotations = allAnnotations.filter(isRenderableAnnotation);
            setAnnotations(renderableAnnotations);
            saveAnnotationsWithSyncMarker(pathname, renderableAnnotations, sessionId);
          }
        } catch (err) {
          console.warn("[Agentation] Failed to sync on reconnect:", err);
        }
      };
      syncLocalAnnotations();
    }
  });
  const hideToolbarTemporarily = () => {
    if (isToolbarHiding()) return;
    setIsToolbarHiding(true);
    setShowSettings(false);
    setIsActive(false);
    originalSetTimeout(() => {
      saveToolbarHidden(true);
      setIsToolbarHidden(true);
      setIsToolbarHiding(false);
    }, 400);
  };
  createEffect(() => {
    if (!props.enableDemoMode) return;
    if (!mounted() || !props.demoAnnotations || props.demoAnnotations.length === 0) return;
    if (annotations().length > 0) return;
    const demoDelay = props.demoDelay ?? 1e3;
    const timeoutIds = [];
    timeoutIds.push(originalSetTimeout(() => {
      setIsActive(true);
    }, demoDelay - 200));
    props.demoAnnotations.forEach((demo, index) => {
      const annotationDelay = demoDelay + index * 300;
      timeoutIds.push(originalSetTimeout(() => {
        const element = document.querySelector(demo.selector);
        if (!element) return;
        const rect = element.getBoundingClientRect();
        const { name, path } = identifyElement(element);
        const newAnnotation = { id: `demo-${Date.now()}-${index}`, x: (rect.left + rect.width / 2) / window.innerWidth * 100, y: rect.top + rect.height / 2 + window.scrollY, comment: demo.comment, element: name, elementPath: path, timestamp: Date.now(), selectedText: demo.selectedText, boundingBox: { x: rect.left, y: rect.top + window.scrollY, width: rect.width, height: rect.height }, nearbyText: getNearbyText(element), cssClasses: getElementClasses(element) };
        setAnnotations((prev) => [...prev, newAnnotation]);
      }, annotationDelay));
    });
    onCleanup(() => {
      timeoutIds.forEach(clearTimeout);
    });
  });
  onMount(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setIsScrolling(true);
      if (scrollTimeoutRef) {
        clearTimeout(scrollTimeoutRef);
      }
      scrollTimeoutRef = originalSetTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    onCleanup(() => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef) {
        clearTimeout(scrollTimeoutRef);
      }
    });
  });
  createEffect(() => {
    const anns = annotations();
    const sessId = currentSessionId();
    if (mounted() && anns.length > 0) {
      if (sessId) {
        saveAnnotationsWithSyncMarker(pathname, anns, sessId);
      } else {
        saveAnnotations(pathname, anns);
      }
    } else if (mounted() && anns.length === 0) {
      localStorage.removeItem(getStorageKey(pathname));
    }
  });
  createEffect(() => {
    if (mounted() && !designPlacementsLoaded) {
      designPlacementsLoaded = true;
      const stored = loadDesignPlacements(pathname);
      if (stored.length > 0) setDesignPlacements(stored);
    }
  });
  createEffect(() => {
    const placements = designPlacements();
    const bc = blankCanvas();
    if (mounted() && designPlacementsLoaded && !bc) {
      if (placements.length > 0) {
        saveDesignPlacements(pathname, placements);
      } else {
        clearDesignPlacements(pathname);
      }
    }
  });
  createEffect(() => {
    if (mounted() && !rearrangeLoaded) {
      rearrangeLoaded = true;
      const stored = loadRearrangeState(pathname);
      if (stored) {
        const migrated = { ...stored, sections: stored.sections.map((s2) => ({ ...s2, currentRect: s2.currentRect ?? { ...s2.originalRect } })) };
        setRearrangeState(migrated);
      }
    }
  });
  createEffect(() => {
    const rs = rearrangeState();
    const bc = blankCanvas();
    if (mounted() && rearrangeLoaded && !bc) {
      if (rs) {
        saveRearrangeState(pathname, rs);
      } else {
        clearRearrangeState(pathname);
      }
    }
  });
  let wireframeLoaded = false;
  createEffect(() => {
    if (mounted() && !wireframeLoaded) {
      wireframeLoaded = true;
      const stored = loadWireframeState(pathname);
      if (stored) {
        wireframeStashRef = { rearrange: stored.rearrange, placements: stored.placements || [] };
        if (stored.purpose) setWireframePurpose(stored.purpose);
      }
    }
  });
  createEffect(() => {
    const rs = rearrangeState();
    const placements = designPlacements();
    const wp = wireframePurpose();
    const bc = blankCanvas();
    if (!mounted() || !wireframeLoaded) return;
    const stash = wireframeStashRef;
    if (bc) {
      const hasContent = (rs?.sections?.length ?? 0) > 0 || placements.length > 0 || wp;
      if (hasContent) {
        saveWireframeState(pathname, { rearrange: rs, placements, purpose: wp });
      } else {
        clearWireframeState(pathname);
      }
    } else {
      const hasContent = (stash.rearrange?.sections?.length ?? 0) > 0 || stash.placements.length > 0 || wp;
      if (hasContent) {
        saveWireframeState(pathname, { rearrange: stash.rearrange, placements: stash.placements, purpose: wp });
      } else {
        clearWireframeState(pathname);
      }
    }
  });
  createEffect(() => {
    if (isDesignMode() && !rearrangeState()) {
      setRearrangeState({ sections: [], originalOrder: [], detectedAt: Date.now() });
    }
  });
  createEffect(() => {
    const endpoint = props.endpoint;
    const sessId = currentSessionId();
    const placements = designPlacements();
    if (!endpoint || !sessId) return;
    const currentMap = placementAnnotationMap;
    const currentIds = new Set(placements.map((p) => p.id));
    for (const p of placements) {
      if (currentMap.has(p.id)) continue;
      currentMap.set(p.id, "");
      const pageUrl = typeof window !== "undefined" ? window.location.pathname + window.location.search + window.location.hash : pathname;
      syncAnnotation(endpoint, sessId, { id: p.id, x: p.x / window.innerWidth * 100, y: p.y, comment: `Place ${p.type} at (${Math.round(p.x)}, ${Math.round(p.y)}), ${p.width}×${p.height}px${p.text ? ` — "${p.text}"` : ""}`, element: `[design:${p.type}]`, elementPath: "[placement]", timestamp: p.timestamp, url: pageUrl, intent: "change", severity: "important", kind: "placement", placement: { componentType: p.type, width: p.width, height: p.height, scrollY: p.scrollY, text: p.text } }).then((serverAnnotation) => {
        if (currentMap.has(p.id)) {
          currentMap.set(p.id, serverAnnotation.id);
        }
      }).catch((err) => {
        console.warn("[Agentation] Failed to sync placement annotation:", err);
        currentMap.delete(p.id);
      });
    }
    for (const [placementId, annotationId] of currentMap) {
      if (!currentIds.has(placementId)) {
        currentMap.delete(placementId);
        if (annotationId) {
          deleteAnnotation(endpoint, annotationId).catch(() => {
          });
        }
      }
    }
  });
  createEffect(() => {
    const endpoint = props.endpoint;
    const sessId = currentSessionId();
    const rs = rearrangeState();
    if (!endpoint || !sessId) return;
    if (rearrangeDebounceTimer) {
      clearTimeout(rearrangeDebounceTimer);
    }
    rearrangeDebounceTimer = originalSetTimeout(() => {
      const currentMap = rearrangeAnnotationMap;
      if (!rs || rs.sections.length === 0) {
        for (const [, annotationId] of currentMap) {
          if (annotationId) {
            deleteAnnotation(endpoint, annotationId).catch(() => {
            });
          }
        }
        currentMap.clear();
        return;
      }
      const currentIds = new Set(rs.sections.map((s2) => s2.id));
      const pageUrl = typeof window !== "undefined" ? window.location.pathname + window.location.search + window.location.hash : pathname;
      for (const section of rs.sections) {
        const orig = section.originalRect;
        const curr = section.currentRect;
        const hasMoved = Math.abs(orig.x - curr.x) > 1 || Math.abs(orig.y - curr.y) > 1 || Math.abs(orig.width - curr.width) > 1 || Math.abs(orig.height - curr.height) > 1;
        if (!hasMoved) {
          const existingId = currentMap.get(section.id);
          if (existingId) {
            currentMap.delete(section.id);
            deleteAnnotation(endpoint, existingId).catch(() => {
            });
          }
          continue;
        }
        const existingAnnotationId = currentMap.get(section.id);
        if (existingAnnotationId) {
          updateAnnotation(endpoint, existingAnnotationId, { comment: `Move ${section.label} section (${section.tagName}) — from (${Math.round(orig.x)},${Math.round(orig.y)}) ${Math.round(orig.width)}×${Math.round(orig.height)} to (${Math.round(curr.x)},${Math.round(curr.y)}) ${Math.round(curr.width)}×${Math.round(curr.height)}` }).catch((err) => {
            console.warn("[Agentation] Failed to update rearrange annotation:", err);
          });
        } else {
          currentMap.set(section.id, "");
          syncAnnotation(endpoint, sessId, { id: section.id, x: curr.x / window.innerWidth * 100, y: curr.y, comment: `Move ${section.label} section (${section.tagName}) — from (${Math.round(orig.x)},${Math.round(orig.y)}) ${Math.round(orig.width)}×${Math.round(orig.height)} to (${Math.round(curr.x)},${Math.round(curr.y)}) ${Math.round(curr.width)}×${Math.round(curr.height)}`, element: section.selector, elementPath: "[rearrange]", timestamp: Date.now(), url: pageUrl, intent: "change", severity: "important", kind: "rearrange", rearrange: { selector: section.selector, label: section.label, tagName: section.tagName, originalRect: orig, currentRect: curr } }).then((serverAnnotation) => {
            if (currentMap.has(section.id)) {
              currentMap.set(section.id, serverAnnotation.id);
            }
          }).catch((err) => {
            console.warn("[Agentation] Failed to sync rearrange annotation:", err);
            currentMap.delete(section.id);
          });
        }
      }
      for (const [sectionId, annotationId] of currentMap) {
        if (!currentIds.has(sectionId)) {
          currentMap.delete(sectionId);
          if (annotationId) {
            deleteAnnotation(endpoint, annotationId).catch(() => {
            });
          }
        }
      }
    }, 300);
    onCleanup(() => {
      if (rearrangeDebounceTimer) {
        clearTimeout(rearrangeDebounceTimer);
      }
    });
  });
  let rearrangeMovedEls = /* @__PURE__ */ new Map();
  createEffect(() => {
    const sections = rearrangeState()?.sections ?? [];
    const active = /* @__PURE__ */ new Set();
    const dm = isDesignMode();
    const doe = designOverlayExiting();
    const ia = isActive();
    if ((dm || doe) && ia) {
      for (const s2 of sections) {
        active.add(s2.id);
        try {
          const el = document.querySelector(s2.selector);
          if (!el) continue;
          if (!rearrangeMovedEls.has(s2.id)) {
            const origStyles = { transform: el.style.transform, transformOrigin: el.style.transformOrigin, opacity: el.style.opacity, position: el.style.position, zIndex: el.style.zIndex, display: el.style.display };
            const ancestors = [];
            let parent = el.parentElement;
            while (parent && parent !== document.body) {
              const cs = getComputedStyle(parent);
              if (cs.overflow !== "visible" || cs.overflowX !== "visible" || cs.overflowY !== "visible") {
                ancestors.push({ el: parent, overflow: parent.style.overflow });
                parent.style.overflow = "visible";
              }
              parent = parent.parentElement;
            }
            const computed = getComputedStyle(el);
            if (computed.display === "inline") {
              el.style.display = "inline-block";
            }
            rearrangeMovedEls.set(s2.id, { el, origStyles, ancestors });
            el.style.transformOrigin = "top left";
            el.style.zIndex = "9999";
          }
        } catch {
        }
      }
    }
    for (const [id, entry] of rearrangeMovedEls) {
      if (!active.has(id)) {
        const { el, origStyles, ancestors } = entry;
        el.style.transition = "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1)";
        el.style.transform = origStyles.transform;
        el.style.transformOrigin = origStyles.transformOrigin;
        el.style.opacity = origStyles.opacity;
        el.style.position = origStyles.position;
        el.style.zIndex = origStyles.zIndex;
        rearrangeMovedEls.delete(id);
        originalSetTimeout(() => {
          el.style.transition = "";
          el.style.display = origStyles.display;
          for (const a of ancestors) {
            a.el.style.overflow = a.overflow;
          }
        }, 450);
      }
    }
  });
  onCleanup(() => {
    for (const [, entry] of rearrangeMovedEls) {
      const { el, origStyles, ancestors } = entry;
      el.style.transition = "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1)";
      el.style.transform = origStyles.transform;
      el.style.transformOrigin = origStyles.transformOrigin;
      el.style.opacity = origStyles.opacity;
      el.style.position = origStyles.position;
      el.style.zIndex = origStyles.zIndex;
      setTimeout(() => {
        el.style.transition = "";
        el.style.display = origStyles.display;
        for (const a of ancestors) {
          a.el.style.overflow = a.overflow;
        }
      }, 450);
    }
    rearrangeMovedEls.clear();
  });
  const closeDesignMode = () => {
    setDesignOverlayExiting(true);
    setIsDesignMode(false);
    setActiveDesignComponent(null);
    clearTimeout(designExitTimer);
    designExitTimer = setTimeout(() => {
      setDesignOverlayExiting(false);
    }, 300);
  };
  const deactivate = () => {
    if (isDesignMode()) {
      setDesignOverlayExiting(true);
      setIsDesignMode(false);
      setActiveDesignComponent(null);
      clearTimeout(designExitTimer);
      designExitTimer = setTimeout(() => {
        setDesignOverlayExiting(false);
      }, 300);
    }
    setIsActive(false);
  };
  const freezeAnimations = () => {
    if (isFrozen()) return;
    freeze();
    setIsFrozen(true);
  };
  const unfreezeAnimations = () => {
    if (!isFrozen()) return;
    unfreeze();
    setIsFrozen(false);
  };
  const toggleFreeze = () => {
    if (isFrozen()) {
      unfreezeAnimations();
    } else {
      freezeAnimations();
    }
  };
  const createMultiSelectPendingAnnotation = () => {
    if (pendingMultiSelectElements().length === 0) return;
    const elements = pendingMultiSelectElements();
    const firstItem = elements[0];
    const firstEl = firstItem.element;
    const isMulti = elements.length > 1;
    const freshRects = elements.map((item) => item.element.getBoundingClientRect());
    if (!isMulti) {
      const rect = freshRects[0];
      const isFixed = isElementFixed(firstEl);
      setPendingAnnotation({ x: rect.left / window.innerWidth * 100, y: isFixed ? rect.top : rect.top + window.scrollY, clientY: rect.top, element: firstItem.name, elementPath: firstItem.path, boundingBox: { x: rect.left, y: isFixed ? rect.top : rect.top + window.scrollY, width: rect.width, height: rect.height }, isFixed, fullPath: getFullElementPath(firstEl), accessibility: getAccessibilityInfo(firstEl), computedStyles: getForensicComputedStyles(firstEl), computedStylesObj: getDetailedComputedStyles(firstEl), nearbyElements: getNearbyElements(firstEl), cssClasses: getElementClasses(firstEl), nearbyText: getNearbyText(firstEl), reactComponents: firstItem.reactComponents, sourceFile: detectSourceFile() });
    } else {
      const bounds = { left: Math.min(...freshRects.map((r) => r.left)), top: Math.min(...freshRects.map((r) => r.top)), right: Math.max(...freshRects.map((r) => r.right)), bottom: Math.max(...freshRects.map((r) => r.bottom)) };
      const names = elements.slice(0, 5).map((item) => item.name).join(", ");
      const suffix = elements.length > 5 ? ` +${elements.length - 5} more` : "";
      const elementBoundingBoxes = freshRects.map((rect) => ({ x: rect.left, y: rect.top + window.scrollY, width: rect.width, height: rect.height }));
      const lastItem = elements[elements.length - 1];
      const lastEl = lastItem.element;
      const lastRect = freshRects[freshRects.length - 1];
      const lastCenterX = lastRect.left + lastRect.width / 2;
      const lastCenterY = lastRect.top + lastRect.height / 2;
      const lastIsFixed = isElementFixed(lastEl);
      setPendingAnnotation({
        x: lastCenterX / window.innerWidth * 100,
        y: lastIsFixed ? lastCenterY : lastCenterY + window.scrollY,
        clientY: lastCenterY,
        element: `${elements.length} elements: ${names}${suffix}`,
        elementPath: "multi-select",
        boundingBox: { x: bounds.left, y: bounds.top + window.scrollY, width: bounds.right - bounds.left, height: bounds.bottom - bounds.top },
        isMultiSelect: true,
        isFixed: lastIsFixed,
        elementBoundingBoxes,
        multiSelectElements: elements.map((item) => item.element),
        targetElement: lastEl,
        // Anchor marker/popup to last clicked element
        fullPath: getFullElementPath(firstEl),
        accessibility: getAccessibilityInfo(firstEl),
        computedStyles: getForensicComputedStyles(firstEl),
        computedStylesObj: getDetailedComputedStyles(firstEl),
        nearbyElements: getNearbyElements(firstEl),
        cssClasses: getElementClasses(firstEl),
        nearbyText: getNearbyText(firstEl),
        sourceFile: detectSourceFile()
      });
    }
    setPendingMultiSelectElements([]);
    setHoverInfo(null);
  };
  createEffect(() => {
    if (!isActive()) {
      setPendingAnnotation(null);
      setEditingAnnotation(null);
      setEditingTargetElement(null);
      setEditingTargetElements([]);
      setHoverInfo(null);
      setShowSettings(false);
      setPendingMultiSelectElements([]);
      modifiersHeld = { cmd: false, shift: false };
      if (isFrozen()) {
        unfreezeAnimations();
      }
    }
  });
  onCleanup(() => {
    unfreeze();
  });
  createEffect(() => {
    if (!isActive()) return;
    const textElementsSelector = ["p", "span", "h1", "h2", "h3", "h4", "h5", "h6", "li", "td", "th", "label", "blockquote", "figcaption", "caption", "legend", "dt", "dd", "pre", "code", "em", "strong", "b", "i", "u", "s", "a", "time", "address", "cite", "q", "abbr", "dfn", "mark", "small", "sub", "sup", "[contenteditable]"].join(", ");
    const notAgentationSelector = `:not([data-agentation-root]):not([data-agentation-root] *)`;
    const style = document.createElement("style");
    style.id = "feedback-cursor-styles";
    style.textContent = `
      body ${notAgentationSelector} {
        cursor: crosshair !important;
      }

      body :is(${textElementsSelector})${notAgentationSelector} {
        cursor: text !important;
      }
    `;
    document.head.appendChild(style);
    onCleanup(() => {
      const existingStyle = document.getElementById("feedback-cursor-styles");
      if (existingStyle) existingStyle.remove();
    });
  });
  createEffect(() => {
    if (hoveredDrawingIdx() !== null && isActive()) {
      document.documentElement.setAttribute("data-drawing-hover", "");
      onCleanup(() => document.documentElement.removeAttribute("data-drawing-hover"));
    }
  });
  createEffect(() => {
    if (!isActive() || pendingAnnotation() || isDrawMode() || isDesignMode()) return;
    const handleMouseMove = (e) => {
      const target = e.composedPath()[0] || e.target;
      if (closestCrossingShadow(target, "[data-feedback-toolbar]")) {
        setHoverInfo(null);
        return;
      }
      const elementUnder = deepElementFromPoint(e.clientX, e.clientY);
      if (!elementUnder || closestCrossingShadow(elementUnder, "[data-feedback-toolbar]")) {
        setHoverInfo(null);
        return;
      }
      const { name, elementName, path, reactComponents } = identifyElementWithComponents(elementUnder, effectiveReactMode());
      const rect = elementUnder.getBoundingClientRect();
      setHoverInfo({ element: name, elementName, elementPath: path, rect, reactComponents });
      setHoverPosition({ x: e.clientX, y: e.clientY });
    };
    document.addEventListener("mousemove", handleMouseMove);
    onCleanup(() => document.removeEventListener("mousemove", handleMouseMove));
  });
  createEffect(() => {
    if (!isActive() || isDrawMode() || isDesignMode()) return;
    const handleClick = (e) => {
      if (justFinishedDragRef) {
        justFinishedDragRef = false;
        return;
      }
      const target = e.composedPath()[0] || e.target;
      if (closestCrossingShadow(target, "[data-feedback-toolbar]")) return;
      if (closestCrossingShadow(target, "[data-annotation-popup]")) return;
      if (closestCrossingShadow(target, "[data-annotation-marker]")) return;
      if (e.metaKey && e.shiftKey && !pendingAnnotation() && !editingAnnotation()) {
        e.preventDefault();
        e.stopPropagation();
        const elementUnder2 = deepElementFromPoint(e.clientX, e.clientY);
        if (!elementUnder2) return;
        const rect2 = elementUnder2.getBoundingClientRect();
        const { name: name2, path: path2, reactComponents: reactComponents2 } = identifyElementWithComponents(elementUnder2, effectiveReactMode());
        const existingIndex = pendingMultiSelectElements().findIndex((item) => item.element === elementUnder2);
        if (existingIndex >= 0) {
          setPendingMultiSelectElements((prev) => prev.filter((_, i) => i !== existingIndex));
        } else {
          setPendingMultiSelectElements((prev) => [...prev, { element: elementUnder2, rect: rect2, name: name2, path: path2, reactComponents: reactComponents2 ?? void 0 }]);
        }
        return;
      }
      const isInteractive = closestCrossingShadow(target, "button, a, input, select, textarea, [role='button'], [onclick]");
      if (settings().blockInteractions && isInteractive) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (pendingAnnotation()) {
        if (isInteractive && !settings().blockInteractions) {
          return;
        }
        e.preventDefault();
        return;
      }
      if (editingAnnotation()) {
        if (isInteractive && !settings().blockInteractions) {
          return;
        }
        e.preventDefault();
        return;
      }
      e.preventDefault();
      const elementUnder = deepElementFromPoint(e.clientX, e.clientY);
      if (!elementUnder) return;
      const { name, path, reactComponents } = identifyElementWithComponents(elementUnder, effectiveReactMode());
      const rect = elementUnder.getBoundingClientRect();
      const x = e.clientX / window.innerWidth * 100;
      const isFixed = isElementFixed(elementUnder);
      const y = isFixed ? e.clientY : e.clientY + window.scrollY;
      const selection = window.getSelection();
      let selectedText;
      if (selection && selection.toString().trim().length > 0) {
        selectedText = selection.toString().trim().slice(0, 500);
      }
      const computedStylesObj = getDetailedComputedStyles(elementUnder);
      const computedStylesStr = getForensicComputedStyles(elementUnder);
      setPendingAnnotation({
        x,
        y,
        clientY: e.clientY,
        element: name,
        elementPath: path,
        selectedText,
        boundingBox: { x: rect.left, y: isFixed ? rect.top : rect.top + window.scrollY, width: rect.width, height: rect.height },
        nearbyText: getNearbyText(elementUnder),
        cssClasses: getElementClasses(elementUnder),
        isFixed,
        fullPath: getFullElementPath(elementUnder),
        accessibility: getAccessibilityInfo(elementUnder),
        computedStyles: computedStylesStr,
        computedStylesObj,
        nearbyElements: getNearbyElements(elementUnder),
        reactComponents: reactComponents ?? void 0,
        sourceFile: detectSourceFile(),
        targetElement: elementUnder
        // Store for live position queries
      });
      setHoverInfo(null);
    };
    document.addEventListener("click", handleClick, true);
    onCleanup(() => document.removeEventListener("click", handleClick, true));
  });
  createEffect(() => {
    if (!isActive()) return;
    const handleKeyDown = (e) => {
      if (e.key === "Meta") modifiersHeld.cmd = true;
      if (e.key === "Shift") modifiersHeld.shift = true;
    };
    const handleKeyUp = (e) => {
      const wasHoldingBoth = modifiersHeld.cmd && modifiersHeld.shift;
      if (e.key === "Meta") modifiersHeld.cmd = false;
      if (e.key === "Shift") modifiersHeld.shift = false;
      const nowHoldingBoth = modifiersHeld.cmd && modifiersHeld.shift;
      if (wasHoldingBoth && !nowHoldingBoth && pendingMultiSelectElements().length > 0) {
        createMultiSelectPendingAnnotation();
      }
    };
    const handleBlur = () => {
      modifiersHeld = { cmd: false, shift: false };
      setPendingMultiSelectElements([]);
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);
    onCleanup(() => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    });
  });
  createEffect(() => {
    if (!isActive() || pendingAnnotation() || isDrawMode() || isDesignMode()) return;
    const handleMouseDown = (e) => {
      const target = e.composedPath()[0] || e.target;
      if (closestCrossingShadow(target, "[data-feedback-toolbar]")) return;
      if (closestCrossingShadow(target, "[data-annotation-marker]")) return;
      if (closestCrossingShadow(target, "[data-annotation-popup]")) return;
      const textTags = /* @__PURE__ */ new Set(["P", "SPAN", "H1", "H2", "H3", "H4", "H5", "H6", "LI", "TD", "TH", "LABEL", "BLOCKQUOTE", "FIGCAPTION", "CAPTION", "LEGEND", "DT", "DD", "PRE", "CODE", "EM", "STRONG", "B", "I", "U", "S", "A", "TIME", "ADDRESS", "CITE", "Q", "ABBR", "DFN", "MARK", "SMALL", "SUB", "SUP"]);
      if (textTags.has(target.tagName) || target.isContentEditable) {
        return;
      }
      e.preventDefault();
      mouseDownPosRef = { x: e.clientX, y: e.clientY };
    };
    document.addEventListener("mousedown", handleMouseDown);
    onCleanup(() => document.removeEventListener("mousedown", handleMouseDown));
  });
  createEffect(() => {
    if (!isActive() || pendingAnnotation()) return;
    const handleMouseMove = (e) => {
      if (!mouseDownPosRef) return;
      const dx = e.clientX - mouseDownPosRef.x;
      const dy = e.clientY - mouseDownPosRef.y;
      const distance = dx * dx + dy * dy;
      const thresholdSq = DRAG_THRESHOLD * DRAG_THRESHOLD;
      if (!isDragging() && distance >= thresholdSq) {
        dragStartRef = mouseDownPosRef;
        setIsDragging(true);
        e.preventDefault();
      }
      if ((isDragging() || distance >= thresholdSq) && dragStartRef) {
        const now = Date.now();
        if (now - lastElementUpdateRef < ELEMENT_UPDATE_THROTTLE) {
          return;
        }
        lastElementUpdateRef = now;
        const startX = dragStartRef.x;
        const startY = dragStartRef.y;
        const left = Math.min(startX, e.clientX);
        const top = Math.min(startY, e.clientY);
        const right = Math.max(startX, e.clientX);
        const bottom = Math.max(startY, e.clientY);
        const midX = (left + right) / 2;
        const midY = (top + bottom) / 2;
        const candidateElements = /* @__PURE__ */ new Set();
        const points = [[left, top], [right, top], [left, bottom], [right, bottom], [midX, midY], [midX, top], [midX, bottom], [left, midY], [right, midY]];
        for (const [x, y] of points) {
          const elements = document.elementsFromPoint(x, y);
          for (const el of elements) {
            if (el instanceof HTMLElement) candidateElements.add(el);
          }
        }
        const nearbyElements = document.querySelectorAll("button, a, input, img, p, h1, h2, h3, h4, h5, h6, li, label, td, th, div, span, section, article, aside, nav");
        for (const el of nearbyElements) {
          if (el instanceof HTMLElement) {
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const centerInside = centerX >= left && centerX <= right && centerY >= top && centerY <= bottom;
            const overlapX = Math.min(rect.right, right) - Math.max(rect.left, left);
            const overlapY = Math.min(rect.bottom, bottom) - Math.max(rect.top, top);
            const overlapArea = overlapX > 0 && overlapY > 0 ? overlapX * overlapY : 0;
            const elementArea = rect.width * rect.height;
            const overlapRatio = elementArea > 0 ? overlapArea / elementArea : 0;
            if (centerInside || overlapRatio > 0.5) {
              candidateElements.add(el);
            }
          }
        }
        const allMatching = [];
        const meaningfulTags = /* @__PURE__ */ new Set(["BUTTON", "A", "INPUT", "IMG", "P", "H1", "H2", "H3", "H4", "H5", "H6", "LI", "LABEL", "TD", "TH", "SECTION", "ARTICLE", "ASIDE", "NAV"]);
        for (const el of candidateElements) {
          if (closestCrossingShadow(el, "[data-feedback-toolbar]") || closestCrossingShadow(el, "[data-annotation-marker]")) continue;
          const rect = el.getBoundingClientRect();
          if (rect.width > window.innerWidth * 0.8 && rect.height > window.innerHeight * 0.5) continue;
          if (rect.width < 10 || rect.height < 10) continue;
          if (rect.left < right && rect.right > left && rect.top < bottom && rect.bottom > top) {
            const tagName = el.tagName;
            let shouldInclude = meaningfulTags.has(tagName);
            if (!shouldInclude && (tagName === "DIV" || tagName === "SPAN")) {
              const hasText = el.textContent && el.textContent.trim().length > 0;
              const isInteractive = el.onclick !== null || el.getAttribute("role") === "button" || el.getAttribute("role") === "link" || el.classList.contains("clickable") || el.hasAttribute("data-clickable");
              if ((hasText || isInteractive) && !el.querySelector("p, h1, h2, h3, h4, h5, h6, button, a")) {
                shouldInclude = true;
              }
            }
            if (shouldInclude) {
              let dominated = false;
              for (const existingRect of allMatching) {
                if (existingRect.left <= rect.left && existingRect.right >= rect.right && existingRect.top <= rect.top && existingRect.bottom >= rect.bottom) {
                  dominated = true;
                  break;
                }
              }
              if (!dominated) allMatching.push(rect);
            }
          }
        }
      }
    };
    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    onCleanup(() => document.removeEventListener("mousemove", handleMouseMove));
  });
  createEffect(() => {
    if (!isActive()) return;
    const handleMouseUp = (e) => {
      const wasDragging = isDragging();
      const dragStart = dragStartRef;
      if (isDragging() && dragStart) {
        justFinishedDragRef = true;
        const left = Math.min(dragStart.x, e.clientX);
        const top = Math.min(dragStart.y, e.clientY);
        const right = Math.max(dragStart.x, e.clientX);
        const bottom = Math.max(dragStart.y, e.clientY);
        const allMatching = [];
        const selector = "button, a, input, img, p, h1, h2, h3, h4, h5, h6, li, label, td, th";
        document.querySelectorAll(selector).forEach((el) => {
          if (!(el instanceof HTMLElement)) return;
          if (closestCrossingShadow(el, "[data-feedback-toolbar]") || closestCrossingShadow(el, "[data-annotation-marker]")) return;
          const rect = el.getBoundingClientRect();
          if (rect.width > window.innerWidth * 0.8 && rect.height > window.innerHeight * 0.5) return;
          if (rect.width < 10 || rect.height < 10) return;
          if (rect.left < right && rect.right > left && rect.top < bottom && rect.bottom > top) {
            allMatching.push({ element: el, rect });
          }
        });
        const finalElements = allMatching.filter(({ element: el }) => !allMatching.some(({ element: other }) => other !== el && el.contains(other)));
        const x = e.clientX / window.innerWidth * 100;
        const y = e.clientY + window.scrollY;
        if (finalElements.length > 0) {
          const bounds = finalElements.reduce((acc, { rect }) => ({ left: Math.min(acc.left, rect.left), top: Math.min(acc.top, rect.top), right: Math.max(acc.right, rect.right), bottom: Math.max(acc.bottom, rect.bottom) }), { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity });
          const elementNames = finalElements.slice(0, 5).map(({ element }) => identifyElement(element).name).join(", ");
          const suffix = finalElements.length > 5 ? ` +${finalElements.length - 5} more` : "";
          const firstElement = finalElements[0].element;
          const firstElementComputedStyles = getDetailedComputedStyles(firstElement);
          const firstElementComputedStylesStr = getForensicComputedStyles(firstElement);
          setPendingAnnotation({
            x,
            y,
            clientY: e.clientY,
            element: `${finalElements.length} elements: ${elementNames}${suffix}`,
            elementPath: "multi-select",
            boundingBox: { x: bounds.left, y: bounds.top + window.scrollY, width: bounds.right - bounds.left, height: bounds.bottom - bounds.top },
            isMultiSelect: true,
            // Forensic data from first element
            fullPath: getFullElementPath(firstElement),
            accessibility: getAccessibilityInfo(firstElement),
            computedStyles: firstElementComputedStylesStr,
            computedStylesObj: firstElementComputedStyles,
            nearbyElements: getNearbyElements(firstElement),
            cssClasses: getElementClasses(firstElement),
            nearbyText: getNearbyText(firstElement),
            sourceFile: detectSourceFile()
          });
        } else {
          const width = Math.abs(right - left);
          const height = Math.abs(bottom - top);
          if (width > 20 && height > 20) {
            setPendingAnnotation({ x, y, clientY: e.clientY, element: "Area selection", elementPath: `region at (${Math.round(left)}, ${Math.round(top)})`, boundingBox: { x: left, y: top + window.scrollY, width, height }, isMultiSelect: true });
          }
        }
        setHoverInfo(null);
      } else if (wasDragging) {
        justFinishedDragRef = true;
      }
      mouseDownPosRef = null;
      dragStartRef = null;
      setIsDragging(false);
    };
    document.addEventListener("mouseup", handleMouseUp);
    onCleanup(() => document.removeEventListener("mouseup", handleMouseUp));
  });
  const fireWebhook = async (event, payload, force) => {
    const targetUrl = settings().webhookUrl || props.webhookUrl;
    if (!targetUrl || !settings().webhooksEnabled && !force) return false;
    try {
      const response = await fetch(targetUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event, timestamp: Date.now(), url: typeof window !== "undefined" ? window.location.href : void 0, ...payload }) });
      return response.ok;
    } catch (error) {
      console.warn("[Agentation] Webhook failed:", error);
      return false;
    }
  };
  const addAnnotation = (comment) => {
    const pending = pendingAnnotation();
    if (!pending) return;
    const newAnnotation = {
      id: Date.now().toString(),
      x: pending.x,
      y: pending.y,
      comment,
      element: pending.element,
      elementPath: pending.elementPath,
      timestamp: Date.now(),
      selectedText: pending.selectedText,
      boundingBox: pending.boundingBox,
      nearbyText: pending.nearbyText,
      cssClasses: pending.cssClasses,
      isMultiSelect: pending.isMultiSelect,
      isFixed: pending.isFixed,
      fullPath: pending.fullPath,
      accessibility: pending.accessibility,
      computedStyles: pending.computedStyles,
      nearbyElements: pending.nearbyElements,
      reactComponents: pending.reactComponents,
      sourceFile: pending.sourceFile,
      elementBoundingBoxes: pending.elementBoundingBoxes,
      // Protocol fields for server sync
      ...props.endpoint && currentSessionId() ? { sessionId: currentSessionId(), url: typeof window !== "undefined" ? window.location.href : void 0, status: "pending" } : {}
    };
    setAnnotations((prev) => [...prev, newAnnotation]);
    recentlyAddedIdRef = newAnnotation.id;
    originalSetTimeout(() => {
      recentlyAddedIdRef = null;
    }, 300);
    originalSetTimeout(() => {
      setAnimatedMarkers((prev) => new Set(prev).add(newAnnotation.id));
    }, 250);
    props.onAnnotationAdd?.(newAnnotation);
    fireWebhook("annotation.add", { annotation: newAnnotation });
    setPendingExiting(true);
    originalSetTimeout(() => {
      setPendingAnnotation(null);
      setPendingExiting(false);
    }, 150);
    window.getSelection()?.removeAllRanges();
    if (props.endpoint && currentSessionId()) {
      syncAnnotation(props.endpoint, currentSessionId(), newAnnotation).then((serverAnnotation) => {
        if (serverAnnotation.id !== newAnnotation.id) {
          setAnnotations((prev) => prev.map((a) => a.id === newAnnotation.id ? { ...a, id: serverAnnotation.id } : a));
          setAnimatedMarkers((prev) => {
            const next = new Set(prev);
            next.delete(newAnnotation.id);
            next.add(serverAnnotation.id);
            return next;
          });
        }
      }).catch((error) => {
        console.warn("[Agentation] Failed to sync annotation:", error);
      });
    }
  };
  const cancelAnnotation = () => {
    setPendingExiting(true);
    originalSetTimeout(() => {
      setPendingAnnotation(null);
      setPendingExiting(false);
    }, 150);
  };
  const deleteAnnotation2 = (id) => {
    const anns = annotations();
    const deletedIndex = anns.findIndex((a) => a.id === id);
    const deletedAnnotation = anns[deletedIndex];
    if (editingAnnotation()?.id === id) {
      setEditExiting(true);
      originalSetTimeout(() => {
        setEditingAnnotation(null);
        setEditingTargetElement(null);
        setEditingTargetElements([]);
        setEditExiting(false);
      }, 150);
    }
    setDeletingMarkerId(id);
    setExitingMarkers((prev) => new Set(prev).add(id));
    if (deletedAnnotation) {
      props.onAnnotationDelete?.(deletedAnnotation);
      fireWebhook("annotation.delete", { annotation: deletedAnnotation });
    }
    if (props.endpoint) {
      deleteAnnotation(props.endpoint, id).catch((error) => {
        console.warn("[Agentation] Failed to delete annotation from server:", error);
      });
    }
    originalSetTimeout(() => {
      setAnnotations((prev) => prev.filter((a) => a.id !== id));
      setExitingMarkers((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setDeletingMarkerId(null);
      if (deletedIndex < anns.length - 1) {
        setRenumberFrom(deletedIndex);
        originalSetTimeout(() => setRenumberFrom(null), 200);
      }
    }, 150);
  };
  const startEditAnnotation = (annotation) => {
    setEditingAnnotation(annotation);
    setHoveredMarkerId(null);
    setHoveredTargetElement(null);
    setHoveredTargetElements([]);
    if (annotation.elementBoundingBoxes?.length) {
      const elements = [];
      for (const bb of annotation.elementBoundingBoxes) {
        const centerX = bb.x + bb.width / 2;
        const centerY = bb.y + bb.height / 2 - window.scrollY;
        const el = deepElementFromPoint(centerX, centerY);
        if (el) elements.push(el);
      }
      setEditingTargetElements(elements);
      setEditingTargetElement(null);
    } else if (annotation.boundingBox) {
      const bb = annotation.boundingBox;
      const centerX = bb.x + bb.width / 2;
      const centerY = annotation.isFixed ? bb.y + bb.height / 2 : bb.y + bb.height / 2 - window.scrollY;
      const el = deepElementFromPoint(centerX, centerY);
      if (el) {
        const elRect = el.getBoundingClientRect();
        const widthRatio = elRect.width / bb.width;
        const heightRatio = elRect.height / bb.height;
        if (widthRatio < 0.5 || heightRatio < 0.5) {
          setEditingTargetElement(null);
        } else {
          setEditingTargetElement(el);
        }
      } else {
        setEditingTargetElement(null);
      }
      setEditingTargetElements([]);
    } else {
      setEditingTargetElement(null);
      setEditingTargetElements([]);
    }
  };
  const handleMarkerHover = (annotation) => {
    if (!annotation) {
      setHoveredMarkerId(null);
      setHoveredTargetElement(null);
      setHoveredTargetElements([]);
      return;
    }
    setHoveredMarkerId(annotation.id);
    if (annotation.elementBoundingBoxes?.length) {
      const elements = [];
      for (const bb of annotation.elementBoundingBoxes) {
        const centerX = bb.x + bb.width / 2;
        const centerY = bb.y + bb.height / 2 - window.scrollY;
        const allEls = document.elementsFromPoint(centerX, centerY);
        const el = allEls.find((e) => !e.closest("[data-annotation-marker]") && !e.closest("[data-agentation-root]"));
        if (el) elements.push(el);
      }
      setHoveredTargetElements(elements);
      setHoveredTargetElement(null);
    } else if (annotation.boundingBox) {
      const bb = annotation.boundingBox;
      const centerX = bb.x + bb.width / 2;
      const centerY = annotation.isFixed ? bb.y + bb.height / 2 : bb.y + bb.height / 2 - window.scrollY;
      const el = deepElementFromPoint(centerX, centerY);
      if (el) {
        const elRect = el.getBoundingClientRect();
        const widthRatio = elRect.width / bb.width;
        const heightRatio = elRect.height / bb.height;
        if (widthRatio < 0.5 || heightRatio < 0.5) {
          setHoveredTargetElement(null);
        } else {
          setHoveredTargetElement(el);
        }
      } else {
        setHoveredTargetElement(null);
      }
      setHoveredTargetElements([]);
    } else {
      setHoveredTargetElement(null);
      setHoveredTargetElements([]);
    }
  };
  const updateAnnotation2 = (newComment) => {
    const editing = editingAnnotation();
    if (!editing) return;
    const updatedAnnotation = { ...editing, comment: newComment };
    setAnnotations((prev) => prev.map((a) => a.id === editing.id ? updatedAnnotation : a));
    props.onAnnotationUpdate?.(updatedAnnotation);
    fireWebhook("annotation.update", { annotation: updatedAnnotation });
    if (props.endpoint) {
      updateAnnotation(props.endpoint, editing.id, { comment: newComment }).catch((error) => {
        console.warn("[Agentation] Failed to update annotation on server:", error);
      });
    }
    setEditExiting(true);
    originalSetTimeout(() => {
      setEditingAnnotation(null);
      setEditingTargetElement(null);
      setEditingTargetElements([]);
      setEditExiting(false);
    }, 150);
  };
  const cancelEditAnnotation = () => {
    setEditExiting(true);
    originalSetTimeout(() => {
      setEditingAnnotation(null);
      setEditingTargetElement(null);
      setEditingTargetElements([]);
      setEditExiting(false);
    }, 150);
  };
  const clearAll = () => {
    const anns = annotations();
    const count = anns.length;
    const hasDesign = designPlacements().length > 0 || !!rearrangeState();
    if (count === 0 && drawStrokes().length === 0 && !hasDesign) return;
    props.onAnnotationsClear?.(anns);
    fireWebhook("annotations.clear", { annotations: anns });
    if (props.endpoint) {
      Promise.all(anns.map((a) => deleteAnnotation(props.endpoint, a.id).catch((error) => {
        console.warn("[Agentation] Failed to delete annotation from server:", error);
      })));
      for (const [, annotationId] of placementAnnotationMap) {
        if (annotationId) {
          deleteAnnotation(props.endpoint, annotationId).catch(() => {
          });
        }
      }
      placementAnnotationMap.clear();
      for (const [, annotationId] of rearrangeAnnotationMap) {
        if (annotationId) {
          deleteAnnotation(props.endpoint, annotationId).catch(() => {
          });
        }
      }
      rearrangeAnnotationMap.clear();
    }
    setIsClearing(true);
    setCleared(true);
    setDrawStrokes([]);
    if (designPlacements().length > 0 || rearrangeState()) {
      setDesignClearSignal((n) => n + 1);
      setRearrangeClearSignal((n) => n + 1);
      originalSetTimeout(() => {
        setDesignPlacements([]);
        setRearrangeState(null);
      }, 200);
    }
    if (blankCanvas()) setBlankCanvas(false);
    if (wireframePurpose()) setWireframePurpose("");
    wireframeStashRef = { rearrange: null, placements: [] };
    clearWireframeState(pathname);
    const totalAnimationTime = count * 30 + 200;
    originalSetTimeout(() => {
      setAnnotations([]);
      setAnimatedMarkers(/* @__PURE__ */ new Set());
      localStorage.removeItem(getStorageKey(pathname));
      setIsClearing(false);
    }, totalAnimationTime);
    originalSetTimeout(() => setCleared(false), 1500);
  };
  const copyOutput = async () => {
    const displayUrl = typeof window !== "undefined" ? window.location.pathname + window.location.search + window.location.hash : pathname;
    const wireframeOnly = isDesignMode() && blankCanvas();
    let output;
    if (wireframeOnly) {
      if (designPlacements().length === 0 && !rearrangeState() && !wireframePurpose()) return;
      output = "";
    } else {
      output = generateOutput(annotations(), displayUrl, settings().outputDetail);
      if (!output && drawStrokes().length === 0 && designPlacements().length === 0 && !rearrangeState()) return;
      if (!output) output = `## Page Feedback: ${displayUrl}
`;
    }
    if (designPlacements().length > 0 || wireframeOnly && wireframePurpose()) {
      output += "\n" + generateDesignOutput(designPlacements(), { width: window.innerWidth, height: window.innerHeight }, { blankCanvas: blankCanvas(), wireframePurpose: wireframePurpose() || void 0 }, settings().outputDetail);
    }
    if (rearrangeState()) {
      const rearrangeOutput = generateRearrangeOutput(rearrangeState(), settings().outputDetail, { width: window.innerWidth, height: window.innerHeight });
      if (rearrangeOutput) {
        output += "\n" + rearrangeOutput;
      }
    }
    if (props.copyToClipboard !== false) {
      try {
        await navigator.clipboard.writeText(output);
      } catch {
      }
    }
    props.onCopy?.(output);
    setCopied(true);
    originalSetTimeout(() => setCopied(false), 2e3);
    if (settings().autoClearAfterCopy) {
      originalSetTimeout(() => clearAll(), 500);
    }
  };
  const sendToWebhook = async () => {
    const displayUrl = typeof window !== "undefined" ? window.location.pathname + window.location.search + window.location.hash : pathname;
    let output = generateOutput(annotations(), displayUrl, settings().outputDetail);
    if (!output && designPlacements().length === 0 && !rearrangeState()) return;
    if (!output) output = `## Page Feedback: ${displayUrl}
`;
    if (designPlacements().length > 0) {
      output += "\n" + generateDesignOutput(designPlacements(), { width: window.innerWidth, height: window.innerHeight }, { blankCanvas: blankCanvas(), wireframePurpose: wireframePurpose() || void 0 }, settings().outputDetail);
    }
    if (rearrangeState()) {
      const rearrangeOutput = generateRearrangeOutput(rearrangeState(), settings().outputDetail, { width: window.innerWidth, height: window.innerHeight });
      if (rearrangeOutput) {
        output += "\n" + rearrangeOutput;
      }
    }
    if (props.onSubmit) {
      props.onSubmit(output, annotations());
    }
    setSendState("sending");
    await new Promise((resolve) => originalSetTimeout(resolve, 150));
    const success = await fireWebhook("submit", { output, annotations: annotations() }, true);
    setSendState(success ? "sent" : "failed");
    originalSetTimeout(() => setSendState("idle"), 2500);
    if (success && settings().autoClearAfterCopy) {
      originalSetTimeout(() => clearAll(), 500);
    }
  };
  createEffect(() => {
    const dsp = dragStartPos();
    if (!dsp) return;
    const TOOLBAR_DRAG_THRESHOLD = 10;
    const handleMouseMove = (e) => {
      const deltaX = e.clientX - dsp.x;
      const deltaY = e.clientY - dsp.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      if (!isDraggingToolbar() && distance > TOOLBAR_DRAG_THRESHOLD) {
        setIsDraggingToolbar(true);
      }
      if (isDraggingToolbar() || distance > TOOLBAR_DRAG_THRESHOLD) {
        let newX = dsp.toolbarX + deltaX;
        let newY = dsp.toolbarY + deltaY;
        const padding = 20;
        const wrapperWidth = 337;
        const toolbarHeight = 44;
        const contentWidth = isActive() ? connectionStatus() === "connected" ? 297 : 257 : 44;
        const contentOffset = wrapperWidth - contentWidth;
        const minX = padding - contentOffset;
        const maxX = window.innerWidth - padding - wrapperWidth;
        newX = Math.max(minX, Math.min(maxX, newX));
        newY = Math.max(padding, Math.min(window.innerHeight - toolbarHeight - padding, newY));
        setToolbarPosition({ x: newX, y: newY });
      }
    };
    const handleMouseUp = () => {
      if (isDraggingToolbar()) ;
      setIsDraggingToolbar(false);
      setDragStartPos(null);
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    onCleanup(() => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    });
  });
  createEffect(() => {
    const pos = toolbarPosition();
    if (!pos) return;
    const constrainPosition = () => {
      const padding = 20;
      const wrapperWidth = 337;
      const toolbarHeight = 44;
      let newX = pos.x;
      let newY = pos.y;
      const contentWidth = isActive() ? connectionStatus() === "connected" ? 297 : 257 : 44;
      const contentOffset = wrapperWidth - contentWidth;
      const minX = padding - contentOffset;
      const maxX = window.innerWidth - padding - wrapperWidth;
      newX = Math.max(minX, Math.min(maxX, newX));
      newY = Math.max(padding, Math.min(window.innerHeight - toolbarHeight - padding, newY));
      if (newX !== pos.x || newY !== pos.y) {
        setToolbarPosition({ x: newX, y: newY });
      }
    };
    constrainPosition();
    window.addEventListener("resize", constrainPosition);
    onCleanup(() => window.removeEventListener("resize", constrainPosition));
  });
  createEffect(() => {
    const active = isActive();
    const pending = pendingAnnotation();
    const annsLength = annotations().length;
    const sett = settings();
    const sState = sendState();
    const handleKeyDown = (e) => {
      const target = e.target;
      const isTyping = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
      if (e.key === "Escape") {
        if (isDesignMode()) {
          if (activeDesignComponent()) {
            setActiveDesignComponent(null);
          } else {
            closeDesignMode();
          }
          return;
        }
        if (isDrawMode()) {
          setIsDrawMode(false);
          return;
        }
        if (pendingMultiSelectElements().length > 0) {
          setPendingMultiSelectElements([]);
          return;
        }
        if (pending) ;
        else if (active) {
          hideTooltipsUntilMouseLeave();
          deactivate();
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === "f" || e.key === "F")) {
        e.preventDefault();
        hideTooltipsUntilMouseLeave();
        if (active) {
          deactivate();
        } else {
          setIsActive(true);
        }
        return;
      }
      if (isTyping || e.metaKey || e.ctrlKey) return;
      if (e.key === "p" || e.key === "P") {
        e.preventDefault();
        hideTooltipsUntilMouseLeave();
        toggleFreeze();
      }
      if (e.key === "l" || e.key === "L") {
        e.preventDefault();
        hideTooltipsUntilMouseLeave();
        if (isDrawMode()) setIsDrawMode(false);
        if (showSettings()) setShowSettings(false);
        if (pending) cancelAnnotation();
        if (isDesignMode()) {
          closeDesignMode();
        } else {
          setIsDesignMode(true);
        }
      }
      if (e.key === "h" || e.key === "H") {
        if (annsLength > 0) {
          e.preventDefault();
          hideTooltipsUntilMouseLeave();
          setShowMarkers((prev) => !prev);
        }
      }
      if (e.key === "c" || e.key === "C") {
        if (annsLength > 0 || designPlacements().length > 0 || rearrangeState()) {
          e.preventDefault();
          hideTooltipsUntilMouseLeave();
          copyOutput();
        }
      }
      if (e.key === "x" || e.key === "X") {
        if (annsLength > 0 || designPlacements().length > 0 || rearrangeState()) {
          e.preventDefault();
          hideTooltipsUntilMouseLeave();
          clearAll();
          if (designPlacements().length > 0) setDesignPlacements([]);
          if (rearrangeState()) setRearrangeState(null);
        }
      }
      if (e.key === "s" || e.key === "S") {
        const hasValidWebhook = isValidUrl(sett.webhookUrl) || isValidUrl(props.webhookUrl || "");
        if (annsLength > 0 && hasValidWebhook && sState === "idle") {
          e.preventDefault();
          hideTooltipsUntilMouseLeave();
          sendToWebhook();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    onCleanup(() => document.removeEventListener("keydown", handleKeyDown));
  });
  const hasAnnotations = () => annotations().length > 0;
  const visibleAnnotations = () => annotations().filter((a) => !exitingMarkers().has(a.id) && a.kind !== "placement" && a.kind !== "rearrange");
  const hasVisibleAnnotations = () => visibleAnnotations().length > 0;
  const exitingAnnotationsList = () => annotations().filter((a) => exitingMarkers().has(a.id));
  const getTooltipPosition = (annotation) => {
    const tooltipMaxWidth = 200;
    const tooltipEstimatedHeight = 80;
    const markerSize = 22;
    const gap = 10;
    const markerX = annotation.x / 100 * window.innerWidth;
    const markerY = typeof annotation.y === "string" ? parseFloat(annotation.y) : annotation.y;
    const result = {};
    const spaceBelow = window.innerHeight - markerY - markerSize - gap;
    if (spaceBelow < tooltipEstimatedHeight) {
      result.top = "auto";
      result.bottom = `calc(100% + ${gap}px)`;
    }
    const centerX = markerX - tooltipMaxWidth / 2;
    const edgePadding = 10;
    if (centerX < edgePadding) {
      const offset = edgePadding - centerX;
      result.left = `calc(50% + ${offset}px)`;
    } else if (centerX + tooltipMaxWidth > window.innerWidth - edgePadding) {
      const overflow = centerX + tooltipMaxWidth - (window.innerWidth - edgePadding);
      result.left = `calc(50% - ${overflow}px)`;
    }
    return result;
  };
  return createComponent(Show, { get when() {
    return mounted() && !isToolbarHidden();
  }, get children() {
    return createComponent(Portal, { get mount() {
      return document.body;
    }, get children() {
      return ssr(_tmpl$206, ssrHydrationKey(), ssrStyleProperty("display:", "contents"), ssrAttribute("data-agentation-theme", isDarkMode() ? "dark" : "light", false) + ssrAttribute("data-agentation-accent", escape(settings().annotationColorId, true), false), `${escape(styles_module_default4.toolbar, true)}${props.class ? ` ${escape(props.class, true)}` : ""}`, ssrStyle(toolbarPosition() ? { left: `${toolbarPosition().x}px`, top: `${toolbarPosition().y}px`, right: "auto", bottom: "auto" } : void 0), `${escape(styles_module_default4.toolbarContainer, true)} ${isActive() ? escape(styles_module_default4.expanded, true) : escape(styles_module_default4.collapsed, true)} ${showEntranceAnimation() ? escape(styles_module_default4.entrance, true) : ""} ${isToolbarHiding() ? escape(styles_module_default4.hiding, true) : ""} ${!settings().webhooksEnabled && (isValidUrl(settings().webhookUrl) || isValidUrl(props.webhookUrl || "")) ? escape(styles_module_default4.serverConnected, true) : ""}`, ssrAttribute("role", !isActive() ? "button" : void 0, false) + ssrAttribute("tabindex", !isActive() ? 0 : -1, false) + ssrAttribute("title", !isActive() ? "Start feedback mode" : void 0, false), `${escape(styles_module_default4.toggleContent, true)} ${!isActive() ? escape(styles_module_default4.visible, true) : escape(styles_module_default4.hidden, true)}`, escape(createComponent(IconListSparkle, { size: 24 })), escape(createComponent(Show, { get when() {
        return hasVisibleAnnotations();
      }, get children() {
        return ssr(_tmpl$200, ssrHydrationKey(), `${escape(styles_module_default4.badge, true)} ${isActive() ? escape(styles_module_default4.fadeOut, true) : ""} ${showEntranceAnimation() ? escape(styles_module_default4.entrance, true) : ""}`, escape(visibleAnnotations().length));
      } })), `${escape(styles_module_default4.controlsContent, true)} ${isActive() ? escape(styles_module_default4.visible, true) : escape(styles_module_default4.hidden, true)} ${toolbarPosition() && toolbarPosition().y < 100 ? escape(styles_module_default4.tooltipBelow, true) : ""} ${tooltipsHidden() || showSettings() ? escape(styles_module_default4.tooltipsHidden, true) : ""} ${tooltipSessionActive() ? escape(styles_module_default4.tooltipsInSession, true) : ""}`, `${escape(styles_module_default4.buttonWrapper, true)} ${toolbarPosition() && toolbarPosition().x < 120 ? escape(styles_module_default4.buttonWrapperAlignLeft, true) : ""}`, ssrAttribute("class", escape(styles_module_default4.controlButton, true), false) + ssrAttribute("data-active", escape(isFrozen(), true), false), escape(createComponent(IconPausePlayAnimated, { size: 24, get isPaused() {
        return isFrozen();
      } })), ssrAttribute("class", escape(styles_module_default4.buttonTooltip, true), false), isFrozen() ? "Resume animations" : "Pause animations", ssrAttribute("class", escape(styles_module_default4.shortcut, true), false), ssrAttribute("class", escape(styles_module_default4.buttonWrapper, true), false), `${escape(styles_module_default4.controlButton, true)} ${!isDarkMode() ? escape(styles_module_default4.light, true) : ""}`, ssrAttribute("data-active", escape(isDesignMode(), true), false), ssrStyle(isDesignMode() && blankCanvas() ? { color: "#f97316", background: "rgba(249, 115, 22, 0.25)" } : void 0), escape(createComponent(IconLayout, { size: 21 })), ssrAttribute("class", escape(styles_module_default4.buttonTooltip, true), false), isDesignMode() ? "Exit layout mode" : "Layout mode", ssrAttribute("class", escape(styles_module_default4.shortcut, true), false), ssrAttribute("class", escape(styles_module_default4.buttonWrapper, true), false), ssrAttribute("class", escape(styles_module_default4.controlButton, true), false), ssrAttribute("disabled", !hasAnnotations() || isDesignMode(), true), escape(createComponent(IconEyeAnimated, { size: 24, get isOpen() {
        return showMarkers();
      } })), ssrAttribute("class", escape(styles_module_default4.buttonTooltip, true), false), showMarkers() ? "Hide markers" : "Show markers", ssrAttribute("class", escape(styles_module_default4.shortcut, true), false), ssrAttribute("class", escape(styles_module_default4.buttonWrapper, true), false), `${escape(styles_module_default4.controlButton, true)} ${copied() ? escape(styles_module_default4.statusShowing, true) : ""}`, ssrAttribute("disabled", isDesignMode() && blankCanvas() ? designPlacements().length === 0 && !rearrangeState()?.sections?.length : !hasAnnotations() && drawStrokes().length === 0 && designPlacements().length === 0 && !rearrangeState()?.sections?.length, true) + ssrAttribute("data-active", escape(copied(), true), false), escape(createComponent(IconCopyAnimated, { size: 24, get copied() {
        return copied();
      }, get tint() {
        return isDesignMode() && blankCanvas() && (designPlacements().length > 0 || !!rearrangeState()?.sections?.length) ? "#f97316" : void 0;
      } })), ssrAttribute("class", escape(styles_module_default4.buttonTooltip, true), false), isDesignMode() && blankCanvas() ? "Copy layout" : "Copy feedback", ssrAttribute("class", escape(styles_module_default4.shortcut, true), false), `${escape(styles_module_default4.buttonWrapper, true)} ${escape(styles_module_default4.sendButtonWrapper, true)} ${isActive() && !settings().webhooksEnabled && (isValidUrl(settings().webhookUrl) || isValidUrl(props.webhookUrl || "")) ? escape(styles_module_default4.sendButtonVisible, true) : ""}`, `${escape(styles_module_default4.controlButton, true)} ${sendState() === "sent" || sendState() === "failed" ? escape(styles_module_default4.statusShowing, true) : ""}`, ssrAttribute("disabled", !hasAnnotations() || !isValidUrl(settings().webhookUrl) && !isValidUrl(props.webhookUrl || "") || sendState() === "sending", true) + ssrAttribute("data-no-hover", escape(sendState() === "sent" || sendState() === "failed", true), false) + ssrAttribute("tabindex", isValidUrl(settings().webhookUrl) || isValidUrl(props.webhookUrl || "") ? 0 : -1, false), escape(createComponent(IconSendArrow, { size: 24, get state() {
        return sendState();
      } })), escape(createComponent(Show, { get when() {
        return hasAnnotations() && sendState() === "idle";
      }, get children() {
        return ssr(_tmpl$38, ssrHydrationKey() + ssrAttribute("class", escape(styles_module_default4.buttonBadge, true), false), escape(annotations().length));
      } })), ssrAttribute("class", escape(styles_module_default4.buttonTooltip, true), false), ssrAttribute("class", escape(styles_module_default4.shortcut, true), false), ssrAttribute("class", escape(styles_module_default4.buttonWrapper, true), false), ssrAttribute("class", escape(styles_module_default4.controlButton, true), false), ssrAttribute("disabled", !hasAnnotations() && drawStrokes().length === 0 && designPlacements().length === 0 && !rearrangeState()?.sections?.length, true), escape(createComponent(IconTrashAlt, { size: 24 })), ssrAttribute("class", escape(styles_module_default4.buttonTooltip, true), false), ssrAttribute("class", escape(styles_module_default4.shortcut, true), false), ssrAttribute("class", escape(styles_module_default4.buttonWrapper, true), false), ssrAttribute("class", escape(styles_module_default4.controlButton, true), false), escape(createComponent(IconGear, { size: 24 })), escape(createComponent(Show, { get when() {
        return props.endpoint && connectionStatus() !== "disconnected";
      }, get children() {
        return ssr(_tmpl$201, ssrHydrationKey(), `${escape(styles_module_default4.mcpIndicator, true)} ${escape(styles_module_default4[connectionStatus()], true)} ${showSettings() ? escape(styles_module_default4.hidden, true) : ""}`, ssrAttribute("title", connectionStatus() === "connected" ? "MCP Connected" : "MCP Connecting...", false));
      } })), ssrAttribute("class", escape(styles_module_default4.buttonTooltip, true), false), ssrAttribute("class", escape(styles_module_default4.divider, true), false), `${escape(styles_module_default4.buttonWrapper, true)} ${toolbarPosition() && typeof window !== "undefined" && toolbarPosition().x > window.innerWidth - 120 ? escape(styles_module_default4.buttonWrapperAlignRight, true) : ""}`, ssrAttribute("class", escape(styles_module_default4.controlButton, true), false), escape(createComponent(IconXmarkLarge, { size: 24 })), ssrAttribute("class", escape(styles_module_default4.buttonTooltip, true), false), ssrAttribute("class", escape(styles_module_default4.shortcut, true), false), escape(createComponent(DesignPalette, { get visible() {
        return isDesignMode() && isActive();
      }, get activeType() {
        return activeDesignComponent();
      }, onSelect: (type) => {
        setActiveDesignComponent(activeDesignComponent() === type ? null : type);
      }, get isDarkMode() {
        return isDarkMode();
      }, get sectionCount() {
        return rearrangeState()?.sections.length ?? 0;
      }, onDetectSections: () => {
        const sections = detectPageSections();
        const existing = rearrangeState()?.sections ?? [];
        const existingSelectors = new Set(existing.map((s2) => s2.selector));
        const newSections = sections.filter((s2) => !existingSelectors.has(s2.selector));
        const merged = [...existing, ...newSections];
        const mergedOrder = [...rearrangeState()?.originalOrder ?? [], ...newSections.map((s2) => s2.id)];
        setRearrangeState({ sections: merged, originalOrder: mergedOrder, detectedAt: Date.now() });
      }, get placementCount() {
        return designPlacements().length;
      }, onClearPlacements: () => {
        setDesignClearSignal((n) => n + 1);
        setRearrangeClearSignal((n) => n + 1);
        originalSetTimeout(() => {
          setRearrangeState({ sections: [], originalOrder: [], detectedAt: Date.now() });
        }, 200);
      }, get blankCanvas() {
        return blankCanvas();
      }, onBlankCanvasChange: (on2) => {
        const emptyRearrange = { sections: [], originalOrder: [], detectedAt: Date.now() };
        if (on2) {
          exploreStashRef = { rearrange: rearrangeState(), placements: designPlacements() };
          setRearrangeState(wireframeStashRef.rearrange || emptyRearrange);
          setDesignPlacements(wireframeStashRef.placements);
          setActiveDesignComponent(null);
        } else {
          wireframeStashRef = { rearrange: rearrangeState(), placements: designPlacements() };
          setRearrangeState(exploreStashRef.rearrange || emptyRearrange);
          setDesignPlacements(exploreStashRef.placements);
        }
        setBlankCanvas(on2);
      }, get wireframePurpose() {
        return wireframePurpose();
      }, onWireframePurposeChange: setWireframePurpose, Tooltip: HelpTooltip, onDragStart: (type, e) => {
        e.preventDefault();
        const def = DEFAULT_SIZES[type];
        let preview = null;
        let didDrag = false;
        const startX = e.clientX;
        const startY = e.clientY;
        const toolbar = e.target.closest("[data-feedback-toolbar]");
        const toolbarTop = toolbar?.getBoundingClientRect().top ?? window.innerHeight;
        const onMove = (ev) => {
          const dx = ev.clientX - startX;
          const dy = ev.clientY - startY;
          if (!didDrag && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
            didDrag = true;
            preview = document.createElement("div");
            preview.className = `${styles_module_default3.dragPreview}${blankCanvas() ? ` ${styles_module_default3.dragPreviewWireframe}` : ""}`;
            document.body.appendChild(preview);
          }
          if (!preview) return;
          const dist = Math.max(0, toolbarTop - ev.clientY);
          const progress = Math.min(1, dist / 180);
          const eased = 1 - Math.pow(1 - progress, 2);
          const minW = 28;
          const minH = 20;
          const maxW = Math.min(140, def.width * 0.18);
          const maxH = Math.min(90, def.height * 0.18);
          const w = minW + (maxW - minW) * eased;
          const h = minH + (maxH - minH) * eased;
          preview.style.width = `${w}px`;
          preview.style.height = `${h}px`;
          preview.style.left = `${ev.clientX - w / 2}px`;
          preview.style.top = `${ev.clientY - h / 2}px`;
          preview.style.opacity = `${0.5 + 0.5 * eased}`;
          preview.textContent = eased > 0.25 ? type : "";
        };
        const onUp = (ev) => {
          window.removeEventListener("mousemove", onMove);
          window.removeEventListener("mouseup", onUp);
          if (preview) document.body.removeChild(preview);
          if (didDrag) {
            const w = def.width;
            const h = def.height;
            const scrollY2 = window.scrollY;
            const x = Math.max(0, ev.clientX - w / 2);
            const y = Math.max(0, ev.clientY + scrollY2 - h / 2);
            const placement = { id: `dp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, type, x, y, width: w, height: h, scrollY: scrollY2, timestamp: Date.now() };
            setDesignPlacements((prev) => [...prev, placement]);
            setActiveDesignComponent(null);
            designSelectedIdsRef = /* @__PURE__ */ new Set();
            setDesignDeselectSignal((n) => n + 1);
          }
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
      } })), escape(createComponent(SettingsPanel, { get settings() {
        return settings();
      }, onSettingsChange: (patch) => setSettings((s2) => ({ ...s2, ...patch })), get isDarkMode() {
        return isDarkMode();
      }, onToggleTheme: toggleTheme, isDevMode, get connectionStatus() {
        return connectionStatus();
      }, get endpoint() {
        return props.endpoint;
      }, get isVisible() {
        return showSettingsVisible();
      }, get toolbarNearBottom() {
        return !!toolbarPosition() && toolbarPosition().y < 230;
      }, get settingsPage() {
        return settingsPage();
      }, onSettingsPageChange: setSettingsPage, onHideToolbar: hideToolbarTemporarily })), escape(createComponent(Show, { get when() {
        return isDesignMode() || designOverlayExiting();
      }, get children() {
        return ssr(_tmpl$202, ssrHydrationKey(), `${escape(styles_module_default3.blankCanvas, true)} ${canvasReady() ? escape(styles_module_default3.visible, true) : ""} ${designInteracting() ? escape(styles_module_default3.gridActive, true) : ""}`, ssrStyleProperty("--canvas-opacity:", escape(canvasOpacity(), true)));
      } })), escape(createComponent(Show, { get when() {
        return isDesignMode() && blankCanvas() && canvasReady();
      }, get children() {
        return ssr(_tmpl$203, ssrHydrationKey() + ssrAttribute("class", escape(styles_module_default3.wireframeNotice, true), false), ssrAttribute("class", escape(styles_module_default3.wireframeOpacityRow, true), false), ssrAttribute("class", escape(styles_module_default3.wireframeOpacityLabel, true), false), ssrAttribute("class", escape(styles_module_default3.wireframeOpacitySlider, true), false), ssrAttribute("value", escape(canvasOpacity(), true), false), ssrAttribute("class", escape(styles_module_default3.wireframeNoticeTitleRow, true), false), ssrAttribute("class", escape(styles_module_default3.wireframeNoticeTitle, true), false), ssrAttribute("class", escape(styles_module_default3.wireframeNoticeDivider, true), false), ssrAttribute("class", escape(styles_module_default3.wireframeStartOver, true), false));
      } })), escape(createComponent(Show, { get when() {
        return isDesignMode() || designOverlayExiting();
      }, get children() {
        return createComponent(DesignMode, { get placements() {
          return designPlacements();
        }, onChange: setDesignPlacements, get activeComponent() {
          return designOverlayExiting() ? null : activeDesignComponent();
        }, onActiveComponentChange: setActiveDesignComponent, get isDarkMode() {
          return isDarkMode();
        }, get exiting() {
          return designOverlayExiting();
        }, onInteractionChange: setDesignInteracting, get passthrough() {
          return !activeDesignComponent();
        }, get extraSnapRects() {
          return rearrangeState()?.sections.map((s2) => s2.currentRect);
        }, get deselectSignal() {
          return designDeselectSignal();
        }, get clearSignal() {
          return designClearSignal();
        }, get wireframe() {
          return blankCanvas();
        }, onSelectionChange: (ids, isShift) => {
          designSelectedIdsRef = ids;
          if (!isShift) {
            rearrangeSelectedIdsRef = /* @__PURE__ */ new Set();
            setRearrangeDeselectSignal((n) => n + 1);
          }
        }, onDragMove: (dx, dy) => {
          const selIds = rearrangeSelectedIdsRef;
          const rs = rearrangeState();
          if (!selIds.size || !rs) return;
          if (!crossDragStartRef) {
            crossDragStartRef = /* @__PURE__ */ new Map();
            for (const s2 of rs.sections) {
              if (selIds.has(s2.id)) {
                crossDragStartRef.set(s2.id, { x: s2.currentRect.x, y: s2.currentRect.y });
              }
            }
          }
          for (const s2 of rs.sections) {
            if (!selIds.has(s2.id)) continue;
            const start = crossDragStartRef.get(s2.id);
            if (!start) continue;
            const outlineEl = document.querySelector(`[data-rearrange-section="${s2.id}"]`);
            if (outlineEl) outlineEl.style.transform = `translate(${dx}px, ${dy}px)`;
          }
        }, onDragEnd: (dx, dy, committed) => {
          const selIds = rearrangeSelectedIdsRef;
          const starts = crossDragStartRef;
          crossDragStartRef = null;
          const rs = rearrangeState();
          if (!selIds.size || !rs || !starts) return;
          for (const id of selIds) {
            const el = document.querySelector(`[data-rearrange-section="${id}"]`);
            if (el) el.style.transform = "";
          }
          if (committed) {
            setRearrangeState((prev) => {
              if (!prev) return prev;
              return { ...prev, sections: prev.sections.map((s2) => {
                const start = starts.get(s2.id);
                if (!start) return s2;
                return { ...s2, currentRect: { ...s2.currentRect, x: Math.max(0, start.x + dx), y: Math.max(0, start.y + dy) } };
              }) };
            });
          }
        } });
      } })), escape(createComponent(Show, { get when() {
        return (isDesignMode() || designOverlayExiting()) && rearrangeState();
      }, get children() {
        return createComponent(RearrangeOverlay, { get rearrangeState() {
          return rearrangeState();
        }, onChange: setRearrangeState, get isDarkMode() {
          return isDarkMode();
        }, get exiting() {
          return designOverlayExiting();
        }, get blankCanvas() {
          return blankCanvas();
        }, get extraSnapRects() {
          return designPlacements().map((p) => ({ x: p.x, y: p.y, width: p.width, height: p.height }));
        }, get clearSignal() {
          return rearrangeClearSignal();
        }, get deselectSignal() {
          return rearrangeDeselectSignal();
        }, onSelectionChange: (ids, isShift) => {
          rearrangeSelectedIdsRef = ids;
          if (!isShift) {
            designSelectedIdsRef = /* @__PURE__ */ new Set();
            setDesignDeselectSignal((n) => n + 1);
          }
        }, onDragMove: (dx, dy) => {
          const selIds = designSelectedIdsRef;
          if (!selIds.size) return;
          if (!crossDragStartRef) {
            crossDragStartRef = /* @__PURE__ */ new Map();
            for (const p of designPlacements()) {
              if (selIds.has(p.id)) {
                crossDragStartRef.set(p.id, { x: p.x, y: p.y });
              }
            }
          }
          for (const id of selIds) {
            const el = document.querySelector(`[data-design-placement="${id}"]`);
            if (el) el.style.transform = `translate(${dx}px, ${dy}px)`;
          }
        }, onDragEnd: (dx, dy, committed) => {
          const selIds = designSelectedIdsRef;
          const starts = crossDragStartRef;
          crossDragStartRef = null;
          if (!selIds.size || !starts) return;
          for (const id of selIds) {
            const el = document.querySelector(`[data-design-placement="${id}"]`);
            if (el) el.style.transform = "";
          }
          if (committed) {
            setDesignPlacements((prev) => prev.map((p) => {
              const start = starts.get(p.id);
              if (!start) return p;
              return { ...p, x: Math.max(0, start.x + dx), y: Math.max(0, start.y + dy) };
            }));
          }
        } });
      } })), `${escape(styles_module_default4.drawCanvas, true)} ${isDrawMode() ? escape(styles_module_default4.active, true) : ""}`, ssrStyleProperty("opacity:", shouldShowMarkers() ? 1 : 0) + ssrStyleProperty(";transition:", "opacity 0.15s ease"), ssrAttribute("class", escape(styles_module_default4.markersLayer, true), false), escape(createComponent(Show, { get when() {
        return markersVisible();
      }, get children() {
        return [createComponent(For$1, { get each() {
          return visibleAnnotations().filter((a) => !a.isFixed);
        }, children: (annotation, layerIndexFn) => {
          const layerIndex = layerIndexFn();
          const arr = visibleAnnotations().filter((a) => !a.isFixed);
          return createComponent(AnnotationMarker, { annotation, get globalIndex() {
            return visibleAnnotations().findIndex((a) => a.id === annotation.id);
          }, layerIndex, get layerSize() {
            return arr.length;
          }, get isExiting() {
            return markersExiting();
          }, get isClearing() {
            return isClearing();
          }, get isAnimated() {
            return animatedMarkers().has(annotation.id);
          }, get isHovered() {
            return !markersExiting() && hoveredMarkerId() === annotation.id;
          }, get isDeleting() {
            return deletingMarkerId() === annotation.id;
          }, get isEditingAny() {
            return !!editingAnnotation();
          }, get renumberFrom() {
            return renumberFrom();
          }, get markerClickBehavior() {
            return settings().markerClickBehavior;
          }, get tooltipStyle() {
            return getTooltipPosition(annotation);
          }, onHoverEnter: (a) => !markersExiting() && a.id !== recentlyAddedIdRef && handleMarkerHover(a), onHoverLeave: () => handleMarkerHover(null), onClick: (a) => settings().markerClickBehavior === "delete" ? deleteAnnotation2(a.id) : startEditAnnotation(a), onContextMenu: startEditAnnotation });
        } }), createComponent(Show, { get when() {
          return !markersExiting();
        }, get children() {
          return createComponent(For$1, { get each() {
            return exitingAnnotationsList().filter((a) => !a.isFixed);
          }, children: (a) => createComponent(ExitingMarker, { annotation: a }) });
        } })];
      } })), ssrAttribute("class", escape(styles_module_default4.fixedMarkersLayer, true), false), escape(createComponent(Show, { get when() {
        return markersVisible();
      }, get children() {
        return [createComponent(For$1, { get each() {
          return visibleAnnotations().filter((a) => a.isFixed);
        }, children: (annotation, layerIndexFn) => {
          const layerIndex = layerIndexFn();
          const arr = visibleAnnotations().filter((a) => a.isFixed);
          return createComponent(AnnotationMarker, { annotation, get globalIndex() {
            return visibleAnnotations().findIndex((a) => a.id === annotation.id);
          }, layerIndex, get layerSize() {
            return arr.length;
          }, get isExiting() {
            return markersExiting();
          }, get isClearing() {
            return isClearing();
          }, get isAnimated() {
            return animatedMarkers().has(annotation.id);
          }, get isHovered() {
            return !markersExiting() && hoveredMarkerId() === annotation.id;
          }, get isDeleting() {
            return deletingMarkerId() === annotation.id;
          }, get isEditingAny() {
            return !!editingAnnotation();
          }, get renumberFrom() {
            return renumberFrom();
          }, get markerClickBehavior() {
            return settings().markerClickBehavior;
          }, get tooltipStyle() {
            return getTooltipPosition(annotation);
          }, onHoverEnter: (a) => !markersExiting() && a.id !== recentlyAddedIdRef && handleMarkerHover(a), onHoverLeave: () => handleMarkerHover(null), onClick: (a) => settings().markerClickBehavior === "delete" ? deleteAnnotation2(a.id) : startEditAnnotation(a), onContextMenu: startEditAnnotation });
        } }), createComponent(Show, { get when() {
          return !markersExiting();
        }, get children() {
          return createComponent(For$1, { get each() {
            return exitingAnnotationsList().filter((a) => a.isFixed);
          }, children: (a) => createComponent(ExitingMarker, { annotation: a, fixed: true }) });
        } })];
      } })), escape(createComponent(Show, { get when() {
        return isActive();
      }, get children() {
        return ssr(_tmpl$205, ssrHydrationKey() + ssrAttribute("class", escape(styles_module_default4.overlay, true), false), ssrStyle(pendingAnnotation() || editingAnnotation() ? { "z-index": 99999 } : void 0), escape(createComponent(Show, { get when() {
          return hoverInfo()?.rect && !pendingAnnotation() && !isScrolling() && !isDragging();
        }, get children() {
          return (() => {
            const hi = hoverInfo();
            return ssr(_tmpl$207, ssrHydrationKey(), `${escape(styles_module_default4.hoverHighlight, true)} ${escape(styles_module_default4.enter, true)}`, ssrStyleProperty("left:", `${escape(hi.rect.left, true)}px`) + ssrStyleProperty(";top:", `${escape(hi.rect.top, true)}px`) + ssrStyleProperty(";width:", `${escape(hi.rect.width, true)}px`) + ssrStyleProperty(";height:", `${escape(hi.rect.height, true)}px`) + ssrStyleProperty(";border-color:", "color-mix(in srgb, var(--agentation-color-accent) 50%, transparent)") + ssrStyleProperty(";background-color:", "color-mix(in srgb, var(--agentation-color-accent) 4%, transparent)"));
          })();
        } })), escape(createComponent(For$1, { get each() {
          return pendingMultiSelectElements().filter((item) => document.contains(item.element));
        }, children: (item) => {
          const rect = item.element.getBoundingClientRect();
          const isMulti = pendingMultiSelectElements().length > 1;
          return ssr(_tmpl$45, ssrHydrationKey() + ssrAttribute("class", isMulti ? escape(styles_module_default4.multiSelectOutline, true) : escape(styles_module_default4.singleSelectOutline, true), false), ssrStyle({ position: "fixed", left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px`, ...isMulti ? {} : { "border-color": "color-mix(in srgb, var(--agentation-color-accent) 60%, transparent)", "background-color": "color-mix(in srgb, var(--agentation-color-accent) 5%, transparent)" } }));
        } })), escape(createComponent(Show, { get when() {
          return hoveredMarkerId() && !pendingAnnotation();
        }, get children() {
          return (() => {
            const hoveredAnnotation = () => annotations().find((a) => a.id === hoveredMarkerId());
            return createComponent(Show, { get when() {
              return hoveredAnnotation()?.boundingBox;
            }, get children() {
              return (() => {
                const ha = hoveredAnnotation();
                if (ha.elementBoundingBoxes?.length) {
                  if (hoveredTargetElements().length > 0) {
                    return createComponent(For$1, { get each() {
                      return hoveredTargetElements().filter((el) => document.contains(el));
                    }, children: (el) => {
                      const rect2 = el.getBoundingClientRect();
                      return ssr(_tmpl$207, ssrHydrationKey(), `${escape(styles_module_default4.multiSelectOutline, true)} ${escape(styles_module_default4.enter, true)}`, ssrStyleProperty("left:", `${escape(rect2.left, true)}px`) + ssrStyleProperty(";top:", `${escape(rect2.top, true)}px`) + ssrStyleProperty(";width:", `${escape(rect2.width, true)}px`) + ssrStyleProperty(";height:", `${escape(rect2.height, true)}px`));
                    } });
                  }
                  return createComponent(For$1, { get each() {
                    return ha.elementBoundingBoxes;
                  }, children: (bb2) => ssr(_tmpl$207, ssrHydrationKey(), `${escape(styles_module_default4.multiSelectOutline, true)} ${escape(styles_module_default4.enter, true)}`, ssrStyleProperty("left:", `${escape(bb2.x, true)}px`) + ssrStyleProperty(";top:", `${escape(bb2.y, true) - escape(scrollY(), true)}px`) + ssrStyleProperty(";width:", `${escape(bb2.width, true)}px`) + ssrStyleProperty(";height:", `${escape(bb2.height, true)}px`)) });
                }
                const hte = hoveredTargetElement();
                const rect = hte && document.contains(hte) ? hte.getBoundingClientRect() : null;
                const bb = rect ? { x: rect.left, y: rect.top, width: rect.width, height: rect.height } : { x: ha.boundingBox.x, y: ha.isFixed ? ha.boundingBox.y : ha.boundingBox.y - scrollY(), width: ha.boundingBox.width, height: ha.boundingBox.height };
                const isMulti = ha.isMultiSelect;
                return ssr(_tmpl$207, ssrHydrationKey(), `${isMulti ? escape(styles_module_default4.multiSelectOutline, true) : escape(styles_module_default4.singleSelectOutline, true)} ${escape(styles_module_default4.enter, true)}`, ssrStyle({ left: `${bb.x}px`, top: `${bb.y}px`, width: `${bb.width}px`, height: `${bb.height}px`, ...isMulti ? {} : { "border-color": "color-mix(in srgb, var(--agentation-color-accent) 60%, transparent)", "background-color": "color-mix(in srgb, var(--agentation-color-accent) 5%, transparent)" } }));
              })();
            } });
          })();
        } })), escape(createComponent(Show, { get when() {
          return hoverInfo() && !pendingAnnotation() && !isScrolling() && !isDragging();
        }, get children() {
          return (() => {
            const hi = hoverInfo();
            const hp = hoverPosition();
            return ssr(_tmpl$209, ssrHydrationKey(), `${escape(styles_module_default4.hoverTooltip, true)} ${escape(styles_module_default4.enter, true)}`, ssrStyleProperty("left:", `${escape(Math.max(8, Math.min(hp.x, window.innerWidth - 100)), true)}px`) + ssrStyleProperty(";top:", `${escape(Math.max(hp.y - (hi.reactComponents ? 48 : 32), 8), true)}px`), escape(createComponent(Show, { get when() {
              return hi.reactComponents;
            }, get children() {
              return ssr(_tmpl$208, ssrHydrationKey() + ssrAttribute("class", escape(styles_module_default4.hoverReactPath, true), false), escape(hi.reactComponents));
            } })), ssrAttribute("class", escape(styles_module_default4.hoverElementName, true), false), escape(hi.elementName));
          })();
        } })), escape(createComponent(Show, { get when() {
          return pendingAnnotation();
        }, get children() {
          return (() => {
            const pa = pendingAnnotation();
            return [pa.multiSelectElements?.length ? (
              // Cmd+shift+click multi-select: show individual boxes with live positions
              createComponent(For$1, { get each() {
                return pa.multiSelectElements.filter((el) => document.contains(el));
              }, children: (el) => {
                const rect = el.getBoundingClientRect();
                return ssr(_tmpl$207, ssrHydrationKey(), `${escape(styles_module_default4.multiSelectOutline, true)} ${pendingExiting() ? escape(styles_module_default4.exit, true) : escape(styles_module_default4.enter, true)}`, ssrStyleProperty("left:", `${escape(rect.left, true)}px`) + ssrStyleProperty(";top:", `${escape(rect.top, true)}px`) + ssrStyleProperty(";width:", `${escape(rect.width, true)}px`) + ssrStyleProperty(";height:", `${escape(rect.height, true)}px`));
              } })
            ) : (
              // Single element or drag multi-select: show single box
              pa.targetElement && document.contains(pa.targetElement) ? (
                // Single-click: use live getBoundingClientRect for consistent positioning
                (() => {
                  const rect = pa.targetElement.getBoundingClientRect();
                  return ssr(_tmpl$207, ssrHydrationKey(), `${escape(styles_module_default4.singleSelectOutline, true)} ${pendingExiting() ? escape(styles_module_default4.exit, true) : escape(styles_module_default4.enter, true)}`, ssrStyleProperty("left:", `${escape(rect.left, true)}px`) + ssrStyleProperty(";top:", `${escape(rect.top, true)}px`) + ssrStyleProperty(";width:", `${escape(rect.width, true)}px`) + ssrStyleProperty(";height:", `${escape(rect.height, true)}px`) + ssrStyleProperty(";border-color:", "color-mix(in srgb, var(--agentation-color-accent) 60%, transparent)") + ssrStyleProperty(";background-color:", "color-mix(in srgb, var(--agentation-color-accent) 5%, transparent)"));
                })()
              ) : (
                // Drag selection or fallback: use stored boundingBox
                pa.boundingBox && ssr(_tmpl$207, ssrHydrationKey(), `${pa.isMultiSelect ? escape(styles_module_default4.multiSelectOutline, true) : escape(styles_module_default4.singleSelectOutline, true)} ${pendingExiting() ? escape(styles_module_default4.exit, true) : escape(styles_module_default4.enter, true)}`, ssrStyle({ left: `${pa.boundingBox.x}px`, top: `${pa.boundingBox.y - scrollY()}px`, width: `${pa.boundingBox.width}px`, height: `${pa.boundingBox.height}px`, ...pa.isMultiSelect ? {} : { "border-color": "color-mix(in srgb, var(--agentation-color-accent) 60%, transparent)", "background-color": "color-mix(in srgb, var(--agentation-color-accent) 5%, transparent)" } }))
              )
            ), (() => {
              const markerX = pa.x;
              const markerY = pa.isFixed ? pa.y : pa.y - scrollY();
              return [createComponent(PendingMarker, { x: markerX, y: markerY, get isMultiSelect() {
                return pa.isMultiSelect;
              }, get isExiting() {
                return pendingExiting();
              } }), createComponent(AnnotationPopupCSS, { get element() {
                return pa.element;
              }, get selectedText() {
                return pa.selectedText;
              }, get computedStyles() {
                return pa.computedStylesObj;
              }, get placeholder() {
                return pa.element === "Area selection" ? "What should change in this area?" : pa.isMultiSelect ? "Feedback for this group of elements..." : "What should change?";
              }, onSubmit: addAnnotation, onCancel: cancelAnnotation, get isExiting() {
                return pendingExiting();
              }, get lightMode() {
                return !isDarkMode();
              }, get accentColor() {
                return pa.isMultiSelect ? "var(--agentation-color-green)" : "var(--agentation-color-accent)";
              }, get style() {
                return {
                  // Popup is 280px wide, centered with translateX(-50%), so 140px each side
                  // Clamp so popup stays 20px from viewport edges
                  left: `${Math.max(160, Math.min(window.innerWidth - 160, markerX / 100 * window.innerWidth))}px`,
                  // Position popup above or below marker to keep marker visible
                  ...markerY > window.innerHeight - 290 ? { bottom: `${window.innerHeight - markerY + 20}px` } : { top: `${markerY + 20}px` }
                };
              } })];
            })()];
          })();
        } })), escape(createComponent(Show, { get when() {
          return editingAnnotation();
        }, get children() {
          return (() => {
            const ea = editingAnnotation();
            return [ea.elementBoundingBoxes?.length ? (
              // Cmd+shift+click: show individual element boxes (use live rects when available)
              (() => {
                if (editingTargetElements().length > 0) {
                  return createComponent(For$1, { get each() {
                    return editingTargetElements().filter((el) => document.contains(el));
                  }, children: (el) => {
                    const rect = el.getBoundingClientRect();
                    return ssr(_tmpl$207, ssrHydrationKey(), `${escape(styles_module_default4.multiSelectOutline, true)} ${escape(styles_module_default4.enter, true)}`, ssrStyleProperty("left:", `${escape(rect.left, true)}px`) + ssrStyleProperty(";top:", `${escape(rect.top, true)}px`) + ssrStyleProperty(";width:", `${escape(rect.width, true)}px`) + ssrStyleProperty(";height:", `${escape(rect.height, true)}px`));
                  } });
                }
                return createComponent(For$1, { get each() {
                  return ea.elementBoundingBoxes;
                }, children: (bb) => ssr(_tmpl$207, ssrHydrationKey(), `${escape(styles_module_default4.multiSelectOutline, true)} ${escape(styles_module_default4.enter, true)}`, ssrStyleProperty("left:", `${escape(bb.x, true)}px`) + ssrStyleProperty(";top:", `${escape(bb.y, true) - escape(scrollY(), true)}px`) + ssrStyleProperty(";width:", `${escape(bb.width, true)}px`) + ssrStyleProperty(";height:", `${escape(bb.height, true)}px`)) });
              })()
            ) : (
              // Single element or drag multi-select: show single box
              (() => {
                const ete = editingTargetElement();
                const rect = ete && document.contains(ete) ? ete.getBoundingClientRect() : null;
                const bb = rect ? { x: rect.left, y: rect.top, width: rect.width, height: rect.height } : ea.boundingBox ? { x: ea.boundingBox.x, y: ea.isFixed ? ea.boundingBox.y : ea.boundingBox.y - scrollY(), width: ea.boundingBox.width, height: ea.boundingBox.height } : null;
                if (!bb) return null;
                return ssr(_tmpl$207, ssrHydrationKey(), `${ea.isMultiSelect ? escape(styles_module_default4.multiSelectOutline, true) : escape(styles_module_default4.singleSelectOutline, true)} ${escape(styles_module_default4.enter, true)}`, ssrStyle({ left: `${bb.x}px`, top: `${bb.y}px`, width: `${bb.width}px`, height: `${bb.height}px`, ...ea.isMultiSelect ? {} : { "border-color": "color-mix(in srgb, var(--agentation-color-accent) 60%, transparent)", "background-color": "color-mix(in srgb, var(--agentation-color-accent) 5%, transparent)" } }));
              })()
            ), createComponent(AnnotationPopupCSS, { get element() {
              return ea.element;
            }, get selectedText() {
              return ea.selectedText;
            }, get computedStyles() {
              return parseComputedStylesString(ea.computedStyles);
            }, placeholder: "Edit your feedback...", get initialValue() {
              return ea.comment;
            }, submitLabel: "Save", onSubmit: updateAnnotation2, onCancel: cancelEditAnnotation, onDelete: () => deleteAnnotation2(ea.id), get isExiting() {
              return editExiting();
            }, get lightMode() {
              return !isDarkMode();
            }, get accentColor() {
              return ea.isMultiSelect ? "var(--agentation-color-green)" : "var(--agentation-color-accent)";
            }, get style() {
              const markerY = ea.isFixed ? ea.y : ea.y - scrollY();
              return {
                // Popup is 280px wide, centered with translateX(-50%), so 140px each side
                // Clamp so popup stays 20px from viewport edges
                left: `${Math.max(160, Math.min(window.innerWidth - 160, ea.x / 100 * window.innerWidth))}px`,
                // Position popup above or below marker to keep marker visible
                ...markerY > window.innerHeight - 290 ? { bottom: `${window.innerHeight - markerY + 20}px` } : { top: `${markerY + 20}px` }
              };
            } })];
          })();
        } })), escape(createComponent(Show, { get when() {
          return isDragging();
        }, get children() {
          return [ssr(_tmpl$204, ssrHydrationKey() + ssrAttribute("class", escape(styles_module_default4.dragSelection, true), false)), ssr(_tmpl$204, ssrHydrationKey() + ssrAttribute("class", escape(styles_module_default4.highlightsContainer, true), false))];
        } })));
      } })));
    } });
  } });
}
function Agentation(props = {}) {
  initOwnerTracking();
  const currentOwner = getOwner();
  if (currentOwner) {
    setRootOwner(currentOwner);
  }
  if (!sharedConfig.context) {
    return PageFeedbackToolbarCSS(props);
  }
  let mountEl;
  let dispose;
  onMount(() => {
    setTimeout(() => {
      mountEl = document.createElement("div");
      mountEl.style.display = "contents";
      document.body.appendChild(mountEl);
      dispose = render(() => PageFeedbackToolbarCSS(props), mountEl);
    }, 0);
  });
  onCleanup(() => {
    dispose?.();
    mountEl?.remove();
  });
  return null;
}
var _tmpl$ = ['<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Agentation SolidJS Demo</title>', '<style>\n          * { box-sizing: border-box; margin: 0; padding: 0; }\n          body {\n            font-family: system-ui, -apple-system, sans-serif;\n            line-height: 1.6;\n            color: #1a1a1a;\n            background: #fafafa;\n          }\n          nav {\n            display: flex;\n            gap: 1.5rem;\n            padding: 1rem 2rem;\n            background: #fff;\n            border-bottom: 1px solid #eee;\n          }\n          nav a {\n            color: #555;\n            text-decoration: none;\n            font-weight: 500;\n            font-size: 0.875rem;\n          }\n          nav a:hover { color: #000; }\n          nav a[data-status="active"] { color: #000; border-bottom: 2px solid #000; }\n          main { max-width: 720px; margin: 0 auto; padding: 2rem; }\n        </style></head>'], _tmpl$2 = ["<html", ' lang="en">', "<body><nav><!--$-->", "<!--/--><!--$-->", "<!--/--></nav><main>", "</main><!--$-->", "<!--/--><!--$-->", "<!--/--></body></html>"];
const Route$2 = createRootRoute({
  component: RootComponent
});
function RootComponent() {
  return ssr(_tmpl$2, ssrHydrationKey(), createComponent(NoHydration, {
    get children() {
      return ssr(_tmpl$, escape(createComponent(HeadContent, {})));
    }
  }), escape(createComponent(Link$1, {
    to: "/",
    children: "Home"
  })), escape(createComponent(Link$1, {
    to: "/about",
    children: "About"
  })), escape(createComponent(Outlet, {})), escape(createComponent(Agentation, {})), escape(createComponent(Scripts, {})));
}
const $$splitComponentImporter$1 = () => import("./about-Ctiaw-e9.js");
const Route$1 = createFileRoute("/about")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./index-B8SmlD2i.js");
const Route2 = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const AboutRoute = Route$1.update({
  id: "/about",
  path: "/about",
  getParentRoute: () => Route$2
});
const IndexRoute = Route2.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$2
});
const rootRouteChildren = {
  IndexRoute,
  AboutRoute
};
const routeTree = Route$2._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
  return createRouter({
    routeTree,
    scrollRestoration: true
  });
}
export {
  getRouter
};
