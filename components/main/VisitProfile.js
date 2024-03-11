/*import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Video from 'react-native-video';

const VisitProfile = ({ navigation, route }) => {
  const [profileImageURL] = useState(null);
  const route = useRoute();
  const { id } = route.params;
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();
  useEffect(() => {
    const fetchUser = async () => {

      


      const user = firebase.auth().currentUser;
      if (user) {
        const querySnapshot = await firebase.firestore().collection('users').doc(user.uid).get();
        setUser(querySnapshot.data());
      }
    };

    fetchUser();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: user?.profileImageURL || profileImageURL }} style={styles.profileImage} />
        <View style={styles.buttonContainer}>
          {route.params ? (
            <>
              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editButtonText}>Fit Wall</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.logoutButton}>
                <Text style={styles.logoutButtonText}>Message</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
      <View style={styles.videoContainer}>
        <Text> {route.params ? route.params.id : user?.uid} </Text>
        <Video
          source={require('/Users/lukacerovic/FitLoupe/assets/pexels-media-dung-9716421.mp4')}
          style={styles.video}
          resizeMode="cover"
          shouldPlay
          isLooping
        />
      </View>
      <View style={styles.hrLine} />
      <View style={styles.aboutContainer}>
        <Text style={styles.aboutText}>{user?.about}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    padding: 20,
    marginBottom: 50,
    position: 'absolute',
    top: 0,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  videoContainer: {
    width: '100%',
    height: '50%',
  },
  video: {
    flex: 1,
  },
  hrLine: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    width: '100%',
    marginBottom: 20,
  },
  aboutContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  aboutText: {
    fontSize: 16,
    marginBottom: 20,
  },
});

export default VisitProfile;*/
