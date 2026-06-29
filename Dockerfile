FROM oven/bun:1-alpine
WORKDIR /app

# Atur environment default
ENV PORT=3000
ENV HOST=0.0.0.0
ENV NODE_ENV=production

# Salin folder build .output yang sudah digenerate secara lokal
COPY .output .output

EXPOSE 3000

CMD ["bun", ".output/server/index.mjs"]
