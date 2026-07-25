/**
 * Translated page bodies.
 *
 * Each of these is written, not machine-translated — see i18n.mjs for why that
 * distinction is load-bearing rather than pedantic. If you add a locale, write
 * it or have it written; do not paste the English through a translation model
 * and ship it. A wrong-but-fluent translation is worse than no translation,
 * because it reads as generated content to exactly the reviewer you're trying
 * to convince.
 *
 * Kept structurally parallel to the English homepage so the two stay in sync
 * when the pitch changes.
 */
import * as C from "./site.config.mjs";

export const homeES = {
  lang: "es",
  path: "/",
  title: `${C.NAME} — Comparador de textos y código, gratis y sin registro`,
  description:
    "Compara dos versiones de un texto o de código y ve exactamente qué ha cambiado, con las palabras modificadas resaltadas. Todo funciona en tu navegador: nada se sube a ningún servidor.",
  bodyHtml: `
  <section class="hero hero--home">
    <span class="badge"><span class="dot" aria-hidden="true"></span>Todo funciona en tu navegador — no se sube nada</span>
    <h1>${C.NAME}</h1>
    <p class="lede">Un comparador de diferencias que no reserva nada para una versión de pago: resaltado de sintaxis en unos 17 lenguajes, detalle carácter a carácter, vistas dividida y unificada, fusión a tres bandas y comparación de imágenes y CSV. Todo gratis, sin límites de uso y ejecutándose en tu propio equipo.</p>
  </section>

  <section class="guide">
    <h2>Para qué sirve un comparador de diferencias</h2>
    <p>Un «diff» toma dos versiones del mismo texto y calcula el conjunto mínimo de cambios que convierte una en la otra. En lugar de leer ambas en paralelo buscando la diferencia, la ves marcada directamente. Es el mismo mecanismo que hay detrás del comando <code>diff</code>, de la vista de revisión de GitHub o de «comparar versiones» en un procesador de textos, reducido a una sola página sin nada que instalar.</p>
    <p>Resulta útil siempre que tengas un «antes» y un «después»: dos borradores de un documento, un fichero de configuración antes y después de editarlo, un fragmento de código que estás refactorizando, dos exportaciones que deberían coincidir, o un contrato que ha vuelto con «un par de retoques». ${C.NAME} no solo señala qué <em>líneas</em> cambian, sino las <em>palabras</em> exactas dentro de una línea modificada, de modo que corregir un carácter no ilumina la fila entera.</p>

    <h2>Por qué importa que no se suba nada</h2>
    <p>La mayoría de comparadores online envían tu texto a un servidor para calcular la comparación. ${C.NAME} no: todo el proceso ocurre en tu navegador con JavaScript, así que lo que pegues — código propietario, un borrador de contrato, un fichero de configuración con credenciales, datos personales — no sale de tu dispositivo en ningún momento.</p>
    <p>No hace falta que te fíes de nuestra palabra. Abre la pestaña de red de tu navegador mientras comparas: no verás ninguna petición que lleve tu contenido. O desconéctate de internet — la herramienta sigue funcionando, cosa imposible si el trabajo lo hiciera un servidor.</p>

    <h2>Texto, código, datos y documentos</h2>
    <p>Como la comparación trabaja sobre texto, es independiente del formato y del lenguaje. Hay páginas específicas para los formatos que más se comparan, cada una con las advertencias propias de ese formato — por ejemplo, por qué ignorar los espacios en blanco es peligroso en Python, donde la indentación define los bloques, o por qué el orden de las claves puede ocultar el cambio real en JSON.</p>
    <p><a href="/">Ver la versión en inglés del sitio completo →</a></p>
  </section>`,
};

export const homeDE = {
  lang: "de",
  path: "/",
  title: `${C.NAME} — Text- und Code-Vergleich, kostenlos und ohne Anmeldung`,
  description:
    "Vergleiche zwei Versionen eines Textes oder Codes und sieh genau, was sich geändert hat — mit hervorgehobenen Wörtern. Alles läuft im Browser: nichts wird hochgeladen.",
  bodyHtml: `
  <section class="hero hero--home">
    <span class="badge"><span class="dot" aria-hidden="true"></span>Läuft vollständig im Browser — nichts wird hochgeladen</span>
    <h1>${C.NAME}</h1>
    <p class="lede">Ein Diff-Werkzeug, das nichts für eine Bezahlversion zurückhält: Syntaxhervorhebung für rund 17 Sprachen, Unterschiede auf Zeichenebene, geteilte und vereinheitlichte Ansicht, Drei-Wege-Merge sowie Bild- und CSV-Vergleich. Alles kostenlos, ohne Nutzungsgrenzen und auf deinem eigenen Rechner.</p>
  </section>

  <section class="guide">
    <h2>Wozu ein Diff-Werkzeug dient</h2>
    <p>Ein Diff nimmt zwei Versionen desselben Textes und ermittelt die kleinste Menge an Änderungen, die aus der einen die andere macht. Statt beide nebeneinander zu lesen und nach dem Unterschied zu suchen, wird er dir direkt markiert. Dasselbe Prinzip steckt hinter dem Befehl <code>diff</code>, hinter der Review-Ansicht auf GitHub und hinter „Versionen vergleichen" in einer Textverarbeitung — hier auf eine einzige Seite reduziert, ohne Installation.</p>
    <p>Nützlich ist das immer dann, wenn es ein „vorher" und ein „nachher" gibt: zwei Entwürfe eines Dokuments, eine Konfigurationsdatei vor und nach einer Änderung, ein Code-Ausschnitt beim Refactoring, zwei Exporte, die eigentlich übereinstimmen sollten, oder ein Vertrag, der mit „nur ein paar Kleinigkeiten" zurückkommt. ${C.NAME} zeigt nicht nur, welche <em>Zeilen</em> sich unterscheiden, sondern die genauen <em>Wörter</em> innerhalb einer geänderten Zeile — eine Korrektur an einem Zeichen lässt also nicht die ganze Zeile aufleuchten.</p>

    <h2>Warum „nichts wird hochgeladen" der entscheidende Punkt ist</h2>
    <p>Die meisten Online-Diff-Werkzeuge schicken deinen Text zur Berechnung an einen Server. ${C.NAME} nicht: Der gesamte Vergleich läuft mit JavaScript in deinem Browser. Was du einfügst — proprietärer Code, ein Vertragsentwurf, eine Konfigurationsdatei mit Zugangsdaten, personenbezogene Daten — verlässt dein Gerät zu keinem Zeitpunkt.</p>
    <p>Du musst uns das nicht glauben. Öffne den Netzwerk-Tab deines Browsers während des Vergleichs: Es geht keine Anfrage mit deinem Inhalt hinaus. Oder trenne die Internetverbindung — das Werkzeug arbeitet weiter, was unmöglich wäre, wenn ein Server die Arbeit erledigte.</p>

    <h2>Text, Code, Daten und Dokumente</h2>
    <p>Da der Vergleich auf Textebene arbeitet, ist er format- und sprachunabhängig. Für die am häufigsten verglichenen Formate gibt es eigene Seiten, jeweils mit den Fallstricken des Formats — etwa warum das Ignorieren von Leerraum in Python gefährlich ist, wo die Einrückung Blöcke definiert, oder warum die Reihenfolge der Schlüssel in JSON die eigentliche Änderung verdecken kann.</p>
    <p><a href="/">Zur englischen Version der vollständigen Website →</a></p>
  </section>`,
};

export const TRANSLATIONS = [homeES, homeDE];
