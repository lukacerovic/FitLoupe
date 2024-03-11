import React, { Component, useContext, useState } from 'react';
import { View, TextInput, StyleSheet, Image, TouchableOpacity, Text, Dimensions } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { Formik } from 'formik';
import * as Yup from 'yup';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getFcmToken } from '../../services/Notification';
import { CheckBox } from 'react-native-elements';
// import { AsyncStorageStatic } from 'react-native';
//import AsyncStorage from '@react-native-async-storage/async-storage';

import messaging from '@react-native-firebase/messaging';


import AsyncStorage from '@react-native-async-storage/async-storage';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export class SignIn extends Component {
  componentDidMount() {
    // Pozovite funkciju za proveru pri pokretanju komponente
    this.checkIfUserIsLoggedIn();
  }
  checkIfUserIsLoggedIn = async () => {
    const userEmail = await AsyncStorage.getItem('userEmail');
    const userPassword = await AsyncStorage.getItem('userPassword');
    
    if (userEmail && userPassword) {
      // Pokušajte izvršiti autentifikaciju sa sačuvanim email-om i lozinkom
      this.onSignIn({ email: userEmail, password: userPassword, rememberMe: true });
    }
  }
  constructor(props) {
    super(props);

    this.state = {
      errorText: '',
      showPassword: false,
    };

    this.onSignIn = this.onSignIn.bind(this);
  }

  onSignIn(values) {
    const { email, password, rememberMe } = values;

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(async (result) => {
        console.log(result);
        if (rememberMe) {
          // Cuvanje korisnika u AsyncStorage
          console.log("KLIKNUT JE REMEMBER")
          await AsyncStorage.setItem('userEmail', email);
          await AsyncStorage.setItem('userPassword', password);
        }
        const deviceToken = await AsyncStorage.getItem("token");
        console.log("deviceToken:", deviceToken);
  
        if(!deviceToken){
          messaging().getToken()
        
          .then(async (token)=>{
            console.log ("token afteer login " , token )
           await 
            firebase.firestore().collection('users')
            .doc(`${result.user.uid}`)
            .update({
              fcm:token
            })
            AsyncStorage.setItem("token" , token )
          
          })
        
        }else {
          console.log("deviceToken is already set.");
          const userDocRef = firebase.firestore().collection('users').doc(result.user.uid);
          const userDoc = await userDocRef.get();
          const userFcm = userDoc.data().fcm;
          if (userFcm !== deviceToken) {
            console.log("Updating fcm in the database...");
            await userDocRef.update({
              fcm: deviceToken
            });
            AsyncStorage.setItem("token", token);
            console.log("fcm updated successfully.");
          } else {
            console.log("fcm is already up to date.");
          }
        }
  
        // Ovde možete izvršiti dalju logiku ako je autentifikacija uspešna
      })
      .catch((error) => {
        console.log(error);
        this.setState({ errorText: 'Email and Password doesn\'t match' }); // Postavite grešku ako autentifikacija nije uspela
      });
  }

  toggleShowPassword = () => {
    this.setState((prevState) => ({
      showPassword: !prevState.showPassword,
    }));
  };
  
  render() {
    const { showPassword } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/whiteLogoVector.png')}
            style={styles.logo}
          /> 
        </View>

        {this.state.errorText ? <Text style={styles.errorText}>{this.state.errorText}</Text> : null}

        <Formik
          initialValues={{ email: '', password: '', rememberMe: false }}
          validationSchema={validationSchema}
          onSubmit={(values) => this.onSignIn(values)}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
            <View style={styles.inputContainer}>
              <TextInput
                placeholder='E-mail'
                placeholderTextColor='grey'
                autoCapitalize='none'
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                style={styles.input}
              />
              {errors.email && touched.email && <Text style={styles.errorText}>{errors.email}</Text>}

              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder='Password'
                  placeholderTextColor='grey'
                  autoCapitalize='none'
                  autoCorrect={false}
                  secureTextEntry={!showPassword}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  style={styles.input}
                />
                <TouchableOpacity onPress={this.toggleShowPassword} style={styles.eyeIcon}>
                  <MaterialCommunityIcons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={dynamicFontSize(5.5)}
                    color={showPassword ? 'gray' : '#000'}
                  />
                </TouchableOpacity>
              </View>
              {errors.password && touched.password && <Text style={styles.errorText}>{errors.password}</Text>}

              <View style={styles.rememberMeContainer}>
                <CheckBox
                  checked={values.rememberMe}
                  checkedColor="white"
                  size={25}
                  onPress={() => {
                    // Promeni vrednost rememberMe
                    const newRememberMe = !values.rememberMe;
                    // Ažuriraj vrednost u formi pomoću setFieldValue
                    setFieldValue('rememberMe', newRememberMe);
                  }}
                />
                <Text style={styles.rememberMeText}>Remember Me</Text>
              </View>

              <TouchableOpacity style={styles.buttonContainer} onPress={handleSubmit}>
                
                  <Text style={{alignSelf:'center', fontSize:dynamicFontSize(3.8), fontWeight:'bold', color:'#000', backgroundColor:'#5ce1e6',}}>Sign In</Text>
                  
              </TouchableOpacity>
              <View style={styles.signupText}>
                <Text style={{ color: '#fff', paddingTop:dynamicFontSize(2),fontSize: dynamicFontSize(3), }}>Don't have an account? </Text>
                <TouchableOpacity style={{ backgroundColor: '#181818' }} onPress={() => this.props.navigation.navigate('Register')}>
                  <Text style={styles.signupLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>

            </View>
          )}
        </Formik>
        
      </View>
    );
  }
}
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const dynamicFontSize = (percentage) => {
  return (deviceWidth * percentage) / 100;
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#181818',
    paddingHorizontal: 5,
    paddingBottom: 50,
  },
  logoContainer: {
    justifyContent: 'center',
    //alignItems: 'center',
   
  },
  logo: {
    top:-deviceHeight * 0.15,
    width: deviceWidth * 0.5,
    height: deviceHeight * 0.1,
  },
  inputContainer: {
    
    width: '95%',
    marginTop: dynamicFontSize(1.8),
    marginBottom: 10,
  },
  input: {
    borderRadius: 4,
    padding: dynamicFontSize(1.8),
    backgroundColor: '#FAFAFA',
    marginBottom: 10,
    borderWidth: 1,
    fontSize:dynamicFontSize(3.2),
    color:'black'
  },
  passwordContainer: {
    position: 'relative',
  },
  
  eyeIcon: {
    position: 'absolute',
    right: dynamicFontSize(1.8),
    top: dynamicFontSize(1.3),
  },
  rememberMeContainer: {
    flexDirection: 'row', // Postavite na 'row' kako bi CheckBox bio sa tekstom u istom redu
    alignItems: 'center', // Postavite na 'center' kako biste centrirali CheckBox i tekst
    marginBottom: 10,
  },
  rememberMeText: {
    color: '#fff', // Postavite boju teksta tako da bude vidljiva na pozadini
    fontSize: dynamicFontSize(3.2), // Prilagodite veličinu teksta po potrebi
    marginLeft: 8, // Podesite razmak između CheckBoxa i teksta
  },
  
  buttonContainer: {
    backgroundColor: '#5ce1e6',
    borderRadius: 4,
    paddingVertical: 12,
    marginTop: 10,
  },
  forgotPasswordButton: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  forgotPasswordText: {
    color: '#6bb0f5',
  },
  signupText: {
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: dynamicFontSize(5),
    color: '#fff',
 
  },
  signupLink: {
    color: '#6bb0f5',
    marginLeft: dynamicFontSize(2),
    fontSize: dynamicFontSize(5),

  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: dynamicFontSize(3.5),
  },
});

export default SignIn;
