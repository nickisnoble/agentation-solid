const ke={context:void 0,registry:void 0,effects:void 0,done:!1,getContextId(){return ac(this.context.count)},getNextContextId(){return ac(this.context.count++)}};function ac(e){const t=String(e),n=t.length-1;return ke.context.id+(n?String.fromCharCode(96+n):"")+t}function or(e){ke.context=e}function lh(){return{...ke.context,id:ke.getNextContextId(),count:0}}const ah=!1,ch=(e,t)=>e===t,ys=Symbol("solid-proxy"),Rd=typeof Proxy=="function",dh=Symbol("solid-track"),xs={equals:ch};let fi=null,Pd=Nd;const Wn=1,mi=2,Ed={owned:null,cleanups:null,context:null,owner:null},ol={};var at=null;let pe=null,uh=null,Tt=null,bn=null,fn=null,Os=0;function cr(e,t){const n=Tt,o=at,r=e.length===0,i=t===void 0?o:t,s=r?Ed:{owned:null,cleanups:null,context:i?i.context:null,owner:i},l=r?e:()=>e(()=>nn(()=>Uo(s)));at=s,Tt=null;try{return On(l,!0)}finally{Tt=n,at=o}}function G(e,t){t=t?Object.assign({},xs,t):xs;const n={value:e,observers:null,observerSlots:null,comparator:t.equals||void 0},o=r=>(typeof r=="function"&&(pe&&pe.running&&pe.sources.has(n)?r=r(n.tValue):r=r(n.value)),Fd(n,r));return[Dd.bind(n),o]}function Cl(e,t,n){const o=Si(e,t,!0,Wn);Dr(o)}function ie(e,t,n){const o=Si(e,t,!1,Wn);Dr(o)}function De(e,t,n){Pd=xh;const o=Si(e,t,!1,Wn),r=_r&&Wo(_r);r&&(o.suspense=r),(!n||!n.render)&&(o.user=!0),fn?fn.push(o):Dr(o)}function et(e,t,n){n=n?Object.assign({},xs,n):xs;const o=Si(e,t,!0,0);return o.observers=null,o.observerSlots=null,o.comparator=n.equals||void 0,Dr(o),Dd.bind(o)}function _h(e){return e&&typeof e=="object"&&"then"in e}function hi(e,t,n){let o,r,i;typeof t=="function"?(o=e,r=t,i={}):(o=!0,r=e,i=t||{});let s=null,l=ol,a=null,c=!1,d=!1,u="initialValue"in i,_=typeof o=="function"&&et(o);const m=new Set,[g,v]=(i.storage||G)(i.initialValue),[f,p]=G(void 0),[k,P]=G(void 0,{equals:!1}),[R,A]=G(u?"ready":"unresolved");ke.context&&(a=ke.getNextContextId(),i.ssrLoadFrom==="initial"?l=i.initialValue:ke.load&&ke.has(a)&&(l=ke.load(a)));function ee(j,ue,be,ye){return s===j&&(s=null,ye!==void 0&&(u=!0),(j===l||ue===l)&&i.onHydrated&&queueMicrotask(()=>i.onHydrated(ye,{value:ue})),l=ol,pe&&j&&c?(pe.promises.delete(j),c=!1,On(()=>{pe.running=!0,D(ue,be)},!1)):D(ue,be)),ue}function D(j,ue){On(()=>{ue===void 0&&v(()=>j),A(ue!==void 0?"errored":u?"ready":"unresolved"),p(ue);for(const be of m.keys())be.decrement();m.clear()},!1)}function K(){const j=_r&&Wo(_r),ue=g(),be=f();if(be!==void 0&&!s)throw be;return Tt&&!Tt.user&&j&&Cl(()=>{k(),s&&(j.resolved&&pe&&c?pe.promises.add(s):m.has(j)||(j.increment(),m.add(j)))}),ue}function te(j=!0){if(j!==!1&&d)return;d=!1;const ue=_?_():o;if(c=pe&&pe.running,ue==null||ue===!1){ee(s,nn(g));return}pe&&s&&pe.promises.delete(s);let be;const ye=l!==ol?l:nn(()=>{try{return r(ue,{value:g(),refetching:j})}catch(Te){be=Te}});if(be!==void 0){ee(s,void 0,_s(be),ue);return}else if(!_h(ye))return ee(s,ye,void 0,ue),ye;return s=ye,"v"in ye?(ye.s===1?ee(s,ye.v,void 0,ue):ee(s,void 0,_s(ye.v),ue),ye):(d=!0,queueMicrotask(()=>d=!1),On(()=>{A(u?"refreshing":"pending"),P()},!1),ye.then(Te=>ee(ye,Te,void 0,ue),Te=>ee(ye,void 0,_s(Te),ue)))}Object.defineProperties(K,{state:{get:()=>R()},error:{get:()=>f()},loading:{get(){const j=R();return j==="pending"||j==="refreshing"}},latest:{get(){if(!u)return K();const j=f();if(j&&!s)throw j;return g()}}});let me=at;return _?Cl(()=>(me=at,te(!1))):te(!1),[K,{refetch:j=>Ad(me,()=>te(j)),mutate:v}]}function Td(e){return On(e,!1)}function nn(e){if(Tt===null)return e();const t=Tt;Tt=null;try{return e()}finally{Tt=t}}function Ld(e,t,n){const o=Array.isArray(e);let r,i=n&&n.defer;return s=>{let l;if(o){l=Array(e.length);for(let c=0;c<e.length;c++)l[c]=e[c]()}else l=e();if(i)return i=!1,s;const a=nn(()=>t(l,r,s));return r=l,a}}function Pn(e){De(()=>nn(e))}function ot(e){return at===null||(at.cleanups===null?at.cleanups=[e]:at.cleanups.push(e)),e}function hh(e,t){fi||(fi=Symbol("error")),at=Si(void 0,void 0,!0),at.context={...at.context,[fi]:[t]},pe&&pe.running&&pe.sources.add(at);try{return e()}catch(n){ki(n)}finally{at=at.owner}}function bs(){return at}function Ad(e,t){const n=at,o=Tt;at=e,Tt=null;try{return On(t,!0)}catch(r){ki(r)}finally{at=n,Tt=o}}function Bd(e){if(pe&&pe.running)return e(),pe.done;const t=Tt,n=at;return Promise.resolve().then(()=>{Tt=t,at=n;let o;return _r&&(o=pe||(pe={sources:new Set,effects:[],promises:new Set,disposed:new Set,queue:new Set,running:!0}),o.done||(o.done=new Promise(r=>o.resolve=r)),o.running=!0),On(e,!1),Tt=at=null,o?o.done:void 0})}const[fh,cc]=G(!1);function gh(){return[fh,Bd]}function mh(e){fn.push.apply(fn,e),e.length=0}function $i(e,t){const n=Symbol("context");return{id:n,Provider:bh(n),defaultValue:e}}function Wo(e){let t;return at&&at.context&&(t=at.context[e.id])!==void 0?t:e.defaultValue}function Od(e){const t=et(e),n=et(()=>Ml(t()));return n.toArray=()=>{const o=n();return Array.isArray(o)?o:o!=null?[o]:[]},n}let _r;function ph(){return _r||(_r=$i())}function Dd(){const e=pe&&pe.running;if(this.sources&&(e?this.tState:this.state))if((e?this.tState:this.state)===Wn)Dr(this);else{const t=bn;bn=null,On(()=>ws(this),!1),bn=t}if(Tt){const t=this.observers?this.observers.length:0;Tt.sources?(Tt.sources.push(this),Tt.sourceSlots.push(t)):(Tt.sources=[this],Tt.sourceSlots=[t]),this.observers?(this.observers.push(Tt),this.observerSlots.push(Tt.sources.length-1)):(this.observers=[Tt],this.observerSlots=[Tt.sources.length-1])}return e&&pe.sources.has(this)?this.tValue:this.value}function Fd(e,t,n){let o=pe&&pe.running&&pe.sources.has(e)?e.tValue:e.value;if(!e.comparator||!e.comparator(o,t)){if(pe){const r=pe.running;(r||!n&&pe.sources.has(e))&&(pe.sources.add(e),e.tValue=t),r||(e.value=t)}else e.value=t;e.observers&&e.observers.length&&On(()=>{for(let r=0;r<e.observers.length;r+=1){const i=e.observers[r],s=pe&&pe.running;s&&pe.disposed.has(i)||((s?!i.tState:!i.state)&&(i.pure?bn.push(i):fn.push(i),i.observers&&zd(i)),s?i.tState=Wn:i.state=Wn)}if(bn.length>1e6)throw bn=[],new Error},!1)}return t}function Dr(e){if(!e.fn)return;Uo(e);const t=Os;dc(e,pe&&pe.running&&pe.sources.has(e)?e.tValue:e.value,t),pe&&!pe.running&&pe.sources.has(e)&&queueMicrotask(()=>{On(()=>{pe&&(pe.running=!0),Tt=at=e,dc(e,e.tValue,t),Tt=at=null},!1)})}function dc(e,t,n){let o;const r=at,i=Tt;Tt=at=e;try{o=e.fn(t)}catch(s){return e.pure&&(pe&&pe.running?(e.tState=Wn,e.tOwned&&e.tOwned.forEach(Uo),e.tOwned=void 0):(e.state=Wn,e.owned&&e.owned.forEach(Uo),e.owned=null)),e.updatedAt=n+1,ki(s)}finally{Tt=i,at=r}(!e.updatedAt||e.updatedAt<=n)&&(e.updatedAt!=null&&"observers"in e?Fd(e,o,!0):pe&&pe.running&&e.pure?(pe.sources.has(e)||(e.value=o),pe.sources.add(e),e.tValue=o):e.value=o,e.updatedAt=n)}function Si(e,t,n,o=Wn,r){const i={fn:e,state:o,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:t,owner:at,context:at?at.context:null,pure:n};return pe&&pe.running&&(i.state=0,i.tState=o),at===null||at!==Ed&&(pe&&pe.running&&at.pure?at.tOwned?at.tOwned.push(i):at.tOwned=[i]:at.owned?at.owned.push(i):at.owned=[i]),i}function vs(e){const t=pe&&pe.running;if((t?e.tState:e.state)===0)return;if((t?e.tState:e.state)===mi)return ws(e);if(e.suspense&&nn(e.suspense.inFallback))return e.suspense.effects.push(e);const n=[e];for(;(e=e.owner)&&(!e.updatedAt||e.updatedAt<Os);){if(t&&pe.disposed.has(e))return;(t?e.tState:e.state)&&n.push(e)}for(let o=n.length-1;o>=0;o--){if(e=n[o],t){let r=e,i=n[o+1];for(;(r=r.owner)&&r!==i;)if(pe.disposed.has(r))return}if((t?e.tState:e.state)===Wn)Dr(e);else if((t?e.tState:e.state)===mi){const r=bn;bn=null,On(()=>ws(e,n[0]),!1),bn=r}}}function On(e,t){if(bn)return e();let n=!1;t||(bn=[]),fn?n=!0:fn=[],Os++;try{const o=e();return yh(n),o}catch(o){n||(fn=null),bn=null,ki(o)}}function yh(e){if(bn&&(Nd(bn),bn=null),e)return;let t;if(pe){if(!pe.promises.size&&!pe.queue.size){const o=pe.sources,r=pe.disposed;fn.push.apply(fn,pe.effects),t=pe.resolve;for(const i of fn)"tState"in i&&(i.state=i.tState),delete i.tState;pe=null,On(()=>{for(const i of r)Uo(i);for(const i of o){if(i.value=i.tValue,i.owned)for(let s=0,l=i.owned.length;s<l;s++)Uo(i.owned[s]);i.tOwned&&(i.owned=i.tOwned),delete i.tValue,delete i.tOwned,i.tState=0}cc(!1)},!1)}else if(pe.running){pe.running=!1,pe.effects.push.apply(pe.effects,fn),fn=null,cc(!0);return}}const n=fn;fn=null,n.length&&On(()=>Pd(n),!1),t&&t()}function Nd(e){for(let t=0;t<e.length;t++)vs(e[t])}function xh(e){let t,n=0;for(t=0;t<e.length;t++){const o=e[t];o.user?e[n++]=o:vs(o)}if(ke.context){if(ke.count){ke.effects||(ke.effects=[]),ke.effects.push(...e.slice(0,n));return}or()}for(ke.effects&&(ke.done||!ke.count)&&(e=[...ke.effects,...e],n+=ke.effects.length,delete ke.effects),t=0;t<n;t++)vs(e[t])}function ws(e,t){const n=pe&&pe.running;n?e.tState=0:e.state=0;for(let o=0;o<e.sources.length;o+=1){const r=e.sources[o];if(r.sources){const i=n?r.tState:r.state;i===Wn?r!==t&&(!r.updatedAt||r.updatedAt<Os)&&vs(r):i===mi&&ws(r,t)}}}function zd(e){const t=pe&&pe.running;for(let n=0;n<e.observers.length;n+=1){const o=e.observers[n];(t?!o.tState:!o.state)&&(t?o.tState=mi:o.state=mi,o.pure?bn.push(o):fn.push(o),o.observers&&zd(o))}}function Uo(e){let t;if(e.sources)for(;e.sources.length;){const n=e.sources.pop(),o=e.sourceSlots.pop(),r=n.observers;if(r&&r.length){const i=r.pop(),s=n.observerSlots.pop();o<r.length&&(i.sourceSlots[s]=o,r[o]=i,n.observerSlots[o]=s)}}if(e.tOwned){for(t=e.tOwned.length-1;t>=0;t--)Uo(e.tOwned[t]);delete e.tOwned}if(pe&&pe.running&&e.pure)Hd(e,!0);else if(e.owned){for(t=e.owned.length-1;t>=0;t--)Uo(e.owned[t]);e.owned=null}if(e.cleanups){for(t=e.cleanups.length-1;t>=0;t--)e.cleanups[t]();e.cleanups=null}pe&&pe.running?e.tState=0:e.state=0}function Hd(e,t){if(t||(e.tState=0,pe.disposed.add(e)),e.owned)for(let n=0;n<e.owned.length;n++)Hd(e.owned[n])}function _s(e){return e instanceof Error?e:new Error(typeof e=="string"?e:"Unknown error",{cause:e})}function uc(e,t,n){try{for(const o of t)o(e)}catch(o){ki(o,n&&n.owner||null)}}function ki(e,t=at){const n=fi&&t&&t.context&&t.context[fi],o=_s(e);if(!n)throw o;fn?fn.push({fn(){uc(o,n,t)},state:Wn}):uc(o,n,t)}function Ml(e){if(typeof e=="function"&&!e.length)return Ml(e());if(Array.isArray(e)){const t=[];for(let n=0;n<e.length;n++){const o=Ml(e[n]);Array.isArray(o)?t.push.apply(t,o):t.push(o)}return t}return e}function bh(e,t){return function(o){let r;return ie(()=>r=nn(()=>(at.context={...at.context,[e]:o.value},Od(()=>o.children))),void 0),r}}const vh=Symbol("fallback");function _c(e){for(let t=0;t<e.length;t++)e[t]()}function wh(e,t,n={}){let o=[],r=[],i=[],s=0,l=t.length>1?[]:null;return ot(()=>_c(i)),()=>{let a=e()||[],c=a.length,d,u;return a[dh],nn(()=>{let m,g,v,f,p,k,P,R,A;if(c===0)s!==0&&(_c(i),i=[],o=[],r=[],s=0,l&&(l=[])),n.fallback&&(o=[vh],r[0]=cr(ee=>(i[0]=ee,n.fallback())),s=1);else if(s===0){for(r=new Array(c),u=0;u<c;u++)o[u]=a[u],r[u]=cr(_);s=c}else{for(v=new Array(c),f=new Array(c),l&&(p=new Array(c)),k=0,P=Math.min(s,c);k<P&&o[k]===a[k];k++);for(P=s-1,R=c-1;P>=k&&R>=k&&o[P]===a[R];P--,R--)v[R]=r[P],f[R]=i[P],l&&(p[R]=l[P]);for(m=new Map,g=new Array(R+1),u=R;u>=k;u--)A=a[u],d=m.get(A),g[u]=d===void 0?-1:d,m.set(A,u);for(d=k;d<=P;d++)A=o[d],u=m.get(A),u!==void 0&&u!==-1?(v[u]=r[d],f[u]=i[d],l&&(p[u]=l[d]),u=g[u],m.set(A,u)):i[d]();for(u=k;u<c;u++)u in v?(r[u]=v[u],i[u]=f[u],l&&(l[u]=p[u],l[u](u))):r[u]=cr(_);r=r.slice(0,s=c),o=a.slice(0)}return r});function _(m){if(i[u]=m,l){const[g,v]=G(u);return l[u]=v,t(a[u],g)}return t(a[u])}}}let jd=!1;function $h(){jd=!0}function h(e,t){if(jd&&ke.context){const n=ke.context;or(lh());const o=nn(()=>e(t||{}));return or(n),o}return nn(()=>e(t||{}))}function Gi(){return!0}const Il={get(e,t,n){return t===ys?n:e.get(t)},has(e,t){return t===ys?!0:e.has(t)},set:Gi,deleteProperty:Gi,getOwnPropertyDescriptor(e,t){return{configurable:!0,enumerable:!0,get(){return e.get(t)},set:Gi,deleteProperty:Gi}},ownKeys(e){return e.keys()}};function rl(e){return(e=typeof e=="function"?e():e)?e:{}}function Sh(){for(let e=0,t=this.length;e<t;++e){const n=this[e]();if(n!==void 0)return n}}function vn(...e){let t=!1;for(let s=0;s<e.length;s++){const l=e[s];t=t||!!l&&ys in l,e[s]=typeof l=="function"?(t=!0,et(l)):l}if(Rd&&t)return new Proxy({get(s){for(let l=e.length-1;l>=0;l--){const a=rl(e[l])[s];if(a!==void 0)return a}},has(s){for(let l=e.length-1;l>=0;l--)if(s in rl(e[l]))return!0;return!1},keys(){const s=[];for(let l=0;l<e.length;l++)s.push(...Object.keys(rl(e[l])));return[...new Set(s)]}},Il);const n={},o=Object.create(null);for(let s=e.length-1;s>=0;s--){const l=e[s];if(!l)continue;const a=Object.getOwnPropertyNames(l);for(let c=a.length-1;c>=0;c--){const d=a[c];if(d==="__proto__"||d==="constructor")continue;const u=Object.getOwnPropertyDescriptor(l,d);if(!o[d])o[d]=u.get?{enumerable:!0,configurable:!0,get:Sh.bind(n[d]=[u.get.bind(l)])}:u.value!==void 0?u:void 0;else{const _=n[d];_&&(u.get?_.push(u.get.bind(l)):u.value!==void 0&&_.push(()=>u.value))}}}const r={},i=Object.keys(o);for(let s=i.length-1;s>=0;s--){const l=i[s],a=o[l];a&&a.get?Object.defineProperty(r,l,a):r[l]=a?a.value:void 0}return r}function Jn(e,...t){const n=t.length;if(Rd&&ys in e){const r=n>1?t.flat():t[0],i=t.map(s=>new Proxy({get(l){return s.includes(l)?e[l]:void 0},has(l){return s.includes(l)&&l in e},keys(){return s.filter(l=>l in e)}},Il));return i.push(new Proxy({get(s){return r.includes(s)?void 0:e[s]},has(s){return r.includes(s)?!1:s in e},keys(){return Object.keys(e).filter(s=>!r.includes(s))}},Il)),i}const o=[];for(let r=0;r<=n;r++)o[r]={};for(const r of Object.getOwnPropertyNames(e)){let i=n;for(let a=0;a<t.length;a++)if(t[a].includes(r)){i=a;break}const s=Object.getOwnPropertyDescriptor(e,r);!s.get&&!s.set&&s.enumerable&&s.writable&&s.configurable?o[i][r]=s.value:Object.defineProperty(o[i],r,s)}return o}let kh=0;function Ud(){return ke.context?ke.getNextContextId():`cl-${kh++}`}const Wd=e=>`Stale read from <${e}>.`;function Ye(e){const t="fallback"in e&&{fallback:()=>e.fallback};return et(wh(()=>e.each,e.children,t||void 0))}function Oe(e){const t=e.keyed,n=et(()=>e.when,void 0,void 0),o=t?n:et(n,void 0,{equals:(r,i)=>!r==!i});return et(()=>{const r=o();if(r){const i=e.children;return typeof i=="function"&&i.length>0?nn(()=>i(t?r:()=>{if(!nn(o))throw Wd("Show");return n()})):i}return e.fallback},void 0,void 0)}function Yd(e){const t=Od(()=>e.children),n=et(()=>{const o=t(),r=Array.isArray(o)?o:[o];let i=()=>{};for(let s=0;s<r.length;s++){const l=s,a=r[s],c=i,d=et(()=>c()?void 0:a.when,void 0,void 0),u=a.keyed?d:et(d,void 0,{equals:(_,m)=>!_==!m});i=()=>c()||(u()?[l,d,a]:void 0)}return i});return et(()=>{const o=n()();if(!o)return e.fallback;const[r,i,s]=o,l=s.children;return typeof l=="function"&&l.length>0?nn(()=>l(s.keyed?i():()=>{if(nn(n)()?.[0]!==r)throw Wd("Match");return i()})):l},void 0,void 0)}function po(e){return e}let Ji;function Ch(e){let t;ke.context&&ke.load&&(t=ke.load(ke.getContextId()));const[n,o]=G(t,void 0);return Ji||(Ji=new Set),Ji.add(o),ot(()=>Ji.delete(o)),et(()=>{let r;if(r=n()){const i=e.fallback;return typeof i=="function"&&i.length?nn(()=>i(r,()=>o())):i}return hh(()=>e.children,o)},void 0,void 0)}const Mh=$i();function Yl(e){let t=0,n,o,r,i,s;const[l,a]=G(!1),c=ph(),d={increment:()=>{++t===1&&a(!0)},decrement:()=>{--t===0&&a(!1)},inFallback:l,effects:[],resolved:!1},u=bs();if(ke.context&&ke.load){const g=ke.getContextId();let v=ke.load(g);if(v&&(typeof v!="object"||v.s!==1?r=v:ke.gather(g)),r&&r!=="$$f"){const[f,p]=G(void 0,{equals:!1});i=f,r.then(()=>{if(ke.done)return p();ke.gather(g),or(o),p(),or()},k=>{s=k,p()})}}const _=Wo(Mh);_&&(n=_.register(d.inFallback));let m;return ot(()=>m&&m()),h(c.Provider,{value:d,get children(){return et(()=>{if(s)throw s;if(o=ke.context,i)return i(),i=void 0;o&&r==="$$f"&&or();const g=et(()=>e.children);return et(v=>{const f=d.inFallback(),{showContent:p=!0,showFallback:k=!0}=n?n():{};if((!f||r&&r!=="$$f")&&p)return d.resolved=!0,m&&m(),m=o=r=void 0,mh(d.effects),g();if(k)return m?v:cr(P=>(m=P,o&&(or({id:o.id+"F",count:0}),o=void 0),e.fallback),u)})})}})}const il=void 0,Ih=["allowfullscreen","async","alpha","autofocus","autoplay","checked","controls","default","disabled","formnovalidate","hidden","indeterminate","inert","ismap","loop","multiple","muted","nomodule","novalidate","open","playsinline","readonly","required","reversed","seamless","selected","adauctionheaders","browsingtopics","credentialless","defaultchecked","defaultmuted","defaultselected","defer","disablepictureinpicture","disableremoteplayback","preservespitch","shadowrootclonable","shadowrootcustomelementregistry","shadowrootdelegatesfocus","shadowrootserializable","sharedstoragewritable"],Rh=new Set(["className","value","readOnly","noValidate","formNoValidate","isMap","noModule","playsInline","adAuctionHeaders","allowFullscreen","browsingTopics","defaultChecked","defaultMuted","defaultSelected","disablePictureInPicture","disableRemotePlayback","preservesPitch","shadowRootClonable","shadowRootCustomElementRegistry","shadowRootDelegatesFocus","shadowRootSerializable","sharedStorageWritable",...Ih]),Ph=new Set(["innerHTML","textContent","innerText","children"]),Eh=Object.assign(Object.create(null),{className:"class",htmlFor:"for"}),Th=Object.assign(Object.create(null),{class:"className",novalidate:{$:"noValidate",FORM:1},formnovalidate:{$:"formNoValidate",BUTTON:1,INPUT:1},ismap:{$:"isMap",IMG:1},nomodule:{$:"noModule",SCRIPT:1},playsinline:{$:"playsInline",VIDEO:1},readonly:{$:"readOnly",INPUT:1,TEXTAREA:1},adauctionheaders:{$:"adAuctionHeaders",IFRAME:1},allowfullscreen:{$:"allowFullscreen",IFRAME:1},browsingtopics:{$:"browsingTopics",IMG:1},defaultchecked:{$:"defaultChecked",INPUT:1},defaultmuted:{$:"defaultMuted",AUDIO:1,VIDEO:1},defaultselected:{$:"defaultSelected",OPTION:1},disablepictureinpicture:{$:"disablePictureInPicture",VIDEO:1},disableremoteplayback:{$:"disableRemotePlayback",AUDIO:1,VIDEO:1},preservespitch:{$:"preservesPitch",AUDIO:1,VIDEO:1},shadowrootclonable:{$:"shadowRootClonable",TEMPLATE:1},shadowrootdelegatesfocus:{$:"shadowRootDelegatesFocus",TEMPLATE:1},shadowrootserializable:{$:"shadowRootSerializable",TEMPLATE:1},sharedstoragewritable:{$:"sharedStorageWritable",IFRAME:1,IMG:1}});function Lh(e,t){const n=Th[e];return typeof n=="object"?n[t]?n.$:void 0:n}const Ah=new Set(["beforeinput","click","dblclick","contextmenu","focusin","focusout","input","keydown","keyup","mousedown","mousemove","mouseout","mouseover","mouseup","pointerdown","pointermove","pointerout","pointerover","pointerup","touchend","touchmove","touchstart"]),Bh=new Set(["altGlyph","altGlyphDef","altGlyphItem","animate","animateColor","animateMotion","animateTransform","circle","clipPath","color-profile","cursor","defs","desc","ellipse","feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence","filter","font","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignObject","g","glyph","glyphRef","hkern","image","line","linearGradient","marker","mask","metadata","missing-glyph","mpath","path","pattern","polygon","polyline","radialGradient","rect","set","stop","svg","switch","symbol","text","textPath","tref","tspan","use","view","vkern"]),Oh={xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace"},lt=e=>et(()=>e());function Dh(e,t,n){let o=n.length,r=t.length,i=o,s=0,l=0,a=t[r-1].nextSibling,c=null;for(;s<r||l<i;){if(t[s]===n[l]){s++,l++;continue}for(;t[r-1]===n[i-1];)r--,i--;if(r===s){const d=i<o?l?n[l-1].nextSibling:n[i-l]:a;for(;l<i;)e.insertBefore(n[l++],d)}else if(i===l)for(;s<r;)(!c||!c.has(t[s]))&&t[s].remove(),s++;else if(t[s]===n[i-1]&&n[l]===t[r-1]){const d=t[--r].nextSibling;e.insertBefore(n[l++],t[s++].nextSibling),e.insertBefore(n[--i],d),t[r]=n[i]}else{if(!c){c=new Map;let u=l;for(;u<i;)c.set(n[u],u++)}const d=c.get(t[s]);if(d!=null)if(l<d&&d<i){let u=s,_=1,m;for(;++u<r&&u<i&&!((m=c.get(t[u]))==null||m!==d+_);)_++;if(_>d-l){const g=t[s];for(;l<d;)e.insertBefore(n[l++],g)}else e.replaceChild(n[l++],t[s++])}else s++;else t[s++].remove()}}}const hc="_$DX_DELEGATE";function Rl(e,t,n,o={}){let r;return cr(i=>{r=i,t===document?e():y(t,e(),t.firstChild?null:void 0,n)},o.owner),()=>{r(),t.textContent=""}}function $(e,t,n,o){let r;const i=()=>{const l=o?document.createElementNS("http://www.w3.org/1998/Math/MathML","template"):document.createElement("template");return l.innerHTML=e,n?l.content.firstChild.firstChild:o?l.firstChild:l.content.firstChild},s=t?()=>nn(()=>document.importNode(r||(r=i()),!0)):()=>(r||(r=i())).cloneNode(!0);return s.cloneNode=s,s}function Vl(e,t=window.document){const n=t[hc]||(t[hc]=new Set);for(let o=0,r=e.length;o<r;o++){const i=e[o];n.has(i)||(n.add(i),t.addEventListener(i,Vd))}}function yo(e,t,n){$o(e)||(e[t]=n)}function O(e,t,n){$o(e)||(n==null?e.removeAttribute(t):e.setAttribute(t,n))}function Fh(e,t,n,o){$o(e)||(o==null?e.removeAttributeNS(t,n):e.setAttributeNS(t,n,o))}function Nh(e,t,n){$o(e)||(n?e.setAttribute(t,""):e.removeAttribute(t))}function M(e,t){$o(e)||(t==null?e.removeAttribute("class"):e.className=t)}function Br(e,t,n,o){if(o)Array.isArray(n)?(e[`$$${t}`]=n[0],e[`$$${t}Data`]=n[1]):e[`$$${t}`]=n;else if(Array.isArray(n)){const r=n[0];e.addEventListener(t,n[0]=i=>r.call(e,n[1],i))}else e.addEventListener(t,n,typeof n!="function"&&n)}function zh(e,t,n={}){const o=Object.keys(t||{}),r=Object.keys(n);let i,s;for(i=0,s=r.length;i<s;i++){const l=r[i];!l||l==="undefined"||t[l]||(fc(e,l,!1),delete n[l])}for(i=0,s=o.length;i<s;i++){const l=o[i],a=!!t[l];!l||l==="undefined"||n[l]===a||!a||(fc(e,l,!0),n[l]=a)}return n}function gn(e,t,n){if(!t)return n?O(e,"style"):t;const o=e.style;if(typeof t=="string")return o.cssText=t;typeof n=="string"&&(o.cssText=n=void 0),n||(n={}),t||(t={});let r,i;for(i in n)t[i]==null&&o.removeProperty(i),delete n[i];for(i in t)r=t[i],r!==n[i]&&(o.setProperty(i,r),n[i]=r);return n}function E(e,t,n){n!=null?e.style.setProperty(t,n):e.style.removeProperty(t)}function bo(e,t={},n,o){const r={};return o||ie(()=>r.children=pi(e,t.children,r.children)),ie(()=>typeof t.ref=="function"&&uo(t.ref,e)),ie(()=>Hh(e,t,n,!0,r,!0)),r}function uo(e,t,n){return nn(()=>e(t,n))}function y(e,t,n,o){if(n!==void 0&&!o&&(o=[]),typeof t!="function")return pi(e,t,o,n);ie(r=>pi(e,t(),r,n),o)}function Hh(e,t,n,o,r={},i=!1){t||(t={});for(const s in r)if(!(s in t)){if(s==="children")continue;r[s]=gc(e,s,null,r[s],n,i,t)}for(const s in t){if(s==="children")continue;const l=t[s];r[s]=gc(e,s,l,r[s],n,i,t)}}function jh(e,t,n={}){if(globalThis._$HY.done)return Rl(e,t,[...t.childNodes],n);ke.completed=globalThis._$HY.completed,ke.events=globalThis._$HY.events,ke.load=o=>globalThis._$HY.r[o],ke.has=o=>o in globalThis._$HY.r,ke.gather=o=>pc(t,o),ke.registry=new Map,ke.context={id:n.renderId||"",count:0};try{return pc(t,n.renderId),Rl(e,t,[...t.childNodes],n)}finally{ke.context=null}}function b(e){let t,n;return!$o()||!(t=ke.registry.get(n=Yh()))?e():(ke.completed&&ke.completed.add(t),ke.registry.delete(n),t)}function Uh(e,t){for(;e&&e.localName!==t;)e=e.nextSibling;return e}function S(e){let t=e,n=0,o=[];if($o(e))for(;t;){if(t.nodeType===8){const r=t.nodeValue;if(r==="$")n++;else if(r==="/"){if(n===0)return[t,o];n--}}o.push(t),t=t.nextSibling}return[t,o]}function Ft(){ke.events&&!ke.events.queued&&(queueMicrotask(()=>{const{completed:e,events:t}=ke;if(t){for(t.queued=!1;t.length;){const[n,o]=t[0];if(!e.has(n))return;t.shift(),Vd(o)}ke.done&&(ke.events=_$HY.events=null,ke.completed=_$HY.completed=null)}}),ke.events.queued=!0)}function $o(e){return!!ke.context&&!ke.done&&(!e||e.isConnected)}function Wh(e){return e.toLowerCase().replace(/-([a-z])/g,(t,n)=>n.toUpperCase())}function fc(e,t,n){const o=t.trim().split(/\s+/);for(let r=0,i=o.length;r<i;r++)e.classList.toggle(o[r],n)}function gc(e,t,n,o,r,i,s){let l,a,c,d,u;if(t==="style")return gn(e,n,o);if(t==="classList")return zh(e,n,o);if(n===o)return o;if(t==="ref")i||n(e);else if(t.slice(0,3)==="on:"){const _=t.slice(3);o&&e.removeEventListener(_,o,typeof o!="function"&&o),n&&e.addEventListener(_,n,typeof n!="function"&&n)}else if(t.slice(0,10)==="oncapture:"){const _=t.slice(10);o&&e.removeEventListener(_,o,!0),n&&e.addEventListener(_,n,!0)}else if(t.slice(0,2)==="on"){const _=t.slice(2).toLowerCase(),m=Ah.has(_);if(!m&&o){const g=Array.isArray(o)?o[0]:o;e.removeEventListener(_,g)}(m||n)&&(Br(e,_,n,m),m&&Vl([_]))}else if(t.slice(0,5)==="attr:")O(e,t.slice(5),n);else if(t.slice(0,5)==="bool:")Nh(e,t.slice(5),n);else if((u=t.slice(0,5)==="prop:")||(c=Ph.has(t))||!r&&((d=Lh(t,e.tagName))||(a=Rh.has(t)))||(l=e.nodeName.includes("-")||"is"in s)){if(u)t=t.slice(5),a=!0;else if($o(e))return n;t==="class"||t==="className"?M(e,n):l&&!a&&!c?e[Wh(t)]=n:e[d||t]=n}else{const _=r&&t.indexOf(":")>-1&&Oh[t.split(":")[0]];_?Fh(e,_,t,n):O(e,Eh[t]||t,n)}return n}function Vd(e){if(ke.registry&&ke.events&&ke.events.find(([a,c])=>c===e))return;let t=e.target;const n=`$$${e.type}`,o=e.target,r=e.currentTarget,i=a=>Object.defineProperty(e,"target",{configurable:!0,value:a}),s=()=>{const a=t[n];if(a&&!t.disabled){const c=t[`${n}Data`];if(c!==void 0?a.call(t,c,e):a.call(t,e),e.cancelBubble)return}return t.host&&typeof t.host!="string"&&!t.host._$host&&t.contains(e.target)&&i(t.host),!0},l=()=>{for(;s()&&(t=t._$host||t.parentNode||t.host););};if(Object.defineProperty(e,"currentTarget",{configurable:!0,get(){return t||document}}),ke.registry&&!ke.done&&(ke.done=_$HY.done=!0),e.composedPath){const a=e.composedPath();i(a[0]);for(let c=0;c<a.length-2&&(t=a[c],!!s());c++){if(t._$host){t=t._$host,l();break}if(t.parentNode===r)break}}else l();i(o)}function pi(e,t,n,o,r){const i=$o(e);if(i){!n&&(n=[...e.childNodes]);let a=[];for(let c=0;c<n.length;c++){const d=n[c];d.nodeType===8&&d.data.slice(0,2)==="!$"?d.remove():a.push(d)}n=a}for(;typeof n=="function";)n=n();if(t===n)return n;const s=typeof t,l=o!==void 0;if(e=l&&n[0]&&n[0].parentNode||e,s==="string"||s==="number"){if(i||s==="number"&&(t=t.toString(),t===n))return n;if(l){let a=n[0];a&&a.nodeType===3?a.data!==t&&(a.data=t):a=document.createTextNode(t),n=Cr(e,n,o,a)}else n!==""&&typeof n=="string"?n=e.firstChild.data=t:n=e.textContent=t}else if(t==null||s==="boolean"){if(i)return n;n=Cr(e,n,o)}else{if(s==="function")return ie(()=>{let a=t();for(;typeof a=="function";)a=a();n=pi(e,a,n,o)}),()=>n;if(Array.isArray(t)){const a=[],c=n&&Array.isArray(n);if(Pl(a,t,n,r))return ie(()=>n=pi(e,a,n,o,!0)),()=>n;if(i){if(!a.length)return n;if(o===void 0)return n=[...e.childNodes];let d=a[0];if(d.parentNode!==e)return n;const u=[d];for(;(d=d.nextSibling)!==o;)u.push(d);return n=u}if(a.length===0){if(n=Cr(e,n,o),l)return n}else c?n.length===0?mc(e,a,o):Dh(e,n,a):(n&&Cr(e),mc(e,a));n=a}else if(t.nodeType){if(i&&t.parentNode)return n=l?[t]:t;if(Array.isArray(n)){if(l)return n=Cr(e,n,o,t);Cr(e,n,null,t)}else n==null||n===""||!e.firstChild?e.appendChild(t):e.replaceChild(t,e.firstChild);n=t}}return n}function Pl(e,t,n,o){let r=!1;for(let i=0,s=t.length;i<s;i++){let l=t[i],a=n&&n[e.length],c;if(!(l==null||l===!0||l===!1))if((c=typeof l)=="object"&&l.nodeType)e.push(l);else if(Array.isArray(l))r=Pl(e,l,a)||r;else if(c==="function")if(o){for(;typeof l=="function";)l=l();r=Pl(e,Array.isArray(l)?l:[l],Array.isArray(a)?a:[a])||r}else e.push(l),r=!0;else{const d=String(l);a&&a.nodeType===3&&a.data===d?e.push(a):e.push(document.createTextNode(d))}}return r}function mc(e,t,n=null){for(let o=0,r=t.length;o<r;o++)e.insertBefore(t[o],n)}function Cr(e,t,n,o){if(n===void 0)return e.textContent="";const r=o||document.createTextNode("");if(t.length){let i=!1;for(let s=t.length-1;s>=0;s--){const l=t[s];if(r!==l){const a=l.parentNode===e;!i&&!s?a?e.replaceChild(r,l):e.insertBefore(r,n):a&&l.remove()}else i=!0}}else e.insertBefore(r,n);return[r]}function pc(e,t){const n=e.querySelectorAll("*[data-hk]");for(let o=0;o<n.length;o++){const r=n[o],i=r.getAttribute("data-hk");(!t||i.startsWith(t))&&!ke.registry.has(i)&&ke.registry.set(i,r)}}function Yh(){return ke.getNextContextId()}function Vh(e){return ke.context?void 0:e.children}const Xh="http://www.w3.org/2000/svg";function Xd(e,t=!1,n=void 0){return t?document.createElementNS(Xh,e):document.createElement(e,{is:n})}const qh=(...e)=>($h(),jh(...e));function qd(e){const{useShadow:t}=e,n=document.createTextNode(""),o=()=>e.mount||document.body,r=bs();let i,s=!!ke.context;return De(()=>{s&&(bs().user=s=!1),i||(i=Ad(r,()=>et(()=>e.children)));const l=o();if(l instanceof HTMLHeadElement){const[a,c]=G(!1),d=()=>c(!0);cr(u=>y(l,()=>a()?u():i(),null)),ot(d)}else{const a=Xd(e.isSVG?"g":"div",e.isSVG),c=t&&a.attachShadow?a.attachShadow({mode:"open"}):a;Object.defineProperty(a,"_$host",{get(){return n.parentNode},configurable:!0}),y(c,i),l.appendChild(a),e.ref&&e.ref(a),ot(()=>l.removeChild(a))}},void 0,{render:!s}),n}function Qh(e,t){const n=et(e);return et(()=>{const o=n();switch(typeof o){case"function":return nn(()=>o(t));case"string":const r=Bh.has(o),i=ke.context?b():Xd(o,r,nn(()=>t.is));return bo(i,t,r),i}})}function Un(e){const[,t]=Jn(e,["component"]);return Qh(()=>e.component,t)}var Kh=!1;function yi(e){return e[e.length-1]}function Gh(e){return typeof e=="function"}function No(e,t){return Gh(e)?e(t):e}var Jh=Object.prototype.hasOwnProperty,yc=Object.prototype.propertyIsEnumerable,Zh=()=>Object.create(null),Jo=(e,t)=>rr(e,t,Zh);function rr(e,t,n=()=>({}),o=0){if(e===t)return e;if(o>500)return t;const r=t,i=vc(e)&&vc(r);if(!i&&!($s(e)&&$s(r)))return r;const s=i?e:xc(e);if(!s)return r;const l=i?r:xc(r);if(!l)return r;const a=s.length,c=l.length,d=i?new Array(c):n();let u=0;for(let _=0;_<c;_++){const m=i?_:l[_],g=e[m],v=r[m];if(g===v){d[m]=g,(i?_<a:Jh.call(e,m))&&u++;continue}if(g===null||v===null||typeof g!="object"||typeof v!="object"){d[m]=v;continue}const f=rr(g,v,n,o+1);d[m]=f,f===g&&u++}return a===c&&u===a?e:d}function xc(e){const t=Object.getOwnPropertyNames(e);for(const r of t)if(!yc.call(e,r))return!1;const n=Object.getOwnPropertySymbols(e);if(n.length===0)return t;const o=t;for(const r of n){if(!yc.call(e,r))return!1;o.push(r)}return o}function $s(e){if(!bc(e))return!1;const t=e.constructor;if(typeof t>"u")return!0;const n=t.prototype;return!(!bc(n)||!n.hasOwnProperty("isPrototypeOf"))}function bc(e){return Object.prototype.toString.call(e)==="[object Object]"}function vc(e){return Array.isArray(e)&&e.length===Object.keys(e).length}function dr(e,t,n){if(e===t)return!0;if(typeof e!=typeof t)return!1;if(Array.isArray(e)&&Array.isArray(t)){if(e.length!==t.length)return!1;for(let o=0,r=e.length;o<r;o++)if(!dr(e[o],t[o],n))return!1;return!0}if($s(e)&&$s(t)){const o=n?.ignoreUndefined??!0;if(n?.partial){for(const s in t)if((!o||t[s]!==void 0)&&!dr(e[s],t[s],n))return!1;return!0}let r=0;if(!o)r=Object.keys(e).length;else for(const s in e)e[s]!==void 0&&r++;let i=0;for(const s in t)if((!o||t[s]!==void 0)&&(i++,i>r||!dr(e[s],t[s],n)))return!1;return r===i}return!1}function hr(e){let t,n;const o=new Promise((r,i)=>{t=r,n=i});return o.status="pending",o.resolve=r=>{o.status="resolved",o.value=r,t(r),e?.(r)},o.reject=r=>{o.status="rejected",n(r)},o}function ef(e){return typeof e?.message!="string"?!1:e.message.startsWith("Failed to fetch dynamically imported module")||e.message.startsWith("error loading dynamically imported module")||e.message.startsWith("Importing a module script failed")}function xi(e){return!!(e&&typeof e=="object"&&typeof e.then=="function")}function tf(e){return e.replace(/[\x00-\x1f\x7f]/g,"")}function wc(e){let t;try{t=decodeURI(e)}catch{t=e.replaceAll(/%[0-9A-F]{2}/gi,n=>{try{return decodeURI(n)}catch{return n}})}return tf(t)}var nf=["http:","https:","mailto:","tel:"];function Ss(e,t){if(!e)return!1;try{const n=new URL(e);return!t.has(n.protocol)}catch{return!1}}function oi(e){if(!e)return{path:e,handledProtocolRelativeURL:!1};if(!/[%\\\x00-\x1f\x7f]/.test(e)&&!e.startsWith("//"))return{path:e,handledProtocolRelativeURL:!1};const t=/%25|%5C/gi;let n=0,o="",r;for(;(r=t.exec(e))!==null;)o+=wc(e.slice(n,r.index))+r[0],n=t.lastIndex;o=o+wc(n?e.slice(n):e);let i=!1;return o.startsWith("//")&&(i=!0,o="/"+o.replace(/^\/+/,"")),{path:o,handledProtocolRelativeURL:i}}function of(e){return/\s|[^\u0000-\u007F]/.test(e)?e.replace(/\s|[^\u0000-\u007F]/gu,encodeURIComponent):e}function rf(e,t){if(e===t)return!0;if(e.length!==t.length)return!1;for(let n=0;n<e.length;n++)if(e[n]!==t[n])return!1;return!0}function Zn(){throw new Error("Invariant failed")}function bi(e){const t=new Map;let n,o;const r=i=>{i.next&&(i.prev?(i.prev.next=i.next,i.next.prev=i.prev,i.next=void 0,o&&(o.next=i,i.prev=o)):(i.next.prev=void 0,n=i.next,i.next=void 0,o&&(i.prev=o,o.next=i)),o=i)};return{get(i){const s=t.get(i);if(s)return r(s),s.value},set(i,s){if(t.size>=e&&n){const a=n;t.delete(a.key),a.next&&(n=a.next,a.next.prev=void 0),a===o&&(o=void 0)}const l=t.get(i);if(l)l.value=s,r(l);else{const a={key:i,value:s,prev:o};o&&(o.next=a),o=a,n||(n=a),t.set(i,a)}},clear(){t.clear(),n=void 0,o=void 0}}}var ir=4,Qd=5;function sf(e){const t=e.indexOf("{");if(t===-1)return null;const n=e.indexOf("}",t);return n===-1||t+1>=e.length?null:[t,n]}function Xl(e,t,n=new Uint16Array(6)){const o=e.indexOf("/",t),r=o===-1?e.length:o,i=e.substring(t,r);if(!i||!i.includes("$"))return n[0]=0,n[1]=t,n[2]=t,n[3]=r,n[4]=r,n[5]=r,n;if(i==="$"){const l=e.length;return n[0]=2,n[1]=t,n[2]=t,n[3]=l,n[4]=l,n[5]=l,n}if(i.charCodeAt(0)===36)return n[0]=1,n[1]=t,n[2]=t+1,n[3]=r,n[4]=r,n[5]=r,n;const s=sf(i);if(s){const[l,a]=s,c=i.charCodeAt(l+1);if(c===45){if(l+2<i.length&&i.charCodeAt(l+2)===36){const d=l+3,u=a;if(d<u)return n[0]=3,n[1]=t+l,n[2]=t+d,n[3]=t+u,n[4]=t+a+1,n[5]=r,n}}else if(c===36){const d=l+1,u=l+2;return u===a?(n[0]=2,n[1]=t+l,n[2]=t+d,n[3]=t+u,n[4]=t+a+1,n[5]=e.length,n):(n[0]=1,n[1]=t+l,n[2]=t+u,n[3]=t+a,n[4]=t+a+1,n[5]=r,n)}}return n[0]=0,n[1]=t,n[2]=t,n[3]=r,n[4]=r,n[5]=r,n}function Ds(e,t,n,o,r,i,s){s?.(n);let l=o;{const a=n.fullPath??n.from,c=a.length,d=n.options?.caseSensitive??e,u=!!(n.options?.params?.parse&&n.options?.skipRouteOnParseError?.params);for(;l<c;){const m=Xl(a,l,t);let g;const v=l,f=m[5];switch(l=f+1,i++,m[0]){case 0:{const p=a.substring(m[2],m[3]);if(d){const k=r.static?.get(p);if(k)g=k;else{r.static??=new Map;const P=sr(n.fullPath??n.from);P.parent=r,P.depth=i,g=P,r.static.set(p,P)}}else{const k=p.toLowerCase(),P=r.staticInsensitive?.get(k);if(P)g=P;else{r.staticInsensitive??=new Map;const R=sr(n.fullPath??n.from);R.parent=r,R.depth=i,g=R,r.staticInsensitive.set(k,R)}}break}case 1:{const p=a.substring(v,m[1]),k=a.substring(m[4],f),P=d&&!!(p||k),R=p?P?p:p.toLowerCase():void 0,A=k?P?k:k.toLowerCase():void 0,ee=!u&&r.dynamic?.find(D=>!D.skipOnParamError&&D.caseSensitive===P&&D.prefix===R&&D.suffix===A);if(ee)g=ee;else{const D=ll(1,n.fullPath??n.from,P,R,A);g=D,D.depth=i,D.parent=r,r.dynamic??=[],r.dynamic.push(D)}break}case 3:{const p=a.substring(v,m[1]),k=a.substring(m[4],f),P=d&&!!(p||k),R=p?P?p:p.toLowerCase():void 0,A=k?P?k:k.toLowerCase():void 0,ee=!u&&r.optional?.find(D=>!D.skipOnParamError&&D.caseSensitive===P&&D.prefix===R&&D.suffix===A);if(ee)g=ee;else{const D=ll(3,n.fullPath??n.from,P,R,A);g=D,D.parent=r,D.depth=i,r.optional??=[],r.optional.push(D)}break}case 2:{const p=a.substring(v,m[1]),k=a.substring(m[4],f),P=d&&!!(p||k),R=p?P?p:p.toLowerCase():void 0,A=k?P?k:k.toLowerCase():void 0,ee=ll(2,n.fullPath??n.from,P,R,A);g=ee,ee.parent=r,ee.depth=i,r.wildcard??=[],r.wildcard.push(ee)}}r=g}if(u&&n.children&&!n.isRoot&&n.id&&n.id.charCodeAt(n.id.lastIndexOf("/")+1)===95){const m=sr(n.fullPath??n.from);m.kind=Qd,m.parent=r,i++,m.depth=i,r.pathless??=[],r.pathless.push(m),r=m}const _=(n.path||!n.children)&&!n.isRoot;if(_&&a.endsWith("/")){const m=sr(n.fullPath??n.from);m.kind=ir,m.parent=r,i++,m.depth=i,r.index=m,r=m}r.parse=n.options?.params?.parse??null,r.skipOnParamError=u,r.parsingPriority=n.options?.skipRouteOnParseError?.priority??0,_&&!r.route&&(r.route=n,r.fullPath=n.fullPath??n.from)}if(n.children)for(const a of n.children)Ds(e,t,a,l,r,i,s)}function sl(e,t){if(e.skipOnParamError&&!t.skipOnParamError)return-1;if(!e.skipOnParamError&&t.skipOnParamError)return 1;if(e.skipOnParamError&&t.skipOnParamError&&(e.parsingPriority||t.parsingPriority))return t.parsingPriority-e.parsingPriority;if(e.prefix&&t.prefix&&e.prefix!==t.prefix){if(e.prefix.startsWith(t.prefix))return-1;if(t.prefix.startsWith(e.prefix))return 1}if(e.suffix&&t.suffix&&e.suffix!==t.suffix){if(e.suffix.endsWith(t.suffix))return-1;if(t.suffix.endsWith(e.suffix))return 1}return e.prefix&&!t.prefix?-1:!e.prefix&&t.prefix?1:e.suffix&&!t.suffix?-1:!e.suffix&&t.suffix?1:e.caseSensitive&&!t.caseSensitive?-1:!e.caseSensitive&&t.caseSensitive?1:0}function Do(e){if(e.pathless)for(const t of e.pathless)Do(t);if(e.static)for(const t of e.static.values())Do(t);if(e.staticInsensitive)for(const t of e.staticInsensitive.values())Do(t);if(e.dynamic?.length){e.dynamic.sort(sl);for(const t of e.dynamic)Do(t)}if(e.optional?.length){e.optional.sort(sl);for(const t of e.optional)Do(t)}if(e.wildcard?.length){e.wildcard.sort(sl);for(const t of e.wildcard)Do(t)}}function sr(e){return{kind:0,depth:0,pathless:null,index:null,static:null,staticInsensitive:null,dynamic:null,optional:null,wildcard:null,route:null,fullPath:e,parent:null,parse:null,skipOnParamError:!1,parsingPriority:0}}function ll(e,t,n,o,r){return{kind:e,depth:0,pathless:null,index:null,static:null,staticInsensitive:null,dynamic:null,optional:null,wildcard:null,route:null,fullPath:t,parent:null,parse:null,skipOnParamError:!1,parsingPriority:0,caseSensitive:n,prefix:o,suffix:r}}function lf(e,t){const n=sr("/"),o=new Uint16Array(6);for(const r of e)Ds(!1,o,r,1,n,0);Do(n),t.masksTree=n,t.flatCache=bi(1e3)}function af(e,t){e||="/";const n=t.flatCache.get(e);if(n)return n;const o=ql(e,t.masksTree);return t.flatCache.set(e,o),o}function cf(e,t,n,o,r){e||="/",o||="/";const i=t?`case\0${e}`:e;let s=r.singleCache.get(i);return s||(s=sr("/"),Ds(t,new Uint16Array(6),{from:e},1,s,0),r.singleCache.set(i,s)),ql(o,s,n)}function df(e,t,n=!1){const o=n?e:`nofuzz\0${e}`,r=t.matchCache.get(o);if(r!==void 0)return r;e||="/";let i;try{i=ql(e,t.segmentTree,n)}catch(s){if(s instanceof URIError)i=null;else throw s}return i&&(i.branch=hf(i.route)),t.matchCache.set(o,i),i}function uf(e){return e==="/"?e:e.replace(/\/{1,}$/,"")}function _f(e,t=!1,n){const o=sr(e.fullPath),r=new Uint16Array(6),i={},s={};let l=0;return Ds(t,r,e,1,o,0,a=>{if(n?.(a,l),a.id in i&&Zn(),i[a.id]=a,l!==0&&a.path){const c=uf(a.fullPath);(!s[c]||a.fullPath.endsWith("/"))&&(s[c]=a)}l++}),Do(o),{processedTree:{segmentTree:o,singleCache:bi(1e3),matchCache:bi(1e3),flatCache:null,masksTree:null},routesById:i,routesByPath:s}}function ql(e,t,n=!1){const o=e.split("/"),r=gf(e,o,t,n);if(!r)return null;const[i]=Kd(e,o,r);return{route:r.node.route,rawParams:i,parsedParams:r.parsedParams}}function Kd(e,t,n){const o=ff(n.node);let r=null;const i=Object.create(null);let s=n.extract?.part??0,l=n.extract?.node??0,a=n.extract?.path??0,c=n.extract?.segment??0;for(;l<o.length;s++,l++,a++,c++){const d=o[l];if(d.kind===ir)break;if(d.kind===Qd){c--,s--,a--;continue}const u=t[s],_=a;if(u&&(a+=u.length),d.kind===1){r??=n.node.fullPath.split("/");const m=r[c],g=d.prefix?.length??0;if(m.charCodeAt(g)===123){const v=d.suffix?.length??0,f=m.substring(g+2,m.length-v-1),p=u.substring(g,u.length-v);i[f]=decodeURIComponent(p)}else{const v=m.substring(1);i[v]=decodeURIComponent(u)}}else if(d.kind===3){if(n.skipped&1<<l){s--,a=_-1;continue}r??=n.node.fullPath.split("/");const m=r[c],g=d.prefix?.length??0,v=d.suffix?.length??0,f=m.substring(g+3,m.length-v-1),p=d.suffix||d.prefix?u.substring(g,u.length-v):u;p&&(i[f]=decodeURIComponent(p))}else if(d.kind===2){const m=d,g=e.substring(_+(m.prefix?.length??0),e.length-(m.suffix?.length??0)),v=decodeURIComponent(g);i["*"]=v,i._splat=v;break}}return n.rawParams&&Object.assign(i,n.rawParams),[i,{part:s,node:l,path:a,segment:c}]}function hf(e){const t=[e];for(;e.parentRoute;)e=e.parentRoute,t.push(e);return t.reverse(),t}function ff(e){const t=Array(e.depth+1);do t[e.depth]=e,e=e.parent;while(e);return t}function gf(e,t,n,o){if(e==="/"&&n.index)return{node:n.index,skipped:0};const r=!yi(t),i=r&&e!=="/",s=t.length-(r?1:0),l=[{node:n,index:1,skipped:0,depth:1,statics:1,dynamics:0,optionals:0}];let a=null,c=null,d=null;for(;l.length;){const u=l.pop(),{node:_,index:m,skipped:g,depth:v,statics:f,dynamics:p,optionals:k}=u;let{extract:P,rawParams:R,parsedParams:A}=u;if(_.skipOnParamError){if(!al(e,t,u))continue;R=u.rawParams,P=u.extract,A=u.parsedParams}o&&_.route&&_.kind!==ir&&ri(c,u)&&(c=u);const ee=m===s;if(ee&&(_.route&&!i&&ri(d,u)&&(d=u),!_.optional&&!_.wildcard&&!_.index&&!_.pathless))continue;const D=ee?void 0:t[m];let K;if(ee&&_.index){const te={node:_.index,index:m,skipped:g,depth:v+1,statics:f,dynamics:p,optionals:k,extract:P,rawParams:R,parsedParams:A};let me=!0;if(_.index.skipOnParamError&&(al(e,t,te)||(me=!1)),me){if(f===s&&!p&&!k&&!g)return te;ri(d,te)&&(d=te)}}if(_.wildcard&&ri(a,u))for(const te of _.wildcard){const{prefix:me,suffix:j}=te;if(me&&(ee||!(te.caseSensitive?D:K??=D.toLowerCase()).startsWith(me)))continue;if(j){if(ee)continue;const be=t.slice(m).join("/").slice(-j.length);if((te.caseSensitive?be:be.toLowerCase())!==j)continue}const ue={node:te,index:s,skipped:g,depth:v,statics:f,dynamics:p,optionals:k,extract:P,rawParams:R,parsedParams:A};if(!(te.skipOnParamError&&!al(e,t,ue))){a=ue;break}}if(_.optional){const te=g|1<<v,me=v+1;for(let j=_.optional.length-1;j>=0;j--){const ue=_.optional[j];l.push({node:ue,index:m,skipped:te,depth:me,statics:f,dynamics:p,optionals:k,extract:P,rawParams:R,parsedParams:A})}if(!ee)for(let j=_.optional.length-1;j>=0;j--){const ue=_.optional[j],{prefix:be,suffix:ye}=ue;if(be||ye){const Te=ue.caseSensitive?D:K??=D.toLowerCase();if(be&&!Te.startsWith(be)||ye&&!Te.endsWith(ye))continue}l.push({node:ue,index:m+1,skipped:g,depth:me,statics:f,dynamics:p,optionals:k+1,extract:P,rawParams:R,parsedParams:A})}}if(!ee&&_.dynamic&&D)for(let te=_.dynamic.length-1;te>=0;te--){const me=_.dynamic[te],{prefix:j,suffix:ue}=me;if(j||ue){const be=me.caseSensitive?D:K??=D.toLowerCase();if(j&&!be.startsWith(j)||ue&&!be.endsWith(ue))continue}l.push({node:me,index:m+1,skipped:g,depth:v+1,statics:f,dynamics:p+1,optionals:k,extract:P,rawParams:R,parsedParams:A})}if(!ee&&_.staticInsensitive){const te=_.staticInsensitive.get(K??=D.toLowerCase());te&&l.push({node:te,index:m+1,skipped:g,depth:v+1,statics:f+1,dynamics:p,optionals:k,extract:P,rawParams:R,parsedParams:A})}if(!ee&&_.static){const te=_.static.get(D);te&&l.push({node:te,index:m+1,skipped:g,depth:v+1,statics:f+1,dynamics:p,optionals:k,extract:P,rawParams:R,parsedParams:A})}if(_.pathless){const te=v+1;for(let me=_.pathless.length-1;me>=0;me--){const j=_.pathless[me];l.push({node:j,index:m,skipped:g,depth:te,statics:f,dynamics:p,optionals:k,extract:P,rawParams:R,parsedParams:A})}}}if(d&&a)return ri(a,d)?d:a;if(d)return d;if(a)return a;if(o&&c){let u=c.index;for(let m=0;m<c.index;m++)u+=t[m].length;const _=u===e.length?"/":e.slice(u);return c.rawParams??=Object.create(null),c.rawParams["**"]=decodeURIComponent(_),c}return null}function al(e,t,n){try{const[o,r]=Kd(e,t,n);n.rawParams=o,n.extract=r;const i=n.node.parse(o);return n.parsedParams=Object.assign(Object.create(null),n.parsedParams,i),!0}catch{return null}}function ri(e,t){return e?t.statics>e.statics||t.statics===e.statics&&(t.dynamics>e.dynamics||t.dynamics===e.dynamics&&(t.optionals>e.optionals||t.optionals===e.optionals&&((t.node.kind===ir)>(e.node.kind===ir)||t.node.kind===ir==(e.node.kind===ir)&&t.depth>e.depth))):!0}function hs(e){return Ql(e.filter(t=>t!==void 0).join("/"))}function Ql(e){return e.replace(/\/{2,}/g,"/")}function Gd(e){return e==="/"?e:e.replace(/^\/{1,}/,"")}function Ho(e){const t=e.length;return t>1&&e[t-1]==="/"?e.replace(/\/{1,}$/,""):e}function Jd(e){return Ho(Gd(e))}function ks(e,t){return e?.endsWith("/")&&e!=="/"&&e!==`${t}/`?e.slice(0,-1):e}function mf(e,t,n){return ks(e,n)===ks(t,n)}function pf({base:e,to:t,trailingSlash:n="never",cache:o}){const r=t.startsWith("/"),i=!r&&t===".";let s;if(o){s=r?t:i?e:e+"\0"+t;const u=o.get(s);if(u)return u}let l;if(i)l=e.split("/");else if(r)l=t.split("/");else{for(l=e.split("/");l.length>1&&yi(l)==="";)l.pop();const u=t.split("/");for(let _=0,m=u.length;_<m;_++){const g=u[_];g===""?_?_===m-1&&l.push(g):l=[g]:g===".."?l.pop():g==="."||l.push(g)}}l.length>1&&(yi(l)===""?n==="never"&&l.pop():n==="always"&&l.push(""));let a,c="";for(let u=0;u<l.length;u++){u>0&&(c+="/");const _=l[u];if(!_)continue;a=Xl(_,0,a);const m=a[0];if(m===0){c+=_;continue}const g=a[5],v=_.substring(0,a[1]),f=_.substring(a[4],g),p=_.substring(a[2],a[3]);m===1?c+=v||f?`${v}{$${p}}${f}`:`$${p}`:m===2?c+=v||f?`${v}{$}${f}`:"$":c+=`${v}{-$${p}}${f}`}c=Ql(c);const d=c||"/";return s&&o&&o.set(s,d),d}function yf(e){const t=new Map(e.map(r=>[encodeURIComponent(r),r])),n=Array.from(t.keys()).map(r=>r.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join("|"),o=new RegExp(n,"g");return r=>r.replace(o,i=>t.get(i)??i)}function cl(e,t,n){const o=t[e];return typeof o!="string"?o:e==="_splat"?/^[a-zA-Z0-9\-._~!/]*$/.test(o)?o:o.split("/").map(r=>Sc(r,n)).join("/"):Sc(o,n)}function $c({path:e,params:t,decoder:n,...o}){let r=!1;const i=Object.create(null);if(!e||e==="/")return{interpolatedPath:"/",usedParams:i,isMissingParams:r};if(!e.includes("$"))return{interpolatedPath:e,usedParams:i,isMissingParams:r};const s=e.length;let l=0,a,c="";for(;l<s;){const d=l;a=Xl(e,d,a);const u=a[5];if(l=u+1,d===u)continue;const _=a[0];if(_===0){c+="/"+e.substring(d,u);continue}if(_===2){const m=t._splat;i._splat=m,i["*"]=m;const g=e.substring(d,a[1]),v=e.substring(a[4],u);if(!m){r=!0,(g||v)&&(c+="/"+g+v);continue}const f=cl("_splat",t,n);c+="/"+g+f+v;continue}if(_===1){const m=e.substring(a[2],a[3]);!r&&!(m in t)&&(r=!0),i[m]=t[m];const g=e.substring(d,a[1]),v=e.substring(a[4],u),f=cl(m,t,n)??"undefined";c+="/"+g+f+v;continue}if(_===3){const m=e.substring(a[2],a[3]),g=t[m];if(g==null)continue;i[m]=g;const v=e.substring(d,a[1]),f=e.substring(a[4],u),p=cl(m,t,n)??"";c+="/"+v+p+f;continue}}return e.endsWith("/")&&(c+="/"),{usedParams:i,interpolatedPath:c||"/",isMissingParams:r}}function Sc(e,t){const n=encodeURIComponent(e);return t?.(n)??n}function xn(e){return!!e?.isNotFound}function xf(){try{if(typeof window<"u"&&typeof window.sessionStorage=="object")return window.sessionStorage}catch{}}var El="tsr-scroll-restoration-v1_3",bf=(e,t)=>{let n;return(...o)=>{n||(n=setTimeout(()=>{e(...o),n=null},t))}};function vf(){const e=xf();if(!e)return null;const t=e.getItem(El);let n=t?JSON.parse(t):{};return{state:n,set:o=>{n=No(o,n)||n;try{e.setItem(El,JSON.stringify(n))}catch{console.warn("[ts-router] Could not persist scroll restoration state to sessionStorage.")}}}}var Zi=vf(),wf=e=>e.state.__TSR_key||e.href;function $f(e){const t=[];let n;for(;n=e.parentNode;)t.push(`${e.tagName}:nth-child(${Array.prototype.indexOf.call(n.children,e)+1})`),e=n;return`${t.reverse().join(" > ")}`.toLowerCase()}var Cs=!1;function Sf({storageKey:e,key:t,behavior:n,shouldScrollRestoration:o,scrollToTopSelectors:r,location:i}){let s;try{s=JSON.parse(sessionStorage.getItem(e)||"{}")}catch(c){console.error(c);return}const l=t||window.history.state?.__TSR_key,a=s[l];Cs=!0;e:{if(o&&a&&Object.keys(a).length>0){for(const u in a){const _=a[u];if(u==="window")window.scrollTo({top:_.scrollY,left:_.scrollX,behavior:n});else if(u){const m=document.querySelector(u);m&&(m.scrollLeft=_.scrollX,m.scrollTop=_.scrollY)}}break e}const c=(i??window.location).hash.split("#",2)[1];if(c){const u=window.history.state?.__hashScrollIntoViewOptions??!0;if(u){const _=document.getElementById(c);_&&_.scrollIntoView(u)}break e}const d={top:0,left:0,behavior:n};if(window.scrollTo(d),r)for(const u of r){if(u==="window")continue;const _=typeof u=="function"?u():document.querySelector(u);_&&_.scrollTo(d)}}Cs=!1}function kf(e,t){if(!Zi||((e.options.scrollRestoration??!1)&&(e.isScrollRestoring=!0),e.isScrollRestorationSetup||!Zi))return;e.isScrollRestorationSetup=!0,Cs=!1;const n=e.options.getScrollRestorationKey||wf;window.history.scrollRestoration="manual";const o=r=>{if(Cs||!e.isScrollRestoring)return;let i="";if(r.target===document||r.target===window)i="window";else{const l=r.target.getAttribute("data-scroll-restoration-id");l?i=`[data-scroll-restoration-id="${l}"]`:i=$f(r.target)}const s=n(e.stores.location.state);Zi.set(l=>{const a=l[s]||={},c=a[i]||={};if(i==="window")c.scrollX=window.scrollX||0,c.scrollY=window.scrollY||0;else if(i){const d=document.querySelector(i);d&&(c.scrollX=d.scrollLeft||0,c.scrollY=d.scrollTop||0)}return l})};typeof document<"u"&&document.addEventListener("scroll",bf(o,100),!0),e.subscribe("onRendered",r=>{const i=n(r.toLocation);if(!e.resetNextScroll){e.resetNextScroll=!0;return}typeof e.options.scrollRestoration=="function"&&!e.options.scrollRestoration({location:e.latestLocation})||(Sf({storageKey:El,key:i,behavior:e.options.scrollRestorationBehavior,shouldScrollRestoration:e.isScrollRestoring,scrollToTopSelectors:e.options.scrollToTopSelectors,location:e.history.location}),e.isScrollRestoring&&Zi.set(s=>(s[i]||={},s)))})}function Cf(e){if(typeof document<"u"&&document.querySelector){const t=e.stores.location.state,n=t.state.__hashScrollIntoViewOptions??!0;if(n&&t.hash!==""){const o=document.getElementById(t.hash);o&&o.scrollIntoView(n)}}}function Zd(e,t=String){const n=new URLSearchParams;for(const o in e){const r=e[o];r!==void 0&&n.set(o,t(r))}return n.toString()}function dl(e){return e?e==="false"?!1:e==="true"?!0:+e*0===0&&+e+""===e?+e:e:""}function Mf(e){const t=new URLSearchParams(e),n=Object.create(null);for(const[o,r]of t.entries()){const i=n[o];i==null?n[o]=dl(r):Array.isArray(i)?i.push(dl(r)):n[o]=[i,dl(r)]}return n}var If=Pf(JSON.parse),Rf=Ef(JSON.stringify,JSON.parse);function Pf(e){return t=>{t[0]==="?"&&(t=t.substring(1));const n=Mf(t);for(const o in n){const r=n[o];if(typeof r=="string")try{n[o]=e(r)}catch{}}return n}}function Ef(e,t){const n=typeof t=="function";function o(r){if(typeof r=="object"&&r!==null)try{return e(r)}catch{}else if(n&&typeof r=="string")try{return t(r),e(r)}catch{}return r}return r=>{const i=Zd(r,o);return i?`?${i}`:""}}var _o="__root__";function eu(e){if(e.statusCode=e.statusCode||e.code||307,!e._builtLocation&&!e.reloadDocument&&typeof e.href=="string")try{new URL(e.href),e.reloadDocument=!0}catch{}const t=new Headers(e.headers);e.href&&t.get("Location")===null&&t.set("Location",e.href);const n=new Response(null,{status:e.statusCode,headers:t});if(n.options=e,e.throw)throw n;return n}function En(e){return e instanceof Response&&!!e.options}function Tf(e){if(e!==null&&typeof e=="object"&&e.isSerializedRedirect)return eu(e)}function Lf(e){return{input:({url:t})=>{for(const n of e)t=Tl(n,t);return t},output:({url:t})=>{for(let n=e.length-1;n>=0;n--)t=tu(e[n],t);return t}}}function Af(e){const t=Jd(e.basepath),n=`/${t}`,o=`${n}/`,r=e.caseSensitive?n:n.toLowerCase(),i=e.caseSensitive?o:o.toLowerCase();return{input:({url:s})=>{const l=e.caseSensitive?s.pathname:s.pathname.toLowerCase();return l===r?s.pathname="/":l.startsWith(i)&&(s.pathname=s.pathname.slice(n.length)),s},output:({url:s})=>(s.pathname=hs(["/",t,s.pathname]),s)}}function Tl(e,t){const n=e?.input?.({url:t});if(n){if(typeof n=="string")return new URL(n);if(n instanceof URL)return n}return t}function tu(e,t){const n=e?.output?.({url:t});if(n){if(typeof n=="string")return new URL(n);if(n instanceof URL)return n}return t}function Bf(e,t){const{createMutableStore:n,createReadonlyStore:o,batch:r,init:i}=t,s=new Map,l=new Map,a=new Map,c=n(e.status),d=n(e.loadedAt),u=n(e.isLoading),_=n(e.isTransitioning),m=n(e.location),g=n(e.resolvedLocation),v=n(e.statusCode),f=n(e.redirect),p=n([]),k=n([]),P=n([]),R=o(()=>ul(s,p.state)),A=o(()=>ul(l,k.state)),ee=o(()=>ul(a,P.state)),D=o(()=>p.state[0]),K=o(()=>p.state.some(W=>s.get(W)?.state.status==="pending")),te=o(()=>({locationHref:m.state.href,resolvedLocationHref:g.state?.href,status:c.state})),me=o(()=>({status:c.state,loadedAt:d.state,isLoading:u.state,isTransitioning:_.state,matches:R.state,location:m.state,resolvedLocation:g.state,statusCode:v.state,redirect:f.state})),j=bi(64);function ue(W){let B=j.get(W);return B||(B=o(()=>{const Z=p.state;for(const de of Z){const Y=s.get(de);if(Y&&Y.routeId===W)return Y.state}}),j.set(W,B)),B}const be={status:c,loadedAt:d,isLoading:u,isTransitioning:_,location:m,resolvedLocation:g,statusCode:v,redirect:f,matchesId:p,pendingMatchesId:k,cachedMatchesId:P,activeMatchesSnapshot:R,pendingMatchesSnapshot:A,cachedMatchesSnapshot:ee,firstMatchId:D,hasPendingMatches:K,matchRouteReactivity:te,activeMatchStoresById:s,pendingMatchStoresById:l,cachedMatchStoresById:a,__store:me,getMatchStoreByRouteId:ue,setActiveMatches:ye,setPendingMatches:Te,setCachedMatches:_e};ye(e.matches),i?.(be);function ye(W){_l(W,s,p,n,r)}function Te(W){_l(W,l,k,n,r)}function _e(W){_l(W,a,P,n,r)}return be}function ul(e,t){const n=[];for(const o of t){const r=e.get(o);r&&n.push(r.state)}return n}function _l(e,t,n,o,r){const i=e.map(l=>l.id),s=new Set(i);r(()=>{for(const l of t.keys())s.has(l)||t.delete(l);for(const l of e){const a=t.get(l.id);if(!a){const c=o(l);c.routeId=l.routeId,t.set(l.id,c);continue}a.routeId=l.routeId,a.state!==l&&a.setState(()=>l)}rf(n.state,i)||n.setState(()=>i)})}var Ll=e=>{if(!e.rendered)return e.rendered=!0,e.onReady?.()},Of=e=>e.stores.matchesId.state.some(t=>e.stores.activeMatchStoresById.get(t)?.state._forcePending),Fs=(e,t)=>!!(e.preload&&!e.router.stores.activeMatchStoresById.has(t)),ur=(e,t,n=!0)=>{const o={...e.router.options.context??{}},r=n?t:t-1;for(let i=0;i<=r;i++){const s=e.matches[i];if(!s)continue;const l=e.router.getMatch(s.id);l&&Object.assign(o,l.__routeContext,l.__beforeLoadContext)}return o},kc=(e,t)=>{if(!e.matches.length)return;const n=t.routeId,o=e.matches.findIndex(s=>s.routeId===e.router.routeTree.id),r=o>=0?o:0;let i=n?e.matches.findIndex(s=>s.routeId===n):e.firstBadMatchIndex??e.matches.length-1;i<0&&(i=r);for(let s=i;s>=0;s--){const l=e.matches[s];if(e.router.looseRoutesById[l.routeId].options.notFoundComponent)return s}return n?i:r},zo=(e,t,n)=>{if(!(!En(n)&&!xn(n)))throw En(n)&&n.redirectHandled&&!n.options.reloadDocument||(t&&(t._nonReactive.beforeLoadPromise?.resolve(),t._nonReactive.loaderPromise?.resolve(),t._nonReactive.beforeLoadPromise=void 0,t._nonReactive.loaderPromise=void 0,t._nonReactive.error=n,e.updateMatch(t.id,o=>({...o,status:En(n)?"redirected":o.status==="pending"?"success":o.status,context:ur(e,t.index),isFetching:!1,error:n})),xn(n)&&!n.routeId&&(n.routeId=t.routeId),t._nonReactive.loadPromise?.resolve()),En(n)&&(e.rendered=!0,n.options._fromLocation=e.location,n.redirectHandled=!0,n=e.router.resolveRedirect(n))),n},nu=(e,t)=>{const n=e.router.getMatch(t);return!!(!n||n._nonReactive.dehydrated)},Cc=(e,t,n)=>{const o=ur(e,n);e.updateMatch(t,r=>({...r,context:o}))},ii=(e,t,n,o)=>{const{id:r,routeId:i}=e.matches[t],s=e.router.looseRoutesById[i];if(n instanceof Promise)throw n;n.routerCode=o,e.firstBadMatchIndex??=t,zo(e,e.router.getMatch(r),n);try{s.options.onError?.(n)}catch(l){n=l,zo(e,e.router.getMatch(r),n)}e.updateMatch(r,l=>(l._nonReactive.beforeLoadPromise?.resolve(),l._nonReactive.beforeLoadPromise=void 0,l._nonReactive.loadPromise?.resolve(),{...l,error:n,status:"error",isFetching:!1,updatedAt:Date.now(),abortController:new AbortController})),!e.preload&&!En(n)&&!xn(n)&&(e.serialError??=n)},ou=(e,t,n,o)=>{if(o._nonReactive.pendingTimeout!==void 0)return;const r=n.options.pendingMs??e.router.options.defaultPendingMs;if(e.onReady&&!Fs(e,t)&&(n.options.loader||n.options.beforeLoad||iu(n))&&typeof r=="number"&&r!==1/0&&(n.options.pendingComponent??e.router.options?.defaultPendingComponent)){const i=setTimeout(()=>{Ll(e)},r);o._nonReactive.pendingTimeout=i}},Df=(e,t,n)=>{const o=e.router.getMatch(t);if(!o._nonReactive.beforeLoadPromise&&!o._nonReactive.loaderPromise)return;ou(e,t,n,o);const r=()=>{const i=e.router.getMatch(t);i.preload&&(i.status==="redirected"||i.status==="notFound")&&zo(e,i,i.error)};return o._nonReactive.beforeLoadPromise?o._nonReactive.beforeLoadPromise.then(r):r()},Ff=(e,t,n,o)=>{const r=e.router.getMatch(t);let i=r._nonReactive.loadPromise;r._nonReactive.loadPromise=hr(()=>{i?.resolve(),i=void 0});const{paramsError:s,searchError:l}=r;s&&ii(e,n,s,"PARSE_PARAMS"),l&&ii(e,n,l,"VALIDATE_SEARCH"),ou(e,t,o,r);const a=new AbortController;let c=!1;const d=()=>{c||(c=!0,e.updateMatch(t,R=>({...R,isFetching:"beforeLoad",fetchCount:R.fetchCount+1,abortController:a})))},u=()=>{r._nonReactive.beforeLoadPromise?.resolve(),r._nonReactive.beforeLoadPromise=void 0,e.updateMatch(t,R=>({...R,isFetching:!1}))};if(!o.options.beforeLoad){e.router.batch(()=>{d(),u()});return}r._nonReactive.beforeLoadPromise=hr();const _={...ur(e,n,!1),...r.__routeContext},{search:m,params:g,cause:v}=r,f=Fs(e,t),p={search:m,abortController:a,params:g,preload:f,context:_,location:e.location,navigate:R=>e.router.navigate({...R,_fromLocation:e.location}),buildLocation:e.router.buildLocation,cause:f?"preload":v,matches:e.matches,routeId:o.id,...e.router.options.additionalContext},k=R=>{if(R===void 0){e.router.batch(()=>{d(),u()});return}(En(R)||xn(R))&&(d(),ii(e,n,R,"BEFORE_LOAD")),e.router.batch(()=>{d(),e.updateMatch(t,A=>({...A,__beforeLoadContext:R})),u()})};let P;try{if(P=o.options.beforeLoad(p),xi(P))return d(),P.catch(R=>{ii(e,n,R,"BEFORE_LOAD")}).then(k)}catch(R){d(),ii(e,n,R,"BEFORE_LOAD")}k(P)},Nf=(e,t)=>{const{id:n,routeId:o}=e.matches[t],r=e.router.looseRoutesById[o],i=()=>l(),s=()=>Ff(e,n,t,r),l=()=>{if(nu(e,n))return;const a=Df(e,n,r);return xi(a)?a.then(s):s()};return i()},zf=(e,t,n)=>{const o=e.router.getMatch(t);if(!o||!n.options.head&&!n.options.scripts&&!n.options.headers)return;const r={ssr:e.router.options.ssr,matches:e.matches,match:o,params:o.params,loaderData:o.loaderData};return Promise.all([n.options.head?.(r),n.options.scripts?.(r),n.options.headers?.(r)]).then(([i,s,l])=>({meta:i?.meta,links:i?.links,headScripts:i?.scripts,headers:l,scripts:s,styles:i?.styles}))},ru=(e,t,n,o,r)=>{const i=t[o-1],{params:s,loaderDeps:l,abortController:a,cause:c}=e.router.getMatch(n),d=ur(e,o),u=Fs(e,n);return{params:s,deps:l,preload:!!u,parentMatchPromise:i,abortController:a,context:d,location:e.location,navigate:_=>e.router.navigate({..._,_fromLocation:e.location}),cause:u?"preload":c,route:r,...e.router.options.additionalContext}},Mc=async(e,t,n,o,r)=>{try{const i=e.router.getMatch(n);try{(!(Kh??e.router.isServer)||i.ssr===!0)&&vi(r);const s=r.options.loader,l=typeof s=="function"?s:s?.handler,a=l?.(ru(e,t,n,o,r)),c=!!l&&xi(a);if((c||r._lazyPromise||r._componentsPromise||r.options.head||r.options.scripts||r.options.headers||i._nonReactive.minPendingPromise)&&e.updateMatch(n,u=>({...u,isFetching:"loader"})),l){const u=c?await a:a;zo(e,e.router.getMatch(n),u),u!==void 0&&e.updateMatch(n,_=>({..._,loaderData:u}))}r._lazyPromise&&await r._lazyPromise;const d=i._nonReactive.minPendingPromise;d&&await d,r._componentsPromise&&await r._componentsPromise,e.updateMatch(n,u=>({...u,error:void 0,context:ur(e,o),status:"success",isFetching:!1,updatedAt:Date.now()}))}catch(s){let l=s;if(l?.name==="AbortError"){if(i.abortController.signal.aborted){i._nonReactive.loaderPromise?.resolve(),i._nonReactive.loaderPromise=void 0;return}e.updateMatch(n,c=>({...c,status:c.status==="pending"?"success":c.status,isFetching:!1,context:ur(e,o)}));return}const a=i._nonReactive.minPendingPromise;a&&await a,xn(s)&&await r.options.notFoundComponent?.preload?.(),zo(e,e.router.getMatch(n),s);try{r.options.onError?.(s)}catch(c){l=c,zo(e,e.router.getMatch(n),c)}!En(l)&&!xn(l)&&await vi(r,["errorComponent"]),e.updateMatch(n,c=>({...c,error:l,context:ur(e,o),status:"error",isFetching:!1}))}}catch(i){const s=e.router.getMatch(n);s&&(s._nonReactive.loaderPromise=void 0),zo(e,s,i)}},Hf=async(e,t,n)=>{async function o(m,g,v,f,p){const k=Date.now()-g.updatedAt,P=m?p.options.preloadStaleTime??e.router.options.defaultPreloadStaleTime??3e4:p.options.staleTime??e.router.options.defaultStaleTime??0,R=p.options.shouldReload,A=typeof R=="function"?R(ru(e,t,r,n,p)):R,{status:ee,invalid:D}=f,K=k>=P&&(!!e.forceStaleReload||f.cause==="enter"||v!==void 0&&v!==f.id);s=ee==="success"&&(D||(A??K)),m&&p.options.preload===!1||(s&&!e.sync&&d?(l=!0,(async()=>{try{await Mc(e,t,r,n,p);const te=e.router.getMatch(r);te._nonReactive.loaderPromise?.resolve(),te._nonReactive.loadPromise?.resolve(),te._nonReactive.loaderPromise=void 0,te._nonReactive.loadPromise=void 0}catch(te){En(te)&&await e.router.navigate(te.options)}})()):ee!=="success"||s?await Mc(e,t,r,n,p):Cc(e,r,n))}const{id:r,routeId:i}=e.matches[n];let s=!1,l=!1;const a=e.router.looseRoutesById[i],c=a.options.loader,d=((typeof c=="function"?void 0:c?.staleReloadMode)??e.router.options.defaultStaleReloadMode)!=="blocking";if(nu(e,r)){if(!e.router.getMatch(r))return e.matches[n];Cc(e,r,n)}else{const m=e.router.getMatch(r),g=e.router.stores.matchesId.state[n],v=(g&&e.router.stores.activeMatchStoresById.get(g)||null)?.routeId===i?g:e.router.stores.activeMatchesSnapshot.state.find(p=>p.routeId===i)?.id,f=Fs(e,r);if(m._nonReactive.loaderPromise){if(m.status==="success"&&!e.sync&&!m.preload&&d)return m;await m._nonReactive.loaderPromise;const p=e.router.getMatch(r),k=p._nonReactive.error||p.error;k&&zo(e,p,k),p.status==="pending"&&await o(f,m,v,p,a)}else{const p=f&&!e.router.stores.activeMatchStoresById.has(r),k=e.router.getMatch(r);k._nonReactive.loaderPromise=hr(),p!==k.preload&&e.updateMatch(r,P=>({...P,preload:p})),await o(f,m,v,k,a)}}const u=e.router.getMatch(r);l||(u._nonReactive.loaderPromise?.resolve(),u._nonReactive.loadPromise?.resolve(),u._nonReactive.loadPromise=void 0),clearTimeout(u._nonReactive.pendingTimeout),u._nonReactive.pendingTimeout=void 0,l||(u._nonReactive.loaderPromise=void 0),u._nonReactive.dehydrated=void 0;const _=l?u.isFetching:!1;return _!==u.isFetching||u.invalid!==!1?(e.updateMatch(r,m=>({...m,isFetching:_,invalid:!1})),e.router.getMatch(r)):u};async function Ic(e){const t=e,n=[];Of(t.router)&&Ll(t);let o;for(let _=0;_<t.matches.length;_++){try{const m=Nf(t,_);xi(m)&&await m}catch(m){if(En(m))throw m;if(xn(m))o=m;else if(!t.preload)throw m;break}if(t.serialError)break}const r=t.firstBadMatchIndex??t.matches.length,i=o&&!t.preload?kc(t,o):void 0,s=o&&t.preload?0:i!==void 0?Math.min(i+1,r):r;let l,a;for(let _=0;_<s;_++)n.push(Hf(t,n,_));try{await Promise.all(n)}catch{const _=await Promise.allSettled(n);for(const m of _){if(m.status!=="rejected")continue;const g=m.reason;if(En(g))throw g;xn(g)?l??=g:a??=g}if(a!==void 0)throw a}const c=l??(o&&!t.preload?o:void 0);let d=t.serialError?t.firstBadMatchIndex??0:t.matches.length-1;if(!c&&o&&t.preload)return t.matches;if(c){const _=kc(t,c);_===void 0&&Zn();const m=t.matches[_],g=t.router.looseRoutesById[m.routeId],v=t.router.options?.defaultNotFoundComponent;!g.options.notFoundComponent&&v&&(g.options.notFoundComponent=v),c.routeId=m.routeId;const f=m.routeId===t.router.routeTree.id;t.updateMatch(m.id,p=>({...p,...f?{status:"success",globalNotFound:!0,error:void 0}:{status:"notFound",error:c},isFetching:!1})),d=_,await vi(g,["notFoundComponent"])}else if(!t.preload){const _=t.matches[0];_.globalNotFound||t.router.getMatch(_.id)?.globalNotFound&&t.updateMatch(_.id,m=>({...m,globalNotFound:!1,error:void 0}))}if(t.serialError&&t.firstBadMatchIndex!==void 0){const _=t.router.looseRoutesById[t.matches[t.firstBadMatchIndex].routeId];await vi(_,["errorComponent"])}for(let _=0;_<=d;_++){const{id:m,routeId:g}=t.matches[_],v=t.router.looseRoutesById[g];try{const f=zf(t,m,v);if(f){const p=await f;t.updateMatch(m,k=>({...k,...p}))}}catch(f){console.error(`Error executing head for route ${g}:`,f)}}const u=Ll(t);if(xi(u)&&await u,c)throw c;if(t.serialError&&!t.preload&&!t.onReady)throw t.serialError;return t.matches}function Rc(e,t){const n=t.map(o=>e.options[o]?.preload?.()).filter(Boolean);if(n.length!==0)return Promise.all(n)}function vi(e,t=fs){!e._lazyLoaded&&e._lazyPromise===void 0&&(e.lazyFn?e._lazyPromise=e.lazyFn().then(o=>{const{id:r,...i}=o.options;Object.assign(e.options,i),e._lazyLoaded=!0,e._lazyPromise=void 0}):e._lazyLoaded=!0);const n=()=>e._componentsLoaded?void 0:t===fs?(()=>{if(e._componentsPromise===void 0){const o=Rc(e,fs);o?e._componentsPromise=o.then(()=>{e._componentsLoaded=!0,e._componentsPromise=void 0}):e._componentsLoaded=!0}return e._componentsPromise})():Rc(e,t);return e._lazyPromise?e._lazyPromise.then(n):n()}function iu(e){for(const t of fs)if(e.options[t]?.preload)return!0;return!1}var fs=["component","errorComponent","pendingComponent","notFoundComponent"],jo="__TSR_index",Pc="popstate",Ec="beforeunload";function jf(e){let t=e.getLocation();const n=new Set,o=s=>{t=e.getLocation(),n.forEach(l=>l({location:t,action:s}))},r=s=>{e.notifyOnIndexChange??!0?o(s):t=e.getLocation()},i=async({task:s,navigateOpts:l,...a})=>{if(l?.ignoreBlocker??!1){s();return}const c=e.getBlockers?.()??[],d=a.type==="PUSH"||a.type==="REPLACE";if(typeof document<"u"&&c.length&&d)for(const u of c){const _=Ms(a.path,a.state);if(await u.blockerFn({currentLocation:t,nextLocation:_,action:a.type})){e.onBlocked?.();return}}s()};return{get location(){return t},get length(){return e.getLength()},subscribers:n,subscribe:s=>(n.add(s),()=>{n.delete(s)}),push:(s,l,a)=>{const c=t.state[jo];l=Tc(c+1,l),i({task:()=>{e.pushState(s,l),o({type:"PUSH"})},navigateOpts:a,type:"PUSH",path:s,state:l})},replace:(s,l,a)=>{const c=t.state[jo];l=Tc(c,l),i({task:()=>{e.replaceState(s,l),o({type:"REPLACE"})},navigateOpts:a,type:"REPLACE",path:s,state:l})},go:(s,l)=>{i({task:()=>{e.go(s),r({type:"GO",index:s})},navigateOpts:l,type:"GO"})},back:s=>{i({task:()=>{e.back(s?.ignoreBlocker??!1),r({type:"BACK"})},navigateOpts:s,type:"BACK"})},forward:s=>{i({task:()=>{e.forward(s?.ignoreBlocker??!1),r({type:"FORWARD"})},navigateOpts:s,type:"FORWARD"})},canGoBack:()=>t.state[jo]!==0,createHref:s=>e.createHref(s),block:s=>{if(!e.setBlockers)return()=>{};const l=e.getBlockers?.()??[];return e.setBlockers([...l,s]),()=>{const a=e.getBlockers?.()??[];e.setBlockers?.(a.filter(c=>c!==s))}},flush:()=>e.flush?.(),destroy:()=>e.destroy?.(),notify:o}}function Tc(e,t){t||(t={});const n=Kl();return{...t,key:n,__TSR_key:n,[jo]:e}}function Uf(e){const t=typeof document<"u"?window:void 0,n=t.history.pushState,o=t.history.replaceState;let r=[];const i=()=>r,s=K=>r=K,l=(K=>K),a=(()=>Ms(`${t.location.pathname}${t.location.search}${t.location.hash}`,t.history.state));if(!t.history.state?.__TSR_key&&!t.history.state?.key){const K=Kl();t.history.replaceState({[jo]:0,key:K,__TSR_key:K},"")}let c=a(),d,u=!1,_=!1,m=!1,g=!1;const v=()=>c;let f,p;const k=()=>{f&&(D._ignoreSubscribers=!0,(f.isPush?t.history.pushState:t.history.replaceState)(f.state,"",f.href),D._ignoreSubscribers=!1,f=void 0,p=void 0,d=void 0)},P=(K,te,me)=>{const j=l(te);p||(d=c),c=Ms(te,me),f={href:j,state:me,isPush:f?.isPush||K==="push"},p||(p=Promise.resolve().then(()=>k()))},R=K=>{c=a(),D.notify({type:K})},A=async()=>{if(_){_=!1;return}const K=a(),te=K.state[jo]-c.state[jo],me=te===1,j=te===-1,ue=!me&&!j||u;u=!1;const be=ue?"GO":j?"BACK":"FORWARD",ye=ue?{type:"GO",index:te}:{type:j?"BACK":"FORWARD"};if(m)m=!1;else{const Te=i();if(typeof document<"u"&&Te.length){for(const _e of Te)if(await _e.blockerFn({currentLocation:c,nextLocation:K,action:be})){_=!0,t.history.go(1),D.notify(ye);return}}}c=a(),D.notify(ye)},ee=K=>{if(g){g=!1;return}let te=!1;const me=i();if(typeof document<"u"&&me.length)for(const j of me){const ue=j.enableBeforeUnload??!0;if(ue===!0){te=!0;break}if(typeof ue=="function"&&ue()===!0){te=!0;break}}if(te)return K.preventDefault(),K.returnValue=""},D=jf({getLocation:v,getLength:()=>t.history.length,pushState:(K,te)=>P("push",K,te),replaceState:(K,te)=>P("replace",K,te),back:K=>(K&&(m=!0),g=!0,t.history.back()),forward:K=>{K&&(m=!0),g=!0,t.history.forward()},go:K=>{u=!0,t.history.go(K)},createHref:K=>l(K),flush:k,destroy:()=>{t.history.pushState=n,t.history.replaceState=o,t.removeEventListener(Ec,ee,{capture:!0}),t.removeEventListener(Pc,A)},onBlocked:()=>{d&&c!==d&&(c=d)},getBlockers:i,setBlockers:s,notifyOnIndexChange:!1});return t.addEventListener(Ec,ee,{capture:!0}),t.addEventListener(Pc,A),t.history.pushState=function(...K){const te=n.apply(t.history,K);return D._ignoreSubscribers||R("PUSH"),te},t.history.replaceState=function(...K){const te=o.apply(t.history,K);return D._ignoreSubscribers||R("REPLACE"),te},D}function Wf(e){let t=e.replace(/[\x00-\x1f\x7f]/g,"");return t.startsWith("//")&&(t="/"+t.replace(/^\/+/,"")),t}function Ms(e,t){const n=Wf(e),o=n.indexOf("#"),r=n.indexOf("?"),i=Kl();return{href:n,pathname:n.substring(0,o>0?r>0?Math.min(o,r):o:r>0?r:n.length),hash:o>-1?n.substring(o):"",search:r>-1?n.slice(r,o===-1?void 0:o):"",state:t||{[jo]:0,key:i,__TSR_key:i}}}function Kl(){return(Math.random()+1).toString(36).substring(7)}function Er(e,t){const n=t,o=e;return{fromLocation:n,toLocation:o,pathChanged:n?.pathname!==o.pathname,hrefChanged:n?.href!==o.href,hashChanged:n?.hash!==o.hash}}var Yf=class{constructor(e,t){this.tempLocationKey=`${Math.round(Math.random()*1e7)}`,this.resetNextScroll=!0,this.shouldViewTransition=void 0,this.isViewTransitionTypesSupported=void 0,this.subscribers=new Set,this.isScrollRestoring=!1,this.isScrollRestorationSetup=!1,this.startTransition=n=>n(),this.update=n=>{const o=this.options,r=this.basepath??o?.basepath??"/",i=this.basepath===void 0,s=o?.rewrite;if(this.options={...o,...n},this.isServer=this.options.isServer??typeof document>"u",this.protocolAllowlist=new Set(this.options.protocolAllowlist),this.options.pathParamsAllowedCharacters&&(this.pathParamsDecoder=yf(this.options.pathParamsAllowedCharacters)),(!this.history||this.options.history&&this.options.history!==this.history)&&(this.options.history?this.history=this.options.history:this.history=Uf()),this.origin=this.options.origin,this.origin||(window?.origin&&window.origin!=="null"?this.origin=window.origin:this.origin="http://localhost"),this.history&&this.updateLatestLocation(),this.options.routeTree!==this.routeTree){this.routeTree=this.options.routeTree;let d;this.resolvePathCache=bi(1e3),d=this.buildRouteTree(),this.setRoutes(d)}if(!this.stores&&this.latestLocation){const d=this.getStoreConfig(this);this.batch=d.batch,this.stores=Bf(Xf(this.latestLocation),d),kf(this)}let l=!1;const a=this.options.basepath??"/",c=this.options.rewrite;if(i||r!==a||s!==c){this.basepath=a;const d=[],u=Jd(a);u&&u!=="/"&&d.push(Af({basepath:a})),c&&d.push(c),this.rewrite=d.length===0?void 0:d.length===1?d[0]:Lf(d),this.history&&this.updateLatestLocation(),l=!0}l&&this.stores&&this.stores.location.setState(()=>this.latestLocation),typeof window<"u"&&"CSS"in window&&typeof window.CSS?.supports=="function"&&(this.isViewTransitionTypesSupported=window.CSS.supports("selector(:active-view-transition-type(a)"))},this.updateLatestLocation=()=>{this.latestLocation=this.parseLocation(this.history.location,this.latestLocation)},this.buildRouteTree=()=>{const n=_f(this.routeTree,this.options.caseSensitive,(o,r)=>{o.init({originalIndex:r})});return this.options.routeMasks&&lf(this.options.routeMasks,n.processedTree),n},this.subscribe=(n,o)=>{const r={eventType:n,fn:o};return this.subscribers.add(r),()=>{this.subscribers.delete(r)}},this.emit=n=>{this.subscribers.forEach(o=>{o.eventType===n.type&&o.fn(n)})},this.parseLocation=(n,o)=>{const r=({pathname:a,search:c,hash:d,href:u,state:_})=>{if(!this.rewrite&&!/[ \x00-\x1f\x7f\u0080-\uffff]/.test(a)){const p=this.options.parseSearch(c),k=this.options.stringifySearch(p);return{href:a+k+d,publicHref:u,pathname:oi(a).path,external:!1,searchStr:k,search:Jo(o?.search,p),hash:oi(d.slice(1)).path,state:rr(o?.state,_)}}const m=new URL(u,this.origin),g=Tl(this.rewrite,m),v=this.options.parseSearch(g.search),f=this.options.stringifySearch(v);return g.search=f,{href:g.href.replace(g.origin,""),publicHref:u,pathname:oi(g.pathname).path,external:!!this.rewrite&&g.origin!==this.origin,searchStr:f,search:Jo(o?.search,v),hash:oi(g.hash.slice(1)).path,state:rr(o?.state,_)}},i=r(n),{__tempLocation:s,__tempKey:l}=i.state;if(s&&(!l||l===this.tempLocationKey)){const a=r(s);return a.state.key=i.state.key,a.state.__TSR_key=i.state.__TSR_key,delete a.state.__tempLocation,{...a,maskedLocation:i}}return i},this.resolvePathWithBase=(n,o)=>pf({base:n,to:Ql(o),trailingSlash:this.options.trailingSlash,cache:this.resolvePathCache}),this.matchRoutes=(n,o,r)=>typeof n=="string"?this.matchRoutesInternal({pathname:n,search:o},r):this.matchRoutesInternal(n,o),this.getMatchedRoutes=n=>qf({pathname:n,routesById:this.routesById,processedTree:this.processedTree}),this.cancelMatch=n=>{const o=this.getMatch(n);o&&(o.abortController.abort(),clearTimeout(o._nonReactive.pendingTimeout),o._nonReactive.pendingTimeout=void 0)},this.cancelMatches=()=>{this.stores.pendingMatchesId.state.forEach(n=>{this.cancelMatch(n)}),this.stores.matchesId.state.forEach(n=>{if(this.stores.pendingMatchStoresById.has(n))return;const o=this.stores.activeMatchStoresById.get(n)?.state;o&&(o.status==="pending"||o.isFetching==="loader")&&this.cancelMatch(n)})},this.buildLocation=n=>{const o=(i={})=>{const s=i._fromLocation||this.pendingBuiltLocation||this.latestLocation,l=this.matchRoutesLightweight(s);i.from;const a=i.unsafeRelative==="path"?s.pathname:i.from??l.fullPath,c=this.resolvePathWithBase(a,"."),d=l.search,u=Object.assign(Object.create(null),l.params),_=i.to?this.resolvePathWithBase(c,`${i.to}`):this.resolvePathWithBase(c,"."),m=i.params===!1||i.params===null?Object.create(null):(i.params??!0)===!0?u:Object.assign(u,No(i.params,u)),g=this.getMatchedRoutes(_);let v=g.matchedRoutes;if((!g.foundRoute||g.foundRoute.path!=="/"&&g.routeParams["**"])&&this.options.notFoundRoute&&(v=[...v,this.options.notFoundRoute]),Object.keys(m).length>0)for(const me of v){const j=me.options.params?.stringify??me.options.stringifyParams;if(j)try{Object.assign(m,j(m))}catch{}}const f=n.leaveParams?_:oi($c({path:_,params:m,decoder:this.pathParamsDecoder,server:this.isServer}).interpolatedPath).path;let p=d;if(n._includeValidateSearch&&this.options.search?.strict){const me={};v.forEach(j=>{if(j.options.validateSearch)try{Object.assign(me,gs(j.options.validateSearch,{...me,...p}))}catch{}}),p=me}p=Qf({search:p,dest:i,destRoutes:v,_includeValidateSearch:n._includeValidateSearch}),p=Jo(d,p);const k=this.options.stringifySearch(p),P=i.hash===!0?s.hash:i.hash?No(i.hash,s.hash):void 0,R=P?`#${P}`:"";let A=i.state===!0?s.state:i.state?No(i.state,s.state):{};A=rr(s.state,A);const ee=`${f}${k}${R}`;let D,K,te=!1;if(this.rewrite){const me=new URL(ee,this.origin),j=tu(this.rewrite,me);D=me.href.replace(me.origin,""),j.origin!==this.origin?(K=j.href,te=!0):K=j.pathname+j.search+j.hash}else D=of(ee),K=D;return{publicHref:K,href:D,pathname:f,search:p,searchStr:k,state:A,hash:P??"",external:te,unmaskOnReload:i.unmaskOnReload}},r=(i={},s)=>{const l=o(i);let a=s?o(s):void 0;if(!a){const c=Object.create(null);if(this.options.routeMasks){const d=af(l.pathname,this.processedTree);if(d){Object.assign(c,d.rawParams);const{from:u,params:_,...m}=d.route,g=_===!1||_===null?Object.create(null):(_??!0)===!0?c:Object.assign(c,No(_,c));s={from:n.from,...m,params:g},a=o(s)}}}return a&&(l.maskedLocation=a),l};return n.mask?r(n,{from:n.from,...n.mask}):r(n)},this.commitLocation=async({viewTransition:n,ignoreBlocker:o,...r})=>{const i=()=>{const a=["key","__TSR_key","__TSR_index","__hashScrollIntoViewOptions"];a.forEach(d=>{r.state[d]=this.latestLocation.state[d]});const c=dr(r.state,this.latestLocation.state);return a.forEach(d=>{delete r.state[d]}),c},s=Ho(this.latestLocation.href)===Ho(r.href);let l=this.commitLocationPromise;if(this.commitLocationPromise=hr(()=>{l?.resolve(),l=void 0}),s&&i())this.load();else{let{maskedLocation:a,hashScrollIntoView:c,...d}=r;a&&(d={...a,state:{...a.state,__tempKey:void 0,__tempLocation:{...d,search:d.searchStr,state:{...d.state,__tempKey:void 0,__tempLocation:void 0,__TSR_key:void 0,key:void 0}}}},(d.unmaskOnReload??this.options.unmaskOnReload??!1)&&(d.state.__tempKey=this.tempLocationKey)),d.state.__hashScrollIntoViewOptions=c??this.options.defaultHashScrollIntoView??!0,this.shouldViewTransition=n,this.history[r.replace?"replace":"push"](d.publicHref,d.state,{ignoreBlocker:o})}return this.resetNextScroll=r.resetScroll??!0,this.history.subscribers.size||this.load(),this.commitLocationPromise},this.buildAndCommitLocation=({replace:n,resetScroll:o,hashScrollIntoView:r,viewTransition:i,ignoreBlocker:s,href:l,...a}={})=>{if(l){const u=this.history.location.state.__TSR_index,_=Ms(l,{__TSR_index:n?u:u+1}),m=new URL(_.pathname,this.origin);a.to=Tl(this.rewrite,m).pathname,a.search=this.options.parseSearch(_.search),a.hash=_.hash.slice(1)}const c=this.buildLocation({...a,_includeValidateSearch:!0});this.pendingBuiltLocation=c;const d=this.commitLocation({...c,viewTransition:i,replace:n,resetScroll:o,hashScrollIntoView:r,ignoreBlocker:s});return Promise.resolve().then(()=>{this.pendingBuiltLocation===c&&(this.pendingBuiltLocation=void 0)}),d},this.navigate=async({to:n,reloadDocument:o,href:r,publicHref:i,...s})=>{let l=!1;if(r)try{new URL(`${r}`),l=!0}catch{}if(l&&!o&&(o=!0),o){if(n!==void 0||!r){const c=this.buildLocation({to:n,...s});r=r??c.publicHref,i=i??c.publicHref}const a=!l&&i?i:r;if(Ss(a,this.protocolAllowlist))return Promise.resolve();if(!s.ignoreBlocker){const c=this.history.getBlockers?.()??[];for(const d of c)if(d?.blockerFn&&await d.blockerFn({currentLocation:this.latestLocation,nextLocation:this.latestLocation,action:"PUSH"}))return Promise.resolve()}return s.replace?window.location.replace(a):window.location.href=a,Promise.resolve()}return this.buildAndCommitLocation({...s,href:r,to:n,_isNavigate:!0})},this.beforeLoad=()=>{this.cancelMatches(),this.updateLatestLocation();const n=this.matchRoutes(this.latestLocation),o=this.stores.cachedMatchesSnapshot.state.filter(r=>!n.some(i=>i.id===r.id));this.batch(()=>{this.stores.status.setState(()=>"pending"),this.stores.statusCode.setState(()=>200),this.stores.isLoading.setState(()=>!0),this.stores.location.setState(()=>this.latestLocation),this.stores.setPendingMatches(n),this.stores.setCachedMatches(o)})},this.load=async n=>{let o,r,i;const s=this.stores.resolvedLocation.state??this.stores.location.state;for(i=new Promise(a=>{this.startTransition(async()=>{try{this.beforeLoad();const c=this.latestLocation,d=this.stores.resolvedLocation.state,u=Er(c,d);this.stores.redirect.state||this.emit({type:"onBeforeNavigate",...u}),this.emit({type:"onBeforeLoad",...u}),await Ic({router:this,sync:n?.sync,forceStaleReload:s.href===c.href,matches:this.stores.pendingMatchesSnapshot.state,location:c,updateMatch:this.updateMatch,onReady:async()=>{this.startTransition(()=>{this.startViewTransition(async()=>{let _=null,m=null,g=null,v=null;this.batch(()=>{const f=this.stores.pendingMatchesSnapshot.state,p=f.length,k=this.stores.activeMatchesSnapshot.state;_=p?k.filter(A=>!this.stores.pendingMatchStoresById.has(A.id)):null;const P=new Set;for(const A of this.stores.pendingMatchStoresById.values())A.routeId&&P.add(A.routeId);const R=new Set;for(const A of this.stores.activeMatchStoresById.values())A.routeId&&R.add(A.routeId);m=p?k.filter(A=>!P.has(A.routeId)):null,g=p?f.filter(A=>!R.has(A.routeId)):null,v=p?f.filter(A=>R.has(A.routeId)):k,this.stores.isLoading.setState(()=>!1),this.stores.loadedAt.setState(()=>Date.now()),p&&(this.stores.setActiveMatches(f),this.stores.setPendingMatches([]),this.stores.setCachedMatches([...this.stores.cachedMatchesSnapshot.state,..._.filter(A=>A.status!=="error"&&A.status!=="notFound"&&A.status!=="redirected")]),this.clearExpiredCache())});for(const[f,p]of[[m,"onLeave"],[g,"onEnter"],[v,"onStay"]])if(f)for(const k of f)this.looseRoutesById[k.routeId].options[p]?.(k)})})}})}catch(c){En(c)?(o=c,this.navigate({...o.options,replace:!0,ignoreBlocker:!0})):xn(c)&&(r=c);const d=o?o.status:r?404:this.stores.activeMatchesSnapshot.state.some(u=>u.status==="error")?500:200;this.batch(()=>{this.stores.statusCode.setState(()=>d),this.stores.redirect.setState(()=>o)})}this.latestLoadPromise===i&&(this.commitLocationPromise?.resolve(),this.latestLoadPromise=void 0,this.commitLocationPromise=void 0),a()})}),this.latestLoadPromise=i,await i;this.latestLoadPromise&&i!==this.latestLoadPromise;)await this.latestLoadPromise;let l;this.hasNotFoundMatch()?l=404:this.stores.activeMatchesSnapshot.state.some(a=>a.status==="error")&&(l=500),l!==void 0&&this.stores.statusCode.setState(()=>l)},this.startViewTransition=n=>{const o=this.shouldViewTransition??this.options.defaultViewTransition;if(this.shouldViewTransition=void 0,o&&typeof document<"u"&&"startViewTransition"in document&&typeof document.startViewTransition=="function"){let r;if(typeof o=="object"&&this.isViewTransitionTypesSupported){const i=this.latestLocation,s=this.stores.resolvedLocation.state,l=typeof o.types=="function"?o.types(Er(i,s)):o.types;if(l===!1){n();return}r={update:n,types:l}}else r=n;document.startViewTransition(r)}else n()},this.updateMatch=(n,o)=>{this.startTransition(()=>{const r=this.stores.pendingMatchStoresById.get(n);if(r){r.setState(o);return}const i=this.stores.activeMatchStoresById.get(n);if(i){i.setState(o);return}const s=this.stores.cachedMatchStoresById.get(n);if(s){const l=o(s.state);l.status==="redirected"?this.stores.cachedMatchStoresById.delete(n)&&this.stores.cachedMatchesId.setState(a=>a.filter(c=>c!==n)):s.setState(()=>l)}})},this.getMatch=n=>this.stores.cachedMatchStoresById.get(n)?.state??this.stores.pendingMatchStoresById.get(n)?.state??this.stores.activeMatchStoresById.get(n)?.state,this.invalidate=n=>{const o=r=>n?.filter?.(r)??!0?{...r,invalid:!0,...n?.forcePending||r.status==="error"||r.status==="notFound"?{status:"pending",error:void 0}:void 0}:r;return this.batch(()=>{this.stores.setActiveMatches(this.stores.activeMatchesSnapshot.state.map(o)),this.stores.setCachedMatches(this.stores.cachedMatchesSnapshot.state.map(o)),this.stores.setPendingMatches(this.stores.pendingMatchesSnapshot.state.map(o))}),this.shouldViewTransition=!1,this.load({sync:n?.sync})},this.getParsedLocationHref=n=>n.publicHref||"/",this.resolveRedirect=n=>{const o=n.headers.get("Location");if(!n.options.href||n.options._builtLocation){const r=n.options._builtLocation??this.buildLocation(n.options),i=this.getParsedLocationHref(r);n.options.href=i,n.headers.set("Location",i)}else if(o)try{const r=new URL(o);if(this.origin&&r.origin===this.origin){const i=r.pathname+r.search+r.hash;n.options.href=i,n.headers.set("Location",i)}}catch{}if(n.options.href&&!n.options._builtLocation&&Ss(n.options.href,this.protocolAllowlist))throw new Error("Redirect blocked: unsafe protocol");return n.headers.get("Location")||n.headers.set("Location",n.options.href),n},this.clearCache=n=>{const o=n?.filter;o!==void 0?this.stores.setCachedMatches(this.stores.cachedMatchesSnapshot.state.filter(r=>!o(r))):this.stores.setCachedMatches([])},this.clearExpiredCache=()=>{const n=Date.now(),o=r=>{const i=this.looseRoutesById[r.routeId];if(!i.options.loader)return!0;const s=(r.preload?i.options.preloadGcTime??this.options.defaultPreloadGcTime:i.options.gcTime??this.options.defaultGcTime)??300*1e3;return r.status==="error"?!0:n-r.updatedAt>=s};this.clearCache({filter:o})},this.loadRouteChunk=vi,this.preloadRoute=async n=>{const o=n._builtLocation??this.buildLocation(n);let r=this.matchRoutes(o,{throwOnError:!0,preload:!0,dest:n});const i=new Set([...this.stores.matchesId.state,...this.stores.pendingMatchesId.state]),s=new Set([...i,...this.stores.cachedMatchesId.state]),l=r.filter(a=>!s.has(a.id));if(l.length){const a=this.stores.cachedMatchesSnapshot.state;this.stores.setCachedMatches([...a,...l])}try{return r=await Ic({router:this,matches:r,location:o,preload:!0,updateMatch:(a,c)=>{i.has(a)?r=r.map(d=>d.id===a?c(d):d):this.updateMatch(a,c)}}),r}catch(a){if(En(a))return a.options.reloadDocument?void 0:await this.preloadRoute({...a.options,_fromLocation:o});xn(a)||console.error(a);return}},this.matchRoute=(n,o)=>{const r={...n,to:n.to?this.resolvePathWithBase(n.from||"",n.to):void 0,params:n.params||{},leaveParams:!0},i=this.buildLocation(r);if(o?.pending&&this.stores.status.state!=="pending")return!1;const s=(o?.pending===void 0?!this.stores.isLoading.state:o.pending)?this.latestLocation:this.stores.resolvedLocation.state||this.stores.location.state,l=cf(i.pathname,o?.caseSensitive??!1,o?.fuzzy??!1,s.pathname,this.processedTree);return!l||n.params&&!dr(l.rawParams,n.params,{partial:!0})?!1:o?.includeSearch??!0?dr(s.search,i.search,{partial:!0})?l.rawParams:!1:l.rawParams},this.hasNotFoundMatch=()=>this.stores.activeMatchesSnapshot.state.some(n=>n.status==="notFound"||n.globalNotFound),this.getStoreConfig=t,this.update({defaultPreloadDelay:50,defaultPendingMs:1e3,defaultPendingMinMs:500,context:void 0,...e,caseSensitive:e.caseSensitive??!1,notFoundMode:e.notFoundMode??"fuzzy",stringifySearch:e.stringifySearch??Rf,parseSearch:e.parseSearch??If,protocolAllowlist:e.protocolAllowlist??nf}),typeof document<"u"&&(self.__TSR_ROUTER__=this)}isShell(){return!!this.options.isShell}isPrerendering(){return!!this.options.isPrerendering}get state(){return this.stores.__store.state}setRoutes({routesById:e,routesByPath:t,processedTree:n}){this.routesById=e,this.routesByPath=t,this.processedTree=n;const o=this.options.notFoundRoute;o&&(o.init({originalIndex:99999999999}),this.routesById[o.id]=o)}get looseRoutesById(){return this.routesById}getParentContext(e){return e?.id?e.context??this.options.context??void 0:this.options.context??void 0}matchRoutesInternal(e,t){const n=this.getMatchedRoutes(e.pathname),{foundRoute:o,routeParams:r,parsedParams:i}=n;let{matchedRoutes:s}=n,l=!1;(o?o.path!=="/"&&r["**"]:Ho(e.pathname))&&(this.options.notFoundRoute?s=[...s,this.options.notFoundRoute]:l=!0);const a=l?Gf(this.options.notFoundMode,s):void 0,c=new Array(s.length),d=new Map;for(const u of this.stores.activeMatchStoresById.values())u.routeId&&d.set(u.routeId,u.state);for(let u=0;u<s.length;u++){const _=s[u],m=c[u-1];let g,v,f;{const be=m?.search??e.search,ye=m?._strictSearch??void 0;try{const Te=gs(_.options.validateSearch,{...be})??void 0;g={...be,...Te},v={...ye,...Te},f=void 0}catch(Te){let _e=Te;if(Te instanceof Is||(_e=new Is(Te.message,{cause:Te})),t?.throwOnError)throw _e;g=be,v={},f=_e}}const p=_.options.loaderDeps?.({search:g})??"",k=p?JSON.stringify(p):"",{interpolatedPath:P,usedParams:R}=$c({path:_.fullPath,params:r,decoder:this.pathParamsDecoder,server:this.isServer}),A=_.id+P+k,ee=this.getMatch(A),D=d.get(_.id),K=ee?._strictParams??R;let te;if(!ee)try{Lc(_,R,i,K)}catch(be){if(xn(be)||En(be)?te=be:te=new Vf(be.message,{cause:be}),t?.throwOnError)throw te}Object.assign(r,K);const me=D?"stay":"enter";let j;if(ee)j={...ee,cause:me,params:D?.params??r,_strictParams:K,search:Jo(D?D.search:ee.search,g),_strictSearch:v};else{const be=_.options.loader||_.options.beforeLoad||_.lazyFn||iu(_)?"pending":"success";j={id:A,ssr:_.options.ssr,index:u,routeId:_.id,params:D?.params??r,_strictParams:K,pathname:P,updatedAt:Date.now(),search:D?Jo(D.search,g):g,_strictSearch:v,searchError:void 0,status:be,isFetching:!1,error:void 0,paramsError:te,__routeContext:void 0,_nonReactive:{loadPromise:hr()},__beforeLoadContext:void 0,context:{},abortController:new AbortController,fetchCount:0,cause:me,loaderDeps:D?rr(D.loaderDeps,p):p,invalid:!1,preload:!1,links:void 0,scripts:void 0,headScripts:void 0,meta:void 0,staticData:_.options.staticData||{},fullPath:_.fullPath}}t?.preload||(j.globalNotFound=a===_.id),j.searchError=f;const ue=this.getParentContext(m);j.context={...ue,...j.__routeContext,...j.__beforeLoadContext},c[u]=j}for(let u=0;u<c.length;u++){const _=c[u],m=this.looseRoutesById[_.routeId],g=this.getMatch(_.id),v=d.get(_.routeId);if(_.params=v?Jo(v.params,r):r,!g){const f=c[u-1],p=this.getParentContext(f);if(m.options.context){const k={deps:_.loaderDeps,params:_.params,context:p??{},location:e,navigate:P=>this.navigate({...P,_fromLocation:e}),buildLocation:this.buildLocation,cause:_.cause,abortController:_.abortController,preload:!!_.preload,matches:c,routeId:m.id};_.__routeContext=m.options.context(k)??void 0}_.context={...p,..._.__routeContext,..._.__beforeLoadContext}}}return c}matchRoutesLightweight(e){const{matchedRoutes:t,routeParams:n,parsedParams:o}=this.getMatchedRoutes(e.pathname),r=yi(t),i={...e.search};for(const d of t)try{Object.assign(i,gs(d.options.validateSearch,i))}catch{}const s=yi(this.stores.matchesId.state),l=s&&this.stores.activeMatchStoresById.get(s)?.state,a=l&&l.routeId===r.id&&l.pathname===e.pathname;let c;if(a)c=l.params;else{const d=Object.assign(Object.create(null),n);for(const u of t)try{Lc(u,n,o??{},d)}catch{}c=d}return{matchedRoutes:t,fullPath:r.fullPath,search:i,params:c}}},Is=class extends Error{},Vf=class extends Error{};function Xf(e){return{loadedAt:0,isLoading:!1,isTransitioning:!1,status:"idle",resolvedLocation:void 0,location:e,matches:[],statusCode:200}}function gs(e,t){if(e==null)return{};if("~standard"in e){const n=e["~standard"].validate(t);if(n instanceof Promise)throw new Is("Async validation not supported");if(n.issues)throw new Is(JSON.stringify(n.issues,void 0,2),{cause:n});return n.value}return"parse"in e?e.parse(t):typeof e=="function"?e(t):{}}function qf({pathname:e,routesById:t,processedTree:n}){const o=Object.create(null),r=Ho(e);let i,s;const l=df(r,n,!0);return l&&(i=l.route,Object.assign(o,l.rawParams),s=Object.assign(Object.create(null),l.parsedParams)),{matchedRoutes:l?.branch||[t.__root__],routeParams:o,foundRoute:i,parsedParams:s}}function Qf({search:e,dest:t,destRoutes:n,_includeValidateSearch:o}){return Kf(n)(e,t,o??!1)}function Kf(e){const t={dest:null,_includeValidateSearch:!1,middlewares:[]};for(const r of e){if("search"in r.options)r.options.search?.middlewares&&t.middlewares.push(...r.options.search.middlewares);else if(r.options.preSearchFilters||r.options.postSearchFilters){const i=({search:s,next:l})=>{let a=s;"preSearchFilters"in r.options&&r.options.preSearchFilters&&(a=r.options.preSearchFilters.reduce((d,u)=>u(d),s));const c=l(a);return"postSearchFilters"in r.options&&r.options.postSearchFilters?r.options.postSearchFilters.reduce((d,u)=>u(d),c):c};t.middlewares.push(i)}if(r.options.validateSearch){const i=({search:s,next:l})=>{const a=l(s);if(!t._includeValidateSearch)return a;try{return{...a,...gs(r.options.validateSearch,a)??void 0}}catch{return a}};t.middlewares.push(i)}}const n=({search:r})=>{const i=t.dest;return i.search?i.search===!0?r:No(i.search,r):{}};t.middlewares.push(n);const o=(r,i,s)=>{if(r>=s.length)return i;const l=s[r];return l({search:i,next:c=>o(r+1,c,s)})};return function(i,s,l){return t.dest=s,t._includeValidateSearch=l,o(0,i,t.middlewares)}}function Gf(e,t){if(e!=="root")for(let n=t.length-1;n>=0;n--){const o=t[n];if(o.children)return o.id}return _o}function Lc(e,t,n,o){const r=e.options.params?.parse??e.options.parseParams;if(r)if(e.options.skipRouteOnParseError)for(const i in t)i in n&&(o[i]=n[i]);else{const i=r(o);Object.assign(o,i)}}var Jf="Error preloading route! ☝️",su=class{get to(){return this._to}get id(){return this._id}get path(){return this._path}get fullPath(){return this._fullPath}constructor(e){if(this.init=t=>{this.originalIndex=t.originalIndex;const n=this.options,o=!n?.path&&!n?.id;this.parentRoute=this.options.getParentRoute?.(),o?this._path=_o:this.parentRoute||Zn();let r=o?_o:n?.path;r&&r!=="/"&&(r=Gd(r));const i=n?.id||r;let s=o?_o:hs([this.parentRoute.id==="__root__"?"":this.parentRoute.id,i]);r==="__root__"&&(r="/"),s!=="__root__"&&(s=hs(["/",s]));const l=s==="__root__"?"/":hs([this.parentRoute.fullPath,r]);this._path=r,this._id=s,this._fullPath=l,this._to=Ho(l)},this.addChildren=t=>this._addFileChildren(t),this._addFileChildren=t=>(Array.isArray(t)&&(this.children=t),typeof t=="object"&&t!==null&&(this.children=Object.values(t)),this),this._addFileTypes=()=>this,this.updateLoader=t=>(Object.assign(this.options,t),this),this.update=t=>(Object.assign(this.options,t),this),this.lazy=t=>(this.lazyFn=t,this),this.redirect=t=>eu({from:this.fullPath,...t}),this.options=e||{},this.isRoot=!e?.getParentRoute,e?.id&&e?.path)throw new Error("Route cannot have both an 'id' and a 'path' option.")}},Zf=class extends su{constructor(e){super(e)}},eg=(e=>(e[e.AggregateError=1]="AggregateError",e[e.ArrowFunction=2]="ArrowFunction",e[e.ErrorPrototypeStack=4]="ErrorPrototypeStack",e[e.ObjectAssign=8]="ObjectAssign",e[e.BigIntTypedArray=16]="BigIntTypedArray",e[e.RegExp=32]="RegExp",e))(eg||{}),vo=Symbol.asyncIterator,lu=Symbol.hasInstance,Tr=Symbol.isConcatSpreadable,wo=Symbol.iterator,au=Symbol.match,cu=Symbol.matchAll,du=Symbol.replace,uu=Symbol.search,_u=Symbol.species,hu=Symbol.split,fu=Symbol.toPrimitive,Lr=Symbol.toStringTag,gu=Symbol.unscopables,mu={[vo]:0,[lu]:1,[Tr]:2,[wo]:3,[au]:4,[cu]:5,[du]:6,[uu]:7,[_u]:8,[hu]:9,[fu]:10,[Lr]:11,[gu]:12},tg={0:vo,1:lu,2:Tr,3:wo,4:au,5:cu,6:du,7:uu,8:_u,9:hu,10:fu,11:Lr,12:gu},x=void 0,ng={2:!0,3:!1,1:x,0:null,4:-0,5:Number.POSITIVE_INFINITY,6:Number.NEGATIVE_INFINITY,7:Number.NaN},og={0:"Error",1:"EvalError",2:"RangeError",3:"ReferenceError",4:"SyntaxError",5:"TypeError",6:"URIError"},rg={0:Error,1:EvalError,2:RangeError,3:ReferenceError,4:SyntaxError,5:TypeError,6:URIError};function Mt(e,t,n,o,r,i,s,l,a,c,d,u){return{t:e,i:t,s:n,c:o,m:r,p:i,e:s,a:l,f:a,b:c,o:d,l:u}}function Yo(e){return Mt(2,x,e,x,x,x,x,x,x,x,x,x)}var pu=Yo(2),yu=Yo(3),ig=Yo(1),sg=Yo(0),lg=Yo(4),ag=Yo(5),cg=Yo(6),dg=Yo(7);function ug(e){switch(e){case'"':return'\\"';case"\\":return"\\\\";case`
`:return"\\n";case"\r":return"\\r";case"\b":return"\\b";case"	":return"\\t";case"\f":return"\\f";case"<":return"\\x3C";case"\u2028":return"\\u2028";case"\u2029":return"\\u2029";default:return x}}function Vo(e){let t="",n=0,o;for(let r=0,i=e.length;r<i;r++)o=ug(e[r]),o&&(t+=e.slice(n,r)+o,n=r+1);return n===0?t=e:t+=e.slice(n),t}function _g(e){switch(e){case"\\\\":return"\\";case'\\"':return'"';case"\\n":return`
`;case"\\r":return"\r";case"\\b":return"\b";case"\\t":return"	";case"\\f":return"\f";case"\\x3C":return"<";case"\\u2028":return"\u2028";case"\\u2029":return"\u2029";default:return e}}function gr(e){return e.replace(/(\\\\|\\"|\\n|\\r|\\b|\\t|\\f|\\u2028|\\u2029|\\x3C)/g,_g)}var es="__SEROVAL_REFS__",xu=new Map,Pr=new Map;function bu(e){return xu.has(e)}function hg(e){return Pr.has(e)}function fg(e){if(bu(e))return xu.get(e);throw new Yg(e)}function gg(e){if(hg(e))return Pr.get(e);throw new Vg(e)}typeof globalThis<"u"?Object.defineProperty(globalThis,es,{value:Pr,configurable:!0,writable:!1,enumerable:!1}):typeof window<"u"?Object.defineProperty(window,es,{value:Pr,configurable:!0,writable:!1,enumerable:!1}):typeof self<"u"?Object.defineProperty(self,es,{value:Pr,configurable:!0,writable:!1,enumerable:!1}):typeof global<"u"&&Object.defineProperty(global,es,{value:Pr,configurable:!0,writable:!1,enumerable:!1});function Gl(e){return e instanceof EvalError?1:e instanceof RangeError?2:e instanceof ReferenceError?3:e instanceof SyntaxError?4:e instanceof TypeError?5:e instanceof URIError?6:0}function mg(e){let t=og[Gl(e)];return e.name!==t?{name:e.name}:e.constructor.name!==t?{name:e.constructor.name}:{}}function vu(e,t){let n=mg(e),o=Object.getOwnPropertyNames(e);for(let r=0,i=o.length,s;r<i;r++)s=o[r],s!=="name"&&s!=="message"&&(s==="stack"?t&4&&(n=n||{},n[s]=e[s]):(n=n||{},n[s]=e[s]));return n}function wu(e){return Object.isFrozen(e)?3:Object.isSealed(e)?2:Object.isExtensible(e)?0:1}function pg(e){switch(e){case Number.POSITIVE_INFINITY:return ag;case Number.NEGATIVE_INFINITY:return cg}return e!==e?dg:Object.is(e,-0)?lg:Mt(0,x,e,x,x,x,x,x,x,x,x,x)}function $u(e){return Mt(1,x,Vo(e),x,x,x,x,x,x,x,x,x)}function yg(e){return Mt(3,x,""+e,x,x,x,x,x,x,x,x,x)}function xg(e){return Mt(4,e,x,x,x,x,x,x,x,x,x,x)}function bg(e,t){let n=t.valueOf();return Mt(5,e,n!==n?"":t.toISOString(),x,x,x,x,x,x,x,x,x)}function vg(e,t){return Mt(6,e,x,Vo(t.source),t.flags,x,x,x,x,x,x,x)}function wg(e,t){return Mt(17,e,mu[t],x,x,x,x,x,x,x,x,x)}function $g(e,t){return Mt(18,e,Vo(fg(t)),x,x,x,x,x,x,x,x,x)}function Sg(e,t,n){return Mt(25,e,n,Vo(t),x,x,x,x,x,x,x,x)}function kg(e,t,n){return Mt(9,e,x,x,x,x,x,n,x,x,wu(t),x)}function Cg(e,t){return Mt(21,e,x,x,x,x,x,x,t,x,x,x)}function Mg(e,t,n){return Mt(15,e,x,t.constructor.name,x,x,x,x,n,t.byteOffset,x,t.length)}function Ig(e,t,n){return Mt(16,e,x,t.constructor.name,x,x,x,x,n,t.byteOffset,x,t.byteLength)}function Rg(e,t,n){return Mt(20,e,x,x,x,x,x,x,n,t.byteOffset,x,t.byteLength)}function Pg(e,t,n){return Mt(13,e,Gl(t),x,Vo(t.message),n,x,x,x,x,x,x)}function Eg(e,t,n){return Mt(14,e,Gl(t),x,Vo(t.message),n,x,x,x,x,x,x)}function Tg(e,t){return Mt(7,e,x,x,x,x,x,t,x,x,x,x)}function Lg(e,t){return Mt(28,x,x,x,x,x,x,[e,t],x,x,x,x)}function Ag(e,t){return Mt(30,x,x,x,x,x,x,[e,t],x,x,x,x)}function Bg(e,t,n){return Mt(31,e,x,x,x,x,x,n,t,x,x,x)}function Og(e,t){return Mt(32,e,x,x,x,x,x,x,t,x,x,x)}function Dg(e,t){return Mt(33,e,x,x,x,x,x,x,t,x,x,x)}function Fg(e,t){return Mt(34,e,x,x,x,x,x,x,t,x,x,x)}function Ng(e,t,n,o){return Mt(35,e,n,x,x,x,x,t,x,x,x,o)}var zg={parsing:1,serialization:2,deserialization:3};function Hg(e){return`Seroval Error (step: ${zg[e]})`}var jg=(e,t)=>Hg(e),Su=class extends Error{constructor(e,t){super(jg(e)),this.cause=t}},Ac=class extends Su{constructor(e){super("parsing",e)}},Ug=class extends Su{constructor(e){super("deserialization",e)}};function So(e){return`Seroval Error (specific: ${e})`}var Ns=class extends Error{constructor(t){super(So(1)),this.value=t}},ku=class extends Error{constructor(t){super(So(2))}},Wg=class extends Error{constructor(e){super(So(3))}},Ci=class extends Error{constructor(e){super(So(4))}},Yg=class extends Error{constructor(e){super(So(5)),this.value=e}},Vg=class extends Error{constructor(e){super(So(6))}},Xg=class extends Error{constructor(e){super(So(7))}},Xo=class extends Error{constructor(e){super(So(8))}},qg=class extends Error{constructor(t){super(So(9))}},Qg=class{constructor(e,t){this.value=e,this.replacement=t}},zs=()=>{let e={p:0,s:0,f:0};return e.p=new Promise((t,n)=>{e.s=t,e.f=n}),e},Kg=(e,t)=>{e.s(t),e.p.s=1,e.p.v=t},Gg=(e,t)=>{e.f(t),e.p.s=2,e.p.v=t};zs.toString();Kg.toString();Gg.toString();var Jg=()=>{let e=[],t=[],n=!0,o=!1,r=0,i=(a,c,d)=>{for(d=0;d<r;d++)t[d]&&t[d][c](a)},s=(a,c,d,u)=>{for(c=0,d=e.length;c<d;c++)u=e[c],!n&&c===d-1?a[o?"return":"throw"](u):a.next(u)},l=(a,c)=>(n&&(c=r++,t[c]=a),s(a),()=>{n&&(t[c]=t[r],t[r--]=void 0)});return{__SEROVAL_STREAM__:!0,on:a=>l(a),next:a=>{n&&(e.push(a),i(a,"next"))},throw:a=>{n&&(e.push(a),i(a,"throw"),n=!1,o=!1,t.length=0)},return:a=>{n&&(e.push(a),i(a,"return"),n=!1,o=!0,t.length=0)}}},Zg=e=>t=>()=>{let n=0,o={[e]:()=>o,next:()=>{if(n>t.d)return{done:!0,value:void 0};let r=n++,i=t.v[r];if(r===t.t)throw i;return{done:r===t.d,value:i}}};return o},e0=(e,t)=>n=>()=>{let o=0,r=-1,i=!1,s=[],l=[],a=(d=0,u=l.length)=>{for(;d<u;d++)l[d].s({done:!0,value:void 0})};n.on({next:d=>{let u=l.shift();u&&u.s({done:!1,value:d}),s.push(d)},throw:d=>{let u=l.shift();u&&u.f(d),a(),r=s.length,i=!0,s.push(d)},return:d=>{let u=l.shift();u&&u.s({done:!0,value:d}),a(),r=s.length,s.push(d)}});let c={[e]:()=>c,next:()=>{if(r===-1){let _=o++;if(_>=s.length){let m=t();return l.push(m),m.p}return{done:!1,value:s[_]}}if(o>r)return{done:!0,value:void 0};let d=o++,u=s[d];if(d!==r)return{done:!1,value:u};if(i)throw u;return{done:!0,value:u}}};return c},Cu=e=>{let t=atob(e),n=t.length,o=new Uint8Array(n);for(let r=0;r<n;r++)o[r]=t.charCodeAt(r);return o.buffer};Cu.toString();function t0(e){return"__SEROVAL_SEQUENCE__"in e}function Mu(e,t,n){return{__SEROVAL_SEQUENCE__:!0,v:e,t,d:n}}function n0(e){let t=[],n=-1,o=-1,r=e[wo]();for(;;)try{let i=r.next();if(t.push(i.value),i.done){o=t.length-1;break}}catch(i){n=t.length,t.push(i)}return Mu(t,n,o)}var o0=Zg(wo);function r0(e){return o0(e)}var i0={},s0={},l0={0:{},1:{},2:{},3:{},4:{},5:{}};function Hs(e){return"__SEROVAL_STREAM__"in e}function mr(){return Jg()}function a0(e){let t=mr(),n=e[vo]();async function o(){try{let r=await n.next();r.done?t.return(r.value):(t.next(r.value),await o())}catch(r){t.throw(r)}}return o().catch(()=>{}),t}var c0=e0(vo,zs);function d0(e){return c0(e)}async function u0(e){try{return[1,await e]}catch(t){return[0,t]}}function _0(e,t){return{plugins:t.plugins,mode:e,marked:new Set,features:63^(t.disabledFeatures||0),refs:t.refs||new Map,depthLimit:t.depthLimit||1e3}}function ms(e,t){e.marked.add(t)}function h0(e,t){let n=e.refs.size;return e.refs.set(t,n),n}function js(e,t){let n=e.refs.get(t);return n!=null?(ms(e,n),{type:1,value:xg(n)}):{type:0,value:h0(e,t)}}function Jl(e,t){let n=js(e,t);return n.type===1?n:bu(t)?{type:2,value:$g(n.value,t)}:n}function lr(e,t){let n=Jl(e,t);if(n.type!==0)return n.value;if(t in mu)return wg(n.value,t);throw new Ns(t)}function Us(e,t){let n=js(e,l0[t]);return n.type===1?n.value:Mt(26,n.value,t,x,x,x,x,x,x,x,x,x)}function f0(e){let t=js(e,i0);return t.type===1?t.value:Mt(27,t.value,x,x,x,x,x,x,lr(e,wo),x,x,x)}function g0(e){let t=js(e,s0);return t.type===1?t.value:Mt(29,t.value,x,x,x,x,x,[Us(e,1),lr(e,vo)],x,x,x,x)}function m0(e,t,n,o){return Mt(n?11:10,e,x,x,x,o,x,x,x,x,wu(t),x)}function p0(e,t,n,o){return Mt(8,t,x,x,x,x,{k:n,v:o},x,Us(e,0),x,x,x)}function y0(e,t,n){let o=new Uint8Array(n),r="";for(let i=0,s=o.length;i<s;i++)r+=String.fromCharCode(o[i]);return Mt(19,t,Vo(btoa(r)),x,x,x,x,x,Us(e,5),x,x,x)}function x0(e,t){return{base:_0(e,t),child:void 0}}var b0=class{constructor(e,t){this._p=e,this.depth=t}parse(e){return cn(this._p,this.depth,e)}};async function v0(e,t,n){let o=[];for(let r=0,i=n.length;r<i;r++)r in n?o[r]=await cn(e,t,n[r]):o[r]=0;return o}async function w0(e,t,n,o){return kg(n,o,await v0(e,t,o))}async function Zl(e,t,n){let o=Object.entries(n),r=[],i=[];for(let s=0,l=o.length;s<l;s++)r.push(Vo(o[s][0])),i.push(await cn(e,t,o[s][1]));return wo in n&&(r.push(lr(e.base,wo)),i.push(Lg(f0(e.base),await cn(e,t,n0(n))))),vo in n&&(r.push(lr(e.base,vo)),i.push(Ag(g0(e.base),await cn(e,t,a0(n))))),Lr in n&&(r.push(lr(e.base,Lr)),i.push($u(n[Lr]))),Tr in n&&(r.push(lr(e.base,Tr)),i.push(n[Tr]?pu:yu)),{k:r,v:i}}async function hl(e,t,n,o,r){return m0(n,o,r,await Zl(e,t,o))}async function $0(e,t,n,o){return Cg(n,await cn(e,t,o.valueOf()))}async function S0(e,t,n,o){return Mg(n,o,await cn(e,t,o.buffer))}async function k0(e,t,n,o){return Ig(n,o,await cn(e,t,o.buffer))}async function C0(e,t,n,o){return Rg(n,o,await cn(e,t,o.buffer))}async function Bc(e,t,n,o){let r=vu(o,e.base.features);return Pg(n,o,r?await Zl(e,t,r):x)}async function M0(e,t,n,o){let r=vu(o,e.base.features);return Eg(n,o,r?await Zl(e,t,r):x)}async function I0(e,t,n,o){let r=[],i=[];for(let[s,l]of o.entries())r.push(await cn(e,t,s)),i.push(await cn(e,t,l));return p0(e.base,n,r,i)}async function R0(e,t,n,o){let r=[];for(let i of o.keys())r.push(await cn(e,t,i));return Tg(n,r)}async function Iu(e,t,n,o){let r=e.base.plugins;if(r)for(let i=0,s=r.length;i<s;i++){let l=r[i];if(l.parse.async&&l.test(o))return Sg(n,l.tag,await l.parse.async(o,new b0(e,t),{id:n}))}return x}async function P0(e,t,n,o){let[r,i]=await u0(o);return Mt(12,n,r,x,x,x,x,x,await cn(e,t,i),x,x,x)}function E0(e,t,n,o,r){let i=[],s=n.on({next:l=>{ms(this.base,t),cn(this,e,l).then(a=>{i.push(Og(t,a))},a=>{r(a),s()})},throw:l=>{ms(this.base,t),cn(this,e,l).then(a=>{i.push(Dg(t,a)),o(i),s()},a=>{r(a),s()})},return:l=>{ms(this.base,t),cn(this,e,l).then(a=>{i.push(Fg(t,a)),o(i),s()},a=>{r(a),s()})}})}async function T0(e,t,n,o){return Bg(n,Us(e.base,4),await new Promise(E0.bind(e,t,n,o)))}async function L0(e,t,n,o){let r=[];for(let i=0,s=o.v.length;i<s;i++)r[i]=await cn(e,t,o.v[i]);return Ng(n,r,o.t,o.d)}async function A0(e,t,n,o){if(Array.isArray(o))return w0(e,t,n,o);if(Hs(o))return T0(e,t,n,o);if(t0(o))return L0(e,t,n,o);let r=o.constructor;if(r===Qg)return cn(e,t,o.replacement);let i=await Iu(e,t,n,o);if(i)return i;switch(r){case Object:return hl(e,t,n,o,!1);case x:return hl(e,t,n,o,!0);case Date:return bg(n,o);case Error:case EvalError:case RangeError:case ReferenceError:case SyntaxError:case TypeError:case URIError:return Bc(e,t,n,o);case Number:case Boolean:case String:case BigInt:return $0(e,t,n,o);case ArrayBuffer:return y0(e.base,n,o);case Int8Array:case Int16Array:case Int32Array:case Uint8Array:case Uint16Array:case Uint32Array:case Uint8ClampedArray:case Float32Array:case Float64Array:return S0(e,t,n,o);case DataView:return C0(e,t,n,o);case Map:return I0(e,t,n,o);case Set:return R0(e,t,n,o)}if(r===Promise||o instanceof Promise)return P0(e,t,n,o);let s=e.base.features;if(s&32&&r===RegExp)return vg(n,o);if(s&16)switch(r){case BigInt64Array:case BigUint64Array:return k0(e,t,n,o)}if(s&1&&typeof AggregateError<"u"&&(r===AggregateError||o instanceof AggregateError))return M0(e,t,n,o);if(o instanceof Error)return Bc(e,t,n,o);if(wo in o||vo in o)return hl(e,t,n,o,!!r);throw new Ns(o)}async function B0(e,t,n){let o=Jl(e.base,n);if(o.type!==0)return o.value;let r=await Iu(e,t,o.value,n);if(r)return r;throw new Ns(n)}async function cn(e,t,n){switch(typeof n){case"boolean":return n?pu:yu;case"undefined":return ig;case"string":return $u(n);case"number":return pg(n);case"bigint":return yg(n);case"object":{if(n){let o=Jl(e.base,n);return o.type===0?await A0(e,t+1,o.value,n):o.value}return sg}case"symbol":return lr(e.base,n);case"function":return B0(e,t,n);default:throw new Ns(n)}}async function O0(e,t){try{return await cn(e,0,t)}catch(n){throw n instanceof Ac?n:new Ac(n)}}var D0=(e=>(e[e.Vanilla=1]="Vanilla",e[e.Cross=2]="Cross",e))(D0||{});function Ru(e,t){for(let n=0,o=t.length;n<o;n++){let r=t[n];e.has(r)||(e.add(r),r.extends&&Ru(e,r.extends))}}function Pu(e){if(e){let t=new Set;return Ru(t,e),[...t]}}function F0(e){switch(e){case"Int8Array":return Int8Array;case"Int16Array":return Int16Array;case"Int32Array":return Int32Array;case"Uint8Array":return Uint8Array;case"Uint16Array":return Uint16Array;case"Uint32Array":return Uint32Array;case"Uint8ClampedArray":return Uint8ClampedArray;case"Float32Array":return Float32Array;case"Float64Array":return Float64Array;case"BigInt64Array":return BigInt64Array;case"BigUint64Array":return BigUint64Array;default:throw new Xg(e)}}var N0=1e6,z0=1e4,H0=2e4;function Eu(e,t){switch(t){case 3:return Object.freeze(e);case 1:return Object.preventExtensions(e);case 2:return Object.seal(e);default:return e}}var j0=1e3;function U0(e,t){var n;return{mode:e,plugins:t.plugins,refs:t.refs||new Map,features:(n=t.features)!=null?n:63^(t.disabledFeatures||0),depthLimit:t.depthLimit||j0}}function W0(e){return{mode:2,base:U0(2,e),child:x}}var Y0=class{constructor(e,t){this._p=e,this.depth=t}deserialize(e){return jt(this._p,this.depth,e)}};function Tu(e,t){if(t<0||!Number.isFinite(t)||!Number.isInteger(t))throw new Xo({t:4,i:t});if(e.refs.has(t))throw new Error("Conflicted ref id: "+t)}function V0(e,t,n){return Tu(e.base,t),e.state.marked.has(t)&&e.base.refs.set(t,n),n}function X0(e,t,n){return Tu(e.base,t),e.base.refs.set(t,n),n}function dn(e,t,n){return e.mode===1?V0(e,t,n):X0(e,t,n)}function Al(e,t,n){if(Object.hasOwn(t,n))return t[n];throw new Xo(e)}function q0(e,t){return dn(e,t.i,gg(gr(t.s)))}function Q0(e,t,n){let o=n.a,r=o.length,i=dn(e,n.i,new Array(r));for(let s=0,l;s<r;s++)l=o[s],l&&(i[s]=jt(e,t,l));return Eu(i,n.o),i}function K0(e){switch(e){case"constructor":case"__proto__":case"prototype":case"__defineGetter__":case"__defineSetter__":case"__lookupGetter__":case"__lookupSetter__":return!1;default:return!0}}function G0(e){switch(e){case vo:case Tr:case Lr:case wo:return!0;default:return!1}}function Oc(e,t,n){K0(t)?e[t]=n:Object.defineProperty(e,t,{value:n,configurable:!0,enumerable:!0,writable:!0})}function J0(e,t,n,o,r){if(typeof o=="string")Oc(n,o,jt(e,t,r));else{let i=jt(e,t,o);switch(typeof i){case"string":Oc(n,i,jt(e,t,r));break;case"symbol":G0(i)&&(n[i]=jt(e,t,r));break;default:throw new Xo(o)}}}function Lu(e,t,n,o){let r=n.k;if(r.length>0)for(let i=0,s=n.v,l=r.length;i<l;i++)J0(e,t,o,r[i],s[i]);return o}function Z0(e,t,n){let o=dn(e,n.i,n.t===10?{}:Object.create(null));return Lu(e,t,n.p,o),Eu(o,n.o),o}function em(e,t){return dn(e,t.i,new Date(t.s))}function tm(e,t){if(e.base.features&32){let n=gr(t.c);if(n.length>H0)throw new Xo(t);return dn(e,t.i,new RegExp(n,t.m))}throw new ku(t)}function nm(e,t,n){let o=dn(e,n.i,new Set);for(let r=0,i=n.a,s=i.length;r<s;r++)o.add(jt(e,t,i[r]));return o}function om(e,t,n){let o=dn(e,n.i,new Map);for(let r=0,i=n.e.k,s=n.e.v,l=i.length;r<l;r++)o.set(jt(e,t,i[r]),jt(e,t,s[r]));return o}function rm(e,t){if(t.s.length>N0)throw new Xo(t);return dn(e,t.i,Cu(gr(t.s)))}function im(e,t,n){var o;let r=F0(n.c),i=jt(e,t,n.f),s=(o=n.b)!=null?o:0;if(s<0||s>i.byteLength)throw new Xo(n);return dn(e,n.i,new r(i,s,n.l))}function sm(e,t,n){var o;let r=jt(e,t,n.f),i=(o=n.b)!=null?o:0;if(i<0||i>r.byteLength)throw new Xo(n);return dn(e,n.i,new DataView(r,i,n.l))}function Au(e,t,n,o){if(n.p){let r=Lu(e,t,n.p,{});Object.defineProperties(o,Object.getOwnPropertyDescriptors(r))}return o}function lm(e,t,n){let o=dn(e,n.i,new AggregateError([],gr(n.m)));return Au(e,t,n,o)}function am(e,t,n){let o=Al(n,rg,n.s),r=dn(e,n.i,new o(gr(n.m)));return Au(e,t,n,r)}function cm(e,t,n){let o=zs(),r=dn(e,n.i,o.p),i=jt(e,t,n.f);return n.s?o.s(i):o.f(i),r}function dm(e,t,n){return dn(e,n.i,Object(jt(e,t,n.f)))}function um(e,t,n){let o=e.base.plugins;if(o){let r=gr(n.c);for(let i=0,s=o.length;i<s;i++){let l=o[i];if(l.tag===r)return dn(e,n.i,l.deserialize(n.s,new Y0(e,t),{id:n.i}))}}throw new Wg(n.c)}function _m(e,t){return dn(e,t.i,dn(e,t.s,zs()).p)}function hm(e,t,n){let o=e.base.refs.get(n.i);if(o)return o.s(jt(e,t,n.a[1])),x;throw new Ci("Promise")}function fm(e,t,n){let o=e.base.refs.get(n.i);if(o)return o.f(jt(e,t,n.a[1])),x;throw new Ci("Promise")}function gm(e,t,n){jt(e,t,n.a[0]);let o=jt(e,t,n.a[1]);return r0(o)}function mm(e,t,n){jt(e,t,n.a[0]);let o=jt(e,t,n.a[1]);return d0(o)}function pm(e,t,n){let o=dn(e,n.i,mr()),r=n.a,i=r.length;if(i)for(let s=0;s<i;s++)jt(e,t,r[s]);return o}function ym(e,t,n){let o=e.base.refs.get(n.i);if(o&&Hs(o))return o.next(jt(e,t,n.f)),x;throw new Ci("Stream")}function xm(e,t,n){let o=e.base.refs.get(n.i);if(o&&Hs(o))return o.throw(jt(e,t,n.f)),x;throw new Ci("Stream")}function bm(e,t,n){let o=e.base.refs.get(n.i);if(o&&Hs(o))return o.return(jt(e,t,n.f)),x;throw new Ci("Stream")}function vm(e,t,n){return jt(e,t,n.f),x}function wm(e,t,n){return jt(e,t,n.a[1]),x}function $m(e,t,n){let o=dn(e,n.i,Mu([],n.s,n.l));for(let r=0,i=n.a.length;r<i;r++)o.v[r]=jt(e,t,n.a[r]);return o}function jt(e,t,n){if(t>e.base.depthLimit)throw new qg(e.base.depthLimit);switch(t+=1,n.t){case 2:return Al(n,ng,n.s);case 0:return Number(n.s);case 1:return gr(String(n.s));case 3:if(String(n.s).length>z0)throw new Xo(n);return BigInt(n.s);case 4:return e.base.refs.get(n.i);case 18:return q0(e,n);case 9:return Q0(e,t,n);case 10:case 11:return Z0(e,t,n);case 5:return em(e,n);case 6:return tm(e,n);case 7:return nm(e,t,n);case 8:return om(e,t,n);case 19:return rm(e,n);case 16:case 15:return im(e,t,n);case 20:return sm(e,t,n);case 14:return lm(e,t,n);case 13:return am(e,t,n);case 12:return cm(e,t,n);case 17:return Al(n,tg,n.s);case 21:return dm(e,t,n);case 25:return um(e,t,n);case 22:return _m(e,n);case 23:return hm(e,t,n);case 24:return fm(e,t,n);case 28:return gm(e,t,n);case 30:return mm(e,t,n);case 31:return pm(e,t,n);case 32:return ym(e,t,n);case 33:return xm(e,t,n);case 34:return bm(e,t,n);case 27:return vm(e,t,n);case 29:return wm(e,t,n);case 35:return $m(e,t,n);default:throw new ku(n)}}function Sm(e,t){try{return jt(e,0,t)}catch(n){throw new Ug(n)}}var km=()=>T;km.toString();function fl(e,t){let n=Pu(t.plugins),o=W0({plugins:n,refs:t.refs,features:t.features,disabledFeatures:t.disabledFeatures,depthLimit:t.depthLimit});return Sm(o,e)}async function Cm(e,t={}){let n=Pu(t.plugins),o=x0(1,{plugins:n,disabledFeatures:t.disabledFeatures});return{t:await O0(o,e),f:o.base.features,m:Array.from(o.base.marked)}}function Mm(e){return{tag:"$TSR/t/"+e.key,test:e.test,parse:{sync(t,n){return n.parse(e.toSerializable(t))},async async(t,n){return await n.parse(e.toSerializable(t))},stream(t,n){return n.parse(e.toSerializable(t))}},serialize:void 0,deserialize(t,n){return e.fromSerializable(n.deserialize(t))}}}var Im=class{constructor(e,t){this.stream=e,this.hint=t?.hint??"binary"}},Rs=globalThis.Buffer,Bu=!!Rs&&typeof Rs.from=="function";function Ou(e){if(e.length===0)return"";if(Bu)return Rs.from(e).toString("base64");const t=32768,n=[];for(let o=0;o<e.length;o+=t){const r=e.subarray(o,o+t);n.push(String.fromCharCode.apply(null,r))}return btoa(n.join(""))}function Du(e){if(e.length===0)return new Uint8Array(0);if(Bu){const o=Rs.from(e,"base64");return new Uint8Array(o.buffer,o.byteOffset,o.byteLength)}const t=atob(e),n=new Uint8Array(t.length);for(let o=0;o<t.length;o++)n[o]=t.charCodeAt(o);return n}var si=Object.create(null),li=Object.create(null),Rm=e=>new ReadableStream({start(t){e.on({next(n){try{t.enqueue(Du(n))}catch{}},throw(n){t.error(n)},return(){try{t.close()}catch{}}})}}),Pm=new TextEncoder,Em=e=>new ReadableStream({start(t){e.on({next(n){try{typeof n=="string"?t.enqueue(Pm.encode(n)):t.enqueue(Du(n.$b64))}catch{}},throw(n){t.error(n)},return(){try{t.close()}catch{}}})}}),Tm="(s=>new ReadableStream({start(c){s.on({next(b){try{const d=atob(b),a=new Uint8Array(d.length);for(let i=0;i<d.length;i++)a[i]=d.charCodeAt(i);c.enqueue(a)}catch(_){}},throw(e){c.error(e)},return(){try{c.close()}catch(_){}}})}}))",Lm="(s=>{const e=new TextEncoder();return new ReadableStream({start(c){s.on({next(v){try{if(typeof v==='string'){c.enqueue(e.encode(v))}else{const d=atob(v.$b64),a=new Uint8Array(d.length);for(let i=0;i<d.length;i++)a[i]=d.charCodeAt(i);c.enqueue(a)}}catch(_){}},throw(x){c.error(x)},return(){try{c.close()}catch(_){}}})}})})";function Dc(e){const t=mr(),n=e.getReader();return(async()=>{try{for(;;){const{done:o,value:r}=await n.read();if(o){t.return(void 0);break}t.next(Ou(r))}}catch(o){t.throw(o)}finally{n.releaseLock()}})(),t}function Fc(e){const t=mr(),n=e.getReader(),o=new TextDecoder("utf-8",{fatal:!0});return(async()=>{try{for(;;){const{done:r,value:i}=await n.read();if(r){try{const s=o.decode();s.length>0&&t.next(s)}catch{}t.return(void 0);break}try{const s=o.decode(i,{stream:!0});s.length>0&&t.next(s)}catch{t.next({$b64:Ou(i)})}}}catch(r){t.throw(r)}finally{n.releaseLock()}})(),t}var Am={tag:"tss/RawStream",extends:[{tag:"tss/RawStreamFactory",test(e){return e===si},parse:{sync(){},async(){return Promise.resolve(void 0)},stream(){}},serialize(){return Tm},deserialize(){return si}},{tag:"tss/RawStreamFactoryText",test(e){return e===li},parse:{sync(){},async(){return Promise.resolve(void 0)},stream(){}},serialize(){return Lm},deserialize(){return li}}],test(e){return e instanceof Im},parse:{sync(e,t){const n=e.hint==="text"?li:si;return{hint:e.hint,factory:t.parse(n),stream:t.parse(mr())}},async async(e,t){const n=e.hint==="text"?li:si,o=e.hint==="text"?Fc(e.stream):Dc(e.stream);return{hint:e.hint,factory:await t.parse(n),stream:await t.parse(o)}},stream(e,t){const n=e.hint==="text"?li:si,o=e.hint==="text"?Fc(e.stream):Dc(e.stream);return{hint:e.hint,factory:t.parse(n),stream:t.parse(o)}}},serialize(e,t){return"("+t.serialize(e.factory)+")("+t.serialize(e.stream)+")"},deserialize(e,t){const n=t.deserialize(e.stream);return e.hint==="text"?Em(n):Rm(n)}};function Bm(e){return{tag:"tss/RawStream",test:()=>!1,parse:{},serialize(){throw new Error("RawStreamDeserializePlugin.serialize should not be called. Client only deserializes.")},deserialize(t){return e(t.streamId)}}}var Om={tag:"$TSR/Error",test(e){return e instanceof Error},parse:{sync(e,t){return{message:t.parse(e.message)}},async async(e,t){return{message:await t.parse(e.message)}},stream(e,t){return{message:t.parse(e.message)}}},serialize(e,t){return"new Error("+t.serialize(e.message)+")"},deserialize(e,t){return new Error(t.deserialize(e.message))}},Fo={},Fu=e=>new ReadableStream({start:t=>{e.on({next:n=>{try{t.enqueue(n)}catch{}},throw:n=>{t.error(n)},return:()=>{try{t.close()}catch{}}})}}),Dm={tag:"seroval-plugins/web/ReadableStreamFactory",test(e){return e===Fo},parse:{sync(){return Fo},async async(){return await Promise.resolve(Fo)},stream(){return Fo}},serialize(){return Fu.toString()},deserialize(){return Fo}};function Nc(e){let t=mr(),n=e.getReader();async function o(){try{let r=await n.read();r.done?t.return(r.value):(t.next(r.value),await o())}catch(r){t.throw(r)}}return o().catch(()=>{}),t}var Fm={tag:"seroval/plugins/web/ReadableStream",extends:[Dm],test(e){return typeof ReadableStream>"u"?!1:e instanceof ReadableStream},parse:{sync(e,t){return{factory:t.parse(Fo),stream:t.parse(mr())}},async async(e,t){return{factory:await t.parse(Fo),stream:await t.parse(Nc(e))}},stream(e,t){return{factory:t.parse(Fo),stream:t.parse(Nc(e))}}},serialize(e,t){return"("+t.serialize(e.factory)+")("+t.serialize(e.stream)+")"},deserialize(e,t){let n=t.deserialize(e.stream);return Fu(n)}},Nm=Fm,zm=[Om,Am,Nm],Hm=$('<div style=padding:.5rem;max-width:100%><div style=display:flex;align-items:center;gap:.5rem><strong style=font-size:1rem>Something went wrong!</strong><button style="appearance:none;font-size:.6em;border:1px solid currentColor;padding:.1rem .2rem;font-weight:bold;border-radius:.25rem"></button></div><div style=height:.25rem></div><!$><!/>'),jm=$('<div><pre style="font-size:.7em;border:1px solid red;border-radius:.25rem;padding:.3rem;color:red;overflow:auto">'),Um=$("<code>");function ea(e){return h(Ch,{fallback:(t,n)=>(e.onCatch?.(t),De(Ld([e.getResetKey],()=>n(),{defer:!0})),h(Un,{get component(){return e.errorComponent??ta},error:t,reset:n})),get children(){return e.children}})}function ta({error:e}){const[t,n]=G(!1);return(()=>{var o=b(Hm),r=o.firstChild,i=r.firstChild,s=i.nextSibling,l=r.nextSibling,a=l.nextSibling,[c,d]=S(a.nextSibling);return s.$$click=()=>n(u=>!u),y(s,()=>t()?"Hide Error":"Show Error"),y(o,(()=>{var u=lt(()=>!!t());return()=>u()?(()=>{var _=b(jm),m=_.firstChild;return y(m,(()=>{var g=lt(()=>!!e.message);return()=>g()?(()=>{var v=b(Um);return y(v,()=>e.message),v})():null})()),_})():null})(),c,d),Ft(),o})()}Vl(["click"]);function Wm(){const[e,t]=G(!1);return Pn(()=>{t(!0)}),e}function Ym(e){return(...t)=>{for(const n of e)n&&n(...t)}}function zc(...e){return Ym(e)}const Nu=$i(null);function kn(e){return Wo(Nu)}function Vm(e,t,n={},o={}){const r=typeof IntersectionObserver=="function";let i=null;return De(()=>{const s=e();!s||!r||o.disabled||(i=new IntersectionObserver(([l])=>{t(l)},n),i.observe(s),ot(()=>{i?.disconnect()}))}),()=>i}var Xm=$("<svg><a>"),qm=$("<a>");const ai=new WeakMap;function Qm(e){const t=kn(),[n,o]=G(!1),r=!!t.options.ssr,i=Wm();let s=!1;const[l,a]=Jn(vn({activeProps:Hc,inactiveProps:jc},e),["activeProps","inactiveProps","activeOptions","to","preload","preloadDelay","hashScrollIntoView","replace","startTransition","resetScroll","viewTransition","target","disabled","style","class","onClick","onBlur","onFocus","onMouseEnter","onMouseLeave","onMouseOver","onMouseOut","onTouchStart","ignoreBlocker"]),[c,d]=Jn(a,["params","search","hash","state","mask","reloadDocument","unsafeRelative"]),u=et(()=>t.stores.location.state,void 0,{equals:(Y,oe)=>Y.href===oe.href}),_=()=>e,m=et(()=>{const oe={_fromLocation:u(),..._()};return nn(()=>t.buildLocation(oe))}),g=et(()=>{if(_().disabled)return;const Y=m().maskedLocation??m(),oe=Y.publicHref;return Y.external?{href:oe,external:!0}:{href:t.history.createHref(oe)||"/",external:!1}}),v=et(()=>{const Y=g();if(Y?.external)return Ss(Y.href,t.protocolAllowlist)?void 0:Y.href;const oe=_().to;if(!o1(oe)&&!(typeof oe!="string"||oe.indexOf(":")===-1))try{return new URL(oe),Ss(oe,t.protocolAllowlist)?void 0:oe}catch{}}),f=et(()=>_().reloadDocument||v()?!1:l.preload??t.options.defaultPreload),p=()=>l.preloadDelay??t.options.defaultPreloadDelay??0,k=et(()=>{if(v())return!1;const Y=l.activeOptions,oe=u(),ve=m();if(Y?.exact){if(!mf(oe.pathname,ve.pathname,t.basepath))return!1}else{const he=ks(oe.pathname,t.basepath),We=ks(ve.pathname,t.basepath);if(!(he.startsWith(We)&&(he.length===We.length||he[We.length]==="/")))return!1}return(Y?.includeSearch??!0)&&!dr(oe.search,ve.search,{partial:!Y?.exact,ignoreUndefined:!Y?.explicitUndefined})?!1:Y?.includeHash?(r&&!i()?"":oe.hash)===ve.hash:!0}),P=()=>t.preloadRoute({..._(),_builtLocation:m()}).catch(Y=>{console.warn(Y),console.warn(Jf)}),R=Y=>{Y?.isIntersecting&&P()},[A,ee]=G(null);if(Vm(A,R,{rootMargin:"100px"},{disabled:!!l.disabled||f()!=="viewport"}),De(()=>{s||!l.disabled&&f()==="render"&&(P(),s=!0)}),v())return vn(d,{ref:zc(ee,_().ref),href:v()},Jn(l,["target","disabled","style","class","onClick","onBlur","onFocus","onMouseEnter","onMouseLeave","onMouseOut","onMouseOver","onTouchStart"])[0]);const D=Y=>{const oe=Y.currentTarget.getAttribute("target"),ve=l.target!==void 0?l.target:oe;if(!l.disabled&&!n1(Y)&&!Y.defaultPrevented&&(!ve||ve==="_self")&&Y.button===0){Y.preventDefault(),o(!0);const he=t.subscribe("onResolved",()=>{he(),o(!1)});t.navigate({..._(),replace:l.replace,resetScroll:l.resetScroll,hashScrollIntoView:l.hashScrollIntoView,startTransition:l.startTransition,viewTransition:l.viewTransition,ignoreBlocker:l.ignoreBlocker})}},K=Y=>{if(l.disabled||f()!=="intent")return;if(!p()){P();return}const oe=Y.currentTarget||Y.target;!oe||ai.has(oe)||ai.set(oe,setTimeout(()=>{ai.delete(oe),P()},p()))},te=Y=>{l.disabled||f()!=="intent"||P()},me=Y=>{if(l.disabled)return;const oe=Y.currentTarget||Y.target;if(oe){const ve=ai.get(oe);clearTimeout(ve),ai.delete(oe)}},j=et(()=>l.activeProps===Hc&&l.inactiveProps===jc&&l.class===void 0&&l.style===void 0),ue=Bo(()=>l.onClick,D),be=Bo(()=>l.onBlur,me),ye=Bo(()=>l.onFocus,K),Te=Bo(()=>l.onMouseEnter,K),_e=Bo(()=>l.onMouseOver,K),W=Bo(()=>l.onMouseLeave,me),B=Bo(()=>l.onMouseOut,me),Z=Bo(()=>l.onTouchStart,te),de=et(()=>{const Y=k(),oe={href:g()?.href,ref:zc(ee,_().ref),onClick:ue,onBlur:be,onFocus:ye,onMouseEnter:Te,onMouseOver:_e,onMouseLeave:W,onMouseOut:B,onTouchStart:Z,disabled:!!l.disabled,target:l.target,...l.disabled&&Jm,...n()&&e1};if(j())return{...oe,...Y&&Gm};const ve=Y?No(l.activeProps,{})??ps:ps,he=Y?ps:No(l.inactiveProps,{}),We={...l.style,...ve.style,...he.style},Xe=[l.class,ve.class,he.class].filter(Boolean).join(" ");return{...ve,...he,...oe,...Object.keys(We).length?{style:We}:void 0,...Xe?{class:Xe}:void 0,...Y&&Zm}});return vn(d,de)}const Km={class:"active"},Hc=()=>Km,ps={},jc=()=>ps,Gm={class:"active","data-status":"active","aria-current":"page"},Jm={role:"link","aria-disabled":!0},Zm={"data-status":"active","aria-current":"page"},e1={"data-transitioning":"transitioning"};function t1(e,t){return typeof t=="function"?t(e):t[0](t[1],e),e.defaultPrevented}function Bo(e,t){return n=>{const o=e();(!o||!t1(n,o))&&t(n)}}const Ps=e=>{const[t,n]=Jn(e,["_asChild","children"]),[o,r]=Jn(Qm(n),["type"]),i=et(()=>{const s=t.children;return typeof s=="function"?s({get isActive(){return r["data-status"]==="active"},get isTransitioning(){return r["data-transitioning"]==="transitioning"}}):s});if(t._asChild==="svg"){const[s,l]=Jn(r,["class"]);return(()=>{var a=b(Xm),c=a.firstChild;return bo(c,l,!1,!0),y(c,i),Ft(),a})()}return t._asChild?h(Un,vn({get component(){return t._asChild}},r,{get children(){return i()}})):(()=>{var s=b(qm);return bo(s,r,!1,!0),y(s,i),Ft(),s})()};function n1(e){return!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)}function o1(e){if(typeof e!="string")return!1;const t=e.charCodeAt(0);return t===47?e.charCodeAt(1)!==47:t===46}const r1={matchId:()=>{},routeId:()=>{},match:()=>{},hasPending:()=>!1},Mi=$i(r1);function qo(e){const t=kn(),n=e.from?void 0:Wo(Mi),o=()=>e.from?t.stores.getMatchStoreByRouteId(e.from).state:n?.match();return De(()=>{if(o()!==void 0)return;!(e.from?t.stores.pendingRouteIds.state[e.from]:n?.hasPending()??!1)&&!t.stores.isTransitioning.state&&(e.shouldThrow??!0)&&Zn()}),et(r=>{const i=o();if(i===void 0)return;const s=e.select?e.select(i):i;return r===void 0?s:rr(r,s)})}function na(e){return qo({from:e.from,strict:e.strict,select:t=>e.select?e.select(t.loaderData):t.loaderData})}function oa(e){return qo({...e,select:t=>e.select?e.select(t.loaderDeps):t.loaderDeps})}function ra(e){return qo({from:e.from,strict:e.strict,shouldThrow:e.shouldThrow,select:t=>{const n=e.strict===!1?t.params:t._strictParams;return e.select?e.select(n):n}})}function ia(e){return qo({from:e.from,strict:e.strict,shouldThrow:e.shouldThrow,select:t=>{const n=t.search;return e.select?e.select(n):n}})}function sa(e){const t=kn();return n=>t.navigate({...n,from:n.from??e?.from})}function la(e){return qo({...e,select:t=>e.select?e.select(t.context):t.context})}let i1=class extends su{constructor(t){super(t),this.useMatch=n=>qo({select:n?.select,from:this.id}),this.useRouteContext=n=>la({...n,from:this.id}),this.useSearch=n=>ia({select:n?.select,from:this.id}),this.useParams=n=>ra({select:n?.select,from:this.id}),this.useLoaderDeps=n=>oa({...n,from:this.id}),this.useLoaderData=n=>na({...n,from:this.id}),this.useNavigate=()=>sa({from:this.fullPath}),this.Link=n=>{const o=this;return h(Ps,vn({get from(){return o.fullPath}},n))}}};function s1(e){return new i1(e)}class l1 extends Zf{constructor(t){super(t),this.useMatch=n=>qo({select:n?.select,from:this.id}),this.useRouteContext=n=>la({...n,from:this.id}),this.useSearch=n=>ia({select:n?.select,from:this.id}),this.useParams=n=>ra({select:n?.select,from:this.id}),this.useLoaderDeps=n=>oa({...n,from:this.id}),this.useLoaderData=n=>na({...n,from:this.id}),this.useNavigate=()=>sa({from:this.fullPath}),this.Link=n=>{const o=this;return h(Ps,vn({get from(){return o.fullPath}},n))}}}function a1(e){return new l1(e)}function Es(e){return typeof e=="object"?new Uc(e,{silent:!0}).createRoute(e):new Uc(e,{silent:!0}).createRoute}class Uc{constructor(t,n){this.path=t,this.createRoute=o=>{const r=s1(o);return r.isRoot=!1,r},this.silent=n?.silent}}class Wc{constructor(t){this.useMatch=n=>qo({select:n?.select,from:this.options.id}),this.useRouteContext=n=>la({...n,from:this.options.id}),this.useSearch=n=>ia({select:n?.select,from:this.options.id}),this.useParams=n=>ra({select:n?.select,from:this.options.id}),this.useLoaderDeps=n=>oa({...n,from:this.options.id}),this.useLoaderData=n=>na({...n,from:this.options.id}),this.useNavigate=()=>{const n=kn();return sa({from:n.routesById[this.options.id].fullPath})},this.options=t}}function Yc(e){return typeof e=="object"?new Wc(e):t=>new Wc({id:e,...t})}function zu(e,t){let n,o,r;const i=()=>(n||(n=e().then(l=>(n=void 0,o=l[t],o)).catch(l=>{r=l})),n),s=function(a){if(r){if(ef(r)&&r instanceof Error&&typeof window<"u"&&typeof sessionStorage<"u"){const c=`tanstack_router_reload:${r.message}`;if(!sessionStorage.getItem(c))return sessionStorage.setItem(c,"1"),window.location.reload(),{default:()=>null}}throw r}if(!o){const[c]=hi(i,{initialValue:o,ssrLoadFrom:"initial"});return h(Un,vn({get component(){return c()}},a))}return h(Un,vn({component:o},a))};return s.preload=i,s}function c1(){const e=kn();let t={router:e,mounted:!1};const n=et(()=>e.stores.isLoading.state),[o,r]=gh(),i=et(()=>e.stores.hasPendingMatches.state),s=et(()=>n()||o()||i()),l=et(()=>n()||i());return e.startTransition=a=>{Bd(()=>{r(a)})},Pn(()=>{const a=e.history.subscribe(e.load),c=e.buildLocation({to:e.latestLocation.pathname,search:!0,params:!0,hash:!0,state:!0,_includeValidateSearch:!0});Ho(e.latestLocation.publicHref)!==Ho(c.publicHref)&&e.commitLocation({...c,replace:!0}),ot(()=>{a()})}),ie(()=>{nn(()=>{if(typeof window<"u"&&e.ssr||t.router===e&&t.mounted)return;t={router:e,mounted:!0},(async()=>{try{await e.load()}catch(c){console.error(c)}})()})}),ie((a=!1)=>{const c=n();return a&&!c&&e.emit({type:"onLoad",...Er(e.stores.location.state,e.stores.resolvedLocation.state)}),c}),Cl((a=!1)=>{const c=l();return a&&!c&&e.emit({type:"onBeforeRouteMount",...Er(e.stores.location.state,e.stores.resolvedLocation.state)}),c}),ie((a=!1)=>{const c=s();if(a&&!c){const d=Er(e.stores.location.state,e.stores.resolvedLocation.state);e.emit({type:"onResolved",...d}),Td(()=>{e.stores.status.setState(()=>"idle"),e.stores.resolvedLocation.setState(()=>e.stores.location.state)}),d.hrefChanged&&Cf(e)}return c}),null}function ar(e){return lt(()=>e.children)}var d1=$("<p>Not Found");function u1(e){const t=kn(),n=et(()=>t.stores.location.state.pathname),o=et(()=>t.stores.status.state);return h(ea,{getResetKey:()=>`not-found-${n()}-${o()}`,onCatch:r=>{if(xn(r))e.onCatch?.(r);else throw r},errorComponent:({error:r})=>{if(xn(r))return e.fallback?.(r);throw r},get children(){return e.children}})}function _1(){return b(d1)}function Hu(e,t,n){return t.options.notFoundComponent?h(t.options.notFoundComponent,n):e.options.defaultNotFoundComponent?h(e.options.defaultNotFoundComponent,n):h(_1,{})}function h1(){return kn().isScrollRestoring,null}const Bl=e=>{const t=kn(),n=et(()=>{const s=e.matchId;if(s)return t.stores.activeMatchStoresById.get(s)?.state}),o=et(()=>{const s=n();if(!s)return null;const l=s.routeId,a=t.routesById[l]?.parentRoute?.id;return{matchId:s.id,routeId:l,ssr:s.ssr,_displayPending:s._displayPending,parentRouteId:a}}),r=et(()=>{const s=o()?.routeId;return s?!!t.stores.pendingRouteIds.state[s]:!1}),i={matchId:()=>o()?.matchId,routeId:()=>o()?.routeId,match:n,hasPending:r};return h(Oe,{get when(){return o()},children:s=>{const l=()=>t.routesById[s().routeId],a=()=>l().options.pendingComponent??t.options.defaultPendingComponent,c=()=>l().options.errorComponent??t.options.defaultErrorComponent,d=()=>l().options.onCatch??t.options.defaultOnCatch,u=()=>l().isRoot?l().options.notFoundComponent??t.options.notFoundRoute?.options.component:l().options.notFoundComponent,_=s().ssr===!1||s().ssr==="data-only",m=()=>Yl,g=()=>c()?ea:ar,v=()=>u()?u1:ar,f=l().isRoot?l().options.shellComponent??ar:ar;return h(f,{get children(){return[h(Mi.Provider,{value:i,get children(){return h(Un,{get component(){return m()},get fallback(){return lt(()=>!1)()?void 0:h(Un,{get component(){return a()}})},get children(){return h(Un,{get component(){return g()},getResetKey:()=>t.stores.loadedAt.state,get errorComponent(){return c()||ta},onCatch:p=>{if(xn(p))throw p;d()?.(p)},get children(){return h(Un,{get component(){return v()},fallback:p=>{if(!u()||p.routeId&&p.routeId!==s().routeId||!p.routeId&&!l().isRoot)throw p;return h(Un,vn({get component(){return u()}},p))},get children(){return h(Yd,{get children(){return[h(po,{when:_,get children(){return h(Oe,{get when(){return!0},get fallback(){return h(Un,{get component(){return a()}})},get children(){return h(Vc,{})}})}}),h(po,{when:!_,get children(){return h(Vc,{})}})]}})}})}})}})}}),lt(()=>lt(()=>s().parentRouteId===_o)()?[h(f1,{}),h(h1,{})]:null)]}})}})};function f1(){const e=kn(),t=et(()=>e.stores.resolvedLocation.state?.state.__TSR_key);return De(Ld([t],()=>{e.emit({type:"onRendered",...Er(e.stores.location.state,e.stores.resolvedLocation.state)})})),null}const Vc=()=>{const e=kn(),t=Wo(Mi).match,n=et(()=>{const o=t();if(!o)return null;const r=o.routeId,s=(e.routesById[r].options.remountDeps??e.options.defaultRemountDeps)?.({routeId:r,loaderDeps:o.loaderDeps,params:o._strictParams,search:o._strictSearch});return{key:s?JSON.stringify(s):void 0,routeId:r,match:{id:o.id,status:o.status,error:o.error,_forcePending:o._forcePending??!1,_displayPending:o._displayPending??!1}}});return h(Oe,{get when(){return n()},children:o=>{const r=()=>e.routesById[o().routeId],i=()=>o().match,s=()=>o().key??o().match.id,l=()=>{const c=r().options.component??e.options.defaultComponent;return c?h(c,{}):h(ju,{})},a=()=>h(Oe,{get when(){return s()},keyed:!0,children:c=>l()});return h(Yd,{get children(){return[h(po,{get when(){return i()._displayPending},children:c=>{const[d]=hi(()=>e.getMatch(i().id)?._nonReactive.displayPendingPromise);return lt(d)}}),h(po,{get when(){return i()._forcePending},children:c=>{const[d]=hi(()=>e.getMatch(i().id)?._nonReactive.minPendingPromise);return lt(d)}}),h(po,{get when(){return i().status==="pending"},children:c=>{const d=r().options.pendingMinMs??e.options.defaultPendingMinMs;if(d){const m=e.getMatch(i().id);if(m&&!m._nonReactive.minPendingPromise){const g=hr();m._nonReactive.minPendingPromise=g,setTimeout(()=>{g.resolve(),m._nonReactive.minPendingPromise=void 0},d)}}const[u]=hi(async()=>(await new Promise(m=>setTimeout(m,0)),e.getMatch(i().id)?._nonReactive.loadPromise)),_=r().options.pendingComponent??e.options.defaultPendingComponent;return[_&&d>0?h(Un,{component:_}):null,lt(u)]}}),h(po,{get when(){return i().status==="notFound"},children:c=>(xn(i().error)||Zn(),h(Oe,{get when(){return o().routeId},keyed:!0,children:d=>Hu(e,r(),i().error)}))}),h(po,{get when(){return i().status==="redirected"},children:c=>{En(i().error)||Zn();const[d]=hi(async()=>(await new Promise(u=>setTimeout(u,0)),e.getMatch(i().id)?._nonReactive.loadPromise));return lt(d)}}),h(po,{get when(){return i().status==="error"},children:c=>{throw i().error}}),h(po,{get when(){return i().status==="success"},get children(){return a()}})]}})}})},ju=()=>{const e=kn(),t=Wo(Mi),n=t.match,o=t.routeId,r=et(()=>o()?e.routesById[o()]:void 0),i=et(()=>n()?.globalNotFound??!1),s=et(()=>{const c=o();return c?e.stores.childMatchIdByRouteId.state[c]:void 0}),l=et(()=>{const c=s();if(c)return e.stores.activeMatchStoresById.get(c)?.state.status}),a=()=>l()!=="redirected"&&i();return h(Oe,{get when(){return lt(()=>!a())()&&s()},get fallback(){return h(Oe,{get when(){return lt(()=>!!a())()&&r()},children:c=>Hu(e,c(),void 0)})},children:c=>{const d=et(()=>c());return h(Oe,{get when(){return o()===_o},get fallback(){return h(Bl,{get matchId(){return d()}})},get children(){return h(Yl,{get fallback(){return h(Un,{get component(){return e.options.defaultPendingComponent}})},get children(){return h(Bl,{get matchId(){return d()}})}})}})}})};function g1(){const e=kn(),t=typeof document<"u"&&e.ssr?ar:Yl,o=e.routesById[_o].options.pendingComponent??e.options.defaultPendingComponent,r=e.options.InnerWrap||ar;return h(r,{get children(){return h(t,{get fallback(){return o?h(o,{}):null},get children(){return[h(c1,{}),h(m1,{})]}})}})}function m1(){const e=kn(),t=()=>e.stores.firstMatchId.state,n=()=>t()?_o:void 0,o=()=>n()?e.stores.getMatchStoreByRouteId(_o).state:void 0,r=()=>n()?!!e.stores.pendingRouteIds.state[_o]:!1,i=()=>e.stores.loadedAt.state,s={matchId:t,routeId:n,match:o,hasPending:r},l=()=>h(Oe,{get when(){return t()},get children(){return h(Bl,{get matchId(){return t()}})}});return h(Mi.Provider,{value:s,get children(){return lt(()=>!!e.options.disableGlobalCatchBoundary)()?l():h(ea,{getResetKey:()=>i(),errorComponent:ta,get onCatch(){},get children(){return l()}})}})}function p1(e,t){e.childMatchIdByRouteId=t(()=>{const n=e.matchesId.state,o={};for(let r=0;r<n.length-1;r++){const i=e.activeMatchStoresById.get(n[r]);i?.routeId&&(o[i.routeId]=n[r+1])}return o}),e.pendingRouteIds=t(()=>{const n=e.pendingMatchesId.state,o={};for(const r of n){const i=e.pendingMatchStoresById.get(r);i?.routeId&&(o[i.routeId]=!0)}return o})}function y1(e){const[t,n]=G(e);return{get state(){return t()},setState:n}}let Uu=null;typeof globalThis<"u"&&"FinalizationRegistry"in globalThis&&(Uu=new FinalizationRegistry(e=>e()));function Xc(e){let t;const n=cr(r=>(t=r,et(e))),o={get state(){return n()}};return Uu?.register(o,t),o}const x1=e=>({createMutableStore:y1,createReadonlyStore:Xc,batch:Td,init:t=>p1(t,Xc)}),b1=e=>new v1(e);class v1 extends Yf{constructor(t){super(t,x1)}}typeof globalThis<"u"?(globalThis.createFileRoute=Es,globalThis.createLazyFileRoute=Yc):typeof window<"u"&&(window.createFileRoute=Es,window.createLazyFileRoute=Yc);function w1({router:e,children:t,...n}){e.update({...e.options,...n,context:{...e.options.context,...n.context}});const o=e.options.Wrap||ar;return h(o,{get children(){return h(Nu.Provider,{value:e,get children(){return t()}})}})}function $1({router:e,...t}){return h(w1,vn({router:e},t,{children:()=>h(g1,{})}))}const S1=$i(),Ws=(e,t,n)=>(k1({tag:e,props:t,setting:n,id:Ud(),get name(){return t.name||t.property}}),null);function k1(e){const t=Wo(S1);if(!t)throw new Error("<MetaProvider /> should be in the tree");ie(()=>{const n=t.addTag(e);ot(()=>t.removeTag(e,n))})}const C1=e=>Ws("title",e,{escape:!0,close:!0}),M1=e=>Ws("style",e,{close:!0}),I1=e=>Ws("meta",e),R1=e=>Ws("link",e);var P1=$("<script>");function E1({tag:e,attrs:t,children:n}){switch(e){case"title":return h(C1,vn(t,{children:n}));case"meta":return h(I1,t);case"link":return h(R1,t);case"style":return h(M1,vn(t,{children:n}));case"script":return h(T1,{attrs:t,children:n});default:return null}}function T1({attrs:e,children:t}){kn();const n=typeof e?.type=="string"&&e.type!==""&&e.type!=="text/javascript"&&e.type!=="module";return Pn(()=>{if(!n){if(e?.src){const o=(()=>{try{const s=document.baseURI||window.location.href;return new URL(e.src,s).href}catch{return e.src}})();if(Array.from(document.querySelectorAll("script[src]")).find(s=>s.src===o))return;const i=document.createElement("script");for(const[s,l]of Object.entries(e))l!==void 0&&l!==!1&&i.setAttribute(s,typeof l=="boolean"?"":String(l));document.head.appendChild(i),ot(()=>{i.parentNode&&i.parentNode.removeChild(i)})}if(typeof t=="string"){const o=typeof e?.type=="string"?e.type:"text/javascript",r=typeof e?.nonce=="string"?e.nonce:void 0;if(Array.from(document.querySelectorAll("script:not([src])")).find(l=>{if(!(l instanceof HTMLScriptElement))return!1;const a=l.getAttribute("type")??"text/javascript",c=l.getAttribute("nonce")??void 0;return l.textContent===t&&a===o&&c===r}))return;const s=document.createElement("script");if(s.textContent=t,e)for(const[l,a]of Object.entries(e))a!==void 0&&a!==!1&&s.setAttribute(l,typeof a=="boolean"?"":String(a));document.head.appendChild(s),ot(()=>{s.parentNode&&s.parentNode.removeChild(s)})}}}),n&&typeof t=="string"?(()=>{var o=b(P1);return bo(o,vn(e,{innerHTML:t}),!1,!1),Ft(),o})():null}const L1=()=>{const e=kn(),t=e.options.ssr?.nonce,n=et(()=>e.stores.activeMatchesSnapshot.state),o=et(()=>{const l=[],a=e.ssr?.manifest;return a?(n().map(c=>e.looseRoutesById[c.routeId]).forEach(c=>a.routes[c.id]?.assets?.filter(d=>d.tag==="script").forEach(d=>{l.push({tag:"script",attrs:{...d.attrs,nonce:t},children:d.children})})),l):[]}),r=et(()=>n().map(l=>l.scripts).flat(1).filter(Boolean).map(({children:l,...a})=>({tag:"script",attrs:{...a,nonce:t},children:l})));let i;e.serverSsr&&(i=e.serverSsr.takeBufferedScripts());const s=[...r(),...o()];return i&&s.unshift(i),lt(()=>s.map((l,a)=>h(E1,l)))};function A1(e){return h($1,{get router(){return e.router}})}var B1="__TSS_CONTEXT",Ol=Symbol.for("TSS_SERVER_FUNCTION"),O1="application/x-tss-framed",mo={JSON:0,CHUNK:1,END:2,ERROR:3},D1=/;\s*v=(\d+)/;function F1(e){const t=e.match(D1);return t?parseInt(t[1],10):void 0}function N1(e){const t=F1(e);if(t!==void 0&&t!==1)throw new Error(`Incompatible framed protocol version: server=${t}, client=1. Please ensure client and server are using compatible versions.`)}var Wu=()=>window.__TSS_START_OPTIONS__;function z1(){return[...Wu()?.serializationAdapters?.map(Mm)??[],...zm]}var qc=new TextDecoder,H1=new Uint8Array(0),Qc=16*1024*1024,Kc=32*1024*1024,Gc=1024,Jc=1e5;function j1(e){const t=new Map,n=new Map,o=new Set;let r=!1,i=null,s=0,l;const a=new ReadableStream({start(u){l=u},cancel(){r=!0;try{i?.cancel()}catch{}t.forEach(u=>{try{u.error(new Error("Framed response cancelled"))}catch{}}),t.clear(),n.clear(),o.clear()}});function c(u){const _=n.get(u);if(_)return _;if(o.has(u))return new ReadableStream({start(g){g.close()}});if(n.size>=Gc)throw new Error(`Too many raw streams in framed response (max ${Gc})`);const m=new ReadableStream({start(g){t.set(u,g)},cancel(){o.add(u),t.delete(u),n.delete(u)}});return n.set(u,m),m}function d(u){return c(u),t.get(u)}return(async()=>{const u=e.getReader();i=u;const _=[];let m=0;function g(){if(m<9)return null;const f=_[0];if(f.length>=9)return{type:f[0],streamId:(f[1]<<24|f[2]<<16|f[3]<<8|f[4])>>>0,length:(f[5]<<24|f[6]<<16|f[7]<<8|f[8])>>>0};const p=new Uint8Array(9);let k=0,P=9;for(let R=0;R<_.length&&P>0;R++){const A=_[R],ee=Math.min(A.length,P);p.set(A.subarray(0,ee),k),k+=ee,P-=ee}return{type:p[0],streamId:(p[1]<<24|p[2]<<16|p[3]<<8|p[4])>>>0,length:(p[5]<<24|p[6]<<16|p[7]<<8|p[8])>>>0}}function v(f){if(f===0)return H1;const p=new Uint8Array(f);let k=0,P=f;for(;P>0&&_.length>0;){const R=_[0];if(!R)break;const A=Math.min(R.length,P);p.set(R.subarray(0,A),k),k+=A,P-=A,A===R.length?_.shift():_[0]=R.subarray(A)}return m-=f,p}try{for(;;){const{done:f,value:p}=await u.read();if(r||f)break;if(p){if(m+p.length>Kc)throw new Error(`Framed response buffer exceeded ${Kc} bytes`);for(_.push(p),m+=p.length;;){const k=g();if(!k)break;const{type:P,streamId:R,length:A}=k;if(P!==mo.JSON&&P!==mo.CHUNK&&P!==mo.END&&P!==mo.ERROR)throw new Error(`Unknown frame type: ${P}`);if(P===mo.JSON){if(R!==0)throw new Error("Invalid JSON frame streamId (expected 0)")}else if(R===0)throw new Error("Invalid raw frame streamId (expected non-zero)");if(A>Qc)throw new Error(`Frame payload too large: ${A} bytes (max ${Qc})`);const ee=9+A;if(m<ee)break;if(++s>Jc)throw new Error(`Too many frames in framed response (max ${Jc})`);v(9);const D=v(A);switch(P){case mo.JSON:try{l.enqueue(qc.decode(D))}catch{}break;case mo.CHUNK:{const K=d(R);K&&K.enqueue(D);break}case mo.END:{const K=d(R);if(o.add(R),K){try{K.close()}catch{}t.delete(R)}break}case mo.ERROR:{const K=d(R);if(o.add(R),K){const te=qc.decode(D);K.error(new Error(te)),t.delete(R)}break}}}}}if(m!==0)throw new Error("Incomplete frame at end of framed response");try{l.close()}catch{}t.forEach(f=>{try{f.close()}catch{}}),t.clear()}catch(f){try{l.error(f)}catch{}t.forEach(p=>{try{p.error(f)}catch{}}),t.clear()}finally{try{u.releaseLock()}catch{}i=null}})(),{getOrCreateStream:c,jsonChunks:a}}var Ar=null,U1=Object.prototype.hasOwnProperty;function Yu(e){for(const t in e)if(U1.call(e,t))return!0;return!1}async function W1(e,t,n){Ar||(Ar=z1());const o=t[0],r=o.fetch??n,i=o.data instanceof FormData?"formData":"payload",s=o.headers?new Headers(o.headers):new Headers;if(s.set("x-tsr-serverFn","true"),i==="payload"&&s.set("accept",`${O1}, application/x-ndjson, application/json`),o.method==="GET"){if(i==="formData")throw new Error("FormData is not supported with GET requests");const a=await Vu(o);if(a!==void 0){const c=Zd({payload:a});e.includes("?")?e+=`&${c}`:e+=`?${c}`}}let l;if(o.method==="POST"){const a=await Y1(o);a?.contentType&&s.set("content-type",a.contentType),l=a?.body}return await V1(async()=>r(e,{method:o.method,headers:s,signal:o.signal,body:l}))}async function Vu(e){let t=!1;const n={};if(e.data!==void 0&&(t=!0,n.data=e.data),e.context&&Yu(e.context)&&(t=!0,n.context=e.context),t)return Xu(n)}async function Xu(e){return JSON.stringify(await Promise.resolve(Cm(e,{plugins:Ar})))}async function Y1(e){if(e.data instanceof FormData){let n;return e.context&&Yu(e.context)&&(n=await Xu(e.context)),n!==void 0&&e.data.set(B1,n),{body:e.data}}const t=await Vu(e);if(t)return{body:t,contentType:"application/json"}}async function V1(e){let t;try{t=await e()}catch(o){if(o instanceof Response)t=o;else throw console.log(o),o}if(t.headers.get("x-tss-raw")==="true")return t;const n=t.headers.get("content-type");if(n||Zn(),t.headers.get("x-tss-serialized")){let o;if(n.includes("application/x-tss-framed")){if(N1(n),!t.body)throw new Error("No response body for framed response");const{getOrCreateStream:r,jsonChunks:i}=j1(t.body),s=[Bm(r),...Ar||[]],l=new Map;o=await q1({jsonStream:i,onMessage:a=>fl(a,{refs:l,plugins:s}),onError(a,c){console.error(a,c)}})}else if(n.includes("application/x-ndjson")){const r=new Map;o=await X1({response:t,onMessage:i=>fl(i,{refs:r,plugins:Ar}),onError(i,s){console.error(i,s)}})}else n.includes("application/json")&&(o=fl(await t.json(),{plugins:Ar}));if(o||Zn(),o instanceof Error)throw o;return o}if(n.includes("application/json")){const o=await t.json(),r=Tf(o);if(r)throw r;if(xn(o))throw o;return o}if(!t.ok)throw new Error(await t.text());return t}async function X1({response:e,onMessage:t,onError:n}){if(!e.body)throw new Error("No response body");const o=e.body.pipeThrough(new TextDecoderStream).getReader();let r="",i=!1,s;for(;!i;){const{value:l,done:a}=await o.read();if(l&&(r+=l),r.length===0&&a)throw new Error("Stream ended before first object");if(r.endsWith(`
`)){const c=r.split(`
`).filter(Boolean),d=c[0];if(!d)throw new Error("No JSON line in the first chunk");s=JSON.parse(d),i=!0,r=c.slice(1).join(`
`)}else{const c=r.indexOf(`
`);if(c>=0){const d=r.slice(0,c).trim();r=r.slice(c+1),d.length>0&&(s=JSON.parse(d),i=!0)}}}return(async()=>{try{for(;;){const{value:l,done:a}=await o.read();l&&(r+=l);const c=r.lastIndexOf(`
`);if(c>=0){const d=r.slice(0,c);r=r.slice(c+1);const u=d.split(`
`).filter(Boolean);for(const _ of u)try{t(JSON.parse(_))}catch(m){n?.(`Invalid JSON line: ${_}`,m)}}if(a)break}}catch(l){n?.("Stream processing error:",l)}})(),t(s)}async function q1({jsonStream:e,onMessage:t,onError:n}){const o=e.getReader(),{value:r,done:i}=await o.read();if(i||!r)throw new Error("Stream ended before first object");const s=JSON.parse(r);return(async()=>{try{for(;;){const{value:l,done:a}=await o.read();if(a)break;if(l)try{t(JSON.parse(l))}catch(c){n?.(`Invalid JSON: ${l}`,c)}}}catch(l){n?.("Stream processing error:",l)}})(),t(s)}function Q1(e){const t="/_serverFn/"+e;return Object.assign((...r)=>{const i=Wu()?.serverFns?.fetch;return W1(t,r,i??fetch)},{url:t,serverFnMeta:{id:e},[Ol]:!0})}var K1={key:"$TSS/serverfn",test:e=>typeof e!="function"||!(Ol in e)?!1:!!e[Ol],toSerializable:({serverFnMeta:e})=>({functionId:e.id}),fromSerializable:({functionId:e})=>Q1(e)};function Zc(e){return e.replaceAll("\0","/").replaceAll("�","/")}function G1(e,t){e.id=t.i,e.__beforeLoadContext=t.b,e.loaderData=t.l,e.status=t.s,e.ssr=t.ssr,e.updatedAt=t.u,e.error=t.e,t.g!==void 0&&(e.globalNotFound=t.g)}async function J1(e){window.$_TSR||Zn();const t=e.options.serializationAdapters;if(t?.length){const f=new Map;t.forEach(p=>{f.set(p.key,p.fromSerializable)}),window.$_TSR.t=f,window.$_TSR.buffer.forEach(p=>p())}window.$_TSR.initialized=!0,window.$_TSR.router||Zn();const n=window.$_TSR.router;n.matches.forEach(f=>{f.i=Zc(f.i)}),n.lastMatchId&&(n.lastMatchId=Zc(n.lastMatchId));const{manifest:o,dehydratedData:r,lastMatchId:i}=n;e.ssr={manifest:o};const s=document.querySelector('meta[property="csp-nonce"]')?.content;e.options.ssr={nonce:s};const l=e.matchRoutes(e.stores.location.state),a=Promise.all(l.map(f=>e.loadRouteChunk(e.looseRoutesById[f.routeId])));function c(f){const p=e.looseRoutesById[f.routeId].options.pendingMinMs??e.options.defaultPendingMinMs;if(p){const k=hr();f._nonReactive.minPendingPromise=k,f._forcePending=!0,setTimeout(()=>{k.resolve(),e.updateMatch(f.id,P=>(P._nonReactive.minPendingPromise=void 0,{...P,_forcePending:void 0}))},p)}}function d(f){const p=e.looseRoutesById[f.routeId];p&&(p.options.ssr=f.ssr)}let u;l.forEach(f=>{const p=n.matches.find(k=>k.i===f.id);if(!p){f._nonReactive.dehydrated=!1,f.ssr=!1,d(f);return}G1(f,p),d(f),f._nonReactive.dehydrated=f.ssr!==!1,(f.ssr==="data-only"||f.ssr===!1)&&u===void 0&&(u=f.index,c(f))}),e.stores.setActiveMatches(l),await e.options.hydrate?.(r);const _=e.stores.activeMatchesSnapshot.state,m=e.stores.location.state;await Promise.all(_.map(async f=>{try{const p=e.looseRoutesById[f.routeId],k=_[f.index-1]?.context??e.options.context;if(p.options.context){const ee={deps:f.loaderDeps,params:f.params,context:k??{},location:m,navigate:D=>e.navigate({...D,_fromLocation:m}),buildLocation:e.buildLocation,cause:f.cause,abortController:f.abortController,preload:!1,matches:l,routeId:p.id};f.__routeContext=p.options.context(ee)??void 0}f.context={...k,...f.__routeContext,...f.__beforeLoadContext};const P={ssr:e.options.ssr,matches:_,match:f,params:f.params,loaderData:f.loaderData},R=await p.options.head?.(P),A=await p.options.scripts?.(P);f.meta=R?.meta,f.links=R?.links,f.headScripts=R?.scripts,f.styles=R?.styles,f.scripts=A}catch(p){if(xn(p))f.error={isNotFound:!0},console.error(`NotFound error during hydration for routeId: ${f.routeId}`,p);else throw f.error=p,console.error(`Error during hydration for route ${f.routeId}:`,p),p}}));const g=l[l.length-1].id!==i;if(!l.some(f=>f.ssr===!1)&&!g)return l.forEach(f=>{f._nonReactive.dehydrated=void 0}),a;const v=Promise.resolve().then(()=>e.load()).catch(f=>{console.error("Error during router hydration:",f)});if(g){const f=l[1];f||Zn(),c(f),f._displayPending=!0,f._nonReactive.displayPendingPromise=v,v.then(()=>{e.batch(()=>{e.stores.status.state==="pending"&&e.batch(()=>{e.stores.status.setState(()=>"idle"),e.stores.resolvedLocation.setState(()=>e.stores.location.state)}),e.updateMatch(f.id,p=>({...p,_displayPending:void 0,displayPendingPromise:void 0}))})})}return a}var Z1=$('<svg viewBox="0 0 16 16"fill=none><path d="M8 3v10M3 8h10"stroke=currentColor stroke-width=1.5 stroke-linecap=round>'),ep=$('<svg viewBox="0 0 24 24"fill=none><g clip-path=url(#clip0_list_sparkle)><path d="M11.5 12L5.5 12"stroke=currentColor stroke-width=1.5 stroke-linecap=round stroke-linejoin=round></path><path d="M18.5 6.75L5.5 6.75"stroke=currentColor stroke-width=1.5 stroke-linecap=round stroke-linejoin=round></path><path d="M9.25 17.25L5.5 17.25"stroke=currentColor stroke-width=1.5 stroke-linecap=round stroke-linejoin=round></path><path d="M16 12.75L16.5179 13.9677C16.8078 14.6494 17.3506 15.1922 18.0323 15.4821L19.25 16L18.0323 16.5179C17.3506 16.8078 16.8078 17.3506 16.5179 18.0323L16 19.25L15.4821 18.0323C15.1922 17.3506 14.6494 16.8078 13.9677 16.5179L12.75 16L13.9677 15.4821C14.6494 15.1922 15.1922 14.6494 15.4821 13.9677L16 12.75Z"stroke=currentColor stroke-width=1.5 stroke-linejoin=round></path></g><defs><clipPath id=clip0_list_sparkle><rect width=24 height=24 fill=white>'),tp=$('<svg viewBox="0 0 20 20"fill=none xmlns=http://www.w3.org/2000/svg><circle cx=10 cy=10 r=5.375 stroke=currentColor stroke-width=1.25></circle><path d="M8.5 8.5C8.73 7.85 9.31 7.49 10 7.5C10.86 7.51 11.5 8.13 11.5 9C11.5 10.08 10 10.5 10 10.5V10.75"stroke=currentColor stroke-width=1.25 stroke-linecap=round stroke-linejoin=round></path><circle cx=10 cy=12.625 r=0.625 fill=currentColor>'),np=$('<svg viewBox="0 0 24 24"fill=none><g><path d="M4.75 11.25C4.75 10.4216 5.42157 9.75 6.25 9.75H12.75C13.5784 9.75 14.25 10.4216 14.25 11.25V17.75C14.25 18.5784 13.5784 19.25 12.75 19.25H6.25C5.42157 19.25 4.75 18.5784 4.75 17.75V11.25Z"stroke=currentColor stroke-width=1.5></path><path d="M17.25 14.25H17.75C18.5784 14.25 19.25 13.5784 19.25 12.75V6.25C19.25 5.42157 18.5784 4.75 17.75 4.75H11.25C10.4216 4.75 9.75 5.42157 9.75 6.25V6.75"stroke=currentColor stroke-width=1.5 stroke-linecap=round></path></g><g><path d="M12 20C7.58172 20 4 16.4182 4 12C4 7.58172 7.58172 4 12 4C16.4182 4 20 7.58172 20 12C20 16.4182 16.4182 20 12 20Z"stroke=var(--agentation-color-green) stroke-width=1.5 stroke-linecap=round stroke-linejoin=round></path><path d="M15 10L11 14.25L9.25 12.25"stroke=var(--agentation-color-green) stroke-width=1.5 stroke-linecap=round stroke-linejoin=round>'),op=$('<svg viewBox="0 0 24 24"fill=none><g><path d="M9.875 14.125L12.3506 19.6951C12.7184 20.5227 13.9091 20.4741 14.2083 19.6193L18.8139 6.46032C19.0907 5.6695 18.3305 4.90933 17.5397 5.18611L4.38072 9.79174C3.52589 10.0909 3.47731 11.2816 4.30494 11.6494L9.875 14.125ZM9.875 14.125L13.375 10.625"stroke=currentColor stroke-width=1.5 stroke-linecap=round stroke-linejoin=round></path></g><g><path d="M12 20C7.58172 20 4 16.4182 4 12C4 7.58172 7.58172 4 12 4C16.4182 4 20 7.58172 20 12C20 16.4182 16.4182 20 12 20Z"stroke=var(--agentation-color-green) stroke-width=1.5 stroke-linecap=round stroke-linejoin=round></path><path d="M15 10L11 14.25L9.25 12.25"stroke=var(--agentation-color-green) stroke-width=1.5 stroke-linecap=round stroke-linejoin=round></path></g><g><path d="M12 20C7.58172 20 4 16.4182 4 12C4 7.58172 7.58172 4 12 4C16.4182 4 20 7.58172 20 12C20 16.4182 16.4182 20 12 20Z"stroke=var(--agentation-color-red) stroke-width=1.5 stroke-linecap=round stroke-linejoin=round></path><path d="M12 8V12"stroke=var(--agentation-color-red) stroke-width=1.5 stroke-linecap=round></path><circle cx=12 cy=15 r=0.5 fill=var(--agentation-color-red) stroke=var(--agentation-color-red) stroke-width=1>'),rp=$('<svg viewBox="0 0 24 24"fill=none><g><path d="M3.91752 12.7539C3.65127 12.2996 3.65037 11.7515 3.9149 11.2962C4.9042 9.59346 7.72688 5.49994 12 5.49994C16.2731 5.49994 19.0958 9.59346 20.0851 11.2962C20.3496 11.7515 20.3487 12.2996 20.0825 12.7539C19.0908 14.4459 16.2694 18.4999 12 18.4999C7.73064 18.4999 4.90918 14.4459 3.91752 12.7539Z"stroke=currentColor stroke-width=1.5 stroke-linecap=round stroke-linejoin=round></path><path d="M12 14.8261C13.5608 14.8261 14.8261 13.5608 14.8261 12C14.8261 10.4392 13.5608 9.17392 12 9.17392C10.4392 9.17392 9.17391 10.4392 9.17391 12C9.17391 13.5608 10.4392 14.8261 12 14.8261Z"stroke=currentColor stroke-width=1.5 stroke-linecap=round stroke-linejoin=round></path></g><g><path d="M18.6025 9.28503C18.9174 8.9701 19.4364 8.99481 19.7015 9.35271C20.1484 9.95606 20.4943 10.507 20.7342 10.9199C21.134 11.6086 21.1329 12.4454 20.7303 13.1328C20.2144 14.013 19.2151 15.5225 17.7723 16.8193C16.3293 18.1162 14.3852 19.2497 12.0008 19.25C11.4192 19.25 10.8638 19.1823 10.3355 19.0613C9.77966 18.934 9.63498 18.2525 10.0382 17.8493C10.2412 17.6463 10.5374 17.573 10.8188 17.6302C11.1993 17.7076 11.5935 17.75 12.0008 17.75C13.8848 17.7497 15.4867 16.8568 16.7693 15.7041C18.0522 14.5511 18.9606 13.1867 19.4363 12.375C19.5656 12.1543 19.5659 11.8943 19.4373 11.6729C19.2235 11.3049 18.921 10.8242 18.5364 10.3003C18.3085 9.98991 18.3302 9.5573 18.6025 9.28503ZM12.0008 4.75C12.5814 4.75006 13.1358 4.81803 13.6632 4.93953C14.2182 5.06741 14.362 5.74812 13.9593 6.15091C13.7558 6.35435 13.4589 6.42748 13.1771 6.36984C12.7983 6.29239 12.4061 6.25006 12.0008 6.25C10.1167 6.25 8.51415 7.15145 7.23028 8.31543C5.94678 9.47919 5.03918 10.8555 4.56426 11.6729C4.43551 11.8945 4.43582 12.1542 4.56524 12.375C4.77587 12.7343 5.07189 13.2012 5.44718 13.7105C5.67623 14.0213 5.65493 14.4552 5.38193 14.7282C5.0671 15.0431 4.54833 15.0189 4.28292 14.6614C3.84652 14.0736 3.50813 13.5369 3.27129 13.1328C2.86831 12.4451 2.86717 11.6088 3.26739 10.9199C3.78185 10.0345 4.77959 8.51239 6.22247 7.2041C7.66547 5.89584 9.61202 4.75 12.0008 4.75Z"fill=currentColor></path><path d="M5 19L19 5"stroke=currentColor stroke-width=1.5 stroke-linecap=round>'),ip=$('<svg viewBox="0 0 24 24"fill=none><g><path d="M8 6L8 18"stroke=currentColor stroke-width=1.5 stroke-linecap=round></path><path d="M16 18L16 6"stroke=currentColor stroke-width=1.5 stroke-linecap=round></path></g><path d="M17.75 10.701C18.75 11.2783 18.75 12.7217 17.75 13.299L8.75 18.4952C7.75 19.0725 6.5 18.3509 6.5 17.1962L6.5 6.80384C6.5 5.64914 7.75 4.92746 8.75 5.50481L17.75 10.701Z"stroke=currentColor stroke-width=1.5>'),sp=$('<svg viewBox="0 0 24 24"fill=none><path d="M10.6504 5.81117C10.9939 4.39628 13.0061 4.39628 13.3496 5.81117C13.5715 6.72517 14.6187 7.15891 15.4219 6.66952C16.6652 5.91193 18.0881 7.33479 17.3305 8.57815C16.8411 9.38134 17.2748 10.4285 18.1888 10.6504C19.6037 10.9939 19.6037 13.0061 18.1888 13.3496C17.2748 13.5715 16.8411 14.6187 17.3305 15.4219C18.0881 16.6652 16.6652 18.0881 15.4219 17.3305C14.6187 16.8411 13.5715 17.2748 13.3496 18.1888C13.0061 19.6037 10.9939 19.6037 10.6504 18.1888C10.4285 17.2748 9.38135 16.8411 8.57815 17.3305C7.33479 18.0881 5.91193 16.6652 6.66952 15.4219C7.15891 14.6187 6.72517 13.5715 5.81117 13.3496C4.39628 13.0061 4.39628 10.9939 5.81117 10.6504C6.72517 10.4285 7.15891 9.38134 6.66952 8.57815C5.91193 7.33479 7.33479 5.91192 8.57815 6.66952C9.38135 7.15891 10.4285 6.72517 10.6504 5.81117Z"stroke=currentColor stroke-width=1.5 stroke-linecap=round stroke-linejoin=round></path><circle cx=12 cy=12 r=2.5 stroke=currentColor stroke-width=1.5>'),lp=$('<svg viewBox="0 0 24 24"fill=none><path d="M13.5 4C14.7426 4 15.75 5.00736 15.75 6.25V7H18.5C18.9142 7 19.25 7.33579 19.25 7.75C19.25 8.16421 18.9142 8.5 18.5 8.5H17.9678L17.6328 16.2217C17.61 16.7475 17.5912 17.1861 17.5469 17.543C17.5015 17.9087 17.4225 18.2506 17.2461 18.5723C16.9747 19.0671 16.5579 19.4671 16.0518 19.7168C15.7227 19.8791 15.3772 19.9422 15.0098 19.9717C14.6514 20.0004 14.2126 20 13.6865 20H10.3135C9.78735 20 9.34856 20.0004 8.99023 19.9717C8.62278 19.9422 8.27729 19.8791 7.94824 19.7168C7.44205 19.4671 7.02532 19.0671 6.75391 18.5723C6.57751 18.2506 6.49853 17.9087 6.45312 17.543C6.40883 17.1861 6.39005 16.7475 6.36719 16.2217L6.03223 8.5H5.5C5.08579 8.5 4.75 8.16421 4.75 7.75C4.75 7.33579 5.08579 7 5.5 7H8.25V6.25C8.25 5.00736 9.25736 4 10.5 4H13.5ZM7.86621 16.1562C7.89013 16.7063 7.90624 17.0751 7.94141 17.3584C7.97545 17.6326 8.02151 17.7644 8.06934 17.8516C8.19271 18.0763 8.38239 18.2577 8.6123 18.3711C8.70153 18.4151 8.83504 18.4545 9.11035 18.4766C9.39482 18.4994 9.76335 18.5 10.3135 18.5H13.6865C14.2367 18.5 14.6052 18.4994 14.8896 18.4766C15.165 18.4545 15.2985 18.4151 15.3877 18.3711C15.6176 18.2577 15.8073 18.0763 15.9307 17.8516C15.9785 17.7644 16.0245 17.6326 16.0586 17.3584C16.0938 17.0751 16.1099 16.7063 16.1338 16.1562L16.4668 8.5H7.5332L7.86621 16.1562ZM9.97656 10.75C10.3906 10.7371 10.7371 11.0626 10.75 11.4766L10.875 15.4766C10.8879 15.8906 10.5624 16.2371 10.1484 16.25C9.73443 16.2629 9.38794 15.9374 9.375 15.5234L9.25 11.5234C9.23706 11.1094 9.56255 10.7629 9.97656 10.75ZM14.0244 10.75C14.4384 10.7635 14.7635 11.1105 14.75 11.5244L14.6201 15.5244C14.6066 15.9384 14.2596 16.2634 13.8457 16.25C13.4317 16.2365 13.1067 15.8896 13.1201 15.4756L13.251 11.4756C13.2645 11.0617 13.6105 10.7366 14.0244 10.75ZM10.5 5.5C10.0858 5.5 9.75 5.83579 9.75 6.25V7H14.25V6.25C14.25 5.83579 13.9142 5.5 13.5 5.5H10.5Z"fill=currentColor>'),ap=$('<svg viewBox="0 0 24 24"fill=none><g clip-path=url(#clip0_2_53)><path d="M16.25 16.25L7.75 7.75"stroke=currentColor stroke-width=1.5 stroke-linecap=round stroke-linejoin=round></path><path d="M7.75 16.25L16.25 7.75"stroke=currentColor stroke-width=1.5 stroke-linecap=round stroke-linejoin=round></path></g><defs><clipPath id=clip0_2_53><rect width=24 height=24 fill=white>'),cp=$('<svg viewBox="0 0 24 24"fill=none><path d="M16.7198 6.21973C17.0127 5.92683 17.4874 5.92683 17.7803 6.21973C18.0732 6.51262 18.0732 6.9874 17.7803 7.28027L13.0606 12L17.7803 16.7197C18.0732 17.0126 18.0732 17.4874 17.7803 17.7803C17.4875 18.0731 17.0127 18.0731 16.7198 17.7803L12.0001 13.0605L7.28033 17.7803C6.98746 18.0731 6.51268 18.0731 6.21979 17.7803C5.92689 17.4874 5.92689 17.0126 6.21979 16.7197L10.9395 12L6.21979 7.28027C5.92689 6.98738 5.92689 6.51262 6.21979 6.21973C6.51268 5.92683 6.98744 5.92683 7.28033 6.21973L12.0001 10.9395L16.7198 6.21973Z"fill=currentColor>'),dp=$('<svg viewBox="0 0 20 20"fill=none><path d="M9.99999 12.7082C11.4958 12.7082 12.7083 11.4956 12.7083 9.99984C12.7083 8.50407 11.4958 7.2915 9.99999 7.2915C8.50422 7.2915 7.29166 8.50407 7.29166 9.99984C7.29166 11.4956 8.50422 12.7082 9.99999 12.7082Z"stroke=currentColor stroke-width=1.25 stroke-linecap=round stroke-linejoin=round></path><path d="M10 3.9585V5.05698"stroke=currentColor stroke-width=1.25 stroke-linecap=round stroke-linejoin=round></path><path d="M10 14.9429V16.0414"stroke=currentColor stroke-width=1.25 stroke-linecap=round stroke-linejoin=round></path><path d="M5.7269 5.72656L6.50682 6.50649"stroke=currentColor stroke-width=1.25 stroke-linecap=round stroke-linejoin=round></path><path d="M13.4932 13.4932L14.2731 14.2731"stroke=currentColor stroke-width=1.25 stroke-linecap=round stroke-linejoin=round></path><path d="M3.95834 10H5.05683"stroke=currentColor stroke-width=1.25 stroke-linecap=round stroke-linejoin=round></path><path d="M14.9432 10H16.0417"stroke=currentColor stroke-width=1.25 stroke-linecap=round stroke-linejoin=round></path><path d="M5.7269 14.2731L6.50682 13.4932"stroke=currentColor stroke-width=1.25 stroke-linecap=round stroke-linejoin=round></path><path d="M13.4932 6.50649L14.2731 5.72656"stroke=currentColor stroke-width=1.25 stroke-linecap=round stroke-linejoin=round>'),up=$('<svg viewBox="0 0 20 20"fill=none><path d="M15.5 10.4955C15.4037 11.5379 15.0124 12.5314 14.3721 13.3596C13.7317 14.1878 12.8688 14.8165 11.8841 15.1722C10.8995 15.5278 9.83397 15.5957 8.81217 15.3679C7.79038 15.1401 6.8546 14.6259 6.11434 13.8857C5.37408 13.1454 4.85995 12.2096 4.63211 11.1878C4.40427 10.166 4.47215 9.10048 4.82781 8.11585C5.18346 7.13123 5.81218 6.26825 6.64039 5.62791C7.4686 4.98756 8.46206 4.59634 9.5045 4.5C8.89418 5.32569 8.60049 6.34302 8.67685 7.36695C8.75321 8.39087 9.19454 9.35339 9.92058 10.0794C10.6466 10.8055 11.6091 11.2468 12.6331 11.3231C13.657 11.3995 14.6743 11.1058 15.5 10.4955Z"stroke=currentColor stroke-width=1.13793 stroke-linecap=round stroke-linejoin=round>'),_p=$('<svg viewBox="0 0 16 16"fill=none xmlns=http://www.w3.org/2000/svg><path d="M11.3799 6.9572L9.05645 4.63375M11.3799 6.9572L6.74949 11.5699C6.61925 11.6996 6.45577 11.791 6.277 11.8339L4.29549 12.3092C3.93194 12.3964 3.60478 12.0683 3.69297 11.705L4.16585 9.75693C4.20893 9.57947 4.29978 9.4172 4.42854 9.28771L9.05645 4.63375M11.3799 6.9572L12.3455 5.98759C12.9839 5.34655 12.9839 4.31002 12.3455 3.66897C11.7033 3.02415 10.6594 3.02415 10.0172 3.66897L9.06126 4.62892L9.05645 4.63375"stroke=currentColor stroke-width=0.9 stroke-linecap=round stroke-linejoin=round>'),hp=$('<svg viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M13.5 4C14.7426 4 15.75 5.00736 15.75 6.25V7H18.5C18.9142 7 19.25 7.33579 19.25 7.75C19.25 8.16421 18.9142 8.5 18.5 8.5H17.9678L17.6328 16.2217C17.61 16.7475 17.5912 17.1861 17.5469 17.543C17.5015 17.9087 17.4225 18.2506 17.2461 18.5723C16.9747 19.0671 16.5579 19.4671 16.0518 19.7168C15.7227 19.8791 15.3772 19.9422 15.0098 19.9717C14.6514 20.0004 14.2126 20 13.6865 20H10.3135C9.78735 20 9.34856 20.0004 8.99023 19.9717C8.62278 19.9422 8.27729 19.8791 7.94824 19.7168C7.44205 19.4671 7.02532 19.0671 6.75391 18.5723C6.57751 18.2506 6.49853 17.9087 6.45312 17.543C6.40883 17.1861 6.39005 16.7475 6.36719 16.2217L6.03223 8.5H5.5C5.08579 8.5 4.75 8.16421 4.75 7.75C4.75 7.33579 5.08579 7 5.5 7H8.25V6.25C8.25 5.00736 9.25736 4 10.5 4H13.5ZM7.86621 16.1562C7.89013 16.7063 7.90624 17.0751 7.94141 17.3584C7.97545 17.6326 8.02151 17.7644 8.06934 17.8516C8.19271 18.0763 8.38239 18.2577 8.6123 18.3711C8.70153 18.4151 8.83504 18.4545 9.11035 18.4766C9.39482 18.4994 9.76335 18.5 10.3135 18.5H13.6865C14.2367 18.5 14.6052 18.4994 14.8896 18.4766C15.165 18.4545 15.2985 18.4151 15.3877 18.3711C15.6176 18.2577 15.8073 18.0763 15.9307 17.8516C15.9785 17.7644 16.0245 17.6326 16.0586 17.3584C16.0938 17.0751 16.1099 16.7063 16.1338 16.1562L16.4668 8.5H7.5332L7.86621 16.1562ZM9.97656 10.75C10.3906 10.7371 10.7371 11.0626 10.75 11.4766L10.875 15.4766C10.8879 15.8906 10.5624 16.2371 10.1484 16.25C9.73443 16.2629 9.38794 15.9374 9.375 15.5234L9.25 11.5234C9.23706 11.1094 9.56255 10.7629 9.97656 10.75ZM14.0244 10.75C14.4383 10.7635 14.7635 11.1105 14.75 11.5244L14.6201 15.5244C14.6066 15.9384 14.2596 16.2634 13.8457 16.25C13.4317 16.2365 13.1067 15.8896 13.1201 15.4756L13.251 11.4756C13.2645 11.0617 13.6105 10.7366 14.0244 10.75ZM10.5 5.5C10.0858 5.5 9.75 5.83579 9.75 6.25V7H14.25V6.25C14.25 5.83579 13.9142 5.5 13.5 5.5H10.5Z"fill=currentColor>'),fp=$('<svg viewBox="0 0 16 16"fill=none xmlns=http://www.w3.org/2000/svg><path d="M8.5 3.5L4 8L8.5 12.5"stroke=currentColor stroke-width=1.5 stroke-linecap=round stroke-linejoin=round>'),gp=$('<svg viewBox="0 0 24 24"fill=none><rect x=3 y=3 width=18 height=18 rx=2 stroke=currentColor stroke-width=1.5></rect><line x1=3 y1=9 x2=21 y2=9 stroke=currentColor stroke-width=1.5></line><line x1=9 y1=9 x2=9 y2=21 stroke=currentColor stroke-width=1.5>'),mp=$('<button type=button><svg width=14 height=14 viewBox="0 0 14 14"fill=none xmlns=http://www.w3.org/2000/svg><path d="M5.5 10.25L9 7.25L5.75 4"stroke=currentColor stroke-width=1.5 stroke-linecap=round stroke-linejoin=round></path></svg><span>'),xo=$("<span>"),pp=$("<div><div><div>"),yp=$("<div>&ldquo;<!$><!/><!$><!/>&rdquo;"),xp=$("<div><button type=button>"),bp=$("<div data-annotation-popup><div><!$><!/><!$><!/></div><!$><!/><!$><!/><textarea rows=2></textarea><div><!$><!/><button>Cancel</button><button>"),vp=$("<div><span></span>: <span></span>;"),wp=$('<div data-feedback-toolbar style="position:fixed;transform:translateY(-50%);padding:6px 10px;background:#383838;color:rgba(255, 255, 255, 0.7);font-size:11px;font-weight:400;line-height:14px;border-radius:10px;width:180px;text-align:left;z-index:100020;pointer-events:none;box-shadow:0px 1px 8px rgba(0, 0, 0, 0.28);transition:opacity 0.15s ease">'),$p=$("<div style=border-radius:2;flex-shrink:0>"),Sp=$('<div style="border:1px dashed var(--agd-stroke);background:var(--agd-fill);flex-shrink:0">'),kp=$('<div style="border-radius:50%;border:1px dashed var(--agd-stroke);background:var(--agd-fill);flex-shrink:0">'),Cp=$("<div style=display:flex;align-items:center;height:100%><!$><!/><div style=flex:1;display:flex><!$><!/><!$><!/><!$><!/><!$><!/></div><!$><!/>"),Mp=$("<div style=display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%><!$><!/><!$><!/><!$><!/><!$><!/>"),Ip=$("<span style=font-weight:600;color:var(--agd-text-3);text-align:center;max-width:80%>"),Rp=$("<div style=display:flex;flex-direction:column><!$><!/><!$><!/>"),Pp=$("<div style=display:flex;align-items:center;gap:6><!$><!/><!$><!/>"),Ep=$("<div style=display:flex>"),Tp=$("<div style=flex:1;display:flex;flex-direction:column;gap:4><!$><!/><!$><!/><!$><!/><!$><!/>"),Lp=$('<div style=height:100%;display:flex;flex-direction:column><div style="padding:10px 12px;border-bottom:1px solid var(--agd-stroke);display:flex;align-items:center;justify-content:space-between"><!$><!/><div style="width:14;height:14;border:1px solid var(--agd-stroke);border-radius:3"></div></div><div style=flex:1;padding:12;display:flex;flex-direction:column;gap:6><!$><!/><!$><!/><!$><!/></div><div style="padding:10px 12px;border-top:1px solid var(--agd-stroke);display:flex;justify-content:flex-end;gap:8"><!$><!/><!$><!/>'),Ap=$('<div style=height:100%;display:flex;flex-direction:column><div style="height:40%;background:var(--agd-fill);border-bottom:1px dashed var(--agd-stroke)"></div><div style=flex:1;padding:10;display:flex;flex-direction:column;gap:5><!$><!/><!$><!/><!$><!/><!$><!/>'),Bp=$("<div style=padding:4;line-height:1.5;color:var(--agd-text-3);word-break:break-word;overflow:hidden>"),Op=$("<div style=display:flex;flex-direction:column;gap:6;padding:4><!$><!/><!$><!/>"),Dp=$("<div style=height:100%;position:relative><svg width=100% height=100% preserveAspectRatio=none fill=none><line x1=0 y1=0 stroke=var(--agd-stroke) stroke-width=1></line><line y1=0 x2=0 stroke=var(--agd-stroke) stroke-width=1></line><circle fill=var(--agd-fill) stroke=var(--agd-stroke) stroke-width=0.8>"),Fp=$('<div style=height:100%;display:flex;flex-direction:column><div style="display:flex;border-bottom:1px solid var(--agd-stroke);padding:6px 0"></div><!$><!/>'),ed=$('<div style="flex:1;padding:0 8px">'),Np=$('<div style="display:flex;border-bottom:1px solid rgba(255,255,255,0.03);padding:6px 0">'),zp=$("<div style=display:flex;flex-direction:column;gap:4;padding:4>"),Hp=$('<div style="display:flex;align-items:center;gap:8;padding:4px 0"><!$><!/><!$><!/>'),qu=$('<div style="height:100%;border:1px solid var(--agd-stroke);background:var(--agd-fill);display:flex;align-items:center;justify-content:center">'),jp=$("<span style=font-weight:500;color:var(--agd-text-3);letter-spacing:-0.01em>"),Up=$('<div style=display:flex;flex-direction:column;gap:4;height:100%;justify-content:center><!$><!/><div style="border-radius:4;border:1px dashed var(--agd-stroke);background:var(--agd-fill);display:flex;align-items:center;padding-left:8">'),Wp=$("<div style=display:flex;flex-direction:column;padding:8><!$><!/><!$><!/>"),Yp=$("<div style=display:flex;flex-direction:column;gap:4><!$><!/><!$><!/>"),Vp=$('<div style=height:100%;display:flex;flex-direction:column><div style="display:flex;gap:2;border-bottom:1px solid var(--agd-stroke)"></div><div style=flex:1;padding:12;display:flex;flex-direction:column;gap:6><!$><!/><!$><!/><!$><!/>'),Xp=$('<div style="padding:8px 12px">'),qp=$('<svg width=100% height=100% fill=none><circle stroke=var(--agd-stroke) fill=var(--agd-fill) stroke-width=1.5 stroke-dasharray="3 2"></circle><circle stroke=var(--agd-stroke) fill=var(--agd-fill) stroke-width=0.8></circle><path stroke=var(--agd-stroke) fill=var(--agd-fill) stroke-width=0.8>'),Qp=$("<div style=display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%><!$><!/><!$><!/>"),Kp=$("<div style=display:flex;flex-direction:column;height:100%><!$><!/><!$><!/><!$><!/><div style=flex:1;display:flex><!$><!/><!$><!/><!$><!/>"),Gp=$("<div style=display:grid;gap:6;height:100%>"),Jp=$('<div style=height:100%;display:flex;flex-direction:column><div style="padding:6px 8px;border-bottom:1px solid var(--agd-stroke)"></div><div style=flex:1;padding:4;display:flex;flex-direction:column;gap:2>'),Zp=$('<div style="padding:4px 6px;border-radius:3">'),ey=$("<svg width=100% height=100% fill=none><rect x=1 y=1 stroke=var(--agd-stroke) stroke-width=1></rect><circle fill=var(--agd-bar)>"),ty=$('<div style="height:100%;border:1px dashed var(--agd-stroke);background:var(--agd-fill);display:flex;align-items:center;gap:6"><!$><!/><!$><!/>'),ny=$('<div style="height:100%;border-radius:8;border:1px dashed var(--agd-stroke);background:var(--agd-fill);display:flex;align-items:center;padding:0 10px;gap:8"><!$><!/><div style=flex:1;display:flex;flex-direction:column;gap:3><!$><!/><!$><!/></div><div style="width:14;height:14;border:1px solid var(--agd-stroke);border-radius:3;flex-shrink:0">'),oy=$("<svg width=100% height=100% fill=none><rect x=0 y=0 stroke=var(--agd-stroke) stroke-width=0.8></rect><rect x=1 y=1 fill=var(--agd-bar)>"),ry=$('<div style="height:100%;display:flex;align-items:flex-end;justify-content:space-around;padding:0 4px;border-bottom:1px solid var(--agd-stroke)">'),iy=$('<div style=height:100%;position:relative;display:flex;align-items:center;justify-content:center><!$><!/><div style="position:absolute;border-radius:50%;border:1.5px solid var(--agd-stroke);background:var(--agd-fill);display:flex;align-items:center;justify-content:center"><div style=width:0;height:0>'),sy=$('<div style=height:100%;display:flex;flex-direction:column;align-items:center><div style="flex:1;width:100%;border-radius:6;border:1px dashed var(--agd-stroke);background:var(--agd-fill);display:flex;align-items:center;justify-content:center"></div><div style="width:8;height:8;background:var(--agd-fill);border:1px dashed var(--agd-stroke);border-top:none;border-left:none;transform:rotate(45deg);margin-top:-5">'),ly=$("<div style=display:flex;align-items:center;height:100%;gap:4>"),ay=$("<span style=color:var(--agd-stroke);font-size:10>/"),Qu=$("<div style=display:flex;align-items:center;gap:4><!$><!/><!$><!/>"),cy=$("<div style=display:flex;align-items:center;justify-content:center;height:100%;gap:4>"),dy=$("<div style=display:flex;align-items:center;height:100%><div style=width:100%;height:1;background:var(--agd-stroke)>"),Ku=$("<div style=display:flex;flex-direction:column;height:100%>"),uy=$('<div style="border-bottom:1px solid var(--agd-stroke);padding:8px 6px;display:flex;align-items:center;justify-content:space-between"><!$><!/><span style=font-size:8;color:var(--agd-stroke)>'),_y=$("<div style=height:100%;display:flex;flex-direction:column;gap:6><div style=flex:1;display:flex;gap:6;align-items:center><span style=font-size:12;color:var(--agd-stroke)>‹</span><!$><!/><span style=font-size:12;color:var(--agd-stroke)>›</span></div><div style=display:flex;justify-content:center;gap:4><!$><!/><!$><!/><!$><!/>"),hy=$('<div style=height:100%;display:flex;flex-direction:column;align-items:center;padding:10><!$><!/><!$><!/><div style="flex:1;display:flex;flex-direction:column;gap:4;width:100%;padding:8px 0"></div><!$><!/>'),fy=$("<div style=height:100%;display:flex;flex-direction:column;padding:10;gap:8><span style=font-size:18;line-height:1;color:var(--agd-stroke);font-family:serif>&ldquo;</span><div style=flex:1;display:flex;flex-direction:column;gap:4><!$><!/><!$><!/><!$><!/></div><div style=display:flex;align-items:center;gap:6><!$><!/><div style=display:flex;flex-direction:column;gap:2><!$><!/><!$><!/>"),gy=$("<div style=display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%><!$><!/><!$><!/><!$><!/>"),my=$('<div style="height:100%;border-radius:6;border:1px dashed var(--agd-stroke);background:var(--agd-fill);display:flex;align-items:center;padding:0 10px;gap:8"><div style="width:16;height:16;border-radius:50%;border:1.5px solid var(--agd-bar-strong);display:flex;align-items:center;justify-content:center;flex-shrink:0"><div style=width:2;height:6;background:var(--agd-bar-strong);border-radius:1></div></div><div style=flex:1;display:flex;flex-direction:column;gap:3><!$><!/><!$><!/>'),py=$('<div style="height:100%;background:var(--agd-fill);display:flex;align-items:center;justify-content:center;gap:8;padding:0 12px"><!$><!/><!$><!/>'),yy=$("<div style=height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center><!$><!/><!$><!/><!$><!/>"),xy=$('<div style="display:flex;align-items:center;justify-content:space-between;height:100%;padding:0 8px">'),by=$('<div style="flex:1;height:1;background:var(--agd-stroke);margin:0 4px">'),vy=$('<div style=display:flex;align-items:center;gap:0;flex:1><div style="border-radius:50%;border:1.5px solid var(--agd-stroke);flex-shrink:0"></div><!$><!/>'),wy=$('<div style="height:100%;border-radius:4;border:1px solid var(--agd-stroke);background:var(--agd-fill);display:flex;align-items:center;justify-content:center;gap:4;padding:0 6px"><!$><!/><div style="width:8;height:8;border-radius:50%;border:1px solid var(--agd-stroke);flex-shrink:0">'),$y=$("<div style=display:flex;align-items:center;justify-content:center;height:100%>"),Sy=$('<svg viewBox="0 0 16 16"fill=none><path d="M8 1.5l2 4 4.5.7-3.25 3.1.75 4.5L8 11.4l-4 2.4.75-4.5L1.5 6.2 6 5.5z"stroke=var(--agd-stroke) stroke-width=0.8>'),ky=$('<div style="height:100%;position:relative;border-radius:4;border:1px dashed var(--agd-stroke);background:var(--agd-fill);overflow:hidden"><svg width=100% height=100% fill=none style=position:absolute;inset:0><line x1=0 stroke=var(--agd-stroke) stroke-width=0.5 opacity=.2></line><line x1=0 stroke=var(--agd-stroke) stroke-width=0.5 opacity=.15></line><line y1=0 stroke=var(--agd-stroke) stroke-width=0.5 opacity=.15></line></svg><div style="position:absolute;left:50%;top:40%;transform:translate(-50%, -100%)"><svg width=16 height=22 viewBox="0 0 16 22"fill=none><path d="M8 0C3.6 0 0 3.6 0 8c0 6 8 14 8 14s8-8 8-14c0-4.4-3.6-8-8-8z"fill=var(--agd-bar) opacity=.4></path><circle cx=8 cy=8 r=3 fill=var(--agd-fill)>'),Cy=$('<div style="display:flex;height:100%;padding:8px 0"><div style=width:16;display:flex;flex-direction:column;align-items:center></div><div style=flex:1;display:flex;flex-direction:column;justify-content:space-around;padding-left:8>'),My=$("<div style=flex:1;width:1;background:var(--agd-stroke)>"),Iy=$("<div style=display:flex;flex-direction:column;align-items:center;flex:1><!$><!/><!$><!/>"),Gu=$("<div style=display:flex;flex-direction:column;gap:3><!$><!/><!$><!/>"),Ry=$('<div style="height:100%;border-radius:8;border:2px dashed var(--agd-stroke);display:flex;flex-direction:column;align-items:center;justify-content:center"><svg width=24 height=24 viewBox="0 0 24 24"fill=none><path d="M12 16V4m0 0l-4 4m4-4l4 4"stroke=var(--agd-stroke) stroke-width=1.5></path><path d="M4 17v2a1 1 0 001 1h14a1 1 0 001-1v-2"stroke=var(--agd-stroke) stroke-width=1.5></path></svg><!$><!/><!$><!/>'),Py=$('<div style="height:100%;border-radius:6;background:var(--agd-fill);border:1px solid var(--agd-stroke);padding:8;display:flex;flex-direction:column;gap:4"><div style=display:flex;gap:3;margin-bottom:4><!$><!/><!$><!/><!$><!/></div><!$><!/>'),Ey=$("<div style=display:flex;gap:6>"),Ty=$('<div style=height:100%;display:flex;flex-direction:column><div style="display:flex;align-items:center;justify-content:space-between;padding:6px 8px"><span style=font-size:8;color:var(--agd-stroke)>‹</span><!$><!/><span style=font-size:8;color:var(--agd-stroke)>›</span></div><div style="display:grid;grid-template-columns:repeat(7, 1fr);gap:2;padding:0 4px;flex:1"><!$><!/><!$><!/>'),Ly=$("<div style=display:flex;align-items:center;justify-content:center>"),Ay=$("<div style=display:flex;align-items:center;justify-content:center><div style=border-radius:50%;display:flex;align-items:center;justify-content:center><div style=width:2;height:2;border-radius:1;background:var(--agd-bar-strong)>"),By=$('<div style="height:100%;border-radius:8;border:1px dashed var(--agd-stroke);background:var(--agd-fill);display:flex;align-items:center;padding:0 10px;gap:8"><!$><!/><div style=flex:1;display:flex;flex-direction:column;gap:3><!$><!/><!$><!/></div><!$><!/>'),Oy=$('<div style=height:100%;display:flex;flex-direction:column><div style="height:50%;background:var(--agd-fill);border-bottom:1px dashed var(--agd-stroke)"></div><div style=flex:1;padding:10;display:flex;flex-direction:column;gap:5><!$><!/><!$><!/><div style=flex:1></div><div style=display:flex;align-items:center;justify-content:space-between><!$><!/><!$><!/>'),Dy=$("<div style=height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center><!$><!/><!$><!/><!$><!/><div style=display:flex><div style=display:flex;flex-direction:column;align-items:center;gap:2><!$><!/><!$><!/></div><div style=display:flex;flex-direction:column;align-items:center;gap:2><!$><!/><!$><!/></div><div style=display:flex;flex-direction:column;align-items:center;gap:2><!$><!/><!$><!/>"),Fy=$('<div style=height:100%;display:flex><div style=background:var(--agd-fill);opacity:0.3></div><div style="flex:1;border-left:1px solid var(--agd-stroke);display:flex;flex-direction:column"><div style=display:flex;justify-content:space-between;align-items:center><!$><!/><div style="width:12;height:12;border:1px solid var(--agd-stroke);border-radius:3"></div></div><!$><!/>'),Ny=$('<div style="padding:6px 0">'),zy=$('<div style=height:100%;display:flex;flex-direction:column;align-items:center><div style="flex:1;width:100%;border-radius:8;border:1px dashed var(--agd-stroke);background:var(--agd-fill);padding:10;display:flex;flex-direction:column;gap:5"><!$><!/><!$><!/><!$><!/></div><div style="width:10;height:10;background:var(--agd-fill);border:1px dashed var(--agd-stroke);border-top:none;border-left:none;transform:rotate(45deg);margin-top:-6">'),Hy=$("<div style=height:100%;display:flex;align-items:center><!$><!/><!$><!/>"),jy=$('<div style="border-bottom:1px solid var(--agd-stroke);padding:8px 6px;display:flex;align-items:center;justify-content:space-between"><div style=display:flex;align-items:center;gap:6><span style=font-size:9;font-weight:700;color:var(--agd-stroke)>Q</span><!$><!/></div><span style=font-size:8;color:var(--agd-stroke)>'),Uy=$("<div style=display:grid;gap:4;height:100%>"),Wy=$('<div style="border-radius:4;border:1px dashed var(--agd-stroke);background:var(--agd-fill);position:relative;overflow:hidden"><svg width=100% height=100% viewBox="0 0 100 100"preserveAspectRatio=none fill=none><line x1=0 y1=0 x2=100 y2=100 stroke=var(--agd-stroke) stroke-width=0.5></line><line x1=100 y1=0 x2=0 y2=100 stroke=var(--agd-stroke) stroke-width=0.5>'),Yy=$("<svg width=100% height=100% fill=none><rect x=1 stroke=var(--agd-stroke) stroke-width=1.5></rect><path stroke=var(--agd-bar) stroke-width=1.5 fill=none stroke-linecap=round stroke-linejoin=round>"),Vy=$("<svg width=100% height=100% fill=none><circle stroke=var(--agd-stroke) stroke-width=1.5></circle><circle fill=var(--agd-bar)>"),Xy=$('<div style=height:100%;display:flex;align-items:center;position:relative><div style="width:100%;background:var(--agd-fill);border:1px solid var(--agd-stroke);position:relative"><div style=height:100%;background:var(--agd-bar)></div></div><div style="position:absolute;border-radius:50%;border:1.5px solid var(--agd-stroke);background:var(--agd-fill)">'),qy=$('<div style=height:100%;display:flex;flex-direction:column;gap:4><div style="border-radius:4;border:1px dashed var(--agd-stroke);background:var(--agd-fill);display:flex;align-items:center;padding:0 8px;justify-content:space-between"><!$><!/><svg width=12 height=12 viewBox="0 0 16 16"fill=none><rect x=2 y=3 width=12 height=11 rx=1 stroke=var(--agd-stroke) stroke-width=1></rect><line x1=2 y1=6 x2=14 y2=6 stroke=var(--agd-stroke) stroke-width=0.5></line></svg></div><div style="flex:1;border-radius:6;border:1px dashed var(--agd-stroke);background:var(--agd-fill);display:flex;flex-direction:column"><div style="display:flex;align-items:center;justify-content:space-between;padding:4px 6px"><span style=font-size:7;color:var(--agd-stroke)>‹</span><!$><!/><span style=font-size:7;color:var(--agd-stroke)>›</span></div><div style="display:grid;grid-template-columns:repeat(7, 1fr);gap:1;padding:0 4px;flex:1">'),Qy=$("<div style=display:flex;align-items:center;justify-content:center><div style=border-radius:50%><div style=width:100%;height:100%;display:flex;align-items:center;justify-content:center><div style=width:1.5;height:1.5;border-radius:1;background:var(--agd-bar-strong)>"),Ky=$("<div style=height:100%;display:flex;flex-direction:column;padding:4><div style=width:100%;border-radius:4;background:var(--agd-fill)></div><div style=width:70%;border-radius:3;background:var(--agd-fill)></div><div style=width:90%;border-radius:3;background:var(--agd-fill)></div><div style=width:50%;border-radius:3;background:var(--agd-fill)>"),Gy=$('<div style=height:100%;display:flex;align-items:center;gap:6><div style="height:100%;flex:1;border:1px solid var(--agd-stroke);background:var(--agd-fill);display:flex;align-items:center;gap:4"><!$><!/><div style="border-radius:50%;border:1px solid var(--agd-stroke);flex-shrink:0;margin-left:auto">'),Jy=$("<svg width=100% height=100% fill=none><path stroke=var(--agd-stroke) stroke-width=1 fill=var(--agd-fill)>"),Zy=$("<svg width=100% height=100% fill=none><circle stroke=var(--agd-stroke) stroke-width=1.5 opacity=.2></circle><path stroke=var(--agd-bar-strong) stroke-width=1.5 stroke-linecap=round>"),ex=$("<div style=display:flex;flex-direction:column;height:100%;justify-content:space-around;padding:8>"),tx=$("<div style=display:flex;align-items:flex-start><!$><!/><div style=flex:1;display:flex;flex-direction:column;gap:4><!$><!/><!$><!/>"),nx=$("<div style=height:100%;display:flex;flex-direction:column;align-items:center><!$><!/><div style=display:flex;justify-content:center;flex:1;align-items:center>"),ox=$("<div style=display:flex;flex-direction:column;align-items:center;gap:6><!$><!/><!$><!/><!$><!/>"),rx=$("<div style=height:100%;display:flex;flex-direction:column;align-items:center><!$><!/><!$><!/><div style=width:100%;display:flex;flex-direction:column></div><!$><!/><!$><!/>"),ix=$("<div style=height:100%;display:flex;flex-direction:column><!$><!/><!$><!/><div style=display:flex;gap:6><div style=flex:1;display:flex;flex-direction:column;gap:3><!$><!/><!$><!/></div><div style=flex:1;display:flex;flex-direction:column;gap:3><!$><!/><!$><!/></div></div><div style=display:flex;flex-direction:column;gap:3><!$><!/><!$><!/></div><div style=display:flex;flex-direction:column;gap:3;flex:1><!$><!/><!$><!/></div><!$><!/>"),sx=$("<div style=width:100%;height:100%;display:flex;align-items:center;justify-content:center><span style=font-size:10;font-weight:600;color:var(--agd-text-3);text-transform:uppercase;letter-spacing:0.06em;opacity:0.5>"),lx=$("<div style=width:100%;height:100%;padding:8;position:relative;pointer-events:none>"),ax=$('<svg width=8 height=6 viewBox="0 0 8 6"fill=none><path d="M4 0.5L1 4.5h6z">'),cx=$('<svg width=6 height=8 viewBox="0 0 6 8"fill=none><path d="M5.5 4L1.5 1v6z">'),dx=$('<svg width=8 height=6 viewBox="0 0 8 6"fill=none><path d="M4 5.5L1 1.5h6z">'),ux=$('<svg width=6 height=8 viewBox="0 0 6 8"fill=none><path d="M0.5 4L4.5 1v6z">'),tr=$("<div data-feedback-toolbar>"),_x=$("<div style=position:fixed><span></span><span></span><div></div><div>✕</div><!$><!/><!$><!/>"),sn=$("<div>"),hx=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=1 y=4 width=18 height=8 rx=1 stroke=currentColor stroke-width=0.5></rect><rect x=2.5 y=7 width=3 height=1.5 rx=.5 fill=currentColor opacity=.4></rect><rect x=7 y=7 width=2.5 height=1.5 rx=.5 fill=currentColor opacity=.25></rect><rect x=11 y=7 width=2.5 height=1.5 rx=.5 fill=currentColor opacity=.25>'),fx=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=1 y=2 width=18 height=12 rx=1 stroke=currentColor stroke-width=0.5></rect><rect x=3 y=5.5 width=8 height=2 rx=.5 fill=currentColor opacity=.35></rect><rect x=3 y=9 width=12 height=1 rx=.5 fill=currentColor opacity=.15>'),gx=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=1 y=1 width=18 height=14 rx=1 stroke=currentColor stroke-width=0.5></rect><rect x=5 y=5 width=10 height=1.5 rx=.5 fill=currentColor opacity=.35></rect><rect x=7 y=8 width=6 height=1 rx=.5 fill=currentColor opacity=.15></rect><rect x=7.5 y=10.5 width=5 height=2.5 rx=1 stroke=currentColor stroke-width=0.5>'),mx=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=1 y=1 width=18 height=14 rx=1 stroke=currentColor stroke-width=0.5></rect><rect x=3 y=4 width=6 height=1 rx=.5 fill=currentColor opacity=.3></rect><rect x=3 y=6.5 width=14 height=1 rx=.5 fill=currentColor opacity=.15></rect><rect x=3 y=9 width=10 height=1 rx=.5 fill=currentColor opacity=.15>'),px=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=1 y=1 width=7 height=14 rx=1 stroke=currentColor stroke-width=0.5></rect><rect x=2.5 y=4 width=4 height=1 rx=.5 fill=currentColor opacity=.3></rect><rect x=2.5 y=6.5 width=3.5 height=1 rx=.5 fill=currentColor opacity=.15></rect><rect x=2.5 y=9 width=4 height=1 rx=.5 fill=currentColor opacity=.15>'),yx=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=1 y=7 width=18 height=8 rx=1 stroke=currentColor stroke-width=0.5></rect><rect x=3 y=9.5 width=4 height=1 rx=.5 fill=currentColor opacity=.25></rect><rect x=9 y=9.5 width=4 height=1 rx=.5 fill=currentColor opacity=.25></rect><rect x=15 y=9.5 width=3 height=1 rx=.5 fill=currentColor opacity=.2>'),xx=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=3 y=2 width=14 height=12 rx=1.5 stroke=currentColor stroke-width=0.5></rect><rect x=5 y=4.5 width=7 height=1 rx=.5 fill=currentColor opacity=.3></rect><rect x=5 y=7 width=10 height=1 rx=.5 fill=currentColor opacity=.15></rect><rect x=11 y=11 width=5 height=2 rx=.75 stroke=currentColor stroke-width=0.5>'),bx=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><line x1=2 y1=8 x2=18 y2=8 stroke=currentColor stroke-width=0.5 opacity=.3>'),vx=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=2 y=1 width=16 height=14 rx=1.5 stroke=currentColor stroke-width=0.5></rect><rect x=2 y=1 width=16 height=5.5 rx=1 fill=currentColor opacity=.04></rect><rect x=4 y=8.5 width=8 height=1 rx=.5 fill=currentColor opacity=.25></rect><rect x=4 y=11 width=11 height=1 rx=.5 fill=currentColor opacity=.12>'),wx=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=2 y=4 width=14 height=1.5 rx=.5 fill=currentColor opacity=.3></rect><rect x=2 y=7 width=11 height=1 rx=.5 fill=currentColor opacity=.15></rect><rect x=2 y=9.5 width=13 height=1 rx=.5 fill=currentColor opacity=.15></rect><rect x=2 y=12 width=8 height=1 rx=.5 fill=currentColor opacity=.12>'),$x=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=2 y=2 width=16 height=12 rx=1 stroke=currentColor stroke-width=0.5></rect><line x1=2 y1=2 x2=18 y2=14 stroke=currentColor stroke-width=.3 opacity=.25></line><line x1=18 y1=2 x2=2 y2=14 stroke=currentColor stroke-width=.3 opacity=.25>'),Sx=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=2 y=2 width=16 height=12 rx=1 stroke=currentColor stroke-width=0.5></rect><path d="M8.5 5.5v5l4.5-2.5z"stroke=currentColor stroke-width=0.5 fill=currentColor opacity=.15>'),kx=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=1 y=2 width=18 height=12 rx=1 stroke=currentColor stroke-width=0.5></rect><line x1=1 y1=5.5 x2=19 y2=5.5 stroke=currentColor stroke-width=.3 opacity=.25></line><line x1=1 y1=9 x2=19 y2=9 stroke=currentColor stroke-width=.3 opacity=.25></line><line x1=7 y1=2 x2=7 y2=14 stroke=currentColor stroke-width=.3 opacity=.25></line><line x1=13 y1=2 x2=13 y2=14 stroke=currentColor stroke-width=.3 opacity=.25>'),Cx=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=1.5 y=2 width=7 height=5.5 rx=1 stroke=currentColor stroke-width=0.5></rect><rect x=11.5 y=2 width=7 height=5.5 rx=1 stroke=currentColor stroke-width=0.5></rect><rect x=1.5 y=9.5 width=7 height=5.5 rx=1 stroke=currentColor stroke-width=0.5></rect><rect x=11.5 y=9.5 width=7 height=5.5 rx=1 stroke=currentColor stroke-width=0.5>'),Mx=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><circle cx=3.5 cy=4.5 r=1 stroke=currentColor stroke-width=0.5></circle><rect x=6.5 y=4 width=10 height=1 rx=.5 fill=currentColor opacity=.2></rect><circle cx=3.5 cy=8 r=1 stroke=currentColor stroke-width=0.5></circle><rect x=6.5 y=7.5 width=8 height=1 rx=.5 fill=currentColor opacity=.2></rect><circle cx=3.5 cy=11.5 r=1 stroke=currentColor stroke-width=0.5></circle><rect x=6.5 y=11 width=11 height=1 rx=.5 fill=currentColor opacity=.2>'),Ix=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=3 y=9 width=2.5 height=4 rx=.5 fill=currentColor opacity=.2></rect><rect x=7 y=6 width=2.5 height=7 rx=.5 fill=currentColor opacity=.25></rect><rect x=11 y=3 width=2.5 height=10 rx=.5 fill=currentColor opacity=.3></rect><rect x=15 y=5 width=2.5 height=8 rx=.5 fill=currentColor opacity=.2>'),Rx=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=1.5 y=2 width=17 height=4 rx=1 stroke=currentColor stroke-width=0.5></rect><rect x=3 y=3.5 width=6 height=1 rx=.5 fill=currentColor opacity=.25></rect><rect x=1.5 y=7.5 width=17 height=3 rx=1 stroke=currentColor stroke-width=0.5></rect><rect x=1.5 y=12 width=17 height=3 rx=1 stroke=currentColor stroke-width=0.5>'),Px=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=3 y=2 width=14 height=10 rx=1 stroke=currentColor stroke-width=0.5></rect><path d="M1.5 7L3 8.5 1.5 10"stroke=currentColor stroke-width=0.5 opacity=.35></path><path d="M18.5 7L17 8.5 18.5 10"stroke=currentColor stroke-width=0.5 opacity=.35></path><circle cx=8.5 cy=14 r=.6 fill=currentColor opacity=.35></circle><circle cx=10 cy=14 r=.6 fill=currentColor opacity=.15></circle><circle cx=11.5 cy=14 r=.6 fill=currentColor opacity=.15>'),Ex=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=3 y=5 width=14 height=6 rx=2 stroke=currentColor stroke-width=0.5></rect><rect x=6.5 y=7.5 width=7 height=1 rx=.5 fill=currentColor opacity=.25>'),Tx=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=2 y=4 width=5.5 height=1 rx=.5 fill=currentColor opacity=.25></rect><rect x=2 y=6.5 width=16 height=5.5 rx=1 stroke=currentColor stroke-width=0.5></rect><rect x=3.5 y=8.5 width=7 height=1 rx=.5 fill=currentColor opacity=.12>'),Lx=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=2 y=4.5 width=16 height=7 rx=3.5 stroke=currentColor stroke-width=0.5></rect><circle cx=6 cy=8 r=2 stroke=currentColor stroke-width=0.5 opacity=.3></circle><line x1=7.5 y1=9.5 x2=9 y2=11 stroke=currentColor stroke-width=0.5 opacity=.3></line><rect x=9.5 y=7.5 width=6 height=1 rx=.5 fill=currentColor opacity=.12>'),Ax=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=2 y=1.5 width=5.5 height=1 rx=.5 fill=currentColor opacity=.25></rect><rect x=2 y=3.5 width=16 height=3 rx=.75 stroke=currentColor stroke-width=0.5></rect><rect x=2 y=8 width=7 height=1 rx=.5 fill=currentColor opacity=.25></rect><rect x=2 y=10 width=16 height=3 rx=.75 stroke=currentColor stroke-width=0.5></rect><rect x=12 y=14 width=6 height=2 rx=.75 stroke=currentColor stroke-width=0.5>'),Bx=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=1 y=5 width=18 height=10 rx=1 stroke=currentColor stroke-width=0.5></rect><rect x=1 y=2 width=6 height=3.5 rx=.75 stroke=currentColor stroke-width=0.5></rect><rect x=2.5 y=3.25 width=3 height=1 rx=.5 fill=currentColor opacity=.25></rect><rect x=7 y=2 width=6 height=3.5 rx=.75 stroke=currentColor stroke-width=0.5>'),Ox=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=2 y=2 width=16 height=4 rx=1 stroke=currentColor stroke-width=0.5></rect><rect x=3.5 y=3.5 width=7 height=1 rx=.5 fill=currentColor opacity=.2></rect><path d="M15 3.5l1.5 1.5L18 3.5"stroke=currentColor stroke-width=0.5 opacity=.3></path><rect x=2 y=7 width=16 height=7 rx=1 stroke=currentColor stroke-width=0.5 stroke-dasharray="2 1"opacity=.3>'),Dx=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=4 y=5 width=12 height=6 rx=3 stroke=currentColor stroke-width=0.5></rect><circle cx=13 cy=8 r=2 fill=currentColor opacity=.3>'),Fx=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><circle cx=10 cy=8 r=6 stroke=currentColor stroke-width=0.5></circle><circle cx=10 cy=6.5 r=2 stroke=currentColor stroke-width=0.5></circle><path d="M6.5 13c0-2 1.5-3.5 3.5-3.5s3.5 1.5 3.5 3.5"stroke=currentColor stroke-width=0.5>'),Nx=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=3 y=5 width=14 height=6 rx=3 stroke=currentColor stroke-width=0.5></rect><rect x=6 y=7.5 width=8 height=1 rx=.5 fill=currentColor opacity=.25>'),zx=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=1.5 y=7 width=3.5 height=1 rx=.5 fill=currentColor opacity=.3></rect><path d="M6.5 7l1 1-1 1"stroke=currentColor stroke-width=0.5 opacity=.2></path><rect x=9 y=7 width=3.5 height=1 rx=.5 fill=currentColor opacity=.2></rect><path d="M14 7l1 1-1 1"stroke=currentColor stroke-width=0.5 opacity=.2></path><rect x=16.5 y=7 width=2 height=1 rx=.5 fill=currentColor opacity=.15>'),Hx=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=2 y=5.5 width=3.5 height=5 rx=1 stroke=currentColor stroke-width=0.5></rect><rect x=6.5 y=5.5 width=3.5 height=5 rx=1 stroke=currentColor stroke-width=0.5></rect><rect x=11 y=5.5 width=3.5 height=5 rx=1 fill=currentColor opacity=.15 stroke=currentColor stroke-width=0.5></rect><rect x=15.5 y=5.5 width=3.5 height=5 rx=1 stroke=currentColor stroke-width=0.5>'),jx=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=2 y=7 width=16 height=2 rx=1 stroke=currentColor stroke-width=0.5></rect><rect x=2 y=7 width=10 height=2 rx=1 fill=currentColor opacity=.2>'),Ux=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=2 y=4 width=16 height=8 rx=1.5 stroke=currentColor stroke-width=0.5></rect><circle cx=5 cy=8 r=1.5 stroke=currentColor stroke-width=0.5 opacity=.3></circle><rect x=8 y=6.5 width=7 height=1 rx=.5 fill=currentColor opacity=.25></rect><rect x=8 y=9 width=5 height=1 rx=.5 fill=currentColor opacity=.12>'),Wx=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=3 y=3 width=14 height=7 rx=1.5 stroke=currentColor stroke-width=0.5></rect><rect x=5.5 y=5.5 width=9 height=1 rx=.5 fill=currentColor opacity=.25></rect><path d="M9 10l1 2.5 1-2.5"stroke=currentColor stroke-width=0.5>'),Yx=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=2 y=1 width=16 height=14 rx=1.5 stroke=currentColor stroke-width=0.5></rect><rect x=6 y=3 width=8 height=1.5 rx=.5 fill=currentColor opacity=.25></rect><rect x=7 y=5.5 width=6 height=2 rx=.5 fill=currentColor opacity=.15></rect><rect x=5 y=9 width=10 height=1 rx=.5 fill=currentColor opacity=.1></rect><rect x=5 y=11 width=10 height=1 rx=.5 fill=currentColor opacity=.1></rect><rect x=6 y=13 width=8 height=1.5 rx=.5 fill=currentColor opacity=.2>'),Vx=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=2 y=1 width=16 height=14 rx=1.5 stroke=currentColor stroke-width=0.5></rect><text x=4 y=5.5 font-size=4 fill=currentColor opacity=.2 font-family=serif>&ldquo;</text><rect x=4 y=7 width=12 height=1 rx=.5 fill=currentColor opacity=.15></rect><rect x=4 y=9 width=9 height=1 rx=.5 fill=currentColor opacity=.12></rect><circle cx=5.5 cy=12.5 r=1.5 stroke=currentColor stroke-width=0.5 opacity=.25></circle><rect x=8 y=12 width=5 height=1 rx=.5 fill=currentColor opacity=.15>'),Xx=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=1 y=2 width=18 height=12 rx=1 stroke=currentColor stroke-width=0.5></rect><rect x=5 y=4.5 width=10 height=1.5 rx=.5 fill=currentColor opacity=.3></rect><rect x=6 y=7.5 width=8 height=1 rx=.5 fill=currentColor opacity=.15></rect><rect x=7 y=10 width=6 height=2.5 rx=1 stroke=currentColor stroke-width=0.5>'),qx=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=2 y=4 width=16 height=8 rx=1.5 stroke=currentColor stroke-width=0.5></rect><circle cx=6 cy=8 r=2 stroke=currentColor stroke-width=0.5 opacity=.3></circle><line x1=6 y1=7 x2=6 y2=8.5 stroke=currentColor stroke-width=0.6 opacity=.5></line><circle cx=6 cy=9.3 r=.3 fill=currentColor opacity=.5></circle><rect x=9.5 y=7 width=6 height=1 rx=.5 fill=currentColor opacity=.2>'),Qx=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=1 y=5 width=18 height=6 rx=1 stroke=currentColor stroke-width=0.5></rect><rect x=4 y=7.5 width=8 height=1 rx=.5 fill=currentColor opacity=.25></rect><rect x=14 y=7 width=3.5 height=2 rx=.75 stroke=currentColor stroke-width=0.5>'),Kx=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=3 y=2 width=14 height=12 rx=1.5 stroke=currentColor stroke-width=0.5></rect><rect x=6 y=4.5 width=8 height=1 rx=.5 fill=currentColor opacity=.15></rect><rect x=5 y=7 width=10 height=2.5 rx=.5 fill=currentColor opacity=.3></rect><rect x=7 y=11 width=6 height=1 rx=.5 fill=currentColor opacity=.12>'),Gx=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><circle cx=4 cy=8 r=2 fill=currentColor opacity=.2 stroke=currentColor stroke-width=0.5></circle><line x1=6 y1=8 x2=8 y2=8 stroke=currentColor stroke-width=.4 opacity=.3></line><circle cx=10 cy=8 r=2 stroke=currentColor stroke-width=0.5></circle><line x1=12 y1=8 x2=14 y2=8 stroke=currentColor stroke-width=.4 opacity=.3></line><circle cx=16 cy=8 r=2 stroke=currentColor stroke-width=0.5>'),Jx=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=3 y=5 width=14 height=6 rx=1.5 stroke=currentColor stroke-width=0.5></rect><rect x=5.5 y=7.5 width=6 height=1 rx=.5 fill=currentColor opacity=.25></rect><line x1=14 y1=6.5 x2=15.5 y2=9.5 stroke=currentColor stroke-width=0.5 opacity=.2></line><line x1=15.5 y1=6.5 x2=14 y2=9.5 stroke=currentColor stroke-width=0.5 opacity=.2>'),Zx=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><path d="M4 5.5l1 2 2.2.3-1.6 1.5.4 2.2L4 10.3l-2 1.2.4-2.2L.8 7.8 3 7.5z"fill=currentColor opacity=.25></path><path d="M10 5.5l1 2 2.2.3-1.6 1.5.4 2.2L10 10.3l-2 1.2.4-2.2L6.8 7.8 9 7.5z"fill=currentColor opacity=.25></path><path d="M16 5.5l1 2 2.2.3-1.6 1.5.4 2.2L16 10.3l-2 1.2.4-2.2-1.6-1.5 2.2-.3z"stroke=currentColor stroke-width=0.5 opacity=.25>'),eb=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=2 y=2 width=16 height=12 rx=1 stroke=currentColor stroke-width=0.5></rect><line x1=2 y1=6 x2=18 y2=10 stroke=currentColor stroke-width=.3 opacity=.15></line><line x1=7 y1=2 x2=11 y2=14 stroke=currentColor stroke-width=.3 opacity=.15></line><path d="M10 5c-1.7 0-3 1.3-3 3 0 2.5 3 5 3 5s3-2.5 3-5c0-1.7-1.3-3-3-3z"fill=currentColor opacity=.15 stroke=currentColor stroke-width=0.5>'),tb=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><line x1=5 y1=2 x2=5 y2=14 stroke=currentColor stroke-width=.4 opacity=.25></line><circle cx=5 cy=4 r=1.5 fill=currentColor opacity=.2 stroke=currentColor stroke-width=0.5></circle><rect x=8 y=3 width=8 height=1 rx=.5 fill=currentColor opacity=.25></rect><circle cx=5 cy=8.5 r=1.5 stroke=currentColor stroke-width=0.5></circle><rect x=8 y=7.5 width=6 height=1 rx=.5 fill=currentColor opacity=.15></rect><circle cx=5 cy=13 r=1.5 stroke=currentColor stroke-width=0.5></circle><rect x=8 y=12 width=7 height=1 rx=.5 fill=currentColor opacity=.15>'),nb=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=3 y=2 width=14 height=12 rx=1.5 stroke=currentColor stroke-width=0.5 stroke-dasharray="2 1"></rect><path d="M10 10V5.5m0 0L7.5 8m2.5-2.5L12.5 8"stroke=currentColor stroke-width=0.5 opacity=.3></path><rect x=7 y=11.5 width=6 height=1 rx=.5 fill=currentColor opacity=.15>'),ob=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=2 y=2 width=16 height=12 rx=1 stroke=currentColor stroke-width=0.5></rect><circle cx=4 cy=4 r=.6 fill=currentColor opacity=.3></circle><circle cx=5.5 cy=4 r=.6 fill=currentColor opacity=.3></circle><circle cx=7 cy=4 r=.6 fill=currentColor opacity=.3></circle><rect x=4 y=7 width=7 height=1 rx=.5 fill=currentColor opacity=.2></rect><rect x=6 y=9 width=5 height=1 rx=.5 fill=currentColor opacity=.15></rect><rect x=4 y=11 width=8 height=1 rx=.5 fill=currentColor opacity=.12>'),rb=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=2 y=3 width=16 height=12 rx=1 stroke=currentColor stroke-width=0.5></rect><line x1=2 y1=6.5 x2=18 y2=6.5 stroke=currentColor stroke-width=.4 opacity=.25></line><rect x=5 y=4 width=1 height=1.5 rx=.3 fill=currentColor opacity=.2></rect><rect x=14 y=4 width=1 height=1.5 rx=.3 fill=currentColor opacity=.2></rect><circle cx=7 cy=9 r=.6 fill=currentColor opacity=.2></circle><circle cx=10 cy=9 r=.6 fill=currentColor opacity=.2></circle><circle cx=13 cy=9 r=.6 fill=currentColor opacity=.3></circle><circle cx=7 cy=12 r=.6 fill=currentColor opacity=.2></circle><circle cx=10 cy=12 r=.6 fill=currentColor opacity=.2>'),ib=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=2 y=3 width=16 height=10 rx=1.5 stroke=currentColor stroke-width=0.5></rect><circle cx=5.5 cy=8 r=2 stroke=currentColor stroke-width=0.5 opacity=.25></circle><rect x=9 y=6 width=6 height=1 rx=.5 fill=currentColor opacity=.25></rect><rect x=9 y=8.5 width=4.5 height=1 rx=.5 fill=currentColor opacity=.12></rect><circle cx=16.5 cy=4.5 r=1.5 fill=currentColor opacity=.25>'),sb=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=3 y=1 width=14 height=14 rx=1.5 stroke=currentColor stroke-width=0.5></rect><rect x=3 y=1 width=14 height=6 rx=1 fill=currentColor opacity=.04></rect><rect x=5 y=8.5 width=7 height=1 rx=.5 fill=currentColor opacity=.25></rect><rect x=5 y=10.5 width=4 height=1.5 rx=.5 fill=currentColor opacity=.15></rect><rect x=12 y=12 width=4 height=2 rx=.75 stroke=currentColor stroke-width=0.5>'),lb=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><circle cx=10 cy=5 r=3 stroke=currentColor stroke-width=0.5></circle><rect x=5 y=10 width=10 height=1.5 rx=.5 fill=currentColor opacity=.25></rect><rect x=7 y=12.5 width=6 height=1 rx=.5 fill=currentColor opacity=.12>'),ab=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=9 y=1 width=10 height=14 rx=1 stroke=currentColor stroke-width=0.5></rect><rect x=10.5 y=4 width=5 height=1 rx=.5 fill=currentColor opacity=.25></rect><rect x=10.5 y=6.5 width=7 height=1 rx=.5 fill=currentColor opacity=.15></rect><rect x=10.5 y=9 width=6 height=1 rx=.5 fill=currentColor opacity=.15></rect><rect x=1 y=1 width=7 height=14 rx=1 stroke=currentColor stroke-width=0.5 opacity=.15>'),cb=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=3 y=2 width=14 height=9 rx=1.5 stroke=currentColor stroke-width=0.5></rect><rect x=5 y=4.5 width=8 height=1 rx=.5 fill=currentColor opacity=.25></rect><rect x=5 y=7 width=6 height=1 rx=.5 fill=currentColor opacity=.15></rect><path d="M9 11l1 2.5 1-2.5"stroke=currentColor stroke-width=0.5>'),db=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=2 y=3 width=10 height=10 rx=2 stroke=currentColor stroke-width=0.5></rect><path d="M5 9.5l2-4 2 4"stroke=currentColor stroke-width=0.5 opacity=.3></path><rect x=14 y=6 width=4 height=1 rx=.5 fill=currentColor opacity=.2></rect><rect x=14 y=8.5 width=3 height=1 rx=.5 fill=currentColor opacity=.12>'),ub=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><text x=2.5 y=5.5 font-size=4 fill=currentColor opacity=.3 font-weight=bold>?</text><rect x=7 y=3 width=10 height=1 rx=.5 fill=currentColor opacity=.25></rect><rect x=7 y=5.5 width=8 height=1 rx=.5 fill=currentColor opacity=.12></rect><text x=2.5 y=11.5 font-size=4 fill=currentColor opacity=.3 font-weight=bold>?</text><rect x=7 y=9 width=9 height=1 rx=.5 fill=currentColor opacity=.25></rect><rect x=7 y=11.5 width=7 height=1 rx=.5 fill=currentColor opacity=.12>'),_b=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=1.5 y=1.5 width=5 height=5 rx=.75 stroke=currentColor stroke-width=0.5></rect><rect x=7.5 y=1.5 width=5 height=5 rx=.75 stroke=currentColor stroke-width=0.5></rect><rect x=13.5 y=1.5 width=5 height=5 rx=.75 stroke=currentColor stroke-width=0.5></rect><rect x=1.5 y=9.5 width=5 height=5 rx=.75 stroke=currentColor stroke-width=0.5></rect><rect x=7.5 y=9.5 width=5 height=5 rx=.75 stroke=currentColor stroke-width=0.5></rect><rect x=13.5 y=9.5 width=5 height=5 rx=.75 stroke=currentColor stroke-width=0.5>'),hb=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=5 y=4 width=8 height=8 rx=1.5 stroke=currentColor stroke-width=0.5></rect><path d="M7.5 8l1.5 1.5 3-3"stroke=currentColor stroke-width=0.5 opacity=.35>'),fb=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><circle cx=10 cy=8 r=4 stroke=currentColor stroke-width=0.5></circle><circle cx=10 cy=8 r=2 fill=currentColor opacity=.3>'),gb=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=2 y=7.5 width=16 height=1 rx=.5 fill=currentColor opacity=.15></rect><rect x=2 y=7.5 width=10 height=1 rx=.5 fill=currentColor opacity=.25></rect><circle cx=12 cy=8 r=2.5 stroke=currentColor stroke-width=0.5>'),mb=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=2 y=1 width=16 height=5 rx=1 stroke=currentColor stroke-width=0.5></rect><rect x=3.5 y=3 width=5 height=1 rx=.5 fill=currentColor opacity=.2></rect><rect x=14 y=2.5 width=2.5 height=2 rx=.5 fill=currentColor opacity=.12></rect><rect x=2 y=7 width=16 height=8 rx=1 stroke=currentColor stroke-width=0.5 stroke-dasharray="2 1"opacity=.3></rect><circle cx=6 cy=10 r=.6 fill=currentColor opacity=.2></circle><circle cx=10 cy=10 r=.6 fill=currentColor opacity=.3></circle><circle cx=14 cy=10 r=.6 fill=currentColor opacity=.2></circle><circle cx=6 cy=13 r=.6 fill=currentColor opacity=.2></circle><circle cx=10 cy=13 r=.6 fill=currentColor opacity=.2>'),pb=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=2 y=2 width=16 height=3 rx=1 fill=currentColor opacity=.08></rect><rect x=2 y=7 width=10 height=2 rx=.75 fill=currentColor opacity=.08></rect><rect x=2 y=11 width=13 height=2 rx=.75 fill=currentColor opacity=.08>'),yb=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=1.5 y=5 width=10 height=6 rx=3 fill=currentColor opacity=.08 stroke=currentColor stroke-width=0.5></rect><rect x=4 y=7.5 width=4 height=1 rx=.5 fill=currentColor opacity=.25></rect><line x1=9.5 y1=6.5 x2=10.5 y2=9.5 stroke=currentColor stroke-width=0.5 opacity=.2></line><line x1=10.5 y1=6.5 x2=9.5 y2=9.5 stroke=currentColor stroke-width=0.5 opacity=.2></line><rect x=13 y=5 width=5.5 height=6 rx=3 stroke=currentColor stroke-width=0.5 opacity=.25>'),xb=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><path d="M10 3l1.5 3 3.5.5-2.5 2.5.5 3.5L10 11l-3 1.5.5-3.5L5 6.5l3.5-.5z"stroke=currentColor stroke-width=0.5 opacity=.3>'),bb=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><circle cx=10 cy=8 r=5 stroke=currentColor stroke-width=0.5 opacity=.12></circle><path d="M10 3a5 5 0 0 1 5 5"stroke=currentColor stroke-width=0.5 opacity=.35 stroke-linecap=round>'),vb=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=2 y=2 width=5 height=5 rx=1.5 stroke=currentColor stroke-width=0.5></rect><path d="M4.5 3.5v3m-1.5-1.5h3"stroke=currentColor stroke-width=0.5 opacity=.25></path><rect x=9 y=2.5 width=8 height=1.5 rx=.5 fill=currentColor opacity=.25></rect><rect x=9 y=5.5 width=6 height=1 rx=.5 fill=currentColor opacity=.12></rect><rect x=2 y=10 width=5 height=5 rx=1.5 stroke=currentColor stroke-width=0.5></rect><rect x=9 y=10.5 width=7 height=1.5 rx=.5 fill=currentColor opacity=.25></rect><rect x=9 y=13.5 width=5 height=1 rx=.5 fill=currentColor opacity=.12>'),wb=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><circle cx=5 cy=5 r=2.5 stroke=currentColor stroke-width=0.5></circle><rect x=2.5 y=9 width=5 height=1 rx=.5 fill=currentColor opacity=.2></rect><circle cx=15 cy=5 r=2.5 stroke=currentColor stroke-width=0.5></circle><rect x=12.5 y=9 width=5 height=1 rx=.5 fill=currentColor opacity=.2></rect><circle cx=10 cy=5 r=2.5 stroke=currentColor stroke-width=0.5 opacity=.5></circle><rect x=7.5 y=9 width=5 height=1 rx=.5 fill=currentColor opacity=.15></rect><rect x=4 y=12 width=12 height=1 rx=.5 fill=currentColor opacity=.1>'),$b=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=3 y=1 width=14 height=14 rx=1.5 stroke=currentColor stroke-width=0.5></rect><rect x=6 y=3 width=8 height=1.5 rx=.5 fill=currentColor opacity=.25></rect><rect x=5 y=5.5 width=10 height=3 rx=.75 stroke=currentColor stroke-width=0.5></rect><rect x=5 y=9.5 width=10 height=3 rx=.75 stroke=currentColor stroke-width=0.5></rect><rect x=6.5 y=13.5 width=7 height=2 rx=.75 fill=currentColor opacity=.2>'),Sb=$('<svg viewBox="0 0 20 16"width=20 height=16 fill=none><rect x=2 y=1 width=16 height=14 rx=1.5 stroke=currentColor stroke-width=0.5></rect><rect x=4 y=3 width=5 height=1 rx=.5 fill=currentColor opacity=.2></rect><rect x=4 y=5 width=12 height=2.5 rx=.75 stroke=currentColor stroke-width=0.5></rect><rect x=4 y=8.5 width=12 height=4 rx=.75 stroke=currentColor stroke-width=0.5></rect><rect x=11 y=13.5 width=5 height=1.5 rx=.5 fill=currentColor opacity=.2>'),kb=$("<div><div></div><!$><!/>"),Cb=$("<div><div></div><span>"),Mb=$("<span><span style=visibility:hidden><!$><!/> <!$><!/></span><span><!$><!/> <!$><!/></span><span><!$><!/> <!$><!/>"),Ib=$("<span><span style=visibility:hidden></span><span></span><span>"),Rb=$("<div><div><div><div><span></span><button>Clear"),Pb=$('<div data-feedback-toolbar data-agentation-palette><div><div>Layout Mode</div><div>Rearrange and resize existing elements, add new components, and explore layout ideas. Agent results may vary. <a href=https://agentation.dev/features#layout-mode target=_blank rel="noopener noreferrer">Learn more.</a></div></div><div><span><svg viewBox="0 0 14 14"width=14 height=14 fill=none><rect x=1 y=1 width=12 height=12 rx=2 stroke=currentColor stroke-width=1></rect><circle cx=4.5 cy=4.5 r=0.8 fill=currentColor opacity=.6></circle><circle cx=7 cy=4.5 r=0.8 fill=currentColor opacity=.6></circle><circle cx=9.5 cy=4.5 r=0.8 fill=currentColor opacity=.6></circle><circle cx=4.5 cy=7 r=0.8 fill=currentColor opacity=.6></circle><circle cx=7 cy=7 r=0.8 fill=currentColor opacity=.6></circle><circle cx=9.5 cy=7 r=0.8 fill=currentColor opacity=.6></circle><circle cx=4.5 cy=9.5 r=0.8 fill=currentColor opacity=.6></circle><circle cx=7 cy=9.5 r=0.8 fill=currentColor opacity=.6></circle><circle cx=9.5 cy=9.5 r=0.8 fill=currentColor opacity=.6></circle></svg></span><span>Wireframe New Page</span></div><div><div><textarea placeholder="Describe this page to provide additional context for your agent."rows=2></textarea></div></div><!$><!/><!$><!/>'),Eb=$("<div data-feedback-toolbar><!$><!/><!$><!/><!$><!/>"),Tb=$("<div><span></span><span></span><span><!$><!/> &times; <!$><!/></span><div>✕</div><!$><!/>"),Lb=$("<div><span></span><span></span><span><!$><!/> &times; <!$><!/></span><div>✕</div><!$><!/><span>"),Ab=$("<span>&amp; <!$><!/>"),Bb=$("<svg><!$><!/><defs><filter id=connDotShadow x=-50% y=-50% width=200% height=200%><feDropShadow dx=0 dy=0.5 stdDeviation=1 flood-opacity=0.15>"),Ob=$('<svg><g><path fill=none stroke="rgba(59, 130, 246, 0.45)"stroke-width=1.5></path><circle fill="rgba(59, 130, 246, 0.8)"stroke=#fff stroke-width=1.5 filter=url(#connDotShadow)></circle><circle fill="rgba(59, 130, 246, 0.8)"stroke=#fff stroke-width=1.5 filter=url(#connDotShadow)></svg>',!1,!0,!1),Db=$("<div><span><!$><!/><!$><!/></span><span>"),Fb=$("<div data-annotation-marker><!$><!/><!$><!/>"),Nb=$("<div data-annotation-marker>"),zb=$("<div><input type=checkbox><div>"),Hb=$('<div><input type=checkbox><svg width=14 height=14 viewBox="0 0 14 14"fill=none><path d="M3.94 7L6.13 9.19L10.5 4.81"stroke=currentColor stroke-width=1.5 stroke-linecap=round stroke-linejoin=round>'),jb=$("<div><!$><!/><label></label><!$><!/>"),Ub=$('<div data-agentation-settings-panel><div><div><div><a href=https://agentation.com target=_blank rel="noopener noreferrer"><svg width=72 height=16 viewBox="0 0 676 151"fill=none xmlns=http://www.w3.org/2000/svg><path d="M79.6666 100.561L104.863 15.5213C107.828 4.03448 99.1201 -3.00582 88.7449 1.25541L3.52015 39.6065C1.48217 40.5329 0 42.7562 0 45.1647C0 48.6848 2.77907 51.4639 6.29922 51.4639C7.22558 51.4639 8.15193 51.2786 9.07829 50.9081L93.7472 12.7422C97.2674 11.0748 93.7472 8.29572 92.6356 12.1864L67.624 97.2259C66.5123 100.931 69.4767 105.193 73.7379 105.193C76.517 105.193 79.1108 103.155 79.6666 100.561ZM663.641 100.005C665.679 107.231 677.537 104.081 675.499 96.8553L666.05 66.2856C663.456 57.7631 655.489 55.7251 648.82 61.098L618.991 86.6654C617.324 87.9623 621.029 89.815 621.214 88.1476L625.846 61.6538C626.958 55.3546 624.179 50.5375 615.841 50.5375L579.158 51.0934C576.008 51.0934 578.417 53.8724 578.417 57.022C578.417 60.1716 580.825 61.6538 583.975 61.6538L616.212 60.9127C616.397 60.9127 614.544 59.6158 614.544 59.8011L609.727 88.7034C607.875 99.6344 617.694 102.784 626.031 95.7437L655.86 70.1763L654.192 69.6205L663.641 100.005ZM571.191 89.0739C555.443 88.7034 562.298 61.4685 578.787 61.8391C594.72 62.0243 587.124 89.2592 571.191 89.0739ZM571.006 100.375C601.575 100.931 611.024 51.6492 579.158 51.0934C547.847 50.5375 540.065 99.8197 571.006 100.375ZM521.909 46.4616C525.985 46.4616 529.505 42.9414 529.505 38.6802C529.505 34.4189 525.985 31.0841 521.909 31.0841C517.833 31.0841 514.127 34.6042 514.127 38.6802C514.127 42.7562 517.648 46.4616 521.909 46.4616ZM472.256 103.525C493.192 103.71 515.98 73.3259 519.13 62.3949L509.866 60.9127C505.234 73.3259 497.638 101.672 519.871 102.043C536.545 102.228 552.479 85.3685 563.595 70.1763C564.151 69.2499 564.706 68.1383 564.706 66.8414C564.706 63.6918 563.965 61.098 560.816 61.098C558.963 61.098 557.296 62.0243 556.184 63.5065C546.365 77.0313 530.802 90.9266 522.094 90.7414C511.904 90.5561 517.462 71.4732 519.871 64.9887C523.391 55.7251 512.831 53.5019 509.681 60.9127C506.531 68.6941 488.19 92.4088 475.035 92.2235C467.439 92.0383 464.29 83.8863 472.441 59.9864L486.707 17.7445C487.634 14.4097 485.41 10.519 481.334 10.519C478.741 10.519 476.517 12.1864 475.962 14.4097L461.696 56.4662C451.506 86.4801 455.211 103.155 472.256 103.525ZM447.43 42.5709L496.527 41.4593C499.306 41.4593 501.529 39.0507 501.529 36.2717C501.529 33.3073 499.306 31.0841 496.341 31.0841L447.245 32.1957C444.466 32.1957 442.242 34.4189 442.242 37.3833C442.242 40.1624 444.466 42.5709 447.43 42.5709ZM422.974 106.304C435.387 106.489 457.249 94.8173 472.441 53.8724C473.553 50.7228 472.071 48.3143 468.365 48.3143C466.142 48.3143 464.29 49.6112 463.548 51.6492C450.394 87.2212 431.682 96.1142 424.456 95.929C419.454 95.929 417.972 93.3352 418.713 85.5538C419.454 78.1429 410.376 74.9933 406.114 81.1073C401.297 87.777 394.442 94.2615 385.549 94.0763C370.172 93.891 376.471 67.0267 399.815 67.3972C408.338 67.5825 414.452 71.4732 417.045 76.6608C417.786 78.3282 419.454 79.6251 421.492 79.6251C424.271 79.6251 426.679 77.2166 426.679 74.4375C426.679 73.6964 426.494 72.9553 426.124 72.2143C421.862 63.6918 412.414 57.3926 400 57.2073C363.502 56.6515 353.497 104.451 383.326 104.822C397.036 105.193 410.005 94.0763 413.34 85.9243C412.599 86.8507 408.338 86.6654 408.523 84.4422C407.411 97.4111 410.931 106.119 422.974 106.304ZM335.897 104.266C335.897 115.012 347.569 117.606 347.569 103.34C347.569 89.0739 358.5 54.4282 361.464 45.1647L396.666 43.6825C405.929 43.1267 404.262 33.1221 397.036 33.3073L364.984 34.4189L368.875 22.7469C369.801 20.1531 370.542 17.9298 370.542 16.2624C370.542 13.4833 368.504 11.8159 365.911 11.8159C362.946 11.8159 360.352 12.7422 357.573 21.0794L352.942 35.16L330.153 36.0864C326.263 36.4569 323.483 38.1244 323.483 41.6445C323.483 45.5352 326.448 47.0174 330.709 46.8321L349.421 45.9058C345.901 56.6515 335.897 90.7414 335.897 104.266ZM186.939 78.6988C193.979 56.4662 212.877 54.984 212.877 62.9507C212.877 68.3236 203.984 77.0313 186.939 78.6988ZM113.942 150.955C142.844 152.437 159.704 111.492 160.63 80.5515C161.556 73.3259 153.96 70.3616 148.773 75.7344C141.918 83.1453 129.505 93.1499 119.685 93.1499C103.011 93.1499 116.165 59.8011 143.956 59.8011C149.514 59.8011 153.59 61.6538 156.184 64.0623C160.815 68.3236 170.82 62.0243 165.818 56.0957C161.927 51.4639 155.072 48.129 144.882 48.129C102.455 48.129 83.7426 105.007 116.721 105.007C134.692 105.007 151.367 88.3329 155.257 82.7747C154.516 83.5158 149.329 81.2925 149.699 79.4398L149.143 83.5158C148.958 107.045 134.322 141.506 116.536 139.838C113.386 139.468 112.089 137.43 112.089 134.836C112.089 128.907 122.094 119.273 145.067 113.53C159.518 109.824 152.293 101.487 143.4 104.081C111.163 113.53 99.6759 127.425 99.6759 137.8C99.6759 145.026 105.605 150.584 113.942 150.955ZM194.72 109.454C214.359 109.454 239 95.3732 251.228 77.9577C250.301 82.96 246.596 96.8553 246.596 101.487C246.596 110.01 254.748 109.454 261.232 102.784L288.097 75.5491L290.32 85.7391C293.284 99.4491 299.213 104.822 308.847 104.822C326.263 104.822 342.196 85.7391 349.421 74.8081L344.049 63.6918C339.787 74.8081 321.631 92.5941 311.626 92.5941C306.994 92.5941 304.771 89.815 303.289 83.7011L300.325 71.2879C297.916 60.7275 289.023 58.3189 279.018 68.1383L261.788 84.8127L264.382 69.991C266.235 59.2453 255.674 58.1337 250.116 65.915C241.779 77.0313 216.767 97.7817 196.387 97.7817C187.865 97.7817 185.456 93.7057 185.456 88.3329C230.848 84.998 239.185 47.2027 208.986 47.2027C172.858 47.2027 157.11 109.454 194.72 109.454Z"fill=currentColor></path></svg></a><p>v0.1.4</p><button><span><span></span></span></button></div><div></div><div><div><div>Output Detail<!$><!/></div><button><span></span><span></span></button></div><div><div>Solid Components<!$><!/></div><!$><!/></div><div><div>Hide Until Restart<!$><!/></div><!$><!/></div></div><div></div><div><div>Marker Color</div><div></div></div><div></div><div><!$><!/><!$><!/></div><div></div><button><span>Manage MCP & Webhooks</span><span><!$><!/><svg width=16 height=16 viewBox="0 0 16 16"fill=none xmlns=http://www.w3.org/2000/svg><path d="M7.5 12.5L12 8L7.5 3.5"stroke=currentColor stroke-width=1.5 stroke-linecap=round stroke-linejoin=round></path></svg></span></button></div><div><button><!$><!/><span>Manage MCP & Webhooks</span></button><div></div><div><div><span>MCP Connection<!$><!/></span><!$><!/></div><p style=padding-bottom:6px>MCP connection allows agents to receive and act on annotations. <a href=https://agentation.dev/mcp target=_blank rel="noopener noreferrer">Learn more</a></p></div><div></div><div><div><span>Webhooks<!$><!/></span><div><label for=agentation-auto-send>Auto-Send</label><!$><!/></div></div><p>The webhook URL will receive live annotation changes and annotation data.</p><textarea placeholder="Webhook URL">'),Wb=$("<button type=button>"),Yb=$("<div data-feedback-toolbar><div><span>Toggle Opacity</span><input type=range min=0 max=1 step=0.01></div><div><span>Wireframe Mode</span><span></span><button>Start Over</button></div>Drag components onto the canvas.<br>Copied output will only include the wireframed layout."),Vb=$("<div data-feedback-toolbar><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/>"),Xb=$('<div data-agentation-root style=display:contents><div data-feedback-toolbar data-agentation-toolbar><div><div><!$><!/><!$><!/></div><div><div><button></button><span><!$><!/><span>P</span></span></div><div><button></button><span><!$><!/><span>L</span></span></div><div><button></button><span><!$><!/><span>H</span></span></div><div><button></button><span><!$><!/><span>C</span></span></div><div><button><!$><!/><!$><!/></button><span>Send Annotations<span>S</span></span></div><div><button data-danger></button><span>Clear all<span>X</span></span></div><div><button></button><!$><!/><span>Settings</span></div><div></div><div><button></button><span>Exit<span>Esc</span></span></div></div><!$><!/><!$><!/></div></div><!$><!/><!$><!/><!$><!/><!$><!/><canvas data-feedback-toolbar style="transition:opacity 0.15s ease"></canvas><div data-feedback-toolbar></div><div data-feedback-toolbar></div><!$><!/>'),qb=$('<div style="border-color:color-mix(in srgb, var(--agentation-color-accent) 50%, transparent);background-color:color-mix(in srgb, var(--agentation-color-accent) 4%, transparent)">'),Qb=$("<div style=position:fixed>"),Kb=$("<div><!$><!/><div>"),Gb=$('<div style="border-color:color-mix(in srgb, var(--agentation-color-accent) 60%, transparent);background-color:color-mix(in srgb, var(--agentation-color-accent) 5%, transparent)">'),Jb=`.styles-module__popup___IhzrD svg[fill=none] {
  fill: none !important;
}
.styles-module__popup___IhzrD svg[fill=none] :not([fill]) {
  fill: none !important;
}

@keyframes styles-module__popupEnter___AuQDN {
  from {
    opacity: 0;
    transform: translateX(-50%) scale(0.95) translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) scale(1) translateY(0);
  }
}
@keyframes styles-module__popupExit___JJKQX {
  from {
    opacity: 1;
    transform: translateX(-50%) scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: translateX(-50%) scale(0.95) translateY(4px);
  }
}
@keyframes styles-module__shake___jdbWe {
  0%, 100% {
    transform: translateX(-50%) scale(1) translateY(0) translateX(0);
  }
  20% {
    transform: translateX(-50%) scale(1) translateY(0) translateX(-3px);
  }
  40% {
    transform: translateX(-50%) scale(1) translateY(0) translateX(3px);
  }
  60% {
    transform: translateX(-50%) scale(1) translateY(0) translateX(-2px);
  }
  80% {
    transform: translateX(-50%) scale(1) translateY(0) translateX(2px);
  }
}
.styles-module__popup___IhzrD {
  position: fixed;
  transform: translateX(-50%);
  width: 280px;
  padding: 0.75rem 1rem 14px;
  background: #1a1a1a;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.08);
  z-index: 100001;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  will-change: transform, opacity;
  opacity: 0;
}
.styles-module__popup___IhzrD.styles-module__enter___L7U7N {
  animation: styles-module__popupEnter___AuQDN 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
.styles-module__popup___IhzrD.styles-module__entered___COX-w {
  opacity: 1;
  transform: translateX(-50%) scale(1) translateY(0);
}
.styles-module__popup___IhzrD.styles-module__exit___5eGjE {
  animation: styles-module__popupExit___JJKQX 0.15s ease-in forwards;
}
.styles-module__popup___IhzrD.styles-module__entered___COX-w.styles-module__shake___jdbWe {
  animation: styles-module__shake___jdbWe 0.25s ease-out;
}

.styles-module__header___wWsSi {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5625rem;
}

.styles-module__element___fTV2z {
  font-size: 0.75rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.styles-module__headerToggle___WpW0b {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  flex: 1;
  min-width: 0;
  text-align: left;
}
.styles-module__headerToggle___WpW0b .styles-module__element___fTV2z {
  flex: 1;
}

.styles-module__chevron___ZZJlR {
  color: rgba(255, 255, 255, 0.5);
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  flex-shrink: 0;
}
.styles-module__chevron___ZZJlR.styles-module__expanded___2Hxgv {
  transform: rotate(90deg);
}

.styles-module__stylesWrapper___pnHgy {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.styles-module__stylesWrapper___pnHgy.styles-module__expanded___2Hxgv {
  grid-template-rows: 1fr;
}

.styles-module__stylesInner___YYZe2 {
  overflow: hidden;
}

.styles-module__stylesBlock___VfQKn {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.375rem;
  padding: 0.5rem 0.625rem;
  margin-bottom: 0.5rem;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
  font-size: 0.6875rem;
  line-height: 1.5;
}

.styles-module__styleLine___1YQiD {
  color: rgba(255, 255, 255, 0.85);
  word-break: break-word;
}

.styles-module__styleProperty___84L1i {
  color: #c792ea;
}

.styles-module__styleValue___q51-h {
  color: rgba(255, 255, 255, 0.85);
}

.styles-module__timestamp___Dtpsv {
  font-size: 0.625rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.35);
  font-variant-numeric: tabular-nums;
  margin-left: 0.5rem;
  flex-shrink: 0;
}

.styles-module__quote___mcMmQ {
  font-size: 12px;
  font-style: italic;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.5rem;
  padding: 0.4rem 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.25rem;
  line-height: 1.45;
}

.styles-module__textarea___jrSae {
  width: 100%;
  padding: 0.5rem 0.625rem;
  font-size: 0.8125rem;
  font-family: inherit;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  resize: none;
  outline: none;
  transition: border-color 0.15s ease;
}
.styles-module__textarea___jrSae:focus {
  border-color: var(--agentation-color-blue);
}
.styles-module__textarea___jrSae.styles-module__green___99l3h:focus {
  border-color: var(--agentation-color-green);
}
.styles-module__textarea___jrSae::placeholder {
  color: rgba(255, 255, 255, 0.35);
}
.styles-module__textarea___jrSae::-webkit-scrollbar {
  width: 6px;
}
.styles-module__textarea___jrSae::-webkit-scrollbar-track {
  background: transparent;
}
.styles-module__textarea___jrSae::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.styles-module__actions___D6x3f {
  display: flex;
  justify-content: flex-end;
  gap: 0.375rem;
  margin-top: 0.5rem;
}

.styles-module__cancel___hRjnL,
.styles-module__submit___K-mIR {
  padding: 0.4rem 0.875rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 1rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease, opacity 0.15s ease;
}

.styles-module__cancel___hRjnL {
  background: transparent;
  color: rgba(255, 255, 255, 0.5);
}
.styles-module__cancel___hRjnL:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}

.styles-module__submit___K-mIR {
  color: white;
}
.styles-module__submit___K-mIR:hover:not(:disabled) {
  filter: brightness(0.9);
}
.styles-module__submit___K-mIR:disabled {
  cursor: not-allowed;
}

.styles-module__deleteWrapper___oSjdo {
  margin-right: auto;
}

.styles-module__deleteButton___4VuAE {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.4);
  transition: background-color 0.15s ease, color 0.15s ease, transform 0.1s ease;
}
.styles-module__deleteButton___4VuAE:hover {
  background-color: color-mix(in srgb, var(--agentation-color-red) 25%, transparent);
  color: var(--agentation-color-red);
}
.styles-module__deleteButton___4VuAE:active {
  transform: scale(0.92);
}

.styles-module__light___6AaSQ.styles-module__popup___IhzrD {
  background: #fff;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.06);
}
.styles-module__light___6AaSQ .styles-module__element___fTV2z {
  color: rgba(0, 0, 0, 0.6);
}
.styles-module__light___6AaSQ .styles-module__timestamp___Dtpsv {
  color: rgba(0, 0, 0, 0.4);
}
.styles-module__light___6AaSQ .styles-module__chevron___ZZJlR {
  color: rgba(0, 0, 0, 0.4);
}
.styles-module__light___6AaSQ .styles-module__stylesBlock___VfQKn {
  background: rgba(0, 0, 0, 0.03);
}
.styles-module__light___6AaSQ .styles-module__styleLine___1YQiD {
  color: rgba(0, 0, 0, 0.75);
}
.styles-module__light___6AaSQ .styles-module__styleProperty___84L1i {
  color: #7c3aed;
}
.styles-module__light___6AaSQ .styles-module__styleValue___q51-h {
  color: rgba(0, 0, 0, 0.75);
}
.styles-module__light___6AaSQ .styles-module__quote___mcMmQ {
  color: rgba(0, 0, 0, 0.55);
  background: rgba(0, 0, 0, 0.04);
}
.styles-module__light___6AaSQ .styles-module__textarea___jrSae {
  background: rgba(0, 0, 0, 0.03);
  color: #1a1a1a;
  border-color: rgba(0, 0, 0, 0.12);
}
.styles-module__light___6AaSQ .styles-module__textarea___jrSae::placeholder {
  color: rgba(0, 0, 0, 0.4);
}
.styles-module__light___6AaSQ .styles-module__textarea___jrSae::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
}
.styles-module__light___6AaSQ .styles-module__cancel___hRjnL {
  color: rgba(0, 0, 0, 0.5);
}
.styles-module__light___6AaSQ .styles-module__cancel___hRjnL:hover {
  background: rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.75);
}
.styles-module__light___6AaSQ .styles-module__deleteButton___4VuAE {
  color: rgba(0, 0, 0, 0.4);
}
.styles-module__light___6AaSQ .styles-module__deleteButton___4VuAE:hover {
  background-color: color-mix(in srgb, var(--agentation-color-red) 25%, transparent);
  color: var(--agentation-color-red);
}`,Zb={popup:"styles-module__popup___IhzrD",enter:"styles-module__enter___L7U7N",entered:"styles-module__entered___COX-w",exit:"styles-module__exit___5eGjE",shake:"styles-module__shake___jdbWe",header:"styles-module__header___wWsSi",element:"styles-module__element___fTV2z",headerToggle:"styles-module__headerToggle___WpW0b",chevron:"styles-module__chevron___ZZJlR",expanded:"styles-module__expanded___2Hxgv",stylesWrapper:"styles-module__stylesWrapper___pnHgy",stylesInner:"styles-module__stylesInner___YYZe2",stylesBlock:"styles-module__stylesBlock___VfQKn",styleLine:"styles-module__styleLine___1YQiD",styleProperty:"styles-module__styleProperty___84L1i",styleValue:"styles-module__styleValue___q51-h",timestamp:"styles-module__timestamp___Dtpsv",quote:"styles-module__quote___mcMmQ",textarea:"styles-module__textarea___jrSae",actions:"styles-module__actions___D6x3f",cancel:"styles-module__cancel___hRjnL",submit:"styles-module__submit___K-mIR",deleteWrapper:"styles-module__deleteWrapper___oSjdo",deleteButton:"styles-module__deleteButton___4VuAE",light:"styles-module__light___6AaSQ"};if(typeof document<"u"){let e=document.getElementById("feedback-tool-styles-annotation-popup-css-styles");e||(e=document.createElement("style"),e.id="feedback-tool-styles-annotation-popup-css-styles",e.textContent=Jb,document.head.appendChild(e))}var Ht=Zb,e5=`.icon-transitions-module__iconState___uqK9J {
  transition: opacity 0.2s ease, transform 0.2s ease;
  transform-origin: center;
}

.icon-transitions-module__iconStateFast___HxlMm {
  transition: opacity 0.15s ease, transform 0.15s ease;
  transform-origin: center;
}

.icon-transitions-module__iconFade___nPwXg {
  transition: opacity 0.2s ease;
}

.icon-transitions-module__iconFadeFast___Ofb2t {
  transition: opacity 0.15s ease;
}

.icon-transitions-module__visible___PlHsU {
  opacity: 1 !important;
}

.icon-transitions-module__visibleScaled___8Qog- {
  opacity: 1 !important;
  transform: scale(1);
}

.icon-transitions-module__hidden___ETykt {
  opacity: 0 !important;
}

.icon-transitions-module__hiddenScaled___JXn-m {
  opacity: 0 !important;
  transform: scale(0.8);
}

.icon-transitions-module__sending___uaLN- {
  opacity: 0.5 !important;
  transform: scale(0.8);
}`,t5={iconState:"icon-transitions-module__iconState___uqK9J",iconStateFast:"icon-transitions-module__iconStateFast___HxlMm",iconFade:"icon-transitions-module__iconFade___nPwXg",iconFadeFast:"icon-transitions-module__iconFadeFast___Ofb2t",visible:"icon-transitions-module__visible___PlHsU",visibleScaled:"icon-transitions-module__visibleScaled___8Qog-",hidden:"icon-transitions-module__hidden___ETykt",hiddenScaled:"icon-transitions-module__hiddenScaled___JXn-m",sending:"icon-transitions-module__sending___uaLN-"};if(typeof document<"u"){let e=document.getElementById("feedback-tool-styles-components-icon-transitions");e||(e=document.createElement("style"),e.id="feedback-tool-styles-components-icon-transitions",e.textContent=e5,document.head.appendChild(e))}var Dt=t5,n5=({size:e=16})=>(()=>{var t=b(Z1);return O(t,"width",e),O(t,"height",e),t})(),o5=({size:e=24,style:t={}})=>(()=>{var n=b(ep);return O(n,"width",e),O(n,"height",e),ie(o=>gn(n,t,o)),n})(),r5=({size:e=20,...t})=>(()=>{var n=b(tp);return O(n,"width",e),O(n,"height",e),bo(n,t,!0,!0),Ft(),n})(),i5=({size:e=24,copied:t=!1,tint:n})=>(()=>{var o=b(np),r=o.firstChild,i=r.nextSibling;return O(o,"width",e),O(o,"height",e),ie(s=>{var l=n?{color:n,transition:"color 0.3s ease"}:void 0,a=`${Dt.iconState} ${t?Dt.hiddenScaled:Dt.visibleScaled}`,c=`${Dt.iconState} ${t?Dt.visibleScaled:Dt.hiddenScaled}`;return s.e=gn(o,l,s.e),a!==s.t&&O(r,"class",s.t=a),c!==s.a&&O(i,"class",s.a=c),s},{e:void 0,t:void 0,a:void 0}),o})(),s5=({size:e=24,state:t="idle"})=>{const n=t==="idle",o=t==="sent",r=t==="failed",i=t==="sending";return(()=>{var s=b(op),l=s.firstChild,a=l.nextSibling,c=a.nextSibling;return O(s,"width",e),O(s,"height",e),ie(d=>{var u=`${Dt.iconStateFast} ${n?Dt.visibleScaled:i?Dt.sending:Dt.hiddenScaled}`,_=`${Dt.iconStateFast} ${o?Dt.visibleScaled:Dt.hiddenScaled}`,m=`${Dt.iconStateFast} ${r?Dt.visibleScaled:Dt.hiddenScaled}`;return u!==d.e&&O(l,"class",d.e=u),_!==d.t&&O(a,"class",d.t=_),m!==d.a&&O(c,"class",d.a=m),d},{e:void 0,t:void 0,a:void 0}),s})()},l5=({size:e=24,isOpen:t=!0})=>(()=>{var n=b(rp),o=n.firstChild,r=o.nextSibling;return O(n,"width",e),O(n,"height",e),ie(i=>{var s=`${Dt.iconFade} ${t?Dt.visible:Dt.hidden}`,l=`${Dt.iconFade} ${t?Dt.hidden:Dt.visible}`;return s!==i.e&&O(o,"class",i.e=s),l!==i.t&&O(r,"class",i.t=l),i},{e:void 0,t:void 0}),n})(),a5=({size:e=24,isPaused:t=!1})=>(()=>{var n=b(ip),o=n.firstChild,r=o.nextSibling;return O(n,"width",e),O(n,"height",e),ie(i=>{var s=`${Dt.iconFadeFast} ${t?Dt.hidden:Dt.visible}`,l=`${Dt.iconFadeFast} ${t?Dt.visible:Dt.hidden}`;return s!==i.e&&O(o,"class",i.e=s),l!==i.t&&O(r,"class",i.t=l),i},{e:void 0,t:void 0}),n})(),c5=({size:e=16})=>(()=>{var t=b(sp);return O(t,"width",e),O(t,"height",e),t})(),d5=({size:e=16})=>(()=>{var t=b(lp);return O(t,"width",e),O(t,"height",e),t})(),Ju=({size:e=16})=>(()=>{var t=b(ap);return O(t,"width",e),O(t,"height",e),t})(),u5=({size:e=24})=>(()=>{var t=b(cp);return O(t,"width",e),O(t,"height",e),t})(),_5=({size:e=16})=>(()=>{var t=b(dp);return O(t,"width",e),O(t,"height",e),t})(),h5=({size:e=16})=>(()=>{var t=b(up);return O(t,"width",e),O(t,"height",e),t})(),f5=({size:e=16})=>(()=>{var t=b(_p);return O(t,"width",e),O(t,"height",e),t})(),g5=({size:e=24})=>(()=>{var t=b(hp);return O(t,"width",e),O(t,"height",e),t})(),m5=({size:e=16})=>(()=>{var t=b(fp);return O(t,"width",e),O(t,"height",e),t})(),p5=({size:e=24})=>(()=>{var t=b(gp);return O(t,"width",e),O(t,"height",e),t})(),Zu=["data-feedback-toolbar","data-annotation-popup","data-annotation-marker"],gl=Zu.flatMap(e=>[`:not([${e}])`,`:not([${e}] *)`]).join(""),Dl="feedback-freeze-styles",ml="__agentation_freeze";function y5(){if(typeof window>"u")return{frozen:!1,installed:!0,origSetTimeout:setTimeout,origSetInterval:setInterval,origRAF:t=>0,pausedAnimations:[],frozenTimeoutQueue:[],frozenRAFQueue:[]};const e=window;return e[ml]||(e[ml]={frozen:!1,installed:!1,origSetTimeout:null,origSetInterval:null,origRAF:null,pausedAnimations:[],frozenTimeoutQueue:[],frozenRAFQueue:[]}),e[ml]}var vt=y5();typeof window<"u"&&!vt.installed&&(vt.origSetTimeout=window.setTimeout.bind(window),vt.origSetInterval=window.setInterval.bind(window),vt.origRAF=window.requestAnimationFrame.bind(window),window.setTimeout=(e,t,...n)=>typeof e=="string"?vt.origSetTimeout(e,t):vt.origSetTimeout((...o)=>{vt.frozen?vt.frozenTimeoutQueue.push(()=>e(...o)):e(...o)},t,...n),window.setInterval=(e,t,...n)=>typeof e=="string"?vt.origSetInterval(e,t):vt.origSetInterval((...o)=>{vt.frozen||e(...o)},t,...n),window.requestAnimationFrame=e=>vt.origRAF(t=>{vt.frozen?vt.frozenRAFQueue.push(e):e(t)}),vt.installed=!0);var bt=vt.origSetTimeout,x5=vt.origSetInterval;function b5(e){return e?Zu.some(t=>!!e.closest?.(`[${t}]`)):!1}function v5(){if(typeof document>"u"||vt.frozen)return;vt.frozen=!0,vt.frozenTimeoutQueue=[],vt.frozenRAFQueue=[];let e=document.getElementById(Dl);e||(e=document.createElement("style"),e.id=Dl),e.textContent=`
    *${gl},
    *${gl}::before,
    *${gl}::after {
      animation-play-state: paused !important;
      transition: none !important;
    }
  `,document.head.appendChild(e),vt.pausedAnimations=[];try{document.getAnimations().forEach(t=>{if(t.playState!=="running")return;const n=t.effect?.target;b5(n)||(t.pause(),vt.pausedAnimations.push(t))})}catch{}document.querySelectorAll("video").forEach(t=>{t.paused||(t.dataset.wasPaused="false",t.pause())})}function td(){if(typeof document>"u"||!vt.frozen)return;vt.frozen=!1;const e=vt.frozenTimeoutQueue;vt.frozenTimeoutQueue=[];for(const n of e)vt.origSetTimeout(()=>{if(vt.frozen){vt.frozenTimeoutQueue.push(n);return}try{n()}catch(o){console.warn("[agentation] Error replaying queued timeout:",o)}},0);const t=vt.frozenRAFQueue;vt.frozenRAFQueue=[];for(const n of t)vt.origRAF(o=>{if(vt.frozen){vt.frozenRAFQueue.push(n);return}n(o)});for(const n of vt.pausedAnimations)try{n.play()}catch(o){console.warn("[agentation] Error resuming animation:",o)}vt.pausedAnimations=[],document.getElementById(Dl)?.remove(),document.querySelectorAll("video").forEach(n=>{n.dataset.wasPaused==="false"&&(n.play().catch(()=>{}),delete n.dataset.wasPaused)})}function pl(e){if(!e)return;const t=n=>n.stopImmediatePropagation();document.addEventListener("focusin",t,!0),document.addEventListener("focusout",t,!0);try{e.focus()}finally{document.removeEventListener("focusin",t,!0),document.removeEventListener("focusout",t,!0)}}function Ts(e){const[t,n]=G(e.initialValue??""),[o,r]=G(!1),[i,s]=G("initial"),[l,a]=G(!1),[c,d]=G(!1);let u,_,m=null,g=null;De(()=>{e.isExiting&&i()!=="exit"&&s("exit")}),Pn(()=>{bt(()=>{s("enter")},0);const R=bt(()=>{s("entered")},200),A=bt(()=>{u&&(pl(u),u.selectionStart=u.selectionEnd=u.value.length,u.scrollTop=u.scrollHeight)},50);ot(()=>{clearTimeout(R),clearTimeout(A),m&&clearTimeout(m),g&&clearTimeout(g)})});const v=()=>{g&&clearTimeout(g),r(!0),g=bt(()=>{r(!1),pl(u)},250)};e.ref?.({shake:v});const f=()=>{s("exit"),m=bt(()=>{e.onCancel()},150)},p=()=>{t().trim()&&e.onSubmit(t().trim())},k=R=>{R.stopPropagation(),!R.isComposing&&(R.key==="Enter"&&!R.shiftKey&&(R.preventDefault(),p()),R.key==="Escape"&&f())},P=()=>[Ht.popup,e.lightMode?Ht.light:"",i()==="enter"?Ht.enter:"",i()==="entered"?Ht.entered:"",i()==="exit"?Ht.exit:"",o()?Ht.shake:""].filter(Boolean).join(" ");return(()=>{var R=b(bp),A=R.firstChild,ee=A.firstChild,[D,K]=S(ee.nextSibling),te=D.nextSibling,[me,j]=S(te.nextSibling),ue=A.nextSibling,[be,ye]=S(ue.nextSibling),Te=be.nextSibling,[_e,W]=S(Te.nextSibling),B=_e.nextSibling,Z=B.nextSibling,de=Z.firstChild,[Y,oe]=S(de.nextSibling),ve=Y.nextSibling,he=ve.nextSibling;R.$$click=re=>re.stopPropagation();var We=_;typeof We=="function"?uo(We,R):_=R,y(A,h(Oe,{get when(){return lt(()=>!!e.computedStyles)()&&Object.keys(e.computedStyles).length>0},get fallback(){return(()=>{var re=b(xo);return y(re,()=>e.element),ie(()=>M(re,Ht.element)),re})()},get children(){var re=b(mp),Qe=re.firstChild,nt=Qe.nextSibling;return re.$$click=()=>{const Le=c();d(!c()),Le&&bt(()=>pl(u),0)},y(nt,()=>e.element),ie(Le=>{var ut=Ht.headerToggle,it=`${Ht.chevron} ${c()?Ht.expanded:""}`,xe=Ht.element;return ut!==Le.e&&M(re,Le.e=ut),it!==Le.t&&O(Qe,"class",Le.t=it),xe!==Le.a&&M(nt,Le.a=xe),Le},{e:void 0,t:void 0,a:void 0}),Ft(),re}}),D,K),y(A,h(Oe,{get when(){return e.timestamp},get children(){var re=b(xo);return y(re,()=>e.timestamp),ie(()=>M(re,Ht.timestamp)),re}}),me,j),y(R,h(Oe,{get when(){return lt(()=>!!e.computedStyles)()&&Object.keys(e.computedStyles).length>0},get children(){var re=b(pp),Qe=re.firstChild,nt=Qe.firstChild;return y(nt,()=>Object.entries(e.computedStyles).map(([Le,ut])=>(()=>{var it=b(vp),xe=it.firstChild,Se=xe.nextSibling,Lt=Se.nextSibling;return y(xe,()=>Le.replace(/([A-Z])/g,"-$1").toLowerCase()),y(Lt,ut),ie(H=>{var V=Ht.styleLine,F=Ht.styleProperty,se=Ht.styleValue;return V!==H.e&&M(it,H.e=V),F!==H.t&&M(xe,H.t=F),se!==H.a&&M(Lt,H.a=se),H},{e:void 0,t:void 0,a:void 0}),it})())),ie(Le=>{var ut=`${Ht.stylesWrapper} ${c()?Ht.expanded:""}`,it=Ht.stylesInner,xe=Ht.stylesBlock;return ut!==Le.e&&M(re,Le.e=ut),it!==Le.t&&M(Qe,Le.t=it),xe!==Le.a&&M(nt,Le.a=xe),Le},{e:void 0,t:void 0,a:void 0}),re}}),be,ye),y(R,h(Oe,{get when(){return e.selectedText},get children(){var re=b(yp),Qe=re.firstChild,nt=Qe.nextSibling,[Le,ut]=S(nt.nextSibling),it=Le.nextSibling,[xe,Se]=S(it.nextSibling);return xe.nextSibling,y(re,()=>e.selectedText.slice(0,80),Le,ut),y(re,()=>e.selectedText.length>80?"...":"",xe,Se),ie(()=>M(re,Ht.quote)),re}}),_e,W),B.$$keydown=k,B.addEventListener("blur",()=>a(!1)),B.addEventListener("focus",()=>a(!0)),B.$$input=re=>n(re.target.value);var Xe=u;return typeof Xe=="function"?uo(Xe,B):u=B,y(Z,h(Oe,{get when(){return e.onDelete},get children(){var re=b(xp),Qe=re.firstChild;return Qe.$$click=()=>e.onDelete?.(),y(Qe,h(g5,{size:22})),ie(nt=>{var Le=Ht.deleteWrapper,ut=Ht.deleteButton;return Le!==nt.e&&M(re,nt.e=Le),ut!==nt.t&&M(Qe,nt.t=ut),nt},{e:void 0,t:void 0}),Ft(),re}}),Y,oe),ve.$$click=f,he.$$click=p,y(he,()=>e.submitLabel??"Add"),ie(re=>{var Qe=P(),nt=e.style,Le=Ht.header,ut=Ht.textarea,it=l()?e.accentColor??"#3c82f7":void 0,xe=e.placeholder??"What should change?",Se=Ht.actions,Lt=Ht.cancel,H=Ht.submit,V=e.accentColor??"#3c82f7",F=t().trim()?1:.4,se=!t().trim();return Qe!==re.e&&M(R,re.e=Qe),re.t=gn(R,nt,re.t),Le!==re.a&&M(A,re.a=Le),ut!==re.o&&M(B,re.o=ut),it!==re.i&&E(B,"border-color",re.i=it),xe!==re.n&&O(B,"placeholder",re.n=xe),Se!==re.s&&M(Z,re.s=Se),Lt!==re.h&&M(ve,re.h=Lt),H!==re.r&&M(he,re.r=H),V!==re.d&&E(he,"background-color",re.d=V),F!==re.l&&E(he,"opacity",re.l=F),se!==re.u&&yo(he,"disabled",re.u=se),re},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0,h:void 0,r:void 0,d:void 0,l:void 0,u:void 0}),ie(()=>yo(B,"value",t())),Ft(),R})()}var w5=e=>{const[t,n]=Jn(e,["content","children"]),[o,r]=G(!1),[i,s]=G(!1),[l,a]=G({top:0,right:0});let c,d=null,u=null;const _=()=>{if(c){const v=c.getBoundingClientRect();a({top:v.top+v.height/2,right:window.innerWidth-v.left+8})}},m=()=>{s(!0),u&&(clearTimeout(u),u=null),_(),d=bt(()=>{r(!0)},500)},g=()=>{d&&(clearTimeout(d),d=null),r(!1),u=bt(()=>{s(!1)},150)};return ot(()=>{d&&clearTimeout(d),u&&clearTimeout(u)}),[(()=>{var v=b(xo);v.addEventListener("mouseleave",g),v.addEventListener("mouseenter",m);var f=c;return typeof f=="function"?uo(f,v):c=v,bo(v,n,!1,!0),y(v,()=>t.children),Ft(),v})(),h(Oe,{get when(){return i()},get children(){return h(qd,{get mount(){return document.body},get children(){var v=b(wp);return y(v,()=>t.content),ie(f=>{var p=`${l().top}px`,k=`${l().right}px`,P=o()?1:0;return p!==f.e&&E(v,"top",f.e=p),k!==f.t&&E(v,"right",f.t=k),P!==f.a&&E(v,"opacity",f.a=P),f},{e:void 0,t:void 0,a:void 0}),v}})}})]},$5=`.styles-module__tooltip___mcXL2 {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: help;
}

.styles-module__tooltipIcon___Nq2nD {
  transform: translateY(0.5px);
  color: #fff;
  opacity: 0.2;
  transition: opacity 0.15s ease;
  will-change: transform;
}
.styles-module__tooltip___mcXL2:hover .styles-module__tooltipIcon___Nq2nD {
  opacity: 0.5;
}
[data-agentation-theme=light] .styles-module__tooltipIcon___Nq2nD {
  color: #000;
}`,S5={tooltip:"styles-module__tooltip___mcXL2",tooltipIcon:"styles-module__tooltipIcon___Nq2nD"};if(typeof document<"u"){let e=document.getElementById("feedback-tool-styles-help-tooltip-styles");e||(e=document.createElement("style"),e.id="feedback-tool-styles-help-tooltip-styles",e.textContent=$5,document.head.appendChild(e))}var nd=S5,nr=e=>h(w5,{get class(){return nd.tooltip},get content(){return e.content},get children(){return h(r5,{get class(){return nd.tooltipIcon}})}}),Re={navigation:{width:800,height:56},hero:{width:800,height:320},header:{width:800,height:80},section:{width:800,height:400},sidebar:{width:240,height:400},footer:{width:800,height:160},modal:{width:480,height:300},card:{width:280,height:240},text:{width:400,height:120},image:{width:320,height:200},video:{width:480,height:270},table:{width:560,height:220},grid:{width:600,height:300},list:{width:300,height:180},chart:{width:400,height:240},button:{width:140,height:40},input:{width:280,height:56},form:{width:360,height:320},tabs:{width:480,height:240},dropdown:{width:200,height:200},toggle:{width:44,height:24},search:{width:320,height:44},avatar:{width:48,height:48},badge:{width:80,height:28},breadcrumb:{width:300,height:24},pagination:{width:300,height:36},progress:{width:240,height:8},divider:{width:600,height:1},accordion:{width:400,height:200},carousel:{width:600,height:300},toast:{width:320,height:64},tooltip:{width:180,height:40},pricing:{width:300,height:360},testimonial:{width:360,height:200},cta:{width:600,height:160},alert:{width:400,height:56},banner:{width:800,height:48},stat:{width:200,height:120},stepper:{width:480,height:48},tag:{width:72,height:28},rating:{width:160,height:28},map:{width:480,height:300},timeline:{width:360,height:320},fileUpload:{width:360,height:180},codeBlock:{width:480,height:200},calendar:{width:300,height:300},notification:{width:360,height:72},productCard:{width:280,height:360},profile:{width:280,height:200},drawer:{width:320,height:400},popover:{width:240,height:160},logo:{width:120,height:40},faq:{width:560,height:320},gallery:{width:560,height:360},checkbox:{width:20,height:20},radio:{width:20,height:20},slider:{width:240,height:32},datePicker:{width:300,height:320},skeleton:{width:320,height:120},chip:{width:96,height:32},icon:{width:24,height:24},spinner:{width:32,height:32},feature:{width:360,height:200},team:{width:560,height:280},login:{width:360,height:360},contact:{width:400,height:320}},e_=[{section:"Layout",items:[{type:"navigation",label:"Navigation",...Re.navigation},{type:"header",label:"Header",...Re.header},{type:"hero",label:"Hero",...Re.hero},{type:"section",label:"Section",...Re.section},{type:"sidebar",label:"Sidebar",...Re.sidebar},{type:"footer",label:"Footer",...Re.footer},{type:"modal",label:"Modal",...Re.modal},{type:"banner",label:"Banner",...Re.banner},{type:"drawer",label:"Drawer",...Re.drawer},{type:"popover",label:"Popover",...Re.popover},{type:"divider",label:"Divider",...Re.divider}]},{section:"Content",items:[{type:"card",label:"Card",...Re.card},{type:"text",label:"Text",...Re.text},{type:"image",label:"Image",...Re.image},{type:"video",label:"Video",...Re.video},{type:"table",label:"Table",...Re.table},{type:"grid",label:"Grid",...Re.grid},{type:"list",label:"List",...Re.list},{type:"chart",label:"Chart",...Re.chart},{type:"codeBlock",label:"Code Block",...Re.codeBlock},{type:"map",label:"Map",...Re.map},{type:"timeline",label:"Timeline",...Re.timeline},{type:"calendar",label:"Calendar",...Re.calendar},{type:"accordion",label:"Accordion",...Re.accordion},{type:"carousel",label:"Carousel",...Re.carousel},{type:"logo",label:"Logo",...Re.logo},{type:"faq",label:"FAQ",...Re.faq},{type:"gallery",label:"Gallery",...Re.gallery}]},{section:"Controls",items:[{type:"button",label:"Button",...Re.button},{type:"input",label:"Input",...Re.input},{type:"search",label:"Search",...Re.search},{type:"form",label:"Form",...Re.form},{type:"tabs",label:"Tabs",...Re.tabs},{type:"dropdown",label:"Dropdown",...Re.dropdown},{type:"toggle",label:"Toggle",...Re.toggle},{type:"stepper",label:"Stepper",...Re.stepper},{type:"rating",label:"Rating",...Re.rating},{type:"fileUpload",label:"File Upload",...Re.fileUpload},{type:"checkbox",label:"Checkbox",...Re.checkbox},{type:"radio",label:"Radio",...Re.radio},{type:"slider",label:"Slider",...Re.slider},{type:"datePicker",label:"Date Picker",...Re.datePicker}]},{section:"Elements",items:[{type:"avatar",label:"Avatar",...Re.avatar},{type:"badge",label:"Badge",...Re.badge},{type:"tag",label:"Tag",...Re.tag},{type:"breadcrumb",label:"Breadcrumb",...Re.breadcrumb},{type:"pagination",label:"Pagination",...Re.pagination},{type:"progress",label:"Progress",...Re.progress},{type:"alert",label:"Alert",...Re.alert},{type:"toast",label:"Toast",...Re.toast},{type:"notification",label:"Notification",...Re.notification},{type:"tooltip",label:"Tooltip",...Re.tooltip},{type:"stat",label:"Stat",...Re.stat},{type:"skeleton",label:"Skeleton",...Re.skeleton},{type:"chip",label:"Chip",...Re.chip},{type:"icon",label:"Icon",...Re.icon},{type:"spinner",label:"Spinner",...Re.spinner}]},{section:"Blocks",items:[{type:"pricing",label:"Pricing",...Re.pricing},{type:"testimonial",label:"Testimonial",...Re.testimonial},{type:"cta",label:"CTA",...Re.cta},{type:"productCard",label:"Product Card",...Re.productCard},{type:"profile",label:"Profile",...Re.profile},{type:"feature",label:"Feature",...Re.feature},{type:"team",label:"Team",...Re.team},{type:"login",label:"Login",...Re.login},{type:"contact",label:"Contact",...Re.contact}]}],Gn={};for(const e of e_)for(const t of e.items)Gn[t.type]=t;function J({w:e,h:t=3,strong:n}){return(()=>{var o=b($p);return E(o,"width",typeof e=="number"?`${e}px`:e),E(o,"height",t),E(o,"background",n?"var(--agd-bar-strong)":"var(--agd-bar)"),o})()}function Bt({w:e,h:t,radius:n=3,style:o}){return(()=>{var r=b(Sp);return ie(i=>gn(r,{width:typeof e=="number"?`${e}px`:e,height:typeof t=="number"?`${t}px`:t,"border-radius":n,...o},i)),r})()}function Sn({size:e}){return(()=>{var t=b(kp);return E(t,"width",e),E(t,"height",e),t})()}function k5({width:e,height:t}){const n=Math.max(8,t*.2);return(()=>{var o=b(Cp),r=o.firstChild,[i,s]=S(r.nextSibling),l=i.nextSibling,a=l.firstChild,[c,d]=S(a.nextSibling),u=c.nextSibling,[_,m]=S(u.nextSibling),g=_.nextSibling,[v,f]=S(g.nextSibling),p=v.nextSibling,[k,P]=S(p.nextSibling),R=l.nextSibling,[A,ee]=S(R.nextSibling);return E(o,"padding",`0 ${n}px`),E(o,"gap",e*.02),y(o,h(Bt,{get w(){return Math.max(20,t*.5)},get h(){return Math.max(12,t*.4)},radius:2}),i,s),E(l,"gap",e*.03),E(l,"margin-left",e*.04),y(l,h(J,{w:e*.06}),c,d),y(l,h(J,{w:e*.07}),_,m),y(l,h(J,{w:e*.05}),v,f),y(l,h(J,{w:e*.06}),k,P),y(o,h(Bt,{w:e*.1,get h(){return Math.min(28,t*.5)},radius:4}),A,ee),o})()}function C5({width:e,height:t,text:n}){return(()=>{var o=b(Mp),r=o.firstChild,[i,s]=S(r.nextSibling),l=i.nextSibling,[a,c]=S(l.nextSibling),d=a.nextSibling,[u,_]=S(d.nextSibling),m=u.nextSibling,[g,v]=S(m.nextSibling);return E(o,"gap",t*.05),y(o,n?(()=>{var f=b(Ip);return y(f,n),ie(p=>E(f,"font-size",Math.min(20,t*.08))),f})():h(J,{w:e*.5,get h(){return Math.max(6,t*.04)},strong:!0}),i,s),y(o,h(J,{w:e*.6}),a,c),y(o,h(J,{w:e*.4}),u,_),y(o,h(Bt,{get w(){return Math.min(140,e*.2)},get h(){return Math.min(36,t*.12)},radius:6,style:{"margin-top":t*.06}}),g,v),o})()}function M5({width:e,height:t}){const n=Math.max(3,Math.floor(t/36));return(()=>{var o=b(Rp),r=o.firstChild,[i,s]=S(r.nextSibling),l=i.nextSibling,[a,c]=S(l.nextSibling);return E(o,"padding",e*.08),E(o,"gap",t*.03),y(o,h(J,{w:e*.6,h:4,strong:!0}),i,s),y(o,h(Ye,{get each(){return Array.from({length:n},(d,u)=>u)},children:d=>(()=>{var u=b(Pp),_=u.firstChild,[m,g]=S(_.nextSibling),v=m.nextSibling,[f,p]=S(v.nextSibling);return y(u,h(Bt,{w:10,h:10,radius:2}),m,g),y(u,h(J,{w:e*(.4+d*17%30/100)}),f,p),u})()}),a,c),o})()}function I5({width:e,height:t}){const n=Math.max(2,Math.min(4,Math.floor(e/160)));return(()=>{var o=b(Ep);return E(o,"padding",`${t*.12}px ${e*.03}px`),E(o,"gap",e*.05),y(o,h(Ye,{get each(){return Array.from({length:n},(r,i)=>i)},children:r=>(()=>{var i=b(Tp),s=i.firstChild,[l,a]=S(s.nextSibling),c=l.nextSibling,[d,u]=S(c.nextSibling),_=d.nextSibling,[m,g]=S(_.nextSibling),v=m.nextSibling,[f,p]=S(v.nextSibling);return y(i,h(J,{w:"60%",h:3,strong:!0}),l,a),y(i,h(J,{w:"80%",h:2}),d,u),y(i,h(J,{w:"70%",h:2}),m,g),y(i,h(J,{w:"60%",h:2}),f,p),i})()})),o})()}function R5({width:e,height:t}){return(()=>{var n=b(Lp),o=n.firstChild,r=o.firstChild,[i,s]=S(r.nextSibling);i.nextSibling;var l=o.nextSibling,a=l.firstChild,[c,d]=S(a.nextSibling),u=c.nextSibling,[_,m]=S(u.nextSibling),g=_.nextSibling,[v,f]=S(g.nextSibling),p=l.nextSibling,k=p.firstChild,[P,R]=S(k.nextSibling),A=P.nextSibling,[ee,D]=S(A.nextSibling);return y(o,h(J,{w:e*.3,h:4,strong:!0}),i,s),y(l,h(J,{w:"90%"}),c,d),y(l,h(J,{w:"70%"}),_,m),y(l,h(J,{w:"80%"}),v,f),y(p,h(Bt,{w:70,h:26,radius:4}),P,R),y(p,h(Bt,{w:70,h:26,radius:4,style:{background:"var(--agd-bar)"}}),ee,D),n})()}function P5({width:e,height:t}){return(()=>{var n=b(Ap),o=n.firstChild,r=o.nextSibling,i=r.firstChild,[s,l]=S(i.nextSibling),a=s.nextSibling,[c,d]=S(a.nextSibling),u=c.nextSibling,[_,m]=S(u.nextSibling),g=_.nextSibling,[v,f]=S(g.nextSibling);return y(r,h(J,{w:"70%",h:4,strong:!0}),s,l),y(r,h(J,{w:"95%",h:2}),c,d),y(r,h(J,{w:"85%",h:2}),_,m),y(r,h(J,{w:"50%",h:2}),v,f),n})()}function E5({width:e,height:t,text:n}){if(n)return(()=>{var r=b(Bp);return y(r,n),ie(i=>E(r,"font-size",Math.min(14,t*.3))),r})();const o=Math.max(2,Math.floor(t/18));return(()=>{var r=b(Op),i=r.firstChild,[s,l]=S(i.nextSibling),a=s.nextSibling,[c,d]=S(a.nextSibling);return y(r,h(J,{w:e*.6,h:5,strong:!0}),s,l),y(r,h(Ye,{get each(){return Array.from({length:o},(u,_)=>_)},children:u=>h(J,{w:`${70+u*13%25}%`,h:2})}),c,d),r})()}function T5({width:e,height:t}){return(()=>{var n=b(Dp),o=n.firstChild,r=o.firstChild,i=r.nextSibling,s=i.nextSibling;return O(o,"viewBox",`0 0 ${e} ${t}`),O(r,"x2",e),O(r,"y2",t),O(i,"x1",e),O(i,"y2",t),O(s,"cx",e*.3),O(s,"cy",t*.3),ie(()=>O(s,"r",Math.min(e,t)*.08)),n})()}function L5({width:e,height:t}){const n=Math.max(2,Math.min(5,Math.floor(e/100))),o=Math.max(2,Math.min(6,Math.floor(t/32)));return(()=>{var r=b(Fp),i=r.firstChild,s=i.nextSibling,[l,a]=S(s.nextSibling);return y(i,h(Ye,{get each(){return Array.from({length:n},(c,d)=>d)},children:c=>(()=>{var d=b(ed);return y(d,h(J,{w:"70%",h:3,strong:!0})),d})()})),y(r,h(Ye,{get each(){return Array.from({length:o},(c,d)=>d)},children:c=>(()=>{var d=b(Np);return y(d,h(Ye,{get each(){return Array.from({length:n},(u,_)=>_)},children:u=>(()=>{var _=b(ed);return y(_,h(J,{w:`${50+(c*7+u*13)%40}%`,h:2})),_})()})),d})()}),l,a),r})()}function A5({width:e,height:t}){const n=Math.max(2,Math.floor(t/28));return(()=>{var o=b(zp);return y(o,h(Ye,{get each(){return Array.from({length:n},(r,i)=>i)},children:r=>(()=>{var i=b(Hp),s=i.firstChild,[l,a]=S(s.nextSibling),c=l.nextSibling,[d,u]=S(c.nextSibling);return y(i,h(Sn,{size:8}),l,a),y(i,h(J,{w:`${55+r*17%35}%`,h:2}),d,u),i})()})),o})()}function B5({width:e,height:t,text:n}){return(()=>{var o=b(qu);return y(o,n?(()=>{var r=b(jp);return y(r,n),ie(i=>E(r,"font-size",Math.min(13,t*.4))),r})():h(J,{get w(){return Math.max(20,e*.5)},h:3,strong:!0})),ie(r=>E(o,"border-radius",Math.min(8,t/3))),o})()}function O5({width:e,height:t}){return(()=>{var n=b(Up),o=n.firstChild,[r,i]=S(o.nextSibling),s=r.nextSibling;return y(n,h(J,{get w(){return Math.min(80,e*.3)},h:2}),r,i),y(s,h(J,{w:"40%",h:2})),ie(l=>E(s,"height",Math.min(36,t*.6))),n})()}function D5({width:e,height:t}){const n=Math.max(2,Math.min(5,Math.floor(t/56)));return(()=>{var o=b(Wp),r=o.firstChild,[i,s]=S(r.nextSibling),l=i.nextSibling,[a,c]=S(l.nextSibling);return E(o,"gap",t*.04),y(o,h(Ye,{get each(){return Array.from({length:n},(d,u)=>u)},children:d=>(()=>{var u=b(Yp),_=u.firstChild,[m,g]=S(_.nextSibling),v=m.nextSibling,[f,p]=S(v.nextSibling);return y(u,h(J,{w:60+d*17%30,h:2}),m,g),y(u,h(Bt,{w:"100%",h:28,radius:4}),f,p),u})()}),i,s),y(o,h(Bt,{get w(){return Math.min(120,e*.35)},h:30,radius:6,style:{"margin-top":8,"align-self":"flex-end",background:"var(--agd-bar)"}}),a,c),o})()}function F5({width:e,height:t}){const n=Math.max(2,Math.min(4,Math.floor(e/120)));return(()=>{var o=b(Vp),r=o.firstChild,i=r.nextSibling,s=i.firstChild,[l,a]=S(s.nextSibling),c=l.nextSibling,[d,u]=S(c.nextSibling),_=d.nextSibling,[m,g]=S(_.nextSibling);return y(r,h(Ye,{get each(){return Array.from({length:n},(v,f)=>f)},children:v=>(()=>{var f=b(Xp);return E(f,"border-bottom",v===0?"2px solid var(--agd-bar-strong)":"none"),y(f,h(J,{w:60,h:3,strong:v===0})),f})()})),y(i,h(J,{w:"80%",h:2}),l,a),y(i,h(J,{w:"65%",h:2}),d,u),y(i,h(J,{w:"75%",h:2}),m,g),o})()}function N5({width:e,height:t}){const n=Math.min(e,t)/2;return(()=>{var o=b(qp),r=o.firstChild,i=r.nextSibling,s=i.nextSibling;return O(o,"viewBox",`0 0 ${e} ${t}`),O(r,"cx",e/2),O(r,"cy",t/2),O(r,"r",n-1),O(i,"cx",e/2),O(i,"cy",t*.38),O(i,"r",n*.28),O(s,"d",`M${e/2-n*.55} ${t*.78} C${e/2-n*.55} ${t*.55} ${e/2+n*.55} ${t*.55} ${e/2+n*.55} ${t*.78}`),o})()}function z5({width:e,height:t}){return(()=>{var n=b(qu);return E(n,"border-radius",t/2),y(n,h(J,{get w(){return Math.max(16,e*.5)},h:2,strong:!0})),n})()}function H5({width:e,height:t}){return(()=>{var n=b(Qp),o=n.firstChild,[r,i]=S(o.nextSibling),s=r.nextSibling,[l,a]=S(s.nextSibling);return E(n,"gap",t*.08),y(n,h(J,{w:e*.5,get h(){return Math.max(5,t*.06)},strong:!0}),r,i),y(n,h(J,{w:e*.35}),l,a),n})()}function j5({width:e,height:t}){return(()=>{var n=b(Kp),o=n.firstChild,[r,i]=S(o.nextSibling),s=r.nextSibling,[l,a]=S(s.nextSibling),c=l.nextSibling,[d,u]=S(c.nextSibling),_=d.nextSibling,m=_.firstChild,[g,v]=S(m.nextSibling),f=g.nextSibling,[p,k]=S(f.nextSibling),P=p.nextSibling,[R,A]=S(P.nextSibling);return E(n,"gap",t*.04),E(n,"padding",e*.04),y(n,h(J,{w:e*.3,h:4,strong:!0}),r,i),y(n,h(J,{w:e*.7}),l,a),y(n,h(J,{w:e*.5}),d,u),E(_,"gap",e*.03),E(_,"margin-top",t*.06),y(_,h(Bt,{w:"33%",h:"100%",radius:4}),g,v),y(_,h(Bt,{w:"33%",h:"100%",radius:4}),p,k),y(_,h(Bt,{w:"33%",h:"100%",radius:4}),R,A),n})()}function U5({width:e,height:t}){const n=Math.max(2,Math.min(4,Math.floor(e/140))),o=Math.max(1,Math.min(3,Math.floor(t/120)));return(()=>{var r=b(Gp);return E(r,"grid-template-columns",`repeat(${n}, 1fr)`),E(r,"grid-template-rows",`repeat(${o}, 1fr)`),y(r,h(Ye,{get each(){return Array.from({length:n*o},(i,s)=>s)},children:i=>h(Bt,{w:"100%",h:"100%",radius:4})})),r})()}function W5({width:e,height:t}){const n=Math.max(2,Math.floor((t-32)/28));return(()=>{var o=b(Jp),r=o.firstChild,i=r.nextSibling;return y(r,h(J,{w:e*.5,h:3,strong:!0})),y(i,h(Ye,{get each(){return Array.from({length:n},(s,l)=>l)},children:s=>(()=>{var l=b(Zp);return E(l,"background",s===0?"var(--agd-fill)":"transparent"),y(l,h(J,{w:`${50+s*17%35}%`,h:2,strong:s===0})),l})()})),o})()}function Y5({width:e,height:t}){const n=Math.min(e,t)/2;return(()=>{var o=b(ey),r=o.firstChild,i=r.nextSibling;return O(o,"viewBox",`0 0 ${e} ${t}`),O(r,"width",e-2),O(r,"height",t-2),O(r,"rx",n),O(i,"cx",e-n),O(i,"cy",t/2),O(i,"r",n*.7),o})()}function V5({width:e,height:t}){const n=Math.min(t/2,20);return(()=>{var o=b(ty),r=o.firstChild,[i,s]=S(r.nextSibling),l=i.nextSibling,[a,c]=S(l.nextSibling);return E(o,"border-radius",n),E(o,"padding",`0 ${n*.6}px`),y(o,h(Sn,{get size(){return Math.min(14,t*.4)}}),i,s),y(o,h(J,{w:"50%",h:2}),a,c),o})()}function X5({width:e,height:t}){return(()=>{var n=b(ny),o=n.firstChild,[r,i]=S(o.nextSibling),s=r.nextSibling,l=s.firstChild,[a,c]=S(l.nextSibling),d=a.nextSibling,[u,_]=S(d.nextSibling);return s.nextSibling,y(n,h(Sn,{get size(){return Math.min(20,t*.5)}}),r,i),y(s,h(J,{w:"60%",h:3,strong:!0}),a,c),y(s,h(J,{w:"80%",h:2}),u,_),n})()}function q5({width:e,height:t}){return(()=>{var n=b(oy),o=n.firstChild,r=o.nextSibling;return O(n,"viewBox",`0 0 ${e} ${t}`),O(o,"width",e),O(o,"height",t),O(o,"rx",t/2),O(r,"width",e*.65),O(r,"height",t-2),O(r,"rx",(t-2)/2),n})()}function Q5({width:e,height:t}){const n=Math.max(3,Math.min(7,Math.floor(e/50))),o=e/(n*2);return(()=>{var r=b(ry);return y(r,h(Ye,{get each(){return Array.from({length:n},(i,s)=>s)},children:i=>{const s=30+(i*37+17)%55;return h(Bt,{w:o,h:`${s}%`,radius:2})}})),r})()}function K5({width:e,height:t}){const n=Math.min(e,t)*.12;return(()=>{var o=b(iy),r=o.firstChild,[i,s]=S(r.nextSibling),l=i.nextSibling,a=l.firstChild;return y(o,h(Bt,{w:"100%",h:"100%",radius:4}),i,s),E(l,"width",n*2),E(l,"height",n*2),E(a,"border-left",`${n*.6}px solid var(--agd-bar-strong)`),E(a,"border-top",`${n*.4}px solid transparent`),E(a,"border-bottom",`${n*.4}px solid transparent`),E(a,"margin-left",n*.15),o})()}function G5({width:e,height:t}){return(()=>{var n=b(sy),o=n.firstChild;return o.nextSibling,y(o,h(J,{w:"60%",h:2})),n})()}function J5({width:e,height:t}){const n=Math.max(2,Math.min(4,Math.floor(e/80)));return(()=>{var o=b(ly);return y(o,h(Ye,{get each(){return Array.from({length:n},(r,i)=>i)},children:r=>(()=>{var i=b(Qu),s=i.firstChild,[l,a]=S(s.nextSibling),c=l.nextSibling,[d,u]=S(c.nextSibling);return y(i,h(Oe,{when:r>0,get children(){return b(ay)}}),l,a),y(i,h(J,{w:40+r*13%20,h:2,strong:r===n-1}),d,u),i})()})),o})()}function Z5({width:e,height:t}){const n=Math.max(3,Math.min(5,Math.floor(e/40))),o=Math.min(28,t*.8);return(()=>{var r=b(cy);return y(r,h(Ye,{get each(){return Array.from({length:n},(i,s)=>s)},children:i=>h(Bt,{w:o,h:o,radius:4,style:i===1?{background:"var(--agd-bar)"}:void 0})})),r})()}function e2({width:e}){return(()=>{var t=b(dy);return t.firstChild,t})()}function t2({width:e,height:t}){const n=Math.max(2,Math.min(4,Math.floor(t/40)));return(()=>{var o=b(Ku);return y(o,h(Ye,{get each(){return Array.from({length:n},(r,i)=>i)},children:r=>(()=>{var i=b(uy),s=i.firstChild,[l,a]=S(s.nextSibling),c=l.nextSibling;return E(i,"flex",r===0?2:1),y(i,h(J,{w:`${40+r*17%25}%`,h:3,strong:!0}),l,a),y(c,r===0?"▼":"▶"),i})()})),o})()}function n2({width:e,height:t}){return(()=>{var n=b(_y),o=n.firstChild,r=o.firstChild,i=r.nextSibling,[s,l]=S(i.nextSibling);s.nextSibling;var a=o.nextSibling,c=a.firstChild,[d,u]=S(c.nextSibling),_=d.nextSibling,[m,g]=S(_.nextSibling),v=m.nextSibling,[f,p]=S(v.nextSibling);return y(o,h(Bt,{w:"100%",h:"100%",radius:4}),s,l),y(a,h(Sn,{size:5}),d,u),y(a,h(Sn,{size:5}),m,g),y(a,h(Sn,{size:5}),f,p),n})()}function o2({width:e,height:t}){return(()=>{var n=b(hy),o=n.firstChild,[r,i]=S(o.nextSibling),s=r.nextSibling,[l,a]=S(s.nextSibling),c=l.nextSibling,d=c.nextSibling,[u,_]=S(d.nextSibling);return E(n,"gap",t*.04),y(n,h(J,{w:e*.4,h:3,strong:!0}),r,i),y(n,h(J,{w:e*.3,h:6,strong:!0}),l,a),y(c,h(Ye,{get each(){return Array.from({length:4},(m,g)=>g)},children:m=>(()=>{var g=b(Qu),v=g.firstChild,[f,p]=S(v.nextSibling),k=f.nextSibling,[P,R]=S(k.nextSibling);return y(g,h(Sn,{size:5}),f,p),y(g,h(J,{w:`${50+m*17%35}%`,h:2}),P,R),g})()})),y(n,h(Bt,{w:e*.7,get h(){return Math.min(32,t*.1)},radius:6,style:{background:"var(--agd-bar)"}}),u,_),n})()}function r2({width:e,height:t}){return(()=>{var n=b(fy),o=n.firstChild,r=o.nextSibling,i=r.firstChild,[s,l]=S(i.nextSibling),a=s.nextSibling,[c,d]=S(a.nextSibling),u=c.nextSibling,[_,m]=S(u.nextSibling),g=r.nextSibling,v=g.firstChild,[f,p]=S(v.nextSibling),k=f.nextSibling,P=k.firstChild,[R,A]=S(P.nextSibling),ee=R.nextSibling,[D,K]=S(ee.nextSibling);return y(r,h(J,{w:"90%",h:2}),s,l),y(r,h(J,{w:"75%",h:2}),c,d),y(r,h(J,{w:"60%",h:2}),_,m),y(g,h(Sn,{size:20}),f,p),y(k,h(J,{w:60,h:3,strong:!0}),R,A),y(k,h(J,{w:40,h:2}),D,K),n})()}function i2({width:e,height:t}){return(()=>{var n=b(gy),o=n.firstChild,[r,i]=S(o.nextSibling),s=r.nextSibling,[l,a]=S(s.nextSibling),c=l.nextSibling,[d,u]=S(c.nextSibling);return E(n,"gap",t*.08),y(n,h(J,{w:e*.5,get h(){return Math.max(4,t*.05)},strong:!0}),r,i),y(n,h(J,{w:e*.35}),l,a),y(n,h(Bt,{get w(){return Math.min(140,e*.25)},get h(){return Math.min(32,t*.15)},radius:6,style:{"margin-top":t*.04,background:"var(--agd-bar)"}}),d,u),n})()}function s2({width:e,height:t}){return(()=>{var n=b(my),o=n.firstChild;o.firstChild;var r=o.nextSibling,i=r.firstChild,[s,l]=S(i.nextSibling),a=s.nextSibling,[c,d]=S(a.nextSibling);return y(r,h(J,{w:"40%",h:3,strong:!0}),s,l),y(r,h(J,{w:"70%",h:2}),c,d),n})()}function l2({width:e,height:t}){return(()=>{var n=b(py),o=n.firstChild,[r,i]=S(o.nextSibling),s=r.nextSibling,[l,a]=S(s.nextSibling);return y(n,h(J,{w:e*.4,h:3,strong:!0}),r,i),y(n,h(Bt,{w:60,get h(){return Math.min(24,t*.6)},radius:4}),l,a),n})()}function a2({width:e,height:t}){return(()=>{var n=b(yy),o=n.firstChild,[r,i]=S(o.nextSibling),s=r.nextSibling,[l,a]=S(s.nextSibling),c=l.nextSibling,[d,u]=S(c.nextSibling);return E(n,"gap",t*.06),y(n,h(J,{w:e*.5,h:2}),r,i),y(n,h(J,{w:e*.4,get h(){return Math.max(8,t*.18)},strong:!0}),l,a),y(n,h(J,{w:e*.3,h:2}),d,u),n})()}function c2({width:e,height:t}){const n=Math.max(3,Math.min(5,Math.floor(e/100))),o=Math.min(12,t*.35);return(()=>{var r=b(xy);return y(r,h(Ye,{get each(){return Array.from({length:n},(i,s)=>s)},children:i=>(()=>{var s=b(vy),l=s.firstChild,a=l.nextSibling,[c,d]=S(a.nextSibling);return E(l,"width",o),E(l,"height",o),E(l,"background",i===0?"var(--agd-bar)":"transparent"),y(s,h(Oe,{when:i<n-1,get children(){return b(by)}}),c,d),s})()})),r})()}function d2({width:e,height:t}){return(()=>{var n=b(wy),o=n.firstChild,[r,i]=S(o.nextSibling);return r.nextSibling,y(n,h(J,{get w(){return Math.max(16,e*.5)},h:2,strong:!0}),r,i),n})()}function u2({width:e,height:t}){const o=Math.min(t*.7,e/7.5);return(()=>{var r=b($y);return E(r,"gap",o*.2),y(r,h(Ye,{get each(){return Array.from({length:5},(i,s)=>s)},children:i=>(()=>{var s=b(Sy),l=s.firstChild;return O(s,"width",o),O(s,"height",o),O(l,"fill",i<3?"var(--agd-bar)":"none"),s})()})),r})()}function _2({width:e,height:t}){return(()=>{var n=b(ky),o=n.firstChild,r=o.firstChild,i=r.nextSibling,s=i.nextSibling;return o.nextSibling,O(o,"viewBox",`0 0 ${e} ${t}`),O(r,"y1",t*.3),O(r,"x2",e),O(r,"y2",t*.7),O(i,"y1",t*.6),O(i,"x2",e),O(i,"y2",t*.2),O(s,"x1",e*.4),O(s,"x2",e*.6),O(s,"y2",t),n})()}function h2({width:e,height:t}){const n=Math.max(3,Math.min(5,Math.floor(t/60)));return(()=>{var o=b(Cy),r=o.firstChild,i=r.nextSibling;return y(r,h(Ye,{get each(){return Array.from({length:n},(s,l)=>l)},children:s=>(()=>{var l=b(Iy),a=l.firstChild,[c,d]=S(a.nextSibling),u=c.nextSibling,[_,m]=S(u.nextSibling);return y(l,h(Sn,{size:8}),c,d),y(l,h(Oe,{when:s<n-1,get children(){return b(My)}}),_,m),l})()})),y(i,h(Ye,{get each(){return Array.from({length:n},(s,l)=>l)},children:s=>(()=>{var l=b(Gu),a=l.firstChild,[c,d]=S(a.nextSibling),u=c.nextSibling,[_,m]=S(u.nextSibling);return y(l,h(J,{w:`${35+s*13%25}%`,h:3,strong:!0}),c,d),y(l,h(J,{w:`${50+s*17%30}%`,h:2}),_,m),l})()})),o})()}function f2({width:e,height:t}){return(()=>{var n=b(Ry),o=n.firstChild,r=o.nextSibling,[i,s]=S(r.nextSibling),l=i.nextSibling,[a,c]=S(l.nextSibling);return E(n,"gap",t*.06),y(n,h(J,{w:e*.4,h:2}),i,s),y(n,h(J,{w:e*.25,h:2}),a,c),n})()}function g2({width:e,height:t}){const n=Math.max(3,Math.min(8,Math.floor(t/20)));return(()=>{var o=b(Py),r=o.firstChild,i=r.firstChild,[s,l]=S(i.nextSibling),a=s.nextSibling,[c,d]=S(a.nextSibling),u=c.nextSibling,[_,m]=S(u.nextSibling),g=r.nextSibling,[v,f]=S(g.nextSibling);return y(r,h(Sn,{size:6}),s,l),y(r,h(Sn,{size:6}),c,d),y(r,h(Sn,{size:6}),_,m),y(o,h(Ye,{get each(){return Array.from({length:n},(p,k)=>k)},children:p=>(()=>{var k=b(Ey);return E(k,"padding-left",p>0&&p<n-1?12:0),y(k,h(J,{w:`${25+p*23%50}%`,h:2,strong:p===0})),k})()}),v,f),o})()}function m2({width:e,height:t}){const r=Math.min((e-16)/7,(t-40)/6);return(()=>{var i=b(Ty),s=i.firstChild,l=s.firstChild,a=l.nextSibling,[c,d]=S(a.nextSibling);c.nextSibling;var u=s.nextSibling,_=u.firstChild,[m,g]=S(_.nextSibling),v=m.nextSibling,[f,p]=S(v.nextSibling);return y(s,h(J,{w:e*.3,h:3,strong:!0}),c,d),y(u,h(Ye,{get each(){return Array.from({length:7},(k,P)=>P)},children:k=>(()=>{var P=b(Ly);return E(P,"height",r*.6),y(P,h(J,{w:r*.5,h:2})),P})()}),m,g),y(u,h(Ye,{get each(){return Array.from({length:35},(k,P)=>P)},children:k=>(()=>{var P=b(Ay),R=P.firstChild,A=R.firstChild;return E(P,"height",r),E(R,"width",r*.6),E(R,"height",r*.6),E(R,"background",k===12?"var(--agd-bar)":"transparent"),E(A,"opacity",k===12?1:.3),P})()}),f,p),i})()}function p2({width:e,height:t}){return(()=>{var n=b(By),o=n.firstChild,[r,i]=S(o.nextSibling),s=r.nextSibling,l=s.firstChild,[a,c]=S(l.nextSibling),d=a.nextSibling,[u,_]=S(d.nextSibling),m=s.nextSibling,[g,v]=S(m.nextSibling);return y(n,h(Sn,{get size(){return Math.min(32,t*.55)}}),r,i),y(s,h(J,{w:"50%",h:3,strong:!0}),a,c),y(s,h(J,{w:"75%",h:2}),u,_),y(n,h(J,{w:30,h:2}),g,v),n})()}function y2({width:e,height:t}){return(()=>{var n=b(Oy),o=n.firstChild,r=o.nextSibling,i=r.firstChild,[s,l]=S(i.nextSibling),a=s.nextSibling,[c,d]=S(a.nextSibling),u=c.nextSibling,_=u.nextSibling,m=_.firstChild,[g,v]=S(m.nextSibling),f=g.nextSibling,[p,k]=S(f.nextSibling);return y(r,h(J,{w:"65%",h:4,strong:!0}),s,l),y(r,h(J,{w:"40%",h:3}),c,d),y(_,h(J,{w:"30%",h:5,strong:!0}),g,v),y(_,h(Bt,{get w(){return Math.min(70,e*.3)},h:26,radius:4,style:{background:"var(--agd-bar)"}}),p,k),n})()}function x2({width:e,height:t}){const n=Math.min(48,t*.3);return(()=>{var o=b(Dy),r=o.firstChild,[i,s]=S(r.nextSibling),l=i.nextSibling,[a,c]=S(l.nextSibling),d=a.nextSibling,[u,_]=S(d.nextSibling),m=u.nextSibling,g=m.firstChild,v=g.firstChild,[f,p]=S(v.nextSibling),k=f.nextSibling,[P,R]=S(k.nextSibling),A=g.nextSibling,ee=A.firstChild,[D,K]=S(ee.nextSibling),te=D.nextSibling,[me,j]=S(te.nextSibling),ue=A.nextSibling,be=ue.firstChild,[ye,Te]=S(be.nextSibling),_e=ye.nextSibling,[W,B]=S(_e.nextSibling);return E(o,"gap",t*.06),y(o,h(Sn,{size:n}),i,s),y(o,h(J,{w:e*.45,h:4,strong:!0}),a,c),y(o,h(J,{w:e*.3,h:2}),u,_),E(m,"gap",e*.08),E(m,"margin-top",t*.04),y(g,h(J,{w:20,h:3,strong:!0}),f,p),y(g,h(J,{w:28,h:2}),P,R),y(A,h(J,{w:20,h:3,strong:!0}),D,K),y(A,h(J,{w:28,h:2}),me,j),y(ue,h(J,{w:20,h:3,strong:!0}),ye,Te),y(ue,h(J,{w:28,h:2}),W,B),o})()}function b2({width:e,height:t}){const n=Math.max(e*.6,80),o=Math.max(3,Math.floor(t/40));return(()=>{var r=b(Fy),i=r.firstChild,s=i.nextSibling,l=s.firstChild,a=l.firstChild,[c,d]=S(a.nextSibling);c.nextSibling;var u=l.nextSibling,[_,m]=S(u.nextSibling);return E(i,"width",e-n),E(s,"padding",e*.04),E(l,"margin-bottom",t*.06),y(l,h(J,{w:n*.4,h:4,strong:!0}),c,d),y(s,h(Ye,{get each(){return Array.from({length:o},(g,v)=>v)},children:g=>(()=>{var v=b(Ny);return y(v,h(J,{w:`${50+g*17%35}%`,h:2,strong:g===0})),v})()}),_,m),r})()}function v2({width:e,height:t}){return(()=>{var n=b(zy),o=n.firstChild,r=o.firstChild,[i,s]=S(r.nextSibling),l=i.nextSibling,[a,c]=S(l.nextSibling),d=a.nextSibling,[u,_]=S(d.nextSibling);return o.nextSibling,y(o,h(J,{w:"70%",h:3,strong:!0}),i,s),y(o,h(J,{w:"90%",h:2}),a,c),y(o,h(J,{w:"60%",h:2}),u,_),n})()}function w2({width:e,height:t}){const n=Math.min(t*.7,e*.3);return(()=>{var o=b(Hy),r=o.firstChild,[i,s]=S(r.nextSibling),l=i.nextSibling,[a,c]=S(l.nextSibling);return E(o,"gap",e*.08),y(o,h(Bt,{w:n,h:n,radius:n*.25}),i,s),y(o,h(J,{w:e*.45,get h(){return Math.max(4,t*.2)},strong:!0}),a,c),o})()}function $2({width:e,height:t}){const n=Math.max(2,Math.min(5,Math.floor(t/56)));return(()=>{var o=b(Ku);return y(o,h(Ye,{get each(){return Array.from({length:n},(r,i)=>i)},children:r=>(()=>{var i=b(jy),s=i.firstChild,l=s.firstChild,a=l.nextSibling,[c,d]=S(a.nextSibling),u=s.nextSibling;return E(i,"flex",r===0?2:1),y(s,h(J,{w:e*(.3+r*13%25/100),h:3,strong:!0}),c,d),y(u,r===0?"▼":"▶"),i})()})),o})()}function S2({width:e,height:t}){const n=Math.max(2,Math.min(4,Math.floor(e/120))),o=Math.max(1,Math.min(3,Math.floor(t/120)));return(()=>{var r=b(Uy);return E(r,"grid-template-columns",`repeat(${n}, 1fr)`),E(r,"grid-template-rows",`repeat(${o}, 1fr)`),y(r,h(Ye,{get each(){return Array.from({length:n*o},(i,s)=>s)},children:i=>b(Wy)})),r})()}function k2({width:e,height:t}){const n=Math.min(e,t);return(()=>{var o=b(Yy),r=o.firstChild,i=r.nextSibling;return O(o,"viewBox",`0 0 ${e} ${t}`),O(r,"y",(t-n+2)/2),O(r,"width",n-2),O(r,"height",n-2),O(r,"rx",n*.15),O(i,"d",`M${n*.25} ${t/2}l${n*.2} ${n*.2} ${n*.3}-${n*.35}`),o})()}function C2({width:e,height:t}){const n=Math.min(e,t)/2-1;return(()=>{var o=b(Vy),r=o.firstChild,i=r.nextSibling;return O(o,"viewBox",`0 0 ${e} ${t}`),O(r,"cx",e/2),O(r,"cy",t/2),O(r,"r",n),O(i,"cx",e/2),O(i,"cy",t/2),O(i,"r",n*.45),o})()}function M2({width:e,height:t}){const n=Math.max(2,t*.12),o=Math.min(t*.35,10),r=e*.55;return(()=>{var i=b(Xy),s=i.firstChild,l=s.firstChild,a=s.nextSibling;return E(s,"height",n),E(s,"border-radius",n/2),E(l,"width",r),E(l,"border-radius",n/2),E(a,"left",r-o),E(a,"width",o*2),E(a,"height",o*2),i})()}function I2({width:e,height:t}){const n=Math.min(36,t*.15),o=7,r=4,i=Math.min((e-16)/o,(t-n-40)/(r+1));return(()=>{var s=b(qy),l=s.firstChild,a=l.firstChild,[c,d]=S(a.nextSibling);c.nextSibling;var u=l.nextSibling,_=u.firstChild,m=_.firstChild,g=m.nextSibling,[v,f]=S(g.nextSibling);v.nextSibling;var p=_.nextSibling;return E(l,"height",n),y(l,h(J,{w:"40%",h:2}),c,d),y(_,h(J,{w:e*.25,h:2,strong:!0}),v,f),y(p,h(Ye,{get each(){return Array.from({length:o*r},(k,P)=>P)},children:k=>(()=>{var P=b(Qy),R=P.firstChild,A=R.firstChild,ee=A.firstChild;return E(P,"height",i),E(R,"width",i*.5),E(R,"height",i*.5),E(R,"background",k===10?"var(--agd-bar)":"transparent"),E(ee,"opacity",k===10?1:.25),P})()})),s})()}function R2({width:e,height:t}){return(()=>{var n=b(Ky),o=n.firstChild,r=o.nextSibling,i=r.nextSibling,s=i.nextSibling;return E(n,"gap",t*.08),E(o,"height",t*.2),ie(l=>{var a=Math.max(6,t*.1),c=Math.max(4,t*.06),d=Math.max(4,t*.06);return a!==l.e&&E(r,"height",l.e=a),c!==l.t&&E(i,"height",l.t=c),d!==l.a&&E(s,"height",l.a=d),l},{e:void 0,t:void 0,a:void 0}),n})()}function P2({width:e,height:t}){return(()=>{var n=b(Gy),o=n.firstChild,r=o.firstChild,[i,s]=S(r.nextSibling),l=i.nextSibling;return E(o,"border-radius",t/2),E(o,"padding",`0 ${t*.3}px`),y(o,h(J,{w:"60%",h:2,strong:!0}),i,s),ie(a=>{var c=Math.max(6,t*.3),d=Math.max(6,t*.3);return c!==a.e&&E(l,"width",a.e=c),d!==a.t&&E(l,"height",a.t=d),a},{e:void 0,t:void 0}),n})()}function E2({width:e,height:t}){const n=Math.min(e,t);return(()=>{var o=b(Jy),r=o.firstChild;return O(o,"viewBox",`0 0 ${e} ${t}`),O(r,"d",`M${e/2} ${(t-n)/2+n*.1}l${n*.12} ${n*.25} ${n*.28} ${n*.04}-${n*.2} ${n*.2} ${n*.05} ${n*.28}-${n*.25}-${n*.12}-${n*.25} ${n*.12} ${n*.05}-${n*.28}-${n*.2}-${n*.2} ${n*.28}-${n*.04}z`),o})()}function T2({width:e,height:t}){const n=Math.min(e,t)/2-2;return(()=>{var o=b(Zy),r=o.firstChild,i=r.nextSibling;return O(o,"viewBox",`0 0 ${e} ${t}`),O(r,"cx",e/2),O(r,"cy",t/2),O(r,"r",n),O(i,"d",`M${e/2} ${t/2-n}a${n} ${n} 0 0 1 ${n} ${n}`),o})()}function L2({width:e,height:t}){const n=Math.min(36,t*.25,e*.12),o=Math.max(1,Math.min(3,Math.floor(t/80)));return(()=>{var r=b(ex);return y(r,h(Ye,{get each(){return Array.from({length:o},(i,s)=>s)},children:i=>(()=>{var s=b(tx),l=s.firstChild,[a,c]=S(l.nextSibling),d=a.nextSibling,u=d.firstChild,[_,m]=S(u.nextSibling),g=_.nextSibling,[v,f]=S(g.nextSibling);return E(s,"gap",e*.04),y(s,h(Bt,{w:n,h:n,radius:n*.25}),a,c),y(d,h(J,{w:`${40+i*13%20}%`,h:3,strong:!0}),_,m),y(d,h(J,{w:`${60+i*17%25}%`,h:2}),v,f),s})()})),r})()}function A2({width:e,height:t}){const n=Math.max(2,Math.min(4,Math.floor(e/120))),o=Math.min(36,t*.25);return(()=>{var r=b(nx),i=r.firstChild,[s,l]=S(i.nextSibling),a=s.nextSibling;return E(r,"gap",t*.06),E(r,"padding",t*.06),y(r,h(J,{w:e*.3,h:4,strong:!0}),s,l),E(a,"gap",e*.06),y(a,h(Ye,{get each(){return Array.from({length:n},(c,d)=>d)},children:c=>(()=>{var d=b(ox),u=d.firstChild,[_,m]=S(u.nextSibling),g=_.nextSibling,[v,f]=S(g.nextSibling),p=v.nextSibling,[k,P]=S(p.nextSibling);return y(d,h(Sn,{size:o}),_,m),y(d,h(J,{w:e*.12,h:3,strong:!0}),v,f),y(d,h(J,{w:e*.08,h:2}),k,P),d})()})),r})()}function B2({width:e,height:t}){const n=Math.max(2,Math.min(3,Math.floor(t/80)));return(()=>{var o=b(rx),r=o.firstChild,[i,s]=S(r.nextSibling),l=i.nextSibling,[a,c]=S(l.nextSibling),d=a.nextSibling,u=d.nextSibling,[_,m]=S(u.nextSibling),g=_.nextSibling,[v,f]=S(g.nextSibling);return E(o,"padding",e*.06),E(o,"gap",t*.04),y(o,h(J,{w:e*.5,get h(){return Math.max(5,t*.04)},strong:!0}),i,s),y(o,h(J,{w:e*.35,h:2}),a,c),E(d,"gap",t*.03),E(d,"margin-top",t*.04),y(d,h(Ye,{get each(){return Array.from({length:n},(p,k)=>k)},children:p=>(()=>{var k=b(Gu),P=k.firstChild,[R,A]=S(P.nextSibling),ee=R.nextSibling,[D,K]=S(ee.nextSibling);return y(k,h(J,{get w(){return Math.min(60,e*.2)},h:2}),R,A),y(k,h(Bt,{w:"100%",get h(){return Math.min(32,t*.1)},radius:4}),D,K),k})()})),y(o,h(Bt,{w:"100%",get h(){return Math.min(36,t*.12)},radius:6,style:{"margin-top":t*.03,background:"var(--agd-bar)"}}),_,m),y(o,h(J,{w:e*.4,h:2}),v,f),o})()}function O2({width:e,height:t}){return(()=>{var n=b(ix),o=n.firstChild,[r,i]=S(o.nextSibling),s=r.nextSibling,[l,a]=S(s.nextSibling),c=l.nextSibling,d=c.firstChild,u=d.firstChild,[_,m]=S(u.nextSibling),g=_.nextSibling,[v,f]=S(g.nextSibling),p=d.nextSibling,k=p.firstChild,[P,R]=S(k.nextSibling),A=P.nextSibling,[ee,D]=S(A.nextSibling),K=c.nextSibling,te=K.firstChild,[me,j]=S(te.nextSibling),ue=me.nextSibling,[be,ye]=S(ue.nextSibling),Te=K.nextSibling,_e=Te.firstChild,[W,B]=S(_e.nextSibling),Z=W.nextSibling,[de,Y]=S(Z.nextSibling),oe=Te.nextSibling,[ve,he]=S(oe.nextSibling);return E(n,"padding",e*.04),E(n,"gap",t*.03),y(n,h(J,{w:e*.4,h:4,strong:!0}),r,i),y(n,h(J,{w:e*.6,h:2}),l,a),E(c,"margin-top",t*.03),y(d,h(J,{w:50,h:2}),_,m),y(d,h(Bt,{w:"100%",get h(){return Math.min(28,t*.1)},radius:4}),v,f),y(p,h(J,{w:40,h:2}),P,R),y(p,h(Bt,{w:"100%",get h(){return Math.min(28,t*.1)},radius:4}),ee,D),y(K,h(J,{w:50,h:2}),me,j),y(K,h(Bt,{w:"100%",get h(){return Math.min(28,t*.1)},radius:4}),be,ye),y(Te,h(J,{w:60,h:2}),W,B),y(Te,h(Bt,{w:"100%",h:"100%",radius:4}),de,Y),y(n,h(Bt,{get w(){return Math.min(120,e*.3)},get h(){return Math.min(30,t*.1)},radius:6,style:{"align-self":"flex-end",background:"var(--agd-bar)"}}),ve,he),n})()}var D2={navigation:k5,hero:C5,sidebar:M5,footer:I5,modal:R5,card:P5,text:E5,image:T5,table:L5,list:A5,button:B5,input:O5,form:D5,tabs:F5,avatar:N5,badge:z5,header:H5,section:j5,grid:U5,dropdown:W5,toggle:Y5,search:V5,toast:X5,progress:q5,chart:Q5,video:K5,tooltip:G5,breadcrumb:J5,pagination:Z5,divider:e2,accordion:t2,carousel:n2,pricing:o2,testimonial:r2,cta:i2,alert:s2,banner:l2,stat:a2,stepper:c2,tag:d2,rating:u2,map:_2,timeline:h2,fileUpload:f2,codeBlock:g2,calendar:m2,notification:p2,productCard:y2,profile:x2,drawer:b2,popover:v2,logo:w2,faq:$2,gallery:S2,checkbox:k2,radio:C2,slider:M2,datePicker:I2,skeleton:R2,chip:P2,icon:E2,spinner:T2,feature:L2,team:A2,login:B2,contact:O2};function F2({type:e,width:t,height:n,text:o}){const r=D2[e];return r?(()=>{var i=b(lx);return y(i,h(r,{width:t,height:n,text:o})),i})():(()=>{var i=b(sx),s=i.firstChild;return y(s,e),i})()}var N2=`svg[fill=none] {
  fill: none !important;
}

.styles-module__overlayExiting___iEmYr {
  opacity: 0 !important;
  transition: opacity 0.25s ease !important;
  pointer-events: none !important;
}

.styles-module__overlay___aWh-q {
  position: fixed;
  inset: 0;
  z-index: 99995;
  pointer-events: auto;
  cursor: default;
  animation: styles-module__overlayFadeIn___aECVy 0.15s ease;
  --agd-stroke: rgba(59, 130, 246, 0.35);
  --agd-fill: rgba(59, 130, 246, 0.06);
  --agd-bar: rgba(59, 130, 246, 0.18);
  --agd-bar-strong: rgba(59, 130, 246, 0.28);
  --agd-text-3: rgba(255, 255, 255, 0.6);
  --agd-surface: #fff;
}
.styles-module__overlay___aWh-q.styles-module__light___ORIft {
  --agd-surface: #fff;
}
.styles-module__overlay___aWh-q:not(.styles-module__light___ORIft) {
  --agd-surface: #141414;
}
.styles-module__overlay___aWh-q.styles-module__wireframe___itvQU {
  --agd-stroke: rgba(249, 115, 22, 0.35);
  --agd-fill: rgba(249, 115, 22, 0.06);
  --agd-bar: rgba(249, 115, 22, 0.18);
  --agd-bar-strong: rgba(249, 115, 22, 0.28);
}
.styles-module__overlay___aWh-q.styles-module__placing___45yD8 {
  cursor: crosshair;
}
.styles-module__overlay___aWh-q.styles-module__passthrough___xaFeE {
  pointer-events: none;
}

.styles-module__blankCanvas___t2Eue {
  position: fixed;
  inset: 0;
  z-index: 99994;
  background: #fff;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease;
}
.styles-module__blankCanvas___t2Eue.styles-module__visible___OKKqX {
  opacity: var(--canvas-opacity, 1);
  pointer-events: auto;
}
.styles-module__blankCanvas___t2Eue::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(0, 0, 0, 0.08) 1px, transparent 1px);
  background-size: 24px 24px;
  background-position: 12px 12px;
  pointer-events: none;
  transition: opacity 0.2s ease;
}
.styles-module__blankCanvas___t2Eue.styles-module__gridActive___OZ-cf::after {
  opacity: 1;
  background-image: radial-gradient(circle, rgba(0, 0, 0, 0.22) 1px, transparent 1px);
}

.styles-module__paletteHeader___-Q5gQ {
  padding: 0 1rem 0.375rem;
}

.styles-module__paletteHeaderTitle___oHqZC {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #fff;
  letter-spacing: -0.0094em;
}
.styles-module__light___ORIft .styles-module__paletteHeaderTitle___oHqZC {
  color: rgba(0, 0, 0, 0.85);
}

.styles-module__paletteHeaderDesc___6i74T {
  font-size: 0.6875rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.45);
  margin-top: 2px;
  line-height: 14px;
}
.styles-module__light___ORIft .styles-module__paletteHeaderDesc___6i74T {
  color: rgba(0, 0, 0, 0.45);
}
.styles-module__paletteHeaderDesc___6i74T a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: underline dotted;
  text-decoration-color: rgba(255, 255, 255, 0.2);
  text-underline-offset: 2px;
  transition: color 0.15s ease;
}
.styles-module__paletteHeaderDesc___6i74T a:hover {
  color: #fff;
}
.styles-module__light___ORIft .styles-module__paletteHeaderDesc___6i74T a {
  color: rgba(0, 0, 0, 0.6);
  text-decoration-color: rgba(0, 0, 0, 0.2);
}
.styles-module__light___ORIft .styles-module__paletteHeaderDesc___6i74T a:hover {
  color: rgba(0, 0, 0, 0.85);
}

.styles-module__wireframePurposeWrap___To-tS {
  display: grid;
  grid-template-rows: 1fr;
  transition: grid-template-rows 0.2s ease, opacity 0.15s ease;
  opacity: 1;
}
.styles-module__wireframePurposeWrap___To-tS.styles-module__collapsed___Ms9vS {
  grid-template-rows: 0fr;
  opacity: 0;
}

.styles-module__wireframePurposeInner___Lrahs {
  overflow: hidden;
}

.styles-module__wireframePurposeInput___7EtBN {
  display: block;
  width: calc(100% - 2rem);
  margin: 0.25rem 1rem 0.375rem;
  padding: 0.375rem 0.5rem;
  font-size: 0.8125rem;
  font-family: inherit;
  color: rgba(255, 255, 255, 0.85);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.375rem;
  resize: none;
  outline: none;
  transition: border-color 0.15s ease;
  letter-spacing: -0.0094em;
}
.styles-module__wireframePurposeInput___7EtBN::placeholder {
  color: rgba(255, 255, 255, 0.3);
}
.styles-module__wireframePurposeInput___7EtBN:focus {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.05);
}
.styles-module__light___ORIft .styles-module__wireframePurposeInput___7EtBN {
  color: rgba(0, 0, 0, 0.7);
  background: rgba(0, 0, 0, 0.03);
  border-color: rgba(0, 0, 0, 0.1);
}
.styles-module__light___ORIft .styles-module__wireframePurposeInput___7EtBN::placeholder {
  color: rgba(0, 0, 0, 0.3);
}
.styles-module__light___ORIft .styles-module__wireframePurposeInput___7EtBN:focus {
  border-color: rgba(0, 0, 0, 0.25);
  background: rgba(0, 0, 0, 0.05);
}

.styles-module__canvasToggle___-QqSy {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  margin: 0.25rem 1rem 0.25rem;
  padding: 0.375rem 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  border: 1px dashed rgba(255, 255, 255, 0.1);
  background: transparent;
  transition: background 0.15s ease, border-color 0.15s ease;
}
.styles-module__canvasToggle___-QqSy:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.15);
}
.styles-module__canvasToggle___-QqSy.styles-module__active___hosp7 {
  background: #f97316;
  border-color: transparent;
  border-style: solid;
  box-shadow: none;
}
.styles-module__light___ORIft .styles-module__canvasToggle___-QqSy {
  border-color: rgba(0, 0, 0, 0.08);
}
.styles-module__light___ORIft .styles-module__canvasToggle___-QqSy:hover {
  background: rgba(0, 0, 0, 0.02);
  border-color: rgba(0, 0, 0, 0.12);
}
.styles-module__light___ORIft .styles-module__canvasToggle___-QqSy.styles-module__active___hosp7 {
  background: #f97316;
  border-color: transparent;
  border-style: solid;
  box-shadow: none;
}

.styles-module__canvasToggleIcon___7pJ82 {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.35);
}
.styles-module__active___hosp7 .styles-module__canvasToggleIcon___7pJ82 {
  color: rgba(255, 255, 255, 0.85);
}
.styles-module__light___ORIft .styles-module__canvasToggleIcon___7pJ82 {
  color: rgba(0, 0, 0, 0.25);
}
.styles-module__light___ORIft .styles-module__active___hosp7 .styles-module__canvasToggleIcon___7pJ82 {
  color: rgba(255, 255, 255, 0.85);
}

.styles-module__canvasToggleLabel___OanpY {
  font-size: 0.8125rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: -0.0094em;
}
.styles-module__active___hosp7 .styles-module__canvasToggleLabel___OanpY {
  color: #fff;
}
.styles-module__light___ORIft .styles-module__canvasToggleLabel___OanpY {
  color: rgba(0, 0, 0, 0.5);
}
.styles-module__light___ORIft .styles-module__active___hosp7 .styles-module__canvasToggleLabel___OanpY {
  color: #fff;
}

.styles-module__canvasPurposeWrap___hj6zk {
  display: grid;
  grid-template-rows: 1fr;
  transition: grid-template-rows 0.2s ease, opacity 0.15s ease;
  opacity: 1;
}
.styles-module__canvasPurposeWrap___hj6zk.styles-module__collapsed___Ms9vS {
  grid-template-rows: 0fr;
  opacity: 0;
}

.styles-module__canvasPurposeInner___VWiyu {
  overflow: hidden;
}

.styles-module__canvasPurposeToggle___byDH2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  margin: 0.375rem 1rem 0.375rem 1.1875rem;
}
.styles-module__canvasPurposeToggle___byDH2 input[type=checkbox] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.styles-module__canvasPurposeCheck___xqd7l {
  position: relative;
  width: 14px;
  height: 14px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.25s ease, border-color 0.25s ease;
}
.styles-module__canvasPurposeCheck___xqd7l svg {
  color: #1a1a1a;
  opacity: 1;
  transition: opacity 0.15s ease;
}
.styles-module__canvasPurposeCheck___xqd7l.styles-module__checked___-1JGH {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgb(255, 255, 255);
}
.styles-module__light___ORIft .styles-module__canvasPurposeCheck___xqd7l {
  border: 1px solid rgba(0, 0, 0, 0.15);
  background: #fff;
}
.styles-module__light___ORIft .styles-module__canvasPurposeCheck___xqd7l.styles-module__checked___-1JGH {
  border-color: #1a1a1a;
  background: #1a1a1a;
}
.styles-module__light___ORIft .styles-module__canvasPurposeCheck___xqd7l.styles-module__checked___-1JGH svg {
  color: #fff;
}

.styles-module__canvasPurposeLabel___Zu-tD {
  font-size: 0.8125rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: -0.0094em;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
.styles-module__light___ORIft .styles-module__canvasPurposeLabel___Zu-tD {
  color: rgba(0, 0, 0, 0.5);
}

.styles-module__canvasPurposeHelp___jijwR {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: help;
}
.styles-module__canvasPurposeHelp___jijwR svg {
  color: rgba(255, 255, 255, 0.2);
  transform: translateY(2px);
  transition: color 0.15s ease;
}
.styles-module__canvasPurposeHelp___jijwR:hover svg {
  color: rgba(255, 255, 255, 0.5);
}
.styles-module__light___ORIft .styles-module__canvasPurposeHelp___jijwR svg {
  color: rgba(0, 0, 0, 0.2);
}
.styles-module__light___ORIft .styles-module__canvasPurposeHelp___jijwR:hover svg {
  color: rgba(0, 0, 0, 0.5);
}

.styles-module__placement___zcxv8 {
  position: absolute;
  border: 1.5px dashed rgba(59, 130, 246, 0.4);
  border-radius: 6px;
  background: rgba(59, 130, 246, 0.08);
  cursor: grab;
  transition: box-shadow 0.15s, border-color 0.15s, opacity 0.15s ease, transform 0.15s ease;
  user-select: none;
  pointer-events: auto;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  animation: styles-module__placementEnter___TdRhf 0.25s cubic-bezier(0.34, 1.2, 0.64, 1);
}
.styles-module__placement___zcxv8:active {
  cursor: grabbing;
}
.styles-module__placement___zcxv8:hover {
  border-color: rgba(59, 130, 246, 0.5);
  background: rgba(59, 130, 246, 0.1);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.12);
}
.styles-module__placement___zcxv8.styles-module__selected___6yrp6 {
  border-color: #3c82f7;
  border-style: solid;
  background: rgba(59, 130, 246, 0.1);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15), 0 2px 8px rgba(59, 130, 246, 0.15);
}
.styles-module__placement___zcxv8.styles-module__selected___6yrp6:hover {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15), 0 2px 8px rgba(59, 130, 246, 0.15);
}
.styles-module__wireframe___itvQU .styles-module__placement___zcxv8 {
  border-color: rgba(249, 115, 22, 0.4);
  background: rgba(249, 115, 22, 0.08);
}
.styles-module__wireframe___itvQU .styles-module__placement___zcxv8:hover {
  border-color: rgba(249, 115, 22, 0.5);
  background: rgba(249, 115, 22, 0.1);
  box-shadow: 0 2px 8px rgba(249, 115, 22, 0.12);
}
.styles-module__wireframe___itvQU .styles-module__placement___zcxv8.styles-module__selected___6yrp6 {
  border-color: #f97316;
  background: rgba(249, 115, 22, 0.1);
  box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.15), 0 2px 8px rgba(249, 115, 22, 0.15);
}
.styles-module__wireframe___itvQU .styles-module__placement___zcxv8.styles-module__selected___6yrp6:hover {
  box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.15), 0 2px 8px rgba(249, 115, 22, 0.15);
}
.styles-module__placement___zcxv8.styles-module__dragging___le6KZ {
  opacity: 0.85;
  z-index: 50;
}
.styles-module__placement___zcxv8.styles-module__exiting___YrM8F {
  opacity: 0;
  transform: scale(0.97);
  pointer-events: none;
  animation: none;
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.32, 0.72, 0, 1);
}

.styles-module__placementContent___f64A4 {
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.styles-module__placementLabel___0KvWl {
  position: absolute;
  top: -18px;
  left: 0;
  font-size: 10px;
  font-weight: 600;
  color: rgba(59, 130, 246, 0.7);
  white-space: nowrap;
  pointer-events: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  text-shadow: 0 0 4px rgba(255, 255, 255, 0.8), 0 0 8px rgba(255, 255, 255, 0.5);
}
.styles-module__selected___6yrp6 .styles-module__placementLabel___0KvWl {
  color: #3c82f7;
}
.styles-module__wireframe___itvQU .styles-module__placementLabel___0KvWl {
  color: rgba(249, 115, 22, 0.7);
}
.styles-module__wireframe___itvQU .styles-module__selected___6yrp6 .styles-module__placementLabel___0KvWl {
  color: #f97316;
}

.styles-module__placementAnnotation___78pTr {
  position: absolute;
  bottom: -18px;
  left: 0;
  right: 0;
  font-weight: 450;
  color: rgba(0, 0, 0, 0.5);
  font-size: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  text-shadow: 0 0 4px rgba(255, 255, 255, 0.9), 0 0 8px rgba(255, 255, 255, 0.6);
  opacity: 0;
  transform: translateY(-2px);
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.styles-module__placementAnnotation___78pTr.styles-module__annotationVisible___mrUyA {
  opacity: 1;
  transform: translateY(0);
}

.styles-module__sectionAnnotation___aUIs0 {
  position: absolute;
  bottom: -18px;
  left: 0;
  right: 0;
  font-weight: 450;
  color: rgba(59, 130, 246, 0.6);
  font-size: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  text-shadow: 0 0 4px rgba(255, 255, 255, 0.9), 0 0 8px rgba(255, 255, 255, 0.6);
  opacity: 0;
  transform: translateY(-2px);
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.styles-module__sectionAnnotation___aUIs0.styles-module__annotationVisible___mrUyA {
  opacity: 1;
  transform: translateY(0);
}

.styles-module__handle___Ikbxm {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #fff;
  border: 1.5px solid #3c82f7;
  border-radius: 2px;
  z-index: 12;
  box-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.12);
  opacity: 0;
  transform: scale(0.3);
  pointer-events: none;
  will-change: opacity, transform;
  transition: opacity 0.2s ease-out, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.styles-module__placement___zcxv8:hover .styles-module__handle___Ikbxm, .styles-module__sectionOutline___s0hy-:hover .styles-module__handle___Ikbxm, .styles-module__ghostOutline___po-kO:hover .styles-module__handle___Ikbxm, .styles-module__placement___zcxv8:active .styles-module__handle___Ikbxm, .styles-module__sectionOutline___s0hy-:active .styles-module__handle___Ikbxm, .styles-module__ghostOutline___po-kO:active .styles-module__handle___Ikbxm, .styles-module__selected___6yrp6 .styles-module__handle___Ikbxm {
  opacity: 1;
  transform: scale(1);
  pointer-events: auto;
}
.styles-module__sectionOutline___s0hy- .styles-module__handle___Ikbxm {
  border-color: inherit;
}
.styles-module__wireframe___itvQU .styles-module__handle___Ikbxm {
  border-color: #f97316;
}

.styles-module__handleNw___4TMIj {
  top: -4px;
  left: -4px;
  cursor: nw-resize;
}

.styles-module__handleNe___mnsTh {
  top: -4px;
  right: -4px;
  cursor: ne-resize;
}

.styles-module__handleSe___oSFnk {
  bottom: -4px;
  right: -4px;
  cursor: se-resize;
}

.styles-module__handleSw___pi--Z {
  bottom: -4px;
  left: -4px;
  cursor: sw-resize;
}

.styles-module__handleN___aBA-Q, .styles-module__handleE___0hM5u, .styles-module__handleS___JjDRv, .styles-module__handleW___ERWGQ {
  opacity: 0 !important;
  pointer-events: none !important;
}

.styles-module__edgeHandle___XxXdT {
  position: absolute;
  z-index: 11;
  display: flex;
  align-items: center;
  justify-content: center;
}
.styles-module__edgeHandle___XxXdT::after {
  content: "";
  position: absolute;
  border-radius: 4px;
  background: #3c82f7;
}
.styles-module__wireframe___itvQU .styles-module__edgeHandle___XxXdT::after {
  background: #f97316;
}
.styles-module__edgeHandle___XxXdT::after {
  opacity: 0;
  transition: opacity 0.1s ease, transform 0.1s ease;
  transform: scale(0.8);
}
.styles-module__edgeHandle___XxXdT:hover::after {
  opacity: 0.85;
  transform: scale(1);
}
.styles-module__edgeHandle___XxXdT svg {
  position: relative;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.1s ease;
  filter: drop-shadow(0 0 2px var(--agd-surface));
}
.styles-module__edgeHandle___XxXdT:hover svg {
  opacity: 1;
}

.styles-module__edgeN___-JJDj, .styles-module__edgeS___66lMX {
  left: 12px;
  right: 12px;
  height: 12px;
  cursor: n-resize;
}
.styles-module__edgeN___-JJDj::after, .styles-module__edgeS___66lMX::after {
  width: 24px;
  height: 4px;
}

.styles-module__edgeN___-JJDj {
  top: -6px;
}

.styles-module__edgeS___66lMX {
  bottom: -6px;
  cursor: s-resize;
}

.styles-module__edgeE___1bGDa, .styles-module__edgeW___lHQNo {
  top: 12px;
  bottom: 12px;
  width: 12px;
  cursor: e-resize;
}
.styles-module__edgeE___1bGDa::after, .styles-module__edgeW___lHQNo::after {
  width: 4px;
  height: 24px;
}

.styles-module__edgeE___1bGDa {
  right: -6px;
}

.styles-module__edgeW___lHQNo {
  left: -6px;
  cursor: w-resize;
}

.styles-module__deleteButton___LkGCb {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  color: rgba(0, 0, 0, 0.35);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  line-height: 1;
  z-index: 15;
  pointer-events: none;
  opacity: 0;
  transform: scale(0.8);
  will-change: opacity, transform;
  transition: opacity 0.2s ease-out, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.12s ease, color 0.12s ease, border-color 0.12s ease, box-shadow 0.12s ease;
}
.styles-module__placement___zcxv8:hover .styles-module__deleteButton___LkGCb, .styles-module__selected___6yrp6 .styles-module__deleteButton___LkGCb, .styles-module__sectionOutline___s0hy-:hover .styles-module__deleteButton___LkGCb, .styles-module__sectionOutline___s0hy-.styles-module__selected___6yrp6 .styles-module__deleteButton___LkGCb, .styles-module__ghostOutline___po-kO:hover .styles-module__deleteButton___LkGCb, .styles-module__ghostOutline___po-kO.styles-module__selected___6yrp6 .styles-module__deleteButton___LkGCb {
  opacity: 1;
  transform: scale(1);
  pointer-events: auto;
}
.styles-module__deleteButton___LkGCb:hover {
  background: #ef4444;
  color: #fff;
  border-color: #ef4444;
  box-shadow: 0 1px 4px rgba(239, 68, 68, 0.3);
  transform: scale(1.1);
}
.styles-module__overlay___aWh-q:not(.styles-module__light___ORIft) .styles-module__deleteButton___LkGCb, .styles-module__rearrangeOverlay___-3R3t:not(.styles-module__light___ORIft) .styles-module__deleteButton___LkGCb {
  background: rgba(40, 40, 40, 0.9);
  border-color: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
}
.styles-module__overlay___aWh-q:not(.styles-module__light___ORIft) .styles-module__deleteButton___LkGCb:hover, .styles-module__rearrangeOverlay___-3R3t:not(.styles-module__light___ORIft) .styles-module__deleteButton___LkGCb:hover {
  background: #ef4444;
  color: #fff;
  border-color: #ef4444;
}

.styles-module__drawBox___BrVAa {
  position: fixed;
  pointer-events: none;
  z-index: 99996;
  border: 2px solid #3c82f7;
  border-radius: 6px;
  background: rgba(59, 130, 246, 0.15);
}

.styles-module__selectBox___Iu8kB {
  position: fixed;
  pointer-events: none;
  z-index: 99996;
  border: 1px dashed #3c82f7;
  background: rgba(59, 130, 246, 0.08);
  border-radius: 2px;
}

.styles-module__sizeIndicator___7zJ4y {
  position: fixed;
  pointer-events: none;
  z-index: 100001;
  font-size: 10px;
  color: #fff;
  background: #3c82f7;
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
  font-weight: 500;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.styles-module__guideLine___DUQY2 {
  pointer-events: none;
  z-index: 100001;
  background: #f0f;
  opacity: 0.5;
}

.styles-module__dragPreview___onPbU {
  position: fixed;
  z-index: 100002;
  pointer-events: none;
  border: 1.5px dashed #3c82f7;
  border-radius: 6px;
  background: rgba(59, 130, 246, 0.1);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 600;
  color: #3c82f7;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.15);
  transition: width 0.08s ease, height 0.08s ease, opacity 0.08s ease;
}

.styles-module__dragPreviewWireframe___jsg0G {
  border-color: #f97316;
  background: rgba(249, 115, 22, 0.1);
  color: #f97316;
  box-shadow: 0 4px 16px rgba(249, 115, 22, 0.15);
}

.styles-module__palette___C7iSH {
  position: absolute;
  right: 5px;
  bottom: calc(100% + 0.5rem);
  width: 256px;
  overflow: hidden;
  background: #1c1c1c;
  border: none;
  border-radius: 1rem;
  padding: 13px 0 16px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.04);
  z-index: 100001;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  cursor: default;
  opacity: 0;
  filter: blur(5px);
}
.styles-module__palette___C7iSH .styles-module__paletteItem___6TlnA,
.styles-module__palette___C7iSH .styles-module__paletteItemLabel___6ncO4,
.styles-module__palette___C7iSH .styles-module__paletteSectionTitle___PqnjX,
.styles-module__palette___C7iSH .styles-module__paletteFooter___QYnAG {
  transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease;
}
.styles-module__palette___C7iSH.styles-module__enter___6LYk5 {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0px);
  transition: opacity 0.2s ease, transform 0.2s ease, filter 0.2s ease;
}
.styles-module__palette___C7iSH.styles-module__exit___iSGRw {
  opacity: 0;
  transform: translateY(6px);
  filter: blur(5px);
  pointer-events: none;
  transition: opacity 0.1s ease, transform 0.1s ease, filter 0.1s ease;
}
.styles-module__palette___C7iSH.styles-module__light___ORIft {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04);
}

.styles-module__paletteSection___V8DEA {
  padding: 0 1rem;
}
.styles-module__paletteSection___V8DEA + .styles-module__paletteSection___V8DEA {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
}
.styles-module__light___ORIft .styles-module__paletteSection___V8DEA + .styles-module__paletteSection___V8DEA {
  border-top-color: rgba(0, 0, 0, 0.07);
}

.styles-module__paletteSectionTitle___PqnjX {
  font-size: 0.6875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: -0.0094em;
  padding: 0 0 3px 3px;
}
.styles-module__light___ORIft .styles-module__paletteSectionTitle___PqnjX {
  color: rgba(0, 0, 0, 0.4);
}

.styles-module__paletteItem___6TlnA {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.25rem;
  margin-bottom: 1px;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;
  border: 1px solid transparent;
  user-select: none;
  min-height: 24px;
}
.styles-module__paletteItem___6TlnA:hover {
  background: rgba(255, 255, 255, 0.1);
}
.styles-module__paletteItem___6TlnA.styles-module__active___hosp7 {
  background: #3c82f7;
  border-color: transparent;
}
.styles-module__paletteItem___6TlnA.styles-module__wireframe___itvQU.styles-module__active___hosp7 {
  background: #f97316;
}
.styles-module__light___ORIft .styles-module__paletteItem___6TlnA:hover {
  background: rgba(0, 0, 0, 0.05);
}
.styles-module__light___ORIft .styles-module__paletteItem___6TlnA.styles-module__active___hosp7 {
  background: #3c82f7;
  border-color: transparent;
}
.styles-module__light___ORIft .styles-module__paletteItem___6TlnA.styles-module__wireframe___itvQU.styles-module__active___hosp7 {
  background: #f97316;
}

.styles-module__paletteItemIcon___0NPQK {
  width: 20px;
  height: 16px;
  border-radius: 2px;
  border: 1px dashed rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.45);
}
.styles-module__paletteItemIcon___0NPQK svg {
  display: block;
  width: 20px;
  height: 16px;
}
.styles-module__active___hosp7 .styles-module__paletteItemIcon___0NPQK {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}
.styles-module__light___ORIft .styles-module__paletteItemIcon___0NPQK {
  border-color: rgba(0, 0, 0, 0.12);
  background: rgba(0, 0, 0, 0.02);
  color: rgba(0, 0, 0, 0.4);
}
.styles-module__light___ORIft .styles-module__active___hosp7 .styles-module__paletteItemIcon___0NPQK {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

.styles-module__paletteItemLabel___6ncO4 {
  font-size: 0.8125rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: -0.0094em;
  line-height: 1;
  min-width: 0;
}
.styles-module__active___hosp7 .styles-module__paletteItemLabel___6ncO4 {
  color: #fff;
  font-weight: 600;
}
.styles-module__light___ORIft .styles-module__paletteItemLabel___6ncO4 {
  color: rgba(0, 0, 0, 0.7);
}
.styles-module__light___ORIft .styles-module__active___hosp7 .styles-module__paletteItemLabel___6ncO4 {
  color: #fff;
  font-weight: 600;
}

.styles-module__placeScroll___7sClM {
  max-height: 240px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-top: 0.25rem;
}
.styles-module__placeScroll___7sClM.styles-module__fadeTop___KT9tF {
  -webkit-mask-image: linear-gradient(to bottom, transparent 0, black 32px);
  mask-image: linear-gradient(to bottom, transparent 0, black 32px);
}
.styles-module__placeScroll___7sClM.styles-module__fadeBottom___x3ShT {
  -webkit-mask-image: linear-gradient(to bottom, black calc(100% - 32px), transparent 100%);
  mask-image: linear-gradient(to bottom, black calc(100% - 32px), transparent 100%);
}
.styles-module__placeScroll___7sClM.styles-module__fadeTop___KT9tF.styles-module__fadeBottom___x3ShT {
  -webkit-mask-image: linear-gradient(to bottom, transparent 0, black 32px, black calc(100% - 32px), transparent 100%);
  mask-image: linear-gradient(to bottom, transparent 0, black 32px, black calc(100% - 32px), transparent 100%);
}
.styles-module__placeScroll___7sClM::-webkit-scrollbar {
  width: 3px;
}
.styles-module__placeScroll___7sClM::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.12);
  border-radius: 2px;
}
.styles-module__light___ORIft .styles-module__placeScroll___7sClM::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
}

.styles-module__paletteFooterWrap___71-fI {
  display: grid;
  grid-template-rows: 1fr;
  transition: grid-template-rows 0.25s cubic-bezier(0.32, 0.72, 0, 1);
}
.styles-module__paletteFooterWrap___71-fI.styles-module__footerHidden___fJUik {
  grid-template-rows: 0fr;
}

.styles-module__paletteFooterInnerContent___VC26h {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.styles-module__footerHidden___fJUik .styles-module__paletteFooterInnerContent___VC26h {
  opacity: 0;
  transform: translateY(4px);
}

.styles-module__paletteFooterInner___dfylY {
  overflow: hidden;
}

.styles-module__paletteFooter___QYnAG {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 24px;
  padding: 0 1rem;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
}
.styles-module__light___ORIft .styles-module__paletteFooter___QYnAG {
  border-top-color: rgba(0, 0, 0, 0.07);
}

.styles-module__paletteFooterCount___D3Fia {
  font-size: 0.8125rem;
  font-weight: 400;
  letter-spacing: -0.0094em;
  color: rgba(255, 255, 255, 0.5);
}
.styles-module__light___ORIft .styles-module__paletteFooterCount___D3Fia {
  color: rgba(0, 0, 0, 0.5);
}

.styles-module__paletteFooterClear___ybBoa {
  font-size: 0.8125rem;
  font-weight: 400;
  letter-spacing: -0.0094em;
  color: rgba(255, 255, 255, 0.5);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
  transition: color 0.15s ease;
}
.styles-module__paletteFooterClear___ybBoa:hover {
  color: rgba(255, 255, 255, 0.7);
}
.styles-module__light___ORIft .styles-module__paletteFooterClear___ybBoa {
  color: rgba(0, 0, 0, 0.5);
}
.styles-module__light___ORIft .styles-module__paletteFooterClear___ybBoa:hover {
  color: rgba(0, 0, 0, 0.6);
}

.styles-module__paletteFooterActions___fLzv8 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.styles-module__rollingWrap___S75jM {
  display: inline-block;
  overflow: hidden;
  height: 1.15em;
  position: relative;
  vertical-align: bottom;
}

.styles-module__rollingNum___1RKDx {
  position: absolute;
  left: 0;
  top: 0;
}

.styles-module__exitUp___AFDRW {
  animation: styles-module__numExitUp___FRQqx 0.25s cubic-bezier(0.32, 0.72, 0, 1) forwards;
}

.styles-module__enterUp___CPlXb {
  animation: styles-module__numEnterUp___2Yd-w 0.25s cubic-bezier(0.32, 0.72, 0, 1) forwards;
}

.styles-module__exitDown___-1yAy {
  animation: styles-module__numExitDown___xm5by 0.25s cubic-bezier(0.32, 0.72, 0, 1) forwards;
}

.styles-module__enterDown___DDuFR {
  animation: styles-module__numEnterDown___hpxBk 0.25s cubic-bezier(0.32, 0.72, 0, 1) forwards;
}

@keyframes styles-module__numExitUp___FRQqx {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-110%);
    opacity: 0;
  }
}
@keyframes styles-module__numEnterUp___2Yd-w {
  from {
    transform: translateY(110%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
@keyframes styles-module__numExitDown___xm5by {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(110%);
    opacity: 0;
  }
}
@keyframes styles-module__numEnterDown___hpxBk {
  from {
    transform: translateY(-110%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
.styles-module__rearrangeOverlay___-3R3t {
  position: fixed;
  inset: 0;
  z-index: 99995;
  pointer-events: none;
  cursor: default;
  user-select: none;
  animation: styles-module__overlayFadeIn___aECVy 0.15s ease;
}

.styles-module__hoverHighlight___8eT-v {
  position: fixed;
  pointer-events: none;
  z-index: 99994;
  border: 2px dashed rgba(59, 130, 246, 0.5);
  border-radius: 4px;
  background: rgba(59, 130, 246, 0.06);
  animation: styles-module__highlightFadeIn___Lg7KY 0.12s ease;
}

.styles-module__sectionOutline___s0hy- {
  position: fixed;
  border: 2px solid;
  border-radius: 4px;
  cursor: grab;
}
.styles-module__sectionOutline___s0hy-:active {
  cursor: grabbing;
}
.styles-module__sectionOutline___s0hy- {
  transition: box-shadow 0.15s, border-color 0.3s, background-color 0.3s, border-style 0s;
  user-select: none;
  pointer-events: auto;
  animation: styles-module__sectionEnter___-8BXT 0.2s ease;
}
.styles-module__sectionOutline___s0hy-:hover {
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1), 0 4px 12px rgba(0, 0, 0, 0.15);
}
.styles-module__sectionOutline___s0hy-.styles-module__selected___6yrp6 {
  border-style: solid;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15), 0 2px 8px rgba(59, 130, 246, 0.15);
}
.styles-module__sectionOutline___s0hy-.styles-module__selected___6yrp6:hover {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15), 0 2px 8px rgba(59, 130, 246, 0.15);
}
.styles-module__sectionOutline___s0hy-.styles-module__settled___b5U5o:not(.styles-module__selected___6yrp6) {
  border: 1.5px dashed rgba(150, 150, 150, 0.35);
  background-color: transparent !important;
  box-shadow: none;
}
.styles-module__sectionOutline___s0hy-.styles-module__settled___b5U5o:not(.styles-module__selected___6yrp6):hover {
  border-color: rgba(150, 150, 150, 0.6);
  box-shadow: none;
}
.styles-module__sectionOutline___s0hy-.styles-module__settled___b5U5o:not(.styles-module__selected___6yrp6) .styles-module__sectionLabel___F80HQ {
  opacity: 0;
  transition: opacity 0.15s ease;
}
.styles-module__sectionOutline___s0hy-.styles-module__settled___b5U5o:not(.styles-module__selected___6yrp6):hover .styles-module__sectionLabel___F80HQ {
  opacity: 1;
}
.styles-module__sectionOutline___s0hy-.styles-module__settled___b5U5o:not(.styles-module__selected___6yrp6) .styles-module__movedBadge___s8z-q,
.styles-module__sectionOutline___s0hy-.styles-module__settled___b5U5o:not(.styles-module__selected___6yrp6) .styles-module__sectionDimensions___RcJSL {
  opacity: 0;
  transition: opacity 0.15s ease;
}
.styles-module__sectionOutline___s0hy-.styles-module__settled___b5U5o:not(.styles-module__selected___6yrp6):hover .styles-module__sectionDimensions___RcJSL {
  opacity: 1;
}
.styles-module__sectionOutline___s0hy-.styles-module__exiting___YrM8F {
  opacity: 0;
  transform: scale(0.97);
  pointer-events: none;
  animation: none;
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.32, 0.72, 0, 1);
}

.styles-module__sectionLabel___F80HQ {
  position: absolute;
  top: 4px;
  left: 4px;
  font-size: 10px;
  font-weight: 600;
  color: #fff;
  padding: 2px 8px;
  border-radius: 4px;
  white-space: nowrap;
  pointer-events: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  max-width: calc(100% - 8px);
  overflow: hidden;
  text-overflow: ellipsis;
}

.styles-module__movedBadge___s8z-q {
  position: absolute;
  bottom: 22px;
  right: 4px;
  font-size: 9px;
  font-weight: 700;
  color: #fff;
  background: #22c55e;
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
  pointer-events: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  opacity: 0;
  transform: scale(0.8);
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.styles-module__movedBadge___s8z-q.styles-module__badgeVisible___npbdS {
  opacity: 1;
  transform: scale(1);
  transition: opacity 0.2s cubic-bezier(0.34, 1.2, 0.64, 1), transform 0.2s cubic-bezier(0.34, 1.2, 0.64, 1);
}

.styles-module__resizedBadge___u51V8 {
  background: #3c82f7;
  bottom: 40px;
}

.styles-module__sectionDimensions___RcJSL {
  position: absolute;
  bottom: 4px;
  right: 4px;
  font-size: 9px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(0, 0, 0, 0.5);
  padding: 1px 5px;
  border-radius: 3px;
  white-space: nowrap;
  pointer-events: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
.styles-module__light___ORIft .styles-module__sectionDimensions___RcJSL {
  color: rgba(0, 0, 0, 0.5);
  background: rgba(255, 255, 255, 0.7);
}

.styles-module__wireframeNotice___4GJyB {
  position: fixed;
  bottom: 16px;
  left: 24px;
  z-index: 99995;
  font-size: 9.5px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.4);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  pointer-events: auto;
  animation: styles-module__overlayFadeIn___aECVy 0.3s ease;
  line-height: 1.5;
  max-width: 280px;
}

.styles-module__wireframeOpacityRow___CJXzi {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.styles-module__wireframeOpacityLabel___afkfT {
  font-size: 9px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.32);
  letter-spacing: 0.02em;
  white-space: nowrap;
  user-select: none;
}

.styles-module__wireframeOpacitySlider___YcoEs {
  -webkit-appearance: none;
  appearance: none;
  width: 56px;
  height: 4px;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s ease;
}
.styles-module__wireframeOpacitySlider___YcoEs:hover {
  background: rgba(0, 0, 0, 0.13);
}
.styles-module__wireframeOpacitySlider___YcoEs::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #f97316;
  cursor: pointer;
  transition: background 0.15s ease;
}
.styles-module__wireframeOpacitySlider___YcoEs::-webkit-slider-thumb:hover {
  background: #e56b0a;
}
.styles-module__wireframeOpacitySlider___YcoEs::-moz-range-thumb {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #f97316;
  border: none;
  cursor: pointer;
}
.styles-module__wireframeOpacitySlider___YcoEs::-moz-range-track {
  background: rgba(0, 0, 0, 0.08);
  height: 4px;
  border-radius: 2px;
}

.styles-module__wireframeNoticeTitleRow___PJqyG {
  display: flex;
  align-items: center;
  gap: 0;
  margin-bottom: 2px;
}

.styles-module__wireframeNoticeTitle___okr08 {
  font-weight: 600;
  color: rgba(0, 0, 0, 0.55);
}

.styles-module__wireframeNoticeDivider___PNKQ6 {
  width: 1px;
  height: 8px;
  background: rgba(0, 0, 0, 0.12);
  margin: 0 8px;
  flex-shrink: 0;
}

.styles-module__wireframeStartOver___YFk-I {
  font-size: 9.5px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.35);
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  font-family: inherit;
  text-decoration: none;
  transition: color 0.12s ease;
  white-space: nowrap;
}
.styles-module__wireframeStartOver___YFk-I:hover {
  color: rgba(0, 0, 0, 0.6);
}

.styles-module__ghostOutline___po-kO {
  position: fixed;
  border: 1.5px dashed rgba(59, 130, 246, 0.4);
  border-radius: 4px;
  background: rgba(59, 130, 246, 0.04);
  cursor: grab;
  opacity: 0.5;
  user-select: none;
  pointer-events: auto;
  animation: styles-module__ghostEnter___EC3Mb 0.25s ease;
  transition: box-shadow 0.15s, border-color 0.3s, opacity 0.25s;
}
.styles-module__ghostOutline___po-kO:active {
  cursor: grabbing;
}
.styles-module__ghostOutline___po-kO:hover {
  opacity: 0.7;
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.1), 0 4px 12px rgba(0, 0, 0, 0.08);
}
.styles-module__ghostOutline___po-kO.styles-module__selected___6yrp6 {
  opacity: 1;
  border-style: solid;
  border-width: 2px;
  border-color: #3c82f7;
  background: rgba(59, 130, 246, 0.08);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15), 0 2px 8px rgba(59, 130, 246, 0.15);
}
.styles-module__ghostOutline___po-kO.styles-module__exiting___YrM8F {
  opacity: 0;
  transform: scale(0.97);
  pointer-events: none;
  animation: none;
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.32, 0.72, 0, 1);
}

.styles-module__ghostBadge___tsQUK {
  position: absolute;
  bottom: calc(100% + 4px);
  left: -1px;
  font-size: 9px;
  font-weight: 600;
  color: rgba(59, 130, 246, 0.9);
  background: rgba(59, 130, 246, 0.08);
  border: 1px solid rgba(59, 130, 246, 0.2);
  padding: 1px 5px;
  border-radius: 3px;
  white-space: nowrap;
  pointer-events: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  letter-spacing: 0.02em;
  line-height: 1.2;
  animation: styles-module__badgeSlideIn___typJ7 0.2s ease both;
}

@keyframes styles-module__badgeSlideIn___typJ7 {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.styles-module__ghostBadgeExtra___6CVoD {
  display: inline;
  animation: styles-module__badgeExtraIn___i4W8F 0.2s ease both;
}

@keyframes styles-module__badgeExtraIn___i4W8F {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.styles-module__originalOutline___Y6DD1 {
  position: fixed;
  border: 1.5px dashed rgba(150, 150, 150, 0.3);
  border-radius: 4px;
  background: transparent;
  pointer-events: none;
  user-select: none;
  animation: styles-module__sectionEnter___-8BXT 0.2s ease;
}

.styles-module__originalLabel___HqI9g {
  position: absolute;
  top: 4px;
  left: 4px;
  font-size: 9px;
  font-weight: 500;
  color: rgba(150, 150, 150, 0.5);
  padding: 1px 6px;
  border-radius: 3px;
  white-space: nowrap;
  pointer-events: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: rgba(150, 150, 150, 0.08);
}

.styles-module__connectorSvg___Lovld {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 99996;
}

.styles-module__connectorLine___XeWh- {
  transition: opacity 0.2s ease;
  animation: styles-module__connectorDraw___8sK5I 0.3s ease both;
}

.styles-module__connectorDot___yvf7C {
  transform-box: fill-box;
  transform-origin: center;
  animation: styles-module__connectorDotIn___NwTUq 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both;
}

@keyframes styles-module__connectorDraw___8sK5I {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes styles-module__connectorDotIn___NwTUq {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
.styles-module__connectorExiting___2lLOs {
  animation: styles-module__connectorOut___5QoPl 0.2s ease forwards;
}
.styles-module__connectorExiting___2lLOs .styles-module__connectorDot___yvf7C {
  animation: styles-module__connectorDotOut___FEq7e 0.2s ease forwards;
}

@keyframes styles-module__connectorOut___5QoPl {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
@keyframes styles-module__connectorDotOut___FEq7e {
  from {
    transform: scale(1);
    opacity: 1;
  }
  to {
    transform: scale(0);
    opacity: 0;
  }
}
@keyframes styles-module__placementEnter___TdRhf {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes styles-module__sectionEnter___-8BXT {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes styles-module__highlightFadeIn___Lg7KY {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes styles-module__overlayFadeIn___aECVy {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes styles-module__ghostEnter___EC3Mb {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 0.6;
    transform: scale(1);
  }
}`,z2={overlayExiting:"styles-module__overlayExiting___iEmYr",overlay:"styles-module__overlay___aWh-q",overlayFadeIn:"styles-module__overlayFadeIn___aECVy",light:"styles-module__light___ORIft",wireframe:"styles-module__wireframe___itvQU",placing:"styles-module__placing___45yD8",passthrough:"styles-module__passthrough___xaFeE",blankCanvas:"styles-module__blankCanvas___t2Eue",visible:"styles-module__visible___OKKqX",gridActive:"styles-module__gridActive___OZ-cf",paletteHeader:"styles-module__paletteHeader___-Q5gQ",paletteHeaderTitle:"styles-module__paletteHeaderTitle___oHqZC",paletteHeaderDesc:"styles-module__paletteHeaderDesc___6i74T",wireframePurposeWrap:"styles-module__wireframePurposeWrap___To-tS",collapsed:"styles-module__collapsed___Ms9vS",wireframePurposeInner:"styles-module__wireframePurposeInner___Lrahs",wireframePurposeInput:"styles-module__wireframePurposeInput___7EtBN",canvasToggle:"styles-module__canvasToggle___-QqSy",active:"styles-module__active___hosp7",canvasToggleIcon:"styles-module__canvasToggleIcon___7pJ82",canvasToggleLabel:"styles-module__canvasToggleLabel___OanpY",canvasPurposeWrap:"styles-module__canvasPurposeWrap___hj6zk",canvasPurposeInner:"styles-module__canvasPurposeInner___VWiyu",canvasPurposeToggle:"styles-module__canvasPurposeToggle___byDH2",canvasPurposeCheck:"styles-module__canvasPurposeCheck___xqd7l",checked:"styles-module__checked___-1JGH",canvasPurposeLabel:"styles-module__canvasPurposeLabel___Zu-tD",canvasPurposeHelp:"styles-module__canvasPurposeHelp___jijwR",placement:"styles-module__placement___zcxv8",placementEnter:"styles-module__placementEnter___TdRhf",selected:"styles-module__selected___6yrp6",dragging:"styles-module__dragging___le6KZ",exiting:"styles-module__exiting___YrM8F",placementContent:"styles-module__placementContent___f64A4",placementLabel:"styles-module__placementLabel___0KvWl",placementAnnotation:"styles-module__placementAnnotation___78pTr",annotationVisible:"styles-module__annotationVisible___mrUyA",sectionAnnotation:"styles-module__sectionAnnotation___aUIs0",handle:"styles-module__handle___Ikbxm",sectionOutline:"styles-module__sectionOutline___s0hy-",ghostOutline:"styles-module__ghostOutline___po-kO",handleNw:"styles-module__handleNw___4TMIj",handleNe:"styles-module__handleNe___mnsTh",handleSe:"styles-module__handleSe___oSFnk",handleSw:"styles-module__handleSw___pi--Z",handleN:"styles-module__handleN___aBA-Q",handleE:"styles-module__handleE___0hM5u",handleS:"styles-module__handleS___JjDRv",handleW:"styles-module__handleW___ERWGQ",edgeHandle:"styles-module__edgeHandle___XxXdT",edgeN:"styles-module__edgeN___-JJDj",edgeS:"styles-module__edgeS___66lMX",edgeE:"styles-module__edgeE___1bGDa",edgeW:"styles-module__edgeW___lHQNo",deleteButton:"styles-module__deleteButton___LkGCb",rearrangeOverlay:"styles-module__rearrangeOverlay___-3R3t",drawBox:"styles-module__drawBox___BrVAa",selectBox:"styles-module__selectBox___Iu8kB",sizeIndicator:"styles-module__sizeIndicator___7zJ4y",guideLine:"styles-module__guideLine___DUQY2",dragPreview:"styles-module__dragPreview___onPbU",dragPreviewWireframe:"styles-module__dragPreviewWireframe___jsg0G",palette:"styles-module__palette___C7iSH",paletteItem:"styles-module__paletteItem___6TlnA",paletteItemLabel:"styles-module__paletteItemLabel___6ncO4",paletteSectionTitle:"styles-module__paletteSectionTitle___PqnjX",paletteFooter:"styles-module__paletteFooter___QYnAG",enter:"styles-module__enter___6LYk5",exit:"styles-module__exit___iSGRw",paletteSection:"styles-module__paletteSection___V8DEA",paletteItemIcon:"styles-module__paletteItemIcon___0NPQK",placeScroll:"styles-module__placeScroll___7sClM",fadeTop:"styles-module__fadeTop___KT9tF",fadeBottom:"styles-module__fadeBottom___x3ShT",paletteFooterWrap:"styles-module__paletteFooterWrap___71-fI",footerHidden:"styles-module__footerHidden___fJUik",paletteFooterInnerContent:"styles-module__paletteFooterInnerContent___VC26h",paletteFooterInner:"styles-module__paletteFooterInner___dfylY",paletteFooterCount:"styles-module__paletteFooterCount___D3Fia",paletteFooterClear:"styles-module__paletteFooterClear___ybBoa",paletteFooterActions:"styles-module__paletteFooterActions___fLzv8",rollingWrap:"styles-module__rollingWrap___S75jM",rollingNum:"styles-module__rollingNum___1RKDx",exitUp:"styles-module__exitUp___AFDRW",numExitUp:"styles-module__numExitUp___FRQqx",enterUp:"styles-module__enterUp___CPlXb",numEnterUp:"styles-module__numEnterUp___2Yd-w",exitDown:"styles-module__exitDown___-1yAy",numExitDown:"styles-module__numExitDown___xm5by",enterDown:"styles-module__enterDown___DDuFR",numEnterDown:"styles-module__numEnterDown___hpxBk",hoverHighlight:"styles-module__hoverHighlight___8eT-v",highlightFadeIn:"styles-module__highlightFadeIn___Lg7KY",sectionEnter:"styles-module__sectionEnter___-8BXT",settled:"styles-module__settled___b5U5o",sectionLabel:"styles-module__sectionLabel___F80HQ",movedBadge:"styles-module__movedBadge___s8z-q",sectionDimensions:"styles-module__sectionDimensions___RcJSL",badgeVisible:"styles-module__badgeVisible___npbdS",resizedBadge:"styles-module__resizedBadge___u51V8",wireframeNotice:"styles-module__wireframeNotice___4GJyB",wireframeOpacityRow:"styles-module__wireframeOpacityRow___CJXzi",wireframeOpacityLabel:"styles-module__wireframeOpacityLabel___afkfT",wireframeOpacitySlider:"styles-module__wireframeOpacitySlider___YcoEs",wireframeNoticeTitleRow:"styles-module__wireframeNoticeTitleRow___PJqyG",wireframeNoticeTitle:"styles-module__wireframeNoticeTitle___okr08",wireframeNoticeDivider:"styles-module__wireframeNoticeDivider___PNKQ6",wireframeStartOver:"styles-module__wireframeStartOver___YFk-I",ghostEnter:"styles-module__ghostEnter___EC3Mb",ghostBadge:"styles-module__ghostBadge___tsQUK",badgeSlideIn:"styles-module__badgeSlideIn___typJ7",ghostBadgeExtra:"styles-module__ghostBadgeExtra___6CVoD",badgeExtraIn:"styles-module__badgeExtraIn___i4W8F",originalOutline:"styles-module__originalOutline___Y6DD1",originalLabel:"styles-module__originalLabel___HqI9g",connectorSvg:"styles-module__connectorSvg___Lovld",connectorLine:"styles-module__connectorLine___XeWh-",connectorDraw:"styles-module__connectorDraw___8sK5I",connectorDot:"styles-module__connectorDot___yvf7C",connectorDotIn:"styles-module__connectorDotIn___NwTUq",connectorExiting:"styles-module__connectorExiting___2lLOs",connectorOut:"styles-module__connectorOut___5QoPl",connectorDotOut:"styles-module__connectorDotOut___FEq7e"};if(typeof document<"u"){let e=document.getElementById("feedback-tool-styles-design-mode-styles");e||(e=document.createElement("style"),e.id="feedback-tool-styles-design-mode-styles",e.textContent=N2,document.head.appendChild(e))}var X=z2,Mr=24,ts=5;function od(e,t,n,o,r){let i=1/0,s=1/0;const l=e.x,a=e.x+e.width,c=e.x+e.width/2,d=e.y,u=e.y+e.height,_=e.y+e.height/2,m=!o,g=m?[l,a,c]:[...o.left?[l]:[],...o.right?[a]:[]],v=m?[d,u,_]:[...o.top?[d]:[],...o.bottom?[u]:[]],f=[];for(const j of t)n.has(j.id)||f.push(j);r&&f.push(...r);for(const j of f){const ue=j.x,be=j.x+j.width,ye=j.x+j.width/2,Te=j.y,_e=j.y+j.height,W=j.y+j.height/2;for(const B of g)for(const Z of[ue,be,ye]){const de=Z-B;Math.abs(de)<ts&&Math.abs(de)<Math.abs(i)&&(i=de)}for(const B of v)for(const Z of[Te,_e,W]){const de=Z-B;Math.abs(de)<ts&&Math.abs(de)<Math.abs(s)&&(s=de)}}const p=Math.abs(i)<ts?i:0,k=Math.abs(s)<ts?s:0,P=[],R=new Set,A=l+p,ee=a+p,D=c+p,K=d+k,te=u+k,me=_+k;for(const j of f){const ue=j.x,be=j.x+j.width,ye=j.x+j.width/2,Te=j.y,_e=j.y+j.height,W=j.y+j.height/2;for(const B of[ue,ye,be])for(const Z of[A,D,ee])if(Math.abs(Z-B)<.5){const de=`x:${Math.round(B)}`;R.has(de)||(R.add(de),P.push({axis:"x",pos:B}))}for(const B of[Te,W,_e])for(const Z of[K,me,te])if(Math.abs(Z-B)<.5){const de=`y:${Math.round(B)}`;R.has(de)||(R.add(de),P.push({axis:"y",pos:B}))}}return{dx:p,dy:k,guides:P}}function rd(){return`dp-${Date.now()}-${Math.random().toString(36).slice(2,7)}`}function H2(e){const[t,n]=G(new Set),[o,r]=G(null),[i,s]=G(null),[l,a]=G(null),[c,d]=G([]),[u,_]=G(null),[m,g]=G(!1);let v=!1;const[f,p]=G(new Set);let k=new Map,P=e.deselectSignal;De(()=>{e.deselectSignal!==P&&(P=e.deselectSignal,n(new Set))});let R=e.clearSignal;De(()=>{if(e.clearSignal!==void 0&&e.clearSignal!==R){R=e.clearSignal;const W=new Set(e.placements.map(B=>B.id));W.size>0&&(p(W),n(new Set),setTimeout(()=>{e.onChange([]),p(new Set)},180))}}),De(()=>{const W=t(),B=e.activeComponent,Z=e.placements,de=Y=>{const oe=Y.target;if(!(oe.tagName==="INPUT"||oe.tagName==="TEXTAREA"||oe.isContentEditable)){if((Y.key==="Backspace"||Y.key==="Delete")&&W.size>0){Y.preventDefault();const he=new Set(W);p(he),n(new Set),setTimeout(()=>{e.onChange(e.placements.filter(We=>!he.has(We.id))),p(new Set)},180);return}if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(Y.key)&&W.size>0){Y.preventDefault();const he=Y.shiftKey?20:1,We=Y.key==="ArrowLeft"?-he:Y.key==="ArrowRight"?he:0,Xe=Y.key==="ArrowUp"?-he:Y.key==="ArrowDown"?he:0;e.onChange(Z.map(re=>W.has(re.id)?{...re,x:Math.max(0,re.x+We),y:Math.max(0,re.y+Xe)}:re));return}if(Y.key==="Escape"){B?e.onActiveComponentChange(null):W.size>0&&n(new Set);return}}};document.addEventListener("keydown",de),ot(()=>document.removeEventListener("keydown",de))});const A=W=>{if(W.button!==0||e.passthrough||W.target.closest(`.${X.placement}`))return;W.preventDefault(),W.stopPropagation();const Z=window.scrollY,de=W.clientX,Y=W.clientY;if(e.activeComponent){e.onInteractionChange?.(!0);let oe=!1,ve=de,he=Y;const We=re=>{ve=re.clientX,he=re.clientY;const Qe=Math.abs(ve-de),nt=Math.abs(he-Y);if((Qe>5||nt>5)&&(oe=!0),oe){const Le=Math.min(de,ve),ut=Math.min(Y,he),it=Math.abs(ve-de),xe=Math.abs(he-Y);r({x:Le,y:ut,w:it,h:xe}),a({x:re.clientX+12,y:re.clientY+12,text:`${Math.round(it)} x ${Math.round(xe)}`})}},Xe=re=>{window.removeEventListener("mousemove",We),window.removeEventListener("mouseup",Xe),r(null),a(null),e.onInteractionChange?.(!1);const Qe=Re[e.activeComponent];let nt,Le,ut,it;oe?(nt=Math.min(de,ve),Le=Math.min(Y,he)+Z,ut=Math.max(Mr,Math.abs(ve-de)),it=Math.max(Mr,Math.abs(he-Y))):(ut=Qe.width,it=Qe.height,nt=de-ut/2,Le=Y+Z-it/2),nt=Math.max(0,nt),Le=Math.max(0,Le);const xe={id:rd(),type:e.activeComponent,x:nt,y:Le,width:ut,height:it,scrollY:Z,timestamp:Date.now()},Se=[...e.placements,xe];e.onChange(Se),n(new Set([xe.id])),e.onActiveComponentChange(null)};window.addEventListener("mousemove",We),window.addEventListener("mouseup",Xe)}else{const oe=t();W.shiftKey||n(new Set);let ve=!1;const he=Xe=>{const re=Math.abs(Xe.clientX-de),Qe=Math.abs(Xe.clientY-Y);if((re>4||Qe>4)&&(ve=!0),ve){const nt=Math.min(de,Xe.clientX),Le=Math.min(Y,Xe.clientY);s({x:nt,y:Le,w:Math.abs(Xe.clientX-de),h:Math.abs(Xe.clientY-Y)})}},We=Xe=>{if(window.removeEventListener("mousemove",he),window.removeEventListener("mouseup",We),ve){const re=Math.min(de,Xe.clientX),Qe=Math.min(Y,Xe.clientY)+Z,nt=Math.abs(Xe.clientX-de),Le=Math.abs(Xe.clientY-Y),ut=new Set(W.shiftKey?oe:new Set);for(const it of e.placements)it.x+it.width>re&&it.x<re+nt&&it.y+it.height>Qe&&it.y<Qe+Le&&ut.add(it.id);n(ut)}s(null)};window.addEventListener("mousemove",he),window.addEventListener("mouseup",We)}},ee=(W,B)=>{if(W.button!==0)return;const Z=W.target;if(Z.closest(`.${X.handle}`)||Z.closest(`.${X.deleteButton}`))return;W.preventDefault(),W.stopPropagation();const de=t();let Y;W.shiftKey?(Y=new Set(de),Y.has(B)?Y.delete(B):Y.add(B)):de.has(B)?Y=new Set(de):Y=new Set([B]),n(Y),(Y.size!==de.size||[...Y].some(Se=>!de.has(Se)))&&e.onSelectionChange?.(Y,W.shiftKey);const ve=W.clientX,he=W.clientY,We=new Map;for(const Se of e.placements)Y.has(Se.id)&&We.set(Se.id,{x:Se.x,y:Se.y});e.onInteractionChange?.(!0);let Xe=!1,re=!1,Qe=e.placements,nt=0,Le=0;const ut=new Map;for(const Se of e.placements)We.has(Se.id)&&ut.set(Se.id,{w:Se.width,h:Se.height});const it=Se=>{const Lt=Se.clientX-ve,H=Se.clientY-he;if((Math.abs(Lt)>2||Math.abs(H)>2)&&(Xe=!0),!Xe)return;if(Se.altKey&&!re){re=!0;const He=[];for(const Pe of Qe)We.has(Pe.id)&&He.push({...Pe,id:rd(),timestamp:Date.now()});Qe=[...Qe,...He]}let V=1/0,F=1/0,se=-1/0,ge=-1/0;for(const[He,Pe]of We){const ht=ut.get(He);ht&&(V=Math.min(V,Pe.x+Lt),F=Math.min(F,Pe.y+H),se=Math.max(se,Pe.x+Lt+ht.w),ge=Math.max(ge,Pe.y+H+ht.h))}const Fe={x:V,y:F,width:se-V,height:ge-F},{dx:le,dy:qe,guides:Nt}=od(Fe,Qe,new Set(We.keys()),void 0,e.extraSnapRects);d(Nt);const Pt=Lt+le,ae=H+qe;nt=Pt,Le=ae,e.onChange(Qe.map(He=>{const Pe=We.get(He.id);return Pe?{...He,x:Math.max(0,Pe.x+Pt),y:Math.max(0,Pe.y+ae)}:He})),e.onDragMove?.(Pt,ae)},xe=()=>{window.removeEventListener("mousemove",it),window.removeEventListener("mouseup",xe),e.onInteractionChange?.(!1),d([]),e.onDragEnd?.(nt,Le,Xe)};window.addEventListener("mousemove",it),window.addEventListener("mouseup",xe)},D=(W,B,Z)=>{W.preventDefault(),W.stopPropagation();const de=e.placements.find(Le=>Le.id===B);if(!de)return;n(new Set([B])),e.onInteractionChange?.(!0);const Y=W.clientX,oe=W.clientY,ve=de.width,he=de.height,We=de.x,Xe=de.y,re={left:Z.includes("w"),right:Z.includes("e"),top:Z.includes("n"),bottom:Z.includes("s")},Qe=Le=>{const ut=Le.clientX-Y,it=Le.clientY-oe;let xe=ve,Se=he,Lt=We,H=Xe;Z.includes("e")&&(xe=Math.max(Mr,ve+ut)),Z.includes("w")&&(xe=Math.max(Mr,ve-ut),Lt=We+ve-xe),Z.includes("s")&&(Se=Math.max(Mr,he+it)),Z.includes("n")&&(Se=Math.max(Mr,he-it),H=Xe+he-Se);const V={x:Lt,y:H,width:xe,height:Se},{dx:F,dy:se,guides:ge}=od(V,e.placements,new Set([B]),re,e.extraSnapRects);d(ge),F!==0&&(re.right?xe+=F:re.left&&(Lt+=F,xe-=F)),se!==0&&(re.bottom?Se+=se:re.top&&(H+=se,Se-=se)),e.onChange(e.placements.map(Fe=>Fe.id===B?{...Fe,x:Lt,y:H,width:xe,height:Se}:Fe)),a({x:Le.clientX+12,y:Le.clientY+12,text:`${Math.round(xe)} x ${Math.round(Se)}`})},nt=()=>{window.removeEventListener("mousemove",Qe),window.removeEventListener("mouseup",nt),a(null),e.onInteractionChange?.(!1),d([])};window.addEventListener("mousemove",Qe),window.addEventListener("mouseup",nt)},K=W=>{p(B=>{const Z=new Set(B);return Z.add(W),Z}),n(B=>{const Z=new Set(B);return Z.delete(W),Z}),setTimeout(()=>{e.onChange(e.placements.filter(B=>B.id!==W)),p(B=>{const Z=new Set(B);return Z.delete(W),Z})},180)},te={hero:"Headline text",button:"Button label",badge:"Badge label",cta:"Call to action text",toast:"Notification message",modal:"Dialog title",card:"Card title",navigation:"Brand / nav items",tabs:"Tab labels",input:"Placeholder text",search:"Search placeholder",pricing:"Plan name or price",testimonial:"Quote text",alert:"Alert message",banner:"Banner text",tag:"Tag label",notification:"Notification message",stat:"Metric value",productCard:"Product name"},me=W=>{const B=e.placements.find(Z=>Z.id===W);B&&(v=!!B.text,_(W),g(!1))},j=()=>{u()&&(g(!0),setTimeout(()=>{_(null),g(!1)},150))};De(()=>{e.exiting&&u()&&j()});const ue=W=>{u()&&(e.onChange(e.placements.map(B=>B.id===u()?{...B,text:W.trim()||void 0}:B)),j())},be=typeof window<"u"?window.scrollY:0,ye=["nw","ne","se","sw"],Te=()=>e.wireframe?"#f97316":"#3c82f7",_e=()=>[{dir:"n",cls:X.edgeN,arrow:(()=>{var W=b(ax),B=W.firstChild;return ie(()=>O(B,"fill",Te())),W})()},{dir:"e",cls:X.edgeE,arrow:(()=>{var W=b(cx),B=W.firstChild;return ie(()=>O(B,"fill",Te())),W})()},{dir:"s",cls:X.edgeS,arrow:(()=>{var W=b(dx),B=W.firstChild;return ie(()=>O(B,"fill",Te())),W})()},{dir:"w",cls:X.edgeW,arrow:(()=>{var W=b(ux),B=W.firstChild;return ie(()=>O(B,"fill",Te())),W})()}];return[(()=>{var W=b(tr);return W.$$mousedown=A,uo(B=>B,W),y(W,h(Ye,{get each(){return e.placements},children:B=>{const Z=()=>t().has(B.id),de=()=>Gn[B.type]?.label||B.type,Y=()=>B.y-be;return(()=>{var oe=b(_x),ve=oe.firstChild,he=ve.nextSibling,We=he.nextSibling,Xe=We.nextSibling,re=Xe.nextSibling,[Qe,nt]=S(re.nextSibling),Le=Qe.nextSibling,[ut,it]=S(Le.nextSibling);return oe.$$dblclick=()=>me(B.id),oe.$$mousedown=xe=>ee(xe,B.id),y(ve,de),y(he,()=>(B.text&&k.set(B.id,B.text),B.text||k.get(B.id)||"")),y(We,h(F2,{get type(){return B.type},get width(){return B.width},get height(){return B.height},get text(){return B.text}})),Xe.$$click=()=>K(B.id),Xe.$$mousedown=xe=>xe.stopPropagation(),y(oe,h(Ye,{each:ye,children:xe=>(()=>{var Se=b(sn);return Se.$$mousedown=Lt=>D(Lt,B.id,xe),ie(()=>M(Se,`${X.handle} ${X[`handle${xe.charAt(0).toUpperCase()}${xe.slice(1)}`]}`)),Ft(),Se})()}),Qe,nt),y(oe,h(Ye,{get each(){return _e()},children:xe=>(()=>{var Se=b(sn);return Se.$$mousedown=Lt=>D(Lt,B.id,xe.dir),y(Se,()=>xe.arrow),ie(()=>M(Se,`${X.edgeHandle} ${xe.cls}`)),Ft(),Se})()}),ut,it),ie(xe=>{var Se=B.id,Lt=`${X.placement} ${Z()?X.selected:""} ${f().has(B.id)?X.exiting:""}`,H=`${B.x}px`,V=`${Y()}px`,F=`${B.width}px`,se=`${B.height}px`,ge=X.placementLabel,Fe=`${X.placementAnnotation} ${B.text?X.annotationVisible:""}`,le=X.placementContent,qe=X.deleteButton;return Se!==xe.e&&O(oe,"data-design-placement",xe.e=Se),Lt!==xe.t&&M(oe,xe.t=Lt),H!==xe.a&&E(oe,"left",xe.a=H),V!==xe.o&&E(oe,"top",xe.o=V),F!==xe.i&&E(oe,"width",xe.i=F),se!==xe.n&&E(oe,"height",xe.n=se),ge!==xe.s&&M(ve,xe.s=ge),Fe!==xe.h&&M(he,xe.h=Fe),le!==xe.r&&M(We,xe.r=le),qe!==xe.d&&M(Xe,xe.d=qe),xe},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0,h:void 0,r:void 0,d:void 0}),Ft(),oe})()}})),ie(()=>M(W,`${X.overlay} ${e.isDarkMode?"":X.light} ${e.activeComponent?X.placing:""} ${e.passthrough?X.passthrough:""} ${e.exiting?X.overlayExiting:""} ${e.wireframe?X.wireframe:""}${e.class?` ${e.class}`:""}`)),Ft(),W})(),h(Oe,{get when(){return u()},get children(){return(()=>{const W=()=>e.placements.find(B=>B.id===u());return h(Oe,{get when(){return W()},children:B=>{const Z=()=>B().y-be,de=()=>B().x+B().width/2,Y=()=>Z()-8,oe=()=>Z()+B().height+8,ve=()=>Y()>200,he=()=>oe()<window.innerHeight-100,We=()=>Math.max(160,Math.min(window.innerWidth-160,de())),Xe=()=>ve()?{left:`${We()}px`,bottom:`${window.innerHeight-Y()}px`}:he()?{left:`${We()}px`,top:`${oe()}px`}:{left:`${We()}px`,top:`${Math.max(80,window.innerHeight/2-80)}px`};return h(Ts,{get element(){return Gn[B().type]?.label||B().type},get placeholder(){return te[B().type]||"Label or content text"},get initialValue(){return B().text??""},submitLabel:v?"Save":"Set",onSubmit:ue,onCancel:j,onDelete:v?()=>{ue("")}:void 0,get isExiting(){return m()},get lightMode(){return!e.isDarkMode},get style(){return Xe()}})}})})()}}),h(Oe,{get when(){return o()},children:W=>(()=>{var B=b(tr);return ie(Z=>{var de=X.drawBox,Y=`${W().x}px`,oe=`${W().y}px`,ve=`${W().w}px`,he=`${W().h}px`;return de!==Z.e&&M(B,Z.e=de),Y!==Z.t&&E(B,"left",Z.t=Y),oe!==Z.a&&E(B,"top",Z.a=oe),ve!==Z.o&&E(B,"width",Z.o=ve),he!==Z.i&&E(B,"height",Z.i=he),Z},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0}),B})()}),h(Oe,{get when(){return i()},children:W=>(()=>{var B=b(tr);return ie(Z=>{var de=X.selectBox,Y=`${W().x}px`,oe=`${W().y}px`,ve=`${W().w}px`,he=`${W().h}px`;return de!==Z.e&&M(B,Z.e=de),Y!==Z.t&&E(B,"left",Z.t=Y),oe!==Z.a&&E(B,"top",Z.a=oe),ve!==Z.o&&E(B,"width",Z.o=ve),he!==Z.i&&E(B,"height",Z.i=he),Z},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0}),B})()}),h(Oe,{get when(){return l()},children:W=>(()=>{var B=b(tr);return y(B,()=>W().text),ie(Z=>{var de=X.sizeIndicator,Y=`${W().x}px`,oe=`${W().y}px`;return de!==Z.e&&M(B,Z.e=de),Y!==Z.t&&E(B,"left",Z.t=Y),oe!==Z.a&&E(B,"top",Z.a=oe),Z},{e:void 0,t:void 0,a:void 0}),B})()}),h(Ye,{get each(){return c()},children:W=>(()=>{var B=b(tr);return ie(Z=>{var de=X.guideLine,Y=W.axis==="x"?{position:"fixed",left:`${W.pos}px`,top:"0",width:"1px",bottom:"0"}:{position:"fixed",left:"0",top:`${W.pos-be}px`,right:"0",height:"1px"};return de!==Z.e&&M(B,Z.e=de),Z.t=gn(B,Y,Z.t),Z},{e:void 0,t:void 0}),B})()})]}function j2(e){if(!e)return"";const t=e.scrollTop>2,n=e.scrollTop+e.clientHeight<e.scrollHeight-2;return`${t?X.fadeTop:""} ${n?X.fadeBottom:""}`}function U2(e){switch(e.type){case"navigation":return(()=>{var t=b(hx),n=t.firstChild,o=n.nextSibling,r=o.nextSibling;return r.nextSibling,t})();case"header":return(()=>{var t=b(fx),n=t.firstChild,o=n.nextSibling;return o.nextSibling,t})();case"hero":return(()=>{var t=b(gx),n=t.firstChild,o=n.nextSibling,r=o.nextSibling;return r.nextSibling,t})();case"section":return(()=>{var t=b(mx),n=t.firstChild,o=n.nextSibling,r=o.nextSibling;return r.nextSibling,t})();case"sidebar":return(()=>{var t=b(px),n=t.firstChild,o=n.nextSibling,r=o.nextSibling;return r.nextSibling,t})();case"footer":return(()=>{var t=b(yx),n=t.firstChild,o=n.nextSibling,r=o.nextSibling;return r.nextSibling,t})();case"modal":return(()=>{var t=b(xx),n=t.firstChild,o=n.nextSibling,r=o.nextSibling;return r.nextSibling,t})();case"divider":return(()=>{var t=b(bx);return t.firstChild,t})();case"card":return(()=>{var t=b(vx),n=t.firstChild,o=n.nextSibling,r=o.nextSibling;return r.nextSibling,t})();case"text":return(()=>{var t=b(wx),n=t.firstChild,o=n.nextSibling,r=o.nextSibling;return r.nextSibling,t})();case"image":return(()=>{var t=b($x),n=t.firstChild,o=n.nextSibling;return o.nextSibling,t})();case"video":return(()=>{var t=b(Sx),n=t.firstChild;return n.nextSibling,t})();case"table":return(()=>{var t=b(kx),n=t.firstChild,o=n.nextSibling,r=o.nextSibling,i=r.nextSibling;return i.nextSibling,t})();case"grid":return(()=>{var t=b(Cx),n=t.firstChild,o=n.nextSibling,r=o.nextSibling;return r.nextSibling,t})();case"list":return(()=>{var t=b(Mx),n=t.firstChild,o=n.nextSibling,r=o.nextSibling,i=r.nextSibling,s=i.nextSibling;return s.nextSibling,t})();case"chart":return(()=>{var t=b(Ix),n=t.firstChild,o=n.nextSibling,r=o.nextSibling;return r.nextSibling,t})();case"accordion":return(()=>{var t=b(Rx),n=t.firstChild,o=n.nextSibling,r=o.nextSibling;return r.nextSibling,t})();case"carousel":return(()=>{var t=b(Px),n=t.firstChild,o=n.nextSibling,r=o.nextSibling,i=r.nextSibling,s=i.nextSibling;return s.nextSibling,t})();case"button":return(()=>{var t=b(Ex),n=t.firstChild;return n.nextSibling,t})();case"input":return(()=>{var t=b(Tx),n=t.firstChild,o=n.nextSibling;return o.nextSibling,t})();case"search":return(()=>{var t=b(Lx),n=t.firstChild,o=n.nextSibling,r=o.nextSibling;return r.nextSibling,t})();case"form":return(()=>{var t=b(Ax),n=t.firstChild,o=n.nextSibling,r=o.nextSibling,i=r.nextSibling;return i.nextSibling,t})();case"tabs":return(()=>{var t=b(Bx),n=t.firstChild,o=n.nextSibling,r=o.nextSibling;return r.nextSibling,t})();case"dropdown":return(()=>{var t=b(Ox),n=t.firstChild,o=n.nextSibling,r=o.nextSibling;return r.nextSibling,t})();case"toggle":return(()=>{var t=b(Dx),n=t.firstChild;return n.nextSibling,t})();case"avatar":return(()=>{var t=b(Fx),n=t.firstChild,o=n.nextSibling;return o.nextSibling,t})();case"badge":return(()=>{var t=b(Nx),n=t.firstChild;return n.nextSibling,t})();case"breadcrumb":return(()=>{var t=b(zx),n=t.firstChild,o=n.nextSibling,r=o.nextSibling,i=r.nextSibling;return i.nextSibling,t})();case"pagination":return(()=>{var t=b(Hx),n=t.firstChild,o=n.nextSibling,r=o.nextSibling;return r.nextSibling,t})();case"progress":return(()=>{var t=b(jx),n=t.firstChild;return n.nextSibling,t})();case"toast":return(()=>{var t=b(Ux),n=t.firstChild,o=n.nextSibling,r=o.nextSibling;return r.nextSibling,t})();case"tooltip":return(()=>{var t=b(Wx),n=t.firstChild,o=n.nextSibling;return o.nextSibling,t})();case"pricing":return(()=>{var t=b(Yx),n=t.firstChild,o=n.nextSibling,r=o.nextSibling,i=r.nextSibling,s=i.nextSibling;return s.nextSibling,t})();case"testimonial":return(()=>{var t=b(Vx),n=t.firstChild,o=n.nextSibling,r=o.nextSibling,i=r.nextSibling,s=i.nextSibling;return s.nextSibling,t})();case"cta":return(()=>{var t=b(Xx),n=t.firstChild,o=n.nextSibling,r=o.nextSibling;return r.nextSibling,t})();case"alert":return(()=>{var t=b(qx),n=t.firstChild,o=n.nextSibling,r=o.nextSibling,i=r.nextSibling;return i.nextSibling,t})();case"banner":return(()=>{var t=b(Qx),n=t.firstChild,o=n.nextSibling;return o.nextSibling,t})();case"stat":return(()=>{var t=b(Kx),n=t.firstChild,o=n.nextSibling,r=o.nextSibling;return r.nextSibling,t})();case"stepper":return(()=>{var t=b(Gx),n=t.firstChild,o=n.nextSibling,r=o.nextSibling,i=r.nextSibling;return i.nextSibling,t})();case"tag":return(()=>{var t=b(Jx),n=t.firstChild,o=n.nextSibling,r=o.nextSibling;return r.nextSibling,t})();case"rating":return(()=>{var t=b(Zx),n=t.firstChild,o=n.nextSibling;return o.nextSibling,t})();case"map":return(()=>{var t=b(eb),n=t.firstChild,o=n.nextSibling,r=o.nextSibling;return r.nextSibling,t})();case"timeline":return(()=>{var t=b(tb),n=t.firstChild,o=n.nextSibling,r=o.nextSibling,i=r.nextSibling,s=i.nextSibling,l=s.nextSibling;return l.nextSibling,t})();case"fileUpload":return(()=>{var t=b(nb),n=t.firstChild,o=n.nextSibling;return o.nextSibling,t})();case"codeBlock":return(()=>{var t=b(ob),n=t.firstChild,o=n.nextSibling,r=o.nextSibling,i=r.nextSibling,s=i.nextSibling,l=s.nextSibling;return l.nextSibling,t})();case"calendar":return(()=>{var t=b(rb),n=t.firstChild,o=n.nextSibling,r=o.nextSibling,i=r.nextSibling,s=i.nextSibling,l=s.nextSibling,a=l.nextSibling,c=a.nextSibling;return c.nextSibling,t})();case"notification":return(()=>{var t=b(ib),n=t.firstChild,o=n.nextSibling,r=o.nextSibling,i=r.nextSibling;return i.nextSibling,t})();case"productCard":return(()=>{var t=b(sb),n=t.firstChild,o=n.nextSibling,r=o.nextSibling,i=r.nextSibling;return i.nextSibling,t})();case"profile":return(()=>{var t=b(lb),n=t.firstChild,o=n.nextSibling;return o.nextSibling,t})();case"drawer":return(()=>{var t=b(ab),n=t.firstChild,o=n.nextSibling,r=o.nextSibling,i=r.nextSibling;return i.nextSibling,t})();case"popover":return(()=>{var t=b(cb),n=t.firstChild,o=n.nextSibling,r=o.nextSibling;return r.nextSibling,t})();case"logo":return(()=>{var t=b(db),n=t.firstChild,o=n.nextSibling,r=o.nextSibling;return r.nextSibling,t})();case"faq":return(()=>{var t=b(ub),n=t.firstChild,o=n.nextSibling,r=o.nextSibling,i=r.nextSibling,s=i.nextSibling;return s.nextSibling,t})();case"gallery":return(()=>{var t=b(_b),n=t.firstChild,o=n.nextSibling,r=o.nextSibling,i=r.nextSibling,s=i.nextSibling;return s.nextSibling,t})();case"checkbox":return(()=>{var t=b(hb),n=t.firstChild;return n.nextSibling,t})();case"radio":return(()=>{var t=b(fb),n=t.firstChild;return n.nextSibling,t})();case"slider":return(()=>{var t=b(gb),n=t.firstChild,o=n.nextSibling;return o.nextSibling,t})();case"datePicker":return(()=>{var t=b(mb),n=t.firstChild,o=n.nextSibling,r=o.nextSibling,i=r.nextSibling,s=i.nextSibling,l=s.nextSibling,a=l.nextSibling,c=a.nextSibling;return c.nextSibling,t})();case"skeleton":return(()=>{var t=b(pb),n=t.firstChild,o=n.nextSibling;return o.nextSibling,t})();case"chip":return(()=>{var t=b(yb),n=t.firstChild,o=n.nextSibling,r=o.nextSibling,i=r.nextSibling;return i.nextSibling,t})();case"icon":return(()=>{var t=b(xb);return t.firstChild,t})();case"spinner":return(()=>{var t=b(bb),n=t.firstChild;return n.nextSibling,t})();case"feature":return(()=>{var t=b(vb),n=t.firstChild,o=n.nextSibling,r=o.nextSibling,i=r.nextSibling,s=i.nextSibling,l=s.nextSibling;return l.nextSibling,t})();case"team":return(()=>{var t=b(wb),n=t.firstChild,o=n.nextSibling,r=o.nextSibling,i=r.nextSibling,s=i.nextSibling,l=s.nextSibling;return l.nextSibling,t})();case"login":return(()=>{var t=b($b),n=t.firstChild,o=n.nextSibling,r=o.nextSibling,i=r.nextSibling;return i.nextSibling,t})();case"contact":return(()=>{var t=b(Sb),n=t.firstChild,o=n.nextSibling,r=o.nextSibling,i=r.nextSibling;return i.nextSibling,t})();default:return null}}function W2(e){return(()=>{var t=b(sn),n=e.scrollRef;return typeof n=="function"?uo(n,t):e.scrollRef=t,y(t,h(Ye,{each:e_,children:o=>(()=>{var r=b(kb),i=r.firstChild,s=i.nextSibling,[l,a]=S(s.nextSibling);return y(i,()=>o.section),y(r,h(Ye,{get each(){return o.items},children:c=>(()=>{var d=b(Cb),u=d.firstChild,_=u.nextSibling;return d.$$mousedown=m=>{m.button===0&&e.onDragStart(c.type,m)},d.$$click=()=>e.onSelect(c.type),y(u,h(U2,{get type(){return c.type}})),y(_,()=>c.label),ie(m=>{var g=`${X.paletteItem} ${e.activeType===c.type?X.active:""} ${e.blankCanvas?X.wireframe:""}`,v=X.paletteItemIcon,f=X.paletteItemLabel;return g!==m.e&&M(d,m.e=g),v!==m.t&&M(u,m.t=v),f!==m.a&&M(_,m.a=f),m},{e:void 0,t:void 0,a:void 0}),Ft(),d})()}),l,a),ie(c=>{var d=X.paletteSection,u=X.paletteSectionTitle;return d!==c.e&&M(r,c.e=d),u!==c.t&&M(i,c.t=u),c},{e:void 0,t:void 0}),r})()})),ie(()=>M(t,`${X.placeScroll} ${e.fadeClass||""}`)),t})()}function Y2(e){const[t,n]=G(null),[o,r]=G(e.suffix),[i,s]=G("up");let l=e.value,a=e.suffix,c;const d=()=>t()!==null&&o()!==e.suffix;return De(()=>{const u=e.value,_=e.suffix;if(u!==l){if(u===0){l=u,a=_,n(null);return}s(u>l?"up":"down"),n(l),r(a),l=u,a=_,clearTimeout(c),c=setTimeout(()=>n(null),250)}else a=_}),h(Oe,{get when(){return t()!==null},get fallback(){return[lt(()=>e.value),lt(()=>lt(()=>!!e.suffix)()?` ${e.suffix}`:"")]},get children(){return h(Oe,{get when(){return d()},get fallback(){return[(()=>{var u=b(Ib),_=u.firstChild,m=_.nextSibling,g=m.nextSibling;return y(_,()=>e.value),y(m,t),y(g,()=>e.value),ie(v=>{var f=X.rollingWrap,p=`${X.rollingNum} ${i()==="up"?X.exitUp:X.exitDown}`,k=`${X.rollingNum} ${i()==="up"?X.enterUp:X.enterDown}`;return f!==v.e&&M(u,v.e=f),p!==v.t&&M(m,v.t=p),k!==v.a&&M(g,v.a=k),v},{e:void 0,t:void 0,a:void 0}),u})(),lt(()=>lt(()=>!!e.suffix)()?` ${e.suffix}`:"")]},get children(){var u=b(Mb),_=u.firstChild,m=_.firstChild,[g,v]=S(m.nextSibling),f=g.nextSibling,p=f.nextSibling,[k,P]=S(p.nextSibling),R=_.nextSibling,A=R.firstChild,[ee,D]=S(A.nextSibling),K=ee.nextSibling,te=K.nextSibling,[me,j]=S(te.nextSibling),ue=R.nextSibling,be=ue.firstChild,[ye,Te]=S(be.nextSibling),_e=ye.nextSibling,W=_e.nextSibling,[B,Z]=S(W.nextSibling);return y(_,()=>e.value,g,v),y(_,()=>e.suffix,k,P),y(R,t,ee,D),y(R,o,me,j),y(ue,()=>e.value,ye,Te),y(ue,()=>e.suffix,B,Z),ie(de=>{var Y=X.rollingWrap,oe=`${X.rollingNum} ${i()==="up"?X.exitUp:X.exitDown}`,ve=`${X.rollingNum} ${i()==="up"?X.enterUp:X.enterDown}`;return Y!==de.e&&M(u,de.e=Y),oe!==de.t&&M(R,de.t=oe),ve!==de.a&&M(ue,de.a=ve),de},{e:void 0,t:void 0,a:void 0}),u}})}})}function V2(e){const[t,n]=G(!1),[o,r]=G("exit"),[i,s]=G(!1),[l,a]=G(!0);let c=0,d="",u=0,_,m;const[g,v]=G("");return De(()=>{e.visible?(n(!0),clearTimeout(_),cancelAnimationFrame(u),u=requestAnimationFrame(()=>{u=requestAnimationFrame(()=>{r("enter")})})):(cancelAnimationFrame(u),r("exit"),clearTimeout(_),_=setTimeout(()=>{n(!1),e.onExited?.()},200)),ot(()=>cancelAnimationFrame(u))}),De(()=>{const f=e.placementCount>0||e.sectionCount>0,p=e.placementCount+e.sectionCount;if(p>0&&(c=p,d=e.blankCanvas?p===1?"Component":"Components":p===1?"Change":"Changes"),f)i()?a(!1):(a(!0),s(!0),requestAnimationFrame(()=>{requestAnimationFrame(()=>{a(!1)})}));else{a(!0);const k=setTimeout(()=>s(!1),300);ot(()=>clearTimeout(k))}}),De(()=>{if(!t())return;const f=m;if(!f)return;const p=()=>v(j2(f));p(),f.addEventListener("scroll",p,{passive:!0});const k=new ResizeObserver(p);k.observe(f),ot(()=>{f.removeEventListener("scroll",p),k.disconnect()})}),h(Oe,{get when(){return t()},get children(){var f=b(Pb),p=f.firstChild,k=p.firstChild,P=k.nextSibling,R=p.nextSibling,A=R.firstChild,ee=A.nextSibling,D=R.nextSibling,K=D.firstChild,te=K.firstChild,me=D.nextSibling,[j,ue]=S(me.nextSibling),be=j.nextSibling,[ye,Te]=S(be.nextSibling);return f.addEventListener("transitionend",_e=>{_e.target===_e.currentTarget&&(e.visible||(clearTimeout(_),n(!1),r("exit"),e.onExited?.()))}),f.$$mousedown=_e=>_e.stopPropagation(),f.$$click=_e=>_e.stopPropagation(),R.$$click=()=>e.onBlankCanvasChange(!e.blankCanvas),te.$$input=_e=>e.onWireframePurposeChange(_e.currentTarget.value),y(f,h(W2,{get activeType(){return e.activeType},get onSelect(){return e.onSelect},get onDragStart(){return e.onDragStart},scrollRef:_e=>m=_e,get fadeClass(){return g()},get blankCanvas(){return e.blankCanvas}}),j,ue),y(f,h(Oe,{get when(){return i()},get children(){var _e=b(Rb),W=_e.firstChild,B=W.firstChild,Z=B.firstChild,de=Z.firstChild,Y=de.nextSibling;return y(de,h(Y2,{value:c,suffix:d})),Br(Y,"click",e.onClearPlacements,!0),ie(oe=>{var ve=`${X.paletteFooterWrap} ${l()?X.footerHidden:""}`,he=X.paletteFooterInner,We=X.paletteFooterInnerContent,Xe=X.paletteFooter,re=X.paletteFooterCount,Qe=X.paletteFooterClear;return ve!==oe.e&&M(_e,oe.e=ve),he!==oe.t&&M(W,oe.t=he),We!==oe.a&&M(B,oe.a=We),Xe!==oe.o&&M(Z,oe.o=Xe),re!==oe.i&&M(de,oe.i=re),Qe!==oe.n&&M(Y,oe.n=Qe),oe},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0}),Ft(),_e}}),ye,Te),ie(_e=>{var W=`${X.palette} ${X[o()]} ${e.isDarkMode?"":X.light}`,B=X.paletteHeader,Z=X.paletteHeaderTitle,de=X.paletteHeaderDesc,Y=`${X.canvasToggle} ${e.blankCanvas?X.active:""}`,oe=X.canvasToggleIcon,ve=X.canvasToggleLabel,he=`${X.wireframePurposeWrap} ${e.blankCanvas?"":X.collapsed}`,We=X.wireframePurposeInner,Xe=X.wireframePurposeInput;return W!==_e.e&&M(f,_e.e=W),B!==_e.t&&M(p,_e.t=B),Z!==_e.a&&M(k,_e.a=Z),de!==_e.o&&M(P,_e.o=de),Y!==_e.i&&M(R,_e.i=Y),oe!==_e.n&&M(A,_e.n=oe),ve!==_e.s&&M(ee,_e.s=ve),he!==_e.h&&M(D,_e.h=he),We!==_e.r&&M(K,_e.r=We),Xe!==_e.d&&M(te,_e.d=Xe),_e},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0,h:void 0,r:void 0,d:void 0}),ie(()=>yo(te,"value",e.wireframePurpose)),Ft(),f}})}function Or(e){if(e.parentElement)return e.parentElement;const t=e.getRootNode();return t instanceof ShadowRoot?t.host:null}function Rn(e,t){let n=e;for(;n;){if(n.matches(t))return n;n=Or(n)}return null}function X2(e,t=4){const n=[];let o=e,r=0;for(;o&&r<t;){const i=o.tagName.toLowerCase();if(i==="html"||i==="body")break;let s=i;if(o.id)s=`#${o.id}`;else if(o.className&&typeof o.className=="string"){const a=o.className.split(/\s+/).find(c=>c.length>2&&!c.match(/^[a-z]{1,2}$/)&&!c.match(/[A-Z0-9]{5,}/));a&&(s=`.${a.split("_")[0]}`)}const l=Or(o);!o.parentElement&&l&&(s=`⟨shadow⟩ ${s}`),n.unshift(s),o=l,r++}return n.join(" > ")}function wi(e){const t=X2(e);if(e.dataset.element)return{name:e.dataset.element,path:t};const n=e.tagName.toLowerCase();if(["path","circle","rect","line","g"].includes(n)){const o=Rn(e,"svg");if(o){const r=Or(o);if(r instanceof HTMLElement)return{name:`graphic in ${wi(r).name}`,path:t}}return{name:"graphic element",path:t}}if(n==="svg"){const o=Or(e);if(o?.tagName.toLowerCase()==="button"){const r=o.textContent?.trim();return{name:r?`icon in "${r}" button`:"button icon",path:t}}return{name:"icon",path:t}}if(n==="button"){const o=e.textContent?.trim(),r=e.getAttribute("aria-label");return r?{name:`button [${r}]`,path:t}:{name:o?`button "${o.slice(0,25)}"`:"button",path:t}}if(n==="a"){const o=e.textContent?.trim(),r=e.getAttribute("href");return o?{name:`link "${o.slice(0,25)}"`,path:t}:r?{name:`link to ${r.slice(0,30)}`,path:t}:{name:"link",path:t}}if(n==="input"){const o=e.getAttribute("type")||"text",r=e.getAttribute("placeholder"),i=e.getAttribute("name");return r?{name:`input "${r}"`,path:t}:i?{name:`input [${i}]`,path:t}:{name:`${o} input`,path:t}}if(["h1","h2","h3","h4","h5","h6"].includes(n)){const o=e.textContent?.trim();return{name:o?`${n} "${o.slice(0,35)}"`:n,path:t}}if(n==="p"){const o=e.textContent?.trim();return o?{name:`paragraph: "${o.slice(0,40)}${o.length>40?"...":""}"`,path:t}:{name:"paragraph",path:t}}if(n==="span"||n==="label"){const o=e.textContent?.trim();return o&&o.length<40?{name:`"${o}"`,path:t}:{name:n,path:t}}if(n==="li"){const o=e.textContent?.trim();return o&&o.length<40?{name:`list item: "${o.slice(0,35)}"`,path:t}:{name:"list item",path:t}}if(n==="blockquote")return{name:"blockquote",path:t};if(n==="code"){const o=e.textContent?.trim();return o&&o.length<30?{name:`code: \`${o}\``,path:t}:{name:"code",path:t}}if(n==="pre")return{name:"code block",path:t};if(n==="img"){const o=e.getAttribute("alt");return{name:o?`image "${o.slice(0,30)}"`:"image",path:t}}if(n==="video")return{name:"video",path:t};if(["div","section","article","nav","header","footer","aside","main"].includes(n)){const o=e.className,r=e.getAttribute("role"),i=e.getAttribute("aria-label");if(i)return{name:`${n} [${i}]`,path:t};if(r)return{name:`${r}`,path:t};if(typeof o=="string"&&o){const s=o.split(/[\s_-]+/).map(l=>l.replace(/[A-Z0-9]{5,}.*$/,"")).filter(l=>l.length>2&&!/^[a-z]{1,2}$/.test(l)).slice(0,2);if(s.length>0)return{name:s.join(" "),path:t}}return{name:n==="div"?"container":n,path:t}}return{name:n,path:t}}function ci(e){const t=[],n=e.textContent?.trim();n&&n.length<100&&t.push(n);const o=e.previousElementSibling;if(o){const i=o.textContent?.trim();i&&i.length<50&&t.unshift(`[before: "${i.slice(0,40)}"]`)}const r=e.nextElementSibling;if(r){const i=r.textContent?.trim();i&&i.length<50&&t.push(`[after: "${i.slice(0,40)}"]`)}return t.join(" ")}function ns(e){const t=Or(e);if(!t)return"";const r=(e.getRootNode()instanceof ShadowRoot&&e.parentElement?Array.from(e.parentElement.children):Array.from(t.children)).filter(d=>d!==e&&d instanceof HTMLElement);if(r.length===0)return"";const i=r.slice(0,4).map(d=>{const u=d.tagName.toLowerCase(),_=d.className;let m="";if(typeof _=="string"&&_){const g=_.split(/\s+/).map(v=>v.replace(/[_][a-zA-Z0-9]{5,}.*$/,"")).find(v=>v.length>2&&!/^[a-z]{1,2}$/.test(v));g&&(m=`.${g}`)}if(u==="button"||u==="a"){const g=d.textContent?.trim().slice(0,15);if(g)return`${u}${m} "${g}"`}return`${u}${m}`});let l=t.tagName.toLowerCase();if(typeof t.className=="string"&&t.className){const d=t.className.split(/\s+/).map(u=>u.replace(/[_][a-zA-Z0-9]{5,}.*$/,"")).find(u=>u.length>2&&!/^[a-z]{1,2}$/.test(u));d&&(l=`.${d}`)}const a=t.children.length,c=a>i.length+1?` (${a} total in ${l})`:"";return i.join(", ")+c}function di(e){const t=e.className;return typeof t!="string"||!t?"":t.split(/\s+/).filter(o=>o.length>0).map(o=>{const r=o.match(/^([a-zA-Z][a-zA-Z0-9_-]*?)(?:_[a-zA-Z0-9]{5,})?$/);return r?r[1]:o}).filter((o,r,i)=>i.indexOf(o)===r).join(", ")}var t_=new Set(["none","normal","auto","0px","rgba(0, 0, 0, 0)","transparent","static","visible"]),q2=new Set(["p","span","h1","h2","h3","h4","h5","h6","label","li","td","th","blockquote","figcaption","caption","legend","dt","dd","pre","code","em","strong","b","i","a","time","cite","q"]),Q2=new Set(["input","textarea","select"]),K2=new Set(["img","video","canvas","svg"]),G2=new Set(["div","section","article","nav","header","footer","aside","main","ul","ol","form","fieldset"]);function os(e){if(typeof window>"u")return{};const t=window.getComputedStyle(e),n={},o=e.tagName.toLowerCase();let r;q2.has(o)?r=["color","fontSize","fontWeight","fontFamily","lineHeight"]:o==="button"||o==="a"&&e.getAttribute("role")==="button"?r=["backgroundColor","color","padding","borderRadius","fontSize"]:Q2.has(o)?r=["backgroundColor","color","padding","borderRadius","fontSize"]:K2.has(o)?r=["width","height","objectFit","borderRadius"]:G2.has(o)?r=["display","padding","margin","gap","backgroundColor"]:r=["color","fontSize","margin","padding","backgroundColor"];for(const i of r){const s=i.replace(/([A-Z])/g,"-$1").toLowerCase(),l=t.getPropertyValue(s);l&&!t_.has(l)&&(n[i]=l)}return n}var J2=["color","backgroundColor","borderColor","fontSize","fontWeight","fontFamily","lineHeight","letterSpacing","textAlign","width","height","padding","margin","border","borderRadius","display","position","top","right","bottom","left","zIndex","flexDirection","justifyContent","alignItems","gap","opacity","visibility","overflow","boxShadow","transform"];function rs(e){if(typeof window>"u")return"";const t=window.getComputedStyle(e),n=[];for(const o of J2){const r=o.replace(/([A-Z])/g,"-$1").toLowerCase(),i=t.getPropertyValue(r);i&&!t_.has(i)&&n.push(`${r}: ${i}`)}return n.join("; ")}function Z2(e){if(!e)return;const t={},n=e.split(";").map(o=>o.trim()).filter(Boolean);for(const o of n){const r=o.indexOf(":");if(r>0){const i=o.slice(0,r).trim(),s=o.slice(r+1).trim();i&&s&&(t[i]=s)}}return Object.keys(t).length>0?t:void 0}function is(e){const t=[],n=e.getAttribute("role"),o=e.getAttribute("aria-label"),r=e.getAttribute("aria-describedby"),i=e.getAttribute("tabindex"),s=e.getAttribute("aria-hidden");return n&&t.push(`role="${n}"`),o&&t.push(`aria-label="${o}"`),r&&t.push(`aria-describedby="${r}"`),i&&t.push(`tabindex=${i}`),s==="true"&&t.push("aria-hidden"),e.matches("a, button, input, select, textarea, [tabindex]")&&t.push("focusable"),t.join(", ")}function ss(e){const t=[];let n=e;for(;n&&n.tagName.toLowerCase()!=="html";){const o=n.tagName.toLowerCase();let r=o;if(n.id)r=`${o}#${n.id}`;else if(n.className&&typeof n.className=="string"){const s=n.className.split(/\s+/).map(l=>l.replace(/[_][a-zA-Z0-9]{5,}.*$/,"")).find(l=>l.length>2);s&&(r=`${o}.${s}`)}const i=Or(n);!n.parentElement&&i&&(r=`⟨shadow⟩ ${r}`),t.unshift(r),n=i}return t.join(" > ")}var ev=new Set(["nav","header","main","section","article","footer","aside"]),Fl={banner:"Header",navigation:"Navigation",main:"Main Content",contentinfo:"Footer",complementary:"Sidebar",region:"Section"},id={nav:"Navigation",header:"Header",main:"Main Content",section:"Section",article:"Article",footer:"Footer",aside:"Sidebar"},tv=new Set(["script","style","noscript","link","meta"]),nv=40;function n_(e){let t=e;for(;t&&t!==document.body&&t!==document.documentElement;){const n=window.getComputedStyle(t).position;if(n==="fixed"||n==="sticky")return!0;t=t.parentElement}return!1}function fr(e){const t=e.tagName.toLowerCase();if(["nav","header","footer","main"].includes(t)&&document.querySelectorAll(t).length===1)return t;if(e.id)return`#${CSS.escape(e.id)}`;if(e.className&&typeof e.className=="string"){const r=e.className.split(/\s+/).filter(i=>i.length>0).find(i=>i.length>2&&!/^[a-zA-Z0-9]{6,}$/.test(i)&&!/^[a-z]{1,2}$/.test(i));if(r){const i=`${t}.${CSS.escape(r)}`;if(document.querySelectorAll(i).length===1)return i}}const n=e.parentElement;if(n){const r=Array.from(n.children).indexOf(e)+1;return`${n===document.body?"body":fr(n)} > ${t}:nth-child(${r})`}return t}function Ls(e){const t=e.tagName.toLowerCase(),n=e.getAttribute("aria-label");if(n)return n;const o=e.getAttribute("role");if(o&&Fl[o])return Fl[o];if(id[t])return id[t];const r=e.querySelector("h1, h2, h3, h4, h5, h6");if(r){const s=r.textContent?.trim();if(s&&s.length<=50)return s;if(s)return s.slice(0,47)+"..."}const{name:i}=wi(e);return i.charAt(0).toUpperCase()+i.slice(1)}function o_(e){const t=e.className;return typeof t!="string"||!t?null:t.split(/\s+/).map(o=>o.replace(/[_][a-zA-Z0-9]{5,}.*$/,"")).find(o=>o.length>2&&!/^[a-z]{1,2}$/.test(o))||null}function r_(e){const t=e.textContent?.trim();if(!t)return null;const n=t.replace(/\s+/g," ");return n.length<=30?n:n.slice(0,30)+"…"}function ov(){const e=document.querySelector("main")||document.body,t=Array.from(e.children);let n=t;e!==document.body&&t.length<3&&(n=Array.from(document.body.children));const o=[];return n.forEach((r,i)=>{if(!(r instanceof HTMLElement))return;const s=r.tagName.toLowerCase();if(tv.has(s)||r.hasAttribute("data-feedback-toolbar")||r.closest("[data-feedback-toolbar]"))return;const l=window.getComputedStyle(r);if(l.display==="none"||l.visibility==="hidden")return;const a=r.getBoundingClientRect();if(a.height<nv)return;const c=ev.has(s),d=r.getAttribute("role")&&Fl[r.getAttribute("role")],u=s==="div"&&a.height>=60;if(!c&&!d&&!u)return;const _=window.scrollY,m=n_(r),g={x:a.x,y:m?a.y:a.y+_,width:a.width,height:a.height};o.push({id:`rs-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,label:Ls(r),tagName:s,selector:fr(r),role:r.getAttribute("role"),className:o_(r),textSnippet:r_(r),originalRect:g,currentRect:{...g},originalIndex:i,isFixed:m})}),o}function rv(e){const t=window.scrollY,n=e.getBoundingClientRect(),o=n_(e),r={x:n.x,y:o?n.y:n.y+t,width:n.width,height:n.height},i=e.parentElement;let s=0;return i&&(s=Array.from(i.children).indexOf(e)),{id:`rs-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,label:Ls(e),tagName:e.tagName.toLowerCase(),selector:fr(e),role:e.getAttribute("role"),className:o_(e),textSnippet:r_(e),originalRect:r,currentRect:{...r},originalIndex:s,isFixed:o}}var sd={bg:"rgba(59, 130, 246, 0.08)",border:"rgba(59, 130, 246, 0.5)",pill:"#3b82f6"},ld=["nw","n","ne","e","se","s","sw","w"],ls=24,ad=16,as=5;function cd(e,t,n,o){let r=1/0,i=1/0;const s=e.x,l=e.x+e.width,a=e.x+e.width/2,c=e.y,d=e.y+e.height,u=e.y+e.height/2,_=[];for(const D of t)n.has(D.id)||_.push(D.currentRect);o&&_.push(...o);for(const D of _){const K=D.x,te=D.x+D.width,me=D.x+D.width/2,j=D.y,ue=D.y+D.height,be=D.y+D.height/2;for(const ye of[s,l,a])for(const Te of[K,te,me]){const _e=Te-ye;Math.abs(_e)<as&&Math.abs(_e)<Math.abs(r)&&(r=_e)}for(const ye of[c,d,u])for(const Te of[j,ue,be]){const _e=Te-ye;Math.abs(_e)<as&&Math.abs(_e)<Math.abs(i)&&(i=_e)}}const m=Math.abs(r)<as?r:0,g=Math.abs(i)<as?i:0,v=[],f=new Set,p=s+m,k=l+m,P=a+m,R=c+g,A=d+g,ee=u+g;for(const D of _){const K=D.x,te=D.x+D.width,me=D.x+D.width/2,j=D.y,ue=D.y+D.height,be=D.y+D.height/2;for(const ye of[K,me,te])for(const Te of[p,P,k])if(Math.abs(Te-ye)<.5){const _e=`x:${Math.round(ye)}`;f.has(_e)||(f.add(_e),v.push({axis:"x",pos:ye}))}for(const ye of[j,be,ue])for(const Te of[R,ee,A])if(Math.abs(Te-ye)<.5){const _e=`y:${Math.round(ye)}`;f.has(_e)||(f.add(_e),v.push({axis:"y",pos:ye}))}}return{dx:m,dy:g,guides:v}}var iv=new Set(["script","style","noscript","link","meta","br","hr"]);function dd(e){let t=e;for(;t&&t!==document.body&&t!==document.documentElement;){if(t.closest("[data-feedback-toolbar]"))return null;if(iv.has(t.tagName.toLowerCase())){t=t.parentElement;continue}const n=t.getBoundingClientRect();if(n.width>=ad&&n.height>=ad)return t;t=t.parentElement}return null}function sv(e){const t=()=>e.rearrangeState.sections;let n=e.rearrangeState;De(()=>{n=e.rearrangeState});const[o,r]=G(new Set),[i,s]=G(!1);let l=e.clearSignal;De(()=>{e.clearSignal!==void 0&&e.clearSignal!==l&&(l=e.clearSignal,t().length>0&&s(!0))});let a=e.deselectSignal;De(()=>{e.deselectSignal!==a&&(a=e.deselectSignal,r(new Set))});const[c,d]=G(null),[u,_]=G(!1);let m=!1;const g=H=>{const V=t().find(F=>F.id===H);V&&(m=!!V.note,d(H),_(!1))},v=()=>{c()&&(_(!0),setTimeout(()=>{d(null),_(!1)},150))},f=H=>{c()&&(e.onChange({...e.rearrangeState,sections:t().map(V=>V.id===c()?{...V,note:H.trim()||void 0}:V)}),v())};De(()=>{e.exiting&&c()&&v()});const[p,k]=G(new Set);let P=new Map;const[R,A]=G(null),[ee,D]=G(null),[K,te]=G([]),[me,j]=G(0);let ue=null,be=new Set,ye=new Map;const[Te,_e]=G(new Map),[W,B]=G(new Map);let Z=new Set,de=new Map,Y=e.onSelectionChange;De(()=>{Y=e.onSelectionChange});let oe=e.onDragMove;De(()=>{oe=e.onDragMove});let ve=e.onDragEnd;De(()=>{ve=e.onDragEnd}),De(()=>{e.blankCanvas&&r(new Set)});const[he,We]=G(!e.rearrangeState.sections.some(H=>{const V=H.originalRect,F=H.currentRect;return Math.abs(V.x-F.x)>1||Math.abs(V.y-F.y)>1||Math.abs(V.width-F.width)>1||Math.abs(V.height-F.height)>1}));Pn(()=>{if(!he()){const H=setTimeout(()=>We(!0),380);ot(()=>clearTimeout(H))}});let Xe=new Set;De(()=>{Xe=new Set(t().map(H=>H.selector))}),Pn(()=>{const H=()=>j(window.scrollY);H(),window.addEventListener("scroll",H,{passive:!0}),window.addEventListener("resize",H,{passive:!0}),ot(()=>{window.removeEventListener("scroll",H),window.removeEventListener("resize",H)})}),Pn(()=>{const H=V=>{if(ue){A(null);return}const F=document.elementFromPoint(V.clientX,V.clientY);if(!F){A(null);return}if(F.closest("[data-feedback-toolbar]")){A(null);return}if(F.closest("[data-design-placement]")){A(null);return}if(F.closest("[data-annotation-popup]")){A(null);return}const se=dd(F);if(!se){A(null);return}for(const Fe of Xe)try{const le=document.querySelector(Fe);if(le&&(le===se||se.contains(le))){A(null);return}}catch{}const ge=se.getBoundingClientRect();A({x:ge.x,y:ge.y,w:ge.width,h:ge.height})};document.addEventListener("mousemove",H,{passive:!0}),ot(()=>document.removeEventListener("mousemove",H))}),Pn(()=>{const H=document.body.style.userSelect;document.body.style.userSelect="none",ot(()=>{document.body.style.userSelect=H})}),Pn(()=>{const H=V=>{if(ue||V.button!==0)return;const F=V.target;if(!F||F.closest("[data-feedback-toolbar]")||F.closest("[data-design-placement]")||F.closest("[data-annotation-popup]"))return;const se=dd(F);let ge=!1;if(se)for(const le of Xe)try{const qe=document.querySelector(le);if(qe&&(qe===se||se.contains(qe))){ge=!0;break}}catch{}const Fe=!!(V.shiftKey||V.metaKey||V.ctrlKey);if(se&&!ge){V.preventDefault(),V.stopPropagation();const le=rv(se),qe=[...t(),le],Nt=[...e.rearrangeState.originalOrder,le.id];e.onChange({...e.rearrangeState,sections:qe,originalOrder:Nt});const Pt=new Set([le.id]);r(Pt),Y?.(Pt,Fe),A(null);const ae=V.clientX,He=V.clientY,Pe={x:le.currentRect.x,y:le.currentRect.y};let ht=!1,Me=0,Ke=0;ue="move";const wt=ze=>{const ct=ze.clientX-ae,Xt=ze.clientY-He;if(!ht&&(Math.abs(ct)>2||Math.abs(Xt)>2)&&(ht=!0),!ht)return;const Kt={x:Pe.x+ct,y:Pe.y+Xt,width:le.currentRect.width,height:le.currentRect.height},Jt=cd(Kt,qe,new Set([le.id]),e.extraSnapRects);te(Jt.guides);const Zt=ct+Jt.dx,un=Xt+Jt.dy;Me=Zt,Ke=un;const on=document.querySelector(`[data-rearrange-section="${le.id}"]`);on&&(on.style.transform=`translate(${Zt}px, ${un}px)`),_e(new Map([[le.id,{x:Pe.x+Zt,y:Pe.y+un,width:le.currentRect.width,height:le.currentRect.height}]])),oe?.(Zt,un)},Ne=()=>{window.removeEventListener("mousemove",wt),window.removeEventListener("mouseup",Ne),ue=null,te([]),_e(new Map);const ze=document.querySelector(`[data-rearrange-section="${le.id}"]`);ze&&(ze.style.transform=""),ht&&e.onChange({...e.rearrangeState,sections:qe.map(ct=>ct.id===le.id?{...ct,currentRect:{...ct.currentRect,x:Math.max(0,Pe.x+Me),y:Math.max(0,Pe.y+Ke)}}:ct),originalOrder:Nt}),ve?.(Me,Ke,ht)};window.addEventListener("mousemove",wt),window.addEventListener("mouseup",Ne)}else if(ge&&se){V.preventDefault();for(const le of t())try{const qe=document.querySelector(le.selector);if(qe&&qe===se){const Nt=new Set([le.id]);r(Nt),Y?.(Nt,Fe);return}}catch{}Fe||(r(new Set),Y?.(new Set,!1))}else Fe||(r(new Set),Y?.(new Set,!1))};document.addEventListener("mousedown",H,!0),ot(()=>document.removeEventListener("mousedown",H,!0))}),Pn(()=>{const H=V=>{const F=V.target;if(!(F.tagName==="INPUT"||F.tagName==="TEXTAREA"||F.isContentEditable)){if((V.key==="Backspace"||V.key==="Delete")&&o().size>0){V.preventDefault();const se=new Set(o());k(ge=>{const Fe=new Set(ge);for(const le of se)Fe.add(le);return Fe}),r(new Set),setTimeout(()=>{const ge=n;e.onChange({...ge,sections:ge.sections.filter(Fe=>!se.has(Fe.id)),originalOrder:ge.originalOrder.filter(Fe=>!se.has(Fe))}),k(Fe=>{const le=new Set(Fe);for(const qe of se)le.delete(qe);return le})},180);return}if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(V.key)&&o().size>0){V.preventDefault();const se=V.shiftKey?20:1,ge=V.key==="ArrowLeft"?-se:V.key==="ArrowRight"?se:0,Fe=V.key==="ArrowUp"?-se:V.key==="ArrowDown"?se:0;e.onChange({...e.rearrangeState,sections:t().map(le=>o().has(le.id)?{...le,currentRect:{...le.currentRect,x:Math.max(0,le.currentRect.x+ge),y:Math.max(0,le.currentRect.y+Fe)}}:le)});return}V.key==="Escape"&&o().size>0&&r(new Set)}};document.addEventListener("keydown",H),ot(()=>document.removeEventListener("keydown",H))});const re=(H,V)=>{if(H.button!==0)return;const F=H.target;if(F.closest(`.${X.handle}`)||F.closest(`.${X.deleteButton}`))return;H.preventDefault(),H.stopPropagation();let se;H.shiftKey||H.metaKey||H.ctrlKey?(se=new Set(o()),se.has(V)?se.delete(V):se.add(V)):o().has(V)?se=new Set(o()):se=new Set([V]),r(se),(se.size!==o().size||[...se].some(Me=>!o().has(Me)))&&Y?.(se,!!(H.shiftKey||H.metaKey||H.ctrlKey));const Fe=H.clientX,le=H.clientY,qe=new Map;for(const Me of t())se.has(Me.id)&&qe.set(Me.id,{x:Me.currentRect.x,y:Me.currentRect.y});ue="move";let Nt=!1,Pt=0,ae=0;const He=new Map;for(const Me of t())if(se.has(Me.id)){const Ke=document.querySelector(`[data-rearrange-section="${Me.id}"]`);He.set(Me.id,{outlineEl:Ke,curW:Me.currentRect.width,curH:Me.currentRect.height})}const Pe=Me=>{const Ke=Me.clientX-Fe,wt=Me.clientY-le;if(Ke===0&&wt===0)return;Nt=!0;let Ne=1/0,ze=1/0,ct=-1/0,Xt=-1/0;for(const[on,{curW:mn,curH:qt}]of He){const Ut=qe.get(on);if(!Ut)continue;const Gt=Ut.x+Ke,ft=Ut.y+wt;Ne=Math.min(Ne,Gt),ze=Math.min(ze,ft),ct=Math.max(ct,Gt+mn),Xt=Math.max(Xt,ft+qt)}const Kt=cd({x:Ne,y:ze,width:ct-Ne,height:Xt-ze},t(),se,e.extraSnapRects),Jt=Ke+Kt.dx,Zt=wt+Kt.dy;Pt=Jt,ae=Zt,te(Kt.guides);for(const[,{outlineEl:on}]of He)on&&(on.style.transform=`translate(${Jt}px, ${Zt}px)`);const un=new Map;for(const[on,{curW:mn,curH:qt}]of He){const Ut=qe.get(on);if(Ut){const Gt={x:Math.max(0,Ut.x+Jt),y:Math.max(0,Ut.y+Zt),width:mn,height:qt};un.set(on,Gt)}}_e(un),oe?.(Jt,Zt)},ht=Me=>{window.removeEventListener("mousemove",Pe),window.removeEventListener("mouseup",ht),ue=null,te([]),_e(new Map);for(const[,{outlineEl:Ke}]of He)Ke&&(Ke.style.transform="");if(Nt){const Ke=Me.clientX-Fe,wt=Me.clientY-le;if(Math.abs(Ke)<5&&Math.abs(wt)<5)e.onChange({...e.rearrangeState,sections:t().map(Ne=>{const ze=qe.get(Ne.id);return ze?{...Ne,currentRect:{...Ne.currentRect,x:ze.x,y:ze.y}}:Ne})});else{e.onChange({...e.rearrangeState,sections:t().map(Ne=>{const ze=qe.get(Ne.id);return ze?{...Ne,currentRect:{...Ne.currentRect,x:Math.max(0,ze.x+Pt),y:Math.max(0,ze.y+ae)}}:Ne})}),ve?.(Pt,ae,!0);return}}ve?.(0,0,!1)};window.addEventListener("mousemove",Pe),window.addEventListener("mouseup",ht)},Qe=(H,V,F)=>{H.preventDefault(),H.stopPropagation();const se=t().find(Pe=>Pe.id===V);if(!se)return;r(new Set([V])),ue="resize";const ge=H.clientX,Fe=H.clientY,le={...se.currentRect},qe=le.width/le.height;let Nt={...le};const Pt=document.querySelector(`[data-rearrange-section="${V}"]`),ae=Pe=>{const ht=Pe.clientX-ge,Me=Pe.clientY-Fe;let Ke=le.x,wt=le.y,Ne=le.width,ze=le.height;if(F.includes("e")&&(Ne=Math.max(ls,le.width+ht)),F.includes("w")&&(Ne=Math.max(ls,le.width-ht),Ke=le.x+le.width-Ne),F.includes("s")&&(ze=Math.max(ls,le.height+Me)),F.includes("n")&&(ze=Math.max(ls,le.height-Me),wt=le.y+le.height-ze),Pe.shiftKey)if(F.length===2){const Xt=Math.abs(Ne-le.width),Kt=Math.abs(ze-le.height);Xt>Kt?ze=Ne/qe:Ne=ze*qe,F.includes("w")&&(Ke=le.x+le.width-Ne),F.includes("n")&&(wt=le.y+le.height-ze)}else F==="e"||F==="w"?ze=Ne/qe:Ne=ze*qe,F==="w"&&(Ke=le.x+le.width-Ne),F==="n"&&(wt=le.y+le.height-ze);Nt={x:Ke,y:wt,width:Ne,height:ze},Pt&&(Pt.style.left=`${Ke}px`,Pt.style.top=`${wt-me()}px`,Pt.style.width=`${Ne}px`,Pt.style.height=`${ze}px`),D({x:Pe.clientX+12,y:Pe.clientY+12,text:`${Math.round(Ne)} × ${Math.round(ze)}`}),_e(new Map([[V,Nt]]))},He=()=>{window.removeEventListener("mousemove",ae),window.removeEventListener("mouseup",He),D(null),ue=null,_e(new Map),e.onChange({...e.rearrangeState,sections:t().map(Pe=>Pe.id===V?{...Pe,currentRect:Nt}:Pe)})};window.addEventListener("mousemove",ae),window.addEventListener("mouseup",He)},nt=H=>{k(V=>{const F=new Set(V);return F.add(H),F}),r(V=>{const F=new Set(V);return F.delete(H),F}),setTimeout(()=>{const V=n;e.onChange({...V,sections:V.sections.filter(F=>F.id!==H),originalOrder:V.originalOrder.filter(F=>F!==H)}),k(F=>{const se=new Set(F);return se.delete(H),se})},180)},Le=H=>{const V=H.originalRect,F=H.currentRect;return Math.abs(V.x-F.x)>1||Math.abs(V.y-F.y)>1||Math.abs(V.width-F.width)>1||Math.abs(V.height-F.height)>1},ut=H=>{const V=H.originalRect,F=H.currentRect;return Math.abs(V.x-F.x)>1||Math.abs(V.y-F.y)>1},it=H=>{const V=H.originalRect,F=H.currentRect;return Math.abs(V.width-F.width)>1||Math.abs(V.height-F.height)>1},xe=()=>t().filter(H=>{try{if(p().has(H.id)||o().has(H.id))return!0;const V=document.querySelector(H.selector);if(!V)return!1;const F=V.getBoundingClientRect(),se=H.originalRect;return Math.abs(F.width-se.width)+Math.abs(F.height-se.height)<200}catch{return!1}}),Se=()=>xe().filter(H=>Le(H)),Lt=()=>xe().filter(H=>!Le(H));return De(()=>{const H=t();for(const ge of H)ye.has(ge.id)||(ut(ge)?ye.set(ge.id,"move"):it(ge)&&ye.set(ge.id,"resize"));for(const ge of ye.keys())H.some(Fe=>Fe.id===ge)||ye.delete(ge);const V=new Set(Se().map(ge=>ge.id));for(const ge of be)V.has(ge)||be.delete(ge);for(const ge of Se())de.set(ge.id,{currentRect:ge.currentRect,originalRect:ge.originalRect,isFixed:ge.isFixed});const F=Z;Z=V;const se=new Map;for(const ge of F)if(!V.has(ge)){if(!H.some(le=>le.id===ge))continue;const Fe=de.get(ge);Fe&&(se.set(ge,{orig:Fe.originalRect,target:Fe.currentRect,isFixed:Fe.isFixed}),de.delete(ge))}if(se.size>0){B(Fe=>{const le=new Map(Fe);for(const[qe,Nt]of se)le.set(qe,Nt);return le});const ge=setTimeout(()=>{B(Fe=>{const le=new Map(Fe);for(const qe of se.keys())le.delete(qe);return le})},250);ot(()=>clearTimeout(ge))}}),[(()=>{var H=b(Eb),V=H.firstChild,[F,se]=S(V.nextSibling),ge=F.nextSibling,[Fe,le]=S(ge.nextSibling),qe=Fe.nextSibling,[Nt,Pt]=S(qe.nextSibling);return y(H,h(Oe,{get when(){return R()},children:ae=>(()=>{var He=b(sn);return ie(Pe=>{var ht=X.hoverHighlight,Me=`${ae().x}px`,Ke=`${ae().y}px`,wt=`${ae().w}px`,Ne=`${ae().h}px`;return ht!==Pe.e&&M(He,Pe.e=ht),Me!==Pe.t&&E(He,"left",Pe.t=Me),Ke!==Pe.a&&E(He,"top",Pe.a=Ke),wt!==Pe.o&&E(He,"width",Pe.o=wt),Ne!==Pe.i&&E(He,"height",Pe.i=Ne),Pe},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0}),He})()}),F,se),y(H,h(Ye,{get each(){return Lt()},children:ae=>{const He=()=>ae.currentRect,Pe=()=>ae.isFixed?He().y:He().y-me(),ht=sd,Me=()=>o().has(ae.id);return(()=>{var Ke=b(Tb),wt=Ke.firstChild,Ne=wt.nextSibling,ze=Ne.nextSibling,ct=ze.firstChild,[Xt,Kt]=S(ct.nextSibling),Jt=Xt.nextSibling,Zt=Jt.nextSibling,[un,on]=S(Zt.nextSibling),mn=ze.nextSibling,qt=mn.nextSibling,[Ut,Gt]=S(qt.nextSibling);return Ke.$$dblclick=()=>g(ae.id),Ke.$$mousedown=ft=>re(ft,ae.id),y(wt,()=>ae.label),y(Ne,()=>(ae.note&&P.set(ae.id,ae.note),ae.note||P.get(ae.id)||"")),y(ze,()=>Math.round(He().width),Xt,Kt),y(ze,()=>Math.round(He().height),un,on),mn.$$click=()=>nt(ae.id),mn.$$mousedown=ft=>ft.stopPropagation(),y(Ke,h(Ye,{each:ld,children:ft=>(()=>{var Ve=b(sn);return Ve.$$mousedown=Wt=>Qe(Wt,ae.id,ft),ie(()=>M(Ve,`${X.handle} ${X[`handle${ft.charAt(0).toUpperCase()}${ft.slice(1)}`]}`)),Ft(),Ve})()}),Ut,Gt),ie(ft=>{var Ve=ae.id,Wt=`${X.sectionOutline} ${Me()?X.selected:""} ${i()||e.exiting||p().has(ae.id)?X.exiting:""}`,wn={left:`${He().x}px`,top:`${Pe()}px`,width:`${He().width}px`,height:`${He().height}px`,"border-color":ht.border,"background-color":ht.bg,...he()?{}:{opacity:0,animation:"none",transition:"none"}},dt=X.sectionLabel,Yt=ht.pill,Tn=`${X.sectionAnnotation} ${ae.note?X.annotationVisible:""}`,Cn=X.sectionDimensions,Dn=X.deleteButton;return Ve!==ft.e&&O(Ke,"data-rearrange-section",ft.e=Ve),Wt!==ft.t&&M(Ke,ft.t=Wt),ft.a=gn(Ke,wn,ft.a),dt!==ft.o&&M(wt,ft.o=dt),Yt!==ft.i&&E(wt,"background-color",ft.i=Yt),Tn!==ft.n&&M(Ne,ft.n=Tn),Cn!==ft.s&&M(ze,ft.s=Cn),Dn!==ft.h&&M(mn,ft.h=Dn),ft},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0,h:void 0}),Ft(),Ke})()}}),Fe,le),y(H,h(Ye,{get each(){return Se()},children:ae=>{const He=()=>ae.currentRect,Pe=()=>ae.isFixed?He().y:He().y-me(),ht=()=>o().has(ae.id),Me=()=>ut(ae),Ke=()=>it(ae),wt=()=>!ht(),Ne=!be.has(ae.id);return Ne&&be.add(ae.id),h(Oe,{get when(){return!(e.blankCanvas&&wt())},get children(){var ze=b(Lb),ct=ze.firstChild,Xt=ct.nextSibling,Kt=Xt.nextSibling,Jt=Kt.firstChild,[Zt,un]=S(Jt.nextSibling),on=Zt.nextSibling,mn=on.nextSibling,[qt,Ut]=S(mn.nextSibling),Gt=Kt.nextSibling,ft=Gt.nextSibling,[Ve,Wt]=S(ft.nextSibling),wn=Ve.nextSibling;return ze.$$dblclick=()=>g(ae.id),ze.$$mousedown=dt=>re(dt,ae.id),y(ct,()=>ae.label),y(Xt,()=>(ae.note&&P.set(ae.id,ae.note),ae.note||P.get(ae.id)||"")),y(Kt,()=>Math.round(He().width),Zt,un),y(Kt,()=>Math.round(He().height),qt,Ut),Gt.$$click=()=>nt(ae.id),Gt.$$mousedown=dt=>dt.stopPropagation(),y(ze,h(Ye,{each:ld,children:dt=>(()=>{var Yt=b(sn);return Yt.$$mousedown=Tn=>Qe(Tn,ae.id,dt),ie(()=>M(Yt,`${X.handle} ${X[`handle${dt.charAt(0).toUpperCase()}${dt.slice(1)}`]}`)),Ft(),Yt})()}),Ve,Wt),y(wn,()=>{const dt=ye.get(ae.id);if(Me()&&Ke()){const[Yt,Tn]=dt==="resize"?["Resize","Move"]:["Move","Resize"];return["Suggested ",Yt," ",(()=>{var Cn=b(Ab),Dn=Cn.firstChild,Yn=Dn.nextSibling,[N,At]=S(Yn.nextSibling);return y(Cn,Tn,N,At),ie(()=>M(Cn,X.ghostBadgeExtra)),Cn})()]}return`Suggested ${Ke()?"Resize":"Move"}`}),ie(dt=>{var Yt=ae.id,Tn=`${X.ghostOutline} ${ht()?X.selected:""} ${i()||e.exiting||p().has(ae.id)?X.exiting:""}`,Cn={left:`${He().x}px`,top:`${Pe()}px`,width:`${He().width}px`,height:`${He().height}px`,...he()?{}:{opacity:0,animation:"none",transition:"none"},...Ne?{}:{animation:"none"}},Dn=X.sectionLabel,Yn=sd.pill,N=`${X.sectionAnnotation} ${ae.note?X.annotationVisible:""}`,At=X.sectionDimensions,en=X.deleteButton,Mn=X.ghostBadge;return Yt!==dt.e&&O(ze,"data-rearrange-section",dt.e=Yt),Tn!==dt.t&&M(ze,dt.t=Tn),dt.a=gn(ze,Cn,dt.a),Dn!==dt.o&&M(ct,dt.o=Dn),Yn!==dt.i&&E(ct,"background-color",dt.i=Yn),N!==dt.n&&M(Xt,dt.n=N),At!==dt.s&&M(Kt,dt.s=At),en!==dt.h&&M(Gt,dt.h=en),Mn!==dt.r&&M(wn,dt.r=Mn),dt},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0,h:void 0,r:void 0}),Ft(),ze}})}}),Nt,Pt),ie(()=>M(H,`${X.rearrangeOverlay} ${e.isDarkMode?"":X.light} ${e.exiting?X.overlayExiting:""}${e.className?` ${e.className}`:""}`)),H})(),h(Oe,{get when(){return!e.blankCanvas},get children(){return(()=>{const H=()=>{const V=[];for(const F of Se()){const se=Te().get(F.id);V.push({id:F.id,orig:F.originalRect,target:se||F.currentRect,isFixed:F.isFixed,isSelected:o().has(F.id),isExiting:p().has(F.id)})}for(const[F,se]of Te())if(!V.some(ge=>ge.id===F)){const ge=t().find(Fe=>Fe.id===F);ge&&V.push({id:F,orig:ge.originalRect,target:se,isFixed:ge.isFixed,isSelected:o().has(F)})}for(const[F,se]of W())V.some(ge=>ge.id===F)||V.push({id:F,orig:se.orig,target:se.target,isFixed:se.isFixed,isSelected:!1,isExiting:!0});return V};return h(Oe,{get when(){return H().length>0},get children(){var V=b(Bb),F=V.firstChild,[se,ge]=S(F.nextSibling);return se.nextSibling,y(V,h(Ye,{get each(){return H()},children:({id:Fe,orig:le,target:qe,isFixed:Nt,isSelected:Pt,isExiting:ae})=>{const He=le.x+le.width/2,Pe=(Nt?le.y:le.y-me())+le.height/2,ht=qe.x+qe.width/2,Me=(Nt?qe.y:qe.y-me())+qe.height/2,Ke=ht-He,wt=Me-Pe,Ne=Math.sqrt(Ke*Ke+wt*wt);if(Ne<2)return null;const ze=Math.min(1,Ne/40),ct=Math.min(Ne*.3,60),Xt=Ne>0?-wt/Ne:0,Kt=Ne>0?Ke/Ne:0,Jt=(He+ht)/2+Xt*ct,Zt=(Pe+Me)/2+Kt*ct,un=Te().has(Fe),on=un||Pt?1:.4,mn=un||Pt?1:.5;return(()=>{var qt=b(Ob),Ut=qt.firstChild,Gt=Ut.nextSibling,ft=Gt.nextSibling;return O(Ut,"d",`M ${He} ${Pe} Q ${Jt} ${Zt} ${ht} ${Me}`),O(Ut,"opacity",on*ze),O(Gt,"cx",He),O(Gt,"cy",Pe),O(Gt,"r",4*ze),O(Gt,"opacity",mn*ze),O(ft,"cx",ht),O(ft,"cy",Me),O(ft,"r",4*ze),O(ft,"opacity",mn*ze),ie(Ve=>{var Wt=ae?X.connectorExiting:"",wn=X.connectorLine,dt=X.connectorDot,Yt=X.connectorDot;return Wt!==Ve.e&&O(qt,"class",Ve.e=Wt),wn!==Ve.t&&O(Ut,"class",Ve.t=wn),dt!==Ve.a&&O(Gt,"class",Ve.a=dt),Yt!==Ve.o&&O(ft,"class",Ve.o=Yt),Ve},{e:void 0,t:void 0,a:void 0,o:void 0}),qt})()}}),se,ge),ie(()=>O(V,"class",`${X.connectorSvg} ${i()||e.exiting?X.connectorExiting:""}`)),V}})})()}}),h(Oe,{get when(){return c()},children:H=>{const V=()=>t().find(F=>F.id===H());return h(Oe,{get when(){return V()},children:F=>{const se=()=>F().currentRect,ge=()=>F().isFixed?se().y:se().y-me(),Fe=()=>se().x+se().width/2,le=()=>ge()-8,qe=()=>ge()+se().height+8,Nt=()=>le()>200,Pt=()=>qe()<window.innerHeight-100,ae=()=>Math.max(160,Math.min(window.innerWidth-160,Fe())),He=()=>Nt()?{left:`${ae()}px`,bottom:`${window.innerHeight-le()}px`}:Pt()?{left:`${ae()}px`,top:`${qe()}px`}:{left:`${ae()}px`,top:`${Math.max(80,window.innerHeight/2-80)}px`};return h(Ts,{get element(){return F().label},placeholder:"Add a note about this section",get initialValue(){return F().note??""},submitLabel:m?"Save":"Set",onSubmit:f,onCancel:v,onDelete:m?()=>{f("")}:void 0,get isExiting(){return u()},get lightMode(){return!e.isDarkMode},get style(){return He()}})}})}}),h(Oe,{get when(){return ee()},children:H=>(()=>{var V=b(tr);return y(V,()=>H().text),ie(F=>{var se=X.sizeIndicator,ge=`${H().x}px`,Fe=`${H().y}px`;return se!==F.e&&M(V,F.e=se),ge!==F.t&&E(V,"left",F.t=ge),Fe!==F.a&&E(V,"top",F.a=Fe),F},{e:void 0,t:void 0,a:void 0}),V})()}),h(Ye,{get each(){return K()},children:H=>(()=>{var V=b(sn);return ie(F=>{var se=X.guideLine,ge=H.axis==="x"?{position:"fixed",left:`${H.pos}px`,top:"0",width:"1px",height:"100vh"}:{position:"fixed",left:"0",top:`${H.pos-me()}px`,width:"100vw",height:"1px"};return se!==F.e&&M(V,F.e=se),F.t=gn(V,ge,F.t),F},{e:void 0,t:void 0}),V})()})]}var Nl=new Set(["script","style","noscript","link","meta","br","hr"]);function lv(){const e=document.querySelector("main")||document.body,t=[],n=Array.from(e.children),o=e!==document.body&&n.length<3?Array.from(document.body.children):n;for(const r of o){if(!(r instanceof HTMLElement)||Nl.has(r.tagName.toLowerCase())||r.hasAttribute("data-feedback-toolbar"))continue;const i=window.getComputedStyle(r);if(i.display==="none"||i.visibility==="hidden")continue;const s=r.getBoundingClientRect();if(!(s.height<10||s.width<10)){t.push({label:Ls(r),selector:fr(r),top:s.top,bottom:s.bottom,left:s.left,right:s.right,area:s.width*s.height});for(const l of Array.from(r.children)){if(!(l instanceof HTMLElement)||Nl.has(l.tagName.toLowerCase())||l.hasAttribute("data-feedback-toolbar"))continue;const a=window.getComputedStyle(l);if(a.display==="none"||a.visibility==="hidden")continue;const c=l.getBoundingClientRect();c.height<10||c.width<10||t.push({label:Ls(l),selector:fr(l),top:c.top,bottom:c.bottom,left:c.left,right:c.right,area:c.width*c.height})}}}return t}function av(e){const t=window.scrollY;return e.map(({label:n,selector:o,rect:r})=>{const i=r.y-t;return{label:n,selector:o,top:i,bottom:i+r.height,left:r.x,right:r.x+r.width,area:r.width*r.height}})}function cv(e){const t=window.scrollY,n=e.y-t,o=e.x;return{top:n,bottom:n+e.height,left:o,right:o+e.width,area:e.width*e.height}}function zl(e,t){const n=t?av(t):lv(),o=cv(e);let r=null,i=null,s=null,l=null,a=null;for(const g of n){if(Math.abs(g.left-o.left)<2&&Math.abs(g.top-o.top)<2&&Math.abs(g.right-g.left-e.width)<2&&Math.abs(g.bottom-g.top-e.height)<2)continue;g.left<=o.left+2&&g.right>=o.right-2&&g.top<=o.top+2&&g.bottom>=o.bottom-2&&g.area>o.area*1.5&&(!a||g.area<a._area)&&(a={label:g.label,selector:g.selector,_area:g.area});const v=o.right>g.left+5&&o.left<g.right-5,f=o.bottom>g.top+5&&o.top<g.bottom-5;if(v&&g.bottom<=o.top+5){const p=Math.round(o.top-g.bottom);(!r||p<r._dist)&&(r={label:g.label,selector:g.selector,gap:Math.max(0,p),_dist:p})}if(v&&g.top>=o.bottom-5){const p=Math.round(g.top-o.bottom);(!i||p<i._dist)&&(i={label:g.label,selector:g.selector,gap:Math.max(0,p),_dist:p})}if(f&&g.right<=o.left+5){const p=Math.round(o.left-g.right);(!s||p<s._dist)&&(s={label:g.label,selector:g.selector,gap:Math.max(0,p),_dist:p})}if(f&&g.left>=o.right-5){const p=Math.round(g.left-o.right);(!l||p<l._dist)&&(l={label:g.label,selector:g.selector,gap:Math.max(0,p),_dist:p})}}const c=window.innerWidth,d=window.innerHeight,u=uv(e,c),_=g=>g?{label:g.label,selector:g.selector,gap:g.gap}:null,m=dv(o,e,c,d,a?{label:a.label,selector:a.selector,_area:a._area}:null,n);return{above:_(r),below:_(i),left:_(s),right:_(l),alignment:u,containedIn:a?{label:a.label,selector:a.selector}:null,outOfBounds:m}}function dv(e,t,n,o,r,i){const s={};let l=!1;const a=[];if(e.left<-2&&a.push("left"),e.right>n+2&&a.push("right"),e.top<-2&&a.push("top"),e.bottom>o+2&&a.push("bottom"),a.length>0&&(s.viewport=a,l=!0),r){const c=i.find(d=>d.label===r.label&&d.selector===r.selector&&Math.abs(d.area-r._area)<10);if(c){const d=[];e.left<c.left-2&&d.push("left"),e.right>c.right+2&&d.push("right"),e.top<c.top-2&&d.push("top"),e.bottom>c.bottom+2&&d.push("bottom"),d.length>0&&(s.container={label:r.label,edges:d},l=!0)}}return l?s:null}function uv(e,t){if(e.width/t>.85)return"full-width";const o=e.x+e.width/2,r=t/2,i=o-r,s=t*.08;return Math.abs(i)<s?"center":i<0?"left":"right"}function i_(e){switch(e){case"full-width":return"full-width";case"center":return"centered";case"left":return"left-aligned";case"right":return"right-aligned"}}function s_(e,t={}){const n=[];e.above&&n.push(`Below \`${e.above.label}\`${e.above.gap>0?` (${e.above.gap}px gap)`:""}`),e.below&&n.push(`Above \`${e.below.label}\`${e.below.gap>0?` (${e.below.gap}px gap)`:""}`),t.includeLeftRight&&(e.left&&n.push(`Right of \`${e.left.label}\`${e.left.gap>0?` (${e.left.gap}px gap)`:""}`),e.right&&n.push(`Left of \`${e.right.label}\`${e.right.gap>0?` (${e.right.gap}px gap)`:""}`));const o=i_(e.alignment);return e.containedIn?n.push(`${o.charAt(0).toUpperCase()+o.slice(1)} in \`${e.containedIn.label}\``):n.push(`${o.charAt(0).toUpperCase()+o.slice(1)} in page`),t.includePixelRef&&t.pixelRef&&n.push(`Pixel ref: \`${t.pixelRef}\``),e.outOfBounds&&(e.outOfBounds.viewport&&n.push(`**Outside viewport** (${e.outOfBounds.viewport.join(", ")} edge${e.outOfBounds.viewport.length>1?"s":""})`),e.outOfBounds.container&&n.push(`**Outside \`${e.outOfBounds.container.label}\`** (${e.outOfBounds.container.edges.join(", ")} edge${e.outOfBounds.container.edges.length>1?"s":""})`)),n}function _v(e,t,n){const o=[];e.above&&o.push(`below \`${e.above.label}\``),e.below&&o.push(`above \`${e.below.label}\``),e.left&&o.push(`right of \`${e.left.label}\``),e.right&&o.push(`left of \`${e.right.label}\``),e.containedIn&&o.push(`inside \`${e.containedIn.label}\``),o.push(i_(e.alignment)),e.outOfBounds?.viewport&&o.push(`**outside viewport** (${e.outOfBounds.viewport.join(", ")})`),e.outOfBounds?.container&&o.push(`**outside \`${e.outOfBounds.container.label}\`** (${e.outOfBounds.container.edges.join(", ")})`);const r=n?`, ${Math.round(n.width)}×${Math.round(n.height)}px`:"";return`at (${Math.round(t.x)}, ${Math.round(t.y)})${r}: ${o.join(", ")}`}var ud=15;function _d(e){if(e.length<2)return[];const t=[],n=new Set;for(let o=0;o<e.length;o++){if(n.has(o))continue;const r=[o];for(let i=o+1;i<e.length;i++)n.has(i)||Math.abs(e[o].rect.y-e[i].rect.y)<ud&&r.push(i);if(r.length>=2){const i=r.map(a=>e[a]);i.sort((a,c)=>a.rect.x-c.rect.x);const s=[];for(let a=0;a<i.length-1;a++)s.push(Math.round(i[a+1].rect.x-(i[a].rect.x+i[a].rect.width)));const l=Math.round(i.reduce((a,c)=>a+c.rect.y,0)/i.length);t.push({labels:i.map(a=>a.label),type:"row",sharedEdge:l,gaps:s,avgGap:s.length?Math.round(s.reduce((a,c)=>a+c,0)/s.length):0}),r.forEach(a=>n.add(a))}}for(let o=0;o<e.length;o++){if(n.has(o))continue;const r=[o];for(let i=o+1;i<e.length;i++)n.has(i)||Math.abs(e[o].rect.x-e[i].rect.x)<ud&&r.push(i);if(r.length>=2){const i=r.map(a=>e[a]);i.sort((a,c)=>a.rect.y-c.rect.y);const s=[];for(let a=0;a<i.length-1;a++)s.push(Math.round(i[a+1].rect.y-(i[a].rect.y+i[a].rect.height)));const l=Math.round(i.reduce((a,c)=>a+c.rect.x,0)/i.length);t.push({labels:i.map(a=>a.label),type:"column",sharedEdge:l,gaps:s,avgGap:s.length?Math.round(s.reduce((a,c)=>a+c,0)/s.length):0}),r.forEach(a=>n.add(a))}}return t}function hv(e){if(e.length<2)return[];const t=_d(e.map(s=>({label:s.label,rect:s.originalRect}))),n=_d(e.map(s=>({label:s.label,rect:s.currentRect}))),o=[],r=new Set;for(const s of t){const l=new Set(s.labels);let a=null,c=0;for(const d of n){const u=d.labels.filter(_=>l.has(_)).length;u>=2&&u>c&&(a=d,c=u)}if(a){const d=a.labels.filter(_=>l.has(_)),u=d.join(", ");if(a.type!==s.type){const _=s.type==="row"?"y":"x",m=a.type==="row"?"y":"x";o.push(`**${u}**: ${s.type} (${_}≈${s.sharedEdge}, ${s.avgGap}px gaps) → ${a.type} (${m}≈${a.sharedEdge}, ${a.avgGap}px gaps)`)}else if(Math.abs(s.sharedEdge-a.sharedEdge)>20||Math.abs(s.avgGap-a.avgGap)>5){const _=s.type==="row"?"y":"x",m=Math.abs(s.sharedEdge-a.sharedEdge)>20?` ${_}: ${s.sharedEdge} → ${a.sharedEdge}`:"",g=Math.abs(s.avgGap-a.avgGap)>5?` gaps: ${s.avgGap}px → ${a.avgGap}px`:"";o.push(`**${u}**: ${s.type} shifted —${m}${g}`)}d.forEach(_=>r.add(_))}else{const d=s.labels.join(", "),u=s.type==="row"?"y":"x";o.push(`**${d}**: ${s.type} (${u}≈${s.sharedEdge}) dissolved`),s.labels.forEach(_=>r.add(_))}}for(const s of n){if(s.labels.every(c=>r.has(c))||s.labels.filter(c=>!r.has(c)).length<2)continue;if(!t.some(c=>c.labels.filter(u=>s.labels.includes(u)).length>=2)){const c=s.type==="row"?"y":"x";o.push(`**${s.labels.join(", ")}**: new ${s.type} (${c}≈${s.sharedEdge}, ${s.avgGap}px gaps)`),s.labels.forEach(d=>r.add(d))}}const i=e.filter(s=>!r.has(s.label));if(i.length>=2){const s={};for(const l of i){const a=Math.round(l.currentRect.x/5)*5;(s[a]??=[]).push(l.label)}for(const[l,a]of Object.entries(s))a.length>=2&&o.push(`**${a.join(", ")}**: shared left edge at x≈${l}`)}return o}function l_(e){if(typeof document>"u")return{viewport:e,contentArea:null};const t=[],n=new Set,o=l=>{n.has(l)||l instanceof HTMLElement&&(l.hasAttribute("data-feedback-toolbar")||Nl.has(l.tagName.toLowerCase())||(n.add(l),t.push(l)))},r=document.querySelector("main");r&&o(r);const i=document.querySelector("[role='main']");i&&o(i);for(const l of Array.from(document.body.children))if(o(l),l.children){for(const a of Array.from(l.children))if(o(a),a.children)for(const c of Array.from(a.children))o(c)}let s=null;for(const l of t){const a=l.getBoundingClientRect();if(a.height<50)continue;const c=getComputedStyle(l);if(c.maxWidth&&c.maxWidth!=="none"&&c.maxWidth!=="0px"){(!s||a.width<s.rect.width)&&(s={el:l,rect:a});continue}!s&&a.width<e.width-20&&a.width>100&&(s={el:l,rect:a})}if(s){const{el:l,rect:a}=s;return{viewport:e,contentArea:{width:Math.round(a.width),left:Math.round(a.left),right:Math.round(a.right),centerX:Math.round(a.left+a.width/2),selector:fr(l)}}}return{viewport:e,contentArea:null}}function fv(e){if(typeof document>"u")return null;const t=document.querySelector(e);if(!t?.parentElement)return null;const n=getComputedStyle(t.parentElement),o={parentDisplay:n.display,parentSelector:fr(t.parentElement)};return n.display.includes("flex")&&(o.flexDirection=n.flexDirection),n.display.includes("grid")&&n.gridTemplateColumns!=="none"&&(o.gridCols=n.gridTemplateColumns),n.gap&&n.gap!=="normal"&&n.gap!=="0px"&&(o.gap=n.gap),o}function a_(e,t){const n=t.contentArea,o=n?n.width:t.viewport.width,r=n?n.left:0,i=n?n.centerX:Math.round(t.viewport.width/2),s=Math.round(e.x-r),l=Math.round(r+o-(e.x+e.width)),a=(e.width/o*100).toFixed(1),c=e.x+e.width/2,d=Math.abs(c-i)<20,u=e.width/o>.95,_=[];return u?_.push("`width: 100%` of container"):_.push(`left \`${s}px\` in container, right \`${l}px\`, width \`${a}%\` (\`${Math.round(e.width)}px\`)`),d&&!u&&_.push("centered — `margin-inline: auto`"),_.join(" — ")}function c_(e){const{viewport:t,contentArea:n}=e;let o=`### Reference Frame
`;if(o+=`- Viewport: \`${t.width}×${t.height}px\`
`,n){const r=n;o+=`- Content area: \`${r.width}px\` wide, left edge at \`x=${r.left}\`, right at \`x=${r.right}\` (\`${r.selector}\`)
`,o+=`- Pixel → CSS translation:
`,o+=`  - **Horizontal position in container**: \`element.x - ${r.left}\` → use as \`margin-left\` or \`left\`
`,o+=`  - **Width as % of container**: \`element.width / ${r.width} × 100\` → use as \`width: X%\`
`,o+="  - **Vertical gap between elements**: `nextElement.y - (prevElement.y + prevElement.height)` → use as `margin-top` or `gap`\n",o+=`  - **Centered**: if \`|element.centerX - ${r.centerX}| < 20px\` → use \`margin-inline: auto\`
`}else o+=`- No distinct content container — elements positioned relative to full viewport
`,o+=`- Pixel → CSS translation:
`,o+=`  - **Width as % of viewport**: \`element.width / ${t.width} × 100\` → use as \`width: X%\`
`,o+=`  - **Centered**: if \`|(element.x + element.width/2) - ${Math.round(t.width/2)}| < 20px\` → use \`margin-inline: auto\`
`;return o+=`
`,o}function gv(e){const t=fv(e);if(!t)return null;let n=`\`${t.parentDisplay}\``;return t.flexDirection&&(n+=`, flex-direction: \`${t.flexDirection}\``),t.gridCols&&(n+=`, grid-template-columns: \`${t.gridCols}\``),t.gap&&(n+=`, gap: \`${t.gap}\``),`Parent: ${n} (\`${t.parentSelector}\`)`}function hd(e,t,n,o="standard"){if(e.length===0)return"";const r=[...e].sort((f,p)=>Math.abs(f.y-p.y)<20?f.x-p.x:f.y-p.y);let i="";if(n?.blankCanvas?(i+=`## Wireframe: New Page

`,n.wireframePurpose&&(i+=`> **Purpose:** ${n.wireframePurpose}
>
`),i+=`> ${e.length} component${e.length!==1?"s":""} placed — this is a standalone wireframe, not related to the current page.
>
> This wireframe is a rough sketch for exploring ideas.

`):i+=`## Design Layout

> ${e.length} component${e.length!==1?"s":""} placed

`,o==="compact")return i+=`### Components
`,r.forEach((f,p)=>{const k=Gn[f.type]?.label||f.type;i+=`${p+1}. **${k}** — \`${Math.round(f.width)}×${Math.round(f.height)}px\` at \`(${Math.round(f.x)}, ${Math.round(f.y)})\`
`}),i;const s=l_(t);i+=c_(s),i+=`### Components
`,r.forEach((f,p)=>{const k=Gn[f.type]?.label||f.type,P={x:f.x,y:f.y,width:f.width,height:f.height};i+=`${p+1}. **${k}** — \`${Math.round(f.width)}×${Math.round(f.height)}px\` at \`(${Math.round(f.x)}, ${Math.round(f.y)})\`
`;const R=zl(P),ee=s_(R,{includeLeftRight:o==="detailed"||o==="forensic"});for(const K of ee)i+=`   - ${K}
`;const D=a_(P,s);D&&(i+=`   - CSS: ${D}
`)}),i+=`
### Layout Analysis
`;const l=[];for(const f of r){const p=l.find(k=>Math.abs(k.y-f.y)<30);p?p.items.push(f):l.push({y:f.y,items:[f]})}if(l.sort((f,p)=>f.y-p.y),l.forEach((f,p)=>{f.items.sort((P,R)=>P.x-R.x);const k=f.items.map(P=>Gn[P.type]?.label||P.type);if(f.items.length===1){const R=f.items[0].width>t.width*.8;i+=`- Row ${p+1} (y≈${Math.round(f.y)}): ${k[0]}${R?" — full width":""}
`}else i+=`- Row ${p+1} (y≈${Math.round(f.y)}): ${k.join(" | ")} — ${f.items.length} items side by side
`}),o==="detailed"||o==="forensic"){i+=`
### Spacing & Gaps
`;for(let f=0;f<r.length-1;f++){const p=r[f],k=r[f+1],P=Gn[p.type]?.label||p.type,R=Gn[k.type]?.label||k.type,A=Math.round(k.y-(p.y+p.height)),ee=Math.round(k.x-(p.x+p.width));Math.abs(p.y-k.y)<30?i+=`- ${P} → ${R}: \`${ee}px\` horizontal gap
`:i+=`- ${P} → ${R}: \`${A}px\` vertical gap
`}if(o==="forensic"&&r.length>2){i+=`
### All Pairwise Gaps
`;for(let f=0;f<r.length;f++)for(let p=f+1;p<r.length;p++){const k=r[f],P=r[p],R=Gn[k.type]?.label||k.type,A=Gn[P.type]?.label||P.type,ee=Math.round(P.y-(k.y+k.height)),D=Math.round(P.x-(k.x+k.width));i+=`- ${R} ↔ ${A}: h=\`${D}px\` v=\`${ee}px\`
`}}o==="forensic"&&(i+=`
### Z-Order (placement order)
`,e.forEach((f,p)=>{const k=Gn[f.type]?.label||f.type;i+=`${p}. ${k} at \`(${Math.round(f.x)}, ${Math.round(f.y)})\`
`}))}i+=`
### Suggested Implementation
`;const a=r.some(f=>f.type==="navigation"),c=r.some(f=>f.type==="hero"),d=r.some(f=>f.type==="sidebar"),u=r.some(f=>f.type==="footer"),_=r.filter(f=>f.type==="card"),m=r.filter(f=>f.type==="form"),g=r.filter(f=>f.type==="table"),v=r.filter(f=>f.type==="modal");if(a&&(i+=`- Top navigation bar with logo + nav links + CTA
`),c&&(i+=`- Hero section with heading, subtext, and call-to-action
`),d&&(i+=`- Sidebar layout — use CSS Grid with sidebar + main content area
`),_.length>1?i+=`- ${_.length}-column card grid — use CSS Grid or Flexbox
`:_.length===1&&(i+=`- Card component with image + content area
`),m.length>0&&(i+=`- ${m.length} form${m.length>1?"s":""} — add proper labels, validation, and submit handling
`),g.length>0&&(i+=`- Data table — consider sortable columns and pagination
`),v.length>0&&(i+=`- Modal dialog — add overlay backdrop and focus trapping
`),u&&(i+=`- Multi-column footer with links
`),o==="detailed"||o==="forensic"){if(i+=`
### CSS Suggestions
`,d){const f=r.find(p=>p.type==="sidebar");i+=`- \`display: grid; grid-template-columns: ${Math.round(f.width)}px 1fr;\`
`}if(_.length>1){const f=Math.round(_[0].width);i+=`- \`display: grid; grid-template-columns: repeat(${_.length}, ${f}px); gap: 16px;\`
`}a&&(i+="- Navigation: `position: sticky; top: 0; z-index: 50;`\n")}return i}function fd(e,t="standard",n){const{sections:o}=e,r=[];for(const d of o){const u=d.originalRect,_=d.currentRect,m=Math.abs(u.x-_.x)>1||Math.abs(u.y-_.y)>1,g=Math.abs(u.width-_.width)>1||Math.abs(u.height-_.height)>1;if(!m&&!g){t==="forensic"&&r.push({section:d,posMoved:!1,sizeChanged:!1});continue}r.push({section:d,posMoved:m,sizeChanged:g})}if(r.length===0||t!=="forensic"&&r.every(d=>!d.posMoved&&!d.sizeChanged))return"";let i=`## Suggested Layout Changes

`;const s=n?n.width:typeof window<"u"?window.innerWidth:0,l=n?n.height:typeof window<"u"?window.innerHeight:0,a=l_({width:s,height:l});t!=="compact"&&(i+=c_(a)),t==="forensic"&&(i+=`> Detected at: \`${new Date(e.detectedAt).toISOString()}\`
`,i+=`> Total sections: ${o.length}

`);const c=d=>o.map(u=>({label:u.label,selector:u.selector,rect:d==="original"?u.originalRect:u.currentRect}));i+=`**Changes:**
`;for(const{section:d,posMoved:u,sizeChanged:_}of r){const m=d.originalRect,g=d.currentRect;if(!u&&!_){i+=`- ${d.label} — unchanged at (${Math.round(g.x)}, ${Math.round(g.y)}) ${Math.round(g.width)}×${Math.round(g.height)}px
`;continue}if(t==="compact"){u&&_?i+=`- Suggested: move **${d.label}** to (${Math.round(g.x)}, ${Math.round(g.y)}) ${Math.round(g.width)}×${Math.round(g.height)}px
`:u?i+=`- Suggested: move **${d.label}** to (${Math.round(g.x)}, ${Math.round(g.y)})
`:i+=`- Suggested: resize **${d.label}** to ${Math.round(g.width)}×${Math.round(g.height)}px
`;continue}if(u&&_?i+=`- Suggested: move and resize **${d.label}**
`:u?i+=`- Suggested: move **${d.label}**
`:i+=`- Suggested: resize **${d.label}** from ${Math.round(m.width)}×${Math.round(m.height)}px to ${Math.round(g.width)}×${Math.round(g.height)}px
`,u){const f=zl(m,c("original")),p=zl(g,c("current")),k=_?{width:m.width,height:m.height}:void 0;i+=`  - Currently ${_v(f,{x:m.x,y:m.y},k)}
`;const P=_?{width:g.width,height:g.height}:void 0,R=`at (${Math.round(g.x)}, ${Math.round(g.y)})`,A=P?`, ${Math.round(P.width)}×${Math.round(P.height)}px`:"",D=s_(p,{includeLeftRight:t==="detailed"||t==="forensic"});if(D.length>0){i+=`  - Suggested position ${R}${A}: ${D[0]}
`;for(let te=1;te<D.length;te++)i+=`    ${D[te]}
`}else i+=`  - Suggested position ${R}${A}
`;const K=a_(g,a);K&&(i+=`  - CSS: ${K}
`)}const v=gv(d.selector);if(v&&(i+=`  - ${v}
`),i+=`  - Selector: \`${d.selector}\`
`,t==="detailed"||t==="forensic"){const f=d.className?`${d.tagName}.${d.className.split(" ")[0]}`:d.tagName;f!==d.selector&&(i+=`  - Element: \`${f}\`
`),d.role&&(i+=`  - Role: \`${d.role}\`
`),t==="forensic"&&d.textSnippet&&(i+=`  - Text: "${d.textSnippet}"
`)}t==="forensic"&&(i+=`  - Original rect: \`{ x: ${Math.round(m.x)}, y: ${Math.round(m.y)}, w: ${Math.round(m.width)}, h: ${Math.round(m.height)} }\`
`,i+=`  - Current rect: \`{ x: ${Math.round(g.x)}, y: ${Math.round(g.y)}, w: ${Math.round(g.width)}, h: ${Math.round(g.height)} }\`
`)}if(t!=="compact"){const d=r.filter(_=>_.posMoved).map(_=>({label:_.section.label,originalRect:_.section.originalRect,currentRect:_.section.currentRect})),u=hv(d);if(u.length>0){i+=`
### Layout Summary
`;for(const _ of u)i+=`- ${_}
`}}if(t!=="compact"&&o.length>1){i+=`
### All Sections (current positions)
`;const d=[...o].sort((u,_)=>Math.abs(u.currentRect.y-_.currentRect.y)<20?u.currentRect.x-_.currentRect.x:u.currentRect.y-_.currentRect.y);for(const u of d){const _=u.currentRect,m=Math.abs(_.x-u.originalRect.x)>1||Math.abs(_.y-u.originalRect.y)>1||Math.abs(_.width-u.originalRect.width)>1||Math.abs(_.height-u.originalRect.height)>1;i+=`- ${u.label}: \`${Math.round(_.width)}×${Math.round(_.height)}px\` at \`(${Math.round(_.x)}, ${Math.round(_.y)})\`${m?" ← suggested":""}
`}}return i}var Hl="feedback-annotations-",d_=7;function As(e){return`${Hl}${e}`}function yl(e){if(typeof window>"u")return[];try{const t=localStorage.getItem(As(e));if(!t)return[];const n=JSON.parse(t),o=Date.now()-d_*24*60*60*1e3;return n.filter(r=>!r.timestamp||r.timestamp>o)}catch{return[]}}function u_(e,t){if(!(typeof window>"u"))try{localStorage.setItem(As(e),JSON.stringify(t))}catch{}}function mv(){const e=new Map;if(typeof window>"u")return e;try{const t=Date.now()-d_*24*60*60*1e3;for(let n=0;n<localStorage.length;n++){const o=localStorage.key(n);if(o?.startsWith(Hl)){const r=o.slice(Hl.length),i=localStorage.getItem(o);if(i){const l=JSON.parse(i).filter(a=>!a.timestamp||a.timestamp>t);l.length>0&&e.set(r,l)}}}}catch{}return e}function ui(e,t,n){const o=t.map(r=>({...r,_syncedTo:n}));u_(e,o)}var aa="agentation-design-";function pv(e){if(typeof window>"u")return[];try{const t=localStorage.getItem(`${aa}${e}`);return t?JSON.parse(t):[]}catch{return[]}}function yv(e,t){if(!(typeof window>"u"))try{localStorage.setItem(`${aa}${e}`,JSON.stringify(t))}catch{}}function xv(e){if(!(typeof window>"u"))try{localStorage.removeItem(`${aa}${e}`)}catch{}}var ca="agentation-rearrange-";function bv(e){if(typeof window>"u")return null;try{const t=localStorage.getItem(`${ca}${e}`);return t?JSON.parse(t):null}catch{return null}}function vv(e,t){if(!(typeof window>"u"))try{localStorage.setItem(`${ca}${e}`,JSON.stringify(t))}catch{}}function wv(e){if(!(typeof window>"u"))try{localStorage.removeItem(`${ca}${e}`)}catch{}}var da="agentation-wireframe-";function $v(e){if(typeof window>"u")return null;try{const t=localStorage.getItem(`${da}${e}`);return t?JSON.parse(t):null}catch{return null}}function gd(e,t){if(!(typeof window>"u"))try{localStorage.setItem(`${da}${e}`,JSON.stringify(t))}catch{}}function cs(e){if(!(typeof window>"u"))try{localStorage.removeItem(`${da}${e}`)}catch{}}var __="agentation-session-";function ua(e){return`${__}${e}`}function Sv(e){if(typeof window>"u")return null;try{return localStorage.getItem(ua(e))}catch{return null}}function xl(e,t){if(!(typeof window>"u"))try{localStorage.setItem(ua(e),t)}catch{}}function kv(e){if(!(typeof window>"u"))try{localStorage.removeItem(ua(e))}catch{}}var h_=`${__}toolbar-hidden`;function Cv(){if(typeof window>"u")return!1;try{return sessionStorage.getItem(h_)==="1"}catch{return!1}}function Mv(e){if(!(typeof window>"u"))try{e&&sessionStorage.setItem(h_,"1")}catch{}}async function bl(e,t){const n=await fetch(`${e}/sessions`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:t})});if(!n.ok)throw new Error(`Failed to create session: ${n.status}`);return n.json()}async function md(e,t){const n=await fetch(`${e}/sessions/${t}`);if(!n.ok)throw new Error(`Failed to get session: ${n.status}`);return n.json()}async function Ir(e,t,n){const o=await fetch(`${e}/sessions/${t}/annotations`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)});if(!o.ok)throw new Error(`Failed to sync annotation: ${o.status}`);return o.json()}async function pd(e,t,n){const o=await fetch(`${e}/annotations/${t}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)});if(!o.ok)throw new Error(`Failed to update annotation: ${o.status}`);return o.json()}async function Oo(e,t){const n=await fetch(`${e}/annotations/${t}`,{method:"DELETE"});if(!n.ok)throw new Error(`Failed to delete annotation: ${n.status}`)}var yd=new Set(["Fragment","Suspense","Routes","Route","Outlet","Root","ErrorBoundaryHandler","HotReload","Hot","Show","For","Index","Switch","Match","Dynamic","Portal","ErrorBoundary"]),xd=[/Boundary$/,/BoundaryHandler$/,/Provider$/,/Consumer$/,/^(Inner|Outer)/,/Router$/,/Context$/,/^Hot(Reload)?$/,/^(Dev|Solid)(Overlay|Tools|Root)/,/Overlay$/,/Handler$/,/^With[A-Z]/,/Wrapper$/,/^Root$/],Iv=[/Page$/,/View$/,/Screen$/,/Section$/,/Card$/,/List$/,/Item$/,/Form$/,/Modal$/,/Dialog$/,/Button$/,/Nav$/,/Header$/,/Footer$/,/Layout$/,/Panel$/,/Tab$/,/Menu$/];function Rv(e){const t=e?.mode??"filtered";let n=yd;if(e?.skipExact){const o=e.skipExact instanceof Set?e.skipExact:new Set(e.skipExact);n=new Set([...yd,...o])}return{maxComponents:e?.maxComponents??6,maxDepth:e?.maxDepth??30,mode:t,skipExact:n,skipPatterns:e?.skipPatterns?[...xd,...e.skipPatterns]:xd,userPatterns:e?.userPatterns??Iv,filter:e?.filter}}function Pv(e){return e.replace(/([a-z])([A-Z])/g,"$1-$2").replace(/([A-Z])([A-Z][a-z])/g,"$1-$2").toLowerCase()}function Ev(e,t=10){const n=new Set;let o=e,r=0;for(;o&&r<t;)o.className&&typeof o.className=="string"&&o.className.split(/\s+/).forEach(i=>{if(i.length>1){const s=i.replace(/[_][a-zA-Z0-9]{5,}.*$/,"").toLowerCase();s.length>1&&n.add(s)}}),o=o.parentElement,r++;return n}function Tv(e,t){const n=Pv(e);for(const o of t){if(o===n)return!0;const r=n.split("-").filter(s=>s.length>2),i=o.split("-").filter(s=>s.length>2);for(const s of r)for(const l of i)if(s===l||s.includes(l)||l.includes(s))return!0}return!1}function jl(e,t,n,o){if(n.filter)return n.filter(e,t);switch(n.mode){case"all":return!0;case"filtered":return!(n.skipExact.has(e)||n.skipPatterns.some(r=>r.test(e)));case"smart":return n.skipExact.has(e)||n.skipPatterns.some(r=>r.test(e))?!1:!!(o&&Tv(e,o)||n.userPatterns.some(r=>r.test(e)));default:return!0}}var Bs=null,Ul=new Set,bd=!1;function Lv(){if(!(bd||typeof window>"u")){bd=!0;try{if(!il?.hooks)return;const e=il.hooks.afterCreateOwner;il.hooks.afterCreateOwner=t=>{queueMicrotask(()=>{t&&t.component&&t.name&&Ul.add(t)})}}catch(e){console.warn("[agentation] initOwnerTracking error:",e)}}}function Av(e){if(e&&typeof e=="object"){let t=e;for(;t.owner&&typeof t.owner=="object";)t=t.owner;Bs=t}}var Zo=null,ds=new WeakMap;function Bv(){if(Zo!==null)return Zo;if(typeof document>"u")return!1;if(Bs)return Zo=!0,!0;try{if(typeof globalThis<"u"&&globalThis.Solid$$)return Zo=!0,!0}catch{}try{if(typeof window<"u"&&window.__SOLID_DEVTOOLS_GLOBAL_HOOK__)return Zo=!0,!0}catch{}if(document.body){for(const e of document.body.children)if(Ov(e))return Zo=!0,!0}return Zo=!1,!1}function Ov(e){try{if(Object.keys(e).some(n=>n==="__$owner"||n.startsWith("__solid")||n.startsWith("__owner")))return!0}catch{}return!1}function f_(e,t){let n=e.tValue!==void 0?e.tValue:e.value;if(!n)return!1;if(typeof n=="function")try{n=n()}catch{return!1}if(!n)return!1;if(n instanceof Node)return n===t||n.contains(t);if(Array.isArray(n)){for(const o of n)if(o instanceof Node&&(o===t||o.contains(t)))return!0}return!1}function Dv(e,t,n,o){const r=[],i=new WeakSet;let s=0;function l(a){if(!(r.length>=n.maxComponents||s>=n.maxDepth||i.has(a))){if(i.add(a),a.component){const c=a.name||a.componentName;if(c&&typeof c=="string"){const d=c.replace(/^\[solid-refresh\]/,"");!Wl(d)&&f_(a,t)&&jl(d,s,n,o)&&r.push(d)}}if(s++,a.owned)for(const c of a.owned)c&&typeof c=="object"&&l(c);s--}}return l(e),r}function Fv(e){try{const t=e;if(t.__$owner&&typeof t.__$owner=="object")return t.__$owner;const n=Object.keys(e);for(const r of n)if(r.startsWith("__solid")||r.startsWith("__owner")||r.includes("owner")){const i=t[r];if(i&&typeof i=="object"){const s=i;if("name"in s||"componentName"in s||"owner"in s||"parent"in s)return s}}const o=Object.getOwnPropertySymbols(e);for(const r of o){const i=r.description||String(r);if(i.includes("solid")||i.includes("owner")||i.includes("SOLID")){const s=t[r];if(s&&typeof s=="object"){const l=s;if("name"in l||"componentName"in l||"owner"in l||"parent"in l)return l}}}}catch{}return null}function Nv(e){return e.componentName&&typeof e.componentName=="string"?e.componentName:e.name&&typeof e.name=="string"?e.name:null}function zv(e){return e.owner&&typeof e.owner=="object"?e.owner:e.parent&&typeof e.parent=="object"?e.parent:null}function Wl(e){return e.length<=2||e.length<=3&&e===e.toLowerCase()}function Hv(e,t){const n=Rv(t),o=n.mode==="all";if(o){const a=ds.get(e);if(a!==void 0)return a}if(!Bv()){const a={path:null,components:[]};return o&&ds.set(e,a),a}const r=n.mode==="smart"?Ev(e):void 0;let i=[];if(Bs)try{i=Dv(Bs,e,n,r)}catch{}if(i.length===0&&Ul.size>0)try{const a=[];for(const c of Ul)if(f_(c,e)){const d=c.name||c.componentName;if(d&&typeof d=="string"){const u=d.replace(/^\[solid-refresh\]/,"");if(!Wl(u)&&jl(u,0,n,r)){let _=0,m=c.owner;for(;m&&_<50;)_++,m=m.owner||m.parent;a.push({name:u,depth:_})}}}a.sort((c,d)=>c.depth-d.depth),i=a.slice(0,n.maxComponents).map(c=>c.name)}catch{}if(i.length===0)try{let a=Fv(e),c=0;for(;a&&c<n.maxDepth&&i.length<n.maxComponents;){const d=Nv(a);d&&!Wl(d)&&jl(d,c,n,r)&&i.push(d),a=zv(a),c++}}catch{}if(i.length===0){const a={path:null,components:[]};return o&&ds.set(e,a),a}const l={path:i.map(a=>`<${a}>`).join(" "),components:i};return o&&ds.set(e,l),l}var jv=`.styles-module__toolbar___wNsdK svg[fill=none],
.styles-module__markersLayer___-25j1 svg[fill=none],
.styles-module__fixedMarkersLayer___ffyX6 svg[fill=none] {
  fill: none !important;
}
.styles-module__toolbar___wNsdK svg[fill=none] :not([fill]),
.styles-module__markersLayer___-25j1 svg[fill=none] :not([fill]),
.styles-module__fixedMarkersLayer___ffyX6 svg[fill=none] :not([fill]) {
  fill: none !important;
}

.styles-module__controlsContent___9GJWU :where(button, input, select, textarea, label) {
  background: unset;
  border: unset;
  border-radius: unset;
  padding: unset;
  margin: unset;
  color: unset;
  font-family: unset;
  font-weight: unset;
  font-style: unset;
  line-height: unset;
  letter-spacing: unset;
  text-transform: unset;
  text-decoration: unset;
  box-shadow: unset;
  outline: unset;
}

@keyframes styles-module__toolbarEnter___u8RRu {
  from {
    opacity: 0;
    transform: scale(0.5) rotate(90deg);
  }
  to {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}
@keyframes styles-module__toolbarHide___y8kaT {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.8);
  }
}
@keyframes styles-module__badgeEnter___mVQLj {
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes styles-module__scaleIn___c-r1K {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes styles-module__scaleOut___Wctwz {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.85);
  }
}
@keyframes styles-module__slideUp___kgD36 {
  from {
    opacity: 0;
    transform: scale(0.85) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
@keyframes styles-module__slideDown___zcdje {
  from {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: scale(0.85) translateY(8px);
  }
}
@keyframes styles-module__fadeIn___b9qmf {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes styles-module__fadeOut___6Ut6- {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
@keyframes styles-module__hoverHighlightIn___6WYHY {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes styles-module__hoverTooltipIn___FYGQx {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(4px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
.styles-module__disableTransitions___EopxO :is(*, *::before, *::after) {
  transition: none !important;
}

.styles-module__toolbar___wNsdK {
  position: fixed;
  bottom: 1.25rem;
  right: 1.25rem;
  width: 337px;
  z-index: 100000;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  pointer-events: none;
  transition: left 0s, top 0s, right 0s, bottom 0s;
}

:where(.styles-module__toolbar___wNsdK) {
  bottom: 1.25rem;
  right: 1.25rem;
}

.styles-module__toolbarContainer___dIhma {
  position: relative;
  user-select: none;
  margin-left: auto;
  align-self: flex-end;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a1a1a;
  color: #fff;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(0, 0, 0, 0.1);
  pointer-events: auto;
  transition: width 0.4s cubic-bezier(0.19, 1, 0.22, 1), transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}
.styles-module__toolbarContainer___dIhma.styles-module__entrance___sgHd8 {
  animation: styles-module__toolbarEnter___u8RRu 0.5s cubic-bezier(0.34, 1.2, 0.64, 1) forwards;
}
.styles-module__toolbarContainer___dIhma.styles-module__hiding___1td44 {
  animation: styles-module__toolbarHide___y8kaT 0.4s cubic-bezier(0.4, 0, 1, 1) forwards;
  pointer-events: none;
}
.styles-module__toolbarContainer___dIhma.styles-module__collapsed___Rydsn {
  width: 44px;
  height: 44px;
  border-radius: 22px;
  padding: 0;
  cursor: pointer;
}
.styles-module__toolbarContainer___dIhma.styles-module__collapsed___Rydsn svg {
  margin-top: -1px;
}
.styles-module__toolbarContainer___dIhma.styles-module__collapsed___Rydsn:hover {
  background: #2a2a2a;
}
.styles-module__toolbarContainer___dIhma.styles-module__collapsed___Rydsn:active {
  transform: scale(0.95);
}
.styles-module__toolbarContainer___dIhma.styles-module__expanded___ofKPx {
  height: 44px;
  border-radius: 1.5rem;
  padding: 0.375rem;
  width: 297px;
}
.styles-module__toolbarContainer___dIhma.styles-module__expanded___ofKPx.styles-module__serverConnected___Gfbou {
  width: 337px;
}

.styles-module__toggleContent___0yfyP {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.1s cubic-bezier(0.19, 1, 0.22, 1);
}
.styles-module__toggleContent___0yfyP.styles-module__visible___KHwEW {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}
.styles-module__toggleContent___0yfyP.styles-module__hidden___Ae8H4 {
  opacity: 0;
  pointer-events: none;
}

.styles-module__controlsContent___9GJWU {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  transition: filter 0.8s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.8s cubic-bezier(0.19, 1, 0.22, 1), transform 0.6s cubic-bezier(0.19, 1, 0.22, 1);
}
.styles-module__controlsContent___9GJWU.styles-module__visible___KHwEW {
  opacity: 1;
  filter: blur(0px);
  transform: scale(1);
  visibility: visible;
  pointer-events: auto;
}
.styles-module__controlsContent___9GJWU.styles-module__hidden___Ae8H4 {
  pointer-events: none;
  opacity: 0;
  filter: blur(10px);
  transform: scale(0.4);
}

.styles-module__badge___2XsgF {
  position: absolute;
  top: -13px;
  right: -13px;
  user-select: none;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  background-color: var(--agentation-color-accent);
  color: white;
  font-size: 0.625rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 0.04);
  opacity: 1;
  transition: transform 0.3s ease, opacity 0.2s ease;
  transform: scale(1);
}
.styles-module__badge___2XsgF.styles-module__fadeOut___6Ut6- {
  opacity: 0;
  transform: scale(0);
  pointer-events: none;
}
.styles-module__badge___2XsgF.styles-module__entrance___sgHd8 {
  animation: styles-module__badgeEnter___mVQLj 0.3s cubic-bezier(0.34, 1.2, 0.64, 1) 0.4s both;
}

.styles-module__controlButton___8Q0jc {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.85);
  transition: background-color 0.15s ease, color 0.15s ease, transform 0.1s ease, opacity 0.2s ease;
}
.styles-module__controlButton___8Q0jc:hover:not(:disabled):not([data-active=true]):not([data-failed=true]):not([data-auto-sync=true]):not([data-error=true]):not([data-no-hover=true]) {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}
.styles-module__controlButton___8Q0jc:active:not(:disabled) {
  transform: scale(0.92);
}
.styles-module__controlButton___8Q0jc:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.styles-module__controlButton___8Q0jc[data-active=true] {
  color: var(--agentation-color-blue);
  background-color: color-mix(in srgb, var(--agentation-color-blue) 25%, transparent);
}
.styles-module__controlButton___8Q0jc[data-error=true] {
  color: var(--agentation-color-red);
  background-color: color-mix(in srgb, var(--agentation-color-red) 25%, transparent);
}
.styles-module__controlButton___8Q0jc[data-danger]:hover:not(:disabled):not([data-active=true]):not([data-failed=true]) {
  background-color: color-mix(in srgb, var(--agentation-color-red) 25%, transparent);
  color: var(--agentation-color-red);
}
.styles-module__controlButton___8Q0jc[data-no-hover=true], .styles-module__controlButton___8Q0jc.styles-module__statusShowing___te6iu {
  cursor: default;
  pointer-events: none;
  background: transparent !important;
}
.styles-module__controlButton___8Q0jc[data-auto-sync=true] {
  color: var(--agentation-color-green);
  background: transparent;
  cursor: default;
}
.styles-module__controlButton___8Q0jc[data-failed=true] {
  color: var(--agentation-color-red);
  background-color: color-mix(in srgb, var(--agentation-color-red) 25%, transparent);
}

.styles-module__buttonBadge___NeFWb {
  position: absolute;
  top: 0px;
  right: 0px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 8px;
  background-color: var(--agentation-color-accent);
  color: white;
  font-size: 0.625rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 2px #1a1a1a, 0 1px 3px rgba(0, 0, 0, 0.2);
  pointer-events: none;
}
[data-agentation-theme=light] .styles-module__buttonBadge___NeFWb {
  box-shadow: 0 0 0 2px #fff, 0 1px 3px rgba(0, 0, 0, 0.2);
}

@keyframes styles-module__mcpIndicatorPulseConnected___EDodZ {
  0%, 100% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--agentation-color-green) 50%, transparent);
  }
  50% {
    box-shadow: 0 0 0 5px color-mix(in srgb, var(--agentation-color-green) 0%, transparent);
  }
}
@keyframes styles-module__mcpIndicatorPulseConnecting___cCYte {
  0%, 100% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--agentation-color-yellow) 50%, transparent);
  }
  50% {
    box-shadow: 0 0 0 5px color-mix(in srgb, var(--agentation-color-yellow) 0%, transparent);
  }
}
.styles-module__mcpIndicator___zGJeL {
  position: absolute;
  top: 3px;
  right: 3px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  pointer-events: none;
  transition: background-color 0.3s ease, opacity 0.15s ease, transform 0.15s ease;
  opacity: 1;
  transform: scale(1);
}
.styles-module__mcpIndicator___zGJeL.styles-module__connected___7c28g {
  background-color: var(--agentation-color-green);
  animation: styles-module__mcpIndicatorPulseConnected___EDodZ 2.5s ease-in-out infinite;
}
.styles-module__mcpIndicator___zGJeL.styles-module__connecting___uo-CW {
  background-color: var(--agentation-color-yellow);
  animation: styles-module__mcpIndicatorPulseConnecting___cCYte 1.5s ease-in-out infinite;
}
.styles-module__mcpIndicator___zGJeL.styles-module__hidden___Ae8H4 {
  opacity: 0;
  transform: scale(0);
  animation: none;
}

@keyframes styles-module__connectionPulse___-Zycw {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(0.9);
  }
}
.styles-module__connectionIndicatorWrapper___L-e-3 {
  width: 8px;
  height: 34px;
  margin-left: 6px;
  margin-right: 6px;
}

.styles-module__connectionIndicator___afk9p {
  position: relative;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease, background-color 0.3s ease;
  cursor: default;
}

.styles-module__connectionIndicatorVisible___C-i5B {
  opacity: 1;
}

.styles-module__connectionIndicatorConnected___IY8pR {
  background-color: var(--agentation-color-green);
  animation: styles-module__connectionPulse___-Zycw 2.5s ease-in-out infinite;
}

.styles-module__connectionIndicatorDisconnected___kmpaZ {
  background-color: var(--agentation-color-red);
  animation: none;
}

.styles-module__connectionIndicatorConnecting___QmSLH {
  background-color: var(--agentation-color-yellow);
  animation: styles-module__connectionPulse___-Zycw 1s ease-in-out infinite;
}

.styles-module__buttonWrapper___rBcdv {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.styles-module__buttonWrapper___rBcdv:hover .styles-module__buttonTooltip___Burd9 {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) scale(1);
  transition-delay: 0.85s;
}
.styles-module__buttonWrapper___rBcdv:has(.styles-module__controlButton___8Q0jc:disabled):hover .styles-module__buttonTooltip___Burd9 {
  opacity: 0;
  visibility: hidden;
}

.styles-module__tooltipsInSession___-0lHH .styles-module__buttonWrapper___rBcdv:hover .styles-module__buttonTooltip___Burd9 {
  transition-delay: 0s;
}

.styles-module__sendButtonWrapper___UUxG6 {
  width: 0;
  opacity: 0;
  overflow: hidden;
  pointer-events: none;
  margin-left: -0.375rem;
  transition: width 0.4s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.3s cubic-bezier(0.19, 1, 0.22, 1), margin 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}
.styles-module__sendButtonWrapper___UUxG6 .styles-module__controlButton___8Q0jc {
  transform: scale(0.8);
  transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}
.styles-module__sendButtonWrapper___UUxG6.styles-module__sendButtonVisible___WPSQU {
  width: 34px;
  opacity: 1;
  overflow: visible;
  pointer-events: auto;
  margin-left: 0;
}
.styles-module__sendButtonWrapper___UUxG6.styles-module__sendButtonVisible___WPSQU .styles-module__controlButton___8Q0jc {
  transform: scale(1);
}

.styles-module__buttonTooltip___Burd9 {
  position: absolute;
  bottom: calc(100% + 14px);
  left: 50%;
  transform: translateX(-50%) scale(0.95);
  padding: 6px 10px;
  background: #1a1a1a;
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
  font-weight: 500;
  border-radius: 8px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  z-index: 100001;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: opacity 0.135s ease, transform 0.135s ease, visibility 0.135s ease;
}
.styles-module__buttonTooltip___Burd9::after {
  content: "";
  position: absolute;
  top: calc(100% - 4px);
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 8px;
  height: 8px;
  background: #1a1a1a;
  border-radius: 0 0 2px 0;
}

.styles-module__shortcut___lEAQk {
  margin-left: 4px;
  opacity: 0.5;
}

.styles-module__tooltipBelow___m6ats .styles-module__buttonTooltip___Burd9 {
  bottom: auto;
  top: calc(100% + 14px);
  transform: translateX(-50%) scale(0.95);
}
.styles-module__tooltipBelow___m6ats .styles-module__buttonTooltip___Burd9::after {
  top: -4px;
  bottom: auto;
  border-radius: 2px 0 0 0;
}

.styles-module__tooltipBelow___m6ats .styles-module__buttonWrapper___rBcdv:hover .styles-module__buttonTooltip___Burd9 {
  transform: translateX(-50%) scale(1);
}

.styles-module__tooltipsHidden___VtLJG .styles-module__buttonTooltip___Burd9 {
  opacity: 0 !important;
  visibility: hidden !important;
  transition: none !important;
}

.styles-module__tooltipVisible___0jcCv,
.styles-module__tooltipsHidden___VtLJG .styles-module__tooltipVisible___0jcCv {
  opacity: 1 !important;
  visibility: visible !important;
  transform: translateX(-50%) scale(1) !important;
  transition-delay: 0s !important;
}

.styles-module__buttonWrapperAlignLeft___myzIp .styles-module__buttonTooltip___Burd9 {
  left: 50%;
  transform: translateX(-12px) scale(0.95);
}
.styles-module__buttonWrapperAlignLeft___myzIp .styles-module__buttonTooltip___Burd9::after {
  left: 16px;
}
.styles-module__buttonWrapperAlignLeft___myzIp:hover .styles-module__buttonTooltip___Burd9 {
  transform: translateX(-12px) scale(1);
}

.styles-module__tooltipBelow___m6ats .styles-module__buttonWrapperAlignLeft___myzIp .styles-module__buttonTooltip___Burd9 {
  transform: translateX(-12px) scale(0.95);
}
.styles-module__tooltipBelow___m6ats .styles-module__buttonWrapperAlignLeft___myzIp:hover .styles-module__buttonTooltip___Burd9 {
  transform: translateX(-12px) scale(1);
}

.styles-module__buttonWrapperAlignRight___HCQFR .styles-module__buttonTooltip___Burd9 {
  left: 50%;
  transform: translateX(calc(-100% + 12px)) scale(0.95);
}
.styles-module__buttonWrapperAlignRight___HCQFR .styles-module__buttonTooltip___Burd9::after {
  left: auto;
  right: 8px;
}
.styles-module__buttonWrapperAlignRight___HCQFR:hover .styles-module__buttonTooltip___Burd9 {
  transform: translateX(calc(-100% + 12px)) scale(1);
}

.styles-module__tooltipBelow___m6ats .styles-module__buttonWrapperAlignRight___HCQFR .styles-module__buttonTooltip___Burd9 {
  transform: translateX(calc(-100% + 12px)) scale(0.95);
}
.styles-module__tooltipBelow___m6ats .styles-module__buttonWrapperAlignRight___HCQFR:hover .styles-module__buttonTooltip___Burd9 {
  transform: translateX(calc(-100% + 12px)) scale(1);
}

.styles-module__divider___c--s1 {
  width: 1px;
  height: 12px;
  background: rgba(255, 255, 255, 0.15);
  margin: 0 0.125rem;
}

.styles-module__overlay___Q1O9y {
  position: fixed;
  inset: 0;
  z-index: 99997;
  pointer-events: none;
}
.styles-module__overlay___Q1O9y > * {
  pointer-events: auto;
}

.styles-module__hoverHighlight___ogakW {
  position: fixed;
  border: 2px solid color-mix(in srgb, var(--agentation-color-accent) 50%, transparent);
  border-radius: 4px;
  background-color: color-mix(in srgb, var(--agentation-color-accent) 4%, transparent);
  pointer-events: none !important;
  box-sizing: border-box;
  will-change: opacity;
  contain: layout style;
}
.styles-module__hoverHighlight___ogakW.styles-module__enter___WFIki {
  animation: styles-module__hoverHighlightIn___6WYHY 0.12s ease-out forwards;
}

.styles-module__multiSelectOutline___cSJ-m {
  position: fixed;
  border: 2px dashed color-mix(in srgb, var(--agentation-color-green) 60%, transparent);
  border-radius: 4px;
  pointer-events: none !important;
  background-color: color-mix(in srgb, var(--agentation-color-green) 5%, transparent);
  box-sizing: border-box;
  will-change: opacity;
}
.styles-module__multiSelectOutline___cSJ-m.styles-module__enter___WFIki {
  animation: styles-module__fadeIn___b9qmf 0.15s ease-out forwards;
}
.styles-module__multiSelectOutline___cSJ-m.styles-module__exit___fyOJ0 {
  animation: styles-module__fadeOut___6Ut6- 0.15s ease-out forwards;
}

.styles-module__singleSelectOutline___QhX-O {
  position: fixed;
  border: 2px solid color-mix(in srgb, var(--agentation-color-blue) 60%, transparent);
  border-radius: 4px;
  pointer-events: none !important;
  background-color: color-mix(in srgb, var(--agentation-color-blue) 5%, transparent);
  box-sizing: border-box;
  will-change: opacity;
}
.styles-module__singleSelectOutline___QhX-O.styles-module__enter___WFIki {
  animation: styles-module__fadeIn___b9qmf 0.15s ease-out forwards;
}
.styles-module__singleSelectOutline___QhX-O.styles-module__exit___fyOJ0 {
  animation: styles-module__fadeOut___6Ut6- 0.15s ease-out forwards;
}

.styles-module__hoverTooltip___bvLk7 {
  position: fixed;
  font-size: 0.6875rem;
  font-weight: 500;
  color: #fff;
  background: rgba(0, 0, 0, 0.85);
  padding: 0.35rem 0.6rem;
  border-radius: 0.375rem;
  pointer-events: none !important;
  white-space: nowrap;
  max-width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.styles-module__hoverTooltip___bvLk7.styles-module__enter___WFIki {
  animation: styles-module__hoverTooltipIn___FYGQx 0.1s ease-out forwards;
}

.styles-module__hoverReactPath___gx1IJ {
  font-size: 0.625rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.15rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

.styles-module__hoverElementName___QMLMl {
  overflow: hidden;
  text-overflow: ellipsis;
}

.styles-module__markersLayer___-25j1 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 0;
  z-index: 99998;
  pointer-events: none;
}
.styles-module__markersLayer___-25j1 > * {
  pointer-events: auto;
}

.styles-module__fixedMarkersLayer___ffyX6 {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99998;
  pointer-events: none;
}
.styles-module__fixedMarkersLayer___ffyX6 > * {
  pointer-events: auto;
}

.styles-module__drawCanvas___7cG9U {
  position: fixed;
  inset: 0;
  z-index: 99996;
  pointer-events: none !important;
}
.styles-module__drawCanvas___7cG9U.styles-module__active___-zoN6 {
  pointer-events: auto !important;
  cursor: crosshair !important;
}
.styles-module__drawCanvas___7cG9U.styles-module__active___-zoN6[data-stroke-hover] {
  cursor: pointer !important;
}

.styles-module__dragSelection___kZLq2 {
  position: fixed;
  top: 0;
  left: 0;
  border: 2px solid color-mix(in srgb, var(--agentation-color-green) 60%, transparent);
  border-radius: 4px;
  background-color: color-mix(in srgb, var(--agentation-color-green) 8%, transparent);
  pointer-events: none;
  z-index: 99997;
  will-change: transform, width, height;
  contain: layout style;
}

.styles-module__dragCount___KM90j {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--agentation-color-green);
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  min-width: 1.5rem;
  text-align: center;
}

.styles-module__highlightsContainer___-0xzG {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 99996;
}

.styles-module__selectedElementHighlight___fyVlI {
  position: fixed;
  top: 0;
  left: 0;
  border: 2px solid color-mix(in srgb, var(--agentation-color-green) 50%, transparent);
  border-radius: 4px;
  background: color-mix(in srgb, var(--agentation-color-green) 6%, transparent);
  pointer-events: none;
  will-change: transform, width, height;
  contain: layout style;
}

[data-agentation-theme=light] .styles-module__toolbarContainer___dIhma {
  background: #fff;
  color: rgba(0, 0, 0, 0.85);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04);
}
[data-agentation-theme=light] .styles-module__toolbarContainer___dIhma.styles-module__collapsed___Rydsn:hover {
  background: #f5f5f5;
}
[data-agentation-theme=light] .styles-module__controlButton___8Q0jc {
  color: rgba(0, 0, 0, 0.5);
}
[data-agentation-theme=light] .styles-module__controlButton___8Q0jc:hover:not(:disabled):not([data-active=true]):not([data-failed=true]):not([data-auto-sync=true]):not([data-error=true]):not([data-no-hover=true]) {
  background: rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.85);
}
[data-agentation-theme=light] .styles-module__controlButton___8Q0jc[data-active=true] {
  color: var(--agentation-color-blue);
  background: color-mix(in srgb, var(--agentation-color-blue) 15%, transparent);
}
[data-agentation-theme=light] .styles-module__controlButton___8Q0jc[data-error=true] {
  color: var(--agentation-color-red);
  background: color-mix(in srgb, var(--agentation-color-red) 15%, transparent);
}
[data-agentation-theme=light] .styles-module__controlButton___8Q0jc[data-danger]:hover:not(:disabled):not([data-active=true]):not([data-failed=true]) {
  color: var(--agentation-color-red);
  background: color-mix(in srgb, var(--agentation-color-red) 15%, transparent);
}
[data-agentation-theme=light] .styles-module__controlButton___8Q0jc[data-auto-sync=true] {
  color: var(--agentation-color-green);
  background: transparent;
}
[data-agentation-theme=light] .styles-module__controlButton___8Q0jc[data-failed=true] {
  color: var(--agentation-color-red);
  background: color-mix(in srgb, var(--agentation-color-red) 15%, transparent);
}
[data-agentation-theme=light] .styles-module__buttonTooltip___Burd9 {
  background: #fff;
  color: rgba(0, 0, 0, 0.85);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04);
}
[data-agentation-theme=light] .styles-module__buttonTooltip___Burd9::after {
  background: #fff;
}
[data-agentation-theme=light] .styles-module__divider___c--s1 {
  background: rgba(0, 0, 0, 0.1);
}`,Uv={toolbar:"styles-module__toolbar___wNsdK",markersLayer:"styles-module__markersLayer___-25j1",fixedMarkersLayer:"styles-module__fixedMarkersLayer___ffyX6",controlsContent:"styles-module__controlsContent___9GJWU",disableTransitions:"styles-module__disableTransitions___EopxO",toolbarContainer:"styles-module__toolbarContainer___dIhma",entrance:"styles-module__entrance___sgHd8",toolbarEnter:"styles-module__toolbarEnter___u8RRu",hiding:"styles-module__hiding___1td44",toolbarHide:"styles-module__toolbarHide___y8kaT",collapsed:"styles-module__collapsed___Rydsn",expanded:"styles-module__expanded___ofKPx",serverConnected:"styles-module__serverConnected___Gfbou",toggleContent:"styles-module__toggleContent___0yfyP",visible:"styles-module__visible___KHwEW",hidden:"styles-module__hidden___Ae8H4",badge:"styles-module__badge___2XsgF",fadeOut:"styles-module__fadeOut___6Ut6-",badgeEnter:"styles-module__badgeEnter___mVQLj",controlButton:"styles-module__controlButton___8Q0jc",statusShowing:"styles-module__statusShowing___te6iu",buttonBadge:"styles-module__buttonBadge___NeFWb",mcpIndicator:"styles-module__mcpIndicator___zGJeL",connected:"styles-module__connected___7c28g",mcpIndicatorPulseConnected:"styles-module__mcpIndicatorPulseConnected___EDodZ",connecting:"styles-module__connecting___uo-CW",mcpIndicatorPulseConnecting:"styles-module__mcpIndicatorPulseConnecting___cCYte",connectionIndicatorWrapper:"styles-module__connectionIndicatorWrapper___L-e-3",connectionIndicator:"styles-module__connectionIndicator___afk9p",connectionIndicatorVisible:"styles-module__connectionIndicatorVisible___C-i5B",connectionIndicatorConnected:"styles-module__connectionIndicatorConnected___IY8pR",connectionPulse:"styles-module__connectionPulse___-Zycw",connectionIndicatorDisconnected:"styles-module__connectionIndicatorDisconnected___kmpaZ",connectionIndicatorConnecting:"styles-module__connectionIndicatorConnecting___QmSLH",buttonWrapper:"styles-module__buttonWrapper___rBcdv",buttonTooltip:"styles-module__buttonTooltip___Burd9",tooltipsInSession:"styles-module__tooltipsInSession___-0lHH",sendButtonWrapper:"styles-module__sendButtonWrapper___UUxG6",sendButtonVisible:"styles-module__sendButtonVisible___WPSQU",shortcut:"styles-module__shortcut___lEAQk",tooltipBelow:"styles-module__tooltipBelow___m6ats",tooltipsHidden:"styles-module__tooltipsHidden___VtLJG",tooltipVisible:"styles-module__tooltipVisible___0jcCv",buttonWrapperAlignLeft:"styles-module__buttonWrapperAlignLeft___myzIp",buttonWrapperAlignRight:"styles-module__buttonWrapperAlignRight___HCQFR",divider:"styles-module__divider___c--s1",overlay:"styles-module__overlay___Q1O9y",hoverHighlight:"styles-module__hoverHighlight___ogakW",enter:"styles-module__enter___WFIki",hoverHighlightIn:"styles-module__hoverHighlightIn___6WYHY",multiSelectOutline:"styles-module__multiSelectOutline___cSJ-m",fadeIn:"styles-module__fadeIn___b9qmf",exit:"styles-module__exit___fyOJ0",singleSelectOutline:"styles-module__singleSelectOutline___QhX-O",hoverTooltip:"styles-module__hoverTooltip___bvLk7",hoverTooltipIn:"styles-module__hoverTooltipIn___FYGQx",hoverReactPath:"styles-module__hoverReactPath___gx1IJ",hoverElementName:"styles-module__hoverElementName___QMLMl",drawCanvas:"styles-module__drawCanvas___7cG9U",active:"styles-module__active___-zoN6",dragSelection:"styles-module__dragSelection___kZLq2",dragCount:"styles-module__dragCount___KM90j",highlightsContainer:"styles-module__highlightsContainer___-0xzG",selectedElementHighlight:"styles-module__selectedElementHighlight___fyVlI",scaleIn:"styles-module__scaleIn___c-r1K",scaleOut:"styles-module__scaleOut___Wctwz",slideUp:"styles-module__slideUp___kgD36",slideDown:"styles-module__slideDown___zcdje"};if(typeof document<"u"){let e=document.getElementById("feedback-tool-styles-page-toolbar-css-styles");e||(e=document.createElement("style"),e.id="feedback-tool-styles-page-toolbar-css-styles",e.textContent=jv,document.head.appendChild(e))}var ne=Uv,_i=[{value:"compact",label:"Compact"},{value:"standard",label:"Standard"},{value:"detailed",label:"Detailed"},{value:"forensic",label:"Forensic"}];function vd(e,t,n="standard"){if(e.length===0)return"";const o=typeof window<"u"?`${window.innerWidth}×${window.innerHeight}`:"unknown";let r=`## Page Feedback: ${t}
`;return n==="forensic"?(r+=`
**Environment:**
`,r+=`- Viewport: ${o}
`,typeof window<"u"&&(r+=`- URL: ${window.location.href}
`,r+=`- User Agent: ${navigator.userAgent}
`,r+=`- Timestamp: ${new Date().toISOString()}
`,r+=`- Device Pixel Ratio: ${window.devicePixelRatio}
`),r+=`
---
`):n!=="compact"&&(r+=`**Viewport:** ${o}
`),r+=`
`,e.forEach((i,s)=>{const l=i.reactComponents||i.element,a=i.reactComponents?`${i.reactComponents} > ${i.elementPath}`:i.elementPath;n==="compact"?(r+=`${s+1}. **${l}**${i.sourceFile?` (${i.sourceFile})`:""}: ${i.comment}`,i.selectedText&&(r+=` (re: "${i.selectedText.slice(0,30)}${i.selectedText.length>30?"...":""}")`),r+=`
`):n==="forensic"?(r+=`### ${s+1}. ${l}
`,i.isMultiSelect&&i.fullPath&&(r+=`*Forensic data shown for first element of selection*
`),i.fullPath&&(r+=`**Full DOM Path:** ${i.fullPath}
`),i.cssClasses&&(r+=`**CSS Classes:** ${i.cssClasses}
`),i.boundingBox&&(r+=`**Position:** x:${Math.round(i.boundingBox.x)}, y:${Math.round(i.boundingBox.y)} (${Math.round(i.boundingBox.width)}×${Math.round(i.boundingBox.height)}px)
`),r+=`**Annotation at:** ${i.x.toFixed(1)}% from left, ${Math.round(i.y)}px from top
`,i.selectedText&&(r+=`**Selected text:** "${i.selectedText}"
`),i.nearbyText&&!i.selectedText&&(r+=`**Context:** ${i.nearbyText.slice(0,100)}
`),i.computedStyles&&(r+=`**Computed Styles:** ${i.computedStyles}
`),i.accessibility&&(r+=`**Accessibility:** ${i.accessibility}
`),i.nearbyElements&&(r+=`**Nearby Elements:** ${i.nearbyElements}
`),i.sourceFile&&(r+=`**Source:** ${i.sourceFile}
`),r+=`**Feedback:** ${i.comment}

`):(r+=`### ${s+1}. ${l}
`,r+=`**Location:** ${a}
`,i.sourceFile&&(r+=`**Source:** ${i.sourceFile}
`),n==="detailed"&&(i.cssClasses&&(r+=`**Classes:** ${i.cssClasses}
`),i.boundingBox&&(r+=`**Position:** ${Math.round(i.boundingBox.x)}px, ${Math.round(i.boundingBox.y)}px (${Math.round(i.boundingBox.width)}×${Math.round(i.boundingBox.height)}px)
`)),i.selectedText&&(r+=`**Selected text:** "${i.selectedText}"
`),n==="detailed"&&i.nearbyText&&!i.selectedText&&(r+=`**Context:** ${i.nearbyText.slice(0,100)}
`),r+=`**Feedback:** ${i.comment}

`)}),r.trim()}var Wv=`@keyframes styles-module__markerIn___x4G8D {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.3);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
@keyframes styles-module__markerOut___6VhQN {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.3);
  }
}
@keyframes styles-module__tooltipIn___aJslQ {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(2px) scale(0.891);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(0.909);
  }
}
@keyframes styles-module__renumberRoll___akV9B {
  0% {
    transform: translateX(-40%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
.styles-module__marker___9CKF7 {
  position: absolute;
  width: 22px;
  height: 22px;
  background: var(--agentation-color-blue);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6875rem;
  font-weight: 600;
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(0, 0, 0, 0.04);
  user-select: none;
  will-change: transform, opacity;
  contain: layout style;
  z-index: 1;
}
.styles-module__marker___9CKF7:hover {
  z-index: 2;
}
.styles-module__marker___9CKF7:not(.styles-module__enter___8kI3q):not(.styles-module__exit___KBdR3):not(.styles-module__clearing___8rM7K) {
  transition: background-color 0.15s ease, transform 0.1s ease;
}
.styles-module__marker___9CKF7.styles-module__enter___8kI3q {
  animation: styles-module__markerIn___x4G8D 0.25s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.styles-module__marker___9CKF7.styles-module__exit___KBdR3 {
  animation: styles-module__markerOut___6VhQN 0.2s ease-out both;
  pointer-events: none;
}
.styles-module__marker___9CKF7.styles-module__clearing___8rM7K {
  animation: styles-module__markerOut___6VhQN 0.15s ease-out both;
  pointer-events: none;
}
.styles-module__marker___9CKF7:not(.styles-module__enter___8kI3q):not(.styles-module__exit___KBdR3):not(.styles-module__clearing___8rM7K):hover {
  transform: translate(-50%, -50%) scale(1.1);
}
.styles-module__marker___9CKF7.styles-module__pending___BiY-U {
  position: fixed;
  background-color: var(--agentation-color-blue);
  cursor: default;
}
.styles-module__marker___9CKF7.styles-module__fixed___aKrQO {
  position: fixed;
}
.styles-module__marker___9CKF7.styles-module__multiSelect___CPfTC {
  background-color: var(--agentation-color-green);
  width: 26px;
  height: 26px;
  border-radius: 6px;
  font-size: 0.75rem;
}
.styles-module__marker___9CKF7.styles-module__multiSelect___CPfTC.styles-module__pending___BiY-U {
  background-color: var(--agentation-color-green);
}
.styles-module__marker___9CKF7.styles-module__hovered___-mg2N {
  background-color: var(--agentation-color-red);
}

.styles-module__renumber___16lvD {
  display: block;
  animation: styles-module__renumberRoll___akV9B 0.2s ease-out;
}

.styles-module__markerTooltip___-VUm- {
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%) scale(0.909);
  z-index: 100002;
  background: #1a1a1a;
  padding: 8px 0.75rem;
  border-radius: 0.75rem;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-weight: 400;
  color: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.08);
  min-width: 120px;
  max-width: 200px;
  pointer-events: none;
  cursor: default;
}
.styles-module__markerTooltip___-VUm-.styles-module__enter___8kI3q {
  animation: styles-module__tooltipIn___aJslQ 0.1s ease-out forwards;
}

.styles-module__markerQuote___tQake {
  display: block;
  font-size: 12px;
  font-style: italic;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.3125rem;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.styles-module__markerNote___Rh4eI {
  display: block;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.4;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-bottom: 2px;
}

[data-agentation-theme=light] .styles-module__markerTooltip___-VUm- {
  background: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.06);
}
[data-agentation-theme=light] .styles-module__markerTooltip___-VUm- .styles-module__markerQuote___tQake {
  color: rgba(0, 0, 0, 0.5);
}
[data-agentation-theme=light] .styles-module__markerTooltip___-VUm- .styles-module__markerNote___Rh4eI {
  color: rgba(0, 0, 0, 0.85);
}`,Yv={marker:"styles-module__marker___9CKF7",enter:"styles-module__enter___8kI3q",exit:"styles-module__exit___KBdR3",clearing:"styles-module__clearing___8rM7K",pending:"styles-module__pending___BiY-U",fixed:"styles-module__fixed___aKrQO",multiSelect:"styles-module__multiSelect___CPfTC",hovered:"styles-module__hovered___-mg2N",renumber:"styles-module__renumber___16lvD",markerTooltip:"styles-module__markerTooltip___-VUm-",markerQuote:"styles-module__markerQuote___tQake",markerNote:"styles-module__markerNote___Rh4eI"};if(typeof document<"u"){let e=document.getElementById("feedback-tool-styles-annotation-marker-styles");e||(e=document.createElement("style"),e.id="feedback-tool-styles-annotation-marker-styles",e.textContent=Wv,document.head.appendChild(e))}var tn=Yv;function wd(e){const t=()=>(e.isHovered||e.isDeleting)&&!e.isEditingAny,n=()=>t()&&e.markerClickBehavior==="delete",o=()=>e.annotation.isMultiSelect,r=()=>o()?"var(--agentation-color-green)":"var(--agentation-color-accent)",i=()=>e.isExiting?tn.exit:e.isClearing?tn.clearing:e.isAnimated?"":tn.enter,s=()=>e.isExiting?`${(e.layerSize-1-e.layerIndex)*20}ms`:`${e.layerIndex*20}ms`;return(()=>{var l=b(Fb),a=l.firstChild,[c,d]=S(a.nextSibling),u=c.nextSibling,[_,m]=S(u.nextSibling);return Br(l,"contextmenu",e.onContextMenu?g=>{e.markerClickBehavior==="delete"&&(g.preventDefault(),g.stopPropagation(),e.isExiting||e.onContextMenu(e.annotation))}:void 0,!0),l.$$click=g=>{g.stopPropagation(),e.isExiting||e.onClick(e.annotation)},Br(l,"mouseleave",e.onHoverLeave),l.addEventListener("mouseenter",()=>e.onHoverEnter(e.annotation)),y(l,h(Oe,{get when(){return t()},get fallback(){return(()=>{var g=b(xo);return y(g,()=>e.globalIndex+1),ie(()=>M(g,e.renumberFrom!==null&&e.globalIndex>=e.renumberFrom?tn.renumber:void 0)),g})()},get children(){return h(Oe,{get when(){return n()},get fallback(){return h(f5,{size:16})},get children(){return h(Ju,{get size(){return o()?18:16}})}})}}),c,d),y(l,h(Oe,{get when(){return lt(()=>!!e.isHovered)()&&!e.isEditingAny},get children(){var g=b(Db),v=g.firstChild,f=v.firstChild,[p,k]=S(f.nextSibling),P=p.nextSibling,[R,A]=S(P.nextSibling),ee=v.nextSibling;return y(v,()=>e.annotation.element,p,k),y(v,(()=>{var D=lt(()=>!!e.annotation.selectedText);return()=>D()&&` "${e.annotation.selectedText.slice(0,30)}${e.annotation.selectedText.length>30?"...":""}"`})(),R,A),y(ee,()=>e.annotation.comment),ie(D=>{var K=`${tn.markerTooltip} ${tn.enter}`,te=e.tooltipStyle,me=tn.markerQuote,j=tn.markerNote;return K!==D.e&&M(g,D.e=K),D.t=gn(g,te,D.t),me!==D.a&&M(v,D.a=me),j!==D.o&&M(ee,D.o=j),D},{e:void 0,t:void 0,a:void 0,o:void 0}),g}}),_,m),ie(g=>{var v=`${tn.marker} ${o()?tn.multiSelect:""} ${i()} ${n()?tn.hovered:""}`,f=`${e.annotation.x}%`,p=`${e.annotation.y}px`,k=n()?void 0:r(),P=s();return v!==g.e&&M(l,g.e=v),f!==g.t&&E(l,"left",g.t=f),p!==g.a&&E(l,"top",g.a=p),k!==g.o&&E(l,"background-color",g.o=k),P!==g.i&&E(l,"animation-delay",g.i=P),g},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0}),Ft(),l})()}function Vv(e){return(()=>{var t=b(sn);return y(t,h(n5,{size:12})),ie(n=>{var o=`${tn.marker} ${tn.pending} ${e.isMultiSelect?tn.multiSelect:""} ${e.isExiting?tn.exit:tn.enter}`,r=`${e.x}%`,i=`${e.y}px`,s=e.isMultiSelect?"var(--agentation-color-green)":"var(--agentation-color-accent)";return o!==n.e&&M(t,n.e=o),r!==n.t&&E(t,"left",n.t=r),i!==n.a&&E(t,"top",n.a=i),s!==n.o&&E(t,"background-color",n.o=s),n},{e:void 0,t:void 0,a:void 0,o:void 0}),t})()}function $d(e){const t=()=>e.annotation.isMultiSelect;return(()=>{var n=b(Nb);return y(n,h(Ju,{get size(){return t()?12:10}})),ie(o=>{var r=`${tn.marker} ${e.fixed?tn.fixed:""} ${tn.hovered} ${t()?tn.multiSelect:""} ${tn.exit}`,i=`${e.annotation.x}%`,s=`${e.annotation.y}px`;return r!==o.e&&M(n,o.e=r),i!==o.t&&E(n,"left",o.t=i),s!==o.a&&E(n,"top",o.a=s),o},{e:void 0,t:void 0,a:void 0}),n})()}var Xv=`.styles-module__switchContainer___Ka-AB {
  display: flex;
  align-items: center;
  position: relative;
  padding: 2px;
  width: 24px;
  height: 16px;
  border-radius: 8px;
  background-color: #cdcdcd;
  transition: background-color 0.15s, opacity 0.15s;
}
[data-agentation-theme=dark] .styles-module__switchContainer___Ka-AB {
  background-color: #484848;
}
.styles-module__switchContainer___Ka-AB:has(.styles-module__switchInput___kYDSD:checked) {
  background-color: var(--agentation-color-blue);
}
.styles-module__switchContainer___Ka-AB:has(.styles-module__switchInput___kYDSD:disabled) {
  opacity: 0.3;
}

.styles-module__switchInput___kYDSD {
  position: absolute;
  z-index: 1;
  inset: 0;
  border-radius: inherit;
  opacity: 0;
  cursor: pointer;
}
.styles-module__switchInput___kYDSD:disabled {
  cursor: not-allowed;
}

.styles-module__switchThumb___4sCPH {
  border-radius: 50%;
  width: 12px;
  height: 12px;
  background-color: #fff;
  transition: transform 0.15s;
}
.styles-module__switchContainer___Ka-AB:has(.styles-module__switchInput___kYDSD:checked) .styles-module__switchThumb___4sCPH {
  transform: translateX(8px);
}`,qv={switchContainer:"styles-module__switchContainer___Ka-AB",switchInput:"styles-module__switchInput___kYDSD",switchThumb:"styles-module__switchThumb___4sCPH"};if(typeof document<"u"){let e=document.getElementById("feedback-tool-styles-switch-styles");e||(e=document.createElement("style"),e.id="feedback-tool-styles-switch-styles",e.textContent=Xv,document.head.appendChild(e))}var vl=qv,wl=e=>{const[t,n]=Jn(e,["class"]);return(()=>{var o=b(zb),r=o.firstChild,i=r.nextSibling;return bo(r,vn({get class(){return vl.switchInput}},n),!1,!1),ie(s=>{var l=`${vl.switchContainer} ${t.class??""}`,a=vl.switchThumb;return l!==s.e&&M(o,s.e=l),a!==s.t&&M(i,s.t=a),s},{e:void 0,t:void 0}),Ft(),o})()},Qv=`.styles-module__checkboxContainer___joqZk {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: 1px solid rgba(26, 26, 26, 0.2);
  border-radius: 4px;
  width: 14px;
  height: 14px;
  background-color: #fff;
  transition: background-color 0.2s ease;
}
[data-agentation-theme=dark] .styles-module__checkboxContainer___joqZk {
  border-color: rgba(255, 255, 255, 0.2);
  background-color: #252525;
}
.styles-module__checkboxContainer___joqZk:has(.styles-module__checkboxInput___ECzzO:checked) {
  background-color: #1a1a1a;
}
[data-agentation-theme=dark] .styles-module__checkboxContainer___joqZk:has(.styles-module__checkboxInput___ECzzO:checked) {
  background-color: #fff;
}

.styles-module__checkboxInput___ECzzO {
  position: absolute;
  z-index: 1;
  inset: -1px;
  border-radius: inherit;
  opacity: 0;
  cursor: pointer;
}

.styles-module__checkboxCheck___fUXpr {
  color: #fafafa;
}
[data-agentation-theme=dark] .styles-module__checkboxCheck___fUXpr {
  color: #1a1a1a;
}

.styles-module__checkboxCheckPath___cDyh8 {
  stroke-dasharray: 9.29px;
  stroke-dashoffset: 9.29px;
  color: #fafafa;
  transition: stroke-dashoffset 0.1s ease;
}
[data-agentation-theme=dark] .styles-module__checkboxCheckPath___cDyh8 {
  color: #1a1a1a;
}
.styles-module__checkboxContainer___joqZk:has(.styles-module__checkboxInput___ECzzO:checked) .styles-module__checkboxCheckPath___cDyh8 {
  transition-duration: 0.2s;
  stroke-dashoffset: 0;
}`,Kv={checkboxContainer:"styles-module__checkboxContainer___joqZk",checkboxInput:"styles-module__checkboxInput___ECzzO",checkboxCheck:"styles-module__checkboxCheck___fUXpr",checkboxCheckPath:"styles-module__checkboxCheckPath___cDyh8"};if(typeof document<"u"){let e=document.getElementById("feedback-tool-styles-checkbox-styles");e||(e=document.createElement("style"),e.id="feedback-tool-styles-checkbox-styles",e.textContent=Qv,document.head.appendChild(e))}var us=Kv,Gv=e=>{const[t,n]=Jn(e,["class"]);return(()=>{var o=b(Hb),r=o.firstChild,i=r.nextSibling,s=i.firstChild;return bo(r,vn({get class(){return us.checkboxInput}},n),!1,!1),ie(l=>{var a=`${us.checkboxContainer} ${t.class??""}`,c=us.checkboxCheck,d=us.checkboxCheckPath;return a!==l.e&&M(o,l.e=a),c!==l.t&&O(i,"class",l.t=c),d!==l.a&&O(s,"class",l.a=d),l},{e:void 0,t:void 0,a:void 0}),Ft(),o})()},Jv=`.styles-module__container___w8eAF {
  display: flex;
  align-items: center;
  height: 24px;
}

.styles-module__label___J5mxE {
  padding-inline: 8px 2px;
  line-height: 20px;
  font-size: 13px;
  letter-spacing: -0.15px;
  color: rgba(26, 26, 26, 0.5);
  cursor: pointer;
}
[data-agentation-theme=dark] .styles-module__label___J5mxE {
  color: rgba(255, 255, 255, 0.5);
}`,Zv={container:"styles-module__container___w8eAF",label:"styles-module__label___J5mxE"};if(typeof document<"u"){let e=document.getElementById("feedback-tool-styles-checkbox-field-styles");e||(e=document.createElement("style"),e.id="feedback-tool-styles-checkbox-field-styles",e.textContent=Jv,document.head.appendChild(e))}var Sd=Zv,kd=e=>{const[t,n]=Jn(e,["class","label","tooltip","checked","onChange"]),o=Ud();return(()=>{var r=b(jb),i=r.firstChild,[s,l]=S(i.nextSibling),a=s.nextSibling,c=a.nextSibling,[d,u]=S(c.nextSibling);return bo(r,vn({get class(){return`${Sd.container} ${t.class??""}`}},n),!1,!0),y(r,h(Gv,{id:o,get onChange(){return t.onChange},get checked(){return t.checked}}),s,l),O(a,"for",o),y(a,()=>t.label),y(r,h(Oe,{get when(){return t.tooltip},get children(){return h(nr,{get content(){return t.tooltip}})}}),d,u),ie(()=>M(a,Sd.label)),Ft(),r})()},ew=`@keyframes styles-module__cycleTextIn___VBNTi {
  0% {
    opacity: 0;
    transform: translateY(-6px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes styles-module__scaleIn___QpQ8E {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes styles-module__mcpPulse___5Q3Jj {
  0% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--agentation-color-green) 50%, transparent);
  }
  70% {
    box-shadow: 0 0 0 6px color-mix(in srgb, var(--agentation-color-green) 0%, transparent);
  }
  100% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--agentation-color-green) 0%, transparent);
  }
}
@keyframes styles-module__mcpPulseError___VHxhx {
  0% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--agentation-color-red) 50%, transparent);
  }
  70% {
    box-shadow: 0 0 0 6px color-mix(in srgb, var(--agentation-color-red) 0%, transparent);
  }
  100% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--agentation-color-red) 0%, transparent);
  }
}
@keyframes styles-module__themeIconIn___qUWMV {
  0% {
    opacity: 0;
    transform: scale(0.8) rotate(-30deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}
.styles-module__settingsPanel___qNkn- {
  position: absolute;
  right: 5px;
  bottom: calc(100% + 0.5rem);
  z-index: 1;
  overflow: hidden;
  background: #1c1c1c;
  border-radius: 16px;
  padding: 12px 0;
  width: 100%;
  max-width: 253px;
  min-width: 205px;
  cursor: default;
  opacity: 1;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.04);
  transition: background-color 0.25s ease, box-shadow 0.25s ease;
}
.styles-module__settingsPanel___qNkn-::before, .styles-module__settingsPanel___qNkn-::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  width: 16px;
  z-index: 2;
  pointer-events: none;
}
.styles-module__settingsPanel___qNkn-::before {
  left: 0;
  background: linear-gradient(to right, #1c1c1c 0%, transparent 100%);
}
.styles-module__settingsPanel___qNkn-::after {
  right: 0;
  background: linear-gradient(to left, #1c1c1c 0%, transparent 100%);
}
.styles-module__settingsPanel___qNkn- .styles-module__settingsHeader___Fn1DP,
.styles-module__settingsPanel___qNkn- .styles-module__settingsBrand___OoKlM,
.styles-module__settingsPanel___qNkn- .styles-module__settingsBrandSlash___Q-AU9,
.styles-module__settingsPanel___qNkn- .styles-module__settingsVersion___rXmL9,
.styles-module__settingsPanel___qNkn- .styles-module__settingsSection___n5V-4,
.styles-module__settingsPanel___qNkn- .styles-module__settingsLabel___VCVOQ,
.styles-module__settingsPanel___qNkn- .styles-module__cycleButton___XMBx3,
.styles-module__settingsPanel___qNkn- .styles-module__cycleDot___zgSXY,
.styles-module__settingsPanel___qNkn- .styles-module__dropdownButton___mKHe8,
.styles-module__settingsPanel___qNkn- .styles-module__sliderLabel___6K5v1,
.styles-module__settingsPanel___qNkn- .styles-module__slider___v5z-c,
.styles-module__settingsPanel___qNkn- .styles-module__themeToggle___3imlT {
  transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease;
}
.styles-module__settingsPanel___qNkn-.styles-module__enter___wginS {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0px);
  transition: opacity 0.2s ease, transform 0.2s ease, filter 0.2s ease;
}
.styles-module__settingsPanel___qNkn-.styles-module__exit___A4iJc {
  opacity: 0;
  transform: translateY(8px) scale(0.95);
  filter: blur(5px);
  pointer-events: none;
  transition: opacity 0.1s ease, transform 0.1s ease, filter 0.1s ease;
}
[data-agentation-theme=dark] .styles-module__settingsPanel___qNkn- {
  background: #1a1a1a;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.08);
}
[data-agentation-theme=dark] .styles-module__settingsPanel___qNkn- .styles-module__settingsLabel___VCVOQ {
  color: rgba(255, 255, 255, 0.6);
}
[data-agentation-theme=dark] .styles-module__settingsPanel___qNkn- .styles-module__settingsOption___JoyH- {
  color: rgba(255, 255, 255, 0.85);
}
[data-agentation-theme=dark] .styles-module__settingsPanel___qNkn- .styles-module__settingsOption___JoyH-:hover {
  background: rgba(255, 255, 255, 0.1);
}
[data-agentation-theme=dark] .styles-module__settingsPanel___qNkn- .styles-module__settingsOption___JoyH-.styles-module__selected___k1-Vq {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

.styles-module__settingsPanelContainer___5it-H {
  overflow: visible;
  position: relative;
  display: flex;
  padding: 0 16px;
}

.styles-module__settingsPage___BMn-3 {
  min-width: 100%;
  flex-shrink: 0;
  transition: transform 0.2s ease, opacity 0.2s ease;
  transition-delay: 0s;
  opacity: 1;
}

.styles-module__settingsPage___BMn-3.styles-module__slideLeft___qUvW4 {
  transform: translateX(-24px);
  opacity: 0;
  pointer-events: none;
}

.styles-module__automationsPage___N7By0 {
  position: absolute;
  top: 0;
  left: 24px;
  width: 100%;
  height: 100%;
  padding: 0 16px 4px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, opacity 0.2s ease;
  opacity: 0;
  pointer-events: none;
}

.styles-module__automationsPage___N7By0.styles-module__slideIn___uXDSu {
  transform: translateX(-24px);
  opacity: 1;
  pointer-events: auto;
}

.styles-module__settingsHeader___Fn1DP {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 24px;
}

.styles-module__settingsBrand___OoKlM {
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: -0.0094em;
  color: #fff;
  text-decoration: none;
}

.styles-module__settingsBrandSlash___Q-AU9 {
  color: var(--agentation-color-accent);
  transition: color 0.2s ease;
}

.styles-module__settingsVersion___rXmL9 {
  font-size: 11px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.4);
  margin-left: auto;
  letter-spacing: -0.0094em;
}

.styles-module__themeToggle___3imlT {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  margin-left: 8px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: rgba(255, 255, 255, 0.4);
  transition: background-color 0.15s ease, color 0.15s ease;
  cursor: pointer;
}
.styles-module__themeToggle___3imlT:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}
[data-agentation-theme=light] .styles-module__themeToggle___3imlT {
  color: rgba(0, 0, 0, 0.4);
}
[data-agentation-theme=light] .styles-module__themeToggle___3imlT:hover {
  background: rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.7);
}

.styles-module__themeIconWrapper___pyaYa {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 20px;
  height: 20px;
}

.styles-module__themeIcon___w7lAm {
  display: flex;
  align-items: center;
  justify-content: center;
  animation: styles-module__themeIconIn___qUWMV 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.styles-module__settingsSectionGrow___eZTRw {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.styles-module__settingsRow___y-tDE {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 24px;
}
.styles-module__settingsRow___y-tDE.styles-module__settingsRowMarginTop___uLpGb {
  margin-top: 8px;
}

.styles-module__settingsRowDisabled___ydl3Q .styles-module__settingsLabel___VCVOQ {
  color: rgba(255, 255, 255, 0.2);
}
[data-agentation-theme=light] .styles-module__settingsRowDisabled___ydl3Q .styles-module__settingsLabel___VCVOQ {
  color: rgba(0, 0, 0, 0.2);
}

.styles-module__settingsLabel___VCVOQ {
  display: flex;
  align-items: center;
  column-gap: 2px;
  line-height: 20px;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: -0.15px;
  color: rgba(255, 255, 255, 0.5);
}
[data-agentation-theme=light] .styles-module__settingsLabel___VCVOQ {
  color: rgba(0, 0, 0, 0.5);
}

.styles-module__cycleButton___XMBx3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0;
  border: none;
  background: transparent;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #fff;
  cursor: pointer;
  letter-spacing: -0.0094em;
}
[data-agentation-theme=light] .styles-module__cycleButton___XMBx3 {
  color: rgba(0, 0, 0, 0.85);
}
.styles-module__cycleButton___XMBx3:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.styles-module__cycleButtonText___mbbnD {
  display: inline-block;
  animation: styles-module__cycleTextIn___VBNTi 0.2s ease-out;
}

.styles-module__cycleDots___ehp6i {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.styles-module__cycleDot___zgSXY {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: scale(0.667);
  transition: background-color 0.25s ease-out, transform 0.25s ease-out;
}
.styles-module__cycleDot___zgSXY.styles-module__active___dpAhM {
  background: #fff;
  transform: scale(1);
}
[data-agentation-theme=light] .styles-module__cycleDot___zgSXY {
  background: rgba(0, 0, 0, 0.2);
}
[data-agentation-theme=light] .styles-module__cycleDot___zgSXY.styles-module__active___dpAhM {
  background: rgba(0, 0, 0, 0.7);
}

.styles-module__colorOptions___pbxZx {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
  height: 26px;
}

.styles-module__colorOption___Co955 {
  position: relative;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  background-color: #fff;
  cursor: pointer;
}
[data-agentation-theme=dark] .styles-module__colorOption___Co955 {
  background-color: #1a1a1a;
}
.styles-module__colorOption___Co955::before, .styles-module__colorOption___Co955::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background-color: var(--swatch);
  transition: opacity 0.2s, transform 0.2s;
}
@supports (color: color(display-p3 0 0 0)) {
  .styles-module__colorOption___Co955::before, .styles-module__colorOption___Co955::after {
    --color: var(--swatch-p3);
  }
}
.styles-module__colorOption___Co955::after {
  z-index: -1;
  transform: scale(1.2);
  opacity: 0;
}
.styles-module__colorOption___Co955.styles-module__selected___k1-Vq::before {
  transform: scale(0.8);
}
.styles-module__colorOption___Co955.styles-module__selected___k1-Vq::after {
  opacity: 1;
}

.styles-module__settingsNavLink___uYIwM {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 24px;
  padding: 0;
  border: none;
  background: transparent;
  font-family: inherit;
  line-height: 20px;
  font-size: 13px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  transition: color 0.15s ease;
  cursor: pointer;
}
.styles-module__settingsNavLink___uYIwM:hover {
  color: rgba(255, 255, 255, 0.9);
}
.styles-module__settingsNavLink___uYIwM svg {
  color: rgba(255, 255, 255, 0.4);
  transition: color 0.15s ease;
}
.styles-module__settingsNavLink___uYIwM:hover svg {
  color: #fff;
}
[data-agentation-theme=light] .styles-module__settingsNavLink___uYIwM {
  color: rgba(0, 0, 0, 0.5);
}
[data-agentation-theme=light] .styles-module__settingsNavLink___uYIwM:hover {
  color: rgba(0, 0, 0, 0.8);
}
[data-agentation-theme=light] .styles-module__settingsNavLink___uYIwM svg {
  color: rgba(0, 0, 0, 0.25);
}
[data-agentation-theme=light] .styles-module__settingsNavLink___uYIwM:hover svg {
  color: rgba(0, 0, 0, 0.8);
}

.styles-module__settingsNavLinkRight___XBUzC {
  display: flex;
  align-items: center;
  gap: 6px;
}

.styles-module__settingsBackButton___fflll {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 24px;
  background: transparent;
  font-family: inherit;
  line-height: 20px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: -0.15px;
  color: #fff;
  cursor: pointer;
  transition: transform 0.12s cubic-bezier(0.32, 0.72, 0, 1);
}
.styles-module__settingsBackButton___fflll svg {
  opacity: 0.4;
  flex-shrink: 0;
  transition: opacity 0.15s ease, transform 0.18s cubic-bezier(0.32, 0.72, 0, 1);
}
.styles-module__settingsBackButton___fflll:hover svg {
  opacity: 1;
}
[data-agentation-theme=light] .styles-module__settingsBackButton___fflll {
  color: rgba(0, 0, 0, 0.85);
  border-bottom-color: rgba(0, 0, 0, 0.08);
}

.styles-module__automationHeader___Avra9 {
  display: flex;
  align-items: center;
  gap: 0.125rem;
  font-size: 0.8125rem;
  font-weight: 400;
  color: #fff;
}
[data-agentation-theme=light] .styles-module__automationHeader___Avra9 {
  color: rgba(0, 0, 0, 0.85);
}

.styles-module__automationDescription___vFTmJ {
  font-size: 0.6875rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 2px;
  line-height: 14px;
}
[data-agentation-theme=light] .styles-module__automationDescription___vFTmJ {
  color: rgba(0, 0, 0, 0.5);
}

.styles-module__learnMoreLink___cG7OI {
  color: rgba(255, 255, 255, 0.8);
  text-decoration-line: underline;
  text-decoration-style: dotted;
  text-decoration-color: rgba(255, 255, 255, 0.2);
  text-underline-offset: 2px;
  transition: color 0.15s ease;
}
.styles-module__learnMoreLink___cG7OI:hover {
  color: #fff;
}
[data-agentation-theme=light] .styles-module__learnMoreLink___cG7OI {
  color: rgba(0, 0, 0, 0.6);
  text-decoration-color: rgba(0, 0, 0, 0.2);
}
[data-agentation-theme=light] .styles-module__learnMoreLink___cG7OI:hover {
  color: rgba(0, 0, 0, 0.85);
}

.styles-module__autoSendContainer___VpkXk {
  display: flex;
  align-items: center;
}

.styles-module__autoSendLabel___ngNdC {
  padding-inline-end: 8px;
  font-size: 11px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.4);
  transition: color 0.15s, opacity 0.15s;
  cursor: pointer;
}
.styles-module__autoSendLabel___ngNdC.styles-module__active___dpAhM {
  color: #66b8ff;
  color: color(display-p3 0.4 0.72 1);
}
[data-agentation-theme=light] .styles-module__autoSendLabel___ngNdC {
  color: rgba(0, 0, 0, 0.4);
}
[data-agentation-theme=light] .styles-module__autoSendLabel___ngNdC.styles-module__active___dpAhM {
  color: var(--agentation-color-blue);
}
.styles-module__autoSendLabel___ngNdC.styles-module__disabled___9AZYS {
  opacity: 0.3;
  cursor: not-allowed;
}

.styles-module__mcpStatusDot___8AMxP {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.styles-module__mcpStatusDot___8AMxP.styles-module__connecting___QEO1r {
  background-color: var(--agentation-color-yellow);
  animation: styles-module__mcpPulse___5Q3Jj 1.5s infinite;
}
.styles-module__mcpStatusDot___8AMxP.styles-module__connected___WyFkx {
  background-color: var(--agentation-color-green);
  animation: styles-module__mcpPulse___5Q3Jj 2.5s ease-in-out infinite;
}
.styles-module__mcpStatusDot___8AMxP.styles-module__disconnected___mvmvQ {
  background-color: var(--agentation-color-red);
  animation: styles-module__mcpPulseError___VHxhx 2s infinite;
}

.styles-module__mcpNavIndicator___auBHI {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.styles-module__mcpNavIndicator___auBHI.styles-module__connected___WyFkx {
  background-color: var(--agentation-color-green);
  animation: styles-module__mcpPulse___5Q3Jj 2.5s ease-in-out infinite;
}
.styles-module__mcpNavIndicator___auBHI.styles-module__connecting___QEO1r {
  background-color: var(--agentation-color-yellow);
  animation: styles-module__mcpPulse___5Q3Jj 1.5s ease-in-out infinite;
}

.styles-module__webhookUrlInput___WDDDC {
  display: block;
  width: 100%;
  flex: 1;
  min-height: 60px;
  box-sizing: border-box;
  margin-top: 11px;
  padding: 8px 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.03);
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 400;
  color: #fff;
  outline: none;
  resize: none;
  user-select: text;
  transition: border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease;
}
.styles-module__webhookUrlInput___WDDDC::placeholder {
  color: rgba(255, 255, 255, 0.3);
}
.styles-module__webhookUrlInput___WDDDC:focus {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.08);
}
[data-agentation-theme=light] .styles-module__webhookUrlInput___WDDDC {
  border-color: rgba(0, 0, 0, 0.1);
  background: rgba(0, 0, 0, 0.03);
  color: rgba(0, 0, 0, 0.85);
}
[data-agentation-theme=light] .styles-module__webhookUrlInput___WDDDC::placeholder {
  color: rgba(0, 0, 0, 0.3);
}
[data-agentation-theme=light] .styles-module__webhookUrlInput___WDDDC:focus {
  border-color: rgba(0, 0, 0, 0.25);
  background: rgba(0, 0, 0, 0.05);
}

[data-agentation-theme=light] .styles-module__settingsPanel___qNkn- {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04);
}
[data-agentation-theme=light] .styles-module__settingsPanel___qNkn-::before {
  background: linear-gradient(to right, #fff 0%, transparent 100%);
}
[data-agentation-theme=light] .styles-module__settingsPanel___qNkn-::after {
  background: linear-gradient(to left, #fff 0%, transparent 100%);
}
[data-agentation-theme=light] .styles-module__settingsPanel___qNkn- .styles-module__settingsHeader___Fn1DP {
  border-bottom-color: rgba(0, 0, 0, 0.08);
}
[data-agentation-theme=light] .styles-module__settingsPanel___qNkn- .styles-module__settingsBrand___OoKlM {
  color: #E5484D;
}
[data-agentation-theme=light] .styles-module__settingsPanel___qNkn- .styles-module__settingsVersion___rXmL9 {
  color: rgba(0, 0, 0, 0.4);
}
[data-agentation-theme=light] .styles-module__settingsPanel___qNkn- .styles-module__settingsSection___n5V-4 {
  border-top-color: rgba(0, 0, 0, 0.08);
}
[data-agentation-theme=light] .styles-module__settingsPanel___qNkn- .styles-module__settingsLabel___VCVOQ {
  color: rgba(0, 0, 0, 0.5);
}
[data-agentation-theme=light] .styles-module__settingsPanel___qNkn- .styles-module__cycleButton___XMBx3 {
  color: rgba(0, 0, 0, 0.85);
}
[data-agentation-theme=light] .styles-module__settingsPanel___qNkn- .styles-module__cycleDot___zgSXY {
  background: rgba(0, 0, 0, 0.2);
}
[data-agentation-theme=light] .styles-module__settingsPanel___qNkn- .styles-module__cycleDot___zgSXY.styles-module__active___dpAhM {
  background: rgba(0, 0, 0, 0.7);
}
[data-agentation-theme=light] .styles-module__settingsPanel___qNkn- .styles-module__dropdownButton___mKHe8 {
  color: rgba(0, 0, 0, 0.85);
}
[data-agentation-theme=light] .styles-module__settingsPanel___qNkn- .styles-module__dropdownButton___mKHe8:hover {
  background: rgba(0, 0, 0, 0.05);
}

.styles-module__checkboxField___ZrSqv:not(:first-child) {
  margin-top: 8px;
}

.styles-module__divider___h6Yux {
  margin-block: 8px;
  width: 100%;
  height: 1px;
  background-color: rgba(26, 26, 26, 0.07);
}
[data-agentation-theme=dark] .styles-module__divider___h6Yux {
  background-color: rgba(255, 255, 255, 0.07);
}`,tw={settingsPanel:"styles-module__settingsPanel___qNkn-",settingsHeader:"styles-module__settingsHeader___Fn1DP",settingsBrand:"styles-module__settingsBrand___OoKlM",settingsBrandSlash:"styles-module__settingsBrandSlash___Q-AU9",settingsVersion:"styles-module__settingsVersion___rXmL9",settingsSection:"styles-module__settingsSection___n5V-4",settingsLabel:"styles-module__settingsLabel___VCVOQ",cycleButton:"styles-module__cycleButton___XMBx3",cycleDot:"styles-module__cycleDot___zgSXY",dropdownButton:"styles-module__dropdownButton___mKHe8",sliderLabel:"styles-module__sliderLabel___6K5v1",slider:"styles-module__slider___v5z-c",themeToggle:"styles-module__themeToggle___3imlT",enter:"styles-module__enter___wginS",exit:"styles-module__exit___A4iJc",settingsOption:"styles-module__settingsOption___JoyH-",selected:"styles-module__selected___k1-Vq",settingsPanelContainer:"styles-module__settingsPanelContainer___5it-H",settingsPage:"styles-module__settingsPage___BMn-3",slideLeft:"styles-module__slideLeft___qUvW4",automationsPage:"styles-module__automationsPage___N7By0",slideIn:"styles-module__slideIn___uXDSu",themeIconWrapper:"styles-module__themeIconWrapper___pyaYa",themeIcon:"styles-module__themeIcon___w7lAm",themeIconIn:"styles-module__themeIconIn___qUWMV",settingsSectionGrow:"styles-module__settingsSectionGrow___eZTRw",settingsRow:"styles-module__settingsRow___y-tDE",settingsRowMarginTop:"styles-module__settingsRowMarginTop___uLpGb",settingsRowDisabled:"styles-module__settingsRowDisabled___ydl3Q",cycleButtonText:"styles-module__cycleButtonText___mbbnD",cycleTextIn:"styles-module__cycleTextIn___VBNTi",cycleDots:"styles-module__cycleDots___ehp6i",active:"styles-module__active___dpAhM",colorOptions:"styles-module__colorOptions___pbxZx",colorOption:"styles-module__colorOption___Co955",settingsNavLink:"styles-module__settingsNavLink___uYIwM",settingsNavLinkRight:"styles-module__settingsNavLinkRight___XBUzC",settingsBackButton:"styles-module__settingsBackButton___fflll",automationHeader:"styles-module__automationHeader___Avra9",automationDescription:"styles-module__automationDescription___vFTmJ",learnMoreLink:"styles-module__learnMoreLink___cG7OI",autoSendContainer:"styles-module__autoSendContainer___VpkXk",autoSendLabel:"styles-module__autoSendLabel___ngNdC",disabled:"styles-module__disabled___9AZYS",mcpStatusDot:"styles-module__mcpStatusDot___8AMxP",connecting:"styles-module__connecting___QEO1r",mcpPulse:"styles-module__mcpPulse___5Q3Jj",connected:"styles-module__connected___WyFkx",disconnected:"styles-module__disconnected___mvmvQ",mcpPulseError:"styles-module__mcpPulseError___VHxhx",mcpNavIndicator:"styles-module__mcpNavIndicator___auBHI",webhookUrlInput:"styles-module__webhookUrlInput___WDDDC",checkboxField:"styles-module__checkboxField___ZrSqv",divider:"styles-module__divider___h6Yux",scaleIn:"styles-module__scaleIn___QpQ8E"};if(typeof document<"u"){let e=document.getElementById("feedback-tool-styles-settings-panel-styles");e||(e=document.createElement("style"),e.id="feedback-tool-styles-settings-panel-styles",e.textContent=ew,document.head.appendChild(e))}var Be=tw;function nw(e){return(()=>{var t=b(Ub),n=t.firstChild,o=n.firstChild,r=o.firstChild,i=r.firstChild,s=i.nextSibling,l=s.nextSibling,a=l.firstChild,c=a.firstChild,d=r.nextSibling,u=d.nextSibling,_=u.firstChild,m=_.firstChild,g=m.firstChild,v=g.nextSibling,[f,p]=S(v.nextSibling),k=m.nextSibling,P=k.firstChild,R=P.nextSibling,A=_.nextSibling,ee=A.firstChild,D=ee.firstChild,K=D.nextSibling,[te,me]=S(K.nextSibling),j=ee.nextSibling,[ue,be]=S(j.nextSibling),ye=A.nextSibling,Te=ye.firstChild,_e=Te.firstChild,W=_e.nextSibling,[B,Z]=S(W.nextSibling),de=Te.nextSibling,[Y,oe]=S(de.nextSibling),ve=u.nextSibling,he=ve.nextSibling,We=he.firstChild,Xe=We.nextSibling,re=he.nextSibling,Qe=re.nextSibling,nt=Qe.firstChild,[Le,ut]=S(nt.nextSibling),it=Le.nextSibling,[xe,Se]=S(it.nextSibling),Lt=Qe.nextSibling,H=Lt.nextSibling,V=H.firstChild,F=V.nextSibling,se=F.firstChild,[ge,Fe]=S(se.nextSibling);ge.nextSibling;var le=o.nextSibling,qe=le.firstChild,Nt=qe.firstChild,[Pt,ae]=S(Nt.nextSibling);Pt.nextSibling;var He=qe.nextSibling,Pe=He.nextSibling,ht=Pe.firstChild,Me=ht.firstChild,Ke=Me.firstChild,wt=Ke.nextSibling,[Ne,ze]=S(wt.nextSibling),ct=Me.nextSibling,[Xt,Kt]=S(ct.nextSibling),Jt=ht.nextSibling,Zt=Jt.firstChild,un=Zt.nextSibling,on=Pe.nextSibling,mn=on.nextSibling,qt=mn.firstChild,Ut=qt.firstChild,Gt=Ut.firstChild,ft=Gt.nextSibling,[Ve,Wt]=S(ft.nextSibling),wn=Ut.nextSibling,dt=wn.firstChild,Yt=dt.nextSibling,[Tn,Cn]=S(Yt.nextSibling),Dn=qt.nextSibling,Yn=Dn.nextSibling;return Br(l,"click",e.onToggleTheme,!0),y(c,h(Oe,{get when(){return e.isDarkMode},get fallback(){return h(h5,{size:20})},get children(){return h(_5,{size:20})}})),y(m,h(nr,{content:"Controls how much detail is included in the copied output"}),f,p),k.$$click=()=>{const At=(_i.findIndex(en=>en.value===e.settings.outputDetail)+1)%_i.length;e.onSettingsChange({outputDetail:_i[At].value})},y(P,()=>_i.find(N=>N.value===e.settings.outputDetail)?.label),y(R,h(Ye,{each:_i,children:N=>(()=>{var At=b(xo);return ie(()=>M(At,`${Be.cycleDot} ${e.settings.outputDetail===N.value?Be.active:""}`)),At})()})),y(ee,h(nr,{get content(){return e.isDevMode?"Include SolidJS component names in annotations":"Disabled — production builds minify component names, making detection unreliable. Use in development mode."}}),te,me),y(A,h(wl,{get checked(){return lt(()=>!!e.isDevMode)()&&e.settings.reactEnabled},onChange:N=>e.onSettingsChange({reactEnabled:N.target.checked}),get disabled(){return!e.isDevMode}}),ue,be),y(Te,h(nr,{content:"Hides the toolbar until you open a new tab"}),B,Z),y(ye,h(wl,{checked:!1,onChange:N=>{N.target.checked&&e.onHideToolbar()}}),Y,oe),y(Xe,h(Ye,{each:gi,children:N=>(()=>{var At=b(Wb);return At.$$click=()=>e.onSettingsChange({annotationColorId:N.id}),ie(en=>{var Mn=`${Be.colorOption} ${e.settings.annotationColorId===N.id?Be.selected:""}`,Vn=N.srgb,eo=N.p3,pn=N.label;return Mn!==en.e&&M(At,en.e=Mn),Vn!==en.t&&E(At,"--swatch",en.t=Vn),eo!==en.a&&E(At,"--swatch-p3",en.a=eo),pn!==en.o&&O(At,"title",en.o=pn),en},{e:void 0,t:void 0,a:void 0,o:void 0}),Ft(),At})()})),y(Qe,h(kd,{class:"checkbox-field",label:"Clear on copy/send",get checked(){return e.settings.autoClearAfterCopy},onChange:N=>e.onSettingsChange({autoClearAfterCopy:N.target.checked}),tooltip:"Automatically clear annotations after copying"}),Le,ut),y(Qe,h(kd,{get class(){return Be.checkboxField},label:"Block page interactions",get checked(){return e.settings.blockInteractions},onChange:N=>e.onSettingsChange({blockInteractions:N.target.checked})}),xe,Se),H.$$click=()=>e.onSettingsPageChange("automations"),y(F,h(Oe,{get when(){return lt(()=>!!e.endpoint)()&&e.connectionStatus!=="disconnected"},get children(){var N=b(xo);return ie(()=>M(N,`${Be.mcpNavIndicator} ${Be[e.connectionStatus]}`)),N}}),ge,Fe),qe.$$click=()=>e.onSettingsPageChange("main"),y(qe,h(m5,{size:16}),Pt,ae),y(Me,h(nr,{content:"Connect via Model Context Protocol to let AI agents like Claude Code receive annotations in real-time."}),Ne,ze),y(ht,h(Oe,{get when(){return e.endpoint},get children(){var N=b(sn);return ie(At=>{var en=`${Be.mcpStatusDot} ${Be[e.connectionStatus]}`,Mn=e.connectionStatus==="connected"?"Connected":e.connectionStatus==="connecting"?"Connecting...":"Disconnected";return en!==At.e&&M(N,At.e=en),Mn!==At.t&&O(N,"title",At.t=Mn),At},{e:void 0,t:void 0}),N}}),Xt,Kt),y(Ut,h(nr,{content:"Send annotation data to any URL endpoint when annotations change. Useful for custom integrations."}),Ve,Wt),y(wn,h(wl,{id:"agentation-auto-send",get checked(){return e.settings.webhooksEnabled},onChange:N=>e.onSettingsChange({webhooksEnabled:N.target.checked}),get disabled(){return!e.settings.webhookUrl}}),Tn,Cn),Yn.$$input=N=>e.onSettingsChange({webhookUrl:N.target.value}),Yn.$$keydown=N=>N.stopPropagation(),ie(N=>{var At=`${Be.settingsPanel} ${e.isVisible?Be.enter:Be.exit}`,en=e.toolbarNearBottom?{bottom:"auto",top:"calc(100% + 0.5rem)"}:void 0,Mn=Be.settingsPanelContainer,Vn=`${Be.settingsPage} ${e.settingsPage==="automations"?Be.slideLeft:""}`,eo=Be.settingsHeader,pn=Be.settingsBrand,Qo=Be.settingsVersion,to=Be.themeToggle,pr=e.isDarkMode?"Switch to light mode":"Switch to dark mode",ko=Be.themeIconWrapper,Ii=Be.themeIcon,Ri=Be.divider,Ys=Be.settingsSection,Co=Be.settingsRow,Mo=Be.settingsLabel,Io=Be.cycleButton,Ro=Be.cycleButtonText,Fr=Be.cycleDots,Nr=`${Be.settingsRow} ${Be.settingsRowMarginTop} ${e.isDevMode?"":Be.settingsRowDisabled}`,ho=Be.settingsLabel,no=`${Be.settingsRow} ${Be.settingsRowMarginTop}`,fo=Be.settingsLabel,Ln=Be.divider,ln=Be.settingsSection,Pi=`${Be.settingsLabel} ${Be.settingsLabelMarker}`,Ei=Be.colorOptions,Ti=Be.divider,Et=Be.settingsSection,Li=Be.divider,Fn=Be.settingsNavLink,zr=Be.settingsNavLinkRight,Hr=`${Be.settingsPage} ${Be.automationsPage} ${e.settingsPage==="automations"?Be.slideIn:""}`,jr=Be.settingsBackButton,Ai=Be.divider,Bi=Be.settingsSection,yr=Be.settingsRow,Nn=Be.automationHeader,xr=Be.automationDescription,Ur=Be.learnMoreLink,oo=Be.divider,ro=`${Be.settingsSection} ${Be.settingsSectionGrow}`,_n=Be.settingsRow,br=Be.automationHeader,Po=Be.autoSendContainer,Wr=`${Be.autoSendLabel} ${e.settings.webhooksEnabled?Be.active:""} ${e.settings.webhookUrl?"":Be.disabled}`,Oi=Be.automationDescription,Yr=Be.webhookUrlInput;return At!==N.e&&M(t,N.e=At),N.t=gn(t,en,N.t),Mn!==N.a&&M(n,N.a=Mn),Vn!==N.o&&M(o,N.o=Vn),eo!==N.i&&M(r,N.i=eo),pn!==N.n&&M(i,N.n=pn),Qo!==N.s&&M(s,N.s=Qo),to!==N.h&&M(l,N.h=to),pr!==N.r&&O(l,"title",N.r=pr),ko!==N.d&&M(a,N.d=ko),Ii!==N.l&&M(c,N.l=Ii),Ri!==N.u&&M(d,N.u=Ri),Ys!==N.c&&M(u,N.c=Ys),Co!==N.w&&M(_,N.w=Co),Mo!==N.m&&M(m,N.m=Mo),Io!==N.f&&M(k,N.f=Io),Ro!==N.y&&M(P,N.y=Ro),Fr!==N.g&&M(R,N.g=Fr),Nr!==N.p&&M(A,N.p=Nr),ho!==N.b&&M(ee,N.b=ho),no!==N.T&&M(ye,N.T=no),fo!==N.A&&M(Te,N.A=fo),Ln!==N.O&&M(ve,N.O=Ln),ln!==N.I&&M(he,N.I=ln),Pi!==N.S&&M(We,N.S=Pi),Ei!==N.W&&M(Xe,N.W=Ei),Ti!==N.C&&M(re,N.C=Ti),Et!==N.B&&M(Qe,N.B=Et),Li!==N.v&&M(Lt,N.v=Li),Fn!==N.k&&M(H,N.k=Fn),zr!==N.x&&M(F,N.x=zr),Hr!==N.j&&M(le,N.j=Hr),jr!==N.q&&M(qe,N.q=jr),Ai!==N.z&&M(He,N.z=Ai),Bi!==N.P&&M(Pe,N.P=Bi),yr!==N.H&&M(ht,N.H=yr),Nn!==N.F&&M(Me,N.F=Nn),xr!==N.M&&M(Jt,N.M=xr),Ur!==N.D&&M(un,N.D=Ur),oo!==N.R&&M(on,N.R=oo),ro!==N.E&&M(mn,N.E=ro),_n!==N.L&&M(qt,N.L=_n),br!==N.N&&M(Ut,N.N=br),Po!==N.G&&M(wn,N.G=Po),Wr!==N.U&&M(dt,N.U=Wr),Oi!==N.K&&M(Dn,N.K=Oi),Yr!==N.V&&M(Yn,N.V=Yr),N},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0,h:void 0,r:void 0,d:void 0,l:void 0,u:void 0,c:void 0,w:void 0,m:void 0,f:void 0,y:void 0,g:void 0,p:void 0,b:void 0,T:void 0,A:void 0,O:void 0,I:void 0,S:void 0,W:void 0,C:void 0,B:void 0,v:void 0,k:void 0,x:void 0,j:void 0,q:void 0,z:void 0,P:void 0,H:void 0,F:void 0,M:void 0,D:void 0,R:void 0,E:void 0,L:void 0,N:void 0,G:void 0,U:void 0,K:void 0,V:void 0}),ie(()=>yo(Yn,"value",e.settings.webhookUrl)),Ft(),t})()}function $l(e,t="filtered"){const{name:n,path:o}=wi(e);if(t==="off")return{name:n,elementName:n,path:o,reactComponents:null};const r=Hv(e,{mode:t});return{name:r.path?`${r.path} ${n}`:n,elementName:n,path:o,reactComponents:r.path}}var Cd=!1,Sl={outputDetail:"standard",autoClearAfterCopy:!1,annotationColorId:"blue",blockInteractions:!0,reactEnabled:!0,markerClickBehavior:"edit",webhookUrl:"",webhooksEnabled:!0},co=e=>{if(!e||!e.trim())return!1;try{const t=new URL(e.trim());return t.protocol==="http:"||t.protocol==="https:"}catch{return!1}},gi=[{id:"indigo",label:"Indigo",srgb:"#6155F5",p3:"color(display-p3 0.38 0.33 0.96)"},{id:"blue",label:"Blue",srgb:"#0088FF",p3:"color(display-p3 0.00 0.53 1.00)"},{id:"cyan",label:"Cyan",srgb:"#00C3D0",p3:"color(display-p3 0.00 0.76 0.82)"},{id:"green",label:"Green",srgb:"#34C759",p3:"color(display-p3 0.20 0.78 0.35)"},{id:"yellow",label:"Yellow",srgb:"#FFCC00",p3:"color(display-p3 1.00 0.80 0.00)"},{id:"orange",label:"Orange",srgb:"#FF8D28",p3:"color(display-p3 1.00 0.55 0.16)"},{id:"red",label:"Red",srgb:"#FF383C",p3:"color(display-p3 1.00 0.22 0.24)"}],ow=()=>{if(typeof document>"u"||document.getElementById("agentation-color-tokens"))return;const e=document.createElement("style");e.id="agentation-color-tokens",e.textContent=[...gi.map(t=>`
      [data-agentation-accent="${t.id}"] {
        --agentation-color-accent: ${t.srgb};
      }

      @supports (color: color(display-p3 0 0 0)) {
        [data-agentation-accent="${t.id}"] {
          --agentation-color-accent: ${t.p3};
        }
      }
    `),`:root {
      ${gi.map(t=>`--agentation-color-${t.id}: ${t.srgb};`).join(`
`)}
    }`,`@supports (color: color(display-p3 0 0 0)) {
      :root {
        ${gi.map(t=>`--agentation-color-${t.id}: ${t.p3};`).join(`
`)}
      }
    }`].join(""),document.head.appendChild(e)};ow();function Rr(e,t){let n=document.elementFromPoint(e,t);if(!n)return null;for(;n?.shadowRoot;){const o=n.shadowRoot.elementFromPoint(e,t);if(!o||o===n)break;n=o}return n}function kl(e){let t=e;for(;t&&t!==document.body;){const o=window.getComputedStyle(t).position;if(o==="fixed"||o==="sticky")return!0;t=t.parentElement}return!1}function er(e){return e.status!=="resolved"&&e.status!=="dismissed"}function Md(e={}){const[t,n]=G(!1),[o,r]=G([]),[i,s]=G(!0),[l,a]=G(Cv()),[c,d]=G(!1);let u;Pn(()=>{const I=L=>{u&&u.contains(L.target)&&(L.__agentationInternal=!0)},C=["mousedown","click","pointerdown"];C.forEach(L=>document.body.addEventListener(L,I,!0)),ot(()=>{C.forEach(L=>document.body.removeEventListener(L,I,!0))})});const[_,m]=G(!1),[g,v]=G(!1),[f,p]=G(null),[k,P]=G({x:0,y:0}),[R,A]=G(null),[ee,D]=G(!1),[K,te]=G("idle"),[me,j]=G(!1),[ue,be]=G(!1),[ye,Te]=G(null),[_e,W]=G(null),[B,Z]=G([]),[de,Y]=G(null),[oe,ve]=G(null),[he,We]=G(null),[Xe,re]=G(null),[Qe,nt]=G([]),[Le,ut]=G(0),[it,xe]=G(!1),[Se,Lt]=G(!1),[H,V]=G(!1),[F,se]=G(!1),[ge,Fe]=G(!1),[le,qe]=G("main"),[Nt,Pt]=G(!1),[ae,He]=G(!1),[Pe,ht]=G(!1),[Me,Ke]=G([]),[wt,Ne]=G(null);let ze=!1;const[ct,Xt]=G(!1),[Kt,Jt]=G(!1),[Zt,un]=G(1),[on,mn]=G("new-page"),[qt,Ut]=G(""),[Gt,ft]=G(!1),[Ve,Wt]=G(null);let wn=!1,dt={rearrange:null,placements:[]},Yt={rearrange:null,placements:[]};const[Tn,Cn]=G(0),[Dn,Yn]=G(0),[N,At]=G(0),[en,Mn]=G(0);let Vn=new Set,eo=new Set,pn=null,Qo;const[to,pr]=G(!1),[ko,Ii]=G([]);ko();const[Ri,Ys]=G(null);let Co,Mo=new Map,Io=new Map,Ro;const[Fr,Nr]=G(!1);let ho=null;const[no,fo]=G([]);let Ln={cmd:!1,shift:!1};const ln=()=>{Pt(!0)},Pi=()=>{Pt(!1)},Ei=()=>{Fr()||(ho=setTimeout(()=>Nr(!0),850))},Ti=()=>{ho&&(clearTimeout(ho),ho=null),Nr(!1),Pi()};ot(()=>{ho&&clearTimeout(ho)});const[Et,Li]=G((()=>{try{const I=JSON.parse(localStorage.getItem("feedback-toolbar-settings")??"");return{...Sl,...I,annotationColorId:gi.find(C=>C.id===I.annotationColorId)?I.annotationColorId:Sl.annotationColorId}}catch{return Sl}})()),[Fn,zr]=G(!0),[Hr,jr]=G(!1),Ai=()=>{u?.classList.add(ne.disableTransitions),zr(I=>!I),requestAnimationFrame(()=>{u?.classList.remove(ne.disableTransitions)})},Bi=!1,yr=()=>"off",[Nn,xr]=G(e.sessionId??null);let Ur=!1;const[oo,ro]=G(e.endpoint?"connecting":"disconnected"),[_n,br]=G(null),[Po,Wr]=G(!1),[Oi,Yr]=G(null);let Vs=!1;const[ha,Vr]=G(new Set),[fa,Di]=G(new Set),[Xr,Fi]=G(!1),[m_,vr]=G(!1),[Ko,ga]=G(!1);let wr=null,io=null,qr=null,Qr=null,Ni=!1,ma=0,zi=null,pa=null;const ya=8,p_=50;let xa,ba,Kr=null;const St=typeof window<"u"?window.location.pathname:"/";De(()=>{if(F())Fe(!0);else{Pt(!1),qe("main");const I=bt(()=>Fe(!1),0);ot(()=>clearTimeout(I))}}),De(()=>{if(ae()&&t()&&!Pe()&&ct()){Jt(!1);const C=requestAnimationFrame(()=>{Jt(!0)});ot(()=>cancelAnimationFrame(C))}else Jt(!1)});const va=()=>t()&&i()&&!ae();De(()=>{if(va()){v(!1),m(!0),Vr(new Set);const I=bt(()=>{Vr(C=>{const L=new Set(C);return o().forEach(q=>L.add(q.id)),L})},350);ot(()=>clearTimeout(I))}else if(_()){v(!0);const I=bt(()=>{m(!1),v(!1)},250);ot(()=>clearTimeout(I))}}),Pn(()=>{Lt(!0),ut(window.scrollY);const I=yl(St);r(I.filter(er)),Cd||(jr(!0),Cd=!0,bt(()=>jr(!1),750));try{const C=localStorage.getItem("feedback-toolbar-theme");C!==null&&zr(C==="dark")}catch{}try{const C=localStorage.getItem("feedback-toolbar-position");if(C){const L=JSON.parse(C);typeof L.x=="number"&&typeof L.y=="number"&&br(L)}}catch{}}),De(()=>{const I=Et();Se()&&localStorage.setItem("feedback-toolbar-settings",JSON.stringify(I))}),De(()=>{const I=Fn();Se()&&localStorage.setItem("feedback-toolbar-theme",I?"dark":"light")});let wa=!1;De(()=>{const I=wa;wa=Po(),I&&!Po()&&_n()&&Se()&&localStorage.setItem("feedback-toolbar-position",JSON.stringify(_n()))}),De(()=>{const I=e.endpoint,C=e.sessionId,L=e.onSessionCreated;if(!I||!Se()||Ur)return;Ur=!0,ro("connecting"),(async()=>{try{const Q=Sv(St),U=C||Q;let z=!1;if(U)try{const ce=await md(I,U);xr(ce.id),ro("connected"),xl(St,ce.id),z=!0;const Ee=yl(St),Ce=new Set(ce.annotations.map(je=>je.id)),Ie=Ee.filter(je=>!Ce.has(je.id));if(Ie.length>0){const gt=`${typeof window<"u"?window.location.origin:""}${St}`,pt=(await Promise.allSettled(Ie.map(It=>Ir(I,ce.id,{...It,sessionId:ce.id,url:gt})))).map((It,Qt)=>It.status==="fulfilled"?It.value:(console.warn("[Agentation] Failed to sync annotation:",It.reason),Ie[Qt])),$t=[...ce.annotations,...pt];r($t.filter(er)),ui(St,$t.filter(er),ce.id)}else r(ce.annotations.filter(er)),ui(St,ce.annotations.filter(er),ce.id)}catch(ce){console.warn("[Agentation] Could not join session, creating new:",ce),kv(St)}if(!z){const ce=typeof window<"u"?window.location.href:"/",Ee=await bl(I,ce);xr(Ee.id),ro("connected"),xl(St,Ee.id),L?.(Ee.id);const Ce=mv(),Ie=typeof window<"u"?window.location.origin:"",je=[];for(const[gt,rt]of Ce){const pt=rt.filter(Qt=>!Qt._syncedTo);if(pt.length===0)continue;const $t=`${Ie}${gt}`,It=gt===St;je.push((async()=>{try{const Qt=It?Ee:await bl(I,$t),mt=(await Promise.allSettled(pt.map(st=>Ir(I,Qt.id,{...st,sessionId:Qt.id,url:$t})))).map((st,zt)=>st.status==="fulfilled"?st.value:(console.warn("[Agentation] Failed to sync annotation:",st.reason),pt[zt])).filter(er);if(ui(gt,mt,Qt.id),It){const st=new Set(pt.map(zt=>zt.id));r(zt=>{const Vt=zt.filter(zn=>!st.has(zn.id));return[...mt,...Vt]})}}catch(Qt){console.warn(`[Agentation] Failed to sync annotations for ${gt}:`,Qt)}})())}await Promise.allSettled(je)}}catch(Q){ro("disconnected"),console.warn("[Agentation] Failed to initialize session, using local storage:",Q)}})()}),De(()=>{const I=e.endpoint;if(!I||!Se())return;const C=async()=>{try{(await fetch(`${I}/health`)).ok?ro("connected"):ro("disconnected")}catch{ro("disconnected")}};C();const L=x5(C,1e4);ot(()=>clearInterval(L))}),De(()=>{const I=e.endpoint,C=Nn();if(!I||!Se()||!C)return;const L=new EventSource(`${I}/sessions/${C}/events`),q=["resolved","dismissed"],Q=U=>{try{const z=JSON.parse(U.data);if(q.includes(z.payload?.status)){const ce=z.payload.id,Ee=z.payload.kind;if(Ee==="placement"){for(const[Ce,Ie]of Mo)if(Ie===ce){Mo.delete(Ce),Ke(je=>je.filter(gt=>gt.id!==Ce));break}}else if(Ee==="rearrange"){for(const[Ce,Ie]of Io)if(Ie===ce){Io.delete(Ce),Wt(je=>{if(!je)return null;const gt=je.sections.filter(rt=>rt.id!==Ce);return gt.length===0?null:{...je,sections:gt}});break}}else Di(Ce=>new Set(Ce).add(ce)),bt(()=>{r(Ce=>Ce.filter(Ie=>Ie.id!==ce)),Di(Ce=>{const Ie=new Set(Ce);return Ie.delete(ce),Ie})},150)}}catch{}};L.addEventListener("annotation.updated",Q),ot(()=>{L.removeEventListener("annotation.updated",Q),L.close()})}),De(()=>{const I=e.endpoint,C=oo(),L=Nn();if(!I||!Se())return;const q=pa==="disconnected",Q=C==="connected";pa=C,q&&Q&&(async()=>{try{const z=yl(St);if(z.length===0)return;const Ee=`${typeof window<"u"?window.location.origin:""}${St}`;let Ce=L,Ie=[];if(Ce)try{Ie=(await md(I,Ce)).annotations}catch{Ce=null}Ce||(Ce=(await bl(I,Ee)).id,xr(Ce),xl(St,Ce));const je=new Set(Ie.map(rt=>rt.id)),gt=z.filter(rt=>!je.has(rt.id));if(gt.length>0){const pt=(await Promise.allSettled(gt.map(Qt=>Ir(I,Ce,{...Qt,sessionId:Ce,url:Ee})))).map((Qt,$n)=>Qt.status==="fulfilled"?Qt.value:(console.warn("[Agentation] Failed to sync annotation on reconnect:",Qt.reason),gt[$n])),It=[...Ie,...pt].filter(er);r(It),ui(St,It,Ce)}}catch(z){console.warn("[Agentation] Failed to sync on reconnect:",z)}})()});const y_=()=>{c()||(d(!0),se(!1),n(!1),bt(()=>{Mv(!0),a(!0),d(!1)},400))};De(()=>{if(!e.enableDemoMode||!Se()||!e.demoAnnotations||e.demoAnnotations.length===0||o().length>0)return;const I=e.demoDelay??1e3,C=[];C.push(bt(()=>{n(!0)},I-200)),e.demoAnnotations.forEach((L,q)=>{const Q=I+q*300;C.push(bt(()=>{const U=document.querySelector(L.selector);if(!U)return;const z=U.getBoundingClientRect(),{name:ce,path:Ee}=wi(U),Ce={id:`demo-${Date.now()}-${q}`,x:(z.left+z.width/2)/window.innerWidth*100,y:z.top+z.height/2+window.scrollY,comment:L.comment,element:ce,elementPath:Ee,timestamp:Date.now(),selectedText:L.selectedText,boundingBox:{x:z.left,y:z.top+window.scrollY,width:z.width,height:z.height},nearbyText:ci(U),cssClasses:di(U)};r(Ie=>[...Ie,Ce])},Q))}),ot(()=>{C.forEach(clearTimeout)})}),Pn(()=>{const I=()=>{ut(window.scrollY),xe(!0),Kr&&clearTimeout(Kr),Kr=bt(()=>{xe(!1)},150)};window.addEventListener("scroll",I,{passive:!0}),ot(()=>{window.removeEventListener("scroll",I),Kr&&clearTimeout(Kr)})}),De(()=>{const I=o(),C=Nn();Se()&&I.length>0?C?ui(St,I,C):u_(St,I):Se()&&I.length===0&&localStorage.removeItem(As(St))}),De(()=>{if(Se()&&!ze){ze=!0;const I=pv(St);I.length>0&&Ke(I)}}),De(()=>{const I=Me(),C=ct();Se()&&ze&&!C&&(I.length>0?yv(St,I):xv(St))}),De(()=>{if(Se()&&!wn){wn=!0;const I=bv(St);if(I){const C={...I,sections:I.sections.map(L=>({...L,currentRect:L.currentRect??{...L.originalRect}}))};Wt(C)}}}),De(()=>{const I=Ve(),C=ct();Se()&&wn&&!C&&(I?vv(St,I):wv(St))});let Xs=!1;De(()=>{if(Se()&&!Xs){Xs=!0;const I=$v(St);I&&(Yt={rearrange:I.rearrange,placements:I.placements||[]},I.purpose&&Ut(I.purpose))}}),De(()=>{const I=Ve(),C=Me(),L=qt(),q=ct();if(!Se()||!Xs)return;const Q=Yt;q?(I?.sections?.length??0)>0||C.length>0||L?gd(St,{rearrange:I,placements:C,purpose:L}):cs(St):(Q.rearrange?.sections?.length??0)>0||Q.placements.length>0||L?gd(St,{rearrange:Q.rearrange,placements:Q.placements,purpose:L}):cs(St)}),De(()=>{ae()&&!Ve()&&Wt({sections:[],originalOrder:[],detectedAt:Date.now()})}),De(()=>{const I=e.endpoint,C=Nn(),L=Me();if(!I||!C)return;const q=Mo,Q=new Set(L.map(U=>U.id));for(const U of L){if(q.has(U.id))continue;q.set(U.id,"");const z=typeof window<"u"?window.location.pathname+window.location.search+window.location.hash:St;Ir(I,C,{id:U.id,x:U.x/window.innerWidth*100,y:U.y,comment:`Place ${U.type} at (${Math.round(U.x)}, ${Math.round(U.y)}), ${U.width}×${U.height}px${U.text?` — "${U.text}"`:""}`,element:`[design:${U.type}]`,elementPath:"[placement]",timestamp:U.timestamp,url:z,intent:"change",severity:"important",kind:"placement",placement:{componentType:U.type,width:U.width,height:U.height,scrollY:U.scrollY,text:U.text}}).then(ce=>{q.has(U.id)&&q.set(U.id,ce.id)}).catch(ce=>{console.warn("[Agentation] Failed to sync placement annotation:",ce),q.delete(U.id)})}for(const[U,z]of q)Q.has(U)||(q.delete(U),z&&Oo(I,z).catch(()=>{}))}),De(()=>{const I=e.endpoint,C=Nn(),L=Ve();!I||!C||(Ro&&clearTimeout(Ro),Ro=bt(()=>{const q=Io;if(!L||L.sections.length===0){for(const[,z]of q)z&&Oo(I,z).catch(()=>{});q.clear();return}const Q=new Set(L.sections.map(z=>z.id)),U=typeof window<"u"?window.location.pathname+window.location.search+window.location.hash:St;for(const z of L.sections){const ce=z.originalRect,Ee=z.currentRect;if(!(Math.abs(ce.x-Ee.x)>1||Math.abs(ce.y-Ee.y)>1||Math.abs(ce.width-Ee.width)>1||Math.abs(ce.height-Ee.height)>1)){const je=q.get(z.id);je&&(q.delete(z.id),Oo(I,je).catch(()=>{}));continue}const Ie=q.get(z.id);Ie?pd(I,Ie,{comment:`Move ${z.label} section (${z.tagName}) — from (${Math.round(ce.x)},${Math.round(ce.y)}) ${Math.round(ce.width)}×${Math.round(ce.height)} to (${Math.round(Ee.x)},${Math.round(Ee.y)}) ${Math.round(Ee.width)}×${Math.round(Ee.height)}`}).catch(je=>{console.warn("[Agentation] Failed to update rearrange annotation:",je)}):(q.set(z.id,""),Ir(I,C,{id:z.id,x:Ee.x/window.innerWidth*100,y:Ee.y,comment:`Move ${z.label} section (${z.tagName}) — from (${Math.round(ce.x)},${Math.round(ce.y)}) ${Math.round(ce.width)}×${Math.round(ce.height)} to (${Math.round(Ee.x)},${Math.round(Ee.y)}) ${Math.round(Ee.width)}×${Math.round(Ee.height)}`,element:z.selector,elementPath:"[rearrange]",timestamp:Date.now(),url:U,intent:"change",severity:"important",kind:"rearrange",rearrange:{selector:z.selector,label:z.label,tagName:z.tagName,originalRect:ce,currentRect:Ee}}).then(je=>{q.has(z.id)&&q.set(z.id,je.id)}).catch(je=>{console.warn("[Agentation] Failed to sync rearrange annotation:",je),q.delete(z.id)}))}for(const[z,ce]of q)Q.has(z)||(q.delete(z),ce&&Oo(I,ce).catch(()=>{}))},300),ot(()=>{Ro&&clearTimeout(Ro)}))});let $r=new Map;De(()=>{const I=Ve()?.sections??[],C=new Set,L=ae(),q=Pe(),Q=t();if((L||q)&&Q)for(const U of I){C.add(U.id);try{const z=document.querySelector(U.selector);if(!z)continue;if(!$r.has(U.id)){const ce={transform:z.style.transform,transformOrigin:z.style.transformOrigin,opacity:z.style.opacity,position:z.style.position,zIndex:z.style.zIndex,display:z.style.display},Ee=[];let Ce=z.parentElement;for(;Ce&&Ce!==document.body;){const je=getComputedStyle(Ce);(je.overflow!=="visible"||je.overflowX!=="visible"||je.overflowY!=="visible")&&(Ee.push({el:Ce,overflow:Ce.style.overflow}),Ce.style.overflow="visible"),Ce=Ce.parentElement}getComputedStyle(z).display==="inline"&&(z.style.display="inline-block"),$r.set(U.id,{el:z,origStyles:ce,ancestors:Ee}),z.style.transformOrigin="top left",z.style.zIndex="9999"}}catch{}}for(const[U,z]of $r)if(!C.has(U)){const{el:ce,origStyles:Ee,ancestors:Ce}=z;ce.style.transition="transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1)",ce.style.transform=Ee.transform,ce.style.transformOrigin=Ee.transformOrigin,ce.style.opacity=Ee.opacity,ce.style.position=Ee.position,ce.style.zIndex=Ee.zIndex,$r.delete(U),bt(()=>{ce.style.transition="",ce.style.display=Ee.display;for(const Ie of Ce)Ie.el.style.overflow=Ie.overflow},450)}}),ot(()=>{for(const[,I]of $r){const{el:C,origStyles:L,ancestors:q}=I;C.style.transition="transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1)",C.style.transform=L.transform,C.style.transformOrigin=L.transformOrigin,C.style.opacity=L.opacity,C.style.position=L.position,C.style.zIndex=L.zIndex,setTimeout(()=>{C.style.transition="",C.style.display=L.display;for(const Q of q)Q.el.style.overflow=Q.overflow},450)}$r.clear()});const Hi=()=>{ht(!0),He(!1),Ne(null),clearTimeout(Qo),Qo=setTimeout(()=>{ht(!1)},300)},qs=()=>{ae()&&(ht(!0),He(!1),Ne(null),clearTimeout(Qo),Qo=setTimeout(()=>{ht(!1)},300)),n(!1)},x_=()=>{H()||(v5(),V(!0))},$a=()=>{H()&&(td(),V(!1))},Sa=()=>{H()?$a():x_()},b_=()=>{if(no().length===0)return;const I=no(),C=I[0],L=C.element,q=I.length>1,Q=I.map(U=>U.element.getBoundingClientRect());if(q){const U={left:Math.min(...Q.map($t=>$t.left)),top:Math.min(...Q.map($t=>$t.top)),right:Math.max(...Q.map($t=>$t.right)),bottom:Math.max(...Q.map($t=>$t.bottom))},z=I.slice(0,5).map($t=>$t.name).join(", "),ce=I.length>5?` +${I.length-5} more`:"",Ee=Q.map($t=>({x:$t.left,y:$t.top+window.scrollY,width:$t.width,height:$t.height})),Ie=I[I.length-1].element,je=Q[Q.length-1],gt=je.left+je.width/2,rt=je.top+je.height/2,pt=kl(Ie);A({x:gt/window.innerWidth*100,y:pt?rt:rt+window.scrollY,clientY:rt,element:`${I.length} elements: ${z}${ce}`,elementPath:"multi-select",boundingBox:{x:U.left,y:U.top+window.scrollY,width:U.right-U.left,height:U.bottom-U.top},isMultiSelect:!0,isFixed:pt,elementBoundingBoxes:Ee,multiSelectElements:I.map($t=>$t.element),targetElement:Ie,fullPath:ss(L),accessibility:is(L),computedStyles:rs(L),computedStylesObj:os(L),nearbyElements:ns(L),cssClasses:di(L),nearbyText:ci(L),sourceFile:void 0})}else{const U=Q[0],z=kl(L);A({x:U.left/window.innerWidth*100,y:z?U.top:U.top+window.scrollY,clientY:U.top,element:C.name,elementPath:C.path,boundingBox:{x:U.left,y:z?U.top:U.top+window.scrollY,width:U.width,height:U.height},isFixed:z,fullPath:ss(L),accessibility:is(L),computedStyles:rs(L),computedStylesObj:os(L),nearbyElements:ns(L),cssClasses:di(L),nearbyText:ci(L),reactComponents:C.reactComponents,sourceFile:void 0})}fo([]),p(null)};De(()=>{t()||(A(null),We(null),re(null),nt([]),p(null),se(!1),fo([]),Ln={cmd:!1,shift:!1},H()&&$a())}),ot(()=>{td()}),De(()=>{if(!t())return;const I=["p","span","h1","h2","h3","h4","h5","h6","li","td","th","label","blockquote","figcaption","caption","legend","dt","dd","pre","code","em","strong","b","i","u","s","a","time","address","cite","q","abbr","dfn","mark","small","sub","sup","[contenteditable]"].join(", "),C=":not([data-agentation-root]):not([data-agentation-root] *)",L=document.createElement("style");L.id="feedback-cursor-styles",L.textContent=`
      body ${C} {
        cursor: crosshair !important;
      }

      body :is(${I})${C} {
        cursor: text !important;
      }
    `,document.head.appendChild(L),ot(()=>{const q=document.getElementById("feedback-cursor-styles");q&&q.remove()})}),De(()=>{Ri()!==null&&t()&&(document.documentElement.setAttribute("data-drawing-hover",""),ot(()=>document.documentElement.removeAttribute("data-drawing-hover")))}),De(()=>{if(!t()||R()||to()||ae())return;const I=C=>{const L=C.composedPath()[0]||C.target;if(Rn(L,"[data-feedback-toolbar]")){p(null);return}const q=Rr(C.clientX,C.clientY);if(!q||Rn(q,"[data-feedback-toolbar]")){p(null);return}const{name:Q,elementName:U,path:z,reactComponents:ce}=$l(q,yr()),Ee=q.getBoundingClientRect();p({element:Q,elementName:U,elementPath:z,rect:Ee,reactComponents:ce}),P({x:C.clientX,y:C.clientY})};document.addEventListener("mousemove",I),ot(()=>document.removeEventListener("mousemove",I))}),De(()=>{if(!t()||to()||ae())return;const I=C=>{if(Ni){Ni=!1;return}const L=C.composedPath()[0]||C.target;if(Rn(L,"[data-feedback-toolbar]")||Rn(L,"[data-annotation-popup]")||Rn(L,"[data-annotation-marker]"))return;if(C.metaKey&&C.shiftKey&&!R()&&!he()){C.preventDefault(),C.stopPropagation();const It=Rr(C.clientX,C.clientY);if(!It)return;const Qt=It.getBoundingClientRect(),{name:$n,path:hn,reactComponents:mt}=$l(It,yr()),st=no().findIndex(zt=>zt.element===It);st>=0?fo(zt=>zt.filter((Vt,zn)=>zn!==st)):fo(zt=>[...zt,{element:It,rect:Qt,name:$n,path:hn,reactComponents:mt??void 0}]);return}const q=Rn(L,"button, a, input, select, textarea, [role='button'], [onclick]");if(Et().blockInteractions&&q&&(C.preventDefault(),C.stopPropagation()),R()){if(q&&!Et().blockInteractions)return;C.preventDefault(),xa?.shake();return}if(he()){if(q&&!Et().blockInteractions)return;C.preventDefault(),ba?.shake();return}C.preventDefault();const Q=Rr(C.clientX,C.clientY);if(!Q)return;const{name:U,path:z,reactComponents:ce}=$l(Q,yr()),Ee=Q.getBoundingClientRect(),Ce=C.clientX/window.innerWidth*100,Ie=kl(Q),je=Ie?C.clientY:C.clientY+window.scrollY,gt=window.getSelection();let rt;gt&&gt.toString().trim().length>0&&(rt=gt.toString().trim().slice(0,500));const pt=os(Q),$t=rs(Q);A({x:Ce,y:je,clientY:C.clientY,element:U,elementPath:z,selectedText:rt,boundingBox:{x:Ee.left,y:Ie?Ee.top:Ee.top+window.scrollY,width:Ee.width,height:Ee.height},nearbyText:ci(Q),cssClasses:di(Q),isFixed:Ie,fullPath:ss(Q),accessibility:is(Q),computedStyles:$t,computedStylesObj:pt,nearbyElements:ns(Q),reactComponents:ce??void 0,sourceFile:void 0,targetElement:Q}),p(null)};document.addEventListener("click",I,!0),ot(()=>document.removeEventListener("click",I,!0))}),De(()=>{if(!t())return;const I=q=>{q.key==="Meta"&&(Ln.cmd=!0),q.key==="Shift"&&(Ln.shift=!0)},C=q=>{const Q=Ln.cmd&&Ln.shift;q.key==="Meta"&&(Ln.cmd=!1),q.key==="Shift"&&(Ln.shift=!1);const U=Ln.cmd&&Ln.shift;Q&&!U&&no().length>0&&b_()},L=()=>{Ln={cmd:!1,shift:!1},fo([])};document.addEventListener("keydown",I),document.addEventListener("keyup",C),window.addEventListener("blur",L),ot(()=>{document.removeEventListener("keydown",I),document.removeEventListener("keyup",C),window.removeEventListener("blur",L)})}),De(()=>{if(!t()||R()||to()||ae())return;const I=C=>{const L=C.composedPath()[0]||C.target;Rn(L,"[data-feedback-toolbar]")||Rn(L,"[data-annotation-marker]")||Rn(L,"[data-annotation-popup]")||new Set(["P","SPAN","H1","H2","H3","H4","H5","H6","LI","TD","TH","LABEL","BLOCKQUOTE","FIGCAPTION","CAPTION","LEGEND","DT","DD","PRE","CODE","EM","STRONG","B","I","U","S","A","TIME","ADDRESS","CITE","Q","ABBR","DFN","MARK","SMALL","SUB","SUP"]).has(L.tagName)||L.isContentEditable||(C.preventDefault(),wr={x:C.clientX,y:C.clientY})};document.addEventListener("mousedown",I),ot(()=>document.removeEventListener("mousedown",I))}),De(()=>{if(!t()||R())return;const I=C=>{if(!wr)return;const L=C.clientX-wr.x,q=C.clientY-wr.y,Q=L*L+q*q,U=ya*ya;if(!Ko()&&Q>=U&&(io=wr,ga(!0),C.preventDefault()),(Ko()||Q>=U)&&io){if(qr){const mt=Math.min(io.x,C.clientX),st=Math.min(io.y,C.clientY),zt=Math.abs(C.clientX-io.x),Vt=Math.abs(C.clientY-io.y);qr.style.transform=`translate(${mt}px, ${st}px)`,qr.style.width=`${zt}px`,qr.style.height=`${Vt}px`}const z=Date.now();if(z-ma<p_)return;ma=z;const ce=io.x,Ee=io.y,Ce=Math.min(ce,C.clientX),Ie=Math.min(Ee,C.clientY),je=Math.max(ce,C.clientX),gt=Math.max(Ee,C.clientY),rt=(Ce+je)/2,pt=(Ie+gt)/2,$t=new Set,It=[[Ce,Ie],[je,Ie],[Ce,gt],[je,gt],[rt,pt],[rt,Ie],[rt,gt],[Ce,pt],[je,pt]];for(const[mt,st]of It){const zt=document.elementsFromPoint(mt,st);for(const Vt of zt)Vt instanceof HTMLElement&&$t.add(Vt)}const Qt=document.querySelectorAll("button, a, input, img, p, h1, h2, h3, h4, h5, h6, li, label, td, th, div, span, section, article, aside, nav");for(const mt of Qt)if(mt instanceof HTMLElement){const st=mt.getBoundingClientRect(),zt=st.left+st.width/2,Vt=st.top+st.height/2,zn=zt>=Ce&&zt<=je&&Vt>=Ie&&Vt<=gt,An=Math.min(st.right,je)-Math.max(st.left,Ce),To=Math.min(st.bottom,gt)-Math.max(st.top,Ie),Zr=An>0&&To>0?An*To:0,Yi=st.width*st.height,Vi=Yi>0?Zr/Yi:0;(zn||Vi>.5)&&$t.add(mt)}const $n=[],hn=new Set(["BUTTON","A","INPUT","IMG","P","H1","H2","H3","H4","H5","H6","LI","LABEL","TD","TH","SECTION","ARTICLE","ASIDE","NAV"]);for(const mt of $t){if(Rn(mt,"[data-feedback-toolbar]")||Rn(mt,"[data-annotation-marker]"))continue;const st=mt.getBoundingClientRect();if(!(st.width>window.innerWidth*.8&&st.height>window.innerHeight*.5)&&!(st.width<10||st.height<10)&&st.left<je&&st.right>Ce&&st.top<gt&&st.bottom>Ie){const zt=mt.tagName;let Vt=hn.has(zt);if(!Vt&&(zt==="DIV"||zt==="SPAN")){const zn=mt.textContent&&mt.textContent.trim().length>0,An=mt.onclick!==null||mt.getAttribute("role")==="button"||mt.getAttribute("role")==="link"||mt.classList.contains("clickable")||mt.hasAttribute("data-clickable");(zn||An)&&!mt.querySelector("p, h1, h2, h3, h4, h5, h6, button, a")&&(Vt=!0)}if(Vt){let zn=!1;for(const An of $n)if(An.left<=st.left&&An.right>=st.right&&An.top<=st.top&&An.bottom>=st.bottom){zn=!0;break}zn||$n.push(st)}}}if(Qr){const mt=Qr;for(;mt.children.length>$n.length;)mt.removeChild(mt.lastChild);$n.forEach((st,zt)=>{let Vt=mt.children[zt];Vt||(Vt=document.createElement("div"),Vt.className=ne.selectedElementHighlight,mt.appendChild(Vt)),Vt.style.transform=`translate(${st.left}px, ${st.top}px)`,Vt.style.width=`${st.width}px`,Vt.style.height=`${st.height}px`})}}};document.addEventListener("mousemove",I,{passive:!0}),ot(()=>document.removeEventListener("mousemove",I))}),De(()=>{if(!t())return;const I=C=>{const L=Ko(),q=io;if(Ko()&&q){Ni=!0;const Q=Math.min(q.x,C.clientX),U=Math.min(q.y,C.clientY),z=Math.max(q.x,C.clientX),ce=Math.max(q.y,C.clientY),Ee=[];document.querySelectorAll("button, a, input, img, p, h1, h2, h3, h4, h5, h6, li, label, td, th").forEach(rt=>{if(!(rt instanceof HTMLElement)||Rn(rt,"[data-feedback-toolbar]")||Rn(rt,"[data-annotation-marker]"))return;const pt=rt.getBoundingClientRect();pt.width>window.innerWidth*.8&&pt.height>window.innerHeight*.5||pt.width<10||pt.height<10||pt.left<z&&pt.right>Q&&pt.top<ce&&pt.bottom>U&&Ee.push({element:rt,rect:pt})});const Ie=Ee.filter(({element:rt})=>!Ee.some(({element:pt})=>pt!==rt&&rt.contains(pt))),je=C.clientX/window.innerWidth*100,gt=C.clientY+window.scrollY;if(Ie.length>0){const rt=Ie.reduce((hn,{rect:mt})=>({left:Math.min(hn.left,mt.left),top:Math.min(hn.top,mt.top),right:Math.max(hn.right,mt.right),bottom:Math.max(hn.bottom,mt.bottom)}),{left:1/0,top:1/0,right:-1/0,bottom:-1/0}),pt=Ie.slice(0,5).map(({element:hn})=>wi(hn).name).join(", "),$t=Ie.length>5?` +${Ie.length-5} more`:"",It=Ie[0].element,Qt=os(It),$n=rs(It);A({x:je,y:gt,clientY:C.clientY,element:`${Ie.length} elements: ${pt}${$t}`,elementPath:"multi-select",boundingBox:{x:rt.left,y:rt.top+window.scrollY,width:rt.right-rt.left,height:rt.bottom-rt.top},isMultiSelect:!0,fullPath:ss(It),accessibility:is(It),computedStyles:$n,computedStylesObj:Qt,nearbyElements:ns(It),cssClasses:di(It),nearbyText:ci(It),sourceFile:void 0})}else{const rt=Math.abs(z-Q),pt=Math.abs(ce-U);rt>20&&pt>20&&A({x:je,y:gt,clientY:C.clientY,element:"Area selection",elementPath:`region at (${Math.round(Q)}, ${Math.round(U)})`,boundingBox:{x:Q,y:U+window.scrollY,width:rt,height:pt},isMultiSelect:!0})}p(null)}else L&&(Ni=!0);wr=null,io=null,ga(!1),Qr&&(Qr.innerHTML="")};document.addEventListener("mouseup",I),ot(()=>document.removeEventListener("mouseup",I))});const Gr=async(I,C,L)=>{const q=Et().webhookUrl||e.webhookUrl;if(!q||!Et().webhooksEnabled&&!L)return!1;try{return(await fetch(q,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({event:I,timestamp:Date.now(),url:typeof window<"u"?window.location.href:void 0,...C})})).ok}catch(Q){return console.warn("[Agentation] Webhook failed:",Q),!1}},v_=I=>{const C=R();if(!C)return;const L={id:Date.now().toString(),x:C.x,y:C.y,comment:I,element:C.element,elementPath:C.elementPath,timestamp:Date.now(),selectedText:C.selectedText,boundingBox:C.boundingBox,nearbyText:C.nearbyText,cssClasses:C.cssClasses,isMultiSelect:C.isMultiSelect,isFixed:C.isFixed,fullPath:C.fullPath,accessibility:C.accessibility,computedStyles:C.computedStyles,nearbyElements:C.nearbyElements,reactComponents:C.reactComponents,sourceFile:C.sourceFile,elementBoundingBoxes:C.elementBoundingBoxes,...e.endpoint&&Nn()?{sessionId:Nn(),url:typeof window<"u"?window.location.href:void 0,status:"pending"}:{}};r(q=>[...q,L]),zi=L.id,bt(()=>{zi=null},300),bt(()=>{Vr(q=>new Set(q).add(L.id))},250),e.onAnnotationAdd?.(L),Gr("annotation.add",{annotation:L}),Fi(!0),bt(()=>{A(null),Fi(!1)},150),window.getSelection()?.removeAllRanges(),e.endpoint&&Nn()&&Ir(e.endpoint,Nn(),L).then(q=>{q.id!==L.id&&(r(Q=>Q.map(U=>U.id===L.id?{...U,id:q.id}:U)),Vr(Q=>{const U=new Set(Q);return U.delete(L.id),U.add(q.id),U}))}).catch(q=>{console.warn("[Agentation] Failed to sync annotation:",q)})},Qs=()=>{Fi(!0),bt(()=>{A(null),Fi(!1)},150)},Ks=I=>{const C=o(),L=C.findIndex(Q=>Q.id===I),q=C[L];he()?.id===I&&(vr(!0),bt(()=>{We(null),re(null),nt([]),vr(!1)},150)),Y(I),Di(Q=>new Set(Q).add(I)),q&&(e.onAnnotationDelete?.(q),Gr("annotation.delete",{annotation:q})),e.endpoint&&Oo(e.endpoint,I).catch(Q=>{console.warn("[Agentation] Failed to delete annotation from server:",Q)}),bt(()=>{r(Q=>Q.filter(U=>U.id!==I)),Di(Q=>{const U=new Set(Q);return U.delete(I),U}),Y(null),L<C.length-1&&(ve(L),bt(()=>ve(null),200))},150)},ji=I=>{if(We(I),Te(null),W(null),Z([]),I.elementBoundingBoxes?.length){const C=[];for(const L of I.elementBoundingBoxes){const q=L.x+L.width/2,Q=L.y+L.height/2-window.scrollY,U=Rr(q,Q);U&&C.push(U)}nt(C),re(null)}else if(I.boundingBox){const C=I.boundingBox,L=C.x+C.width/2,q=I.isFixed?C.y+C.height/2:C.y+C.height/2-window.scrollY,Q=Rr(L,q);if(Q){const U=Q.getBoundingClientRect(),z=U.width/C.width,ce=U.height/C.height;z<.5||ce<.5?re(null):re(Q)}else re(null);nt([])}else re(null),nt([])},Ui=I=>{if(!I){Te(null),W(null),Z([]);return}if(Te(I.id),I.elementBoundingBoxes?.length){const C=[];for(const L of I.elementBoundingBoxes){const q=L.x+L.width/2,Q=L.y+L.height/2-window.scrollY,z=document.elementsFromPoint(q,Q).find(ce=>!ce.closest("[data-annotation-marker]")&&!ce.closest("[data-agentation-root]"));z&&C.push(z)}Z(C),W(null)}else if(I.boundingBox){const C=I.boundingBox,L=C.x+C.width/2,q=I.isFixed?C.y+C.height/2:C.y+C.height/2-window.scrollY,Q=Rr(L,q);if(Q){const U=Q.getBoundingClientRect(),z=U.width/C.width,ce=U.height/C.height;z<.5||ce<.5?W(null):W(Q)}else W(null);Z([])}else W(null),Z([])},w_=I=>{const C=he();if(!C)return;const L={...C,comment:I};r(q=>q.map(Q=>Q.id===C.id?L:Q)),e.onAnnotationUpdate?.(L),Gr("annotation.update",{annotation:L}),e.endpoint&&pd(e.endpoint,C.id,{comment:I}).catch(q=>{console.warn("[Agentation] Failed to update annotation on server:",q)}),vr(!0),bt(()=>{We(null),re(null),nt([]),vr(!1)},150)},$_=()=>{vr(!0),bt(()=>{We(null),re(null),nt([]),vr(!1)},150)},Wi=()=>{const I=o(),C=I.length,L=Me().length>0||!!Ve();if(C===0&&ko().length===0&&!L)return;if(e.onAnnotationsClear?.(I),Gr("annotations.clear",{annotations:I}),e.endpoint){Promise.all(I.map(Q=>Oo(e.endpoint,Q.id).catch(U=>{console.warn("[Agentation] Failed to delete annotation from server:",U)})));for(const[,Q]of Mo)Q&&Oo(e.endpoint,Q).catch(()=>{});Mo.clear();for(const[,Q]of Io)Q&&Oo(e.endpoint,Q).catch(()=>{});Io.clear()}if(be(!0),j(!0),Ii([]),Co){const Q=Co.getContext("2d");Q&&Q.clearRect(0,0,Co.width,Co.height)}(Me().length>0||Ve())&&(At(Q=>Q+1),Mn(Q=>Q+1),bt(()=>{Ke([]),Wt(null)},200)),ct()&&Xt(!1),qt()&&Ut(""),Yt={rearrange:null,placements:[]},cs(St);const q=C*30+200;bt(()=>{r([]),Vr(new Set),localStorage.removeItem(As(St)),be(!1)},q),bt(()=>j(!1),1500)},ka=async()=>{const I=typeof window<"u"?window.location.pathname+window.location.search+window.location.hash:St,C=ae()&&ct();let L;if(C){if(Me().length===0&&!Ve()&&!qt())return;L=""}else{if(L=vd(o(),I,Et().outputDetail),!L&&ko().length===0&&Me().length===0&&!Ve())return;L||(L=`## Page Feedback: ${I}
`)}if((Me().length>0||C&&qt())&&(L+=`
`+hd(Me(),{width:window.innerWidth,height:window.innerHeight},{blankCanvas:ct(),wireframePurpose:qt()||void 0},Et().outputDetail)),Ve()){const q=fd(Ve(),Et().outputDetail,{width:window.innerWidth,height:window.innerHeight});q&&(L+=`
`+q)}if(e.copyToClipboard!==!1)try{await navigator.clipboard.writeText(L)}catch{}e.onCopy?.(L),D(!0),bt(()=>D(!1),2e3),Et().autoClearAfterCopy&&bt(()=>Wi(),500)},Ca=async()=>{const I=typeof window<"u"?window.location.pathname+window.location.search+window.location.hash:St;let C=vd(o(),I,Et().outputDetail);if(!C&&Me().length===0&&!Ve())return;if(C||(C=`## Page Feedback: ${I}
`),Me().length>0&&(C+=`
`+hd(Me(),{width:window.innerWidth,height:window.innerHeight},{blankCanvas:ct(),wireframePurpose:qt()||void 0},Et().outputDetail)),Ve()){const q=fd(Ve(),Et().outputDetail,{width:window.innerWidth,height:window.innerHeight});q&&(C+=`
`+q)}e.onSubmit&&e.onSubmit(C,o()),te("sending"),await new Promise(q=>bt(q,150));const L=await Gr("submit",{output:C,annotations:o()},!0);te(L?"sent":"failed"),bt(()=>te("idle"),2500),L&&Et().autoClearAfterCopy&&bt(()=>Wi(),500)};De(()=>{const I=Oi();if(!I)return;const C=10,L=Q=>{const U=Q.clientX-I.x,z=Q.clientY-I.y,ce=Math.sqrt(U*U+z*z);if(!Po()&&ce>C&&Wr(!0),Po()||ce>C){let Ee=I.toolbarX+U,Ce=I.toolbarY+z;const Ie=20,je=337,gt=44,rt=t()?oo()==="connected"?297:257:44,pt=je-rt,$t=Ie-pt,It=window.innerWidth-Ie-je;Ee=Math.max($t,Math.min(It,Ee)),Ce=Math.max(Ie,Math.min(window.innerHeight-gt-Ie,Ce)),br({x:Ee,y:Ce})}},q=()=>{Po()&&(Vs=!0),Wr(!1),Yr(null)};document.addEventListener("mousemove",L),document.addEventListener("mouseup",q),ot(()=>{document.removeEventListener("mousemove",L),document.removeEventListener("mouseup",q)})});const S_=I=>{if(I.target.closest("button")||I.target.closest("[data-agentation-settings-panel]"))return;const C=I.currentTarget.parentElement;if(!C)return;const L=C.getBoundingClientRect(),q=_n(),Q=q?.x??L.left,U=q?.y??L.top;Yr({x:I.clientX,y:I.clientY,toolbarX:Q,toolbarY:U})};De(()=>{const I=_n();if(!I)return;const C=()=>{let U=I.x,z=I.y;const Ce=20-(337-(t()?oo()==="connected"?297:257:44)),Ie=window.innerWidth-20-337;U=Math.max(Ce,Math.min(Ie,U)),z=Math.max(20,Math.min(window.innerHeight-44-20,z)),(U!==I.x||z!==I.y)&&br({x:U,y:z})};C(),window.addEventListener("resize",C),ot(()=>window.removeEventListener("resize",C))}),De(()=>{const I=t(),C=R(),L=o().length,q=Et(),Q=K(),U=z=>{const ce=z.target,Ee=ce.tagName==="INPUT"||ce.tagName==="TEXTAREA"||ce.isContentEditable;if(z.key==="Escape"){if(ae()){wt()?Ne(null):Hi();return}if(to()){pr(!1);return}if(no().length>0){fo([]);return}C||I&&(ln(),qs())}if((z.metaKey||z.ctrlKey)&&z.shiftKey&&(z.key==="f"||z.key==="F")){z.preventDefault(),ln(),I?qs():n(!0);return}if(!(Ee||z.metaKey||z.ctrlKey)&&((z.key==="p"||z.key==="P")&&(z.preventDefault(),ln(),Sa()),(z.key==="l"||z.key==="L")&&(z.preventDefault(),ln(),to()&&pr(!1),F()&&se(!1),C&&Qs(),ae()?Hi():He(!0)),(z.key==="h"||z.key==="H")&&L>0&&(z.preventDefault(),ln(),s(Ce=>!Ce)),(z.key==="c"||z.key==="C")&&(L>0||Me().length>0||Ve())&&(z.preventDefault(),ln(),ka()),(z.key==="x"||z.key==="X")&&(L>0||Me().length>0||Ve())&&(z.preventDefault(),ln(),Wi(),Me().length>0&&Ke([]),Ve()&&Wt(null)),z.key==="s"||z.key==="S")){const Ce=co(q.webhookUrl)||co(e.webhookUrl||"");L>0&&Ce&&Q==="idle"&&(z.preventDefault(),ln(),Ca())}};document.addEventListener("keydown",U),ot(()=>document.removeEventListener("keydown",U))});const Jr=()=>o().length>0,Eo=()=>o().filter(I=>!fa().has(I.id)&&I.kind!=="placement"&&I.kind!=="rearrange"),k_=()=>Eo().length>0,Ma=()=>o().filter(I=>fa().has(I.id)),Ia=I=>{const U=I.x/100*window.innerWidth,z=typeof I.y=="string"?parseFloat(I.y):I.y,ce={};window.innerHeight-z-22-10<80&&(ce.top="auto",ce.bottom="calc(100% + 10px)");const Ce=U-200/2,Ie=10;if(Ce<Ie){const je=Ie-Ce;ce.left=`calc(50% + ${je}px)`}else if(Ce+200>window.innerWidth-Ie){const je=Ce+200-(window.innerWidth-Ie);ce.left=`calc(50% - ${je}px)`}return ce};return h(Oe,{get when(){return lt(()=>!!Se())()&&!l()},get children(){return h(qd,{get mount(){return document.body},get children(){var I=b(Xb),C=I.firstChild,L=C.firstChild,q=L.firstChild,Q=q.firstChild,[U,z]=S(Q.nextSibling),ce=U.nextSibling,[Ee,Ce]=S(ce.nextSibling),Ie=q.nextSibling,je=Ie.firstChild,gt=je.firstChild,rt=gt.nextSibling,pt=rt.firstChild,[$t,It]=S(pt.nextSibling),Qt=$t.nextSibling,$n=je.nextSibling,hn=$n.firstChild,mt=hn.nextSibling,st=mt.firstChild,[zt,Vt]=S(st.nextSibling),zn=zt.nextSibling,An=$n.nextSibling,To=An.firstChild,Zr=To.nextSibling,Yi=Zr.firstChild,[Vi,C_]=S(Yi.nextSibling),M_=Vi.nextSibling,Gs=An.nextSibling,Sr=Gs.firstChild,Js=Sr.nextSibling,I_=Js.firstChild,[Ra,R_]=S(I_.nextSibling),P_=Ra.nextSibling,Zs=Gs.nextSibling,go=Zs.firstChild,E_=go.firstChild,[Pa,T_]=S(E_.nextSibling),L_=Pa.nextSibling,[A_,B_]=S(L_.nextSibling),Ea=go.nextSibling,O_=Ea.firstChild,D_=O_.nextSibling,el=Zs.nextSibling,ei=el.firstChild,Ta=ei.nextSibling,F_=Ta.firstChild,N_=F_.nextSibling,Xi=el.nextSibling,qi=Xi.firstChild,z_=qi.nextSibling,[La,H_]=S(z_.nextSibling),j_=La.nextSibling,Aa=Xi.nextSibling,Ba=Aa.nextSibling,Qi=Ba.firstChild,Oa=Qi.nextSibling,U_=Oa.firstChild,W_=U_.nextSibling,Y_=Ie.nextSibling,[Da,V_]=S(Y_.nextSibling),X_=Da.nextSibling,[q_,Q_]=S(X_.nextSibling),K_=C.nextSibling,[Fa,G_]=S(K_.nextSibling),J_=Fa.nextSibling,[Na,Z_]=S(J_.nextSibling),eh=Na.nextSibling,[za,th]=S(eh.nextSibling),nh=za.nextSibling,[Ha,oh]=S(nh.nextSibling),Ki=Ha.nextSibling,tl=Ki.nextSibling,nl=tl.nextSibling,rh=nl.nextSibling,[ih,sh]=S(rh.nextSibling);return uo(w=>u=w,I),L.$$mousedown=S_,Br(L,"click",t()?void 0:w=>{if(Vs){Vs=!1,w.preventDefault();return}n(!0)},!0),y(q,h(o5,{size:24}),U,z),y(q,h(Oe,{get when(){return k_()},get children(){var w=b(xo);return y(w,()=>Eo().length),ie(()=>M(w,`${ne.badge} ${t()?ne.fadeOut:""} ${Hr()?ne.entrance:""}`)),w}}),Ee,Ce),Ie.addEventListener("mouseleave",Ti),Ie.addEventListener("mouseenter",Ei),gt.$$click=w=>{w.stopPropagation(),ln(),Sa()},y(gt,h(a5,{size:24,get isPaused(){return H()}})),y(rt,()=>H()?"Resume animations":"Pause animations",$t,It),hn.$$click=w=>{w.stopPropagation(),ln(),to()&&pr(!1),F()&&se(!1),R()&&Qs(),ae()?Hi():He(!0)},y(hn,h(p5,{size:21})),y(mt,()=>ae()?"Exit layout mode":"Layout mode",zt,Vt),To.$$click=w=>{w.stopPropagation(),ln(),s(!i())},y(To,h(l5,{size:24,get isOpen(){return i()}})),y(Zr,()=>i()?"Hide markers":"Show markers",Vi,C_),Sr.$$click=w=>{w.stopPropagation(),ln(),ka()},y(Sr,h(i5,{size:24,get copied(){return ee()},get tint(){return ae()&&ct()&&(Me().length>0||Ve()?.sections?.length)?"#f97316":void 0}})),y(Js,()=>ae()&&ct()?"Copy layout":"Copy feedback",Ra,R_),go.$$click=w=>{w.stopPropagation(),ln(),Ca()},y(go,h(s5,{size:24,get state(){return K()}}),Pa,T_),y(go,h(Oe,{get when(){return lt(()=>!!Jr())()&&K()==="idle"},get children(){var w=b(xo);return y(w,()=>o().length),ie(()=>M(w,ne.buttonBadge)),w}}),A_,B_),ei.$$click=w=>{w.stopPropagation(),ln(),Wi()},y(ei,h(d5,{size:24})),qi.$$click=w=>{w.stopPropagation(),ln(),ae()&&Hi(),se(!F())},y(qi,h(c5,{size:24})),y(Xi,h(Oe,{get when(){return lt(()=>!!e.endpoint)()&&oo()!=="disconnected"},get children(){var w=b(xo);return ie(tt=>{var _t=`${ne.mcpIndicator} ${ne[oo()]} ${F()?ne.hidden:""}`,Ge=oo()==="connected"?"MCP Connected":"MCP Connecting...";return _t!==tt.e&&M(w,tt.e=_t),Ge!==tt.t&&O(w,"title",tt.t=Ge),tt},{e:void 0,t:void 0}),w}}),La,H_),Qi.$$click=w=>{w.stopPropagation(),ln(),qs()},y(Qi,h(u5,{size:24})),y(L,h(V2,{get visible(){return lt(()=>!!ae())()&&t()},get activeType(){return wt()},onSelect:w=>{Ne(wt()===w?null:w)},get isDarkMode(){return Fn()},get sectionCount(){return Ve()?.sections.length??0},onDetectSections:()=>{const w=ov(),tt=Ve()?.sections??[],_t=new Set(tt.map(Ct=>Ct.selector)),Ge=w.filter(Ct=>!_t.has(Ct.selector)),Ze=[...tt,...Ge],an=[...Ve()?.originalOrder??[],...Ge.map(Ct=>Ct.id)];Wt({sections:Ze,originalOrder:an,detectedAt:Date.now()})},get placementCount(){return Me().length},onClearPlacements:()=>{At(w=>w+1),Mn(w=>w+1),bt(()=>{Wt({sections:[],originalOrder:[],detectedAt:Date.now()})},200)},get blankCanvas(){return ct()},onBlankCanvasChange:w=>{const tt={sections:[],originalOrder:[],detectedAt:Date.now()};w?(dt={rearrange:Ve(),placements:Me()},Wt(Yt.rearrange||tt),Ke(Yt.placements),Ne(null)):(Yt={rearrange:Ve(),placements:Me()},Wt(dt.rearrange||tt),Ke(dt.placements)),Xt(w)},get wireframePurpose(){return qt()},onWireframePurposeChange:Ut,Tooltip:nr,onDragStart:(w,tt)=>{tt.preventDefault();const _t=Re[w];let Ge=null,Ze=!1;const an=tt.clientX,Ct=tt.clientY,kt=tt.target.closest("[data-feedback-toolbar]")?.getBoundingClientRect().top??window.innerHeight,so=yn=>{const Hn=yn.clientX-an,jn=yn.clientY-Ct;if(!Ze&&(Math.abs(Hn)>4||Math.abs(jn)>4)&&(Ze=!0,Ge=document.createElement("div"),Ge.className=`${X.dragPreview}${ct()?` ${X.dragPreviewWireframe}`:""}`,document.body.appendChild(Ge)),!Ge)return;const Bn=Math.max(0,kt-yn.clientY),Xn=Math.min(1,Bn/180),In=1-Math.pow(1-Xn,2),ao=28,qn=20,ti=Math.min(140,_t.width*.18),kr=Math.min(90,_t.height*.18),Go=ao+(ti-ao)*In,fe=qn+(kr-qn)*In;Ge.style.width=`${Go}px`,Ge.style.height=`${fe}px`,Ge.style.left=`${yn.clientX-Go/2}px`,Ge.style.top=`${yn.clientY-fe/2}px`,Ge.style.opacity=`${.5+.5*In}`,Ge.textContent=In>.25?w:""},lo=yn=>{if(window.removeEventListener("mousemove",so),window.removeEventListener("mouseup",lo),Ge&&document.body.removeChild(Ge),Ze){const Hn=_t.width,jn=_t.height,Bn=window.scrollY,Xn=Math.max(0,yn.clientX-Hn/2),In=Math.max(0,yn.clientY+Bn-jn/2),ao={id:`dp-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,type:w,x:Xn,y:In,width:Hn,height:jn,scrollY:Bn,timestamp:Date.now()};Ke(qn=>[...qn,ao]),Ne(null),Vn=new Set,Cn(qn=>qn+1)}};window.addEventListener("mousemove",so),window.addEventListener("mouseup",lo)}}),Da,V_),y(L,h(nw,{get settings(){return Et()},onSettingsChange:w=>Li(tt=>({...tt,...w})),get isDarkMode(){return Fn()},onToggleTheme:Ai,isDevMode:Bi,get connectionStatus(){return oo()},get endpoint(){return e.endpoint},get isVisible(){return ge()},get toolbarNearBottom(){return lt(()=>!!_n())()&&_n().y<230},get settingsPage(){return le()},onSettingsPageChange:qe,onHideToolbar:y_}),q_,Q_),y(I,h(Oe,{get when(){return ae()||Pe()},get children(){var w=b(tr);return ie(tt=>{var _t=`${X.blankCanvas} ${Kt()?X.visible:""} ${Gt()?X.gridActive:""}`,Ge=Zt();return _t!==tt.e&&M(w,tt.e=_t),Ge!==tt.t&&E(w,"--canvas-opacity",tt.t=Ge),tt},{e:void 0,t:void 0}),w}}),Fa,G_),y(I,h(Oe,{get when(){return lt(()=>!!(ae()&&ct()))()&&Kt()},get children(){var w=b(Yb),tt=w.firstChild,_t=tt.firstChild,Ge=_t.nextSibling,Ze=tt.nextSibling,an=Ze.firstChild,Ct=an.nextSibling,rn=Ct.nextSibling;return Ge.$$input=kt=>un(Number(kt.target.value)),rn.$$click=()=>{At(kt=>kt+1),Wt({sections:[],originalOrder:[],detectedAt:Date.now()}),Yt={rearrange:null,placements:[]},Ut(""),cs(St)},ie(kt=>{var so=X.wireframeNotice,lo=X.wireframeOpacityRow,yn=X.wireframeOpacityLabel,Hn=X.wireframeOpacitySlider,jn=X.wireframeNoticeTitleRow,Bn=X.wireframeNoticeTitle,Xn=X.wireframeNoticeDivider,In=X.wireframeStartOver;return so!==kt.e&&M(w,kt.e=so),lo!==kt.t&&M(tt,kt.t=lo),yn!==kt.a&&M(_t,kt.a=yn),Hn!==kt.o&&M(Ge,kt.o=Hn),jn!==kt.i&&M(Ze,kt.i=jn),Bn!==kt.n&&M(an,kt.n=Bn),Xn!==kt.s&&M(Ct,kt.s=Xn),In!==kt.h&&M(rn,kt.h=In),kt},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0,h:void 0}),ie(()=>yo(Ge,"value",Zt())),Ft(),w}}),Na,Z_),y(I,h(Oe,{get when(){return ae()||Pe()},get children(){return h(H2,{get placements(){return Me()},onChange:Ke,get activeComponent(){return lt(()=>!!Pe())()?null:wt()},onActiveComponentChange:Ne,get isDarkMode(){return Fn()},get exiting(){return Pe()},onInteractionChange:ft,get passthrough(){return!wt()},get extraSnapRects(){return Ve()?.sections.map(w=>w.currentRect)},get deselectSignal(){return Tn()},get clearSignal(){return N()},get wireframe(){return ct()},onSelectionChange:(w,tt)=>{Vn=w,tt||(eo=new Set,Yn(_t=>_t+1))},onDragMove:(w,tt)=>{const _t=eo,Ge=Ve();if(!(!_t.size||!Ge)){if(!pn){pn=new Map;for(const Ze of Ge.sections)_t.has(Ze.id)&&pn.set(Ze.id,{x:Ze.currentRect.x,y:Ze.currentRect.y})}for(const Ze of Ge.sections){if(!_t.has(Ze.id)||!pn.get(Ze.id))continue;const Ct=document.querySelector(`[data-rearrange-section="${Ze.id}"]`);Ct&&(Ct.style.transform=`translate(${w}px, ${tt}px)`)}}},onDragEnd:(w,tt,_t)=>{const Ge=eo,Ze=pn;pn=null;const an=Ve();if(!(!Ge.size||!an||!Ze)){for(const Ct of Ge){const rn=document.querySelector(`[data-rearrange-section="${Ct}"]`);rn&&(rn.style.transform="")}_t&&Wt(Ct=>Ct&&{...Ct,sections:Ct.sections.map(rn=>{const kt=Ze.get(rn.id);return kt?{...rn,currentRect:{...rn.currentRect,x:Math.max(0,kt.x+w),y:Math.max(0,kt.y+tt)}}:rn})})}}})}}),za,th),y(I,h(Oe,{get when(){return lt(()=>!!(ae()||Pe()))()&&Ve()},get children(){return h(sv,{get rearrangeState(){return Ve()},onChange:Wt,get isDarkMode(){return Fn()},get exiting(){return Pe()},get blankCanvas(){return ct()},get extraSnapRects(){return Me().map(w=>({x:w.x,y:w.y,width:w.width,height:w.height}))},get clearSignal(){return en()},get deselectSignal(){return Dn()},onSelectionChange:(w,tt)=>{eo=w,tt||(Vn=new Set,Cn(_t=>_t+1))},onDragMove:(w,tt)=>{const _t=Vn;if(_t.size){if(!pn){pn=new Map;for(const Ge of Me())_t.has(Ge.id)&&pn.set(Ge.id,{x:Ge.x,y:Ge.y})}for(const Ge of _t){const Ze=document.querySelector(`[data-design-placement="${Ge}"]`);Ze&&(Ze.style.transform=`translate(${w}px, ${tt}px)`)}}},onDragEnd:(w,tt,_t)=>{const Ge=Vn,Ze=pn;if(pn=null,!(!Ge.size||!Ze)){for(const an of Ge){const Ct=document.querySelector(`[data-design-placement="${an}"]`);Ct&&(Ct.style.transform="")}_t&&Ke(an=>an.map(Ct=>{const rn=Ze.get(Ct.id);return rn?{...Ct,x:Math.max(0,rn.x+w),y:Math.max(0,rn.y+tt)}:Ct}))}}})}}),Ha,oh),uo(w=>Co=w,Ki),y(tl,h(Oe,{get when(){return _()},get children(){return[h(Ye,{get each(){return Eo().filter(w=>!w.isFixed)},children:(w,tt)=>{const _t=tt(),Ge=Eo().filter(Ze=>!Ze.isFixed);return h(wd,{annotation:w,get globalIndex(){return Eo().findIndex(Ze=>Ze.id===w.id)},layerIndex:_t,get layerSize(){return Ge.length},get isExiting(){return g()},get isClearing(){return ue()},get isAnimated(){return ha().has(w.id)},get isHovered(){return lt(()=>!g())()&&ye()===w.id},get isDeleting(){return de()===w.id},get isEditingAny(){return!!he()},get renumberFrom(){return oe()},get markerClickBehavior(){return Et().markerClickBehavior},get tooltipStyle(){return Ia(w)},onHoverEnter:Ze=>!g()&&Ze.id!==zi&&Ui(Ze),onHoverLeave:()=>Ui(null),onClick:Ze=>Et().markerClickBehavior==="delete"?Ks(Ze.id):ji(Ze),onContextMenu:ji})}}),h(Oe,{get when(){return!g()},get children(){return h(Ye,{get each(){return Ma().filter(w=>!w.isFixed)},children:w=>h($d,{annotation:w})})}})]}})),y(nl,h(Oe,{get when(){return _()},get children(){return[h(Ye,{get each(){return Eo().filter(w=>w.isFixed)},children:(w,tt)=>{const _t=tt(),Ge=Eo().filter(Ze=>Ze.isFixed);return h(wd,{annotation:w,get globalIndex(){return Eo().findIndex(Ze=>Ze.id===w.id)},layerIndex:_t,get layerSize(){return Ge.length},get isExiting(){return g()},get isClearing(){return ue()},get isAnimated(){return ha().has(w.id)},get isHovered(){return lt(()=>!g())()&&ye()===w.id},get isDeleting(){return de()===w.id},get isEditingAny(){return!!he()},get renumberFrom(){return oe()},get markerClickBehavior(){return Et().markerClickBehavior},get tooltipStyle(){return Ia(w)},onHoverEnter:Ze=>!g()&&Ze.id!==zi&&Ui(Ze),onHoverLeave:()=>Ui(null),onClick:Ze=>Et().markerClickBehavior==="delete"?Ks(Ze.id):ji(Ze),onContextMenu:ji})}}),h(Oe,{get when(){return!g()},get children(){return h(Ye,{get each(){return Ma().filter(w=>w.isFixed)},children:w=>h($d,{annotation:w,fixed:!0})})}})]}})),y(I,h(Oe,{get when(){return t()},get children(){var w=b(Vb),tt=w.firstChild,[_t,Ge]=S(tt.nextSibling),Ze=_t.nextSibling,[an,Ct]=S(Ze.nextSibling),rn=an.nextSibling,[kt,so]=S(rn.nextSibling),lo=kt.nextSibling,[yn,Hn]=S(lo.nextSibling),jn=yn.nextSibling,[Bn,Xn]=S(jn.nextSibling),In=Bn.nextSibling,[ao,qn]=S(In.nextSibling),ti=ao.nextSibling,[kr,Go]=S(ti.nextSibling);return y(w,h(Oe,{get when(){return lt(()=>!!(f()?.rect&&!R()&&!it()))()&&!Ko()},get children(){return(()=>{const fe=f();return(()=>{var we=b(qb);return ie($e=>{var Ae=`${ne.hoverHighlight} ${ne.enter}`,Ue=`${fe.rect.left}px`,Rt=`${fe.rect.top}px`,xt=`${fe.rect.width}px`,Je=`${fe.rect.height}px`;return Ae!==$e.e&&M(we,$e.e=Ae),Ue!==$e.t&&E(we,"left",$e.t=Ue),Rt!==$e.a&&E(we,"top",$e.a=Rt),xt!==$e.o&&E(we,"width",$e.o=xt),Je!==$e.i&&E(we,"height",$e.i=Je),$e},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0}),we})()})()}}),_t,Ge),y(w,h(Ye,{get each(){return no().filter(fe=>document.contains(fe.element))},children:fe=>{const we=fe.element.getBoundingClientRect(),$e=no().length>1;return(()=>{var Ae=b(Qb);return ie(Ue=>{var Rt=$e?ne.multiSelectOutline:ne.singleSelectOutline,xt={left:`${we.left}px`,top:`${we.top}px`,width:`${we.width}px`,height:`${we.height}px`,...$e?{}:{"border-color":"color-mix(in srgb, var(--agentation-color-accent) 60%, transparent)","background-color":"color-mix(in srgb, var(--agentation-color-accent) 5%, transparent)"}};return Rt!==Ue.e&&M(Ae,Ue.e=Rt),Ue.t=gn(Ae,xt,Ue.t),Ue},{e:void 0,t:void 0}),Ae})()}}),an,Ct),y(w,h(Oe,{get when(){return lt(()=>!!ye())()&&!R()},get children(){return(()=>{const fe=()=>o().find(we=>we.id===ye());return h(Oe,{get when(){return fe()?.boundingBox},get children(){return(()=>{const we=fe();if(we.elementBoundingBoxes?.length)return B().length>0?h(Ye,{get each(){return B().filter(xt=>document.contains(xt))},children:xt=>{const Je=xt.getBoundingClientRect();return(()=>{var yt=b(sn);return ie(Ot=>{var Qn=`${ne.multiSelectOutline} ${ne.enter}`,Kn=`${Je.left}px`,Lo=`${Je.top}px`,Ao=`${Je.width}px`,ni=`${Je.height}px`;return Qn!==Ot.e&&M(yt,Ot.e=Qn),Kn!==Ot.t&&E(yt,"left",Ot.t=Kn),Lo!==Ot.a&&E(yt,"top",Ot.a=Lo),Ao!==Ot.o&&E(yt,"width",Ot.o=Ao),ni!==Ot.i&&E(yt,"height",Ot.i=ni),Ot},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0}),yt})()}}):h(Ye,{get each(){return we.elementBoundingBoxes},children:xt=>(()=>{var Je=b(sn);return ie(yt=>{var Ot=`${ne.multiSelectOutline} ${ne.enter}`,Qn=`${xt.x}px`,Kn=`${xt.y-Le()}px`,Lo=`${xt.width}px`,Ao=`${xt.height}px`;return Ot!==yt.e&&M(Je,yt.e=Ot),Qn!==yt.t&&E(Je,"left",yt.t=Qn),Kn!==yt.a&&E(Je,"top",yt.a=Kn),Lo!==yt.o&&E(Je,"width",yt.o=Lo),Ao!==yt.i&&E(Je,"height",yt.i=Ao),yt},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0}),Je})()});const $e=_e(),Ae=$e&&document.contains($e)?$e.getBoundingClientRect():null,Ue=Ae?{x:Ae.left,y:Ae.top,width:Ae.width,height:Ae.height}:{x:we.boundingBox.x,y:we.isFixed?we.boundingBox.y:we.boundingBox.y-Le(),width:we.boundingBox.width,height:we.boundingBox.height},Rt=we.isMultiSelect;return(()=>{var xt=b(sn);return ie(Je=>{var yt=`${Rt?ne.multiSelectOutline:ne.singleSelectOutline} ${ne.enter}`,Ot={left:`${Ue.x}px`,top:`${Ue.y}px`,width:`${Ue.width}px`,height:`${Ue.height}px`,...Rt?{}:{"border-color":"color-mix(in srgb, var(--agentation-color-accent) 60%, transparent)","background-color":"color-mix(in srgb, var(--agentation-color-accent) 5%, transparent)"}};return yt!==Je.e&&M(xt,Je.e=yt),Je.t=gn(xt,Ot,Je.t),Je},{e:void 0,t:void 0}),xt})()})()}})})()}}),kt,so),y(w,h(Oe,{get when(){return lt(()=>!!(f()&&!R()&&!it()))()&&!Ko()},get children(){return(()=>{const fe=f(),we=k();return(()=>{var $e=b(Kb),Ae=$e.firstChild,[Ue,Rt]=S(Ae.nextSibling),xt=Ue.nextSibling;return y($e,h(Oe,{get when(){return fe.reactComponents},get children(){var Je=b(sn);return y(Je,()=>fe.reactComponents),ie(()=>M(Je,ne.hoverReactPath)),Je}}),Ue,Rt),y(xt,()=>fe.elementName),ie(Je=>{var yt=`${ne.hoverTooltip} ${ne.enter}`,Ot=`${Math.max(8,Math.min(we.x,window.innerWidth-100))}px`,Qn=`${Math.max(we.y-(fe.reactComponents?48:32),8)}px`,Kn=ne.hoverElementName;return yt!==Je.e&&M($e,Je.e=yt),Ot!==Je.t&&E($e,"left",Je.t=Ot),Qn!==Je.a&&E($e,"top",Je.a=Qn),Kn!==Je.o&&M(xt,Je.o=Kn),Je},{e:void 0,t:void 0,a:void 0,o:void 0}),$e})()})()}}),yn,Hn),y(w,h(Oe,{get when(){return R()},get children(){return(()=>{const fe=R();return[lt(()=>lt(()=>!!fe.multiSelectElements?.length)()?h(Ye,{get each(){return fe.multiSelectElements.filter(we=>document.contains(we))},children:we=>{const $e=we.getBoundingClientRect();return(()=>{var Ae=b(sn);return ie(Ue=>{var Rt=`${ne.multiSelectOutline} ${Xr()?ne.exit:ne.enter}`,xt=`${$e.left}px`,Je=`${$e.top}px`,yt=`${$e.width}px`,Ot=`${$e.height}px`;return Rt!==Ue.e&&M(Ae,Ue.e=Rt),xt!==Ue.t&&E(Ae,"left",Ue.t=xt),Je!==Ue.a&&E(Ae,"top",Ue.a=Je),yt!==Ue.o&&E(Ae,"width",Ue.o=yt),Ot!==Ue.i&&E(Ae,"height",Ue.i=Ot),Ue},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0}),Ae})()}}):lt(()=>!!(fe.targetElement&&document.contains(fe.targetElement)))()?(()=>{const we=fe.targetElement.getBoundingClientRect();return(()=>{var $e=b(Gb);return ie(Ae=>{var Ue=`${ne.singleSelectOutline} ${Xr()?ne.exit:ne.enter}`,Rt=`${we.left}px`,xt=`${we.top}px`,Je=`${we.width}px`,yt=`${we.height}px`;return Ue!==Ae.e&&M($e,Ae.e=Ue),Rt!==Ae.t&&E($e,"left",Ae.t=Rt),xt!==Ae.a&&E($e,"top",Ae.a=xt),Je!==Ae.o&&E($e,"width",Ae.o=Je),yt!==Ae.i&&E($e,"height",Ae.i=yt),Ae},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0}),$e})()})():lt(()=>!!fe.boundingBox)()&&(()=>{var we=b(sn);return ie($e=>{var Ae=`${fe.isMultiSelect?ne.multiSelectOutline:ne.singleSelectOutline} ${Xr()?ne.exit:ne.enter}`,Ue={left:`${fe.boundingBox.x}px`,top:`${fe.boundingBox.y-Le()}px`,width:`${fe.boundingBox.width}px`,height:`${fe.boundingBox.height}px`,...fe.isMultiSelect?{}:{"border-color":"color-mix(in srgb, var(--agentation-color-accent) 60%, transparent)","background-color":"color-mix(in srgb, var(--agentation-color-accent) 5%, transparent)"}};return Ae!==$e.e&&M(we,$e.e=Ae),$e.t=gn(we,Ue,$e.t),$e},{e:void 0,t:void 0}),we})()),lt(()=>{const we=fe.x,$e=fe.isFixed?fe.y:fe.y-Le();return[h(Vv,{x:we,y:$e,get isMultiSelect(){return fe.isMultiSelect},get isExiting(){return Xr()}}),h(Ts,{ref:Ae=>xa=Ae,get element(){return fe.element},get selectedText(){return fe.selectedText},get computedStyles(){return fe.computedStylesObj},get placeholder(){return lt(()=>fe.element==="Area selection")()?"What should change in this area?":fe.isMultiSelect?"Feedback for this group of elements...":"What should change?"},onSubmit:v_,onCancel:Qs,get isExiting(){return Xr()},get lightMode(){return!Fn()},get accentColor(){return fe.isMultiSelect?"var(--agentation-color-green)":"var(--agentation-color-accent)"},get style(){return{left:`${Math.max(160,Math.min(window.innerWidth-160,we/100*window.innerWidth))}px`,...$e>window.innerHeight-290?{bottom:`${window.innerHeight-$e+20}px`}:{top:`${$e+20}px`}}}})]})]})()}}),Bn,Xn),y(w,h(Oe,{get when(){return he()},get children(){return(()=>{const fe=he();return[lt(()=>lt(()=>!!fe.elementBoundingBoxes?.length)()?Qe().length>0?h(Ye,{get each(){return Qe().filter(we=>document.contains(we))},children:we=>{const $e=we.getBoundingClientRect();return(()=>{var Ae=b(sn);return ie(Ue=>{var Rt=`${ne.multiSelectOutline} ${ne.enter}`,xt=`${$e.left}px`,Je=`${$e.top}px`,yt=`${$e.width}px`,Ot=`${$e.height}px`;return Rt!==Ue.e&&M(Ae,Ue.e=Rt),xt!==Ue.t&&E(Ae,"left",Ue.t=xt),Je!==Ue.a&&E(Ae,"top",Ue.a=Je),yt!==Ue.o&&E(Ae,"width",Ue.o=yt),Ot!==Ue.i&&E(Ae,"height",Ue.i=Ot),Ue},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0}),Ae})()}}):h(Ye,{get each(){return fe.elementBoundingBoxes},children:we=>(()=>{var $e=b(sn);return ie(Ae=>{var Ue=`${ne.multiSelectOutline} ${ne.enter}`,Rt=`${we.x}px`,xt=`${we.y-Le()}px`,Je=`${we.width}px`,yt=`${we.height}px`;return Ue!==Ae.e&&M($e,Ae.e=Ue),Rt!==Ae.t&&E($e,"left",Ae.t=Rt),xt!==Ae.a&&E($e,"top",Ae.a=xt),Je!==Ae.o&&E($e,"width",Ae.o=Je),yt!==Ae.i&&E($e,"height",Ae.i=yt),Ae},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0}),$e})()}):(()=>{const we=Xe(),$e=we&&document.contains(we)?we.getBoundingClientRect():null,Ae=$e?{x:$e.left,y:$e.top,width:$e.width,height:$e.height}:fe.boundingBox?{x:fe.boundingBox.x,y:fe.isFixed?fe.boundingBox.y:fe.boundingBox.y-Le(),width:fe.boundingBox.width,height:fe.boundingBox.height}:null;return Ae?(()=>{var Ue=b(sn);return ie(Rt=>{var xt=`${fe.isMultiSelect?ne.multiSelectOutline:ne.singleSelectOutline} ${ne.enter}`,Je={left:`${Ae.x}px`,top:`${Ae.y}px`,width:`${Ae.width}px`,height:`${Ae.height}px`,...fe.isMultiSelect?{}:{"border-color":"color-mix(in srgb, var(--agentation-color-accent) 60%, transparent)","background-color":"color-mix(in srgb, var(--agentation-color-accent) 5%, transparent)"}};return xt!==Rt.e&&M(Ue,Rt.e=xt),Rt.t=gn(Ue,Je,Rt.t),Rt},{e:void 0,t:void 0}),Ue})():null})()),h(Ts,{ref:we=>ba=we,get element(){return fe.element},get selectedText(){return fe.selectedText},get computedStyles(){return Z2(fe.computedStyles)},placeholder:"Edit your feedback...",get initialValue(){return fe.comment},submitLabel:"Save",onSubmit:w_,onCancel:$_,onDelete:()=>Ks(fe.id),get isExiting(){return m_()},get lightMode(){return!Fn()},get accentColor(){return fe.isMultiSelect?"var(--agentation-color-green)":"var(--agentation-color-accent)"},get style(){const we=fe.isFixed?fe.y:fe.y-Le();return{left:`${Math.max(160,Math.min(window.innerWidth-160,fe.x/100*window.innerWidth))}px`,...we>window.innerHeight-290?{bottom:`${window.innerHeight-we+20}px`}:{top:`${we+20}px`}}}})]})()}}),ao,qn),y(w,h(Oe,{get when(){return Ko()},get children(){return[(()=>{var fe=b(sn);return uo(we=>qr=we,fe),ie(()=>M(fe,ne.dragSelection)),fe})(),(()=>{var fe=b(sn);return uo(we=>Qr=we,fe),ie(()=>M(fe,ne.highlightsContainer)),fe})()]}}),kr,Go),ie(fe=>{var we=ne.overlay,$e=R()||he()?{"z-index":99999}:void 0;return we!==fe.e&&M(w,fe.e=we),fe.t=gn(w,$e,fe.t),fe},{e:void 0,t:void 0}),w}}),ih,sh),ie(w=>{var tt=Fn()?"dark":"light",_t=Et().annotationColorId,Ge=`${ne.toolbar}${e.class?` ${e.class}`:""}`,Ze=_n()?{left:`${_n().x}px`,top:`${_n().y}px`,right:"auto",bottom:"auto"}:void 0,an=`${ne.toolbarContainer} ${t()?ne.expanded:ne.collapsed} ${Hr()?ne.entrance:""} ${c()?ne.hiding:""} ${!Et().webhooksEnabled&&(co(Et().webhookUrl)||co(e.webhookUrl||""))?ne.serverConnected:""}`,Ct=t()?void 0:"button",rn=t()?-1:0,kt=t()?void 0:"Start feedback mode",so=`${ne.toggleContent} ${t()?ne.hidden:ne.visible}`,lo=`${ne.controlsContent} ${t()?ne.visible:ne.hidden} ${_n()&&_n().y<100?ne.tooltipBelow:""} ${Nt()||F()?ne.tooltipsHidden:""} ${Fr()?ne.tooltipsInSession:""}`,yn=`${ne.buttonWrapper} ${_n()&&_n().x<120?ne.buttonWrapperAlignLeft:""}`,Hn=ne.controlButton,jn=H(),Bn=ne.buttonTooltip,Xn=ne.shortcut,In=ne.buttonWrapper,ao=`${ne.controlButton} ${Fn()?"":ne.light}`,qn=ae(),ti=ae()&&ct()?{color:"#f97316",background:"rgba(249, 115, 22, 0.25)"}:void 0,kr=ne.buttonTooltip,Go=ne.shortcut,fe=ne.buttonWrapper,we=ne.controlButton,$e=!Jr()||ae(),Ae=ne.buttonTooltip,Ue=ne.shortcut,Rt=ne.buttonWrapper,xt=`${ne.controlButton} ${ee()?ne.statusShowing:""}`,Je=ae()&&ct()?Me().length===0&&!Ve()?.sections?.length:!Jr()&&ko().length===0&&Me().length===0&&!Ve()?.sections?.length,yt=ee(),Ot=ne.buttonTooltip,Qn=ne.shortcut,Kn=`${ne.buttonWrapper} ${ne.sendButtonWrapper} ${t()&&!Et().webhooksEnabled&&(co(Et().webhookUrl)||co(e.webhookUrl||""))?ne.sendButtonVisible:""}`,Lo=`${ne.controlButton} ${K()==="sent"||K()==="failed"?ne.statusShowing:""}`,Ao=!Jr()||!co(Et().webhookUrl)&&!co(e.webhookUrl||"")||K()==="sending",ni=K()==="sent"||K()==="failed",ja=co(Et().webhookUrl)||co(e.webhookUrl||"")?0:-1,Ua=ne.buttonTooltip,Wa=ne.shortcut,Ya=ne.buttonWrapper,Va=ne.controlButton,Xa=!Jr()&&ko().length===0&&Me().length===0&&!Ve()?.sections?.length,qa=ne.buttonTooltip,Qa=ne.shortcut,Ka=ne.buttonWrapper,Ga=ne.controlButton,Ja=ne.buttonTooltip,Za=ne.divider,ec=`${ne.buttonWrapper} ${_n()&&typeof window<"u"&&_n().x>window.innerWidth-120?ne.buttonWrapperAlignRight:""}`,tc=ne.controlButton,nc=ne.buttonTooltip,oc=ne.shortcut,rc=`${ne.drawCanvas} ${to()?ne.active:""}`,ic=va()?1:0,sc=ne.markersLayer,lc=ne.fixedMarkersLayer;return tt!==w.e&&O(I,"data-agentation-theme",w.e=tt),_t!==w.t&&O(I,"data-agentation-accent",w.t=_t),Ge!==w.a&&M(C,w.a=Ge),w.o=gn(C,Ze,w.o),an!==w.i&&M(L,w.i=an),Ct!==w.n&&O(L,"role",w.n=Ct),rn!==w.s&&O(L,"tabindex",w.s=rn),kt!==w.h&&O(L,"title",w.h=kt),so!==w.r&&M(q,w.r=so),lo!==w.d&&M(Ie,w.d=lo),yn!==w.l&&M(je,w.l=yn),Hn!==w.u&&M(gt,w.u=Hn),jn!==w.c&&O(gt,"data-active",w.c=jn),Bn!==w.w&&M(rt,w.w=Bn),Xn!==w.m&&M(Qt,w.m=Xn),In!==w.f&&M($n,w.f=In),ao!==w.y&&M(hn,w.y=ao),qn!==w.g&&O(hn,"data-active",w.g=qn),w.p=gn(hn,ti,w.p),kr!==w.b&&M(mt,w.b=kr),Go!==w.T&&M(zn,w.T=Go),fe!==w.A&&M(An,w.A=fe),we!==w.O&&M(To,w.O=we),$e!==w.I&&yo(To,"disabled",w.I=$e),Ae!==w.S&&M(Zr,w.S=Ae),Ue!==w.W&&M(M_,w.W=Ue),Rt!==w.C&&M(Gs,w.C=Rt),xt!==w.B&&M(Sr,w.B=xt),Je!==w.v&&yo(Sr,"disabled",w.v=Je),yt!==w.k&&O(Sr,"data-active",w.k=yt),Ot!==w.x&&M(Js,w.x=Ot),Qn!==w.j&&M(P_,w.j=Qn),Kn!==w.q&&M(Zs,w.q=Kn),Lo!==w.z&&M(go,w.z=Lo),Ao!==w.P&&yo(go,"disabled",w.P=Ao),ni!==w.H&&O(go,"data-no-hover",w.H=ni),ja!==w.F&&O(go,"tabindex",w.F=ja),Ua!==w.M&&M(Ea,w.M=Ua),Wa!==w.D&&M(D_,w.D=Wa),Ya!==w.R&&M(el,w.R=Ya),Va!==w.E&&M(ei,w.E=Va),Xa!==w.L&&yo(ei,"disabled",w.L=Xa),qa!==w.N&&M(Ta,w.N=qa),Qa!==w.G&&M(N_,w.G=Qa),Ka!==w.U&&M(Xi,w.U=Ka),Ga!==w.K&&M(qi,w.K=Ga),Ja!==w.V&&M(j_,w.V=Ja),Za!==w.Y&&M(Aa,w.Y=Za),ec!==w.J&&M(Ba,w.J=ec),tc!==w.Q&&M(Qi,w.Q=tc),nc!==w.Z&&M(Oa,w.Z=nc),oc!==w.X&&M(W_,w.X=oc),rc!==w._&&M(Ki,w._=rc),ic!==w.$&&E(Ki,"opacity",w.$=ic),sc!==w.te&&M(tl,w.te=sc),lc!==w.tt&&M(nl,w.tt=lc),w},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0,h:void 0,r:void 0,d:void 0,l:void 0,u:void 0,c:void 0,w:void 0,m:void 0,f:void 0,y:void 0,g:void 0,p:void 0,b:void 0,T:void 0,A:void 0,O:void 0,I:void 0,S:void 0,W:void 0,C:void 0,B:void 0,v:void 0,k:void 0,x:void 0,j:void 0,q:void 0,z:void 0,P:void 0,H:void 0,F:void 0,M:void 0,D:void 0,R:void 0,E:void 0,L:void 0,N:void 0,G:void 0,U:void 0,K:void 0,V:void 0,Y:void 0,J:void 0,Q:void 0,Z:void 0,X:void 0,_:void 0,$:void 0,te:void 0,tt:void 0}),Ft(),I}})}})}function rw(e={}){Lv();const t=bs();if(t&&Av(t),!ke.context)return Md(e);let n,o;return Pn(()=>{setTimeout(()=>{n=document.createElement("div"),n.style.display="contents",document.body.appendChild(n),o=Rl(()=>Md(e),n)},0)}),ot(()=>{o?.(),n?.remove()}),null}Vl(["click","input","keydown","mousedown","dblclick","contextmenu"]);const _a=a1({component:iw});function iw(){return(()=>{var e=b(),t=Uh(e.firstChild,"body"),n=t.firstChild,o=n.firstChild,[r,i]=S(o.nextSibling),s=r.nextSibling,[l,a]=S(s.nextSibling),c=n.nextSibling,d=c.nextSibling,[u,_]=S(d.nextSibling),m=u.nextSibling,[g,v]=S(m.nextSibling);return h(Vh,{}),y(n,h(Ps,{to:"/",children:"Home"}),r,i),y(n,h(Ps,{to:"/about",children:"About"}),l,a),y(c,h(ju,{})),y(t,h(rw,{}),u,_),y(t,h(L1,{}),g,v),e})()}const sw="modulepreload",lw=function(e){return"/"+e},Id={},g_=function(t,n,o){let r=Promise.resolve();if(n&&n.length>0){let a=function(c){return Promise.all(c.map(d=>Promise.resolve(d).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};document.getElementsByTagName("link");const s=document.querySelector("meta[property=csp-nonce]"),l=s?.nonce||s?.getAttribute("nonce");r=a(n.map(c=>{if(c=lw(c),c in Id)return;Id[c]=!0;const d=c.endsWith(".css"),u=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${u}`))return;const _=document.createElement("link");if(_.rel=d?"stylesheet":sw,d||(_.as="script"),_.crossOrigin="",_.href=c,l&&_.setAttribute("nonce",l),document.head.appendChild(_),d)return new Promise((m,g)=>{_.addEventListener("load",m),_.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${c}`)))})}))}function i(s){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=s,window.dispatchEvent(l),!l.defaultPrevented)throw s}return r.then(s=>{for(const l of s||[])l.status==="rejected"&&i(l.reason);return t().catch(i)})},aw=()=>g_(()=>import("./about-B2v5b-lm.js"),[]),cw=Es("/about")({component:zu(aw,"component")}),dw=()=>g_(()=>import("./index-Bo7Q_hvu.js"),[]),uw=Es("/")({component:zu(dw,"component")}),_w=cw.update({id:"/about",path:"/about",getParentRoute:()=>_a}),hw=uw.update({id:"/",path:"/",getParentRoute:()=>_a}),fw={IndexRoute:hw,AboutRoute:_w},gw=_a._addFileChildren(fw);function mw(){return b1({routeTree:gw,scrollRestoration:!0})}async function pw(){const e=await mw();let t;return t=[],window.__TSS_START_OPTIONS__={serializationAdapters:t},t.push(K1),e.options.serializationAdapters&&t.push(...e.options.serializationAdapters),e.update({basepath:"",serializationAdapters:t}),e.stores.matchesId.state.length||await J1(e),e}async function yw(){const e=await pw();return window.$_TSR?.h(),e}yw().then(e=>{qh(()=>h(A1,{router:e}),document)});export{S as a,ie as b,G as c,yo as d,Vl as e,b as g,y as i,Ft as r,E as s,$ as t};
