import { useEffect, useMemo, useState } from 'react';
import Editor from '@monaco-editor/react';
import { reviewCode } from '../services/api.js';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { useDebounce } from '../hooks/useDebounce.js';
import ReviewScoreCard from '../components/ReviewScoreCard.jsx';
import SummaryCard from '../components/SummaryCard.jsx';
import IssuesCard from '../components/IssuesCard.jsx';
import ImprovedCodeCard from '../components/ImprovedCodeCard.jsx';
import BestPracticesCard from '../components/BestPracticesCard.jsx';
import Toast from '../components/Toast.jsx';
import Loader from '../components/Loader.jsx';
import './Dashboard.css';

const languageOptions = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'c', label: 'C' },
  { value: 'c++', label: 'C++' },
  { value: 'go', label: 'Go' }
];

const defaultCode = `function greet(name) {
  return 'Hello, ' + name;
}

console.log(greet('World'));`;

const Dashboard = () => {
  const [code, setCode] = useLocalStorage('acr_code', defaultCode);
  const [language, setLanguage] = useLocalStorage('acr_language', 'javascript');
  const [review, setReview] = useState(null);
  const [recentHistory, setRecentHistory] = useLocalStorage('acr_recent_history', []);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const debouncedCode = useDebounce(code, 500);

  useEffect(() => {
    setCode(debouncedCode);
  }, [debouncedCode]);

  const handleReview = async () => {
    if (!code.trim()) {
      setToast({ message: 'Paste code before sending it for review.', type: 'warning' });
      return;
    }

    setLoading(true);
    try {
      const res = await reviewCode({ code, language });
      const reviewPayload = {
        ...res.review,
        language,
        originalCode: code,
        createdAt: new Date().toISOString()
      };
      setReview(res.review);
      setRecentHistory((current) => [reviewPayload, ...current].slice(0, 6));
      setToast({ message: 'Code review completed successfully.', type: 'success' });
    } catch (error) {
      setToast({ message: error.response?.data?.message || error.message, type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCode('');
    setReview(null);
    setToast({ message: 'Editor cleared.', type: 'info' });
  };

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(code || '');
    setToast({ message: 'Code copied to clipboard.', type: 'success' });
  };

  const handleCopyReview = async () => {
    if (!review) return;
    const content = `Summary:\n${review.summary}\n\nScore: ${review.score}\n\nIssues:\n${review.issues.map((issue) => `Line ${issue.line}: ${issue.problem}`).join('\n')}\n\nImproved Code:\n${review.improvedCode}`;
    await navigator.clipboard.writeText(content);
    setToast({ message: 'Review copied to clipboard.', type: 'success' });
  };

  const handleDownloadPdf = async () => {
    if (!review) return;
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ unit: 'px', format: 'a4' });
    doc.setFontSize(18);
    doc.text('Code Reviewer', 30, 40);
    doc.setFontSize(12);
    doc.text(`Language: ${language}`, 30, 70);
    doc.text(`Score: ${review.score}`, 30, 90);
    doc.text('Summary:', 30, 120);
    doc.text(review.summary, 30, 140, { maxWidth: 520 });
    doc.text('Issues:', 30, 210);
    review.issues.forEach((issue, index) => {
      const line = `${index + 1}. [${issue.severity}] Line ${issue.line}: ${issue.problem}`;
      doc.text(line, 30, 230 + index * 20, { maxWidth: 520 });
    });
    doc.save('code-review-summary.pdf');
    setToast({ message: 'PDF downloaded successfully.', type: 'success' });
  };

  const reviewIssues = useMemo(() => review?.issues || [], [review]);

  return (
    <div className="page-dashboard">
      <section className="hero-panel">
        <div>
          <h2>Welcome to Code Reviewer</h2>
          <p>Paste code, select a language, and let AI detect bugs, performance issues, maintainability concerns, and improvement opportunities.</p>
        </div>
        <div className="hero-actions">
          <div className="select-shell">
            <label htmlFor="language">Language</label>
            <select id="language" value={language} onChange={(event) => setLanguage(event.target.value)}>
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div className="button-row">
            <button className="primary" onClick={handleReview} disabled={loading}>Review Code</button>
            <button className="secondary" onClick={handleClear}>Clear</button>
            <button className="secondary" onClick={handleCopyCode}>Copy Code</button>
          </div>
        </div>
      </section>

      <div className="editor-panel">
        <Editor
          height="380px"
          language={language === 'c++' ? 'cpp' : language}
          value={code}
          theme={document.documentElement.dataset.theme === 'dark' ? 'vs-dark' : 'light'}
          onChange={(value) => setCode(value || '')}
          options={{ minimap: { enabled: false }, fontSize: 14, automaticLayout: true, lineNumbers: 'on' }}
        />
      </div>

      {loading && <Loader label="Analyzing code..." />}

      <div className="review-grid">
        <ReviewScoreCard score={review?.score || 0} />
        <SummaryCard summary={review?.summary || ''} />
        <IssuesCard issues={reviewIssues} />
        <ImprovedCodeCard code={review?.improvedCode || ''} onCopy={handleCopyReview} />
        <BestPracticesCard bestPractices={review?.bestPractices || []} />
      </div>

      <section className="history-panel">
        <div className="section-head">
          <h3>Recent local reviews</h3>
          <button className="secondary" onClick={handleDownloadPdf} disabled={!review}>Download Review PDF</button>
        </div>
        <div className="history-list">
          {recentHistory.length === 0 ? (
            <div className="history-empty">No local review history yet.</div>
          ) : (
            recentHistory.map((item, index) => (
              <div key={`${item.language}-${index}`} className="history-item">
                <span>{item.language}</span>
                <strong>{String(item.score).split('/')[0] > 10 ? (String(item.score).split('/')[0] / 10).toFixed(1) : String(item.score).split('/')[0]}/10</strong>
                <span>{new Date(item.createdAt).toLocaleString()}</span>
              </div>
            ))
          )}
        </div>
      </section>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
    </div>
  );
};

export default Dashboard;
