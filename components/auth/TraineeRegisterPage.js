import React, { useState } from 'react';
import { View, TextInput, ScrollView, StyleSheet,Alert, Image, Text, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
require('firebase/firestore');
import ReactNativePickerSelect from 'react-native-picker-select';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid E-mail').required('E-mail is required'),
  password: Yup.string().min(7, 'Password must contain at least 7 characters').required('Password is required'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required'),
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last name is required'),
  gender: Yup.string().required('Gender is required'),
});

const TraineeRegisterPage = ({navigation}) => {
  const [selectedGender, setSelectedGender] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);


  const genderOptions = [
    'Male',
    'Female',
    'Other',
    "I'd rather not say"
  ];

  const handleSubmit = async (values) => {
    const { email, password, firstName, lastName } = values;
    if (Platform.OS === 'android') {
      const emailExistsSnapshot = await firebase.firestore().collection('users').where('email', '==', email).get();

      if (!emailExistsSnapshot.empty) {
        Alert.alert('Error', 'Email already exists');
        return;
      }
    }
 
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((result) => {
        firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).set({
          firstName,
          lastName,
          email,
          gender: selectedGender,
          userType: 'Trainee',
        });
        console.log(result);
        
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword((prevShowConfirmPassword) => !prevShowConfirmPassword);
  };
  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
    setModalVisible(false);
  };

  return (
    <ScrollView style={{backgroundColor:'#181818'}}>
      <View style={styles.container}>
        <View>
          <Image source={require('../assets/whiteLogoVector.png')} style={styles.logo} />
        </View>

        <Formik initialValues={{ email: '', password: '', confirmPassword: '', firstName: '', lastName: '' }} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ handleChange, handleBlur, values, errors, touched }) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                placeholder="E-mail"
                autoCapitalize="none"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                style={styles.input}
              />
              {errors.email && touched.email && <Text style={styles.errorText}>{errors.email}</Text>}

              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={!showPassword}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  style={styles.passwordInput}
                  textContentType="none"
                />
                <TouchableOpacity onPress={toggleShowPassword} style={styles.eyeIcon}>
                  <MaterialCommunityIcons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={dynamicFontSize(5)}
                    color={showPassword ? 'gray' : '#000'}
                  />
                </TouchableOpacity>
              </View>
              {errors.password && touched.password && <Text style={styles.errorText}>{errors.password}</Text>}
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Confirm Password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={!showConfirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  value={values.confirmPassword}
                  style={styles.passwordInput}
                  textContentType="none"
                />
                <TouchableOpacity onPress={toggleShowConfirmPassword} style={styles.eyeIcon}>
                  <MaterialCommunityIcons
                    name={showConfirmPassword ? 'eye-off' : 'eye'}
                    size={dynamicFontSize(5)}
                    color={showConfirmPassword ? 'gray' : '#000'}
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && touched.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
              <Text style={styles.label}>First Name</Text>
              <TextInput
                placeholder="First Name"
                autoCorrect={false}
                onChangeText={handleChange('firstName')}
                onBlur={handleBlur('firstName')}
                value={values.firstName}
                style={styles.input}
              />
              {errors.firstName && touched.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                placeholder="Last Name"
                autoCorrect={false}
                onChangeText={handleChange('lastName')}
                onBlur={handleBlur('lastName')}
                value={values.lastName}
                style={styles.input}
              />
              {errors.lastName && touched.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
              <Text style={styles.label}>Gender</Text>
                <TouchableOpacity
                  style={styles.genderInput}
                  onPress={() => setModalVisible(true)}
                >
                  <Text style={styles.selectedGender}>{selectedGender || 'Select Gender'}</Text>
                </TouchableOpacity>
                {errors.gender && touched.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

                {/* Modal za prikazivanje opcija za odabir roda */}
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisible}
                >
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                      <Text style={styles.modalTitle}>Select Gender</Text>
                      {genderOptions.map((gender, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.modalOption}
                          onPress={() => handleGenderSelect(gender)}
                        >
                          <Text style={styles.genderItems}>{gender}</Text>
                        </TouchableOpacity>
                      ))}
                      <TouchableOpacity
                        style={styles.modalOptionCancel}
                        onPress={() => setModalVisible(false)}
                      >
                        <Text style={{ color: 'red', fontSize:dynamicFontSize(3.5) }}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
                {errors.gender && touched.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

              <TouchableOpacity style={styles.button} onPress={()=>{
                handleSubmit(values)
              }}>
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};
const deviceWidth = Dimensions.get('window').width;

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
    paddingBottom: 3,
  },
  
  logo: {
    position:'relative',
    top:-dynamicFontSize(1.5),
    width: deviceWidth * 0.4,
    height: deviceWidth * 0.3,
  },
  label: {
    color:"#fff",
    fontSize:dynamicFontSize(3.5),
  },
  inputContainer: {
    justifyContent: 'center',
    width: '95%',
    top:-30,
    marginBottom: 10,
  },
  buttonContainer: {
    backgroundColor: '#007BFF',
    borderRadius: 4,
    paddingVertical: 12,
    marginTop: 10,
  },
  input: {
    borderRadius: 4,
    padding: 12,
    backgroundColor: '#FAFAFA',
    marginBottom: dynamicFontSize(3.5),
    borderWidth: 1,
    fontSize:dynamicFontSize(3.5),
    color:'black',
  },
  genderInput:{
    paddingVertical:dynamicFontSize(3),
    backgroundColor: '#FAFAFA',
    marginBottom: 10,
    borderWidth: 1,
    paddingHorizontal:dynamicFontSize(1),
    color:'black',
  },
  selectedGender:{
    fontSize:dynamicFontSize(3),
    color:'black',
  },
  passwordContainer: {
    position: 'relative',
    
  },
  passwordInput: {
    borderRadius: 4,
    padding: 12,
    backgroundColor: '#FAFAFA',
    marginBottom: dynamicFontSize(3.5),
    borderWidth: 1,
    fontSize:dynamicFontSize(3.5),
    color:'black',
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 10,
  },
  button: {
    backgroundColor: '#5ce1e6',
    borderRadius: 4,
    paddingVertical: 12,
    marginTop: dynamicFontSize(5),
  },
  buttonText: {
    color: '#181818',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize:dynamicFontSize(3.5),
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize:dynamicFontSize(3.5),
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: dynamicFontSize(5),
    borderRadius: 10,
    alignItems: 'center',
  },
  genderItems:{
    fontSize:dynamicFontSize(4),
    color:'black',
  },
  modalTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    color:'black',
    fontSize:dynamicFontSize(5),
  },
  modalOption: {
    paddingVertical: dynamicFontSize(3),
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    alignItems: 'center',
    color:'black',
  },
  modalOptionCancel: {
    paddingTop: dynamicFontSize(5),
    width: '100%',
    alignItems: 'center',
    fontSize:dynamicFontSize(3.5),
  },
});
export default TraineeRegisterPage;
