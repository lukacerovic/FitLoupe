import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const Register = () => {
  const navigation = useNavigation();
  const [userType, setUserType] = useState('');

  const handleCoach = () => {
    setUserType('Coach');
    navigation.navigate('CoachRegisterPage', { userType: 'Coach' });
  };
  const handleTrainee = () => {
    setUserType('Trainee');
    navigation.navigate('TraineeRegisterPage', { userType: 'Trainee' });
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/whiteLogoVector.png')} style={styles.logo} />
      <Text style={styles.title}>What type of user are you?</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleCoach}>
          <Text style={styles.buttonText}>I am a Coach</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleTrainee}>
          <Text style={styles.buttonText}>I am a Treinee</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  },
  logo: {
    width: deviceWidth * 0.4,
    height: deviceWidth * 0.3,
    position: "absolute",
    top: deviceWidth * 0.2,
  },
  title: {
    fontSize: dynamicFontSize(5.5),
    fontWeight: 'bold',
    marginBottom: 20,
    color: "#fff",
    position:"absolute",
    top:deviceWidth * 0.6,
  },
  buttonContainer: {
    flexDirection: 'row', // Horizontalni raspored elemenata unutar ovog View-a
    justifyContent: 'center', // Centriramo elemente vertikalno unutar reda
    marginTop:70,
  },
  button: {
    backgroundColor: '#5ce1e6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: dynamicFontSize(3), // Razmak između dugmadi
  },
  buttonText: {
    color: '#181818',
    fontSize: dynamicFontSize(4),
    fontWeight: 'bold',
  },
});

export default Register;
