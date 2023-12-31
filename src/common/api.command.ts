import { CommandRunner, Option } from 'nest-commander';
import { Logger } from '../components/logger';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import * as process from 'process';
import { HttpStatus } from '@nestjs/common';

export enum ApiActions {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

export const args: Record<string, any> = Object.values(ApiActions);

export interface ApiOptions {
  id?: string;
  sort?: string;
  page?: number;
  limit?: number;
  body?: Record<string, any>;
}

export abstract class ApiCommand extends CommandRunner {
  protected readonly logger: Logger = new Logger(this.constructor.name);
  protected abstract readonly httpService: HttpService;
  protected abstract readonly path: string;

  async run(passedParam: string[], options: ApiOptions): Promise<void> {
    if (
      passedParam.length > 1 ||
      (passedParam.length === 1 && !args.includes(passedParam[0]))
    ) {
      this.logger.error(
        `Argument pass error: [${passedParam}] - Only one of: [${args}] or without arguments must be passed`,
      );
      process.exit(1);
    }

    let responsePromise: Promise<AxiosResponse>;
    switch (passedParam[0]) {
      case ApiActions.CREATE:
        responsePromise = this.create(options);
        break;
      case ApiActions.UPDATE:
        responsePromise = this.update(options);
        break;
      case ApiActions.DELETE:
        responsePromise = this.delete(options);
        break;
      default:
        responsePromise = this.default(options);
    }
    responsePromise
      .then((response) => {
        switch (response.status) {
          case HttpStatus.NO_CONTENT:
            return this.logger.log('OK');
          default:
            this.logger.log(response.data);
        }
      })
      .catch((error) => this.logger.error(error.response.data.message));
  }

  @Option({
    flags: '-i, --id [string]',
    description: 'Id',
  })
  parseId(id: string): string {
    return id;
  }

  @Option({
    flags: '-s, --sort [string]',
    description: 'Sorting results, e.g: [-name,+id]',
  })
  parseSort(sort: string): string {
    return sort.toString().replace(/[\[\]]/g, '');
  }

  @Option({
    flags: '-p, --page [number]',
    description: 'Page',
  })
  parsePage(page: string): number {
    return Number(page);
  }

  @Option({
    flags: '-l, --limit [number]',
    description: 'Limit',
  })
  parseLimit(limit: string): number {
    return Number(limit);
  }

  @Option({
    flags: '-b, --body [string]',
    description: 'Json string, e.g: \'{"field":"value"}\'',
  })
  parseBody(input: string): Record<string, any> {
    try {
      return JSON.parse(input);
    } catch (e) {
      this.logger.error('Body parse error: ' + e.message);
      process.exit(1);
    }
  }

  async default(options: ApiOptions): Promise<AxiosResponse<any, any>> {
    return this.httpService.axiosRef.get(
      this.path + (options.id ? '/' + options.id : ''),
      {
        params: {
          sort: options.sort,
          page: options.page,
          limit: options.limit,
        },
      },
    );
  }

  async create(options: ApiOptions): Promise<AxiosResponse<any, any>> {
    if (!options.body) {
      this.logger.error('The option --body is required');
      process.exit(1);
    }

    return this.httpService.axiosRef.post(this.path, options.body);
  }

  async update(options: ApiOptions): Promise<AxiosResponse<any, any>> {
    if (!options.id || !options.body) {
      this.logger.error('The options --id and --body are required');
      process.exit(1);
    }

    return this.httpService.axiosRef.patch(
      this.path + '/' + options.id,
      options.body,
    );
  }

  async delete(options: ApiOptions): Promise<AxiosResponse<any, any>> {
    if (!options.id) {
      this.logger.error('The option --id is required');
      process.exit(1);
    }

    return this.httpService.axiosRef.delete(this.path + '/' + options.id);
  }
}
