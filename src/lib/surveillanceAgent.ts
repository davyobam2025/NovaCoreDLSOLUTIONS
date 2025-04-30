export async function analyseLog(log: any) {
    const alerts: string[] = []
  
    // ❗ Suppression critique
    if (log.action.toLowerCase().includes('supprimé')) {
      alerts.push(`Action critique : suppression de ${log.cible_type}`)
    }
  
    // ⚠️ Paiement sans reservation
    if (log.cible_type === 'paiement' && !log.details?.reservation_id) {
      alerts.push(`Paiement sans réservation associée détecté.`)
    }
  
    // 🔄 Trop d'actions par user
    const recent = await fetch(`/api/logs/user/${log.user_id}/recent`) // ou Supabase RPC
    if ((recent.length || 0) > 5) {
      alerts.push(`Utilisateur ${log.user_id} a effectué +5 actions en moins d'une minute.`)
    }
  
    // → si alertes, notifier admin
    if (alerts.length > 0) {
      await fetch('/api/surveillance/notify', {
        method: 'POST',
        body: JSON.stringify({
          alerts,
          user_id: log.user_id,
          timestamp: log.created_at
        })
      })
    }
  }
  