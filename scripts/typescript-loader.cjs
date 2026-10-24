const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const sass = require('sass');

module.exports = function load(source) {
  const file = ts.createSourceFile(this.resourcePath, source, ts.ScriptTarget.Latest, true);
  const edits = [];
  const resource = name => {
    const resolved = path.resolve(path.dirname(this.resourcePath), name);
    this.addDependency(resolved);
    return resolved.endsWith('.scss')
      ? sass.compile(resolved, { loadPaths: [process.cwd(), 'node_modules'] }).css
      : fs.readFileSync(resolved, 'utf8');
  };
  function visit(node) {
    if (node.kind === ts.SyntaxKind.PropertyAssignment) {
      const name = node.name.getText(file);
      const value = node.initializer;
      if (name === 'templateUrl' && value.kind === ts.SyntaxKind.StringLiteral) {
        edits.push({ start: node.getStart(file), end: node.end,
          text: `template: ${JSON.stringify(resource(value.text))}` });
      }
      if (name === 'styleUrls' && value.kind === ts.SyntaxKind.ArrayLiteralExpression) {
        const styles = value.elements.map(element => {
          if (element.kind !== ts.SyntaxKind.StringLiteral) {
            throw new Error('Component style URLs must be string literals');
          }
          return resource(element.text);
        });
        edits.push({ start: node.getStart(file), end: node.end,
          text: `styles: ${JSON.stringify(styles)}` });
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(file);
  for (const edit of edits.sort((a, b) => b.start - a.start)) {
    source = source.slice(0, edit.start) + edit.text + source.slice(edit.end);
  }
  return ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES5, module: ts.ModuleKind.ES2015,
      experimentalDecorators: true, emitDecoratorMetadata: true },
    fileName: this.resourcePath,
  }).outputText;
};
