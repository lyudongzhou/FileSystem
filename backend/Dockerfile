FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# 配置国内镜像源
RUN echo "registry=https://registry.npmmirror.com/" > .npmrc

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制项目源代码
COPY . .

# 构建 NestJS 应用
RUN pnpm run build

# 阶段 2: 生产阶段
FROM node:18-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

RUN npm install -g pnpm

# 创建 uploads 目录，并授权权限（必须在切换用户之前）
RUN mkdir -p /app/uploads && chmod -R 777 /app/uploads

# 创建非 root 用户以提高安全性
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs
USER nestjs

# 复制构建产物
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nestjs:nodejs /app/pnpm-lock.yaml ./pnpm-lock.yaml

EXPOSE 3000

CMD ["node", "dist/main.js"]
