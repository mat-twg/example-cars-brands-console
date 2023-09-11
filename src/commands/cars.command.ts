import { Command, CommandRunner, Option } from 'nest-commander';
import { Logger } from '../components/logger';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import * as process from 'process';

enum CarsActions {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

const args: Record<string, any> = Object.values(CarsActions);

interface CarsOptions {
  id?: string;
  sort?: string;
  page?: number;
  limit?: number;
  body?: Record<string, any>;
}

@Command({
  name: 'cars',
  arguments: `[action]`,
  argsDescription: { action: args.join('|') },
  description: 'Cars',
})
export class CarsCommand extends CommandRunner {
  private readonly logger: Logger = new Logger(this.constructor.name);

  constructor(private readonly httpService: HttpService) {
    super();
  }

  async run(passedParam: string[], options: CarsOptions): Promise<void> {
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
      case CarsActions.CREATE:
        responsePromise = this.create(options);
        break;
      case CarsActions.UPDATE:
        responsePromise = this.update(options);
        break;
      case CarsActions.DELETE:
        responsePromise = this.delete(options);
        break;
      default:
        responsePromise = this.cars(options);
    }
    responsePromise
      .then((response) => {
        switch (response.status) {
          case 204:
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

  async cars(options: CarsOptions): Promise<AxiosResponse<any, any>> {
    return this.httpService.axiosRef.get(
      `cars${options.id ? '/' + options.id : ''}`,
      {
        params: {
          sort: options.sort,
          page: options.page,
          limit: options.limit,
        },
      },
    );
  }

  async create(options: CarsOptions): Promise<AxiosResponse<any, any>> {
    if (!options.body) {
      this.logger.error('The option --body is required');
      process.exit(1);
    }

    return this.httpService.axiosRef.post(`cars`, options.body);
  }

  async update(options: CarsOptions): Promise<AxiosResponse<any, any>> {
    if (!options.id || !options.body) {
      this.logger.error('The options --id and --body are required');
      process.exit(1);
    }

    return this.httpService.axiosRef.patch('cars/' + options.id, options.body);
  }

  async delete(options: CarsOptions): Promise<AxiosResponse<any, any>> {
    if (!options.id) {
      this.logger.error('The option --id is required');
      process.exit(1);
    }

    return this.httpService.axiosRef.delete('cars/' + options.id);
  }
}
