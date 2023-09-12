import { Command } from 'nest-commander';
import { HttpService } from '@nestjs/axios';
import { ApiCommand, args } from '../common/api.command';

@Command({
  name: 'cars',
  arguments: `[action]`,
  argsDescription: { action: args.join('|') },
  description:
    'Cars \npayload for create/update: \n{\n  name:string,\n  brandId:string\n}\n',
})
export class CarsCommand extends ApiCommand {
  protected readonly path: string = 'cars';

  constructor(readonly httpService: HttpService) {
    super();
  }
}
