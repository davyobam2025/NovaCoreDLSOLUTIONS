import emailjs from '@emailjs/browser'

export async function sendInterviewMail(email: string, name: string, date: Date, lien: string, sujet: string) {
  const params = {
    to_name: name,
    to_email: email,
    date_entretien: date.toLocaleString(),
    sujet: sujet,
    lien_entretien: lien
  }

  await emailjs.send(
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
    process.env.NEXT_PUBLIC_EMAILJS_INTERVIEW_TEMPLATE_ID!,
    params,
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
  )
}
