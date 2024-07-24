import { createProxyMiddleware } from "http-proxy-middleware";

// module.exports = (app: any) => {
//     app.use(
//         createProxyMiddleware("",
//          {
//              target: "http://192.168.1.8:21111/services/lmsbackenddung/api",
//              changeOrigin: true
//          }
//         )
//     )
// }