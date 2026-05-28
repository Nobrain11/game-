require('dotenv').config();

module.exports = {
  BOT_TOKEN: process.env.BOT_TOKEN,
  ADMIN_IDS: process.env.ADMIN_IDS ? process.env.ADMIN_IDS.split(',').map(Number) : [],
  LOG_CHANNEL_ID: process.env.LOG_CHANNEL_ID,
  DATABASE_PATH: process.env.DATABASE_PATH || './astralis.db',
  NODE_ENV: process.env.NODE_ENV || 'development',
  RPC_URL: process.env.RPC_URL || 'https://api.mainnet-beta.solana.com',
  TOKEN_MINT: process.env.TOKEN_MINT,
  BURN_ADDRESS: process.env.BURN_ADDRESS,
};
