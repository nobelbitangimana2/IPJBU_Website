import api from '../services/api'

export async function getContactInfo(liveContact) {
  return liveContact
}

export async function submitContactForm(formData) {
  const res = await api.post('/api/contact/submit', formData)
  return res.data
}
