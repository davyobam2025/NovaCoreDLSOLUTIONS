const lancerPaiement = async () => {
    const response = await fetch('/api/paiement/rdv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        montant: rdv.montant,            // Doit venir de ton RDV
        user_email: user.email,          // Doit être récupéré via session
        rdv_id: rdv.id                   // ID du RDV Spa
      })
    })
  
    const data = await response.json()
    if (data.url) {
      window.location.href = data.url
    } else {
      alert('❌ Erreur lors de la création du paiement.')
    }
  }
  