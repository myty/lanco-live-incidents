FROM denoland/deno:1.44.4
WORKDIR /app
USER deno
COPY . .
RUN deno cache main.ts
CMD ["deno", "run", "--allow-net", "--allow-read", "--allow-env", "--allow-sys", "main.ts"]
