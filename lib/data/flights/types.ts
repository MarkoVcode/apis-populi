export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface Airline {
  code: string;
  name: string;
  country: string;
  hub_airports: string[];
  alliance?: string;
}

export interface Flight {
  id: string;
  flight_number: string;
  airline_code: string;
  origin: string;
  destination: string;
  departure_time: string;
  arrival_time: string;
  duration_minutes: number;
  aircraft_type: string;
  status: 'scheduled' | 'boarding' | 'departed' | 'in_flight' | 'landed' | 'cancelled' | 'delayed';
  price: {
    economy: number;
    business: number;
    first: number;
  };
  seats_available: {
    economy: number;
    business: number;
    first: number;
  };
}

export interface Passenger {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  passport_number?: string;
  date_of_birth: string;
  frequent_flyer_number?: string;
}

export interface Booking {
  id: string;
  flight_id: string;
  passenger_ids: string[];
  booking_reference: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'checked_in';
  class: 'economy' | 'business' | 'first';
  total_price: number;
  payment_status: 'pending' | 'paid' | 'refunded';
  seat_assignments: { passenger_id: string; seat: string }[];
  created_at: string;
  updated_at: string;
}
