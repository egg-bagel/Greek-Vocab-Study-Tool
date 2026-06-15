This web app is an ancient Greek vocabulary study tool. It is currently under construction.

When finished, the app will function as a set of interactive flashcards with multiple modes that the user can choose from. During the development phase, the vocabulary for the flash cards will be chosen by myself and all the associated information will be stored in a JSON file that I create with AI. Eventually, as the project scales, I want to transition to using an external database for vocabulary, but this is beyond the scope of what I'm doing currently. I would also like to create specific chapter-by-chapter flashcard sets for Hansen & Quinn, Athenaze, and Mastronarde. 

This app has a particular focus on helping users practice parsing verbs and memorizing principal parts. There are three modes for verb practice:

-Greek to English. A verb form is randomly generated from the word bank.  The user must specify the person, number, tense, mood, and voice using the provided drop-downs.

-English to Greek. A verb is randomly selected from the user's chosen word bank. The page displays the verb's dictionary entry and meaning along with giving a person, number, tense, mood, and voice. The user must provide the correct Greek verb form by typing in an input box.

-Principal parts practice. A verb is randomly selected and its dictionary entry and definition are shown on the page. The user must fill out six input boxes with all the principal parts of that verb. 

The app will include other parts of speech, not just verbs. I will probably use frequency lists to build these vocabulary lists at first. Nouns and adjectives will have interactive cards to practice declensions. There will be a special category just for irregulars. 

Once the main features of the app are working, I plan to expand it so that users can create accounts. Users will be able to see their study statistics and track their progress. I plan to create an option for spaced repetition so that users can target the words they get wrong most frequently. For this, I will need to choose a backend stack. I plan to use Node.js with Express and use PostgreSQL for the database. At some point I will migrate the frontend to React.

================= TO DO ====================
-Fix ambiguous forms bug
-Allow infinitives and participles to be randomly chosen; add "null" options to drop-downs
-Improve the appearance of the page and add some text instructions
-Find vocabulary frequency lists to build word banks
-Generate expanded word banks with AI
-Learn Node/Express by building a simple REST API for word data
-Learn PostgreSQL by migrating the JSON into a real database
-Add user auth
-When vanilla JS starts feeling unwieldy, migrate to React