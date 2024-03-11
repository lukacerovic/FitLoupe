import { DocumentSnapshot } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal,Alert, Dimensions, StyleSheet, ScrollView, Image } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
// import Video from 'react-native-video';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { useNavigation } from '@react-navigation/native';
import ReactNativePickerSelect from 'react-native-picker-select';
import { CheckBox } from 'react-native-elements';
// import CountryPicker from 'react-native-country-picker-modal';

const EditProfile = () => {
  const [profileImageURL, setProfileImageURL] = useState(null);
  //const [coverVideo, setCoverVideo] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedGender, setSelectedGender] = useState('Male');
  // const [country, setCountry] = useState('');
  // const [price, setPrice] = useState('');
  const [about, setAbout] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [user, setUser] = useState();
  const navigation = useNavigation();
  const [userType, setUserType] = useState('');
  const [selectedCountryName, setSelectedCountryName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null); // Dodato

  const [selectedServices, setSelectedServices] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  const genderOptions = [
    'Male',
    'Female',
    'Other',
    "I'd rather not say"
  ];
  const handleServiceSelection = (service) => {
    if (selectedServices.includes(service)) {
      setSelectedServices((prevSelected) =>
        prevSelected.filter((selectedService) => selectedService !== service)
      );
    } else {
      setSelectedServices((prevSelected) => [...prevSelected, service]);
    }
  };

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
    setModalVisible(false);
  };

  const handleEditProfile = async () => {
    const currentUser = firebase.auth().currentUser;

    if (newPassword !== newPasswordConfirm) {
      // Dodajte kod za rukovanje greškom (lozinke se ne podudaraju)
      console.error('Passwords do not match');
      return;
    }

    const userRef = firebase.firestore().collection('users').doc(currentUser.uid);

    const userSnapshot = await userRef.get();
    const userData = userSnapshot.data();

    const updatedData = {
      firstName: firstName || userData.firstName,
      lastName: lastName || userData.lastName,
      email: email || userData.email,
      selectedGender: selectedGender || userData.selectedGender,
      // Dodajte liniju ispod da biste ažurirali zemlju
      //country: selectedCountryName || userData.country,
    };
    // if (country !== undefined) {
    //   updatedData.country = country;
    // }
    if (about !== undefined) {
      updatedData.about = about;
    }
    // if (price !== undefined) {
    //   updatedData.price = price;
    // }
    // if (selectedCountryName) {
    //   updatedData.country = selectedCountryName;
    // }
    
    if (profileImageURL) {
     
      updatedData.profileImageURL = profileImageURL;
    }
    if (selectedServices.length > 0) {
      updatedData.services = selectedServices;
    }
    if (newPassword) {
      try {
        await currentUser.updatePassword(newPassword);
        console.log('Password updated successfully');
      } catch (error) {
        // Rukovanje greškom pri ažuriranju lozinke
        console.error('Error updating password:', error);
        // Dodajte kod za rukovanje greškom pri ažuriranju lozinke ovde
      }
    }
    
    await userRef.set(updatedData, { merge: true });
    Alert.alert('Success', 'Information has been successfully saved.');
    navigation.navigate('Profile');
  };

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = firebase.auth().currentUser;
      if (currentUser) {
        const userSnapshot = await firebase.firestore().collection('users').doc(currentUser.uid).get();
        const userData = userSnapshot.data();
        setUser(userData);
        setProfileImageURL(userData.profileImageURL);
        //setCoverVideo(userData.coverVideo);
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
        setEmail(userData.email);
        setAbout(userData.about);
        //setPrice(userData.price);
        setSelectedGender(userData.gender);
        //setCountry(userData.country);
        setUserType(userData.userType);

        // if (userData.country) {
        //   setSelectedCountry({ name: userData.country });
        // }

        setSelectedServices(userData.services || []);
      }
    };

    fetchUser();
  }, []);

  const handleChooseImage = async () => {
    launchImageLibrary({}, async (response) => {
      if (response.assets && response.assets.length > 0 && response.assets[0].uri) {
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

  // const handleChooseVideo = async () => {
  //   launchImageLibrary({ mediaType: 'video' }, async (response) => {
  //     if (response.assets && response.assets.length > 0 && response.assets[0].uri) {
  //       const { uri } = response.assets[0];
  //       const videoResponse = await fetch(uri);
  //       const blob = await videoResponse.blob();
  //       const videoName = `${firebase.auth().currentUser.uid}.mp4`;
  //       const videoRef = firebase.storage().ref().child(`coverVideos/${videoName}`);
  //       await videoRef.put(blob);
  //       const videoURL = await videoRef.getDownloadURL();
  //       setCoverVideo(videoURL);
  //     }
  //   });
  // };

  const handleProfileImagePress = () => {
    if (profileImageURL) {
      handleChooseImage();
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        {profileImageURL ? (
          <TouchableOpacity onPress={()=>handleProfileImagePress()}>
            <Image source={{ uri: profileImageURL }} style={styles.profileImage} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.profileImagePlaceholder} onPress={()=>handleChooseImage()}>
            <Text style={styles.plusSymbol}>+</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* {userType === 'Coach' && (
        <View style={styles.videoContainer}>
          {coverVideo ? (
            <Video source={{ uri: coverVideo }} style={styles.video} resizeMode="cover" shouldPlay isLooping />
          ) : (
            <View style={styles.emptyVideo} />
          )}
          <TouchableOpacity style={styles.chooseVideoButton} onPress={handleChooseVideo}>
            <Text style={styles.chooseVideoButtonText}>Choose Video</Text>
          </TouchableOpacity>
        </View>
      )} */}

      <View style={styles.fieldsContainer}>
        <Text style={styles.labelText}>First Name</Text>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <Text style={styles.labelText}>Last Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
        <Text style={styles.labelText}>Email</Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.labelText}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="**************"
          autoCorrect={false}
          placeholderTextColor='#fff'
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <Text style={styles.labelText}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="**************"
          placeholderTextColor='#fff'
          value={newPasswordConfirm}
          onChangeText={setNewPasswordConfirm}
        />
        <Text style={styles.labelText}>Gender</Text>
        <TouchableOpacity
          style={styles.genderInput}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.selectedGender}>{selectedGender || 'Select Gender'}</Text>
        </TouchableOpacity>
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
        {userType === 'Coach' && (
          <View>
            <Text style={styles.labelText}>About</Text>
            <TextInput
              style={styles.inputAbout}
              placeholder="About: "
              placeholderTextColor='grey'
              value={about}
              onChangeText={setAbout}
              multiline={true}
              numberOfLines={30}
            />
            <View style={styles.servicesContainer}>
              <Text style={styles.labelText}>Services:</Text>
              <View style={styles.checkboxRow}>
                <CheckBox
                  containerStyle={styles.checkBoxContainer}
                  textStyle={styles.checkBoxText}
                  size={dynamicFontSize(4)}
                  title="Fitness"
                  checked={selectedServices.includes("Fitness")}
                  onPress={() => handleServiceSelection("Fitness")}
                />
                <CheckBox
                  containerStyle={styles.checkBoxContainer}
                  textStyle={styles.checkBoxText}
                  title="Cross Fit"
                  size={dynamicFontSize(4)}
                  checked={selectedServices.includes("CrossFit")}
                  onPress={() => handleServiceSelection("CrossFit")}
                />
                <CheckBox
                  containerStyle={styles.checkBoxContainer}
                  textStyle={styles.checkBoxText}
                  title="Yoga"
                  size={dynamicFontSize(4)}
                  checked={selectedServices.includes("Yoga")}
                  onPress={() => handleServiceSelection("Yoga")}
                />
              </View>
              <View style={styles.checkboxRow}>
                <CheckBox
                  containerStyle={styles.checkBoxContainer}
                  textStyle={styles.checkBoxText}
                  title="Conditioning"
                  size={dynamicFontSize(4)}
                  checked={selectedServices.includes("Conditioning")}
                  onPress={() => handleServiceSelection("Conditioning")}
                />
                <CheckBox
                  containerStyle={styles.checkBoxContainer}
                  textStyle={styles.checkBoxText}
                  title="Pilates"
                  size={dynamicFontSize(4)}
                  checked={selectedServices.includes("Pilates")}
                  onPress={() => handleServiceSelection("Pilates")}
                />
                <CheckBox
                  containerStyle={styles.checkBoxContainer}
                  textStyle={styles.checkBoxText}
                  title="Personal"
                  size={dynamicFontSize(4)}
                  checked={selectedServices.includes("Personal")}
                  onPress={() => handleServiceSelection("Personal")}
                />
              </View>
            </View>
          </View>
        )} 
      </View>

      <TouchableOpacity style={styles.updateButton} onPress={handleEditProfile}>
        <Text style={styles.updateButtonText}>Update</Text>
      </TouchableOpacity>
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
    padding: 20,
    backgroundColor: "#181818",
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: deviceWidth * 0.35,
    height: deviceWidth * 0.35,
    borderRadius: dynamicFontSize(100),
    borderColor: 'gray',
    borderWidth: 1,
  },
  profileImagePlaceholder: {
    width: deviceWidth * 0.35,
    height: deviceWidth * 0.35,
    borderRadius: dynamicFontSize(100),
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  plusSymbol:{
    fontSize:dynamicFontSize(8),
  },
  videoContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#000',
    marginBottom: 10,
  },
  video: {
    flex: 1,
  },
  emptyVideo: {
    flex: 1,
    backgroundColor: '#ccc',
  },
  chooseVideoButton: {
    backgroundColor: '#30A9C7',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  chooseVideoButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  fieldsContainer: {
    marginTop: 20,
  },
  labelText: {
    color: "#fff",
    fontSize: dynamicFontSize(4),
    paddingTop: dynamicFontSize(3),
    paddingBottom:dynamicFontSize(2),
    fontFamily: 'impact',
  },
  input: {
    fontSize:dynamicFontSize(3.5),
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: dynamicFontSize(1),
    paddingHorizontal: dynamicFontSize(1),
    paddingVertical: dynamicFontSize(2),
    color:'#fff',
  },
  inputAbout: {
    height: deviceWidth * 0.35,
    fontSize:dynamicFontSize(3),
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: dynamicFontSize(3),
    paddingHorizontal: dynamicFontSize(1),
    color:'#fff',
    textAlignVertical: 'top'
  },
  servicesContainer: {
    marginTop: 20,
    backgroundColor: "transparent",
  },
  servicesLabel: {
    color: 'white',
    marginBottom: 10,
    fontSize:dynamicFontSize(4),
  },
  checkboxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checkBoxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingHorizontal: 0,
    marginLeft: 0,
    marginRight: 0,
   
  },
  checkBoxText: {
    color: 'white',
    fontSize:dynamicFontSize(3.5),
  },
  updateButton: {
    backgroundColor: '#30A9C7',
    paddingVertical: dynamicFontSize(2),
    borderRadius: 5,
    alignItems: 'center',
    marginTop: dynamicFontSize(10),
    marginBottom: dynamicFontSize(10),
  },
  updateButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize:dynamicFontSize(3.5),
    
  },
  pickerInput: {
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    color:'#fff',
  },
  countryPickerContainer: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
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
  genderInput:{
    paddingVertical:dynamicFontSize(3),
    backgroundColor: 'transparent',
    marginBottom: 10,
    borderWidth: 1,
    borderColor:'#fff',
    paddingHorizontal:dynamicFontSize(1),
  },
  selectedGender:{
    fontSize:dynamicFontSize(3),
    color:'#fff',
  },
  genderItems:{
    fontSize:dynamicFontSize(4),
  },
  modalTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    
    fontSize:dynamicFontSize(5),
  },
  modalOption: {
    paddingVertical: dynamicFontSize(3),
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    alignItems: 'center',
  
  },
  modalOptionCancel: {
    paddingTop: dynamicFontSize(5),
    width: '100%',
    alignItems: 'center',
    fontSize:dynamicFontSize(3.5),
  },
});

export default EditProfile;




