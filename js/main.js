/* COSMOPESIMISMO: comportamiento del sitio
   - barra de progreso: posición en el libro completo
   - flechas del teclado: página anterior / siguiente
   - recuerda la última página leída (portada: "continuar en…")
   - Congelamiento: los fragmentos cristalizan al aparecer;
     el fondo pasa del azul profundo a la luz de Pléyades
   - DÉCADA 4: los versos caen hacia el centro
   - Pléyades ☆☆☆☆☆: la cabina se reduce mientras se lee
   - Pléyades: cielo estrellado de fondo */
(function () {
  "use strict";

  var body = document.body;
  var n = parseInt(body.dataset.n, 10);
  var total = parseInt(body.dataset.total, 10);
  var quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var CLAVE = "cosmopesimismo:ultima";

  function limitar(x) { return Math.max(0, Math.min(1, x)); }

  /* ---------- progreso en el libro ---------- */
  var barra = document.querySelector(".progreso");
  function progreso() {
    if (!barra || isNaN(n) || n < 0) return;
    var alto = document.documentElement.scrollHeight - window.innerHeight;
    var dentro = alto > 0 ? limitar(window.scrollY / alto) : 1;
    barra.style.setProperty("--avance", ((n + dentro) / total).toFixed(4));
  }

  /* ---------- teclado ---------- */
  document.addEventListener("keydown", function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    var rel = e.key === "ArrowRight" ? "next" : e.key === "ArrowLeft" ? "prev" : null;
    if (!rel) return;
    var a = document.querySelector('.paso a[rel="' + rel + '"]');
    if (a) window.location.href = a.href;
  });

  /* ---------- recordar dónde quedó la lectura ---------- */
  try {
    if (n >= 0) {
      var h1 = document.querySelector("h1");
      var nombre = h1 ? (h1.getAttribute("aria-label") || h1.textContent).trim() : document.title;
      localStorage.setItem(CLAVE, JSON.stringify({ url: location.pathname.split("/").pop(), titulo: nombre }));
    } else {
      var ultima = JSON.parse(localStorage.getItem(CLAVE) || "null");
      var cont = document.querySelector(".continuar");
      if (ultima && ultima.url && cont) {
        cont.href = ultima.url;
        cont.querySelector("span").textContent = ultima.titulo;
        cont.hidden = false;
      }
    }
  } catch (err) { /* sin almacenamiento: no pasa nada */ }

  /* ---------- aparición (Congelamiento) ---------- */
  var aparecer = document.querySelectorAll(".aparecer");
  if (aparecer.length) {
    if (quieto || !("IntersectionObserver" in window)) {
      aparecer.forEach(function (el) { el.classList.add("visible"); });
    } else {
      var obs = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("visible"); obs.unobserve(en.target); }
        });
      }, { rootMargin: "0px 0px -12% 0px", threshold: 0.15 });
      aparecer.forEach(function (el) { obs.observe(el); });
    }
  }

  /* ---------- DÉCADA 4: gravedad ---------- */
  var gravedad = quieto ? [] : Array.prototype.slice.call(document.querySelectorAll('[data-efecto="gravedad"]'));
  // Cada verso se envuelve en un <span> para medir el ancho real del texto.
  // En reposo se mide cuánto le falta a cada verso para llegar al centro;
  // al bajar, los versos finales recorren casi todo ese camino.
  var distancias = [];
  gravedad.forEach(function (bloque) {
    bloque.querySelectorAll(".v").forEach(function (v) {
      var s = document.createElement("span");
      s.textContent = v.textContent;
      v.textContent = "";
      v.appendChild(s);
    });
  });
  function medir() {
    distancias = gravedad.map(function (bloque) {
      var lineas = Array.prototype.slice.call(bloque.querySelectorAll(".v"));
      lineas.forEach(function (v) { v.style.transform = ""; });
      var r = bloque.getBoundingClientRect();
      var centro = r.left + r.width / 2;
      return lineas.map(function (v) {
        var t = v.firstChild.getBoundingClientRect();
        return { v: v, dx: centro - (t.left + t.width / 2) };
      });
    });
  }
  function caer() {
    gravedad.forEach(function (bloque, i) {
      var r = bloque.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = limitar((vh * 0.85 - r.top) / (r.height + vh * 0.35));
      p = p * p * (3 - 2 * p);
      var lineas = distancias[i] || [];
      lineas.forEach(function (l, k) {
        var peso = Math.pow((k + 1) / lineas.length, 1.4);
        l.v.style.transform = "translateX(" + (l.dx * p * peso).toFixed(1) + "px)";
        l.v.style.opacity = (1 - p * peso * 0.3).toFixed(3);
      });
    });
  }
  if (gravedad.length) {
    medir();
    window.addEventListener("resize", medir);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { medir(); caer(); });
  }

  /* ---------- Pléyades ☆☆☆☆☆: la cabina se reduce ---------- */
  var cabinas = document.querySelectorAll('[data-efecto="estrechar"]');
  function estrechar() {
    cabinas.forEach(function (c) {
      var r = c.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = limitar((vh * 0.6 - r.top) / Math.max(r.height, 1));
      c.style.setProperty("--ancho-cabina", (40 - p * 15).toFixed(2) + "em");
    });
  }


  /* ---------- Congelamiento: del azul profundo a la luz ---------- */
  var hielo = document.querySelector("[data-colores]");
  var colores = hielo ? hielo.dataset.colores.trim().split(/\s+/).map(function (c) {
    return [1, 3, 5].map(function (i) { return parseInt(c.substr(i, 2), 16); });
  }) : [];
  var TINTA_CLARA = { tinta: "#dfe7f1", tenue: "#8d9db4", luz: "#86aedb" };
  var TINTA_OSCURA = { tinta: "#13213a", tenue: "#4b5e78", luz: "#2c5c97" };
  function luminancia(rgb) {
    var l = rgb.map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2];
  }
  function enfriar() {
    var alto = document.documentElement.scrollHeight - window.innerHeight;
    var p = alto > 0 ? limitar(window.scrollY / alto) : 0;
    var x = p * (colores.length - 1);
    var i = Math.min(Math.floor(x), colores.length - 2);
    var t = x - i;
    var rgb = colores[i].map(function (v, k) { return Math.round(v + (colores[i + 1][k] - v) * t); });
    var raiz = document.documentElement.style;
    raiz.setProperty("--bg", "rgb(" + rgb.join(",") + ")");
    var tinta = luminancia(rgb) > 0.2 ? TINTA_OSCURA : TINTA_CLARA;
    raiz.setProperty("--tinta", tinta.tinta);
    raiz.setProperty("--tenue", tinta.tenue);
    raiz.setProperty("--luz", tinta.luz);
  }

  /* ---------- bucle de scroll ---------- */
  var pendiente = false;
  function alMover() {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(function () {
      pendiente = false;
      progreso();
      if (gravedad.length) caer();
      if (cabinas.length) estrechar();
      if (colores.length > 1) enfriar();
    });
  }
  window.addEventListener("scroll", alMover, { passive: true });
  window.addEventListener("resize", alMover);
  alMover();

  /* ---------- cielo de Pléyades ---------- */
  var lienzo = document.querySelector("canvas.cielo");
  if (lienzo && lienzo.getContext) {
    var ctx = lienzo.getContext("2d");
    var astros = [];
    var semilla = 7;
    function azar() { semilla = (semilla * 16807) % 2147483647; return (semilla - 1) / 2147483646; }
    function preparar() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      lienzo.width = Math.round(innerWidth * dpr);
      lienzo.height = Math.round(innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      semilla = 7 + n;
      astros = [];
      var cuantos = Math.round(innerWidth * innerHeight / 7000);
      for (var i = 0; i < cuantos; i++) {
        astros.push({
          x: azar() * innerWidth,
          y: azar() * innerHeight,
          r: 0.25 + Math.pow(azar(), 3) * 1.1,
          a: 0.15 + azar() * 0.55,
          f: azar() * Math.PI * 2,
          v: 0.15 + azar() * 0.35
        });
      }
    }
    function dibujar(t) {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (var i = 0; i < astros.length; i++) {
        var s = astros[i];
        var a = quieto ? s.a : s.a * (0.75 + 0.25 * Math.sin(s.f + t * 0.001 * s.v));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(28,52,96," + (a * 0.6).toFixed(3) + ")";
        ctx.fill();
      }
      if (!quieto) requestAnimationFrame(dibujar);
    }
    preparar();
    window.addEventListener("resize", function () { preparar(); if (quieto) dibujar(0); });
    if (quieto) dibujar(0); else requestAnimationFrame(dibujar);
  }
})();
