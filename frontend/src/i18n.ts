import { ageCopyMr, gameCopyMr, hindiTextMr, questionTextMr, subjectsMr, textMr } from './marathi-data';

export type Language = 'en' | 'hi' | 'mr';

export const subjectsHi: Record<string, string> = {
  'all': 'सभी खेल', 'Math magic': 'गणित की मस्ती', 'Word adventures': 'शब्दों का रोमांच', 'Science wonders': 'विज्ञान के कमाल',
  'Adventure & Treasure Hunt': 'रोमांच और खजाने की खोज', 'Memory Games': 'याददाश्त के खेल', 'Puzzle & Logic': 'पहेली और तर्क',
  'Art & Creativity': 'कला और रचनात्मकता', 'Geography & World Explorer': 'भूगोल और दुनिया की सैर', 'Animals & Nature': 'जानवर और प्रकृति',
  'Music & Rhythm': 'संगीत और ताल', 'Coding & Computational Thinking': 'कोडिंग और सोच', 'Life Skills & Good Habits': 'जीवन कौशल और अच्छी आदतें',
  'Emotions & Social Skills': 'भावनाएँ और सामाजिक कौशल', 'Time & Calendar': 'समय और कैलेंडर', 'History & Culture': 'इतिहास और संस्कृति',
  'Money & Financial Literacy': 'पैसा और समझदारी', 'Sports & Movement': 'खेल और गतिविधि', 'Interactive Stories & Reading': 'कहानियाँ और पढ़ना',
};

export const ageCopyHi: Record<string, string> = {
  'Little explorers': 'नन्हे खोजी', 'Curious minds': 'जिज्ञासु बच्चे', 'Big thinkers': 'बड़े विचारक',
  'Ages 3–5': 'उम्र 3–5 साल', 'Ages 6–8': 'उम्र 6–8 साल', 'Ages 9–12': 'उम्र 9–12 साल',
};

export const gameCopyHi: Record<string, [string, string]> = {
  'number-garden': ['अंकों का बगीचा', 'गिनो, पैटर्न पहचानो और गणित की ताकत बढ़ाओ।'],
  'bubble-pop': ['बुलबुला फोड़ो', 'सही जवाब का बुलबुला फोड़ो और अंकों को उछलते रहने दो।'],
  'word-safari': ['शब्द सफारी', 'इशारे समझो, नए शब्द सीखो और शब्दों के खोजी बनो।'],
  'word-builder': ['शब्द बनाओ', 'इशारा समझो, अक्षर जोड़ो और शब्द बनाओ।'],
  'wonder-lab': ['कमाल की प्रयोगशाला', 'प्रकृति, अंतरिक्ष और चीज़ों के काम करने के बारे में जानो।'],
  'habitat-match': ['जानवरों का घर', 'हर जीव को जंगल में उसका सही घर ढूँढ़ने में मदद करो।'],
  'moon-meadow-quest': ['चाँदनी मैदान का रोमांच', 'लूना को चाँद का रत्न ढूँढ़कर आकाश-वृक्ष तक पहुँचाने में मदद करो।'],
  'jungle-treasure': ['जंगल का खजाना', 'नक्शे का पीछा करो और जंगल में छिपा खजाना खोजो।'],
  'memory-garden': ['याददाश्त का बगीचा', 'पत्ते पलटो, जोड़े मिलाओ और प्रकृति के मज़ेदार तथ्य जानो।'],
  'pattern-puzzler': ['पैटर्न पहेली', 'पैटर्न पहचानो, संकेत सुलझाओ और खाली जगह भरो।'],
  'doodle-studio': ['चित्रकारी कोना', 'नई दुनिया बनाओ, जीव की कल्पना करो और अपनी कला सहेजो।'],
  'wildlife-scout': ['वन्यजीव खोजी', 'जंगल में जीव ढूँढ़ो और जानो कि वे कैसे रहते हैं।'],
  'code-critters': ['कोड वाले दोस्त', 'निर्देशों से छोटे जीव को भूलभुलैया पार कराओ।'],
  'flip-card-match': ['ताश के पत्ते मिलाओ', 'एक बार में दो पत्ते पलटो और सभी जोड़े ढूँढ़ो।'],
  'remember-sequence': ['क्रम याद रखो', 'रोशनी का क्रम देखो, याद रखो और फिर दोहराओ।'],
  'missing-object': ['गायब चीज़ ढूँढ़ो', 'चित्र ध्यान से देखो और बताओ कौन-सी चीज़ गायब हुई।'],
  'picture-memory': ['चित्र याददाश्त', 'चित्रों के जोड़े मिलाओ और मज़ेदार तथ्य जानो।'],
  'jigsaw-puzzle': ['चित्र पहेली', 'संकेतों की मदद से चित्र के टुकड़े सही जगह लगाओ।'],
  'find-the-pattern': ['पैटर्न पहचानो', 'बदलाव देखो और अगला टुकड़ा चुनो।'],
  'maze-escape': ['भूलभुलैया से बाहर', 'घुमावदार भूलभुलैया में सुरक्षित रास्ता खोजो।'],
  'sudoku-kids': ['बच्चों का सुडोकू', 'खानों में अंक भरो ताकि हर पंक्ति और स्तंभ सही बने।'],
  'spot-difference': ['अंतर पहचानो', 'ध्यान से देखो और अलग चीज़ ढूँढ़ो।'],
  'coloring-book': ['रंग भरो', 'चमकीले रंग चुनो और प्यारे चित्र में रंग भरो।'],
  'free-drawing': ['मुक्त चित्रकारी', 'अपनी कल्पना से चित्र बनाओ और उसे सहेजो।'],
  'complete-picture': ['चित्र पूरा करो', 'मज़ेदार चित्र में अपने मनचाहे विवरण जोड़ो।'],
  'design-your-monster': ['अपना राक्षस बनाओ', 'रंग, आँखें, सींग और मुस्कान चुनकर नया दोस्त बनाओ।'],
  'pixel-art': ['पिक्सेल कला', 'रंगीन छोटे खानों से चित्र बनाओ।'],
  'guess-the-country': ['देश पहचानो', 'नक्शे और झंडे के संकेतों से दुनिया के देश पहचानो।'],
  'flag-match': ['झंडे मिलाओ', 'रंगीन झंडों को सही देशों से मिलाओ।'],
  'world-map-puzzle': ['दुनिया का नक्शा', 'दिशा के संकेतों से जगहों को नक्शे पर रखो।'],
  'famous-landmarks': ['मशहूर स्थल', 'सैर के चित्र में दुनिया की मशहूर जगहें ढूँढ़ो।'],
  'indian-states': ['भारत के राज्य', 'भारत के राज्यों, राजधानियों और जगहों को जानो।'],
  'guess-animal-sound': ['जानवर की आवाज़ पहचानो', 'आवाज़ सुनो और सही जानवर ढूँढ़ो।'],
  'match-animal-homes': ['जानवरों के घर मिलाओ', 'जानवरों को उनकी ज़रूरत के अनुसार घर ढूँढ़ने में मदद करो।'],
  'food-chain': ['खाद्य शृंखला', 'जानो कि पौधे और जानवर एक-दूसरे पर कैसे निर्भर हैं।'],
  'ocean-explorer': ['समुद्र की सैर', 'समुद्र की परतों में जाओ और अद्भुत जीवों से मिलो।'],
  'save-the-forest': ['जंगल बचाओ', 'ऐसे अच्छे विकल्प चुनो जो जंगल को फलने-फूलने दें।'],
  'mini-piano': ['छोटा पियानो', 'रंगीन कीबोर्ड पर अपनी छोटी धुन बजाओ।'],
  'repeat-the-rhythm': ['ताल दोहराओ', 'ताल सुनो और फिर वैसी ही ताल बजाओ।'],
  'guess-instrument': ['वाद्य पहचानो', 'संगीत सुनो और बताओ कौन-सा वाद्य बजा।'],
  'musical-memory': ['संगीत याददाश्त', 'संगीत वाले पत्ते मिलाओ और धुनें याद रखो।'],
  'robot-maze': ['रोबोट की भूलभुलैया', 'रोबोट को दीवार से बचाकर तारे तक पहुँचाओ।'],
  'arrange-commands': ['निर्देश सजाओ', 'चलने के निर्देशों को सही क्रम में लगाओ।'],
  'debug-the-path': ['रास्ते की गलती सुधारो', 'गलत निर्देश ढूँढ़ो और सही रास्ता बनाओ।'],
  'repeat-loop': ['दोहराने वाला कोड', 'दोहराने के निर्देश से छोटे प्रोग्राम को बड़ा काम कराओ।'],
  'healthy-food-sort': ['अच्छे खाने की छँटाई', 'खानों को रोज़ के पौष्टिक भोजन के अनुसार बाँटो।'],
  'morning-routine': ['सुबह की तैयारी', 'सुबह तैयार होने के काम सही क्रम में लगाओ।'],
  'road-safety': ['सड़क सुरक्षा', 'सड़क पर चलने और पार करने के सुरक्षित तरीके पहचानो।'],
  'money-basics': ['पैसों की समझ', 'नकली सिक्कों से छोटे फैसले करना सीखो।'],
  'clean-your-room': ['कमरा साफ़ करो', 'खिलौने, किताबें और कपड़े सही जगह रखो।'],
  'guess-the-emotion': ['भावना पहचानो', 'चेहरे के संकेत देखकर भावना का नाम बताओ।'],
  'kindness-choices': ['दयालु फैसले', 'दोस्त की मदद करने के अच्छे तरीके चुनो।'],
  'friendship-stories': ['दोस्ती की कहानियाँ', 'दोस्ती की कहानी में अच्छे फैसले करो।'],
  'feelings-match': ['भावनाएँ मिलाओ', 'भावनाओं को चेहरों और मददगार शब्दों से मिलाओ।'],
  'set-the-clock': ['घड़ी मिलाओ', 'घड़ी की सुइयाँ सही समय पर रखो।'],
  'what-time': ['कितने बजे हैं?', 'घड़ी के संकेत पढ़ो और समय चुनो।'],
  'arrange-the-days': ['हफ्ते के दिन सजाओ', 'हफ्ते के दिनों को सही क्रम में लगाओ।'],
  'seasons-match': ['मौसम मिलाओ', 'मौसम, कपड़े और प्रकृति को सही ऋतु से मिलाओ।'],
  'timeline-puzzle': ['समयरेखा पहेली', 'महत्वपूर्ण घटनाओं को समय के क्रम में रखो।'],
  'famous-inventors': ['मशहूर आविष्कारक', 'आविष्कारकों और उनके काम बदलने वाले विचारों से मिलो।'],
  'indian-festivals': ['भारत के त्योहार', 'भारत के त्योहारों और परंपराओं को जानो।'],
  'monument-match': ['स्मारक मिलाओ', 'मशहूर स्मारकों को उनकी जगह और कहानी से मिलाओ।'],
  'treasure-island': ['खजाने का द्वीप', 'नक्शे का पीछा करो, संकेत सुलझाओ और खजाना खोजो।'],
  'mystery-quest': ['रहस्यमय खोज', 'संकेत जमा करो और बच्चों के लिए बनी पहेली सुलझाओ।'],
  'hidden-objects': ['छिपी चीज़ें', 'व्यस्त चित्र में खोजी सूची की चीज़ें ढूँढ़ो।'],
  'solve-the-clues': ['संकेत सुलझाओ', 'खज़ाने का संदूक खोलने के लिए चित्र, शब्द और अंक के संकेत सुलझाओ।'],
  'virtual-shop': ['खेल की दुकान', 'दिखावटी चीज़ें चुनो और कीमतें जोड़कर बजट बनाओ।'],
  'count-the-coins': ['सिक्के गिनो', 'कुल रकम जानने के लिए सिक्कों की कीमत जोड़ो।'],
  'needs-vs-wants': ['ज़रूरत या इच्छा?', 'रोज़ की चीज़ों को ज़रूरत और इच्छा में बाँटो।'],
  'save-for-a-toy': ['खिलौने के लिए बचत', 'लक्ष्य तक पहुँचने के लिए सिक्के बचाओ और प्रगति देखो।'],
  'sports-match': ['खेल मिलाओ', 'खेलों को उनके सामान और कौशल से मिलाओ।'],
  'follow-the-movement': ['हरकत दोहराओ', 'स्क्रीन पर दिखाई गई आसान हरकतें दोहराओ।'],
  'balance-challenge': ['संतुलन चुनौती', 'हल्के टैप से संतुलन वाली पट्टी सीधी रखो।'],
  'sports-equipment': ['खेल का सामान', 'जानो कौन-सा सामान किस खेल में काम आता है।'],
  'choose-your-story': ['अपनी कहानी चुनो', 'ऐसे फैसले करो जिनसे कहानी नया मोड़ ले।'],
  'story-pictures': ['कहानी के चित्र सजाओ', 'कहानी के चित्रों को सही क्रम में लगाओ।'],
  'complete-the-ending': ['कहानी का अंत चुनो', 'संकेतों से कहानी का अच्छा अंत चुनो।'],
  'listen-and-answer': ['सुनो और जवाब दो', 'छोटी कहानी सुनो और उसके बारे में जवाब दो।'],
  'crystal-cave-3d': ['3D क्रिस्टल गुफा', 'तीन गुफा मिशन खेलो: क्रिस्टल खोजो, द्वार खोलो और जुगनू को बचाओ।'],
  'solar-system-3d': ['3D अंतरिक्ष बचाव मिशन', 'तीन मिशनों में शटल उड़ाओ, सामान जमा करो, क्षुद्रग्रहों से बचो और सुरक्षित डॉक करो।'],
  'wonder-kart-rally': ['वंडर कार्ट रैली', 'रंगीन दुनिया में दौड़ो, पानी के गड्ढों से बचो और तारे इकट्ठा करो। रास्ता चुनने और गिनने का अभ्यास करो।'],
  'sparkle-target-blaster': ['चमकता लक्ष्य ब्लास्टर', 'तारों और आकृतियों पर जादुई चमक की गेंद चलाओ। यहाँ कोई दुश्मन या लड़ाई नहीं है।'],
};

export const textHi: Record<string, string> = {
  'A happy place to learn': 'सीखने की प्यारी जगह', 'Big imaginations.': 'बड़ी कल्पनाएँ।', 'Brilliant little wins.': 'छोटी-छोटी शानदार जीतें।',
  'Pick an age, choose an adventure, and let curiosity do the rest. Every little answer helps a big brain grow.': 'पहले उम्र चुनो, फिर रोमांचक खेल चुनो। हर जवाब तुम्हारी समझ को बढ़ाता है।',
  'Let’s play': 'चलो खेलें', 'See my star garden': 'मेरे सितारे देखो', 'Made for curious kids ages 3–12': '3–12 साल के जिज्ञासु बच्चों के लिए',
  'Choose your quest': 'अपना खेल चुनो', 'Where shall we': 'कहाँ', 'explore?': 'घूमेंगे?', 'Short, cheerful games made to match your growing brain.': 'तुम्हारी बढ़ती समझ के लिए छोटे और मज़ेदार खेल।',
  'I’m in the': 'मेरी उम्र', 'All games': 'सभी खेल', Math: 'गणित', Words: 'शब्द', Science: 'विज्ञान',
  'Just 3–4 minutes each': 'हर खेल 8–10 मिनट', 'Finding your adventures…': 'तुम्हारे खेल ढूँढ़ रहे हैं…',
  'We can’t reach the adventure map yet.': 'खेलों का नक्शा अभी नहीं खुला।', 'Start the Java API, then refresh the page.': 'Java API शुरू करके पन्ना फिर खोलें।',
  'Play': 'खेलो', 'Browse all': 'सभी खेल देखें', 'Show fewer games': 'कम खेल दिखाएँ',
  'Your own little wins': 'तुम्हारी छोटी जीतें', 'Look how you’re': 'देखो, तुम कैसे', 'growing!': 'बढ़ रहे हो!',
  'Every correct answer adds a star. Keep exploring to unlock your next garden badge.': 'हर सही जवाब पर एक सितारा मिलता है। खेलते रहो और अगला बैज पाओ।',
  'stars collected': 'सितारे मिले', 'quests finished': 'खेल पूरे किए', 'Your garden badge': 'तुम्हारा बगीचा बैज',
  'A note for grown-ups': 'बड़ों के लिए एक बात', 'WonderSprout keeps play simple: no account needed, and your child’s stars stay in this browser.': 'WonderSprout में खाता बनाने की ज़रूरत नहीं। बच्चे के सितारे इसी ब्राउज़र में रहते हैं।',
  'Play a little. Learn a lot.': 'खूब खेलो, खूब सीखो।', 'Back to top': 'ऊपर जाएँ', 'Filter by subject': 'विषय से चुनें',
  'Wonderful work, explorer!': 'शानदार काम, खोजी!', 'Quest complete!': 'खेल पूरा हुआ!', 'Getting your questions ready…': 'सवाल तैयार हो रहे हैं…',
  'Try again': 'फिर कोशिश करो', 'Play again': 'फिर खेलो', 'Choose another quest': 'दूसरा खेल चुनो', 'Close game': 'खेल बंद करें', 'Back to games': 'खेलों पर लौटें',
  'Question': 'सवाल', 'Trail stop': 'रास्ते का पड़ाव', 'Choose an answer': 'जवाब चुनो', 'Checking your answer…': 'जवाब जाँचा जा रहा है…',
  'Checking the answer…': 'जवाब जाँचा जा रहा है…', 'Keep trying — that’s how brains grow!': 'कोशिश करते रहो—इसी से समझ बढ़ती है!',
  'stars this quest': 'सितारे इस खेल में', 'Finish': 'पूरा करें', 'Finish quest': 'खेल पूरा करें', 'Go onward': 'आगे बढ़ो', 'Next': 'अगला',
  'Let’s try that again.': 'चलो, फिर कोशिश करें।', 'Good try! Take another look at the clue.': 'अच्छी कोशिश! संकेत को फिर से देखो।',
  'Not quite, adventurer—have another try!': 'अभी नहीं, खोजी—एक बार और कोशिश करो!', 'You can try again. Use the clue above and keep exploring.': 'फिर कोशिश करो। ऊपर के संकेत से आगे खोजो।',
  'Save picture': 'चित्र सहेजें', 'I’m finished': 'मेरा चित्र तैयार', 'YOUR CREATIVE MISSION': 'तुम्हारा कला मिशन', 'New idea': 'नया विचार',
  'Brush': 'ब्रश', 'Clear': 'मिटाएँ', 'Save picture ↓': 'चित्र सहेजें ↓', 'Choose a drawing color': 'चित्र का रंग चुनें',
  'Help the critter reach the berry!': 'छोटे जीव को बेरी तक पहुँचाओ!', 'A program is a list of steps. Put the arrows in order, then press Run.': 'प्रोग्राम निर्देशों की सूची है। तीर सही क्रम में लगाओ और चलाओ।',
  'Add arrow blocks, then run your program.': 'तीर जोड़ो और अपना प्रोग्राम चलाओ।', 'Add at least one arrow block first.': 'पहले कम से कम एक तीर जोड़ो।',
  'Running your instructions…': 'निर्देश चल रहे हैं…', 'You found the snack! Your sequence worked!': 'तुमने खाना ढूँढ़ लिया! तुम्हारे निर्देश सही चले!',
  'Oops, that step went off the path. Edit your blocks and try again!': 'अरे! रास्ता छूट गया। निर्देश बदलकर फिर कोशिश करो!',
  'A rock is in the way. Change your instructions and try a new route!': 'रास्ते में पत्थर है। निर्देश बदलो और नया रास्ता चुनो!',
  'The critter is safe, but not home yet. Change or add a block and try again.': 'छोटा जीव सुरक्षित है, पर घर नहीं पहुँचा। निर्देश बदलकर फिर कोशिश करो।',
 '1 · Choose an instruction': '1 · निर्देश चुनो', '2 · Your program': '2 · तुम्हारा प्रोग्राम',
  'Your arrows will appear here': 'तुम्हारे तीर यहाँ दिखेंगे', 'Reset': 'फिर से शुरू', 'Run program': 'प्रोग्राम चलाओ',
  'Watch, remember, repeat!': 'देखो, याद रखो, दोहराओ!', 'The sequence will hide in a moment.': 'क्रम अभी छिप जाएगा।',
  'Tap each tile in the right order.': 'हर टाइल सही क्रम में दबाओ।', 'Look closely and remember the order!': 'ध्यान से देखो और क्रम याद रखो!',
  'Show sequence again': 'क्रम फिर दिखाओ', 'Can you spot what is missing?': 'क्या तुम गायब चीज़ ढूँढ़ सकते हो?',
  'Look at the picture row, then choose the one that vanished.': 'चित्रों को देखो, फिर बताओ कौन-सा गायब हुआ।',
  'Each row and column needs 1, 2, 3, and 4. Tap a blank square to change it.': 'हर पंक्ति और स्तंभ में 1, 2, 3 और 4 होना चाहिए। खाली खाने को दबाकर अंक बदलो।',
  'Some squares need another look. Try counting across each row!': 'कुछ खानों को फिर देखो। हर पंक्ति के अंक गिनो!', 'Check my grid': 'मेरी पहेली जाँचो',
  'Build a brand-new monster friend!': 'एक नया राक्षस दोस्त बनाओ!', 'Pick its color, eyes, smile, and special top.': 'उसका रंग, आँखें, मुस्कान और सिर की सजावट चुनो।',
  'My monster is ready!': 'मेरा राक्षस तैयार!', 'Color': 'रंग', 'Eyes': 'आँखें', 'Smile': 'मुस्कान', 'Top': 'सिर की सजावट',
  'Make a tiny pixel picture!': 'छोटा पिक्सेल चित्र बनाओ!', 'Choose a color, then tap squares to paint.': 'रंग चुनो और खानों को दबाकर चित्र बनाओ।', 'Clear picture': 'चित्र मिटाएँ', 'Save my pixel art': 'मेरी पिक्सेल कला सहेजें',
  'Make a little tune!': 'छोटी धुन बजाओ!', 'Tap any keys to hear notes. Play five keys to complete your mini concert.': 'सुर सुनने के लिए कुंजियाँ दबाओ। छोटी प्रस्तुति के लिए पाँच कुंजियाँ बजाओ।',
  'Lovely tune! You can finish your concert.': 'सुंदर धुन! अब प्रस्तुति पूरी कर सकते हो।', 'Finish my mini concert ♪': 'मेरी प्रस्तुति पूरी ♪',
  'Listen to the pattern, then tap it back.': 'ताल सुनो और फिर उसे दोहराओ।', 'Listen closely…': 'ध्यान से सुनो…', 'Your turn! Tap the same rhythm.': 'अब तुम्हारी बारी! वही ताल बजाओ।',
  'Play the rhythm': 'ताल सुनो', 'Listen and tap the beat!': 'सुनो और ताल दो!', 'Copy the four-beat rhythm in the same order.': 'चार तालों को उसी क्रम में दोहराओ।',
  'Tap the speaker, listen, and guess!': 'आवाज़ सुनो और पहचानो!', 'Play sound': 'आवाज़ सुनो', 'That’s right!': 'बिल्कुल सही!', 'Not quite. Listen again and try another one!': 'अभी नहीं। फिर सुनो और दूसरा जवाब आज़माओ!',
  'Need or want?': 'ज़रूरत या इच्छा?', 'Tidy-up sort!': 'सफ़ाई की छँटाई!', 'Everyday or sometimes?': 'रोज़ का या कभी-कभी?',
  'Choose a picture, then pick the right group.': 'चित्र चुनो और उसे सही समूह में रखो।', 'Tap to pick up': 'उठाने के लिए दबाओ',
  'Move the hands to show the time.': 'सुइयाँ चलाकर सही समय दिखाओ।', 'Use the arrows to move the hour and minute hands.': 'घंटे और मिनट की सुई चलाने के लिए तीर दबाओ।', 'Hour': 'घंटा', 'Minutes': 'मिनट',
  'Check the clock': 'घड़ी जाँचो', 'Keep adjusting the clock hands and try again.': 'घड़ी की सुइयाँ बदलकर फिर कोशिश करो।',
  'Add coins until you reach your goal exactly.': 'ठीक लक्ष्य तक पहुँचने के लिए सिक्के जोड़ो।', 'Coin-counting shop': 'सिक्कों की दुकान', 'Save up for a toy!': 'खिलौने के लिए बचत करो!', 'Goal reached! ✓': 'लक्ष्य मिल गया! ✓',
  'Move the slider near the middle to balance the seesaw.': 'झूले को संतुलित करने के लिए निशान बीच में लाओ।', 'A little to the right!': 'थोड़ा दाईं ओर!', 'A little to the left!': 'थोड़ा बाईं ओर!', 'Hold it steady!': 'संतुलन बनाए रखो!',
  'Feelings can look different for everyone. Pick the answer that best fits the clue.': 'हर व्यक्ति की भावना अलग दिख सकती है। संकेत से सबसे मिलता जवाब चुनो।',
  'Mina packed an umbrella because dark clouds filled the sky. She waved goodbye and hurried to the bus stop.': 'मीना ने छाता रखा क्योंकि आसमान में काले बादल थे। उसने विदा कहा और बस स्टॉप की ओर जल्दी चली।',
  'Read the story aloud': 'कहानी सुनो', 'Choose a language': 'भाषा चुनें', 'Choose your age group': 'अपनी उम्र चुनें',
  'First, tell us your age group': 'पहले अपनी उम्र चुनो', 'Then pick a language for your games': 'फिर खेलों की भाषा चुनो',
  'Your games will be picked just for your age and shown in your chosen language.': 'तुम्हारी उम्र के अनुसार खेल दिखेंगे और चुनी भाषा में होंगे।',
  'Continue to games': 'खेलों पर चलें', 'Change age or language': 'उम्र या भाषा बदलें', 'English': 'अंग्रेज़ी', 'Hindi': 'हिन्दी',
  'Select an age group to continue.': 'आगे बढ़ने के लिए उम्र चुनें।', '8–10 minutes each': 'हर खेल 8–10 मिनट',
};

const moreTextHi: Record<string, string> = {
  'Wonder Club': '\u0935\u0902\u0921\u0930 \u0915\u094d\u0932\u092c',
  'Add to favorites': '\u092a\u0938\u0902\u0926\u0940\u0926\u093e \u0916\u0947\u0932 \u092c\u0928\u093e\u090f\u0901',
  'Remove favorite': '\u092a\u0938\u0902\u0926\u0940\u0926\u093e \u0938\u0947 \u0939\u091f\u093e\u090f\u0901',
  'Take a little screen break. Your games and progress will be here when you come back.': '\u0925\u094b\u0921\u093c\u093e \u0906\u0930\u093e\u092e \u0915\u0930 \u0932\u094b\u0964 \u0932\u094c\u091f\u0928\u0947 \u092a\u0930 \u0924\u0941\u092e\u094d\u0939\u093e\u0930\u0947 \u0916\u0947\u0932 \u0914\u0930 \u092a\u094d\u0930\u0917\u0924\u093f \u092f\u0939\u0940\u0902 \u092e\u093f\u0932\u0947\u0917\u0940\u0964',
  'Time for a little break': '\u0925\u094b\u0921\u093c\u0947 \u0906\u0930\u093e\u092e \u0915\u093e \u0938\u092e\u092f',
  'Got it': '\u0938\u092e\u091d \u0917\u092f\u093e',
  'Grown-up corner': '\u092c\u0921\u093c\u094b\u0902 \u0915\u093e \u0915\u094b\u0928\u093e',
  'Play big.': '\u0916\u0942\u092c \u0916\u0947\u0932\u094b\u0964',
  'Grow curious.': '\u091c\u093f\u091c\u094d\u091e\u093e\u0938\u0941 \u092c\u0928\u094b\u0964',
  'Choose a world, collect little wins, and find a new adventure every day.': '\u090f\u0915 \u0926\u0941\u0928\u093f\u092f\u093e \u091a\u0941\u0928\u094b, \u091b\u094b\u091f\u0940 \u091c\u0940\u0924 \u091c\u092e\u093e \u0915\u0930\u094b \u0914\u0930 \u0939\u0930 \u0926\u093f\u0928 \u0928\u092f\u093e \u0930\u094b\u092e\u093e\u0902\u091a \u0922\u0942\u0901\u0922\u094b\u0964',
  'A fox, rabbit, and turtle setting off on a colorful adventure.': '\u0932\u094b\u092e\u0921\u093c\u0940, \u0916\u0930\u0917\u094b\u0936 \u0914\u0930 \u0915\u091b\u0941\u0906 \u0930\u0902\u0917\u0940\u0928 \u0930\u094b\u092e\u093e\u0902\u091a \u092a\u0930 \u0928\u093f\u0915\u0932 \u0930\u0939\u0947 \u0939\u0948\u0902\u0964',
  'games to discover': '\u0916\u094b\u091c\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f \u0916\u0947\u0932',
  'Choose a portal': '\u090f\u0915 \u0926\u094d\u0935\u093e\u0930 \u091a\u0941\u0928\u094b',
  'Pick your first world': '\u0905\u092a\u0928\u0940 \u092a\u0939\u0932\u0940 \u0926\u0941\u0928\u093f\u092f\u093e \u091a\u0941\u0928\u094b',
  'See every game': '\u0938\u093e\u0930\u0947 \u0916\u0947\u0932 \u0926\u0947\u0916\u0947\u0902',
  'OPEN A WORLD': '\u090f\u0915 \u0926\u0941\u0928\u093f\u092f\u093e \u0916\u094b\u0932\u0947\u0902',
  'Loading your 3D adventure…': 'तुम्हारा 3D रोमांच खुल रहा है…',
  'Game categories': 'खेलों की श्रेणियाँ',
  'Friendly feelings clue': 'भावनाओं का प्यारा संकेत', 'Find the match!': 'सही जोड़ी ढूँढ़ो!', 'Letter tiles': 'अक्षरों की टाइलें',
  'Build the word from letter tiles': 'अक्षरों की टाइलों से शब्द बनाओ', 'Memory cards': 'याददाश्त के कार्ड', 'Choose a matching card': 'मेल खाता कार्ड चुनो',
  'Search the scene': 'दृश्य में खोजो',
  'Play zone': 'खेल का संसार', 'My rewards': 'मेरे इनाम', 'For grown-ups': 'बड़ों के लिए', 'Skip to games': 'सीधे खेलों पर जाएँ',
  'Made for curious kids ages 3–12': '3–12 साल के जिज्ञासु बच्चों के लिए', 'Short, cheerful games made to match your growing brain.': 'तुम्हारी बढ़ती समझ के लिए छोटे और मज़ेदार खेल।',
  'Start the Java API, then refresh the page.': 'Java API शुरू करके पन्ना फिर खोलें।', 'There are no games in this category for this age band yet. Choose another age group or category.': 'इस उम्र के लिए इस श्रेणी में अभी खेल नहीं हैं। दूसरी उम्र या श्रेणी चुनें।',
  'You finished your challenge. Every try helped you learn.': 'तुमने चुनौती पूरी की। हर कोशिश से कुछ नया सीखा।', 'Your imagination made something wonderful. Come back and create something new!': 'तुम्हारी कल्पना ने कमाल कर दिया! फिर आकर कुछ नया बनाओ।',
  'Your command sequence guided the critter all the way home. Nice debugging!': 'तुम्हारे निर्देशों ने छोटे जीव को घर पहुँचा दिया। गलती भी खूब सुधारी!',
  'Backpack': 'खोजी थैला', 'Ready for treasures!': 'खज़ाने के लिए तैयार!', 'Close game': 'खेल बंद करें', 'Opening your game…': 'खेल खुल रहा है…',
  'this quest': 'इस खेल में', 'The answer is': 'सही जवाब है', 'Let’s try that again.': 'चलो, फिर कोशिश करें।', 'Try again': 'फिर कोशिश करो',
  'You can try again. Use the clue above and keep exploring.': 'फिर कोशिश करो। ऊपर के संकेत से आगे खोजो।', 'Keep trying — that’s how brains grow!': 'कोशिश करते रहो—इसी से समझ बढ़ती है!',
 'Choose another quest': 'दूसरा खेल चुनो', 'Wonderful work, explorer!': 'शानदार काम, खोजी!',
  'YOUR CREATIVE MISSION': 'तुम्हारा कला मिशन', 'Get a different drawing idea': 'चित्र बनाने का नया विचार', 'Drawing canvas. Use a mouse, finger, or stylus to draw.': 'चित्र बनाने की जगह। माउस, उंगली या स्टाइलस से चित्र बनाओ।',
  'Eraser': 'मिटाने वाला', 'Color': 'रंग', 'Brush size': 'ब्रश का आकार', 'Draw with a mouse, finger, or stylus. Your picture stays on this device.': 'माउस, उंगली या स्टाइलस से चित्र बनाओ। तुम्हारा चित्र इसी डिवाइस पर रहेगा।',
  'Help the critter reach the berry!': 'छोटे जीव को बेरी तक पहुँचाओ!', 'A program is a list of steps. Put the arrows in order, then press Run.': 'प्रोग्राम निर्देशों की सूची है। तीर सही क्रम में लगाओ और चलाओ।',
  '1 · Choose an instruction': '1 · निर्देश चुनो', '2 · Your program': '2 · तुम्हारा प्रोग्राम', 'Add': 'जोड़ें', 'Up': 'ऊपर', 'Down': 'नीचे', 'Left': 'बायाँ', 'Right': 'दायाँ',
  'Repeat the previous arrow 2 times': 'पिछले तीर को 2 बार दोहराओ', 'Run program': 'प्रोग्राम चलाओ', 'Running…': 'चल रहा है…', 'Your arrows will appear here': 'तुम्हारे तीर यहाँ दिखेंगे',
  'You found the snack! Your sequence worked!': 'तुमने खाना ढूँढ़ लिया! तुम्हारे निर्देश सही चले!', 'Oops, that step went off the path. Edit your blocks and try again!': 'अरे! रास्ता छूट गया। निर्देश बदलकर फिर कोशिश करो!',
  'A rock is in the way. Change your instructions and try a new route!': 'रास्ते में पत्थर है। निर्देश बदलो और नया रास्ता चुनो!', 'The critter is safe, but not home yet. Change or add a block and try again.': 'छोटा जीव सुरक्षित है, पर घर नहीं पहुँचा। निर्देश बदलकर फिर कोशिश करो।',
  'Watch, remember, repeat!': 'देखो, याद रखो, दोहराओ!', 'The sequence will hide in a moment.': 'क्रम अभी छिप जाएगा।', 'Tap each tile in the right order.': 'हर टाइल सही क्रम में दबाओ।',
  'Look closely and remember the order!': 'ध्यान से देखो और क्रम याद रखो!', 'Good try! Start the order again.': 'अच्छी कोशिश! क्रम फिर से शुरू करो।', 'Show sequence again': 'क्रम फिर दिखाओ', 'Put the steps in order!': 'कदमों को सही क्रम में लगाओ!',
  'Tap a tile to add it to your sequence.': 'क्रम में जोड़ने के लिए टाइल दबाओ।', 'Sequence to remember': 'याद रखने का क्रम', 'Sequence hidden': 'क्रम छिपा है',
  'Monday': 'सोमवार', 'Tuesday': 'मंगलवार', 'Wednesday': 'बुधवार', 'Thursday': 'गुरुवार', 'Friday': 'शुक्रवार', 'Saturday': 'शनिवार', 'Sunday': 'रविवार',
  '🌞 Wake up': '🌞 उठो', '🪥 Brush teeth': '🪥 दाँत साफ़ करो', '👕 Get dressed': '👕 कपड़े पहनो', '🥣 Eat breakfast': '🥣 नाश्ता करो',
  '🙌 Clap': '🙌 ताली बजाओ', '🦶 Stomp': '🦶 पैर पटकाओ', '👏 Clap twice': '👏 दो बार ताली बजाओ', '🌀 Turn around': '🌀 घूमो',
  '🌱 Plant a seed': '🌱 बीज लगाओ', '💧 Water it': '💧 पानी दो', '🌿 A sprout grows': '🌿 अंकुर उगता है', '🌼 A flower blooms': '🌼 फूल खिलता है',
  'Can you spot what is missing?': 'क्या तुम गायब चीज़ ढूँढ़ सकते हो?', 'Look at the picture row, then choose the one that vanished.': 'चित्रों को देखो, फिर बताओ कौन-सा गायब हुआ।',
  'Look carefully at every picture!': 'हर चित्र ध्यान से देखो!', 'Which picture disappeared?': 'कौन-सा चित्र गायब हुआ?', 'Not that one. Take another look at the row!': 'यह नहीं। चित्रों की पंक्ति फिर देखो!',
  'Apple': 'सेब', 'Strawberry': 'स्ट्रॉबेरी', 'Lemon': 'नींबू', 'Each row and column needs 1, 2, 3, and 4. Tap a blank square to change it.': 'हर पंक्ति और स्तंभ में 1, 2, 3 और 4 होना चाहिए। खाली खाने को दबाकर अंक बदलो।',
  'Some squares need another look. Try counting across each row!': 'कुछ खानों को फिर देखो। हर पंक्ति के अंक गिनो!', 'Little number Sudoku': 'छोटा सुडोकू', 'Every row and column uses each number once.': 'हर पंक्ति और स्तंभ में हर अंक एक बार आता है।',
  'Four by four Sudoku grid': 'चार गुणा चार सुडोकू पहेली', 'Row': 'पंक्ति', 'column': 'स्तंभ', 'blank': 'खाली', 'Check my grid': 'मेरी पहेली जाँचो',
  'Build a brand-new monster friend!': 'एक नया राक्षस दोस्त बनाओ!', 'Pick its color, eyes, smile, and special top.': 'उसका रंग, आँखें, मुस्कान और सिर की सजावट चुनो।', 'Your monster preview': 'तुम्हारा राक्षस',
  'Sunny': 'धूप जैसा', 'Mint': 'पुदीना', 'Lavender': 'हल्का बैंगनी', 'Pink': 'गुलाबी', 'monster': 'राक्षस', 'Eyes': 'आँखें', 'Smile': 'मुस्कान', 'Top': 'सिर की सजावट', 'My monster is ready!': 'मेरा राक्षस तैयार!',
  'Make a tiny pixel picture!': 'छोटा पिक्सेल चित्र बनाओ!', 'Choose a color, then tap squares to paint.': 'रंग चुनो और खानों को दबाकर चित्र बनाओ।', 'Eight by eight pixel art canvas': 'आठ गुणा आठ पिक्सेल चित्र',
  'Pixel': 'पिक्सेल', 'Choose color': 'रंग चुनो', 'Save my pixel art': 'मेरी पिक्सेल कला सहेजें', 'Make a little tune!': 'छोटी धुन बजाओ!',
  'Tap any keys to hear notes. Play five keys to complete your mini concert.': 'सुर सुनने के लिए कुंजियाँ दबाओ। छोटी प्रस्तुति के लिए पाँच कुंजियाँ बजाओ।', 'Piano keys': 'पियानो की कुंजियाँ', 'Play note': 'सुर बजाओ',
  'Lovely tune! You can finish your concert.': 'सुंदर धुन! अब प्रस्तुति पूरी कर सकते हो।', 'Finish my mini concert': 'मेरी छोटी प्रस्तुति पूरी', 'Listen to the pattern, then tap it back.': 'ताल सुनो और फिर उसे दोहराओ।',
  'Listen closely…': 'ध्यान से सुनो…', 'Your turn! Tap the same rhythm.': 'अब तुम्हारी बारी! वही ताल बजाओ।', 'Almost! Listen once more, then try again.': 'बस थोड़ा-सा! फिर सुनो और कोशिश करो।', 'Play the rhythm': 'ताल सुनो',
  'Listen and tap the beat!': 'सुनो और ताल दो!', 'Copy the four-beat rhythm in the same order.': 'चार तालों को उसी क्रम में दोहराओ।', 'Clap': 'ताली', 'Tap': 'टैप करो', 'Stomp': 'पैर पटकाओ',
  'Tap the speaker, listen, and guess!': 'आवाज़ सुनो और पहचानो!', 'That’s right!': 'बिल्कुल सही!', 'Not quite. Listen again and try another one!': 'अभी नहीं। फिर सुनो और दूसरा जवाब आज़माओ!',
  'Which instrument do you hear?': 'तुम्हें कौन-सा वाद्य सुनाई दे रहा है?', 'Who made that sound?': 'यह आवाज़ किसने की?', 'Play sound clue': 'आवाज़ का संकेत सुनो', 'Play sound': 'आवाज़ सुनो', 'Finish game ✓': 'खेल पूरा ✓', 'Next sound →': 'अगली आवाज़ →',
  'Need or want?': 'ज़रूरत या इच्छा?', 'Tidy-up sort!': 'सफ़ाई की छँटाई!', 'Everyday or sometimes?': 'रोज़ का या कभी-कभी?', 'Choose a picture, then pick the right group.': 'चित्र चुनो और उसे सही समूह में रखो।',
  'Try another group. You can do it!': 'दूसरा समूह आज़माओ। तुम कर सकते हो!', 'Nice sorting! Choose the next picture.': 'अच्छी छँटाई! अगला चित्र चुनो।', 'Tap to pick up': 'उठाने के लिए दबाओ',
  'Need': 'ज़रूरत', 'Want': 'इच्छा', 'Toy box': 'खिलौनों का डिब्बा', 'Bookshelf': 'किताबों की अलमारी', 'Drawer': 'दराज़', 'Everyday food': 'रोज़ का खाना', 'Sometimes food': 'कभी-कभी का खाना',
  'Clean water': 'साफ़ पानी', 'Extra toy': 'एक और खिलौना', 'Healthy food': 'पौष्टिक खाना', 'New game': 'नया खेल', 'Safe home': 'सुरक्षित घर', 'Teddy bear': 'टेडी भालू', 'Story books': 'कहानी की किताबें', 'Clean shirt': 'साफ़ कमीज़', 'Toy car': 'खिलौना कार', 'Picture book': 'चित्रों की किताब', 'Candy': 'टॉफ़ी', 'Carrot': 'गाजर', 'Cookie': 'बिस्कुट', 'Banana': 'केला',
  'Move the hands to show the time.': 'सुइयाँ चलाकर सही समय दिखाओ।', 'Keep adjusting the clock hands and try again.': 'घड़ी की सुइयाँ बदलकर फिर कोशिश करो।', 'Set the clock to': 'घड़ी में समय रखो', 'Use the arrows to move the hour and minute hands.': 'घंटे और मिनट की सुई चलाने के लिए तीर दबाओ।',
  'Clock showing': 'घड़ी में समय है', 'Add one hour': 'एक घंटा बढ़ाएँ', 'Subtract one hour': 'एक घंटा घटाएँ', 'Subtract five minutes': 'पाँच मिनट घटाएँ', 'Add five minutes': 'पाँच मिनट बढ़ाएँ', 'Check the clock': 'घड़ी जाँचो',
  'Add coins until you reach your goal exactly.': 'ठीक लक्ष्य तक पहुँचने के लिए सिक्के जोड़ो।', 'That is a little too much. Start over and try a new coin plan!': 'यह थोड़ा ज़्यादा है। छोटे सिक्के से कोशिश करो!', 'You reached your goal! Great planning.': 'तुम लक्ष्य तक पहुँच गए! बढ़िया योजना।',
  'Save up for a toy!': 'खिलौने के लिए बचत करो!', 'Coin-counting shop': 'सिक्कों की दुकान', 'Goal': 'लक्ष्य', 'Current savings': 'अभी की बचत', 'Goal reached! ✓': 'लक्ष्य मिल गया! ✓',
  'Move the slider near the middle to balance the seesaw.': 'झूले को संतुलित करने के लिए निशान बीच में लाओ।', 'A little to the right!': 'थोड़ा दाईं ओर!', 'A little to the left!': 'थोड़ा बाईं ओर!', 'Hold it steady!': 'संतुलन बनाए रखो!',
  'Balance the seesaw!': 'झूले को संतुलित करो!', 'Use the buttons to bring the marker close to the middle.': 'निशान को बीच में लाने के लिए बटन दबाओ।', 'Move balance left': 'संतुलन बाईं ओर ले जाएँ', 'Move balance right': 'संतुलन दाईं ओर ले जाएँ', 'Balance position': 'संतुलन की जगह',
  'Flip & Find': 'पलटो और ढूँढ़ो', 'Turn over two cards and remember what you see.': 'दो पत्ते पलटो और चित्र याद रखो।', 'move': 'चाल', 'moves': 'चालें', 'matched': 'मिल गया', 'revealed': 'खुला हुआ', 'Face-down memory card': 'उलटा याददाश्त कार्ड', 'pairs': 'जोड़े', 'Find two cards with the same picture.': 'एक जैसे चित्र वाले दो कार्ड ढूँढ़ो।',
  'Bee': 'मधुमक्खी', 'Bees carry pollen between flowers.': 'मधुमक्खियाँ फूलों के बीच पराग ले जाती हैं।', 'Frog': 'मेंढक', 'Frogs begin life as tadpoles in water.': 'मेंढक पानी में टैडपोल के रूप में पैदा होते हैं।', 'Flower': 'फूल', 'Flowers help plants make seeds.': 'फूल पौधों को बीज बनाने में मदद करते हैं।', 'Moon': 'चाँद', 'The Moon reflects light from the Sun.': 'चाँद सूरज की रोशनी को परावर्तित करता है।',
  'Planet': 'ग्रह', 'Earth is the only planet we know has life.': 'पृथ्वी ही ऐसा ग्रह है जहाँ जीवन होने का पता है।', 'The Moon travels around Earth.': 'चाँद पृथ्वी के चारों ओर घूमता है।', 'Pollination helps many plants make seeds.': 'परागण से कई पौधों को बीज बनाने में मदद मिलती है।', 'Turtle': 'कछुआ', 'Turtles are reptiles with protective shells.': 'कछुए सरीसृप हैं और उनके खोल उनकी रक्षा करते हैं।', 'Dolphin': 'डॉल्फ़िन', 'Dolphins are mammals that breathe air.': 'डॉल्फ़िन स्तनधारी हैं और हवा में साँस लेती हैं।', 'Leaf': 'पत्ता', 'Leaves use sunlight to help a plant make food.': 'पत्ते पौधे को भोजन बनाने के लिए सूरज की रोशनी देते हैं।',
  'Happy': 'खुश', 'Happiness can feel bright and energetic.': 'खुशी में मन हल्का और शरीर ऊर्जावान लग सकता है।', 'Sad': 'उदास', 'Talking with someone you trust can help when you feel sad.': 'उदास होने पर भरोसेमंद व्यक्ति से बात करने से मदद मिल सकती है।', 'Calm': 'शांत', 'Slow breathing can help your body feel calmer.': 'धीमी साँसें शरीर को शांत कर सकती हैं।', 'Kindness': 'दयालुता', 'Kind words can help people feel welcome.': 'दयालु शब्दों से लोगों को अपनापन महसूस हो सकता है।',
  'Flute': 'बाँसुरी', 'Drum': 'ढोल', 'Guitar': 'गिटार', 'Piano': 'पियानो', 'Trumpet': 'तुरही', 'Cow': 'गाय', 'Duck': 'बतख', 'Sheep': 'भेड़', 'Horse': 'घोड़ा', 'Dog': 'कुत्ता', 'Cat': 'बिल्ली',
  'A flute makes music when air moves across its opening.': 'बाँसुरी के छेद पर हवा चलाने से संगीत बजता है।', 'A drum skin vibrates when you tap it.': 'ढोल को थपथपाने पर उसकी चमड़ी काँपती है।', 'A guitar uses vibrating strings to make sound.': 'गिटार के तार काँपकर आवाज़ बनाते हैं।', 'Cows make a lowing sound, often written as “moo”.': 'गाय की आवाज़ “बाँ” जैसी होती है।', 'Ducks make a quacking sound.': 'बतख “क्वैक” जैसी आवाज़ करती है।', 'Sheep make a bleating sound, often written as “baa”.': 'भेड़ “में-में” की आवाज़ करती है।',
  'Read the clue, then tap or drag it to the matching card.': 'संकेत पढ़ो और उसे सही कार्ड पर ले जाओ या दबाओ।', 'Match the clue to the right home or nature answer.': 'संकेत को सही घर या प्रकृति के जवाब से मिलाओ।', 'Look closely through the nature scene and tap what the clue describes.': 'प्रकृति के चित्र को ध्यान से देखो और संकेत से मेल खाती चीज़ दबाओ।', 'Explore the travel scene and tap the place that fits the clue.': 'सैर के चित्र को देखो और संकेत वाली जगह दबाओ।', 'Look closely and tap the safe, helpful choice.': 'ध्यान से देखो और सुरक्षित, मददगार विकल्प दबाओ।', 'Search the explorer scene and tap the answer to the clue.': 'खोजी के चित्र में संकेत का जवाब ढूँढ़कर दबाओ।',
  'Drag me to a habitat—or tap a home to help!': 'मुझे मेरे घर तक ले जाओ या सही घर दबाओ!', 'Find the missing piece and complete the pattern!': 'खाली टुकड़ा ढूँढ़ो और पैटर्न पूरा करो!', 'Tap the right answer bubble to pop it!': 'सही जवाब वाला बुलबुला फोड़ो!', 'Drop here': 'यहाँ रखो',
  'The clue says: “I have keys but open no locks.” What am I?': 'पहेली कहती है: “मेरे पास कुंजियाँ हैं, पर ताले नहीं खोलता।” मैं क्या हूँ?',
  'Your choice can be changed later.': 'तुम अपना चुनाव बाद में बदल सकते हो।', 'First, tell us your age group': 'पहले अपनी उम्र चुनो', 'Your games will be picked just for your age and shown in your chosen language.': 'तुम्हारी उम्र के अनुसार खेल दिखेंगे और चुनी भाषा में होंगे।',
  'WonderSprout home': 'WonderSprout का मुख्य पन्ना', 'Main navigation': 'मुख्य मेन्यू', 'Home': 'घर', 'Games': 'खेल', 'Stars': 'सितारे', 'About': 'जानकारी', 'Little steps': 'छोटे कदम', 'BIG magic': 'बड़ा कमाल',
  'All badges unlocked — amazing!': 'सारे बैज मिल गए—कमाल!', 'Superstar Scholar': 'सुपरस्टार विद्वान', 'Shooting Star': 'टूटता सितारा', 'Curious Caterpillar': 'जिज्ञासु इल्ली', 'Little Sprout': 'नन्हा अंकुर',
  'Glowgrass Gate': 'चमकती घास का द्वार', 'Sparkle Stream': 'चमकती धारा', 'Whispering Ferns': 'फुसफुसाते फर्न', 'Crystal Cave': 'स्फटिक की गुफा', 'The Sky Tree': 'आकाश का पेड़',
  'Lost Map Lookout': 'खोए नक्शे की चौकी', 'Vine Gate': 'बेलों का द्वार', 'Mango River': 'आमों की नदी', 'Canopy Camp': 'पेड़ों की छतरी वाला पड़ाव', 'Hidden Temple': 'छिपा मंदिर',
  'Trailhead': 'रास्ते की शुरुआत', 'Clue Garden': 'संकेतों का बगीचा', 'River Crossing': 'नदी पार', 'Wonder Cave': 'अद्भुत गुफा', 'Treasure Clearing': 'खज़ाने का मैदान',
  'Moon compass': 'चाँद का दिशा-सूचक', 'Stream pebble': 'धारा का कंकड़', 'Fern ribbon': 'फर्न की फीता', 'Owl feather': 'उल्लू का पंख', 'Moonstone': 'चाँद का रत्न',
  'Explorer map': 'खोजी नक्शा', 'Vine key': 'बेलों की चाबी', 'Golden mango': 'सुनहरा आम', 'Canopy badge': 'छतरी वाला बैज', 'Jungle treasure': 'जंगल का खज़ाना', 'Clue leaf': 'संकेत का पत्ता', 'River pebble': 'नदी का कंकड़', 'Cave crystal': 'गुफा का स्फटिक', 'Quest treasure': 'खेल का खज़ाना',
  'Luna’s Moonstone rolled off the sky tree. Help her open the glowing gate and follow its trail.': 'लूना का चाँद-रत्न आकाश के पेड़ से लुढ़क गया। चमकता द्वार खोलने और उसका रास्ता खोजने में मदद करो।',
  'A bright stream cuts across the meadow path. Work out a safe way across the stepping stones.': 'चमकती धारा मैदान का रास्ता काटती है। पत्थरों पर पैर रखकर सुरक्षित पार जाने का रास्ता सोचो।',
  'The ferns are rustling a secret clue. Listen closely and help Luna read the trail.': 'फर्न के पत्ते एक गुप्त संकेत बता रहे हैं। ध्यान से सुनो और लूना को रास्ता पढ़ने में मदद करो।',
  'A sleepy star owl guards the cave. Use your science smarts to wake the crystals.': 'एक नींद में डूबा तारों वाला उल्लू गुफा की रखवाली करता है। स्फटिक जगाने के लिए विज्ञान की समझ लगाओ।',
  'You found the Moonstone! Solve the final trail puzzle to return it to its home in the sky.': 'चाँद-रत्न मिल गया! उसे आकाश के घर लौटाने के लिए आख़िरी पहेली सुलझाओ।',
  'A toucan found an old treasure map, but the first turn is missing. Help choose the way into the jungle.': 'एक टूकेन को पुराना खजाने का नक्शा मिला, पर पहली दिशा गायब है। जंगल का रास्ता चुनने में मदद करो।',
  'A tangle of friendly vines blocks the trail. Solve their word clue to find the way through.': 'दोस्ताना बेलों ने रास्ता रोक दिया है। बाहर निकलने का रास्ता खोजने के लिए शब्दों का संकेत सुलझाओ।',
  'The toucan is hungry for the next leg of the journey. Count out just enough fruit for the trip.': 'आगे की यात्रा के लिए टूकेन को भूख लगी है। सफ़र के लिए ठीक उतने फल गिनकर दो।',
  'High in the leafy treetops, the forest friends share a secret about what keeps their home healthy.': 'पत्तों से भरी ऊँची डालियों पर जंगल के दोस्त अपना घर स्वस्थ रखने का राज़ बताते हैं।',
  'The treasure is almost yours! Use the map clues to open the old jungle chest.': 'खज़ाना बस मिलने ही वाला है! पुराने जंगल के संदूक को खोलने के लिए नक्शे के संकेत देखो।',
  'A north arrow helps orient a map.': 'उत्तर का तीर नक्शे की दिशा समझने में मदद करता है।', 'A piano has keys that make musical notes.': 'पियानो की कुंजियाँ संगीत के सुर बजाती हैं।', 'A guitar usually has six strings.': 'गिटार में आम तौर पर छह तार होते हैं।', 'A flute is a woodwind instrument.': 'बाँसुरी हवा से बजने वाला वाद्य है।', 'Drums are percussion instruments.': 'ढोल ताल वाले वाद्य हैं।', 'A piano uses keys to make musical notes.': 'पियानो की कुंजियों से संगीत के सुर बजते हैं।', 'A guitar’s strings vibrate when plucked.': 'गिटार के तार छेड़ने पर काँपते हैं।', 'A trumpet is a brass instrument.': 'तुरही पीतल का वाद्य है।', 'Cymbals create sound when they vibrate after a strike.': 'झाँझ टकराने पर काँपती हैं और आवाज़ करती हैं।',
  'Brain': 'दिमाग़', 'Telescope': 'दूरबीन', 'Magnet': 'चुंबक', 'Coral': 'मूंगा', 'Saturn': 'शनि', 'Recycle': 'पुनर्चक्रण', 'Lightning': 'बिजली', 'Seedling': 'नन्हा पौधा',
  'The brain processes information and coordinates the body.': 'दिमाग़ जानकारी समझता है और शरीर के कामों में तालमेल रखता है।', 'Telescopes collect light from distant objects in space.': 'दूरबीन अंतरिक्ष की दूर की चीज़ों से आने वाली रोशनी इकट्ठा करती है।', 'A magnet attracts some metals, including iron.': 'चुंबक लोहे जैसी कुछ धातुओं को खींचता है।', 'Coral reefs provide habitat for many marine species.': 'मूंगा चट्टानें समुद्र के कई जीवों का घर हैं।', 'Saturn’s rings are made mostly of ice and rock.': 'शनि के छल्ले ज़्यादातर बर्फ़ और पत्थर से बने हैं।', 'Reusing materials can reduce the waste we throw away.': 'चीज़ों का दोबारा उपयोग करने से फेंका जाने वाला कचरा कम हो सकता है।', 'Lightning is a large electrical discharge in the atmosphere.': 'बिजली आसमान में होने वाली बड़ी विद्युत चमक है।', 'A seedling is a young plant growing from a seed.': 'बीज से उगने वाला छोटा पौधा अंकुर कहलाता है।',
  'Draw a happy flower friend.': 'खुश फूल-दोस्त का चित्र बनाओ।', 'Make a rainbow home for an animal.': 'किसी जानवर के लिए इंद्रधनुषी घर बनाओ।', 'Draw a silly creature with a funny hat.': 'मज़ेदार टोपी वाले अजीब जीव का चित्र बनाओ।',
  'Design a garden for butterflies.': 'तितलियों के लिए बगीचा बनाओ।', 'Draw a rocket with a pet passenger.': 'पालतू दोस्त वाले रॉकेट का चित्र बनाओ।', 'Create a cozy jungle treehouse.': 'जंगल के पेड़ पर आरामदायक घर बनाओ।',
  'Invent a planet and design its habitat.': 'नया ग्रह सोचो और उसका घर बनाओ।', 'Draw a creature adapted to its climate.': 'मौसम के अनुसार ढले जीव का चित्र बनाओ।', 'Create a picture showing a food web.': 'खाद्य जाल दिखाने वाला चित्र बनाओ।',
};

type HiQuestion = { prompt: string; hint: string; choices: string[]; lesson: string; answerValue?: string };
const correctAnswerIndices: Record<string, number[]> = {
  'Geography & World Explorer': [0, 1, 2, 1, 0], 'Animals & Nature': [0, 0, 0, 0, 1], 'Music & Rhythm': [0, 0, 0, 1, 0],
  'Life Skills & Good Habits': [0, 0, 0, 0, 0], 'Emotions & Social Skills': [0, 0, 0, 0, 0], 'Time & Calendar': [1, 1, 1, 0, 1],
  'History & Culture': [0, 0, 0, 0, 0], 'Money & Financial Literacy': [1, 0, 0, 1, 0], 'Sports & Movement': [0, 0, 0, 1, 0],
  'Interactive Stories & Reading': [0, 0, 0, 0, 0], 'Adventure & Treasure Hunt': [0, 0, 1, 0, 0], 'Puzzle & Logic': [0, 0, 0, 0, 0],
};
const generatedQuestionsHi: Record<string, HiQuestion[]> = {
  'Geography & World Explorer': [
    { prompt: 'भारत किस महाद्वीप में है?', hint: 'दुनिया के नक्शे पर भारत ढूँढ़ो।', choices: ['एशिया', 'अफ़्रीका', 'यूरोप'], lesson: 'भारत दक्षिण एशिया में, एशिया महाद्वीप पर है।' },
    { prompt: 'भारत की राजधानी कौन-सी है?', hint: 'यह देश के उत्तर में है।', choices: ['मुंबई', 'नई दिल्ली', 'चेन्नई'], lesson: 'नई दिल्ली भारत की राजधानी है।' },
    { prompt: 'धरती का सबसे बड़ा महासागर कौन-सा है?', hint: 'यह एशिया, ऑस्ट्रेलिया और अमेरिका के बीच फैला है।', choices: ['अटलांटिक महासागर', 'हिंद महासागर', 'प्रशांत महासागर'], lesson: 'प्रशांत महासागर धरती का सबसे बड़ा महासागर है।' },
    { prompt: 'पूर्व की उलटी दिशा कौन-सी है?', hint: 'दिशा बताने वाले संकेतों के बारे में सोचो।', choices: ['उत्तर', 'पश्चिम', 'दक्षिण'], lesson: 'पश्चिम, पूर्व की उलटी दिशा है।' },
    { prompt: 'भारत के आगरा में कौन-सा प्रसिद्ध स्थल है?', hint: 'यह सफ़ेद संगमरमर का मशहूर स्मारक है।', choices: ['ताजमहल', 'एफ़िल टॉवर', 'कोलोसियम'], lesson: 'ताजमहल उत्तर प्रदेश के आगरा में है।' },
  ],
  'Animals & Nature': [
    { prompt: 'इनमें से कौन-सा जानवर स्तनधारी है?', hint: 'स्तनधारी हवा में साँस लेते हैं और अपने बच्चों को दूध पिलाते हैं।', choices: ['डॉल्फ़िन', 'ट्राउट मछली', 'मेंढक'], lesson: 'डॉल्फ़िन स्तनधारी हैं और साँस लेने के लिए सतह पर आती हैं।' },
    { prompt: 'मधुमक्खियाँ फूलों की किस काम में मदद करती हैं?', hint: 'पराग एक फूल से दूसरे फूल तक जाता है।', choices: ['बीज बनाने में', 'पत्थर बनाने में', 'बारिश बनाने में'], lesson: 'परागण से कई पौधों को बीज बनाने में मदद मिलती है।' },
    { prompt: 'मूंगा चट्टानें किस जगह पर होती हैं?', hint: 'गर्म खारे पानी के बारे में सोचो।', choices: ['समुद्र', 'रेगिस्तान', 'चीड़ का जंगल'], lesson: 'मूंगा चट्टानें समुद्र के जीवों के घर हैं।' },
    { prompt: 'खाद्य शृंखला में अपना भोजन कौन बनाता है?', hint: 'यह सूरज की रोशनी का उपयोग करता है।', choices: ['पौधा', 'लोमड़ी', 'उल्लू'], lesson: 'पौधे सूरज की रोशनी से अपना भोजन बनाते हैं।' },
    { prompt: 'जंगल की मदद के लिए तुम क्या कर सकते हो?', hint: 'ऐसा काम चुनो जिससे कचरा कम हो।', choices: ['कचरा छोड़ना', 'दोबारा उपयोग और पुनर्चक्रण', 'नन्हे पेड़ तोड़ना'], lesson: 'चीज़ों का दोबारा उपयोग करने से प्रकृति में कचरा कम हो सकता है।' },
  ],
  'Music & Rhythm': [
    { prompt: 'किस वाद्य में काली और सफ़ेद कुंजियाँ होती हैं?', hint: 'इस पर ऊँचे और नीचे सुर बजते हैं।', choices: ['पियानो', 'ढोल', 'बाँसुरी'], lesson: 'पियानो में काली और सफ़ेद कुंजियों की पंक्ति होती है।' },
    { prompt: 'ढोल से आवाज़ कैसे निकलती है?', hint: 'उसकी सतह को थपथपाने पर क्या होता है?', choices: ['ढोल की चमड़ी काँपती है', 'पहिया घूमता है', 'हवा चलती है'], lesson: 'ढोल को बजाने पर उसकी चमड़ी काँपती है और आवाज़ बनती है।' },
    { prompt: 'इनमें से किसकी आवाज़ आम तौर पर ऊँची होती है?', hint: 'छोटी चिड़िया की आवाज़ अक्सर ऊँची होती है।', choices: ['चिड़िया की चहचहाहट', 'बड़ा ढोल', 'बादल की गरज'], lesson: 'सुर से पता चलता है कि आवाज़ ऊँची है या नीची।' },
    { prompt: 'एक जोड़ी ताल में कितनी धड़कनें होती हैं?', hint: 'एक और एक गिनो।', choices: ['1', '2', '3'], lesson: 'एक जोड़ी में दो ताल या चीज़ें होती हैं।' },
    { prompt: 'कौन-सा वाद्य फूँक मारकर बजाया जाता है?', hint: 'यह हवा से बजने वाला वाद्य है।', choices: ['बाँसुरी', 'गिटार', 'झाँझ'], lesson: 'बाँसुरी के छेद पर हवा चलाने से आवाज़ बनती है।' },
  ],
  'Life Skills & Good Habits': [
    { prompt: 'हाथ कब धोने चाहिए?', hint: 'साबुन और पानी हाथ साफ़ करते हैं।', choices: ['खाने से पहले', 'कभी नहीं', 'सिर्फ़ खेलने के बाद'], lesson: 'खाने से पहले हाथ धोने से कीटाणु हटाने में मदद मिलती है।' },
    { prompt: 'लाल ट्रैफ़िक बत्ती का क्या मतलब है?', hint: 'सुरक्षित होने तक रुको।', choices: ['रुको', 'दौड़ो', 'वापस मुड़ो'], lesson: 'लाल बत्ती पर रुककर सुरक्षित संकेत का इंतज़ार करते हैं।' },
    { prompt: 'संतुलित खाने में कौन-सा नाश्ता अच्छा है?', hint: 'फल या सब्ज़ी चुनो।', choices: ['सेब', 'सिर्फ़ मिठाई', 'शरबत'], lesson: 'फल कई तरह के संतुलित भोजन का हिस्सा हो सकता है।' },
    { prompt: 'तुम्हें कोई असुरक्षित चीज़ दिखे तो क्या करना चाहिए?', hint: 'भरोसेमंद बड़े मदद कर सकते हैं।', choices: ['भरोसेमंद बड़े को बताओ', 'छिपा दो', 'उसे छुओ'], lesson: 'असुरक्षित चीज़ दिखे तो भरोसेमंद बड़े से मदद माँगो।' },
    { prompt: 'खिलौने समेटने का अच्छा तरीका क्या है?', hint: 'एक जैसी चीज़ें साथ रखो।', choices: ['उन्हें उनकी जगह पर रखो', 'फ़र्श पर छोड़ दो', 'गलीचे के नीचे छिपाओ'], lesson: 'चीज़ें सही जगह रखने से वे आसानी से मिलती हैं और रास्ता साफ़ रहता है।' },
  ],
  'Emotions & Social Skills': [
    { prompt: 'दोस्त उदास दिखे तो सबसे पहले क्या अच्छा होगा?', hint: 'उसे बताने का मौका दो कि क्या हुआ।', choices: ['सुनो और पूछो कि मदद चाहिए?', 'उस पर हँसो', 'हर बार दूर चले जाओ'], lesson: 'ध्यान से सुनना परवाह दिखाता है। पूछो कि दोस्त को किस तरह की मदद चाहिए।' },
    { prompt: 'झुँझलाहट होने पर क्या मदद कर सकता है?', hint: 'थोड़ा शांत होने से सोचने में मदद मिलती है।', choices: ['धीरे से साँस लो', 'किसी पर चिल्लाओ', 'चीज़ें फेंको'], lesson: 'धीमी साँसें शरीर को शांत करने में मदद कर सकती हैं।' },
    { prompt: 'किसी को गले लगाने से पहले क्या करना चाहिए?', hint: 'पहले पूछो और जवाब का सम्मान करो।', choices: ['पूछो कि क्या वे चाहेंगे', 'बिना पूछे गले लगाओ', 'ना कहने पर भी पूछते रहो'], lesson: 'पूछना दूसरे की पसंद और निजी जगह का सम्मान करता है।' },
    { prompt: 'नई कक्षा के दोस्त का स्वागत कैसे कर सकते हो?', hint: 'दोस्ताना बुलावा अच्छा लगता है।', choices: ['उसे खेल में शामिल होने को कहो', 'उसे अनदेखा करो', 'उसकी चीज़ें छिपाओ'], lesson: 'दूसरों को साथ लेने से दोस्ती बढ़ती है।' },
    { prompt: 'क्या एक साथ एक से ज़्यादा भावनाएँ हो सकती हैं?', hint: 'भावनाएँ मिली-जुली हो सकती हैं।', choices: ['हाँ', 'नहीं, सिर्फ़ एक', 'सिर्फ़ बड़ों को'], lesson: 'मिली-जुली भावनाएँ होना सामान्य है।' },
  ],
  'Time & Calendar': [
    { prompt: 'एक घंटे में कितने मिनट होते हैं?', hint: 'आधे घंटे में तीस मिनट होते हैं।', choices: ['30', '60', '100'], lesson: 'एक घंटे में साठ मिनट होते हैं।' },
    { prompt: 'सोमवार के बाद कौन-सा दिन आता है?', hint: 'हफ्ते के दिनों का क्रम याद करो।', choices: ['रविवार', 'मंगलवार', 'शुक्रवार'], lesson: 'सोमवार के बाद मंगलवार आता है।' },
    { prompt: 'एक हफ्ते में कितने दिन होते हैं?', hint: 'सोमवार से रविवार तक गिनो।', choices: ['5', '7', '10'], lesson: 'एक हफ्ते में सात दिन होते हैं।' },
    { prompt: 'कई जगहों पर सबसे ठंडी ऋतु कौन-सी होती है?', hint: 'इसमें पाला या बर्फ़ पड़ सकती है।', choices: ['सर्दी', 'गर्मी', 'वसंत'], lesson: 'कई जगहों पर सर्दी सबसे ठंडी ऋतु होती है।' },
    { prompt: 'मई के बाद कौन-सा महीना आता है?', hint: 'इसका नाम ज से शुरू होता है।', choices: ['अप्रैल', 'जून', 'अगस्त'], lesson: 'मई के बाद जून आता है।' },
  ],
  'History & Culture': [
    { prompt: 'शुरुआती व्यावहारिक टेलीफ़ोन का आविष्कार किसने किया?', hint: 'उनका उपनाम B से शुरू होता है।', choices: ['अलेक्ज़ेंडर ग्राहम बेल', 'आइज़ैक न्यूटन', 'मैरी क्यूरी'], lesson: 'अलेक्ज़ेंडर ग्राहम बेल को शुरुआती व्यावहारिक टेलीफ़ोन का श्रेय दिया जाता है।' },
    { prompt: 'किस भारतीय सम्राट ने बौद्ध धर्म के प्रसार में मदद की?', hint: 'उन्होंने मौर्य साम्राज्य पर शासन किया।', choices: ['अशोक', 'अकबर', 'शिवाजी'], lesson: 'सम्राट अशोक ने बौद्ध धर्म के प्रसार में मदद की।' },
    { prompt: 'किस त्योहार को रोशनी का त्योहार कहा जाता है?', hint: 'घर दीयों से सजाए जाते हैं।', choices: ['दीवाली', 'होली', 'ओणम'], lesson: 'दीवाली पर कई लोग दीये और रोशनी जलाते हैं।' },
    { prompt: 'पेरिस में कौन-सा स्मारक है?', hint: 'यह लोहे का ऊँचा स्मारक है।', choices: ['एफ़िल टॉवर', 'ताजमहल', 'चीन की दीवार'], lesson: 'एफ़िल टॉवर फ़्रांस के पेरिस में है।' },
    { prompt: 'इतिहासकार पुरानी चीज़ों और लिखे रिकॉर्ड को क्यों देखते हैं?', hint: 'इनसे बीते समय के जीवन को समझते हैं।', choices: ['अतीत के बारे में जानने के लिए', 'हर भविष्य की घटना जानने के लिए', 'पुरानी चीज़ें बदलने के लिए'], lesson: 'पुरानी चीज़ें और रिकॉर्ड हमें अतीत के लोगों और घटनाओं के प्रमाण देते हैं।' },
  ],
  'Money & Financial Literacy': [
    { prompt: 'तुम्हारे पास ₹5 हैं और ₹5 और मिलते हैं। कुल कितने रुपये हुए?', hint: 'दोनों रकम जोड़ो।', choices: ['₹8', '₹10', '₹15'], lesson: 'पाँच रुपये और पाँच रुपये मिलाकर दस रुपये होते हैं।' },
    { prompt: 'पैसे बचाने का क्या मतलब है?', hint: 'कुछ पैसे बाद के लिए रखते हो।', choices: ['बाद के लिए कुछ पैसे रखना', 'सारे पैसे तुरंत खर्च करना', 'उनका हिसाब खो देना'], lesson: 'बचत का मतलब भविष्य के लक्ष्य या ज़रूरत के लिए पैसा रखना है।' },
    { prompt: 'इनमें से आम तौर पर किसकी ज़रूरत होती है?', hint: 'स्वस्थ और सुरक्षित रहने के लिए इसकी ज़रूरत है।', choices: ['साफ़ पानी', 'तीसरी खिलौना कार', 'चमकीला स्टिकर'], lesson: 'साफ़ पानी एक बुनियादी ज़रूरत है।' },
    { prompt: 'खिलौना ₹12 का है और तुम्हारे पास ₹10 हैं। कितने रुपये और चाहिए?', hint: 'दस से बारह तक गिनो।', choices: ['₹1', '₹2', '₹3'], lesson: 'बारह में से दस घटाने पर दो रुपये बचते हैं।' },
    { prompt: 'बजट किसलिए मददगार होता है?', hint: 'इससे पैसे के इस्तेमाल की योजना बनती है।', choices: ['खर्च और बचत की योजना बनाने में', 'हर चीज़ मुफ़्त करने में', 'और सिक्के बनाने में'], lesson: 'बजट ज़रूरतों, लक्ष्यों और फैसलों के लिए पैसे की योजना बनाने में मदद करता है।' },
  ],
  'Sports & Movement': [
    { prompt: 'कौन-सा खेल रैकेट और छोटी गेंद से खेला जाता है?', hint: 'खिलाड़ी गेंद को जाल के ऊपर मारते हैं।', choices: ['टेनिस', 'तैराकी', 'साइकिल चलाना'], lesson: 'टेनिस में रैकेट और गेंद का इस्तेमाल होता है।' },
    { prompt: 'तेज़ व्यायाम से पहले क्या करना चाहिए?', hint: 'धीरे शुरू करके शरीर को तैयार करो।', choices: ['वार्म-अप', 'दिन भर पानी न पीना', 'फिसलने वाले जूते पहनना'], lesson: 'हल्का वार्म-अप मांसपेशियों को गतिविधि के लिए तैयार करता है।' },
    { prompt: 'साइकिल पर सिर की सुरक्षा के लिए क्या पहनते हैं?', hint: 'यह सिर पर ठीक से फिट होता है।', choices: ['हेलमेट', 'दुपट्टा', 'घुटने का मोज़ा'], lesson: 'सही नाप का हेलमेट साइकिल सवार के सिर की रक्षा में मदद करता है।' },
    { prompt: 'एक सामान्य फ़ुटबॉल टीम मैदान में कितने खिलाड़ी उतारती है?', hint: 'गोलकीपर को भी गिनो।', choices: ['7', '11', '15'], lesson: 'सामान्य फ़ुटबॉल टीम गोलकीपर सहित ग्यारह खिलाड़ी उतारती है।' },
    { prompt: 'गतिविधि को मज़ेदार बनाए रखने का अच्छा तरीका क्या है?', hint: 'अपनी पसंद की गतिविधि चुनो और बीच में आराम करो।', choices: ['अपनी पसंद से हिलो-डुलो', 'दर्द को अनदेखा करो', 'कभी आराम न करो'], lesson: 'मनपसंद गतिविधि और आराम से शरीर को स्वस्थ रखने में मदद मिलती है।' },
  ],
  'Interactive Stories & Reading': [
    { prompt: 'कहानी में मीना ने छाता रखा क्योंकि आसमान में बादल थे। उसने ऐसा क्यों किया?', hint: 'वाक्य में दिए संकेत पर ध्यान दो।', choices: ['उसे लगा कि बारिश हो सकती है', 'वह तैरना चाहती थी', 'वह सोने जा रही थी'], lesson: 'बादल और छाता बताते हैं कि मीना को बारिश की उम्मीद थी।' },
    { prompt: 'कहानी में आम तौर पर सबसे पहले क्या आता है?', hint: 'शुरुआत में पात्र या जगह का परिचय मिलता है।', choices: ['पात्र से मिलना', 'अंत सुलझाना', 'आख़िरी पन्ना पढ़ना'], lesson: 'कहानी की शुरुआत में पात्रों या जगह का परिचय दिया जाता है।' },
    { prompt: 'पात्र अपना खाना बाँटता है। इससे कौन-सी बात दिखती है?', hint: 'पात्र के काम के बारे में सोचो।', choices: ['उदारता', 'घमंड', 'नींद'], lesson: 'खाना बाँटना उदारता और परवाह दिखा सकता है।' },
    { prompt: 'कहानी का परिवेश क्या बताता है?', hint: 'यह बताता है कि घटना कब और कहाँ हुई।', choices: ['समय और जगह', 'पन्नों की सूची', 'लेखक का नाम'], lesson: 'कहानी का परिवेश बताता है कि वह कब और कहाँ घटती है।' },
    { prompt: 'कहानी में कोई अनजान शब्द मिले तो क्या कर सकते हो?', hint: 'आस-पास के वाक्यों में संकेत ढूँढ़ो।', choices: ['आस-पास के संकेत पढ़ो', 'हमेशा के लिए पढ़ना छोड़ दो', 'बिना देखे अंदाज़ा लगाओ'], lesson: 'आस-पास के वाक्यों के संकेत नए शब्द का अर्थ समझने में मदद कर सकते हैं।' },
  ],
  'Adventure & Treasure Hunt': [
    { prompt: 'खजाने के नक्शे पर उत्तर का तीर क्यों उपयोगी है?', hint: 'दिशाएँ जगह ढूँढ़ने में मदद करती हैं।', choices: ['यह उत्तर दिशा दिखाता है', 'यह मौसम बताता है', 'यह हर जानवर का नाम बताता है'], lesson: 'उत्तर का तीर नक्शे की दिशा समझने में मदद करता है।' },
    { prompt: 'पहेली कहती है, “मेरे पास कुंजियाँ हैं, पर ताले नहीं खोलता।” मैं क्या हूँ?', hint: 'किसी संगीत वाली चीज़ के बारे में सोचो।', choices: ['पियानो', 'नदी', 'पेड़'], lesson: 'पियानो की कुंजियाँ संगीत के सुर बजाती हैं।' },
    { prompt: 'तुम्हें 6 सीपियाँ मिलीं और फिर 4 और मिलीं। कुल कितनी हुईं?', hint: 'दोनों समूह जोड़ो।', choices: ['9', '10', '11'], lesson: 'छह और चार सीपियाँ मिलाकर दस होती हैं।' },
    { prompt: 'दूर के द्वीप को देखने में कौन-सा सामान मदद करेगा?', hint: 'यह दूर की चीज़ों को पास दिखाता है।', choices: ['दूरबीन', 'चम्मच', 'तकिया'], lesson: 'दूरबीन दूर की चीज़ों को साफ़ देखने में मदद करती है।' },
    { prompt: 'खोजी को नाज़ुक घोंसला मिले तो दयालु काम क्या है?', hint: 'जंगली जीवों को सुरक्षित दूरी चाहिए।', choices: ['दूर से देखना', 'अंडों को छूना', 'घोंसला ले जाना'], lesson: 'जंगली जीवों को दूर से देखने से वे सुरक्षित रहते हैं।' },
  ],
  'Puzzle & Logic': [
    { prompt: 'नई चुनौती सुलझाने का सोच-समझकर तरीका क्या है?', hint: 'संकेत ढूँढ़ने के लिए थोड़ा रुककर देखो।', choices: ['संकेत ढूँढ़ो', 'तुरंत हार मानो', 'निर्देश अनदेखे करो'], lesson: 'संकेत देखने से हल की योजना बनाने में मदद मिलती है।' },
    { prompt: 'गलती से सीखने में कौन-सा तरीका मदद करता है?', hint: 'गलती बताती है कि अगली बार क्या बदलना है।', choices: ['नया तरीका आज़माओ', 'फिर कभी कोशिश न करो', 'समस्या छिपाओ'], lesson: 'तरीका बदलना सीखने का एक अच्छा हिस्सा है।' },
    { prompt: 'काम में कई कदम हों तो क्या कर सकते हो?', hint: 'इसे छोटे हिस्सों में बाँटो।', choices: ['एक-एक कदम करो', 'हर कदम छोड़ दो', 'बिना देखे जल्दी करो'], lesson: 'छोटे कदम बड़ा काम आसान कर सकते हैं।' },
    { prompt: 'साथी के साथ काम करते समय क्या मददगार है?', hint: 'ध्यान से सुनने से सब अपने विचार बाँटते हैं।', choices: ['बारी-बारी से सुनो', 'सबके ऊपर बोलो', 'सामान छिपाओ'], lesson: 'बारी-बारी से सुनने से समूह मिलकर काम करता है।' },
    { prompt: 'समझ न आए कि क्या करें तो अगला अच्छा कदम क्या है?', hint: 'भरोसेमंद बड़ा मदद कर सकता है।', choices: ['मदद माँगो', 'खतरनाक स्थिति में अंदाज़ा लगाओ', 'अकेले चले जाओ'], lesson: 'भरोसेमंद व्यक्ति से पूछना सुरक्षित तरीका है।' },
  ],
};

const emotionQuestionsHi: HiQuestion[] = [
  { prompt: 'दोस्त का नाश्ता गिर गया और उसकी आँखों में आँसू हैं। उसे कैसा लग सकता है?', hint: 'आँसू और उदास चेहरे पर ध्यान दो।', choices: ['उदास', 'उत्साहित', 'नींद में'], lesson: 'निराश करने वाली बात होने पर उदासी महसूस हो सकती है।' },
  { prompt: 'दोस्त खेलने आया तो बच्चा मुस्कुराकर उछल रहा है। उसे कैसा लग सकता है?', hint: 'बड़ी मुस्कान और खुशी से उछलना संकेत हैं।', choices: ['गुस्सा', 'खुश', 'चिंतित'], lesson: 'खुशी में लोग अक्सर मुस्कुराते हैं, लेकिन हर किसी की भावना अलग दिख सकती है।' },
  { prompt: 'ज़ोर की आवाज़ सुनकर कोई पीछे हटता है। उसे कैसा लग सकता है?', hint: 'अचानक तेज़ आवाज़ चौंका सकती है।', choices: ['हैरान', 'ऊबा हुआ', 'गर्वित'], lesson: 'अचानक आवाज़ से हैरानी हो सकती है।' },
  { prompt: 'बच्चा धीरे साँस लेकर शांत होता है। उसे कैसा लग रहा है?', hint: 'उसका शरीर शांत हो रहा है।', choices: ['शांत', 'बहुत गुस्से में', 'उलझन में'], lesson: 'धीमी साँसें शरीर को शांत करने में मदद करती हैं।' },
  { prompt: 'भीड़ में दोस्त को अपने बड़े नहीं मिल रहे। उसे कैसा लग सकता है?', hint: 'उसे शायद आगे क्या होगा, पता न हो।', choices: ['चिंतित', 'गर्वित', 'नींद में'], lesson: 'अनजान जगह पर चिंता होना सामान्य है। भरोसेमंद बड़े से मदद माँगो।' },
];

const basicQuestionsHi: Record<string, HiQuestion[]> = {
  'Math magic': [
    { prompt: '2 + 1 कितना होता है?', hint: 'दो से शुरू करके एक और गिनो।', choices: ['2', '3', '4'], lesson: 'दो और एक मिलाकर तीन होते हैं।' },
    { prompt: '8 + 7 कितना होता है?', hint: 'पहले 8 को 10 बनाओ, फिर बाकी जोड़ो।', choices: ['13', '14', '15'], lesson: 'आठ और सात मिलाकर पंद्रह होते हैं।' },
    { prompt: '4 × 3 कितना होता है?', hint: 'तीन के चार समूह सोचो।', choices: ['7', '12', '16'], lesson: 'तीन के चार समूह मिलाकर बारह होते हैं।' },
    { prompt: '2, 4, 6, __. अगला अंक क्या है?', hint: 'हर बार दो जोड़ो।', choices: ['7', '8', '9'], lesson: 'हर बार दो जोड़ने पर क्रम 2, 4, 6, 8 बनता है।' },
    { prompt: '20 − 6 कितना होता है?', hint: 'बीस से छह कदम पीछे गिनो।', choices: ['12', '14', '16'], lesson: 'बीस में से छह घटाने पर चौदह बचते हैं।' },
  ],
  'Word adventures': [
    { prompt: '“कमल” शब्द किस अक्षर से शुरू होता है?', hint: 'पहली ध्वनि “क” है।', choices: ['क', 'म', 'ल'], lesson: 'कमल शब्द क अक्षर से शुरू होता है।' },
    { prompt: '“दिन” का उलटा अर्थ कौन-सा शब्द है?', hint: 'जब सूरज डूबता है तब क्या होता है?', choices: ['रात', 'सुबह', 'दोपहर'], lesson: 'दिन का विलोम रात है।' },
    { prompt: '“लड़का” का बहुवचन क्या है?', hint: 'एक से ज़्यादा लड़कों के लिए शब्द बदलता है।', choices: ['लड़के', 'लड़की', 'लड़कों'], lesson: 'लड़का का बहुवचन लड़के होता है।' },
    { prompt: 'इनमें से कौन-सा शब्द काम बताता है?', hint: 'कौन-सा शब्द किसी काम को दिखाता है?', choices: ['दौड़ना', 'नीला', 'किताब'], lesson: 'दौड़ना काम बताने वाला शब्द है।' },
    { prompt: '“खुश” का मिलता-जुलता अर्थ कौन-सा है?', hint: 'जब मन अच्छा लगे तो कैसा महसूस होता है?', choices: ['प्रसन्न', 'थका', 'धीमा'], lesson: 'प्रसन्न का अर्थ खुश जैसा ही होता है।' },
  ],
  'Science wonders': [
    { prompt: 'पौधे को बढ़ने के लिए क्या चाहिए?', hint: 'जड़ें इसे मिट्टी से लेती हैं।', choices: ['पानी', 'रंग', 'कागज़'], lesson: 'पौधे बढ़ने के लिए पानी लेते हैं।' },
    { prompt: 'धरती को रोशनी और गर्मी कौन देता है?', hint: 'दिन के समय आसमान में चमकता है।', choices: ['चाँद', 'सूरज', 'तारा मछली'], lesson: 'सूरज धरती को रोशनी और गर्मी देता है।' },
    { prompt: 'मछली कहाँ रहती है?', hint: 'वह कहाँ तैर सकती है?', choices: ['पानी में', 'पेड़ पर', 'ज़मीन के नीचे'], lesson: 'मछलियाँ पानी में रहती हैं और गलफड़ों से साँस लेती हैं।' },
    { prompt: 'तितली का जीवन किस रूप से शुरू होता है?', hint: 'यह एक छोटे अंडे से निकलती है।', choices: ['इल्ली', 'पिल्ला', 'टैडपोल'], lesson: 'तितली अंडे से इल्ली के रूप में निकलती है।' },
    { prompt: 'घंटी सुनने के लिए कौन-सी इंद्रिय काम आती है?', hint: 'शरीर का कौन-सा हिस्सा सुनता है?', choices: ['आँखें', 'कान', 'नाक'], lesson: 'कान हमें आवाज़ें सुनने में मदद करते हैं।' },
  ],
};

export function hindiQuestionRound(subject: string, gameId: string, age: string) {
  let pack = gameId === 'guess-the-emotion' ? emotionQuestionsHi : generatedQuestionsHi[subject];
  if (!pack) pack = basicQuestionsHi[subject];
  if (!pack) pack = generatedQuestionsHi['Puzzle & Logic'];
  if (gameId === 'word-builder') {
    const spellWords = age === '3-5'
      ? [['कमल', 'फूल का नाम बनाओ।', 'यह तालाब में खिलता है।'], ['आम', 'मीठे फल का नाम बनाओ।', 'यह गर्मियों में मिलता है।'], ['घर', 'अपने रहने की जगह का नाम बनाओ।', 'परिवार यहाँ रहता है।'], ['फल', 'खाने की चीज़ का नाम बनाओ।', 'सेब और केला इसके उदाहरण हैं।'], ['कुत्ता', 'पालतू जानवर का नाम बनाओ।', 'यह भौंकता है और पूँछ हिलाता है।']]
      : age === '6-8'
        ? [['ग्रह', 'अंतरिक्ष की दुनिया का शब्द बनाओ।', 'पृथ्वी एक ऐसा पिंड है जो सूरज की परिक्रमा करता है।'], ['बगीचा', 'फूल उगने की जगह का नाम बनाओ।', 'यहाँ बीज और पौधे उगते हैं।'], ['पहेली', 'दिमागी चुनौती का नाम बनाओ।', 'इसे हल करने के लिए संकेत सोचो।'], ['जंगल', 'बहुत सारे पेड़ों वाली जगह का नाम बनाओ।', 'यह कई जानवरों का घर है।'], ['खरगोश', 'लंबे कान वाले जानवर का नाम बनाओ।', 'यह उछलता है और गाजर खाना पसंद करता है।']]
        : [['प्रकृति', 'हमारे आसपास की दुनिया का शब्द बनाओ।', 'पेड़, जानवर, पानी और हवा इसका हिस्सा हैं।'], ['यात्रा', 'एक जगह से दूसरी जगह जाने का शब्द बनाओ।', 'खोजकर्ता नई जगह देखने के लिए यह करते हैं।'], ['पर्यावरण', 'धरती के घर का नाम बनाओ।', 'इसकी रक्षा करना हम सबकी मदद करता है।'], ['अंतरिक्ष', 'सितारों और ग्रहों की जगह का नाम बनाओ।', 'पृथ्वी इसी विशाल जगह में है।'], ['जिज्ञासा', 'सीखने की इच्छा का शब्द बनाओ।', 'सवाल पूछने से यह बढ़ती है।']];
    pack = spellWords.map(([answer, prompt, hint]) => ({
      prompt,
      hint,
      choices: Array.from(answer).sort(() => Math.random() - 0.5),
      lesson: `सही शब्द है: ${answer}।`,
      answerValue: answer,
    }));
  }
  if (subject === 'Math magic' && age === '3-5') pack = [basicQuestionsHi[subject][0], { prompt: '5 के बाद कौन-सा अंक आता है?', hint: 'गिनती में पाँच के बाद बोलो।', choices: ['4', '6', '7'], lesson: 'पाँच के बाद छह आता है।' }, { prompt: 'तीन में से एक घटाने पर कितना बचता है?', hint: 'तीन चीज़ों में से एक हटाओ।', choices: ['1', '2', '3'], lesson: 'तीन में से एक घटाने पर दो बचते हैं।' }, { prompt: 'किस आकार की तीन भुजाएँ होती हैं?', hint: 'सीधी भुजाएँ गिनो।', choices: ['गोल', 'त्रिकोण', 'चौकोर'], lesson: 'त्रिकोण की तीन भुजाएँ होती हैं।' }, { prompt: 'कौन-सा अंक बड़ा है: 4 या 2?', hint: 'गिनती में बाद में कौन आता है?', choices: ['2', '3', '4'], lesson: 'चार, दो से बड़ा है।' }];
  if (subject === 'Math magic' && age === '9-12') pack = [{ prompt: '20 का ¾ कितना है?', hint: 'पहले एक चौथाई निकालो, फिर उसके तीन हिस्से लो।', choices: ['5', '15', '18'], lesson: 'बीस का एक चौथाई पाँच है, इसलिए तीन चौथाई पंद्रह है।' }, { prompt: '24 ÷ 6 कितना होता है?', hint: 'छह के कितने समूह मिलकर चौबीस बनाते हैं?', choices: ['3', '4', '6'], lesson: 'छह गुणा चार चौबीस होता है।' }, { prompt: '100 का 15% कितना है?', hint: 'प्रतिशत का मतलब सौ में से हिस्सा।', choices: ['10', '15', '25'], lesson: 'सौ का पंद्रह प्रतिशत पंद्रह है।' }, { prompt: '5 सेमी भुजा वाले वर्ग का परिमाप कितना है?', hint: 'चारों बराबर भुजाएँ जोड़ो।', choices: ['10 सेमी', '20 सेमी', '25 सेमी'], lesson: 'वर्ग की चारों भुजाएँ जोड़ने पर 20 सेमी होता है।' }, { prompt: '7 × 8 कितना होता है?', hint: 'पहचाना हुआ पहाड़ा सोचो।', choices: ['54', '56', '64'], lesson: 'सात के आठ समूह छप्पन होते हैं।' }];
  return pack.map((question, index) => {
    const correctIndex = gameId === 'guess-the-emotion' ? [0, 1, 0, 0, 0][index] : subject === 'Math magic' ? (age === '3-5' ? [1, 1, 1, 1, 2][index] : age === '9-12' ? [1, 1, 1, 1, 1][index] : [1, 2, 1, 1, 1][index]) : subject === 'Word adventures' ? [0, 0, 0, 0, 0][index] : subject === 'Science wonders' ? [0, 1, 0, 0, 1][index] : correctAnswerIndices[subject]?.[index] ?? 0;
    return { id: `hi-${gameId}-${index + 1}`, ...question, answerIndex: question.answerValue ? undefined : correctIndex, answerValue: question.answerValue, localized: true };
  });
}

export function tr(language: Language, text: string): string {
  if (language === 'hi') return moreTextHi[text] ?? textHi[text] ?? text;
  if (language === 'mr') return textMr[text] ?? hindiTextMr[text] ?? questionTextMr[text] ?? text;
  return text;
}

export function localizedText(language: Language, english: string, hindi: string): string {
  if (language === 'hi') return hindi;
  return language === 'mr' ? textMr[english] ?? hindiTextMr[hindi] ?? english : english;
}

export function localizedGame(language: Language, game: { id: string; title: string; description: string }) {
  const copy = language === 'hi' ? gameCopyHi[game.id] : language === 'mr' ? gameCopyMr[game.id] : undefined;
  return copy ? { ...game, title: copy[0], description: copy[1] } : game;
}

export function localizedSubject(language: Language, subject: string): string {
  return language === 'hi' ? subjectsHi[subject] ?? subject : language === 'mr' ? subjectsMr[subject] ?? subject : subject;
}

export function localizedAgeCopy(language: Language, label: string): string {
  return language === 'hi' ? ageCopyHi[label] ?? label : language === 'mr' ? ageCopyMr[label] ?? label : label;
}

export function localizedPair(language: Language, pair: readonly (string | undefined)[]): string {
  const english = pair[0] ?? '';
  return localizedText(language, english, pair[1] ?? english);
}

function graphemes(word: string): string[] {
  const Segmenter = (Intl as typeof Intl & { Segmenter?: new (locale?: string, options?: { granularity: 'grapheme' }) => { segment(value: string): Iterable<{ segment: string }> } }).Segmenter;
  return Segmenter ? [...new Segmenter('mr', { granularity: 'grapheme' }).segment(word)].map((part) => part.segment) : Array.from(word);
}

export function marathiQuestionRound(subject: string, gameId: string, age: string) {
  return hindiQuestionRound(subject, gameId, age).map((question, index) => {
    const answerValue = question.answerValue ? questionTextMr[question.answerValue] ?? question.answerValue : undefined;
    const choices = gameId === 'word-builder' && answerValue
      ? graphemes(answerValue).sort(() => Math.random() - 0.5)
      : question.choices.map((choice) => questionTextMr[choice] ?? choice);
    return {
      ...question,
      id: `mr-${gameId}-${index + 1}`,
      prompt: questionTextMr[question.prompt] ?? question.prompt,
      hint: questionTextMr[question.hint] ?? question.hint,
      lesson: question.lesson ? questionTextMr[question.lesson] ?? question.lesson : undefined,
      choices,
      answerValue,
      localized: true,
    };
  });
}

export function localizedQuestion<T extends { id: string; prompt: string; hint: string; choices: string[] }>(language: Language, subject: string, gameId: string, question: T): T {
  if (language === 'en' || language === 'mr' && 'localized' in question && question.localized) return question;
  if (language === 'mr') return {
    ...question,
    prompt: textMr[question.prompt] ?? question.prompt,
    hint: textMr[question.hint] ?? question.hint,
    choices: question.choices.map((choice) => textMr[choice] ?? choice),
  };
  if ('localized' in question && question.localized) return question;
  const index = Number(question.id.match(/-(\d+)$/)?.[1] ?? 0) - 1;
  const translated = gameId === 'guess-the-emotion' ? emotionQuestionsHi[index] : question.id.startsWith(`${gameId}-`) ? generatedQuestionsHi[subject]?.[index] : undefined;
  if (translated) return { ...question, prompt: translated.prompt, hint: translated.hint, choices: translated.choices };
  return { ...question, prompt: tr(language, question.prompt), hint: tr(language, question.hint), choices: question.choices.map((choice) => tr(language, choice)) };
}

export function localizedLesson(language: Language, subject: string, questionId: string, lesson: string): string {
  if (language === 'en') return lesson;
  if (language === 'mr') return textMr[lesson] ?? questionTextMr[lesson] ?? lesson;
  const index = Number(questionId.match(/-(\d+)$/)?.[1] ?? 0) - 1;
  const translated = generatedQuestionsHi[subject]?.[index] ?? (questionId.startsWith('guess-the-emotion-') ? emotionQuestionsHi[index] : undefined);
  return translated?.lesson ?? tr(language, lesson);
}
