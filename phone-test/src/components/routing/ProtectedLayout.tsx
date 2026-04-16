import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const ProtectedLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = user?.username
    ? user.username.substring(0, 2).toUpperCase()
    : '??';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0faf7 0%, #e8f4ff 100%)' }}>
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px',
        backgroundColor: '#00B388',
        boxShadow: '0 2px 8px rgba(0,179,136,0.3)'
      }}>
        <Link to="/calls" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '36px',
            height: '36px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ color: 'white', fontWeight: 700, fontSize: '18px' }}>A</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: '18px', color: 'white' }}>Aircall</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 700,
            color: 'white'
          }}>
            {initials}
          </div>
          <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>{user?.username}</span>
          <button
            onClick={handleLogout}
            style={{
              fontSize: '13px',
              padding: '6px 14px',
              border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: '8px',
              backgroundColor: 'rgba(255,255,255,0.15)',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '32px 16px' }}>
        <Outlet />
      </main>
    </div>
  );
};
