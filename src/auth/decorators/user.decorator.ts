import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user; // Данные из JWT стратегии

        if (!user) {
            throw new Error('User not found in request');
        }

        return data ? user[data] : user;
    },
);