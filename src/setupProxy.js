const { createProxyMiddleware } = require('http-proxy-middleware');  
  
module.exports = function(app) {  
  app.use(  
    '/geoserver', // 匹配所有以 /api 开头的请求路径  
    createProxyMiddleware({  
      target: 'http://192.168.0.57:8080/geoserver', // 将请求代理到 http://localhost:5000  
      changeOrigin: true, // 如果需要跨域，设置为true  
    })  
  );  
};