import { View, Text, TextInput, Image, ScrollView, FlatList,Alert, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Carousel from 'react-native-snap-carousel';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function HomeScreen({ navigation }) {
  const categories = ["Fitnes", "Personal", "CrossFit", "Yoga", "Pilates"];


  const logoImage = require('../assets/whiteLogoVector.png');
  const [carouselData, setCarouselData] = useState([]);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const flatListRef = useRef(null);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchText, setSearchText] = useState('');
  const usersRef = firebase.firestore().collection('users');

  // Funkcija za pretragu korisnika
  const searchUsers = async (query) => {
      if (query !== '')
      {
        try {
          const capitalizedQuery = query.charAt(0).toUpperCase() + query.slice(1).toLowerCase();
          const snapshot = await usersRef.where('firstName', '>=', capitalizedQuery)
            .where('firstName', '<=', capitalizedQuery + '\uf8ff')
            .get();

          const users = [];
          snapshot.forEach((doc) => {
            const userData = doc.data();
            userData.id = doc.id;
            users.push(userData);
          });

          setSearchResults(users);
        } catch (error) {
          console.error('Greška prilikom pretrage korisnika:', error);
        }
      }
    
  };
  useEffect(() => {
    if (!searchText) {
      // Ako je polje za pretragu prazno, postavite sve vrednosti na početne
      setSearchResults([]);
      setSelectedUser(null);
      setSearchText('');
    }
  }, [searchText]);
  
  // Postavljanje punog imena korisnika u polje za pretragu kada se izabere
  useEffect(() => {
    if (selectedUser) {
      setSearchText(`${selectedUser.firstName} ${selectedUser.lastName}`);
    }
    
  }, [selectedUser]);

//DEO ZA PRIKAZ TRENERA U CAROUSEL FORMI NA OSNOVU SELEKTOVANOG SERVICA

  // useEffect(() => {
  //   const activeIndex = categories.indexOf(activeCategory);
  //   flatListRef.current.scrollToIndex({ animated: true, index: activeIndex });
  // }, [activeCategory]);

  // const renderCategoryItem = ({ item }) => {
  //   const isActive = item === activeCategory;
  //   const activeTextClass = isActive ? 'text-white' : 'text-gray-700';
  //   const itemStyle = isActive ? [styles.categoryItem, styles.activeCategoryItem] : styles.categoryItem;

  //   return (
  //     <TouchableOpacity
  //       onPress={() => setActiveCategory(item)}
  //       style={itemStyle}
  //     >
  //       <Text style={[styles.categoryText, activeTextClass]}>
  //         {item}
  //       </Text>
  //     </TouchableOpacity>
  //   );
  // };
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const querySnapshot = await firebase
  //         .firestore()
  //         .collection('users')
  //         .where('services', 'array-contains', activeCategory)
  //         .get();
          
  //       const userData = [];
  //       querySnapshot.docs.forEach((doc) => {
  //         const data = doc.data();
  //         data.id = doc.id;
         
  //         userData.push(data);
          
  //       });
        
  //       setCarouselData(userData);
       
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };
  
  //   fetchData();
  // }, [activeCategory]);

  // const renderCarouselItem = ({ item }) => {
  
  //   return (
     
  //       <View style={styles.carouselItem}>
        
  //         {Array.isArray(item) ? (
  //           item.map((user, index) => (
  //             <TouchableOpacity onPress={() => navigation.navigate('HomeProfile', { id: user.id })}>
  //               <View key={index} style={{ alignItems: 'center', padding: 10 }}>
  //                 {user.profileImageURL ? (
                    
  //                   <Image
  //                     source={{ uri: user?.profileImageURL }}
  //                     style={styles.carouselImage}
  //                   />
  //                 ) : (
  //                   <Image
  //                     source={require('/Users/lukacerovic/FitLoupe/assets/trener2.jpeg')}
  //                     style={styles.carouselImage}
  //                   />
  //                 )}
          
  //                 <Text style={styles.userName}>{user.firstName} {user.lastName} </Text>
              
  //               </View>
  //             </TouchableOpacity>
  //           ))
  //         ) : (
  //           <TouchableOpacity onPress={() => navigation.navigate('HomeProfile', { id: item.id })}>
  //             <View style={{ alignItems: 'center', padding: 10 }}>
  //               {item.profileImageURL ? (
  //                 <Image
  //                   source={{ uri: item.profileImageURL }}
  //                   style={styles.carouselImage}
  //                 />
  //               ) : (
  //                 <Image
  //                   source={require('/Users/lukacerovic/FitLoupe/assets/trener2.jpeg')}
  //                   style={styles.carouselImage}
  //                 />
  //               )}
              

  //               <Text style={styles.userName}>{item.firstName} {item.lastName}</Text>

              
  //             </View>
  //           </TouchableOpacity>
  //         )}
  //         <View style={styles.logoContainer}>
  //           <View style={styles.logoImage}>
  //             <Image source={logoImage} style={styles.logoImageBackground} />
  //           </View>
  //         </View>
  //       </View>

  //   );
  // };

  return (
    <ScrollView style={{ backgroundColor: '#181818' }}>
      <View>
        <Image
          source={require('../assets/Landing9.jpeg')}
          style={styles.headerImage}
        />
        <View style={{ position:'absolute', alignSelf:'center', top:-dynamicFontSize(6.8) }}>
          <Image source={require('../assets/whiteLogoVector.png')} style={styles.logo} />
        </View>
         
      </View>
      <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            value={searchText}
            placeholder="Find a user or coach by name..."
            placeholderTextColor='grey'
            onChangeText={(query) => {
              setSearchText(query);
              searchUsers(query);
            }}
          />
          <TouchableOpacity onPress={() => {
            if (selectedUser) {
              if (selectedUser.userType == 'Trainee'){
                navigation.navigate('UserProfile', { id: selectedUser.id }); 
                setSearchText(''); 
              }
              else{
                navigation.navigate('HomeProfile', { id: selectedUser.id }); 
                setSearchText(''); 
              }
              
            }
            else{
              Alert.alert('Please select the desired user after searching');
            }
          }}>
            <MaterialCommunityIcons name="magnify" size={dynamicFontSize(8.8)} color="#5ce1e6" style={styles.searchIcon} />
          </TouchableOpacity>
          
        </View>
        <View style={styles.searchResultsContainer}>
        {searchResults.length > 0 && (
          <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', marginTop: 10, }}>
            {searchResults.map((user, index) => (
              <TouchableOpacity
                key={`${user.uid}-${index}`} //izbacivao mi je gresku kad je samo key={user.uid}
                style={{ flexDirection: 'row', alignSelf:'flex-start', alignItems: 'center', marginBottom: 10 }}
                onPress={() => {
            
                  setSelectedUser(user);
                 // setMentionedFor(user.firstName + ' ' + user.lastName);
                  setSearchResults([]);
                }}
              >
                
                <Image
                  source={{ uri: user.profileImageURL }}
                  style={{ width: deviceWidth * 0.12, height: deviceWidth * 0.12, borderRadius: dynamicFontSize(10),borderWidth:1,borderColor: "cyan", marginRight: dynamicFontSize(3.8) }}
                />
                
                <Text style={{ color:'white', fontSize: dynamicFontSize(4.8) }}>{user.firstName} {user.lastName}</Text>
                <Text style={{paddingLeft:10, fontSize: dynamicFontSize(3.8), color:'#fff'}}>({user.userType})</Text>
              </TouchableOpacity>
              
            ))}
            
          </View>
        )}
      </View>
      {/* <SafeAreaView> */}
        {/* deo za prikaz trenera po kategorijama */}
        {/* <View style={{ marginTop: 23, paddingHorizontal: 10, marginBottom: 5 }}>
          <View style={{ paddingHorizontal: 10, paddingVertical: 30 }}>
            <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', fontFamily: 'Impact' }}>
              Top By Services
            </Text>
          </View>
          <FlatList
            ref={flatListRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item, index) => index.toString()}
          />
          <Carousel
            containerCustomStyle={{ overflow: 'visible' }}
            inactiveSlideOpacity={0.75}
            inactiveSlideScale={0.77}
            sliderWidth={350}
            itemWidth={260}
            slideStyle={{ display: 'flex', alignItems: 'center' }}
            data={carouselData}
            renderItem={renderCarouselItem}
          />
          
        </View> */}
        
      {/* </SafeAreaView> */}

      

      <Text style={{color:'#fff', fontSize: dynamicFontSize(7.8), fontFamily: 'impact', marginLeft: dynamicFontSize(4.8), marginTop: dynamicFontSize(8), }}>New Era Of Training</Text>
      <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', flex: 1, marginTop:dynamicFontSize(8), marginBottom: dynamicFontSize(6)}}>
        <Image source={require('../assets/AboutDetail1.png')} style={{ width: deviceWidth * 0.95, height: deviceHeight * 0.88, position: 'relative', }}/>
        {/* <Text style={styles.fitText}> 
          <Text style={{color:'#5ce1e6'}}>FitLoupe</Text> aims to connect users with highly skilled trainers, regardless of their location or workplace. 
          With our app, establishing collaboration with top-notch trainers has never been easier. 
          Say goodbye to the traditional and time-consuming process of finding and contacting trainers. 
          FitLoupe revolutionizes the way users connect with trainers, making it effortless to establish a partnership for achieving their fitness goals.
        
        </Text> */}
      </View>
      <View style={{ width: '100%', alignItems: 'flex-start', justifyContent: 'center', flex: 1, position:'relative', top:10, }}>
        <Image source={require('../assets/iphone3.png')} style={{ marginLeft:dynamicFontSize(1),width: deviceWidth * 1, height: deviceWidth * 1.7, resizeMode: 'cover' }} />
        <Text style={styles.iphoneText}>
        FitLoupe is a game-changing platform designed to simplify and enhance the way fitness professionals manage their clients and workouts. 
        With FitLoupe, trainers can effortlessly track their clients' progress, efficiently organize training sessions, and gain ability to maintain and communicate with their clients more easily. 
      
        </Text>
        <Text style={styles.iphoneText}>
        FitLoupe's <Text style={{color:'#5ce1e6'}}>"Fit Wall"</Text> enables trainers and clients in separate locations to collaborate effortlessly. 
        Trainers create personalized workout plans, which clients can access remotely. 
        This feature ensures a seamless fitness partnership, bridging the gap between distance and achieving fitness goals. 
        Embrace the convenience of Fit Wall for efficient and empowering fitness collaboration.
        </Text>
      </View> 
    </ScrollView>
  );
}
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const dynamicFontSize = (percentage) => {
  return (deviceWidth * percentage) / 100;
};

const styles = StyleSheet.create({
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
    alignSelf: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 50,
    
    marginRight: 10,
    paddingHorizontal: 10,
    paddingVertical:10,
    width:'80%',
  },
  searchInput: {
    paddingLeft: 10,
    alignItems: 'center',
    fontSize: dynamicFontSize(2.8),
    width:'80%',
    color:'black',
  },
  searchIcon: {
    marginLeft: 5,
    alignSelf: 'center',
    alignItems:'center',
    justifyContent:'center',

  },
  searchResultsContainer: {
    position: 'relative',
    top:10, // Prilagodite ovu vrijednost kako biste postigli željeni raspored
    left: 50,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    zIndex: 1000,
  },
  categoryItem: {
    padding: 4,
    paddingHorizontal: 20,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    marginRight: 8,
  },
  activeCategoryItem: {
    backgroundColor: '#5ce1e6',
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  carouselItem: {
    width: 250,
    height: 350,
    position: 'relative',
    marginTop: 80,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 40,
 
  },
  userName: {
    color: '#fff',
    position: 'absolute',
    bottom:0,
    fontSize: 31,
    fontFamily: 'impact',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
  },
  logoContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    top: -180,
  },
  logoImage: {
    width: '75%',
    height: '65%',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
  },
  logoImageBackground: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerImage: {
    width: '100%',
    height: deviceHeight * 0.35,
    resizeMode: 'cover',
    opacity: 0.8,
    zIndex: -1,
  },
  logo: {
    width: deviceWidth * 0.55,
    height: deviceWidth * 0.55,
    resizeMode: 'contain',
  },
  fitText: {
    color: '#fff',
    fontSize: dynamicFontSize(4.8),
    fontFamily: 'impact',
    textAlign: 'center',
    width: '90%',
    textAlign: 'center',
    justifyContent: 'center',
    position: 'relative',
    top:-150,  
  },
  iphoneText: {
    color: '#fff',
    paddingTop: dynamicFontSize(6),
    fontSize: dynamicFontSize(4.8),
    fontFamily: 'impact',
    textAlign: 'center',
    paddingHorizontal: dynamicFontSize(4.8),
    marginBottom:dynamicFontSize(3),
  },
});





