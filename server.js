const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/test', createProxyMiddleware({ target: 'http://localhost:4000', changeOrigin: true }));
app.use('/cmp', createProxyMiddleware({ target: 'http://localhost:5000', changeOrigin: true }));
app.use('/', createProxyMiddleware({ target: 'http://devplatform.sutech.co.jp', changeOrigin: true }));
app.listen(3000);
