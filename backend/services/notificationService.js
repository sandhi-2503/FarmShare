import Notification from '../models/Notification.js';

export const createNotification = async ({
  recipient,
  sender,
  rentalRequest,
  title,
  message,
  type
}) => {
  try {
    const notification = await Notification.create({
      recipient,
      sender,
      rentalRequest,
      title,
      message,
      type
    });
    return notification;
  } catch (error) {
    console.error('Failed to create notification:', error.message);
    return null;
  }
};
