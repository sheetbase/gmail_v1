import { GmailService } from './gmail';

export function gmail(): GmailService {
    return new GmailService();
}