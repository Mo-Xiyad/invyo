import { NextResponse } from 'next/server'

type ContactPayload = {
  name?: string
  email?: string
  preferredContact?: 'email' | 'whatsapp'
  whatsappNumber?: string
  instagram?: string
  eventDate?: string
  message?: string
}

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export async function POST(request: Request) {
  const apiKey = process.env.BREVO_API_KEY
  const senderEmail = process.env.BREVO_SENDER_EMAIL ?? 'support@invyo.uk'
  const senderName = process.env.BREVO_SENDER_NAME ?? 'Invyo Support'
  const contactToEmail = process.env.CONTACT_TO_EMAIL ?? 'support@invyo.uk'
  const contactToName = process.env.CONTACT_TO_NAME ?? 'Invyo Team'

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Contact form is not configured yet. Missing BREVO_API_KEY.' },
      { status: 500 },
    )
  }

  const body = (await request.json()) as ContactPayload
  const name = body.name?.trim() ?? ''
  const email = body.email?.trim() ?? ''
  const preferredContact = body.preferredContact === 'whatsapp' ? 'whatsapp' : 'email'
  const whatsappNumber = body.whatsappNumber?.trim() ?? ''
  const instagram = body.instagram?.trim() ?? ''
  const eventDate = body.eventDate?.trim() ?? ''
  const message = body.message?.trim() ?? ''

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: 'Please fill in your name, email, and message.' },
      { status: 400 },
    )
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  if (preferredContact === 'whatsapp' && !whatsappNumber) {
    return NextResponse.json(
      { error: 'Please provide your WhatsApp number if you prefer WhatsApp contact.' },
      { status: 400 },
    )
  }

  const emailBodyHtml = `
    <h2>New Invyo Contact Submission</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Preferred Contact:</strong> ${preferredContact === 'whatsapp' ? 'WhatsApp' : 'Email'}</p>
    <p><strong>WhatsApp Number:</strong> ${whatsappNumber || 'Not provided'}</p>
    <p><strong>Instagram/Social:</strong> ${instagram || 'Not provided'}</p>
    <p><strong>Event Date:</strong> ${eventDate || 'Not provided'}</p>
    <p><strong>Message:</strong></p>
    <p>${message.replace(/\n/g, '<br/>')}</p>
  `

  try {
    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email: contactToEmail, name: contactToName }],
        replyTo: { email, name },
        subject: `New contact enquiry from ${name}`,
        htmlContent: emailBodyHtml,
      }),
    })

    if (!brevoResponse.ok) {
      const errorText = await brevoResponse.text()
      console.error('Brevo send failure:', errorText)
      return NextResponse.json(
        { error: 'Could not send your message right now. Please try again shortly.' },
        { status: 502 },
      )
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      { error: 'Unexpected server error while sending your message.' },
      { status: 500 },
    )
  }
}
