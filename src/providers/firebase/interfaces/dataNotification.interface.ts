export interface DataNotification { 
    to: string;
    notification: {
        title: string;
        body: string;
    };
    data: {
        url: string;
    };
}