import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Dumbbell, Trophy, Calendar, MapPin, 
  Check, X, Clock, AlertCircle, Plus, Trash2, Edit3, 
  RefreshCw, Award, ArrowUpRight, CheckCircle2, Users, User
} from 'lucide-react';
import { api } from '../api/client';
import { Modal } from '../components/Modal';

export function AdminDashboard({ showToast }) {
  const [activeTab, setActiveTab] = useState('loans'); // 'loans' | 'equipment' | 'teams' | 'matches' | 'tournaments' | 'events'
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Données
  const [loans, setLoans] = useState([]);
  const [loanStatusFilter, setLoanStatusFilter] = useState('ALL');
  const [equipmentList, setEquipmentList] = useState([]);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [events, setEvents] = useState([]);

  // Modals d'édition / création
  const [equipmentModalOpen, setEquipmentModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [equipmentForm, setEquipmentForm] = useState({
    name: '', category: 'Volley-ball', total_quantity: 1, available_quantity: 1,
    image_url: '', condition: 'Bon état', replacement_price: 30, description: ''
  });

  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [teamForm, setTeamForm] = useState({
    name: '', sport: 'Volley-ball', category: 'Collectif', gender: 'Mixte', captain: '', description: ''
  });

  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [matchForm, setMatchForm] = useState({
    team_id: '', sport: 'Volley-ball', category: 'Collectif', gender: 'Mixte',
    competition: 'Championnat Académique FFSU Lorraine', team_home: 'TELECOM Nancy', team_away: '',
    match_date: '', location: 'Gymnase SUAPS Nancy Est', status: 'UPCOMING', score_home: '', score_away: '', details: ''
  });

  const [tournamentModalOpen, setTournamentModalOpen] = useState(false);
  const [tournamentForm, setTournamentForm] = useState({
    name: '', edition: 'Édition 2026', location: '', start_date: '', end_date: '',
    description: '', overall_ranking: '', image_url: ''
  });

  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [targetTournamentId, setTargetTournamentId] = useState(null);
  const [resultForm, setResultForm] = useState({
    sport: 'Volley-ball Féminin', team_name: 'TELECOM Nancy (Volley F)', ranking_position: 'Médaille de Bronze',
    medal: 'BRONZE', summary: ''
  });

  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '', category: 'Course solidaire & conviviale', event_date: '', location: 'Parc de la Pépinière, Nancy',
    description: '', bds_participation: true, price_info: '5€ étudiant', registration_link: '', image_url: '', is_featured: false
  });

  // Recharger les données
  const refreshAll = () => {
    setLoading(true);
    Promise.all([
      api.stats.getDashboard(),
      api.equipment.adminListLoans(loanStatusFilter),
      api.equipment.list(),
      api.matches.listTeams(),
      api.matches.list(),
      api.tournaments.list(),
      api.events.list(),
    ])
      .then(([statsData, loansData, eqData, teamsData, matchData, tourData, eventData]) => {
        setStats(statsData);
        setLoans(loansData);
        setEquipmentList(eqData);
        setTeams(teamsData);
        setMatches(matchData);
        setTournaments(tourData);
        setEvents(eventData);
      })
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refreshAll();
  }, [loanStatusFilter]);

  // Actions Emprunts
  const handleUpdateLoanStatus = async (loanId, newStatus, defaultNote = '') => {
    let noteToSend = defaultNote;
    if (!noteToSend) {
      if (newStatus === 'APPROVED') {
        noteToSend = 'Validé par le BDS. Matériel à récupérer au local.';
      } else if (newStatus === 'RETURNED') {
        noteToSend = 'Matériel bien restitué au BDS, tout est bon !';
      } else if (newStatus === 'REJECTED') {
        noteToSend = 'Demande refusée par le BDS.';
      }
    }
    try {
      await api.equipment.adminUpdateLoanStatus(loanId, {
        status: newStatus,
        admin_notes: noteToSend
      });
      showToast(`Statut de la demande mis à jour : ${newStatus}`, 'success');
      refreshAll();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Actions Matériel
  const openEquipmentModal = (item = null) => {
    if (item) {
      setEditingEquipment(item);
      setEquipmentForm({ ...item });
    } else {
      setEditingEquipment(null);
      setEquipmentForm({
        name: '', category: 'Volley-ball', total_quantity: 2, available_quantity: 2,
        image_url: '', condition: 'Neuf', replacement_price: 35, description: ''
      });
    }
    setEquipmentModalOpen(true);
  };

  const handleSaveEquipment = async (e) => {
    e.preventDefault();
    try {
      if (editingEquipment) {
        await api.equipment.update(editingEquipment.id, equipmentForm);
        showToast('Matériel mis à jour avec succès', 'success');
      } else {
        await api.equipment.create(equipmentForm);
        showToast('Nouveau matériel ajouté au catalogue', 'success');
      }
      setEquipmentModalOpen(false);
      refreshAll();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteEquipment = async (id) => {
    if (!window.confirm('Supprimer définitivement cet équipement du catalogue ?')) return;
    try {
      await api.equipment.delete(id);
      showToast('Matériel supprimé', 'info');
      refreshAll();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Actions Équipes
  const openTeamModal = (item = null) => {
    if (item) {
      setEditingTeam(item);
      setTeamForm({ ...item });
    } else {
      setEditingTeam(null);
      setTeamForm({
        name: '', sport: 'Volley-ball', category: 'Collectif', gender: 'Mixte', captain: '', description: ''
      });
    }
    setTeamModalOpen(true);
  };

  const handleSaveTeam = async (e) => {
    e.preventDefault();
    try {
      if (editingTeam) {
        await api.matches.updateTeam(editingTeam.id, teamForm);
        showToast('Équipe mise à jour avec succès', 'success');
      } else {
        await api.matches.createTeam(teamForm);
        showToast('Nouvelle équipe créée !', 'success');
      }
      setTeamModalOpen(false);
      refreshAll();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteTeam = async (id) => {
    if (!window.confirm('Supprimer cette équipe ?')) return;
    try {
      await api.matches.deleteTeam(id);
      showToast('Équipe supprimée', 'info');
      refreshAll();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Actions Matchs
  const openMatchModal = (item = null) => {
    if (item) {
      setEditingMatch(item);
      setMatchForm({ 
        ...item, 
        team_id: item.team_id || '',
        score_home: item.score_home ?? '', 
        score_away: item.score_away ?? '' 
      });
    } else {
      setEditingMatch(null);
      setMatchForm({
        team_id: teams[0]?.id || '',
        sport: 'Volley-ball', 
        category: 'Collectif', 
        gender: 'Mixte', 
        competition: 'Championnat Académique FFSU Lorraine',
        team_home: 'TELECOM Nancy (Volley 1)', 
        team_away: '', 
        match_date: '2026-11-20 19:30', 
        location: 'Gymnase SUAPS Nancy Est',
        status: 'UPCOMING', 
        score_home: '', 
        score_away: '', 
        details: ''
      });
    }
    setMatchModalOpen(true);
  };

  const handleSaveMatch = async (e) => {
    e.preventDefault();
    const payload = {
      ...matchForm,
      team_id: matchForm.team_id ? parseInt(matchForm.team_id, 10) : null,
      score_home: matchForm.score_home !== '' ? parseInt(matchForm.score_home, 10) : null,
      score_away: matchForm.score_away !== '' ? parseInt(matchForm.score_away, 10) : null,
    };
    try {
      if (editingMatch) {
        await api.matches.update(editingMatch.id, payload);
        showToast('Match mis à jour avec succès', 'success');
      } else {
        await api.matches.create(payload);
        showToast('Match programmé avec succès', 'success');
      }
      setMatchModalOpen(false);
      refreshAll();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteMatch = async (id) => {
    if (!window.confirm('Supprimer ce match ?')) return;
    try {
      await api.matches.delete(id);
      showToast('Match supprimé', 'info');
      refreshAll();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Actions Tournois
  const handleSaveTournament = async (e) => {
    e.preventDefault();
    try {
      await api.tournaments.create(tournamentForm);
      showToast('Tournoi créé avec succès !', 'success');
      setTournamentModalOpen(false);
      refreshAll();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteTournament = async (id) => {
    if (!window.confirm('Supprimer ce tournoi et tous ses résultats ?')) return;
    try {
      await api.tournaments.delete(id);
      showToast('Tournoi supprimé', 'info');
      refreshAll();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const openAddResultModal = (tournamentId) => {
    setTargetTournamentId(tournamentId);
    setResultForm({
      sport: 'Volley-ball Féminin', team_name: 'TELECOM Nancy (Volley F)', ranking_position: 'Médaille de Bronze',
      medal: 'BRONZE', summary: 'Belle victoire en petite finale'
    });
    setResultModalOpen(true);
  };

  const handleSaveResult = async (e) => {
    e.preventDefault();
    try {
      await api.tournaments.addResult(targetTournamentId, resultForm);
      showToast('Résultat ajouté au tournoi !', 'success');
      setResultModalOpen(false);
      refreshAll();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteResult = async (resultId) => {
    if (!window.confirm('Supprimer ce résultat ?')) return;
    try {
      await api.tournaments.deleteResult(resultId);
      showToast('Résultat supprimé', 'info');
      refreshAll();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Actions Événements Nancy
  const handleSaveEvent = async (e) => {
    e.preventDefault();
    try {
      await api.events.create(eventForm);
      showToast('Événement nancéien ajouté au calendrier !', 'success');
      setEventModalOpen(false);
      refreshAll();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Supprimer cet événement ?')) return;
    try {
      await api.events.delete(id);
      showToast('Événement supprimé', 'info');
      refreshAll();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="container">
      {/* Top Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
        marginBottom: '2rem',
      }}>
        <div>
          <div className="badge badge-success" style={{ marginBottom: '0.5rem' }}>
            <ShieldCheck size={14} />
            <span>Mode Administrateur Actif</span>
          </div>
          <h1 style={{ fontSize: '2.4rem' }}>Tableau de Bord Bureau BDS</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem' }}>
            Gestion centralisée des réservations, équipes TELECOM Nancy, scores FFSU et événements
          </p>
        </div>

        <button onClick={refreshAll} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <RefreshCw size={15} />
          <span>Actualiser les données</span>
        </button>
      </div>

      {/* KPI Cards */}
      {stats && (
        <div className="grid-kpis" style={{ marginBottom: '2.5rem' }}>
          <div className="stat-box" style={{ borderLeft: '4px solid #f59e0b' }}>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
              <Clock size={24} />
            </div>
            <div>
              <div className="stat-number">{stats.pending_loans}</div>
              <div className="stat-label">Demandes d'emprunt à valider</div>
            </div>
          </div>

          <div className="stat-box" style={{ borderLeft: '4px solid #10b981' }}>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
              <Dumbbell size={24} />
            </div>
            <div>
              <div className="stat-number">{stats.active_loans}</div>
              <div className="stat-label">Emprunts en cours</div>
            </div>
          </div>

          <div className="stat-box" style={{ borderLeft: '4px solid var(--primary)' }}>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(37, 99, 235, 0.15)', color: '#60a5fa' }}>
              <Users size={24} />
            </div>
            <div>
              <div className="stat-number">{stats.teams_count || teams.length}</div>
              <div className="stat-label">Équipes TELECOM Nancy</div>
            </div>
          </div>

          <div className="stat-box" style={{ borderLeft: '4px solid var(--accent)' }}>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(249, 115, 22, 0.15)', color: '#fb923c' }}>
              <Trophy size={24} />
            </div>
            <div>
              <div className="stat-number">{stats.upcoming_matches_count}</div>
              <div className="stat-label">Prochains matchs FFSU</div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Navigation Tabs */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '2rem',
      }}>
        {[
          { id: 'loans', label: `Demandes d'Emprunt (${stats?.pending_loans || 0})`, icon: Clock },
          { id: 'equipment', label: 'Catalogue Matériel', icon: Dumbbell },
          { id: 'teams', label: `Équipes TELECOM Nancy (${teams.length})`, icon: Users },
          { id: 'matches', label: 'Matchs FFSU & Scores', icon: Trophy },
          { id: 'tournaments', label: 'Tournois & Palmarès', icon: Award },
          { id: 'events', label: 'Événements Nancy', icon: MapPin },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.8rem 1.3rem',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '1rem',
                fontWeight: 700,
                color: isActive ? '#ffffff' : 'var(--text-muted)',
                border: 'none',
                background: 'none',
                borderBottom: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <Icon size={17} color={isActive ? 'var(--primary)' : 'currentColor'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1 : EMPRUNTS */}
      {activeTab === 'loans' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Filtrer par statut :</span>
              {['ALL', 'PENDING', 'APPROVED', 'RETURNED', 'REJECTED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setLoanStatusFilter(st)}
                  className={`filter-tab ${loanStatusFilter === st ? 'active' : ''}`}
                  style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem' }}
                >
                  {st === 'ALL' ? 'Tous' : st === 'PENDING' ? 'En attente' : st === 'APPROVED' ? 'Validé' : st === 'RETURNED' ? 'Rendu' : 'Refusé'}
                </button>
              ))}
            </div>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Étudiant (@telecomnancy.net)</th>
                  <th>Matériel</th>
                  <th>Quantité</th>
                  <th>Dates Emprunt</th>
                  <th>Statut</th>
                  <th>Actions Bureau</th>
                </tr>
              </thead>
              <tbody>
                {loans.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-dim)' }}>
                      Aucune demande d'emprunt dans cette catégorie.
                    </td>
                  </tr>
                ) : (
                  loans.map((loan) => (
                    <tr key={loan.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: '#ffffff' }}>{loan.user_name}</div>
                        <div style={{ fontSize: '0.82rem', color: '#60a5fa' }}>{loan.user_email}</div>
                        {loan.user_phone && <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>📞 {loan.user_phone}</div>}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#ffffff' }}>{loan.equipment?.name || 'Matériel'}</div>
                        {loan.equipment?.replacement_price > 0 && (
                          <div style={{ fontSize: '0.78rem', color: '#fbbf24' }}>
                            Rachat si perte : {loan.equipment.replacement_price} €
                          </div>
                        )}
                        {loan.notes && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '220px', whiteSpace: 'normal', marginTop: '0.2rem' }}>
                            Motif: {loan.notes}
                          </div>
                        )}
                      </td>
                      <td style={{ fontWeight: 700 }}>{loan.quantity}x</td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <div>Du : {loan.loan_date}</div>
                        <div>Au : {loan.expected_return_date}</div>
                      </td>
                      <td>
                        <span className={`badge ${
                          loan.status === 'PENDING' ? 'badge-warning' :
                          loan.status === 'APPROVED' ? 'badge-success' :
                          loan.status === 'RETURNED' ? 'badge-neutral' : 'badge-danger'
                        }`}>
                          {loan.status === 'PENDING' ? 'En attente' :
                           loan.status === 'APPROVED' ? 'En cours / Validé' :
                           loan.status === 'RETURNED' ? 'Restitué' : 'Refusé'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          {loan.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleUpdateLoanStatus(loan.id, 'APPROVED')}
                                className="btn btn-sm btn-success"
                                title="Valider et réserver le stock"
                              >
                                <Check size={14} />
                                <span>Valider</span>
                              </button>
                              <button
                                onClick={() => handleUpdateLoanStatus(loan.id, 'REJECTED')}
                                className="btn btn-sm btn-danger"
                                title="Refuser"
                              >
                                <X size={14} />
                                <span>Refuser</span>
                              </button>
                            </>
                          )}
                          {loan.status === 'APPROVED' && (
                            <button
                              onClick={() => handleUpdateLoanStatus(loan.id, 'RETURNED')}
                              className="btn btn-sm btn-primary"
                              title="Marquer comme rendu et réintégrer au stock disponible"
                            >
                              <CheckCircle2 size={14} />
                              <span>Marquer comme Rendu</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2 : CATALOGUE MATÉRIEL */}
      {activeTab === 'equipment' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Équipements du Local BDS</h3>
            <button onClick={() => openEquipmentModal()} className="btn btn-primary btn-sm">
              <Plus size={16} />
              <span>Ajouter un équipement</span>
            </button>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nom & Catégorie</th>
                  <th>Stock Total</th>
                  <th>Disponible</th>
                  <th>État</th>
                  <th>Prix Rachat Perte</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {equipmentList.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#ffffff' }}>{item.name}</div>
                      <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>{item.category}</span>
                    </td>
                    <td style={{ fontWeight: 700 }}>{item.total_quantity}</td>
                    <td>
                      <span className={`badge ${item.available_quantity > 0 ? 'badge-success' : 'badge-danger'}`}>
                        {item.available_quantity} dispo
                      </span>
                    </td>
                    <td>{item.condition}</td>
                    <td style={{ color: item.replacement_price > 0 ? '#fbbf24' : '#34d399', fontWeight: 600 }}>
                      {item.replacement_price > 0 ? `${item.replacement_price} €` : '0 €'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button onClick={() => openEquipmentModal(item)} className="btn btn-sm btn-outline" title="Modifier">
                          <Edit3 size={14} />
                        </button>
                        <button onClick={() => handleDeleteEquipment(item.id)} className="btn btn-sm btn-danger" title="Supprimer">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3 : NOS ÉQUIPES TELECOM NANCY */}
      {activeTab === 'teams' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>Équipes Sportives TELECOM Nancy</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Volley 1, Basket 1, Volley 3, Volley F... et leurs capitaines
              </p>
            </div>
            <button onClick={() => openTeamModal()} className="btn btn-primary btn-sm">
              <Plus size={16} />
              <span>Créer une équipe</span>
            </button>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nom de l'Équipe</th>
                  <th>Sport</th>
                  <th>Catégorie</th>
                  <th>Genre</th>
                  <th>Capitaine</th>
                  <th style={{ textAlign: 'center' }}>Matchs</th>
                  <th style={{ textAlign: 'center' }}>Victoires</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((t) => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 700, color: '#ffffff' }}>{t.name}</td>
                    <td><span className="badge badge-accent">{t.sport}</span></td>
                    <td><span className="badge badge-primary">{t.category}</span></td>
                    <td><span className="badge badge-neutral">{t.gender}</span></td>
                    <td>{t.captain || '-'}</td>
                    <td style={{ textAlign: 'center', fontWeight: 700 }}>{t.matches_count}</td>
                    <td style={{ textAlign: 'center', color: '#34d399', fontWeight: 700 }}>{t.wins_count}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button onClick={() => openTeamModal(t)} className="btn btn-sm btn-outline" title="Modifier">
                          <Edit3 size={14} />
                        </button>
                        <button onClick={() => handleDeleteTeam(t.id)} className="btn btn-sm btn-danger" title="Supprimer">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4 : MATCHS FFSU */}
      {activeTab === 'matches' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Calendrier & Scores FFSU</h3>
            <button onClick={() => openMatchModal()} className="btn btn-primary btn-sm">
              <Plus size={16} />
              <span>Programmer un match</span>
            </button>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rencontre</th>
                  <th>Sport & Type</th>
                  <th>Genre</th>
                  <th>Date & Lieu</th>
                  <th>Statut</th>
                  <th>Score</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#ffffff' }}>
                        {m.team_home} vs {m.team_away}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{m.competition}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                        <span className="badge badge-accent">{m.sport}</span>
                        <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>{m.category}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-neutral">{m.gender}</span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <div>{m.match_date}</div>
                      <div>📍 {m.location}</div>
                    </td>
                    <td>
                      <span className={`badge ${
                        m.status === 'LIVE' ? 'badge-danger' :
                        m.status === 'COMPLETED' ? 'badge-neutral' : 'badge-primary'
                      }`}>
                        {m.status === 'LIVE' ? 'EN DIRECT' : m.status === 'COMPLETED' ? 'Terminé' : 'À venir'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 800, fontSize: '1.1rem', color: '#60a5fa' }}>
                      {m.status === 'COMPLETED' ? `${m.score_home} - ${m.score_away}` : '-'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button onClick={() => openMatchModal(m)} className="btn btn-sm btn-outline" title="Éditer le score">
                          <Edit3 size={14} />
                        </button>
                        <button onClick={() => handleDeleteMatch(m.id)} className="btn btn-sm btn-danger" title="Supprimer">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5 : TOURNOIS */}
      {activeTab === 'tournaments' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Tournois Inter-Écoles (ex: TOSS)</h3>
            <button onClick={() => setTournamentModalOpen(true)} className="btn btn-primary btn-sm">
              <Plus size={16} />
              <span>Créer une fiche Tournoi</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {tournaments.map((t) => (
              <div key={t.id} className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1.3rem', color: '#ffffff' }}>{t.name} ({t.edition})</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                      📍 {t.location} | 🗓️ Du {t.start_date} au {t.end_date}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => openAddResultModal(t.id)} className="btn btn-sm btn-accent">
                      <Plus size={14} />
                      <span>Ajouter un résultat de sport</span>
                    </button>
                    <button onClick={() => handleDeleteTournament(t.id)} className="btn btn-sm btn-danger">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Results inside tournament */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                  {t.results?.map((res) => (
                    <div key={res.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'rgba(0,0,0,0.25)',
                      padding: '0.65rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.88rem',
                    }}>
                      <div>
                        <strong>{res.sport} : </strong>
                        <span style={{ color: '#fbbf24' }}>{res.ranking_position}</span> ({res.team_name})
                        {res.summary && <span style={{ color: 'var(--text-dim)', marginLeft: '0.5rem' }}>- {res.summary}</span>}
                      </div>
                      <button onClick={() => handleDeleteResult(res.id)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}>
                        <X size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6 : ÉVÉNEMENTS NANCY */}
      {activeTab === 'events' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Agenda Sportif Nancéien</h3>
            <button onClick={() => setEventModalOpen(true)} className="btn btn-primary btn-sm">
              <Plus size={16} />
              <span>Ajouter un événement Nancy</span>
            </button>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Catégorie</th>
                  <th>Date & Heure</th>
                  <th>Lieu à Nancy</th>
                  <th>Tarif Étudiant</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
                  <tr key={ev.id}>
                    <td style={{ fontWeight: 700, color: '#ffffff' }}>{ev.title}</td>
                    <td><span className="badge badge-accent">{ev.category}</span></td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{ev.event_date}</td>
                    <td style={{ fontSize: '0.85rem' }}>📍 {ev.location}</td>
                    <td style={{ color: '#fb923c', fontWeight: 600 }}>{ev.price_info || 'Gratuit'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button onClick={() => handleDeleteEvent(ev.id)} className="btn btn-sm btn-danger" title="Supprimer">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL MATÉRIEL */}
      <Modal isOpen={equipmentModalOpen} onClose={() => setEquipmentModalOpen(false)} title={editingEquipment ? "Modifier l'équipement" : "Ajouter du matériel"}>
        <form onSubmit={handleSaveEquipment}>
          <div className="form-group">
            <label className="form-label">Nom du matériel *</label>
            <input type="text" required value={equipmentForm.name} onChange={(e) => setEquipmentForm({ ...equipmentForm, name: e.target.value })} className="form-input" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Catégorie *</label>
              <select value={equipmentForm.category} onChange={(e) => setEquipmentForm({ ...equipmentForm, category: e.target.value })} className="form-select">
                {['Volley-ball', 'Basket-ball', 'Football', 'Badminton', 'Tennis de Table', 'Entraînement', 'Loisirs', 'Accessoires', 'Autre'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">État</label>
              <select value={equipmentForm.condition} onChange={(e) => setEquipmentForm({ ...equipmentForm, condition: e.target.value })} className="form-select">
                <option value="Neuf">Neuf</option>
                <option value="Bon état">Bon état</option>
                <option value="Usagé">Usagé</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Quantité Totale</label>
              <input type="number" min="1" required value={equipmentForm.total_quantity} onChange={(e) => setEquipmentForm({ ...equipmentForm, total_quantity: parseInt(e.target.value, 10) })} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Quantité Disponible</label>
              <input type="number" min="0" required value={equipmentForm.available_quantity} onChange={(e) => setEquipmentForm({ ...equipmentForm, available_quantity: parseInt(e.target.value, 10) })} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Prix Rachat Perte (€)</label>
              <input type="number" min="0" value={equipmentForm.replacement_price} onChange={(e) => setEquipmentForm({ ...equipmentForm, replacement_price: parseFloat(e.target.value) })} className="form-input" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">URL Photo (optionnel)</label>
            <input type="url" placeholder="https://..." value={equipmentForm.image_url || ''} onChange={(e) => setEquipmentForm({ ...equipmentForm, image_url: e.target.value })} className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Description / Instructions</label>
            <textarea value={equipmentForm.description || ''} onChange={(e) => setEquipmentForm({ ...equipmentForm, description: e.target.value })} className="form-textarea" rows="2" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" onClick={() => setEquipmentModalOpen(false)} className="btn btn-secondary">Annuler</button>
            <button type="submit" className="btn btn-primary">Enregistrer</button>
          </div>
        </form>
      </Modal>

      {/* MODAL ÉQUIPE */}
      <Modal isOpen={teamModalOpen} onClose={() => setTeamModalOpen(false)} title={editingTeam ? "Modifier l'équipe" : "Créer une équipe TELECOM Nancy"}>
        <form onSubmit={handleSaveTeam}>
          <div className="form-group">
            <label className="form-label">Nom de l'équipe * (ex: Volley 1, Basket 1, Volley 3, Volley F)</label>
            <input type="text" required placeholder="Ex: Volley 1" value={teamForm.name} onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })} className="form-input" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Discipline Sportive *</label>
              <select value={teamForm.sport} onChange={(e) => setTeamForm({ ...teamForm, sport: e.target.value })} className="form-select">
                {['Volley-ball', 'Basket-ball', 'Football', 'Rugby', 'Handball', 'Badminton', 'Tennis de Table', 'Autre'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Catégorie *</label>
              <select value={teamForm.category} onChange={(e) => setTeamForm({ ...teamForm, category: e.target.value })} className="form-select">
                <option value="Collectif">Collectif</option>
                <option value="Individuel">Individuel</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Genre *</label>
              <select value={teamForm.gender} onChange={(e) => setTeamForm({ ...teamForm, gender: e.target.value })} className="form-select">
                <option value="Mixte">Mixte</option>
                <option value="Féminin">Féminin</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Capitaine / Contact</label>
              <input type="text" placeholder="Ex: Mathis D." value={teamForm.captain || ''} onChange={(e) => setTeamForm({ ...teamForm, captain: e.target.value })} className="form-input" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description de l'équipe</label>
            <textarea placeholder="Description, composition ou objectifs..." value={teamForm.description || ''} onChange={(e) => setTeamForm({ ...teamForm, description: e.target.value })} className="form-textarea" rows="2" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" onClick={() => setTeamModalOpen(false)} className="btn btn-secondary">Annuler</button>
            <button type="submit" className="btn btn-primary">Enregistrer l'Équipe</button>
          </div>
        </form>
      </Modal>

      {/* MODAL MATCH */}
      <Modal isOpen={matchModalOpen} onClose={() => setMatchModalOpen(false)} title={editingMatch ? "Modifier le match FFSU" : "Programmer un match FFSU"}>
        <form onSubmit={handleSaveMatch}>
          <div className="form-group">
            <label className="form-label">Associer à une équipe TELECOM Nancy (facultatif)</label>
            <select 
              value={matchForm.team_id} 
              onChange={(e) => {
                const teamId = e.target.value;
                const foundTeam = teams.find(t => String(t.id) === String(teamId));
                setMatchForm({ 
                  ...matchForm, 
                  team_id: teamId,
                  sport: foundTeam ? foundTeam.sport : matchForm.sport,
                  category: foundTeam ? foundTeam.category : matchForm.category,
                  gender: foundTeam ? foundTeam.gender : matchForm.gender,
                  team_home: foundTeam ? `TELECOM Nancy (${foundTeam.name})` : matchForm.team_home
                });
              }} 
              className="form-select"
            >
              <option value="">-- Aucune équipe associée --</option>
              {teams.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.sport} - {t.category} - {t.gender})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Équipe Domicile *</label>
              <input type="text" required value={matchForm.team_home} onChange={(e) => setMatchForm({ ...matchForm, team_home: e.target.value })} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Équipe Visiteuse *</label>
              <input type="text" required placeholder="Ex: Polytech Nancy" value={matchForm.team_away} onChange={(e) => setMatchForm({ ...matchForm, team_away: e.target.value })} className="form-input" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Sport</label>
              <select value={matchForm.sport} onChange={(e) => setMatchForm({ ...matchForm, sport: e.target.value })} className="form-select">
                {['Volley-ball', 'Basket-ball', 'Football', 'Rugby', 'Handball', 'Badminton', 'Tennis de Table'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Catégorie</label>
              <select value={matchForm.category} onChange={(e) => setMatchForm({ ...matchForm, category: e.target.value })} className="form-select">
                <option value="Collectif">Collectif</option>
                <option value="Individuel">Individuel</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Genre</label>
              <select value={matchForm.gender} onChange={(e) => setMatchForm({ ...matchForm, gender: e.target.value })} className="form-select">
                <option value="Mixte">Mixte</option>
                <option value="Féminin">Féminin</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Date & Heure (YYYY-MM-DD HH:MM)</label>
              <input type="text" required placeholder="2026-11-20 19:30" value={matchForm.match_date} onChange={(e) => setMatchForm({ ...matchForm, match_date: e.target.value })} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Gymnase / Lieu</label>
              <input type="text" required value={matchForm.location} onChange={(e) => setMatchForm({ ...matchForm, location: e.target.value })} className="form-input" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Statut</label>
              <select value={matchForm.status} onChange={(e) => setMatchForm({ ...matchForm, status: e.target.value })} className="form-select">
                <option value="UPCOMING">À venir</option>
                <option value="LIVE">En direct</option>
                <option value="COMPLETED">Terminé</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Score Domicile</label>
              <input type="number" min="0" value={matchForm.score_home} onChange={(e) => setMatchForm({ ...matchForm, score_home: e.target.value })} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Score Visiteur</label>
              <input type="number" min="0" value={matchForm.score_away} onChange={(e) => setMatchForm({ ...matchForm, score_away: e.target.value })} className="form-input" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Détails / Sets / Buteurs</label>
            <input type="text" placeholder="Ex: Victoire 25-18, 25-20" value={matchForm.details || ''} onChange={(e) => setMatchForm({ ...matchForm, details: e.target.value })} className="form-input" />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" onClick={() => setMatchModalOpen(false)} className="btn btn-secondary">Annuler</button>
            <button type="submit" className="btn btn-primary">Enregistrer le Match</button>
          </div>
        </form>
      </Modal>

      {/* MODAL TOURNOI */}
      <Modal isOpen={tournamentModalOpen} onClose={() => setTournamentModalOpen(false)} title="Créer un Tournoi">
        <form onSubmit={handleSaveTournament}>
          <div className="form-group">
            <label className="form-label">Nom du tournoi *</label>
            <input type="text" required placeholder="Ex: TOSS 2026 - CentraleSupélec" value={tournamentForm.name} onChange={(e) => setTournamentForm({ ...tournamentForm, name: e.target.value })} className="form-input" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Édition</label>
              <input type="text" placeholder="36ème Édition" value={tournamentForm.edition} onChange={(e) => setTournamentForm({ ...tournamentForm, edition: e.target.value })} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Lieu</label>
              <input type="text" placeholder="Gif-sur-Yvette" value={tournamentForm.location} onChange={(e) => setTournamentForm({ ...tournamentForm, location: e.target.value })} className="form-input" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Date Début</label>
              <input type="date" required value={tournamentForm.start_date} onChange={(e) => setTournamentForm({ ...tournamentForm, start_date: e.target.value })} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Date Fin</label>
              <input type="date" required value={tournamentForm.end_date} onChange={(e) => setTournamentForm({ ...tournamentForm, end_date: e.target.value })} className="form-input" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Classement Général de TELECOM Nancy</label>
            <input type="text" placeholder="Ex: 4ème école / 48" value={tournamentForm.overall_ranking} onChange={(e) => setTournamentForm({ ...tournamentForm, overall_ranking: e.target.value })} className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Description du tournoi</label>
            <textarea placeholder="Le plus grand tournoi omnisports..." value={tournamentForm.description} onChange={(e) => setTournamentForm({ ...tournamentForm, description: e.target.value })} className="form-textarea" rows="2" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" onClick={() => setTournamentModalOpen(false)} className="btn btn-secondary">Annuler</button>
            <button type="submit" className="btn btn-primary">Créer le Tournoi</button>
          </div>
        </form>
      </Modal>

      {/* MODAL RÉSULTAT TOURNOI */}
      <Modal isOpen={resultModalOpen} onClose={() => setResultModalOpen(false)} title="Ajouter un résultat de sport au tournoi">
        <form onSubmit={handleSaveResult}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Sport *</label>
              <input type="text" required placeholder="Ex: Volley-ball Féminin" value={resultForm.sport} onChange={(e) => setResultForm({ ...resultForm, sport: e.target.value })} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Équipe</label>
              <input type="text" required placeholder="TELECOM Nancy (Volley F)" value={resultForm.team_name} onChange={(e) => setResultForm({ ...resultForm, team_name: e.target.value })} className="form-input" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Rang / Titre *</label>
              <input type="text" required placeholder="Ex: Médaille de Bronze (3ème place)" value={resultForm.ranking_position} onChange={(e) => setResultForm({ ...resultForm, ranking_position: e.target.value })} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Médaille</label>
              <select value={resultForm.medal} onChange={(e) => setResultForm({ ...resultForm, medal: e.target.value })} className="form-select">
                <option value="GOLD">🥇 Or (Champion)</option>
                <option value="SILVER">🥈 Argent (Finaliste)</option>
                <option value="BRONZE">🥉 Bronze (3ème)</option>
                <option value="NONE">Aucune médaille (Place d'honneur)</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Résumé de l'exploit / Match</label>
            <textarea placeholder="Victoire haletante 2-1 au tie-break..." value={resultForm.summary} onChange={(e) => setResultForm({ ...resultForm, summary: e.target.value })} className="form-textarea" rows="2" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" onClick={() => setResultModalOpen(false)} className="btn btn-secondary">Annuler</button>
            <button type="submit" className="btn btn-primary">Ajouter le Résultat</button>
          </div>
        </form>
      </Modal>

      {/* MODAL ÉVÉNEMENT NANCY */}
      <Modal isOpen={eventModalOpen} onClose={() => setEventModalOpen(false)} title="Ajouter un événement sportif à Nancy">
        <form onSubmit={handleSaveEvent}>
          <div className="form-group">
            <label className="form-label">Nom de l'événement *</label>
            <input type="text" required placeholder="Ex: Blablarun Nancy 2026" value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} className="form-input" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Catégorie</label>
              <select value={eventForm.category} onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })} className="form-select">
                <option value="Course solidaire & conviviale">Course solidaire & conviviale</option>
                <option value="Fête étudiante & Relais de chars">Fête étudiante & Relais de chars</option>
                <option value="Tournoi nocturne étudiant">Tournoi nocturne étudiant</option>
                <option value="Course sur route FFA">Course sur route FFA</option>
                <option value="Raid multisport nature">Raid multisport nature</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Date & Heure *</label>
              <input type="text" required placeholder="2026-11-15 10:00" value={eventForm.event_date} onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })} className="form-input" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Lieu à Nancy *</label>
              <input type="text" required placeholder="Ex: Parc de la Pépinière, Nancy" value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Tarif Étudiant / Réduction</label>
              <input type="text" placeholder="Ex: 5€ adhérents BDS" value={eventForm.price_info} onChange={(e) => setEventForm({ ...eventForm, price_info: e.target.value })} className="form-input" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Lien d'inscription ou d'information</label>
            <input type="url" placeholder="https://..." value={eventForm.registration_link} onChange={(e) => setEventForm({ ...eventForm, registration_link: e.target.value })} className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea placeholder="Détails de la course, parcours..." value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} className="form-textarea" rows="2" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" onClick={() => setEventModalOpen(false)} className="btn btn-secondary">Annuler</button>
            <button type="submit" className="btn btn-primary">Ajouter l'événement</button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
