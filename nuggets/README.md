# Gene Nuggets – Reiter in v21-report-app.html

Eingebaut am 22.10.2026 (Sitzung „Gene Nuggets“). Route `#nuggets`, Nav-Eintrag nach „Analysen“ (Rail + Handy-Tabs).

## Was wo liegt
- `nuggets/content/*.json` – 45 Lektionen (Texte, Quiz, Ergebniskarten, Clip-Verweise); `gene` und `folsaeure` stehen direkt im Script.
- `nuggets/clips/*.mp4/.jpg` – 79 exakt geschnittene Clips aus Daniels Hauptvideos.
- `nuggets/img/` – Körper (Frau/Mann), Stationsbilder, Lektionsbilder (Higgsfield), Berichtsgrafik „Was sind Gene“.

## Im HTML
Alles zwischen den Markern `GENE-NUGGETS:BEGIN` / `GENE-NUGGETS:END`:
- `<style id="gn-css">` – Stile, alle unter `.gn` gekapselt
- `<section class="view gn" data-view="nuggets">` – Bereich inkl. Lektions-Sheet, Abschluss-Overlay, Demo-Steuerung
- `<script id="gn-js">` – Logik; alle IDs mit Vorsilbe `gn-`; Fortschritt in localStorage `gn.proto.v1`
- `ROUTES` enthält `'nuggets'`

## Weiterbearbeiten
Direkt in `v21-report-app.html` ändern ist ok. **Achtung:** Ein erneuter Lauf von
`GENE NUGGETS\prototype\integrate_v21.py` ersetzt die Blöcke zwischen den Markern wieder durch den Stand aus
`GENE NUGGETS\prototype\app\` – dann gehen direkte Änderungen innerhalb der Marker verloren.
Sicherung vor dem Einbau: `_verworfen/v21-report-app.BACKUP-vor-GeneNuggets-*.html`.
