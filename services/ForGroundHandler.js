import React, { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import PushNotification from "react-native-push-notification";

import PushNotificationIOS from '@react-native-community/push-notification-ios';

const ForegroundHandler = () => {

    useEffect(() => {
        const unsubscribe = messaging().onMessage((remoteMessage) => {
            console.log("handle in foreground", remoteMessage)
            const { notification, messageId } = remoteMessage

            if(Platform.OS == 'android'){
                
                PushNotification.localNotification({
                    channelId: 'fitloupe',
                    title: remoteMessage.notification?.title,
                    message: remoteMessage.notification?.body, 
                    date: new Date(),
                    allowWhileIdle: true, 
                    ignoreInForeground: false,
                    priority: 'high',
                    playSound: true,
                    soundName: 'default',
                    // vibrate: true,
                });
            } else {
                
                PushNotificationIOS.addNotificationRequest({
                    id: messageId,
                    body: notification.body,
                    title: notification.title,
                    sound: 'default'
                });
            }
            
        })
        return unsubscribe
    }, [])
    return null
}

export default ForegroundHandler

