import { Options } from './types';
import { GmailService } from './gmail';

export function gmail(options: Options): GmailService {
    return new GmailService(options);
}