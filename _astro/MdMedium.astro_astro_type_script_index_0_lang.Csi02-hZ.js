import{l as e}from"./core.CjBb5-bT.js";import{n as t,r as n,t as r}from"./mini.DvFoL2gF.js";var i=`# How I notarized my Mac app

Selling outside the App Store means **notarization** — and it took me three tries.

> Sign first. Staple last.

\`\`\`bash
xcrun notarytool submit App.zip --wait
\`\`\`

---

Then Gumroad did the rest.`,a=e=>e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`),o=e=>{let t=[],n=e.split(/\n\n/);for(let e of n)if(e.startsWith("```")){let n=e.replace(/^```\w*\n?/,``).replace(/\n?```$/,``);t.push(`<pre>${a(n)}</pre>`)}else e.startsWith(`# `)?t.push(`<h1>${a(e.slice(2))}</h1>`):e.startsWith(`> `)?t.push(`<blockquote>${a(e.slice(2))}</blockquote>`):e.trim()===`---`?t.push(`<hr>`):e.trim()&&t.push(`<p>${a(e).replace(/\*\*(.+?)\*\*/g,`<strong>$1</strong>`)}</p>`);return t.join(``)},s=e=>a(e).replace(/^(# .*)$/gm,`<span class="h">$1</span>`).replace(/(\*\*.+?\*\*)/g,`<span class="e">$1</span>`).replace(/^(&gt; .*)$/gm,`<span class="q">$1</span>`);document.querySelectorAll(`[data-mini="mdtomedium"]`).forEach(a=>{let c=e=>a.querySelector(e),l=c(`[data-src]`),u=c(`[data-art]`),d=c(`[data-meta]`),f=c(`[data-copy]`),p=c(`[data-saved]`),m=(e,t=!0)=>{l.innerHTML=s(e)+(t?`<span class="cur"></span>`:``),u.innerHTML=o(e);let n=e.replace(/[#>*`-]/g,` `).split(/\s+/).filter(Boolean).length;d.textContent=`${n} words · ${Math.max(1,Math.ceil(n/230))} min read`},h=r(async t=>{f.textContent=`Copy for Medium`,f.classList.remove(`is-done`),p.textContent=`● Editing…`;for(let e=0;e<=i.length;e+=2){if(!t())return;m(i.slice(0,e)),await n(i[e]===`
`?90:22)}m(i,!1),p.textContent=`● Saved`,await n(900),t()&&(f.classList.add(`is-press`),await n(150),f.classList.remove(`is-press`),f.textContent=`Copied! ✓`,f.classList.add(`is-done`),e.fromTo(u,{backgroundColor:`rgba(26,137,23,0.12)`},{backgroundColor:`rgba(26,137,23,0)`,duration:1.2}),await n(2600))});t(a,{start:h.start,stop:h.stop,still:()=>m(i,!1)})});