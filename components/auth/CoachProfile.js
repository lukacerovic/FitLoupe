import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { ScrollView } from 'react-native-gesture-handler';

const CoachProfile = () => {
  const navigation = useNavigation();
  const [profileImageURL, setProfileImageURL] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [about, setAbout] = useState('');
  const [price, setPrice] = useState('');
  

  const handleSubmit = async (values) => {
    const { about, price } = values;

    const user = firebase.auth().currentUser;

    // Ažuriranje profila korisnika sa URL-om slike, about, price i services
    await firebase.firestore().collection('users').doc(user.uid).update({
      profileImageURL,
      about,
      price,
      services: selectedServices,
    });

    navigation.navigate('Main');
  };

  const handleServiceToggle = (services) => {
    if (selectedServices.includes(services)) {
      setSelectedServices(selectedServices.filter((item) => item !== services));
    } else {
      setSelectedServices([...selectedServices, services]);
    }
  };

  const handleChooseImage = async () => {
    launchImageLibrary({}, async (response) => {
      if (response.assets[0].uri) {
        const { uri } = response.assets[0];
        const imageResponse = await fetch(uri);
        const blob = await imageResponse.blob();
        const imageName = `${firebase.auth().currentUser.uid}.jpg`;
        const imageRef = firebase.storage().ref().child(`profileImages/${imageName}`);
        await imageRef.put(blob);
        const imageURL = await imageRef.getDownloadURL();
        setProfileImageURL(imageURL);
      }
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {profileImageURL ? (
        <Image source={{ uri: profileImageURL }} style={styles.profileImage} />
      ) : (
        <TouchableOpacity style={styles.profileImagePlaceholder} onPress={handleChooseImage}>
          <Text style={styles.plusSymbol}>+</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.label}>Services:</Text>
      <View style={styles.checkboxContainer}>
        <View style={styles.checkboxColumn}>
          <CheckBox
            checked={selectedServices.includes('Personal Coach')}
            onPress={() => handleServiceToggle('Personal Coach')}
          />
          <Text style={styles.checkboxLabel}>Personal Coach</Text>
        </View>
        <View style={styles.checkboxColumn}>
          <CheckBox
            checked={selectedServices.includes('Crossfit Coach')}
            onPress={() => handleServiceToggle('Crossfit Coach')}
            
          />
          <Text style={styles.checkboxLabel}>Crossfit Coach</Text>
        </View>
      </View>
      <View style={styles.checkboxContainer}>
        <View style={styles.checkboxColumn}>
          <CheckBox
            checked={selectedServices.includes('Pilates')}
            onPress={() => handleServiceToggle('Pilates')}
          />
          <Text style={styles.checkboxLabel}>Pilates</Text>
        </View>
        <View style={styles.checkboxColumn}>
          <CheckBox
            checked={selectedServices.includes('Yoga')}
            onPress={() => handleServiceToggle('Yoga')}
          />
          <Text style={styles.checkboxLabel}>Yoga</Text>
        </View>
      </View>
      <View style={styles.checkboxContainer}>
        <View style={styles.checkboxColumn}>
          <CheckBox
            checked={selectedServices.includes('Nutritionist')}
            onPress={() => handleServiceToggle('Nutritionist')}
          />
          <Text style={styles.checkboxLabel}>Nutritionist</Text>
        </View>
      </View>
      <Text style={styles.label}>About:</Text>
      <TextInput
        style={styles.textInputAbout}
        multiline
        numberOfLines={4}
        maxLength={1000}
        value={about}
        onChangeText={setAbout}
      />
      <Text style={styles.label}>Price:</Text>
      <TextInput
        style={styles.textInputPrice}
        multiline
        numberOfLines={2} // Izmenjeno na 2 reda
        maxLength={1000}
        value={price} // Izmenjeno na 'price'
        onChangeText={setPrice} // Izmenjeno na 'setPrice'
      />
      <TouchableOpacity style={styles.registerButton} onPress={() => handleSubmit({ about, price, services: selectedServices })}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // Dodato flexGrow da se cela stranica može skrolovati
    alignItems: 'flex-start', // Izmenjeno na 'flex-start' da se tekstovi poravnaju s desne strane
    paddingVertical: 20, // Dodato padding da se omogući skrolovanje do samog dna
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  profileImagePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  plusSymbol: {
    fontSize: 50,
    fontWeight: 'bold',
    color: 'white',
  },
  registerButton: {
    backgroundColor: 'blue',
    padding: 10,
    paddingHorizontal: 150,
    borderRadius: 5,
    marginTop: 20,
  },
  registerButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    alignSelf: 'flex-start', // Dodato 'alignSelf' da se tekst poravna s desne strane
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  checkboxColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  checkboxLabel: {
    fontSize: 16,
  },
  textInputAbout: {
    height: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: '100%',
  },
  textInputPrice: {
    height: 50, // Izmenjeno na 50
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10, // Dodato marginBottom da se odvoji od prethodnog TextInput polja
    width: '100%',
  },
});

export default CoachProfile;
