import emailjs from '@emailjs/browser'

export async function sendContractMail(toEmail: string, toName: string, code: string, pdfUrl: string) {
  const params = {
    to_email: toEmail,
    to_name: toName,
    contrat_code: code,
    contrat_url: pdfUrl
  }

  await emailjs.send(
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
    process.env.NEXT_PUBLIC_EMAILJS_CONTRACT_TEMPLATE_ID!,
    params,
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
  )
}
