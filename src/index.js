Promise = require('bluebird');
const app = require('./express');
const server = require('http').createServer(app);
const mongoose = require('./mongoose');
const { syncErc20Transfer, listErc20Transfer } = require('./controller');

// open mongoose connection
mongoose.connect();

// listen to requests
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log('Server is running at port ', port);
});

app.get('/api/v1/status', (req, res) => res.send('OK'));

app.post('/api/v1/transactions/:erc20Address', syncErc20Transfer);

app.get('/api/v1/transactions/:erc20Address', listErc20Transfer);

module.exports = function (deployer) {}
