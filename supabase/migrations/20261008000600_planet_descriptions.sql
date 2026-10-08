-- Replace the placeholder planet descriptions with real copy.

update public.planets set description = 'The cradle of humanity and seat of the Imperium, Holy Terra is crowned by the Imperial Palace, where the Emperor sits upon the Golden Throne. Hive-cities sprawl across entire continents, and pilgrims from a million worlds queue for a glimpse of the divine. Expect crowds, incense and the most heavily guarded skies in the galaxy.'
  where slug = 'holy-terra';

update public.planets set description = 'A fortress world standing guard at the mouth of the Eye of Terror, Cadia raises its children to be soldiers and its cities to be bastions. Visitors can walk the great Kasr walls and learn why the Cadian Gate has held for so long. Travel here is for the stout of heart, and the sky is rarely quiet.'
  where slug = 'cadia';

update public.planets set description = 'Home of the Ultramarines and capital of the realm of Ultramar, Macragge is among the most orderly and prosperous worlds in the Imperium. Mild coastal plains give way to snowy highlands, all watched over by the Fortress of Hera. A refined destination for travellers who prefer discipline, history and clean streets.'
  where slug = 'macragge';

update public.planets set description = 'A frozen death world of ice, storms and shifting glaciers, Fenris is the home of the Space Wolves and the great fortress-monastery of the Fang. Its people are proud, boisterous and fiercely hospitable to guests who can keep up with the feasting. Pack warm, respect the sagas and do not wander from the hall at night.'
  where slug = 'fenris';

update public.planets set description = 'An industrial hive world of vast factories, towering spires and endless ash wastes, Armageddon builds the weapons that win the Emperor''s wars. Its hives, Infernus among them, hum day and night with the labour of billions. The planet has endured wave after wave of invasion, and the scars make for sobering sightseeing.'
  where slug = 'armageddon';

update public.planets set description = 'A lethal jungle death world where nearly every plant, beast and insect is hunting something, Catachan forges the toughest soldiers in the Imperial Guard. Guided treks reach the high canopy and the strange sentient gardens, though survival is not included in the price. Recommended only for the adventurous, the insured and the very well armed.'
  where slug = 'catachan';
