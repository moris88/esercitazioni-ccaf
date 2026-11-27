// Crea public/materiali-corso.zip con i materiali per i partecipanti (serve Windows/PowerShell)
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(root, '..');
const items = ['cartella-prova', 'kit', 'Esercitazioni_pratiche.pdf', 'Guida_setup_e_avvio.pdf'];
const out = join(root, 'public', 'materiali-corso.zip');

mkdirSync(dirname(out), { recursive: true });
rmSync(out, { force: true });
const paths = items.map((item) => `'${join(source, item).replaceAll("'", "''")}'`).join(',');
execFileSync('powershell', ['-NoProfile', '-Command', `Compress-Archive -Path ${paths} -DestinationPath '${out}'`], {
  stdio: 'inherit',
});
console.log(`Creato ${out}`);
