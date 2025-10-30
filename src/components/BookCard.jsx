function BookCard({ book, onFavorite, isFavorite }) {
  const { title, author_name, cover_i, key, first_publish_year } = book;
  
  const coverImage = cover_i 
    ? `https://covers.openlibrary.org/b/id/${cover_i}-M.jpg`
    : "https://via.placeholder.com/150";
  
  const infoLink = key 
    ? `https://openlibrary.org${key}`
    : "#";

  return (
    <div className="book-card">
      <img
        src={coverImage}
        alt={title || "Book cover"}
      />
      <h3>{title || "Untitled"}</h3>
      <p>{author_name ? author_name.join(", ") : "Unknown Author"}</p>
      {first_publish_year && (
        <p style={{ fontSize: "0.85rem", color: "#95a5a6", marginTop: "-0.5rem" }}>
          Published: {first_publish_year}
        </p>
      )}
      <div className="card-actions">
        <a href={infoLink} target="_blank" rel="noopener noreferrer">
          More Info
        </a>
        <button onClick={onFavorite}>
          {isFavorite ? "★ Favorite" : "☆ Add to Favorites"}
        </button>
      </div>
    </div>
  );
}

export default BookCard;
