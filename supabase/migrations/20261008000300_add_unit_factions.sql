-- OpenHammer API faction names for the forces in each planet's area
-- (controlling faction + main enemies). Names must match the API exactly.
alter table public.planets
  add column unit_factions text[] not null default '{}';

update public.planets set unit_factions = array['Adeptus Custodes', 'Genestealer Cults']  where slug = 'holy-terra';
update public.planets set unit_factions = array['Astra Militarum', 'Chaos Space Marines'] where slug = 'cadia';
update public.planets set unit_factions = array['Ultramarines', 'Tyranids']               where slug = 'macragge';
update public.planets set unit_factions = array['Space Wolves', 'Thousand Sons']          where slug = 'fenris';
update public.planets set unit_factions = array['Astra Militarum', 'Orks']                where slug = 'armageddon';
update public.planets set unit_factions = array['Astra Militarum', 'Tyranids']            where slug = 'catachan';
