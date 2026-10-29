import React, { useState, useEffect } from 'react';
import { 
  Calendar, MapPin, Tag, ExternalLink, Ticket, 
  Users, CheckCircle, Sparkles, Filter 
} from 'lucide-react';
import { api } from '../api/client';

export function Events({ showToast }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  const categories = [
    'Tous',
    'Course solidaire & conviviale',
    'Fête étudiante & Relais de chars',
    'Tournoi nocturne étudiant',
    'Course sur route FFA',
    'Raid multisport nature'
  ];

  useEffect(() => {
    setLoading(true);
    api.events.list({
      category: selectedCategory === 'Tous' ? undefined : selectedCategory,
    })
      .then((data) => setEvents(data))
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  return (
    <div className="container">
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div className="badge badge-accent" style={{ marginBottom: '0.6rem' }}>
          <MapPin size={14} />
          <span>Agenda Sportif Nancéien</span>
        </div>
        <h1 style={{ fontSize: '2.4rem' }}>Événements & Courses à Nancy</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.3rem' }}>
          Blablarun, 24h de Stan, Nuit du Volley : participe aux grands événements sportifs avec le BDS
        </p>
      </div>

      {/* Categories Filter Bar */}
      <div className="filter-bar" style={{ marginBottom: '2rem' }}>
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

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          Chargement des événements à Nancy...
        </div>
      ) : events.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>
          <p>Aucun événement dans cette catégorie pour le moment.</p>
        </div>
      ) : (
        <div className="grid-cards">
          {events.map((event) => (
            <div key={event.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Image banner */}
              <div style={{
                height: '190px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                position: 'relative',
                marginBottom: '1.25rem',
                background: 'var(--bg-surface-elevated)',
              }}>
                <img
                  src={event.image_url || 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop&q=80'}
                  alt={event.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                  <span className="badge badge-neutral" style={{ background: 'rgba(0,0,0,0.7)', color: '#ffffff' }}>
                    {event.category}
                  </span>
                </div>
                {event.bds_participation && (
                  <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
                    <span className="badge badge-success" style={{ background: 'rgba(16, 185, 129, 0.95)', color: '#ffffff' }}>
                      Pack BDS Nancy
                    </span>
                  </div>
                )}
              </div>

              {/* Event Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                <Calendar size={14} />
                <span>{event.event_date}</span>
              </div>

              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.6rem' }}>{event.title}</h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-dim)', fontSize: '0.88rem', marginBottom: '1rem' }}>
                <MapPin size={15} color="var(--accent)" />
                <span>{event.location}</span>
              </div>

              <p style={{ 
                color: 'var(--text-muted)', 
                fontSize: '0.9rem', 
                lineHeight: 1.55, 
                marginBottom: '1.25rem',
                flex: 1,
              }}>
                {event.description}
              </p>

              {/* Pricing Box */}
              {event.price_info && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 0.9rem',
                  background: 'rgba(249, 115, 22, 0.1)',
                  border: '1px solid rgba(249, 115, 22, 0.25)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  color: '#fb923c',
                  marginBottom: '1.25rem',
                }}>
                  <Ticket size={16} />
                  <span><strong>Tarif étudiant :</strong> {event.price_info}</span>
                </div>
              )}

              {/* Action Button */}
              {event.registration_link && (
                <a
                  href={event.registration_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <span>Plus d'infos & Inscriptions</span>
                  <ExternalLink size={15} />
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
