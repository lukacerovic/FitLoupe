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
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CheckBox } from 'react-native-elements';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Feed = ({ navigation }) => {
  const [coaches, setCoaches] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [likedCoaches, setLikedCoaches] = useState({});
  const [searchText, setSearchText] = useState('');

  const handleToggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleCheckboxChange = (filterValue) => {
    const isChecked = selectedFilters.includes(filterValue);

    if (isChecked) {
      setSelectedFilters(selectedFilters.filter((filter) => filter !== filterValue));
    } else {
      setSelectedFilters([...selectedFilters, filterValue]);
    }
  };

  const fetchCoaches = async () => {
    try {
      let query = firebase.firestore().collection('users').where('userType', '==', 'Coach');

      if (selectedFilters.length > 0) {
        query = query.where('services', 'array-contains-any', selectedFilters);
      }

      const querySnapshot = await query.get();
      let coachesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      const user = firebase.auth().currentUser;
      const likedCoachesData = {};

      for (const coach of coachesData) {
        const likeId = [user?.uid, coach.id].sort().join('_');
        const findLikeRecord = await firebase.firestore().collection('likes').doc(likeId).get();
        const liked = findLikeRecord.exists;
        likedCoachesData[coach.id] = liked;
      }

      // Filter coachesData based on searchText
      if (searchText) {
        const lowerCaseSearchText = searchText.toLowerCase();
        coachesData = coachesData.filter((coach) => {
          const firstNameLower = coach.firstName.toLowerCase();
          const lastNameLower = coach.lastName.toLowerCase();
          return firstNameLower.includes(lowerCaseSearchText) || lastNameLower.includes(lowerCaseSearchText);
        });
      }

      setLikedCoaches(likedCoachesData);
      setCoaches(coachesData);
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
        const updatedLikedCoaches = { ...likedCoaches, [id]: false };
        setLikedCoaches(updatedLikedCoaches);
      }
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, [selectedFilters, searchText]);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Find a coach by name and last name"
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#fff"
          />
          <TouchableOpacity>
            <MaterialCommunityIcons name="magnify" size={30} color="#5ce1e6" style={styles.searchIcon} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleToggleModal} style={styles.filterButton}>
          <MaterialCommunityIcons name="account-filter-outline" size={50} color="#5ce1e6" />
        </TouchableOpacity>
      </View>
      <Modal visible={isModalVisible} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={handleToggleModal}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select filters:</Text>
              <ScrollView>
                <CheckBox
                  title="Crossfit Coach"
                  checked={selectedFilters.includes('Crossfit')}
                  onPress={() => handleCheckboxChange('Crossfit')}
                />
                <CheckBox
                  title="Personal Coach"
                  checked={selectedFilters.includes('Personal')}
                  onPress={() => handleCheckboxChange('Personal')}
                />
                <CheckBox
                  title="Fitnes"
                  checked={selectedFilters.includes('Fitnes')}
                  onPress={() => handleCheckboxChange('Fitnes')}
                />
                <CheckBox
                  title="Yoga"
                  checked={selectedFilters.includes('Yoga')}
                  onPress={() => handleCheckboxChange('Yoga')}
                />
                <CheckBox
                  title="Nutritionist"
                  checked={selectedFilters.includes('Nutritionist')}
                  onPress={() => handleCheckboxChange('Nutritionist')}
                />
                <CheckBox
                  title="Pilates"
                  checked={selectedFilters.includes('Pilates')}
                  onPress={() => handleCheckboxChange('Pilates')}
                />
              </ScrollView>
              <Button title="Apply" onPress={handleToggleModal} />
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </Modal>

      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {selectedFilters.length > 0 && coaches.length === 0 ? (
          <Text>No results</Text>
        ) : (
          coaches.map((coach) => {
            if (coach.id === firebase.auth().currentUser?.uid) {
              return null; // Preskoči prikaz profila ulogovanog korisnika
            }
            return (
              <View key={coach.id} style={styles.itemContainer}>
                <Image source={{ uri: coach?.profileImageURL }} style={styles.profileImage} />
                <View style={styles.profileContainer}>
                  <View style={styles.infoContainer}>
                    <Text style={styles.name}>{coach.firstName} {coach.lastName}</Text>
                    <Text style={styles.info}>{coach.gender} / {coach.country}</Text>
                    <Text style={styles.info}>Price: {coach.price}</Text>
             
                    <Text style={styles.info}>Services: </Text>
                    <View style={styles.servicesContainer}>
                      {coach?.services &&
                        coach.services.map((service, index) => (
                          <View style={styles.serviceBox} key={index}>
                            <Text style={styles.services}>{service}</Text>
                          </View>
                        ))}
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.likeButton}
                    onPress={() => handleLiked(coach.id)}
                  >
                    <MaterialCommunityIcons
                      name="heart"
                      size={30}
                      color={likedCoaches[coach.id] ? 'red' : '#fff'}
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
            );
          })
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'gray',
    borderRadius: 10,
    marginRight: 10,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#fff',
    paddingLeft: 5,
  },
  searchIcon: {
    marginLeft: 5,
  },
  filterButton: {
    padding: 1,
  },
  filterButton: {
    padding: 1,
  },
  filterButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    height: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
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
    marginBottom: 20,
  },
  infoContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  name: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'impact'
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
    color: '#fff',
    
  },
  servicesContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  serviceBox: {
    padding: 5,
    marginBottom: 10,
    backgroundColor: 'gray',
    borderRadius: 5,
    marginRight: 3,
  },
  services: {
    color: '#fff',
  },
  likeButton: {
    padding: 10,
    marginTop: 120,
  },
  viewProfileButton: {
    backgroundColor: '#5ce1e6',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#181818',
    marginTop: 120,
  },
  viewProfileButtonText: {
    color: '#181818',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
});

export default Feed;

