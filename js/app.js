/* THE OMNIARCH — Milk Ink + Text + Helix */
window.addEventListener('load',()=>{
  const loader=document.getElementById('loader');
  const progress=document.getElementById('loaderProgress');
  const percent=document.getElementById('loaderPercent');
  let p=0;
  const int=setInterval(()=>{
    p+= Math.random()*18+6;
    if(p>=100){p=100;clearInterval(int); setTimeout(()=>loader.classList.add('hidden'), 380)}
    if(progress) progress.style.width=p+'%';
    if(percent) percent.textContent=Math.round(p)+'%';
  },110);
  setTimeout(()=>{
    document.querySelectorAll('.hero-title .line span').forEach(el=>el.parentElement.parentElement.classList.add('ready'));
    // trigger hero sub after
    setTimeout(()=>{
      document.querySelector('.hero-sub')?.classList.add('in');
      document.querySelector('.hero-cta')?.classList.add('in');
    }, 620);
  }, 300);
});
setTimeout(()=>{
  const l=document.getElementById('loader');
  if(l && !l.classList.contains('hidden')) l.classList.add('hidden');
  document.querySelector('.hero-title')?.classList.add('ready');
  document.querySelector('.hero-sub')?.classList.add('in');
  document.querySelector('.hero-cta')?.classList.add('in');
}, 2600);

const hamb=document.getElementById('hamb'), menu=document.getElementById('mobileMenu');
if(hamb && menu){ hamb.addEventListener('click',()=>menu.classList.toggle('open')); window.closeMenu=()=>menu.classList.remove('open'); }

const nav=document.getElementById('nav');
window.addEventListener('scroll',()=>{ if(nav) nav.classList.toggle('scrolled', scrollY>22) },{passive:true});

const obs=new IntersectionObserver((es)=>{ es.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('in') }) },{threshold:.12});
document.querySelectorAll('.reveal, .portfolio-break').forEach(el=>obs.observe(el));
const treeObs=new IntersectionObserver((es)=>{ es.forEach(e=>{ if(e.isIntersecting){ e.target.querySelectorAll('.tree-node').forEach((n,i)=> setTimeout(()=>n.classList.add('in'), i*86) ) } }) },{threshold:.18});
document.querySelectorAll('.tree').forEach(t=>treeObs.observe(t));

// HERO — splashy liquid amoeba that FOLLOWS CURSOR with flow (full header, splashed in liquid)
const hero=document.getElementById('hero'), bgImg=document.querySelector('.hero-bg-img'), heroWrap=document.getElementById('heroWrap'), heroSub=document.getElementById('heroSub'), heroCta=document.getElementById('heroCta'), heroBottom=document.querySelector('.hero-bottom'), heroScroll=document.querySelector('.hero-scroll'), fangBelt=document.getElementById('fangBelt'), amoebaClip=document.getElementById('amoebaClip');
if(hero && hero.dataset.theme==='light') document.body.classList.add('hero-light');
if(hero && amoebaClip){
  let halfW=window.innerWidth<700?260:360, halfH=window.innerWidth<700?170:230;
  window.addEventListener('resize',()=>{ halfW=window.innerWidth<700?260:360; halfH=window.innerWidth<700?170:230; });
  const turb=document.getElementById('turb'), disp=document.getElementById('disp');
  const waterTurb=document.getElementById('waterTurb'), waterDisp=document.getElementById('waterDisp');
  let targetX=hero.offsetWidth/2, targetY=hero.offsetHeight/2;
  let curX=targetX, curY=targetY, vx=0, vy=0;
  let isHover=false, raf=null;
  let lastX=curX, lastY=curY;
  let lastDirX=0, stirCount=0;
  function tick(){
    // spring towards target — splashy lag like pencil in shallow water plate
    const dx=targetX - curX, dy=targetY - curY;
    vx += dx * 0.13; vy += dy * 0.13;
    vx *= 0.71; vy *= 0.71; // slightly less damping = freer water
    curX += vx; curY += vy;
    const speed=Math.hypot(curX-lastX, curY-lastY);
    const dirX=Math.sign(vx);
    if(dirX!==0 && dirX!==lastDirX && Math.abs(vx)>1.2){ stirCount++; lastDirX=dirX; }
    lastX=curX; lastY=curY;
    // update amoeba mask position centered on blob (pencil tip)
    amoebaClip.style.setProperty('--mx', (curX - halfW)+'px');
    amoebaClip.style.setProperty('--my', (curY - halfH)+'px');
    // splash distortion for ink blob — like ink dispersing in milk
    if(disp){
      const splash=Math.min(28, 5 + speed*1.45 + (stirCount%2?1.2:0));
      disp.setAttribute('scale', splash.toFixed(1));
    }
    if(turb){
      const f=(0.009 + speed*0.00058).toFixed(4);
      turb.setAttribute('baseFrequency', `${f} ${(f*1.35).toFixed(4)}`);
    }
    // WHOLE PLATE flow — entire header water stirs as pencil goes back & forth
    if(waterDisp){
      const plateFlow=Math.min(18, 1.0 + speed*0.92 + Math.abs(vx)*0.22);
      waterDisp.setAttribute('scale', plateFlow.toFixed(1));
    }
    if(waterTurb){
      const wf=(0.008 + speed*0.00045 + Math.abs(vx)*0.00018).toFixed(4);
      waterTurb.setAttribute('baseFrequency', `${wf} ${(parseFloat(wf)*1.45).toFixed(4)}`);
    }
    // subtle wobble + whole-plate slosh
    const wobble=1 + Math.min(0.05, speed*0.0035);
    amoebaClip.style.transform=`scale(${wobble.toFixed(3)})`;
    // gentle slosh of the entire stage opposite to pencil — flat plate water freedom
    if(heroWrap){
      const sloshX= - (curX - hero.offsetWidth/2) * 0.012;
      const sloshY= - (curY - hero.offsetHeight/2) * 0.008;
      // keep scroll transform will override; so store slosh as CSS vars and let CSS combine? For now add tiny translate that will be merged on next scroll tick
      heroWrap.dataset.sx=sloshX.toFixed(1); heroWrap.dataset.sy=sloshY.toFixed(1);
    }
    if(isHover && (Math.abs(dx)>0.3 || Math.abs(dy)>0.3 || speed>0.18)){
      raf=requestAnimationFrame(tick);
    } else {
      // settle — slowly reduce both ink and whole plate
      if(disp) disp.setAttribute('scale','3.2');
      if(waterDisp) waterDisp.setAttribute('scale','0.9');
      raf=null;
    }
  }
  function showAmoeba(){ amoebaClip.classList.add('visible'); if(!raf) raf=requestAnimationFrame(tick); }
  function hideAmoeba(){ amoebaClip.classList.remove('visible'); isHover=false; if(waterDisp) waterDisp.setAttribute('scale','0.6'); }
  hero.addEventListener('mouseenter', ()=>{ isHover=true; showAmoeba(); });
  hero.addEventListener('mousemove', e=>{
    const r=hero.getBoundingClientRect();
    targetX=e.clientX - r.left; targetY=e.clientY - r.top;
    isHover=true;
    amoebaClip.classList.add('visible');
    if(!raf) raf=requestAnimationFrame(tick);
  });
  hero.addEventListener('mouseleave', hideAmoeba);
  hero.addEventListener('touchmove', e=>{
    const t=e.touches[0]; const r=hero.getBoundingClientRect();
    targetX=t.clientX - r.left; targetY=t.clientY - r.top;
    isHover=true;
    amoebaClip.classList.add('visible');
    if(!raf) raf=requestAnimationFrame(tick);
  }, {passive:true});
  hero.addEventListener('touchend', hideAmoeba);
  // idle subtle flow when not hovering — gentle organic drift of both turbulences (free water in flat plate)
  let t=0; setInterval(()=>{
    t+=0.05;
    if(!isHover){
      if(turb){
        const f=(0.009 + Math.sin(t)*0.0015).toFixed(4);
        turb.setAttribute('baseFrequency', `${f} ${(f*1.2).toFixed(4)}`);
      }
      if(waterTurb){
        const wf=(0.008 + Math.sin(t*0.7)*0.0012).toFixed(4);
        waterTurb.setAttribute('baseFrequency', `${wf} ${(parseFloat(wf)*1.4).toFixed(4)}`);
      }
    }
  }, 60);
  hideAmoeba();
  if(disp) disp.setAttribute('scale','3.2');
  if(waterDisp) waterDisp.setAttribute('scale','0.6');
}
let ticking=false;
function onHeroScroll(){
  const y=window.scrollY;
  const vh=window.innerHeight||800;
  const p=Math.min(1, y / (vh*0.92)); // 0 → 1 over hero
  // wings: slower, slight scale up as you leave
  if(bgImg){
    const yBg=y*0.24;
    const scale=1.02 + p*0.06;
    bgImg.style.transform=`translate3d(0, ${yBg}px, 0) scale(${scale.toFixed(3)})`;
    bgImg.style.opacity=String(1 - p*0.18);
  }
  // THE OMNIARCH: Noth-like zoom out + lift + fade
  if(heroWrap){
    const ty=y*0.32;
    const sc=1 - p*0.10;
    heroWrap.style.transform=`translate3d(0, ${ty}px, 0) scale(${sc.toFixed(3)})`;
    heroWrap.style.opacity=String(Math.max(0, 1 - p*1.35));
    heroWrap.style.filter=`blur(${(p*2.2).toFixed(1)}px)`;
  }
  if(heroSub){
    heroSub.style.transform=`translate3d(0, ${y*0.18}px, 0)`;
    heroSub.style.opacity=String(Math.max(0, 1 - p*1.8));
  }
  if(heroCta){
    heroCta.style.transform=`translate3d(0, ${y*0.14}px, 0)`;
    heroCta.style.opacity=String(Math.max(0, 1 - p*1.6));
  }
  if(heroBottom){
    heroBottom.style.opacity=String(Math.max(0, 1 - p*2.2));
    heroBottom.style.transform=`translateY(${y*0.08}px)`;
  }
  if(heroScroll){
    heroScroll.style.opacity=String(Math.max(0, 1 - p*3));
  }
  if(fangBelt){
    // belt drifts slightly opposite, like Noth containers moving different directions
    fangBelt.style.transform=`translateY(${Math.min(24, y*0.06)}px)`;
  }
  // nav reveal already handled above; ensure hero stays pinned visually
  ticking=false;
}
window.addEventListener('scroll',()=>{
  if(!ticking){ ticking=true; requestAnimationFrame(onHeroScroll); }
},{passive:true});
onHeroScroll();

// HELIX - monochrome spaced
const videos=[
  {title:"Why Reverend Insanity Was BANNED — The True Fate of Gu Zhen Ren", meta:"Essay • 14:22 • 128K", tag:"RI • Fate", dur:"14:22"},
  {title:"Hope Gu Explained — Why Fate Cannot Kill It (Ren Zu I)", meta:"Ren Zu • 11:48 • 89K", tag:"Hope", dur:"11:48"},
  {title:"The Legends of Ren Zu: The Ordinary Abyss — What It Really Means", meta:"Philosophy • 18:03 • 67K", tag:"Ordinary", dur:"18:03"},
  {title:"Strength vs Wisdom — The Trade Ren Zu Regretted", meta:"Codex • 9:34 • 54K", tag:"Wisdom", dur:"9:34"},
  {title:"Freedom Gu & The Final Betrayal — Ren Zu 33-35", meta:"Ren Zu • 16:21 • 71K", tag:"Freedom", dur:"16:21"},
  {title:"Translating the Untranslatable — My Bench for RI Chapter 4", meta:"Vlog • 8:12 • 22K", tag:"Translation", dur:"8:12"},
  {title:"Who Is The Omniarch? The Faceless Translator", meta:"Lore • 6:44 • 41K", tag:"Omniarch", dur:"6:44"},
  {title:"Fate vs Effort — Does Hard Work Beat Talent in Gu World?", meta:"Essay • 13:55 • 58K", tag:"Effort", dur:"13:55"},
  {title:"Ren Zu's Children: Verdant Great Sun's Fatal Flight", meta:"Ren Zu 12 • 10:07 • 62K", tag:"Ren Zu", dur:"10:07"},
  {title:"Peak Fiction Is Not What You Think — A Definition", meta:"Peak Fiction • 12:18 • 95K", tag:"Peak Fiction", dur:"12:18"},
];
const helix=document.getElementById('helix'), viewport=document.getElementById('helixViewport');
if(helix && viewport){
  let helixAuto=true, helixSpeed=0.52, isDragging=false, dragStartX=0, dragAngle=0, currentAngle=0, lastT=0;
  function buildHelix(){
    helix.innerHTML='';
    videos.forEach((v)=>{
      const a=document.createElement('a'); a.href="https://www.youtube.com/@GodofPeakFiction"; a.target="_blank"; a.className='helix-card';
      a.innerHTML=`
        <div class="helix-thumb">
          <div style="width:100%;height:100%;background:radial-gradient(400px 200px at 50% 0%, rgba(255,255,255,.06), transparent 60%), linear-gradient(135deg, #0F0F12 0%, #1C1C20 100%);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px">
            <div style="width:42px;height:42px;border:1px dashed rgba(255,255,255,.13);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:13px;color:rgba(255,255,255,.5)">▶</div>
            <div style="font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.26)">${v.dur} • 16:9</div>
          </div>
          <span style="position:absolute;top:8px;left:8px;background:rgba(0,0,0,.62);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.09);color:#fff;font-family:'JetBrains Mono',monospace;font-size:8px;padding:4px 7px;border-radius:999px">${v.tag}</span>
        </div>
        <div class="helix-body">
          <div class="helix-meta"><i></i> ${v.tag} • ${v.meta.split('•')[0]}</div>
          <div class="helix-title">${v.title}</div>
          <div class="helix-stats"><span>${v.dur}</span><span>•</span><span>${(v.meta.split('•')[1]||'').trim()} views</span></div>
        </div>`;
      helix.appendChild(a);
    });
    positionHelix(0);
  }
  function positionHelix(angle){
    const cards=helix.children, total=cards.length, radius=462;
    for(let i=0;i<total;i++){
      const card=cards[i];
      const a = angle + i*(360/total);
      const rad=a*Math.PI/180;
      const y=Math.sin(rad)*46 + Math.cos(rad*0.5)*10;
      const z=Math.cos(rad)*radius;
      const x=Math.sin(rad)*(radius*0.31);
      const depth=(Math.cos(rad)+1)/2;
      const scale=0.78 + depth*0.22;
      const opacity=0.4 + depth*0.6;
      const blur=(1-depth)*1.05;
      card.style.transform=`translate3d(${x}px, ${y}px, ${z}px) rotateY(${-a}deg) scale(${scale})`;
      card.style.opacity=opacity;
      card.style.filter=`blur(${blur}px) brightness(${0.86+depth*.16})`;
      card.style.zIndex=Math.round(depth*100);
    }
    helix.style.transform=`rotateY(${angle}deg) rotateX(-6deg)`;
  }
  function animate(t){
    if(!lastT) lastT=t;
    const dt=(t-lastT)/1000; lastT=t;
    if(helixAuto && !isDragging){
      currentAngle += dt * (helixSpeed*18);
      positionHelix(currentAngle);
    } else if(isDragging){
      positionHelix(currentAngle+dragAngle);
    }
    requestAnimationFrame(animate);
  }
  viewport.addEventListener('pointerdown', e=>{isDragging=true; dragStartX=e.clientX; viewport.setPointerCapture(e.pointerId)});
  viewport.addEventListener('pointermove', e=>{if(!isDragging) return; dragAngle=(e.clientX-dragStartX)*0.28; positionHelix(currentAngle+dragAngle)});
  viewport.addEventListener('pointerup', ()=>{if(!isDragging) return; isDragging=false; currentAngle+=dragAngle; dragAngle=0});
  viewport.addEventListener('pointercancel', ()=>{isDragging=false; dragAngle=0});
  viewport.addEventListener('wheel', e=>{e.preventDefault(); currentAngle+=e.deltaY*0.07; positionHelix(currentAngle)},{passive:false});
  document.getElementById('btnSlow')?.addEventListener('click', function(){ helixSpeed=0.42; document.querySelectorAll('.helix-btn').forEach(b=>b.classList.remove('active')); this.classList.add('active')});
  document.getElementById('btnFast')?.addEventListener('click', function(){ helixSpeed=1.05; document.querySelectorAll('.helix-btn').forEach(b=>b.classList.remove('active')); this.classList.add('active')});
  document.getElementById('btnPause')?.addEventListener('click', function(){ helixAuto=!helixAuto; this.classList.toggle('active')});
  buildHelix(); requestAnimationFrame(animate);
}

// ===== Reverend Insanity — Nine Visions Slider (library main) =====
(function(){
  const track=document.getElementById('riTrack'), slider=document.getElementById('riSlider'), dotsWrap=document.getElementById('riDots'), miniWrap=document.getElementById('riMini'), prev=document.getElementById('riPrev'), next=document.getElementById('riNext'), bar=document.getElementById('riProgressBar');
  if(!track || !slider) return;
  const cards=Array.from(track.children);
  const total=cards.length;
  let idx=0, timer=null, progressTimer=null, touching=false, startX=0, deltaX=0;
  function buildDots(){
    if(!dotsWrap) return;
    dotsWrap.innerHTML='';
    for(let i=0;i<total;i++){
      const b=document.createElement('button'); b.className='ri-dot'+(i===0?' active':''); b.setAttribute('aria-label','Go to '+(i+1)); b.addEventListener('click',()=>go(i)); dotsWrap.appendChild(b);
    }
  }
  function buildMinis(){
    if(!miniWrap) return;
    miniWrap.innerHTML='';
    cards.forEach((c,i)=>{
      const img=c.querySelector('.ri-card-img img');
      const m=document.createElement('button'); m.className='ri-mini'+(i===0?' active':'');
      m.innerHTML=`<img src="${img.src}" alt="">`;
      m.addEventListener('click',()=>go(i));
      miniWrap.appendChild(m);
    });
  }
  function update(){
    track.style.transform=`translateX(-${idx*100}%)`;
    if(dotsWrap) Array.from(dotsWrap.children).forEach((d,i)=> d.classList.toggle('active', i===idx));
    if(miniWrap) Array.from(miniWrap.children).forEach((m,i)=> m.classList.toggle('active', i===idx));
    // scroll mini into view
    if(miniWrap && miniWrap.children[idx]) miniWrap.children[idx].scrollIntoView({behavior:'smooth', block:'nearest', inline:'center'});
  }
  function startProgress(){
    if(!bar) return;
    bar.style.transition='none'; bar.style.width='0%';
    requestAnimationFrame(()=> requestAnimationFrame(()=>{
      bar.style.transition='width 4200ms linear';
      bar.style.width='100%';
    }));
  }
  function restartAuto(){
    clearInterval(timer); clearInterval(progressTimer);
    startProgress();
    timer=setInterval(()=>{ idx=(idx+1)%total; update(); startProgress(); }, 4200);
  }
  function go(i){ idx=(i+total)%total; update(); restartAuto(); }
  if(prev) prev.addEventListener('click',()=>go(idx-1));
  if(next) next.addEventListener('click',()=>go(idx+1));
  // swipe
  slider.addEventListener('touchstart', e=>{ touching=true; startX=e.touches[0].clientX; clearInterval(timer); if(bar) bar.style.transition='none'; }, {passive:true});
  slider.addEventListener('touchmove', e=>{ if(!touching) return; deltaX=e.touches[0].clientX-startX; }, {passive:true});
  slider.addEventListener('touchend', ()=>{
    touching=false;
    if(Math.abs(deltaX)>42){ if(deltaX<0) go(idx+1); else go(idx-1); } else { restartAuto(); }
    deltaX=0;
  });
  slider.addEventListener('mouseenter', ()=>{ clearInterval(timer); if(bar) bar.style.transition='none'; });
  slider.addEventListener('mouseleave', ()=> restartAuto());
  // keyboard when focused
  slider.setAttribute('tabindex','0');
  slider.addEventListener('keydown', e=>{ if(e.key==='ArrowLeft') go(idx-1); if(e.key==='ArrowRight') go(idx+1); });
  buildDots(); buildMinis(); update(); restartAuto();
  // pause when slider not in viewport
  const ro=new IntersectionObserver((es)=>{ es.forEach(e=>{ if(e.isIntersecting) restartAuto(); else { clearInterval(timer); if(bar) bar.style.transition='none'; } }) },{threshold:.12});
  ro.observe(slider);
})();

// Immersive text reveals — great text animations
(function(){
  const revealObs=new IntersectionObserver((entries)=>{
    entries.forEach(ent=>{
      if(ent.isIntersecting){
        ent.target.classList.add('in');
        // stagger inner spans if present
        const spans=ent.target.querySelectorAll('.ri-text-reveal span');
        spans.forEach((sp,i)=> setTimeout(()=> sp.style.transitionDelay = (i*70)+'ms', 10));
      }
    });
  }, {threshold:.14});
  document.querySelectorAll('.ri-text-reveal, .ri-page-title, .ri-lore p, .ri-lore blockquote').forEach(el=>{
    el.classList.add('ri-text-reveal');
    // wrap text in span if not already
    if(!el.querySelector('span') && el.textContent.trim().length){
      const t=el.innerHTML;
      el.innerHTML=`<span>${t}</span>`;
    }
    revealObs.observe(el);
  });
  // parallax on hero images inside immersive pages
  let ticking2=false;
  function onRiScroll(){
    document.querySelectorAll('.ri-page-hero img').forEach(img=>{
      const sec=img.closest('.page-overlay');
      if(!sec || sec.style.visibility==='hidden') return;
      const rect=sec.getBoundingClientRect();
      // only when overlay is target (visible)
      if(sec.matches(':target')){
        const p=Math.min(1, Math.max(0, -rect.top/600));
        img.style.transform=`translate3d(0, ${p*18}px, 0) scale(${1.02 + p*0.03})`;
      }
    });
    ticking2=false;
  }
  window.addEventListener('scroll', ()=>{ if(!ticking2){ ticking2=true; requestAnimationFrame(onRiScroll); } }, {passive:true});
})();

let hintHidden=false;
window.addEventListener('scroll',()=>{ if(!hintHidden && scrollY>380){ document.getElementById('hint')?.classList.add('hidden'); hintHidden=true } },{passive:true});
window.addEventListener('keydown', e=>{ if(e.key==='Escape' && location.hash){ history.pushState("",document.title, location.pathname+location.search)}});
