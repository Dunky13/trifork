const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const webpack = require('webpack');

const root = path.resolve(__dirname, '..');
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'trifork-watch-'));
let watcher;
let compiler;
async function main() {
  for (const file of ['src', 'scripts', 'webpack.config.cjs', 'tsconfig.json', 'package.json']) {
    fs.cpSync(path.join(root, file), path.join(temporary, file), { recursive: true });
  }
  fs.symlinkSync(path.join(root, 'node_modules'), path.join(temporary, 'node_modules'), 'dir');
  process.chdir(temporary);
  const config = require(path.join(temporary, 'webpack.config.cjs'));
  const header = path.join(temporary, 'src/app/header/header.component.html');
  const typescript = path.join(temporary, 'src/app/header/header.component.ts');
  const scss = path.join(temporary, 'src/app/header/header.component.scss');
  const originalHtml = fs.readFileSync(header, 'utf8');
  const originalTs = fs.readFileSync(typescript, 'utf8');
  const originalScss = fs.readFileSync(scss, 'utf8');
  compiler = webpack(config({}, { mode: 'development' }));
  let step = 0;
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Watcher did not complete error recovery')), 120000);
    watcher = compiler.watch({}, (error, stats) => {
      try {
        assert.ifError(error);
        const errors = stats.compilation.errors.map(item => item.message).join('\n');
        if (step === 1 || step === 3) {
          assert.equal(stats.hasErrors(), true, 'Invalid source must fail compilation');
          assert.match(errors, step === 1 ? /not assignable to type/ : /Undefined variable/);
        } else {
          assert.equal(stats.hasErrors(), false, errors);
          const main = [...stats.compilation.assetsInfo.keys()].find(file => /^main\.[^.]+\.js$/.test(file));
          assert.ok(main, 'Development entry bundle must exist');
          const bundle = fs.readFileSync(path.join(temporary, 'dist', main), 'utf8');
          assert.ok(bundle.includes(step === 2 ? 'watch-verified' : 'game-changing'));
          if (step === 4) assert.ok(!bundle.includes('watch-verified'));
        }
        step += 1;
        // Leave the completed callback before triggering another source change.
        setImmediate(() => {
          if (step === 1) fs.writeFileSync(typescript, originalTs + '\nconst watchProbe: number = "invalid";\n');
          if (step === 2) {
            fs.writeFileSync(header, originalHtml.replace('game-changing', 'watch-verified'));
            fs.writeFileSync(typescript, originalTs);
          }
          if (step === 3) fs.writeFileSync(scss, originalScss + '\n.watch-probe { color: $missing-watch-variable; }\n');
          if (step === 4) {
            fs.writeFileSync(header, originalHtml);
            fs.writeFileSync(scss, originalScss);
          }
          if (step === 5) {
            clearTimeout(timeout);
            resolve();
          }
        });
      } catch (failure) {
        clearTimeout(timeout);
        reject(failure);
      }
    });
  });
  await new Promise((resolve, reject) => watcher.close(error => error ? reject(error) : resolve()));
  watcher = undefined;
  await new Promise((resolve, reject) => compiler.close(error => error ? reject(error) : resolve()));
  compiler = undefined;
  fs.writeFileSync(typescript, originalTs + '\nconst watchProbe: number = "invalid";\n');
  compiler = webpack(config({}, { mode: 'production' }));
  await new Promise((resolve, reject) => compiler.run(error => {
    try {
      assert.ok(error, 'Production compilation must reject invalid source');
      assert.match(error.message, /not assignable to type/);
      resolve();
    } catch (failure) { reject(failure); }
  }));
  console.log('PASS: TypeScript and Sass watcher recovery; generated output refresh; fatal production error');
}
main().catch(error => {
  console.error(error);
  process.exitCode = 1;
}).finally(async () => {
  if (watcher) await new Promise(resolve => watcher.close(resolve));
  if (compiler) await new Promise(resolve => compiler.close(resolve));
  process.chdir(root);
  fs.rmSync(temporary, { recursive: true, force: true });
});
