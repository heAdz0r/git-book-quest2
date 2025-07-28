#!/usr/bin/env bun

// Простой сервер для разработки
const server = Bun.serve({
  port: 3000,
  fetch(req) {
    const url = new URL(req.url);

    // Обслуживание статических файлов
    if (url.pathname === "/" || url.pathname === "/index.html") {
      return new Response(Bun.file("public/index.html"));
    }

    // Обслуживание CSS
    if (url.pathname.endsWith(".css")) {
      const filePath = url.pathname.startsWith("/src/")
        ? url.pathname.slice(1)
        : `src/styles/${url.pathname.split("/").pop()}`;
      const file = Bun.file(filePath);
      return new Response(file, {
        headers: { "Content-Type": "text/css" },
      });
    }

    // Обслуживание JS и JSX файлов
    if (url.pathname.endsWith(".js") || url.pathname.endsWith(".jsx")) {
      const filePath = url.pathname.startsWith("/src/")
        ? url.pathname.slice(1)
        : `src/${url.pathname.slice(1)}`;
      const file = Bun.file(filePath);
      return new Response(file, {
        headers: { "Content-Type": "application/javascript" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`🚀 Сервер запущен на http://localhost:${server.port}`);
console.log(
  "📝 Откройте браузер и перейдите по адресу выше для тестирования системы проверки знаний"
);
