import {
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  ValidationPipe,
  UnprocessableEntityException,
} from '@nestjs/common';

@Injectable()
export class ValidateInputPipe extends ValidationPipe {
  public async transform(value, metadata: ArgumentMetadata) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return await super.transform(value, metadata);
    } catch (e) {
      if (e instanceof BadRequestException) {
        const response: string | object = e.getResponse();
        const messages: string | string[] =
          response && typeof response === 'object' && 'message' in response
            ? (response.message as string[])
            : 'Validation failed';

        throw new UnprocessableEntityException(this.handleError(messages));
      }
    }
  }

  private handleError(errors: any): string[] {
    if (!Array.isArray(errors)) {
      return [typeof errors === 'string' ? errors : 'Validation error'];
    }

    return errors.flatMap((error: string | object) => {
      if (
        typeof error === 'object' &&
        'constraints' in error &&
        error.constraints
      ) {
        return Object.values(error.constraints) as string[];
      }
      return typeof error === 'string' ? error : 'Validation error';
    });
  }
}