import { Author, Publisher, Genre, Book, Review } from './types';

export const authors: Author[] = [
  { id: 'author-1', name: 'George Orwell', birth_year: 1903, death_year: 1950, nationality: 'British', biography: 'English novelist and essayist, best known for Animal Farm and Nineteen Eighty-Four.', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'author-2', name: 'Jane Austen', birth_year: 1775, death_year: 1817, nationality: 'British', biography: 'English novelist known for her commentary on British landed gentry.', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'author-3', name: 'F. Scott Fitzgerald', birth_year: 1896, death_year: 1940, nationality: 'American', biography: 'American novelist widely regarded as one of the greatest writers of the twentieth century.', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'author-4', name: 'Harper Lee', birth_year: 1926, death_year: 2016, nationality: 'American', biography: 'American novelist best known for To Kill a Mockingbird.', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'author-5', name: 'Ernest Hemingway', birth_year: 1899, death_year: 1961, nationality: 'American', biography: 'American novelist and journalist, known for his economical and understated style.', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'author-6', name: 'Mark Twain', birth_year: 1835, death_year: 1910, nationality: 'American', biography: 'American writer, humorist, and lecturer, called the father of American literature.', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'author-7', name: 'Charles Dickens', birth_year: 1812, death_year: 1870, nationality: 'British', biography: 'English writer and social critic, created some of the world\'s best-known fictional characters.', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'author-8', name: 'Leo Tolstoy', birth_year: 1828, death_year: 1910, nationality: 'Russian', biography: 'Russian writer regarded as one of the greatest authors of all time.', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'author-9', name: 'Virginia Woolf', birth_year: 1882, death_year: 1941, nationality: 'British', biography: 'English writer and modernist, one of the foremost modernists of the twentieth century.', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'author-10', name: 'Gabriel García Márquez', birth_year: 1927, death_year: 2014, nationality: 'Colombian', biography: 'Colombian novelist and Nobel Prize winner, known for magical realism.', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'author-11', name: 'Franz Kafka', birth_year: 1883, death_year: 1924, nationality: 'Czech', biography: 'German-speaking Bohemian novelist known for his surreal and existentialist works.', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'author-12', name: 'Oscar Wilde', birth_year: 1854, death_year: 1900, nationality: 'Irish', biography: 'Irish poet and playwright, known for his wit and flamboyant style.', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'author-13', name: 'Emily Brontë', birth_year: 1818, death_year: 1848, nationality: 'British', biography: 'English novelist and poet, best known for Wuthering Heights.', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'author-14', name: 'Fyodor Dostoevsky', birth_year: 1821, death_year: 1881, nationality: 'Russian', biography: 'Russian novelist whose psychological penetration into the human soul had a profound influence on the novel.', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'author-15', name: 'Mary Shelley', birth_year: 1797, death_year: 1851, nationality: 'British', biography: 'English novelist who wrote Frankenstein, considered an early example of science fiction.', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'author-16', name: 'Herman Melville', birth_year: 1819, death_year: 1891, nationality: 'American', biography: 'American novelist, short story writer, and poet, best known for Moby-Dick.', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'author-17', name: 'Aldous Huxley', birth_year: 1894, death_year: 1963, nationality: 'British', biography: 'English writer and philosopher, best known for Brave New World.', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'author-18', name: 'J.R.R. Tolkien', birth_year: 1892, death_year: 1973, nationality: 'British', biography: 'English writer, poet, and academic, best known for The Hobbit and The Lord of the Rings.', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'author-19', name: 'Agatha Christie', birth_year: 1890, death_year: 1976, nationality: 'British', biography: 'English writer known for her detective novels, the best-selling fiction writer of all time.', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'author-20', name: 'Ray Bradbury', birth_year: 1920, death_year: 2012, nationality: 'American', biography: 'American author known for his dystopian novel Fahrenheit 451.', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
];

export const publishers: Publisher[] = [
  { id: 'pub-1', name: 'Penguin Random House', founded_year: 1935, headquarters: 'New York, USA', website: 'https://www.penguinrandomhouse.com', created_at: '2024-01-01T00:00:00Z' },
  { id: 'pub-2', name: 'HarperCollins', founded_year: 1989, headquarters: 'New York, USA', website: 'https://www.harpercollins.com', created_at: '2024-01-01T00:00:00Z' },
  { id: 'pub-3', name: 'Simon & Schuster', founded_year: 1924, headquarters: 'New York, USA', website: 'https://www.simonandschuster.com', created_at: '2024-01-01T00:00:00Z' },
  { id: 'pub-4', name: 'Hachette Book Group', founded_year: 2006, headquarters: 'New York, USA', website: 'https://www.hachettebookgroup.com', created_at: '2024-01-01T00:00:00Z' },
  { id: 'pub-5', name: 'Macmillan Publishers', founded_year: 1843, headquarters: 'London, UK', website: 'https://www.macmillan.com', created_at: '2024-01-01T00:00:00Z' },
  { id: 'pub-6', name: 'Oxford University Press', founded_year: 1586, headquarters: 'Oxford, UK', website: 'https://global.oup.com', created_at: '2024-01-01T00:00:00Z' },
  { id: 'pub-7', name: 'Cambridge University Press', founded_year: 1534, headquarters: 'Cambridge, UK', website: 'https://www.cambridge.org', created_at: '2024-01-01T00:00:00Z' },
  { id: 'pub-8', name: 'Vintage Books', founded_year: 1954, headquarters: 'New York, USA', website: 'https://www.vintagebooks.com', created_at: '2024-01-01T00:00:00Z' },
  { id: 'pub-9', name: 'Scribner', founded_year: 1846, headquarters: 'New York, USA', website: 'https://www.simonandschusterpublishing.com/scribner', created_at: '2024-01-01T00:00:00Z' },
  { id: 'pub-10', name: 'Everyman\'s Library', founded_year: 1906, headquarters: 'London, UK', website: 'https://www.everymans-library.com', created_at: '2024-01-01T00:00:00Z' },
];

export const genres: Genre[] = [
  { id: 'genre-1', name: 'Classic Literature', description: 'Works of fiction that have stood the test of time and are widely considered to be of lasting artistic merit.' },
  { id: 'genre-2', name: 'Science Fiction', description: 'Fiction dealing with futuristic concepts such as advanced science, technology, and space exploration.' },
  { id: 'genre-3', name: 'Fantasy', description: 'Fiction featuring magical and supernatural elements set in imaginary universes.' },
  { id: 'genre-4', name: 'Mystery', description: 'Fiction dealing with the solution of a crime or the unraveling of secrets.' },
  { id: 'genre-5', name: 'Romance', description: 'Fiction focusing on romantic relationships between characters.' },
  { id: 'genre-6', name: 'Horror', description: 'Fiction intended to frighten, scare, or disgust through suspenseful storytelling.' },
  { id: 'genre-7', name: 'Dystopian', description: 'Fiction set in a dark, oppressive society usually set in the future.' },
  { id: 'genre-8', name: 'Historical Fiction', description: 'Fiction set in a particular period of history, incorporating real historical events.' },
  { id: 'genre-9', name: 'Thriller', description: 'Fiction characterized by fast pacing, tension, and excitement.' },
  { id: 'genre-10', name: 'Philosophy', description: 'Works exploring fundamental questions about existence, knowledge, and ethics.' },
];

export const books: Book[] = [
  { isbn: '978-0451524935', title: '1984', author_id: 'author-1', publisher_id: 'pub-1', genre_id: 'genre-7', publication_year: 1949, pages: 328, language: 'English', description: 'A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism.', price: 9.99, in_stock: true, rating: 4.7, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { isbn: '978-0452284234', title: 'Animal Farm', author_id: 'author-1', publisher_id: 'pub-1', genre_id: 'genre-1', publication_year: 1945, pages: 112, language: 'English', description: 'An allegorical novella reflecting events leading up to the Russian Revolution.', price: 8.99, in_stock: true, rating: 4.6, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { isbn: '978-0141439518', title: 'Pride and Prejudice', author_id: 'author-2', publisher_id: 'pub-1', genre_id: 'genre-5', publication_year: 1813, pages: 432, language: 'English', description: 'A romantic novel following the emotional development of Elizabeth Bennet.', price: 7.99, in_stock: true, rating: 4.8, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { isbn: '978-0141439587', title: 'Sense and Sensibility', author_id: 'author-2', publisher_id: 'pub-1', genre_id: 'genre-5', publication_year: 1811, pages: 352, language: 'English', description: 'A novel about two sisters who embody sense and sensibility respectively.', price: 7.99, in_stock: true, rating: 4.5, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { isbn: '978-0743273565', title: 'The Great Gatsby', author_id: 'author-3', publisher_id: 'pub-9', genre_id: 'genre-1', publication_year: 1925, pages: 180, language: 'English', description: 'A novel about the American Dream set in the Jazz Age.', price: 12.99, in_stock: true, rating: 4.4, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { isbn: '978-0060935467', title: 'To Kill a Mockingbird', author_id: 'author-4', publisher_id: 'pub-2', genre_id: 'genre-1', publication_year: 1960, pages: 281, language: 'English', description: 'A novel about racial injustice in the American South.', price: 14.99, in_stock: true, rating: 4.9, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { isbn: '978-0684801223', title: 'The Old Man and the Sea', author_id: 'author-5', publisher_id: 'pub-9', genre_id: 'genre-1', publication_year: 1952, pages: 127, language: 'English', description: 'A short novel about an aging fisherman who struggles with a giant marlin.', price: 11.99, in_stock: true, rating: 4.5, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { isbn: '978-0684830490', title: 'A Farewell to Arms', author_id: 'author-5', publisher_id: 'pub-9', genre_id: 'genre-8', publication_year: 1929, pages: 332, language: 'English', description: 'A novel set during World War I about an American ambulance driver.', price: 13.99, in_stock: true, rating: 4.3, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { isbn: '978-0486400778', title: 'Adventures of Huckleberry Finn', author_id: 'author-6', publisher_id: 'pub-1', genre_id: 'genre-1', publication_year: 1884, pages: 366, language: 'English', description: 'A novel about the adventures of a young boy and a runaway slave.', price: 6.99, in_stock: true, rating: 4.4, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { isbn: '978-0486280615', title: 'The Adventures of Tom Sawyer', author_id: 'author-6', publisher_id: 'pub-1', genre_id: 'genre-1', publication_year: 1876, pages: 274, language: 'English', description: 'A novel about a young boy growing up along the Mississippi River.', price: 5.99, in_stock: true, rating: 4.3, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { isbn: '978-0141439563', title: 'Great Expectations', author_id: 'author-7', publisher_id: 'pub-1', genre_id: 'genre-1', publication_year: 1861, pages: 544, language: 'English', description: 'A coming-of-age novel about an orphan named Pip.', price: 8.99, in_stock: true, rating: 4.5, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { isbn: '978-0141439761', title: 'A Tale of Two Cities', author_id: 'author-7', publisher_id: 'pub-1', genre_id: 'genre-8', publication_year: 1859, pages: 489, language: 'English', description: 'A historical novel set during the French Revolution.', price: 7.99, in_stock: true, rating: 4.4, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { isbn: '978-0143035008', title: 'War and Peace', author_id: 'author-8', publisher_id: 'pub-1', genre_id: 'genre-8', publication_year: 1869, pages: 1225, language: 'English', description: 'An epic novel chronicling Russian society during the Napoleonic era.', price: 18.99, in_stock: true, rating: 4.6, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { isbn: '978-0143035008', title: 'Anna Karenina', author_id: 'author-8', publisher_id: 'pub-1', genre_id: 'genre-1', publication_year: 1877, pages: 864, language: 'English', description: 'A novel about the tragic love affair of the aristocratic Anna Karenina.', price: 15.99, in_stock: true, rating: 4.7, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { isbn: '978-0156907392', title: 'Mrs Dalloway', author_id: 'author-9', publisher_id: 'pub-4', genre_id: 'genre-1', publication_year: 1925, pages: 194, language: 'English', description: 'A novel following a day in the life of Clarissa Dalloway.', price: 10.99, in_stock: true, rating: 4.2, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { isbn: '978-0060883287', title: 'One Hundred Years of Solitude', author_id: 'author-10', publisher_id: 'pub-2', genre_id: 'genre-1', publication_year: 1967, pages: 417, language: 'English', description: 'A landmark of magical realism following the Buendía family.', price: 14.99, in_stock: true, rating: 4.6, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { isbn: '978-0805209990', title: 'The Metamorphosis', author_id: 'author-11', publisher_id: 'pub-5', genre_id: 'genre-1', publication_year: 1915, pages: 55, language: 'English', description: 'A novella about a man who wakes up transformed into a giant insect.', price: 6.99, in_stock: true, rating: 4.3, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { isbn: '978-0805210408', title: 'The Trial', author_id: 'author-11', publisher_id: 'pub-5', genre_id: 'genre-10', publication_year: 1925, pages: 255, language: 'English', description: 'A novel about a man arrested and prosecuted by an inaccessible authority.', price: 11.99, in_stock: true, rating: 4.2, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { isbn: '978-0486277837', title: 'The Picture of Dorian Gray', author_id: 'author-12', publisher_id: 'pub-1', genre_id: 'genre-6', publication_year: 1890, pages: 272, language: 'English', description: 'A philosophical novel about a man whose portrait ages while he remains young.', price: 5.99, in_stock: true, rating: 4.5, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { isbn: '978-0141439556', title: 'Wuthering Heights', author_id: 'author-13', publisher_id: 'pub-1', genre_id: 'genre-5', publication_year: 1847, pages: 416, language: 'English', description: 'A novel about the intense and destructive love between Heathcliff and Catherine.', price: 7.99, in_stock: true, rating: 4.4, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { isbn: '978-0143107637', title: 'Crime and Punishment', author_id: 'author-14', publisher_id: 'pub-1', genre_id: 'genre-10', publication_year: 1866, pages: 671, language: 'English', description: 'A psychological novel about a man who commits murder and struggles with guilt.', price: 12.99, in_stock: true, rating: 4.6, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { isbn: '978-0374528379', title: 'The Brothers Karamazov', author_id: 'author-14', publisher_id: 'pub-5', genre_id: 'genre-10', publication_year: 1880, pages: 796, language: 'English', description: 'A passionate philosophical novel set in 19th century Russia.', price: 14.99, in_stock: true, rating: 4.7, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { isbn: '978-0486282114', title: 'Frankenstein', author_id: 'author-15', publisher_id: 'pub-1', genre_id: 'genre-6', publication_year: 1818, pages: 280, language: 'English', description: 'A Gothic novel about a scientist who creates a sapient creature.', price: 5.99, in_stock: true, rating: 4.4, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { isbn: '978-0142437247', title: 'Moby-Dick', author_id: 'author-16', publisher_id: 'pub-1', genre_id: 'genre-1', publication_year: 1851, pages: 752, language: 'English', description: 'An epic tale of Captain Ahab\'s obsessive quest to kill the white whale.', price: 13.99, in_stock: true, rating: 4.3, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { isbn: '978-0060850524', title: 'Brave New World', author_id: 'author-17', publisher_id: 'pub-2', genre_id: 'genre-7', publication_year: 1932, pages: 288, language: 'English', description: 'A dystopian novel set in a futuristic World State.', price: 14.99, in_stock: true, rating: 4.5, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { isbn: '978-0547928227', title: 'The Hobbit', author_id: 'author-18', publisher_id: 'pub-4', genre_id: 'genre-3', publication_year: 1937, pages: 310, language: 'English', description: 'A fantasy novel about the journey of hobbit Bilbo Baggins.', price: 14.99, in_stock: true, rating: 4.8, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { isbn: '978-0618640157', title: 'The Lord of the Rings', author_id: 'author-18', publisher_id: 'pub-4', genre_id: 'genre-3', publication_year: 1954, pages: 1178, language: 'English', description: 'An epic high fantasy novel about the quest to destroy the One Ring.', price: 22.99, in_stock: true, rating: 4.9, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { isbn: '978-0062073488', title: 'Murder on the Orient Express', author_id: 'author-19', publisher_id: 'pub-2', genre_id: 'genre-4', publication_year: 1934, pages: 256, language: 'English', description: 'A detective novel featuring Hercule Poirot.', price: 14.99, in_stock: true, rating: 4.6, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { isbn: '978-0062073501', title: 'And Then There Were None', author_id: 'author-19', publisher_id: 'pub-2', genre_id: 'genre-4', publication_year: 1939, pages: 272, language: 'English', description: 'A mystery novel about ten strangers lured to an island.', price: 14.99, in_stock: true, rating: 4.7, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { isbn: '978-1451673319', title: 'Fahrenheit 451', author_id: 'author-20', publisher_id: 'pub-3', genre_id: 'genre-7', publication_year: 1953, pages: 194, language: 'English', description: 'A dystopian novel about a future American society where books are outlawed.', price: 15.99, in_stock: true, rating: 4.5, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
];

// Generate more books to reach ~200
const additionalTitles = [
  { title: 'Emma', author_id: 'author-2', genre_id: 'genre-5' },
  { title: 'Mansfield Park', author_id: 'author-2', genre_id: 'genre-5' },
  { title: 'Persuasion', author_id: 'author-2', genre_id: 'genre-5' },
  { title: 'Northanger Abbey', author_id: 'author-2', genre_id: 'genre-5' },
  { title: 'For Whom the Bell Tolls', author_id: 'author-5', genre_id: 'genre-8' },
  { title: 'The Sun Also Rises', author_id: 'author-5', genre_id: 'genre-1' },
  { title: 'Oliver Twist', author_id: 'author-7', genre_id: 'genre-1' },
  { title: 'David Copperfield', author_id: 'author-7', genre_id: 'genre-1' },
  { title: 'Bleak House', author_id: 'author-7', genre_id: 'genre-1' },
  { title: 'A Christmas Carol', author_id: 'author-7', genre_id: 'genre-1' },
  { title: 'To the Lighthouse', author_id: 'author-9', genre_id: 'genre-1' },
  { title: 'Orlando', author_id: 'author-9', genre_id: 'genre-1' },
  { title: 'Love in the Time of Cholera', author_id: 'author-10', genre_id: 'genre-5' },
  { title: 'Chronicle of a Death Foretold', author_id: 'author-10', genre_id: 'genre-1' },
  { title: 'The Castle', author_id: 'author-11', genre_id: 'genre-10' },
  { title: 'The Importance of Being Earnest', author_id: 'author-12', genre_id: 'genre-1' },
  { title: 'The Silmarillion', author_id: 'author-18', genre_id: 'genre-3' },
  { title: 'The Death on the Nile', author_id: 'author-19', genre_id: 'genre-4' },
  { title: 'The ABC Murders', author_id: 'author-19', genre_id: 'genre-4' },
  { title: 'The Martian Chronicles', author_id: 'author-20', genre_id: 'genre-2' },
];

function generateISBN(index: number): string {
  const base = 9780000000000 + index * 12345;
  return `978-${String(base).slice(3, 13)}`;
}

additionalTitles.forEach((book, index) => {
  books.push({
    isbn: generateISBN(100 + index),
    title: book.title,
    author_id: book.author_id,
    publisher_id: publishers[index % publishers.length].id,
    genre_id: book.genre_id,
    publication_year: 1800 + Math.floor(Math.random() * 200),
    pages: 150 + Math.floor(Math.random() * 400),
    language: 'English',
    description: `A classic work by the renowned author.`,
    price: 5.99 + Math.floor(Math.random() * 15),
    in_stock: Math.random() > 0.2,
    rating: 3.5 + Math.random() * 1.5,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  });
});

// Generate reviews
const reviewerNames = ['BookLover123', 'LiteraryFan', 'AvReader', 'ClassicsEnthusiast', 'PageTurner', 'BiblioFile', 'ReadingRainbow', 'WordNerd', 'NovelAddict', 'ChapterChaser'];
const reviewTitles = ['Excellent read!', 'A timeless classic', 'Could not put it down', 'Highly recommended', 'A masterpiece', 'Thought-provoking', 'Beautiful prose', 'Must read', 'Engaging story', 'Wonderful book'];

export const reviews: Review[] = [];
books.forEach((book, bookIndex) => {
  const numReviews = 3 + Math.floor(Math.random() * 5);
  for (let i = 0; i < numReviews; i++) {
    reviews.push({
      id: `review-${bookIndex}-${i}`,
      book_isbn: book.isbn,
      reviewer_name: reviewerNames[Math.floor(Math.random() * reviewerNames.length)],
      rating: 3 + Math.floor(Math.random() * 3),
      title: reviewTitles[Math.floor(Math.random() * reviewTitles.length)],
      content: `This book is a wonderful example of its genre. The writing style is engaging and the characters are well-developed. I thoroughly enjoyed reading it and would recommend it to others who appreciate quality literature.`,
      verified_purchase: Math.random() > 0.3,
      helpful_votes: Math.floor(Math.random() * 50),
      created_at: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
    });
  }
});
