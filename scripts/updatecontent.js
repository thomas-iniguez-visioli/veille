console.log(hexo)
hexo.extend.processor.register("server_middleware", (app) => {console.log(app)})
