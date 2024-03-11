import React , { Component, useReducer, useEffect } from 'react'; 
import { View, Text } from 'react-native'
import firebase from 'firebase/compat/app';
const firebaseConfig = {
  apiKey: "AIzaSyBI2GYPXZvU22bYZHjAKYdgj-RFe4EkVJo",
  authDomain: "fitloupe-demo.firebaseapp.com",
  projectId: "fitloupe-demo",
  storageBucket: "fitloupe-demo.appspot.com",
  messagingSenderId: "691478807055",
  appId: "1:691478807055:web:7c136d6df4cab4ad89197a",
  measurementId: "G-LF7MBZ21QE"
};
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk';
const store = createStore(rootReducer, applyMiddleware(thunk))
import { StatusBar } from 'react-native/types'; 
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'; 
import LandingScreen from './components/auth/Landing' 
import RegisterScreen from './components/auth/Register';
import SignInScreen from './components/auth/SignIn'
import MainScreen from './components/Main'
import HomeProfileScreen from './components/main/Profile.js';
import UserProfileScreen from './components/main/UserProfile.js';
import TraineeRegisterScreen from './components/auth/TraineeRegisterPage';
import CoachRegisterScreen from './components/auth/CoachRegisterPage'
import CoachProfileScreen from './components/auth/CoachProfile'
import EditProfileScreen from './components/main/EditProfile.js'
import ChatPageScreen from './components/main/Chat./ChatPage.js'
import ChatScreen from './components/main/Chat./Chat.js'
import FitWallInitialScreen from './components/main/FitWallInitial.js'

import FitWallVideoGaleryScreen from './components/main/FitWallVideoGalery.js'
import FitWallContentScreen from './components/main/FitWallContent.js'
import FitWallScreen from './components/main/FitWall.js'
import HomeScreen from './components/main/Home'
import CalendarScreen from './components/main/Calendar.js'
import EditTrainingScreen from './components/main/EditTraining.js'
import ClientInfoScreen from './components/main/ClientInfo.js'
import ClientProgressScreen from './components/main/ClientProgress.js'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { requestUserPermission } from './services/Notification';
import { notificationListner } from './services/NotificationsListener';
import ForegroundHandler from './services/ForGroundHandler';
//hay

if(firebase.apps.length === 0){ 
  firebase.initializeApp(firebaseConfig)
}



const Stack = createStackNavigator (); 
const Tab = createBottomTabNavigator();


export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded:false,
    }
  }
  componentDidMount(){
    requestUserPermission();
    notificationListner();
    
    firebase.auth().onAuthStateChanged((user) => {
      if(!user){
        this.setState({
          loggedIn: false,
          loaded: true,
        })
      }else {
        this.setState({
          loggedIn: true,
          loaded: true,
        })
      }
    })
  }
  
  render() {
    const { loggedIn, loaded } = this.state;
    if(!loaded){
      return(
        <View style={{ flex: 1, justifyContent: 'center'}}>
          <Text>Loading</Text>
        </View>
      )
     }

     if (!loaded) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text>Loading</Text>
        </View>
      )
    }
    
    if (!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator 
          initialRouteName='Home'
          screenOptions={{
            headerStyle: {
              backgroundColor: '#181818',
            },
            headerTintColor: 'white',
          }}>
            <Stack.Screen name='Home' component={LandingScreen} options={{ headerShown: false }} />
            <Stack.Screen name='Register' component={RegisterScreen} />
            <Stack.Screen name='TraineeRegisterPage' component={TraineeRegisterScreen} options={{ headerTitleStyle: {color:'transparent'} }}/>
            <Stack.Screen name='CoachRegisterPage' component={CoachRegisterScreen} options={{ headerShown: true, headerTitleStyle: {color:'transparent'} }} />
            <Stack.Screen name='SignIn' component={SignInScreen} options={{ headerTitleStyle: {color:'transparent'} }}/>
            <Stack.Screen name='CoachProfile' component={CoachProfileScreen} />
            <Stack.Screen name='FitWallInitial' component={FitWallInitialScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
    
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator
           screenOptions={{
            headerStyle: {
              backgroundColor: '#181818',
          
            },
            headerTintColor: 'white',
          }}>
            <Stack.Screen name='Main' component={MainScreen} options={{ headerShown: false }} />
            <Stack.Screen name='SignIn' component={SignInScreen} />
            <Stack.Screen name='CoachProfile' component={CoachProfileScreen} />
            <Stack.Screen name='Landing' component={LandingScreen} options={{ headerShown: false }} />
            <Stack.Screen name='HomeProfile' component={HomeProfileScreen} 
              options={{ 
                tabBarVisible: false, headerTitleStyle: {color: 'transparent'},
                headerTransparent: true, 
              }} />
              <Stack.Screen name='UserProfile' component={UserProfileScreen} 
              options={{ 
                tabBarVisible: false, headerTitleStyle: {color: 'transparent'},
                headerTransparent: true, 
              }} />
            <Stack.Screen name='EditProfile' component={EditProfileScreen} />
            <Stack.Screen name='Chat' component={ChatScreen} />
            <Stack.Screen name='FitWallInitial' component={FitWallInitialScreen} options={{headerTransparent: true, headerTintColor: 'white', headerTitleStyle:{color:'transparent'},}} />
            <Stack.Screen name='EditTraining' component={EditTrainingScreen} options={{headerTransparent: true, headerTintColor: 'white', headerTitleStyle:{color:'transparent'},}}/>
            <Stack.Screen name='FitWallVideoGalery' component={FitWallVideoGaleryScreen} options={{headerTransparent: true, headerTitleStyle:{color:'transparent'}, headerTintColor: 'white',}} />
            <Stack.Screen name='FitWallContent' component={FitWallContentScreen} options={{ 
                headerTitleStyle: {color: 'transparent'},
               
              }}/>
            <Stack.Screen name='FitWall' component={FitWallScreen} options={{ 
                headerBackTitleVisible: false,
               
              }}/>
            <Stack.Screen name='Home' component={HomeScreen} options={{headerTransparent: true,headerTitleStyle: { color: 'transparent' }, headerTintColor: 'white',}}/>
            <Stack.Screen name='Calendar' component={CalendarScreen} />
            <Stack.Screen name='ClientInfo' component={ClientInfoScreen} options={{headerTransparent: true, headerBackTitleVisible: false, headerTitle: 'Client Informations'}}/>
            <Stack.Screen name='ClientProgress' component={ClientProgressScreen} options={{headerTransparent: true, headerBackTitleVisible: false, headerTitle: 'Client Progress'}}/>
            <Stack.Screen
              name='ChatPage'
              component={ChatPageScreen}
              options={({ route }) => ({
                tabBarVisible: true,
                headerBackTitleVisible: false,
                title: route.params?.userName || '',
              })}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <ForegroundHandler />
      </Provider>
      
    );
  }
}

export default App
