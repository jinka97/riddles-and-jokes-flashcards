// flashcards.js - Added Difficulty Property
// IMPORTANT: Add difficulty ('easy', 'medium', 'hard') to ALL cards!

// End of allFlashcards array

const allFlashcards = [
  // Original Cards
    { id: "o1", question: "Bolt: What animal barks?", answer: "Dog", guide: "Bolt: Let’s learn about animals! Click the card to flip.", category: "original", premium: false, difficulty: 'easy' },
    { id: "o2", question: "Bolt: What animal says 'meow'?", answer: "Cat", guide: "Bolt: Let’s learn about animals! Click the card to flip.", category: "original", premium: false, difficulty: 'easy' },
    { id: "o3", question: "Chatty: What’s 'Hola' in English?", answer: "Hello", guide: "Chatty: Let’s explore languages! Click the card to flip.", category: "original", premium: false, difficulty: 'easy' },
    { id: "o4", question: "Chatty: What’s 'Gato' in English?", answer: "Cat", guide: "Chatty: Let’s explore languages! Click the card to flip.", category: "original", premium: false, difficulty: 'easy' },

    // Math Riddles
    { id: "m1", question: "Chatty: What is the center of gravity?", answer: "The letter V!", guide: "Chatty: Let’s solve a math riddle! Click the card to flip.", category: "math", premium: false, difficulty: 'medium' },
    { id: "m2", question: "Chatty: What month of the year has 28 days?", answer: "All of them", guide: "Chatty: Here’s a tricky time riddle! Click the card to flip.", category: "math", premium: false, difficulty: 'easy' },
    { id: "m3", question: "Chatty: What goes up but never comes down?", answer: "Your age", guide: "Chatty: Let’s grow with this riddle! Click the card to flip.", category: "math", premium: false, difficulty: 'easy' },
    { id: "m4", question: "Chatty: There’s a fine line between a numerator and a denominator.", answer: "(…Only a fraction of people will get this clean joke.)", guide: "Chatty: Let’s divide with this math joke! Click the card to flip.", category: "math", premium: false, difficulty: 'medium' },
    { id: "m5", question: "Chatty: What occurs once in a minute, twice in a moment, and never in 1,000 years?", answer: "The letter 'M'", guide: "Chatty: Let’s solve a letter riddle! Click the card to flip.", category: "math", premium: false, difficulty: 'medium' },
    { id: "m6", question: "Chatty: What do Alexander the Great and Kermit the Frog have in common?", answer: "The same middle name", guide: "Chatty: Let’s laugh with this wordplay joke! Click the card to flip.", category: "math", premium: false, difficulty: 'hard' }, // Example
    { id: "m7", question: "Chatty: If you multiply this number by any other number, the answer will always be the same. What number is this?", answer: "Zero", guide: "Chatty: Let’s solve a number riddle! Click the card to flip.", category: "math", premium: false, difficulty: 'easy' },
    { id: "m8", question: "Chatty: I am an odd number. Take away a letter and I become even. What number am I?", answer: "Seven (take away 'S' to become 'even')", guide: "Chatty: Let’s play with numbers and words! Click the card to flip.", category: "math", premium: false, difficulty: 'medium' },
    { id: "m9", question: "Chatty: A tree doubled in height each year until it reached its maximum height over the course of ten years. How many years did it take for the tree to reach half its maximum height?", answer: "Nine years", guide: "Chatty: Let’s solve a growth riddle! Click the card to flip.", category: "math", premium: false, difficulty: 'hard' }, // Example
    { id: "m10", question: "Chatty: I’m light as a feather, yet the strongest person can’t hold me for five minutes. What am I?", answer: "Breath (you can’t hold your breath for long)", guide: "Chatty: Let’s breathe through this riddle! Click the card to flip.", category: "math", premium: false, difficulty: 'medium' },
    { id: "m11", question: "Chatty: If there are three apples and you take away two, how many do you have?", answer: "Two (you took two)", guide: "Chatty: Let’s count with this riddle! Click the card to flip.", category: "math", premium: false, difficulty: 'easy' },
    { id: "m12", question: "Chatty: How many months of the year have 30 days?", answer: "11 (all except February)", guide: "Chatty: Let’s count the months! Click the card to flip.", category: "math", premium: false, difficulty: 'easy' },

    // ... (Add unique IDs and difficulty ratings to ALL other cards) ...
    // Example for another category:
    { id: "g1", question: "Bolt: What has a head and a tail but no body?", answer: "A coin", guide: "Bolt: Let’s solve a tricky riddle! Click the card to flip.", category: "general", premium: false, difficulty: 'easy' },
    { id: "g2", question: "Chatty: I sometimes run, but I cannot walk. What am I?", answer: "Your nose", guide: "Chatty: Let’s sniff out this riddle! Click the card to flip.", category: "general", premium: false, difficulty: 'easy' },
    { id: "g3", question: "Bolt: What has four fingers and a thumb but isn’t alive?", answer: "A glove", guide: "Bolt: Let’s solve a hand-y riddle! Click the card to flip.", category: "general", premium: false, difficulty: 'easy' },
    // ... and so on for all cards. Ensure IDs are unique (e.g., 'g4', 'g5', 'k1', 'a1', 'l1' etc.)

    // Make sure ALL cards below have unique IDs and difficulty added
    // General Riddles (continued)
    { id: "g4", question: "Chatty: What is full of holes but still holds water?", answer: "A sponge", guide: "Chatty: Let’s soak up this riddle! Click the card to flip.", category: "general", premium: false, difficulty: 'easy' },
    { id: "g5", question: "Bolt: There’s a one-story house in which everything is yellow...", answer: "There aren’t any—it’s a one-story house", guide: "Bolt: Let’s solve a colorful riddle! Click the card to flip.", category: "general", premium: false, difficulty: 'medium' },
    // ... Add IDs and difficulties to the rest...

    // Riddles for Kids
    { id: "k1", question: "Bolt: What state is surrounded by the most water?", answer: "Hawaii (this is really just a trick riddle)", guide: "Bolt: Let’s explore with this fun riddle! Click the card to flip.", category: "kids", premium: false, difficulty: 'easy' },
    { id: "k2", question: "Bolt: David's father had three sons: Snap, Crackle, and ?", answer: "David!", guide: "Bolt: Let’s solve a family riddle! Click the card to flip.", category: "kids", premium: false, difficulty: 'easy' },
    // ... Add IDs and difficulties to the rest...

    // Riddles for Adults (Marked as Premium)
    { id: "a1", question: "Chatty: I'm not a blanket, yet I cover the ground...", answer: "Snow", guide: "Chatty: Let’s solve a chilly riddle! Click the card to flip.", category: "adults", premium: true, difficulty: 'medium' },
    { id: "a2", question: "Chatty: I saw my math teacher with a piece of graph paper yesterday.", answer: "I think he must be plotting something", guide: "Chatty: Let’s laugh with this math teacher joke! Click the card to flip.", category: "adults", premium: true, difficulty: 'medium' },
    // ... Add IDs and difficulties to the rest...

    // Language Riddles (Marked as Premium)
    { id: "l1", question: "Chatty: I can be cracked or played; told or made. What am I?", answer: "A joke!", guide: "Chatty: Let’s play with words! Click the card to flip.", category: "language", premium: true, difficulty: 'easy' },
    { id: "l2", question: "Chatty: What has a neck but no head?", answer: "A bottle", guide: "Chatty: Here’s a tricky wordplay riddle! Click the card to flip.", category: "language", premium: true, difficulty: 'easy' },
    // ... Add IDs and difficulties to the rest...

    // Animal Riddles
    { id: "an1", question: "Bolt: I am a bird, I am a fruit, and I am a person. What am I?", answer: "A kiwi", guide: "Bolt: Let’s solve a fun animal riddle! Click the card to flip.", category: "animals", premium: false, difficulty: 'medium' },
    { id: "an2", question: "Bolt: What kind of dog has no tail?", answer: "A hot dog", guide: "Bolt: Here’s a silly animal riddle! Click the card to flip.", category: "animals", premium: false, difficulty: 'easy' },

    { id: "an4", question: "Bolt: What fruit never ever wants to be alone?", answer: "A pear", guide: "Bolt: Let's solve a fruity animal riddle! Click the card to flip.", category: "animals", premium: false, difficulty: 'easy' },
    { id: "an5", question: "Bolt: Although I may have eyes, I cannot see. I have a round brown face with lots of acne. What am I?", answer: "A potato", guide: "Bolt: Here's a tricky veggie riddle! Click the card to flip.", category: "animals", premium: false, difficulty: 'medium' },
    { id: "an6", question: "Bolt: What do you call a bear with no teeth?", answer: "A gummy bear!", guide: "Bolt: Here's a sweet animal joke! Click the card to flip.", category: "animals", premium: false, difficulty: 'easy' },
    { id: "an7", question: "Bolt: Why are spiders so smart?", answer: "They can find everything on the web!", guide: "Bolt: Let's laugh with a spider joke! Click the card to flip.", category: "animals", premium: false, difficulty: 'easy' },
    { id: "an8", question: "Bolt: What do you call a blind dinosaur?", answer: "A do-you-think-he-saw-us", guide: "Bolt: Here's a dino joke for you! Click the card to flip.", category: "animals", premium: false, difficulty: 'easy' },
    { id: "an9", question: "Bolt: What job did the frog have at the hotel?", answer: "Bellhop!", guide: "Bolt: Let's hop into this frog joke! Click the card to flip.", category: "animals", premium: false, difficulty: 'easy' },
    { id: "an10", question: "Bolt: Why do cows have hooves and not feet?", answer: "They lactose!", guide: "Bolt: Here's a moo-ving cow joke! Click the card to flip.", category: "animals", premium: false, difficulty: 'easy' },
    { id: "an11", question: "Bolt: Why do hummingbirds hum?", answer: "Because they don't know the words!", guide: "Bolt: Let's buzz with a bird joke! Click the card to flip.", category: "animals", premium: false, difficulty: 'easy' },
    { id: "an12", question: "Bolt: What animal is always at a baseball game?", answer: "A bat", guide: "Bolt: Here's a sporty animal riddle! Click the card to flip.", category: "animals", premium: false, difficulty: 'easy' },
    { id: "an13", question: "Bolt: What animal dresses up and howls?", answer: "A wearwolf", guide: "Bolt: Let's howl with this animal joke! Click the card to flip.", category: "animals", premium: false, difficulty: 'easy' },
    { id: "an14", question: "Bolt: Why did the dinosaur cross the road?", answer: "Because the chicken wasn't born yet", guide: "Bolt: Here's a prehistoric joke! Click the card to flip.", category: "animals", premium: false, difficulty: 'easy' },
    { id: "an15", question: "Bolt: What do you call a rabbit who tells jokes?", answer: "A funny bunny", guide: "Bolt: Let's hop into a rabbit joke! Click the card to flip.", category: "animals", premium: false, difficulty: 'easy' },
    { id: "an16", question: "Bolt: What is a rabbit's favorite dance?", answer: "The Bunny Hop", guide: "Bolt: Let's dance with this rabbit joke! Click the card to flip.", category: "animals", premium: false, difficulty: 'easy' },
    { id: "an17", question: "Bolt: What kind of jewelry do rabbits wear?", answer: "14 carrot gold", guide: "Bolt: Here's a shiny rabbit joke! Click the card to flip.", category: "animals", premium: false, difficulty: 'easy' },
    { id: "an18", question: "Bolt: What do you call a rabbit with fleas?", answer: "Bugs Bunny", guide: "Bolt: Let's laugh with a bunny joke! Click the card to flip.", category: "animals", premium: false, difficulty: 'easy' },
    { id: "an19", question: "Bolt: What is the difference between a cat that got photocopied and a cat that follows you?", answer: "One is a cat copy; the other is a copy cat", guide: "Bolt: Let's purr with this cat joke! Click the card to flip.", category: "animals", premium: false, difficulty: 'medium' },
    { id: "an20", question: "Bolt: What cat likes living in water?", answer: "An octo-puss", guide: "Bolt: Here's a splashy cat joke! Click the card to flip.", category: "animals", premium: false, difficulty: 'medium' },
    { id: "an21", question: "Bolt: What do you call a cat's favorite magazine?", answer: "A cat-alogue", guide: "Bolt: Let's read with this cat joke! Click the card to flip.", category: "animals", premium: false, difficulty: 'easy' },
    { id: "an22", question: "Bolt: Why didn't the skeleton go to school?", answer: "His heart wasn't in it", guide: "Bolt: Here's a spooky joke! Click the card to flip.", category: "animals", premium: false, difficulty: 'easy' },
    { id: "an23", question: "Bolt: What kind of dog does Dracula have?", answer: "A bloodhound", guide: "Bolt: Let's bark with this vampire joke! Click the card to flip.", category: "animals", premium: false, difficulty: 'easy' },
    { id: "an24", question: "Bolt: What fruit do scarecrows love the most?", answer: "Straw-berries", guide: "Bolt: Here's a fruity scarecrow joke! Click the card to flip.", category: "animals", premium: false, difficulty: 'easy' },
    { id: "an25", question: "Bolt: What kind of music do mummies love?", answer: "Wrap music", guide: "Bolt: Let's groove with this mummy joke! Click the card to flip.", category: "animals", premium: false, difficulty: 'easy' },
    { id: "an26", question: "Bolt: What monster plays tricks on Halloween?", answer: "Prank-enstein", guide: "Bolt: Here's a tricky monster joke! Click the card to flip.", category: "animals", premium: false, difficulty: 'easy' },
    { id: "an27", question: "Bolt: What do you get when you cross a ball and a cat?", answer: "A fur ball", guide: "Bolt: Let's roll with this cat joke! Click the card to flip.", category: "animals", premium: false, difficulty: 'easy' },
    { id: "an28", question: "Bolt: Why can't Elsa from Frozen have a balloon?", answer: "Because she will 'let it go, let it go'", guide: "Bolt: Here's a chilly joke! Click the card to flip.", category: "animals", premium: false, difficulty: 'easy' },
    { id: "an29", question: "Bolt: What is a monster's favorite dessert?", answer: "I scream", guide: "Bolt: Let's scream with this monster joke! Click the card to flip.", category: "animals", premium: false, difficulty: 'easy' },
    { id: "an30", question: "Bolt: What does a witch use to do her hair?", answer: "Scarespray", guide: "Bolt: Here's a witchy joke! Click the card to flip.", category: "animals", premium: false, difficulty: 'easy' },
    { id: "an31", question: "Bolt: What room does a ghost not need?", answer: "A living room", guide: "Bolt: Let's haunt with this ghost joke! Click the card to flip.", category: "animals", premium: false, difficulty: 'easy' },
    { id: "an32", question: "Bolt: How does a vampire start a letter?", answer: "Tomb it may concern...", guide: "Bolt: Here's a fang-tastic joke! Click the card to flip.", category: "animals", premium: false, difficulty: 'medium' },
    { id: "an33", question: "Bolt: Which bear is the most condescending?", answer: "A pan-duh!", guide: "Bolt: Let's laugh with this bear joke! Click the card to flip.", category: "animals", premium: false, difficulty: 'medium' },
    { id: "an34", question: "Bolt: Why did the teacher have a sack full of birdseed?", answer: "For her parrot-teacher conferences", guide: "Bolt: Let's laugh with this school joke! Click the card to flip.", category: "animals", premium: false, difficulty: 'medium' },
    { id: "an35", question: "Bolt: What has four legs and one arm?", answer: "A pitbull coming back from the park!", guide: "Bolt: Let's fetch with this dog riddle! Click the card to flip.", category: "animals", premium: false, difficulty: 'medium' },
    { id: "an36", question: "Bolt: I have branches, but no fruit, trunk, or leaves. What am I?", answer: "A bank", guide: "Bolt: Let's branch out with this riddle! Click the card to flip.", category: "animals", premium: false, difficulty: 'medium' },
    { id: "an37", question: "Bolt: What can't talk but will reply when spoken to?", answer: "An echo", guide: "Bolt: Let's echo with this riddle! Click the card to flip.", category: "animals", premium: false, difficulty: 'easy' },
    { id: "an38", question: "Bolt: What has many keys but can't open a single lock?", answer: "A piano", guide: "Bolt: Let's play with this riddle! Click the card to flip.", category: "animals", premium: false, difficulty: 'easy' },
    { id: "an39", question: "Bolt: What can you hold in your left hand but not in your right?", answer: "Your right elbow", guide: "Bolt: Let's twist with this riddle! Click the card to flip.", category: "animals", premium: false, difficulty: 'medium' },
    { id: "an40", question: "Bolt: What is black when it's clean and white when it's dirty?", answer: "A chalkboard", guide: "Bolt: Let's draw with this riddle! Click the card to flip.", category: "animals", premium: false, difficulty: 'medium' },
    { id: "an41", question: "Bolt: What animal barks?", answer: "Dog", guide: "Bolt: Let's learn about animals! Click the card to flip.", category: "animals", premium: false, difficulty: 'easy' },
    { id: "an42", question: "Bolt: What animal says 'meow'?", answer: "Cat", guide: "Bolt: Let's learn about animals! Click the card to flip.", category: "animals", premium: false, difficulty: 'easy' },

    // Dynamic Content Placeholder
    { id: "d1", question: "Loading dynamic riddle...", answer: "", guide: "Bolt says: Wait for it!", category: "dynamic", premium: true, difficulty: 'easy' }
];

