import { NavLink } from 'react-router-dom';
import './Header.css';

const Header = ({ theme, onToggleTheme }) => {
  return (
    <header className="header-shell">
      <div className="brand-block">
        <span className="brand-mark">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
        </span>
        <div>
          <h1 className="text-gradient">Code Reviewer</h1>
          <p>AI-powered source code review at your fingertips</p>
        </div>
      </div>
      <nav>
        <NavLink to="/" end>Dashboard</NavLink>
        <NavLink to="/history">History</NavLink>
        <NavLink to="/analytics">Analytics</NavLink>
      </nav>
      <button className="theme-toggle" onClick={onToggleTheme}>
        {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
      </button>
    </header>
  );
};

export default Header;
