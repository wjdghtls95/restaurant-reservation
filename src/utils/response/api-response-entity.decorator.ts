import { applyDecorators, HttpCode, HttpStatus, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ResponseEntity } from './response-entity';

export interface ApiResponseEntityOptions {
  summary?: string;
  type?: Type<unknown>;
  isArray?: boolean;
}

export const ApiResponseEntity = (
  options?: ApiResponseEntityOptions,
): MethodDecorator => {
  const decorators = [
    HttpCode(HttpStatus.OK),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' }),
    ApiOperation({ summary: options?.summary }),
    ApiExtraModels(ResponseEntity),
  ];

  if (!options?.type) {
    decorators.push(ApiOkResponse({ type: ResponseEntity }));
  } else {
    decorators.push(ApiExtraModels(options.type));

    const properties = options.isArray
      ? {
          data: {
            type: 'array',
            items: { $ref: getSchemaPath(options.type) },
          },
        }
      : {
          data: { $ref: getSchemaPath(options.type) },
        };

    decorators.push(
      ApiOkResponse({
        schema: {
          allOf: [{ $ref: getSchemaPath(ResponseEntity) }, { properties }],
        },
      }),
    );
  }

  return applyDecorators(...decorators);
};
