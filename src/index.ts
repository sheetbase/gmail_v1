import { IModule } from './types/module';
import { Gmail } from './gmail';

export const moduleExports: IModule = new Gmail();