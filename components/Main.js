import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser } from '../redux/actions/index';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FeedScreen from './main/Feed';
import MyFavoritesScreen from './main/MyFavorites';
import MyFitWallScreen from './main/MyFitWall';
import ChatScreen from './main/Chat./Chat.js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Image, StyleSheet, View, Text } from 'react-native';
import ProfileScreen from './main/Profile';
import UserProfileScreen from './main/UserProfile';
import HomeScreen from './main/Home';
import CalendarScreen from './main/Calendar';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
import { useNavigation } from '@react-navigation/native';

const Tab = createBottomTabNavigator();


const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -3,
    right: -8,
    backgroundColor: 'red',
    borderRadius: 12,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

const tabBarOptions = {
  tabBarVisible: true,
  tabBarStyle: {
    backgroundColor: '#181818',
  },
  headerStyle: {
    backgroundColor: '#181818',
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
};

const Main = ({ fetchUser, currentUser, route }) => {
  
  const navigation = useNavigation();
  const [fitWallInvitesCount, setFitWallInvitesCount] = useState(0);
  const [calendarReqCount, setCalendarReqCount] = useState(0);


  useEffect(() => {
    userId = firebase.auth().currentUser.uid;
  
    const getFitWallInvitesCount = async () => {
      try {
       
        const querySnapshot = await firebase.firestore().collection('invites').where('invitedCoach', '==', userId).where('inviteStatus', '==', 0).get();
        
        setFitWallInvitesCount(querySnapshot.size);
      } catch (error) {
        console.log('Error fetching FitWall invites:', error);
      }
    };
    
    getFitWallInvitesCount();
    if (route.params?.refreshInvites) {
      // Ovde postavite "refresh" na false
      route.params.refreshInvites = false;
    }
  }, [currentUser?.uid, route.params?.refreshInvites]);

  
  useEffect(() => {
    const getCalendarReqCount = async () => {
      try {
        const userRef = firebase.firestore().collection('calendars').doc(userId);
        const userDoc = await userRef.get();
  
        if (userDoc.exists) {
          const userData = userDoc.data();
          let count = 0;
  
          for (const date in userData) {
            if (Array.isArray(userData[date])) {
              for (const item of userData[date]) {
                if (item.requestStatus === 0) {
                  count++;
                }
              }
            }
          }
         
          setCalendarReqCount(count);
        }
      } catch (error) {
        console.log('Error fetching FitWall invites:', error);
      }
    }
    
    getCalendarReqCount();
    if (route.params?.refreshCalendar) {
      // Ovde postavite "refresh" na false
      route.params.refreshCalendar = false;
    }
   
  }, [route.params?.refreshCalendar]);
  

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const RenderProfileScreen = () => {
    if (currentUser?.userType === 'Trainee') {
      return <UserProfileScreen />;
    } else if (currentUser?.userType === 'Coach') {
      return <ProfileScreen />;
    } else {
      return null; 
    }
  };

  return (
    <Tab.Navigator initialRouteName='Profile' labeled={false} screenOptions={tabBarOptions}>
      <Tab.Screen
        name='Home'
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
          headerTitleStyle: {color: 'transparent'},
          headerTransparent: true,
        }}
      />
      {/* <Tab.Screen
        name='Coach List'
        component={FeedScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-multiple" color={color} size={30} />
   
          ),
         
        }}
      /> */}
      {/* <Tab.Screen
        name='Favorites'
        component={MyFavoritesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="heart" color={color} size={26} />
          ),
         
        }}
      /> */}
      <Tab.Screen
        name='Calendar'
        component={CalendarScreen}
        options={{
          
          tabBarIcon: ({ color, size }) => (
            <View>
              <MaterialCommunityIcons name="calendar-account" color={color} size={26} />
              {calendarReqCount > 0 && ( 
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{calendarReqCount}</Text>
                </View>
              )}
            </View>
            
          ),
         
        }}
      />
      <Tab.Screen
        name='Fit Wall'
        component={MyFitWallScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View>
              <MaterialCommunityIcons name="wall" color={color} size={26} />
              {fitWallInvitesCount > 0 && ( 
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{fitWallInvitesCount}</Text>
                </View>
              )}
            </View>
            
          ),
        
        }}
      /> 
      <Tab.Screen
        name='Chat'
        component={ChatScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chat" color={color} size={26} />
          ),
         
        }}
      />
      <Tab.Screen
        name='Profile'
        component={RenderProfileScreen}
        
        options={({ navigation, route }) => ({
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
          headerTitleStyle: {color: 'transparent'},
          headerTransparent: true,
       
          tabBarVisible: route.name === 'ChatPage',
        })}
      />
    </Tab.Navigator>
  );
};

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ fetchUser }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Main);
