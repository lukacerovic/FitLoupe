import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, RefreshControl, Dimensions } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const MyFitWall = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const currentUser = firebase.auth().currentUser;
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers();
    setRefreshing(false);
  };

    const fetchUsers = async () => {
      try {
        const invitesSnapshot = await firebase
          .firestore()
          .collection('invites')
          .get();
  
        const usersData = [];
        console.log("Invites Snapshot", invitesSnapshot);
        for (const inviteDoc of invitesSnapshot.docs) {
          const inviteData = inviteDoc.data();
         
          // Provera vrednosti invitedCoach
          if (inviteData.invitedCoach === currentUser.uid || inviteData.inviteSender === currentUser.uid) {
           
            const inviteStatus = inviteData.inviteStatus;
            
            if(inviteData.inviteSender === currentUser.uid && inviteData.inviteStatus === 1){
                resultId = inviteData.invitedCoach;
                
            }
            else{
                if (inviteData.inviteSender === currentUser.uid && inviteData.inviteStatus === 0){
                  resultId = 0;
                }
                else{
                  resultId = inviteData.inviteSender;
                  
                }
                
            }
            //console.log("Rezultat id", resultId);
            if (resultId != 0){
              const userDoc = await firebase
                .firestore()
                .collection('users')
                .doc(resultId)
                
                .get();
  
              if (userDoc.exists) {
                const user = userDoc.data();
                user.userId = resultId;
                user.inviteStatus = inviteStatus;
                user.wall = inviteDoc.id;
                
                usersData.push(user);
                
                
              }
            }
              
          }
        }
        console.log(usersData)
        setUsers(usersData);
        
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    useEffect(() => {
      fetchUsers();
    }, [currentUser]);

  const handleAccept = async (userId) => {
    try {
      const invitesSnapshot = await firebase
        .firestore()
        .collection('invites')
        .where('invitedCoach', '==', currentUser.uid)
        .where('inviteSender', '==', userId)
        .get();
  
      if (!invitesSnapshot.empty) {
        const inviteDoc = invitesSnapshot.docs[0].ref;
        await inviteDoc.update({ inviteStatus: 1 });
  
     
      }
      fetchUsers();
    } catch (error) {
      console.error('Error accepting invite:', error);
    }
    navigation.navigate('Main', { refreshInvites: true });
  };

  const handleDecline = async (userId) => {
    try {
      const invitesSnapshot = await firebase
        .firestore()
        .collection('invites')
        .where('invitedCoach', '==', currentUser.uid)
        .where('inviteSender', '==', userId)
        .get();
  
      if (!invitesSnapshot.empty) {
        const inviteDoc = invitesSnapshot.docs[0].ref;
        await inviteDoc.delete();
 
      }
      fetchUsers();
    } catch (error) {
      console.error('Error declining invite:', error);
    }
    navigation.navigate('Main', { refreshInvites: true });
  };

  return (
    <ScrollView style={{backgroundColor:'#181818'}} refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }>
      <View style={styles.container}>
        {users.length > 0 ? (
          users.map((user) => (
            <TouchableOpacity
              key={user.userId}
              style={styles.contactContainer}
              onPress={() => {
                if (user.inviteStatus === 1) {
                  navigation.navigate('FitWallContent', { id: user.userId, wall: user.wall });
                }
                
              }}
            >
              <View style={styles.userInfo}>
                <View style={styles.userImgWrapper}>
                  <Image source={{ uri: user?.profileImageURL }} style={styles.userImg} />
                </View>
                <View style={styles.textSection}>
                  <View style={styles.userInfoText}>
                    <Text style={{ fontFamily: 'impact', fontSize: dynamicFontSize(4), fontWeight: 'bold', color:'#fff', }}>
                      {user.firstName} {user.lastName}
                    </Text>
                    {user.inviteStatus === 0 ? (
                      <View style={styles.buttonContainer}>
                        <TouchableOpacity
                          style={styles.acceptButton}
                          onPress={() => handleAccept(user.userId)}
                        >
                          <MaterialCommunityIcons name="check-bold" size={30} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.declineButton}
                          onPress={() => handleDecline(user.userId)}
                        >
                          <MaterialCommunityIcons name="close-thick" size={30} color="#fff" />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.proceedButton}
                        onPress={() => {
                          navigation.navigate('FitWallContent', { id: user.userId, wall: user.wall });
                        }}
                      >
                        <Text style={styles.buttonText}>Proceed</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noFitWallsText}>You don't have FitWalls yet</Text>
        )}
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
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#181818',
    paddingTop: 20,
  },
  contactContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#3F3F3F",
    borderRadius: 30,
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userImgWrapper: {
    paddingTop: 15,
    paddingBottom: 15,
  },
  userImg: {
    width: deviceWidth * 0.20,
    height: deviceWidth * 0.20,
    borderRadius: dynamicFontSize(10),
    borderWidth: 1,
    borderColor: 'cyan',
  },
  textSection: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  userInfoText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    
  },
 
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 5,
    paddingHorizontal: 5,
  },
  acceptButton: {
    backgroundColor: 'green',
    padding: 7,
    marginRight: 22,
    borderRadius: 50,
  },
  declineButton: {
    backgroundColor: 'red',
    padding: 7,
    borderRadius: 50,
  },
  proceedButton: {
    backgroundColor: '#5ce1e6',
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 5,
    borderRadius: dynamicFontSize(2),
  },
  buttonText: {
    color: '#181818',
    fontWeight: 'bold',
    fontSize:dynamicFontSize(3),
  },
  noFitWallsText: {
    textAlign: 'center',
    marginTop: 200,
    fontSize: dynamicFontSize(5),
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default MyFitWall;
