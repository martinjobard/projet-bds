import React, { useEffect, useState } from 'react';
import { 
  Trophy, Dumbbell, Calendar, MapPin, ArrowRight, 
  Flame, Award, Shield, CheckCircle, Clock
} from 'lucide-react';
import { api } from '../api/client';

export function Home({ setActivePage }) {
  const [stats, setStats] = useState({
    totalEquipment: 34,
    matchesCount: 6,
    eventsCount: 5,
    tournamentsCount: 2
  });
  const [nextMatch, setNextMatch] = useState(null);
  const [featuredEvent, setFeaturedEvent] = useState(null);
  const [featuredTournament, setFeaturedTournament] = useState(null);

  useEffect(() => {
    // Charger les matchs pour trouver le prochain
    api.matches.list({ status_filter: 'UPCOMING' })
      .then((res) => {
        if (res && res.length > 0) setNextMatch(res[0]);
      })
      .catch(() => {});

    // Charger les événements à la une
    api.events.list({ featured_only: true })
      .then((res) => {
        if (res && res.length > 0) setFeaturedEvent(res[0]);
      })
      .catch(() => {});

    // Charger les tournois
    api.tournaments.list()
      .then((res) => {
        if (res && res.length > 0) setFeaturedTournament(res[0]);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="container">
      {/* Hero Section */}
      <section className="hero-section">
        <img 
          src="/hero-banner.jpg" 
          alt="BDS Nancy Sports" 
          className="hero-bg-image" 
        />
        <div className="hero-glow-1"></div>
        <div className="hero-glow-2"></div>

        <div style={{ 
          position: 'relative', 
          zIndex: 2, 
          padding: '1.5rem 2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '2.5rem'
        }}>
          <div style={{ maxWidth: '680px', flex: '1 1 450px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }} className="badge badge-accent">
              <Flame size={14} />
              <span>TELECOM Nancy • Saison Sportive 2026</span>
            </div>

            <h1 style={{ 
              fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', 
              marginBottom: '1.25rem',
              lineHeight: 1.15
            }}>
              Le sport à TELECOM Nancy, <br />
              <span style={{ 
                background: 'linear-gradient(135deg, #c4b5fd 0%, var(--primary) 50%, var(--accent) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                de l'entraînement aux podiums.
              </span>
            </h1>

            <p style={{ 
              color: 'var(--text-muted)', 
              fontSize: '1.15rem', 
              maxWidth: '650px', 
              marginBottom: '2rem',
              lineHeight: 1.6
            }}>
              Emprunte du matériel pour tes séances, soutiens nos équipes en championnat académique FFSU, brille au TOSS et relève les défis sportifs nancéiens.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <button 
                onClick={() => setActivePage('equipment')} 
                className="btn btn-primary"
                style={{ fontSize: '1.05rem', padding: '0.85rem 1.8rem' }}
              >
                <Dumbbell size={18} />
                <span>Emprunter du Matériel</span>
              </button>
              <button 
                onClick={() => setActivePage('matches')} 
                className="btn btn-accent"
                style={{ fontSize: '1.05rem', padding: '0.85rem 1.8rem' }}
              >
                <Trophy size={18} />
                <span>Nos Équipes & Matchs FFSU</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
            <div style={{
              position: 'relative',
              padding: '1.25rem',
              borderRadius: '24px',
              background: 'radial-gradient(circle, rgba(124, 58, 237, 0.25) 0%, rgba(249, 115, 22, 0.15) 100%)',
              border: '1px solid rgba(249, 115, 22, 0.35)',
              boxShadow: '0 0 35px rgba(249, 115, 22, 0.25), 0 0 45px rgba(124, 58, 237, 0.3)',
            }}>
              <img 
                src="/logo.png" 
                alt="Mascotte Canard BDS TELECOM Nancy" 
                style={{
                  width: 'clamp(180px, 20vw, 240px)',
                  height: 'auto',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.6))',
                  display: 'block',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* KPI Stats Highlights */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div className="grid-kpis">
          <div className="stat-box">
            <div className="stat-icon-wrapper" style={{ background: 'rgba(37, 99, 235, 0.15)', color: '#60a5fa' }}>
              <Dumbbell size={26} />
            </div>
            <div>
              <div className="stat-number">10+</div>
              <div className="stat-label">Équipements en libre prêt</div>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-icon-wrapper" style={{ background: 'rgba(249, 115, 22, 0.15)', color: '#fb923c' }}>
              <Trophy size={26} />
            </div>
            <div>
              <div className="stat-number">11</div>
              <div className="stat-label">Équipes TELECOM Nancy</div>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
              <Award size={26} />
            </div>
            <div>
              <div className="stat-number">4</div>
              <div className="stat-label">Médailles au TOSS 2026</div>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-icon-wrapper" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6' }}>
              <MapPin size={26} />
            </div>
            <div>
              <div className="stat-number">Nancy</div>
              <div className="stat-label">Blablarun & 24h de Stan</div>
            </div>
          </div>
        </div>
      </section>

      {/* Sections À la une */}
      <section style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem' }}>À la une cette semaine</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Prochains rendez-vous sportifs à ne pas manquer
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))',
          gap: '1.5rem',
        }}>
          {/* Card 1: Prochain match FFSU */}
          <div className="glass-card card-glow-primary" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span className="badge badge-primary">
                {nextMatch ? nextMatch.sport : 'Match Universitaire'}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#60a5fa' }}>
                <Clock size={14} />
                <span>{nextMatch ? nextMatch.match_date : 'À venir'}</span>
              </div>
            </div>

            <div style={{
              background: 'rgba(0, 0, 0, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              marginBottom: '1.25rem',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
                {nextMatch?.competition || 'Championnat Académique FFSU Lorraine'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.2rem', color: '#ffffff' }}>
                  {nextMatch?.team_home || 'TELECOM Nancy (Volley 1)'}
                </span>
                <span style={{ 
                  padding: '0.2rem 0.6rem', 
                  borderRadius: 'var(--radius-sm)', 
                  background: 'rgba(37, 99, 235, 0.2)',
                  color: '#60a5fa',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}>
                  VS
                </span>
                <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.2rem', color: '#ffffff' }}>
                  {nextMatch?.team_away || 'Polytech Nancy'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              <MapPin size={16} color="var(--accent)" />
              <span>{nextMatch?.location || 'Gymnase SUAPS Nancy Est'}</span>
            </div>

            <div style={{ marginTop: 'auto' }}>
              <button 
                onClick={() => setActivePage('matches')} 
                className="btn btn-outline" 
                style={{ width: '100%', justifyContent: 'space-between' }}
              >
                <span>Voir le calendrier complet</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Card 2: Événement Nancy (Blablarun) */}
          <div className="glass-card card-glow-primary" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span className="badge badge-accent">
                {featuredEvent?.category || 'Événement Nancy'}
              </span>
              <span className="badge badge-success">Tarif BDS Partenaire</span>
            </div>

            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.6rem' }}>
              {featuredEvent?.title || 'Blablarun Nancy 2026'}
            </h3>

            <p style={{ 
              color: 'var(--text-muted)', 
              fontSize: '0.9rem', 
              lineHeight: 1.5, 
              marginBottom: '1.25rem',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {featuredEvent?.description || 'La grande course solidaire et festive au Parc de la Pépinière ! Inscription subventionnée par le BDS.'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                <Calendar size={15} color="var(--primary)" />
                <span>{featuredEvent?.event_date || '15 Novembre 2026'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                <MapPin size={15} color="var(--accent)" />
                <span>{featuredEvent?.location || 'Parc de la Pépinière, Nancy'}</span>
              </div>
            </div>

            <div style={{ marginTop: 'auto' }}>
              <button 
                onClick={() => setActivePage('events')} 
                className="btn btn-outline" 
                style={{ width: '100%', justifyContent: 'space-between' }}
              >
                <span>Découvrir l'agenda Nancy</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Card 3: TOSS & Tournois */}
          <div className="glass-card card-glow-primary" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span className="badge badge-primary">Palmarès Tournois</span>
              <span style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 700 }}>
                🏆 {featuredTournament?.overall_ranking || '4ème école / 48'}
              </span>
            </div>

            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.6rem' }}>
              {featuredTournament?.name || 'TOSS 2026 - CentraleSupélec'}
            </h3>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Nos équipes ont brillé au plus grand tournoi omnisports étudiant de France avec 4 podiums mémorables !
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem' }}>
                <span>🥉</span>
                <strong style={{ color: '#ffffff' }}>Volley-ball Féminin :</strong>
                <span style={{ color: 'var(--text-muted)' }}>Médaille de Bronze</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem' }}>
                <span>🥈</span>
                <strong style={{ color: '#ffffff' }}>Football Masculin :</strong>
                <span style={{ color: 'var(--text-muted)' }}>Médaille d'Argent</span>
              </div>
            </div>

            <div style={{ marginTop: 'auto' }}>
              <button 
                onClick={() => setActivePage('tournaments')} 
                className="btn btn-outline" 
                style={{ width: '100%', justifyContent: 'space-between' }}
              >
                <span>Consulter tous les résultats</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Bannière Raccourci Emprunts */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(249, 115, 22, 0.12) 100%)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: '2.5rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '2rem',
        marginBottom: '2rem',
      }}>
        <div style={{ maxWidth: '650px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#60a5fa', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            <CheckCircle size={16} />
            <span>Service gratuit pour les étudiants de l'école</span>
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>
            Besoin de ballons, de chasubles ou d'une table de ping-pong ?
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem' }}>
            Le BDS met gratuitement à disposition du matériel sportif pour vos entraînements libres, matchs inter-promos ou après-midis détente. Réserve en 30 secondes en ligne !
          </p>
        </div>
        <button 
          onClick={() => setActivePage('equipment')} 
          className="btn btn-accent"
          style={{ padding: '0.85rem 1.8rem', fontSize: '1.05rem' }}
        >
          <Dumbbell size={18} />
          <span>Accéder au catalogue & réserver</span>
        </button>
      </section>
    </div>
  );
}
