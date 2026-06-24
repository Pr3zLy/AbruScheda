# AbruScheda

AbruScheda è una web application progressiva (PWA) progettata per tracciare e ottimizzare le sessioni di allenamento in palestra. L'applicazione consente di monitorare il completamento degli esercizi, gestire i tempi di recupero con un timer persistente in background e personalizzare i propri piani di allenamento importando file JSON.

---

## Funzionalità

*   **Tracciamento dell'allenamento**: Monitoraggio in tempo reale degli esercizi completati con calcolo percentuale e indicatore di progresso visivo.
*   **Timer di recupero**:
    *   **Notifiche di sistema**: Notifiche interattive che consentono di controllare il timer (pausa/riavvio) direttamente dall'area di notifica del browser o del dispositivo (ottimizzato per Android).
    *   **Wake Lock API**: Previene lo standby dello schermo e la sospensione dell'applicazione durante il recupero.
    *   **Suoni personalizzabili**: Riproduzione di avvisi acustici sintetizzati via Web Audio API al termine del recupero.
    *   **Impostazione rapida**: Configurazione del tempo di recupero tramite pulsanti rapidi o inserimento manuale (doppio click/tocco sul timer).
*   **Temi dinamici**: Supporto nativo per temi chiaro/scuro e schemi di colore che si adattano automaticamente al tipo di allenamento selezionato (Push, Pull, Legs, Upper, Arm).
*   **Persistenza dei dati**: Salvataggio automatico dello stato degli esercizi completati, del tema e delle impostazioni del timer nel browser (localStorage).
*   **Gestione schede**: Importazione ed esportazione dei piani di allenamento in formato JSON. Include link preconfigurati per generare file compatibili utilizzando modelli di intelligenza artificiale esterni (Gemini, ChatGPT, Grok).

---

## Stack Tecnologico

*   **React 19** e **TypeScript**
*   **Vite** come build tool
*   **Tailwind CSS** per lo styling dell'interfaccia
*   **Lucide React** per l'iconografia
*   **Web Audio API** e **Service Workers** per la gestione di suoni e notifiche in background

---

## Guida all'Avvio Rapido

### Prerequisiti
Assicurarsi di aver installato [Node.js](https://nodejs.org/).

### 1. Installazione delle dipendenze
Clonare il repository e installare i pacchetti necessari:
```bash
npm install
```

### 2. Avvio in locale
Avviare il server di sviluppo locale:
```bash
npm run dev
```
L'applicazione sarà accessibile all'indirizzo `http://localhost:3000`.

---

## Struttura del file di configurazione (`workout_data.json`)

Le schede possono essere caricate direttamente dall'interfaccia nel formato descritto di seguito:

```json
[
  {
    "title": "PUSH",
    "subtitle": "Focus: Spinta & Ipertrofia",
    "esercizi": [
      {
        "nome": "Panca Piana Bilanciere",
        "serie": "3 x 6-8",
        "tipo": "chest",
        "note": "Gomiti a 45°, scapole addotte, controlla la discesa (3 sec)"
      },
      {
        "nome": "French Press",
        "serie": "3 x 10",
        "tipo": "triceps",
        "note": "Mantieni i gomiti stretti e stabili"
      }
    ]
  },
  {
    "title": "PULL",
    "subtitle": "Focus: Tirata & Dorso",
    "esercizi": [
      {
        "nome": "Lat Machine Presa Larga",
        "serie": "4 x 8-10",
        "tipo": "back",
        "note": "Scapole giù e indietro, petto fuori, ROM completo"
      }
    ]
  }
]
```

### Tipi di esercizio supportati (`tipo`):
*   `chest` (Petto)
*   `back` (Dorso)
*   `shoulders` (Spalle)
*   `legs` (Gambe)
*   `triceps` (Tricipiti)
*   `biceps` (Bicipiti)
*   `calves` (Polpacci)
*   `forearms` (Avambracci)

---

## Contribuire

Per proporre modifiche o segnalare problemi, è possibile aprire una Pull Request o una Issue nel repository del progetto.
