import { Planet, Moon, Star, Galaxy, Constellation, Mission, Astronaut, Satellite, CelestialEvent } from './types';

export const planets: Planet[] = [
  {
    id: 'planet-mercury', name: 'Mercury', type: 'terrestrial', star_system: 'Solar System',
    mass_kg: 3.285e23, mass_earth: 0.055, radius_km: 2439.7, radius_earth: 0.383,
    distance_from_star_km: 57909050, distance_au: 0.387, orbital_period_days: 88, rotation_period_hours: 1407.6,
    moons_count: 0, has_rings: false, habitable: false,
    atmosphere: ['Oxygen', 'Sodium', 'Hydrogen', 'Helium', 'Potassium'],
    surface_temperature_c: { min: -180, max: 430, avg: 167 },
    gravity_ms2: 3.7, description: 'The smallest planet in our solar system and closest to the Sun.'
  },
  {
    id: 'planet-venus', name: 'Venus', type: 'terrestrial', star_system: 'Solar System',
    mass_kg: 4.867e24, mass_earth: 0.815, radius_km: 6051.8, radius_earth: 0.949,
    distance_from_star_km: 108208000, distance_au: 0.723, orbital_period_days: 225, rotation_period_hours: -5832.5,
    moons_count: 0, has_rings: false, habitable: false,
    atmosphere: ['Carbon Dioxide', 'Nitrogen', 'Sulfur Dioxide'],
    surface_temperature_c: { min: 462, max: 462, avg: 462 },
    gravity_ms2: 8.87, description: 'The hottest planet in our solar system due to its thick atmosphere.'
  },
  {
    id: 'planet-earth', name: 'Earth', type: 'terrestrial', star_system: 'Solar System',
    mass_kg: 5.972e24, mass_earth: 1, radius_km: 6371, radius_earth: 1,
    distance_from_star_km: 149598023, distance_au: 1, orbital_period_days: 365.25, rotation_period_hours: 24,
    moons_count: 1, has_rings: false, habitable: true,
    atmosphere: ['Nitrogen', 'Oxygen', 'Argon', 'Carbon Dioxide'],
    surface_temperature_c: { min: -89, max: 57, avg: 15 },
    gravity_ms2: 9.81, description: 'Our home planet and the only known planet to harbor life.'
  },
  {
    id: 'planet-mars', name: 'Mars', type: 'terrestrial', star_system: 'Solar System',
    mass_kg: 6.39e23, mass_earth: 0.107, radius_km: 3389.5, radius_earth: 0.532,
    distance_from_star_km: 227939200, distance_au: 1.524, orbital_period_days: 687, rotation_period_hours: 24.6,
    moons_count: 2, has_rings: false, habitable: false,
    atmosphere: ['Carbon Dioxide', 'Nitrogen', 'Argon'],
    surface_temperature_c: { min: -143, max: 35, avg: -65 },
    gravity_ms2: 3.71, description: 'The Red Planet, a prime target for human exploration.'
  },
  {
    id: 'planet-jupiter', name: 'Jupiter', type: 'gas_giant', star_system: 'Solar System',
    mass_kg: 1.898e27, mass_earth: 317.8, radius_km: 69911, radius_earth: 10.97,
    distance_from_star_km: 778570000, distance_au: 5.204, orbital_period_days: 4333, rotation_period_hours: 9.9,
    moons_count: 95, has_rings: true, habitable: false,
    atmosphere: ['Hydrogen', 'Helium', 'Methane', 'Ammonia'],
    surface_temperature_c: { min: -145, max: -108, avg: -110 },
    gravity_ms2: 24.79, description: 'The largest planet in our solar system with the Great Red Spot.'
  },
  {
    id: 'planet-saturn', name: 'Saturn', type: 'gas_giant', star_system: 'Solar System',
    mass_kg: 5.683e26, mass_earth: 95.16, radius_km: 58232, radius_earth: 9.14,
    distance_from_star_km: 1433530000, distance_au: 9.582, orbital_period_days: 10759, rotation_period_hours: 10.7,
    moons_count: 146, has_rings: true, habitable: false,
    atmosphere: ['Hydrogen', 'Helium', 'Methane', 'Ammonia'],
    surface_temperature_c: { min: -178, max: -139, avg: -140 },
    gravity_ms2: 10.44, description: 'Famous for its stunning ring system, visible from Earth with a telescope.'
  },
  {
    id: 'planet-uranus', name: 'Uranus', type: 'ice_giant', star_system: 'Solar System',
    mass_kg: 8.681e25, mass_earth: 14.54, radius_km: 25362, radius_earth: 3.98,
    distance_from_star_km: 2872500000, distance_au: 19.22, orbital_period_days: 30687, rotation_period_hours: -17.2,
    moons_count: 28, has_rings: true, habitable: false,
    atmosphere: ['Hydrogen', 'Helium', 'Methane'],
    surface_temperature_c: { min: -224, max: -197, avg: -197 },
    gravity_ms2: 8.69, discovered_year: 1781, description: 'An ice giant that rotates on its side.'
  },
  {
    id: 'planet-neptune', name: 'Neptune', type: 'ice_giant', star_system: 'Solar System',
    mass_kg: 1.024e26, mass_earth: 17.15, radius_km: 24622, radius_earth: 3.86,
    distance_from_star_km: 4495100000, distance_au: 30.07, orbital_period_days: 60190, rotation_period_hours: 16.1,
    moons_count: 16, has_rings: true, habitable: false,
    atmosphere: ['Hydrogen', 'Helium', 'Methane'],
    surface_temperature_c: { min: -218, max: -200, avg: -201 },
    gravity_ms2: 11.15, discovered_year: 1846, description: 'The windiest planet with supersonic storms.'
  },
  {
    id: 'planet-pluto', name: 'Pluto', type: 'dwarf', star_system: 'Solar System',
    mass_kg: 1.303e22, mass_earth: 0.0022, radius_km: 1188.3, radius_earth: 0.186,
    distance_from_star_km: 5906400000, distance_au: 39.48, orbital_period_days: 90560, rotation_period_hours: -153.3,
    moons_count: 5, has_rings: false, habitable: false,
    atmosphere: ['Nitrogen', 'Methane', 'Carbon Monoxide'],
    surface_temperature_c: { min: -240, max: -218, avg: -229 },
    gravity_ms2: 0.62, discovered_year: 1930, description: 'Once classified as the ninth planet, now a dwarf planet.'
  },
  {
    id: 'planet-eris', name: 'Eris', type: 'dwarf', star_system: 'Solar System',
    mass_kg: 1.66e22, mass_earth: 0.0028, radius_km: 1163, radius_earth: 0.182,
    distance_from_star_km: 10125000000, distance_au: 67.7, orbital_period_days: 203830, rotation_period_hours: 25.9,
    moons_count: 1, has_rings: false, habitable: false,
    atmosphere: ['Nitrogen', 'Methane'],
    surface_temperature_c: { min: -243, max: -217, avg: -230 },
    gravity_ms2: 0.82, discovered_year: 2005, description: 'The most massive dwarf planet in our solar system.'
  },
];

export const moons: Moon[] = [
  { id: 'moon-luna', name: 'Luna (Moon)', planet_id: 'planet-earth', radius_km: 1737.4, mass_kg: 7.342e22, orbital_period_days: 27.3, distance_from_planet_km: 384400, discovered_year: -10000, description: 'Earth\'s only natural satellite.' },
  { id: 'moon-phobos', name: 'Phobos', planet_id: 'planet-mars', radius_km: 11.27, mass_kg: 1.0659e16, orbital_period_days: 0.32, distance_from_planet_km: 9376, discovered_year: 1877, discoverer: 'Asaph Hall', description: 'The larger of Mars\'s two moons.' },
  { id: 'moon-deimos', name: 'Deimos', planet_id: 'planet-mars', radius_km: 6.2, mass_kg: 1.4762e15, orbital_period_days: 1.26, distance_from_planet_km: 23463, discovered_year: 1877, discoverer: 'Asaph Hall', description: 'The smaller of Mars\'s two moons.' },
  { id: 'moon-io', name: 'Io', planet_id: 'planet-jupiter', radius_km: 1821.6, mass_kg: 8.93e22, orbital_period_days: 1.77, distance_from_planet_km: 421700, discovered_year: 1610, discoverer: 'Galileo Galilei', description: 'The most volcanically active body in the solar system.' },
  { id: 'moon-europa', name: 'Europa', planet_id: 'planet-jupiter', radius_km: 1560.8, mass_kg: 4.8e22, orbital_period_days: 3.55, distance_from_planet_km: 671034, discovered_year: 1610, discoverer: 'Galileo Galilei', description: 'A moon with a subsurface ocean that may harbor life.' },
  { id: 'moon-ganymede', name: 'Ganymede', planet_id: 'planet-jupiter', radius_km: 2634.1, mass_kg: 1.48e23, orbital_period_days: 7.15, distance_from_planet_km: 1070412, discovered_year: 1610, discoverer: 'Galileo Galilei', description: 'The largest moon in the solar system.' },
  { id: 'moon-callisto', name: 'Callisto', planet_id: 'planet-jupiter', radius_km: 2410.3, mass_kg: 1.08e23, orbital_period_days: 16.69, distance_from_planet_km: 1882709, discovered_year: 1610, discoverer: 'Galileo Galilei', description: 'One of the most heavily cratered objects in the solar system.' },
  { id: 'moon-titan', name: 'Titan', planet_id: 'planet-saturn', radius_km: 2574.7, mass_kg: 1.345e23, orbital_period_days: 15.95, distance_from_planet_km: 1221870, discovered_year: 1655, discoverer: 'Christiaan Huygens', description: 'The only moon with a dense atmosphere and surface liquids.' },
  { id: 'moon-enceladus', name: 'Enceladus', planet_id: 'planet-saturn', radius_km: 252.1, mass_kg: 1.08e20, orbital_period_days: 1.37, distance_from_planet_km: 237948, discovered_year: 1789, discoverer: 'William Herschel', description: 'Known for its ice geysers and potential subsurface ocean.' },
  { id: 'moon-triton', name: 'Triton', planet_id: 'planet-neptune', radius_km: 1353.4, mass_kg: 2.14e22, orbital_period_days: 5.88, distance_from_planet_km: 354759, discovered_year: 1846, discoverer: 'William Lassell', description: 'Neptune\'s largest moon with a retrograde orbit.' },
  { id: 'moon-charon', name: 'Charon', planet_id: 'planet-pluto', radius_km: 606, mass_kg: 1.586e21, orbital_period_days: 6.39, distance_from_planet_km: 19591, discovered_year: 1978, discoverer: 'James Christy', description: 'Pluto\'s largest moon, forming a binary system.' },
];

export const stars: Star[] = [
  { id: 'star-sun', name: 'Sun', constellation_id: 'const-none', spectral_class: 'G2V', temperature_k: 5778, luminosity_solar: 1, mass_solar: 1, radius_solar: 1, distance_ly: 0.0000158, apparent_magnitude: -26.74, absolute_magnitude: 4.83, age_billion_years: 4.6, description: 'Our home star, a yellow dwarf at the center of the solar system.' },
  { id: 'star-sirius', name: 'Sirius', constellation_id: 'const-cma', spectral_class: 'A1V', temperature_k: 9940, luminosity_solar: 25.4, mass_solar: 2.06, radius_solar: 1.71, distance_ly: 8.6, apparent_magnitude: -1.46, absolute_magnitude: 1.42, age_billion_years: 0.24, description: 'The brightest star in the night sky, also known as the Dog Star.' },
  { id: 'star-canopus', name: 'Canopus', constellation_id: 'const-car', spectral_class: 'A9II', temperature_k: 7350, luminosity_solar: 10700, mass_solar: 8.0, radius_solar: 71, distance_ly: 310, apparent_magnitude: -0.74, absolute_magnitude: -5.71, description: 'The second brightest star, used for spacecraft navigation.' },
  { id: 'star-alpha-centauri', name: 'Alpha Centauri A', constellation_id: 'const-cen', spectral_class: 'G2V', temperature_k: 5790, luminosity_solar: 1.519, mass_solar: 1.1, radius_solar: 1.227, distance_ly: 4.37, apparent_magnitude: -0.01, absolute_magnitude: 4.38, age_billion_years: 5.3, description: 'Part of the closest star system to Earth.' },
  { id: 'star-arcturus', name: 'Arcturus', constellation_id: 'const-boo', spectral_class: 'K0III', temperature_k: 4286, luminosity_solar: 170, mass_solar: 1.08, radius_solar: 25.4, distance_ly: 36.7, apparent_magnitude: -0.05, absolute_magnitude: -0.30, age_billion_years: 7.1, description: 'The brightest star in the northern celestial hemisphere.' },
  { id: 'star-vega', name: 'Vega', constellation_id: 'const-lyr', spectral_class: 'A0V', temperature_k: 9602, luminosity_solar: 40.12, mass_solar: 2.135, radius_solar: 2.362, distance_ly: 25, apparent_magnitude: 0.03, absolute_magnitude: 0.58, age_billion_years: 0.455, description: 'Once the northern pole star, will be again around 13,700 CE.' },
  { id: 'star-rigel', name: 'Rigel', constellation_id: 'const-ori', spectral_class: 'B8Ia', temperature_k: 12100, luminosity_solar: 120000, mass_solar: 21, radius_solar: 78.9, distance_ly: 860, apparent_magnitude: 0.13, absolute_magnitude: -7.84, age_billion_years: 0.008, description: 'A blue supergiant, one of the brightest stars in the galaxy.' },
  { id: 'star-procyon', name: 'Procyon', constellation_id: 'const-cmi', spectral_class: 'F5IV', temperature_k: 6530, luminosity_solar: 6.93, mass_solar: 1.499, radius_solar: 2.048, distance_ly: 11.46, apparent_magnitude: 0.34, absolute_magnitude: 2.66, age_billion_years: 1.87, description: 'The eighth brightest star in the night sky.' },
  { id: 'star-betelgeuse', name: 'Betelgeuse', constellation_id: 'const-ori', spectral_class: 'M1Ia', temperature_k: 3600, luminosity_solar: 126000, mass_solar: 16.5, radius_solar: 887, distance_ly: 700, apparent_magnitude: 0.50, absolute_magnitude: -5.85, age_billion_years: 0.01, description: 'A red supergiant expected to explode as a supernova.' },
  { id: 'star-altair', name: 'Altair', constellation_id: 'const-aql', spectral_class: 'A7V', temperature_k: 7670, luminosity_solar: 10.6, mass_solar: 1.79, radius_solar: 1.63, distance_ly: 16.73, apparent_magnitude: 0.76, absolute_magnitude: 2.21, age_billion_years: 1.2, description: 'A fast-spinning star, part of the Summer Triangle.' },
  { id: 'star-polaris', name: 'Polaris', constellation_id: 'const-umi', spectral_class: 'F7Ib', temperature_k: 6015, luminosity_solar: 1260, mass_solar: 5.4, radius_solar: 37.5, distance_ly: 433, apparent_magnitude: 1.98, absolute_magnitude: -3.6, description: 'The current North Star, a Cepheid variable.' },
  { id: 'star-proxima', name: 'Proxima Centauri', constellation_id: 'const-cen', spectral_class: 'M5.5Ve', temperature_k: 3042, luminosity_solar: 0.0017, mass_solar: 0.1221, radius_solar: 0.1542, distance_ly: 4.24, apparent_magnitude: 11.13, absolute_magnitude: 15.6, age_billion_years: 4.85, description: 'The closest known star to the Sun, hosts at least two exoplanets.' },
];

export const galaxies: Galaxy[] = [
  { id: 'gal-milky-way', name: 'Milky Way', type: 'spiral', distance_mly: 0, diameter_kly: 100, stars_estimate: '100-400 billion', constellation: 'N/A (we are inside)', apparent_magnitude: -6.5, description: 'Our home galaxy, a barred spiral galaxy.' },
  { id: 'gal-andromeda', name: 'Andromeda Galaxy (M31)', type: 'spiral', distance_mly: 2.537, diameter_kly: 220, stars_estimate: '1 trillion', constellation: 'Andromeda', apparent_magnitude: 3.44, discovered_year: 964, discoverer: 'Abd al-Rahman al-Sufi', description: 'The nearest large galaxy to the Milky Way, approaching us.' },
  { id: 'gal-triangulum', name: 'Triangulum Galaxy (M33)', type: 'spiral', distance_mly: 2.73, diameter_kly: 60, stars_estimate: '40 billion', constellation: 'Triangulum', apparent_magnitude: 5.72, description: 'The third-largest galaxy in the Local Group.' },
  { id: 'gal-lmc', name: 'Large Magellanic Cloud', type: 'irregular', distance_mly: 0.16, diameter_kly: 14, stars_estimate: '30 billion', constellation: 'Dorado', apparent_magnitude: 0.9, description: 'A satellite galaxy of the Milky Way, visible from the southern hemisphere.' },
  { id: 'gal-smc', name: 'Small Magellanic Cloud', type: 'irregular', distance_mly: 0.2, diameter_kly: 7, stars_estimate: '7 billion', constellation: 'Tucana', apparent_magnitude: 2.7, description: 'A dwarf irregular galaxy near the Milky Way.' },
  { id: 'gal-sombrero', name: 'Sombrero Galaxy (M104)', type: 'spiral', distance_mly: 31.1, diameter_kly: 49, stars_estimate: '100 billion', constellation: 'Virgo', apparent_magnitude: 8.98, discovered_year: 1781, discoverer: 'Pierre Méchain', description: 'Named for its unusual hat-like appearance.' },
  { id: 'gal-whirlpool', name: 'Whirlpool Galaxy (M51)', type: 'spiral', distance_mly: 23.2, diameter_kly: 76, stars_estimate: '160 billion', constellation: 'Canes Venatici', apparent_magnitude: 8.4, discovered_year: 1773, discoverer: 'Charles Messier', description: 'A classic spiral galaxy interacting with a smaller companion.' },
  { id: 'gal-centaurus-a', name: 'Centaurus A', type: 'elliptical', distance_mly: 13, diameter_kly: 60, stars_estimate: '300 billion', constellation: 'Centaurus', apparent_magnitude: 6.84, description: 'The fifth brightest galaxy, notable for its active nucleus.' },
  { id: 'gal-m87', name: 'Messier 87 (M87)', type: 'elliptical', distance_mly: 53.5, diameter_kly: 120, stars_estimate: '1 trillion', constellation: 'Virgo', apparent_magnitude: 9.59, discovered_year: 1781, discoverer: 'Charles Messier', description: 'Home to one of the first black holes ever imaged.' },
  { id: 'gal-pinwheel', name: 'Pinwheel Galaxy (M101)', type: 'spiral', distance_mly: 21, diameter_kly: 170, stars_estimate: '1 trillion', constellation: 'Ursa Major', apparent_magnitude: 7.86, discovered_year: 1781, discoverer: 'Pierre Méchain', description: 'A grand design spiral galaxy, nearly twice the size of the Milky Way.' },
];

export const constellations: Constellation[] = [
  { id: 'const-ori', name: 'Orion', abbreviation: 'Ori', genitive: 'Orionis', symbolism: 'The Hunter', area_sq_deg: 594, quadrant: 'NQ1', brightest_star: 'Rigel', visible_latitudes: { from: 85, to: -75 }, description: 'One of the most recognizable constellations, representing a hunter.' },
  { id: 'const-uma', name: 'Ursa Major', abbreviation: 'UMa', genitive: 'Ursae Majoris', symbolism: 'The Great Bear', area_sq_deg: 1280, quadrant: 'NQ2', brightest_star: 'Alioth', visible_latitudes: { from: 90, to: -30 }, description: 'The third-largest constellation, containing the Big Dipper asterism.' },
  { id: 'const-umi', name: 'Ursa Minor', abbreviation: 'UMi', genitive: 'Ursae Minoris', symbolism: 'The Little Bear', area_sq_deg: 256, quadrant: 'NQ3', brightest_star: 'Polaris', visible_latitudes: { from: 90, to: -10 }, description: 'Home to the North Star, Polaris.' },
  { id: 'const-cma', name: 'Canis Major', abbreviation: 'CMa', genitive: 'Canis Majoris', symbolism: 'The Greater Dog', area_sq_deg: 380, quadrant: 'SQ2', brightest_star: 'Sirius', visible_latitudes: { from: 60, to: -90 }, description: 'Contains Sirius, the brightest star in the night sky.' },
  { id: 'const-cmi', name: 'Canis Minor', abbreviation: 'CMi', genitive: 'Canis Minoris', symbolism: 'The Lesser Dog', area_sq_deg: 183, quadrant: 'NQ2', brightest_star: 'Procyon', visible_latitudes: { from: 90, to: -75 }, description: 'A small constellation with the bright star Procyon.' },
  { id: 'const-lyr', name: 'Lyra', abbreviation: 'Lyr', genitive: 'Lyrae', symbolism: 'The Lyre', area_sq_deg: 286, quadrant: 'NQ4', brightest_star: 'Vega', visible_latitudes: { from: 90, to: -40 }, description: 'Contains Vega, one of the brightest stars in the sky.' },
  { id: 'const-aql', name: 'Aquila', abbreviation: 'Aql', genitive: 'Aquilae', symbolism: 'The Eagle', area_sq_deg: 652, quadrant: 'NQ4', brightest_star: 'Altair', visible_latitudes: { from: 85, to: -75 }, description: 'Home to Altair, part of the Summer Triangle.' },
  { id: 'const-cyg', name: 'Cygnus', abbreviation: 'Cyg', genitive: 'Cygni', symbolism: 'The Swan', area_sq_deg: 804, quadrant: 'NQ4', brightest_star: 'Deneb', visible_latitudes: { from: 90, to: -40 }, description: 'Also known as the Northern Cross, contains Deneb.' },
  { id: 'const-sco', name: 'Scorpius', abbreviation: 'Sco', genitive: 'Scorpii', symbolism: 'The Scorpion', area_sq_deg: 497, quadrant: 'SQ3', brightest_star: 'Antares', visible_latitudes: { from: 40, to: -90 }, description: 'A zodiac constellation with the red supergiant Antares.' },
  { id: 'const-cen', name: 'Centaurus', abbreviation: 'Cen', genitive: 'Centauri', symbolism: 'The Centaur', area_sq_deg: 1060, quadrant: 'SQ3', brightest_star: 'Alpha Centauri', visible_latitudes: { from: 25, to: -90 }, description: 'Contains the closest star system to the Sun.' },
  { id: 'const-car', name: 'Carina', abbreviation: 'Car', genitive: 'Carinae', symbolism: 'The Keel', area_sq_deg: 494, quadrant: 'SQ2', brightest_star: 'Canopus', visible_latitudes: { from: 20, to: -90 }, description: 'Home to Canopus, the second brightest star.' },
  { id: 'const-boo', name: 'Boötes', abbreviation: 'Boo', genitive: 'Boötis', symbolism: 'The Herdsman', area_sq_deg: 907, quadrant: 'NQ3', brightest_star: 'Arcturus', visible_latitudes: { from: 90, to: -50 }, description: 'Contains Arcturus, the brightest star in the northern hemisphere.' },
  { id: 'const-none', name: 'Not Applicable', abbreviation: 'N/A', genitive: 'N/A', symbolism: 'N/A', area_sq_deg: 0, quadrant: 'N/A', brightest_star: 'N/A', visible_latitudes: { from: 0, to: 0 }, description: 'Placeholder for objects not in a constellation.' },
];

export const missions: Mission[] = [
  { id: 'mission-apollo11', name: 'Apollo 11', agency: 'NASA', type: 'crewed', status: 'completed', launch_date: '1969-07-16', end_date: '1969-07-24', destination: 'Moon', objectives: ['First crewed lunar landing', 'Return lunar samples'], achievements: ['First humans on the Moon', 'Neil Armstrong\'s first steps'], crew_count: 3, description: 'First mission to land humans on the Moon.' },
  { id: 'mission-voyager1', name: 'Voyager 1', agency: 'NASA', type: 'flyby', status: 'active', launch_date: '1977-09-05', destination: 'Outer Solar System', objectives: ['Study Jupiter and Saturn', 'Explore interstellar space'], achievements: ['Most distant human-made object', 'First to enter interstellar space'], description: 'The most distant spacecraft from Earth, now in interstellar space.' },
  { id: 'mission-voyager2', name: 'Voyager 2', agency: 'NASA', type: 'flyby', status: 'active', launch_date: '1977-08-20', destination: 'Outer Solar System', objectives: ['Grand Tour of outer planets'], achievements: ['Only spacecraft to visit Uranus and Neptune'], description: 'The only spacecraft to have visited all four outer planets.' },
  { id: 'mission-curiosity', name: 'Mars Curiosity', agency: 'NASA', type: 'rover', status: 'active', launch_date: '2011-11-26', destination: 'Mars', objectives: ['Investigate Martian climate and geology', 'Search for signs of habitability'], achievements: ['Found evidence of ancient water', 'Confirmed organic molecules'], description: 'A car-sized rover exploring Gale Crater on Mars.' },
  { id: 'mission-perseverance', name: 'Mars Perseverance', agency: 'NASA', type: 'rover', status: 'active', launch_date: '2020-07-30', destination: 'Mars', objectives: ['Search for signs of ancient microbial life', 'Collect samples for future return'], achievements: ['First powered flight on another planet (Ingenuity)', 'Oxygen production test'], description: 'The most advanced rover ever sent to Mars.' },
  { id: 'mission-jwst', name: 'James Webb Space Telescope', agency: 'NASA/ESA/CSA', type: 'telescope', status: 'active', launch_date: '2021-12-25', destination: 'L2 Lagrange Point', objectives: ['Observe the early universe', 'Study exoplanet atmospheres'], achievements: ['Deepest infrared images of the universe', 'Exoplanet atmosphere analysis'], description: 'The most powerful space telescope ever built.' },
  { id: 'mission-hubble', name: 'Hubble Space Telescope', agency: 'NASA/ESA', type: 'telescope', status: 'active', launch_date: '1990-04-24', destination: 'Low Earth Orbit', objectives: ['Observe distant galaxies', 'Study the expansion of the universe'], achievements: ['Confirmed accelerating expansion', 'Iconic deep field images'], description: 'Has revolutionized our understanding of the cosmos.' },
  { id: 'mission-cassini', name: 'Cassini-Huygens', agency: 'NASA/ESA/ASI', type: 'orbiter', status: 'completed', launch_date: '1997-10-15', end_date: '2017-09-15', destination: 'Saturn', objectives: ['Study Saturn and its moons'], achievements: ['Landed Huygens probe on Titan', 'Discovered ocean on Enceladus'], description: 'Explored Saturn and its moons for 13 years.' },
  { id: 'mission-iss', name: 'International Space Station', agency: 'NASA/Roscosmos/ESA/JAXA/CSA', type: 'crewed', status: 'active', launch_date: '1998-11-20', destination: 'Low Earth Orbit', objectives: ['Long-duration human spaceflight research', 'International cooperation'], achievements: ['Continuous human presence since 2000', 'Over 3000 experiments conducted'], crew_count: 6, description: 'A habitable space station in low Earth orbit.' },
  { id: 'mission-new-horizons', name: 'New Horizons', agency: 'NASA', type: 'flyby', status: 'active', launch_date: '2006-01-19', destination: 'Pluto and Kuiper Belt', objectives: ['First reconnaissance of Pluto'], achievements: ['First detailed images of Pluto', 'Flyby of Arrokoth'], description: 'First spacecraft to explore Pluto up close.' },
  { id: 'mission-artemis1', name: 'Artemis I', agency: 'NASA', type: 'crewed', status: 'completed', launch_date: '2022-11-16', end_date: '2022-12-11', destination: 'Moon', objectives: ['Test Orion spacecraft', 'Prepare for crewed lunar missions'], achievements: ['Farthest distance from Earth for human-rated spacecraft'], description: 'First mission of NASA\'s Artemis program.' },
];

export const astronauts: Astronaut[] = [
  { id: 'astro-armstrong', name: 'Neil Armstrong', nationality: 'American', agency: 'NASA', birth_year: 1930, status: 'deceased', space_flights: 2, total_time_in_space_hours: 206, spacewalks: 1, first_flight_year: 1966, notable_missions: ['Gemini 8', 'Apollo 11'], biography: 'First person to walk on the Moon on July 20, 1969.' },
  { id: 'astro-aldrin', name: 'Buzz Aldrin', nationality: 'American', agency: 'NASA', birth_year: 1930, status: 'retired', space_flights: 2, total_time_in_space_hours: 290, spacewalks: 2, first_flight_year: 1966, notable_missions: ['Gemini 12', 'Apollo 11'], biography: 'Second person to walk on the Moon.' },
  { id: 'astro-gagarin', name: 'Yuri Gagarin', nationality: 'Russian', agency: 'Soviet Space Program', birth_year: 1934, status: 'deceased', space_flights: 1, total_time_in_space_hours: 1.8, spacewalks: 0, first_flight_year: 1961, notable_missions: ['Vostok 1'], biography: 'First human in space on April 12, 1961.' },
  { id: 'astro-tereshkova', name: 'Valentina Tereshkova', nationality: 'Russian', agency: 'Soviet Space Program', birth_year: 1937, status: 'retired', space_flights: 1, total_time_in_space_hours: 70.8, spacewalks: 0, first_flight_year: 1963, notable_missions: ['Vostok 6'], biography: 'First woman in space.' },
  { id: 'astro-shepard', name: 'Alan Shepard', nationality: 'American', agency: 'NASA', birth_year: 1923, status: 'deceased', space_flights: 2, total_time_in_space_hours: 216, spacewalks: 1, first_flight_year: 1961, notable_missions: ['Freedom 7', 'Apollo 14'], biography: 'First American in space, walked on the Moon.' },
  { id: 'astro-ride', name: 'Sally Ride', nationality: 'American', agency: 'NASA', birth_year: 1951, status: 'deceased', space_flights: 2, total_time_in_space_hours: 343, spacewalks: 0, first_flight_year: 1983, notable_missions: ['STS-7', 'STS-41-G'], biography: 'First American woman in space.' },
  { id: 'astro-hadfield', name: 'Chris Hadfield', nationality: 'Canadian', agency: 'CSA', birth_year: 1959, status: 'retired', space_flights: 3, total_time_in_space_hours: 4035, spacewalks: 2, first_flight_year: 1995, notable_missions: ['STS-74', 'Expedition 35'], biography: 'First Canadian to walk in space, ISS commander.' },
  { id: 'astro-kelly', name: 'Scott Kelly', nationality: 'American', agency: 'NASA', birth_year: 1964, status: 'retired', space_flights: 4, total_time_in_space_hours: 8715, spacewalks: 3, first_flight_year: 1999, notable_missions: ['Year in Space Mission'], biography: 'Holds U.S. record for consecutive days in space (340).' },
  { id: 'astro-whitson', name: 'Peggy Whitson', nationality: 'American', agency: 'NASA', birth_year: 1960, status: 'retired', space_flights: 3, total_time_in_space_hours: 9073, spacewalks: 10, first_flight_year: 2002, notable_missions: ['Expedition 16', 'Expedition 51'], biography: 'Most experienced female astronaut in history.' },
  { id: 'astro-jemison', name: 'Mae Jemison', nationality: 'American', agency: 'NASA', birth_year: 1956, status: 'retired', space_flights: 1, total_time_in_space_hours: 190, spacewalks: 0, first_flight_year: 1992, notable_missions: ['STS-47'], biography: 'First African American woman in space.' },
];

export const satellites: Satellite[] = [
  { id: 'sat-iss', name: 'International Space Station', type: 'scientific', operator: 'NASA/Roscosmos/ESA/JAXA/CSA', launch_date: '1998-11-20', orbit_type: 'LEO', altitude_km: 408, status: 'active', description: 'The largest artificial body in low Earth orbit.' },
  { id: 'sat-hubble', name: 'Hubble Space Telescope', type: 'scientific', operator: 'NASA/ESA', launch_date: '1990-04-24', orbit_type: 'LEO', altitude_km: 547, status: 'active', description: 'Space telescope operating in visible and ultraviolet light.' },
  { id: 'sat-gps1', name: 'GPS III SV01', type: 'navigation', operator: 'USSF', launch_date: '2018-12-23', orbit_type: 'MEO', altitude_km: 20200, status: 'active', description: 'Part of the Global Positioning System constellation.' },
  { id: 'sat-goes18', name: 'GOES-18', type: 'weather', operator: 'NOAA', launch_date: '2022-03-01', orbit_type: 'GEO', altitude_km: 35786, status: 'active', description: 'Geostationary weather satellite for the Western Hemisphere.' },
  { id: 'sat-starlink', name: 'Starlink-1', type: 'communication', operator: 'SpaceX', launch_date: '2019-05-23', orbit_type: 'LEO', altitude_km: 550, status: 'active', description: 'Part of the Starlink satellite internet constellation.' },
  { id: 'sat-landsat9', name: 'Landsat 9', type: 'earth_observation', operator: 'NASA/USGS', launch_date: '2021-09-27', orbit_type: 'SSO', altitude_km: 705, status: 'active', description: 'Earth observation satellite continuing the Landsat program.' },
  { id: 'sat-jwst', name: 'James Webb Space Telescope', type: 'scientific', operator: 'NASA/ESA/CSA', launch_date: '2021-12-25', orbit_type: 'HEO', altitude_km: 1500000, status: 'active', description: 'Located at L2, the most powerful space telescope.' },
  { id: 'sat-sentinel1', name: 'Sentinel-1A', type: 'earth_observation', operator: 'ESA', launch_date: '2014-04-03', orbit_type: 'SSO', altitude_km: 693, status: 'active', description: 'Radar imaging satellite for environmental monitoring.' },
];

export const celestialEvents: CelestialEvent[] = [
  { id: 'event-1', name: 'Perseid Meteor Shower', type: 'meteor_shower', date: '2025-08-12', visibility_regions: ['Northern Hemisphere'], peak_time_utc: '04:00', description: 'One of the best meteor showers of the year with up to 100 meteors per hour.' },
  { id: 'event-2', name: 'Total Solar Eclipse', type: 'eclipse', date: '2026-08-12', visibility_regions: ['Greenland', 'Iceland', 'Spain'], description: 'A total solar eclipse visible from parts of Europe and the Arctic.' },
  { id: 'event-3', name: 'Geminid Meteor Shower', type: 'meteor_shower', date: '2025-12-14', visibility_regions: ['Global'], peak_time_utc: '06:00', description: 'Reliable meteor shower producing up to 150 multicolored meteors per hour.' },
  { id: 'event-4', name: 'Total Lunar Eclipse', type: 'eclipse', date: '2025-03-14', visibility_regions: ['Americas', 'Europe', 'Africa'], description: 'A total lunar eclipse, often called a blood moon.' },
  { id: 'event-5', name: 'Mars Opposition', type: 'opposition', date: '2025-01-16', visibility_regions: ['Global'], description: 'Mars at its closest approach to Earth, appearing brightest in the night sky.' },
  { id: 'event-6', name: 'Summer Solstice', type: 'solstice', date: '2025-06-21', visibility_regions: ['Northern Hemisphere'], peak_time_utc: '02:42', description: 'Longest day of the year in the Northern Hemisphere.' },
  { id: 'event-7', name: 'Jupiter-Saturn Conjunction', type: 'conjunction', date: '2040-10-31', visibility_regions: ['Global'], description: 'Jupiter and Saturn will appear very close together in the night sky.' },
  { id: 'event-8', name: 'Transit of Mercury', type: 'transit', date: '2032-11-13', visibility_regions: ['Americas', 'Europe', 'Africa'], description: 'Mercury will pass directly between Earth and the Sun.' },
];
