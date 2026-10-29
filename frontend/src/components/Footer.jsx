import React from 'react';
import { Trophy, Heart, Mail, MapPin, Globe, Shield } from 'lucide-react';

export function Footer({ setActivePage }) {
  return (
    <footer style={{
      background: 'rgba(9, 13, 22, 0.95)',
      borderTop: '1px solid var(--border-subtle)',
      padding: '3.5rem 0 2rem',
      marginTop: 'auto',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem',
        }}>
          {/* Col 1 : Association */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
              <img 
                src="/logo.png" 
                alt="Logo BDS TELECOM Nancy" 
                style={{ width: '44px', height: '44px', objectFit: 'contain', filter: 'drop-shadow(0 2px 8px rgba(249, 115, 22, 0.4))' }} 
              />
              <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.2rem', color: '#ffffff' }}>
                BDS TELECOM NANCY
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
              L'association sportive des élèves-ingénieurs de TELECOM Nancy. Compétitions FFSU, tournois inter-écoles et pratique sportive pour tous.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <span className="badge badge-accent">TELECOM Nancy</span>
              <span className="badge badge-primary">FFSU Lorraine</span>
            </div>
          </div>

          {/* Col 2 : Raccourcis */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.1rem', color: '#ffffff' }}>Navigation Rapide</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li>
                <a href="#materiel" onClick={(e) => { e.preventDefault(); setActivePage('equipment'); }} style={{ color: 'var(--text-muted)' }}>
                  Catalogue de prêt de matériel
                </a>
              </li>
              <li>
                <a href="#matchs" onClick={(e) => { e.preventDefault(); setActivePage('matches'); }} style={{ color: 'var(--text-muted)' }}>
                  Planning & scores FFSU Lorraine
                </a>
              </li>
              <li>
                <a href="#tournois" onClick={(e) => { e.preventDefault(); setActivePage('tournaments'); }} style={{ color: 'var(--text-muted)' }}>
                  Résultats des tournois (TOSS & Inter-écoles)
                </a>
              </li>
              <li>
                <a href="#evenements" onClick={(e) => { e.preventDefault(); setActivePage('events'); }} style={{ color: 'var(--text-muted)' }}>
                  Agenda sportif Nancy (Blablarun, 24h Stan...)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3 : Contact & Lieux */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.1rem', color: '#ffffff' }}>Installations & Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} color="var(--accent)" />
                <span>Gymnases SUAPS Nancy Est & Chopin</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} color="var(--primary)" />
                <span>bds@telecomnancy.net</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Globe size={16} color="#ec4899" />
                <span>@bds_nancy_sport</span>
              </div>
            </div>
          </div>

          {/* Col 4 : Bureau BDS */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.1rem', color: '#ffffff' }}>Espace Membres du Bureau</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1rem' }}>
              Gestion des réservations, validation des emprunts, mise à jour des scores et des palmarès.
            </p>
            <button
              onClick={() => setActivePage('admin')}
              className="btn btn-sm btn-outline"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Shield size={16} />
              <span>Accéder au Back-Office</span>
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.85rem',
          color: 'var(--text-dim)',
        }}>
          <div>
            © {new Date().getFullYear()} Bureau des Sports Nancy. Fait avec passion pour le sport universitaire.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>Esprit sportif & convivialité</span>
            <Heart size={14} color="#ef4444" fill="#ef4444" />
          </div>
        </div>
      </div>
    </footer>
  );
}
