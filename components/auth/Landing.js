import React from 'react';
import { Text, View, TouchableOpacity, Image, ImageBackground, StyleSheet, Dimensions } from 'react-native';
//import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Landing({ navigation }) {
  async function checkIfUserIsLoggedIn() {
    const userEmail = await AsyncStorage.getItem('userEmail');
    const userPassword = await AsyncStorage.getItem('userPassword');
  
    if (userEmail && userPassword) {
      // Automatski izvršite prijavu koristeći sačuvane kredencijale
      navigation.navigate('Profil'); // Promenite ovo na naziv vaše profil stranice
    }
  }
  
  return (
    <ImageBackground
      source={require('../assets/SignIn.png')}
      style={styles.backgroundImage}
    >
      
      <View style={styles.container}>
     
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button} 
            onPress={() => navigation.navigate('SignIn')}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}
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
    backgroundColor:'#181818',
  },
  container: {
    flex: 1,

  },
  logoContainer: {
    alignSelf: 'center',
    marginTop:120,
  },
  logo: {
    width: 230,
    height: 50,
  },
  buttonContainer: {
    alignSelf: 'center',
    position:'absolute',
    bottom:'28%',
    
  },
  button: {
    paddingHorizontal: 50,
    paddingVertical: 10,
    borderRadius: dynamicFontSize(2.2),
    backgroundColor: '#5ce1e6',
  },
  buttonText: {
    color: '#181818', 
    fontSize: dynamicFontSize(5.8),
    fontWeight: 'bold',
   
  },
});
