import React from 'react';
import { Trophy, Award, Dumbbell, ShieldCheck, LogOut, Sparkles, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Navbar({ activePage, setActivePage }) {
  const { isAdmin, logout } = useAuth();

  const navItems = [
    { 
      id: 'home', 
      label: <span>Accueil</span>, 
      tooltip: 'Accueil',
      icon: Sparkles 
    },
    { 
      id: 'equipment', 
      label: <span>Emprunts<span className="nav-label-long"> Matériel</span></span>, 
      tooltip: 'Emprunts de Matériel',
      icon: Dumbbell 
    },
    { 
      id: 'matches', 
      label: <span>Matchs<span className="nav-label-long"> FFSU</span> & Équipes</span>, 
      tooltip: 'Matchs FFSU & Nos Équipes',
      icon: Trophy 
    },
    { 
      id: 'tournaments', 
      label: <span><span className="nav-label-long">Résultats </span>Tournois</span>, 
      tooltip: 'Résultats Tournois',
      icon: Award 
    },
    { 
      id: 'events', 
      label: <span>Agenda<span className="nav-label-long"> Nancy</span></span>, 
      tooltip: 'Agenda Sportif Nancy',
      icon: MapPin 
    },
  ];

  const handleNavClick = (id) => {
    setActivePage(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="site-header">
      <div className="navbar-container">
        
        {/* Brand / Official Duck Mascot */}
        <div 
          onClick={() => handleNavClick('home')}
          className="nav-brand"
          title="Retour à l'accueil BDS TELECOM Nancy"
        >
          <img 
            src="/logo.png" 
            alt="Mascotte Canard BDS TELECOM Nancy" 
            className="nav-brand-logo"
          />
          <div>
            <div style={{ 
              fontFamily: 'Outfit, sans-serif', 
              fontWeight: 900, 
              fontSize: '1.25rem', 
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem'
            }}>
              <span style={{ color: '#ffffff' }}>BDS</span>
              <span style={{ 
                background: 'linear-gradient(135deg, var(--accent) 0%, #facc15 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                TELECOM NANCY
              </span>
            </div>
            <div className="brand-tagline" style={{ fontSize: '0.7rem', color: '#c4b5fd', fontWeight: 700, letterSpacing: '0.08em' }}>
              ASSOCIATION SPORTIVE
            </div>
          </div>
        </div>

        {/* Navigation Tabs - Strict Single Horizontal Level with Clearly Delimited Buttons */}
        <nav className="nav-dock">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`nav-tab-btn ${isActive ? 'active' : ''}`}
                title={item.tooltip}
              >
                <Icon 
                  size={15} 
                  className="nav-icon"
                  color={isActive ? '#ffffff' : 'var(--accent)'} 
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Admin Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          {isAdmin ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <button
                onClick={() => handleNavClick('admin')}
                className={`nav-admin-btn ${activePage === 'admin' ? 'active' : ''}`}
                title="Espace Bureau BDS"
              >
                <ShieldCheck size={16} color={activePage === 'admin' ? '#ffffff' : '#34d399'} />
                <span>Bureau BDS</span>
              </button>
              <button
                onClick={logout}
                title="Déconnexion bureau"
                className="btn btn-sm btn-outline"
                style={{ padding: '0.48rem', minWidth: '36px', borderRadius: 'var(--radius-full)' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleNavClick('login')}
              className={`nav-admin-btn ${activePage === 'login' ? 'active' : ''}`}
              title="Accès réservé aux membres du Bureau BDS"
            >
              <ShieldCheck size={16} color={activePage === 'login' ? '#ffffff' : 'var(--accent)'} />
              <span>Accès<span className="nav-label-long"> Bureau</span> BDS</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}

