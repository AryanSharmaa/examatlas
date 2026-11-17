/* ExamAtlas UI. Dependency-free so it works as a static GitHub Pages site. */
(() => {
  'use strict';
  const { CATEGORIES, OPPORTUNITIES } = window.ExamAtlasData;
  const byId = id => document.getElementById(id);
  const DEFAULT_PROFILE = {stream:'PCM',year:'2027',stage:'appearing',location:'India',state:''};
  const safeGet = (key,fallback) => {try {const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback;}catch{return fallback;}};
  const safeSet = (key,value) => {try {localStorage.setItem(key,JSON.stringify(value));}catch {}};
  let saved = new Set(safeGet('ea-saved-v1',[]).filter(id=>OPPORTUNITIES.some(e=>e.id===id)));
  let profile = {...DEFAULT_PROFILE,...safeGet('ea-profile-v1',{})};
  let theme = safeGet('ea-theme-v1','light');
  let filters={q:'',category:'All',status:'all',stream:'all',type:'all',region:'all',sort:'relevant',layout:'grid'};
  let matchTab='aligned';
  let visibleCount=10;
  let categoriesExpanded=false;
  let currentView='discover';
  let lastView='discover';
  let selectedDay=null;
  let shownMonth=new Date(new Date().getFullYear(),new Date().getMonth(),1);
  let lastFocused=null;
  let toastTimer=null;
  const catByName = name=>CATEGORIES.find(c=>c.name===name)||{name,icon:'🎯',background:'#edf3f5'};
  const icon=(name,size='')=>`<svg class="icon" ${size?`style="width:${size}px;height:${size}px"`:''} aria-hidden="true"><use href="#i-${name}"></use></svg>`;
  const esc=str=>String(str??'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const numberDate=str=>{if(!str)return null;const [y,m,d]=str.split('-').map(Number);return new Date(y,m-1,d,12);};
  const isoDate=date=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  const today=()=>new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate(),12);
  const fmt=(str,long=false)=>str?new Intl.DateTimeFormat('en-IN',long?{day:'numeric',month:'short',year:'numeric'}:{day:'numeric',month:'short'}).format(numberDate(str)):'To be announced';
  const daysUntil=str=>str?Math.ceil((numberDate(str)-today())/86400000):null;
  const categoryColor = category=>catByName(category).background;
  const colorIcon=e=>`<span class="card-category-symbol" style="background:${categoryColor(e.category)}" aria-hidden="true">${catByName(e.category).icon}</span>`;
  const statusOf=e=>{
    if(!e.opens || !e.closes)return 'tba';
    if(daysUntil(e.closes)<0)return 'closed';
    if(daysUntil(e.opens)>0)return 'soon';
    return 'open';
  };
  const statusTitle={open:'Demo · Open',soon:'Demo · Upcoming',closed:'Demo · Closed',tba:'Dates TBA'};
  const getStatusBadge=e=>`<span class="status-badge ${statusOf(e)}">${statusTitle[statusOf(e)]}</span>`;
  const sorted=(items)=>[...items].sort((a,b)=>{
    if(filters.sort==='alphabetical')return a.name.localeCompare(b.name);
    if(filters.sort==='deadline')return (a.closes||'9999').localeCompare(b.closes||'9999');
    return Number(b.featured)-Number(a.featured) || ({open:0,soon:1,tba:2,closed:3}[statusOf(a)]-({open:0,soon:1,tba:2,closed:3}[statusOf(b)])) || (a.closes||'9999').localeCompare(b.closes||'9999');
  });

  function examCard(e){
    const isSaved=saved.has(e.id);
    const status=statusOf(e);
    let dateText=e.closes?fmt(e.closes):'Not announced';
    const hint=status==='open'&&daysUntil(e.closes)<=14?`<span class="card-hint">${icon('clock')} ${Math.max(0,daysUntil(e.closes))} days left*</span>`:'<span class="card-hint">*Sample dates</span>';
    return `<article class="exam-card">
      <div class="card-top">${colorIcon(e)}<button type="button" class="save-card-btn ${isSaved?'is-saved':''}" data-save="${esc(e.id)}" aria-label="${isSaved?'Remove':'Save'} ${esc(e.name)}" aria-pressed="${isSaved}">${icon('bookmark')}</button></div>
      <div class="card-meta">${esc(e.category)} · ${esc(e.organizer)}</div>
      <h3 class="card-title">${esc(e.name)}</h3><p class="card-description">${esc(e.description)}</p>
      <div class="card-badges">${getStatusBadge(e)}<span class="scope-badge">${esc(e.type)}</span></div>
      <div class="card-facts"><div class="card-fact"><span>Sample deadline</span><strong class="${e.closes?'':'no-date'}">${dateText}</strong></div><div class="card-fact"><span>Sample exam date</span><strong class="${e.exam?'':'no-date'}">${e.exam?fmt(e.exam):'Not announced'}</strong></div></div>
      <div class="card-bottom">${hint}<button class="card-link" type="button" data-open="${esc(e.id)}">View details ${icon('arrow')}</button></div>
    </article>`;
  }

  function countStatus(s){return OPPORTUNITIES.filter(e=>s==='all'||statusOf(e)===s).length;}
  function renderCategories(){
    byId('heroExamCount').textContent=OPPORTUNITIES.length;
    byId('heroCategoryCount').textContent=CATEGORIES.length;
    byId('categoryGrid').innerHTML=CATEGORIES.slice(0,categoriesExpanded?CATEGORIES.length:12).map(c=>{
      const count=OPPORTUNITIES.filter(e=>e.category===c.name).length;
      return `<button type="button" class="category-tile ${filters.category===c.name?'active':''}" data-category="${esc(c.name)}"><span class="category-emoji" style="background:${c.background}" aria-hidden="true">${c.icon}</span><strong>${esc(c.name)}</strong><small>${count} ${count===1?'path':'paths'} ${icon('arrow',11)}</small></button>`;
    }).join('');
    byId('showAllCategories').innerHTML=(categoriesExpanded?'Show fewer pathways':'Show more pathways')+' '+icon('arrow');
    byId('sideCategories').innerHTML=[{name:'All',icon:'✳'},...CATEGORIES].map(c=>{
      const count=c.name==='All'?OPPORTUNITIES.length:OPPORTUNITIES.filter(e=>e.category===c.name).length;
      return `<button type="button" class="side-category ${filters.category===c.name?'active':''}" data-category="${esc(c.name)}"><span>${c.icon}</span>${esc(c.name)}<span>${count}</span></button>`;
    }).join('');
  }
  function filteredExamList(){
    const q=filters.q.trim().toLowerCase();
    return sorted(OPPORTUNITIES.filter(e=>{
      if(q && ![e.name,e.organizer,e.category,e.description,e.type,...e.tags].join(' ').toLowerCase().includes(q))return false;
      if(filters.category!=='All'&&e.category!==filters.category)return false;
      if(filters.status!=='all'&&statusOf(e)!==filters.status)return false;
      if(filters.stream!=='all'&&!(e.streams.includes('Any')||e.streams.includes(filters.stream)))return false;
      if(filters.type!=='all'&&e.type!==filters.type)return false;
      if(filters.region!=='all'&&e.country!==filters.region)return false;
      return true;
    }));
  }
  function renderDiscover(){
    renderCategories();
    const statuses=[['all','All opportunities'],['open','Demo open'],['soon','Upcoming'],['tba','Dates TBA'],['closed','Past deadlines']];
    byId('statusTabs').innerHTML=statuses.map(([id,label])=>`<button class="status-tab ${filters.status===id?'active':''}" type="button" data-status="${id}" aria-pressed="${filters.status===id}">${label}<span>${countStatus(id)}</span></button>`).join('');
    const exams=filteredExamList();
    byId('resultsCount').textContent=exams.length;
    byId('examGrid').className='opportunity-grid'+(filters.layout==='list'?' list-layout':'');
    const shown=exams.slice(0,visibleCount);
    byId('examGrid').innerHTML=shown.map(examCard).join('');
    byId('resultsPagination').hidden=exams.length<=visibleCount;
    byId('shownCount').textContent=`Showing ${shown.length} of ${exams.length} opportunities`;
    byId('resultsEmpty').hidden=!!exams.length;
    byId('clearSearch').hidden=!filters.q;
    byId('gridLayoutBtn').classList.toggle('active',filters.layout==='grid');
    byId('listLayoutBtn').classList.toggle('active',filters.layout==='list');
    byId('gridLayoutBtn').setAttribute('aria-pressed',String(filters.layout==='grid'));
    byId('listLayoutBtn').setAttribute('aria-pressed',String(filters.layout==='list'));
    const pills=[];
    const add=(field,label)=>pills.push(`<span class="active-filter-pill">${esc(label)}<button type="button" data-clear-filter="${field}" aria-label="Remove ${esc(label)} filter">${icon('x')}</button></span>`);
    if(filters.category!=='All')add('category',filters.category);
    if(filters.stream!=='all')add('stream',filters.stream);
    if(filters.type!=='all')add('type',filters.type);
    if(filters.region!=='all')add('region',filters.region);
    if(filters.q)add('q',`Search: ${filters.q}`);
    byId('activeFilters').innerHTML=pills.join('');
    byId('examSearch').value=filters.q;
    byId('streamFilter').value=filters.stream;
    byId('typeFilter').value=filters.type;
    byId('regionFilter').value=filters.region;
    byId('sortSelect').value=filters.sort;
  }
  function resetFilters(){visibleCount=10;filters={q:'',category:'All',status:'all',stream:'all',type:'all',region:'all',sort:'relevant',layout:filters.layout};renderDiscover();}
  function updateSaved(){
    safeSet('ea-saved-v1',[...saved]);
    byId('navSavedCount').textContent=saved.size;
    byId('savedHeadingCount').textContent=`${saved.size} saved ${saved.size===1?'opportunity':'opportunities'}`;
    byId('savedGrid').innerHTML=OPPORTUNITIES.filter(e=>saved.has(e.id)).map(examCard).join('');
    byId('savedEmpty').hidden=saved.size>0;
    byId('clearSaved').hidden=saved.size===0;
    if(currentView==='discover')renderDiscover();
  }
  function toggleSave(id){
    const e=OPPORTUNITIES.find(item=>item.id===id);if(!e)return;
    const removing=saved.has(id);
    if(removing)saved.delete(id);else saved.add(id);
    updateSaved();
    if(!byId('modalLayer').hidden)renderDetail(e);
    toast(removing?'Removed from your saved paths':'Added to your saved paths');
  }

  function match(e){
    if(profile.location==='India'&&e.country==='International')return {group:'unmatched',reason:'Outside your current India-only location preference.'};
    if(!(e.streams.includes('Any')||e.streams.includes(profile.stream)))return {group:'unmatched',reason:'Your selected stream is not among the example subject pathways for this opportunity. Check alternatives and exceptions.'};
    if(e.state && (!profile.state||profile.state!==e.state))return {group:'review',reason:`State-specific conditions may apply (${e.state}). Verify residency and programme rules.`};
    if(e.category==='Government Jobs'||e.category==='Defence')return {group:'review',reason:'Age, nationality, physical standards or post-specific conditions may matter. More information is required.'};
    if(e.category==='Scholarships')return {group:'review',reason:'Eligibility is scheme-specific; income, marks, institution and category requirements must be checked.'};
    if(profile.stage==='passed' && Number(profile.year)<2026 && ['Engineering','Design','Management'].includes(e.category))return {group:'review',reason:'Qualifying-year and prior-attempt limits can matter for this pathway.'};
    return {group:'aligned',reason:`Your ${profile.stream} pathway is included in this opportunity's illustrative stream mapping. Other requirements remain unverified.`};
  }
  function renderMatches(){
    const groups={aligned:[],review:[],unmatched:[]};
    for(const e of OPPORTUNITIES)groups[match(e).group].push(e);
    byId('matchCount').textContent=groups.aligned.length+groups.review.length;
    byId('alignedCount').textContent=groups.aligned.length;
    byId('reviewCount').textContent=groups.review.length;
    byId('unmatchedCount').textContent=groups.unmatched.length;
    byId('matchSummary').textContent=`Based on ${profile.stream}, ${profile.stage==='appearing'?'appearing in':'passed in'} ${profile.year}, ${profile.location==='India'?'India only':'India + abroad'}. These are subject-alignment suggestions, not confirmed eligibility.`;
    byId('matchTabs').querySelectorAll('[data-match]').forEach(btn=>btn.classList.toggle('active',btn.dataset.match===matchTab));
    const entries=groups[matchTab];
    byId('matchResults').innerHTML=entries.length?entries.map(e=>{
      const m=match(e);
      return `<article class="match-item">${colorIcon(e)}<div><h3>${esc(e.name)}</h3><p>${esc(e.description)}</p><div class="match-reason ${m.group==='unmatched'?'neutral':''}">${m.group==='aligned'?'✦ Likely subject alignment · ':m.group==='review'?'ⓘ More details needed · ':'○ Other pathway · '}${esc(m.reason)}</div></div><button type="button" data-open="${esc(e.id)}">Details ${icon('arrow',13)}</button></article>`;
    }).join(''):'<div class="match-empty">No opportunities in this group for the selected profile. Adjust a preference to see more.</div>';
  }
  function syncProfile(){
    for(const key of ['stream','year','stage','location','state'])byId('profile'+key[0].toUpperCase()+key.slice(1)).value=profile[key];
  }
  function readProfile(){
    for(const key of ['stream','year','stage','location','state'])profile[key]=byId('profile'+key[0].toUpperCase()+key.slice(1)).value;
    safeSet('ea-profile-v1',profile);
    renderMatches();
  }

  function eventList(){
    const events=[];
    for(const e of OPPORTUNITIES){
      for(const [prop,type,label] of [['opens','open','Application opens'],['closes','close','Application deadline'],['exam','exam','Exam day']]){
        if(e[prop])events.push({date:e[prop],type,label,exam:e});
      }
    }
    return events.sort((a,b)=>a.date.localeCompare(b.date));
  }
  function renderCalendar(){
    const y=shownMonth.getFullYear(),m=shownMonth.getMonth();
    byId('calendarMonth').textContent=new Intl.DateTimeFormat('en-IN',{month:'long',year:'numeric'}).format(shownMonth);
    const first=new Date(y,m,1),firstWeekday=first.getDay();
    const events=eventList();
    let html='';
    for(let n=0;n<42;n++){
      const date=new Date(y,m,1-firstWeekday+n,12),day=isoDate(date),isOther=date.getMonth()!==m;
      const dayEvents=events.filter(ev=>ev.date===day);
      html+=`<button class="calendar-day ${isOther?'outside':''} ${day===isoDate(today())?'today':''} ${day===selectedDay?'selected':''}" type="button" data-date="${day}" aria-label="${esc(fmt(day,true))}: ${dayEvents.length} demo events"><span class="day-number">${date.getDate()}</span>${dayEvents.slice(0,2).map(ev=>`<span class="calendar-event-chip ${ev.type}">${esc(ev.exam.name)}</span>`).join('')}${dayEvents.length>2?`<span class="calendar-more">+${dayEvents.length-2} more</span>`:''}</button>`;
    }
    byId('calendarDays').innerHTML=html;
    const monthEvents=events.filter(ev=>{const d=numberDate(ev.date);return d.getFullYear()===y&&d.getMonth()===m;});
    const shown=selectedDay?events.filter(ev=>ev.date===selectedDay):monthEvents;
    byId('calendarSideTitle').textContent=selectedDay?fmt(selectedDay,true):'This month’s dates';
    byId('calendarEventList').innerHTML=shown.length?shown.map(ev=>{
      const d=numberDate(ev.date);
      return `<button class="calendar-event" type="button" data-open="${esc(ev.exam.id)}"><span class="calendar-event-date"><strong>${d.getDate()}</strong><small>${d.toLocaleString('en-IN',{month:'short'})}</small></span><span class="calendar-event-info"><strong>${esc(ev.exam.name)}</strong><span>${esc(ev.label)} · Sample</span></span></button>`;
    }).join(''):'<p class="calendar-side-empty">No sample events for this period. Try another date or month.</p>';
  }
  function changeMonth(delta){shownMonth=new Date(shownMonth.getFullYear(),shownMonth.getMonth()+delta,1);selectedDay=null;renderCalendar();}

  function renderDetail(e){
    const matchInfo=match(e);
    const note=e.sourceVerified?'Current-cycle official rules verified':'Current-cycle eligibility is not verified in this demo';
    byId('detailContent').innerHTML=`<div class="detail-content">
      <div class="detail-top-icon" style="background:${categoryColor(e.category)}">${catByName(e.category).icon}</div>
      <div class="detail-kicker">${esc(e.category)} · ${esc(e.type)}</div>
      <h2 id="detailTitle" class="detail-title">${esc(e.name)}</h2><span style="font-size:11px;color:var(--muted)">${esc(e.organizer)}</span>
      <div class="detail-pills">${getStatusBadge(e)}<span class="scope-badge">${e.country==='India'?'🇮🇳 India':'🌍 International'}</span><span class="scope-badge">Illustrative 2027 cycle</span></div>
      <p class="detail-body">${esc(e.description)}</p>
      <div class="detail-grid"><div class="detail-info-box"><span>Sample registration opens</span><strong>${fmt(e.opens,true)}</strong></div><div class="detail-info-box"><span>Sample application deadline</span><strong>${fmt(e.closes,true)}</strong></div><div class="detail-info-box"><span>Sample exam date</span><strong>${fmt(e.exam,true)}</strong></div><div class="detail-info-box"><span>Example stream alignment</span><strong>${esc(e.streams.includes('Any')?'All streams':e.streams.join(' / '))}</strong></div></div>
      <section class="detail-section"><h3>Illustrative eligibility considerations</h3><ul class="detail-points">${e.eligibilityNotes.map(t=>`<li>${icon('check')}${esc(t)}</li>`).join('')}</ul></section>
      <section class="detail-section"><h3>SmartMatch for your current profile</h3><p><strong>${matchInfo.group==='aligned'?'Likely subject alignment':matchInfo.group==='review'?'Requires further review':'Outside current profile filters'}:</strong> ${esc(matchInfo.reason)} Your actual eligibility has not been verified. Exam and institution admission criteria must be checked separately.</p></section>
      <section class="detail-section"><h3>Exam versus admission requirements</h3><p>${esc(e.admissionsNote)}</p></section>
      <div class="detail-warning">${icon('alert')}<p><strong>${note}.</strong> Dates, badges and eligibility here are demonstrative placeholders. Always confirm application and admission requirements on the organizer’s official site before applying.</p></div>
      <div class="detail-actions"><a class="primary" href="${esc(e.url)}" target="_blank" rel="noopener noreferrer">Official website ${icon('external')}</a><button type="button" data-save="${esc(e.id)}">${icon('bookmark')} ${saved.has(e.id)?'Saved ✓':'Save path'}</button><button type="button" data-share="${esc(e.id)}">${icon('share')} Share</button>${e.closes?`<button type="button" data-ics="${esc(e.id)}">${icon('download')} Demo calendar .ics</button>`:''}</div>
    </div>`;
  }
  function openDetail(id,push=true){
    const e=OPPORTUNITIES.find(item=>item.id===id);if(!e)return;
    if(push){lastView=currentView;location.hash=`exam/${e.id}`;}
    else if(!byId('modalLayer').hidden){lastView=currentView;}
    lastFocused=document.activeElement;
    renderDetail(e);
    byId('modalLayer').hidden=false;
    document.body.style.overflow='hidden';
    byId('detailClose').focus();
  }
  function closeDetail(changeHash=true){
    byId('modalLayer').hidden=true;
    document.body.style.overflow='';
    if(lastFocused&&lastFocused.isConnected)lastFocused.focus();
    if(changeHash&&location.hash.startsWith('#exam/'))location.hash=lastView;
  }
  function view(v){
    if(!['discover','calendar','saved','smartmatch','about'].includes(v))v='discover';
    currentView=v;lastView=v;
    document.querySelectorAll('.view').forEach(el=>el.classList.toggle('active',el.id===`${v}View`));
    document.querySelectorAll('[data-nav]').forEach(el=>{el.classList.toggle('active',el.dataset.nav===v);if(el.matches('a')){if(el.dataset.nav===v)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');}});
    if(v==='discover')renderDiscover();
    if(v==='calendar')renderCalendar();
    if(v==='saved')updateSaved();
    if(v==='smartmatch')renderMatches();
    window.scrollTo({top:0,behavior:'instant'});
  }
  function route(){
    const h=decodeURIComponent(location.hash.replace(/^#/,''));
    if(h.startsWith('exam/')){
      const id=h.slice(5);
      if(byId('modalLayer').hidden){view(lastView);openDetail(id,false);}else{const exam=OPPORTUNITIES.find(e=>e.id===id);if(exam)renderDetail(exam);}
      return;
    }
    if(!byId('modalLayer').hidden)closeDetail(false);
    view(['discover','calendar','saved','smartmatch','about'].includes(h)?h:'discover');
  }
  function navigate(v){if(location.hash==='#'+v)view(v);else location.hash=v;}

  function toast(message){const el=byId('toast');el.textContent=message;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),2900);}
  async function shareExam(id){
    const e=OPPORTUNITIES.find(x=>x.id===id);if(!e)return;
    const url=`${location.href.split('#')[0]}#exam/${id}`;
    const text=`${e.name} on ExamAtlas (prototype — verify dates at official site)`;
    try{if(navigator.share && location.protocol!=='file:'){await navigator.share({title:text,text,url});return;}}catch(err){if(err.name==='AbortError')return;}
    try{await navigator.clipboard.writeText(url);toast('Shareable link copied!');}
    catch{window.prompt('Copy this link',url);}
  }
  function exportICS(id){
    const e=OPPORTUNITIES.find(x=>x.id===id);if(!e||!e.closes)return;
    const end=numberDate(e.closes);end.setDate(end.getDate()+1);
    const compact=d=>d.replaceAll('-','');
    const escapeICS=s=>s.replaceAll('\\','\\\\').replaceAll(',','\\,').replaceAll(';','\\;').replaceAll('\n','\\n');
    const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//ExamAtlas//Prototype//EN','BEGIN:VEVENT',`UID:sample-${e.id}-${e.closes}@examatlas.demo`,`DTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'')}`,`DTSTART;VALUE=DATE:${compact(e.closes)}`,`DTEND;VALUE=DATE:${compact(isoDate(end))}`,`SUMMARY:${escapeICS('SAMPLE deadline — '+e.name)}`,`DESCRIPTION:${escapeICS('This is an illustrative ExamAtlas prototype date only. Confirm on the official organizer website: '+e.url)}`,'END:VEVENT','END:VCALENDAR'];
    const blob=new Blob([lines.join('\r\n')+'\r\n'],{type:'text/calendar;charset=utf-8'});
    const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download=`${e.id}-SAMPLE-deadline.ics`;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(link.href),1000);
    toast('Sample .ics calendar event downloaded');
  }
  function applyTheme(){document.documentElement.dataset.theme=theme;byId('themeBtn').innerHTML=icon(theme==='dark'?'sun':'moon');byId('themeBtn').setAttribute('aria-label',theme==='dark'?'Switch to light theme':'Switch to dark theme');}
  function changeFilter(field,value){visibleCount=10;filters[field]=value;renderDiscover();}
  function init(){
    applyTheme();syncProfile();renderCategories();updateSaved();renderMatches();renderCalendar();
    byId('themeBtn').addEventListener('click',()=>{theme=theme==='light'?'dark':'light';safeSet('ea-theme-v1',theme);applyTheme();});
    byId('heroSearchBtn').addEventListener('click',()=>{visibleCount=10;filters.q=byId('heroSearch').value;renderDiscover();byId('opportunities').scrollIntoView({behavior:'smooth',block:'start'});});
    byId('heroSearch').addEventListener('keydown',e=>{if(e.key==='Enter')byId('heroSearchBtn').click();});
    byId('examSearch').addEventListener('input',e=>changeFilter('q',e.target.value));
    byId('clearSearch').addEventListener('click',()=>changeFilter('q',''));
    for(const field of ['stream','type','region','sort'])byId(field==='sort'?'sortSelect':field+'Filter').addEventListener('change',e=>changeFilter(field,e.target.value));
    byId('gridLayoutBtn').addEventListener('click',()=>changeFilter('layout','grid'));
    byId('listLayoutBtn').addEventListener('click',()=>changeFilter('layout','list'));
    byId('mobileFilterBtn').addEventListener('click',()=>{byId('filtersPanel').classList.toggle('mobile-open');byId('mobileFilterBtn').setAttribute('aria-expanded',byId('filtersPanel').classList.contains('mobile-open'));});
    for(const id of ['resetFilters','emptyResetBtn'])byId(id).addEventListener('click',resetFilters);
    byId('showAllCategories').addEventListener('click',()=>{categoriesExpanded=!categoriesExpanded;renderCategories();});
    byId('loadMoreBtn').addEventListener('click',()=>{visibleCount+=10;renderDiscover();});
    byId('clearSaved').addEventListener('click',()=>{if(saved.size===0)return;if(window.confirm('Remove all saved opportunities from this browser?')){saved.clear();updateSaved();toast('Saved list cleared');}});
    byId('prevMonth').addEventListener('click',()=>changeMonth(-1));
    byId('nextMonth').addEventListener('click',()=>changeMonth(1));
    byId('todayMonth').addEventListener('click',()=>{shownMonth=new Date(new Date().getFullYear(),new Date().getMonth(),1);selectedDay=null;renderCalendar();});
    byId('profileForm').addEventListener('change',readProfile);
    byId('profileForm').addEventListener('submit',e=>e.preventDefault());
    byId('resetProfile').addEventListener('click',()=>{profile={...DEFAULT_PROFILE};safeSet('ea-profile-v1',profile);syncProfile();renderMatches();toast('Demo profile reset to PCM · 2027');});
    byId('detailClose').addEventListener('click',()=>closeDetail());
    document.addEventListener('click',e=>{
      const target=e.target.closest('[data-nav],[data-search],[data-category],[data-status],[data-save],[data-open],[data-share],[data-ics],[data-close-modal],[data-clear-filter],[data-date],[data-match]');
      if(!target)return;
      if(target.matches('[data-nav]')){e.preventDefault();navigate(target.dataset.nav);return;}
      if(target.matches('[data-search]')){visibleCount=10;filters.q=target.dataset.search;renderDiscover();byId('opportunities').scrollIntoView({behavior:'smooth',block:'start'});return;}
      if(target.matches('[data-category]')){visibleCount=10;filters.category=target.dataset.category;renderDiscover();byId('opportunities').scrollIntoView({behavior:'smooth',block:'start'});return;}
      if(target.matches('[data-status]')){visibleCount=10;filters.status=target.dataset.status;renderDiscover();return;}
      if(target.matches('[data-save]')){toggleSave(target.dataset.save);return;}
      if(target.matches('[data-open]')){openDetail(target.dataset.open);return;}
      if(target.matches('[data-share]')){shareExam(target.dataset.share);return;}
      if(target.matches('[data-ics]')){exportICS(target.dataset.ics);return;}
      if(target.matches('[data-close-modal]')){closeDetail();return;}
      if(target.matches('[data-clear-filter]')){const field=target.dataset.clearFilter;changeFilter(field,field==='category'?'All':field==='q'?'':'all');return;}
      if(target.matches('[data-date]')){selectedDay=target.dataset.date;const d=numberDate(selectedDay);shownMonth=new Date(d.getFullYear(),d.getMonth(),1);renderCalendar();return;}
      if(target.matches('[data-match]')){matchTab=target.dataset.match;renderMatches();return;}
    });
    document.addEventListener('keydown',e=>{
      if(e.key==='Escape'&&!byId('modalLayer').hidden){closeDetail();return;}
      if(e.key==='/' && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName) && byId('modalLayer').hidden){e.preventDefault();navigate('discover');setTimeout(()=>byId('examSearch').focus(),50);}
      if(e.key==='Tab'&&!byId('modalLayer').hidden){const modal=byId('modalLayer');const focusables=[...modal.querySelectorAll('button:not(:disabled),a[href],input:not(:disabled)')];if(!focusables.length)return;const first=focusables[0],last=focusables[focusables.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
    });
    window.addEventListener('hashchange',route);
    route();
  }
  document.addEventListener('DOMContentLoaded',init);
})();
