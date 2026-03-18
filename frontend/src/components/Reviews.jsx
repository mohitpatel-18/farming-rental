import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "farming_reviews";

function readReviews() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeReviews(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

function StarButton({ filled, onClick, onMouseEnter, onMouseLeave }) {
  return (
    <button
      type="button"
      aria-label={filled ? "Selected star" : "Select star"}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`review-star ${filled ? "review-star--active" : ""}`}
    >
      ★
    </button>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setReviews(readReviews().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  }, []);

  const avgRating = useMemo(
    () => (reviews.length ? (reviews.reduce((sum, item) => sum + (item.rating || 0), 0) / reviews.length).toFixed(1) : "0.0"),
    [reviews]
  );

  function submitReview(e) {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }
    if (!rating) {
      alert("Please select a star rating.");
      return;
    }

    const newReview = {
      id: Date.now().toString(),
      name: name.trim(),
      rating,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    };

    const updated = [newReview, ...reviews];
    writeReviews(updated);
    setReviews(updated);
    setName("");
    setRating(0);
    setHover(0);
    setComment("");
    setSuccessMessage("Thanks for sharing your feedback! Your review has been added. (Demo UI)");
    setTimeout(() => setSuccessMessage(""), 3000);
  }

  return (
    <section className="page-shell">
      <div className="page-header page-header--between">
        <div>
          <span className="page-badge">⭐ Customer Reviews</span>
          <h1>Customer Reviews</h1>
          <p>Collect feedback, build trust, and showcase what farmers love about your equipment rental service.</p>
        </div>

        <div className="review-summary">
          <strong>{avgRating}</strong>
          <span>Average rating</span>
          <p>{reviews.length} review{reviews.length !== 1 && "s"}</p>
        </div>
      </div>

      <div className="reviews-layout">
        <form className="review-form-card" onSubmit={submitReview}>
          <div>
            <p className="section-kicker">Leave Feedback</p>
            <h2 className="section-title">Tell us about your experience</h2>
          </div>

          <label className="field-group">
            <span>Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="field-input"
              placeholder="Enter your name"
            />
          </label>

          <div className="field-group">
            <span>Star Rating</span>
            <div className="review-stars" role="radiogroup" aria-label="Star rating">
              {Array.from({ length: 5 }).map((_, index) => {
                const value = index + 1;
                return (
                  <StarButton
                    key={value}
                    filled={value <= (hover || rating)}
                    onClick={() => setRating(value)}
                    onMouseEnter={() => setHover(value)}
                    onMouseLeave={() => setHover(0)}
                  />
                );
              })}
            </div>
          </div>

          <label className="field-group">
            <span>Comment</span>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="5"
              className="field-input field-input--textarea"
              placeholder="Share your experience with our farming rental platform"
            />
          </label>

          {successMessage && <div className="contact-notice">{successMessage}</div>}

          <button type="submit" className="primary-button primary-button--full">
            Submit Review
          </button>
        </form>

        <div className="review-grid">
          {reviews.length === 0 ? (
            <div className="review-empty-state">No reviews yet — be the first to leave one.</div>
          ) : (
            reviews.map((review) => (
              <article key={review.id} className="review-card">
                <div className="review-card__top">
                  <div>
                    <h3>{review.name}</h3>
                    <div className="review-card__stars" aria-label={`${review.rating} out of 5 stars`}>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <span key={index} className={index < review.rating ? "is-filled" : ""}>★</span>
                      ))}
                    </div>
                  </div>
                  <span className="review-card__date">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <p>{review.comment || "Great experience with the service and support team."}</p>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
