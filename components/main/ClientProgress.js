import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { LineChart, ProgressChart } from 'react-native-chart-kit';
import { format } from 'date-fns';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from 'firebase/compat/app';
import { Animated, Easing } from 'react-native';

import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const ClientProgress = () => {
  const [selectedTag, setSelectedTag] = useState('7days');
  const [selectedData, setData] = useState([]);
  const [exerciseList, setExerciseList] = useState([]);
  const [filteredExerciseList, setFilteredExerciseList] = useState([]);
  const [textInputValue, setTextInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState('');
  const textInputRef = useRef(null);
  const [intensityData, setIntensityData] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [detailsData, setDetailsData] = useState({ date: '', repetitions: 0, intensity: '', sets:'' });
  const [slideAnimation] = useState(new Animated.Value(0));
  const route = useRoute();
  const { wall } = route.params;

  const formatDate = (isoDate) => {
    const date = new Date(isoDate); // Pretvara ISO string u Date objekat
    const day = date.getDate().toString().padStart(2, '0'); // Dobijamo dan i dodajemo nulu ispred ako je jednocifren
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Dobijamo mesec (januar je 0) i dodajemo 1, a zatim dodajemo nulu ispred ako je jednocifren
    return `${day}.${month}`;
  };

  useEffect(() => {
    const fetchFitWallData = async () => {
      try { 
        if (wall) {
          const fitWallDocRef = firebase.firestore().collection('fit wall').doc(wall);
          
          const docSnapshot = await fitWallDocRef.get();
          
          if (docSnapshot.exists) {
            const data = docSnapshot.data();
            const exerciseDataList = Object.values(data).map(item => item.exerciseNames);
            const uniqueExerciseNamesSet = new Set(exerciseDataList.flat());
            const uniqueExerciseNamesList = [...uniqueExerciseNamesSet];

            setData(data);
            setFilteredExerciseList(uniqueExerciseNamesList);
            setExerciseList(uniqueExerciseNamesList);
          } else {
            console.log('Fit Wall document with ID', wall, 'does not exist.');
          }
        }
      } catch (error) {
        console.error('Error fetching Fit Wall data:', error);
      }
    };
  
    fetchFitWallData();
  }, [wall]);


  const handleInputChange = (text) => {
    setShowDropdown(true);
    const lowercaseText = text.toLowerCase();
    setTextInputValue(text);
  
    if (exerciseList && exerciseList.length > 0) {
      const filteredExercises = exerciseList.filter((exercise) =>
        exercise && exercise.toLowerCase().includes(lowercaseText)
      );
      setFilteredExerciseList(filteredExercises);
    }
  };
  
  const handleExerciseSelect = (exercise) => {
    setSelectedExercise(exercise);
    handleExerciseIntensity(exercise);
    setShowDropdown(false);
    if (textInputRef.current) {
      textInputRef.current.blur();
    }
  };
  
  const handleExerciseIntensity = async (exercise) => {
    try {
      const fitWallRef = firebase.firestore().collection('fit wall').doc(wall);
  
      const docSnapshot = await fitWallRef.get();
  
      if (docSnapshot.exists) {
        const data = docSnapshot.data();
        const filteredResults = Object.values(data).filter((item) => {
          return (
            item &&
            item.exerciseNames &&
            item.exerciseNames.includes(exercise) &&
            dateFilter(item.postDate, selectedTag)
          );
        });
  
        const intensitiesList = filteredResults.map((item) => {
          const index = item.exerciseNames.indexOf(exercise);
    
          if (index !== -1 && item.intensities[index]) {
            return {
              intensity: parseFloat(item.intensities[index]),
              labelDate: formatDate(item.postDate), // Dodajte datum u svaku vrednost
              reps: item.numberOfRepetitions[index],
              sets: item.numberOfSets[index],
              detailTime: item.postDate,
            };
          }
          return null;
        });
        setIntensityData(intensitiesList);
      } else {
        console.log("Document with ID", id, "does not exist.");
      }
    } catch (error) {
      console.error('Error fetching exercise intensities:', error);
    }
  };

  const dateFilter = (dateStr, tag) => {
    const currentDate = new Date();
    const date = new Date(dateStr);
  
    switch (tag) {
      case '7days':
        return currentDate.getTime() - date.getTime() <= 7 * 24 * 60 * 60 * 1000;
      case 'month':
        const lastMonthDate = new Date(currentDate);
        lastMonthDate.setMonth(currentDate.getMonth() - 1);
        lastMonthDate.setDate(currentDate.getDate() + 1);
        return date >= lastMonthDate && date <= currentDate;
      case '3 months':
        const lastThreeMonthsDate = new Date(currentDate);
        lastThreeMonthsDate.setMonth(currentDate.getMonth() - 3);
        lastThreeMonthsDate.setDate(currentDate.getDate() + 1);
        return date >= lastThreeMonthsDate && date <= currentDate;
      case '6 months':
        const lastSixMonthsDate = new Date(currentDate);
        lastSixMonthsDate.setMonth(currentDate.getMonth() - 6);
        lastSixMonthsDate.setDate(currentDate.getDate() + 1);
        return date >= lastSixMonthsDate && date <= currentDate;
      case 'year':
        const lastYearDate = new Date(currentDate);
        lastYearDate.setFullYear(currentDate.getFullYear() - 1);
        lastYearDate.setDate(currentDate.getDate() + 1);
        return date >= lastYearDate && date <= currentDate;
      default:
        return true;
    }
  };
  
  useEffect(() => {
    const fetchExerciseIntensity = async () => {
      if (selectedExercise) {
        await handleExerciseIntensity(selectedExercise);
      }
    };
  
    fetchExerciseIntensity();
  }, [selectedTag]);

  const handleTagClick = async (tag) => {
    setSelectedTag(tag);
    await handleExerciseIntensity(selectedExercise);
  };

  const handleDotClick = (data, index) => {
    const intensity = intensityData[index]['intensity'];
    const date = intensityData[index]['detailTime'];
    const formattedDate = format(new Date(date), "eee dd MMM yy HH:mm ");
    const repetition = intensityData[index]['reps'];
    const sets = intensityData[index]['sets'];

    Animated.timing(slideAnimation, {
      toValue: 1,
      duration: 1000, // Povećajte ili smanjite vrednost duration prema svojim željama (u milisekundama)
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    setDetailsData({ date: formattedDate, repetitions: repetition, intensity: intensity, sets: sets });
    setShowDetails(true);
  };

  
  const data = {
    labels: intensityData.map((item) => item.labelDate), // Postavite datume kao oznake
    datasets: [
      {
        data: intensityData.length > 0 ? intensityData.map((item) => item.intensity) : [0],
        strokeWidth: 3,
      
      },
    ],

  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.viewContainer}>
        <Text style={styles.title}>Check progress for specific exercise</Text>
        <View style={styles.inputText}>
          <TextInput
            ref={textInputRef}
            placeholder="Enter exercise name"
            style={styles.input}
            value={textInputValue}
            onChangeText={handleInputChange}
            onFocus={() => {
              setShowDropdown(true); // Prikazuje padajući meni kad se klikne na TextInput
              setSelectedExercise(''); // Resetujte izabranu vrednost
            }}
            autoCapitalize="none"
          />
        </View>
        <FlatList
          data={filteredExerciseList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => {
              handleExerciseSelect(item);
            }}>
              <Text style={{ fontSize:dynamicFontSize(3.8), paddingLeft: 8 }}>{item}</Text>
            </TouchableOpacity>
          )}
          style={showDropdown ? styles.dropdownList : styles.hiddenDropdown}
        />
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={selectedTag === '7days' ? [styles.tag, styles.selectedTag] : styles.tag}
            onPress={() => handleTagClick('7days')}
          >
            <Text style={selectedTag === '7days' ? [styles.tagText, styles.selectedTagText] : styles.tagText}>
              7days
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={selectedTag === 'month' ? [styles.tag, styles.selectedTag] : styles.tag}
            onPress={() => handleTagClick('month')}
          >
            <Text style={selectedTag === 'month' ? [styles.tagText, styles.selectedTagText] : styles.tagText}>
              month
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={selectedTag === '3 months' ? [styles.tag, styles.selectedTag] : styles.tag}
            onPress={() => handleTagClick('3 months')}
          >
            <Text style={selectedTag === '3 months' ? [styles.tagText, styles.selectedTagText] : styles.tagText}>
              3 months
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={selectedTag === '6 months' ? [styles.tag, styles.selectedTag] : styles.tag}
            onPress={() => handleTagClick('6 months')}
          >
            <Text style={selectedTag === '6 months' ? [styles.tagText, styles.selectedTagText] : styles.tagText}>
              6 months
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={selectedTag === 'year' ? [styles.tag, styles.selectedTag] : styles.tag}
            onPress={() => handleTagClick('year')}
          >
            <Text style={selectedTag === 'year' ? [styles.tagText, styles.selectedTagText] : styles.tagText}>
              year
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          {selectedExercise ? ( // Prikaz izabranog elementa iznad dijagrama ako postoji
            <View style={styles.selectedExerciseContainer}>
              <Text style={styles.selectedExerciseText}>{selectedExercise}</Text>
            </View>
          ) : null}
          <LineChart
            style={{ marginVertical: 10, }}
            data={data}
            width={deviceWidth * 1}
            //yLabelsTextStyle={{fontSize:40,}}
            height={deviceHeight * 0.38}
            yAxisLabel="kg "
            yAxisLabelStyle={{ fontSize:30,}}
            onDataPointClick={({ value, index }) => handleDotClick(data, index)}
            chartConfig={{
              
              backgroundColor: '#181818',
              backgroundGradientFrom: '#181818',
              backgroundGradientTo: '#181818',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(92, 225, 230, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              
            }}
            renderDotContent={({ x, y, index }) => {
              const value = data.datasets[0].data[index];
              return (
                
                  <View
                    style={{
                      height: 24,
                      width: 24,
                      position: 'absolute',
                      top: y - dynamicFontSize(5),
                      left: x - 12,
                
                    }}
                  >
                    <TouchableOpacity onPress={() => handleDotClick(index)}>
                      <Text style={{ fontSize: dynamicFontSize(2.6), textAlign: 'center', color: 'white' }}>{value}</Text>
                      
                    </TouchableOpacity>
                    
                  </View>
          
              );
            }}
          />
            
        </View>
        {showDetails && (
              <Animated.View
                style={{
                  ...styles.detailsContainer,
                  transform: [
                    {
                      translateY: slideAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-100, 0],
                      }),
                    },
                  ],
                  shadowColor: '#000',
                  shadowOffset:{
                    height:-10,
                    width:-10,
                  },
                  shadowOpacity: 1,
                  shadowRadius: dynamicFontSize(7),
                  //elevation: 5,
                  width:'85%',
                  
                }}
              >
                {/* boja : rgb(140, 0, 255) ljubicasta*/}
                <View style={{ paddingVertical:dynamicFontSize(2), paddingHorizontal:dynamicFontSize(1), }}>
                  <View style={{alignSelf:'center',marginBottom:dynamicFontSize(2)}}>
                    <Text style={{alignSelf:'center', color:'#5ce1e6', fontSize:dynamicFontSize(5), marginBottom:dynamicFontSize(4)}}>Data Details</Text>
                  <Text style={{color:'#fff', fontWeight:'bold', fontSize:dynamicFontSize(8),fontFamily:'impact'}}>{detailsData.date.slice(0, 13)} </Text>           
                </View>
                <Text style={{fontSize:dynamicFontSize(18),fontFamily:'impact', paddingBottom:dynamicFontSize(5), fontWeight:'bold',alignSelf:'center',  color:'#00ffff', paddingTop:20,shadowOpacity: 1,shadowRadius: 10,shadowOffset:{width:10, height:5}}}>{detailsData.intensity} kg</Text>
                <View style={styles.dotContainer}>
                  <Icon name='record-circle-outline' size={dynamicFontSize(5)} color="rgb(147, 0, 255)"/>
                  <Text style={styles.detailsText}>
                    Time:  
                  </Text>
                  <Text style={styles.valueStyle}>
                    {detailsData.date.slice(14,16) + 'h' + detailsData.date.slice(16,) + 'min'}
                  </Text>
                </View>
                <View style={styles.dotContainer}>
                  <Icon name='record-circle-outline' size={dynamicFontSize(5)} color="rgb(147, 0, 255)"/>
                  <Text style={styles.detailsText}>
                    Repetitions:  
                  </Text>
                  
                  <Text style={styles.valueStyle}>
                    {detailsData.repetitions}
                  </Text>
                </View>
                <View style={styles.dotContainer}>
                  <Icon name='record-circle-outline' size={dynamicFontSize(5)} color="rgb(147, 0, 255)"/>
                  <Text style={styles.detailsText}>
                    Sets:  
                  </Text>
                  <Text style={styles.valueStyle}>
                    {detailsData.sets}
                  </Text>
                </View>      
                <TouchableOpacity onPress={() => setShowDetails(false)} style={{backgroundColor:'red',width:'30%',alignSelf:'center', borderRadius:dynamicFontSize(1),marginTop:dynamicFontSize(8), marginBottom:dynamicFontSize(2)}}>
                  <Text style={{alignSelf:'center',paddingVertical:dynamicFontSize(1), paddingHorizontal:dynamicFontSize(2), fontSize:dynamicFontSize(4), color:'#fff'}}>Close</Text>
                </TouchableOpacity>
              </View>
              </Animated.View>
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
        flexGrow: 1,
        backgroundColor: '#181818',
       
      },
      viewContainer:{
        alignItems: 'center',
        background:'red',
        flex: 1,
      },
      title:{
        color:'#fff',
        fontFamily:'impact',
        marginTop:150,
        fontSize:dynamicFontSize(4.8),
      },
      inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 50,
        marginTop:30,
      },
      inputText: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        marginTop:20,
      },
      input: {
        width:"80%",
       
        backgroundColor: 'white', // Boja pozadine
        paddingHorizontal: 10, // Ograničava unutarnji prostor oko teksta
        fontSize:dynamicFontSize(4),
        paddingVertical:dynamicFontSize(2),
        borderRadius: 10, // Zaobljeni ivice
        marginRight: 10, // Razmak između TextInput i dugmeta
      },
      dropdownList: {
        backgroundColor: 'white',
        position:'absolute',
        top: deviceWidth * 0.6,
        zIndex: 100,
        width:'85%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
       
      },
      hiddenDropdown: {
        display: 'none',
      },
     
      tag: {
        backgroundColor: 'gray',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
        marginHorizontal: 5,
      },
      selectedTag: {
        backgroundColor: '#5ce1e6',
      },
      tagText: {
        color: 'white',
        fontSize:dynamicFontSize(2.8),
      },
      selectedTagText: {
        color: '#181818',
      },
      selectedExerciseContainer: {
        backgroundColor: '#5ce1e6',
        minWidth:'40%',
        
        alignSelf:'center',
        paddingVertical: dynamicFontSize(1),
        paddingHorizontal: dynamicFontSize(3),
        borderRadius: dynamicFontSize(2),
        
        marginBottom:dynamicFontSize(5),
      },
      selectedExerciseText: {
        color: '#181818',
        fontSize:dynamicFontSize(5),
        fontFamily: 'impact',
        alignSelf:'center',
      },
     
      detailsContainer: {
        backgroundColor: '#303234',
        borderRadius: dynamicFontSize(13), 
        padding: 10, 
     
      },
      detailsText:{
        fontSize:dynamicFontSize(6),
        color:'#5ce1e6',
        fontWeight:'bold',
        paddingVertical:dynamicFontSize(5),
        paddingLeft:dynamicFontSize(6),
        fontFamily:'impact'
      },
      valueStyle:{
        paddingHorizontal:dynamicFontSize(2), 
        fontSize:25, 
        color:'#fff'
      },
      dotContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      
      },
   
      
});

export default ClientProgress;
