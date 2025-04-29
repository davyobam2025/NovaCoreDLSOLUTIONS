import emailjs from '@emailjs/browser'

export async function sendOfferMail(toEmail: string, toName: string, jobTitle: string, salary: string, details: string) {
  const params = {
    to_name: toName,
    to_email: toEmail,
    job_title: jobTitle,
    salary_offer: salary,
    offer_details: details
  }

  await emailjs.send(
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
    process.env.NEXT_PUBLIC_EMAILJS_OFFER_TEMPLATE_ID!,
    params,
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
  )
}
