import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { dark } = useTheme();
  const { user, loading, logout, loginWithGoogle } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); setUserMenuOpen(false); }, [pathname]);

  const links = [
    { label: 'Home', path: '/' },
    { label: 'Our Story', path: '/ourstory' },
    { label: 'Collections', path: '/products' },
    { label: 'Perfume Bottles', path: '/bottles' },
    { label: 'Offer', path: '/offers' },
  ];

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled
            ? (dark ? '#0A0A0A' : '#FAF7F0')
            : (dark ? 'rgba(10,10,10,0.85)' : 'rgba(250,247,240,0.85)'),
          backdropFilter: 'blur(8px)',
          borderBottom: `1px solid ${dark ? '#1C4D3A' : '#C9B99A'}`,
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{ border: '1.5px solid #C9A864' }}
              >
                <span className="font-heading text-sm font-medium" style={{ color: '#C9A864' }}>R</span>
              </div>
              <span className="font-heading text-lg font-medium tracking-wide" style={{ color: dark ? '#F5F1E6' : '#1A2620' }}>
                Rafifa Mart
              </span>
            </Link>

            {/* Center: Nav Links */}
            {user && (
              <nav className="hidden lg:flex items-center gap-6">
                {links.map((l) => {
                  const active = pathname === l.path;
                  return (
                    <Link key={l.path} to={l.path} className="relative py-1 group">
                      <span
                        className="font-heading text-[12px] tracking-[0.15em] uppercase transition-colors duration-200"
                        style={{ color: active ? '#C9A864' : (dark ? 'rgba(237,231,218,0.6)' : 'rgba(26,38,32,0.6)') }}
                      >
                        {l.label}
                      </span>
                      <span
                        className="absolute -bottom-0.5 left-0 right-0 h-px transition-transform duration-200"
                        style={{
                          backgroundColor: '#C9A864',
                          transform: active ? 'scaleX(1)' : 'scaleX(0)',
                        }}
                      />
                    </Link>
                  );
                })}
              </nav>
            )}

            {/* Right: Auth */}
            <div className="hidden lg:flex items-center gap-4">

              {loading ? (
                <div className="w-8 h-8" />
              ) : user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2"
                  >
                    {user.profile_pic ? (
                      <img
                        src={user.profile_pic}
                        alt={user.name}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full object-cover"
                        style={{ border: '1.5px solid #C9A864' }}
                      />
                    ) : (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ border: '1.5px solid #C9A864' }}
                      >
                        <span className="font-heading text-xs" style={{ color: '#C9A864' }}>
                          {user.name?.[0]?.toUpperCase() || 'U'}
                        </span>
                      </div>
                    )}
                    <span
                      className="font-heading text-[12px] tracking-[0.1em] uppercase max-w-[100px] truncate"
                      style={{ color: dark ? 'rgba(237,231,218,0.8)' : 'rgba(26,38,32,0.8)' }}
                    >
                      {user.name?.split(' ')[0]}
                    </span>
                  </button>

                  {userMenuOpen && (
                    <div
                      className="absolute right-0 top-full mt-3 w-44 py-2 z-50"
                      style={{
                        backgroundColor: dark ? '#0D1410' : '#FAF7F0',
                        border: `1px solid ${dark ? '#1C4D3A' : '#C9B99A'}`,
                      }}
                    >
                      <Link
                        to="/profile"
                        className="block px-4 py-2 font-body text-xs uppercase tracking-wider transition-colors"
                        style={{ color: dark ? 'rgba(237,231,218,0.7)' : 'rgba(26,38,32,0.7)' }}
                      >
                        My Account
                      </Link>
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 font-body text-xs uppercase tracking-wider transition-colors"
                        style={{ color: '#5C1A1A' }}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to="/login" className="font-heading text-[12px] tracking-[0.15em] uppercase" style={{ color: dark ? 'rgba(237,231,218,0.6)' : 'rgba(26,38,32,0.6)' }}>
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="font-heading text-[11px] tracking-[0.15em] uppercase px-5 py-2 transition-shadow duration-300 hover:shadow-[0_4px_20px_rgba(201,168,100,0.3)]"
                    style={{ backgroundColor: '#C9A864', color: '#0A0A0A' }}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile */}
            <div className="lg:hidden flex items-center gap-3">
              <button
                onClick={() => setOpen(!open)}
                className="flex flex-col justify-center items-center w-8 h-8 gap-[4px]"
              >
                <span className="block w-4 h-[1px] transition-all duration-300 origin-center" style={{ backgroundColor: dark ? '#F5F1E6' : '#1A2620', transform: open ? 'rotate(45deg) translateY(5px)' : '' }} />
                <span className="block w-4 h-[1px] transition-all duration-300" style={{ backgroundColor: dark ? '#F5F1E6' : '#1A2620', opacity: open ? 0 : 1 }} />
                <span className="block w-4 h-[1px] transition-all duration-300 origin-center" style={{ backgroundColor: dark ? '#F5F1E6' : '#1A2620', transform: open ? '-rotate(45deg) translateY(-5px)' : '' }} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setOpen(false)} />
        <div
          className={`absolute top-0 right-0 h-full w-[280px] transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
          style={{ backgroundColor: dark ? '#0A0A0A' : '#FAF7F0' }}
        >
          <div className="flex items-center justify-between px-5 h-16" style={{ borderBottom: `1px solid ${dark ? '#1C4D3A' : '#C9B99A'}` }}>
            <span className="font-body text-[10px] uppercase tracking-[0.2em]" style={{ color: '#C9A864' }}>Menu</span>
            <button onClick={() => setOpen(false)} style={{ color: dark ? 'rgba(237,231,218,0.4)' : 'rgba(26,38,32,0.4)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 6l12 12M6 18L18 6" /></svg>
            </button>
          </div>

          <nav className="px-5 py-4">
            {user && links.map((l) => (
              <Link key={l.path} to={l.path} className="block py-3" style={{ borderBottom: `1px solid ${dark ? 'rgba(28,77,58,0.3)' : 'rgba(201,185,154,0.3)'}` }}>
                <span className="font-heading text-[12px] tracking-[0.15em] uppercase" style={{ color: dark ? 'rgba(237,231,218,0.7)' : 'rgba(26,38,32,0.7)' }}>
                  {l.label}
                </span>
              </Link>
            ))}

            {user && <div className="my-4 brass-hairline" />}

            {user ? (
              <>
                <div className="flex items-center gap-3 py-3">
                  {user.profile_pic ? (
                    <img
                      src={user.profile_pic}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-full object-cover"
                      style={{ border: '1.5px solid #C9A864' }}
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ border: '1.5px solid #C9A864' }}>
                      <span className="font-heading text-xs" style={{ color: '#C9A864' }}>{user.name?.[0]?.toUpperCase() || 'U'}</span>
                    </div>
                  )}
                  <span className="font-heading text-[12px] tracking-[0.1em] uppercase" style={{ color: dark ? 'rgba(237,231,218,0.8)' : 'rgba(26,38,32,0.8)' }}>
                    {user.name}
                  </span>
                </div>
                <Link to="/account" className="block py-3" style={{ borderBottom: `1px solid ${dark ? 'rgba(28,77,58,0.3)' : 'rgba(201,185,154,0.3)'}` }}>
                  <span className="font-heading text-[12px] tracking-[0.15em] uppercase" style={{ color: dark ? 'rgba(237,231,218,0.7)' : 'rgba(26,38,32,0.7)' }}>My Account</span>
                </Link>
                <button onClick={logout} className="block py-3 w-full text-left">
                  <span className="font-heading text-[12px] tracking-[0.15em] uppercase" style={{ color: '#5C1A1A' }}>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3 py-3">
                <Link to="/login" className="block py-3 text-center" style={{ borderBottom: `1px solid ${dark ? 'rgba(28,77,58,0.3)' : 'rgba(201,185,154,0.3)'}` }}>
                  <span className="font-heading text-[12px] tracking-[0.15em] uppercase" style={{ color: dark ? 'rgba(237,231,218,0.7)' : 'rgba(26,38,32,0.7)' }}>Login</span>
                </Link>
                <Link
                  to="/signup"
                  className="block py-3 text-center font-heading text-[12px] tracking-[0.15em] uppercase"
                  style={{ backgroundColor: '#C9A864', color: '#0A0A0A' }}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}