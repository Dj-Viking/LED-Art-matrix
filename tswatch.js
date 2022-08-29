const { spawn } = require('child_process');

const ps = spawn('powershell', ["powershell -File tswatch.ps1"]);

ps.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ps.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ps.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});