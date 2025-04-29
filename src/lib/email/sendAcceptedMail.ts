import emailjs from '@emailjs/browser'

export async function sendAcceptedMail(candidateEmail: string, candidateName: string) {
  const params = {
    to_name: candidateName,
    to_email: candidateEmail,
  }

  await emailjs.send(
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
    params,
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
  )
}
