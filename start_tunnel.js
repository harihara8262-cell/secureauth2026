const { execSync } = require('child_process');

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTunnel() {
  while (true) {
    console.log("========================================");
    console.log("Starting localtunnel tunnel: https://secureauth2026.loca.lt");
    console.log("========================================");
    try {
      execSync('npx localtunnel --port 5000 --subdomain secureauth2026', { stdio: 'inherit' });
    } catch (error) {
      console.log("localtunnel disconnected or crashed. Auto-restarting in 3 seconds...");
    }
    await delay(3000);
  }
}

runTunnel();
