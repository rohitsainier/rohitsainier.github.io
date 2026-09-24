import{l as e}from"./core.CjBb5-bT.js";import{n as t,r as n,t as r}from"./mini.DvFoL2gF.js";var i={h1:{css:`font-size: 30px;
font-weight: 600;
letter-spacing: -0.04em;
color: #171717;
margin: 8px 0 4px;`,tw:`text-3xl font-semibold
tracking-tighter text-neutral-900
mt-2 mb-1`,scss:`$ink: #171717;
h1 { font: 600 30px/1.1 $sans;
  letter-spacing: -.04em; color: $ink; }`,js:`{ fontSize: '30px', fontWeight: 600,
  letterSpacing: '-0.04em', color: '#171717' }`},btn:{css:`display: inline-flex;
padding: 10px 20px;
border-radius: 999px;
background: #ff5b22;
color: #fff;
font-weight: 600;`,tw:`inline-flex px-5 py-2.5
rounded-full bg-[#ff5b22]
text-white text-xs font-semibold`,scss:`.cta {
  @include pill(10px 20px);
  background: $signal; color: #fff;
}`,js:`{ display: 'inline-flex', padding: '10px 20px',
  borderRadius: 999, background: '#ff5b22' }`},card:{css:`padding: 10px;
border-radius: 10px;
background: #fff;
box-shadow: 0 0 0 1px #eceae4;
display: grid; gap: 2px;`,tw:`p-2.5 rounded-[10px] bg-white
ring-1 ring-[#eceae4] grid gap-0.5`,scss:`.card { padding: 10px;
  border-radius: 10px;
  box-shadow: 0 0 0 1px $line; }`,js:`{ padding: 10, borderRadius: 10,
  background: '#fff' }`}},a=e=>e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/^([\w-]+):/gm,`<span class="p">$1</span>:`);document.querySelectorAll(`[data-mini="stylesnap"]`).forEach(o=>{let s=e=>o.querySelector(e),c=s(`[data-page]`),l=s(`[data-box]`),u=s(`[data-tag]`),d=s(`[data-cursor-dot]`),f=s(`[data-code]`),p=s(`[data-copied]`),m=[...o.querySelectorAll(`[data-tab]`)],h=Object.fromEntries([...o.querySelectorAll(`[data-el]`)].map(e=>[e.dataset.el,e])),g=(t,n)=>{m.forEach(e=>e.classList.toggle(`is-on`,e.dataset.tab===t)),f.innerHTML=a(i[n][t]),e.from(f,{opacity:.2,duration:.3})},_=async(t,n)=>{let r=h[t];if(!r)return!1;let i=c.getBoundingClientRect(),a=r.getBoundingClientRect(),o=a.left-i.left,s=a.top-i.top;return await new Promise(t=>e.to(d,{x:o+a.width*.6,y:s+a.height*.55,duration:.8,ease:`power3.inOut`,onComplete:t})),n()?(e.to(l,{x:o,y:s,width:a.width,height:a.height,opacity:1,duration:.35,ease:`power3.out`}),u.textContent=`${r.tagName.toLowerCase()}.${t} · ${Math.round(a.width)}×${Math.round(a.height)}`,g(`css`,t),!0):!1},v=r(async t=>{e.set(p,{opacity:0});for(let r of[`h1`,`btn`,`card`]){if(!await _(r,t)||(await n(1100),!t()))return;if(r===`btn`){for(let e of[`tw`,`scss`,`js`])if(g(e,r),await n(900),!t())return;g(`tw`,r),e.fromTo(p,{opacity:0,y:4},{opacity:1,y:0,duration:.3}),await n(1300),e.to(p,{opacity:0,duration:.3})}}await n(600)});t(o,{start:()=>{e.set(d,{x:40,y:30}),v.start()},stop:v.stop,still:()=>{g(`tw`,`btn`)}})});