import { createStore } from '../../db/store';
import { Airport, Airline, Flight, Passenger, Booking } from './types';
import { airports as seedAirports, airlines as seedAirlines, flights as seedFlights, passengers as seedPassengers, bookings as seedBookings } from './seed';

export const airportsStore = createStore<Airport & { id?: string }>('flights', 'airports', 'code' as keyof (Airport & { id?: string }));
export const airlinesStore = createStore<Airline & { id?: string }>('flights', 'airlines', 'code' as keyof (Airline & { id?: string }));
export const flightsStore = createStore<Flight>('flights', 'flights');
export const passengersStore = createStore<Passenger>('flights', 'passengers');
export const bookingsStore = createStore<Booking>('flights', 'bookings');

let isInitialized = false;

export async function initializeFlightsData(): Promise<void> {
  if (isInitialized) return;

  const existingAirports = await airportsStore.getAll();
  if (existingAirports.length > 0) {
    isInitialized = true;
    return;
  }

  await Promise.all([
    airportsStore.setMany(seedAirports.map(a => ({ ...a, id: a.code }))),
    airlinesStore.setMany(seedAirlines.map(a => ({ ...a, id: a.code }))),
    flightsStore.setMany(seedFlights),
    passengersStore.setMany(seedPassengers),
    bookingsStore.setMany(seedBookings),
  ]);

  isInitialized = true;
}

export async function resetFlightsData(): Promise<void> {
  await Promise.all([
    airportsStore.clear(),
    airlinesStore.clear(),
    flightsStore.clear(),
    passengersStore.clear(),
    bookingsStore.clear(),
  ]);

  isInitialized = false;
  await initializeFlightsData();
}

export async function searchFlights(params: {
  origin?: string;
  destination?: string;
  date?: string;
  class?: 'economy' | 'business' | 'first';
}): Promise<Flight[]> {
  let flights = await flightsStore.getAll();

  if (params.origin) {
    flights = flights.filter(f => f.origin === params.origin);
  }
  if (params.destination) {
    flights = flights.filter(f => f.destination === params.destination);
  }
  if (params.date) {
    flights = flights.filter(f => f.departure_time.startsWith(params.date!));
  }
  if (params.class) {
    flights = flights.filter(f => f.seats_available[params.class!] > 0);
  }

  return flights;
}

export async function getFlightWithDetails(flightId: string): Promise<{
  flight: Flight;
  airline: Airline | null;
  origin_airport: Airport | null;
  destination_airport: Airport | null;
} | null> {
  const flight = await flightsStore.get(flightId);
  if (!flight) return null;

  const [airline, origin, destination] = await Promise.all([
    airlinesStore.get(flight.airline_code),
    airportsStore.get(flight.origin),
    airportsStore.get(flight.destination),
  ]);

  return {
    flight,
    airline,
    origin_airport: origin,
    destination_airport: destination,
  };
}

export async function getBookingWithDetails(bookingId: string): Promise<{
  booking: Booking;
  flight: Flight | null;
  passengers: Passenger[];
} | null> {
  const booking = await bookingsStore.get(bookingId);
  if (!booking) return null;

  const [flight, allPassengers] = await Promise.all([
    flightsStore.get(booking.flight_id),
    passengersStore.getAll(),
  ]);

  const passengers = allPassengers.filter(p => booking.passenger_ids.includes(p.id));

  return {
    booking,
    flight,
    passengers,
  };
}
