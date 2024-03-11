import messaging from '@react-native-firebase/messaging';
export const notificationListner = async () => {
    // setName(false)
    await messaging().registerDeviceForRemoteMessages();
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to',
        remoteMessage.notification,
      );
  
    });
  
  
  
  
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });
  
  
  
    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
        }
      });
  };