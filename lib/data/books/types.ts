export interface Author {
  id: string;
  name: string;
  birth_year: number;
  death_year?: number;
  nationality: string;
  biography: string;
  created_at: string;
  updated_at: string;
}

export interface Publisher {
  id: string;
  name: string;
  founded_year: number;
  headquarters: string;
  website: string;
  created_at: string;
}

export interface Genre {
  id: string;
  name: string;
  description: string;
}

export interface Book {
  isbn: string;
  title: string;
  author_id: string;
  publisher_id: string;
  genre_id: string;
  publication_year: number;
  pages: number;
  language: string;
  description: string;
  price: number;
  in_stock: boolean;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  book_isbn: string;
  reviewer_name: string;
  rating: number;
  title: string;
  content: string;
  verified_purchase: boolean;
  helpful_votes: number;
  created_at: string;
}

export interface BookWithRelations extends Book {
  author?: Author;
  publisher?: Publisher;
  genre?: Genre;
}
