import { IModule, IOptions } from '../index';
import { Gmail } from './gmail';

export declare const GmailModule: {(options?: IOptions): IModule};

declare const options: IOptions;
export const moduleExports: IModule = new Gmail(options);