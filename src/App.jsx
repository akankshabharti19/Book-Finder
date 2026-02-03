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
  const [hasSearched, setHasSearched] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(favs);
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

    useEffect(() => {
    if (query.trim() === "") {
      setBooks([]);
      setHasSearched(false);
      setError("");
    }
  }, [query]);

  const handleSearch = async (query) => {
    if (!query || !query.trim()) return;

    setHasSearched(true);
    setBooks([]);
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(
          query
        )}&printType=books&maxResults=20`
      );

      const data = await response.json();

      //console.log("RAW API DATA:", data);
      //console.log("ITEMS:", data.items);

      setBooks(data.items || []);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };


  const toggleFavorite = (book) => {
    setFavorites((prevFavorites) => {
      const exists = prevFavorites.find(
        (fav) => fav.id === book.id
      );

      if (exists) {
        return prevFavorites.filter(
          (fav) => fav.id !== book.id
        );
      } else {
        return [...prevFavorites, book];
      }
    });
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
      <SearchBar
        query={query}
        setQuery={setQuery}
        onSearch={handleSearch}
      />
      {!hasSearched && !loading && (
        <p className="empty-state">
          Start typing to discover books 📖
        </p>
      )}

      {hasSearched && !loading && books.length === 0 && !error &&  (
        <p>
          No books found. Try a different keyword.
        </p>
      )}

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}



      {/* Search Results */}
      {!loading && books.length > 0 && (
        <div className="book-section">
          <h2>Search Results</h2>
          <div className="book-list">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
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
                book={book}
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
