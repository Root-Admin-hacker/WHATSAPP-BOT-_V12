#!/usr/bin/env node

/**
 * Startup Test - Verifies bot loads without critical errors
 */

const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

console.log(chalk.cyan('\n🧪 Bot Startup Test\n'));

const tests = [];
let passCount = 0;
let failCount = 0;

// Test 1: Verify essential files exist
try {
  const files = ['./settings.js', './main.js', './config.js', './lib/errorFormatter.js', './data/owner.json'];
  files.forEach(f => {
    if (!fs.existsSync(f)) throw new Error(`Missing: ${f}`);
  });
  console.log(chalk.green('✓ All essential files present'));
  passCount++;
} catch (e) {
  console.log(chalk.red(`✗ File check failed: ${e.message}`));
  failCount++;
}

// Test 2: Verify settings load
try {
  const settings = require('./settings');
  if (!settings.ownerNumber) throw new Error('ownerNumber missing');
  console.log(chalk.green(`✓ Settings loaded (owner: ${settings.ownerNumber})`));
  passCount++;
} catch (e) {
  console.log(chalk.red(`✗ Settings error: ${e.message}`));
  failCount++;
}

// Test 3: Verify error formatter loads
try {
  const { sanitizeError, getUserFriendlyMessage, logError } = require('./lib/errorFormatter');
  if (typeof sanitizeError !== 'function') throw new Error('sanitizeError not exported');
  console.log(chalk.green('✓ Error formatter utility loaded'));
  passCount++;
} catch (e) {
  console.log(chalk.red(`✗ Error formatter error: ${e.message}`));
  failCount++;
}

// Test 4: Verify owner data loads
try {
  const owner = JSON.parse(fs.readFileSync('./data/owner.json', 'utf8'));
  if (!Array.isArray(owner) || owner.length === 0) throw new Error('Invalid owner data');
  console.log(chalk.green(`✓ Owner data loaded (${owner.length} entries)`));
  passCount++;
} catch (e) {
  console.log(chalk.red(`✗ Owner data error: ${e.message}`));
  failCount++;
}

// Test 5: Verify command files syntax
try {
  const commandDir = './commands';
  const files = fs.readdirSync(commandDir).filter(f => f.endsWith('.js'));
  let validCount = 0;
  files.forEach(f => {
    try {
      require(`${commandDir}/${f}`);
      validCount++;
    } catch (e) {
      console.log(chalk.yellow(`  ⚠ ${f}: ${e.message}`));
    }
  });
  if (validCount > files.length * 0.8) {
    console.log(chalk.green(`✓ ${validCount}/${files.length} commands loadable`));
    passCount++;
  } else {
    console.log(chalk.red(`✗ Too many broken commands: ${validCount}/${files.length}`));
    failCount++;
  }
} catch (e) {
  console.log(chalk.red(`✗ Command check error: ${e.message}`));
  failCount++;
}

// Test 6: Validate package.json
try {
  const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  if (!pkg.name || !pkg.version) throw new Error('Invalid package.json');
  if (pkg.name !== 'whatsapp-bot-v12') throw new Error('Package name should be whatsapp-bot-v12');
  console.log(chalk.green(`✓ package.json valid (${pkg.name}@${pkg.version})`));
  passCount++;
} catch (e) {
  console.log(chalk.red(`✗ package.json error: ${e.message}`));
  failCount++;
}

// Summary
console.log(chalk.cyan('\n' + '='.repeat(50)));
console.log(chalk.greenBright(`\n✅ Tests Passed: ${passCount}`));
if (failCount > 0) {
  console.log(chalk.redBright(`❌ Tests Failed: ${failCount}`));
}

if (failCount === 0) {
  console.log(chalk.green('\n🚀 Bot is ready to start!'));
  console.log(chalk.cyan('\nNext steps:'));
  console.log('  1. Run: node index.js');
  console.log('  2. Open pairing interface at http://localhost:3000');
  console.log('  3. Enter your WhatsApp phone number');
  process.exit(0);
} else {
  console.log(chalk.red('\n⚠️  Fix the above errors before starting the bot.'));
  process.exit(1);
}
