const express = require('express');
const path = require('node:path');
const app = express();
const root = path.resolve('dist');
app.use(express.static(root));
app.use((request, response, next) => {
  const navigation = request.method === 'GET' && request.accepts('html')
    && !path.extname(request.path)
    && !request.path.split('/').some(segment => segment.startsWith('.'));
  if (navigation) response.sendFile('index.html', { root });
  else next();
});
app.listen(4200, '0.0.0.0', () => console.log('Static test server listening on port 4200'));
