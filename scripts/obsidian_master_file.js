// Αποθήκευση του κεντρικού στοιχείου HTML (container) όπου θα σχεδιαστεί το UI και ο πίνακας
const containerEl = this.container;

// Καθαρισμός του container κατά την αρχική φόρτωση για να μην διπλασιάζεται το περιεχόμενο
containerEl.empty(); 

// Ανάκτηση του μονοπατιού (path) του τρέχοντος ενεργού αρχείου Markdown στο Obsidian
const currentFilePath = dv.current().file.path;

// Λήψη του πραγματικού αντικειμένου αρχείου (TFile) από το Vault του Obsidian χρησιμοποιώντας το μονοπάτι του
const currentFile = app.vault.getAbstractFileByPath(currentFilePath);

// Ανάγνωση της τιμής του φίλτρου 'project-filter' από το Frontmatter (Properties) του αρχείου, ή κενό ("") αν δεν υπάρχει
const defaultFilter = dv.current()["project-filter"] || "";

// Δημιουργία ενός νέου div στοιχείου HTML που θα περιέχει τη μπάρα αναζήτησης και τα κουμπιά
const searchDiv = containerEl.createEl("div", { 
    // Προσθήκη CSS κλάσης 'search-ui-container' για να μπορούμε να το στοχεύσουμε (π.χ. για απόκρυψη στο PDF)
    cls: "search-ui-container", 
    // Ορισμός inline CSS ιδιοτήτων για τη σωστή στοίχιση, αποστάσεις και εμφάνιση των στοιχείων του UI
    attr: { style: "margin-bottom: 20px; display: flex; gap: 10px; align-items: center; flex-wrap: wrap;" } 
});

// Δημιουργία ενός style element μέσα στο searchDiv για να εισάγουμε κανόνες CSS
searchDiv.createEl("style", {
    // Ορισμός κανόνα εκτύπωσης (@media print): Όταν εξάγεται σε PDF, το UI αναζήτησης αποκρύπτεται εντελώς
    text: "@media print { .search-ui-container { display: none !important; } }"
});

// Δημιουργία ενός span στοιχείου κειμένου που λειτουργεί ως ετικέτα (label) για το φίλτρο
searchDiv.createSpan({ 
    // Ορισμός του κειμένου της ετικέτας
    text: "Φίλτρο Project:", 
    // Ορισμός στυλ για έντονη γραφή (bold) και συγκεκριμένο μέγεθος γραμματοσειράς
    attr: { style: "font-weight: bold; font-size: 0.95em;" } 
});

// Δημιουργία του πεδίου εισαγωγής κειμένου (input box) για την πληκτρολόγηση του φίλτρου
const input = searchDiv.createEl("input", { 
    attr: { 
        // Ορισμός του τύπου του στοιχείου ως text input
        type: "text", 
        // Ορισμός κειμένου προτροπής (placeholder) όταν το πεδίο είναι άδειο
        placeholder: "Πληκτρολογήστε όνομα...", 
        // Αρχικοποίηση της τιμής του πεδίου με το προκαθορισμένο φίλτρο από το Frontmatter
        value: defaultFilter, 
        // Ορισμός στυλ (padding, border, στρογγυλεμένες γωνίες, χρώματα συμβατά με το θέμα του Obsidian και πλάτος)
        style: "padding: 6px 10px; border-radius: 6px; border: 1px solid var(--background-modifier-border); background: var(--background-primary); color: var(--text-normal); width: 220px; font-size: 0.9em;" 
    } 
});

// Δημιουργία του κουμπιού "Αναζήτηση"
const button = searchDiv.createEl("button", { 
    // Ορισμός του κειμένου που θα εμφανίζεται πάνω στο κουμπί
    text: "Αναζήτηση", 
    attr: { 
        // Ορισμός στυλ (χρώματα interactive accent του Obsidian, λευκό κείμενο, στρογγυλεμένες γωνίες και δείκτης ποντικιού)
        style: "padding: 6px 12px; cursor: pointer; border-radius: 6px; background: var(--interactive-accent); color: var(--text-on-accent); border: none; font-weight: bold; font-size: 0.9em;" 
    } 
});

// Δημιουργία του κουμπιού "Καθαρισμός"
const clearBtn = searchDiv.createEl("button", { 
    // Ορισμός του κειμένου που θα εμφανίζεται πάνω στο κουμπί
    text: "Καθαρισμός", 
    attr: { 
        // Ορισμός στυλ (διακριτικό γκρι χρώμα φόντου και περιγράμματος, κατάλληλο για δευτερεύουσα ενέργεια)
        style: "padding: 6px 12px; cursor: pointer; border-radius: 6px; background: var(--background-modifier-border); border: 1px solid var(--background-modifier-border-hover); font-size: 0.9em;" 
    } 
});

// Ορισμός της βασικής συνάρτησης draw, η οποία φιλτράρει τα δεδομένα και σχεδιάζει τον πίνακα
function draw(filterText) {
    // Μετατροπή των παιδιών του container σε Array και επανάληψη σε καθένα από αυτά
    Array.from(containerEl.children).forEach(child => {
        // Αν το παιδί ΔΕΝ είναι η μπάρα αναζήτησης (searchDiv), τότε το διαγράφουμε (π.χ. παλιούς πίνακες ή μηνύματα)
        if (child !== searchDiv) {
            child.remove();
        }
    });

    // Ενημέρωση της τιμής του input πεδίου με το τρέχον κείμενο φίλτρου
    input.value = filterText;
    
    // Ανάκτηση όλων των σελίδων που βρίσκονται μέσα στον φάκελο "00_Daily"
    const pages = dv.pages('"00_Daily"');
    // Δημιουργία ενός άδειου πίνακα για την αποθήκευση των φιλτραρισμένων γραμμών
    let rows = [];
    
    // Επανάληψη (loop) μέσα από κάθε σελίδα που βρέθηκε στον φάκελο
    for (let page of pages) {
        // Έλεγχος αν η σελίδα περιέχει λίστες (bullet points / lists)
        if (page.file.lists) {
            // Επανάληψη μέσα από κάθε στοιχείο λίστας (L) της συγκεκριμένης σελίδας
            for (let L of page.file.lists) {
                // Έλεγχος αν το στοιχείο λίστας έχει ορισμένο το inline πεδίο 'project'
                if (L.project !== undefined && L.project !== null) {
                    // Μετατροπή της τιμής του project σε αλφαριθμητικό (string) για ασφαλή σύγκριση
                    const projName = String(L.project);
                    
                    // Αν δεν υπάρχει φίλτρο, ή αν το όνομα του project περιέχει το κείμενο αναζήτησης (case-insensitive)
                    if (filterText === "" || projName.toLowerCase().includes(filterText.toLowerCase())) {
                        // Προσθήκη ενός αντικειμένου με τα δεδομένα της γραμμής στον πίνακα rows
                        rows.push({
                            file: page.file.link, // Σύνδεσμος (link) προς το αρχείο της Daily Note
                            fileName: page.file.name, // Το όνομα του αρχείου (συνήθως ημερομηνία YYYY-MM-DD)
                            project: L.project, // Το όνομα του project
                            date: L.date || "", // Ημερομηνία της καταγραφής (αν υπάρχει)
                            start: L.start || "", // Ώρα έναρξης (αν υπάρχει)
                            end: L.end || "", // Ώρα λήξης (αν υπάρχει)
                            desc: L.desc || "", // Περιγραφή της εργασίας
                            decision: L.decision || "", // Απόφαση που πάρθηκε (αν υπάρχει)
                            attendees: L.attendees || "", // Συμμετέχοντες (αν υπάρχουν)
                            files: L.files || "", // Σχετικά αρχεία/σύνδεσμοι (αν υπάρχουν)
                            tags: L.MyTags || L.tags || "", // Tags, με προτίμηση στο MyTags και εναλλακτική στα κλασικά tags
                            mood: L.mood || "", // Η διάθεση (mood) της καταγραφής
                            line: L.line || 0 // Ο αριθμός γραμμής μέσα στο αρχείο (χρήσιμο για σωστή ταξινόμηση)
                        });
                    }
                }
            }
        }
    }
    
    // Ταξινόμηση των γραμμών του πίνακα rows
    rows.sort((a, b) => {
        // Αν οι γραμμές προέρχονται από διαφορετικά αρχεία (διαφορετικές ημέρες)
        if (b.fileName !== a.fileName) {
            // Ταξινομούμε φθίνουσα με βάση το όνομα του αρχείου (οι πιο πρόσφατες μέρες εμφανίζονται πρώτες)
            return b.fileName.localeCompare(a.fileName);
        }
        // Αν προέρχονται από το ίδιο αρχείο, ταξινομούμε αύξουσα με βάση τον αριθμό γραμμής (σειρά καταγραφής)
        return a.line - b.line; 
    });
    
    // Έλεγχος αν ο πίνακας rows είναι άδειος (δηλαδή δεν βρέθηκε καμία καταγραφή που να ταιριάζει)
    if (rows.length === 0) {
        // Δημιουργία ενός στοιχείου παραγράφου (p) για την εμφάνιση μηνύματος μη εύρεσης αποτελεσμάτων
        containerEl.createEl("p", { 
            // Ορισμός του κειμένου ειδοποίησης
            text: "Δεν βρέθηκαν καταγραφές που να ταιριάζουν με το φίλτρο.",
            // Ορισμός πλάγιου στυλ (italic) και γκρι χρώματος κειμένου (muted)
            attr: { style: "font-style: italic; color: var(--text-muted); margin-top: 15px;" }
        });
        // Τερματισμός της συνάρτησης draw εδώ, ώστε να μην σχεδιαστεί άδειος πίνακας
        return;
    }
    
    // Ορισμός των τίτλων των στηλών (headers) για τον πίνακα του Dataview
    const headers = ["Αρχείο", "Project", "Περιγραφή", "Απόφαση", "Αρχεία", "Έναρξη", "Λήξη", "Συμμετέχοντες", "Mood", "Tags"];
    // Χαρτογράφηση (mapping) των αντικειμένων του πίνακα rows σε απλούς πίνακες τιμών που απαιτεί το Dataview
    const tableData = rows.map(r => [
        r.file, // Σύνδεσμος αρχείου
        r.project, // Όνομα project
        r.desc, // Περιγραφή
        r.decision, // Απόφαση
        r.files, // Αρχεία
        r.start, // Έναρξη
        r.end, // Λήξη
        r.attendees, // Συμμετέχοντες
        r.mood, // Mood
        r.tags, // Tags
    ]);
    
    // Κλήση της ενσωματωμένης συνάρτησης του Dataview για τη σχεδίαση του τελικού πίνακα
    dv.table(headers, tableData);
}

// Ορισμός ασύγχρονης συνάρτησης για την ενημέρωση των ιδιοτήτων (Properties/YAML) της σημείωσης
async function updateFilterFrontmatter(value) {
    // Αν για οποιονδήποτε λόγο δεν βρέθηκε το αντικείμενο του αρχείου, σταματάμε τη διαδικασία
    if (!currentFile) return;
    // Χρήση του FileManager API του Obsidian για την ασφαλή επεξεργασία του Frontmatter
    await app.fileManager.processFrontMatter(currentFile, (fm) => {
        // Αν η τιμή του φίλτρου δεν είναι κενή
        if (value) {
            // Ορίζουμε ή ενημερώνουμε το πεδίο 'project-filter' με το νέο κείμενο
            fm["project-filter"] = value;
        } else {
            // Αν η τιμή είναι κενή, διαγράφουμε τελείως την ιδιότητα για να διατηρείται καθαρό το αρχείο
            delete fm["project-filter"];
        }
    });
}

// Προσθήκη Event Listener στο κουμπί "Αναζήτηση" για την ανίχνευση κλικ (click)
button.addEventListener("click", async () => {
    // Λήψη της τιμής από το input πεδίο, αφαιρώντας τα περιττά κενά στην αρχή και στο τέλος
    const val = input.value.trim();
    // Ασύγχρονη αποθήκευση της νέας τιμής στο Frontmatter της σημείωσης
    await updateFilterFrontmatter(val);
    // Κλήση της draw με το νέο φίλτρο για την επανασχεδίαση του πίνακα
    draw(val);
});

// Προσθήκη Event Listener στο input πεδίο για την ανίχνευση πατήματος πλήκτρου (keydown)
input.addEventListener("keydown", async (e) => {
    // Έλεγχος αν το πλήκτρο που πατήθηκε είναι το "Enter"
    if (e.key === "Enter") {
        // Λήψη της τιμής από το input πεδίο, αφαιρώντας τα περιττά κενά
        const val = input.value.trim();
        // Ασύγχρονη αποθήκευση της νέας τιμής στο Frontmatter της σημείωσης
        await updateFilterFrontmatter(val);
        // Κλήση της draw με το νέο φίλτρο για την επανασχεδίαση του πίνακα
        draw(val);
    }
});

// Προσθήκη Event Listener στο κουμπί "Καθαρισμός" για την ανίχνευση κλικ
clearBtn.addEventListener("click", async () => {
    // Ασύγχρονη διαγραφή του φίλτρου από το Frontmatter (αποθήκευση κενού)
    await updateFilterFrontmatter("");
    // Κλήση της draw με κενό φίλτρο ώστε να εμφανιστούν ξανά όλα τα projects
    draw("");
});

// Αρχική εκτέλεση της συνάρτησης draw κατά τη φόρτωση της σελίδας, χρησιμοποιώντας το φίλτρο από το Frontmatter (αν υπάρχει)
draw(defaultFilter);
