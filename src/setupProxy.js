const { createProxyMiddleware } = require('http-proxy-middleware');  
  
module.exports = function(app) {  
  app.use(  
    '/hg', // 匹配所有以 /api 开头的请求路径  
    createProxyMiddleware({  
      target: 'http://101.33.116.111:7077/hg', // 将请求代理到 http://localhost:5000  
      changeOrigin: true, // 如果需要跨域，设置为true  
    })  
  );  
};