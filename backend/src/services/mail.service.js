import nodemailer from 'nodemailer'

let transporter

function buildTransportConfig() {
  const { SMTP_SERVICE, SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = process.env
  const auth = SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined
  if (SMTP_SERVICE) return { service: SMTP_SERVICE, auth }
  if (!SMTP_HOST) throw new Error('SMTP_HOST not set (or set SMTP_SERVICE)')
  return {
    host: SMTP_HOST,
    port: SMTP_PORT ? parseInt(SMTP_PORT) : 587,
    secure: SMTP_SECURE === 'true',
    auth,
  }
}

function getTransporter() {
  if (transporter) return transporter
  transporter = nodemailer.createTransport(buildTransportConfig())
  if (process.env.SMTP_SKIP_VERIFY !== 'true') {
    transporter.verify().catch((e) => console.error('SMTP verify failed', e.message))
  }
  return transporter
}

export async function sendMail({ to, subject, text, html }) {
  const { SMTP_FROM, SMTP_USER } = process.env
  const tx = getTransporter()
  return tx.sendMail({ from: SMTP_FROM || SMTP_USER, to, subject, text, html })
}

export async function sendGreetingEmail({ to, name }) {
  const subject = 'Glad to see you in Dun 🖖🏻'
  const greetingName = name ? `Hey ${name},` : 'Heyaa,'
  const text = `${greetingName}
Thanks for signing up for Dun! Let’s get started!

Here are a few things you can do right away:

* Check out the onboarding guide → https://dun.wtf/onboarding
* Create your first project (private or public) and invite teammates
* Use topics to work and collaborate, create as many as you need
* Manage tasks in Kanban
* Install Dun to your phone’s home screen straight from the browser for quick access

Need help? Take a look at our quick start guide or just reply to this email — we’ll be there to help.

Welcome aboard,
Ksusha from Dun

Dun App: https://dun.wtf
Email: kksrm@p11.co`.replace(/\n\n+/g, '\n\n')

  const html = `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:15px;line-height:1.5;color:#111;max-width:640px;margin:0 auto;padding:16px">
  <p>${greetingName}</p>
  <p>Thanks for signing up for <strong>Dun</strong>! Let’s get started!</p>
  <p>Here are a few things you can do right away:</p>
  <ul>
    <li>Check out the onboarding guide → <a href="https://dun.wtf/onboarding">https://dun.wtf/onboarding</a></li>
    <li>Create your first project (private or public) and invite teammates</li>
    <li>Use topics to work and collaborate, create as many as you need</li>
    <li>Manage tasks in Kanban</li>
    <li>Install Dun to your phone’s home screen straight from the browser for quick access</li>
  </ul>
  <p>Need help? Take a look at our quick start guide or just reply to this email — we’ll be there to help.</p>
  <p>Welcome aboard,<br/>Ksusha from Dun</p>
  <p style="font-size:13px;color:#555">Dun App: <a href="https://dun.wtf">https://dun.wtf</a><br/>Email: <a href="mailto:kksrm@p11.co">kksrm@p11.co</a></p>
</div>`

  return sendMail({ to, subject, text, html })
}
