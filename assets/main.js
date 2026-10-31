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
  if(qList && data){
    const qInput=document.querySelector('#questionSearch');
    const qCategory=document.querySelector('#questionCategory');
    const qCount=document.querySelector('#questionCount');
    const showMore=document.querySelector('#questionMore');
    let tab='general',limit=30;
    const tabs=[...document.querySelectorAll('[data-questions-tab]')];
    function current(){return tab==='general'?data.general:data.school}
    function categories(){
      let vals=[...new Set(current().map(q=>tab==='general'?q.category:q.school))];
      qCategory.innerHTML=`<option value="">${tab==='general'?'全部知识板块':'全部学校'}</option>`+vals.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('');
    }
    function render(){
      let term=qInput.value.trim().toLowerCase(),category=qCategory.value;
      let rows=current().filter(q=>(!category||(tab==='general'?q.category:q.school)===category) && (!term||[q.text,q.subcategory,q.category,q.school,q.topic,q.source].join(' ').toLowerCase().includes(term)));
      qCount.textContent=`找到 ${rows.length} 道题 · ${tab==='general'?'通用版':'学校分类版'}`;
      qList.innerHTML=rows.slice(0,limit).map((q,i)=>{
        let tags=tab==='general'?[q.category,q.subcategory,q.source,q.frequency]:[q.school,q.mode,q.topic,q.frequency];
        return `<article class="question-card"><div class="q-index">${String(i+1).padStart(2,'0')}</div><div><p>${esc(q.text)}</p><div class="tags">${tags.filter(Boolean).slice(0,4).map((t,j)=>`<span class="tag ${j>0?'soft':''}">${esc(t)}</span>`).join('')}</div></div></article>`
      }).join('') || '<div class="empty">没有匹配的题目。可以更换关键词或筛选条件。</div>';
      showMore.classList.toggle('hidden',rows.length<=limit);
    }
    tabs.forEach(b=>b.addEventListener('click',()=>{tab=b.dataset.questionsTab;limit=30;tabs.forEach(x=>{let active=x===b;x.classList.toggle('active',active);x.setAttribute('aria-pressed',String(active));});qInput.value='';categories();render();}));
    qInput.addEventListener('input',()=>{limit=30;render()});qCategory.addEventListener('change',()=>{limit=30;render()});
    showMore.addEventListener('click',()=>{limit+=30;render()});categories();render();
    if(location.hash==='#by-school'){tabs[1]?.click()}
  }
})();

;(()=>{const pics=document.querySelectorAll('img.zoomable');if(!pics.length)return;const modal=document.createElement('div');modal.className='image-modal';modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-label','放大查看图片');const close=document.createElement('button');close.type='button';close.setAttribute('aria-label','关闭图片');close.textContent='×';const full=document.createElement('img');full.alt='';const caption=document.createElement('div');caption.className='modal-caption';modal.append(close,full,caption);document.body.append(modal);let last=null;function hide(){modal.classList.remove('is-open');document.body.style.overflow='';if(last)last.focus()}function show(im){last=im;full.src=im.currentSrc||im.src;full.alt=im.alt;caption.textContent=im.alt;modal.classList.add('is-open');document.body.style.overflow='hidden';close.focus()}for(const im of pics){im.addEventListener('click',()=>show(im));im.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();show(im)}})}close.addEventListener('click',hide);modal.addEventListener('click',e=>{if(e.target===modal)hide()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('is-open'))hide()})})();
