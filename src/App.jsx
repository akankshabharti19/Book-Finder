import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import BookCard from "./components/BookCard";
import "./index.css";

function App() {
  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(favs);
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const handleSearch = async (query) => {
    if (!query) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${query}`
      );
      const data = await res.json();
      setBooks(data.items || []);
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (book) => {
    const exists = favorites.find((fav) => fav.id === book.id);
    if (exists) {
      setFavorites(favorites.filter((fav) => fav.id !== book.id));
    } else {
      setFavorites([...favorites, book]);
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="top-bar">
        <h1>📚 Book Finder</h1>
        <button
          className="fav-btn"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          ❤️ Favorites ({favorites.length})
        </button>
      </header>

      {/* Search Section */}
      <SearchBar onSearch={handleSearch} />

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && books.length === 0 && !error && (
        <p className="no-results">Search for books to see results</p>
      )}

      {/* Search Results */}
      {!loading && books.length > 0 && (
        <div className="book-section">
          <h2>Search Results</h2>
          <div className="book-list">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book.volumeInfo}
                onFavorite={() => toggleFavorite(book)}
                isFavorite={favorites.some((fav) => fav.id === book.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Sidebar Favorites Drawer */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>❤️ Favorites</h2>
          <button
            className="close-btn"
            onClick={() => setIsSidebarOpen(false)}
          >
            ✖
          </button>
        </div>
        {favorites.length === 0 ? (
          <p className="no-results">No favorites yet!</p>
        ) : (
          <div className="sidebar-list">
            {favorites.map((book) => (
              <BookCard
                key={book.id}
                book={book.volumeInfo}
                onFavorite={() => toggleFavorite(book)}
                isFavorite={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Overlay behind sidebar */}
      {isSidebarOpen && (
        <div
          className="overlay"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}

export default App;
