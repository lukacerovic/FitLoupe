import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserProfile = ({ route }) => {
  const [user, setUser] = useState();
  const navigation = useNavigation();

  const fetchUser = async () => {
    let userId = null;
    if (route?.params?.id) {
      userId = route.params.id;
    } else {
      const currentUser = firebase.auth().currentUser;
      userId = currentUser.uid;
    }

    if (userId) {
      const querySnapshot = await firebase.firestore().collection('users').doc(userId).get();
      setUser(querySnapshot.data());
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);



  const handleLogout = async () => {
    await AsyncStorage.removeItem('userEmail');
    await AsyncStorage.removeItem('userPassword');
    firebase
      .auth()
      .signOut()
      .then(() => {
        navigation.navigate('Landing');
      })
      .catch((error) => {
        console.log('Error logging out:', error);
      });
  };

  return (
    <ImageBackground
      source={require('../assets/UserProfile4.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.header}>
        {user?.profileImageURL ? (
          <Image source={{ uri: user.profileImageURL }} style={styles.profileImage} />
        ) : (
          <Image
            source={
              user?.gender === 'male'
              ? require('../assets/CF74F100-FAF3-4D82-B2D0-7AE358EE5D82_4_5005_c.jpeg')
              : require('../assets/FE5FDFAF-BE12-4A89-8D98-FA4B1767DB7E_4_5005_c.jpeg')
            }
            style={styles.profileImage}
          />
        )}
        <View style={styles.buttonContainer}>
          {route?.params ? (
              <>
                <TouchableOpacity style={styles.buttonBlue} onPress={() => navigation.navigate('FitWallInitial', { id: route.params.id })}>
                  <Text style={styles.buttonText}>Fit Wall</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonGreen} onPress={() => { navigation.navigate('ChatPage', { id: route.params.id, userName: user.firstName }); }}>
                  {/* <Text style={styles.buttonText}>Message</Text> */}
                  <MaterialCommunityIcons name='chat' color='white' size={dynamicFontSize(5)} />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile')}>
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                  <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
                
              </>
            )}
            
        </View>
      </View>
      <View style={styles.welcome}>
        <Text style={{fontFamily: 'impact', color:'#fff',fontSize: dynamicFontSize(8), }}>Welcome</Text>
    
        {user && (
          <Text style={{fontFamily: 'impact', color:'#fff',fontSize: dynamicFontSize(7) }}>
            {user.firstName} {user.lastName}
          </Text>
        )}
      </View>
    </ImageBackground>
  );
};

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const dynamicFontSize = (percentage) => {
  return (deviceWidth * percentage) / 100;
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
  
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 20,
    marginBottom: 50,
    position: 'absolute',
    top: 50,
   
  },
  profileImage: {
    width: deviceWidth * 0.17,
    height: deviceWidth * 0.17,
    borderRadius: dynamicFontSize(10),
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  editButton: {
    paddingHorizontal: dynamicFontSize(3.5),
    paddingVertical : dynamicFontSize(1.5),
    borderRadius: 5,
    marginRight: 10,
    backgroundColor: '#30A9C7',
  },
  editButtonText: {
    color: 'white',
    fontSize: dynamicFontSize(3.5),
    
    alignSelf:'center',

  },
  logoutButton: {
    paddingHorizontal: dynamicFontSize(3),
    paddingVertical : dynamicFontSize(1.5),
    borderRadius: 5,
    backgroundColor: 'red',
  },
  logoutButtonText: {
    backgroundColor: 'red',
    color:'white',
    fontSize: dynamicFontSize(3.5),
  },
  buttonBlue:{
    //padding: 10,
    paddingHorizontal: dynamicFontSize(3),
    paddingTop:dynamicFontSize(1.5),
    borderRadius: dynamicFontSize(1),
    marginRight: 10,
    backgroundColor: '#30A9C7',
  },
  buttonText: {
    color: 'white',
    fontSize: dynamicFontSize(4.5),
    
  },
  buttonGreen:{
    backgroundColor: 'green',
    width: dynamicFontSize(10), // 5% širine ekrana
    height: dynamicFontSize(10),
    borderRadius: dynamicFontSize(10), // Half of width/height to create a circle
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: dynamicFontSize(3), // Add some space between the buttons
  },
  welcome: {
    color: 'white',
    position: 'absolute',
    top: '42%',
    right: '3%',
    
  },
});

export default UserProfile;
