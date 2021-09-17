var e=Object.defineProperty,t=Object.getOwnPropertySymbols,a=Object.prototype.hasOwnProperty,o=Object.prototype.propertyIsEnumerable,r=(t,a,o)=>a in t?e(t,a,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[a]=o,n=(e,n)=>{for(var l in n||(n={}))a.call(n,l)&&r(e,l,n[l]);if(t)for(var l of t(n))o.call(n,l)&&r(e,l,n[l]);return e};"undefined"!=typeof require&&require;import{r as l,a as s,l as i,w as c,t as d,b as p,i as u,c as h,f as m,e as g,d as b,g as f,h as y,j as v,k as C,F as k,m as D,n as x,o as w,p as V,q as $,s as _,u as I,v as H,x as O,y as z,z as R,A,B as L,C as S,D as E,E as M,G as U,H as N,I as j,J as B,K as F,L as q,M as T,N as P,O as K,P as J,Q as Y,R as G,S as Q,T as W,U as X,V as Z,W as ee,X as te,Y as ae,Z as oe,_ as re,$ as ne}from"./vendor.48f0122a.js";!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver((e=>{for(const a of e)if("childList"===a.type)for(const e of a.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&t(e)})).observe(document,{childList:!0,subtree:!0})}function t(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),"use-credentials"===e.crossorigin?t.credentials="include":"anonymous"===e.crossorigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();var le={palette:["#cccccc","#ff3b30","#ff9500","#ffcc00","#34c759","#5ac8fa","#007aff","#5856d6","#af52de","#000000"],dragging:l(!1),_defaultState:{baseCurrency:"RUB",heaps:{accounts:[{type:"accounts",title:"Безнал",color:{bg:"#007aff",border:"#007aff"},coins:[]},{type:"accounts",title:"Наличка",color:{bg:"#5ac8fa",border:"#5ac8fa"},coins:[]},{type:"accounts",title:"Валюта",color:{bg:"#34c759",border:"#34c759"},coins:[]}],allIncomesVsExpenses:[{type:"operations",title:"Все доходы",color:{bg:"#0491d1",border:"#0491d1"},coins:[]},{type:"operations",title:"Все расходы",color:{bg:"#e53935",border:"#e53935"},coins:[]}],incomes:[{type:"operations",title:"Первая куча доходов",color:{bg:"#0491d1",border:"#0491d1"},coins:[]},{type:"operations",title:"Вторая куча доходов",color:{bg:"#ffcc00",border:"#ffcc00"},coins:[]}],expenses:[{type:"operations",title:"Постоянные расходы",color:{bg:"#e53935",border:"#e53935"},coins:[]},{type:"operations",title:"Редкие",color:{bg:"#ff9500",border:"#ff9500"},coins:[]}]}},state:s({}),readonly:{},hasData:l(!1),async init(){let e;console.log("init");try{e=await i.getItem("sck-config"),console.log("initial",e)}catch(t){console.log({e:t})}this.state=s(n({},e||this._defaultState)),c((()=>this.state),(async e=>{console.log("state change observed",e),await i.setItem("sck-config",d(e))}),{deep:!0});try{this.readonly=await i.getItem("sck-data"),this.readonly?this.hasData.value=!0:this.readonly={},console.log("initial readonly user data",this.hasData.value,this.readonly)}catch(t){console.log({e:t})}},async setReadonly({timestamp:e,data:t}){var a,o,r,n,l,s,c,d;this.readonly.timestamp=e,this.readonly.operations=t.operations,this.readonly.incomes=t.incomes,this.readonly.accounts=t.accounts,this.readonly.expenses=t.expenses,this.readonly.tags=t.tags,this.updateCoins([...t.accounts,...t.incomes,...t.expenses]),0===(null==(n=null==(r=null==(o=null==(a=this.state.heaps)?void 0:a.allIncomesVsExpenses)?void 0:o[0])?void 0:r.coins)?void 0:n.length)&&0===(null==(d=null==(c=null==(s=null==(l=this.state.heaps)?void 0:l.allIncomesVsExpenses)?void 0:s[1])?void 0:c.coins)?void 0:d.length)&&this.fillDefaultHeaps(t.incomes,t.expenses),await i.setItem("sck-data",this.readonly),this.hasData.value=!0},updateCoins(e){for(let t of Object.keys(this.state.heaps))this.state.heaps[t].forEach((t=>{t.coins||(t.coins=[]),t.coins.forEach(((a,o)=>{t.coins[o]=e.find((e=>e.type===a.type&&e.id===a.id))}))}))},fillDefaultHeaps(e,t){this.state.heaps.allIncomesVsExpenses[0].coins=[...e],this.state.heaps.allIncomesVsExpenses[1].coins=[...t]},async clearReadonly(){this.readonly.timestamp=null,this.readonly.operations=null,this.readonly.incomes=null,this.readonly.accounts=null,this.readonly.expenses=null,this.readonly.tags=null,await i.removeItem("sck-data"),this.hasData.value=!1}},se=async(e,t={})=>{let a=Object.entries(t).map((([e,t])=>Array.isArray(t)?`${e}=${t.join(",")}`:`${e}=${t}`)).join("&");try{return(await fetch(`${e}?${a}`)).json()}catch(o){return{success:!1,error:o}}};const ie=new Date(2019,0,1),ce="yyyy-MM-dd",de="yyyy-MM";var pe={_base:"",_currencies:{},loaded:!1,async init(e="RUB",t=["USD","EUR"]){var a,o;await this._restore(),this._base!==e&&(this._base=e,p.exports.merge(this._currencies,await this._loadLatest(e,t),await this._loadHistory(e,t)));let r=Object.keys(this._currencies),n=t.filter((e=>!r.includes(e)));n.length&&p.exports.merge(this._currencies,await this._loadLatest(e,n),await this._loadHistory(e,n));for(let[l,{updatedAt:s,history:i={}}]of Object.entries(this._currencies)){u(new Date(s))||p.exports.merge(this._currencies,await this._loadLatest(e,[l]));let t=new Date(Object.keys(i).sort().reverse()[0]);h(t)||p.exports.merge(this._currencies,await this._loadHistory(e,[l],t)),null!=(a=this._currencies[l].history)[o=m(new Date,de)]||(a[o]=this._currencies[l].latest)}console.log("currencies init",this._currencies),await this._save(),this.loaded=!0},rate(e,t){var a;return t?null==(a=this._currencies[e])?void 0:a.history[t]:this._currencies[e].latest},_save(){return i.setItem("currencies",{base:this._base,currencies:this._currencies})},async _restore(){let{base:e="",currencies:t={}}=await i.getItem("currencies")||{};this._base=e,this._currencies=t},async _loadLatest(e,t){let a={},o=await se("https://api.exchangerate.host/latest",{base:e,symbols:t});return o.success?t.filter((e=>o.rates[e])).forEach((e=>{a[e]={latest:o.rates[e],updatedAt:Date.now()}})):console.warn("load latest problem:",o),a},async _loadHistory(e,t,a=ie){let o={};for(let n of t)o[n]={history:{}};let r=new Date;for(let n of g({start:a,end:r})){let a=n,l=b(n)?r:f(n),s=await se("https://api.exchangerate.host/timeseries",{base:e,symbols:t,start_date:m(a,ce),end_date:m(l,ce)});if(s.success){let e=y({start:a,end:l});for(let a of e){let e=s.rates[m(v(a),ce)]||{};for(let r of t)o[r].history[m(a,de)]=e[r]}}else console.warn("load history problem:",s)}return o}};const ue=1e3,he=10**6,me=e=>{if(isNaN(e))return"";let t=e<0?"–":"",a=Math.abs(e),o="";return a>=10*he?(a=(Math.round(100*a/he)/100).toString(),o="м"):a>=he?(a=(Math.round(1e3*a/he)/1e3).toString(),o="м"):a>=100*ue?(a=Math.round(a/ue).toString(),o="к"):a>=ue?(a=(Math.round(10*a/ue)/10).toString(),o="к"):a=a.toString(),`${t}${a.replace(".",",")}${o}`},ge=(e,t=1)=>{if(!e)return`rgba(128,128,128,${t})`;let[,a,o,r,n,l,s]=e.split("");return`rgba(${parseInt(`${a}${o}`,16)},${parseInt(`${r}${n}`,16)},${parseInt(`${l}${s}`,16)},${t})`};const be={name:"ChartPie",props:{data:{type:Array,required:!0},fieldTitle:{type:String,default:"title"},fieldValue:{type:String,default:"value"},fieldColor:{type:String,default:"color"}},computed:{palette:()=>le.palette,totalValue(){return this.data.reduce(((e,t)=>e+=t[this.fieldValue]),0)},sectors(){let e=0;return this.data.map((t=>{let a=this.round(100*t[this.fieldValue]/this.totalValue,2),o={offset:e,percent:a,value:t[this.fieldValue],title:t[this.fieldTitle],color:t[this.fieldColor]};return e+=o.percent,100===e&&a>0&&(o.percent+=1),o}))}},methods:{round:(e,t=0)=>Number.isNaN(e)?0:Math.round(e*10**t)/10**t,format:(e,t=" ")=>{if(isNaN(e))return"";let a=e<0?"–":"",o=Math.abs(e),r="",n="",l="";return o>=he&&(r=Math.floor(o/he)),o>=ue&&(n=Math.floor((o-r*he)/ue)),o>=he&&(n=n.toString().padStart(3,"0")),l=o-r*he-n*ue,o>=ue&&(l=l.toString().padStart(3,"0")),`${a}${r}${r?t:""}${n}${n?t:""}${l}`}}},fe={class:"pie-container"},ye={viewBox:"0 0 64 64",class:"pie"},ve=["stroke","stroke-dasharray","stroke-dashoffset"],Ce={class:"pie-legend"},ke={class:"pie-legend-value"},De={class:"pie-legend-value"},xe=x("span",{style:{"margin-left":"1.5px"}},"₽",-1);be.render=function(e,t,a,o,r,n){return w(),C("div",fe,[(w(),C("svg",ye,[(w(!0),C(k,null,D(n.sectors,((e,t)=>(w(),C("circle",{key:`circle-${t}`,r:"25%",cx:"50%",cy:"50%",stroke:e.color,"stroke-dasharray":`${n.round(e.percent,2)} 100`,"stroke-dashoffset":""+-n.round(e.offset,2)},null,8,ve)))),128))])),x("div",Ce,[(w(!0),C(k,null,D(n.sectors,((e,t)=>(w(),C(k,{key:`legend-${t}`},[x("div",{style:V({backgroundColor:e.color}),class:"pie-legend-color"},null,4),x("div",null,$(e.title),1),x("div",ke,$(n.round(100*e.value/n.totalValue,1))+"% ",1),x("div",De,[_($(n.format(n.round(e.value,0))),1),xe])],64)))),128))])])};const we={name:"Coin",props:{coin:{type:Object,required:!0}},methods:{onDragStart(e){le.dragging.value=!0,e.dataTransfer.setData("text",JSON.stringify(this.coin))},onDragEnd(){le.dragging.value=!1}}},Ve={class:"ck-coin__icon-wrapper"},$e=x("div",{class:"ck-coin__fill",style:{height:"100%"}},null,-1),_e={class:"ck-coin__title"};we.render=function(e,t,a,o,r,n){return w(),C("div",{class:I([`ck-coin_${a.coin.type}`,"ck-coin"]),draggable:"true",onDragstart:t[0]||(t[0]=(...e)=>n.onDragStart&&n.onDragStart(...e)),onDragend:t[1]||(t[1]=(...e)=>n.onDragEnd&&n.onDragEnd(...e))},[x("div",Ve,[$e,x("div",{class:I([`ck-coin__icon_${a.coin.icon.toLowerCase()}`,"ck-coin__icon"])},null,2)]),x("div",_e,$(a.coin.title),1)],34)};const Ie={name:"CoinsAccounts",components:{Coin:we},setup:()=>({accounts:H((()=>le.readonly.accounts))})},He={class:"coins-source"},Oe=x("h2",null,"Кошельки",-1),ze={class:"coins-container"};Ie.render=function(e,t,a,o,r,n){const l=O("Coin");return w(),C("div",He,[Oe,x("div",ze,[(w(!0),C(k,null,D(o.accounts,((e,t)=>(w(),z(l,{key:`inc-${t}`,coin:e},null,8,["coin"])))),128))])])};const Re={name:"Icon",props:{icon:{type:String,required:!0}}},Ae={xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",viewBox:"0 0 16 16"},Le=x("path",{d:"M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"},null,-1),Se=x("path",{"fill-rule":"evenodd",d:"M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"},null,-1),Ee=x("path",{d:"M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"},null,-1),Me=x("path",{"fill-rule":"evenodd",d:"M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"},null,-1),Ue={key:2,"fill-rule":"evenodd",d:"M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"},Ne={key:3,"fill-rule":"evenodd",d:"M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"};Re.render=function(e,t,a,o,r,n){return w(),C("svg",Ae,["edit"===a.icon?(w(),C(k,{key:0},[Le,Se],64)):R("",!0),"remove"===a.icon?(w(),C(k,{key:1},[Ee,Me],64)):R("",!0),"arrow-down"===a.icon?(w(),C("path",Ue)):R("",!0),"arrow-up"===a.icon?(w(),C("path",Ne)):R("",!0)])};const je={name:"HeapOfCoins",components:{Icon:Re,Coin:we},directives:{editor:{mounted(e){S(e.querySelector("a.show-editor"),{allowHTML:!0,content:e.querySelector("div"),hideOnClick:!0,interactive:!0,placement:"right-start",trigger:"click",onShown(e){e.popper.querySelector(".tippy-content input").focus()}})}}},props:{changeableColor:{type:Boolean,default:!1},editable:{type:Boolean,default:!1},modelValue:{type:Object,default:()=>({})},movable:{type:Boolean,default:!1},removable:{type:Boolean,default:!1},renameable:{type:Boolean,default:!1},titleColor:{type:String,default:"black"}},emits:["update:modelValue","remove","moveUp","moveDown"],setup(e,{emit:t}){let a=le.dragging,o=le.palette,r=l(!1),n=H({get:()=>e.modelValue,set:e=>t("update:modelValue",e)}),s=H((()=>{var t,a;return(null==(a=null==(t=e.modelValue)?void 0:t.color)?void 0:a.border)||o[0]})),i=H((()=>e.editable||e.renameable||e.removable||e.changeableColor));return{bgColor:s,palette:o,dragging:a,dragover:r,heap:n,showEditor:i,onDragEnter:()=>{r.value=!0},onDragLeave:()=>{r.value=!1},onDrop:t=>{t.preventDefault(),r.value=!1;let a=JSON.parse(t.dataTransfer.getData("text")),o=e.modelValue.coins.find((e=>e.id===a.id));("accounts"===e.modelValue.type&&"account"===a.type||"operations"===e.modelValue.type&&["income","expense"].includes(a.type))&&!o&&e.modelValue.coins.push(a)},remove:t=>{let a=e.modelValue.coins.findIndex((e=>e.id===t));-1!==a&&e.modelValue.coins.splice(a,1)},setColor:t=>{e.modelValue.color.border=t}}}};A("data-v-f9ace0e4");const Be={key:0},Fe={key:1},qe={key:2},Te={key:3},Pe={key:4},Ke={key:0},Je={key:1,class:"palette-grid"},Ye=["onClick"],Ge={key:2,style:{"margin-top":"1rem","text-align":"right"}},Qe=_(" Удалить кучу "),We={class:"dropzone coins-container"};L(),je.render=function(e,t,a,o,r,n){const l=O("Icon"),s=O("Coin"),i=E("editor");return w(),C("div",{class:"heap",style:V({borderColor:o.bgColor})},[x("div",{class:"heap-title",style:V({color:a.titleColor,backgroundColor:o.bgColor})},[x("h3",null,$(o.heap.title),1),a.movable?(w(),C("div",Be,[x("a",{href:"#",onClick:t[0]||(t[0]=M((t=>e.$emit("moveUp")),["prevent"]))},[U(l,{icon:"arrow-up"})])])):(w(),C("div",Fe)),a.movable?(w(),C("div",qe,[x("a",{href:"#",onClick:t[1]||(t[1]=M((t=>e.$emit("moveDown")),["prevent"]))},[U(l,{icon:"arrow-down"})])])):(w(),C("div",Te)),o.showEditor?N((w(),C("div",Pe,[x("a",{href:"#",class:"show-editor",onClick:t[2]||(t[2]=M((()=>{}),["prevent"]))},[U(l,{icon:"edit"})]),x("div",null,[a.editable||a.renameable?(w(),C("div",Ke,[N(x("input",{type:"text","onUpdate:modelValue":t[3]||(t[3]=e=>o.heap.title=e)},null,512),[[j,o.heap.title]])])):R("",!0),a.editable||a.changeableColor?(w(),C("div",Je,[(w(!0),C(k,null,D(o.palette,((e,t)=>(w(),C("div",{key:`c-${t}`,style:V({backgroundColor:e}),class:"palette-color",onClick:t=>o.setColor(e)},null,12,Ye)))),128))])):R("",!0),a.editable||a.removable?(w(),C("div",Ge,[x("button",{onClick:t[4]||(t[4]=t=>e.$emit("remove"))},[U(l,{icon:"remove"}),Qe])])):R("",!0)])],512)),[[i]]):R("",!0)],4),x("div",We,[N(x("div",{class:I(["dz-cover",{dragover:o.dragover}]),onDragenter:t[5]||(t[5]=(...e)=>o.onDragEnter&&o.onDragEnter(...e)),onDragleave:t[6]||(t[6]=(...e)=>o.onDragLeave&&o.onDragLeave(...e)),onDragover:t[7]||(t[7]=e=>e.preventDefault()),onDrop:t[8]||(t[8]=(...e)=>o.onDrop&&o.onDrop(...e))},null,34),[[B,o.dragging]]),(w(!0),C(k,null,D(o.heap.coins,(e=>(w(),z(s,{key:`money-acc-${e.id}`,coin:e,onClick:t=>o.remove(e.id)},null,8,["coin","onClick"])))),128))])],4)},je.__scopeId="data-v-f9ace0e4";const Xe={"01":"янв","02":"фев","03":"март","04":"апр","05":"май","06":"июнь","07":"июль","08":"авг","09":"сен",10:"окт",11:"ноя",12:"дек"},Ze=(e,t=2)=>e.toString().padStart(t,"0"),et=(e,t=!1)=>{let a=e.getFullYear();return t?a:a.toString()},tt=(e,t=!1)=>{let a=e.getMonth()+1;return t?a:Ze(a)},at=e=>`${et(e)}-${tt(e)}`,ot=(e,t)=>{let a=[],o=et(e,!0),r=tt(e,!0),n=et(t,!0),l=tt(t,!0);for(let s=o;s<=n;s++){let e=s===n?l:12;for(let t=s===o?r:1;t<=e;t++)a.push(`${s}-${Ze(t)}`)}return a},rt=(e,t=Xe)=>e.map(((e,a)=>{let[o,r]=e.split("-");return"01"===r||0===a?`${t[r]}\n${o}`:t[r]})),nt=(e,t)=>{let a={};for(let o of t)if(e.includes(o.source)||e.includes(o.destination)){let e=at(o.date.date);void 0===a[e]&&(a[e]=0),"in"===o.direction&&(a[e]+=o.value),"out"===o.direction&&(a[e]-=o.value)}return a},lt=(e,t)=>{let a=e.value,o=ot(t[0].date.date,t[t.length-1].date.date),r=o.length,n="";for(let l=t.length-1;l>=0;l--){let s=t[l];if(at(s.date.date)!==n)for(;r>0&&at(s.date.date)!==n;)r--,n=o[r],o[r]=[o[r],a];if(s.source===e.title&&(a+=s.currency===e.currency?s.value:s.value2),s.destination===e.title&&(a-=s.currency===e.currency?s.value:s.value2),Number.isNaN(a)){console.log(s);break}}return Object.fromEntries(o)},st={name:"AnalyzeAccounts",components:{ChartPie:be,Coin:we,CoinsAccounts:Ie,HeapOfCoins:je,BarChart:F.BarChart},setup(){let e=H((()=>le.state.heaps.accounts)),t=H((()=>e.value.map((e=>({title:e.title,color:e.color.border,value:e.coins.reduce(((e,t)=>{let a=t.currency===le.state.baseCurrency?1:pe.rate(t.currency);return e+=t.value/a}),0)}))))),a={responsive:!0,aspectRatio:3,layout:{padding:{right:20}},elements:{bar:{}},scales:{x:{id:"x-axis",type:"category",grid:{borderDash:[1,3],color:"rgba(128,128,128,0.4)",borderColor:"rgba(128,128,128,0.5)",tickColor:"rgba(128,128,128,0.5)",tickLength:5},ticks:{maxRotation:0,padding:5,autoSkip:!1}},y:{stacked:!0,type:"linear",min:0,grid:{borderDash:[1,2],color:"rgba(128,128,128,0.2)",borderColor:"rgba(128,128,128,0.5)",tickColor:"rgba(128,128,128,0.5)"},ticks:{callback:e=>me(e)},afterFit(e){e.width=50}}}},o=ot(le.readonly.operations[0].date.date,le.readonly.operations[le.readonly.operations.length-1].date.date),r={};for(let l of e.value)for(let e of l.coins){let t=lt(e,le.readonly.operations);if(e.currency!==le.state.baseCurrency)for(let[a,o]of Object.entries(t)){let r=pe.rate(e.currency,a);t[a]=Math.round(o/r)}for(let[e,a]of Object.entries(t))null!=r[e]||(r[e]=0),r[e]+=a}console.log({totals:r});let n=o.map((()=>null)),s=o.map((e=>r[e])),i=H((()=>({xLabels:rt(o),datasets:e.value.map((e=>{var t,a;let r=e.coins.map((e=>{let t=lt(e,le.readonly.operations);if(e.currency!==le.state.baseCurrency)for(let[a,o]of Object.entries(t)){let r=pe.rate(e.currency,a);t[a]=Math.round(o/r)}return t}));return{label:e.title,data:o.map((e=>r.reduce(((t,a)=>t+=a[e]),0))),grouped:!1,borderColor:e.color.border,backgroundColor:ge(null==(t=e.color)?void 0:t.border,.3),datalabels:{display(e){let t=e.chart.scales.y.max/e.chart.scales.y.maxHeight*15;return e.dataset.data[e.dataIndex]>t},color:null==(a=e.color)?void 0:a.border,anchor:"center",labels:{value:{align:"end",offset:-5,font:{size:11,weight:"bold"},formatter:(e,t)=>me(e)},percent:{align:"start",offset:-4,font:{size:9,weight:"normal"},formatter:(e,t)=>`${Math.round(100*e/s[t.dataIndex])}%`}}}}})).concat([{label:"",data:n,grouped:!1,skipNulls:!0,borderColor:"transparent",backgroundColor:"transparent",datalabels:{display:!0,color:"#777",backgroundColor:"transparent",borderRadius:3,padding:{top:1,bottom:0,left:3,right:3},anchor:"end",align:"end",offset:e=>e.chart.chartArea.height-15,font:{size:10,weight:"bold"},formatter:(e,t)=>me(s[t.dataIndex])}}])}))),c=l();return{heapsAccount:e,pieChartData:t,chartRef:c,chartOptions:a,chartData:i,addHeap:()=>{le.state.heaps.accounts.push({type:"accounts",title:"Куча",color:{},coins:[]})},moveHeapUp:e=>{if(e>0){let[t]=le.state.heaps.accounts.splice(e,1);le.state.heaps.accounts.splice(e-1,0,d(t))}},moveHeapDown:e=>{if(e<le.state.heaps.accounts.length-1){let[t]=le.state.heaps.accounts.splice(e,1);le.state.heaps.accounts.splice(e+1,0,d(t))}},removeHeap:e=>{le.state.heaps.accounts.splice(e,1)}}}},it=x("h2",null,"Анализ наличности",-1),ct={class:"analyze"};st.render=function(e,t,a,o,r,n){const l=O("HeapOfCoins"),s=O("BarChart"),i=O("ChartPie");return w(),C(k,null,[it,x("div",ct,[x("div",null,[(w(!0),C(k,null,D(o.heapsAccount,((e,t)=>(w(),C("div",{key:`h-ex-${t}`},[U(l,{modelValue:o.heapsAccount[t],"onUpdate:modelValue":e=>o.heapsAccount[t]=e,editable:"",movable:"",onMoveUp:e=>o.moveHeapUp(t),onMoveDown:e=>o.moveHeapDown(t),onRemove:e=>o.removeHeap(t)},null,8,["modelValue","onUpdate:modelValue","onMoveUp","onMoveDown","onRemove"])])))),128)),x("button",{onClick:t[0]||(t[0]=(...e)=>o.addHeap&&o.addHeap(...e))}," Добавить кучу ")]),x("div",null,[U(s,{ref:"chartRef","chart-data":o.chartData,options:o.chartOptions},null,8,["chart-data","options"]),U(i,{data:o.pieChartData},null,8,["data"])])])],64)};const dt=()=>window.matchMedia("(prefers-color-scheme: dark)").matches?"rgba(0, 0, 0, 0.4)":"rgba(255, 255, 255, 0.6)",pt={name:"AnalyzeExpenses",components:{HeapOfCoins:je,Coin:we,LineChart:F.LineChart},setup(){let e=H((()=>le.state.heaps.expenses)),t={responsive:!0,aspectRatio:3,layout:{padding:{right:20}},elements:{line:{tension:.2,fill:!0}},scales:{x:{id:"x-axis",type:"category",grid:{borderDash:[1,3],color:"rgba(128,128,128,0.4)",borderColor:"rgba(128,128,128,0.5)",tickColor:"rgba(128,128,128,0.5)",tickLength:5},ticks:{maxRotation:0,padding:5,autoSkip:!1}},y:{type:"linear",min:0,grid:{borderDash:[1,2],color:"rgba(128,128,128,0.2)",borderColor:"rgba(128,128,128,0.5)",tickColor:"rgba(128,128,128,0.5)"},ticks:{callback:e=>me(e)},afterFit(e){e.width=50}}}},a=ot(le.readonly.operations[0].date.date,le.readonly.operations[le.readonly.operations.length-1].date.date),o=H((()=>({xLabels:rt(a),datasets:e.value.map((e=>{let t=e.coins.map((e=>e.title)),o=nt(t,le.readonly.operations);return{label:e.title,data:a.map((e=>Math.abs(o[e]))),borderColor:e.color.border,backgroundColor:ge(e.color.border,.2),datalabels:{display:"auto",color:e.color.border,backgroundColor:dt(),borderRadius:3,padding:{top:1,bottom:0,left:3,right:3},align:"end",font:{size:11,weight:"bold"},formatter:e=>me(e)}}}))})));return{chartRef:l(),heapsExpenses:e,chartOptions:t,chartData:o,addHeap:()=>{le.state.heaps.expenses.push({type:"operations",title:"Куча",color:{},coins:[]})},removeHeap:e=>{le.state.heaps.expenses.splice(e,1)}}}},ut=x("h2",null,"Анализ расходов",-1),ht={class:"analyze"};pt.render=function(e,t,a,o,r,n){const l=O("HeapOfCoins"),s=O("LineChart");return w(),C(k,null,[ut,x("div",ht,[x("div",null,[(w(!0),C(k,null,D(o.heapsExpenses,((e,t)=>(w(),C("div",{key:`h-ex-${t}`},[U(l,{modelValue:o.heapsExpenses[t],"onUpdate:modelValue":e=>o.heapsExpenses[t]=e,editable:"",onRemove:e=>o.removeHeap(t)},null,8,["modelValue","onUpdate:modelValue","onRemove"])])))),128)),x("button",{onClick:t[0]||(t[0]=(...e)=>o.addHeap&&o.addHeap(...e))}," Добавить кучу ")]),U(s,{ref:"chartRef","chart-data":o.chartData,options:o.chartOptions},null,8,["chart-data","options"])])],64)};const mt={name:"AnalyzeIncomes",components:{HeapOfCoins:je,Coin:we,LineChart:F.LineChart},setup(){let e=H((()=>le.state.heaps.incomes)),t={responsive:!0,aspectRatio:3,layout:{padding:{right:20}},elements:{line:{tension:.2,fill:!0}},scales:{x:{id:"x-axis",type:"category",grid:{borderDash:[1,3],color:"rgba(128,128,128,0.4)",borderColor:"rgba(128,128,128,0.5)",tickColor:"rgba(128,128,128,0.5)",tickLength:5},ticks:{maxRotation:0,padding:5,autoSkip:!1}},y:{type:"linear",grid:{borderDash:[1,2],color:"rgba(128,128,128,0.2)",borderColor:"rgba(128,128,128,0.5)",tickColor:"rgba(128,128,128,0.5)"},ticks:{callback:e=>me(e)},afterFit(e){e.width=50}}}},a=ot(le.readonly.operations[0].date.date,le.readonly.operations[le.readonly.operations.length-1].date.date),o=H((()=>({xLabels:rt(a),datasets:e.value.map((e=>{let t=e.coins.map((e=>e.title)),o=nt(t,le.readonly.operations);return{label:e.title,data:a.map((e=>o[e])),borderColor:e.color.border,backgroundColor:ge(e.color.border,.2),datalabels:{display:"auto",color:e.color.border,backgroundColor:dt(),borderRadius:3,padding:{top:1,bottom:0,left:3,right:3},align:"end",font:{size:11,weight:"bold"},formatter:e=>me(e)}}}))})));return{chartRef:l(),heapsIncomes:e,chartOptions:t,chartData:o,addHeap:()=>{le.state.heaps.incomes.push({type:"operations",title:"Куча",color:{},coins:[]})},removeHeap:e=>{console.log("removeHeap",e),le.state.heaps.incomes.splice(e,1)}}}},gt=x("h2",null,"Анализ доходов",-1),bt={class:"analyze"};mt.render=function(e,t,a,o,r,n){const l=O("HeapOfCoins"),s=O("LineChart");return w(),C(k,null,[gt,x("div",bt,[x("div",null,[(w(!0),C(k,null,D(o.heapsIncomes,((e,t)=>(w(),C("div",{key:`h-in-${t}`},[U(l,{modelValue:o.heapsIncomes[t],"onUpdate:modelValue":e=>o.heapsIncomes[t]=e,editable:"",onRemove:e=>o.removeHeap(t)},null,8,["modelValue","onUpdate:modelValue","onRemove"])])))),128)),x("button",{onClick:t[0]||(t[0]=(...e)=>o.addHeap&&o.addHeap(...e))}," Добавить кучу ")]),U(s,{ref:"chartRef","chart-data":o.chartData,options:o.chartOptions},null,8,["chart-data","options"])])],64)};const ft={name:"AnalyzeIncomesVsExpenses",components:{HeapOfCoins:je,Coin:we,LineChart:F.LineChart,BarChart:F.BarChart},setup(){let e=H((()=>le.state.heaps.allIncomesVsExpenses)),t={responsive:!0,aspectRatio:3,layout:{padding:{right:20}},elements:{line:{tension:.2,fill:!0}},scales:{x:{id:"x-axis",type:"category",grid:{borderDash:[1,3],color:"rgba(128,128,128,0.4)",borderColor:"rgba(128,128,128,0.5)",tickColor:"rgba(128,128,128,0.5)",tickLength:5},ticks:{maxRotation:0,padding:5,autoSkip:!1}},y:{type:"linear",min:0,grid:{borderDash:[1,2],color:"rgba(128,128,128,0.2)",borderColor:"rgba(128,128,128,0.5)",tickColor:"rgba(128,128,128,0.5)"},ticks:{callback:e=>me(e)},afterFit(e){e.width=50}}}},a=ot(le.readonly.operations[0].date.date,le.readonly.operations[le.readonly.operations.length-1].date.date);console.log({monthAxis:a});let o=H((()=>({xLabels:rt(a),datasets:e.value.map((e=>{let t=e.coins.map((e=>e.title)),o=nt(t,le.readonly.operations);return{label:e.title,data:a.map((e=>Math.abs(o[e]))),borderColor:e.color.border,backgroundColor:ge(e.color.border,.2),datalabels:{display:"auto",color:e.color.border,backgroundColor:dt(),borderRadius:3,padding:{top:1,bottom:0,left:3,right:3},align:"end",font:{size:11,weight:"bold"},formatter:e=>me(e)}}}))})));console.log("income vs expenses chartData",o);let r={responsive:!0,aspectRatio:7,layout:{padding:{right:20}},scales:{x:{id:"x-axis",type:"category",grid:{borderDash:[1,3],color:"rgba(128,128,128,0.4)",borderColor:"rgba(128,128,128,0.5)",tickColor:"rgba(128,128,128,0.5)",tickLength:5},ticks:{maxRotation:0,padding:5,autoSkip:!1}},y:{stacked:!0,type:"linear",grid:{borderDash:[1,2],color:"rgba(128,128,128,0.2)",borderColor:"rgba(128,128,128,0.5)",tickColor:"rgba(128,128,128,0.5)"},ticks:{callback:e=>me(e)},afterFit(e){e.width=50}}},plugins:{legend:{display:!1}}},n=[...le.readonly.incomes.map((e=>e.title)),...le.readonly.expenses.map((e=>e.title))],s=nt(n,le.readonly.operations);console.log({balanceData:s});let i=H((()=>({xLabels:rt(a),datasets:[{label:"Доход",data:a.map((e=>s[e]>=0?s[e]:0)),grouped:!1,borderColor:"#34c759",backgroundColor:ge("#34c759",.2),datalabels:{display:e=>0!==e.dataset.data[e.dataIndex],color:"#34c759",borderRadius:3,padding:{top:1,bottom:0,left:3,right:3},anchor:"start",align:"start",font:{size:11,weight:"bold"},formatter:e=>me(e)}},{label:"Убыток",data:a.map((e=>s[e]<0?s[e]:0)),grouped:!1,borderColor:"#ff3b30",backgroundColor:ge("#ff3b30",.2),datalabels:{display:e=>0!==e.dataset.data[e.dataIndex],color:"#ff3b30",borderRadius:3,padding:{top:1,bottom:0,left:3,right:3},anchor:"end",align:"end",font:{size:11,weight:"bold"},formatter:e=>me(e)}}]}))),c=l(),d=l();return{chartRef:c,heaps:e,chartOptions:t,chartData:o,barChartRef:d,barChartOptions:r,barChartData:i}}},yt=x("h2",null,"Анализ доходов и расходов",-1),vt={class:"analyze"};ft.render=function(e,t,a,o,r,n){const l=O("HeapOfCoins"),s=O("LineChart"),i=O("BarChart");return w(),C(k,null,[yt,x("div",vt,[x("div",null,[(w(!0),C(k,null,D(o.heaps,((e,t)=>(w(),C("div",{key:`h-in-ex-${t}`},[U(l,{modelValue:o.heaps[t],"onUpdate:modelValue":e=>o.heaps[t]=e,"changeable-color":""},null,8,["modelValue","onUpdate:modelValue"])])))),128))]),x("div",null,[U(s,{ref:"chartRef","chart-data":o.chartData,options:o.chartOptions},null,8,["chart-data","options"]),U(i,{ref:"barChartRef","chart-data":o.barChartData,options:o.barChartOptions},null,8,["chart-data","options"])])])],64)};const Ct={name:"CoinsOperations",components:{Coin:we},setup:()=>({incomes:H((()=>le.readonly.incomes)),expenses:H((()=>le.readonly.expenses))})},kt={class:"coins-source"},Dt=x("h2",null,"Операции",-1),xt={class:"coins-container"},wt={class:"coins-container"};Ct.render=function(e,t,a,o,r,n){const l=O("Coin");return w(),C("div",kt,[Dt,x("div",xt,[(w(!0),C(k,null,D(o.incomes,((e,t)=>(w(),z(l,{key:`inc-${t}`,coin:e},null,8,["coin"])))),128))]),x("div",wt,[(w(!0),C(k,null,D(o.expenses,((e,t)=>(w(),z(l,{key:`inc-${t}`,coin:e},null,8,["coin"])))),128))])])};const Vt=new q;let $t;const _t=e=>'"'===e.charAt(0)?e.slice(1,-1):e,It=e=>Number('"'===e.charAt(0)?e.slice(1,-1):e),Ht=e=>{var t;let[a,o,r]=null==(t=_t(e))?void 0:t.split("/");return{year:Number(r),month:Number(a)-1,day:Number(o),date:new Date(Number(r),Number(a)-1,Number(o),3)}},Ot={"Название":{name:"title",number:!1},"Бюджет":{name:"budget",number:!0},"Получено":{name:"total",number:!0},"Иконка":{name:"icon",number:!1},"Валюта":{name:"currency",number:!1},"Текущее значение":{name:"value",number:!0}},zt=(e,t,a)=>{let o=e.shift().split(t).map(_t).map((e=>Ot[e])),r=[];for(let l of e){let e={type:a};for(let[a,r]of l.split(t).entries())e[o[a].name]=o[a].number?It(r):_t(r);e.id=(n=e.title,Vt.transform(n,"_").toLowerCase()),r.push(e)}var n;return r};const Rt={name:"UploadFile",data:()=>({dragover:!1}),emits:["import"],setup(){},methods:{onDrop(e){this.dragover=!1;let t=e.dataTransfer?e.dataTransfer.files[0]:e.target.files[0];if("text/csv"!==t.type)return void alert("Годятся только CSV-файлы");if(t.size>1048576)return void alert(`Файл великоват — ${t.size} байт,\nа можно максимум 1048576 байт`);let a=new FileReader;a.onload=()=>{let e=(e=>{var t;$t=e;let[a,o,r,n,l]=$t.split("\n\n\n");a=a.split("\n");let s=null==(t=null==a?void 0:a.shift())?void 0:t.split("=")[1];if(!s)return console.error("Separator of values not found"),!1;o=o.split("\n");let i=zt(o,s,"income");r=r.split("\n");let c=zt(r,s,"account");n=n.split("\n");let d=zt(n,s,"expense");l=l.split("\n");let p=zt(l,s,"tag");const u=(e,t)=>"Расход"===e?"out":i.find((e=>e.title===t))?"in":"transfer";a.shift();let h=[];for(let m of a){if(!m)break;let[e,t,a,o,r,n,l,s,i,c,d]=m.split('","');e=e.substring(1),d=d.slice(0,-1),h.push({date:Ht(e),direction:u(_t(t),_t(a)),source:_t(a),destination:_t(o),value:It(n),value2:It(s),currency:_t(l),currency2:_t(i),tags:_t(r).split(", "),comment:_t(d)})}return{incomes:i,accounts:c,expenses:d,tags:p,operations:h}})(a.result);this.$emit("import",{timestamp:t.lastModified,data:e})},a.readAsText(t)},openChooseFile(){this.$refs.fileInput.click()}}};A("data-v-393cb3f6");const At=x("p",null,[_(" Инструкция по экспорту данных: "),x("a",{href:"https://ruhelp.coinkeeper.me/4e4288b6e3ad4b349aab0e7b55d12d99",target:"_blank"}," ruhelp.coinkeeper.me/4e4288b6e3ad4b349aab0e7b55d12d99 ")],-1),Lt=x("p",null,"Сюда надо бросить csv-файл, эскспортированный из CoinKeeper'а.",-1);L(),Rt.render=function(e,t,a,o,r,n){return w(),C(k,null,[At,x("div",{class:I(["dropzone",{dragover:r.dragover}]),onDragover:t[1]||(t[1]=M((e=>r.dragover=!0),["prevent"])),onDragleave:t[2]||(t[2]=e=>r.dragover=!1),onDrop:t[3]||(t[3]=M(((...e)=>n.onDrop&&n.onDrop(...e)),["stop","prevent"])),onClick:t[4]||(t[4]=(...e)=>n.openChooseFile&&n.openChooseFile(...e))},[Lt,x("input",{ref:"fileInput",name:"csv",type:"file",onChange:t[0]||(t[0]=(...e)=>n.onDrop&&n.onDrop(...e))},null,544)],34)],64)},Rt.__scopeId="data-v-393cb3f6";const St={id:"labels-split",beforeInit(e){var t;null==(t=e.data.xLabels)||t.forEach(((e,t,a)=>{/\n/.test(e)&&(a[t]=e.split(/\n/))}))}};T.register(P,K,J,Y,G,Q,W,X,Z,ee,te,St);const Et={name:"App",components:{AnalyzeAccounts:st,AnalyzeExpenses:pt,AnalyzeIncomes:mt,AnalyzeIncomesVsExpenses:ft,CoinsAccounts:Ie,CoinsOperations:Ct,UploadFile:Rt},setup(){let e=l(!1),t=H((()=>le.readonly.timestamp?oe(new Date(le.readonly.timestamp),{addSuffix:!0,locale:re}):"")),a=l(!1);return ae((async()=>{await le.init(),await pe.init("RUB",["USD","EUR"]),a.value=pe.loaded,e.value=!0})),{appInitialized:e,dataExportedAgo:t,currenciesLoaded:a,hasData:le.hasData}},methods:{async clearData(){await le.clearReadonly()},reset:()=>confirm("Удалить всю инфу и настройки?\nБудут удалены все данные, кучи и их настройки цвета, названия прочее."),async onDataImport(e){console.log(e),await le.setReadonly(e)}}},Mt={key:0},Ut=x("h1",null,"Статистика из Coin Keeper",-1),Nt=_("   "),jt={class:"section"},Bt=x("hr",null,null,-1),Ft=x("hr",null,null,-1),qt=x("hr",null,null,-1),Tt={class:"section"},Pt=x("footer",null,[x("p",null," Все данные хранятся только в браузере и никуда не передаются. Сайт только загружается с сервера и больше с ним не взаимодействует. ")],-1);Et.render=function(e,t,a,o,r,n){const l=O("UploadFile"),s=O("CoinsOperations"),i=O("AnalyzeIncomesVsExpenses"),c=O("AnalyzeIncomes"),d=O("AnalyzeExpenses"),p=O("CoinsAccounts"),u=O("AnalyzeAccounts");return w(),C(k,null,[x("header",null,[x("div",null,[o.hasData?(w(),C("div",Mt," Данные экспортированы "+$(o.dataExportedAgo),1)):R("",!0)]),Ut,x("div",null,[o.hasData?(w(),C("button",{key:0,onClick:t[0]||(t[0]=(...e)=>n.clearData&&n.clearData(...e))}," Очистить только данные ")):R("",!0),Nt,o.hasData?(w(),C("button",{key:1,onClick:t[1]||(t[1]=(...e)=>n.reset&&n.reset(...e))}," Удалить всё ")):R("",!0)])]),x("main",null,[o.appInitialized?(w(),C(k,{key:0},[o.hasData?R("",!0):(w(),z(l,{key:0,onImport:n.onDataImport},null,8,["onImport"])),o.hasData?(w(),C(k,{key:1},[x("div",jt,[U(s),x("div",null,[U(i),Bt,U(c),Ft,U(d)])]),qt,x("div",Tt,[U(p),x("div",null,[U(u)])])],64)):R("",!0)],64)):R("",!0)]),Pt],64)};ne(Et).mount("#app");
