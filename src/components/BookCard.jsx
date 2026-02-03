function BookCard({ book, onFavorite, isFavorite }) {
  const { title, authors, imageLinks, infoLink } = book.volumeInfo;

  const hasImage = Boolean(imageLinks?.thumbnail);

  return (
    <div className="book-card">
        <div className="book-cover">
        {hasImage ? (
          <img
            src={imageLinks.thumbnail}
            alt={title}
            loading="lazy"
          />
        ) : (
          <div className="no-cover">
            <span className="book-icon">📖</span>
            <p>No Cover Available</p>
          </div>
        )}
      </div>

      <h3>{title}</h3>
      <p>{authors?.join(", ") || "Unknown Author"}</p>

      <div className="card-actions">
        <a href={infoLink} target="_blank" rel="noreferrer">
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
