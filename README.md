SPPR – Game Deals Applicatie
Over het project
SPPR is een webapplicatie waarmee gebruikers games kunnen bekijken, beheren en game-aanbiedingen kunnen vinden. De applicatie is gemaakt met Vue 3 en maakt gebruik van n8n om gamegegevens op te halen via de CheapShark API.
Functionaliteiten
- Homepagina: startpagina van de applicatie.
- Games: zelf games toevoegen, bekijken, aanpassen en verwijderen.
- Project Nexus: game-aanbiedingen ophalen via n8n.
  - Zoeken op gametitel.
  - Filteren op maximale prijs.
  - Filteren op Steam-beoordeling.
  - Sorteren op prijs of naam.
  - Resultaten opnieuw ophalen.
- Project Nexus Extra: uitgebreide versie met extra filters en mogelijkheden.
- Over ons: informatie over de maker.
Benodigdheden
Om het project te gebruiken heb je nodig:
- Node.js
- npm
- Visual Studio Code (aanbevolen).
- Docker Desktop met n8n voor de Nexus-functionaliteiten.
- Een moderne internetbrowser.
Installatie
1. Pak het project uit.
2. Open de map Sppr-Vue in Visual Studio Code.
3. Open de terminal.
4. Voer het volgende commando uit om alle benodigde packages te installeren:
npm install


n8n instellen
Voor de game-aanbiedingen wordt n8n gebruikt.
1. Start Docker Desktop.
2. Start de n8n-container.
3. Open n8n via:
http://localhost:5678


4. Importeer het bestand My workflow.json in n8n.
5. Controleer of de workflow actief is.
De applicatie gebruikt twee webhooks:

Games:
http://localhost:5678/webhook/games


Featured Games:
http://localhost:5678/webhook/games-featured


De gegevens worden opgehaald via de CheapShark API. Hierbij worden onder andere de gamenaam, huidige prijs, originele prijs, korting, Steam-beoordeling en afbeelding opgehaald.
Applicatie starten
Open de terminal in de map Sppr-Vue en voer het volgende commando uit:
npm run dev


Daarna kun je de applicatie openen via het lokale adres dat Vite in de terminal weergeeft. Dit is meestal:
http://localhost:5173/


Pagina's
De applicatie bevat de volgende pagina's:
Pagina	URL
Home	/
Games	/games
Project Nexus	/nexus
Project Nexus Extra	/nexus/extra
Over ons	/over-ons

Productieversie bouwen
Om een productieversie van de applicatie te maken, gebruik je:
npm run build


De gebouwde bestanden worden opgeslagen in de map dist.

Om de productieversie lokaal te bekijken:
npm run preview


Code controleren
Voor het controleren en formatteren van de code zijn de volgende commando's beschikbaar:

Lint uitvoeren:
npm run lint


Code formatteren:
npm run format


Gebruikte technologieën
- Vue 3
- Vue Router
- Vite
- JavaScript
- HTML
- CSS
- jQuery
- n8n
- CheapShark API
Problemen oplossen
De games worden niet geladen:
- Controleer of Docker Desktop actief is.
- Controleer of n8n draait.
- Controleer of de workflow actief is.
- Controleer of de webhook-URL klopt.
De applicatie start niet:
- Controleer of Node.js geïnstalleerd is.
- Voer opnieuw npm install uit.
- Start de applicatie opnieuw met npm run dev.
Games worden niet opgeslagen:
- De Games-pagina gebruikt localStorage.
- Controleer of de browser lokale opslag toestaat.
