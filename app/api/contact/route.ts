import { NextResponse } from 'next/server'
import { getRedis } from '@/lib/redis'

type ContactPayload = {
  name?: string
  email?: string
  preferredContact?: 'email' | 'whatsapp'
  whatsappNumber?: string
  website?: string
  instagram?: string
  eventDate?: string
  message?: string
}

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
const MAX_NAME_LENGTH = 100
const MAX_EMAIL_LENGTH = 254
const MAX_PHONE_LENGTH = 30
const MAX_INSTAGRAM_LENGTH = 120
const MAX_MESSAGE_LENGTH = 2000

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
const normalizeSuspiciousLinks = (value: string) =>
  value.replace(/https?:\/\//gi, 'hxxps://').replace(/\./g, '[.]')

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

  const origin = request.headers.get('origin')
  const host = request.headers.get('host')
  if (origin && host) {
    try {
      const originHost = new URL(origin).host
      if (originHost !== host) {
        return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
      }
    } catch {
      return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
    }
  }

  const body = (await request.json()) as ContactPayload
  const name = body.name?.trim() ?? ''
  const email = body.email?.trim() ?? ''
  const preferredContact = body.preferredContact === 'whatsapp' ? 'whatsapp' : 'email'
  const whatsappNumber = body.whatsappNumber?.trim() ?? ''
  const website = body.website?.trim() ?? ''
  const instagram = body.instagram?.trim() ?? ''
  const eventDate = body.eventDate?.trim() ?? ''
  const message = body.message?.trim() ?? ''

  // Honeypot trap: silently reject obvious bot submissions
  if (website) {
    return NextResponse.json({ ok: true })
  }

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: 'Please fill in your name, email, and message.' },
      { status: 400 },
    )
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  if (
    name.length > MAX_NAME_LENGTH ||
    email.length > MAX_EMAIL_LENGTH ||
    whatsappNumber.length > MAX_PHONE_LENGTH ||
    instagram.length > MAX_INSTAGRAM_LENGTH ||
    message.length > MAX_MESSAGE_LENGTH
  ) {
    return NextResponse.json({ error: 'One or more fields are too long.' }, { status: 400 })
  }

  // Rate limit: 5 submissions / 15 min per IP
  const forwardedFor = request.headers.get('x-forwarded-for') ?? ''
  const clientIp = forwardedFor.split(',')[0]?.trim() || 'unknown'
  try {
    const redis = getRedis()
    const rateKey = `contact:rate:${clientIp}`
    const hits = await redis.incr(rateKey)
    if (hits === 1) {
      await redis.expire(rateKey, 60 * 15)
    }
    if (hits > 5) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again in a few minutes.' },
        { status: 429 },
      )
    }
  } catch (error) {
    console.warn('Rate limiter unavailable, continuing without Redis limit:', error)
  }

  const safeMessage = normalizeSuspiciousLinks(message)

  if (preferredContact === 'whatsapp' && !whatsappNumber) {
    return NextResponse.json(
      { error: 'Please provide your WhatsApp number if you prefer WhatsApp contact.' },
      { status: 400 },
    )
  }

  const emailBodyHtml = `
    <div style="margin:0;padding:24px;background:#f0f2ec;font-family:'DM Sans',Arial,sans-serif;color:#252b24;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px;margin:0 auto;background:#fdfdf9;border:1px solid #dde2d8;border-radius:18px;overflow:hidden;">
        <tr>
          <td style="padding:22px 24px;background:#252b24;color:#fdfdf9;">
            <p style="margin:0 0 6px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;opacity:.8;">Invyo</p>
            <h1 style="margin:0;font-size:22px;line-height:1.25;font-weight:800;">New contact form submission</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:22px 24px;">
            <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#5c6558;">
              A new lead has submitted the website contact form.
            </p>

            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
              <tr>
                <td style="padding:10px 0;border-top:1px solid #dde2d8;font-size:13px;color:#5c6558;width:42%;">Name</td>
                <td style="padding:10px 0;border-top:1px solid #dde2d8;font-size:14px;font-weight:600;text-align:right;">${escapeHtml(name)}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-top:1px solid #dde2d8;font-size:13px;color:#5c6558;">Email</td>
                <td style="padding:10px 0;border-top:1px solid #dde2d8;font-size:14px;font-weight:600;text-align:right;">${escapeHtml(email)}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-top:1px solid #dde2d8;font-size:13px;color:#5c6558;">Preferred contact</td>
                <td style="padding:10px 0;border-top:1px solid #dde2d8;font-size:14px;font-weight:600;text-align:right;">${preferredContact === 'whatsapp' ? 'WhatsApp' : 'Email'}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-top:1px solid #dde2d8;font-size:13px;color:#5c6558;">WhatsApp number</td>
                <td style="padding:10px 0;border-top:1px solid #dde2d8;font-size:14px;font-weight:600;text-align:right;">${escapeHtml(whatsappNumber || 'Not provided')}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-top:1px solid #dde2d8;font-size:13px;color:#5c6558;">Instagram / social</td>
                <td style="padding:10px 0;border-top:1px solid #dde2d8;font-size:14px;font-weight:600;text-align:right;">${escapeHtml(instagram || 'Not provided')}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-top:1px solid #dde2d8;font-size:13px;color:#5c6558;">Event date</td>
                <td style="padding:10px 0;border-top:1px solid #dde2d8;font-size:14px;font-weight:600;text-align:right;">${escapeHtml(eventDate || 'Not provided')}</td>
              </tr>
            </table>

            <div style="margin-top:16px;padding:14px;border:1px solid #dde2d8;border-radius:12px;background:#ffffff;">
              <p style="margin:0 0 8px;font-size:13px;color:#5c6558;">Message</p>
              <p style="margin:0;font-size:14px;line-height:1.6;color:#252b24;">${escapeHtml(safeMessage).replace(/\n/g, '<br/>')}</p>
            </div>
          </td>
        </tr>
      </table>
    </div>
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
      const errorId = crypto.randomUUID()
      const errorText = await brevoResponse.text()
      let clientMessage = 'Could not send your message right now. Please try again shortly.'

      if (brevoResponse.status === 401 || brevoResponse.status === 403) {
        clientMessage = 'Email service authentication is misconfigured. Please contact support.'
      } else if (brevoResponse.status === 400) {
        clientMessage = 'Email service configuration is incomplete. Please contact support.'
      }

      console.error('Brevo send failure', {
        errorId,
        status: brevoResponse.status,
        statusText: brevoResponse.statusText,
        responseBody: errorText,
        senderEmail,
        contactToEmail,
      })
      return NextResponse.json(
        { error: clientMessage, errorId },
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
