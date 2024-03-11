import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  Button,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CheckBox } from 'react-native-elements';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const useInterval = (callback, delay) => {
  const savedCallback = React.useRef();

  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    const tick = () => {
      savedCallback.current();
    };
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

const MyFavorites = ({ navigation }) => {
  const [coaches, setCoaches] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [likedCoaches, setLikedCoaches] = useState({});

  const handleToggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const fetchCoaches = async () => {
    try {
      const user = firebase.auth().currentUser;
      const likedCoachesData = {};

      if (user) {
        const likedCoachesSnapshot = await firebase.firestore().collection('likes')
          .where('likeOwner', '==', user.uid)
          .get();

        likedCoachesSnapshot.forEach((doc) => {
          const likedCoachId = doc.data().likedCoach;
          likedCoachesData[likedCoachId] = true;
        });

        const coachesSnapshot = await firebase.firestore().collection('users')
          .where('userType', '==', 'Coach')
          .get();

        const coachesData = coachesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        // Filtriraj samo lajkovane profile
        const favoriteCoaches = coachesData.filter((coach) => likedCoachesData[coach.id]);
        setCoaches(favoriteCoaches);
      }

      setLikedCoaches(likedCoachesData);
    } catch (error) {
      console.log('Error getting coaches:', error);
    }
  };

  const handleLiked = async (id) => {
    const user = firebase.auth().currentUser;
    const likeId = [user?.uid, id].sort().join('_');

    if (user && id) {
      const findLikeRecord = await firebase.firestore().collection('likes').doc(likeId).get();

      if (!findLikeRecord.exists) {
        await firebase
          .firestore()
          .collection('likes')
          .doc(likeId)
          .set({
            likedCoach: id,
            likeOwner: user.uid,
          })
          .catch((error) => {
            console.log('Error liking a profile:', error);
          });
        const updatedLikedCoaches = { ...likedCoaches, [id]: true };
        setLikedCoaches(updatedLikedCoaches);
      } else {
        await firebase.firestore().collection('likes').doc(likeId).delete();
        const updatedLikedCoaches = { ...likedCoaches };
        delete updatedLikedCoaches[id];
        setLikedCoaches(updatedLikedCoaches);

        // Ukloni profil iz liste coaches
        setCoaches(coaches.filter((coach) => coach.id !== id));
      }
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, []);

  useInterval(() => {
    fetchCoaches();
  }, 10000); // Osvežava svakih 10 sekundi (10000 ms)

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {coaches.length === 0 ? (
          <Text style={styles.noFavoritesText}>You don't have favorite coaches</Text>
        ) : (
          coaches.map((coach) => (
            <View key={coach.id} style={styles.itemContainer}>
              <Image source={{ uri: coach?.profileImageURL }} style={styles.profileImage} />
              <View style={styles.profileContainer}>
                <View style={styles.infoContainer}>
                  <Text style={styles.name}>
                    {coach.firstName} {coach.lastName}
                  </Text>
                  <Text style={styles.info}>Gender: {coach.gender}</Text>
                  <Text style={styles.info}>Price: {coach.price}</Text>
                  <Text style={styles.info}>Country: {coach.country}</Text>
                </View>
                <TouchableOpacity style={styles.likeButton} onPress={() => handleLiked(coach.id)}>
                  <MaterialCommunityIcons
                    name="heart"
                    size={30}
                    color={likedCoaches[coach.id] ? 'red' : 'gray'}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate('HomeProfile', { id: coach.id })}
                  style={styles.viewProfileButton}
                >
                  <Text style={styles.viewProfileButtonText}>View Profile</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818',
    
  },
  scrollViewContainer: {
    flexGrow: 1,
    paddingVertical: 10,
  },
  itemContainer: {
    backgroundColor: '#3A3B3C',
    margin: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 20,
  },
  infoContainer: {
    flex: 1,
    paddingLeft: 30,
    
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  info: {
    fontSize: 14,
    marginBottom: 5,
    color: '#fff',
  },
  likeButton: {
    padding: 10,
    marginTop: 10,
  },
  viewProfileButton: {
    backgroundColor: '#5ce1e6',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#181818',
    marginTop: 10,
  },
  viewProfileButtonText: {
    color: '#181818',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noFavoritesText: {
    textAlign: 'center',
    marginTop: 200,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default MyFavorites;
