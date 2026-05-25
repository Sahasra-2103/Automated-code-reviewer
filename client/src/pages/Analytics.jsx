import { useEffect, useState } from 'react';
import { fetchAnalytics } from '../services/api.js';
import Loader from '../components/Loader.jsx';
import './Analytics.css';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const response = await fetchAnalytics();
        setAnalytics(response.analytics);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  if (loading) {
    return <Loader label="Loading analytics..." />;
  }

  if (!analytics) {
    return <div className="empty-state">Unable to load analytics right now.</div>;
  }

  const languageEntries = Object.entries(analytics.languageUsage);
  const issueEntries = Object.entries(analytics.issueDistribution);

  return (
    <div className="page-analytics">
      <section className="analytics-hero">
        <h2>Analytics Dashboard</h2>
        <p>Track review volume, average score, language distribution, and issue severity trends.</p>
      </section>

      <div className="analytics-grid">
        <div className="card analytics-summary-card">
          <h3>Total Reviews</h3>
          <p>{analytics.totalReviews}</p>
        </div>
        <div className="card analytics-summary-card">
          <h3>Average Score</h3>
          <p>{analytics.averageScore > 10 ? (analytics.averageScore / 10).toFixed(1) : analytics.averageScore.toFixed(1) || 0}/10</p>
        </div>
        <div className="card analytics-chart-card">
          <h3>Language Usage</h3>
          <div className="bar-chart">
            {languageEntries.map(([language, count]) => (
              <div key={language} className="bar-row">
                <span>{language}</span>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${Math.min(count * 15, 100)}%` }} />
                </div>
                <strong>{count}</strong>
              </div>
            ))}
          </div>
        </div>
        <div className="card analytics-chart-card">
          <h3>Issue Distribution</h3>
          <div className="pie-grid">
            {issueEntries.map(([severity, count]) => (
              <div key={severity} className={`pie-item pie-${severity.toLowerCase()}`}>
                <span>{severity}</span>
                <strong>{count}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
