# Notes on Obsidian
25-May-2026

# Οδηγός Dataview, Metadata & DataviewJS στο Obsidian (για Αρχάριους)

Αυτός ο οδηγός συγκεντρώνει βασικές γνώσεις για τη διαχείριση μεταδεδομένων (metadata) στο Obsidian, τη χρήση του πρόσθετου Dataview για την προβολή τους, καθώς και τη δημιουργία διαδραστικών πινάκων με το DataviewJS.

---

## 1. YAML Frontmatter (Properties) vs Inline Πεδία

Στο Obsidian υπάρχουν δύο βασικοί τρόποι για να εισάγετε μεταδεδομένα (πληροφορίες που μπορεί να διαβάσει το Dataview) στις σημειώσεις σας.

### Α. YAML Frontmatter / Properties
Είναι ένα τμήμα κειμένου που τοποθετείται **πάντα στην αρχή της σημείωσης** ανάμεσα σε τρεις παύλες (`---`).

* **Χαρακτηριστικό:** Οι πληροφορίες αυτές αφορούν **ολόκληρη τη σημείωση**.
* **Γενικό Πρότυπο:** Το YAML και το Frontmatter είναι παγκόσμια τεχνολογικά πρότυπα (χρησιμοποιούνται στο Docker, στο GitHub, σε ιστοσελίδες κ.λπ.) και δεν ανήκουν αποκλειστικά στο Obsidian.
* **Properties:** Είναι απλώς το οπτικό περιβάλλον (UI) που έφτιαξε το Obsidian για να κάνει τη συμπλήρωση του YAML πιο εύκολη, χωρίς να χρειάζεται να γράφετε κώδικα.

```yaml
---
project: Project Alpha
status: Σε εξέλιξη
date: 2026-05-25
tags: [δουλειά, meetings]
---
```

### Β. Inline Πεδία (Inline Fields)
Είναι πεδία που γράφονται **μέσα στο σώμα του κειμένου** ή **μέσα σε λίστες (bullet points)**, χρησιμοποιώντας τη διπλή άνω-κάτω τελεία (`::`).

* **Χαρακτηριστικό:** Αφορούν τη συγκεκριμένη πρόταση ή γραμμή στην οποία γράφονται. Είναι ιδανικά για Daily Notes όπου καταγράφετε πολλά διαφορετικά πράγματα στην ίδια σελίδα.

```markdown
- [project:: Project Alpha] [start:: 10:00] [end:: 11:00] [desc:: Συνάντηση ομάδας]
- [project:: Project Beta] [start:: 11:30] [end:: 13:00] [desc:: Σχεδιασμός UI]
```

---

## 2. Τι είναι το Dataview & Ανάλυση Κώδικα

Το **Dataview** είναι ένα πρόσθετο (plugin) που μετατρέπει το Obsidian σε βάση δεδομένων. Σας επιτρέπει να κάνετε ερωτήματα (queries) και να εμφανίζετε δεδομένα σε πίνακες ή λίστες.

### Ανάλυση ενός βασικού Query
Ας δούμε τι κάνει ο παρακάτω κώδικας Dataview:

```dataview
TABLE 
    L.project AS "Project", 
    L.MyTags AS "Tags", 
    L.date AS "Ημερομηνία", 
    L.start AS "Έναρξη", 
    L.end AS "Λήξη", 
    L.desc AS "Περιγραφή"
FROM "00_Daily"
FLATTEN file.lists AS L
WHERE L.project != null
SORT L.date DESC, L.start DESC
```

* **`TABLE ... AS ...`**: Δημιουργεί έναν πίνακα και ορίζει τους τίτλους των στηλών.
* **`FROM "00_Daily"`**: Περιορίζει την αναζήτηση μόνο στα αρχεία που βρίσκονται στον φάκελο `00_Daily`.
* **`FLATTEN file.lists AS L`**: Παίρνει όλες τις λίστες (κουκκίδες) των αρχείων και τις «ξεδιπλώνει» ώστε να εξεταστούν ως ξεχωριστές γραμμές. Κάθε γραμμή ονομάζεται προσωρινά **`L`** (από τη λέξη List).
* **`L.project`**: Η τελεία (`.`) είναι τελεστής πρόσβασης. Το `L.project` σημαίνει: *"Πήγαινε στη γραμμή `L` και βρες το πεδίο `project` που περιέχει"*.
* **`WHERE L.project != null`**: Εμφανίζει μόνο τις γραμμές που έχουν συμπληρωμένο κάποιο project.
* **`SORT L.date DESC, L.start DESC`**: Ταξινομεί τα αποτελέσματα από το πιο πρόσφατο στο πιο παλιό.

---

## 3. Πώς φιλτράρουμε με βάση το Project

Αν θέλετε να περιορίσετε τον πίνακα ώστε να δείχνει μόνο ένα συγκεκριμένο project, τροποποιείτε τη γραμμή `WHERE`:

* **Για απόλυτη ταύτιση (π.χ. ακριβώς "Project X"):**
  ```markdown
  WHERE L.project = "Project X"
  ```
* **Για μερική ταύτιση (να περιέχει τη λέξη "Project X"):**
  ```markdown
  WHERE contains(L.project, "Project X")
  ```

---

## 4. Τι είναι το DataviewJS & Διαδραστικός Πίνακας

Το **DataviewJS** είναι μια επέκταση του Dataview που σας επιτρέπει να γράφετε κώδικα **JavaScript**. Με αυτό, μπορείτε να ξεπεράσετε τους περιορισμούς του απλού Dataview και να δημιουργήσετε διαδραστικά στοιχεία (όπως κουμπιά και πεδία εισαγωγής).

### Προϋπόθεση λειτουργίας
Πρέπει να πάτε στα **Settings -> Dataview** του Obsidian και να ενεργοποιήσετε την επιλογή **Enable JavaScript Queries**.

### Κώδικας για Διαδραστικό Πίνακα με Μπάρα Αναζήτησης
Αντιγράψτε τον παρακάτω κώδικα σε ένα block τύπου `dataviewjs`. Θα εμφανίσει ένα πλαίσιο κειμένου όπου μπορείτε να πληκτρολογείτε το όνομα του project, να πατάτε «Αναζήτηση» και ο πίνακας να φιλτράρεται αυτόματα:

```javascript
const containerEl = this.container;

function draw(filterText) {
    containerEl.empty();
    
    // Δημιουργία της μπάρας αναζήτησης
    const searchDiv = containerEl.createEl("div", { 
        attr: { style: "margin-bottom: 20px; display: flex; gap: 10px; align-items: center; flex-wrap: wrap;" } 
    });
    
    searchDiv.createSpan({ 
        text: "Φίλτρο Project:", 
        attr: { style: "font-weight: bold; font-size: 0.95em;" } 
    });
    
    const input = searchDiv.createEl("input", { 
        attr: { 
            type: "text", 
            placeholder: "Πληκτρολογήστε όνομα...", 
            value: filterText,
            style: "padding: 6px 10px; border-radius: 6px; border: 1px solid var(--background-modifier-border); background: var(--background-primary); color: var(--text-normal); width: 220px; font-size: 0.9em;" 
        } 
    });
    
    const button = searchDiv.createEl("button", { 
        text: "Αναζήτηση", 
        attr: { 
            style: "padding: 6px 12px; cursor: pointer; border-radius: 6px; background: var(--interactive-accent); color: var(--text-on-accent); border: none; font-weight: bold; font-size: 0.9em;" 
        } 
    });
    
    const clearBtn = searchDiv.createEl("button", { 
        text: "Καθαρισμός", 
        attr: { 
            style: "padding: 6px 12px; cursor: pointer; border-radius: 6px; background: var(--background-modifier-border); border: 1px solid var(--background-modifier-border-hover); font-size: 0.9em;" 
        } 
    });
    
    // Συλλογή και φιλτράρισμα των δεδομένων
    const pages = dv.pages('"00_Daily"');
    let rows = [];
    
    for (let page of pages) {
        if (page.file.lists) {
            for (let L of page.file.lists) {
                if (L.project !== undefined && L.project !== null) {
                    const projName = String(L.project);
                    
                    if (filterText === "" || projName.toLowerCase().includes(filterText.toLowerCase())) {
                        rows.push({
                            project: L.project,
                            tags: L.MyTags || "",
                            date: L.date || "",
                            start: L.start || "",
                            end: L.end || "",
                            desc: L.desc || "",
                            decision: L.decision || "",
                            attendees: L.attendees || "",
                            mood: L.mood || "",
                            files: L.files || "",
                            sortDate: L.date ? String(L.date) : "",
                            sortStart: L.start ? String(L.start) : ""
                        });
                    }
                }
            }
        }
    }
    
    // Ταξινόμηση
    rows.sort((a, b) => {
        if (b.sortDate !== a.sortDate) {
            return b.sortDate.localeCompare(a.sortDate);
        }
        return b.sortStart.localeCompare(a.sortStart);
    });
    
    const headers = ["Project", "Tags", "Ημερομηνία", "Έναρξη", "Λήξη", "Περιγραφή", "Απόφαση", "Συμμετέχοντες", "Mood", "Αρχεία"];
    const tableData = rows.map(r => [
        r.project,
        r.tags,
        r.date,
        r.start,
        r.end,
        r.desc,
        r.decision,
        r.attendees,
        r.mood,
        r.files
    ]);
    
    // Event Listeners
    button.addEventListener("click", () => {
        draw(input.value.trim());
    });
    
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            draw(input.value.trim());
        }
    });
    
    clearBtn.addEventListener("click", () => {
        draw("");
    });
    
    dv.table(headers, tableData);
}

draw("");
```
