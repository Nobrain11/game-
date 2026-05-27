#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎮 ASTRALIS RPG Bot - Setup Verification\n');
console.log('─'.repeat(50));

let issues = [];
let warnings = [];

// Check 1: .env file
console.log('\n1. Checking environment configuration...');
if (!fs.existsSync('.env')) {
  issues.push('❌ .env file not found');
} else {
  const envContent = fs.readFileSync('.env', 'utf8');
  if (envContent.includes('your_telegram_bot_token_here')) {
    warnings.push('⚠️  BOT_TOKEN is still a placeholder - replace with your actual token');
  } else if (!envContent.includes('BOT_TOKEN=')) {
    issues.push('❌ BOT_TOKEN not found in .env file');
  } else {
    console.log('   ✅ .env file found and configured');
  }
}

// Check 2: Dependencies
console.log('\n2. Checking dependencies...');
const packages = ['telegraf', 'better-sqlite3', 'dotenv'];
let allDepsOk = true;
for (const pkg of packages) {
  try {
    require.resolve(pkg);
    console.log(`   ✅ ${pkg} installed`);
  } catch (e) {
    issues.push(`❌ ${pkg} not installed`);
    allDepsOk = false;
  }
}

// Check 3: Main bot file
console.log('\n3. Checking bot implementation...');
if (!fs.existsSync('index.js')) {
  issues.push('❌ index.js (main bot file) not found');
} else {
  const botContent = fs.readFileSync('index.js', 'utf8');
  const hasConstants = botContent.includes('const CLASSES') && botContent.includes('const MISSIONS');
  const hasHandlers = botContent.includes('bot.command');
  
  if (hasConstants && hasHandlers) {
    console.log('   ✅ Bot implementation looks complete');
  } else {
    warnings.push('⚠️  Bot implementation may be incomplete');
  }
}

// Check 4: Database structure (will be created on first run)
console.log('\n4. Database initialization...');
if (fs.existsSync('astralis.db')) {
  const stats = fs.statSync('astralis.db');
  console.log(`   ✅ Database file exists (${stats.size} bytes)`);
} else {
  console.log('   ℹ️  Database will be created on first bot run');
}

// Check 5: Documentation
console.log('\n5. Checking documentation...');
if (fs.existsSync('README.md')) {
  console.log('   ✅ README.md found');
}
if (fs.existsSync('SETUP.md')) {
  console.log('   ✅ SETUP.md found');
}

// Summary
console.log('\n' + '─'.repeat(50));
console.log('\n📋 Summary:\n');

if (issues.length === 0 && warnings.length === 0) {
  console.log('✅ All checks passed! Your bot is ready to run.\n');
  console.log('Next steps:');
  console.log('  1. Update BOT_TOKEN in .env with your token from BotFather');
  console.log('  2. Run: npm start');
  console.log('  3. Open Telegram and send /start to your bot\n');
} else {
  if (warnings.length > 0) {
    console.log('Warnings:');
    warnings.forEach(w => console.log(`  ${w}`));
    console.log();
  }
  
  if (issues.length > 0) {
    console.log('Issues to fix:');
    issues.forEach(i => console.log(`  ${i}`));
    console.log();
    console.log('Run "npm install" to fix missing dependencies.\n');
  }
}
