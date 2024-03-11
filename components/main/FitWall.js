import React, { useState  } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, FlatList, Alert, Dimensions,} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import exerciseData from '../assets/exerciseData.js';
import CustomDropdown from '../assets/customDropdown.js';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SearchableDropdown from 'react-native-searchable-dropdown';
import { sendNotification } from '../../services/Notification';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const FitWall = ({ route, navigation }) => {
  const [broj, setBroj] = useState('');
  const [selectTags, setSelectTags] = useState([]); 
  const [postId, setPostId] = useState(0);
  const [description, setDescription] = useState(''); 
  const currentUser = firebase.auth().currentUser;
  const [selectedExerciseNames, setSelectedExerciseNames] = useState('');
  const [lastExercisePerformans, setLastExercisePerformans] = useState([]);
  const [selectedDropdownIndex, setSelectedDropdownIndex] = useState(null);
  const [clientToken, setClientToken] = useState('');
  const [notificationName, setNotificationName] = useState([]);

  const currentUserData = firebase.firestore().collection('users').doc(currentUser.uid);
  currentUserData.get().then((doc) => {
    if (doc.exists) {
      const userData = doc.data();
      const firstName = userData.firstName;
      const lastName = userData.lastName;
     
      setNotificationName(firstName + ' ' + lastName);
    } else {
      console.log('Dokument ne postoji.');
    }
  }).catch((error) => {
    console.error('Greška pri pristupu dokumentu:', error);
  });


  const clientId = route.params?.client;
  const clientFcmToken = firebase.firestore().collection('users').doc(clientId);
  clientFcmToken.get().then((doc) => {
    if (doc.exists) {
      const userData = doc.data();
      if (userData.fcm)
      {
        setClientToken(userData.fcm);
      }
      else
      {
        console.log('korisnik nema fcm');
      }
  
    } else {
      console.log('Dokument ne postoji.');
    }
  }).catch((error) => {
    console.error('Greška pri pristupu dokumentu:', error);
  });


  const handleSubmit = async () => {
    const exerciseNames = [];
    const intensities = []; 
    const breakTimes = [];
    const numberOfRepetitions = [];
    const numberOfSets = [];
    const tempos = [];
    const blockExercises = [];

    selectTags.forEach((tag) => {
      const exerciseName = tag.exerciseName;
      const intensity = tag.intensity;
      const breakTime = tag.breakTime;
      const numberOfReps = tag.numberOfRepetitions;
      const numOfSets = tag.numberOfSets;
      const tempo = tag.tempo;
      const blockExercise = tag.blockExercise;

      exerciseNames.push(exerciseName);
      intensities.push(intensity);
      breakTimes.push(breakTime);
      numberOfRepetitions.push(numberOfReps);
      numberOfSets.push(numOfSets);
      tempos.push(tempo);
      blockExercises.push(blockExercise);
    });
    const isAnyFieldEmpty = selectTags.some((tag) => (
      !tag.blockExercise ||
      !tag.exerciseName ||
      !tag.intensity ||
      !tag.breakTime ||
      !tag.numberOfRepetitions ||
      !tag.tempo ||
      !tag.numberOfSets

    ));
  
    if (isAnyFieldEmpty) {
      Alert.alert('Info', 'Please fill in all the fields.Only Description place is optional');
      return;
    }
  
    try {
      //const fitWallId = [currentUser.uid, route.params?.id].sort().join('_'); 
  
      const fitWallDocRef = firebase.firestore().collection('fit wall').doc(route.params.wall);
      const fitWallDoc = await fitWallDocRef.get();
      const postDate = new Date().toISOString();

      if (fitWallDoc.exists) {
        const { postId: existingPostId, ...existingData } = fitWallDoc.data();
        const updatedPostId = existingPostId + 1;

        await fitWallDocRef.update({
          [`${updatedPostId}`]: {
            blockExercises: blockExercises,
            exerciseNames: exerciseNames,
            intensities: intensities,
            breakTimes: breakTimes,
            numberOfRepetitions: numberOfRepetitions,
            numberOfSets: numberOfSets,
            tempos: tempos, 
            description,
            postDate: postDate,
          },
          postId: updatedPostId,
        });

        setPostId(updatedPostId);
      } else {
        const initialPostId = 1;

        await firebase.firestore().collection('fit wall').doc(route.params.wall).set({
          [`${initialPostId}`]: {
            blockExercises,
            exerciseNames,
            intensities,
            breakTimes,
            numberOfRepetitions,
            numberOfSets,
            tempos,
            description, 
            postDate: postDate,
          },
          postId: initialPostId,
        });
        
        setPostId(initialPostId);
      }

      
      if (clientToken !== '') 
      {
        sendNotification(
          clientToken,
          "New Training",
          `${notificationName} has created a new training for you`
        )
      }
      Alert.alert('Success', 'The training has been successfully created.');
    } catch (error) {
      console.error('Error saving training:', error);
      Alert.alert('Error', 'An error occurred while saving the training.');
    }
    navigation.navigate('FitWallContent', { wall:route.params.wall, shouldRefresh: true });
  };

  const dodajDugme = () => {
    const newSelectTags = [...selectTags];
    if (parseInt(selectTags) > 15) {
      Alert.alert('Info', 'Please enter a number within the range of 1 to 15.');
      return;
    }
    newSelectTags.push({
      blockExercise: '',
      exerciseName: '',
      intensity: '',
      breakTime: '',
      numberOfRepetitions: '',
      numberOfSets: '',
      tempo: '',
    });
    setSelectTags(newSelectTags);
  };

  const potvrdiTag = () => {
    if (!broj || isNaN(parseInt(broj)) || parseInt(broj) < 1 || parseInt(broj) > 15) {
      Alert.alert('Info', 'Please enter a number within the range of 1 to 15.');
      return;
    }

    const brojSelectTagova = parseInt(broj);
    const newSelectTags = Array.from({ length: brojSelectTagova }, () => ({
      blockExercise: '',
      exerciseName: '',
      intensity: '',
      breakTime: '',
      numberOfRepetitions: '',
      numberOfSets: '',
      tempo: '',
    }));
    setSelectTags(newSelectTags);
  };
  const removeTag = (indexToRemove) => {
    const newSelectTags = [...selectTags];
    newSelectTags.splice(indexToRemove, 1);
    setSelectTags(newSelectTags);
    Alert.alert('Info', 'Exercise removed');
  };
  
  const exerciseHistory = async (exercise, index) => {

    const fitWallDocRef = firebase.firestore().collection('fit wall').doc(route.params.wall);
    
    const docSnapshot = await fitWallDocRef.get();

    if (docSnapshot.exists) {
      
      const data = docSnapshot.data();
  
      const exerciseDataList = Object.values(data).filter((item) => {
        return item && item.exerciseNames && item.exerciseNames.includes(exercise[index]);
      });
      
      const exerciseDetailsList = exerciseDataList.map((item) => {
        const index = item.exerciseNames.indexOf(exercise[0]);
        if (index !== -1 && item.intensities[index]) {
          const dateTime = new Date(item.postDate);
          const day = `${dateTime.getDate()} ${dateTime.toLocaleDateString('en-US', { month: 'short' })}`;
          return {
            intensity: parseFloat(item.intensities[index]),
            numberOfRepetitions: item.numberOfRepetitions[index], 
            numberOfSets: item.numberOfSets[index], 
            breakTime: item.breakTimes[index], 
            tempo: item.tempos[index], 
            postDate: day,
          };
        }
        return null; 
      });
      // Sortirajte vrednosti po postDate u opadajućem redosledu
      exerciseDetailsList.sort((a, b) => {
        return new Date(b.postDate) - new Date(a.postDate);
      });
      
      // Uzmi samo poslednje tri vrednosti
      const lastThreeValues = exerciseDetailsList.slice(-3);
     
      setLastExercisePerformans(lastThreeValues);
     
    } else {
      console.log('Fit Wall document with ID', id, 'does not exist.');
    }
  };
  const handleBlockExerciseChange = (index, value) => {
    const newSelectTags = [...selectTags];
    newSelectTags[index].blockExercise = value;
    setSelectTags(newSelectTags);
  };
  const handleExerciseNameSelect = (index, value) => {
    console.log(value);
    
    const newSelectTags = [...selectTags];
    newSelectTags[index].exerciseName = value;
    setSelectTags(newSelectTags);

    const newSelectedExerciseNames = [...selectedExerciseNames];
    newSelectedExerciseNames[index] = value;
    setSelectedExerciseNames(newSelectedExerciseNames);
    setSelectedDropdownIndex(index);
    exerciseHistory(newSelectedExerciseNames, index);
  };
  
  const handleExerciseNameChange = (index, value) => {
    console.log("handleExerciseNameChange - value:", value);
    const newSelectTags = [...selectTags];
    newSelectTags[index] = {
      ...newSelectTags[index],
      exerciseName: value,
    };
    setSelectTags(newSelectTags);
  };
  
  const handleIntensityChange = (index, value) => {
    const newSelectTags = [...selectTags];
    newSelectTags[index].intensity = value;
    setSelectTags(newSelectTags);
  };

  const handleBreakTimeChange = (index, value) => {
    const newSelectTags = [...selectTags];
    newSelectTags[index].breakTime = value;
    setSelectTags(newSelectTags);
  };

  const handleNumberOfRepetitionsChange = (index, value) => {
    const newSelectTags = [...selectTags];
    newSelectTags[index].numberOfRepetitions = value;
    setSelectTags(newSelectTags);
  };

  const handleNumberOfSetsChange = (index, value) => {
    const newSelectTags = [...selectTags];
    newSelectTags[index].numberOfSets = value;
    setSelectTags(newSelectTags);
  };

  const handleTempo = (index, value) => {
    const newSelectTags = [...selectTags];
    newSelectTags[index].tempo = value;
    setSelectTags(newSelectTags);
  };
  
  const renderSelectTags = () => {
    return selectTags.map((tag, index) => (
      
      <ScrollView key={index} contentContainerStyle={styles.selectTag} >
        <View style={styles.tagRow}>
          <Text style={styles.label}>Exercise {index + 1}:</Text>
          <TouchableOpacity onPress={() => removeTag(index)} style={styles.removeTagButton}>
                <Icon name="minus" size={dynamicFontSize(6)} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Blok Exericse Name</Text>
          <TextInput
            style={styles.input}
    
            name="blockExercise"
            keyboardType="default"
            placeholder='A1/A2/B1/B2'
            placeholderTextColor='grey'
            value={tag.blockExercise}
            onChangeText={(value) => handleBlockExerciseChange(index, value)}
          />
        </View>
        <View style={styles.formGroup}>
          
          <Text style={styles.label}>Exercise Name</Text>
          <CustomDropdown
            onSelect={(value) => handleExerciseNameSelect(index, value)}
          />

          {selectedDropdownIndex === index &&  lastExercisePerformans.length > 0 &&(
            
            <View style={styles.tableContainer}>
              <Text style={{alignSelf:'center', paddingVertical:dynamicFontSize(1.5), fontSize:dynamicFontSize(3.7),}}>Your most recent setups for this exercise.</Text>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell]}>Date</Text>
                <Text style={[styles.tableHeaderCell]}>Int</Text>
                <Text style={[styles.tableHeaderCell]}>Reps</Text>
                <Text style={[styles.tableHeaderCell]}>Sets</Text>
                <Text style={[styles.tableHeaderCell]}>Rest</Text>
                <Text style={[styles.tableHeaderCell]}>Temp</Text>
              </View>
              
            
              <FlatList
                data={lastExercisePerformans}
                keyExtractor={(item, itemIndex) => itemIndex.toString()}
                renderItem={({ item }) => (
                  <View style={styles.tableRow}>
                    <Text style={[styles.tableCell]}>{item.postDate}</Text>
                    <Text style={[styles.tableCell]}>{item.intensity}</Text>
                    <Text style={[styles.tableCell]}>{item.numberOfRepetitions}</Text>
                    <Text style={[styles.tableCell]}>{item.numberOfSets}</Text>
                    <Text style={[styles.tableCell]}>{item.breakTime}</Text>
                    <Text style={[styles.tableCell]}>{item.tempo}</Text>
                  </View>
                )}
              />
            </View>
          )} 

        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Intensity</Text>
          <TextInput
            style={styles.input}
            
            keyboardType="default"
            name="intensity"
            placeholder='1kg'
            placeholderTextColor='grey'
            value={tag.intensity}
            onChangeText={(value) => handleIntensityChange(index, value)}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Number Of Repetitions</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            name="numberOfRepetitions"
            placeholder='1'
            placeholderTextColor='grey'
            value={tag.numberOfRepetitions}
            onChangeText={(value) => handleNumberOfRepetitionsChange(index, value)}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Number Of Sets</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            name="numberOfSets"
            value={tag.numberOfSets}
            placeholder='1'
            placeholderTextColor='grey'
            onChangeText={(value) => handleNumberOfSetsChange(index, value)}
          />
        </View> 
        <View style={styles.formGroup}>
          <Text style={styles.label}>Rest Time</Text>
          <TextInput
            style={styles.input}
            name="breakTime"
            keyboardType="default"
            placeholder='1 s'
            placeholderTextColor='grey'
            value={tag.breakTime}
            onChangeText={(value) => handleBreakTimeChange(index, value)}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Tempo</Text>
          <TextInput
            style={[styles.input, {width:'50%'}]}
            name="tempo"
            value={tag.tempo}
            placeholder='slow/medium/fast'
            placeholderTextColor='grey'
            onChangeText={(value) => handleTempo(index, value)}
          />
        </View> 
      </ScrollView>
    
    ));
  };

  return (
    
    <ScrollView contentContainerStyle={styles.container}>
      <KeyboardAwareScrollView
            enableOnAndroid={true} // Omogućite na Androidu
            extraScrollHeight={Platform.OS === 'ios' ? dynamicFontSize(5) : 0} // Prilagodite prema potrebi
      >
      <View style={styles.formGroup}>
        <Text style={styles.label}>Number of Exercises:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={broj}
          onChangeText={(text) => setBroj(text)}
        />
      </View>

      <TouchableOpacity onPress={potvrdiTag} style={styles.buttonContainer}>
          <Text style={styles.addButtonText}>Create a form</Text>
      </TouchableOpacity>

      <View style={styles.selectTagsContainer}>{renderSelectTags()}</View>
      <View style={styles.buttonContainerAdd}>
        <TouchableOpacity onPress={dodajDugme} style={styles.addButton}>
          <Icon name="plus" size={dynamicFontSize(4)} color="#fff" style={styles.plusIcon} />
          <Text style={styles.addButtonText}>Add one more</Text>
        </TouchableOpacity>
      </View>
      
        <View style={styles.formGroup}>
        
          <Text style={styles.label}>Description ( Optional )</Text>
          
            <TextInput
              style={styles.descriptionInput}
              placeholder='Type description'
              placeholderTextColor='grey'
              multiline={true}
              numberOfLines={30}
              value={description}
              onChangeText={(text) => setDescription(text)}
            />
          
        </View>
        
        <TouchableOpacity onPress={handleSubmit} style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Upload</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView> 
    </ScrollView>
    
  );
};
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const dynamicFontSize = (percentage) => {
  return (deviceWidth * percentage) / 100;
};
const styles = {
  container: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#181818',
  },
  formGroup: {
    marginBottom: dynamicFontSize(3),
    marginTop: 10,
    
  },
 
  label: {
    fontSize: dynamicFontSize(5),
    //fontWeight: 'bold',
    marginBottom: 5,
    color: "#fff",
    marginBottom: 10,
    fontFamily:'impact'
  },
  tagRow:{
    flexDirection:"row",
    justifyContent: 'space-between',
    marginBottom:dynamicFontSize(3),
  },
  input: {
    fontSize:dynamicFontSize(4),
    paddingVertical:dynamicFontSize(2),
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: dynamicFontSize(1),
    paddingHorizontal: 10,
    width:'30%',
    color: "#fff",
    marginBottom: 20,
  },
  selectTagsContainer: {
    marginTop: 20,
  },
  buttonContainer: {
    backgroundColor: "#30A9C7",
    marginVertical: dynamicFontSize(3),
    paddingVertical: dynamicFontSize(2),
    borderRadius: dynamicFontSize(2),
    alignSelf:'center',
    width:deviceWidth * 0.50,
  },
  buttonContainerAdd: {
    marginVertical: dynamicFontSize(3),
    borderRadius: 5,
    //width: '35%',
    alignSelf: 'flex-end',
  },
  addButton: {
    backgroundColor: '#32cd32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: dynamicFontSize(2.5),
    paddingHorizontal: dynamicFontSize(2.5),
    borderRadius: dynamicFontSize(2),
  },

  addButtonText:{
    color: '#fff',
    fontWeight: 'bold',
    alignSelf:'center',
    fontSize:dynamicFontSize(4),
    
  },
  removeTagButton: {
    marginLeft: 10,
    alignSelf: 'center',
    backgroundColor:'red',
    borderRadius:dynamicFontSize(10),
  },
  
  plusIcon: {
    marginRight: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    alignSelf:'center',
    paddingVertical:dynamicFontSize(2),
    fontSize: dynamicFontSize(4.5),
    
  },
  selectTag: {
    marginBottom: 20,
   
  },
  descriptionInput: {
    fontSize:dynamicFontSize(4),
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: dynamicFontSize(1.3),
    color: '#fff',
    marginBottom: 20,
    borderRadius:dynamicFontSize(1.3),
    textAlignVertical: 'top',
    height:deviceWidth * 0.50,
  },
  tableContainer: {
    flex: 1,
    backgroundColor: '#808080',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#a9a9a9',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    
    
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize:dynamicFontSize(3),
    color:'#181818',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    
    
  },
  tableCell: {
    flex: 1,
    fontSize:dynamicFontSize(3),
    color:'#181818',
  },
};

export default FitWall;

 