import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Dimensions, Alert } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const EditTraining = ({ route, navigation }) => {
  const [postData, setPostData] = useState(null);
  const [exerciseCount, setExerciseCount] = useState(1);

  useEffect(() => {
    async function fetchPostData() {
      try {
        const wallId = route.params?.wallId;
        const postId = route.params?.post;
        console.log(wallId);
        if (wallId && postId) {
          const docRef = firebase.firestore().collection('fit wall').doc(wallId);
          const docSnapshot = await docRef.get();
          const wallData = docSnapshot.data();
          setPostData(wallData[postId]);
        }
      } catch (error) {
        console.error('Greška prilikom dobijanja podataka iz Firestore-a:', error);
      }
    }

    fetchPostData();
  }, [route.params]);


  const handleBlockChange = (text, index) => {
    const updatedBlok = [...postData.blockExercises];
    updatedBlok[index] = text;

    setPostData({
      ...postData,
      blockExercises: updatedBlok,
    });
  };
  const handleExerciseNameChange = (text, index) => {
    const updatedExerciseNames = [...postData.exerciseNames];
    updatedExerciseNames[index] = text;

    setPostData({
      ...postData,
      exerciseNames: updatedExerciseNames,
    });
  };

  const handleIntensityChange = (text, index) => {
    const updatedIntensities = [...postData.intensities];
    updatedIntensities[index] = text;

    setPostData({
      ...postData,
      intensities: updatedIntensities,
    });
  };

  const handleNumberOfSetsChange = (text, index) => {
    const updatedNumberOfSets = [...postData.numberOfSets];
    updatedNumberOfSets[index] = text;

    setPostData({
      ...postData,
      numberOfSets: updatedNumberOfSets,
    });
  };

  const handleNumberOfRepetitionsChange = (text, index) => {
    const updatedNumberOfRepetitions = [...postData.numberOfRepetitions];
    updatedNumberOfRepetitions[index] = text;

    setPostData({
      ...postData,
      numberOfRepetitions: updatedNumberOfRepetitions,
    });
  };

  const handleBreakTimesChange = (text, index) => {
    const updatedBreakTimes = [...postData.breakTimes];
    updatedBreakTimes[index] = text;

    setPostData({
      ...postData,
      breakTimes: updatedBreakTimes,
    });
  };

  const handleTempo = (text, index) => {
    const updatedtempos = [...postData.tempos];
    updatedtempos[index] = text;

    setPostData({
      ...postData,
      tempos: updatedtempos,
    });
  };
  const handleDeleteExercise = (index) => {
    
    Alert.alert(
      'Delete Exercise',
      'Are you sure you want to delete this exercise from this training?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        { text: 'Yes', onPress: () => confirmDeleteExercise(index)},
      ]
    );
  };
  const confirmDeleteExercise = async (index) => {
    if (index !== null) {
      const updatedExerciseNames = [...postData.exerciseNames];
      const updatedBlockExercises = [...postData.blockExercises];
      const updatedIntensities = [...postData.intensities];
      const updatedNumberOfSets = [...postData.numberOfSets];
      const updatedNumberOfRepetitions = [...postData.numberOfRepetitions];
      const updatedBreakTimes = [...postData.breakTimes];
      const updatedTempos = [...postData.tempos];
  
      updatedExerciseNames.splice(index, 1);
      updatedBlockExercises.splice(index, 1);
      updatedIntensities.splice(index, 1);
      updatedNumberOfSets.splice(index, 1);
      updatedNumberOfRepetitions.splice(index, 1);
      updatedBreakTimes.splice(index, 1);
      updatedTempos.splice(index, 1);
  
      setPostData({
        ...postData,
        exerciseNames: updatedExerciseNames,
        blockExercises: updatedBlockExercises,
        intensities: updatedIntensities,
        numberOfSets: updatedNumberOfSets,
        numberOfRepetitions: updatedNumberOfRepetitions,
        breakTimes: updatedBreakTimes,
        tempos: updatedTempos,
      });
      Alert.alert(
        'Successful Temporary Change',
        'The current training has not been permanently changed yet. All changes of the training will be implemented when you click "Modify."'
      );
    }
  };
  const addExerciseFormat = () => {
    const updatedExerciseCount = exerciseCount + 1;
  
    setPostData({
      ...postData,
      exerciseNames: [...postData.exerciseNames, ''], // Dodajte prazno polje za ime vežbe
      blockExercises: [...postData.blockExercises, ''], // Dodajte prazno polje za blok
      intensities: [...postData.intensities, ''], // Dodajte prazno polje za intenzitet
      numberOfSets: [...postData.numberOfSets, ''], // Dodajte prazno polje za broj serija
      numberOfRepetitions: [...postData.numberOfRepetitions, ''], // Dodajte prazno polje za broj ponavljanja
      breakTimes: [...postData.breakTimes, ''], // Dodajte prazno polje za vreme odmora
      tempos: [...postData.tempos, ''], // Dodajte prazno polje za tempo
    });
  
    setExerciseCount(updatedExerciseCount);
  };
  
  const handleModifyTraining = async () => {
    if (
      postData.exerciseNames.some((name) => !name) ||
      postData.blockExercises.some((block) => !block) ||
      postData.intensities.some((intensity) => !intensity) ||
      postData.numberOfSets.some((sets) => !sets) ||
      postData.numberOfRepetitions.some((repetitions) => !repetitions) ||
      postData.breakTimes.some((time) => !time) ||
      postData.tempos.some((tempo) => !tempo)
      
    ) {
      Alert.alert('Error', 'Please fill in all fields before modifying the training.');
      return;
    }
    try {
      const wallId = route.params?.wallId;
      const postId = route.params?.post;

      if (wallId && postId) {
        const docRef = firebase.firestore().collection('fit wall').doc(wallId);
        const updatedPostData = { ...postData };

        // Ovde možete izvršiti ažuriranje podataka u updatedPostData pre nego što ih ažurirate u bazi podataka

        await docRef.update({
          [postId]: updatedPostData,
        });

        Alert.alert('Success', 'The training has been successfully modified.');
        navigation.navigate('FitWallContent', { wall:route.params.wallId, shouldRefresh: true });
      }
    } catch (error) {
      console.error('Greška prilikom ažuriranja podataka u Firestore:', error);
    }
  };

  return (
    <ScrollView style={{ backgroundColor: '#181818', flex: 1 }}>
      <Text style={{color:'#fff', fontFamily:'impact', alignSelf:'center', fontSize:dynamicFontSize(8), marginTop:dynamicFontSize(35), }}>Edit This Training</Text>
      {postData && (
        <View style={styles.postsContainer}>
          {postData.exerciseNames &&
            Object.values(postData.exerciseNames).map((value, index) => (
              <View key={index} style={{marginBottom:dynamicFontSize(8),paddingLeft:dynamicFontSize(2), borderBottomColor:'#fff', borderBottomWidth:1}}>
                <View style={styles.tagRow}>
                  <Text style={[styles.label, {fontSize:dynamicFontSize(6.5)}]}>Exercise {index+1}</Text>
                  <TouchableOpacity onPress={() => handleDeleteExercise(index)} style={styles.removeTagButton}>
                    <Icon name="minus" size={dynamicFontSize(6.5)} color="white" />
                  </TouchableOpacity>
                </View>
                <View>
                    <TextInput
                    style={[styles.value, { width: '100%' }]}
                    value={value}
                    onChangeText={(text) => handleExerciseNameChange(text, index)}
                    placeholder='Exercise Name...'
                    placeholderTextColor='grey'
                    />
                </View>
                <Text style={styles.label}>Blok</Text>
                <View>
                    <TextInput
                    style={[styles.value, { width: '100%' }]}
                    value={postData.blockExercises[index]}
                    onChangeText={(text) => handleBlockChange(text, index)}
                    placeholder='Name by block'
                    placeholderTextColor='grey'
                    />
                </View>
                <Text style={styles.label}>Intensity:</Text>
                <TextInput
                  style={styles.value}
                  value={postData.intensities[index]}
                  onChangeText={(text) => handleIntensityChange(text, index)}
                  placeholder='1 kg'
                  placeholderTextColor='grey'
                />
                <Text style={styles.label}>Number of Repetitions:</Text>
                <TextInput
                  style={styles.value}
                  value={postData.numberOfRepetitions[index]}
                  onChangeText={(text) => handleNumberOfRepetitionsChange(text, index)}
                  placeholder='1'
                  placeholderTextColor='grey'
                />
                <Text style={styles.label}>Number of Sets:</Text>
                <TextInput
                  style={styles.value}
                  value={postData.numberOfSets[index]}
                  onChangeText={(text) => handleNumberOfSetsChange(text, index)}
                  placeholder='1'
                  placeholderTextColor='grey'
                />
                
                <Text style={styles.label}>Rest Time:</Text>
                <TextInput
                  style={styles.value}
                  value={postData.breakTimes[index]}
                  onChangeText={(text) => handleBreakTimesChange(text, index)}
                  placeholder='1 s'
                  placeholderTextColor='grey'
                />
                <Text style={styles.label}>Tempo</Text>
                <TextInput
                  style={[styles.value, {width:'50%'}]}
                  value={postData.tempos[index]}
                  onChangeText={(text) => handleTempo(text, index)}
                  placeholder='Slow / Medium / Fast'
                  placeholderTextColor='grey'
                />
              </View>
            ))}
          
          <TouchableOpacity style={{alignSelf:'flex-end', flexDirection:'row', backgroundColor:'#32cd32', paddingHorizontal:dynamicFontSize(2), paddingVertical:dynamicFontSize(2), borderRadius:dynamicFontSize(1), marginRight:dynamicFontSize(3),}}
          onPress={addExerciseFormat}
          >
            <Text style={{fontSize:dynamicFontSize(4), color:'#fff',alignSelf:'center', fontWeight: 'bold',}}>Add Exercise</Text>
            <Icon name="plus" size={dynamicFontSize(5)} color="#fff" style={{alignSelf:'center', paddingLeft:dynamicFontSize(2)}} />
          </TouchableOpacity>
        
          <View style={{marginBottom: dynamicFontSize(10), paddingLeft:dynamicFontSize(2)}}>
            <Text style={styles.label}>Description:</Text>
            <TextInput 
              style={styles.descText}
              multiline={true}
              numberOfLines={20}
              value={postData.description}
              onChangeText={(text) => setPostData({ ...postData, description: text })}
            />
          </View>
          <TouchableOpacity style={styles.buttonContainer} onPress={handleModifyTraining}>
            <Text style={styles.buttonText}>Modify training</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const dynamicFontSize = (percentage) => {
  return (deviceWidth * percentage) / 100;
};
const styles = StyleSheet.create({

      postsContainer: {
        flex: 1,
        marginTop: 20,
      },
      postContainer: {
        marginBottom: 30,
        backgroundColor: '#181818',
      },
      label:{
        color:'#5ce1e6',
        fontFamily:'impact',
        fontSize:dynamicFontSize(5),
        marginTop:dynamicFontSize(5),
      },
      value:{
        color:'#fff',
        fontSize:dynamicFontSize(4),
        marginBottom:dynamicFontSize(4),
        borderWidth:1,
        borderColor:'#fff',
        width:'30%',
        paddingHorizontal:dynamicFontSize(2),
        paddingVertical:dynamicFontSize(2.5),
        borderRadius:dynamicFontSize(2),
        marginTop:dynamicFontSize(2),
      },
     descText:{
        fontSize:dynamicFontSize(4),
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: dynamicFontSize(1.5),
        color: '#fff',
        marginBottom: dynamicFontSize(13),
        marginTop:dynamicFontSize(3),
        borderRadius:dynamicFontSize(1.3),
        textAlignVertical: 'top',
        height:deviceWidth * 0.50,
     },
     buttonContainer: {
        backgroundColor: "#30A9C7",
        marginVertical: dynamicFontSize(3),
        paddingVertical: dynamicFontSize(2),
        borderRadius: dynamicFontSize(2),
        alignSelf:'center',
        width:deviceWidth * 0.50,
        marginBottom:dynamicFontSize(13),
      },
      buttonText: {
        color:'#fff',
        fontSize:dynamicFontSize(6),
        alignSelf:'center',
        fontFamily:'impact'
      },
      tagRow:{
        flexDirection:"row",
      
        justifyContent: 'space-between',
        marginBottom:dynamicFontSize(3),
        paddingRight:dynamicFontSize(5),
      },
      removeTagButton: {
        alignSelf: 'flex-end',
        backgroundColor:'red',
        borderRadius:dynamicFontSize(10),
      },
   
     
});
export default EditTraining;
