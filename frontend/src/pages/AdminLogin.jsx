import React, { useState } from 'react';
import { ShieldCheck, Lock, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function AdminLogin({ setActivePage, showToast }) {
  const { login } = useAuth();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(password);
      showToast('Connexion administrateur réussie !', 'success');
      setActivePage('admin');
    } catch (err) {
      setError(err.message || 'Mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '65vh' }}>
      <div className="glass-card card-glow-primary" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img 
            src="/logo.png" 
            alt="Logo BDS TELECOM Nancy" 
            style={{ 
              width: '80px', 
              height: '80px', 
              objectFit: 'contain', 
              filter: 'drop-shadow(0 6px 18px rgba(249, 115, 22, 0.5))',
              marginBottom: '0.75rem' 
            }} 
          />
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>Espace Bureau BDS</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Accès réservé aux membres du bureau BDS TELECOM Nancy
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.8rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#f87171',
            fontSize: '0.9rem',
            marginBottom: '1.25rem',
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Mot de passe du Bureau</label>
            <div style={{ position: 'relative' }}>
              <Lock 
                size={18} 
                color="var(--text-dim)" 
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} 
              />
              <input
                type="password"
                required
                autoFocus
                placeholder="Entre le mot de passe BDS..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.8rem' }}
              />
            </div>
          </div>

          <div style={{
            background: 'rgba(37, 99, 235, 0.1)',
            border: '1px solid rgba(37, 99, 235, 0.25)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.65rem 0.9rem',
            fontSize: '0.8rem',
            color: '#93c5fd',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            marginBottom: '1.5rem',
          }}>
            <KeyRound size={15} />
            <span>Mot de passe par défaut : <strong>bds2026</strong></span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem' }}
          >
            <span>{loading ? 'Vérification...' : 'Se connecter au Back-Office'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button
            onClick={() => setActivePage('home')}
            className="btn btn-outline btn-sm"
            style={{ border: 'none', color: 'var(--text-dim)' }}
          >
            ← Retourner au site public
          </button>
        </div>

      </div>
    </div>
  );
}
