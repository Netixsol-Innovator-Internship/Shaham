"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useWebSocketAdapter(new platform_socket_io_1.IoAdapter(app));
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true }));
    const origins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
        .split(',')
        .map(s => s.trim());
    app.enableCors({ origin: origins, credentials: true });
    await app.listen(process.env.PORT ? parseInt(process.env.PORT, 10) : 5000);
}
bootstrap();
//# sourceMappingURL=main.js.map