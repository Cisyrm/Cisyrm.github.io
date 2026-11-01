(() => {
  const toggle=document.querySelector('.mobile-toggle');
  const links=document.querySelector('.nav-links');
  if(toggle&&links){toggle.addEventListener('click',()=>{const isOpen=links.classList.toggle('open');toggle.setAttribute('aria-expanded',String(isOpen));});}
  const data=window.SITE_DATA;
  const esc=(s)=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const srcText=(v)=>v==='没进'?'未入围':v==='进了'?'入围':v==='霸面进了'?'进入后续考核':v;
  const level=(row)=>row.result.includes('优营')?'warm':row.result.includes('候补')?'warm':row.entered.includes('没进')?'soft':'';
  const appBody=document.querySelector('#applicationBody');
  if(appBody && data){
    const input=document.querySelector('#applicationSearch'),filter=document.querySelector('#applicationFilter'),count=document.querySelector('#applicationCount');
    function render(){
      const query=input.value.trim().toLowerCase(), phase=filter.value;
      const chosen=data.applications.filter(a=>[a.name,a.institute,a.phase,a.entered,a.result].join(' ').toLowerCase().includes(query) && (!phase|| (phase==='未入围'?a.entered==='没进':phase==='入围'?a.entered!=='没进':a.result.includes(phase))));
      count.textContent=`显示 ${chosen.length} / ${data.applications.length} 项`;
      appBody.innerHTML=chosen.map(a=>`<tr><td>${esc(a.num)}</td><td><strong>${esc(a.name)}</strong><br><small>${esc(a.institute)}</small></td><td>${esc(a.phase)}</td><td><span class="tag ${level(a)}">${esc(srcText(a.entered))}</span></td><td>${esc(a.result||'—')}</td></tr>`).join('')||'<tr><td colspan="5" style="text-align:center;padding:30px;color:#698085">未找到匹配记录</td></tr>';
    }
    input.addEventListener('input',render);filter.addEventListener('change',render);render();
  }
  const qList=document.querySelector('#questionList');
  if(qList&&data){
    const qInput=document.querySelector('#questionSearch'),qCategory=document.querySelector('#questionCategory');
    const qCount=document.querySelector('#questionCount'),showMore=document.querySelector('#questionMore');
    const tabs=[...document.querySelectorAll('[data-questions-tab]')];
    const questions=data.general;
    let tab='general',limit=30;
    const schoolNames=[...new Set(questions.flatMap(q=>(q.sources||[]).map(v=>v.school)))].sort((a,b)=>a.localeCompare(b,'zh-CN'));
    const types=['正式面试','老师私面'];
    function categories(){
      const vals=tab==='school'?schoolNames:tab==='mode'?types:[...new Set(questions.map(q=>q.category))];
      const placeholder=tab==='school'?'全部学校':tab==='mode'?'全部面试类型':'全部知识板块';
      qCategory.innerHTML=`<option value="">${placeholder}</option>`+vals.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('');
    }
    function render(){
      const term=qInput.value.trim().toLowerCase(),category=qCategory.value;
      const rows=questions.filter(q=>{
        const schools=(q.sources||[]).map(o=>o.school);
        const ok= !category||(tab==='general'?q.category===category:tab==='school'?schools.includes(category):q.interview_type===category);
        const keywords=[q.text,q.category,q.subcategory,q.interview_type,...schools].join(' ').toLowerCase();
        return ok&&(!term||keywords.includes(term));
      });
      const label=tab==='school'?'按学校':tab==='mode'?'按面试类型':'按知识主题';
      qCount.textContent=`共 ${questions.length} 道题 · 当前显示 ${rows.length} 道（${label}）`;
      qList.innerHTML=rows.slice(0,limit).map((q,i)=>{
        const schools=[...new Set((q.sources||[]).map(s=>s.school))];
        const tags=tab==='school'?[...schools,q.category,q.interview_type]:tab==='mode'?[q.interview_type,q.category,...schools]:[q.category,q.subcategory,q.interview_type,...schools];
        return `<article class="question-card"><div class="q-index">${String(i+1).padStart(2,'0')}</div><div><p>${esc(q.text)}</p><div class="tags">${tags.filter(Boolean).map((t,j)=>`<span class="tag ${j>0?'soft':''}">${esc(t)}</span>`).join('')}</div></div></article>`;
      }).join('')||'<div class="empty">没有匹配的题目。可以更换关键词或筛选条件。</div>';
      showMore.classList.toggle('hidden',rows.length<=limit);
    }
    tabs.forEach(b=>b.addEventListener('click',()=>{
      tab=b.dataset.questionsTab;limit=30;
      tabs.forEach(x=>{let active=x===b;x.classList.toggle('active',active);x.setAttribute('aria-pressed',String(active))});
      qInput.value='';categories();render();
    }));
    qInput.addEventListener('input',()=>{limit=30;render()});qCategory.addEventListener('change',()=>{limit=30;render()});
    showMore.addEventListener('click',()=>{limit+=30;render()});categories();render();
    if(location.hash==='#by-school')tabs.find(b=>b.dataset.questionsTab==='school')?.click();
    else if(location.hash==='#by-mode')tabs.find(b=>b.dataset.questionsTab==='mode')?.click();
  }
})();

;(()=>{const pics=document.querySelectorAll('img.zoomable');if(!pics.length)return;const modal=document.createElement('div');modal.className='image-modal';modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-label','放大查看图片');const close=document.createElement('button');close.type='button';close.setAttribute('aria-label','关闭图片');close.textContent='×';const full=document.createElement('img');full.alt='';const caption=document.createElement('div');caption.className='modal-caption';modal.append(close,full,caption);document.body.append(modal);let last=null;function hide(){modal.classList.remove('is-open');document.body.style.overflow='';if(last)last.focus()}function show(im){last=im;full.src=im.currentSrc||im.src;full.alt=im.alt;caption.textContent=im.alt;modal.classList.add('is-open');document.body.style.overflow='hidden';close.focus()}for(const im of pics){im.addEventListener('click',()=>show(im));im.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();show(im)}})}close.addEventListener('click',hide);modal.addEventListener('click',e=>{if(e.target===modal)hide()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('is-open'))hide()})})();
