export interface Planet {
  id: string;
  name: string;
  type: 'terrestrial' | 'gas_giant' | 'ice_giant' | 'dwarf';
  star_system: string;
  mass_kg: number;
  mass_earth: number;
  radius_km: number;
  radius_earth: number;
  distance_from_star_km: number;
  distance_au: number;
  orbital_period_days: number;
  rotation_period_hours: number;
  moons_count: number;
  has_rings: boolean;
  habitable: boolean;
  atmosphere: string[];
  surface_temperature_c: { min: number; max: number; avg: number };
  gravity_ms2: number;
  discovered_year?: number;
  description: string;
}

export interface Moon {
  id: string;
  name: string;
  planet_id: string;
  radius_km: number;
  mass_kg: number;
  orbital_period_days: number;
  distance_from_planet_km: number;
  discovered_year: number;
  discoverer?: string;
  description: string;
}

export interface Star {
  id: string;
  name: string;
  constellation_id: string;
  spectral_class: string;
  temperature_k: number;
  luminosity_solar: number;
  mass_solar: number;
  radius_solar: number;
  distance_ly: number;
  apparent_magnitude: number;
  absolute_magnitude: number;
  age_billion_years?: number;
  description: string;
}

export interface Galaxy {
  id: string;
  name: string;
  type: 'spiral' | 'elliptical' | 'irregular' | 'lenticular';
  distance_mly: number;
  diameter_kly: number;
  stars_estimate: string;
  constellation: string;
  apparent_magnitude: number;
  discovered_year?: number;
  discoverer?: string;
  description: string;
}

export interface Constellation {
  id: string;
  name: string;
  abbreviation: string;
  genitive: string;
  symbolism: string;
  area_sq_deg: number;
  quadrant: string;
  brightest_star: string;
  visible_latitudes: { from: number; to: number };
  description: string;
}

export interface Mission {
  id: string;
  name: string;
  agency: string;
  type: 'crewed' | 'robotic' | 'satellite' | 'telescope' | 'rover' | 'flyby' | 'orbiter' | 'lander';
  status: 'planned' | 'active' | 'completed' | 'failed';
  launch_date: string;
  end_date?: string;
  destination: string;
  objectives: string[];
  achievements: string[];
  crew_count?: number;
  description: string;
}

export interface Astronaut {
  id: string;
  name: string;
  nationality: string;
  agency: string;
  birth_year: number;
  status: 'active' | 'retired' | 'deceased';
  space_flights: number;
  total_time_in_space_hours: number;
  spacewalks: number;
  first_flight_year: number;
  notable_missions: string[];
  biography: string;
}

export interface Satellite {
  id: string;
  name: string;
  type: 'communication' | 'weather' | 'navigation' | 'scientific' | 'military' | 'earth_observation';
  operator: string;
  launch_date: string;
  orbit_type: 'LEO' | 'MEO' | 'GEO' | 'HEO' | 'SSO';
  altitude_km: number;
  status: 'active' | 'inactive' | 'deorbited';
  description: string;
}

export interface CelestialEvent {
  id: string;
  name: string;
  type: 'eclipse' | 'meteor_shower' | 'conjunction' | 'transit' | 'opposition' | 'solstice' | 'equinox';
  date: string;
  visibility_regions: string[];
  peak_time_utc?: string;
  description: string;
}
