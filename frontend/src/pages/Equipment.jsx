import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, Search, CheckCircle, Clock, AlertTriangle, 
  Send, Calendar, User, Mail, Phone, Info, Eye
} from 'lucide-react';
import { api } from '../api/client';
import { Modal } from '../components/Modal';

export function Equipment({ showToast }) {
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);

  // Modal d'emprunt
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [loanModalOpen, setLoanModalOpen] = useState(false);
  const [loanForm, setLoanForm] = useState({
    user_name: '',
    user_email: '',
    user_phone: '',
    quantity: 1,
    loan_date: new Date().toISOString().split('T')[0],
    expected_return_date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Suivi des demandes personnelles
  const [myLoansOpen, setMyLoansOpen] = useState(false);
  const [myEmail, setMyEmail] = useState('');
  const [myLoans, setMyLoans] = useState([]);
  const [searchingMyLoans, setSearchingMyLoans] = useState(false);

  const categories = [
    'Tous',
    'Volley-ball',
    'Basket-ball',
    'Football',
    'Badminton',
    'Tennis de Table',
    'Entraînement',
    'Loisirs',
    'Accessoires',
  ];

  const fetchEquipment = () => {
    setLoading(true);
    api.equipment.list({
      category: selectedCategory,
      search: searchTerm,
      available_only: availableOnly,
    })
      .then((data) => setEquipmentList(data))
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEquipment();
  }, [selectedCategory, availableOnly]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEquipment();
  };

  const openLoanModal = (item) => {
    setSelectedEquipment(item);
    setLoanForm({
      user_name: '',
      user_email: '',
      user_phone: '',
      quantity: 1,
      loan_date: new Date().toISOString().split('T')[0],
      expected_return_date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      notes: '',
    });
    setLoanModalOpen(true);
  };

  const handleLoanSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEquipment) return;

    if (!loanForm.user_email.trim().toLowerCase().endsWith('@telecomnancy.net')) {
      showToast('Adresse email invalide : vous devez utiliser votre adresse @telecomnancy.net', 'error');
      return;
    }

    if (loanForm.quantity > selectedEquipment.available_quantity) {
      showToast(`Quantité max disponible : ${selectedEquipment.available_quantity}`, 'error');
      return;
    }

    try {
      setSubmitting(true);
      await api.equipment.requestLoan({
        equipment_id: selectedEquipment.id,
        user_name: loanForm.user_name,
        user_email: loanForm.user_email,
        user_phone: loanForm.user_phone,
        quantity: parseInt(loanForm.quantity, 10),
        loan_date: loanForm.loan_date,
        expected_return_date: loanForm.expected_return_date,
        notes: loanForm.notes,
      });

      showToast('Demande envoyée ! Le bureau BDS va la valider.', 'success');
      setLoanModalOpen(false);
      fetchEquipment();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const executeSearchLoans = async (emailToSearch) => {
    if (!emailToSearch || !emailToSearch.trim()) return;
    try {
      setSearchingMyLoans(true);
      const res = await api.equipment.getMyLoans(emailToSearch.trim());
      setMyLoans(res);
      if (res.length === 0) {
        showToast('Aucun emprunt trouvé pour cet email', 'info');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSearchingMyLoans(false);
    }
  };

  const handleSearchMyLoans = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    executeSearchLoans(myEmail);
  };

  useEffect(() => {
    const rawSearch = window.location.search || (window.location.hash.includes('?') ? '?' + window.location.hash.split('?')[1] : '');
    const params = new URLSearchParams(rawSearch);
    const emailParam = params.get('email');
    if (emailParam) {
      setMyEmail(emailParam);
      setMyLoansOpen(true);
      executeSearchLoans(emailParam);
    }
  }, []);

  const statusMap = {
    PENDING: { label: 'En attente validation', color: 'badge-warning', icon: Clock },
    APPROVED: { label: 'Validé / À récupérer', color: 'badge-success', icon: CheckCircle },
    RETURNED: { label: 'Rendu', color: 'badge-neutral', icon: CheckCircle },
    REJECTED: { label: 'Refusé', color: 'badge-danger', icon: AlertTriangle },
    LATE: { label: 'En retard', color: 'badge-danger', icon: AlertTriangle },
  };

  return (
    <div className="container">
      {/* Page Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
        marginBottom: '2.5rem',
      }}>
        <div>
          <div className="badge badge-primary" style={{ marginBottom: '0.6rem' }}>
            <Dumbbell size={14} />
            <span>Service Étudiant BDS</span>
          </div>
          <h1 style={{ fontSize: '2.4rem' }}>Emprunts de Matériel Sportif</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.3rem' }}>
            Réserve ballons, chasubles, raquettes et accessoires pour tes entraînements et événements
          </p>
        </div>

        <button 
          onClick={() => setMyLoansOpen(true)}
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Eye size={17} />
          <span>Suivre mes demandes d'emprunt</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
        <form onSubmit={handleSearchSubmit} style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          marginBottom: '1rem',
        }}>
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search 
              size={18} 
              color="var(--text-dim)" 
              style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} 
            />
            <input
              type="text"
              placeholder="Rechercher un ballon, une raquette, chasubles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.8rem' }}
            />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
            />
            <span>Disponibles en stock uniquement</span>
          </label>

          <button type="submit" className="btn btn-primary btn-sm">
            Filtrer
          </button>
        </form>

        {/* Categories Tabs */}
        <div className="filter-bar" style={{ marginBottom: 0 }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`filter-tab ${selectedCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Equipment Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          Chargement du matériel disponible...
        </div>
      ) : equipmentList.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Aucun matériel ne correspond à vos critères.</p>
          <button 
            onClick={() => { setSelectedCategory('Tous'); setSearchTerm(''); setAvailableOnly(false); }}
            className="btn btn-secondary btn-sm"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid-cards">
          {equipmentList.map((item) => {
            const isAvailable = item.available_quantity > 0;
            return (
              <div key={item.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                {/* Image */}
                <div style={{
                  height: '180px',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  position: 'relative',
                  marginBottom: '1.25rem',
                  background: 'var(--bg-surface-elevated)',
                }}>
                  <img
                    src={item.image_url || 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=600&auto=format&fit=crop&q=80'}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                    <span className={`badge ${isAvailable ? 'badge-success' : 'badge-danger'}`}>
                      {isAvailable ? `${item.available_quantity} dispo / ${item.total_quantity}` : 'Épuisé'}
                    </span>
                  </div>
                  <div style={{ position: 'absolute', bottom: '10px', left: '10px' }}>
                    <span className="badge badge-neutral" style={{ background: 'rgba(0,0,0,0.65)' }}>
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{item.name}</h3>
                <p style={{ 
                  color: 'var(--text-muted)', 
                  fontSize: '0.88rem', 
                  lineHeight: 1.5,
                  marginBottom: '1rem',
                  flex: 1,
                }}>
                  {item.description || 'Matériel certifié disponible au local BDS.'}
                </p>

                {/* Meta properties */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  background: 'rgba(0,0,0,0.2)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  marginBottom: '1.25rem',
                }}>
                  <div>
                    <span style={{ color: 'var(--text-dim)' }}>État : </span>
                    <strong style={{ color: '#ffffff' }}>{item.condition}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-dim)' }}>Rachat si perte : </span>
                    <strong style={{ color: item.replacement_price > 0 ? '#fbbf24' : '#34d399' }}>
                      {item.replacement_price > 0 ? `${item.replacement_price} €` : '0 €'}
                    </strong>
                  </div>
                </div>

                {/* Action button */}
                <button
                  onClick={() => openLoanModal(item)}
                  disabled={!isAvailable}
                  className={`btn ${isAvailable ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ width: '100%', opacity: isAvailable ? 1 : 0.6 }}
                >
                  <Send size={16} />
                  <span>{isAvailable ? "Demander l'emprunt" : 'Actuellement indisponible'}</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Demande d'Emprunt */}
      <Modal
        isOpen={loanModalOpen}
        onClose={() => setLoanModalOpen(false)}
        title={`Demande d'emprunt : ${selectedEquipment?.name || ''}`}
      >
        {selectedEquipment && (
          <form onSubmit={handleLoanSubmit}>
            <div style={{
              background: 'rgba(37, 99, 235, 0.1)',
              border: '1px solid rgba(37, 99, 235, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '0.9rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.9rem',
            }}>
              <div>
                <span>Stock disponible : </span>
                <strong style={{ color: '#60a5fa' }}>{selectedEquipment.available_quantity} exemplaire(s)</strong>
              </div>
              <div>
                <span>Prix rachat si perte : </span>
                <strong style={{ color: '#fbbf24' }}>
                  {selectedEquipment.replacement_price > 0 ? `${selectedEquipment.replacement_price} €` : '0 €'}
                </strong>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Nom et Prénom de l'étudiant *</label>
              <input
                type="text"
                required
                placeholder="Ex: Antoine Dupont"
                value={loanForm.user_name}
                onChange={(e) => setLoanForm({ ...loanForm, user_name: e.target.value })}
                className="form-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Email Étudiant (@telecomnancy.net) *</label>
                <input
                  type="email"
                  required
                  placeholder="prenom.nom@telecomnancy.net"
                  value={loanForm.user_email}
                  onChange={(e) => setLoanForm({ ...loanForm, user_email: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Numéro de Téléphone *</label>
                <input
                  type="tel"
                  required
                  placeholder="06 12 34 56 78"
                  value={loanForm.user_phone}
                  onChange={(e) => setLoanForm({ ...loanForm, user_phone: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Quantité *</label>
                <input
                  type="number"
                  min="1"
                  max={selectedEquipment.available_quantity}
                  required
                  value={loanForm.quantity}
                  onChange={(e) => setLoanForm({ ...loanForm, quantity: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date d'emprunt *</label>
                <input
                  type="date"
                  required
                  value={loanForm.loan_date}
                  onChange={(e) => setLoanForm({ ...loanForm, loan_date: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date retour estimée *</label>
                <input
                  type="date"
                  required
                  value={loanForm.expected_return_date}
                  onChange={(e) => setLoanForm({ ...loanForm, expected_return_date: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Motif de l'emprunt (facultatif)</label>
              <textarea
                placeholder="Ex: Entraînement de volley jeudi soir au gymnase SUAPS, tournoi inter-promos..."
                value={loanForm.notes}
                onChange={(e) => setLoanForm({ ...loanForm, notes: e.target.value })}
                className="form-textarea"
                rows="2"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={() => setLoanModalOpen(false)}
                className="btn btn-secondary"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
              >
                <Send size={16} />
                <span>{submitting ? 'Envoi...' : "Confirmer la demande d'emprunt"}</span>
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Modal Suivi des demandes personnelles */}
      <Modal
        isOpen={myLoansOpen}
        onClose={() => setMyLoansOpen(false)}
        title="Mes demandes d'emprunt"
        maxWidth="680px"
      >
        <form onSubmit={handleSearchMyLoans} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <input
            type="email"
            required
            placeholder="Saisis ton adresse prenom.nom@telecomnancy.net..."
            value={myEmail}
            onChange={(e) => setMyEmail(e.target.value)}
            className="form-input"
            style={{ flex: 1 }}
          />
          <button type="submit" disabled={searchingMyLoans} className="btn btn-primary">
            {searchingMyLoans ? 'Recherche...' : 'Consulter'}
          </button>
        </form>

        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {myLoans.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '2rem 0' }}>
              Tape ton adresse email ci-dessus pour afficher l'historique et le statut de tes réservations.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {myLoans.map((loan) => {
                const statusInfo = statusMap[loan.status] || statusMap.PENDING;
                const StatusIcon = statusInfo.icon;
                return (
                  <div key={loan.id} style={{
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.1rem',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                      <strong style={{ fontSize: '1.05rem', color: '#ffffff' }}>
                        {loan.equipment?.name || 'Matériel'} ({loan.quantity}x)
                      </strong>
                      <span className={`badge ${statusInfo.color}`}>
                        <StatusIcon size={12} />
                        <span>{statusInfo.label}</span>
                      </span>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: '1.5rem', marginBottom: '0.5rem' }}>
                      <span>Emprunt : {loan.loan_date}</span>
                      <span>Retour prévu : {loan.expected_return_date}</span>
                    </div>

                    {(() => {
                      const isReturned = loan.status === 'RETURNED';
                      const isRejected = loan.status === 'REJECTED';
                      const noteText = isReturned && (!loan.admin_notes || loan.admin_notes.includes('récupérer au local') || loan.admin_notes.includes('Validé par le BDS'))
                        ? 'Matériel bien restitué au BDS, tout est bon !'
                        : loan.admin_notes;

                      if (!noteText) return null;

                      return (
                        <div style={{
                          marginTop: '0.6rem',
                          padding: '0.55rem 0.85rem',
                          background: isReturned ? 'rgba(16, 185, 129, 0.12)' : isRejected ? 'rgba(239, 68, 68, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                          borderLeft: isReturned ? '3px solid #10b981' : isRejected ? '3px solid #ef4444' : '3px solid #f59e0b',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.85rem',
                          color: isReturned ? '#34d399' : isRejected ? '#f87171' : '#fbbf24',
                          fontWeight: 500,
                        }}>
                          <strong>Message du BDS : </strong> {noteText}
                        </div>
                      );
                    })()}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
