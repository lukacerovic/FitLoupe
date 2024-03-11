import React, { useState, useEffect } from 'react';
import { ScrollView, View, Image, StyleSheet, Text, TouchableOpacity, TextInput, Button, Alert, Dimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const ClientInfo = () => {
  const route = useRoute();
  const { wall } = route.params;
  const currentUser = firebase.auth().currentUser;
  const [fitWallDataId, setFitWallDataId] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [goalCount, setGoalCount] = useState(1);
  const [goals, setGoals] = useState([]);

  //console.log(fitWallDataId);

  useEffect(() => {
    const fetchFitWallData = async () => {
      try { 
        if (wall) {
          const fitWallDocRef = firebase.firestore().collection('fit wall').doc(wall);
          setFitWallDataId(wall)
          fitWallDocRef.get()
            .then((doc) => {
              if (doc.exists) {
                const data = doc.data();
                setGender(data.clientInfo?.gender || '');
                setAge(data.clientInfo?.age || '');
                setHeight(data.clientInfo?.height || '');
                setWeight(data.clientInfo?.weight || '');
                setBodyFat(data.clientInfo?.bodyFat || '');
                setGoals(data.clientInfo?.goals || []); // Postavite ciljeve iz baze u state
              }
            })
            .catch((error) => {
              console.log('Error fetching Fit Wall document:', error);
            });
        }
      } catch (error) {
        console.log('Error fetching Fit Wall data:', error);
      }
    };
  
    fetchFitWallData();
  }, [currentUser.uid, fitWallDataId]);
  

  const handleAddGoal = () => {
    setGoals([...goals, '']); // Dodajte prazan cilj u niz ciljeva
    setGoalCount(prevCount => prevCount + 1);
  };

  const handleRemoveGoal = async (index) => {
    try {
      const updatedGoals = [...goals];
      const removedGoal = updatedGoals.splice(index, 1)[0]; // Uklonite cilj sa datim indeksom i zapamtite ga
      setGoals(updatedGoals); // Ažurirajte state sa ciljevima bez uklonjenog cilja
      
      const userRef = firebase.firestore().collection('fit wall').doc(fitWallDataId);
  
      // Ažurirajte ciljeve u bazi podataka bez uklonjenog cilja
      await userRef.update({
        'clientInfo.goals': firebase.firestore.FieldValue.arrayRemove(removedGoal),
      });
  
      Alert.alert('Success', 'The goal has been successfully removed.');
    } catch (error) {
      Alert.alert('Fail', 'An error occurred while saving the goal.');
    }
  };
  
  
  const updateGoals = (updatedGoals) => {
    setGoals(updatedGoals);
  };

  const handleSubmit = async () => {
    try {
      const userRef = firebase.firestore().collection('fit wall').doc(fitWallDataId);

      await userRef.update({
        'clientInfo.gender': gender,
        'clientInfo.age': age,
        'clientInfo.height': height,
        'clientInfo.weight': weight,
        'clientInfo.bodyFat': bodyFat,
        'clientInfo.goals': goals,
      });

      Alert.alert('Success', 'The information has been successfully saved.');
    } catch (error) {
     
      Alert.alert('Fail', 'An error occurred while saving the information.');
    }
  };

  return (
    <ScrollView style={{ backgroundColor:'#181818'}}>
        <View style={styles.container}>
            <Image
                source={require('../assets/humanAvatar2.png')}
                style={styles.image}
            />
            <View style={styles.inputContainer}>
                <View style={styles.rowContainer}>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Gender</Text>
                        <TextInput
                        style={styles.input}
                        placeholder="Gender"
                        placeholderTextColor='gray'
                        value={gender}
                        onChangeText={setGender}
                        />
                    </View>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Age</Text>
                        <TextInput
                        style={styles.input}
                        placeholder="Age"
                        placeholderTextColor='gray'
                        value={age}
                        onChangeText={setAge}
                        />
                    </View>
                </View>
                <Text style={styles.label}>Height</Text>
                <TextInput
                style={styles.input}
                placeholder="Height (cm)"
                placeholderTextColor='gray'
                value={height}
                onChangeText={setHeight}
                />
                <Text style={styles.label}>Weight</Text>
                <TextInput
                style={styles.input}
                placeholder="Weight (kg)"
                placeholderTextColor='gray'
                value={weight}
                onChangeText={setWeight}
                />
                <Text style={styles.label}>Body Fat</Text>
                <TextInput
                style={styles.input}
                placeholder="Body Fat (%)"
                placeholderTextColor='gray'
                value={bodyFat}
                onChangeText={setBodyFat}
                />
                
            </View>
            <View style={styles.goalContainer}>
                <Text style={styles.labelGoal}>Client's goals:</Text>
                {goals.map((goal, index) => (
                    <View key={index} style={styles.goalInputContainer}>
                        <Text style={styles.numGoal}>{index + 1}.</Text>
                        <TextInput
                        style={styles.goalInput}
                        placeholder="Type here..."
                        placeholderTextColor='gray'
                        value={goal}
                        onChangeText={(newGoal) => {
                            const updatedGoals = [...goals];
                            updatedGoals[index] = newGoal;
                            updateGoals(updatedGoals);
                        }}
                        />
                        <TouchableOpacity onPress={() => handleRemoveGoal(index)}>
                            <Icon name="minus-circle" size={32} color="red" />
                        </TouchableOpacity>
                    </View>
                ))}
                <View style={styles.addButtonContainer}>
                    <TouchableOpacity style={styles.addButton} onPress={handleAddGoal}>
                        <Text style={{color:'#fff', fontSize:dynamicFontSize(5)}}>Add Goal </Text>
                        <Icon name="plus-circle" size={dynamicFontSize(5)} color="green" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={handleSubmit}>
                <Text style={{color:'#181818', fontSize:dynamicFontSize(6)}}>Save </Text>
             
              </TouchableOpacity>
                {/* <Button title="Save"  color="#181818" onPress={handleSubmit} /> */}
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
    backgroundColor: '#181818',
    alignItems: 'center',
  
  },
  image: {
    marginTop:dynamicFontSize(18),
    width: deviceWidth * 0.50,
    height: deviceWidth * 0.80,
  },
  inputContainer: {
    marginTop: 40,
    width: '90%',
    
  },
  label: {
    color:'#fff',
    fontFamily:'impact',
    fontSize: dynamicFontSize(5),
    paddingLeft:5,
  },
  goalContainer: {
    marginTop: 20,
  },
  labelGoal: {
    color:'#fff',
    fontFamily:'impact',
    fontSize: dynamicFontSize(9),
    textAlign:'center',
    paddingBottom:15,
  },
  numGoal: {
    color:'#fff',
    fontWeight:"bold",
    fontSize: dynamicFontSize(12),
  },
  goalInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width:'90%',
  },
  goalInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginRight: 10,
    padding: 10,
    color: '#fff',
    fontSize: dynamicFontSize(4),
    width:'100%',
  },
  addButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  addButton:{
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  rowContainer: {
    flexDirection: 'row', // Postavlja elemente jedan pored drugog
    justifyContent: 'space-between', // Rasporedi elemente sa prostorom između
    width: '100%',
    marginBottom: 10,
  },
  inputWrapper: {
    flex: 1,
    marginRight: 10, // Dodajte željeni razmak između elemenata
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    marginBottom: 30,
    padding: 10,
    borderRadius: 5,
    color:'#fff',
    fontSize: dynamicFontSize(3.5),
  
  },
  buttonContainer: {
    backgroundColor: "#5ce1e6",
    paddingHorizontal: dynamicFontSize(5),
    marginVertical: dynamicFontSize(30),
    borderRadius: dynamicFontSize(2),
  },
});

export default ClientInfo;


