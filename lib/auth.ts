// In a real application, this would use a proper authentication system
// For a static site, we're using a simple mock authentication

export async function authenticate(username: string, password: string): Promise<boolean> {
  // For demo purposes only - in a real app, NEVER hardcode credentials
  // This is just for the static site example
  if (username === "admin" && password === "password") {
    return true
  }
  return false
}
