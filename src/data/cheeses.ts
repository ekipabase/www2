import type { MediaKey } from './media';

export type CheeseCategoryId = 'hard' | 'semi' | 'soft' | 'sheep' | 'grill';

export type PortionWeight = 200 | 400;

export interface CheeseProduct {
  id: number;
  name: string;
  country: string;
  region: string;
  category: CheeseCategoryId;
  typeLabel: string;
  milk: string;
  milkFilter: 'krowie' | 'owcze' | 'kozie';
  aging: string;
  designation: string;
  shortDesc: string;
  tastingNotes: string;
  pairing: string;
  servingTip: string;
  pricePer200g: number; // in PLN grosze or float PLN (we store integer grosze for exact math, e.g., 3490 = 34,90 zł)
  mediaKey: MediaKey;
  featured?: boolean;
}

export interface CheeseCategoryInfo {
  id: CheeseCategoryId;
  indexLabel: string;
  shortTitle: string;
  title: string;
  lead: string;
  assortmentDesc: string;
  mediaKey: MediaKey;
  mediaAlt: string;
}

export interface CuratedSet {
  id: string;
  title: string;
  occasion: string;
  description: string;
  cheeseIds: number[];
  portionGrams: PortionWeight;
  discountPercent: number;
  mediaKey: MediaKey;
  accompaniments: string;
}

export interface HeroHotspot {
  pinNumber: string;
  cheeseId: number;
  label: string;
  xPercent: number;
  yPercent: number;
}

export const FREE_SHIPPING_THRESHOLD_GROSZE = 18000; // 180,00 zł
export const COLD_SHIPPING_COST_GROSZE = 1990; // 19,90 zł

export const CHEESE_CATEGORIES: CheeseCategoryInfo[] = [
  {
    id: 'hard',
    indexLabel: '01.',
    shortTitle: 'Twarde i dojrzewające',
    title: 'Sery twarde i dojrzewające',
    lead: 'Długo dojrzewające kręgi o zwartej, krystalicznej strukturze. Do cienkich płatków, tarcia i kieliszka wytrawnego wina.',
    assortmentDesc: 'Zwarta struktura, skoncentrowany smak umami i wyczuwalne kryształki tyrozyny. Fundament każdej klasycznej deski degustacyjnej.',
    mediaKey: 'hard_cryst',
    mediaAlt: 'Kliny długo dojrzewających serów twardych z widocznymi kryształkami na kamiennym łupku',
  },
  {
    id: 'semi',
    indexLabel: '02.',
    shortTitle: 'Półtwarde',
    title: 'Sery półtwarde',
    lead: 'Sprężyste, maślane i harmonijne. Niezastąpione na rzemieślniczym pieczywie, w ciepłych grzankach i na rodzinnej desce.',
    assortmentDesc: 'Łagodniejsze i bardziej elastyczne miąższe z alpejskich oraz niderlandzkich mleczarni. Uniwersalne w codziennej kuchni.',
    mediaKey: 'semi',
    mediaAlt: 'Plastry i kawałki serów półtwardych Emmentaler oraz Cheddar na drewnianej desce',
  },
  {
    id: 'soft',
    indexLabel: '03.',
    shortTitle: 'Miękkie i pleśniowe',
    title: 'Sery miękkie i pleśniowe',
    lead: 'Aksamitne krążki w białej skórce oraz szlachetne sery przerostowe z niebieską pleśnią. Najpełniejsze w temperaturze pokojowej.',
    assortmentDesc: 'Od maślanego Brie z regionu Île-de-France po wyrazisty owczy Roquefort dojrzewający w wapiennych grotach.',
    mediaKey: 'soft_white',
    mediaAlt: 'Przekrojony kremowy krążek Brie oraz ser z białą pleśnią na jasnym kamieniu',
  },
  {
    id: 'sheep',
    indexLabel: '04.',
    shortTitle: 'Owcze i kozie',
    title: 'Sery owcze i kozie',
    lead: 'Charakterne, ziołowe i lekko pikantne. Od hiszpańskich płaskowyżów La Manchy po francuską Dolinę Loary.',
    assortmentDesc: 'Bogate w aromaty łąk i górskich pastwisk. Znakomite do sałatek ze świeżą oliwą, chrupiących grzanek i win mineralnych.',
    mediaKey: 'sheep',
    mediaAlt: 'Trójkątne plastry hiszpańskiego Manchego, krucha Feta i roladka koziego Chèvre',
  },
  {
    id: 'grill',
    indexLabel: '05.',
    shortTitle: 'Do grillowania i zapiekania',
    title: 'Sery do grillowania i zapiekania',
    lead: 'Sery stworzone do wysokiej temperatury — zachowują złocistą formę na ruszcie lub tworzą ciągnącą, aksamitną warstwę.',
    assortmentDesc: 'Cypryjskie Halloumi na otwarty ogień, alpejskie Raclette do ziemniaków oraz świeża włoska Mozzarella.',
    mediaKey: 'grill',
    mediaAlt: 'Zrumienione plastry Halloumi z rusztu oraz roztopiony ser Raclette na żeliwie',
  },
];

export const CHEESES: CheeseProduct[] = [
  {
    id: 0,
    name: 'Parmigiano Reggiano',
    country: 'Włochy',
    region: 'Emilia-Romania',
    category: 'hard',
    typeLabel: 'Twardy, długo dojrzewający',
    milk: 'Mleko krowie niepasteryzowane',
    milkFilter: 'krowie',
    aging: '24 miesiące',
    designation: 'ChNP / DOP',
    shortDesc: 'Kruchy, ziarnisty i głęboko słony. Do łupania w bryłki, cienkich wiórków i na deskę.',
    tastingNotes: 'Prażone migdały, klarowane masło, dojrzały bulion i chrupiące kryształki tyrozyny.',
    pairing: 'Lambrusco wytrawne, Chianti Classico, wieloletni ocet balsamiczny z Modeny, gruszka.',
    servingTip: 'Nie krój gładkim ostrzem — odłupuj nieregularne bryłki krótkim nożem migdałowym, aby zachować krystaliczną strukturę.',
    pricePer200g: 3690,
    mediaKey: 'hard_cryst',
    featured: true,
  },
  {
    id: 1,
    name: 'Comté Réserve',
    country: 'Francja',
    region: 'Jura / Franche-Comté',
    category: 'hard',
    typeLabel: 'Twardy alpejski',
    milk: 'Mleko krowie surowe',
    milkFilter: 'krowie',
    aging: '18 miesięcy',
    designation: 'AOP',
    shortDesc: 'Złożony orzechowo-owocowy bukiet z górskich pastwisk Jury. Wybitny partner do wina.',
    tastingNotes: 'Prażony orzech laskowy, suszona morela, brązowe masło i subtelna słodycz alpejskich ziół.',
    pairing: 'Vin Jaune z Jury, dojrzałe Chardonnay, orzechy włoskie, chleb na zakwasie.',
    servingTip: 'Wyjmij z lodówki na 45 minut przed degustacją — w cieple uwalnia pełnię nut prażonych orzechów.',
    pricePer200g: 3490,
    mediaKey: 'alpine',
  },
  {
    id: 2,
    name: 'Gruyère Alpage',
    country: 'Szwajcaria',
    region: 'Kanton Fryburg',
    category: 'hard',
    typeLabel: 'Twardy alpejski',
    milk: 'Mleko krowie niepasteryzowane',
    milkFilter: 'krowie',
    aging: '14 miesięcy',
    designation: 'AOP',
    shortDesc: 'Aromatyczny, gęsty i szlachetny. Klasyk szwajcarskiego fondue oraz desek wieczornych.',
    tastingNotes: 'Karmelizowana cebula, górskie kwiaty, delikatna ziemistość i długi, słono-kremowy finisz.',
    pairing: 'Wytrawny Riesling, Pinot Noir, korniszony, marynowane cebulki perłowe.',
    servingTip: 'Doskonały zarówno w cienkich słupkach na desce, jak i powoli roztopiony z białym winem w klasycznym fondue.',
    pricePer200g: 3590,
    mediaKey: 'alpine',
  },
  {
    id: 3,
    name: 'Gouda Oud Dojrzewająca',
    country: 'Holandia',
    region: 'Holandia Południowa',
    category: 'hard',
    typeLabel: 'Twardy, starzony',
    milk: 'Mleko krowie',
    milkFilter: 'krowie',
    aging: '26 miesięcy',
    designation: 'Tradycyjna dojrzewalnia',
    shortDesc: 'Głęboko bursztynowy miąższ o karmelowym smaku i wyczuwalnych kryształkach.',
    tastingNotes: 'Słony karmel, toffi, kakao oraz pikantny, rozgrzewający posmak na podniebieniu.',
    pairing: 'ciemne piwa belgijskie, Porto Tawny, musztarda figowa, prażone pekan.',
    servingTip: 'Chrupiące kryształki tyrozyny świadczą o długim leżakowaniu na drewnianych półkach; krój heblem serowarskim.',
    pricePer200g: 3190,
    mediaKey: 'hard_cryst',
  },
  {
    id: 4,
    name: 'Edam Noord-Hollandse',
    country: 'Holandia',
    region: 'Holandia Północna',
    category: 'semi',
    typeLabel: 'Półtwardy',
    milk: 'Mleko krowie',
    milkFilter: 'krowie',
    aging: '8 tygodni',
    designation: 'ChNP / PDO',
    shortDesc: 'Łagodny, sprężysty i subtelnie słony. Klasyka porannego stołu i lekkich przekąsek.',
    tastingNotes: 'Świeża śmietanka, delikatne masło i czysty, łagodny finisz bez goryczki.',
    pairing: 'Młode Pinot Grigio, cydr jabłkowy, świeże winogrona, chrupiąca kajzerka.',
    servingTip: 'Krój w równe plastry lub kostkę tuż przed podaniem, aby miąższ zachował naturalną wilgotność.',
    pricePer200g: 2190,
    mediaKey: 'semi',
  },
  {
    id: 5,
    name: 'Emmentaler Szwajcarski',
    country: 'Szwajcaria',
    region: 'Dolina Emmental',
    category: 'semi',
    typeLabel: 'Półtwardy z oczkami',
    milk: 'Mleko krowie surowe',
    milkFilter: 'krowie',
    aging: '6 miesięcy',
    designation: 'AOP',
    shortDesc: 'Słodkawo-orzechowy klasyk ze słynnymi dużymi oczkami powstającymi podczas dojrzewania.',
    tastingNotes: 'Świeży orzech włoski, słodkie mleko łąkowe i łagodna, owocowa nuta.',
    pairing: 'Lekkie Merlot, Sauvignon Blanc, czerwone winogrona, bagietka pszenna.',
    servingTip: 'Pokrój w grubsze słupki na deskę rodzinną — uwielbiany zarówno przez koneserów, jak i dzieci.',
    pricePer200g: 2790,
    mediaKey: 'semi',
  },
  {
    id: 6,
    name: 'Cheddar Vintage Somerset',
    country: 'Wielka Brytania',
    region: 'Somerset, Anglia',
    category: 'semi',
    typeLabel: 'Półtwardy / kruchy',
    milk: 'Mleko krowie pasteryzowane',
    milkFilter: 'krowie',
    aging: '15 miesięcy',
    designation: 'West Country Farmhouse PDO',
    shortDesc: 'Wyrazisty angielski cheddar, który szlachetnie kruszy się pod naciskiem noża.',
    tastingNotes: 'Kwaśna śmietana, pikantny orzech, nuta ziemista i długi, wytrawny posmak.',
    pairing: 'Cabernet Sauvignon, angielski Ale, kwaśne jabłko szara reneta, chutney z czerwonej cebuli.',
    servingTip: 'Podawaj w temperaturze pokojowej z plastrem chrupkiego jabłka lub łyżeczką konfitury cebulowej.',
    pricePer200g: 2890,
    mediaKey: 'semi',
  },
  {
    id: 7,
    name: 'Maasdammer Królewski',
    country: 'Holandia',
    region: 'Gouda / Maasdam',
    category: 'semi',
    typeLabel: 'Półtwardy z oczkami',
    milk: 'Mleko krowie',
    milkFilter: 'krowie',
    aging: '10 tygodni',
    designation: 'Receptura niderlandzka',
    shortDesc: 'Słodkawy, wyjątkowo elastyczny ser o dużych oczkach i aksamitnym cieście.',
    tastingNotes: 'Miód wielokwiatowy, słodka śmietanka i delikatny orzechowy aromat.',
    pairing: 'Gewürztraminer, jasny lager rzemieślniczy, gruszka konferencja, pieczywo żytnie.',
    servingTip: 'Znakomicie topi się na ciepłych grzankach i zapiekankach warzywnych bez wydzielania tłuszczu.',
    pricePer200g: 2290,
    mediaKey: 'semi',
  },
  {
    id: 8,
    name: 'Brie de Meaux',
    country: 'Francja',
    region: 'Île-de-France',
    category: 'soft',
    typeLabel: 'Miękki, biała pleśń',
    milk: 'Mleko krowie surowe',
    milkFilter: 'krowie',
    aging: '6 tygodni',
    designation: 'AOP',
    shortDesc: 'Kremowe wnętrze otulone aksamitną skórką szlachetnej białej pleśni Penicillium candidum.',
    tastingNotes: 'Świeże pieczarki leśne, ciepłe masło, śmietanka i subtelna nuta migdałów.',
    pairing: 'Szampan Brut, czerwone Bourgogne (Pinot Noir), świeże figi, chrupiąca bagietka.',
    servingTip: 'Wyjmij z chłodziarki na minimum 45 minut przed podaniem, aby wnętrze stało się półpłynne i jedwabiste.',
    pricePer200g: 2990,
    mediaKey: 'soft_white',
    featured: true,
  },
  {
    id: 9,
    name: 'Camembert de Normandie',
    country: 'Francja',
    region: 'Normandia',
    category: 'soft',
    typeLabel: 'Miękki, biała pleśń',
    milk: 'Mleko krowie niepasteryzowane',
    milkFilter: 'krowie',
    aging: '5 tygodni',
    designation: 'AOP',
    shortDesc: 'Wyrazistszy kuzyn Brie, dojrzewający od kwiecistej skórki ku maślanemu środkowi.',
    tastingNotes: 'Mokra ściółka leśna, kalafior, bogate normandzkie masło i lekko pikantny finisz.',
    pairing: 'Wytrawny cydr normandzki, Calvados, pieczone jabłka z tymiankiem.',
    servingTip: 'Przechowuj w oryginalnym łubiankowym pudełku i papierze woskowanym; krój promieniście jak tort.',
    pricePer200g: 3090,
    mediaKey: 'soft_white',
  },
  {
    id: 10,
    name: 'Gorgonzola Dolce',
    country: 'Włochy',
    region: 'Piemont / Lombardia',
    category: 'soft',
    typeLabel: 'Miękki, niebieska pleśń',
    milk: 'Mleko krowie pasteryzowane',
    milkFilter: 'krowie',
    aging: '60 dni',
    designation: 'ChNP / DOP',
    shortDesc: 'Rozpływająca się, niemal łyżeczkowa konsystencja poprzecinana niebiesko-zielonymi żyłkami.',
    tastingNotes: 'Słodka śmietanka zbalansowana pikantną, korzenną nutą szlachetnej pleśni.',
    pairing: 'Moscato d’Asti, Pinot Bianco, miód akacjowy, świeża figa, orzechy włoskie.',
    servingTip: 'Trzymaj osobno od łagodnych serów i nakładaj dedykowaną łopatką; fenomenalna z kroplą miodu.',
    pricePer200g: 2890,
    mediaKey: 'blue',
  },
  {
    id: 11,
    name: 'Roquefort Papillon',
    country: 'Francja',
    region: 'Aveyron (groty Combalou)',
    category: 'soft',
    typeLabel: 'Owczy, niebieska pleśń',
    milk: 'Mleko owcze surowe',
    milkFilter: 'owcze',
    aging: '5 miesięcy',
    designation: 'AOP',
    shortDesc: 'Król serów pleśniowych z owczego mleka — słony, wilgotny i monumentalny w smaku.',
    tastingNotes: 'Morska sól, owcza lanolina, pikantna niebieska pleśń Penicillium roqueforti i długi finisz.',
    pairing: 'Sauternes, Porto Vintage, miód gryczany, karmelizowana gruszka.',
    servingTip: 'Serwuj w niewielkich porcjach na sam finał degustacji, by jego intensywność nie przykryła delikatniejszych serów.',
    pricePer200g: 3890,
    mediaKey: 'blue',
  },
  {
    id: 12,
    name: 'Manchego Curado',
    country: 'Hiszpania',
    region: 'Kastylia-La Mancha',
    category: 'sheep',
    typeLabel: 'Półtwardy owczy',
    milk: 'Mleko owcze rasy Manchega',
    milkFilter: 'owcze',
    aging: '6 miesięcy',
    designation: 'DOP',
    shortDesc: 'Zwarty, maślano-pikantny ser owczy z charakterystycznym plecionym wzorem na skórce.',
    tastingNotes: 'Prażone migdały Marcona, siano, owcze masło i szczypta białego pieprzu.',
    pairing: 'Tempranillo (Rioja Crianza), Sherry Oloroso, pasta z pigwy (membrillo), oliwki.',
    servingTip: 'Krój w cienkie trójkątne plastry z zachowaniem jodełkowego brzegu (skórka jest niejadalna, lecz dekoracyjna).',
    pricePer200g: 3390,
    mediaKey: 'sheep',
    featured: true,
  },
  {
    id: 13,
    name: 'Feta Grecka z Beczki',
    country: 'Grecja',
    region: 'Tesalia / Peloponez',
    category: 'sheep',
    typeLabel: 'Solankowy owczo-kozi',
    milk: 'Mleko owcze (70%) i kozie (30%)',
    milkFilter: 'owcze',
    aging: '3 miesiące w bukowych beczkach',
    designation: 'ChNP / PDO',
    shortDesc: 'Śnieżnobiała, krucha i orzeźwiająco słona feta dojrzewająca w naturalnej solance.',
    tastingNotes: 'Morska bryza, cytrynowa kwasowość jogurtu owczego i ziołowy posmak koziego mleka.',
    pairing: 'Assyrtiko z Santorini, Sauvignon Blanc, oliwa extra vergine, pomidory malinowe, oregano.',
    servingTip: 'Łam dłońmi w większe bryły na warzywa lub zapiekaj w całości z miodem, sezamem i chili.',
    pricePer200g: 2390,
    mediaKey: 'sheep',
  },
  {
    id: 14,
    name: 'Pecorino Romano',
    country: 'Włochy',
    region: 'Lacjum / Sardynia',
    category: 'sheep',
    typeLabel: 'Twardy owczy',
    milk: 'Mleko owcze pełne',
    milkFilter: 'owcze',
    aging: '9 miesięcy',
    designation: 'ChNP / DOP',
    shortDesc: 'Zdecydowany, pikantny i słony ser owczy — fundament rzymskiej kuchni makaronowej.',
    tastingNotes: 'Intensywne owcze mleko, czarny pieprz, prażona sól morska i wytrawny umami finisz.',
    pairing: 'Chianti, Montepulciano d’Abruzzo, świeży bób, miód kasztanowy.',
    servingTip: 'Ścieraj na drobnym tarle do klasycznego Cacio e Pepe lub Carbonary, zastępując nim część soli w daniu.',
    pricePer200g: 3190,
    mediaKey: 'hard_cryst',
  },
  {
    id: 15,
    name: 'Chèvre Sainte-Maure',
    country: 'Francja',
    region: 'Dolina Loary',
    category: 'sheep',
    typeLabel: 'Miękki kozi dojrzewający',
    milk: 'Mleko kozie pełne',
    milkFilter: 'kozie',
    aging: '3 tygodnie',
    designation: 'Tradycja Loary',
    shortDesc: 'Śnieżnokremowa roladka kozia o świeżej kwasowości i jedwabistej konsystencji.',
    tastingNotes: 'Skórka cytrynowa, świeży twarożek, młode orzechy i subtelna nuta łąkowych ziół.',
    pairing: 'Sancerre (Sauvignon Blanc), różowe Prowansalskie, grillowana grzanka z rozmarynem i miodem.',
    servingTip: 'Krój cienkim nożem zwilżonym ciepłą wodą; wyborny na ciepłej bagietce z konfiturą figową.',
    pricePer200g: 2790,
    mediaKey: 'sheep',
  },
  {
    id: 16,
    name: 'Halloumi Tradycyjne',
    country: 'Cypr',
    region: 'Nikozja / Larnaka',
    category: 'grill',
    typeLabel: 'Półtwardy na ruszt',
    milk: 'Mleko owcze, kozie i krowie z miętą',
    milkFilter: 'owcze',
    aging: 'Świeży w solance',
    designation: 'ChNP / PDO',
    shortDesc: 'Nie topi się na ogniu — tworzy chrupiącą, złocistą skórkę i sprężyste wnętrze.',
    tastingNotes: 'Ciepłe słonawe mleko, nuta suszonej mięty cypryjskiej i maślana rumianość z patelni.',
    pairing: 'Różowe wino wytrawne, lemoniada z miętą, pestki granatu, grillowany arbuz.',
    servingTip: 'Osusz ręcznikiem, pokrój w plastry 1 cm i grilluj na suchej, mocno rozgrzanej patelni po 2 minuty z każdej strony.',
    pricePer200g: 2590,
    mediaKey: 'grill',
    featured: true,
  },
  {
    id: 17,
    name: 'Raclette du Valais',
    country: 'Szwajcaria',
    region: 'Alpy Walijskie',
    category: 'grill',
    typeLabel: 'Półtwardy do topienia',
    milk: 'Mleko krowie surowe',
    milkFilter: 'krowie',
    aging: '4 miesiące',
    designation: 'AOP',
    shortDesc: 'Kremowy alpejski ser, który pod wpływem żaru zmienia się w aksamitną, pachnącą lawę.',
    tastingNotes: 'Słodka śmietanka, pieczony ziemniak, delikatny czosnek niedźwiedzi i nuta dymna przy skórce.',
    pairing: 'Fendant (Chasselas), lekkie Pinot Noir, ziemniaki w mundurkach, korniszony, szynka dojrzewająca.',
    servingTip: 'Zapiecz ze skórką na patelenkach raclette i zeskrob gorący ser prosto na gorące ziemniaki.',
    pricePer200g: 3290,
    mediaKey: 'grill',
  },
  {
    id: 18,
    name: 'Mozzarella Fior di Latte',
    country: 'Włochy',
    region: 'Kampania',
    category: 'grill',
    typeLabel: 'Świeży z masy parzonej',
    milk: 'Mleko krowie pełne',
    milkFilter: 'krowie',
    aging: 'Świeży (24h)',
    designation: 'Rzemieślnicza pasta filata',
    shortDesc: 'Mleczna, włóknista i soczysta kula idealna do pizzy neapolitańskiej oraz sałatki Caprese.',
    tastingNotes: 'Czysta słodka śmietanka, świeże mleko i subtelna kwasowość zakwasu serwatkowego.',
    pairing: 'Prosecco Extra Dry, Vermentino, świeża bazylia, oliwa z pierwszego tłoczenia.',
    servingTip: 'Przed zapiekaniem na pizzy porwij w palcach i odsącz przez 20 minut na sicie, aby spód pozostał chrupiący.',
    pricePer200g: 1990,
    mediaKey: 'grill',
  },
];

export const CURATED_SETS: CuratedSet[] = [
  {
    id: 'set-wine',
    title: 'Deska na wieczór z winem',
    occasion: 'Dla 3–4 osób · 800 g selekcji',
    description: 'Kompletna podróż od kremowego Brie, przez hiszpańskie owcze Manchego i alpejskie Comté, aż po aksamitną Gorgonzolę na finał.',
    cheeseIds: [1, 8, 10, 12],
    portionGrams: 200,
    discountPercent: 10,
    mediaKey: 'hero',
    accompaniments: 'Polecamy podać z bagietką na zakwasie, świeżą figą i miodem akacjowym.',
  },
  {
    id: 'set-family',
    title: 'Deska na spotkanie z rodziną',
    occasion: 'Dla 4–6 osób · 800 g selekcji',
    description: 'Cztery przystępne, szlachetne klasyki o łagodniejszym profilu: szwajcarski Emmentaler, niderlandzki Edam, angielski Cheddar i karmelowa Gouda.',
    cheeseIds: [4, 5, 6, 3],
    portionGrams: 200,
    discountPercent: 10,
    mediaKey: 'semi',
    accompaniments: 'Znakomite z winogronami, jabłkiem, orzechami włoskimi i świeżym masłem.',
  },
  {
    id: 'set-grill',
    title: 'Sery na grilla i do zapiekania',
    occasion: 'Dla 3–4 osób · 600 g selekcji',
    description: 'Zestaw na kolację na ciepło: chrupiące na ruszcie Halloumi, alpejskie Raclette do ziemniaków oraz soczysta Mozzarella Fior di Latte.',
    cheeseIds: [16, 17, 18],
    portionGrams: 200,
    discountPercent: 8,
    mediaKey: 'grill',
    accompaniments: 'Świetne z pieczonymi młodymi ziemniakami, oliwą ziołową i korniszonami.',
  },
];

export const HERO_HOTSPOTS: HeroHotspot[] = [
  {
    pinNumber: '01',
    cheeseId: 0,
    label: 'Parmigiano Reggiano · 24 mies.',
    xPercent: 28,
    yPercent: 34,
  },
  {
    pinNumber: '02',
    cheeseId: 8,
    label: 'Brie de Meaux AOP',
    xPercent: 76,
    yPercent: 33,
  },
  {
    pinNumber: '03',
    cheeseId: 11,
    label: 'Roquefort z grot Combalou',
    xPercent: 80,
    yPercent: 58,
  },
];

export const SERVING_RITUALS = [
  {
    step: '01.',
    title: 'Temperatura uwalnia bukiet',
    body: 'Wyjmij sery z lodówki na 30–60 minut przed podaniem. Zbyt niska temperatura zamyka aromaty masła, orzechów i łąkowych ziół.',
  },
  {
    step: '02.',
    title: 'Papier serowarski zamiast folii',
    body: 'Każdą porcję wysyłamy w oddychającym papierze woskowanym. Chroni on przed wysychaniem, pozwalając naturalnej skórce oddychać.',
  },
  {
    step: '03.',
    title: 'Kierunek degustacji',
    body: 'Układaj deskę zgodnie ze wskazówkami zegara: od łagodnych świeżych i kremowych, przez półtwarde i owcze, po intensywne sery z niebieską pleśnią.',
  },
  {
    step: '04.',
    title: 'Osobny nóż do pleśniowych',
    body: 'Sery miękkie i przerostowe krój dedykowanym ostrzem, aby ich wyraziste kultury bakterii nie zdominowały subtelnych serów alpejskich.',
  },
];

export const SEROWARSKI_GLOSSARY = [
  {
    term: 'ChNP / DOP / AOP',
    definition: 'Chroniona Nazwa Pochodzenia — europejski certyfikat gwarantujący, że ser powstał w ściśle wyznaczonym regionie według wielowiekowej receptury.',
  },
  {
    term: 'Mleko surowe (niepasteryzowane)',
    definition: 'Mleko podgrzewane jedynie do temperatury udoju (poniżej 40°C), zachowujące pełnię mikroflory alpejskich i normandzkich pastwisk.',
  },
  {
    term: 'Kryształki tyrozyny',
    definition: 'Naturalne, przyjemnie chrupiące skupiska aminokwasów powstające w Parmigiano Reggiano i starej Goudzie po minimum 18 miesiącach leżakowania.',
  },
  {
    term: 'Affinage (dojrzewanie)',
    definition: 'Sztuka pielęgnacji kręgów w kamiennych piwnicach — regularne obracanie, szczotkowanie i nacieranie solanką przez mistrza affineura.',
  },
  {
    term: 'Pasta filata (masa parzona)',
    definition: 'Włoska technika rozciągania gorącego skrzepu w serwatce, dzięki której Mozzarella zyskuje sprężystą, włóknistą strukturę.',
  },
];
