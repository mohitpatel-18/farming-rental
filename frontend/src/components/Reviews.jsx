import React, { useEffect, useState } from "react";

/*
  Reviews component
  - Stores reviews in localStorage key: "farming_reviews"
  - Each review: { id, name, rating(1-5), comment, improve, createdAt }
*/

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

function Star({ filled, onClick, onMouseEnter, onMouseLeave }) {
  return (
    <button
      type="button"
      aria-hidden
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="inline-flex items-center justify-center w-9 h-9 rounded-md transition-colors"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.2"
        className={filled ? "text-yellow-500" : "text-gray-300"}
      >
        <path d="M12 .587l3.668 7.431L23.4 9.75 17.8 15.09 19.335 23 12 19.3 4.665 23 6.2 15.09.6 9.75l7.732-1.732L12 .587z" />
      </svg>
    </button>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [improve, setImprove] = useState("");

  useEffect(() => {
    setReviews(readReviews().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  }, []);

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : "0.0";

  function submitReview(e) {
    e.preventDefault();
    if (!name.trim()) return alert("Please enter your name.");
    if (!rating || rating < 1) return alert("Please give a star rating.");
    const newReview = {
      id: Date.now().toString(),
      name: name.trim(),
      rating,
      comment: comment.trim(),
      improve: improve.trim(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newReview, ...reviews];
    writeReviews(updated);
    setReviews(updated);
    setName("");
    setRating(0);
    setComment("");
    setImprove("");
    setHover(0);
  }

  function removeReview(id) {
    if (!confirm("Remove this review?")) return;
    const updated = reviews.filter((r) => r.id !== id);
    writeReviews(updated);
    setReviews(updated);
  }

  return (
    <section className="max-w-5xl mx-auto px-6 py-12">
      <div className="bg-white rounded-xl shadow-md p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-serif font-bold">Customer Reviews</h3>
            <p className="text-sm text-gray-500 mt-1">Read what people say — help us improve.</p>
          </div>

          <div className="text-right">
            <div className="text-3xl font-bold text-gray-800">{avgRating}</div>
            <div className="text-xs text-gray-500">{reviews.length} review{reviews.length !== 1 && "s"}</div>
            <div className="mt-2 flex items-center justify-end gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className={`w-5 h-5 ${i < Math.round(avgRating) ? "text-yellow-400" : "text-gray-200"}`} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .587l3.668 7.431L23.4 9.75 17.8 15.09 19.335 23 12 19.3 4.665 23 6.2 15.09.6 9.75l7.732-1.732L12 .587z" />
                </svg>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-3 gap-6">
          {/* Form */}
          <form className="md:col-span-1 p-4 border rounded-lg" onSubmit={submitReview}>
            <div className="mb-3">
              <label className="text-sm font-semibold">Your name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full px-3 py-2 border rounded" placeholder="e.g. Mohit" />
            </div>

            <div className="mb-3">
              <label className="text-sm font-semibold">Star rating</label>
              <div className="mt-2 inline-flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => {
                  const idx = i + 1;
                  return (
                    <Star
                      key={idx}
                      filled={idx <= (hover || rating)}
                      onClick={() => setRating(idx)}
                      onMouseEnter={() => setHover(idx)}
                      onMouseLeave={() => setHover(0)}
                    />
                  );
                })}
              </div>
            </div>

            <div className="mb-3">
              <label className="text-sm font-semibold">Comment</label>
              <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows="3" className="mt-2 w-full px-3 py-2 border rounded" placeholder="Share your experience..."></textarea>
            </div>

            <div className="mb-3">
              <label className="text-sm font-semibold">What can we improve?</label>
              <input value={improve} onChange={(e) => setImprove(e.target.value)} className="mt-2 w-full px-3 py-2 border rounded" placeholder="e.g. faster checkout, clearer photos..." />
              <p className="text-xs text-gray-400 mt-1">Optional — this helps us prioritize improvements.</p>
            </div>

            <div className="flex gap-3">
              <button type="submit" className="px-4 py-2 bg-green-700 text-white rounded-md shadow-sm">Submit review</button>
              <button type="button" className="px-4 py-2 border rounded-md text-gray-700" onClick={() => { setName(""); setRating(0); setComment(""); setImprove(""); setHover(0); }}>Clear</button>
            </div>
          </form>

          {/* Reviews list */}
          <div className="md:col-span-2 space-y-4">
            {reviews.length === 0 ? (
              <div className="p-6 text-center text-gray-500 border rounded">No reviews yet — be the first to add one.</div>
            ) : (
              reviews.map((r) => (
                <article key={r.id} className="p-4 border rounded-lg bg-gray-50 flex gap-4 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                      {r.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-800">{r.name}</div>
                        <div className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleString()}</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg key={i} className={`w-4 h-4 ${i < r.rating ? "text-yellow-400" : "text-gray-200"}`} viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 .587l3.668 7.431L23.4 9.75 17.8 15.09 19.335 23 12 19.3 4.665 23 6.2 15.09.6 9.75l7.732-1.732L12 .587z" />
                            </svg>
                          ))}
                        </div>

                        <button onClick={() => removeReview(r.id)} className="text-xs text-red-600 border border-red-100 px-2 py-1 rounded">Delete</button>
                      </div>
                    </div>

                    {r.comment && <p className="mt-3 text-gray-700">{r.comment}</p>}

                    {r.improve && (
                      <div className="mt-3 text-sm">
                        <span className="inline-block bg-yellow-50 text-yellow-800 px-2 py-1 rounded text-xs font-medium">Improve</span>
                        <div className="mt-2 text-gray-600">{r.improve}</div>
                      </div>
                    )}
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
