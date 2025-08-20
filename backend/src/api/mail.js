import { Router } from 'express'
import { sendGreetingEmail } from '../services/mail.service.js'

const router = Router()

router.post('/greeting', async (req, res) => {
  try {
    const { email, name } = req.body || {}
    if (!email) return res.status(400).json({ error: 'email required' })
    await sendGreetingEmail({ to: email, name })
    res.json({ success: true })
  } catch (e) {
    console.error('Error sending greeting email', e)
    res.status(500).json({ error: 'internal_error' })
  }
})

export default router
