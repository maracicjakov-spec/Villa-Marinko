# Villa Marinko

Statična višejezična stranica: hrvatski, engleski, njemački i talijanski. Otvorite index.html ili pokrenite node server.js i posjetite http://127.0.0.1:4173.

## Dizajn
- Paleta: istarski kamen (#f2ede3), morska tinta (#10272e), terakota (#a3471f), oker (#e3b26b). Tokeni su na vrhu style.css.
- Fontovi: Instrument Serif + Manrope, lokalno u assets/fonts (bez Google CDN-a).
- Motiv luka (arch) u logu, faviconu i fotografijama.

## Funkcionalnosti
- 11 AVIF fotografija u dvije veličine (villa-N.avif 1600 px, villa-N-800.avif 800 px; hero i villa-1-2400.avif) sa srcset
- Mobilni izbornik preko cijelog ekrana i trajni odabir jezika (localStorage; alternativno ?lang=en/de/it/hr)
- Prijevodi sadržaja, obrasca, galerije, pristupačnih oznaka i metapodataka (translations.js, ključ je hrvatski tekst)
- Hero fotografija koja se širi pri scrollu, otkrivanje naslova po retcima, ulasci sekcija pri scrollu
- „Jedan dan u vili“: sticky fotografija koja prati jutro / podne / večer / noć (na mobitelu slike unutar koraka)
- Galerija kao horizontalna traka (scroll-snap, strelice, povlačenje mišem, tipkovnica) + lightbox s tipkovnicom i swipe gestama
- Shematski prikaz udaljenosti (nije u mjerilu, bez točne lokacije)
- Poštivanje prefers-reduced-motion
- Obrazac za upit bez kalendara: ime, e-mail, željeni termin kao tekst, broj gostiju, poruka

## E-mail — još nije povezan
Korisnik je zatražio da se primatelj doda kasnije. U contact-config.js postavite window.VILLA_CONTACT.email na stvarnu adresu. Prazna konfiguracija sprječava slanje i prikazuje prevedenu obavijest. Nema lažne potvrde slanja.

Pripremljen je FormSubmit POST endpoint. Nakon dodavanja adrese potrebno je na objavljenoj stranici poslati prvi probni upit i potvrditi aktivacijsku poruku primljenu na tu adresu. Zatim provjeriti dostavu pravog testnog upita. Servis obrađuje ime, adresu i sadržaj obrasca kako bi ih proslijedio primatelju. CAPTCHA i potvrda slanja obrađuju se na FormSubmit stranici. Dokumentacija: https://formsubmit.co/

Dostava e-maila nije testirana jer primatelj još nije dodan.

## Izvor
https://hr.airbnb.com/rooms/40059277 — podaci provjereni 15. 10. 2026.
5 gostiju, 2 spavaće sobe, 3 kreveta, 1 kupaonica; privatni bazen 7 × 3 m, dubina 140 cm; 800 m² ograđenog imanja; more 1,5 km; Umag 6 km. Ocjena 4,82 iz 17 recenzija. Dolazak nakon 16:00, odlazak do 09:00. Od 2027. nisu dopušteni kućni ljubimci.

Izvori fotografija: assets/sources.json. Ocjenu i pravila treba povremeno provjeravati. Za objavu prenesite HTML, CSS, JS datoteke i assets na hosting. Stranica još nije javno objavljena.
