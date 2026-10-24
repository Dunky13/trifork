const { spawnSync } = require('node:child_process');
const commands = { build: 'build', serve: 'start', test: 'test', lint: 'lint', e2e: 'e2e' };
const command = commands[process.argv[2]];
if (!command) {
  console.error('Supported commands: build, serve, test, lint, e2e');
  process.exitCode = 1;
} else {
  const result = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm',
    ['run', command, '--', ...process.argv.slice(3)], { stdio: 'inherit' });
  if (result.error) throw result.error;
  process.exitCode = result.status === null ? 1 : result.status;
}
