# M&B Ingeniería y Construcción SpA — Sitio web corporativo

Sitio web estático, mobile-first, orientado a la generación de cotizaciones para
**M&B Ingeniería y Construcción SpA** (ingeniería, consultoría técnica y construcción
de obras civiles para clientes públicos y privados en Chile).

## Stack

- HTML5 semántico + CSS3 + JavaScript vanilla. Sin frameworks ni dependencias de build.
- `index.html` autocontenido (CSS y JS inline), comentado por sección.
- Fuentes: Google Fonts (Poppins / Inter).
- Formulario vía **Formspree** (AJAX) con alternativa de contacto directo por WhatsApp.

## Estructura

| Archivo | Descripción |
|---|---|
| `index.html` | Página principal (hero, quiénes somos, servicios, proyectos, cotización, ubicación, footer). |
| `privacidad.html` | Política de privacidad y aviso legal (Ley N° 19.628, Chile). |
| `robots.txt` / `sitemap.xml` | SEO técnico. |
| `vercel.json` | Cabeceras de seguridad y caché de estáticos para el despliegue en Vercel. |
| `hero-bg.webp`, `equipo-terreno.webp`, `proyecto-1..6.webp`, `og-image.jpg` | Recursos gráficos optimizados. |

## Despliegue

Proyecto estático: Vercel lo detecta automáticamente sin configuración de build
(output = raíz del repositorio). Cada push a `main` publica a producción.

## Pendientes de configuración

- [ ] Endpoint real de Formspree en el `action` del formulario (`index.html`).
- [ ] Dirección física definitiva (actualmente provisoria) en JSON-LD, sección Ubicación,
      footer y `privacidad.html`.
- [ ] URLs de redes sociales (LinkedIn / Instagram) en el footer.
- [ ] Revisión legal del texto de `privacidad.html`.
