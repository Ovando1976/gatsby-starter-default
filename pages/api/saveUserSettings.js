// pages/api/saveUserSettings.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' })
    }
  
    // Parse the incoming settings from the request body
    const { name, email, password, darkMode, notifications } = req.body
  
    // TODO: Validate input, authenticate user, etc.
  
    // Example: do something with these settings:
    console.log('Saving user settings:', {
      name,
      email,
      passwordMasked: password ? '******' : null,
      darkMode,
      notifications,
    })
  
    // For now, just return success
    return res.status(200).json({ message: 'Settings saved successfully!' })
  }