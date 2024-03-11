import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Video from 'react-native-video';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = ({ route }) => {
  const [profileImageURL, setProfileImageURL] = useState(null);
  const [coverVideo, setCoverVideo] = useState(null);
  const [user, setUser] = useState();
  const navigation = useNavigation();
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userEmail');
    await AsyncStorage.removeItem('userPassword');
    firebase
      .auth()
      .signOut()
      .then(() => {
        navigation.navigate('Landing');
      });
  };

  const handleDropdownPress = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleChooseImage = async () => {
    launchImageLibrary({}, async (response) => {
      if (response && !response.didCancel && response.uri) {
        const { uri } = response;
        const imageResponse = await fetch(uri);
        const blob = await imageResponse.blob();
        const imageName = `${firebase.auth().currentUser.uid}.jpg`;
        const imageRef = firebase.storage().ref().child(`profileImages/${imageName}`);
        await imageRef.put(blob);
        const imageURL = await imageRef.getDownloadURL();
        setProfileImageURL(imageURL);

        const currentUser = firebase.auth().currentUser;

        await firebase.firestore().collection('users').doc(currentUser.uid).update({
          profileImageURL: imageURL,
        });
      }
    });
  };

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

  useFocusEffect(
    React.useCallback(() => {
      fetchUser();
    }, [])
  );

  const deviceWidth = Dimensions.get('window').width;
  const videoAspectRatio = 16 / 9; //Aspect ratio of the video (width:height)

  return (
    <ScrollView style={styles.container}>
      <View >
      {user?.profileImageURL ? (
          <Image source={{ uri: user.profileImageURL }} style={styles.headerImage} />
        ) : (
          <Image
            source={
              user?.gender === 'male'
                ? require('../assets/CF74F100-FAF3-4D82-B2D0-7AE358EE5D82_4_5005_c.jpeg')
                : require('../assets/FE5FDFAF-BE12-4A89-8D98-FA4B1767DB7E_4_5005_c.jpeg')
            }
            style={styles.headerImage}
          />
        )}
      </View>
      <View style={styles.infoButtonContainer}>
        <View style={styles.infoContainer}>
          <Text style={styles.nameText}>{user?.firstName} {user?.lastName}</Text>
        </View>
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
              <TouchableOpacity onPress={handleDropdownPress}>
                <MaterialCommunityIcons name={isDropdownVisible ? 'account-edit' : 'account-edit'} size={dynamicFontSize(9)} color="#5ce1e6" style={styles.settingsIcon} />
              </TouchableOpacity>
              {isDropdownVisible && (
                <View style={styles.dropdownMenu}>
                  <TouchableOpacity style={styles.buttonBlue} onPress={() => navigation.navigate('EditProfile')}>
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={ styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.buttonText}>Logout</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>
      </View>
    

      <Text style={styles.serviceLabel}>Services :</Text>
      <View style={styles.servicesContainer}>
        {user?.services && user.services.map((service, index) => (
          <View style={styles.serviceBox} key={index}>
            <Text style={styles.services}>{service}</Text>
          </View>
        ))}
      </View> 

      <View style={styles.hrLine} />
      <Text style={styles.serviceLabel}>About :</Text>
      <View style={styles.aboutContainer}>
        <Text style={styles.aboutText}>{user?.about}</Text>
      </View>
    </ScrollView>
  );
};
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const dynamicFontSize = (percentage) => {
  return (deviceWidth * percentage) / 100;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818',
  },
  headerImage: {
    width: '100%',
    height: deviceWidth * 0.86, // 86% širine ekrana
    resizeMode: 'cover',
    opacity: 0.8,
    zIndex: -1,
  },
  infoButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: dynamicFontSize(4), // 4% širine ekrana
    paddingVertical: dynamicFontSize(5), // 1% širine ekrana
  },
  infoContainer: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  nameText: {
    color: '#fff',
    fontSize: dynamicFontSize(7.5), // 2.5% širine ekrana
    marginBottom: dynamicFontSize(1), // 1% širine ekrana
    fontFamily: 'impact',
  },
  buttonBlue: {
    backgroundColor: '#30A9C7',
    height: dynamicFontSize(7.5), // 5% širine ekrana
    paddingHorizontal: dynamicFontSize(1), // 1% širine ekrana
    marginBottom: dynamicFontSize(2), // 1%
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: dynamicFontSize(1), // 1% širine ekrana
    marginRight: dynamicFontSize(1), // 1% širine ekrana
  },
  buttonGreen: {
    backgroundColor: 'green',
    width: dynamicFontSize(8), // 5% širine ekrana
    height: dynamicFontSize(8), // 5% širine ekrana
    borderRadius: dynamicFontSize(5), // 2.5% širine ekrana (da biste stvorili krug)
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: dynamicFontSize(2), // 0.5% širine ekrana
  },
  buttonText: {
    color: 'white',
    fontSize: dynamicFontSize(3.8), // 1.5% širine ekrana
    fontFamily:'impact',
    
  },
  logoutButton: {
    backgroundColor: 'red',
    height: dynamicFontSize(7), // 4% širine ekrana
    paddingHorizontal: dynamicFontSize(1), // 1% širine ekrana
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: dynamicFontSize(1), // 1% širine ekrana
    marginRight: dynamicFontSize(1), // 1% širine ekrana
  },
  info: {
    color: '#fff',
    fontSize: dynamicFontSize(4), // 4% širine ekrana
    marginBottom: dynamicFontSize(1), // 1% širine ekrana
    fontFamily: 'impact',
  },
  hrLine: {
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
    width: '100%',
    marginBottom: dynamicFontSize(1), // 1% širine ekrana
  },
  serviceLabel: {
    marginLeft: dynamicFontSize(2.5), // 2.5% širine ekrana
    marginTop: dynamicFontSize(2), // 2% širine ekrana
    color: '#fff',
    fontSize: dynamicFontSize(6), // 2.3% širine ekrana
    fontFamily: 'impact',
    paddingBottom: dynamicFontSize(1), // 1% širine ekrana
  },
  servicesContainer: {
    width: '100%',
    paddingHorizontal: dynamicFontSize(4), // 4% širine ekrana
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  serviceBox: {
    padding: dynamicFontSize(1), // 0.5% širine ekrana
    marginBottom: dynamicFontSize(1), // 1% širine ekrana
    backgroundColor: 'gray',
    borderRadius: dynamicFontSize(0.5), // 0.5% širine ekrana
    marginRight: dynamicFontSize(1), // 1% širine ekrana
  },
  services: {
    color: '#fff',
    fontSize: dynamicFontSize(3.3),
  },
  aboutContainer: {
    paddingHorizontal: dynamicFontSize(4), // 4% širine ekrana
    marginBottom: dynamicFontSize(1), // 1% širine ekrana
  },
  aboutText: {
    fontSize: dynamicFontSize(4.5), // 1.6% širine ekrana
    color: '#fff',
  },
});

export default Profile;









//INICIJALNI PROFIL


// import React, { useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
// import { useNavigation, useFocusEffect } from '@react-navigation/native';
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';
// import 'firebase/compat/storage';
// import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
// import Video from 'react-native-video';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// const Profile = ({ route }) => {
//   const [profileImageURL, setProfileImageURL] = useState(null);
//   const [coverVideo, setCoverVideo] = useState(null);
//   const [user, setUser] = useState();
//   const navigation = useNavigation();
//   const [isDropdownVisible, setDropdownVisible] = useState(false);

//   const handleLogout = () => {
//     firebase
//       .auth()
//       .signOut()
//       .then(() => {
//         navigation.navigate('Landing');
//       })
//       .catch((error) => {
//         console.log('Error logging out:', error);
//       });
//   };

//   const handleDropdownPress = () => {
//     setDropdownVisible(!isDropdownVisible);
//   };

//   const handleChooseImage = async () => {
//     launchImageLibrary({}, async (response) => {
//       if (response && !response.didCancel && response.uri) {
//         const { uri } = response;
//         const imageResponse = await fetch(uri);
//         const blob = await imageResponse.blob();
//         const imageName = `${firebase.auth().currentUser.uid}.jpg`;
//         const imageRef = firebase.storage().ref().child(`profileImages/${imageName}`);
//         await imageRef.put(blob);
//         const imageURL = await imageRef.getDownloadURL();
//         setProfileImageURL(imageURL);

//         const currentUser = firebase.auth().currentUser;

//         await firebase.firestore().collection('users').doc(currentUser.uid).update({
//           profileImageURL: imageURL,
//         });
//       }
//     });
//   };

//   const fetchUser = async () => {
//     let userId = null;
//     if (route?.params?.id) {
//       userId = route.params.id;
//     } else {
//       const currentUser = firebase.auth().currentUser;
//       userId = currentUser.uid;
//     }

//     if (userId) {
//       const querySnapshot = await firebase.firestore().collection('users').doc(userId).get();
//       setUser(querySnapshot.data());
//     }
//   };

//   useEffect(() => {
//     fetchUser();
//   }, []);

//   useFocusEffect(
//     React.useCallback(() => {
//       fetchUser();
//     }, [])
//   );

//   const deviceWidth = Dimensions.get('window').width;
//   const videoAspectRatio = 16 / 9; // Aspect ratio of the video (width:height)

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <Image source={{ uri: user?.profileImageURL || profileImageURL }} style={styles.profileImage} />
//         <View style={styles.buttonContainer}>
//           {route?.params ? (
//             <>
//               <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('FitWallInitial', { id: route.params.id })}>
//                 <Text style={styles.editButtonText}>Fit Wall</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.messageButton} onPress={() => { navigation.navigate('ChatPage', { id: route.params.id }); }}>
//                 <Text style={styles.logoutButtonText}>Message</Text>
//               </TouchableOpacity>
//             </>
//           ) : (
//             <>
//               <TouchableOpacity onPress={handleDropdownPress}>
//                 <MaterialCommunityIcons name={isDropdownVisible ? 'account-edit' : 'account-edit'} size={50} color="#5ce1e6" style={styles.settingsIcon} />
//               </TouchableOpacity>
//               {isDropdownVisible && (
//                 <View style={styles.dropdownMenu}>
//                   <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile')}>
//                     <Text style={styles.editButtonText}>Edit</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
//                     <Text style={styles.logoutButtonText}>Logout</Text>
//                   </TouchableOpacity>
//                 </View>
//               )}
//             </>
//           )}
//         </View>
//       </View>

//       <View style={styles.aboutContainer}>
//         <Text style={styles.info}>{user?.firstName} {user?.lastName}</Text>
//       </View>

//       <View style={styles.videoContainer}>
//         {user?.coverVideo || coverVideo ? (
//           <View style={[styles.videoWrapper, { width: deviceWidth, height: deviceWidth / videoAspectRatio }]}>
//             <Video source={{ uri: user?.coverVideo || coverVideo }} style={styles.video} resizeMode="cover" controls={true} />
//           </View>
//         ) : (
//           <Text style={styles.introVideoNotUploaded}>Intro video is not yet uploaded</Text>
//         )}
//       </View>

//       <Text style={styles.serviceLabel}>Services :</Text>
//       <View style={styles.servicesContainer}>
//         {user?.services && user.services.map((service, index) => (
//           <View style={styles.serviceBox} key={index}>
//             <Text style={styles.services}>{service}</Text>
//           </View>
//         ))}
//       </View>

//       <View style={styles.hrLine} />
//       <Text style={styles.serviceLabel}>About :</Text>
//       <View style={styles.aboutContainer}>
//         <Text style={styles.aboutText}>{user?.about}</Text>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#181818',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     width: '100%',
//     padding: 20,
//     marginBottom: 10,
//     marginTop: 10,
//   },
//   profileImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//   },
  
//   dropdownMenu: {
//     position: 'relative',
//     top: 70,
//     right: 10,
//     backgroundColor: 'gray',
//     padding: 10,
//     borderRadius: 5,
//     paddingHorizontal: 20,
//     paddingVertical: 20,

//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     paddingHorizontal: 10,
//   },
//   editButton: {
//     backgroundColor: '#30A9C7',
//     padding: 10,
//     borderRadius: 5,
    
//   },
//   editButtonText: {
//     color: 'white',
//     fontSize: 18,
//   },
//   logoutButton: {
//     backgroundColor: 'red',
//     padding: 10,
//     borderRadius: 5,
//   },
//   logoutButtonText: {
//     color: 'white',
//     fontSize: 18,
//   },
//   messageButton: {
//     backgroundColor: 'green',
//     padding: 10,
//     borderRadius: 5,
//   },
//   info: {
//     color: '#fff',
//     fontSize: 25,
//     marginBottom: 20,
//     fontFamily: 'impact'
//   },
//   videoContainer: {
//     width: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   videoWrapper: {
//     width: '100%',
//     height: '100%',
//   },
//   video: {
//     flex: 1,
//   },
//   introVideoNotUploaded: {
//     fontSize: 18,
//     color: '#fff',
//     height:'100%',
    
//   },
//   hrLine: {
//     borderBottomColor: '#fff',
//     borderBottomWidth: 1,
//     width: '100%',
//     marginBottom: 20,
//   },
//   serviceLabel: {
//     marginLeft: 25,
//     marginTop: 20,
//     color: '#fff',
//     fontSize: 23,
//     fontFamily: 'impact',
//     paddingBottom: 10,
//   },
//   servicesContainer: {
//     width: '100%',
//     paddingHorizontal: 20,
//     display: 'flex',
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'flex-start',
//   },
//   serviceBox: {
//     padding: 5,
//     marginBottom: 10,
//     backgroundColor: 'gray',
//     borderRadius: 5,
//     marginRight: 10,
//   },
//   services: {
//     color: '#fff',
//   },
//   aboutContainer: {
//     paddingHorizontal: 20,
//     marginBottom: 20,
//   },
//   aboutText: {
//     fontSize: 16,
//     color: '#fff',
//   },
// });

// export default Profile;
