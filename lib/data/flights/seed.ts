import { Airport, Airline, Flight, Passenger, Booking } from './types';

export const airports: Airport[] = [
  { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'United States', latitude: 40.6413, longitude: -73.7781, timezone: 'America/New_York' },
  { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'United States', latitude: 33.9425, longitude: -118.4081, timezone: 'America/Los_Angeles' },
  { code: 'ORD', name: "O'Hare International Airport", city: 'Chicago', country: 'United States', latitude: 41.9742, longitude: -87.9073, timezone: 'America/Chicago' },
  { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom', latitude: 51.4700, longitude: -0.4543, timezone: 'Europe/London' },
  { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France', latitude: 49.0097, longitude: 2.5479, timezone: 'Europe/Paris' },
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', latitude: 50.0379, longitude: 8.5622, timezone: 'Europe/Berlin' },
  { code: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands', latitude: 52.3105, longitude: 4.7683, timezone: 'Europe/Amsterdam' },
  { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'United Arab Emirates', latitude: 25.2532, longitude: 55.3657, timezone: 'Asia/Dubai' },
  { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore', latitude: 1.3644, longitude: 103.9915, timezone: 'Asia/Singapore' },
  { code: 'NRT', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan', latitude: 35.7647, longitude: 140.3864, timezone: 'Asia/Tokyo' },
  { code: 'HND', name: 'Haneda Airport', city: 'Tokyo', country: 'Japan', latitude: 35.5494, longitude: 139.7798, timezone: 'Asia/Tokyo' },
  { code: 'SYD', name: 'Sydney Airport', city: 'Sydney', country: 'Australia', latitude: -33.9399, longitude: 151.1753, timezone: 'Australia/Sydney' },
  { code: 'HKG', name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'Hong Kong', latitude: 22.3080, longitude: 113.9185, timezone: 'Asia/Hong_Kong' },
  { code: 'ICN', name: 'Incheon International Airport', city: 'Seoul', country: 'South Korea', latitude: 37.4602, longitude: 126.4407, timezone: 'Asia/Seoul' },
  { code: 'PEK', name: 'Beijing Capital International Airport', city: 'Beijing', country: 'China', latitude: 40.0799, longitude: 116.6031, timezone: 'Asia/Shanghai' },
  { code: 'SFO', name: 'San Francisco International Airport', city: 'San Francisco', country: 'United States', latitude: 37.6213, longitude: -122.3790, timezone: 'America/Los_Angeles' },
  { code: 'MIA', name: 'Miami International Airport', city: 'Miami', country: 'United States', latitude: 25.7959, longitude: -80.2870, timezone: 'America/New_York' },
  { code: 'ATL', name: 'Hartsfield-Jackson Atlanta International Airport', city: 'Atlanta', country: 'United States', latitude: 33.6407, longitude: -84.4277, timezone: 'America/New_York' },
  { code: 'DFW', name: 'Dallas/Fort Worth International Airport', city: 'Dallas', country: 'United States', latitude: 32.8998, longitude: -97.0403, timezone: 'America/Chicago' },
  { code: 'MAD', name: 'Adolfo Suárez Madrid–Barajas Airport', city: 'Madrid', country: 'Spain', latitude: 40.4983, longitude: -3.5676, timezone: 'Europe/Madrid' },
  { code: 'FCO', name: 'Leonardo da Vinci International Airport', city: 'Rome', country: 'Italy', latitude: 41.8003, longitude: 12.2389, timezone: 'Europe/Rome' },
  { code: 'MUC', name: 'Munich Airport', city: 'Munich', country: 'Germany', latitude: 48.3537, longitude: 11.7750, timezone: 'Europe/Berlin' },
  { code: 'ZRH', name: 'Zurich Airport', city: 'Zurich', country: 'Switzerland', latitude: 47.4647, longitude: 8.5492, timezone: 'Europe/Zurich' },
  { code: 'YYZ', name: 'Toronto Pearson International Airport', city: 'Toronto', country: 'Canada', latitude: 43.6777, longitude: -79.6248, timezone: 'America/Toronto' },
  { code: 'MEX', name: 'Mexico City International Airport', city: 'Mexico City', country: 'Mexico', latitude: 19.4361, longitude: -99.0719, timezone: 'America/Mexico_City' },
];

export const airlines: Airline[] = [
  { code: 'AA', name: 'American Airlines', country: 'United States', hub_airports: ['DFW', 'MIA', 'ORD', 'JFK', 'LAX'], alliance: 'Oneworld' },
  { code: 'UA', name: 'United Airlines', country: 'United States', hub_airports: ['ORD', 'IAH', 'EWR', 'SFO', 'LAX'], alliance: 'Star Alliance' },
  { code: 'DL', name: 'Delta Air Lines', country: 'United States', hub_airports: ['ATL', 'DTW', 'MSP', 'JFK', 'LAX'], alliance: 'SkyTeam' },
  { code: 'BA', name: 'British Airways', country: 'United Kingdom', hub_airports: ['LHR', 'LGW'], alliance: 'Oneworld' },
  { code: 'LH', name: 'Lufthansa', country: 'Germany', hub_airports: ['FRA', 'MUC'], alliance: 'Star Alliance' },
  { code: 'AF', name: 'Air France', country: 'France', hub_airports: ['CDG', 'ORY'], alliance: 'SkyTeam' },
  { code: 'KL', name: 'KLM Royal Dutch Airlines', country: 'Netherlands', hub_airports: ['AMS'], alliance: 'SkyTeam' },
  { code: 'EK', name: 'Emirates', country: 'United Arab Emirates', hub_airports: ['DXB'] },
  { code: 'SQ', name: 'Singapore Airlines', country: 'Singapore', hub_airports: ['SIN'], alliance: 'Star Alliance' },
  { code: 'QF', name: 'Qantas', country: 'Australia', hub_airports: ['SYD', 'MEL'], alliance: 'Oneworld' },
  { code: 'JL', name: 'Japan Airlines', country: 'Japan', hub_airports: ['NRT', 'HND'], alliance: 'Oneworld' },
  { code: 'NH', name: 'All Nippon Airways', country: 'Japan', hub_airports: ['NRT', 'HND'], alliance: 'Star Alliance' },
  { code: 'CX', name: 'Cathay Pacific', country: 'Hong Kong', hub_airports: ['HKG'], alliance: 'Oneworld' },
  { code: 'IB', name: 'Iberia', country: 'Spain', hub_airports: ['MAD'], alliance: 'Oneworld' },
  { code: 'AZ', name: 'ITA Airways', country: 'Italy', hub_airports: ['FCO'], alliance: 'SkyTeam' },
];

function generateFlightNumber(airlineCode: string, index: number): string {
  return `${airlineCode}${100 + index}`;
}

function calculateFlightDuration(origin: Airport, destination: Airport): number {
  // Simple distance-based calculation (not accurate, but realistic-looking)
  const R = 6371; // Earth's radius in km
  const dLat = (destination.latitude - origin.latitude) * Math.PI / 180;
  const dLon = (destination.longitude - origin.longitude) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(origin.latitude * Math.PI / 180) * Math.cos(destination.latitude * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;

  // Average speed of 800 km/h + 30 min for takeoff/landing
  return Math.round(distance / 800 * 60 + 30);
}

const routes = [
  ['JFK', 'LHR'], ['JFK', 'CDG'], ['JFK', 'LAX'], ['JFK', 'SFO'], ['JFK', 'MIA'],
  ['LAX', 'NRT'], ['LAX', 'SYD'], ['LAX', 'SIN'], ['LAX', 'HKG'],
  ['LHR', 'JFK'], ['LHR', 'DXB'], ['LHR', 'SIN'], ['LHR', 'HKG'],
  ['CDG', 'JFK'], ['CDG', 'NRT'], ['CDG', 'DXB'],
  ['FRA', 'JFK'], ['FRA', 'SIN'], ['FRA', 'NRT'],
  ['DXB', 'LHR'], ['DXB', 'SIN'], ['DXB', 'SYD'], ['DXB', 'JFK'],
  ['SIN', 'SYD'], ['SIN', 'LHR'], ['SIN', 'NRT'],
  ['ORD', 'LHR'], ['ORD', 'NRT'], ['ORD', 'LAX'],
  ['ATL', 'LHR'], ['ATL', 'CDG'],
];

const statuses: Flight['status'][] = ['scheduled', 'scheduled', 'scheduled', 'scheduled', 'boarding', 'departed', 'in_flight', 'landed', 'delayed'];
const aircraft = ['Boeing 777-300ER', 'Boeing 787-9 Dreamliner', 'Airbus A380', 'Airbus A350-900', 'Boeing 737 MAX 8', 'Airbus A321neo'];

export const flights: Flight[] = [];

routes.forEach((route, routeIndex) => {
  const origin = airports.find(a => a.code === route[0])!;
  const destination = airports.find(a => a.code === route[1])!;
  const airline = airlines[routeIndex % airlines.length];

  // Generate 2-3 flights per route per day
  for (let i = 0; i < 3; i++) {
    const departureHour = 6 + Math.floor(Math.random() * 16); // 6 AM - 10 PM
    const duration = calculateFlightDuration(origin, destination);
    const baseDate = new Date(2025, 0, 15 + Math.floor(routeIndex / 10));
    const departureTime = new Date(baseDate);
    departureTime.setHours(departureHour, Math.floor(Math.random() * 60));

    const arrivalTime = new Date(departureTime.getTime() + duration * 60000);

    const economyPrice = 200 + Math.floor(duration * 1.5) + Math.floor(Math.random() * 300);

    flights.push({
      id: `flight-${routeIndex}-${i}`,
      flight_number: generateFlightNumber(airline.code, routeIndex * 10 + i),
      airline_code: airline.code,
      origin: origin.code,
      destination: destination.code,
      departure_time: departureTime.toISOString(),
      arrival_time: arrivalTime.toISOString(),
      duration_minutes: duration,
      aircraft_type: aircraft[Math.floor(Math.random() * aircraft.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      price: {
        economy: economyPrice,
        business: Math.round(economyPrice * 2.5),
        first: Math.round(economyPrice * 5),
      },
      seats_available: {
        economy: Math.floor(Math.random() * 50) + 10,
        business: Math.floor(Math.random() * 20) + 5,
        first: Math.floor(Math.random() * 10) + 2,
      },
    });
  }
});

const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'James', 'Emma', 'Robert', 'Olivia'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

export const passengers: Passenger[] = [];
for (let i = 0; i < 100; i++) {
  passengers.push({
    id: `passenger-${i + 1}`,
    first_name: firstNames[i % firstNames.length],
    last_name: lastNames[Math.floor(i / 10) % lastNames.length],
    email: `passenger${i + 1}@example.com`,
    phone: `+1-555-${String(1000 + i).padStart(4, '0')}`,
    date_of_birth: `${1960 + Math.floor(Math.random() * 40)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    frequent_flyer_number: Math.random() > 0.5 ? `FF${100000 + i}` : undefined,
  });
}

function generateBookingReference(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

const classes: Booking['class'][] = ['economy', 'economy', 'economy', 'business', 'first'];
const bookingStatuses: Booking['status'][] = ['confirmed', 'confirmed', 'confirmed', 'pending', 'checked_in'];
const paymentStatuses: Booking['payment_status'][] = ['paid', 'paid', 'paid', 'pending'];

export const bookings: Booking[] = [];
for (let i = 0; i < 80; i++) {
  const flight = flights[i % flights.length];
  const passengerCount = 1 + Math.floor(Math.random() * 3);
  const passengerIds = passengers.slice(i * 2, i * 2 + passengerCount).map(p => p.id);
  const bookingClass = classes[Math.floor(Math.random() * classes.length)];

  bookings.push({
    id: `booking-${i + 1}`,
    flight_id: flight.id,
    passenger_ids: passengerIds,
    booking_reference: generateBookingReference(),
    status: bookingStatuses[Math.floor(Math.random() * bookingStatuses.length)],
    class: bookingClass,
    total_price: flight.price[bookingClass] * passengerCount,
    payment_status: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
    seat_assignments: passengerIds.map((pid, idx) => ({
      passenger_id: pid,
      seat: `${10 + Math.floor(idx / 6)}${['A', 'B', 'C', 'D', 'E', 'F'][idx % 6]}`,
    })),
    created_at: new Date(2024, 11, 1 + Math.floor(Math.random() * 30)).toISOString(),
    updated_at: new Date().toISOString(),
  });
}
