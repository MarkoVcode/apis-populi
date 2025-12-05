import { createStore } from '../../db/store';
import { Planet, Moon, Star, Galaxy, Constellation, Mission, Astronaut, Satellite, CelestialEvent } from './types';
import { planets as seedPlanets, moons as seedMoons, stars as seedStars, galaxies as seedGalaxies, constellations as seedConstellations, missions as seedMissions, astronauts as seedAstronauts, satellites as seedSatellites, celestialEvents as seedEvents } from './seed';

export const planetsStore = createStore<Planet>('space', 'planets');
export const moonsStore = createStore<Moon>('space', 'moons');
export const starsStore = createStore<Star>('space', 'stars');
export const galaxiesStore = createStore<Galaxy>('space', 'galaxies');
export const constellationsStore = createStore<Constellation>('space', 'constellations');
export const missionsStore = createStore<Mission>('space', 'missions');
export const astronautsStore = createStore<Astronaut>('space', 'astronauts');
export const satellitesStore = createStore<Satellite>('space', 'satellites');
export const eventsStore = createStore<CelestialEvent>('space', 'events');

let isInitialized = false;

export async function initializeSpaceData(): Promise<void> {
  if (isInitialized) return;

  const existingPlanets = await planetsStore.getAll();
  if (existingPlanets.length > 0) {
    isInitialized = true;
    return;
  }

  await Promise.all([
    planetsStore.setMany(seedPlanets),
    moonsStore.setMany(seedMoons),
    starsStore.setMany(seedStars),
    galaxiesStore.setMany(seedGalaxies),
    constellationsStore.setMany(seedConstellations),
    missionsStore.setMany(seedMissions),
    astronautsStore.setMany(seedAstronauts),
    satellitesStore.setMany(seedSatellites),
    eventsStore.setMany(seedEvents),
  ]);

  isInitialized = true;
}

export async function resetSpaceData(): Promise<void> {
  await Promise.all([
    planetsStore.clear(),
    moonsStore.clear(),
    starsStore.clear(),
    galaxiesStore.clear(),
    constellationsStore.clear(),
    missionsStore.clear(),
    astronautsStore.clear(),
    satellitesStore.clear(),
    eventsStore.clear(),
  ]);

  isInitialized = false;
  await initializeSpaceData();
}

export async function getPlanetMoons(planetId: string): Promise<Moon[]> {
  const allMoons = await moonsStore.getAll();
  return allMoons.filter(m => m.planet_id === planetId);
}

export async function getStarPlanets(starSystemName: string): Promise<Planet[]> {
  const allPlanets = await planetsStore.getAll();
  return allPlanets.filter(p => p.star_system === starSystemName);
}

export async function getConstellationStars(constellationId: string): Promise<Star[]> {
  const allStars = await starsStore.getAll();
  return allStars.filter(s => s.constellation_id === constellationId);
}

export async function getAstronautMissions(astronautId: string): Promise<Mission[]> {
  const astronaut = await astronautsStore.get(astronautId);
  if (!astronaut) return [];

  const allMissions = await missionsStore.getAll();
  return allMissions.filter(m => astronaut.notable_missions.includes(m.name));
}

export async function searchSpace(query: string): Promise<{
  planets: Planet[];
  stars: Star[];
  galaxies: Galaxy[];
  missions: Mission[];
  astronauts: Astronaut[];
}> {
  const searchTerm = query.toLowerCase();

  const [planets, stars, galaxies, missions, astronauts] = await Promise.all([
    planetsStore.getAll(),
    starsStore.getAll(),
    galaxiesStore.getAll(),
    missionsStore.getAll(),
    astronautsStore.getAll(),
  ]);

  return {
    planets: planets.filter(p => p.name.toLowerCase().includes(searchTerm) || p.description.toLowerCase().includes(searchTerm)),
    stars: stars.filter(s => s.name.toLowerCase().includes(searchTerm) || s.description.toLowerCase().includes(searchTerm)),
    galaxies: galaxies.filter(g => g.name.toLowerCase().includes(searchTerm) || g.description.toLowerCase().includes(searchTerm)),
    missions: missions.filter(m => m.name.toLowerCase().includes(searchTerm) || m.description.toLowerCase().includes(searchTerm)),
    astronauts: astronauts.filter(a => a.name.toLowerCase().includes(searchTerm) || a.biography.toLowerCase().includes(searchTerm)),
  };
}

export function calculateDistance(obj1: { distance_ly?: number; distance_mly?: number }, obj2: { distance_ly?: number; distance_mly?: number }): { light_years: number; kilometers: number } {
  const ly1 = obj1.distance_ly || (obj1.distance_mly ? obj1.distance_mly * 1e6 : 0);
  const ly2 = obj2.distance_ly || (obj2.distance_mly ? obj2.distance_mly * 1e6 : 0);
  const distanceLy = Math.abs(ly2 - ly1);
  const distanceKm = distanceLy * 9.461e12;

  return {
    light_years: distanceLy,
    kilometers: distanceKm,
  };
}
