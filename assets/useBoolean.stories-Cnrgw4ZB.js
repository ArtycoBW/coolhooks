import{j as t}from"./jsx-runtime-DWbWqHZ-.js";import{r as m}from"./index-l2PZgWEW.js";const d=(n=!1)=>{const[s,u]=m.useState(n);return[s,p=>u(i=>p??!i)]},b="_wrapper_1gozl_1",x="_count_1gozl_8",_="_buttons_1gozl_14",e={wrapper:b,count:x,buttons:_},l=()=>{const[n,s]=d();return t.jsxs("div",{className:e.wrapper,children:[t.jsxs("p",{className:e.count,children:["Значение: ",t.jsx("code",{children:String(n)})]}),t.jsxs("div",{className:e.buttons,children:[t.jsx("button",{type:"button",onClick:()=>s(),className:e.button,children:"Переключить"}),t.jsx("button",{type:"button",onClick:()=>s(!0),className:e.button,children:"Установить (true)"}),t.jsx("button",{type:"button",onClick:()=>s(!1),className:e.button,children:"Установить (false)"})]})]})},N={title:"Хуки/useBoolean",component:l},g=()=>t.jsx(l,{}),o=g.bind({});var r,a,c;o.parameters={...o.parameters,docs:{...(r=o.parameters)==null?void 0:r.docs,source:{originalSource:"() => <Demo />",...(c=(a=o.parameters)==null?void 0:a.docs)==null?void 0:c.source}}};const w=["Default"];export{o as Default,w as __namedExportsOrder,N as default};
