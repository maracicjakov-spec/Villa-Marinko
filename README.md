# Villa Marinko

Statična višejezična stranica: hrvatski, engleski, njemački i talijanski. Otvorite index.html ili pokrenite node server.js i posjetite http://127.0.0.1:4173.

## Funkcionalnosti
- 11 lokalnih AVIF fotografija
- Mobilni izbornik i trajni odabir jezika (localStorage; alternativno ?lang=en/de/it/hr)
- Prijevodi sadržaja, obrasca, galerije, pristupačnih oznaka i metapodataka
- Ulazne animacije, otkrivanje fotografija, postupni ulasci kartica i lagani parallax
- Poštivanje prefers-reduced-motion
- Galerija s tipkovnicom i swipe gestama
- Obrazac za upit bez kalendara: ime, e-mail, željeni termin kao tekst, broj gostiju, poruka

## E-mail — još nije povezan
Korisnik je zatražio da se primatelj doda kasnije. U contact-config.js postavite window.VILLA_CONTACT.email na stvarnu adresu. Prazna konfiguracija sprječava slanje i prikazuje prevedenu obavijest. Nema lažne potvrde slanja.

Pripremljen je FormSubmit POST endpoint. Nakon dodavanja adrese potrebno je na objavljenoj stranici poslati prvi probni upit i potvrditi aktivacijsku poruku primljenu na tu adresu. Zatim provjeriti dostavu pravog testnog upita. Servis obrađuje ime, adresu i sadržaj obrasca kako bi ih proslijedio primatelju. CAPTCHA i potvrda slanja obrađuju se na FormSubmit stranici. Dokumentacija: https://formsubmit.co/

Dostava e-maila nije testirana jer primatelj još nije dodan.

## Izvor
https://hr.airbnb.com/rooms/40059277 — podaci provjereni 15. 10. 2026.
5 gostiju, 2 spavaće sobe, 3 kreveta, 1 kupaonica; privatni bazen 7 × 3 m, dubina 140 cm; 800 m² ograđenog imanja; more 1,5 km; Umag 6 km. Ocjena 4,82 iz 17 recenzija. Dolazak nakon 16:00, odlazak do 09:00. Od 2027. nisu dopušteni kućni ljubimci.

Izvori fotografija: assets/sources.json. Ocjenu i pravila treba povremeno provjeravati. Za objavu prenesite HTML, CSS, JS datoteke i assets na hosting. Stranica još nije javno objavljena.
