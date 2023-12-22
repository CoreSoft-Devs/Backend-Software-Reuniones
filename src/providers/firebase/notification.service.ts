import { Injectable } from '@nestjs/common';
import { HttpCustomService } from '../http/http.service';
import { DataNotification } from './interfaces/dataNotification.interface';

@Injectable()
export class NotificationsService {

    private url: string = "";

    constructor(
        private http: HttpCustomService
    ) {
        this.url = process.env.FIREBASE_URL;
    }

    async sendNotification(dataNotification: DataNotification): Promise<boolean> {
        try {
            const auth = process.env.FIREBASE_AUTHORIZATION;
            const header = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'key=' + auth
                }
            }
            const response = await this.http.apiPost(this.url, dataNotification, header);
            return response ? true : false;
        } catch (error) {
            return false;
        }
    }
}
