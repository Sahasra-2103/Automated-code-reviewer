import { useEffect, useState } from 'react';
import { fetchReviews, deleteReview } from '../services/api.js';
import Loader from '../components/Loader.jsx';
import Toast from '../components/Toast.jsx';
import './ReviewHistory.css';

const ReviewHistory = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const res = await fetchReviews();
        setReviews(res.reviews || []);
      } catch (error) {
        setToast({ message: error.message, type: 'danger' });
      } finally {
        setLoading(false);
      }
    };
    loadReviews();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteReview(id);
      setReviews((curr) => curr.filter((item) => item._id !== id));
      setToast({ message: 'Review removed successfully.', type: 'success' });
    } catch (error) {
      setToast({ message: error.message, type: 'danger' });
    }
  };

  return (
    <div className="page-history">
      <section className="history-hero">
        <h2>Review History</h2>
        <p>Manage your saved code reviews and remove old entries when needed.</p>
      </section>

      {loading ? (
        <Loader label="Loading history..." />
      ) : reviews.length === 0 ? (
        <div className="empty-state">
          <h3>No reviews saved yet.</h3>
          <p>Run a code review from the dashboard and return to see the audit stored in MongoDB.</p>
        </div>
      ) : (
        <div className="history-grid">
          {reviews.map((item) => (
            <article key={item._id} className="history-card">
              <div className="history-card-header">
                <div>
                  <h3>{item.language}</h3>
                  <p>{new Date(item.createdAt).toLocaleString()}</p>
                </div>
                <button onClick={() => handleDelete(item._id)}>Delete</button>
              </div>
              <div className="history-meta">
                <span>Score: {String(item.score).split('/')[0] > 10 ? (String(item.score).split('/')[0] / 10).toFixed(1) : String(item.score).split('/')[0]}/10</span>
                <span>{item.issues.length} issues</span>
              </div>
              <p className="history-summary">{item.reviewSummary}</p>
              <div className="history-footer">
                <span>{item.bestPractices?.length || 0} best practices</span>
                <span>{item.originalCode?.slice(0, 80)}...</span>
              </div>
            </article>
          ))}
        </div>
      )}

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
    </div>
  );
};

export default ReviewHistory;
