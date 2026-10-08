# Cosmopesimismo — sitio web

Poemario de Adolfo H. Rosas (2023). Texto: versión 8.0 (PDF, «texto híbrido»).

## Recorrido de lectura

`index.html` → `estelifera.html` → `decada.html` → `bruma.html` → `pornografia.html` → `cor-cordis.html` → `cosas.html` → `ammon.html` → `universo.html` → `congelamiento.html` → `congelamiento-texto.html` → `pleyades.html` → `pleyades-1.html` … `pleyades-7.html`

Cada página tiene enlaces «anterior / siguiente» abajo (y se puede avanzar con las flechas ← → del teclado).

## Cómo editar un poema

Abre el `.html` del poema con cualquier editor de texto (Bloc de notas, VS Code). Cada verso es una línea:

```html
<span class="v" style="--i:2">a la distancia mínima</span>
```

- `--i` es la sangría del verso (0 = margen izquierdo; 1, 2, 3… = un escalón más adentro). Sin `style`, el verso va al margen.
- `<span class="aire"></span>` es un pequeño espacio entre grupos de versos.
- `<section class="seccion">` + `<p class="numero">2</p>` son las partes numeradas (DÉCADA, COR CORDIS, AMMON).
- `<span class="hueco"></span>` es un espacio largo dentro de un verso.
- Los textos en prosa van en `<p class="prosa">…</p>`. Las voces de la nave usan `class="prosa nave voz-a"` (mayúsculas, color de la estrella) y `voz-b`.
- En `congelamiento-texto.html` cada fragmento es un `<section class="fragmento">` y la línea entre fragmentos es `<hr class="escarcha">`.

## Colores

Cada página define su paleta en la línea `<style>:root{…}</style>` del `<head>`:
`--bg` fondo, `--tinta` texto, `--tenue` texto secundario, `--luz` color de la estrella, `--brillo` intensidad del resplandor.
En Estelífera la luz va de amarillo (DÉCADA) a rojo enano (UNIVERSO); Congelamiento es blanco helado; Pléyades es oscuridad con estrellas.

El resto del diseño está en `css/estilo.css` y el comportamiento (barra de progreso, cielo estrellado, DÉCADA 4, la cabina de ☆☆☆☆☆) en `js/main.js`.

## Publicar en GitHub Pages

Una cuenta de GitHub puede tener una página por cada repositorio, además de la página principal de usuario. Este sitio quedaría en `https://<usuario>.github.io/cosmopesimismo/`.

1. En GitHub, crea un repositorio nuevo llamado `cosmopesimismo` (público, vacío, sin README).
2. Desde esta carpeta:
   ```
   git remote add origin https://github.com/<usuario>/cosmopesimismo.git
   git push -u origin main
   ```
3. En el repositorio: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` / `(root)` → Save**.
4. En uno o dos minutos el sitio está en línea. Cada `git push` posterior lo actualiza.

Para ver el sitio en tu computador, basta con abrir `index.html` en el navegador.
