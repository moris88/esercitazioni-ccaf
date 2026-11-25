// Genera i due PDF dai dati del simulatore. Uso: npm run pdf [-- cartella di destinazione]
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createServer } from 'vite';

const root = resolve(import.meta.dirname, '..');
const target = resolve(process.argv[2] ?? join(root, '..'));
const edge = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
].find(existsSync);
if (!edge) throw new Error('Microsoft Edge non trovato: serve per creare i PDF');

const server = await createServer({
  root,
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});
const { exercises } = await server.ssrLoadModule('/src/exercises/index.ts');
const { prePractice } = await server.ssrLoadModule('/guide/practice.ts');
const { domainPractice } = await server.ssrLoadModule('/guide/practiceDomains.ts');
await server.close();
const practice = { ...prePractice, ...domainPractice };

const esc = (text) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const list = (items) => `<ul>${items.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>`;
const step = ({ text, prompt }) => `<li>${esc(text)}${prompt ? `<pre>${esc(prompt)}</pre>` : ''}</li>`;

const exercisePage = (exercise) => {
  const { needs, steps } = practice[exercise.id];
  return `<section class="page">
<p class="kicker">Esercitazione ${exercise.code} · ${esc(exercise.lesson)}</p>
<h1>${esc(exercise.title)}</h1>
<p class="muted">Dove: ${esc(exercise.place)} · Durata: ${exercise.minutes} min</p>
<h2>Obiettivo</h2><p>${esc(exercise.goal)}</p>
<h2>Cosa serve</h2>${list(needs)}
<h2>Passi</h2><ol>${steps.map(step).join('')}</ol>
<h2>Cosa osservare</h2>${list(exercise.observe)}
<p class="note"><b>Il collegamento con l’esame:</b> ${esc(exercise.exam)}</p>
</section>`;
};

const rows = exercises.map(
  (e) =>
    `<tr><td><b>${e.code}</b></td><td>${esc(e.lesson)}</td><td>${esc(e.title)}</td><td>${esc(e.place)}</td><td>${e.minutes} min</td></tr>`,
);
const cover = `<section class="page">
<p class="kicker">Corso CCA-F · Parte pratica</p>
<h1>Esercitazioni con Claude</h1>
<p>Le stesse esercitazioni del simulatore, da rifare da soli. Non serve programmare: si usano solo la chat di Claude (app o browser) e Claude Code nel terminale.</p>
<p class="note"><b>Come usarle.</b> I riquadri grigi si copiano così come sono. Preparate prima il computer con «Guida_setup_e_avvio.pdf». Le risposte di Claude cambiano da una prova all’altra: contano i punti da osservare, non il testo identico.</p>
<h2>Le ${exercises.length} esercitazioni</h2>
<table><tr><th>N.</th><th>Lezione</th><th>Esercitazione</th><th>Dove</th><th>Durata</th></tr>${rows.join('')}</table>
</section>`;

const css = readFileSync(join(import.meta.dirname, 'pdf.css'), 'utf8');
const temp = mkdtempSync(join(tmpdir(), 'pdf-corso-'));

function print(name, title, body) {
  const html = join(temp, `${name}.html`);
  const pdf = join(target, `${name}.pdf`);
  const footer = `@page { @bottom-left { content: "Corso CCA-F · ${title}"; } }`;
  writeFileSync(
    html,
    `<!doctype html><html lang="it"><head><meta charset="utf-8"><title>${title}</title><style>${css}${footer}</style></head><body>${body}</body></html>`,
  );
  const startedAt = Date.now();
  execFileSync(
    edge,
    [
      '--headless',
      '--disable-gpu',
      `--user-data-dir=${join(temp, 'profilo')}`,
      '--no-pdf-header-footer',
      `--print-to-pdf=${pdf}`,
      pathToFileURL(html).href,
    ],
    { stdio: 'ignore' },
  );
  if (!existsSync(pdf) || statSync(pdf).mtimeMs < startedAt - 2000) throw new Error(`PDF non creato: ${pdf}`);
  console.log(`Creato ${pdf}`);
}

print('Esercitazioni_pratiche', 'Esercitazioni con Claude', cover + exercises.map(exercisePage).join(''));
print(
  'Guida_setup_e_avvio',
  'Guida al setup e all’avvio',
  readFileSync(join(import.meta.dirname, 'setup.html'), 'utf8'),
);
rmSync(temp, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 });
