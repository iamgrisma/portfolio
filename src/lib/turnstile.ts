export async function verifyTurnstile(token: string, secretKey: string): Promise<boolean> {
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(token)}`,
    });
    
    const data = await res.json() as { success: boolean; 'error-codes': string[] };
    
    if (!data.success) {
      console.warn('Turnstile verification failed:', data['error-codes']);
    }
    
    return data.success;
  } catch (error) {
    console.error('Turnstile verification request failed:', error);
    return false;
  }
}
