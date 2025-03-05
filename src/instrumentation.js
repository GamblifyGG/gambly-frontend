export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await require('@gambly/logger');
    await require('next-logger');
  }
}
