package com.wondersprout.catalog;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.IntStream;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class GameCatalogService {
    public static final List<String> AGE_BANDS = List.of("3-5", "6-8", "9-12");
    private static final List<String> AGE_6_12 = List.of("6-8", "9-12");
    private static final List<String> AGE_9_12 = List.of("9-12");
    private static final int QUESTIONS_PER_ROUND = 5;

    private final List<Game> games = List.of(
            new Game("number-garden", "Number Garden", "Math magic", "quiz",
                    "Count, spot patterns, and grow your number power.", "🌼", "sunshine", 3, AGE_BANDS),
            new Game("bubble-pop", "Bubble Pop", "Math magic", "bubble",
                    "Pop the right answer and keep the number bubbles bouncing.", "🫧", "sky", 3, AGE_BANDS),
            new Game("word-safari", "Word Safari", "Word adventures", "quiz",
                    "Follow clues, meet new words, and become a word explorer.", "🦊", "berry", 3, AGE_BANDS),
            new Game("word-builder", "Word Builder", "Word adventures", "spell",
                    "Crack a clue, mix the letter tiles, and build a word.", "🔤", "peach", 4, AGE_BANDS),
            new Game("wonder-lab", "Wonder Lab", "Science wonders", "quiz",
                    "Ask big questions about nature, space, and how things work.", "🚀", "mint", 4, AGE_BANDS),
            new Game("habitat-match", "Habitat Match", "Science wonders", "match",
                    "Help each creature find a just-right home in the wild.", "🐾", "ocean", 4, AGE_BANDS),
            new Game("moon-meadow-quest", "Moon Meadow Quest", "Adventure & Treasure Hunt", "adventure",
                    "Help Luna find the Moonstone and guide it back to the sky tree.", "🌙", "lilac", 5, AGE_BANDS),
            new Game("jungle-treasure", "Jungle Treasure Trail", "Adventure & Treasure Hunt", "adventure",
                    "Follow a secret map through the jungle and uncover a hidden treasure.", "🗺️", "jungle", 5, AGE_BANDS),
            new Game("memory-garden", "Memory Garden", "Memory Games", "memory",
                    "Flip the cards, find matching pairs, and uncover nature facts.", "🃏", "memory", 4, AGE_BANDS),
            new Game("pattern-puzzler", "Pattern Puzzler", "Puzzle & Logic", "puzzle",
                    "Spot the pattern, crack the clue, and fit the missing piece.", "🧩", "puzzle", 4, AGE_BANDS),
            new Game("doodle-studio", "Doodle Studio", "Art & Creativity", "creative",
                    "Draw a new world, invent a creature, and save your masterpiece.", "🎨", "art", 5, AGE_BANDS),
            new Game("wildlife-scout", "Wildlife Scout", "Animals & Nature", "scavenger",
                    "Search the wild scene, spot an animal, and learn how it lives.", "🔎", "wildlife", 4, AGE_BANDS),
            new Game("code-critters", "Code Critters", "Coding & Computational Thinking", "coding",
                    "Build a sequence of commands to guide a critter through the maze.", "🤖", "code", 5, AGE_6_12),
            game("flip-card-match", "Flip Card Match", "Memory Games", "memory", "Turn two cards at a time and find every matching pair.", "🃏", "memory", 4),
            game("remember-sequence", "Remember the Sequence", "Memory Games", "sequence", "Watch the lights, remember the order, and repeat it.", "💡", "memory", 3),
            game("missing-object", "Find the Missing Object", "Memory Games", "missing", "Study a busy picture, then spot what disappeared.", "🔍", "memory", 3),
            game("picture-memory", "Picture Memory", "Memory Games", "memory", "Match picture cards and collect a fun fact with each pair.", "🖼️", "memory", 4),
            game("jigsaw-puzzle", "Jigsaw Puzzle", "Puzzle & Logic", "puzzle", "Fit the picture pieces together one clue at a time.", "🧩", "puzzle", 4),
            game("find-the-pattern", "Find the Pattern", "Puzzle & Logic", "puzzle", "Spot what changes and choose the next piece.", "🔷", "puzzle", 3),
            game("maze-escape", "Maze Escape", "Puzzle & Logic", "coding", "Plan a safe route through a twisty little maze.", "🌀", "puzzle", 4),
            game("sudoku-kids", "Sudoku for Kids", "Puzzle & Logic", "sudoku", "Fill the number grid so every row and column is just right.", "🔢", "puzzle", 5, AGE_6_12),
            game("spot-difference", "Spot the Difference", "Puzzle & Logic", "scavenger", "Look carefully and find the detail that does not match.", "👀", "puzzle", 3),
            game("coloring-book", "Coloring Book", "Art & Creativity", "creative", "Choose bright colors and bring a friendly picture to life.", "🖍️", "art", 4),
            game("free-drawing", "Free Drawing", "Art & Creativity", "creative", "Make any picture you imagine and save your masterpiece.", "✏️", "art", 4),
            game("complete-picture", "Complete the Picture", "Art & Creativity", "creative", "Add your own details to finish a playful drawing prompt.", "🌈", "art", 4),
            game("design-your-monster", "Design Your Monster", "Art & Creativity", "monster", "Mix colors, eyes, horns, and smiles to invent a new friend.", "👾", "art", 4),
            game("pixel-art", "Pixel Art", "Art & Creativity", "pixel", "Paint a tiny picture one colorful square at a time.", "🟪", "art", 4),
            game("guess-the-country", "Guess the Country", "Geography & World Explorer", "quiz", "Use map and flag clues to discover places around the world.", "🌍", "globe", 4, AGE_6_12),
            game("flag-match", "Flag Match", "Geography & World Explorer", "match", "Match colorful flags with the countries they represent.", "🚩", "globe", 4, AGE_6_12),
            game("world-map-puzzle", "World Map Puzzle", "Geography & World Explorer", "puzzle", "Use direction clues to place places on a world map.", "🗺️", "globe", 5, AGE_6_12),
            game("famous-landmarks", "Famous Landmarks", "Geography & World Explorer", "scavenger", "Spot world-famous places hidden in the travel scene.", "🏛️", "globe", 4, AGE_6_12),
            game("indian-states", "Indian States", "Geography & World Explorer", "quiz", "Explore Indian states, their capitals, and their places.", "🇮🇳", "globe", 5, AGE_6_12),
            game("guess-animal-sound", "Guess the Animal Sound", "Animals & Nature", "sound", "Listen to a playful sound clue and find its animal.", "🐮", "wildlife", 3),
            game("match-animal-homes", "Match Animal Homes", "Animals & Nature", "match", "Help animals find habitats that meet their needs.", "🪺", "wildlife", 4),
            game("food-chain", "Food Chain", "Animals & Nature", "quiz", "Discover how plants and animals depend on one another.", "🌿", "wildlife", 4),
            game("ocean-explorer", "Ocean Explorer", "Animals & Nature", "adventure", "Dive into ocean zones and meet their amazing creatures.", "🐠", "ocean", 5),
            game("save-the-forest", "Save the Forest", "Animals & Nature", "adventure", "Make kind choices that help a forest home thrive.", "🌳", "jungle", 5),
            game("mini-piano", "Mini Piano", "Music & Rhythm", "piano", "Play a little tune on a friendly, colorful keyboard.", "🎹", "music", 3),
            game("repeat-the-rhythm", "Repeat the Rhythm", "Music & Rhythm", "rhythm", "Listen to a beat pattern, then tap it back.", "🥁", "music", 4),
            game("guess-instrument", "Guess the Instrument", "Music & Rhythm", "sound", "Hear a musical clue and guess which instrument made it.", "🎺", "music", 4),
            game("musical-memory", "Musical Memory", "Music & Rhythm", "memory", "Match music-themed cards and remember each sound.", "🎵", "music", 4),
            game("robot-maze", "Robot Maze", "Coding & Computational Thinking", "coding", "Program a robot to reach the star without hitting a wall.", "🤖", "code", 5, AGE_6_12),
            game("arrange-commands", "Arrange Commands", "Coding & Computational Thinking", "coding", "Put movement commands in the right order.", "🧱", "code", 4, AGE_6_12),
            game("debug-the-path", "Debug the Path", "Coding & Computational Thinking", "coding", "Find the wrong command and fix the route.", "🛠️", "code", 5, AGE_6_12),
            game("repeat-loop", "Repeat Loop Challenge", "Coding & Computational Thinking", "loop", "Use a repeat block to make a short program do more.", "🔁", "code", 5, AGE_6_12),
            game("healthy-food-sort", "Healthy Food Sort", "Life Skills & Good Habits", "sort", "Sort foods into a balanced everyday plate.", "🍎", "life", 4),
            game("morning-routine", "Morning Routine", "Life Skills & Good Habits", "sequence", "Put morning steps in an order that helps you get ready.", "🌞", "life", 3),
            game("road-safety", "Road Safety", "Life Skills & Good Habits", "scavenger", "Spot safe choices for walking and crossing the road.", "🚦", "life", 4),
            game("money-basics", "Money Basics", "Life Skills & Good Habits", "shop", "Practice making a small choice with pretend coins.", "🪙", "life", 4, AGE_6_12),
            game("clean-your-room", "Clean Your Room", "Life Skills & Good Habits", "sort", "Put toys, books, and clothes where they belong.", "🧺", "life", 3),
            game("guess-the-emotion", "Guess the Emotion", "Emotions & Social Skills", "emotion", "Read friendly face clues and name the feeling.", "😊", "feelings", 3),
            game("kindness-choices", "Kindness Choices", "Emotions & Social Skills", "quiz", "Choose thoughtful ways to help a friend.", "💛", "feelings", 4),
            game("friendship-stories", "Friendship Stories", "Emotions & Social Skills", "adventure", "Explore a friendship story and make caring choices.", "🫶", "feelings", 5),
            game("feelings-match", "Feelings Match", "Emotions & Social Skills", "memory", "Match feelings with faces and helpful words.", "💞", "feelings", 4),
            game("set-the-clock", "Set the Clock", "Time & Calendar", "clock", "Move the clock hands to show the time.", "🕒", "time", 4),
            game("what-time", "What Time Is It?", "Time & Calendar", "quiz", "Read simple clock clues and choose the time.", "⏰", "time", 3),
            game("arrange-the-days", "Arrange the Days", "Time & Calendar", "sequence", "Put the days of the week in the right order.", "📅", "time", 3),
            game("seasons-match", "Seasons Match", "Time & Calendar", "match", "Match weather, clothes, and nature to a season.", "🍂", "time", 4),
            game("timeline-puzzle", "Timeline Puzzle", "History & Culture", "puzzle", "Put important events in time order.", "⌛", "history", 5, AGE_9_12),
            game("famous-inventors", "Famous Inventors", "History & Culture", "quiz", "Meet inventors and the ideas that changed daily life.", "💡", "history", 4, AGE_9_12),
            game("indian-festivals", "Indian Festivals", "History & Culture", "quiz", "Explore traditions and celebrations from across India.", "🪔", "history", 4, AGE_9_12),
            game("monument-match", "Monument Match", "History & Culture", "match", "Match remarkable monuments with their places and stories.", "🕌", "history", 4, AGE_9_12),
            game("treasure-island", "Treasure Island", "Adventure & Treasure Hunt", "adventure", "Follow a map, solve clues, and uncover a hidden island treasure.", "🏝️", "jungle", 5),
            game("mystery-quest", "Mystery Quest", "Adventure & Treasure Hunt", "adventure", "Gather clues and solve a gentle, age-friendly mystery.", "🔎", "lilac", 5),
            game("hidden-objects", "Hidden Objects", "Adventure & Treasure Hunt", "scavenger", "Search a busy scene for objects on your explorer list.", "🕵️", "lilac", 4),
            game("solve-the-clues", "Solve the Clues", "Adventure & Treasure Hunt", "puzzle", "Crack picture, word, and number clues to open the chest.", "🗝️", "jungle", 4),
            game("virtual-shop", "Virtual Shop", "Money & Financial Literacy", "shop", "Choose pretend items and add prices to your budget.", "🛒", "money", 4, AGE_6_12),
            game("count-the-coins", "Count the Coins", "Money & Financial Literacy", "quiz", "Count coin values to find the total.", "🪙", "money", 3, AGE_6_12),
            game("needs-vs-wants", "Needs vs Wants", "Money & Financial Literacy", "sort", "Sort everyday items into needs and wants.", "⚖️", "money", 4, AGE_6_12),
            game("save-for-a-toy", "Save for a Toy", "Money & Financial Literacy", "shop", "Save pretend coins toward a goal and track your progress.", "🐷", "money", 4, AGE_6_12),
            game("sports-match", "Sports Match", "Sports & Movement", "match", "Match sports with the equipment and skills they use.", "⚽", "sports", 3),
            game("follow-the-movement", "Follow the Movement", "Sports & Movement", "sequence", "Repeat a simple movement pattern using screen prompts.", "🏃", "sports", 3),
            game("balance-challenge", "Balance Challenge", "Sports & Movement", "balance", "Keep a playful balance bar steady with gentle taps.", "🤸", "sports", 3),
            game("sports-equipment", "Sports Equipment Quiz", "Sports & Movement", "quiz", "Learn which equipment belongs with each sport.", "🏀", "sports", 3),
            game("choose-your-story", "Choose Your Story", "Interactive Stories & Reading", "adventure", "Make choices that send a story in a new direction.", "📖", "story", 5),
            game("story-pictures", "Arrange Story Pictures", "Interactive Stories & Reading", "sequence", "Put story pictures in an order that makes sense.", "🖼️", "story", 4),
            game("complete-the-ending", "Complete the Ending", "Interactive Stories & Reading", "adventure", "Use story clues to choose a satisfying ending.", "✍️", "story", 4),
            game("listen-and-answer", "Listen and Answer", "Interactive Stories & Reading", "readaloud", "Listen to a short story, then answer a question about it.", "🔊", "story", 4),
            new Game("crystal-cave-3d", "3D Crystal Cave", "Adventure & Treasure Hunt", "maze3d",
                    "Play three 3D cave missions: find crystals, unlock portals, and rescue a lost firefly.", "💎", "lilac", 9, AGE_BANDS),
            new Game("solar-system-3d", "3D Space Rescue Missions", "Science wonders", "space3d",
                    "Pilot a 3D shuttle on three rescue missions. Collect cargo, dodge asteroids, and dock safely.", "🪐", "space", 9, AGE_BANDS)
    );

    private final Map<String, Map<String, List<Question>>> questionBank = buildQuestionBank();

    public List<Game> getGames() {
        return IntStream.range(0, games.size())
                .mapToObj(index -> {
                    Game game = games.get(index);
                    int minutes = 8 + index % 3;
                    return new Game(game.id(), game.title(), game.subject(), game.mode(), game.description(), game.icon(), game.theme(), minutes, game.ageBands());
                })
                .toList();
    }

    public List<MemoryCard> getMemoryCards(String gameId, String ageBand) {
        Game game = games.stream().filter(candidate -> candidate.id().equals(gameId)).findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "That game could not be found."));
        if (!game.mode().equals("memory")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "That game does not use memory cards.");
        }
        if (!AGE_BANDS.contains(ageBand)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Choose an age group to play.");
        }

        List<MemoryPair> pairs = switch (ageBand) {
            case "3-5" -> List.of(
                    new MemoryPair("bee", "🐝", "Bee", "Bees carry pollen between flowers."),
                    new MemoryPair("frog", "🐸", "Frog", "Frogs begin life as tadpoles in water."),
                    new MemoryPair("flower", "🌻", "Flower", "Flowers help plants make seeds."),
                    new MemoryPair("moon", "🌙", "Moon", "The Moon reflects light from the Sun.")
            );
            case "6-8" -> List.of(
                    new MemoryPair("planet", "🌍", "Planet", "Earth is the only planet we know has life."),
                    new MemoryPair("moon", "🌙", "Moon", "The Moon travels around Earth."),
                    new MemoryPair("bee", "🐝", "Bee", "Pollination helps many plants make seeds."),
                    new MemoryPair("turtle", "🐢", "Turtle", "Turtles are reptiles with protective shells."),
                    new MemoryPair("dolphin", "🐬", "Dolphin", "Dolphins are mammals that breathe air."),
                    new MemoryPair("leaf", "🍃", "Leaf", "Leaves use sunlight to help a plant make food.")
            );
            default -> List.of(
                    new MemoryPair("brain", "🧠", "Brain", "The brain processes information and coordinates the body."),
                    new MemoryPair("telescope", "🔭", "Telescope", "Telescopes collect light from distant objects in space."),
                    new MemoryPair("magnet", "🧲", "Magnet", "A magnet attracts some metals, including iron."),
                    new MemoryPair("coral", "🪸", "Coral", "Coral reefs provide habitat for many marine species."),
                    new MemoryPair("saturn", "🪐", "Saturn", "Saturn's rings are made mostly of ice and rock."),
                    new MemoryPair("recycle", "♻️", "Recycle", "Reusing materials can reduce the waste we throw away."),
                    new MemoryPair("lightning", "⚡", "Lightning", "Lightning is a large electrical discharge in the atmosphere."),
                    new MemoryPair("seedling", "🌱", "Seedling", "A seedling is a young plant growing from a seed.")
            );
        };
        if (game.subject().equals("Music & Rhythm")) {
            pairs = switch (ageBand) {
                case "3-5" -> List.of(
                        new MemoryPair("drum", "🥁", "Drum", "A drum makes sound when its surface vibrates."),
                        new MemoryPair("piano", "🎹", "Piano", "A piano uses keys to make musical notes."),
                        new MemoryPair("flute", "🪈", "Flute", "A flute makes sound when air moves across its opening."),
                        new MemoryPair("guitar", "🎸", "Guitar", "A guitar's strings vibrate when plucked.")
                );
                case "6-8" -> List.of(
                        new MemoryPair("drum", "🥁", "Drum", "Drums are percussion instruments."),
                        new MemoryPair("piano", "🎹", "Piano", "A piano has strings struck by small hammers."),
                        new MemoryPair("flute", "🪈", "Flute", "A flute is a woodwind instrument."),
                        new MemoryPair("guitar", "🎸", "Guitar", "A guitar usually has six strings."),
                        new MemoryPair("trumpet", "🎺", "Trumpet", "A trumpet is a brass instrument."),
                        new MemoryPair("cymbals", "🥁", "Cymbals", "Cymbals create sound when they vibrate after a strike.")
                );
                default -> List.of(
                        new MemoryPair("drum", "🥁", "Drum", "Drums are percussion instruments that create rhythmic sound."),
                        new MemoryPair("piano", "🎹", "Piano", "A piano's keys trigger hammers that strike strings."),
                        new MemoryPair("flute", "🪈", "Flute", "A flute produces sound when air vibrates at its opening."),
                        new MemoryPair("guitar", "🎸", "Guitar", "Changing string length changes the pitch of a guitar note."),
                        new MemoryPair("trumpet", "🎺", "Trumpet", "A trumpet player buzzes their lips to start the air vibrating."),
                        new MemoryPair("violin", "🎻", "Violin", "A violin's strings can be bowed or plucked."),
                        new MemoryPair("maracas", "🪇", "Maracas", "Maracas make sound when their small contents shake."),
                        new MemoryPair("saxophone", "🎷", "Saxophone", "A saxophone uses a reed to help make sound.")
                );
            };
        } else if (game.subject().equals("Emotions & Social Skills")) {
            pairs = switch (ageBand) {
                case "3-5" -> List.of(
                        new MemoryPair("happy", "😊", "Happy", "Happiness can feel bright and energetic."),
                        new MemoryPair("sad", "😢", "Sad", "Talking with someone you trust can help when you feel sad."),
                        new MemoryPair("calm", "😌", "Calm", "Slow breathing can help your body feel calmer."),
                        new MemoryPair("kind", "💛", "Kindness", "Kind words can help people feel welcome.")
                );
                case "6-8" -> List.of(
                        new MemoryPair("happy", "😊", "Happy", "People can feel happy for many different reasons."),
                        new MemoryPair("sad", "😢", "Sad", "Sadness is a normal feeling that can come and go."),
                        new MemoryPair("worried", "😟", "Worried", "Naming a worry can help you ask for support."),
                        new MemoryPair("proud", "🥹", "Proud", "Pride can come from effort as well as achievement."),
                        new MemoryPair("calm", "😌", "Calm", "A quiet pause can help people settle strong feelings."),
                        new MemoryPair("kind", "💛", "Kindness", "Listening is one way to show kindness.")
                );
                default -> List.of(
                        new MemoryPair("happy", "😊", "Happy", "Emotions carry information about our experiences."),
                        new MemoryPair("sad", "😢", "Sad", "People respond to sadness in different ways."),
                        new MemoryPair("worried", "😟", "Worried", "A trusted person can help you work through a worry."),
                        new MemoryPair("proud", "🥹", "Proud", "Recognizing effort can build confidence."),
                        new MemoryPair("calm", "😌", "Calm", "Breathing slowly can help regulate the body's stress response."),
                        new MemoryPair("curious", "🤔", "Curious", "Curiosity helps people ask questions and learn."),
                        new MemoryPair("kind", "💛", "Kindness", "Empathy means trying to understand another person's feelings."),
                        new MemoryPair("brave", "🦁", "Brave", "Being brave can mean asking for help when you need it.")
                );
            };
        }

        List<MemoryCard> cards = new ArrayList<>();
        int cardNumber = 1;
        for (MemoryPair pair : pairs) {
            cards.add(new MemoryCard("memory-" + cardNumber++, pair.id(), pair.face(), pair.label(), pair.fact()));
            cards.add(new MemoryCard("memory-" + cardNumber++, pair.id(), pair.face(), pair.label(), pair.fact()));
        }
        Collections.shuffle(cards);
        return cards;
    }

    public List<PublicQuestion> getQuestions(String gameId, String ageBand) {
        List<Question> questions = questionsFor(gameId, ageBand);
        List<Question> shuffled = new ArrayList<>(questions);
        boolean adventure = games.stream().anyMatch(game -> game.id().equals(gameId) && game.mode().equals("adventure"));
        if (!adventure) {
            Collections.shuffle(shuffled);
        }
        return shuffled.stream()
                .limit(QUESTIONS_PER_ROUND)
                .map(question -> new PublicQuestion(question.id(), question.prompt(), question.hint(), question.choices()))
                .toList();
    }

    public AnswerResponse checkAnswer(String gameId, AnswerRequest request) {
        if (request == null || request.questionId() == null || request.choice() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Choose an answer to keep playing.");
        }

        Question question = questionsFor(gameId, request.ageBand()).stream()
                .filter(candidate -> candidate.id().equals(request.questionId()))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "That question is no longer in this adventure."));

        boolean correct = question.answer().equalsIgnoreCase(request.choice().trim());
        return new AnswerResponse(
                correct,
                question.answer(),
                question.lesson(),
                correct ? "Brilliant thinking!" : "Good try! Every guess helps your brain grow."
        );
    }

    private List<Question> questionsFor(String gameId, String ageBand) {
        if (!AGE_BANDS.contains(ageBand)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Choose an age group to play.");
        }
        Game game = games.stream().filter(candidate -> candidate.id().equals(gameId)).findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "That game could not be found."));
        if (!List.of("quiz", "bubble", "spell", "match", "adventure", "puzzle", "scavenger", "emotion", "readaloud").contains(game.mode())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "That activity does not use question cards.");
        }
        Map<String, List<Question>> ageQuestions = questionBank.get(gameId);
        if (ageQuestions == null) {
            return generatedQuestions(game, ageBand);
        }
        List<Question> questions = ageQuestions.get(ageBand);
        return questions == null ? generatedQuestions(game, ageBand) : questions;
    }

    private List<Question> generatedQuestions(Game game, String ageBand) {
        String prefix = game.id() + "-" + ageBand + "-";
        if (game.id().equals("guess-the-emotion")) {
            return List.of(
                    q(prefix + "1", "A friend dropped their snack and looks teary. What might they feel?", "Notice the tears and drooping face.", "Sad", "Excited", "Sleepy", "Sad", "People can feel sad when something disappointing happens."),
                    q(prefix + "2", "A child is smiling and jumping because a friend came to play. What might they feel?", "A big smile and happy jumps can be a clue.", "Angry", "Happy", "Worried", "Happy", "People often smile when they feel happy, though feelings can look different for everyone."),
                    q(prefix + "3", "Someone hears a loud bang and steps back. What might they feel?", "A sudden loud noise can surprise someone.", "Surprised", "Bored", "Proud", "Surprised", "A sudden unexpected sound can make someone feel surprised."),
                    q(prefix + "4", "A child takes a slow breath and relaxes. Which feeling fits?", "Their body is settling down.", "Calm", "Furious", "Confused", "Calm", "Slow breathing can help the body feel calmer."),
                    q(prefix + "5", "A friend cannot find their grown-up in a busy place. What might they feel?", "They may not know what will happen next.", "Worried", "Proud", "Sleepy", "Worried", "Feeling worried in an unfamiliar situation is common. Asking a trusted grown-up for help can be a good next step.")
            );
        }
        return switch (game.subject()) {
            case "Geography & World Explorer" -> List.of(
                    q(prefix + "1", "Which continent is India part of?", "Find India on a world map.", "Asia", "Africa", "Europe", "Asia", "India is in South Asia, on the continent of Asia."),
                    q(prefix + "2", "What is the capital city of India?", "It is in the north of the country.", "Mumbai", "New Delhi", "Chennai", "New Delhi", "New Delhi is India's capital."),
                    q(prefix + "3", "Which is the largest ocean on Earth?", "It stretches between Asia, Australia, and the Americas.", "Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Pacific Ocean", "The Pacific Ocean is the largest ocean on Earth."),
                    q(prefix + "4", "Which direction is opposite east?", "Use the compass points.", "North", "West", "South", "West", "West is the opposite direction from east."),
                    q(prefix + "5", "Which landmark is in Agra, India?", "It is a famous white marble monument.", "Taj Mahal", "Eiffel Tower", "Colosseum", "Taj Mahal", "The Taj Mahal is in Agra, Uttar Pradesh.")
            );
            case "Animals & Nature" -> List.of(
                    q(prefix + "1", "Which animal is a mammal?", "Mammals breathe air and feed milk to their young.", "Dolphin", "Trout", "Frog", "Dolphin", "Dolphins are air-breathing marine mammals."),
                    q(prefix + "2", "What do bees help flowers do?", "Pollen travels between flowers.", "Make seeds", "Turn into rocks", "Make rain", "Make seeds", "Pollination helps many plants make seeds."),
                    q(prefix + "3", "Which habitat is home to coral reefs?", "Think of warm salt water.", "Ocean", "Desert", "Pine forest", "Ocean", "Coral reefs are marine habitats in the ocean."),
                    q(prefix + "4", "Which part of a food chain makes its own food?", "It uses sunlight.", "Plant", "Fox", "Owl", "Plant", "Plants are producers because they make food using sunlight."),
                    q(prefix + "5", "What can you do to help a forest?", "Choose an action that reduces litter.", "Leave rubbish", "Reuse and recycle", "Break young trees", "Reuse and recycle", "Reusing and recycling can reduce waste in natural places.")
            );
            case "Music & Rhythm" -> List.of(
                    q(prefix + "1", "Which instrument has black and white keys?", "You can play high and low notes on it.", "Piano", "Drum", "Flute", "Piano", "A piano has a row of black and white keys."),
                    q(prefix + "2", "What makes a drum sound?", "Think about what happens when you tap its surface.", "A vibrating drum skin", "A spinning wheel", "A blowing wind", "A vibrating drum skin", "A drum skin vibrates when struck and makes sound waves."),
                    q(prefix + "3", "Which sound is usually higher in pitch?", "A small bird often makes a high sound.", "Bird chirp", "Big drum", "Thunder", "Bird chirp", "Pitch describes how high or low a sound seems."),
                    q(prefix + "4", "How many beats are in a pair?", "Count one beat and one more.", "1", "2", "3", "2", "A pair has two beats or items."),
                    q(prefix + "5", "Which instrument do you blow across?", "It is a woodwind instrument.", "Flute", "Guitar", "Cymbals", "Flute", "A flute makes sound when air moves across its opening.")
            );
            case "Life Skills & Good Habits" -> List.of(
                    q(prefix + "1", "When should you wash your hands?", "Soap and water help clean your hands.", "Before eating", "Never", "Only after playing", "Before eating", "Washing hands before eating helps remove germs."),
                    q(prefix + "2", "What does a red traffic light mean?", "Wait until it is safe to go.", "Stop", "Run", "Turn around", "Stop", "Red means stop and wait for a safe signal."),
                    q(prefix + "3", "Which snack helps make a balanced plate?", "Choose a fruit or vegetable.", "Apple", "Candy only", "Soda", "Apple", "Fruit can be part of a varied, balanced diet."),
                    q(prefix + "4", "You find something unsafe. What should you do?", "A trusted grown-up can help.", "Tell a trusted adult", "Hide it", "Touch it", "Tell a trusted adult", "Ask a trusted adult for help when something seems unsafe."),
                    q(prefix + "5", "What is a helpful way to tidy toys?", "Put similar things together.", "Put them in their places", "Leave them on the floor", "Hide them under a rug", "Put them in their places", "Putting things away makes them easier to find and keeps walkways clear.")
            );
            case "Emotions & Social Skills" -> List.of(
                    q(prefix + "1", "A friend looks sad. What is a kind first step?", "Give them a chance to tell you what is wrong.", "Listen and ask if they want help", "Laugh at them", "Walk away every time", "Listen and ask if they want help", "Listening shows care. You can ask what support your friend wants."),
                    q(prefix + "2", "What can help when you feel frustrated?", "A calm pause can help you think.", "Take a slow breath", "Shout at someone", "Throw your things", "Take a slow breath", "Slow breathing can help your body settle."),
                    q(prefix + "3", "Before giving someone a hug, what is kind to do?", "Ask first and respect their answer.", "Ask if they would like one", "Hug without asking", "Keep asking after no", "Ask if they would like one", "Asking respects another person's choice and personal space."),
                    q(prefix + "4", "Which action can help a new classmate feel welcome?", "A friendly invitation can help.", "Invite them to join a game", "Ignore them", "Hide their things", "Invite them to join a game", "Including others helps build friendship."),
                    q(prefix + "5", "Can people feel more than one emotion at once?", "Feelings can be mixed.", "Yes", "No, only one", "Only grown-ups can", "Yes", "People can have mixed feelings, and that is normal.")
            );
            case "Time & Calendar" -> List.of(
                    q(prefix + "1", "How many minutes are in one hour?", "A half hour has thirty minutes.", "30", "60", "100", "60", "There are sixty minutes in an hour."),
                    q(prefix + "2", "Which day comes after Monday?", "Follow the days of the week.", "Sunday", "Tuesday", "Friday", "Tuesday", "Tuesday comes after Monday."),
                    q(prefix + "3", "How many days are in a week?", "Count Monday through Sunday.", "5", "7", "10", "7", "A week has seven days."),
                    q(prefix + "4", "Which season is often the coldest?", "It can bring frost or snow in many places.", "Winter", "Summer", "Spring", "Winter", "Winter is the coldest season in many regions."),
                    q(prefix + "5", "Which month comes after May?", "It begins with J.", "April", "June", "August", "June", "June is the month after May.")
            );
            case "History & Culture" -> List.of(
                    q(prefix + "1", "Who is known for inventing an early practical telephone?", "His surname starts with B.", "Alexander Graham Bell", "Isaac Newton", "Marie Curie", "Alexander Graham Bell", "Alexander Graham Bell is widely credited with an early practical telephone."),
                    q(prefix + "2", "Which Indian emperor is known for helping spread Buddhism?", "He ruled the Maurya Empire.", "Ashoka", "Akbar", "Shivaji", "Ashoka", "Emperor Ashoka supported the spread of Buddhism."),
                    q(prefix + "3", "Which festival is often called the festival of lights?", "Homes may be decorated with lamps.", "Diwali", "Holi", "Onam", "Diwali", "Diwali is celebrated by many people with lamps and lights."),
                    q(prefix + "4", "Which monument is in Paris?", "It is a tall iron landmark.", "Eiffel Tower", "Taj Mahal", "Great Wall", "Eiffel Tower", "The Eiffel Tower is a famous landmark in Paris, France."),
                    q(prefix + "5", "Why do historians study old objects and records?", "They help us understand life in the past.", "To learn about the past", "To predict every future event", "To change old objects", "To learn about the past", "Objects and records provide evidence about past people and events.")
            );
            case "Money & Financial Literacy" -> List.of(
                    q(prefix + "1", "You have ₹5 and get ₹5 more. How much do you have?", "Add the two amounts.", "₹8", "₹10", "₹15", "₹10", "Five rupees plus five rupees is ten rupees."),
                    q(prefix + "2", "What does saving money mean?", "You keep some money for later.", "Setting some aside for later", "Spending it all at once", "Losing track of it", "Setting some aside for later", "Saving means keeping money for a future goal or need."),
                    q(prefix + "3", "Which is usually a need?", "People need it to stay healthy and safe.", "Clean water", "A third toy car", "A shiny sticker", "Clean water", "Clean water is a basic need."),
                    q(prefix + "4", "A toy costs ₹12. You have ₹10. How much more do you need?", "Count up from ten to twelve.", "₹1", "₹2", "₹3", "₹2", "Twelve minus ten is two rupees."),
                    q(prefix + "5", "Why can a budget be helpful?", "It helps plan how money will be used.", "It helps plan spending and saving", "It makes every item free", "It creates extra coins", "It helps plan spending and saving", "A budget helps people plan money for needs, goals, and choices.")
            );
            case "Sports & Movement" -> List.of(
                    q(prefix + "1", "Which sport uses a racket and a small ball?", "Players hit the ball over a net.", "Tennis", "Swimming", "Cycling", "Tennis", "Tennis is played with rackets and a ball."),
                    q(prefix + "2", "What should you do before vigorous exercise?", "Start gently and prepare your body.", "Warm up", "Skip water all day", "Wear slippery shoes", "Warm up", "A gentle warm-up prepares your muscles for activity."),
                    q(prefix + "3", "Which equipment helps protect your head on a bicycle?", "It fits securely on your head.", "Helmet", "Scarf", "Knee sock", "Helmet", "A correctly fitted helmet helps protect a cyclist's head."),
                    q(prefix + "4", "How many players are on one soccer team on the field in a standard match?", "Count the goalkeeper too.", "7", "11", "15", "11", "A standard soccer team fields eleven players, including the goalkeeper."),
                    q(prefix + "5", "What is a good way to keep movement fun?", "Choose an activity you enjoy and take breaks.", "Move in a way you enjoy", "Ignore pain", "Never rest", "Move in a way you enjoy", "Enjoyable movement and rest help make activity sustainable.")
            );
            case "Interactive Stories & Reading" -> List.of(
                    q(prefix + "1", "A story says: “Mina packed an umbrella because clouds filled the sky.” Why?", "Use the clue in the sentence.", "She thought it might rain", "She wanted to swim", "She was going to bed", "She thought it might rain", "Clouds and an umbrella suggest Mina expects rain."),
                    q(prefix + "2", "Which usually comes first in a story?", "Stories often introduce who and where.", "Meet the character", "Solve the ending", "Read the last page", "Meet the character", "An opening often introduces the characters or setting."),
                    q(prefix + "3", "A character shares their lunch. What does this show?", "Think about the character's action.", "Generosity", "Pride", "Sleepiness", "Generosity", "Sharing can show generosity and care."),
                    q(prefix + "4", "What is a setting in a story?", "It tells when and where events happen.", "The time and place", "The list of page numbers", "The author's name", "The time and place", "The setting is when and where a story takes place."),
                    q(prefix + "5", "What can you do if a story word is unfamiliar?", "Use nearby sentences as clues.", "Read the surrounding clues", "Stop reading forever", "Guess without looking", "Read the surrounding clues", "Context clues can help readers work out a new word.")
            );
            case "Adventure & Treasure Hunt" -> List.of(
                    q(prefix + "1", "Your treasure map shows a north arrow. Why is it useful?", "Maps use directions to help us find places.", "It shows which way is north", "It tells the weather", "It names every animal", "It shows which way is north", "A north arrow helps orient a map."),
                    q(prefix + "2", "The clue says, “I have keys but open no locks.” What am I?", "Think of something that makes music.", "A piano", "A river", "A tree", "A piano", "A piano has keys that make musical notes."),
                    q(prefix + "3", "You found 6 shells and then 4 more. How many?", "Add the two groups.", "9", "10", "11", "10", "Six plus four equals ten shells."),
                    q(prefix + "4", "Which tool can help you see a faraway island?", "It makes distant objects look closer.", "Binoculars", "A spoon", "A pillow", "Binoculars", "Binoculars help people see distant objects more clearly."),
                    q(prefix + "5", "A good explorer finds a fragile nest. What is kind?", "Wild animals need safe space.", "Look from a distance", "Touch the eggs", "Take the nest", "Look from a distance", "Watching wildlife from a distance helps keep it safe.")
            );
            default -> List.of(
                    q(prefix + "1", "What is one careful way to solve a new challenge?", "Take a moment to look for clues.", "Look for clues", "Give up right away", "Ignore the instructions", "Look for clues", "Noticing clues can help you plan a solution."),
                    q(prefix + "2", "Which choice helps you learn from a mistake?", "Mistakes can show what to try next.", "Try a new approach", "Never try again", "Hide the problem", "Try a new approach", "Changing your approach is one way to learn."),
                    q(prefix + "3", "What can you do when a task has many steps?", "Break it into smaller pieces.", "Do one step at a time", "Skip every step", "Rush without looking", "Do one step at a time", "Small steps can make a big task easier to manage."),
                    q(prefix + "4", "Which action is helpful when working with a teammate?", "Listening helps everyone share ideas.", "Take turns listening", "Talk over everyone", "Hide the tools", "Take turns listening", "Taking turns helps a group cooperate."),
                    q(prefix + "5", "If you are unsure what to do, what is a good next step?", "A trusted adult can help.", "Ask for help", "Guess in a dangerous situation", "Walk away alone", "Ask for help", "Asking a trusted person is a safe way to get help.")
            );
        };
    }

    private static Game game(String id, String title, String subject, String mode, String description, String icon, String theme, int minutes) {
        return game(id, title, subject, mode, description, icon, theme, minutes, AGE_BANDS);
    }

    private static Game game(String id, String title, String subject, String mode, String description, String icon, String theme, int minutes, List<String> ageBands) {
        return new Game(id, title, subject, mode, description, icon, theme, minutes, ageBands);
    }

    private Map<String, Map<String, List<Question>>> buildQuestionBank() {
        Map<String, Map<String, List<Question>>> bank = new LinkedHashMap<>();
        bank.put("number-garden", Map.of(
                "3-5", List.of(
                        q("ng-35-1", "How many flowers are here?  🌼 🌼 🌼", "Point to each flower as you count.", "2", "3", "4", "3", "Count each flower once: one, two, three."),
                        q("ng-35-2", "What is 2 + 1?", "Start with two and count one more.", "2", "3", "4", "3", "Adding means putting groups together."),
                        q("ng-35-3", "What number comes after 5?", "Count one step forward from five.", "4", "6", "7", "6", "The number line goes 4, 5, 6."),
                        q("ng-35-4", "Which number is bigger: 4 or 2?", "Which one would you reach later when counting?", "2", "3", "4", "4", "Four comes after two, so four is bigger."),
                        q("ng-35-5", "What is 3 − 1?", "Take one away from three.", "1", "2", "3", "2", "Three things minus one leaves two."),
                        q("ng-35-6", "Which shape has three sides?", "Count the straight sides of each shape.", "Circle", "Triangle", "Square", "Triangle", "A triangle has three sides and three corners.")
                ),
                "6-8", List.of(
                        q("ng-68-1", "8 + 7 = ?", "Make ten first: 8 needs 2, then add the rest.", "13", "14", "15", "15", "Eight plus two makes ten; five more makes fifteen."),
                        q("ng-68-2", "20 − 6 = ?", "Count back six steps from twenty.", "12", "14", "16", "14", "Subtracting six from twenty leaves fourteen."),
                        q("ng-68-3", "4 × 3 = ?", "Think of four groups with three in each.", "7", "12", "16", "12", "Four groups of three make twelve."),
                        q("ng-68-4", "2, 4, 6, __. What comes next?", "The pattern jumps forward by two each time.", "7", "8", "9", "8", "Adding two each time gives 2, 4, 6, 8."),
                        q("ng-68-5", "Half an hour is how many minutes?", "One hour has sixty minutes.", "20", "30", "40", "30", "Half of sixty minutes is thirty minutes."),
                        q("ng-68-6", "Which number is even?", "Even numbers can be split into pairs with none left over.", "13", "18", "21", "18", "Eighteen is even because it divides into nine pairs.")
                ),
                "9-12", List.of(
                        q("ng-912-1", "What is ¾ of 20?", "Find one quarter first, then take three of those parts.", "5", "15", "18", "15", "One quarter of twenty is five; three quarters is fifteen."),
                        q("ng-912-2", "24 ÷ 6 = ?", "How many groups of six fit into twenty-four?", "3", "4", "6", "4", "Six times four is twenty-four, so twenty-four divided by six is four."),
                        q("ng-912-3", "What is 15% of 100?", "A percent means a part out of one hundred.", "10", "15", "25", "15", "Fifteen percent of one hundred is fifteen."),
                        q("ng-912-4", "A square has sides of 5 cm. What is its perimeter?", "Perimeter is the distance all the way around.", "10 cm", "20 cm", "25 cm", "20 cm", "A square has four equal sides: 4 × 5 cm = 20 cm."),
                        q("ng-912-5", "7 × 8 = ?", "Use a multiplication fact you know to help.", "54", "56", "64", "56", "Seven groups of eight make fifty-six."),
                        q("ng-912-6", "Which number is prime?", "A prime number has exactly two factors: one and itself.", "21", "23", "27", "23", "Twenty-three is divisible only by one and twenty-three.")
                )
        ));

        bank.put("word-safari", Map.of(
                "3-5", List.of(
                        q("ws-35-1", "Which letter starts the word SUN?", "Say the first sound: sss-un.", "S", "M", "T", "S", "Sun starts with the letter S."),
                        q("ws-35-2", "Which word rhymes with cat?", "Listen for the ending sound in each word.", "Hat", "Cup", "Dog", "Hat", "Cat and hat both end with the sound -at."),
                        q("ws-35-3", "What is this animal called?  🐶", "It is a friendly pet that says woof.", "Cat", "Dog", "Duck", "Dog", "A dog is a four-legged animal many families keep as a pet."),
                        q("ws-35-4", "Which letter starts APPLE?", "Listen to the first sound: a-p-ple.", "A", "B", "P", "A", "Apple starts with the letter A."),
                        q("ws-35-5", "More than one cat are called…", "Add an ending to show there is more than one.", "Cates", "Cats", "Cat's", "Cats", "We add -s to many words to mean more than one."),
                        q("ws-35-6", "Which letter makes the middle sound in SUN?", "Stretch the word: s-u-n.", "A", "U", "O", "U", "U is the vowel sound in the middle of sun.")
                ),
                "6-8", List.of(
                        q("ws-68-1", "Which word is spelled correctly?", "Look carefully at the letters in each choice.", "Because", "Becaus", "Beacause", "Because", "Because is spelled b-e-c-a-u-s-e."),
                        q("ws-68-2", "Find the naming word: “The bird sings.”", "A naming word can name a person, place, animal, or thing.", "The", "Bird", "Sings", "Bird", "Bird names an animal, so it is a noun."),
                        q("ws-68-3", "Which word means almost the same as tiny?", "Pick the word that also means very small.", "Huge", "Small", "Loud", "Small", "Small and tiny have similar meanings."),
                        q("ws-68-4", "What is the plural of baby?", "Change the y to i, then add -es.", "Babys", "Babies", "Babyes", "Babies", "Many words ending in consonant + y change to -ies."),
                        q("ws-68-5", "What is the past tense of walk?", "What would you say about a walk that already happened?", "Walking", "Walked", "Walks", "Walked", "Adding -ed makes the regular past tense of walk."),
                        q("ws-68-6", "What is the opposite of noisy?", "Think of a quiet library.", "Busy", "Quiet", "Bright", "Quiet", "Quiet is the opposite of noisy.")
                ),
                "9-12", List.of(
                        q("ws-912-1", "Choose the right word: “___ going to the park.”", "This sentence means “they are going.”", "Their", "There", "They're", "They're", "They're is short for they are."),
                        q("ws-912-2", "Which word is closest in meaning to curious?", "A curious person wants to find things out.", "Inquisitive", "Sleepy", "Careless", "Inquisitive", "Inquisitive means eager to learn or know more."),
                        q("ws-912-3", "“Time is a thief” is an example of…", "It compares two things without using like or as.", "A simile", "A metaphor", "A rhyme", "A metaphor", "A metaphor describes one thing as another to create an image."),
                        q("ws-912-4", "Which sentence uses punctuation correctly?", "A question should end with the mark that asks something.", "Where is my book?", "Where is my book.", "Where is my book,", "Where is my book?", "A question ends with a question mark."),
                        q("ws-912-5", "What does the prefix re- usually mean?", "Think of redo: you do it one more time.", "Before", "Again", "Not", "Again", "The prefix re- can mean again, as in replay or rebuild."),
                        q("ws-912-6", "Choose the correct sentence.", "Match the verb to “she.”", "She have a book.", "She has a book.", "She having a book.", "She has a book.", "In the present tense, we say “she has.”")
                )
        ));

        bank.put("wonder-lab", Map.of(
                "3-5", List.of(
                        q("wl-35-1", "What does a plant need to drink?", "Plants take in water through their roots.", "Water", "Juice", "Milk", "Water", "Plants use water to grow."),
                        q("wl-35-2", "What gives Earth light and warmth?", "Look up in the daytime sky.", "The Moon", "The Sun", "A starfish", "The Sun", "The Sun is our nearest star and warms Earth."),
                        q("wl-35-3", "Where does a fish live?", "Think of the place where fish can swim.", "In water", "In a tree", "Underground", "In water", "Fish use gills to breathe in water."),
                        q("wl-35-4", "A butterfly begins life as a…", "It hatches from a tiny egg.", "Caterpillar", "Puppy", "Tadpole", "Caterpillar", "A butterfly hatches as a caterpillar before changing."),
                        q("wl-35-5", "Which sense helps you hear a bell?", "Which part of your body listens?", "Eyes", "Ears", "Nose", "Ears", "Your ears help you hear sounds."),
                        q("wl-35-6", "Which one is alive?", "Living things grow and need what helps them live.", "A flower", "A rock", "A spoon", "A flower", "A flower is alive: it grows and needs water and light.")
                ),
                "6-8", List.of(
                        q("wl-68-1", "Ice is which state of matter?", "It keeps its own shape when you put it on a plate.", "Solid", "Liquid", "Gas", "Solid", "Ice is water in its solid state."),
                        q("wl-68-2", "What does Earth travel around?", "Earth takes about one year to go all the way around it.", "The Moon", "The Sun", "Mars", "The Sun", "Earth orbits the Sun."),
                        q("wl-68-3", "What do bees help many flowers do?", "Pollen moves from flower to flower.", "Make seeds", "Turn into trees", "Make rain", "Make seeds", "Pollination helps many plants make seeds."),
                        q("wl-68-4", "Which part of a plant takes in water from the soil?", "It grows below the ground.", "Petals", "Roots", "Fruit", "Roots", "Roots absorb water and help hold the plant in place."),
                        q("wl-68-5", "What can happen to a puddle on a sunny day?", "The Sun warms the water.", "It evaporates", "It turns to ice", "It becomes sand", "It evaporates", "Warm liquid water can evaporate into water vapour."),
                        q("wl-68-6", "What does your backbone help protect?", "It runs down your back.", "Your spinal cord", "Your stomach", "Your lungs", "Your spinal cord", "The backbone protects the spinal cord and supports the body.")
                ),
                "9-12", List.of(
                        q("wl-912-1", "What does a plant use sunlight for during photosynthesis?", "Plants use light energy to make their own food.", "Making food", "Making rocks", "Finding water with leaves", "Making food", "Photosynthesis uses light, water, and carbon dioxide to make sugar."),
                        q("wl-912-2", "What force pulls objects toward Earth?", "It keeps your feet on the ground.", "Magnetism", "Gravity", "Friction", "Gravity", "Gravity is the attraction between objects with mass."),
                        q("wl-912-3", "Why does the Moon appear to change shape during the month?", "The Moon stays round; we see different parts lit by the Sun.", "Clouds cover it", "We see different sunlit parts", "It grows and shrinks", "We see different sunlit parts", "The Moon's phases depend on its position around Earth and sunlight."),
                        q("wl-912-4", "Which organ pumps blood around your body?", "You can feel it beating in your chest.", "Lungs", "Heart", "Stomach", "Heart", "The heart pumps blood through blood vessels."),
                        q("wl-912-5", "In a food chain, what is a predator?", "It gets energy by hunting other animals.", "An animal that hunts other animals", "A plant that makes seeds", "An animal that only eats rocks", "An animal that hunts other animals", "Predators hunt prey for food."),
                        q("wl-912-6", "Clouds form when water vapour cools and…", "Cooling turns vapour into tiny liquid droplets.", "Condenses", "Combusts", "Freezes into metal", "Condenses", "Condensation changes water vapour into tiny liquid droplets.")
                )
        ));

        bank.put("bubble-pop", Map.of(
                "3-5", List.of(
                        q("bp-35-1", "Pop the answer: 2 + 1 = ?", "Count two, then one more.", "2", "3", "4", "3", "Two plus one makes three."),
                        q("bp-35-2", "Pop the answer: 5 − 2 = ?", "Count two steps back from five.", "2", "3", "4", "3", "Five take away two leaves three."),
                        q("bp-35-3", "What comes next after 6?", "Count one step forward.", "5", "7", "8", "7", "Seven comes right after six."),
                        q("bp-35-4", "Which number is bigger?", "Compare the two numbers.", "2", "4", "Both are the same", "4", "Four is bigger than two."),
                        q("bp-35-5", "Pop the answer: 1 + 1 = ?", "One more than one makes…", "1", "2", "3", "2", "One plus one makes a pair of two."),
                        q("bp-35-6", "A square has how many sides?", "Count each straight edge.", "3", "4", "5", "4", "A square has four equal sides.")
                ),
                "6-8", List.of(
                        q("bp-68-1", "Pop the answer: 6 + 9 = ?", "Make ten first, then add the rest.", "14", "15", "16", "15", "Six plus nine equals fifteen."),
                        q("bp-68-2", "Pop the answer: 3 × 4 = ?", "Think of three groups of four.", "7", "12", "14", "12", "Three groups of four make twelve."),
                        q("bp-68-3", "Pop the answer: 18 − 7 = ?", "Take seven away from eighteen.", "10", "11", "12", "11", "Eighteen minus seven equals eleven."),
                        q("bp-68-4", "Pop the answer: 5 × 5 = ?", "Count five groups of five.", "20", "25", "30", "25", "Five times five is twenty-five."),
                        q("bp-68-5", "4, 8, 12, __. What comes next?", "The pattern jumps by four.", "14", "16", "18", "16", "Adding four to twelve gives sixteen."),
                        q("bp-68-6", "Pop the answer: 42 ÷ 6 = ?", "How many groups of six make forty-two?", "6", "7", "8", "7", "Six times seven is forty-two, so the answer is seven.")
                ),
                "9-12", List.of(
                        q("bp-912-1", "Pop the answer: ⅖ of 30 = ?", "Find one fifth, then take two of those parts.", "10", "12", "15", "12", "One fifth of thirty is six; two fifths is twelve."),
                        q("bp-912-2", "Pop the answer: 9² = ?", "Nine squared means nine times nine.", "18", "72", "81", "81", "Nine multiplied by nine equals eighty-one."),
                        q("bp-912-3", "Which fraction equals 0.75?", "Think of three quarters of a whole.", "¾", "⅔", "⅘", "¾", "Three divided by four is 0.75."),
                        q("bp-912-4", "Pop the answer: 144 ÷ 12 = ?", "Use twelve times what equals 144?", "10", "12", "14", "12", "Twelve times twelve is 144."),
                        q("bp-912-5", "A 4 by 7 rectangle has what perimeter?", "Add all four sides around the outside.", "11", "22", "28", "22", "Four plus seven plus four plus seven equals twenty-two."),
                        q("bp-912-6", "Pop the answer: 25% of 80 = ?", "Twenty-five percent is one quarter.", "15", "20", "25", "20", "One quarter of eighty is twenty.")
                )
        ));

        bank.put("word-builder", Map.of(
                "3-5", List.of(
                        spelling("wb-35-1", "Build the name of this pet: 🐱", "It purrs and says meow.", "CAT", "Cats are pets with whiskers, paws, and a purr."),
                        spelling("wb-35-2", "Build the word for this bright sky friend: ☀️", "It shines in the daytime.", "SUN", "The Sun is the star that lights our daytime sky."),
                        spelling("wb-35-3", "Build the name of this pet: 🐶", "It wags its tail and says woof.", "DOG", "Dog is the word for this four-legged animal."),
                        spelling("wb-35-4", "Build a tiny buzzing helper: 🐝", "It visits flowers and makes honey.", "BEE", "Bees carry pollen between flowers."),
                        spelling("wb-35-5", "Build this tiny new plant part: 🌿", "It can grow into a flower or a new leaf.", "BUD", "A bud is a small new growth that can develop into a leaf or flower."),
                        spelling("wb-35-6", "Build the name of this hopping animal: 🐸", "It can live near a pond.", "FROG", "A frog is an amphibian that can live in water and on land.")
                ),
                "6-8", List.of(
                        spelling("wb-68-1", "Build the word for our home planet: 🌍", "We live here; it starts with P.", "PLANET", "Earth is one of the planets that orbit the Sun."),
                        spelling("wb-68-2", "Build the place where flowers grow: 🌷", "A place to plant seeds and watch them bloom.", "GARDEN", "A garden is a place where plants can grow."),
                        spelling("wb-68-3", "Build the word for a fun challenge: 🧩", "You solve it one piece at a time.", "PUZZLE", "A puzzle asks you to fit clues or pieces together."),
                        spelling("wb-68-4", "Build the word for a space ship: 🚀", "It can carry people beyond Earth.", "ROCKET", "A rocket uses thrust to travel up through the atmosphere."),
                        spelling("wb-68-5", "Build the place with many trees: 🌲", "Birds and animals may make a home here.", "FOREST", "A forest is an ecosystem with many trees and other living things."),
                        spelling("wb-68-6", "Build the name of this long-eared animal: 🐰", "It hops and has two long ears.", "RABBIT", "Rabbits are mammals with strong back legs for hopping.")
                ),
                "9-12", List.of(
                        spelling("wb-912-1", "Build the force that pulls things together: 🍎", "It keeps planets in orbit and apples on the ground.", "GRAVITY", "Gravity is the attraction between objects that have mass."),
                        spelling("wb-912-2", "Build the place where an organism lives: 🐾", "It provides food, water, and shelter.", "HABITAT", "A habitat is the natural home of a living thing."),
                        spelling("wb-912-3", "Build a word for eager to learn: 🔎", "A good explorer is this.", "CURIOUS", "Curious means wanting to know or learn something."),
                        spelling("wb-912-4", "Build the math word for equal parts: 🍕", "A half and a quarter are examples.", "FRACTION", "A fraction describes part of a whole."),
                        spelling("wb-912-5", "Build the word for a trip or experience: 🗺️", "It can be a long trip or a personal adventure.", "JOURNEY", "A journey is a trip from one place or stage to another."),
                        spelling("wb-912-6", "Build a word meaning to look into something: 🔭", "Scientists do this when they investigate.", "EXPLORE", "To explore is to investigate or travel through a place.")
                )
        ));

        bank.put("habitat-match", Map.of(
                "3-5", List.of(
                        q("hm-35-1", "🐠 Help me find a home!", "I swim and breathe with gills.", "🌳 Forest", "🌊 Ocean", "🏜️ Desert", "🌊 Ocean", "Many fish live in oceans, rivers, and lakes."),
                        q("hm-35-2", "🐸 Help me find a home!", "I like wet places and can hop.", "🌊 Ocean", "🌵 Dry desert", "🪷 Pond", "🪷 Pond", "Frogs often live near ponds and wetlands."),
                        q("hm-35-3", "🐻 Help me find a home!", "I can climb trees and look for berries.", "🌳 Forest", "🏖️ Beach", "🏙️ City", "🌳 Forest", "Forests give bears food and places to shelter."),
                        q("hm-35-4", "🦆 Help me find a home!", "I paddle and swim on the water.", "🪷 Pond", "🏜️ Desert", "🧊 Ice cave", "🪷 Pond", "Ducks often live near ponds, lakes, and wetlands."),
                        q("hm-35-5", "🐫 Help me find a home!", "I can handle hot, dry weather.", "🌲 Forest", "🏜️ Desert", "🌊 Ocean", "🏜️ Desert", "Camels are adapted to live in hot desert environments."),
                        q("hm-35-6", "🐧 Help me find a home!", "I am a bird that likes chilly places.", "🌴 Rainforest", "🧊 Polar coast", "🏜️ Desert", "🧊 Polar coast", "Many penguins live on cool southern coasts and islands.")
                ),
                "6-8", List.of(
                        q("hm-68-1", "🦊 Which habitat suits me?", "I hunt small animals and need places to hide.", "🌳 Woodland", "🌊 Coral reef", "🏜️ Sand dunes", "🌳 Woodland", "Foxes can shelter and hunt in woodland habitats."),
                        q("hm-68-2", "🐻‍❄️ Which habitat suits me?", "I have thick fur and live where sea ice forms.", "🏜️ Desert", "🧊 Arctic", "🌴 Rainforest", "🧊 Arctic", "Polar bears live in the Arctic and depend on sea ice for hunting."),
                        q("hm-68-3", "🐪 Which habitat suits me?", "I can travel across hot, dry land.", "🏜️ Desert", "🌳 Forest", "🪸 Reef", "🏜️ Desert", "Camels are adapted to hot desert environments."),
                        q("hm-68-4", "🐬 Which habitat suits me?", "I swim, breathe air, and live in salt water.", "🌊 Ocean", "🌲 Forest", "🌾 Grassland", "🌊 Ocean", "Dolphins are marine mammals that live in oceans."),
                        q("hm-68-5", "🦉 Which habitat suits me?", "I can roost in trees and hunt small animals.", "🌳 Forest", "🏙️ City street", "🏜️ Desert", "🌳 Forest", "Many owl species nest or roost in trees."),
                        q("hm-68-6", "🦎 Which habitat suits me?", "I bask in the sun and need a warm, dry place.", "🏜️ Desert", "🧊 Arctic", "🌊 Deep ocean", "🏜️ Desert", "Some lizards are adapted to warm, dry desert habitats.")
                ),
                "9-12", List.of(
                        q("hm-912-1", "🦜 Match this animal to its habitat.", "It needs warm, wet weather and tall trees.", "🌴 Tropical rainforest", "🧊 Tundra", "🌊 Open ocean", "🌴 Tropical rainforest", "Tropical rainforests are warm, wet ecosystems with layered forests."),
                        q("hm-912-2", "🦭 Match this animal to its habitat.", "It has thick insulation for very cold regions.", "🌾 Grassland", "🧊 Polar coast", "🏜️ Desert", "🧊 Polar coast", "Seals use blubber and fur to stay warm in cold seas."),
                        q("hm-912-3", "🦀 Match this animal to its habitat.", "It thrives where fresh water and seawater meet among trees.", "🌿 Mangrove forest", "🌲 Pine forest", "🏔️ Alpine meadow", "🌿 Mangrove forest", "Mangroves are salt-tolerant trees that shelter many coastal species."),
                        q("hm-912-4", "🦓 Match this animal to its habitat.", "It grazes across wide, open areas with seasonal rain.", "🌾 Savanna grassland", "🪸 Coral reef", "🧊 Tundra", "🌾 Savanna grassland", "Savannas are grasslands with scattered trees and wet and dry seasons."),
                        q("hm-912-5", "🐸 Match this animal to its habitat.", "It depends on clean, shallow water for breeding.", "🏜️ Sand desert", "💧 Wetland", "🌋 Lava field", "💧 Wetland", "Wetlands support amphibians with water and sheltered breeding places."),
                        q("hm-912-6", "🐙 Match this animal to its habitat.", "It lives in salt water and uses camouflage among rocks.", "🌊 Coastal ocean", "🌲 Boreal forest", "🏔️ Mountain peak", "🌊 Coastal ocean", "Many octopuses live on the ocean floor in coastal waters.")
                )
        ));

        bank.put("moon-meadow-quest", Map.of(
                "3-5", List.of(
                        q("mm-35-1", "The moon gate has a number pattern: 1, 2, __", "Count one step forward each time.", "3", "4", "5", "3", "Counting forward takes us from one to two to three."),
                        q("mm-35-2", "Two stepping stones and one more make how many?", "Count all the stones together.", "2", "3", "4", "3", "Two plus one makes three stepping stones."),
                        q("mm-35-3", "Which letter starts MOON?", "Say the first sound: mmm-oon.", "M", "S", "T", "M", "Moon starts with the letter M."),
                        q("mm-35-4", "Which one shines by making its own light?", "Look up on a clear night.", "A star", "The Moon", "A cloud", "A star", "Stars make their own light. The Moon reflects sunlight."),
                        q("mm-35-5", "Luna has 3 star seeds and finds 1 more. How many?", "Count three, then one more.", "3", "4", "5", "4", "Three plus one makes four star seeds.")
                ),
                "6-8", List.of(
                        q("mm-68-1", "The trail marks a pattern: 3, 6, 9, __", "Add the same amount each time.", "11", "12", "13", "12", "The pattern adds three, so the next number is twelve."),
                        q("mm-68-2", "Twelve stepping stones are shared into 3 equal paths. How many per path?", "Split twelve into three equal groups.", "3", "4", "5", "4", "Twelve divided into three equal groups gives four."),
                        q("mm-68-3", "Which word rhymes with LIGHT?", "Listen for the ending sound.", "Night", "Leaf", "Moon", "Night", "Light and night share the same -ight ending sound."),
                        q("mm-68-4", "Why does the Moon look bright at night?", "The Moon is near Earth, but it is not a star.", "It reflects sunlight", "It makes its own light", "It is made of fire", "It reflects sunlight", "Sunlight bounces off the Moon and reaches our eyes."),
                        q("mm-68-5", "Luna finds 4 star seeds, then 5 more. How many?", "Add the two groups.", "8", "9", "10", "9", "Four plus five equals nine star seeds.")
                ),
                "9-12", List.of(
                        q("mm-912-1", "The glowing trail follows 4, 9, 14, __", "Find how much the pattern increases each time.", "18", "19", "20", "19", "The pattern adds five, so the next number is nineteen."),
                        q("mm-912-2", "There are 18 bridge planks. One third glow blue. How many glow blue?", "Divide by three to find one third.", "3", "6", "9", "6", "One third of eighteen is six."),
                        q("mm-912-3", "Choose the correct word: “The owl ___ at night.”", "Pick the present-tense verb that fits one owl.", "fly", "flies", "flying", "flies", "For one owl, the present-tense verb is flies."),
                        q("mm-912-4", "Why do stars look like tiny dots in the sky?", "Stars are enormous, but they are very far away.", "They are very far from Earth", "They are smaller than the Moon", "They only shine at night", "They are very far from Earth", "Stars are distant suns; their great distance makes them look tiny."),
                        q("mm-912-5", "The Moonstone needs a final code: what is 36 ÷ 4?", "Think of four times what makes thirty-six.", "8", "9", "10", "9", "Four times nine is thirty-six, so thirty-six divided by four is nine.")
                )
        ));

        bank.put("jungle-treasure", Map.of(
                "3-5", List.of(
                        q("jt-35-1", "You face a tall tree. The river is on your left. Which way is the river?", "Look at the direction the map tells you.", "Left", "Right", "Up", "Left", "Left and right help us describe directions."),
                        q("jt-35-2", "The vine gate has a word clue. Which letter starts LEAF?", "Say the first sound in leaf.", "L", "F", "S", "L", "Leaf begins with the letter L."),
                        q("jt-35-3", "The toucan finds 2 bananas, then 2 more. How many?", "Count both groups together.", "3", "4", "5", "4", "Two plus two makes four bananas."),
                        q("jt-35-4", "Where does a bird usually lay its eggs?", "It builds this safe place with twigs.", "A nest", "A cave", "A pond", "A nest", "Birds build nests to hold and protect their eggs."),
                        q("jt-35-5", "Which animal might live in a warm jungle?", "Think of an animal that climbs trees.", "Monkey", "Penguin", "Polar bear", "Monkey", "Many monkeys live in warm forests and climb trees.")
                ),
                "6-8", List.of(
                        q("jt-68-1", "On a map, north is ahead. Which direction is on your right?", "Turn a quarter turn to the right from north.", "East", "West", "South", "East", "When north is ahead, east is to your right."),
                        q("jt-68-2", "A place with many trees is a…", "It can be home to birds, insects, and mammals.", "Forest", "Desert", "Ocean", "Forest", "A forest is a habitat with many trees."),
                        q("jt-68-3", "Five baskets hold 3 mangoes each. How many mangoes?", "Add three five times, or multiply.", "8", "15", "20", "15", "Five groups of three make fifteen mangoes."),
                        q("jt-68-4", "Which living thing makes its own food in a forest food chain?", "It uses sunlight to make food.", "Grass", "Fox", "Owl", "Grass", "Plants such as grass are producers in a food chain."),
                        q("jt-68-5", "A frog is most at home in which habitat?", "It needs a damp place and shallow water.", "Wetland", "Dry dune", "Rocky peak", "Wetland", "Wetlands provide water and damp shelter for frogs.")
                ),
                "9-12", List.of(
                        q("jt-912-1", "The map shows north-east. Which way is that?", "It is halfway between two compass directions.", "Between north and east", "Between south and west", "Straight south", "Between north and east", "North-east is the direction halfway between north and east."),
                        q("jt-912-2", "What do you call the map box that explains its symbols?", "It helps you understand what each mark means.", "Legend", "Border", "Scale", "Legend", "A map legend explains the symbols used on the map."),
                        q("jt-912-3", "The trail is 2.5 km, then another 1.5 km. How far altogether?", "Add the whole numbers and the halves.", "3 km", "4 km", "4.5 km", "4 km", "Two and a half plus one and a half equals four kilometres."),
                        q("jt-912-4", "Which rainforest layer has the tops of most trees?", "It forms a leafy roof high above the forest floor.", "Canopy", "Forest floor", "Underground layer", "Canopy", "The canopy is the leafy upper layer formed by tree crowns."),
                        q("jt-912-5", "Map scale: 1 cm = 2 km. A trail is 3 cm long on the map. How far is it?", "Multiply the map distance by two kilometres per centimetre.", "5 km", "6 km", "8 km", "6 km", "Three centimetres at two kilometres per centimetre represents six kilometres.")
                )
        ));

        bank.put("pattern-puzzler", Map.of(
                "3-5", List.of(
                        q("pp-35-1", "🔴 🔵 🔴 🔵 __. What fits next?", "The colors take turns.", "🔴 Red", "🔵 Blue", "⭐ Star", "🔴 Red", "This is an AB pattern: red, blue, red, blue, then red."),
                        q("pp-35-2", "🐱 🐶 🐱 🐶 __. Which friend is next?", "The two animals take turns.", "🐱 Cat", "🐟 Fish", "🐶 Dog", "🐱 Cat", "The pattern repeats cat, dog, cat, dog."),
                        q("pp-35-3", "2, 4, 6, __. What is the next number?", "The numbers jump by two.", "7", "8", "9", "8", "Adding two to six gives eight."),
                        q("pp-35-4", "☀️ 🌙 ☀️ 🌙 __. What comes next?", "Look for the picture that starts the pattern.", "☀️ Sun", "⭐ Star", "🌙 Moon", "☀️ Sun", "The sun and moon take turns, so the sun comes next."),
                        q("pp-35-5", "Which one does not belong: 🍎 apple, 🍌 banana, 🏀 ball?", "Two are foods you can eat.", "🍎 Apple", "🍌 Banana", "🏀 Ball", "🏀 Ball", "A ball is a toy; the apple and banana are fruit.")
                ),
                "6-8", List.of(
                        q("pp-68-1", "5, 10, 15, __. What is next?", "Add the same number each time.", "18", "20", "25", "20", "The pattern adds five, so the next number is twenty."),
                        q("pp-68-2", "1, 1, 2, 3, 5, __. What comes next?", "Add the last two numbers to get the next one.", "7", "8", "10", "8", "Five plus three is eight. This pattern is part of the Fibonacci sequence."),
                        q("pp-68-3", "A shape pattern has 3, 4, 3, 4 corners. What comes next?", "The shapes alternate between two counts.", "3 corners", "4 corners", "5 corners", "3 corners", "The pattern alternates three corners and four corners."),
                        q("pp-68-4", "All zips are round. Dot is a zip. What must be true?", "Use both clues together.", "Dot is round", "Dot is blue", "All round things are zips", "Dot is round", "If every zip is round and Dot is a zip, Dot must be round."),
                        q("pp-68-5", "Which number completes the rule: 2 → 5, 3 → 7, 4 → 9, 5 → __?", "Double the first number, then add one.", "10", "11", "12", "11", "Five doubled is ten; one more makes eleven.")
                ),
                "9-12", List.of(
                        q("pp-912-1", "2, 6, 12, 20, __. What comes next?", "The differences grow by two each time.", "28", "30", "32", "30", "The gaps are 4, 6, 8, then 10, so twenty plus ten is thirty."),
                        q("pp-912-2", "3, 9, 27, __. What comes next?", "Multiply by the same number each time.", "54", "72", "81", "81", "Each number is multiplied by three, so twenty-seven times three is eighty-one."),
                        q("pp-912-3", "A code changes CAT to DBU by moving each letter forward once. What is DOG?", "Move D, O, and G forward by one letter.", "EPH", "CNG", "EOG", "EPH", "Each letter moves one place forward: D to E, O to P, G to H."),
                        q("pp-912-4", "A box has 3 red, 2 blue, and 1 green token. Which color is least likely?", "Compare how many of each color there are.", "Red", "Blue", "Green", "Green", "There is only one green token, so green is least likely."),
                        q("pp-912-5", "If every nori is a vega and every vega is a luma, what is every nori?", "Follow the chain of categories.", "A luma", "A bird", "A number", "A luma", "A nori is a vega, and every vega is a luma, so every nori is a luma.")
                )
        ));

        bank.put("wildlife-scout", Map.of(
                "3-5", List.of(
                        q("wsct-35-1", "🌼 Find the bee in the flower garden!", "It has wings and buzzes from flower to flower.", "🐝 Bee", "🐸 Frog", "🦉 Owl", "🐝 Bee", "Bees visit flowers to collect nectar and pollen."),
                        q("wsct-35-2", "💧 Find the fish by the pond!", "It has fins and lives in water.", "🐰 Rabbit", "🐟 Fish", "🐦 Bird", "🐟 Fish", "Fish use fins to swim and gills to breathe in water."),
                        q("wsct-35-3", "🌿 Find the frog near the wet leaves!", "It can hop and likes damp places.", "🐸 Frog", "🐫 Camel", "🐱 Cat", "🐸 Frog", "Frogs often live near ponds and wetlands."),
                        q("wsct-35-4", "🌸 Find the butterfly!", "It begins life as a caterpillar.", "🦋 Butterfly", "🐢 Turtle", "🐠 Fish", "🦋 Butterfly", "A butterfly changes from a caterpillar during its life cycle."),
                        q("wsct-35-5", "🌳 Find the bird that builds a nest!", "It has feathers and can fly.", "🐦 Bird", "🐸 Frog", "🐟 Fish", "🐦 Bird", "Many birds build nests to protect their eggs and chicks.")
                ),
                "6-8", List.of(
                        q("wsct-68-1", "🌲 Spot the animal with a ringed tail!", "It is a small mammal that lives in Asian forests.", "🦝 Raccoon", "🐼 Red panda", "🦌 Deer", "🐼 Red panda", "Red pandas live in mountain forests and eat mostly bamboo."),
                        q("wsct-68-2", "🧊 Find the Arctic animal with thick white fur!", "It hunts seals on sea ice.", "🐻‍❄️ Polar bear", "🦊 Fox", "🐧 Penguin", "🐻‍❄️ Polar bear", "Polar bears live in the Arctic and rely on sea ice for hunting."),
                        q("wsct-68-3", "🌊 Find the mammal that uses echolocation!", "It sends sounds and listens for echoes.", "🐬 Dolphin", "🐢 Turtle", "🦀 Crab", "🐬 Dolphin", "Dolphins use echolocation to find objects and prey underwater."),
                        q("wsct-68-4", "🌿 Find the animal that carries its home on its back!", "It is a slow-moving reptile.", "🐢 Turtle", "🦋 Butterfly", "🐿️ Squirrel", "🐢 Turtle", "A turtle's shell is part of its skeleton and protects its body."),
                        q("wsct-68-5", "🌳 Find the animal that helps spread seeds by burying them!", "It gathers nuts and sometimes forgets where they are.", "🐿️ Squirrel", "🐸 Frog", "🐟 Fish", "🐿️ Squirrel", "Forgotten buried seeds can grow into new plants.")
                ),
                "9-12", List.of(
                        q("wsct-912-1", "🌿 Spot the pollinator that also produces honey!", "It lives in a colony and performs a waggle dance.", "🐝 Honey bee", "🦗 Grasshopper", "🐞 Ladybird", "🐝 Honey bee", "Honey bees pollinate plants and communicate food locations with dances."),
                        q("wsct-912-2", "🪸 Find the animal that builds coral reefs!", "Tiny members of this group live together in colonies.", "🪼 Jellyfish", "🪸 Coral polyp", "🐙 Octopus", "🪸 Coral polyp", "Coral polyps build calcium-carbonate skeletons that form reefs."),
                        q("wsct-912-3", "🌙 Find the nocturnal mammal that can fly!", "It uses sound echoes to navigate at night.", "🦇 Bat", "🦉 Owl", "🦋 Moth", "🦇 Bat", "Bats are mammals; many species use echolocation to find their way."),
                        q("wsct-912-4", "🏜️ Spot the animal that stores fat in its hump!", "That reserve helps it survive when food is scarce.", "🐫 Camel", "🦒 Giraffe", "🦓 Zebra", "🐫 Camel", "A camel's hump stores fat, which can be used for energy."),
                        q("wsct-912-5", "🌊 Find the ocean animal with three hearts!", "Two hearts send blood to its gills.", "🐙 Octopus", "🐬 Dolphin", "🦈 Shark", "🐙 Octopus", "An octopus has three hearts and blue blood that contains copper-based hemocyanin.")
                )
        ));
        return bank;
    }

    private record MemoryPair(String id, String face, String label, String fact) {}

    private Question spelling(String id, String prompt, String hint, String answer, String lesson) {
        List<String> letters = new ArrayList<>(Arrays.asList(answer.split("")));
        Collections.shuffle(letters);
        if (String.join("", letters).equalsIgnoreCase(answer)) {
            Collections.rotate(letters, 1);
        }
        return new Question(id, prompt, hint, letters, answer, lesson);
    }

    private Question q(String id, String prompt, String hint, String first, String second, String third, String answer, String lesson) {
        return new Question(id, prompt, hint, List.of(first, second, third), answer, lesson);
    }
}
