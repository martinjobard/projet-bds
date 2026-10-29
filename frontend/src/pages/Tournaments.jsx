import React, { useState, useEffect } from 'react';
import { Trophy, Calendar, MapPin, Award, ChevronRight, Star, Flame } from 'lucide-react';
import { api } from '../api/client';

export function Tournaments({ showToast }) {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.tournaments.list()
      .then((data) => setTournaments(data))
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => setLoading(false));
  }, []);

  const getMedalBadge = (medal) => {
    switch (medal) {
      case 'GOLD':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(217, 119, 6, 0.25) 100%)',
            border: '1px solid #f59e0b',
            color: '#fbbf24',
            padding: '0.3rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.85rem',
            fontWeight: 700,
          }}>
            🥇 Or
          </span>
        );
      case 'SILVER':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'linear-gradient(135deg, rgba(148, 163, 184, 0.25) 0%, rgba(100, 116, 139, 0.25) 100%)',
            border: '1px solid #94a3b8',
            color: '#e2e8f0',
            padding: '0.3rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.85rem',
            fontWeight: 700,
          }}>
            🥈 Argent
          </span>
        );
      case 'BRONZE':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.25) 0%, rgba(180, 83, 9, 0.25) 100%)',
            border: '1px solid #d97706',
            color: '#f59e0b',
            padding: '0.3rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.85rem',
            fontWeight: 700,
          }}>
            🥉 Bronze
          </span>
        );
      default:
        return (
          <span className="badge badge-neutral">
            Place d'honneur
          </span>
        );
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div className="badge badge-primary" style={{ marginBottom: '0.6rem' }}>
          <Trophy size={14} />
          <span>Tournois Inter-Grandes Écoles</span>
        </div>
        <h1 style={{ fontSize: '2.4rem' }}>Résultats & Palmarès des Tournois</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.3rem' }}>
          TOSS, Coupe de l'X, Cartusienne : retrouvez toutes les performances et médailles de nos délégations
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          Chargement des résultats des tournois...
        </div>
      ) : tournaments.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>
          <p>Aucun tournoi archivé pour le moment.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {tournaments.map((tournament) => (
            <div 
              key={tournament.id}
              className="glass-card" 
              style={{ padding: '2rem', border: '1px solid rgba(255, 255, 255, 0.12)' }}
            >
              {/* Tournament Header */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '1.5rem',
                marginBottom: '1.5rem',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: '1.25rem',
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                    <span className="badge badge-accent">{tournament.edition || 'Édition 2026'}</span>
                    <span style={{ fontSize: '0.88rem', color: 'var(--text-dim)' }}>
                      Du {tournament.start_date} au {tournament.end_date}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '1.9rem', marginBottom: '0.4rem' }}>{tournament.name}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <MapPin size={16} color="var(--accent)" />
                    <span>{tournament.location}</span>
                  </div>
                </div>

                {tournament.overall_ranking && (
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(37, 99, 235, 0.15) 100%)',
                    border: '1px solid rgba(245, 158, 11, 0.35)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '0.9rem 1.4rem',
                    textAlign: 'right',
                  }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Classement Général Écoles
                    </div>
                    <div style={{ fontFamily: 'Outfit', fontSize: '1.4rem', fontWeight: 800, color: '#fbbf24' }}>
                      🏆 {tournament.overall_ranking}
                    </div>
                  </div>
                )}
              </div>

              {tournament.description && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                  {tournament.description}
                </p>
              )}

              {/* Sports Results Grid */}
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: '#ffffff' }}>
                Médailles & Résultats par Sport
              </h3>

              {(!tournament.results || tournament.results.length === 0) ? (
                <p style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>
                  Aucun résultat spécifique saisi pour cette édition.
                </p>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1.25rem',
                }}>
                  {tournament.results.map((res) => (
                    <div 
                      key={res.id}
                      style={{
                        background: 'var(--bg-surface-elevated)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#60a5fa' }}>
                            {res.sport}
                          </span>
                          {getMedalBadge(res.medal)}
                        </div>

                        <div style={{ fontFamily: 'Outfit', fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem', color: '#ffffff' }}>
                          {res.ranking_position}
                        </div>

                        <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>
                          Équipe : {res.team_name}
                        </div>

                        {res.summary && (
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                            {res.summary}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
