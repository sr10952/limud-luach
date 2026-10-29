# לימוד־לוח

A printable learning calendar for the beis medrash: Daf Yomi, Dirshu Amud HaYomi, Mishna Berura (Daf HaYomi B'Halacha), Rambam, מאמר מרדכי (both tracks, with daily and monthly chazara), חובות הלבבות and your own limudim. It makes a day, week, month or tests sheet, with zmanim, and prints it or saves it as a PDF or image.

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
| `js/app.js` | Buttons, dialogs, printing, PDF and image |
| `vendor/` | html2canvas 1.4.1 and jsPDF 2.5.1 (MIT), served from this site |

## Web filters

The only outside service is **www.hebcal.com**, used for zmanim. Fonts and libraries are part of this site, so a filter that allows the site also allows them.

If Hebcal is blocked, the page shows a notice saying what won't work and what to ask the filter company to open. In Monsey (10952) the zmanim are then worked out in the browser, marked with ~. To add another outside service later, add an entry to `NET_CHECKS` in `js/netcheck.js`.

## Every month

The חובות הלבבות shiur is a list of daily lines, starting 12 Oct 2026. Add next month's lines by editing the limud on the page under "דיינע אייגענע לימודים". The Mishna Berura luach runs out on 31 Aug 2027; after that `js/data/mishna-berura.js` needs the next luach.
