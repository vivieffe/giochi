export type DifficultyLevel = 'easy' | 'hard';

export type ChallengeType =
  | 'pattern'
  | 'rhythm'
  | 'grid_hop'
  | 'intruder'
  | 'constellation'
  | 'memory'
  | 'balance'
  | 'word_scramble'
  | 'finale_riddle';

export interface ReindeerInfo {
  id: string;
  order: number;
  englishName: string;
  italianName: string;
  subtitle?: string;
  locationName: string;
  mapX: number; // percentage 0..100
  mapY: number; // percentage 0..100
  challengeType: ChallengeType;
  challengeTitle: Record<DifficultyLevel, string>;
  storyIntro: Record<DifficultyLevel, string>;
  hintText: Record<DifficultyLevel, string>;
  accentColor: string;
  isFinale?: boolean;
}

export const REINDEER_LIST: ReindeerInfo[] = [
  {
    id: 'dasher',
    order: 1,
    englishName: 'Dasher',
    italianName: 'Freccia',
    locationName: 'Laghetto Ghiacciato',
    mapX: 76,
    mapY: 79,
    challengeType: 'pattern',
    challengeTitle: {
      easy: 'Sequenza Veloce sul Ghiaccio',
      hard: 'Sequenze Logiche sul Ghiaccio',
    },
    storyIntro: {
      easy: 'Dasher corre così veloce sul ghiaccio che ha perso il ritmo! Completa la fila di simboli natalizi per raggiungerlo.',
      hard: 'Dasher sfreccia tra formule e ritmi complessi! Risolvi tutte e 3 le sequenze logiche (simboli e numeri) per raggiungerlo.',
    },
    hintText: {
      easy: 'Osserva i primi 3 simboli che si ripetono sempre uguali (1-2-3, poi 1-2-3). Quale manca alla fine?',
      hard: 'Controlla se si ripete un gruppo di 4 elementi oppure osserva di quanto aumenta ogni numero rispetto al precedente!',
    },
    accentColor: '#2563EB',
  },
  {
    id: 'dancer',
    order: 2,
    englishName: 'Dancer',
    italianName: 'Ballerina',
    locationName: 'Baita delle Feste',
    mapX: 88,
    mapY: 66,
    challengeType: 'rhythm',
    challengeTitle: {
      easy: 'I Passi di Danza Musicali',
      hard: 'Coreografia delle 6 Campanelle',
    },
    storyIntro: {
      easy: 'Dancer sta provando un balletto! Guarda e ascolta in che ordine si illuminano le 4 campanelle, poi ripetilo tu.',
      hard: 'Dancer balla una coreografia velocissima! Memorizza e ripeti l’esatta sequenza di 6 passi tra 6 campanelle diverse.',
    },
    hintText: {
      easy: 'Segui i numerini guida qui sotto: tocca i bottoni colorati nell’ordine esatto mostrato dalla lista!',
      hard: 'Ecco la lista completa dei 6 colori in ordine: la prossima campanella da toccare brilla d’oro!',
    },
    accentColor: '#DB2777',
  },
  {
    id: 'prancer',
    order: 3,
    englishName: 'Prancer',
    italianName: 'Saltarello',
    locationName: 'Bosco dei Pini Innevati',
    mapX: 49,
    mapY: 54,
    challengeType: 'grid_hop',
    challengeTitle: {
      easy: 'Programma il Percorso (Coding)',
      hard: 'Coding Avanzato: Campanella e Carota',
    },
    storyIntro: {
      easy: 'Allinea le tessere di codice (Avanti, Destra, Sinistra) per guidare Prancer fino alla carota! Ricorda: Destra e Sinistra fanno girare e avanzare di 1 casella. Usa "Prova il percorso" per vedere fin dove arrivi.',
      hard: 'Sfida di coding! Allinea le tessere (Avanti, Destra, Sinistra) per prendere prima la Campanella (🔔) e poi arrivare alla Carota (🥕) evitando il ghiaccio. Destra e Sinistra girano e avanzano di 1 casella!',
    },
    hintText: {
      easy: 'Guarda la tessera consigliata qui sotto: ti dice quale comando aggiungere adesso alla tua sequenza!',
      hard: 'Segui la direzione in cui guarda la renna (freccia). La prossima tessera giusta ora brilla d’oro!',
    },
    accentColor: '#059669',
  },
  {
    id: 'vixen',
    order: 4,
    englishName: 'Vixen',
    italianName: 'Donnola',
    locationName: 'Officina dei Giocattoli',
    mapX: 17,
    mapY: 73,
    challengeType: 'intruder',
    challengeTitle: {
      easy: 'Trova l’Intruso nell’Officina',
      hard: 'Sfida dell’Intruso: Logica e Numeri',
    },
    storyIntro: {
      easy: 'Vixen si è nascosta tra gli scaffali dei regali! In ogni gruppo c’è un oggetto che NON c’entra niente con gli altri. Trovalo!',
      hard: 'Vixen ti mette alla prova con 3 enigmi di logica e matematica! Tra 6 carte, scopri l’unica che rompe la regola.',
    },
    hintText: {
      easy: 'Chiediti a cosa servono gli oggetti insieme: tre fanno parte della stessa famiglia, uno viene da tutt’altro posto!',
      hard: 'Controlla bene tabelline, somme o categorie: ho attenuato due carte corrette per restringere la scelta!',
    },
    accentColor: '#D97706',
  },
  {
    id: 'comet',
    order: 5,
    englishName: 'Comet',
    italianName: 'Cometa',
    locationName: 'Osservatorio delle Stelle',
    mapX: 61,
    mapY: 25,
    challengeType: 'constellation',
    challengeTitle: {
      easy: 'Metti in Serie i Numeri Pari',
      hard: 'Metti in Serie la Tabellina del 4',
    },
    storyIntro: {
      easy: 'Metti in ordine dal più piccolo al più grande solo i NUMERI PARI (da 2 a 12), facendo attenzione a non toccare i numeri intrusi dispari!',
      hard: 'Metti in ordine dal più piccolo al più grande tutti i numeri della TABELLINA DEL 4 (da 4 a 40), evitando i numeri intrusi!',
    },
    hintText: {
      easy: 'I numeri pari finiscono con 0, 2, 4, 6, 8. Il prossimo numero giusto da toccare ora brilla d’oro!',
      hard: 'Conta di 4 in 4 (4, 8, 12, 16...): la stella giusta da toccare adesso brilla con il bordo d’oro!',
    },
    accentColor: '#7C3AED',
  },
  {
    id: 'cupid',
    order: 6,
    englishName: 'Cupid',
    italianName: 'Cupido',
    locationName: 'Ufficio Postale di Natale',
    mapX: 34,
    mapY: 24,
    challengeType: 'memory',
    challengeTitle: {
      easy: 'Memory delle Letterine (6 Carte)',
      hard: 'Super Memory di Natale (12 Carte)',
    },
    storyIntro: {
      easy: 'Cupid sta sistemando le letterine dei bambini! Gira due carte alla volta e trova tutte e 3 le coppie uguali.',
      hard: 'Tantissime letterine sparse! Gira due carte alla volta e trova tutte e 6 le coppie uguali tra le 12 carte sul tavolo.',
    },
    hintText: {
      easy: 'Ho sbirciato sotto le carte per te: guarda le due carte uguali che si sono appena scoperte!',
      hard: 'Sbirciatina speciale! Ricorda dove si trova la coppia che si è appena scoperta per un attimo.',
    },
    accentColor: '#E11D48',
  },
  {
    id: 'donner',
    order: 7,
    englishName: 'Donner',
    italianName: 'Lampo',
    subtitle: 'Dunder / Donner',
    locationName: 'Casetta degli Elfi',
    mapX: 16,
    mapY: 42,
    challengeType: 'balance',
    challengeTitle: {
      easy: 'Carica il Sacco Giusto',
      hard: 'Calcoli degli Elfi per la Slitta',
    },
    storyIntro: {
      easy: 'Donner deve preparare i sacchi per la slitta! Conta le stelline e scegli il pacco regalo che fa arrivare il totale al numero richiesto.',
      hard: 'Donner deve organizzare il carico pesante! Risolvi i 3 problemi matematici con addizioni, moltiplicazioni e sottrazioni.',
    },
    hintText: {
      easy: 'Conta quante stelline mancano per arrivare al numero finale: guarda il pacco che brilla qui sotto!',
      hard: 'Esegui un’operazione alla volta (prima la moltiplicazione o la prima sottrazione): il risultato giusto brilla d’oro!',
    },
    accentColor: '#0284C7',
  },
  {
    id: 'blitzen',
    order: 8,
    englishName: 'Blitzen',
    italianName: 'Fulmine',
    locationName: 'Faro dell’Aurora',
    mapX: 84,
    mapY: 32,
    challengeType: 'word_scramble',
    challengeTitle: {
      easy: 'La Parola Luminosa del Faro',
      hard: 'L’Anagramma del Dolce di Natale',
    },
    storyIntro: {
      easy: 'Blitzen ha spento il faro per sbaglio! Riordina le tessere con le lettere per scrivere la parola che fa brillare il cielo di Natale.',
      hard: 'Blitzen ha mescolato le lettere e aggiunto 2 lettere intruse! Componi la parola segreta di 9 lettere leggendo l’indovinello.',
    },
    hintText: {
      easy: 'Guarda il disegno luminoso: è una STELLA! Ho messo al posto giusto la prossima lettera per aiutarti.',
      hard: 'È il dolce natalizio italiano più famoso (PANETTONE)! Ho inserito la prossima lettera giusta al suo posto.',
    },
    accentColor: '#CA8A04',
  },
  {
    id: 'rudolph',
    order: 9,
    englishName: 'Rudolph',
    italianName: 'Naso Rosso',
    subtitle: 'La renna dal naso rosso',
    locationName: 'Vetta della Stella Polare',
    mapX: 48,
    mapY: 13,
    challengeType: 'finale_riddle',
    challengeTitle: {
      easy: 'L’Indovinello della Notte Magica',
      hard: 'Il Codice Segreto dei 4 Indovinelli',
    },
    storyIntro: {
      easy: 'Eccoci da Rudolph! Per sciogliere la nebbia della Vigilia, inserisci i 3 simboli giusti seguendo gli indovinelli di Natale.',
      hard: 'Gran Finale per esperti! Risolvi tutti e 4 gli indovinelli della Vigilia scegliendo tra 6 simboli natalizi nell’ordine esatto.',
    },
    hintText: {
      easy: 'Leggi l’indizio della casella lampeggiante: ho evidenziato il simbolo giusto da scegliere!',
      hard: 'Concentrati sull’indovinello evidenziato in rosso: il simbolo corretto ora brilla d’oro!',
    },
    accentColor: '#DC2626',
    isFinale: true,
  },
];
