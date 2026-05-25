import './BestPracticesCard.css';

const BestPracticesCard = ({ bestPractices }) => {
  return (
    <div className="card best-practices-card">
      <div className="card-header">
        <h3>Best Practices</h3>
      </div>
      <ul>
        {bestPractices.length === 0 ? (
          <li className="muted">Best practice recommendations will appear here.</li>
        ) : (
          bestPractices.map((item, index) => <li key={index}>{item}</li>)
        )}
      </ul>
    </div>
  );
};

export default BestPracticesCard;
