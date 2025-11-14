// script.js (versão atualizada)
document.addEventListener('DOMContentLoaded', function(){
  // Hamburger menu
  const hamb = document.querySelector('.hamburger');
  const nav = document.getElementById('mainNav');
  hamb.addEventListener('click', () => {
    nav.classList.toggle('open');
    hamb.classList.toggle('is-open');
    // add overlay effect on body
if (nav.classList.contains('open')) {
  document.body.classList.add('menu-open');
  document.body.style.overflow = 'hidden';
} else {
  document.body.classList.remove('menu-open');
  document.body.style.overflow = '';
}
  });
  // close menu when clicking outside
  document.addEventListener('click', (e) => {
    if(!nav.contains(e.target) && !hamb.contains(e.target)){
      if(nav.classList.contains('open')){
        nav.classList.remove('open');
        hamb.classList.remove('is-open');
        document.body.classList.remove('menu-open');
        document.body.style.overflow = '';
      }
    }
  });

  // Smooth scroll for anchor links (improved: compensates header height)
  // Intercept links that contain a hash (#) but only handle them when they point to the same page.
  document.querySelectorAll('a[href*="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if(!href || href.indexOf('#') === -1) return; // no hash -> ignore

      // Build absolute URL to compare pathname
      const linkUrl = new URL(href, location.href);
      // If pathname is different, let the browser navigate to the other page normally
      if(linkUrl.pathname !== location.pathname) return;

      const hash = linkUrl.hash;
      if(!hash) return;

      const el = document.querySelector(hash);
      if(el){
        e.preventDefault();
        // compute header height dynamically (works for mobile/desktop)
        const header = document.querySelector('.site-header');
        const headerHeight = header ? header.offsetHeight : 0;
        // small extra gap so content isn't snug to the header
        const gap = 8;
        const targetPosition = el.getBoundingClientRect().top + window.scrollY - headerHeight - gap;
        window.scrollTo({behavior:'smooth', top: targetPosition});

        // if menu open on mobile, close it
        if(nav.classList.contains('open')){
          nav.classList.remove('open');
          hamb.classList.remove('is-open');
          document.body.classList.remove('menu-open');
          document.body.style.overflow = '';
        }
      }
    })
  });

  // If the page was loaded with a hash in the URL, adjust scroll to compensate header
  if(location.hash){
    // wait a tick so layout/imagenes carreguem e offsetHeight esteja correto
    setTimeout(()=>{
      const target = document.querySelector(location.hash);
      if(target){
        const header = document.querySelector('.site-header');
        const headerHeight = header ? header.offsetHeight : 0;
        const gap = 8;
        const pos = target.getBoundingClientRect().top + window.scrollY - headerHeight - gap;
        window.scrollTo({behavior:'auto', top: pos});
      }
    }, 60);
  }

  // PIX copy
  document.querySelectorAll('.copy-pix').forEach(btn=>{
    btn.addEventListener('click', async ()=>{
      const key = btn.dataset.pix;
      try{
        await navigator.clipboard.writeText(key);
        btn.textContent = 'Chave copiada!';
        setTimeout(()=> btn.textContent = 'Copiar chave PIX', 1600);
      }catch(e){
        alert('Não foi possível copiar automaticamente. Copie manualmente: ' + key);
      }
    });
  });

  // Carousel logic - supports showing groups of 3 images
  function setupCarousel(containerId){
    const frame = document.getElementById(containerId);
    if(!frame) return;
    const track = frame.querySelector('.carousel-track');
    const imgs = track.children;
    const total = imgs.length;
    let index = 0;
    const visible = 2;

    const leftBtn = document.querySelector('.carousel-nav.left[data-target="'+containerId+'"]');
    const rightBtn = document.querySelector('.carousel-nav.right[data-target="'+containerId+'"]');

    function update(){
      const shift = (100/visible) * index;
      track.style.transform = 'translateX(-' + shift + '%)';
    }
    function prev(){
      index = Math.max(0, index - 1);
      update();
    }
    function next(){
      index = Math.min(total - visible, index + 1);
      update();
    }
    if(leftBtn) leftBtn.addEventListener('click', prev);
    if(rightBtn) rightBtn.addEventListener('click', next);

    // make responsive: if fewer images than visible, reset
    update();
  }

  setupCarousel('mainCarousel');
  setupCarousel('cA');
  setupCarousel('cB');
  setupCarousel('cC');
  setupCarousel('cD');

  // Optional: add small header shadow on scroll for better visual feedback
  window.addEventListener('scroll', () => {
    const header = document.querySelector('.site-header');
    if(!header) return;
    if(window.scrollY > 10){
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

});
