# I Saraceni di Lucera

Sito statico dell'ASD I Saraceni di Lucera, realizzato con Astro e gestito con Decap CMS. I contenuti vengono salvati come file Markdown nel repository e pubblicati su Cloudflare Pages.

## Sviluppo locale

Requisiti: Node.js e npm.

```bash
npm install
npm run dev
```

Il sito è disponibile su `http://localhost:4321`.

## Gestione contenuti in locale

Per modificare i contenuti con Decap CMS senza creare commit o inviare dati online:

```bash
npm run dev:cms
```

Questo comando avvia insieme:

- Astro su `http://localhost:4321`;
- `decap-server` su `http://localhost:8081`.

Apri `http://localhost:4321/admin` e premi **Accedi**. In locale Decap usa il backend locale e scrive direttamente i file dentro `src/content`, senza autenticazione GitHub.

Se preferisci avviare i due processi separatamente:

```bash
npm run dev
npm run cms
```

`decap-server` non è una dipendenza del progetto: viene eseguito con `npx --yes`.

## Produzione

In produzione il CMS usa esclusivamente il backend GitHub configurato in `public/admin/config.yml`:

- repository: `Repain98/i-saraceni-di-lucera`;
- branch: `main`;
- accesso solo tramite autenticazione GitHub.

Non è presente alcun backend `test-repo`. L'accesso locale è attivo solo quando `decap-server` è in esecuzione sul computer dello sviluppatore.

La pagina di gestione risponde sia a `/admin` sia a `/admin/`.

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
