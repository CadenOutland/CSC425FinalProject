const notificationService = {
  sendNotification: async (userId, type, message, data) => {
    return {
      success: true,
      message: 'Notification stubbed (no DB table implemented)',
      stored: { userId, type, message, data }
    };
  },

  getUserNotifications: async (userId) => {
    return [];
  },

  markAsRead: async (id) => {
    return { success: true };
  }
};

module.exports = notificationService;
