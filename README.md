# לימוד־לוח

A printable learning calendar for the beis medrash: Daf Yomi, Dirshu Amud HaYomi, Mishna Berura (Daf HaYomi B'Halacha), Rambam, מאמר מרדכי (both tracks, with daily and monthly chazara), חובות הלבבות and your own limudim. It makes a day, week, month or tests sheet, with zmanim, and downloads it as a PDF (one sheet per page, at the exact paper size) or prints it.

It is a plain static site: no build step and no server code.

## Put it on GitHub Pages

1. Create a repository and push everything in this folder, including the hidden `.nojekyll` file.
2. On GitHub, open **Settings → Pages**. Under **Source**, choose **Deploy from a branch**, pick `main` and `/ (root)`, then click **Save**.
3. After a minute the site is live at `https://<user>.github.io/<repo>/`.

To try it on your own computer, run any static server in this folder (for example `npx serve .`) and open the address it prints. Opening `index.html` directly from disk also works, but the network check skips the site's own files in that case.

## Files

| Path | What it is |
|---|---|
| `index.html` | The page |
| `css/app.css` | The controls around the poster |
| `css/sheet.css` | The printed poster (month, week, day and tests sheets) |
| `css/fonts.css`, `fonts/` | Frank Ruhl Libre and Heebo, served from this site (SIL Open Font License) |
| `js/calendar.js` | Hebrew calendar, parshiyos, holidays, Daf Yomi, Yerushalmi, Tehillim, and offline sunrise/sunset for Monsey |
| `js/learning.js` | Amud-a-day, Mishnayos, Dirshu Amud HaYomi, Mishna Berura and Rambam schedules |
| `js/data/dirshu-tests-5787.js` | Dirshu's 5787 test schedule (date, program, material) — add next year's file the same way |
| `js/data/mishna-berura.js` | Dirshu's Mishna Berura luach (transcribed by Hebcal), 20 Feb 2022 – 31 Aug 2027 |
| `js/state.js` | Settings, presets, zmanim loading, and what goes on each day |
| `js/sheet.js` | Builds and fits each sheet |
| `js/netcheck.js` | Checks on load that outside services are reachable, and warns if a web filter blocks them |
| `js/app.js` | Tabs, buttons, dialogs, printing and the PDF |
| `vendor/` | html2canvas 1.4.1 and jsPDF 2.5.1 (MIT), served from this site |

## Web filters

The only outside service is **www.hebcal.com**, used for zmanim. Fonts and libraries are part of this site, so a filter that allows the site also allows them.

If Hebcal is blocked, the page shows a notice saying what won't work and what to ask the filter company to open. In Monsey (10952) the zmanim are then worked out in the browser, marked with ~. To add another outside service later, add an entry to `NET_CHECKS` in `js/netcheck.js`.

## Every month

The חובות הלבבות shiur is a list of daily lines, starting 12 Oct 2026. Add next month's lines by editing the limud on the page under "דיינע אייגענע לימודים". The Mishna Berura luach runs out on 31 Aug 2027; after that `js/data/mishna-berura.js` needs the next luach.

## PDF

“נעם אראפ PDF” makes the file in the browser, the same way as the mishna-generator: each sheet is drawn by the browser (html2canvas) so Hebrew and fonts match the preview, and put on its own page at the exact paper size (jsPDF). Choose how many sheets and the quality (150 / 220 / 300 DPI; very large posters are capped so phones can draw them). “דרוק” still opens the browser's print dialog for the sheet on screen.

## Project dedication

Every sheet carries a small line at the bottom: **לע״נ אסתר בילא ע״ה בת יבלחט״א מו״ה שמשון צבי ני״ו** (`PROJECT_DED` in `js/state.js`). It is on by default. Turning it off (under 03 אויסזען) asks first; it comes back on after “ווידער פון אנהייב”, when the page is opened from a shared link, and when saved settings are upgraded to a new version.

## Releasing a change

GitHub Pages lets browsers keep each file for about 10 minutes, so a new `index.html` could otherwise run with an old cached script. Every stylesheet and script link in `index.html` ends in `?v=N`: when you change any CSS or JS file, raise that number everywhere (for example `sed -i 's/?v=3"/?v=4"/g' index.html`).
