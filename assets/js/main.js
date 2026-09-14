(function(){
  'use strict';

  var WPP_BASE = 'https://wa.me/56947780892?text=';

  /* --------------------------------------------------------
     A. MENÚ MOBILE (hamburguesa)
     -------------------------------------------------------- */
  var hamburger  = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobile-menu');
  var wppFloat   = document.getElementById('wpp-float');
  var lastFocus  = null;

  function openMenu(){
    lastFocus = document.activeElement;
    mobileMenu.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Cerrar menú de navegación');
    document.body.classList.add('no-scroll');
    wppFloat.classList.add('is-hidden');           // ocultar botón flotante con el menú abierto
    var firstLink = mobileMenu.querySelector('a');
    if (firstLink) firstLink.focus();
  }

  function closeMenu(){
    mobileMenu.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Abrir menú de navegación');
    document.body.classList.remove('no-scroll');
    wppFloat.classList.remove('is-hidden');
    if (lastFocus) lastFocus.focus();
  }

  hamburger.addEventListener('click', function(){
    if (mobileMenu.classList.contains('is-open')) closeMenu();
    else openMenu();
  });

  // Cerrar al pulsar un enlace del menú
  mobileMenu.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', closeMenu);
  });

  // Cerrar con Escape
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) closeMenu();
  });

  /* --------------------------------------------------------
     B. SERVICIOS → preseleccionar servicio en el formulario
     -------------------------------------------------------- */
  var servicioSelect = document.getElementById('servicio');
  document.querySelectorAll('.service-card__link[data-service]').forEach(function(link){
    link.addEventListener('click', function(){
      var val = link.getAttribute('data-service');
      if (servicioSelect){
        for (var i = 0; i < servicioSelect.options.length; i++){
          if (servicioSelect.options[i].value === val || servicioSelect.options[i].text === val){
            servicioSelect.selectedIndex = i;
            break;
          }
        }
      }
    });
  });

  /* --------------------------------------------------------
     B2. SERVICIOS → "Ver más" cuando la descripción queda recortada
     (solo ocurre en la vista móvil de 2 columnas; en desktop no se
      recorta y el botón no se agrega).
     -------------------------------------------------------- */
  function setupServiceCardToggles(){
    document.querySelectorAll('.service-card p').forEach(function(p){
      var existing = p.nextElementSibling;
      var hasBtn = existing && existing.classList.contains('service-card__more');
      var clamped = p.scrollHeight - p.clientHeight > 4;
      if (clamped && !hasBtn){
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'service-card__more';
        btn.textContent = 'Ver más';
        btn.setAttribute('aria-expanded', 'false');
        btn.addEventListener('click', function(){
          var open = p.classList.toggle('is-expanded');
          btn.textContent = open ? 'Ver menos' : 'Ver más';
          btn.setAttribute('aria-expanded', String(open));
        });
        p.insertAdjacentElement('afterend', btn);
      } else if (!clamped && hasBtn && !p.classList.contains('is-expanded')){
        existing.remove();
      }
    });
  }
  /* --------------------------------------------------------
     B3. PROYECTOS → descripción bajo la imagen, desplegable al tocar.
     Solo en móvil (<=600px). En pantallas mayores la etiqueta
     vuelve a su comportamiento normal (overlay / hover).
     -------------------------------------------------------- */
  var isPhone = window.matchMedia('(max-width: 600px)');
  function setupProjectToggles(){
    var phone = isPhone.matches;
    document.querySelectorAll('.project').forEach(function(fig){
      var label = fig.querySelector('.project__label');
      var toggle = fig.querySelector('.project__toggle');
      if (phone && label && !toggle){
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'project__toggle';
        btn.setAttribute('aria-expanded', 'false');
        btn.innerHTML = '<span>Ver descripción</span>' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
        btn.addEventListener('click', function(){
          var open = fig.classList.toggle('is-open');
          btn.setAttribute('aria-expanded', String(open));
          btn.firstChild.textContent = open ? 'Ocultar' : 'Ver descripción';
        });
        fig.insertBefore(btn, label);
      } else if (!phone && toggle){
        toggle.remove();
        fig.classList.remove('is-open');
      }
    });
  }

  setupServiceCardToggles();
  setupProjectToggles();
  window.addEventListener('load', function(){ setupServiceCardToggles(); setupProjectToggles(); });
  var uiResize;
  window.addEventListener('resize', function(){
    clearTimeout(uiResize);
    uiResize = setTimeout(function(){ setupServiceCardToggles(); setupProjectToggles(); }, 200);
  });

  /* --------------------------------------------------------
     C. FADE-IN DE SECCIONES AL HACER SCROLL (IntersectionObserver)
     -------------------------------------------------------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function(el){ io.observe(el); });
  } else {
    reveals.forEach(function(el){ el.classList.add('is-visible'); });
  }

  /* --------------------------------------------------------
     D. AÑO DINÁMICO EN EL FOOTER
     -------------------------------------------------------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* --------------------------------------------------------
     D2. CAMBIO DE TEMA CLARO / OSCURO
     - Por defecto respeta la preferencia del sistema.
     - Si el usuario elige manualmente, se guarda en localStorage
       (aplicado antes del render por el script del <head>).
     -------------------------------------------------------- */
  var themeToggle = document.getElementById('theme-toggle');
  var themeMeta   = document.querySelector('meta[name="theme-color"]:not([media])')
                 || document.querySelector('meta[name="theme-color"]');
  var darkMq      = window.matchMedia('(prefers-color-scheme: dark)');

  function effectiveTheme(){
    var attr = document.documentElement.getAttribute('data-theme');
    if (attr === 'dark' || attr === 'light') return attr;
    return darkMq.matches ? 'dark' : 'light';
  }
  function syncTheme(){
    var t = effectiveTheme();
    if (themeMeta) themeMeta.setAttribute('content', t === 'dark' ? '#0c1620' : '#0A3154');
    if (themeToggle){
      themeToggle.setAttribute('aria-pressed', String(t === 'dark'));
      themeToggle.setAttribute('title', t === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
    }
  }
  syncTheme();

  if (themeToggle){
    themeToggle.addEventListener('click', function(){
      var next = effectiveTheme() === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('mb-theme', next); } catch (e) {}
      syncTheme();
    });
  }
  // Si el usuario no ha elegido manualmente, seguir los cambios del sistema
  darkMq.addEventListener('change', syncTheme);

  /* --------------------------------------------------------
     D3. SOMBRA DEL HEADER AL HACER SCROLL
     -------------------------------------------------------- */
  var headerEl = document.querySelector('.header');
  function onScrollHeader(){
    if (headerEl) headerEl.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* --------------------------------------------------------
     E. WHATSAPP DESDE EL FORMULARIO (mensaje precompletado)
     -------------------------------------------------------- */
  var form       = document.getElementById('quote-form');
  var wppFormBtn  = document.getElementById('wpp-form-btn');
  var statusBox  = document.getElementById('form-status');
  var submitBtn  = document.getElementById('submit-btn');

  function buildWppMessage(){
    var nombre   = (document.getElementById('nombre').value || '').trim();
    var email    = (document.getElementById('email').value || '').trim();
    var telefono = (document.getElementById('telefono').value || '').trim();
    var servicio = servicioSelect.value || '';
    var mensaje  = (document.getElementById('mensaje').value || '').trim();

    var txt = 'Hola M&B Ingeniería y Construcción, quisiera solicitar una cotización.';
    if (nombre)   txt += '\n\nNombre: ' + nombre;
    if (email)    txt += '\nCorreo: ' + email;
    if (telefono) txt += '\nTeléfono: ' + telefono;
    if (servicio) txt += '\nServicio: ' + servicio;
    if (mensaje)  txt += '\nMensaje: ' + mensaje;
    return WPP_BASE + encodeURIComponent(txt);
  }

  // Actualiza el href del botón de WhatsApp del formulario al vuelo
  ['input','change'].forEach(function(evt){
    form.addEventListener(evt, function(){
      wppFormBtn.setAttribute('href', buildWppMessage());
    });
  });
  wppFormBtn.setAttribute('href', buildWppMessage());

  /* --------------------------------------------------------
     F. ENVÍO DEL FORMULARIO
     --------------------------------------------------------
     Implementación con FORMSPREE vía fetch (AJAX).
     - Requiere reemplazar "TU_ID_FORMSPREE" en el action del <form>.
     - Si aún no está configurado, se avisa al usuario y se ofrece WhatsApp.
     -------------------------------------------------------- */
  function showStatus(type, msg){
    statusBox.className = 'form__status ' + (type === 'ok' ? 'is-ok' : 'is-error');
    statusBox.textContent = msg;
    statusBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Etiquetas legibles para el aviso de "campos obligatorios"
  var REQUIRED_LABELS = {
    nombre: 'Nombre completo', email: 'Correo electrónico', telefono: 'Teléfono',
    servicio: 'Servicio requerido', mensaje: 'Describa su proyecto'
  };

  // Validación básica en JS (adicional a la validación HTML5 nativa):
  // devuelve el primer campo obligatorio que quedó vacío, o null si están todos.
  function firstEmptyRequired(){
    var els = form.querySelectorAll('[required]');
    for (var i = 0; i < els.length; i++){
      if (!String(els[i].value || '').trim()) return els[i];
    }
    return null;
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();

    // 0) Honeypot: si el campo trampa "_gotcha" viene relleno, es un bot.
    // Se corta en silencio (sin mensaje de error) para no darle pistas al script.
    var honeypot = form.querySelector('[name="_gotcha"]');
    if (honeypot && honeypot.value) return;

    // 1) Validación básica en JS: campos obligatorios completos
    var empty = firstEmptyRequired();
    if (empty){
      showStatus('error', 'Complete los campos obligatorios: falta «' +
        (REQUIRED_LABELS[empty.name] || empty.name) + '».');
      empty.focus();
      return;
    }

    // 2) Validación HTML5 nativa: formato de correo, patrón de teléfono, largos mínimos
    if (!form.checkValidity()){
      form.reportValidity();
      return;
    }

    // Mantener el enlace de WhatsApp de respaldo con los datos ya escritos
    wppFormBtn.setAttribute('href', buildWppMessage());

    var action = form.getAttribute('action') || '';
    if (action.indexOf('TU_ID_FORMSPREE') !== -1){
      showStatus('error',
        'El envío por correo todavía se está habilitando. Puede enviarnos esta misma ' +
        'solicitud ahora por WhatsApp con el botón de abajo (ya incluye sus datos).');
      wppFormBtn.focus();
      return;
    }

    submitBtn.disabled = true;
    var originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando…';

    fetch(action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
    .then(function(res){
      if (res.ok){
        form.reset();
        wppFormBtn.setAttribute('href', buildWppMessage());
        showStatus('ok', '¡Gracias! Recibimos su solicitud y le responderemos a la brevedad.');
      } else {
        return res.json().then(function(data){
          var m = (data && data.errors) ? data.errors.map(function(x){return x.message;}).join(', ')
                                        : 'No se pudo enviar la solicitud.';
          showStatus('error', m + ' También puede escribirnos por WhatsApp con el botón de abajo.');
        });
      }
    })
    .catch(function(){
      wppFormBtn.setAttribute('href', buildWppMessage());
      showStatus('error',
        'Hubo un problema de conexión y no pudimos enviar la solicitud. Use el botón ' +
        '«Prefiero WhatsApp» de abajo (conserva sus datos) o reinténtelo en un momento.');
    })
    .finally(function(){
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    });
  });

  /* --------------------------------------------------------
     G. ALTERNATIVA: EMAILJS (dejar comentado si usas Formspree)
     --------------------------------------------------------
     1. Añade en el <head>:
        <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"><\/script>
     2. Reemplaza las claves y descomenta:

     // emailjs.init({ publicKey: 'TU_PUBLIC_KEY' });
     // form.addEventListener('submit', function(e){
     //   e.preventDefault();
     //   if (!form.checkValidity()){ form.reportValidity(); return; }
     //   submitBtn.disabled = true;
     //   emailjs.sendForm('TU_SERVICE_ID', 'TU_TEMPLATE_ID', form)
     //     .then(function(){ form.reset(); showStatus('ok', '¡Gracias! Recibimos tu solicitud.'); })
     //     .catch(function(){ showStatus('error', 'No se pudo enviar. Usa WhatsApp por favor.'); })
     //     .finally(function(){ submitBtn.disabled = false; });
     // });
     -------------------------------------------------------- */

})();
