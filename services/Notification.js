import { PermissionsAndroid } from "react-native";

import messaging from '@react-native-firebase/messaging';
import axios from 'axios'

export  const getFcmToken = () => {
    messaging().getToken()
        .then((res) => {
            console.log('devicd token', res)
            
        })
}

// MAYBE IS PROBLEM HERE BECAUSE WE PUTED FOR ANDROID

export async function requestUserPermission() {
    console.log('requestion permisssion calling');
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Permission granted');
            getFcmToken(); 
            // Perform actions that require the permission
        } else {
            console.log('Permission denied');
            // Handle the denied permission
        }
    } catch (error) {
        console.error('Permission request error:', error);
    }
}


export const sendNotification = async (
    fcmToken,
    title,
    body ,
  ) => {
    
    try {
      let eventData = {};
      const url = 'https://fcm.googleapis.com/fcm/send';
      const headers = {
        'Content-Type': 'application/json',
        Authorization:
          'key=AAAAoP9ZQg8:APA91bECsdFA955QC9vLoIoS2qIAZAOTZnNjZCKaEMIWIninUF7Po_t786qGfO88EP-cnEZnT2LzWRgBesGKyMWIO6amiD-4jFrYI0oxBuvY8Eea_3EIHd0gmAzQXK7WSbSWe-3IAxL1'
      };
  
  
        eventData = {
          to: fcmToken,
          collapse_key: 'type_a',
          notification: {
            body: body,
            title: title,
          // should be added text
        }
      }
  
  
      const APIData = await axios.post(
        url,
        {
          ...eventData,
        },
        {
          headers: headers,
        },
      );
      console.log('API Response', APIData);
      return APIData;
    } catch (error) {
      console.log('error=>', error);
    }
  };
