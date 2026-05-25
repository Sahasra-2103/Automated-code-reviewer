import './Loader.css';

const Loader = ({ label }) => {
  return (
    <div className="loader-shell">
      <div className="spinner" />
      {label && <span>{label}</span>}
    </div>
  );
};

export default Loader;
