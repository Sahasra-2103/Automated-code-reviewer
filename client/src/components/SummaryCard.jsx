import './SummaryCard.css';

const SummaryCard = ({ summary }) => {
  return (
    <div className="card summary-card">
      <div className="card-header">
        <h3>Summary</h3>
      </div>
      <p>{summary || 'No summary available yet. Run a review to see results.'}</p>
    </div>
  );
};

export default SummaryCard;
