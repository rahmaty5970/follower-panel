(function(){

  // پوسته روشن/تاریک و رنگ تأکیدی؛ تنظیمات فقط در مرورگر کاربر ذخیره می‌شوند.
  var root=document.documentElement;
  var savedTheme='';try{savedTheme=localStorage.getItem('site-theme')||''}catch(e){}
  if(savedTheme==='dark'||savedTheme==='light')root.setAttribute('data-theme',savedTheme);
  var savedAccent='';try{savedAccent=localStorage.getItem('site-accent')||''}catch(e){}
  if(savedAccent==='green')root.setAttribute('data-accent','green');
  function syncThemeButtons(){var dark=root.getAttribute('data-theme')==='dark';document.querySelectorAll('[data-theme-toggle] .theme-glyph').forEach(function(x){x.textContent=dark?'☀':'◐'});document.querySelectorAll('[data-theme-toggle]').forEach(function(x){x.setAttribute('aria-label',dark?'فعال‌کردن پوسته روشن':'فعال‌کردن پوسته تاریک')})}
  document.querySelectorAll('[data-theme-toggle]').forEach(function(btn){btn.addEventListener('click',function(){var next=root.getAttribute('data-theme')==='dark'?'light':'dark';root.setAttribute('data-theme',next);try{localStorage.setItem('site-theme',next)}catch(e){}syncThemeButtons()})});syncThemeButtons();
  // انتخاب رنگ اصلی و اندازه نوشته، همراه با ذخیره در مرورگر.
  var accents=['green'];
  document.querySelectorAll('[data-accent-cycle]').forEach(function(btn){btn.addEventListener('click',function(){var current=root.getAttribute('data-accent')||'green';var next=accents[(accents.indexOf(current)+1)%accents.length];root.setAttribute('data-accent',next);try{localStorage.setItem('site-accent',next)}catch(e){}btn.title='رنگ انتخاب‌شده: '+next})});
  var savedFont='';try{savedFont=localStorage.getItem('site-font-size')||''}catch(e){}
  if(savedFont==='large')root.setAttribute('data-font-size','large');
  document.querySelectorAll('[data-font-toggle]').forEach(function(btn){btn.addEventListener('click',function(){var large=root.getAttribute('data-font-size')!=='large';if(large)root.setAttribute('data-font-size','large');else root.removeAttribute('data-font-size');try{localStorage.setItem('site-font-size',large?'large':'normal')}catch(e){}btn.textContent=large?'A−':'A+'})});
  document.querySelectorAll('[data-font-toggle]').forEach(function(btn){if(root.getAttribute('data-font-size')==='large')btn.textContent='A−'});
  // جستجوی سریع منوها؛ با Ctrl/⌘ + K فوکوس می‌گیرد.
  var search=document.querySelector('[data-nav-search]');
  function filterNav(){if(!search)return;var q=(search.value||'').trim().toLocaleLowerCase();document.querySelectorAll('nav.main a,.admin-side a,.tile').forEach(function(el){var hay=(el.textContent||'').toLocaleLowerCase();el.classList.toggle('search-hidden',!!q&&hay.indexOf(q)<0)})}
  if(search){search.addEventListener('input',filterNav);search.addEventListener('keydown',function(e){if(e.key==='Escape'){search.value='';filterNav();search.blur()}})}
  document.addEventListener('keydown',function(e){if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){if(search){e.preventDefault();search.focus();search.select()}}});

  // منوی موبایل
  var b=document.querySelector('.burger'),n=document.querySelector('nav.main');
  if(b&&n)b.addEventListener('click',function(){n.classList.toggle('open')});

  // کپی کردن (چت‌آیدی، کد دعوت، ...)
  document.addEventListener('click',function(ev){
    var t=ev.target.closest('[data-copy]');if(!t)return;
    var v=t.getAttribute('data-copy');
    var done=function(){var o=t.innerHTML;t.classList.add('copied');if(t.querySelector('span'))t.querySelector('span').textContent='کپی شد';else t.textContent='کپی شد';setTimeout(function(){t.innerHTML=o;t.classList.remove('copied')},1400)};
    if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(v).then(done)}
    else{var a=document.createElement('textarea');a.value=v;document.body.appendChild(a);a.select();try{document.execCommand('copy');done()}catch(e){}a.remove()}
  });

  // تأیید قبل از عملیات حساس
  document.addEventListener('submit',function(ev){
    var m=ev.target.getAttribute('data-confirm');
    if(m&&!window.confirm(m))ev.preventDefault();
  });

  // کپچا: تازه‌سازی تصویر
  document.addEventListener('click',function(ev){
    var r=ev.target.closest('[data-refresh-captcha]');if(!r)return;
    var img=document.getElementById('captcha-img');
    if(img){img.src=img.getAttribute('data-src')+'&t='+Date.now()}
    var inp=document.getElementById('captcha-input');if(inp){inp.value='';inp.focus()}
  });

  // فرم سفارش: محاسبه‌ی هزینه‌ی زنده
  var f=document.getElementById('order-form');
  if(f){
    var unit=parseFloat(f.getAttribute('data-unit'))||0;
    var out=document.getElementById('cost-out');
    var custom=document.getElementById('qty-custom');
    var min=parseInt(f.getAttribute('data-min'))||1,max=parseInt(f.getAttribute('data-max'))||1e9;
    var fmt=function(x){return Number(x).toLocaleString('en-US')};
    var cur=function(){
      var r=f.querySelector('input[name=pkg]:checked');
      if(r&&r.value!=='custom')return parseInt(r.value);
      var v=(custom.value||'').replace(/[٠-٩۰-۹]/g,function(d){return d.charCodeAt(0)<1776?d.charCodeAt(0)-1632:d.charCodeAt(0)-1776});
      return parseInt(v)||0;
    };
    var upd=function(){var q=cur();out.textContent=q?fmt(q*unit)+' سکه':'—';
      var cw=document.getElementById('custom-wrap');var r=f.querySelector('input[name=pkg]:checked');
      if(cw)cw.style.display=(r&&r.value==='custom')?'block':'none'};
    f.addEventListener('input',upd);f.addEventListener('change',upd);upd();
  }

  // پیش‌نمایش پروفایل برای فالو/آنفالو/ویو استوری
  var pv=document.getElementById('preview-btn');
  if(pv){
    pv.addEventListener('click',function(){
      var u=document.getElementById('target').value.trim();
      var box=document.getElementById('preview-box');
      if(!u){box.textContent='ابتدا آیدی را وارد کنید.';return}
      box.textContent='در حال دریافت…';pv.disabled=true;
      var fd=new FormData();fd.append('u',u);fd.append('_csrf',pv.getAttribute('data-csrf'));
      fetch(pv.getAttribute('data-url'),{method:'POST',body:fd,credentials:'same-origin'})
        .then(function(r){return r.json()}).then(function(j){
          pv.disabled=false;
          if(j.ok){box.textContent='';var s=document.createElement('div');
            s.textContent='کاربر '+j.name+'  |  @'+j.username+'  |  فالوور: '+(j.followers==null?'نامشخص':j.followers);box.appendChild(s)}
          else box.textContent='خطا: '+(j.error||'خطا');
        }).catch(function(){pv.disabled=false;box.textContent=' خطا در ارتباط'});
    });
  }

})();
