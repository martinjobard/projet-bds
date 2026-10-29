#!/bin/bash
set -e

# Obtenir le chemin absolu du dossier racine du projet
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Démarrage de BDS TELECOM Nancy..."

# Nettoyage préventif des ports si un ancien processus tourne encore
echo "🧹 Vérification et libération des ports 8000 et 5173..."
fuser -k 8000/tcp 2>/dev/null || true
fuser -k 5173/tcp 2>/dev/null || true
sleep 1

# 1. Démarrer le backend FastAPI
echo "📦 Lancement de l'API FastAPI (Port 8000)..."
cd "$PROJECT_ROOT/backend"
if [ ! -d "venv" ]; then
    echo "⚠️ Environnement virtuel introuvable. Création de venv..."
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
else
    source venv/bin/activate
fi
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

# Attendre 1 seconde que le backend soit initialisé
sleep 1.5

# 2. Démarrer le frontend Vite
echo "⚡ Lancement de l'interface React Vite (Port 5173)..."
cd "$PROJECT_ROOT/frontend"
if [ ! -d "node_modules" ]; then
    echo "⚠️ Dépendances npm introuvables. Installation..."
    npm install --legacy-peer-deps
fi
npm run dev -- --host 127.0.0.1 --port 5173 &
FRONTEND_PID=$!

echo ""
echo "=========================================================="
echo "✨ BDS TELECOM Nancy est opérationnel !"
echo "👉 Site web : http://localhost:5173"
echo "👉 API & Swagger : http://localhost:8000/docs"
echo "👉 Mot de passe Bureau BDS : bds2026"
echo "=========================================================="
echo "ℹ️  Appuie sur Ctrl+C pour arrêter les serveurs."
echo ""

# Arrêt propre des serveurs à la fermeture (Ctrl+C ou fermeture du terminal)
trap "echo -e '\n🛑 Arrêt des serveurs BDS...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" SIGINT SIGTERM EXIT
wait
