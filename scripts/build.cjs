const webpack = require('webpack');
const config = require('../webpack.config.cjs')({}, { mode: 'production' });
const compiler = webpack(config);
compiler.run((error, stats) => {
  compiler.close(closeError => {
    if (error || closeError) {
      console.error(error || closeError);
      process.exitCode = 1;
      return;
    }
    console.log(stats.toString({ colors: false, modules: false, children: false }));
    if (stats.hasErrors()) process.exitCode = 1;
  });
});
