# M&B Ingeniería y Construcción SpA — Sitio web corporativo

Sitio web estático, mobile-first, orientado a la generación de cotizaciones para
**M&B Ingeniería y Construcción SpA** (ingeniería, consultoría técnica y construcción
de obras civiles para clientes públicos y privados en Chile).

## Stack

- HTML5 semántico + CSS3 + JavaScript vanilla. Sin frameworks ni dependencias de build.
- CSS y JS en archivos externos propios (`assets/`), no inline: permite una política
  `Content-Security-Policy` estricta (sin `unsafe-inline`) y mejor cacheo por separado.
- Fuentes: Google Fonts (Poppins / Inter).
- Formulario vía **Formspree** (AJAX) con honeypot antispam y alternativa de
  contacto directo por WhatsApp.

## Estructura

```
/
├── index.html              Página principal
├── privacidad.html         Política de privacidad y aviso legal (Ley N° 19.628, Chile)
├── robots.txt / sitemap.xml
├── vercel.json              Cabeceras de seguridad (CSP, HSTS, etc.) y caché
├── .vercelignore            Excluye de producción lo que no es parte del sitio público
└── assets/
    ├── css/
    │   ├── styles.css        Estilos del sitio principal
    │   └── privacidad.css    Estilos de la página de privacidad
    ├── js/
    │   ├── theme-init.js     Aplica el tema guardado antes del render (evita FOUC)
    │   └── main.js           Menú móvil, formulario, tema, animaciones, etc.
    ├── data/
    │   └── organization.jsonld   Datos estructurados (SEO / Schema.org)
    └── img/
        ├── favicon.svg
        ├── logo-myb.png, Herobg.webp, og-cover.jpg, ...
        └── _source/           Imágenes originales sin optimizar (no se despliegan)
```

## Seguridad

- **CSP estricta** (`vercel.json`): `script-src 'self'` y `style-src` sin `unsafe-inline`;
  solo permite Google Fonts, Formspree y recursos propios. Cualquier script o estilo nuevo
  debe añadirse como archivo en `assets/` y, si carga un dominio externo nuevo, sumarlo
  al CSP.
- Cabeceras adicionales: HSTS, `X-Frame-Options: DENY`, `Referrer-Policy`,
  `Permissions-Policy`, `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy`.
- Formulario de cotización: honeypot (`_gotcha`) contra bots, validación nativa HTML5 +
  JS, sin `eval`/`innerHTML` con datos de usuario (no hay reflejo de input en el DOM).
- Sin cookies de seguimiento ni analítica de terceros.
- No hay backend propio ni base de datos: superficie de ataque limitada a lo que
  Vercel sirve como archivos estáticos.

## Despliegue

Proyecto estático: Vercel lo detecta automáticamente sin configuración de build
(output = raíz del repositorio). Cada push a `main` publica a producción.

## Pendientes de configuración

- [ ] Endpoint real de Formspree en el `action` del formulario (`index.html`),
      con destinatarios `contacto@mybingenieria.com` y `jaimeplaz@mybingenieria.com`.
- [ ] Actualizar `canonical`, Open Graph, `robots.txt`, `sitemap.xml` y el JSON-LD
      (`assets/data/organization.jsonld`) con el dominio definitivo de Vercel o el
      dominio propio, cuando esté conectado.
- [ ] Revisión legal del texto de `privacidad.html`.

> La empresa no tiene domicilio físico publicable: no hay sección de ubicación,
> mapa ni dirección en el sitio ni en el JSON-LD. Tampoco hay redes sociales.
