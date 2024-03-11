import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { sendNotification } from '../../services/Notification';

const FitWallInitial = ({ navigation, route }) => {
  const [coachInfo, setCoachInfo] = useState(null);
  const [inviteStatus, setInviteStatus] = useState(null);
  const [inviteId, setInviteId] = useState('');
  const user = firebase.auth().currentUser;

  console.log(coachInfo)
  useEffect(() => {
    const fetchCoachInfo = async () => {
      try {
        const coachId = route.params.id;
        if (coachId) {
          const docRef = firebase.firestore().collection('users').doc(coachId);
          const doc = await docRef.get();
          if (doc.exists) {
            setCoachInfo(doc.data());
          }
        }
      } catch (error) {
        console.log('Error fetching coach info:', error);
      }
    };
    fetchCoachInfo();
  }, [route.params?.id]);

  useEffect(() => {
    const checkInviteStatus = async () => {
      try {
        const invitesSnapshot = await firebase
          .firestore()
          .collection('invites')
          .get();

        for (const inviteDoc of invitesSnapshot.docs) {
          const inviteData = inviteDoc.data();
          if (
            (inviteData.invitedCoach === route.params.id && inviteData.inviteSender === user.uid) ||
            (inviteData.inviteSender === route.params.id && inviteData.invitedCoach === user.uid)
          ) {
            setInviteStatus(inviteData.inviteStatus);
            setInviteId(inviteDoc.id);
            return;
          }
        }

        setInviteStatus(null);
      } catch (error) {
        console.log('Error checking invite status:', error);
      }
    };

    if (user && route.params.id) {
      checkInviteStatus();
    }
  }, [user, route.params?.id]);

  const handleInvite = async () => {
    try {
      const inviteId = `${user.uid}_${route.params.id}`;
      
      await firebase.firestore().collection('invites').doc(inviteId).set({
        invitedCoach: route.params.id,
        inviteSender: user.uid,
        inviteStatus: 0,
      });
      if(coachInfo.fcm){
        const fcm = coachInfo.fcm ;
        sendNotification(
          fcm ,
          "Fit Loupe",
          `You just receive a request on Fit Wall` //should be sender name 
          // place for text of a meesage to pas for text value in notifications
        )
      }
      setInviteStatus(0);
    } catch (error) {
      console.log('Error handling invite:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const inviteId = `${user.uid}_${route.params.id}`;
      await firebase.firestore().collection('invites').doc(inviteId).delete();
      setInviteStatus(null);
    } catch (error) {
      console.log('Error deleting invite:', error);
    }
  };

  const handleProceed = () => {
    navigation.navigate('FitWallContent');
  };

  return (
    
      <ImageBackground
        source={require('../assets/FitWallInitial.jpeg')}
        style={styles.backgroundImage}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.headerText}>Fit Wall</Text>
          <View style={styles.overlay}>
            <View style={styles.overlayContent}>
              <Text style={styles.text}>
              Fit Wall allows trainers to quickly and easily customize workouts for their clients.
              </Text>
              <View style={styles.subsection}>
                <Text style={styles.subsectionTitle}>Step 1:</Text>
                <Text style={styles.subsectionText}>
                Sending a request to create a wall with the selected user. Upon acceptance, Fit Wall becomes the central place for interaction.
                </Text>
              </View>
              <Text style={styles.text}>
              Each trainer-client pair has their private wall, keeping all workouts in one place.
              </Text>
              <View style={styles.subsection}>
                <Text style={styles.subsectionTitle}>Over 500+ Exercises.</Text>
                <Text style={styles.subsectionText}>
                Along with a wide range of exercises to create workouts, trainers can send helpful videos stored in a shared gallery for easy access.
                </Text>
              </View>
              <View style={styles.subsection}>
                <Text style={styles.subsectionTitle}>It's important what they say.</Text>
                <Text style={styles.subsectionText}>
                After each workout they complete, clients can provide feedback, allowing trainers to gain insight into the client's condition and needs.
                </Text>
              </View>
              <Text style={styles.text}>
              Welcome to future of training. <Text style={styles.textHighlight}>Fit Wall</Text> it enables trainers and clients to achieve better results together, quickly and easily.
              </Text>
            </View>
            <View style={styles.inviteButtonContainer}>
              {inviteStatus === null ? (
                <TouchableOpacity
                  style={[styles.inviteButton, { backgroundColor: '#5ce1e6' }]}
                  onPress={handleInvite}
                >
                  <Text style={[styles.inviteButtonText, { color: 'white' }]}>
                  {coachInfo ? `Invite ${coachInfo.firstName} ${coachInfo.lastName}` : 'Invited'}

                  </Text>
                </TouchableOpacity>
              ) : inviteStatus === 0 ? (
                <TouchableOpacity
                  style={[styles.inviteButton, { backgroundColor: 'gray' }]}
                  onPress={handleDelete}
                >
                  <Text style={[styles.inviteButtonText, { color: 'white' }]}>Invited</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.inviteButton, { backgroundColor: '#5ce1e6' }]}
                  onPress={() => navigation.navigate('FitWallContent', { wall: inviteId })}
                >
                  <Text style={[styles.inviteButtonText, { color: 'white' }]}>Proceed</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          </ScrollView>
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
  headerText: {
    fontSize: dynamicFontSize(11),
    fontFamily: 'impact',
    color: '#fff',
    alignSelf: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.85)',
    textShadowOffset: { width: 9, height: 10 },
    textShadowRadius: 5,
    marginBottom: 20,
    marginTop:dynamicFontSize(22),
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    height: 'auto', // Auto height to fit content
    width: '95%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom:80,
  },
  overlayContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  text: {
    fontSize: dynamicFontSize(4.5),
    marginBottom: dynamicFontSize(3),
    color: 'white',
    textAlign: 'left',
  },
  subsection: {
    marginBottom: 20,
  },
  subsectionTitle: {
    fontFamily: 'impact',
    fontSize: dynamicFontSize(6),
    color: '#5ce1e6',
    paddingRight: 8,
    alignSelf: 'flex-start',
  },
  subsectionText: {
    fontSize: dynamicFontSize(3.5),
    color: 'white',
    textAlign: 'left',
  },
  textHighlight: {
    color: '#5ce1e6',
    fontFamily: 'impact',
  },
  inviteButtonContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  inviteButton: {
    padding: dynamicFontSize(1),
    borderRadius: dynamicFontSize(1),
    alignItems: 'center',
    marginTop: 10,
  },
  inviteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: dynamicFontSize(4.5),
  },
  scrollViewContent: {
    flexGrow: 1,
  },
});

export default FitWallInitial;





// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';
// import 'firebase/compat/firestore';

// const FitWallInitial = ({ navigation, route }) => {
//   const [coachInfo, setCoachInfo] = useState(null);
//   const [inviteStatus, setInviteStatus] = useState(null);
//   const user = firebase.auth().currentUser;

//   useEffect(() => {
//     const fetchCoachInfo = async () => {
//       try {
//         const coachId = route.params.id;
//         if (coachId) {
//           const docRef = firebase.firestore().collection('users').doc(coachId);
//           const doc = await docRef.get();
//           if (doc.exists) {
            
//             setCoachInfo(doc.data());
           
//           }
//         }
//       } catch (error) {
//         console.log('Error fetching coach info:', error);
//       }
//     };
//     fetchCoachInfo();
//   }, [route.params?.id]);

//   useEffect(() => {
//     const checkInviteStatus = async () => {
//       try {
//         const invitesSnapshot = await firebase
//           .firestore()
//           .collection('invites')
//           .get();

//         for (const inviteDoc of invitesSnapshot.docs) {
//           const inviteData = inviteDoc.data();
//           if (
//             (inviteData.invitedCoach === route.params.id && inviteData.inviteSender === user.uid) ||
//             (inviteData.inviteSender === route.params.id && inviteData.invitedCoach === user.uid)
//           ) {
//             setInviteStatus(inviteData.inviteStatus);
//             return; // Prekidamo petlju čim nađemo odgovarajući rezultat
//           }
//         }

//         setInviteStatus(null);
//       } catch (error) {
//         console.log('Error checking invite status:', error);
//       }
//     };

//     if (user && route.params.id) {
//       checkInviteStatus();
//     }
//   }, [user, route.params?.id]);

//   const handleInvite = async () => {
//     try {
//       const inviteId = `${user.uid}_${route.params.id}`;
//       await firebase.firestore().collection('invites').doc(inviteId).set({
//         invitedCoach: route.params.id,
//         inviteSender: user.uid,
//         inviteStatus: 0,
//       });
//       setInviteStatus(0);
//     } catch (error) {
//       console.log('Error handling invite:', error);
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       const inviteId = `${user.uid}_${route.params.id}`;
//       await firebase.firestore().collection('invites').doc(inviteId).delete();
//       setInviteStatus(null);
//     } catch (error) {
//       console.log('Error deleting invite:', error);
//     }
//   };

//   const handleProceed = () => {
//     navigation.navigate('FitWallContent');
//   };

//   return (
//     <ImageBackground
//       source={require('../assets/936A34DF-5598-4737-9A1B-C35E501AD2DE.jpeg')}
//       style={styles.backgroundImage}
//     >
//       <Text style={styles.headerText}>Fit Wall</Text>
//       <View style={styles.overlay}>
//         <Text style={styles.text}>
//           Fit Wall omogućava trenerima da brzo i lako prilagode treninge svojim klijentima.
//         </Text>
//         <View style={styles.subsection}>
//           <Text style={styles.subsectionTitle}>1 Korak:</Text>
//           <Text style={styles.subsectionText}>
//             Slanje zahteva za formiranje zida sa odabranim korisnikom. Nakon prihvatanja, Fit Wall postaje centralno mesto interakcije. 
//           </Text>
//         </View>
//         <Text style={styles.text}>
//           Svaki par trener-klijent ima svoj privatni zid, čuvajući sve treninge na jednom mestu.
//         </Text>
//         <View style={styles.subsection}>
//           <Text style={styles.subsectionTitle}>Preko 500+ vezbi</Text>
//           <Text style={styles.subsectionText}>
//             Pored velikog broja vezbi za kreiranje treninga, treneri mogu slati korisne video zapise, arhivirane u zajedničkoj galeriji za jednostavan pristup.
//           </Text>
//         </View>
//         <View style={styles.subsection}>
//           <Text style={styles.subsectionTitle}>Bitno je šta oni kažu</Text>
//           <Text style={styles.subsectionText}>
//             Nakon svakog treninga, klijenti mogu pružiti povratne informacije, omogućavajući trenerima prilagodbu prema njihovim potrebama.
//           </Text>
//         </View>
//         <Text style={styles.text}>
//           Dobrodošli u budućnost treninga. <Text style={styles.textHighlight}>Fit Wall</Text> omogućava trenerima i klijentima da zajedno postignu bolje rezultate, brzo i jednostavno.
//         </Text>
        
//           {inviteStatus === null ? (
//             <TouchableOpacity
//               style={[styles.inviteButton, { backgroundColor: '#5ce1e6' }]}
//               onPress={handleInvite}
//             >
//               <Text style={[styles.inviteButtonText, { color: 'white' }]}>
//                 {coachInfo ? `Invite ${coachInfo.firstName} ${coachInfo.lastName}` : 'Invite'}
//               </Text>
//             </TouchableOpacity>
//           ) : inviteStatus === 0 ? (
//             <TouchableOpacity
//               style={[styles.inviteButton, { backgroundColor: 'gray' }]}
//               onPress={handleDelete}
//             >
//               <Text style={[styles.inviteButtonText, { color: 'white' }]}>Invited</Text>
//             </TouchableOpacity>
//           ) : (
//             <TouchableOpacity
//               style={[styles.inviteButton, { backgroundColor: '#5ce1e6' }]}
              
//               onPress={() => navigation.navigate('FitWallContent', {id: route.params?.id})}
//             >
//               <Text style={[styles.inviteButtonText, { color: 'white' }]}>Proceed</Text>
//             </TouchableOpacity>
//           )}
//       </View>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   backgroundImage: {
//     flex: 1,
//     resizeMode: 'cover',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   headerText: {
//     fontSize: 56,
//     fontFamily: 'impact',
//     color: '#fff',
//     textShadowColor: 'rgba(0, 0, 0, 0.85)', // Boja senke
//     textShadowOffset: { width: 9, height: 10 }, // Veličina i pravac senke
//     textShadowRadius: 5, // Radijus senke
//   },
//   overlay: {
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//     padding: 20,
//     marginHorizontal: 5,
//      // Visina od 85% ekrana
//     width: '90%',  // Širina od 90% ekrana
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   text: {
//     fontSize: 19,
//     marginBottom: 10,
//     color: 'white',
//     textAlign: 'center', // Centralno poravnanje teksta
//   },

//   subsection: {
//     marginBottom: 20,
//     alignSelf: 'center',
//   },

//   subsectionTitle: {
//     fontFamily: 'impact',
//     fontSize: 25,
//     color: '#5ce1e6',
//     paddingRight: 8,
//     alignSelf: 'flex-start',
//   },

//   subsectionText: {
//     fontSize: 17,
//     color: 'white',
//     textAlign: 'center', // Centralno poravnanje teksta
//   },
//   textHighlight: {
//     color: '#5ce1e6',
//     fontFamily: 'impact',
//   },
//   inviteButton: {
//     padding: 10,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginTop:10,
//   },
//   inviteButtonText: {
    
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// });

// export default FitWallInitial;
