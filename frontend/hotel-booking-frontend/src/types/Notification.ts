export interface Notification {
    id: number;
    notificationId: number;
    message: string;
    type: string;
    userId: number;
    createdAt: string;
    isread: boolean;
  }