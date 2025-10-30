import React from "react";

function BookCard({ book, onFavorite, isFavorite }) {
  const { title, authors, imageLinks, infoLink } = book;

  return (
    <div className="book-card">
      <img
        src={imageLinks?.thumbnail || "https://via.placeholder.com/150"}
        alt={title}
      />
      <h3>{title}</h3>
      <p>{authors ? authors.join(", ") : "Unknown Author"}</p>
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
