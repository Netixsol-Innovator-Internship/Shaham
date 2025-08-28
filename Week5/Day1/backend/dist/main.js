"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const cookieParser = require("cookie-parser");
const serverless_express_1 = require("@vendia/serverless-express");
let cachedServer;
async function createApp() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    app.use(cookieParser());
    const origin = process.env.CLIENT_ORIGIN || 'http://localhost:3001';
    app.enableCors({
        origin,
        credentials: true,
    });
    await app.init();
    return app;
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    app.use(cookieParser());
    const origin = process.env.CLIENT_ORIGIN || 'http://localhost:3001';
    app.enableCors({
        origin,
        credentials: true,
    });
    const port = process.env.PORT || 5000;
    await app.listen(port);
    console.log(`Server running on http://localhost:${port}`);
}
if (!process.env.VERCEL) {
    bootstrap();
}
const handler = async (event, context) => {
    if (!cachedServer) {
        const app = await createApp();
        const expressInstance = app.getHttpAdapter().getInstance();
        cachedServer = (0, serverless_express_1.default)({ app: expressInstance });
    }
    return cachedServer(event, context);
};
exports.handler = handler;
