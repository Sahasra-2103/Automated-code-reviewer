import './ReviewScoreCard.css';

const ReviewScoreCard = ({ score }) => {
  const numericScore = Number(String(score).split('/')[0]) || 0;
  const normalizedScore = numericScore > 10 ? (numericScore / 10).toFixed(1) : numericScore;
  const progress = Math.min(Math.max(normalizedScore, 0), 10);
  const percentage = (progress / 10) * 100;

  return (
    <div className="card score-card">
      <h3>Review Score</h3>
      <div className="score-ring">
        <span>{progress}/10</span>
        <div className="score-fill" style={{ '--progress': `${percentage}%` }} />
      </div>
      <p>Overall code quality score based on AI review.</p>
    </div>
  );
};

export default ReviewScoreCard;
