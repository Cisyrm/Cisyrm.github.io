document.addEventListener('DOMContentLoaded',()=>{
 const sections=[...document.querySelectorAll('.guide-article .g-section')];
 const links=[...document.querySelectorAll('.guide-side a')];
 if(!('IntersectionObserver' in window))return;
 const observed=new Map();
 const obs=new IntersectionObserver(entries=>{
   for(const e of entries)observed.set(e.target.id,e.intersectionRatio);
   const visible=[...observed.entries()].filter(([_,ratio])=>ratio>0).sort((a,b)=>b[1]-a[1]);
   if(visible.length){links.forEach(a=>{const active=a.getAttribute('href')==='#'+visible[0][0];a.classList.toggle('is-current',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})}
 },{rootMargin:'-95px 0px -42% 0px',threshold:[0,0.01,0.1,0.25,0.5,1]});
 sections.forEach(s=>obs.observe(s));
});
