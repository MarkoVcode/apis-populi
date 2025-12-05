import { createStore } from '../../db/store';
import { Author, Publisher, Genre, Book, Review } from './types';
import { authors as seedAuthors, publishers as seedPublishers, genres as seedGenres, books as seedBooks, reviews as seedReviews } from './seed';

// Create stores for each entity
export const authorsStore = createStore<Author>('books', 'authors');
export const publishersStore = createStore<Publisher>('books', 'publishers');
export const genresStore = createStore<Genre>('books', 'genres');
export const booksStore = createStore<Book & { id?: string }>('books', 'books', 'isbn' as keyof (Book & { id?: string }));
export const reviewsStore = createStore<Review>('books', 'reviews');

let isInitialized = false;

export async function initializeBooksData(): Promise<void> {
  if (isInitialized) return;

  // Check if data already exists
  const existingBooks = await booksStore.getAll();
  if (existingBooks.length > 0) {
    isInitialized = true;
    return;
  }

  // Seed all data
  await Promise.all([
    authorsStore.setMany(seedAuthors),
    publishersStore.setMany(seedPublishers),
    genresStore.setMany(seedGenres),
    booksStore.setMany(seedBooks.map(b => ({ ...b, id: b.isbn }))),
    reviewsStore.setMany(seedReviews),
  ]);

  isInitialized = true;
}

export async function resetBooksData(): Promise<void> {
  // Clear all stores
  await Promise.all([
    authorsStore.clear(),
    publishersStore.clear(),
    genresStore.clear(),
    booksStore.clear(),
    reviewsStore.clear(),
  ]);

  // Re-seed
  isInitialized = false;
  await initializeBooksData();
}

// Helper to get reviews for a book
export async function getBookReviews(isbn: string): Promise<Review[]> {
  const allReviews = await reviewsStore.getAll();
  return allReviews.filter(r => r.book_isbn === isbn);
}

// Helper to get books by author
export async function getBooksByAuthor(authorId: string): Promise<Book[]> {
  const allBooks = await booksStore.getAll();
  return allBooks.filter(b => b.author_id === authorId);
}

// Helper to get books by publisher
export async function getBooksByPublisher(publisherId: string): Promise<Book[]> {
  const allBooks = await booksStore.getAll();
  return allBooks.filter(b => b.publisher_id === publisherId);
}

// Helper to get books by genre
export async function getBooksByGenre(genreId: string): Promise<Book[]> {
  const allBooks = await booksStore.getAll();
  return allBooks.filter(b => b.genre_id === genreId);
}

// Full-text search across books and authors
export async function searchBooks(query: string): Promise<{ books: Book[]; authors: Author[] }> {
  const searchTerm = query.toLowerCase();

  const [allBooks, allAuthors] = await Promise.all([
    booksStore.getAll(),
    authorsStore.getAll(),
  ]);

  const matchingBooks = allBooks.filter(b =>
    b.title.toLowerCase().includes(searchTerm) ||
    b.description.toLowerCase().includes(searchTerm)
  );

  const matchingAuthors = allAuthors.filter(a =>
    a.name.toLowerCase().includes(searchTerm) ||
    a.biography.toLowerCase().includes(searchTerm)
  );

  return { books: matchingBooks, authors: matchingAuthors };
}
