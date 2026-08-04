import deco001 from '../assets/Frette_Ref/Deco_Plaid_001.webp';
import deco002 from '../assets/Frette_Ref/Deco_Plaid_002.webp';
import deco003Terracotta from '../assets/Frette_Ref/Deco_Plaid_003.webp';
import deco003Verde from '../assets/Frette_Ref/Deco_Plaid_003_2.webp';
import modernismAmbra from '../assets/Frette_Ref/Modernism_Plaid.webp';
import modernismVerde from '../assets/Frette_Ref/Modernism_Plaid2.webp';
import modernismTortora from '../assets/Frette_Ref/Modernism_Plaid_03.webp';
import type { SceneData } from '../types';

// I sette plaid della collezione Frette × Tara Bernerd. Ogni scena li rilegge
// da un punto di vista diverso — fibra, disegno, colore, autore, uso, finitura.
export const scenes: SceneData[] = [
  {
    id: 'preview-1',
    title: 'Fibra e Filato — Cashmere',
    cellCount: 4,
    images: [deco001, modernismAmbra, deco003Terracotta, modernismTortora],
    gridItems: [
      { image: deco001, caption: 'Deco 001 — Blu Notte', description: 'Realizzato in misto cashmere e pura lana vergine, unisce la morbidezza della fibra nobile alla tenuta del filato pettinato.', tags: ['cashmere', 'lana vergine', 'deco'] },
      { image: deco002, caption: 'Deco 002 — Blu Notte', description: 'La rigatura verticale nasce da filati tinti in fiocco, che mantengono profondità di colore anche dopo anni di lavaggi.', tags: ['lana vergine', 'deco', 'artigianale'] },
      { image: deco003Terracotta, caption: 'Deco 003 — Terracotta', description: 'Il corpo pieno del tessuto è ottenuto da una doppia altezza di pelo, cardata prima della rifinitura.', tags: ['cashmere', 'deco', 'artigianale'] },
      { image: deco003Verde, caption: 'Deco 003 — Verde Ottanio', description: 'Stessa mano, diversa temperatura: la fibra vergine accoglie il verde ottanio senza perdere luminosità.', tags: ['lana vergine', 'deco', 'verde ottanio'] },
      { image: modernismAmbra, caption: 'Modernism — Ambra', description: 'Il filato ritorto due volte dà alla trama la reattività necessaria a sostenere il disegno curvo.', tags: ['lana vergine', 'modernism', 'ambra'] },
      { image: modernismVerde, caption: 'Modernism — Verde Ottanio', description: 'Il misto cashmere addolcisce il contrasto cromatico, restituendo una superficie compatta e vellutata.', tags: ['cashmere', 'modernism', 'verde ottanio'] },
      { image: modernismTortora, caption: 'Modernism — Tortora', description: 'Nella versione tortora la fibra resta a vista: nessuna tintura di superficie, solo filato tinto in massa.', tags: ['lana vergine', 'modernism', 'tortora'] },
    ],
  },
  {
    id: 'preview-2',
    title: 'Disegno Jacquard — Deco',
    cellCount: 4,
    images: [deco002, deco003Verde, modernismVerde, deco001],
    gridItems: [
      { image: deco001, caption: 'Deco 001 — Blu Notte', description: 'La raffinata fantasia jacquard alterna colonne di frecce e bande piene, costruite sul telaio e non stampate.', tags: ['jacquard', 'deco', 'artigianale'] },
      { image: deco002, caption: 'Deco 002 — Blu Notte', description: 'Il motivo a tende degrada in una rigatura sottile: due disegni in un solo rapporto di armatura.', tags: ['jacquard', 'deco', 'blu notte'] },
      { image: deco003Terracotta, caption: 'Deco 003 — Terracotta', description: 'Il reticolo di ottagoni e rombi cita i pavimenti dei palazzi milanesi degli anni Trenta.', tags: ['jacquard', 'deco', 'terracotta'] },
      { image: deco003Verde, caption: 'Deco 003 — Verde Ottanio', description: 'Lo stesso rapporto, ribaltato nei toni freddi, mostra come il jacquard cambi lettura al variare del colore.', tags: ['jacquard', 'deco', 'verde ottanio'] },
      { image: modernismAmbra, caption: 'Modernism — Ambra', description: 'L’onda continua di Modernism nasce da un’armatura reversibile: il rovescio inverte i pieni e i vuoti.', tags: ['jacquard', 'modernism', 'ambra'] },
      { image: modernismVerde, caption: 'Modernism — Verde Ottanio', description: 'Tre colori in trama e un solo ordito bastano a generare la profondità del disegno.', tags: ['jacquard', 'modernism', 'verde ottanio'] },
      { image: modernismTortora, caption: 'Modernism — Tortora', description: 'Ridotto a due toni, il motivo si legge come un rilievo: è la trama, non la stampa, a fare l’ombra.', tags: ['jacquard', 'modernism', 'tortora'] },
    ],
  },
  {
    id: 'preview-3',
    title: 'Le Cromie — Studio sul Colore',
    cellCount: 4,
    images: [deco003Terracotta, modernismAmbra, deco003Verde, modernismTortora],
    gridItems: [
      { image: deco001, caption: 'Deco 001 — Blu Notte', description: 'Blu notte, cammello e avorio: la triade che Frette porta nelle camere degli alberghi da oltre un secolo.', tags: ['blu notte', 'deco', 'alberghi'] },
      { image: deco002, caption: 'Deco 002 — Blu Notte', description: 'Il blu occupa il fondo e la cornice, lasciando che il cammello emerga solo nella fascia superiore.', tags: ['blu notte', 'deco', 'jacquard'] },
      { image: deco003Terracotta, caption: 'Deco 003 — Terracotta', description: 'La terracotta è schiarita da un avorio caldo, che tiene il disegno leggero anche su grandi superfici.', tags: ['terracotta', 'deco', 'jacquard'] },
      { image: deco003Verde, caption: 'Deco 003 — Verde Ottanio', description: 'Il verde ottanio sostituisce il rosso senza toccare il disegno: cambia la stanza, non il plaid.', tags: ['verde ottanio', 'deco', 'alberghi'] },
      { image: modernismAmbra, caption: 'Modernism — Ambra', description: 'Ambra e arancio su fondo giallo: la cromia più esposta della collezione, pensata per gli spazi comuni.', tags: ['ambra', 'modernism', 'alberghi'] },
      { image: modernismVerde, caption: 'Modernism — Verde Ottanio', description: 'Verde ottanio, avorio e cammello si alternano in tre colonne, ognuna con il proprio ritmo.', tags: ['verde ottanio', 'modernism', 'jacquard'] },
      { image: modernismTortora, caption: 'Modernism — Tortora', description: 'Tortora su bianco: la versione più silenziosa della collezione, disegnata per le suite.', tags: ['tortora', 'modernism', 'alberghi'] },
    ],
  },
  {
    id: 'preview-4',
    title: 'Tara Bernerd per Frette — Londra',
    cellCount: 4,
    images: [deco001, deco002, modernismVerde, deco003Verde],
    gridItems: [
      { image: deco001, caption: 'Deco 001 — Blu Notte', description: 'Il primo disegno della capsule firmata con Tara Bernerd: geometria deco, palette da hotel londinese.', tags: ['tara bernerd', 'deco', 'blu notte'] },
      { image: deco002, caption: 'Deco 002 — Blu Notte', description: 'Una fascia alta sopra un fondo rigato, come da richiesta dello studio: il plaid si legge come un tendaggio.', tags: ['tara bernerd', 'deco', 'jacquard'] },
      { image: deco003Terracotta, caption: 'Deco 003 — Terracotta', description: 'Il reticolo di ottagoni entra in collezione come richiamo ai pavimenti degli interni firmati dallo studio.', tags: ['tara bernerd', 'deco', 'terracotta'] },
      { image: deco003Verde, caption: 'Deco 003 — Verde Ottanio', description: 'Seconda cromia dello stesso disegno, richiesta per le camere affacciate sul parco.', tags: ['tara bernerd', 'deco', 'verde ottanio'] },
      { image: modernismAmbra, caption: 'Modernism — Ambra', description: 'Modernism riporta in scala un disegno d’archivio degli anni Settanta, riletto da Tara Bernerd.', tags: ['tara bernerd', 'modernism', 'ambra'] },
      { image: modernismVerde, caption: 'Modernism — Verde Ottanio', description: 'Tutti i prodotti della collezione realizzata in collaborazione con Tara Bernerd presentano un packaging in tessuto.', tags: ['tara bernerd', 'packaging in tessuto', 'modernism'] },
      { image: modernismTortora, caption: 'Modernism — Tortora', description: 'La versione tortora chiude la capsule: l’estetica sempre attuale di Tara Bernerd, senza stagione.', tags: ['tara bernerd', 'modernism', 'tortora'] },
    ],
  },
  {
    id: 'preview-5',
    title: 'Un Secolo di Ospitalità — Grand Hotel',
    cellCount: 6,
    radius: 650,
    images: [deco001, deco002, deco003Terracotta, deco003Verde, modernismAmbra, modernismVerde],
    gridItems: [
      { image: deco001, caption: 'Deco 001 — Blu Notte', description: 'Per oltre un secolo i tessuti Frette hanno vestito i letti degli alberghi più prestigiosi in tutto il mondo.', tags: ['alberghi', 'deco', 'artigianale'] },
      { image: deco002, caption: 'Deco 002 — Blu Notte', description: 'Il formato è calibrato sul letto king delle suite: copre la pediera senza toccare terra.', tags: ['alberghi', 'deco', 'lana vergine'] },
      { image: deco003Terracotta, caption: 'Deco 003 — Terracotta', description: 'Nelle hall il plaid lavora come tessuto d’arredo, non come biancheria da camera.', tags: ['alberghi', 'deco', 'terracotta'] },
      { image: deco003Verde, caption: 'Deco 003 — Verde Ottanio', description: 'Ogni cromia entra in produzione solo dopo la prova in camera, sotto la luce reale dell’albergo.', tags: ['alberghi', 'deco', 'verde ottanio'] },
      { image: modernismAmbra, caption: 'Modernism — Ambra', description: 'Sui divani delle lounge il disegno curvo regge la distanza di lettura più lunga.', tags: ['alberghi', 'modernism', 'ambra'] },
      { image: modernismVerde, caption: 'Modernism — Verde Ottanio', description: 'Il peso del plaid è studiato per il servizio alberghiero: regge il lavaggio industriale.', tags: ['alberghi', 'modernism', 'lana vergine'] },
      { image: modernismTortora, caption: 'Modernism — Tortora', description: 'Nelle camere il tortora accompagna il lino bianco senza mai competere con esso.', tags: ['alberghi', 'modernism', 'tortora'] },
    ],
  },
  {
    id: 'preview-6',
    title: 'La Finitura — Made in Italy',
    cellCount: 4,
    images: [modernismTortora, deco003Terracotta, deco002, modernismVerde],
    gridItems: [
      { image: deco001, caption: 'Deco 001 — Blu Notte', description: 'Rifinito dall’orlo ripiegato con angoli a cappuccio, cucito e chiuso a mano.', tags: ['orlo a cappuccio', 'artigianale', 'deco'] },
      { image: deco002, caption: 'Deco 002 — Blu Notte', description: 'L’elegante cornice del bordo a tinta unita è ottenuta in tessitura, non applicata a posteriori.', tags: ['artigianale', 'deco', 'jacquard'] },
      { image: deco003Terracotta, caption: 'Deco 003 — Terracotta', description: 'L’etichetta in pelle è cucita a mano sull’angolo, un pezzo alla volta.', tags: ['etichetta in pelle', 'artigianale', 'deco'] },
      { image: deco003Verde, caption: 'Deco 003 — Verde Ottanio', description: 'Ogni plaid porta il numero di telaio: la tracciabilità resta interna alla filiera italiana.', tags: ['artigianale', 'deco', 'made in italy'] },
      { image: modernismAmbra, caption: 'Modernism — Ambra', description: 'Il bordo segue il rapporto del disegno, così l’onda non viene mai tagliata a metà.', tags: ['artigianale', 'modernism', 'ambra'] },
      { image: modernismVerde, caption: 'Modernism — Verde Ottanio', description: 'Il packaging in tessuto accompagna il plaid dalla sartoria alla camera, ed è pensato per essere riusato.', tags: ['packaging in tessuto', 'tara bernerd', 'modernism'] },
      { image: modernismTortora, caption: 'Modernism — Tortora', description: 'L’essenza della qualità italiana di Frette: nessuna finitura è demandata alla macchina.', tags: ['artigianale', 'made in italy', 'modernism'] },
    ],
  },
];
