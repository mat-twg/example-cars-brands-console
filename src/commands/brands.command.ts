import { Command } from 'nest-commander';
import { HttpService } from '@nestjs/axios';
import { ApiCommand, args } from '../common/api.command';

@Command({
  name: 'brands',
  arguments: `[action]`,
  argsDescription: { action: args.join('|') },
  description: 'Brands \npayload for create/update: \n{\n  name:string\n}\n',
})
export class BrandsCommand extends ApiCommand {
  protected readonly path: string = 'brands';

  constructor(protected readonly httpService: HttpService) {
    super();
  }
}
