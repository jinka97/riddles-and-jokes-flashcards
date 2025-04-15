const allFlashcards = [
    // Original Cards
    //{ question: "Bolt: What animal barks?", answer: "Dog", guide: "Bolt: Let’s learn about animals! Click the card to flip.", category: "original" },
    //{ question: "Bolt: What animal says 'meow'?", answer: "Cat", guide: "Bolt: Let’s learn about animals! Click the card to flip.", category: "original" },
    //{ question: "Chatty: What’s 'Hola' in English?", answer: "Hello", guide: "Chatty: Let’s explore languages! Click the card to flip.", category: "original" },
    //{ question: "Chatty: What’s 'Gato' in English?", answer: "Cat", guide: "Chatty: Let’s explore languages! Click the card to flip.", category: "original" },

    // Math Riddles
    { question: "Chatty: What is the center of gravity?", answer: "The letter V!", guide: "Chatty: Let’s solve a math riddle! Click the card to flip.", category: "math" },
    { question: "Chatty: What month of the year has 28 days?", answer: "All of them", guide: "Chatty: Here’s a tricky time riddle! Click the card to flip.", category: "math" },
    { question: "Chatty: What goes up but never comes down?", answer: "Your age", guide: "Chatty: Let’s grow with this riddle! Click the card to flip.", category: "math" },
    { question: "Chatty: There’s a fine line between a numerator and a denominator.", answer: "(…Only a fraction of people will get this clean joke.)", guide: "Chatty: Let’s divide with this math joke! Click the card to flip.", category: "math" },
    { question: "Chatty: What occurs once in a minute, twice in a moment, and never in 1,000 years?", answer: "The letter 'M'", guide: "Chatty: Let’s solve a letter riddle! Click the card to flip.", category: "math" },
    { question: "Chatty: What do Alexander the Great and Kermit the Frog have in common?", answer: "The same middle name", guide: "Chatty: Let’s laugh with this wordplay joke! Click the card to flip.", category: "math" },
    { question: "Chatty: If you multiply this number by any other number, the answer will always be the same. What number is this?", answer: "Zero", guide: "Chatty: Let’s solve a number riddle! Click the card to flip.", category: "math" },
    { question: "Chatty: I am an odd number. Take away a letter and I become even. What number am I?", answer: "Seven (take away 'S' to become 'even')", guide: "Chatty: Let’s play with numbers and words! Click the card to flip.", category: "math" },
    { question: "Chatty: A tree doubled in height each year until it reached its maximum height over the course of ten years. How many years did it take for the tree to reach half its maximum height?", answer: "Nine years", guide: "Chatty: Let’s solve a growth riddle! Click the card to flip.", category: "math" },
    { question: "Chatty: I’m light as a feather, yet the strongest person can’t hold me for five minutes. What am I?", answer: "Breath (you can’t hold your breath for long)", guide: "Chatty: Let’s breathe through this riddle! Click the card to flip.", category: "math" },
    { question: "Chatty: If there are three apples and you take away two, how many do you have?", answer: "Two (you took two)", guide: "Chatty: Let’s count with this riddle! Click the card to flip.", category: "math" },
    { question: "Chatty: How many months of the year have 30 days?", answer: "11 (all except February)", guide: "Chatty: Let’s count the months! Click the card to flip.", category: "math" },

    // General Riddles
    { question: "Bolt: What has a head and a tail but no body?", answer: "A coin", guide: "Bolt: Let’s solve a tricky riddle! Click the card to flip.", category: "general" },
    { question: "Chatty: I sometimes run, but I cannot walk. What am I?", answer: "Your nose", guide: "Chatty: Let’s sniff out this riddle! Click the card to flip.", category: "general" },
    { question: "Bolt: What has four fingers and a thumb but isn’t alive?", answer: "A glove", guide: "Bolt: Let’s solve a hand-y riddle! Click the card to flip.", category: "general" },
    { question: "Chatty: What is full of holes but still holds water?", answer: "A sponge", guide: "Chatty: Let’s soak up this riddle! Click the card to flip.", category: "general" },
    { question: "Bolt: There’s a one-story house in which everything is yellow. Yellow walls, yellow doors, yellow furniture. What color are the stairs?", answer: "There aren’t any—it’s a one-story house", guide: "Bolt: Let’s solve a colorful riddle! Click the card to flip.", category: "general" },
    { question: "Chatty: A man who was outside in the rain without an umbrella or hat didn’t get a single hair on his head wet. Why?", answer: "He was bald", guide: "Chatty: Let’s solve a rainy riddle! Click the card to flip.", category: "general" },
    { question: "Bolt: I shave every day, but my beard stays the same. Why?", answer: "I’m a barber", guide: "Bolt: Let’s solve a hairy riddle! Click the card to flip.", category: "general" },
    { question: "Chatty: I have lakes with no water, mountains with no stone, and cities with no buildings. What am I?", answer: "A map", guide: "Chatty: Let’s explore this riddle! Click the card to flip.", category: "general" },
    { question: "Bolt: What does man love more than life, hate more than death; the poor have, the rich require; the miser spends, the spendthrift saves, and all men carry to their graves?", answer: "Nothing", guide: "Bolt: Let’s solve a deep riddle! Click the card to flip.", category: "general" },
    { question: "Chatty: What do you think of that new diner on the moon?", answer: "Food was good, but there really wasn’t much atmosphere", guide: "Chatty: Let’s dine with this space joke! Click the card to flip.", category: "general" },
    { question: "Bolt: When does a joke become a 'dad joke'?", answer: "When it becomes apparent", guide: "Bolt: Let’s laugh with this dad joke! Click the card to flip.", category: "general" },
    { question: "Chatty: I used to hate facial hair, but then it grew on me.", answer: "(No answer needed—joke format.)", guide: "Chatty: Let’s laugh with this hair joke! Click the card to flip.", category: "general" },
    { question: "Bolt: I want to make a brief joke, but it’s a little cheesy.", answer: "(No answer needed—joke format.)", guide: "Bolt: Let’s laugh with this cheesy joke! Click the card to flip.", category: "general" },
    { question: "Chatty: Why did the coach go to the bank?", answer: "To get his quarterback", guide: "Chatty: Let’s play with this sports joke! Click the card to flip.", category: "general" },
    { question: "Bolt: How do celebrities stay cool?", answer: "They have many fans", guide: "Bolt: Let’s laugh with this star joke! Click the card to flip.", category: "general" },
    { question: "Chatty: Sundays are always a little sad, but the day before is a sadder day.", answer: "(No answer needed—joke format.)", guide: "Chatty: Let’s laugh with this day joke! Click the card to flip.", category: "general" },
    { question: "Bolt: Why did the bedding hide their relationship?", answer: "They just wanted something pillow-key!", guide: "Bolt: Let’s laugh with this cozy joke! Click the card to flip.", category: "general" },
    { question: "Chatty: You’re American when you go into a bathroom and when you come out, but what are you while you’re in the bathroom?", answer: "European", guide: "Chatty: Let’s travel with this joke! Click the card to flip.", category: "general" },
    { question: "Bolt: Which state has the most streets?", answer: "Rhode Island", guide: "Bolt: Let’s travel with this riddle! Click the card to flip.", category: "general" },
    { question: "Chatty: What do you call a naughty lamb dressed up like a skeleton for Halloween?", answer: "Baa-ffling!", guide: "Chatty: Let’s spook with this joke! Click the card to flip.", category: "general" },
    { question: "Bolt: How many chocolate bunnies can you put into an empty Easter basket?", answer: "Only one because after that, it’s not empty", guide: "Bolt: Let’s hop into this Easter riddle! Click the card to flip.", category: "general" },
    { question: "Chatty: What musical instrument is found in the bathroom?", answer: "A tuba toothpaste", guide: "Chatty: Let’s play with this bath joke! Click the card to flip.", category: "general" },
    { question: "Bolt: What has 10 letters and starts with gas?", answer: "Automobile", guide: "Bolt: Let’s drive with this riddle! Click the card to flip.", category: "general" },
    { question: "Chatty: What tastes better than it smells?", answer: "Your tongue", guide: "Chatty: Let’s taste this riddle! Click the card to flip.", category: "general" },
    { question: "Chatty: The more of this there is, the less you see. What is it?", answer: "Darkness", guide: "Chatty: Let’s explore this shadowy riddle! Click the card to flip.", category: "general" },
    { question: "Bolt: What has one head, one foot, and four legs?", answer: "A bed", guide: "Bolt: Let’s solve a tricky riddle! Click the card to flip.", category: "general" },
    { question: "Chatty: Did you hear the joke about the roof?", answer: "Never mind, it’s over your head!", guide: "Chatty: Let’s laugh with this riddle! Click the card to flip.", category: "general" },
    { question: "Bolt: If you were in a race and passed the person in 2nd place, what place would you be in?", answer: "2nd place!", guide: "Bolt: Let’s race with this riddle! Click the card to flip.", category: "general" },
    { question: "Chatty: What has a head, a tail, is brown, and has no legs?", answer: "A penny!", guide: "Chatty: Let’s solve a coin riddle! Click the card to flip.", category: "general" },
    { question: "Bolt: You see a boat filled with people, yet there isn’t a single person on board. How is that possible?", answer: "All the people on the boat are married", guide: "Bolt: Let’s solve a tricky boat riddle! Click the card to flip.", category: "general" },
    { question: "Chatty: You walk into a room that contains a match, a kerosene lamp, a candle, and a fireplace. What would you light first?", answer: "The match", guide: "Chatty: Let’s light up this riddle! Click the card to flip.", category: "general" },
    { question: "Bolt: A man dies of old age on his 25th birthday. How is this possible?", answer: "He was born on February 29th (leap year)", guide: "Bolt: Let’s solve a birthday riddle! Click the card to flip.", category: "general" },
    { question: "Chatty: What gets bigger when more is taken away?", answer: "A hole", guide: "Chatty: Let’s dig into this riddle! Click the card to flip.", category: "general" },

    // Riddles for Kids
    { question: "Bolt: What state is surrounded by the most water?", answer: "Hawaii (this is really just a trick riddle)", guide: "Bolt: Let’s explore with this fun riddle! Click the card to flip.", category: "kids" },
    { question: "Bolt: David's father had three sons: Snap, Crackle, and ?", answer: "David!", guide: "Bolt: Let’s solve a family riddle! Click the card to flip.", category: "kids" },
    { question: "Bolt: Why did the Easter egg hide?", answer: "He was a little chicken", guide: "Bolt: Here’s an egg-citing joke for kids! Click the card to flip.", category: "kids" },
    { question: "Bolt: How many chocolate bunnies can you put into an empty Easter basket?", answer: "Only one because after that, it’s not empty", guide: "Bolt: Let’s hop into this Easter riddle! Click the card to flip.", category: "kids" },
    { question: "Bolt: What has hands but can’t clap?", answer: "A clock", guide: "Bolt: Let’s tick-tock with this riddle! Click the card to flip.", category: "kids" },
    { question: "Bolt: What has a neck but no head, a body but no legs, and arms but no hands?", answer: "A shirt", guide: "Bolt: Let’s dress up with this riddle! Click the card to flip.", category: "kids" },
    { question: "Bolt: What has one eye but can’t see?", answer: "A needle", guide: "Bolt: Let’s sew with this riddle! Click the card to flip.", category: "kids" },
    { question: "Bolt: What has many teeth but cannot bite?", answer: "A comb", guide: "Bolt: Let’s comb through this riddle! Click the card to flip.", category: "kids" },
    { question: "Bolt: What has cities but no houses, forests but no trees, and rivers but no water?", answer: "A map", guide: "Bolt: Let’s explore with this riddle! Click the card to flip.", category: "kids" },
    { question: "Bolt: What goes in a birdbath, but never gets wet?", answer: "A bird’s shadow", guide: "Bolt: Let’s splash with this riddle! Click the card to flip.", category: "kids" },

    // Riddles for Adults
    { question: "Chatty: I'moggle I'm not a blanket, yet I cover the ground; a crystal from heaven that doesn't make a sound.", answer: "Snow", guide: "Chatty: Let’s solve a chilly riddle! Click the card to flip.", category: "adults" },
    { question: "Chatty: I saw my math teacher with a piece of graph paper yesterday.", answer: "I think he must be plotting something", guide: "Chatty: Let’s laugh with this math teacher joke! Click the card to flip.", category: "adults" },
    { question: "Chatty: Every night I’m told what to do, and each morning I do what I’m told. But I still don’t escape your scold. What am I?", answer: "An alarm clock", guide: "Chatty: Let’s wake up with this riddle! Click the card to flip.", category: "adults" },
    { question: "Chatty: What do the letter 'T' and an island have in common?", answer: "They're both in the middle of water", guide: "Chatty: Let’s swim with this riddle! Click the card to flip.", category: "adults" },
    { question: "Chatty: Which word in the dictionary is spelled incorrectly?", answer: "Incorrectly", guide: "Chatty: Let’s spell out this riddle! Click the card to flip.", category: "adults" },
    { question: "Chatty: I can be bitter or sweet, but I'm always a treat; in a bar or a cake, I’m something to eat. What am I?", answer: "Chocolate", guide: "Chatty: Let’s taste this riddle! Click the card to flip.", category: "adults" },
    { question: "Chatty: I can be yellow or blue, soft or hard; on a burger or mac, I’m often starred. What am I?", answer: "Cheese", guide: "Chatty: Let’s melt with this riddle! Click the card to flip.", category: "adults" },

    // Language Riddles
    { question: "Chatty: I can be cracked or played; told or made. What am I?", answer: "A joke!", guide: "Chatty: Let’s play with words! Click the card to flip.", category: "language" },
    { question: "Chatty: What has a neck but no head?", answer: "A bottle", guide: "Chatty: Here’s a tricky wordplay riddle! Click the card to flip.", category: "language" },
    { question: "Chatty: What has no beginning, end, or middle?", answer: "A doughnut", guide: "Chatty: Let’s solve a tasty riddle! Click the card to flip.", category: "language" },
    { question: "Chatty: What kind of car does an egg drive?", answer: "A yolkswagen!", guide: "Chatty: Here’s an egg-citing wordplay joke! Click the card to flip.", category: "language" },
    { question: "Chatty: What kind of tea is hard to swallow?", answer: "Reality!", guide: "Chatty: Let’s sip on this wordplay joke! Click the card to flip.", category: "language" },
    { question: "Chatty: Why wouldn’t the shrimp share his treasure?", answer: "He was a little shellfish!", guide: "Chatty: Here’s a fishy wordplay joke! Click the card to flip.", category: "language" },
    { question: "Chatty: What did one plate say to the other?", answer: "Dinner is on me!", guide: "Chatty: Let’s dine with this wordplay joke! Click the card to flip.", category: "language" },
    { question: "Chatty: What gets wet while drying?", answer: "A towel", guide: "Chatty: Let’s explore a clever riddle! Click the card to flip.", category: "language" },
    { question: "Chatty: What can you keep after giving to someone?", answer: "Your word", guide: "Chatty: Let’s explore a language riddle! Click the card to flip.", category: "language" },
    { question: "Chatty: What has to be broken before you can use it?", answer: "An egg", guide: "Chatty: Let’s crack this riddle! Click the card to flip.", category: "language" },
    { question: "Chatty: I’m tall when I’m young, and I’m short when I’m old. What am I?", answer: "A candle", guide: "Chatty: Let’s solve a clever riddle! Click the card to flip.", category: "language" },
    { question: "Chatty: What question can you never answer yes to?", answer: "Are you asleep yet?", guide: "Chatty: Here’s a sleepy riddle! Click the card to flip.", category: "language" },
    { question: "Chatty: What is always in front of you but can’t be seen?", answer: "The future", guide: "Chatty: Let’s look ahead with this riddle! Click the card to flip.", category: "language" },
    { question: "Chatty: What can you break, even if you never pick it up or touch it?", answer: "A promise", guide: "Chatty: Let’s explore a word riddle! Click the card to flip.", category: "language" },
    { question: "Chatty: Why did the God of Thunder need to stretch his leg muscles so much as a kid?", answer: "He was a little Thor", guide: "Chatty: Here’s a mythic wordplay joke! Click the card to flip.", category: "language" },
    { question: "Chatty: What’s the largest gem on earth?", answer: "A baseball diamond!", guide: "Chatty: Here’s a sporty wordplay riddle! Click the card to flip.", category: "language" },
    { question: "Chatty: What do you get if you dip a baby cat in chocolate?", answer: "A Kitty-Kat Bar!", guide: "Chatty: Let’s sweeten things with this wordplay joke! Click the card to flip.", category: "language" },
    { question: "Chatty: Did you hear about the first restaurant to open on the moon?", answer: "It had great food, but no atmosphere", guide: "Chatty: Let’s dine with this space joke! Click the card to flip.", category: "language" },
    { question: "Chatty: Why is Peter Pan always flying?", answer: "Because he Neverlands", guide: "Chatty: Here’s a magical wordplay joke! Click the card to flip.", category: "language" },
    { question: "Chatty: You heard the rumor going around about butter?", answer: "Never mind, I shouldn’t spread it", guide: "Chatty: Let’s spread some fun with this joke! Click the card to flip.", category: "language" },
    { question: "Chatty: I don’t know, but the flag is a big plus. (What do you think about Switzerland?)", answer: "(No answer needed—joke format.)", guide: "Chatty: Let’s travel with this wordplay joke! Click the card to flip.", category: "language" },
    { question: "Chatty: What do you call it when a group of apes starts a company?", answer: "Monkey business", guide: "Chatty: Here’s a business wordplay joke! Click the card to flip.", category: "language" },
    { question: "Chatty: What did the police officer say to his belly-button?", answer: "You’re under a vest", guide: "Chatty: Let’s laugh with this wordplay joke! Click the card to flip.", category: "language" },
    { question: "Chatty: What kind of noise does a witch’s vehicle make?", answer: "Brrrroooom, brrroooom", guide: "Chatty: Here’s a witchy wordplay joke! Click the card to flip.", category: "language" },
    { question: "Chatty: What kind of drink can be bitter and sweet?", answer: "Reali-tea", guide: "Chatty: Let’s sip on this wordplay joke! Click the card to flip.", category: "language" },
    { question: "Chatty: What do you call a pudgy psychic?", answer: "A four-chin teller", guide: "Chatty: Here’s a fortune-telling wordplay joke! Click the card to flip.", category: "language" },
    { question: "Chatty: Why are elevator jokes so classic and good?", answer: "They work on many levels", guide: "Chatty: Let’s rise with this wordplay joke! Click the card to flip.", category: "language" },
    { question: "Chatty: How do you get a country girl’s attention?", answer: "A tractor", guide: "Chatty: Here’s a country wordplay joke! Click the card to flip.", category: "language" },
    { question: "Chatty: What’s brown and sticky?", answer: "A stick", guide: "Chatty: Let’s stick with this wordplay joke! Click the card to flip.", category: "language" },
    { question: "Chatty: My wife asked me to stop singing 'Wonderwall' to her.", answer: "I said maybe...", guide: "Chatty: Let’s sing with this wordplay joke! Click the card to flip.", category: "language" },
    { question: "Chatty: Two guys walked into a bar.", answer: "The third guy ducked", guide: "Chatty: Let’s laugh with this wordplay joke! Click the card to flip.", category: "language" },
    { question: "Chatty: How many tickles does it take to get an octopus to laugh?", answer: "Ten tickles", guide: "Chatty: Let’s tickle with this wordplay joke! Click the card to flip.", category: "language" },
    { question: "Chatty: You know, it was so cold in D.C. the other day, I saw a politician with his hands in his own pockets.", answer: "(No answer needed—joke format.)", guide: "Chatty: Let’s warm up with this joke! Click the card to flip.", category: "language" },
    { question: "Chatty: What do you call 26 letters that went for a swim?", answer: "Alphawetical", guide: "Chatty: Let’s swim with this wordplay joke! Click the card to flip.", category: "language" },
    { question: "Chatty: What’s the name of a very polite, European body of water?", answer: "Merci", guide: "Chatty: Let’s travel with this wordplay joke! Click the card to flip.", category: "language" },
    { question: "Chatty: Why was the color green notoriously single?", answer: "It was always so jaded", guide: "Chatty: Let’s color with this wordplay joke! Click the card to flip.", category: "language" },
    { question: "Chatty: How can you tell if an ant is a boy or a girl?", answer: "They’re all girls! If they were boys, they’d be uncles", guide: "Chatty: Let’s laugh with this ant joke! Click the card to flip.", category: "language" },
    { question: "Chatty: How many letters are in 'The Alphabet'?", answer: "There are 11 letters in 'The Alphabet'", guide: "Chatty: Let’s count letters with this riddle! Click the card to flip.", category: "language" },
    { question: "Chatty: How can you spell 'cold' with two letters?", answer: "IC (icy)", guide: "Chatty: Let’s chill with this wordplay riddle! Click the card to flip.", category: "language" },
    { question: "Chatty: What English word has three consecutive double letters?", answer: "Bookkeeper", guide: "Chatty: Let’s spell with this riddle! Click the card to flip.", category: "language" },
    { question: "Chatty: The turtle took two chocolates to Texas to teach Thomas to tie his boots. How many T's in that?", answer: "There are 2 T's in THAT!", guide: "Chatty: Let’s count with this riddle! Click the card to flip.", category: "language" },
    { question: "Chatty: What has words but never speaks?", answer: "A book", guide: "Chatty: Let’s read with this riddle! Click the card to flip.", category: "language" },
    { question: "Chatty: What begins with T, ends with T, and has T in it?", answer: "A teapot", guide: "Chatty: Let’s brew with this riddle! Click the card to flip.", category: "language" },
    // from original card: 
    { question: "Chatty: What’s 'Hola' in English?", answer: "Hello", guide: "Chatty: Let’s explore languages! Click the card to flip.", category: "language" },
    { question: "Chatty: What’s 'Gato' in English?", answer: "Cat", guide: "Chatty: Let’s explore languages! Click the card to flip.", category: "language" },
    

    // Animal Riddles
    { question: "Bolt: I am a bird, I am a fruit, and I am a person. What am I?", answer: "A kiwi", guide: "Bolt: Let’s solve a fun animal riddle! Click the card to flip.", category: "animals" },
    { question: "Bolt: What kind of dog has no tail?", answer: "A hot dog", guide: "Bolt: Here’s a silly animal riddle! Click the card to flip.", category: "animals" },
    { question: "Bolt: What fruit never ever wants to be alone?", answer: "A pear", guide: "Bolt: Let’s solve a fruity animal riddle! Click the card to flip.", category: "animals" },
    { question: "Bolt: Although I may have eyes, I cannot see. I have a round brown face with lots of acne. What am I?", answer: "A potato", guide: "Bolt: Here’s a tricky veggie riddle! Click the card to flip.", category: "animals" },
    { question: "Bolt: What do you call a bear with no teeth?", answer: "A gummy bear!", guide: "Bolt: Here’s a sweet animal joke! Click the card to flip.", category: "animals" },
    { question: "Bolt: Why are spiders so smart?", answer: "They can find everything on the web!", guide: "Bolt: Let’s laugh with a spider joke! Click the card to flip.", category: "animals" },
    { question: "Bolt: What do you call a blind dinosaur?", answer: "A do-you-think-he-saw-us", guide: "Bolt: Here’s a dino joke for you! Click the card to flip.", category: "animals" },
    { question: "Bolt: What job did the frog have at the hotel?", answer: "Bellhop!", guide: "Bolt: Let’s hop into this frog joke! Click the card to flip.", category: "animals" },
    { question: "Bolt: Why do cows have hooves and not feet?", answer: "They lactose!", guide: "Bolt: Here’s a moo-ving cow joke! Click the card to flip.", category: "animals" },
    { question: "Bolt: Why do hummingbirds hum?", answer: "Because they don’t know the words!", guide: "Bolt: Let’s buzz with a bird joke! Click the card to flip.", category: "animals" },
    { question: "Bolt: What animal is always at a baseball game?", answer: "A bat", guide: "Bolt: Here’s a sporty animal riddle! Click the card to flip.", category: "animals" },
    { question: "Bolt: What animal dresses up and howls?", answer: "A wearwolf", guide: "Bolt: Let’s howl with this animal joke! Click the card to flip.", category: "animals" },
    { question: "Bolt: Why did the dinosaur cross the road?", answer: "Because the chicken wasn’t born yet", guide: "Bolt: Here’s a prehistoric joke! Click the card to flip.", category: "animals" },
    { question: "Bolt: What do you call a rabbit who tells jokes?", answer: "A funny bunny", guide: "Bolt: Let’s hop into a rabbit joke! Click the card to flip.", category: "animals" },
    { question: "Bolt: What is a rabbit’s favorite dance?", answer: "The Bunny Hop", guide: "Bolt: Let’s dance with this rabbit joke! Click the card to flip.", category: "animals" },
    { question: "Bolt: What kind of jewelry do rabbits wear?", answer: "14 carrot gold", guide: "Bolt: Here’s a shiny rabbit joke! Click the card to flip.", category: "animals" },
    { question: "Bolt: What do you call a rabbit with fleas?", answer: "Bugs Bunny", guide: "Bolt: Let’s laugh with a bunny joke! Click the card to flip.", category: "animals" },
    { question: "Bolt: What is the difference between a cat that got photocopied and a cat that follows you?", answer: "One is a cat copy; the other is a copy cat", guide: "Bolt: Let’s purr with this cat joke! Click the card to flip.", category: "animals" },
    { question: "Bolt: What cat likes living in water?", answer: "An octo-puss", guide: "Bolt: Here’s a splashy cat joke! Click the card to flip.", category: "animals" },
    { question: "Bolt: What do you call a cat’s favorite magazine?", answer: "A cat-alogue", guide: "Bolt: Let’s read with this cat joke! Click the card to flip.", category: "animals" },
    { question: "Bolt: Why didn’t the skeleton go to school?", answer: "His heart wasn’t in it", guide: "Bolt: Here’s a spooky joke! Click the card to flip.", category: "animals" },
    { question: "Bolt: What kind of dog does Dracula have?", answer: "A bloodhound", guide: "Bolt: Let’s bark with this vampire joke! Click the card to flip.", category: "animals" },
    { question: "Bolt: What fruit do scarecrows love the most?", answer: "Straw-berries", guide: "Bolt: Here’s a fruity scarecrow joke! Click the card to flip.", category: "animals" },
    { question: "Bolt: What kind of music do mummies love?", answer: "Wrap music", guide: "Bolt: Let’s groove with this mummy joke! Click the card to flip.", category: "animals" },
    { question: "Bolt: What monster plays tricks on Halloween?", answer: "Prank-enstein", guide: "Bolt: Here’s a tricky monster joke! Click the card to flip.", category: "animals" },
    { question: "Bolt: What do you get when you cross a ball and a cat?", answer: "A fur ball", guide: "Bolt: Let’s roll with this cat joke! Click the card to flip.", category: "animals" },
    { question: "Bolt: Why can’t Elsa from Frozen have a balloon?", answer: "Because she will 'let it go, let it go'", guide: "Bolt: Here’s a chilly joke! Click the card to flip.", category: "animals" },
    { question: "Bolt: What is a monster’s favorite dessert?", answer: "I scream", guide: "Bolt: Let’s scream with this monster joke! Click the card to flip.", category: "animals" },
    { question: "Bolt: What does a witch use to do her hair?", answer: "Scarespray", guide: "Bolt: Here’s a witchy joke! Click the card to flip.", category: "animals" },
    { question: "Bolt: What room does a ghost not need?", answer: "A living room", guide: "Bolt: Let’s haunt with this ghost joke! Click the card to flip.", category: "animals" },
    { question: "Bolt: How does a vampire start a letter?", answer: "Tomb it may concern...", guide: "Bolt: Here’s a fang-tastic joke! Click the card to flip.", category: "animals" },
    { question: "Bolt: Which bear is the most condescending?", answer: "A pan-duh!", guide: "Bolt: Let’s laugh with this bear joke! Click the card to flip.", category: "animals" },
    { question: "Bolt: Why did the teacher have a sack full of birdseed?", answer: "For her parrot-teacher conferences", guide: "Bolt: Let’s laugh with this school joke! Click the card to flip.", category: "animals" },
    { question: "Bolt: What has four legs and one arm?", answer: "A pitbull coming back from the park!", guide: "Bolt: Let’s fetch with this dog riddle! Click the card to flip.", category: "animals" },
    { question: "Bolt: I have branches, but no fruit, trunk, or leaves. What am I?", answer: "A bank", guide: "Bolt: Let’s branch out with this riddle! Click the card to flip.", category: "animals" },
    { question: "Bolt: What can’t talk but will reply when spoken to?", answer: "An echo", guide: "Bolt: Let’s echo with this riddle! Click the card to flip.", category: "animals" },
    { question: "Bolt: What has many keys but can’t open a single lock?", answer: "A piano", guide: "Bolt: Let’s play with this riddle! Click the card to flip.", category: "animals" },
    { question: "Bolt: What can you hold in your left hand but not in your right?", answer: "Your right elbow", guide: "Bolt: Let’s twist with this riddle! Click the card to flip.", category: "animals" },
    { question: "Bolt: What is black when it’s clean and white when it’s dirty?", answer: "A chalkboard", guide: "Bolt: Let’s draw with this riddle! Click the card to flip.", category: "animals" },
    
    // from original card: 
    { question: "Bolt: What animal barks?", answer: "Dog", guide: "Bolt: Let’s learn about animals! Click the card to flip.", category: "animals" },
    { question: "Bolt: What animal says 'meow'?", answer: "Cat", guide: "Bolt: Let’s learn about animals! Click the card to flip.", category: "animals" },
];

let flashcards = [...allFlashcards];
let currentCard = 0;
let isFlipped = false;

const flashcard = document.getElementById("flashcard");
const cardQuestion = document.getElementById("card-question");
const cardAnswer = document.getElementById("card-answer");
const guideText = document.getElementById("guide-text");
const progressText = document.getElementById("progress-text");
const boltImage = document.getElementById("bolt-image");
const chattyImage = document.getElementById("chatty-image");
const boltSound = document.getElementById("bolt-sound");
const chattySound = document.getElementById("chatty-sound");

// Load the current card and update progress
function loadCard() {
    const card = flashcards[currentCard];
    cardQuestion.textContent = card.question;
    cardAnswer.textContent = card.answer;
    guideText.textContent = card.guide;
    progressText.textContent = `Card ${currentCard + 1} of ${flashcards.length}`;
    
    // Toggle Bolt/Chatty images based on the guide
    if (card.guide.includes("Bolt")) {
        boltImage.style.display = "block";
        chattyImage.style.display = "none";
    } else {
        boltImage.style.display = "none";
        chattyImage.style.display = "block";
    }

    flashcard.classList.remove("flipped");
    isFlipped = false;

    // Check if this is the last card in the category to trigger confetti
    if (currentCard + 1 === flashcards.length) {
        triggerConfetti();
    }
}

// Flip the card on click or Enter key and play sound
flashcard.addEventListener("click", () => {
    flipCard();
});

flashcard.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        flipCard();
    }
});

function flipCard() {
    flashcard.classList.toggle("flipped");
    isFlipped = !isFlipped;

    // Play sound based on the guide
    const card = flashcards[currentCard];
    if (card.guide.includes("Bolt")) {
        boltSound.play();
    } else {
        chattySound.play();
    }
}

// Navigate to the next card
function nextCard() {
    currentCard = (currentCard + 1) % flashcards.length;
    loadCard();
}

// Navigate to the previous card
function prevCard() {
    currentCard = (currentCard - 1 + flashcards.length) % flashcards.length;
    loadCard();
}

// Shuffle cards
function shuffleCards() {
    for (let i = flashcards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [flashcards[i], flashcards[j]] = [flashcards[j], flashcards[i]];
    }
    currentCard = 0;
    loadCard();
}

// Filter cards by category
function filterCards() {
    const category = document.getElementById("category").value;
    if (category === "all") {
        flashcards = [...allFlashcards];
    } else {
        flashcards = allFlashcards.filter(card => card.category === category);
    }
    currentCard = 0;
    if (flashcards.length > 0) {
        loadCard();
    } else {
        cardQuestion.textContent = "No cards in this category.";
        cardAnswer.textContent = "";
        guideText.textContent = "Choose another category!";
        progressText.textContent = "No cards available";
        boltImage.style.display = "none";
        chattyImage.style.display = "none";
    }
}

// Toggle dark mode
function toggleTheme() {
    document.body.classList.toggle("dark-mode");
}

// Trigger confetti animation when completing a category
function triggerConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}

// Load the initial card
loadCard();
