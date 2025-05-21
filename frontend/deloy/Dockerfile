# 使用官方Nginx最新稳定版镜像作为基础
FROM nginx:stable-alpine

# 删除默认的Nginx配置文件
RUN rm /etc/nginx/conf.d/default.conf

# 复制自定义Nginx配置文件
COPY nginx.conf /etc/nginx/conf.d/

# 复制静态页面到Nginx的默认web目录
COPY ../dist /usr/share/nginx/html

# 暴露80端口
EXPOSE 80

# 启动Nginx
CMD ["nginx", "-g", "daemon off;"]