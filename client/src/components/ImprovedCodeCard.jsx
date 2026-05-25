import './ImprovedCodeCard.css';

const ImprovedCodeCard = ({ code, onCopy }) => {
  return (
    <div className="card improved-card">
      <div className="card-header card-header-action">
        <h3>Improved Code</h3>
        <button onClick={onCopy}>Copy Review</button>
      </div>
      <pre className="code-block">{code || 'Review code to generate corrected output.'}</pre>
    </div>
  );
};

export default ImprovedCodeCard;
