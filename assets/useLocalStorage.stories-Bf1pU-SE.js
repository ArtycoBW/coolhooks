import{j as l}from"./jsx-runtime-DWbWqHZ-.js";import{r as i}from"./index-l2PZgWEW.js";const _="_wrapper_12jb8_1",L="_description_12jb8_8",N="_buttons_12jb8_14",g={wrapper:_,description:L,buttons:N};function m(o){try{return localStorage.getItem(o)}catch(t){return console.warn(t),null}}function S(o,t){try{localStorage.setItem(o,JSON.stringify(t))}catch(s){console.warn(s)}}function E(o){try{localStorage.removeItem(o)}catch(t){console.warn(t)}}function y(o){return window.addEventListener("storage",o),()=>window.removeEventListener("storage",o)}function O(){return null}function C(o,t){const s=()=>m(o),e=i.useSyncExternalStore(y,s,O),c=i.useCallback(n=>{try{const r=typeof n=="function"?n(JSON.parse(e??"null")):n;r==null?E(o):S(o,r)}catch(r){console.warn(r)}},[o,e]);return i.useEffect(()=>{m(o)===null&&typeof t<"u"&&S(o,t)},[o,t]),[e?JSON.parse(e):t,c]}function D(o,t,s){if(!o)return;const e=o.getContext("2d");if(!e)return;e.strokeStyle="white";let c=t?JSON.parse(t):[];c.length&&c.forEach(([r,u,d])=>{e==null||e.lineTo(r,u),d==="end"&&(e==null||e.stroke(),e==null||e.beginPath())});let a=!1,n=[];o.onmousedown=()=>{a=!0,e==null||e.beginPath()},o.onmousemove=r=>{if(!a)return;const u=o.getBoundingClientRect(),d=r.clientX-u.left,p=r.clientY-u.top;e==null||e.lineTo(d,p),e==null||e.stroke(),n.push([d,p,"move"])},o.onmouseup=()=>{a&&(a=!1,e==null||e.stroke(),e==null||e.closePath(),n.push([null,null,"end"]),s(JSON.stringify(n)),n=[])},o.onmouseout=()=>{a&&(a=!1,e==null||e.stroke(),e==null||e.closePath(),n.push([null,null,"end"]),s(JSON.stringify(n)),n=[])}}const j=()=>{const[o,t]=C("drawing",null),s=i.useRef(null),e=c=>{t(c)};return i.useEffect(()=>{D(s.current,o,e)},[o,e]),l.jsxs("section",{className:g.wrapper,children:[l.jsxs("div",{className:g.buttons,children:[l.jsx("button",{className:"link",onClick:()=>window.location.reload(),children:"Перегрузить страницу"}),l.jsx("button",{className:"link",onClick:()=>{window.localStorage.clear(),window.location.reload()},children:"Очистить Local Storage"})]}),l.jsxs("figure",{children:[l.jsx("canvas",{ref:s,width:400,height:400,style:{border:"1px solid red",borderRadius:"10px",backgroundColor:"#F37022"}}),l.jsx("figcaption",{style:{textAlign:"center",color:"#F37022",fontSize:"20px"},children:"(Нарисуйте что-нибудь)"})]})]})},v={title:"Хуки/useLocalStorage",component:j},I=()=>l.jsx(j,{}),f=I.bind({});var h,w,b;f.parameters={...f.parameters,docs:{...(h=f.parameters)==null?void 0:h.docs,source:{originalSource:"() => <Demo />",...(b=(w=f.parameters)==null?void 0:w.docs)==null?void 0:b.source}}};const P=["Default"];export{f as Default,P as __namedExportsOrder,v as default};
