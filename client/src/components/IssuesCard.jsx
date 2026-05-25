import { useState } from 'react';
import './IssuesCard.css';

const severityMap = {
  High: 'danger',
  Medium: 'warning',
  Low: 'info'
};

const IssuesCard = ({ issues }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="card issues-card">
      <div className="card-header card-header-action">
        <h3>Issues</h3>
        <button onClick={() => setExpanded(!expanded)}>{expanded ? 'Collapse' : 'Expand'}</button>
      </div>
      {expanded && (
        <div className="issue-list">
          {issues.length === 0 ? (
            <p className="muted">No issues detected yet.</p>
          ) : (
            issues.map((issue, index) => (
              <div key={index} className={`issue-item issue-${severityMap[issue.severity] || 'info'}`}>
                <div className="issue-metadata">
                  <span className="issue-severity">{issue.severity}</span>
                  {issue.category && <span>{issue.category}</span>}
                  <span>Line {issue.line}</span>
                </div>
                <p className="issue-problem">{issue.problem}</p>
                {issue.impact && <p className="issue-impact">{issue.impact}</p>}
                <p className="issue-solution">{issue.solution}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default IssuesCard;
