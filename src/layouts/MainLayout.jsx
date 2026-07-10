import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';

const MainLayout = () => {
  const { theme, toggleTheme } = useGlobalContext();

  return (
    <div className={`app-container ${theme}`}>
      {/* Placeholder Header */}
      <header style={styles.header}>
        <h2>My App Logo</h2>
        <nav>
          <ul style={styles.navList}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/admin">Admin Dashboard</Link></li>
            <li>
              <button onClick={toggleTheme} style={styles.btn}>
                Toggle Theme ({theme})
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Content Area */}
      <main style={styles.main}>
        <Outlet /> {/* Child routes render here */}
      </main>

      {/* Placeholder Footer */}
      <footer style={styles.footer}>
        <p>&copy; {new Date().getFullYear()} My Company. All rights reserved.</p>
      </footer>
    </div>
  );
};

// Inline styles for boilerplate placeholder purposes
const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#333',
    color: '#fff',
  },
  navList: {
    display: 'flex',
    gap: '1rem',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  main: {
    padding: '2rem',
    minHeight: 'calc(100vh - 160px)',
  },
  footer: {
    textAlign: 'center',
    padding: '1rem',
    backgroundColor: '#222',
    color: '#fff',
  },
  btn: {
    padding: '0.5rem 1rem',
    cursor: 'pointer',
  }
};

export default MainLayout;
