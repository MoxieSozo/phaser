angular.module('app.services')

.service( 'TriviaService', [function(){

  var trivia = {
  	questions: [
  		{
  			q: "6’ 9” Hafthór Júlíus Björnsson, also known as “The Mountain” in HBO’s Game of Thrones, is a world-record breaking keg tosser. How high did he throw a keg in November 2015?",
  			o: {
          "14-8": '14’ 8”',
          "20-3": '20’ 3”',
          "24-6": '24’ 6”',
          "32-32": '32’ 8”'
  			},
  			a: "24-6",
  			n: "you're a nut!"
  		},
  		{
  			q: 'Approximately how many kg of CO2 equivalents did brewers reduce their carbon footprints by through using MicroStar’s pool of kegs rather than owning their own?',
  			o: {
  				"3k": "3,000",
  				"30k": "30,000",
  				"300k": "300,000",
  				"3m": '3,000,000'
  			},
  			a: "3m"
  		},
  		{
  			q: 'Which of these is not the name of a beer?',
  			o: {
  				"pyp": "Poop Your Pants",
  				"idmp": "I Dunkled In My Pants",
  				"pw": "Prestige Worldwide",
  				"rock": "Rock Out with Your Bock Out",
  			},
  			a: "pw"
  		},
  		{
  			q: 'The 1980’s show Knight Rider was syndicated in Latin Americ. What was it called?',
  			o: {
  				"a": "El Coche Fantastico",
  				"b": "Knight Rider",
  				"c": "Noche Jinete",
  			},
  			a: "a"
  		},
  		{
  			q: 'Which of these is not the name of a beer?',
  			o: {
  				"a": "Smells Like a Safety Meeting",
  				"b": "BEER",
  				"c": "Tom Brady Sucks",
  				"d": "Boats and Gose",
  			},
  			a: "c"
  		},
  		{
  			q: 'According to the Brewer’s Association’s 2015 Brewery Volume Report, who was the 7th largest craft brewer?',
  			o: {
  				"a": "Goose Island",
  				"b": "Lagunitas",
  				"c": "Gigantic",
  				"d": "Bell's",
  				"e": "Deschutes"
  			},
  			a: "d"
  		},
  		{
  			q: 'Which is NOT one of the three “Can’t Fail” principles to matching food and beer according the Brewers Association?',
  			o: {
  				"a": "Match Strength with Strength",
  				"b": "Find Harmonies",
  				"c": "Consider Sweetness, Bitterness, Carbonation, Heat (Spice), and Richness",
  				"d": "When in Doubt, Pair with Cool Ranch Doritos",
  			},
  			a: "d"
  		},
  		{
  			q: "What's your favorite color?",
  			o: {
  				"a": "Burnt Orange",
  				"b": "Forest Green",
  				"c": "Aqua Blue",
  				"d": "Camouflage",
  			},
  			a: "b"
  		},
  		{
  			q: 'What do they call a Quarter Pounder in France?',
  			o: {
  				"a": "Quarter Pounder",
  				"b": "Le Big Mac",
  				"c": "Royale with Cheese",
  				"d": "Trimestre du Boeuf",
  			},
  			a: "c"
  		},
  		{
  			q: 'Which beer won gold for Imperial Pale Ale at the 2016 World Beer Cup?',
  			o: {
  				"a": "Good Juju",
  				"b": "Hop Juju",
  				"c": "Cindy Loo Who"
  			},
  			a: "b"
  		},
  		{
  			q: 'What spice sometimes used in beer smells like Fruit Loops?',
  			o: {
  				"a": "Paprika",
  				"b": "Marjoram",
  				"c": "Coriander",
  				"d": "Cinnamon",
  			},
  			a: "c"
  		},
  		{
  			q: 'Which day of the year generates more sales for the whipped cream industry than any other single day?',
  			o: {
  				"a": "Thanksgiving",
  				"b": "Christmas",
  				"c": "May 12",
  				"d": "February 14 (put your thinking caps on, people...)",
  			},
  			a: "d"
  		},
  		{
  			q: 'Which of these is not the name of a brewery?',
  			o: {
  				"a": "Angry Cedar",
  				"b": "Angry Chair",
  				"c": "Angry Erik",
  				"d": "Angry Hanik",
  				"e": "Angry Minnow",
  				"f": "Just Plain Angry",
  			},
  			a: "f"
  		},
  		{
  			q: "Which singer's real name is Stefani Joanne Angelina Germanotta?",
  			o: {
  				"a": "Gwen Stefani",
  				"b": "Lady Gaga",
  				"c": "Beyoncé",
  				"d": "Justin Bieber",
  			},
  			a: "a"
  		},
  		{
  			q: 'Approximately how many liters in a 1/6bbl keg?',
  			o: {
  				"a": "10L",
  				"b": "20L",
  				"c": "30L",
  				"d": "40L",
  			},
  			a: "b"
  		},
  		{
  			q: 'In the Brewer’s Association’s 2015 Brewery Data, which animal is incorporated most frequently into brewery names?',
  			o: {
  				"a": "Rabbit",
  				"b": "Bear",
  				"c": "Fox",
  				"d": "Turtle",
  			},
  			a: "b"
  		},
  		{
  			q: 'How many letters are there in the German alphabet (HINT: Includes Umlauts and the ss-Ligature)',
  			o: {
  				"a": "24",
  				"b": "26",
  				"c": "28",
  				"d": "30",
  			},
  			a: "d"
  		},
  		{
  			q: 'How many kegs does MicroStar and KegCraft have in their combined fleets?',
  			o: {
  				"a": "8",
  				"b": "~1,000,000",
  				"c": "~2,000,000",
  				"d": "~3,000,000",
  			},
  			a: "d"
  		},
  		{
  			q: 'What’s your favorite type of cat?',
  			o: {
  				"a": "British Shorthair",
  				"b": "Bombay",
  				"c": "American Bobtail",
  				"d": "None of the above.  You prefer dogs",
  			},
  			a: "d"
  		},
  		{
  			q: 'What’s your favorite type of dog?',
  			o: {
  				"a": "Retriever",
  				"b": "German Shepherd",
  				"c": "Bulldog",
  				"d": "Doesn’t matter as long as it’s not a cat",
  			},
  			a: "d"
  		},
  		{
  			q: 'What keg valve type are used in Guinness kegs?',
  			o: {
  				"a": "A",
  				"b": "U",
  				"c": "s",
  				"d": "D",
  			},
  			a: "b"
  		},
  		{
  			q: 'What does  “R.R.” stand for in George R. R. Martin?',
  			o: {
  				"a": "Robert Redford",
  				"b": "Raymond Richard",
  				"c": "Red Rum",
  				"d": "Rolls Royce",
  			},
  			a: "b"
  		},
  		{
  			q: 'Which of the following is not an ingredient approved per the Reinheitsgebot?',
  			o: {
  				"a": "Water",
  				"b": "Corn",
  				"c": "Barley",
  				"d": "Hops",
  				"e": "Yeast"
  			},
  			a: "b"
  		},
  		{
  			q: 'Which of the following is not the name of a brewery?',
  			o: {
  				"a": "Hunga Dunga",
  				"b": "Miss Mcgillicuddy’s Beer Emporium",
  				"c": "Ass Clown"
  			},
  			a: "b"
  		},
  		{
  			q: 'Sobriety Test: Which is spelled correctly?',
  			o: {
  				"a": "Potato",
  				"b": "Potatoe"
  			},
  			a: "a"
  		},
  		{
  			q: 'What test did Gambrinus accomplish to earn his crown and admiration of generations of beer drinkers? ',
  			o: {
  				"a": 'He brewed the "perfect" beer',
  				"b": "He discovered how many licks it takes to get to the center of a Tootsie Pop",
  				"c": "He picked up and carried a full barrel (62 gallons of beer in wood) and carried it",
  				"d": "He vanquished Voldemort in a duel",
  			},
  			a: "c"
  		},
  		{
  			q: 'How is it said King Gambrinus was able to carry a full barrel (62 gallons of beer in wood)?',
  			o: {
  				"a": "He attached helium balloons",
  				"b": "He drank half of it first",
  				"c": "Steroids",
  				"d": "Seriously?",
  			},
  			a: "b"
  		},
  		{
  			q: 'What was the location of the first United States Marine Recruiting Station?',
  			o: {
  				"a": "A prison",
  				"b": "Wrigley Field",
  				"c": "A bar",
  				"d": "Boston Harbor",
  			},
  			a: "c"
  		},
  		{
  			q: 'In what country can beer be sold in vending machines, by street vendors and in train stations?',
  			o: {
  				"a": "England",
  				"b": "Japan",
  				"c": "India",
  				"d": "Brazil",
  			},
  			a: "b"
  		},
  		{
  			q: 'What is a labeorphilist?',
  			o: {
  				"a": "A beer bottle collector",
  				"b": "Brewing efficiency spcialist",
  				"c": "Label designer",
  				"d": "A what?",
  			},
  			a: "a"
  		},
  		{
  			q: 'What is Zythology?',
  			o: {
  				"a": "A city in Game of Thrones",
  				"b": "The study of beer and beer-making",
  				"c": "The process of harvesting hops",
  				"d": "A made-up word",
  			},
  			a: "b"
  		},
  		{
  			q: 'Which country drinks the most beer?',
  			o: {
  				"a": "Australia",
  				"b": "USA",
  				"c": "Germany",
  				"d": "Czech Republic",
  				"e": "Gondor",
  			},
  			a: "d",
  			n: "Per capita beer consumption in the Czech Republic ia almost 40 gallons a year."
  		},
  		{
  			q: 'What is Cenosillicaphobia?',
  			o: {
  				"a": "The fear of cold liquid",
  				"b": "The fear of carbonated beverages",
  				"c": "The fear of peach fuzz",
  				"d": "The fear of an empty beer glass",
  			},
  			a: "d"
  		},
  		{
  			q: 'How many people attend Oktoberfest in Munich every year?',
  			o: {
  				"a": "90,000",
  				"b": "800,000",
  				"c": "6,000,000",
  				"d": "9,000,000",
  			},
  			a: "c",
  		},
  		{
  			q: 'At any given time, what percentage of the world population is drunk?',
  			o: {
  				"a": "0.2%",
  				"b": "0.7%",
  				"c": "1.3%",
  				"d": "3.4%",
  				"e": "4.1%",
  			},
  			a: "b",
  			n: "That is about 50 million people!"
  		},
  		{
  			q: 'On what date in history was Prohibition repealed?',
  			o: {
  				"a": "October 10, 1915",
  				"b": "December 5, 1933",
  				"c": "July 4, 1940",
  				"d": "December 2, 1941",
  				"e": "December 5, 1944",
  			},
  			a: "b"
  		},
  		{
  			q: 'Which of the following hops varieties is not Noble?',
  			o: {
  				"a": "Hallertau",
  				"b": "Tettnanger",
  				"c": "Saaz",
  				"d": "Styrian Golding",
  			},
  			a: "d"
  		},
  		{
  			q: 'The Altbier style originated in which German city?',
  			o: {
  				"a": "Dusseldorf",
  				"b": "Cologne",
  				"c": "Berlin",
  				"d": "Munich",
  			},
  			a: "a"
  		},
  		{
  			q: 'Which of the following malts contains the most diastatic power?',
  			o: {
  				"a": "Black Malt",
  				"b": "Munich Malt",
  				"c": "Pilsen Malt",
  				"d": "Vienna Malt",
  			},
  			a: "c"
  		},
  		{
  			q: 'Sobriety Test: How many days are there in a year?',
  			o: {
  				"a": "365",
  				"b": "7",
  				"c": "365.25",
  				"d": "12",
  			},
  			a: "c",
  			n: 'Why do you think we have leap years!?'
  		},
  		{
  			q: 'A great deal of chemistry and biology goes into brewing a good beer. What is the terminology of the study of fermentation?',
  			o: {
  				"a": "Zymurgy",
  				"b": "Etymology",
  				"c": "Beerology",
  				"d": "Entomology",
  			},
  			a: "a"
  		}
  	]
  };
  return trivia
}]);
