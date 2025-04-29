// src/components/LoginModal.jsx
import React, { useState } from 'react';

const LoginModal = ({ onClose, onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        {isRegistering ? (
          <>
            <h2>Créer un compte</h2>
            <form>
              <input type="text" placeholder="Nom complet" required />
              <input type="email" placeholder="Email" required />
              <input type="password" placeholder="Mot de passe" required />
              <button type="submit" onClick={onLogin}>S'inscrire</button>
            </form>
          </>
        ) : (
          <>
            <h2>Connexion</h2>
            <form>
              <input type="email" placeholder="Email" required />
              <input type="password" placeholder="Mot de passe" required />
              <button type="submit" onClick={onLogin}>Se connecter</button>
            </form>
          </>
        )}
        <div className="oauth-buttons">
          <button>Continuer avec Google</button>
          <button>Continuer avec Facebook</button>
        </div>
        <p onClick={() => setIsRegistering(!isRegistering)} className="toggle-form">
          {isRegistering ? "Déjà un compte ? Connectez-vous" : "Pas encore de compte ? S'inscrire"}
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
