# I Saraceni di Lucera

Sito statico dell'ASD I Saraceni di Lucera, realizzato con Astro e gestito con Sveltia CMS. I contenuti vengono salvati come file Markdown nel repository e pubblicati su Cloudflare Pages.

## Sviluppo locale

Requisiti: Node.js, npm e, per il CMS locale, un browser basato su Chromium.

```bash
npm install
npm run dev
```

Il sito è disponibile su `http://localhost:4321`. Il comando `predev` copia il bundle Sveltia in `public/admin/sveltia-cms.js`.

## Gestione contenuti in locale

Per modificare i contenuti con Sveltia CMS:

```bash
npm run dev
```

Apri `http://localhost:4321/admin/index.html`, scegli **Work with Local Repository** e seleziona la cartella principale del progetto. Sveltia scrive direttamente nei file locali, senza autenticazione GitHub e senza server proxy.

Il flusso locale richiede Chrome, Edge, Brave o un altro browser Chromium. In Brave bisogna abilitare il flag `brave://flags/#file-system-access-api`.

Le modifiche possono essere commitate manualmente con Git. In alternativa, in **Settings > Developer**, attiva **Commit Changes to Git**; in tal caso configura nome ed email nel repository con `git config --local user.name` e `git config --local user.email`.

## Produzione

In produzione il CMS usa il backend GitHub configurato in `public/admin/config.yml`:

- repository: `Repain98/i-saraceni-di-lucera`;
- branch: `main`;
- autenticazione tramite `base_url: https://sveltia-cms-auth.repain.workers.dev`.

Ogni salvataggio crea un commit su `main` e Cloudflare Pages ripubblica il sito. La pagina di gestione è raggiungibile su `/admin`, che reindirizza a `/admin/` tramite `public/_redirects`.

Il bundle `public/admin/sveltia-cms.js` viene copiato da `node_modules/@sveltia/cms/dist/sveltia-cms.js` da `scripts/sync-sveltia-cms.mjs` durante `predev` e `prebuild`; è generato e non va versionato.

## Indicizzazione

Il flag `noindex` in `src/data/site.json` è attivo di default (`true`): tutte le pagine includono `<meta name="robots" content="noindex, nofollow">`, `/robots.txt` blocca i crawler con `Disallow: /` e la sitemap non viene generata.

Al lancio ufficiale impostare `noindex: false`. In questo modo le pagine passano a `index, follow`, `/robots.txt` permette tutto con `Allow: /` e la build genera la sitemap.

## Contenuti

- `src/content/impostazioni/`: dati della società, pagina iniziale e numeri in evidenza.
- `src/content/news/`: notizie.
- `src/content/gare/`: calendario gare.
- `src/content/palmares/`: palmarès.
- `src/content/stralucera/`: edizioni della Stralucera.
- `src/content/sponsor/`: sponsor.
- `src/content/galleria/`: album fotografici.
- `src/content/allenamenti/`: giorni e orari degli allenamenti.
- `src/content/pagine/`: testi delle pagine istituzionali.

Le immagini caricate dal CMS vengono salvate in `src/assets/uploads/` e servite pubblicamente da `/images/uploads/`.

Le voci non definitive devono riportare `[ESEMPIO]` nel titolo o nel nome. Usa `[DA COMPILARE]` solo per i campi ancora vuoti.

## Verifica

```bash
npm run build
npm run check:placeholders
npm run preview
```

La build viene generata in `dist/`.

`npm run check:placeholders` controlla `src/content`, `src/data` e `dist` e cerca i marker `[DA COMPILARE]`, `[ESEMPIO]`, `[PROVA]`, `[DA CONFERMARE]` e `Testo della pagina da completare`. Elenca i file interessati e il conteggio per tipo; termina con codice 1 se trova almeno un segnaposto. Va eseguito dopo la build e prima della pubblicazione.
