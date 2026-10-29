import React, { useState, useEffect } from 'react';
import { 
  Trophy, Calendar, MapPin, Clock, Users, User, 
  ChevronRight, ArrowLeft, CheckCircle2, Flame, Award, Filter
} from 'lucide-react';
import { api } from '../api/client';
import { Modal } from '../components/Modal';

export function Matches({ showToast }) {
  const [activeTab, setActiveTab] = useState('matches'); // 'matches' | 'teams'
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtres
  const [selectedSport, setSelectedSport] = useState('Tous');
  const [selectedCategory, setSelectedCategory] = useState('Tous'); // 'Tous' | 'Collectif' | 'Individuel'
  const [selectedGender, setSelectedGender] = useState('Tous'); // 'Tous' | 'Mixte' | 'Féminin'
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState('');

  // Détail / Historique d'une équipe
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamMatches, setTeamMatches] = useState([]);
  const [loadingTeamMatches, setLoadingTeamMatches] = useState(false);

  const sports = [
    'Tous',
    ...Array.from(new Set([...teams.map(t => t.sport)])).filter(Boolean).sort()
  ];

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      api.matches.list({
        sport: selectedSport,
        category: selectedCategory,
        gender: selectedGender,
        status_filter: selectedStatus,
        team_id: selectedTeamFilter || undefined,
      }),
      api.matches.listTeams({
        category: selectedCategory === 'Tous' ? undefined : selectedCategory,
        gender: selectedGender === 'Tous' ? undefined : selectedGender,
        sport: selectedSport === 'Tous' ? undefined : selectedSport,
      }),
    ])
      .then(([matchesData, teamsData]) => {
        setMatches(matchesData);
        setTeams(teamsData);
      })
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [selectedSport, selectedCategory, selectedGender, selectedStatus, selectedTeamFilter]);

  const viewTeamHistory = (team) => {
    setSelectedTeam(team);
    setLoadingTeamMatches(true);
    api.matches.list({ team_id: team.id })
      .then((data) => setTeamMatches(data))
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => setLoadingTeamMatches(false));
  };

  const renderStatusBadge = (match) => {
    if (match.status === 'LIVE') {
      return (
        <span className="badge badge-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span className="pulse-indicator"></span>
          <span>EN DIRECT</span>
        </span>
      );
    }
    if (match.status === 'COMPLETED') {
      return (
        <span className="badge badge-neutral">
          <span>Terminé</span>
        </span>
      );
    }
    return (
      <span className="badge badge-primary">
        <Clock size={12} />
        <span>À venir</span>
      </span>
    );
  };

  return (
    <div className="container">
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div className="badge badge-primary" style={{ marginBottom: '0.6rem' }}>
          <Trophy size={14} />
          <span>Championnats FFSU Lorraine</span>
        </div>
        <h1 style={{ fontSize: '2.4rem' }}>Matchs Universitaires FFSU</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.3rem' }}>
          Calendrier des rencontres, résultats et historique de nos équipes TELECOM Nancy
        </p>
      </div>

      {/* Main Tabs Navigation */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '2rem',
      }}>
        <button
          onClick={() => { setActiveTab('matches'); setSelectedTeam(null); }}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.8rem 1.4rem',
            fontFamily: 'Outfit, sans-serif',
            fontSize: '1.05rem',
            fontWeight: 700,
            color: activeTab === 'matches' ? '#ffffff' : 'var(--text-muted)',
            borderBottom: activeTab === 'matches' ? '3px solid var(--primary)' : '3px solid transparent',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)'
          }}
        >
          Tous les Matchs & Résultats
        </button>

        <button
          onClick={() => { setActiveTab('teams'); setSelectedTeam(null); }}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.8rem 1.4rem',
            fontFamily: 'Outfit, sans-serif',
            fontSize: '1.05rem',
            fontWeight: 700,
            color: activeTab === 'teams' ? '#ffffff' : 'var(--text-muted)',
            borderBottom: activeTab === 'teams' ? '3px solid var(--primary)' : '3px solid transparent',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)'
          }}
        >
          Nos Équipes TELECOM Nancy ({teams.length})
        </button>
      </div>

      {/* Filters Block */}
      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
        
        {/* Row 1 : Catégorie (Individuel / Collectif) & Genre (Mixte / Féminin) */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1.5rem',
          alignItems: 'center',
          marginBottom: '1.25rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          {/* Catégorie : Collectif vs Individuel */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 600 }}>Type :</span>
            {['Tous', 'Collectif', 'Individuel'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`filter-tab ${selectedCategory === cat ? 'active' : ''}`}
                style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}
              >
                {cat === 'Tous' ? 'Tous types' : cat === 'Collectif' ? 'Sports Collectifs' : 'Sports Individuels'}
              </button>
            ))}
          </div>

          {/* Genre : Mixte vs Féminin (Aucun Masculin !) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 600 }}>Genre :</span>
            {['Tous', 'Mixte', 'Féminin'].map((gen) => (
              <button
                key={gen}
                onClick={() => setSelectedGender(gen)}
                className={`filter-tab ${selectedGender === gen ? 'active' : ''}`}
                style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}
              >
                {gen === 'Tous' ? 'Mixte & Féminin' : gen}
              </button>
            ))}
          </div>

          {/* Statut (uniquement en vue Matchs) */}
          {activeTab === 'matches' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="form-select"
                style={{ padding: '0.45rem 0.8rem', fontSize: '0.85rem', width: 'auto' }}
              >
                <option value="ALL">Tous les statuts</option>
                <option value="UPCOMING">Matchs à venir</option>
                <option value="COMPLETED">Matchs terminés</option>
                <option value="LIVE">En direct</option>
              </select>
            </div>
          )}
        </div>

        {/* Row 2 : Filtre par Discipline Sportive */}
        <div className="filter-bar" style={{ marginBottom: 0 }}>
          {sports.map((sp) => (
            <button
              key={sp}
              onClick={() => setSelectedSport(sp)}
              className={`filter-tab ${selectedSport === sp ? 'active' : ''}`}
            >
              {sp}
            </button>
          ))}
        </div>
      </div>

      {/* VUE 1 : TOUS LES MATCHS */}
      {activeTab === 'matches' && (
        <>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
              Chargement des matchs FFSU...
            </div>
          ) : matches.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>
              <p>Aucun match programmé pour ces critères actuellement.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {matches.map((match) => {
                const isCompleted = match.status === 'COMPLETED';
                const isHomeWinner = isCompleted && match.score_home > match.score_away;
                const isAwayWinner = isCompleted && match.score_away > match.score_home;

                return (
                  <div key={match.id} className="glass-card" style={{ padding: '1.5rem' }}>
                    {/* Header : Badges */}
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '1.25rem',
                      borderBottom: '1px solid var(--border-subtle)',
                      paddingBottom: '0.75rem',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                        <span className="badge badge-accent">{match.sport}</span>
                        <span className="badge badge-primary">{match.category}</span>
                        <span className="badge badge-neutral">{match.gender}</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                          {match.competition}
                        </span>
                      </div>
                      <div>
                        {renderStatusBadge(match)}
                      </div>
                    </div>

                    {/* Fixture Display */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto 1fr',
                      alignItems: 'center',
                      gap: '1.5rem',
                      padding: '1rem 0',
                    }}>
                      {/* Équipe Domicile */}
                      <div style={{ textAlign: 'right' }}>
                        <div style={{
                          fontFamily: 'Outfit, sans-serif',
                          fontSize: '1.35rem',
                          fontWeight: 700,
                          color: isHomeWinner ? '#ffffff' : isCompleted ? 'var(--text-muted)' : '#ffffff',
                        }}>
                          {match.team_home}
                        </div>
                        {match.team_home.includes('TELECOM') && (
                          <span style={{ fontSize: '0.78rem', color: '#60a5fa', fontWeight: 700 }}>
                            TELECOM Nancy
                          </span>
                        )}
                      </div>

                      {/* Score Box */}
                      <div style={{
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.6rem 1.4rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.8rem',
                        minWidth: '100px',
                        justifyContent: 'center',
                      }}>
                        {isCompleted ? (
                          <div style={{ fontFamily: 'Outfit', fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>
                            <span>{match.score_home}</span>
                            <span style={{ margin: '0 0.4rem', color: 'var(--text-dim)' }}>-</span>
                            <span>{match.score_away}</span>
                          </div>
                        ) : (
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '0.85rem', color: '#60a5fa', fontWeight: 700 }}>VS</div>
                          </div>
                        )}
                      </div>

                      {/* Équipe Visiteuse */}
                      <div style={{ textAlign: 'left' }}>
                        <div style={{
                          fontFamily: 'Outfit, sans-serif',
                          fontSize: '1.35rem',
                          fontWeight: 700,
                          color: isAwayWinner ? '#ffffff' : isCompleted ? 'var(--text-muted)' : '#ffffff',
                        }}>
                          {match.team_away}
                        </div>
                        {match.team_away.includes('TELECOM') && (
                          <span style={{ fontSize: '0.78rem', color: '#60a5fa', fontWeight: 700 }}>
                            TELECOM Nancy
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Footer Details */}
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '1rem',
                      marginTop: '1rem',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid var(--border-subtle)',
                      fontSize: '0.88rem',
                      color: 'var(--text-muted)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Calendar size={15} color="var(--primary)" />
                          <span>{match.match_date}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <MapPin size={15} color="var(--accent)" />
                          <span>{match.location}</span>
                        </div>
                      </div>

                      {match.details && (
                        <div style={{ color: '#38bdf8', fontStyle: 'italic', fontSize: '0.85rem' }}>
                          💬 {match.details}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* VUE 2 : NOS ÉQUIPES TELECOM NANCY */}
      {activeTab === 'teams' && (
        <>
          <div className="grid-cards">
            {teams.map((team) => (
              <div 
                key={team.id} 
                className="glass-card" 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderTop: '3px solid var(--primary)',
                }}
              >
                {/* Team Badges */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span className="badge badge-accent">{team.sport}</span>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <span className="badge badge-primary">{team.category}</span>
                    <span className="badge badge-neutral">{team.gender}</span>
                  </div>
                </div>

                {/* Team Name */}
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.3rem', color: '#ffffff' }}>
                  {team.name}
                </h3>

                {team.captain && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>
                    <User size={14} />
                    <span>Capitaine : <strong style={{ color: 'var(--text-muted)' }}>{team.captain}</strong></span>
                  </div>
                )}

                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '1.25rem', flex: 1 }}>
                  {team.description || `Équipe officielle de ${team.sport} TELECOM Nancy engagée en championnat universitaire.`}
                </p>

                {/* Match Statistics */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  background: 'rgba(0, 0, 0, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.25rem',
                  textAlign: 'center',
                }}>
                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>{team.matches_count}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Matchs</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399' }}>{team.wins_count}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Victoires</div>
                  </div>
                </div>

                {/* View Team Matches Button */}
                <button
                  onClick={() => viewTeamHistory(team)}
                  className="btn btn-outline"
                  style={{ width: '100%', justifyContent: 'space-between' }}
                >
                  <span>Historique des matchs</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal Historique & Matchs de l'Équipe sélectionnée */}
      <Modal
        isOpen={Boolean(selectedTeam)}
        onClose={() => setSelectedTeam(null)}
        title={selectedTeam ? `Historique : ${selectedTeam.name} (${selectedTeam.sport} - ${selectedTeam.gender})` : ''}
        maxWidth="680px"
      >
        {selectedTeam && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(37, 99, 235, 0.1)',
              border: '1px solid rgba(37, 99, 235, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1.25rem',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
            }}>
              <div>
                <span>Catégorie : </span>
                <strong style={{ color: '#60a5fa' }}>{selectedTeam.category}</strong>
                <span style={{ margin: '0 0.5rem', color: 'var(--text-dim)' }}>•</span>
                <span>Genre : </span>
                <strong style={{ color: '#fbbf24' }}>{selectedTeam.gender}</strong>
              </div>
              {selectedTeam.captain && (
                <div>
                  <span>Capitaine : </span>
                  <strong style={{ color: '#ffffff' }}>{selectedTeam.captain}</strong>
                </div>
              )}
            </div>

            <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#ffffff' }}>
              Rencontres de l'équipe
            </h4>

            {loadingTeamMatches ? (
              <p style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '2rem 0' }}>
                Chargement des matchs de l'équipe...
              </p>
            ) : teamMatches.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '2rem 0' }}>
                Aucun match enregistré pour cette équipe pour le moment.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '420px', overflowY: 'auto' }}>
                {teamMatches.map((m) => {
                  const isCompleted = m.status === 'COMPLETED';
                  const isWin = isCompleted && m.score_home !== null && m.score_away !== null && (
                    (m.team_home.includes(selectedTeam.name) && m.score_home > m.score_away) ||
                    (m.team_away.includes(selectedTeam.name) && m.score_away > m.score_home)
                  );

                  return (
                    <div 
                      key={m.id}
                      style={{
                        background: 'var(--bg-surface-elevated)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                          🗓️ {m.match_date} - 📍 {m.location}
                        </span>
                        {isCompleted ? (
                          <span className={`badge ${isWin ? 'badge-success' : 'badge-neutral'}`}>
                            {isWin ? 'Victoire' : 'Défaite / Match joué'}
                          </span>
                        ) : (
                          <span className="badge badge-primary">À venir</span>
                        )}
                      </div>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontFamily: 'Outfit',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                      }}>
                        <span style={{ color: m.team_home.includes(selectedTeam.name) ? '#60a5fa' : '#ffffff' }}>
                          {m.team_home}
                        </span>
                        
                        <div style={{
                          background: 'rgba(0,0,0,0.3)',
                          padding: '0.2rem 0.8rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '1.2rem',
                          color: '#ffffff',
                        }}>
                          {isCompleted ? `${m.score_home} - ${m.score_away}` : 'VS'}
                        </div>

                        <span style={{ color: m.team_away.includes(selectedTeam.name) ? '#60a5fa' : '#ffffff' }}>
                          {m.team_away}
                        </span>
                      </div>

                      {m.details && (
                        <div style={{ marginTop: '0.5rem', fontSize: '0.82rem', color: '#38bdf8', fontStyle: 'italic' }}>
                          {m.details}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </Modal>

    </div>
  );
}
