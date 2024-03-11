import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, Animated, ScrollView, RefreshControl, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const FitWallContent = ({ route, navigation }) => {
  const [user, setUserInfo] = useState(null);
  const [posts, setPosts] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [containerAnimation] = useState(new Animated.Value(0));
  const currentUser = firebase.auth().currentUser;

  const [fitWallDataId, setFitWallDataId] = useState('');
  const [coverVideo, setCoverVideo] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [rating, setRating] = useState(5); 
  const [showRatingMenu, setShowRatingMenu] = useState(false);
  const [descriptionRate, setDescriptionRate] = useState(''); 
  const [refresh, setRefresh] = useState(false);
  const [currentUserType, setUserType] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const [videoList, setVideoList] = useState([]);

  const scrollViewRef = useRef(null);


  const onRefresh = () => {
    // Postavite ref na dno ScrollView
    fetchPosts()
    scrollViewRef.current.scrollToEnd();
    // Ovde dodajte kod za osvežavanje podataka
  };
  


  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes} LT (${day}/${month}/${year})`;
  };
 

  useEffect(() => {
    const fetchUser = async () => {
      const querySnapshot = await firebase.firestore().collection('users').doc(currentUser.uid).get();
     
      setUserType(querySnapshot.data().userType);
      
      try {
        if (route.params?.id){
          const userDoc = await firebase.firestore().collection('users').doc(route.params.id).get();
          if (userDoc.exists) {
            userDocument = userDoc.data();
            userDocument.id = userDoc.id
            setUserInfo(userDocument);
          }
        }
        
        
      } catch (error) {
        console.error('Error fetching user:', error);
      }
      
    };

    fetchUser();
  }, [route.params?.id]);

  const fetchPosts = async () => {

    const fitWallData = [];
  
    // Dobijte referencu na određeni dokument sa route.params.id
    const docRef = firebase.firestore().collection('fit wall').doc(route.params.wall);
  
    // Pokušajte dobiti dokument
    try {
      const docSnapshot = await docRef.get();
  
      if (docSnapshot.exists) {
        // Ako dokument postoji, dodajte njegove podatke u fitWallData
        fitWallData.push(docSnapshot.data());
        setPosts(fitWallData);
      } else {
        console.log('Dokument sa datim ID-om ne postoji.');
      }
    } catch (error) {
      console.error('Greška prilikom dobijanja dokumenta:', error);
    }
  };
  
  useEffect(() => {
    fetchPosts();
  }, [refresh]);  

  const openModal = () => {
    setIsModalVisible(true);
    Animated.timing(containerAnimation, {
      toValue: 1,
      duration: 400,
      useNativeDriver: false,
    }).start();
  };

  const closeModal = () => {
    setCoverVideo(null); 
    Animated.timing(containerAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setIsModalVisible(false);
    });
  };
  const duplicatePost = async (postId) => {
    Alert.alert(
      'Duplicate Training?',
      'The duplicated version of this training will be added at the bottom of this Fit Wall.',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              if (postId) {
                const docRef = firebase.firestore().collection('fit wall').doc(route.params.wall);
                const docSnapshot = await docRef.get();
                const wallData = docSnapshot.data();
                const resultToDuplicate = wallData[postId];
            
                if (resultToDuplicate) {
                  const newPostId = wallData.postId + 1;
                  const postDate = new Date().toISOString();
            
                  const duplicatedResult = {
                    ...resultToDuplicate,
                    postId: newPostId,
                    postDate: postDate,
                  };
                  await docRef.update({
                    [newPostId]: duplicatedResult,
                  });
            
                  Alert.alert('Success', 'The training has been successfully duplicated.');
                  setRefresh(true);
                }
              }
            } catch (error) {
              console.error('Greška prilikom dupliciranja rezultata u Firestore:', error);
            }
            
          },
        },
      ]
    );
  };
  

  const deletePost = async (postId) => {
    try {
      const docRef = firebase.firestore().collection('fit wall').doc(route.params.wall);
      await docRef.update({
        [postId]: firebase.firestore.FieldValue.delete(),
      });
      Alert.alert('Success', 'The training has been successfully removed.');
      setRefresh(true);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
    setRefresh(false);
  };

  const handleRate = async (postId) => {
    try {
      const docRef = firebase.firestore().collection('fit wall').doc(route.params.wall);
      const postSnapshot = await docRef.get();
      const postData = postSnapshot.data();
  
      if (!postData || !postData.postId) {
        console.error('Post not found');
        return;
      }
      const updateData = {};
  
      if (!postData.rating) {
        updateData[`${postId}.rate`] = rating;
      }
  
      if (!postData.descriptionRate && descriptionRate !== '') {
        updateData[`${postId}.descriptionRate`] = descriptionRate;
      }
      await docRef.update(
        updateData
        );
      setRating(5);
      setDescriptionRate('');
      setSelectedPostId(null);
      setShowRatingMenu(false);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };
  
  return (
    <ScrollView
      style={styles.container}
      ref={scrollViewRef} // Dodajte referencu ovde
      contentInset={{ bottom: 100 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={{alignItems:'center', flexDirection: 'row', justifyContent:'flex-end', paddingTop:dynamicFontSize(3)}}>
          <Icon
            name="account-details"
            size={dynamicFontSize(10)}
            color="#5ce1e6"
            onPress={() => navigation.navigate('ClientInfo', { wall: route.params.wall })}
          />
          <Icon
            name="trending-up"
            size={dynamicFontSize(10)}
            color="#5ce1e6"
            style={{ paddingLeft: dynamicFontSize(8), paddingRight:dynamicFontSize(5) }}
            onPress={() => navigation.navigate('ClientProgress', { wall: route.params.wall })}
          />
        </View>
      <View style={styles.header}>
        
        <View style={styles.headerLeft}>
          <Image style={styles.profileImage} source={{ uri: user?.profileImageURL }} />
          <Text style={styles.name}>
            {user?.firstName} {user?.lastName}
          </Text>
          
        </View>
        
      </View>
      
      <View style={styles.buttonsContainer}>
     
        {currentUserType === 'Coach' && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('FitWall', { wall: route.params?.wall, client:user?.id })}
          >
            <Text style={styles.buttonText}>Create Training</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('FitWallVideoGalery', { wall: route.params?.wall })}
          >
            <Text style={styles.buttonText}>Video Gallery</Text>
          </TouchableOpacity>
      </View>

      <View style={styles.postsContainer}>
        <View  style={{ flex: 1 }} 
        
        >
          {posts && posts.length > 0 ? (
            Object.keys(posts[0]).map((postId) => {
              const post = posts[0][postId];
              if (!post || typeof post !== 'object' || !post.exerciseNames || !post.exerciseNames.length) {
                return null;
              }

              const description = post.description ? (
                <Text style={styles.postDescription}>{post.description}</Text>
              ) : null;

              return (
                <View key={postId} style={styles.postContainer}>
                  <View style={styles.logoContainer}>
                    <Image source={require('../assets/whiteLogoVector.png')} style={styles.logo} />
                    <Text style={styles.timePrint}>{formatDate(post.postDate)}</Text>
                  </View>
                  <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, {textAlign: 'left',paddingStart:deviceWidth*0.01}]}>Block</Text>
                    <Text style={[styles.tableHeaderText, {textAlign: 'left', paddingLeft:deviceWidth*0.06}]}>Exercise</Text>
                    <Text style={[styles.tableHeaderText, {paddingLeft:deviceWidth*0.12}]}>Kg</Text>
                    <Text style={[styles.tableHeaderText, {paddingLeft:deviceWidth*0.06}]}>Reps</Text>
                    <Text style={[styles.tableHeaderText, {paddingLeft:deviceWidth*0.05}]}>Sets</Text>
                    <Text style={[styles.tableHeaderText, {paddingLeft:deviceWidth*0.05}]}>Rest</Text>
                    
                    <Text style={[styles.tableHeaderText, {paddingLeft:dynamicFontSize(4)}]}>Tempo</Text>
                  </View>
                  <View style={styles.postRow}>
                    <View style={styles.columnContainer}>
                      <View style={[styles.column, {width:'10%'}]}>
                      {post.blockExercises
                        ? Object.values(post.blockExercises).map((value, index) => (
                            <Text key={index} style={styles.columnValue}>
                              {value}
                            </Text>
                          ))
                        : Object.values(post.exerciseNames).map((value, index) => (
                            <Text key={index} style={styles.columnValue}>
                              A{index+1}
                            </Text>
                          ))} 
                        
                      </View>
                      <View style={[styles.column, { width:'27%'}]}>
                        {post.exerciseNames && Object.values(post.exerciseNames).map((value, index) => (
                          <Text key={index} style={[styles.columnValue, {textAlign:'left', alignSelf:'flex-start', paddingLeft:dynamicFontSize(2)}]}>
                            {value.charAt(0).toUpperCase() + value.slice(1)}
                          </Text>
                        ))}
                      </View>
                      <View style={[styles.column, {width:'12.5%'}]}>
                        {post.intensities && Object.values(post.intensities).map((value, index) => (
                          <Text key={index} style={styles.columnValue}>
                            {value}
                          </Text>
                        ))}
                      </View>
                      <View style={[styles.column, {width:'12%'}]}>
                        {post.numberOfRepetitions && Object.values(post.numberOfRepetitions).map((value, index) => (
                          <Text key={index} style={styles.columnValue}>
                            {value}
                          </Text>
                        ))}
                      </View>
                      <View style={[styles.column, {width:'12%'}]}>
                        {post.numberOfSets && Object.values(post.numberOfSets).map((value, index) => (
                          <Text key={index} style={styles.columnValue}>
                            {value}
                          </Text>
                        ))}
                      </View>
                      <View style={[styles.column, {width:'13%'}]}>
                        {post.breakTimes && Object.values(post.breakTimes).map((value, index) => (
                          <Text key={index} style={styles.columnValue}>
                            {value} 
                          </Text>
                        ))}
                      </View>
                      
                      
                      <View style={[styles.column, {width:'14%'}]}>
                        {post.tempos && Object.values(post.tempos).map((value, index) => (
                          <Text key={index} style={styles.columnValue}>
                            {value}
                          </Text>
                        ))}
                      </View>
                    </View>
                    
                  </View>
                  
                  <Text style={styles.descLabel}>Description: </Text>
                  <Text style={{ fontSize: dynamicFontSize(3), paddingHorizontal:dynamicFontSize(2.5), }}>{description}</Text>
                  {/* <Text style={{color:'#fff',}}>{postId}</Text> */}
                  <View style={styles.markAsFinishedContainer}>
                    {((currentUserType === 'Trainee' && !post.rate) || post.rate) && (
                      <TouchableOpacity
                        style={[
                          styles.markAsFinishedButton,
                          post.rate ? styles.finishedButton : null,
                        ]}
                        onPress={() => {
                          setSelectedPostId(postId);
                          setShowRatingMenu(!showRatingMenu);
                        }}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Text style={[
                            styles.markAsFinishedButtonText,
                            (currentUserType === 'Trainee' && !post.rate) ? styles.finishedButtonText : null,
                          ]}>
                            {(currentUserType === 'Trainee' && !post.rate) ? 'Feedback Your Coach' : 'Finished'}
                          </Text>
                          {post.rate && (
                            <Icon
                              name="medal"
                              size={dynamicFontSize(4)}
                              color="#FFD700" // Boja zlatne medalje
                              style={{ marginLeft: 8 }}
                            />
                          )}
                        </View>
                      </TouchableOpacity>
                    )}

                    {showRatingMenu && selectedPostId === postId && (
                      <View style={styles.ratingContainer}>
                        <TouchableOpacity
                          style={styles.closeButton}
                          onPress={() => setShowRatingMenu(false)}
                        >
                          <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>

                        {post.rate ? (
                          <View style={styles.ratingInfoContainer}>
                            <Text style={styles.ratingLabel}>
                              Intensity Rating: {post.rate}
                            </Text>
                            {post.descriptionRate && (
                              <View>
                                <Text style={styles.ratingLabel}>Description:</Text>
                                <Text style={{ color: '#fff', fontSize:dynamicFontSize(4), }}>{post.descriptionRate}</Text>
                              </View>
                            )}
                          </View>
                        ) : (
                          <>
                            <Text style={styles.ratingLabel}>Intensity Rating:</Text>
                            <Text style={{ color: '#fff', fontSize:dynamicFontSize(4.3), marginBottom: 20, paddingTop: 5 }}>
                              (How hard was this training for you)
                            </Text>
                            <View style={styles.ratingButtons}>
                              {Array.from({ length: 10 }, (_, index) => (
                                <TouchableOpacity
                                  key={index}
                                  style={[
                                    styles.ratingButton,
                                    rating === index + 1 && styles.selectedRatingButton,
                                  ]}
                                  onPress={() => setRating(index + 1)}
                                >
                                  <Text style={{ color: '#fff', fontSize:dynamicFontSize(4), }}>{index + 1}</Text>
                                </TouchableOpacity>
                              ))}
                            </View>
                            <KeyboardAvoidingView
                              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                              style={{ flex: 1 }}
                            >
                              <View style={styles.descriptionContainer}>
                                <Text style={styles.descriptionLabel}>
                                  Description ( Optional ):
                                </Text>
                                <TextInput
                                  style={styles.descriptionInput}
                                  value={descriptionRate}
                                  placeholder="Give additional informations for your coach..."
                                  placeholderTextColor="grey"
                                
                                  onChangeText={setDescriptionRate}
                                  multiline={true}
                                  numberOfLines={10}
                                />
                              </View>
                            </KeyboardAvoidingView>
                            
                            <TouchableOpacity
                              style={styles.rateButton}
                              onPress={() => handleRate(postId)}
                            >
                              <Text style={styles.rateButtonText}>Rate</Text>
                            </TouchableOpacity>
                          </>
                        )}
                      </View>
                    )}
                  </View>
                  <View style={{flexDirection: 'row', alignSelf:'flex-end'}}>
                    {currentUserType === 'Coach' && (
                      <>
                      <Icon
                        name="content-duplicate"
                        color="#32cd32"
                        size={dynamicFontSize(7)}
                        style={styles.deleteButton}
                        onPress={() => duplicatePost(postId)}
                      />
                      <Icon
                        name="square-edit-outline"
                        size={dynamicFontSize(7)}
                        color="#5ce1e6"
                        style={styles.deleteButton}
                        onPress={() => navigation.navigate('EditTraining', { wallId: route.params.wall, post: postId })}
                      />
                      <Icon
                        name="delete"
                        size={dynamicFontSize(7)}
                        color="red"
                        style={styles.deleteButton}
                        onPress={() => deletePost(postId)}
                      />
                      </>
                    )}
                    
                    
                  </View>
                  
                </View>
              );
            })
          ) : (
            <Text style={{ marginTop: dynamicFontSize(2), color: '#fff', fontSize:dynamicFontSize(5), }}>No posts were created</Text>
          )}
        </View>
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
    backgroundColor: 'black',

  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: dynamicFontSize(1),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: deviceWidth * 0.2,
    height: deviceWidth * 0.2,
    borderRadius: dynamicFontSize(10),
  },
  name: {
    fontSize: dynamicFontSize(5.8),
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#fff',
    fontFamily:'impact',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#5ce1e6',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginLeft: dynamicFontSize(2),
    marginRight: dynamicFontSize(2),
  },
  buttonText: {
    color: '#181818',
    fontWeight: 'bold',
    fontSize:dynamicFontSize(3),
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
    backgroundColor: '#181818',
  },
  chooseVideoButton: {
    backgroundColor: '#30A9C7',
    padding: 10,
    alignItems: 'center',
  },
  chooseVideoButtonText: {
    color: 'white',
    fontSize:dynamicFontSize(4),
    fontWeight: 'bold',
  },
  videoButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
 
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: deviceWidth * 0.2,
    height: deviceWidth * 0.2,
    marginLeft: 20,
  },
  timePrint: {
    paddingEnd: 20,
    color:'#fff',
    fontSize:dynamicFontSize(3.5),
  },
  postsContainer: {
    flex: 1,
    marginTop: 20,

  },
  postContainer: {
    marginBottom: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    backgroundColor: '#181818',
 
  },
  tableHeader: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingVertical: 8,
    borderRadius: 10,
    
  },
  tableHeaderText: {
    fontWeight: 'bold',
    //paddingLeft:dynamicFontSize(1),
    //flex: 1,
    textAlign: 'center',
    color:'#fff',
    fontSize:dynamicFontSize(3.2),
  },
  postRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    alignItems: 'center',
    marginBottom: 5,
    
    
  },
  columnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  column: {

    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderColor: '#fff',
    
  },
  columnHeaderText: {
    fontWeight: 'bold',
   
  },
  columnValue: {
    paddingVertical: 10,
    height:dynamicFontSize(22),
    textAlign: 'center',
    color:'#fff',
    fontSize:dynamicFontSize(3),
    //borderWidth: 1,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#181818',
    width: '90%',
    height: '90%',
    padding: 20,
    borderRadius: dynamicFontSize(4),
  },
  modalText: {
    fontSize: dynamicFontSize(5),
    color:'#fff',
    fontWeight: 'bold',
    marginBottom: dynamicFontSize(7),
    marginTop: dynamicFontSize(5),
    
  },
  descLabel: {
   
    fontSize:dynamicFontSize(4),
    fontWeight: 'bold',
    paddingHorizontal: dynamicFontSize(2),
    paddingVertical:dynamicFontSize(1),
    marginBottom: 10,
    color:'#fff',
  },
  postDescription: {
    color:'#fff',
    fontSize: dynamicFontSize(4),
    paddingHorizontal: dynamicFontSize(2),
    marginBottom: 30,
  },
  deleteButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: dynamicFontSize(5),
    paddingVertical: 10,
    
  },
  
  ratingContainer: {
    marginTop: 10,
    marginBottom: 60,
    width: '98%',
  },
  ratingButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    
  },
  ratingButton: {
    width: deviceWidth * 0.07,
    height: deviceWidth * 0.07,
    borderRadius: dynamicFontSize(10),
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    
  },
  selectedRatingButton: {
    borderColor: '#5ce1e6',
    backgroundColor: '#5ce1e6',
    
  },
  
  markAsFinishedContainer: {
    alignItems: 'flex-start',
    marginTop:20,
    marginLeft: 5,
    marginBottom: 5,
  },
  markAsFinishedButton: {
    backgroundColor: '#2ecc71', 
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    
  },
  markAsFinishedButtonText: {
    fontFamily:'impact',
    fontSize: dynamicFontSize(4),
    color:'black',
  },
  ratingLabel: {
    fontSize:dynamicFontSize(5),
    //fontWeight: 'bold',
    color:'#fff',
    fontFamily:'impact',
    marginTop:dynamicFontSize(4),
  },
  selectedRatingText: {
    color: '#fff',
    fontWeight: 'bold',
    
  },
  rateButtonContainer: {
    alignItems: 'center',
    marginTop: 10,
    
  },

  rateButton: {
    backgroundColor: '#2ecc71', 
  
    width: deviceWidth * 0.3,
    alignSelf:'center',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: dynamicFontSize(8),
  
  },
  rateButtonText: {
    color: '#181818',
    fontSize:dynamicFontSize(6),
    fontFamily: 'impact',
    paddingVertical:dynamicFontSize(1.5),
  },
  descriptionContainer: {
    marginTop: 10,

  },
  descriptionLabel: {
    fontSize:dynamicFontSize(5),
    //fontWeight: 'bold',
    marginBottom: dynamicFontSize(3),
    color:'#fff',
    fontFamily: 'impact',
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    minHeight: 80,
    color:'#fff',
    fontSize:dynamicFontSize(4),
    textAlignVertical: 'top'
  },
  closeButton: {
    alignItems: 'flex-end',
    backgroundColor: 'grey',
    paddingHorizontal:dynamicFontSize(4),
    paddingVertical:5,
    borderRadius:5,
    marginBottom: 15,
    alignSelf: 'flex-end',

  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize:dynamicFontSize(4),
  
  },
  finishedButton: {
    backgroundColor: '#BC13FE', 
  },
  finishedButtonText: {
    color: '#000', 
    //fontSize:dynamicFontSize(4),
  },
  ratingInfoContainer: {
    marginTop: 10,
   
    color:'#fff'
  },
});

export default FitWallContent;
