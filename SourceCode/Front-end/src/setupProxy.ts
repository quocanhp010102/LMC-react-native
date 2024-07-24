import {createProxyMiddleware} from 'http-proxy-middleware';

module.exports = function (app:any) {
  app.use(
    createProxyMiddleware("/services", {
      target: "http://localhost:3000",
    })
  );
};