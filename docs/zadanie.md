# Zadanie: ZUS Accident Notification Tool (ZANT)

Treść zadania organizatora (HackNation 2025), dosłownie — bez rozdziału „Kryteria oceny”.

## ZUS Accident Notification Tool
System wspierania zgłoszeń i decyzji ZUS w sprawie uznania zdarzeń za wypadki przy pracy

### 1. Wprowadzenie - opis organizacji, sytuacji i stanu aktualnego
Zakład Ubezpieczeń Społecznych (ZUS) to jeden z najważniejszych elementów naszego państwa. Od ponad 90 lat zapewnia milionom wsparcie w przypadku choroby, wypadku przy pracy oraz zabezpieczenie emerytalne. W ostatnich latach ZUS otrzymał dodatkowe zadania zapewniając również wsparcie rodzicom poprzez takie działania jak program 800+, czy aktywny rodzic. Można więc powiedzieć, że ZUS towarzyszy obywatelowi przez całe jego życie.

Od strony technicznej jesteśmy organizacją, która dynamicznie się rozwija. ZUS był pionierem elektronizacji wraz z systemem PUE/eZUS umożliwiającym załatwianie spraw online i konsekwentnie wdraża kolejne narzędzia. Jednym z problemów, które mamy przed sobą jest ogromna ilość spraw i wolumeny danych. Przykładowo w 2023 roku wystawiono 24 miliony zaświadczeń lekarskich (zwanych popularnie L4). ZUS zatrudnia 40 tysięcy osób w całym kraju co powoduje potrzebę sprawnej komunikacji i obróbki danych.

Dzisiaj zwracamy się do Was o pomoc w problemie, który bezpośrednio dotyka tych aspektów.

### 2. Wyzwanie
Wyzwanie do rozwiązania to zapewnienie wsparcia obywatelowi, który uległ wypadkowi przy pracy. Dla ułatwienia ograniczyliśmy zakres do wypadków dla osób prowadzących pozarolniczą działalność gospodarczą. Przykładowo są to wypadki przy pracach na wysokościach, różnego rodzaju remontach, naprawach maszyn. Ich konsekwencją są urazy, potrzeba rehabilitacji oraz niemożność podjęcia pracy przez jakiś czas.

Problemem jest ogromna liczba tych zgłoszeń oraz różnorodność okoliczności i przyczyn wypadków.

Waszym zadaniem będzie:
- Stworzenie wirtualnego asystenta, który będzie przyjmował zgłoszenie wypadku i wyjaśnienia poszkodowanego oraz wskazywał brakujące elementy. Wynikają one ze wzorca ZUS, który będzie udostępniony. Wymagane jest na przykład wskazanie miejsca i czasu wypadku, szczegółowe opisanie okoliczności i przyczyn tego zdarzenia oraz podanie innych podstawowych danych. Wirtualny asystent powinien więc analizować zgłoszenie klienta oraz sugerować jego uzupełnienie.
- Drugim elementem będzie wsparcie podejmowania decyzji o uznaniu bądź nie zdarzenia za wypadek przy pracy. Udostępnione dane kilkudziesięciu zgłoszeń i rozstrzygnięć ZUS (kart wypadków) są grupą testową do nauki modelu. Są to prawdziwe przypadki obsłużone przez ZUS. Model będzie musiał odczytać dane z zeskanowanej dokumentacji, przeanalizować zawarte w niej dane, zaproponować rozstrzygniecie – uznać bądź nie zdarzenie za wypadek przy pracy oraz przygotować projekt karty wypadku.

### 3. Oczekiwany rezultat
Rezultatem powinna być aplikacja wykonująca dwa wspomniane w zadaniu działania. Oba aspekty mogą być przedstawione w formie webowej.

Asystent przyjmowania zgłoszenia o wypadku powinien być przedstawiony w sposób prosty, tak by był dostępny dla obywatela, dla którego jest to pierwszy kontakt z tym zagadnieniem. Powinien unikać specjalistycznego słownictwa i być raczej wsparciem niż ograniczeniem i blokadą. Na przykład nie powinien blokować możliwości zgłoszenia wypadku bez jakiegoś elementu, ale raczej sugerować zmianę i korektę. Dodatkowo powinien wspierać klienta podczas opisywania okoliczności i przyczyn wypadku.

Element wsparcia decyzji jest przygotowany dla pracowników ZUS, którzy będą mogli użyć go jako pomocy w swojej pracy. Powinien więc rekomendować uznanie bądź nie danego zdarzenia za wypadek przy pracy używając dostępnej wiedzy w postaci udostępnionej bazy zgłoszeń i kart wypadków.

### 4. Wymagania formalne
Projekt przesyłany do oceny powinien zawierać:
- Szczegółowy opis i tytuł projektu,
- Prezentację w formacie PDF zawierającą
  - Przedstawienie działania asystenta (może być formie video lub innej)
  - Przedstawienie możliwości wgrania zdarzeń testowych. Może to się odbywać poprzez zewnętrzny link do aplikacji webowej. Nie rekomendowane są rozwiązania wymagające od jury zainstalowania jakichkolwiek programów na ich komputerach.

### 5. Wymagania techniczne
W ramach projektów prezentowanych w konkursie nie mamy jednoznacznych wymagań technicznych poza tymi, które wynikają z samego projektu, to jest możliwości wysłania testowych zgłoszeń.

Uczestnicy powinni w ramach swojej prezentacji przedstawić oczekiwany czas wdrożenia takiego rozwiązania oraz problemy, których się spodziewają. W szczególności należy brać pod uwagę ograniczenia wynikające ze ścisłej ochrony danych osobowych w ZUS.

### 6. Sposób testowania i/lub walidacji
W ramach prezentacji oczekiwane jest:
- Przedstawienie działania asystenta wirtualnego, który pomoże przygotować zgłoszenie o wypadku przy pracy i wyjaśnienia poszkodowanego. Może to być wykonane w dowolnej formie.
- Możliwość wgrania dokumentacji testowej dla minimum 5 przypadków. Uczestnicy powinni wskazać w jaki sposób jury ma wykonać test w możliwie najprostszy sposób. Wynikiem jest liczba rekomendacji, która jest dobrej jakości.

### 7. Dostępne zasoby
Uczestnicy dostaną pakiet przykładowych zgłoszeń wypadków przy pracy osób prowadzących pozarolniczą działalność gospodarczą. Są to rzeczywiste przypadki, które obsługuje ZUS. Będą więc niejednorodne, zawierające m.in. informacje medyczne oraz informacje o okolicznościach i przyczynach wypadku. Dokumenty będą w formie pdf i mają zostać użyte do testowania i uczenia modelu.

Dane te będą unikalne w swojej treści, ponieważ stanowią przykład rzeczywistych problemów, które może rozwiązać technologia. Dane będą przekazane w formie folderów zawierających pliki pdf.

Dodatkowo uczestnicy otrzymają materiały dotyczące formalnych zasad podejmowania decyzji i wystawiania karty wypadku.

### 8. Kryteria oceny
Kryteria oceny: zna Szef — poprawki pod nie w fazie 2.

### 9. Dodatkowe uwagi/kontekst wdrożeniowy
W zależności od jakości zaprezentowanych rozwiązań ZUS planuje je wdrożyć w całości lub w części. Najlepsze zespoły będą zapraszane do współpracy przy dalszym rozwoju swoich projektów.

Należy wskazać, że podobne problemy, to jest analiza dokumentacji oraz wsparcie w jej tworzeniu są ściśle powiązane z działalnością ZUS, więc zdobycie wiedzy o rozwiązywaniu tego typu problemu będzie bardzo cenne dla uczestników i może być wykorzystane w przyszłości.

---

## Uwagi do próby (od ludzi)
- Zbioru zgłoszeń ZUS (skanów PDF, kart wypadków) nie mamy — przygotowujemy własny, sztuczny: kilkadziesiąt wymyślonych zgłoszeń i rozstrzygnięć, część jako PDF/obraz do odczytu.
- Wzorca zgłoszenia ZUS i zasad wystawiania karty wypadku nie dostaniemy — ustalamy je z publicznych źródeł (ZUS, przepisy o wypadkach przy pracy osób prowadzących działalność), z odsyłaczem do źródła.
- Liczenie: OMEN przez orkiestrator; karta graficzna GTX 1050, 4 GB (`--klasa gpu-tlo`) — model musi się zmieścić albo model przez API (decyzja Pawła).
