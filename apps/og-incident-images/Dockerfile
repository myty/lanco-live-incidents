FROM denoland/deno:alpine-1.45.2 AS builder
WORKDIR /app
COPY . .
RUN deno compile --allow-net --allow-read --allow-env --allow-sys --output main ./main.ts

FROM ubuntu:24.10
WORKDIR /app
COPY --from=builder /app/main ./main
CMD ["./main"]
