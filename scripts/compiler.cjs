const fs = require('node:fs');
const path = require('node:path');
require('reflect-metadata');
const tsc = require('@angular/tsc-wrapped');
const { CodeGenerator } = require('@angular/compiler-cli/src/codegen');
const { ModuleResolutionHostAdapter } = require('@angular/compiler-cli/src/compiler_host');
const sass = require('sass');

const root = path.resolve(__dirname, '..');
const stage = path.join(root, '.build-source');
async function compile(production) {
  fs.rmSync(stage, { recursive: true, force: true });
  fs.rmSync(path.join(root, '.build'), { recursive: true, force: true });
  fs.cpSync(path.join(root, 'src'), stage, { recursive: true });
  if (production) {
    fs.copyFileSync(path.join(stage, 'environments/environment.prod.ts'),
      path.join(stage, 'environments/environment.ts'));
  }
  const config = {
    extends: '../tsconfig.json',
    compilerOptions: {
      rootDir: '..', outDir: '../.build', module: 'es2015', types: [],
    },
    angularCompilerOptions: { genDir: './.aot', skipMetadataEmit: true, alwaysCompileGeneratedCode: true },
    include: ['**/*.ts'], exclude: ['test.ts', '**/*.spec.ts', '.aot'],
  };
  fs.writeFileSync(path.join(stage, 'tsconfig.aot.json'), JSON.stringify(config));
  await tsc.main(path.join(stage, 'tsconfig.aot.json'), new tsc.NgcCliOptions({}),
    (options, cli, program, host) => {
      const context = new ModuleResolutionHostAdapter(host);
      context.readResource = file => file.endsWith('.scss')
        ? sass.compile(file, { loadPaths: [root, path.join(root, 'node_modules')] }).css
        : fs.readFileSync(file, 'utf8');
      return CodeGenerator.create(options, cli, program, host, context).codegen();
    });
}
module.exports = { compile };
