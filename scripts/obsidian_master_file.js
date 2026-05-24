// Αποθηκεύει το HTML στοιχείο του τρέχοντος block σημείωσης στη μεταβλητή containerEl
const containerEl = this.container;

// Ορίζει τη συνάρτηση draw που δέχεται ως παράμετρο το κείμενο φιλτραρίσματος (filterText)
function draw(filterText) {
    // Καθαρίζει όλο το περιεχόμενο του containerEl ώστε να μην διπλασιάζονται τα στοιχεία σε κάθε εκτέλεση
    containerEl.empty();
    
    // Δημιουργεί ένα νέο στοιχείο div μέσα στο containerEl για να φιλοξενήσει τα στοιχεία αναζήτησης
    const searchDiv = containerEl.createEl("div", { 
        // Ορίζει τις στυλιστικές ιδιότητες CSS (διάταξη flex, περιθώρια, απόσταση κλπ) για το div
        attr: { style: "margin-bottom: 20px; display: flex; gap: 10px; align-items: center; flex-wrap: wrap;" } 
    // Κλείνει το αντικείμενο ρυθμίσεων του div
    });
    
    // Δημιουργεί ένα στοιχείο κειμένου span μέσα στο searchDiv
    searchDiv.createSpan({ 
        // Ορίζει το σταθερό κείμενο που θα εμφανίζεται στο span ("Φίλτρο Project:")
        text: "Φίλτρο Project:", 
        // Ορίζει στυλ CSS για το span (έντονα γράμματα, μέγεθος γραμματοσειράς)
        attr: { style: "font-weight: bold; font-size: 0.95em;" } 
    // Κλείνει το αντικείμενο ρυθμίσεων του span
    });
    
    // Δημιουργεί ένα πεδίο εισαγωγής κειμένου (input) μέσα στο searchDiv
    const input = searchDiv.createEl("input", { 
        // Ξεκινά τον ορισμό των ιδιοτήτων (attributes) του input
        attr: { 
            // Ορίζει τον τύπο του πεδίου εισαγωγής ως απλό κείμενο
            type: "text", 
            // Ορίζει το αχνό κείμενο προτροπής (placeholder) μέσα στο πεδίο
            placeholder: "Πληκτρολογήστε όνομα...", 
            // Θέτει την τρέχουσα τιμή του πεδίου ίση με το φίλτρο που εφαρμόστηκε
            value: filterText,
            // Εφαρμόζει στυλ CSS που εναρμονίζεται με το τρέχον θέμα (Light/Dark) του Obsidian
            style: "padding: 6px 10px; border-radius: 6px; border: 1px solid var(--background-modifier-border); background: var(--background-primary); color: var(--text-normal); width: 220px; font-size: 0.9em;" 
        // Κλείνει το αντικείμενο των ιδιοτήτων (attributes)
        } 
    // Κλείνει το αντικείμενο ρυθμίσεων του input
    });
    
    // Δημιουργεί ένα κουμπί (button) μέσα στο searchDiv για την εκτέλεση της αναζήτησης
    const button = searchDiv.createEl("button", { 
        // Ορίζει το κείμενο πάνω στο κουμπί ως "Αναζήτηση"
        text: "Αναζήτηση", 
        // Ξεκινά τον ορισμό των ιδιοτήτων (attributes) του κουμπιού
        attr: { 
            // Εφαρμόζει στυλ CSS (χρώμα έμφασης του Obsidian, στρογγυλεμένες γωνίες, δείκτη ποντικιού κλπ)
            style: "padding: 6px 12px; cursor: pointer; border-radius: 6px; background: var(--interactive-accent); color: var(--text-on-accent); border: none; font-weight: bold; font-size: 0.9em;" 
        // Κλείνει το αντικείμενο των ιδιοτήτων (attributes)
        } 
    // Κλείνει το αντικείμενο ρυθμίσεων του κουμπιού
    });
    
    // Δημιουργεί ένα δεύτερο κουμπί μέσα στο searchDiv για τον καθαρισμό του φίλτρου
    const clearBtn = searchDiv.createEl("button", { 
        // Ορίζει το κείμενο πάνω στο κουμπί ως "Καθαρισμός"
        text: "Καθαρισμός", 
        // Ξεκινά τον ορισμό των ιδιοτήτων (attributes) του clearBtn
        attr: { 
            // Εφαρμόζει στυλ CSS με ουδέτερα χρώματα περιγράμματος και φόντου
            style: "padding: 6px 12px; cursor: pointer; border-radius: 6px; background: var(--background-modifier-border); border: 1px solid var(--background-modifier-border-hover); font-size: 0.9em;" 
        // Κλείνει το αντικείμενο των ιδιοτήτων (attributes)
        } 
    // Κλείνει το αντικείμενο ρυθμίσεων του clearBtn
    });
    
    // Αναζητά όλες τις σημειώσεις (σελίδες) που βρίσκονται μέσα στον φάκελο "00_Daily"
    const pages = dv.pages('"00_Daily"');
    // Αρχικοποιεί έναν άδειο πίνακα (array) για να αποθηκεύσει τις γραμμές που θα εμφανιστούν στον τελικό πίνακα
    let rows = [];
    
    // Ξεκινά έναν βρόχο (loop) για να εξετάσει μία-μία όλες τις σελίδες που βρέθηκαν στον φάκελο
    for (let page of pages) {
        // Ελέγχει αν η συγκεκριμένη σελίδα περιέχει λίστες ή κουκκίδες (bullet points)
        if (page.file.lists) {
            // Ξεκινά έναν εσωτερικό βρόχο για να εξετάσει κάθε μεμονωμένο στοιχείο λίστας L της σελίδας
            for (let L of page.file.lists) {
                // Ελέγχει αν το στοιχείο λίστας L έχει ορισμένο (όχι κενό) το πεδίο project
                if (L.project !== undefined && L.project !== null) {
                    // Μετατρέπει την τιμή του project σε συμβολοσειρά (string) για ασφαλή επεξεργασία
                    const projName = String(L.project);
                    
                    // Ελέγχει αν το φίλτρο είναι κενό Ή αν το όνομα του project περιέχει το κείμενο αναζήτησης (μετατρέποντας και τα δύο σε πεζά)
                    if (filterText === "" || projName.toLowerCase().includes(filterText.toLowerCase())) {
                        // Προσθέτει ένα νέο αντικείμενο στον πίνακα rows με όλα τα δεδομένα της γραμμής
                        rows.push({
                            // Αποθηκεύει το όνομα του project
                            project: L.project,
                            // Αποθηκεύει τα MyTags, ή κενό αν δεν υπάρχουν
                            tags: L.MyTags || "",
                            // Αποθηκεύει την ημερομηνία, ή κενό αν δεν υπάρχει
                            date: L.date || "",
                            // Αποθηκεύει την ώρα έναρξης, ή κενό αν δεν υπάρχει
                            start: L.start || "",
                            // Αποθηκεύει την ώρα λήξης, ή κενό αν δεν υπάρχει
                            end: L.end || "",
                            // Αποθηκεύει την περιγραφή, ή κενό αν δεν υπάρχει
                            desc: L.desc || "",
                            // Αποθηκεύει την απόφαση, ή κενό αν δεν υπάρχει
                            decision: L.decision || "",
                            // Αποθηκεύει τους συμμετέχοντες, ή κενό αν δεν υπάρχουν
                            attendees: L.attendees || "",
                            // Αποθηκεύει το mood, ή κενό αν δεν υπάρχει
                            mood: L.mood || "",
                            // Αποθηκεύει τα αρχεία, ή κενό αν δεν υπάρχουν
                            files: L.files || "",
                            // Δημιουργεί μια έκδοση της ημερομηνίας σε string για χρήση στην ταξινόμηση
                            sortDate: L.date ? String(L.date) : "",
                            // Δημιουργεί μια έκδοση της ώρας έναρξης σε string για χρήση στην ταξινόμηση
                            sortStart: L.start ? String(L.start) : ""
                        // Κλείνει την προσθήκη (push) του αντικειμένου
                        });
                    // Κλείνει τον έλεγχο (if) του φίλτρου αναζήτησης
                    }
                // Κλείνει τον έλεγχο (if) ύπαρξης του project
                }
            // Κλείνει τον βρόχο επανάληψης (for) των στοιχείων λίστας
            }
        // Κλείνει τον έλεγχο (if) ύπαρξης λιστών στη σελίδα
        }
    // Κλείνει τον βρόχο επανάληψης (for) των σελίδων
    }
    
    // Ταξινομεί τα στοιχεία του πίνακα rows χρησιμοποιώντας μια συνάρτηση σύγκρισης (sort)
    rows.sort((a, b) => {
        // Ελέγχει αν οι ημερομηνίες των δύο στοιχείων (a και b) είναι διαφορετικές
        if (b.sortDate !== a.sortDate) {
            // Ταξινομεί φθίνουσα με βάση την ημερομηνία (πιο πρόσφατη πρώτη)
            return b.sortDate.localeCompare(a.sortDate);
        // Κλείνει τον έλεγχο της ημερομηνίας
        }
        // Αν οι ημερομηνίες είναι ίδιες, ταξινομεί φθίνουσα με βάση την ώρα έναρξης
        return b.sortStart.localeCompare(a.sortStart);
    // Κλείνει τη συνάρτηση ταξινόμησης rows.sort
    });
    
    // Ορίζει έναν πίνακα με τους τίτλους των στηλών του Dataview πίνακα
    const headers = ["Project", "Tags", "Ημερομηνία", "Έναρξη", "Λήξη", "Περιγραφή", "Απόφαση", "Συμμετέχοντες", "Mood", "Αρχεία"];
    // Μετατρέπει τον πίνακα αντικειμένων rows σε πίνακα από arrays τιμών που απαιτεί η dv.table
    const tableData = rows.map(r => [
        // Τοποθετεί την τιμή του project στην πρώτη στήλη
        r.project,
        // Τοποθετεί τα tags στη δεύτερη στήλη
        r.tags,
        // Τοποθετεί την ημερομηνία στην τρίτη στήλη
        r.date,
        // Τοποθετεί την ώρα έναρξης στην τέταρτη στήλη
        r.start,
        // Τοποθετεί την ώρα λήξης στην πέμπτη στήλη
        r.end,
        // Τοποθετεί την περιγραφή στην έκτη στήλη
        r.desc,
        // Τοποθετεί την απόφαση στην έβδομη στήλη
        r.decision,
        // Τοποθετεί τους συμμετέχοντες στην όγδοη στήλη
        r.attendees,
        // Τοποθετεί το mood στην ένατη στήλη
        r.mood,
        // Τοποθετεί τα αρχεία στη δέκατη στήλη
        r.files
    // Κλείνει τη μετατροπή (map) των δεδομένων
    ]);
    
    // Προσθέτει έναν μηχανισμό παρακολούθησης κλικ (click event) στο κουμπί αναζήτησης
    button.addEventListener("click", () => {
        // Καλεί τη συνάρτηση draw με την τρέχουσα τιμή του input, αφαιρώντας περιττά κενά (trim)
        draw(input.value.trim());
    // Κλείνει τον click event listener του κουμπιού
    });
    
    // Προσθέτει έναν μηχανισμό παρακολούθησης πληκτρολογίου (keydown event) στο πεδίο input
    input.addEventListener("keydown", (e) => {
        // Ελέγχει αν το πλήκτρο που πατήθηκε είναι το "Enter"
        if (e.key === "Enter") {
            // Καλεί τη συνάρτηση draw με την τρέχουσα τιμή του input, αφαιρώντας περιττά κενά
            draw(input.value.trim());
        // Κλείνει τον έλεγχο για το πλήκτρο Enter
        }
    // Κλείνει τον keydown event listener του input
    });
    
    // Προσθέτει έναν μηχανισμό παρακολούθησης κλικ (click event) στο κουμπί καθαρισμού
    clearBtn.addEventListener("click", () => {
        // Καλεί τη συνάρτηση draw με κενό φίλτρο ("") για να εμφανιστούν ξανά όλα τα projects
        draw("");
    // Κλείνει τον click event listener του κουμπιού καθαρισμού
    });
    
    // Καλεί τη μέθοδο του Dataview για να σχεδιάσει και να εμφανίσει τον τελικό πίνακα στην οθόνη
    dv.table(headers, tableData);
// Κλείνει τη συνάρτηση draw
}

// Εκτελεί για πρώτη φορά τη συνάρτηση draw με κενό φίλτρο, ώστε να εμφανιστούν τα δεδομένα μόλις ανοίξει η σημείωση
draw("");
