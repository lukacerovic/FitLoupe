import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Image, Modal, TextInput, Alert, TouchableOpacity, TouchableWithoutFeedback, Dimensions, Appearance } from 'react-native';
import { Agenda } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from 'firebase/compat/app';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-datepicker';
import { useNavigation } from '@react-navigation/native';
import { sendNotification } from '../../services/Notification';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


const deviceWidth = Dimensions.get('window').width;


const dynamicFontSize = (percentage) => {
  return (deviceWidth * percentage) / 100;
};


const timeToString = (time) => {
  const date = new Date(time);
  return date.toISOString().split('T')[0];
};

const formatTime = (time) => {
  const date = time ? new Date(time) : new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${formattedHours}:${formattedMinutes} ${period}`;
};

const CalendarScreen = () => {
  const navigation = useNavigation();
  const [items, setItems] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [textInputValue, setTextInputValue] = useState('');
  const [mentionedFor, setMentionedFor] = useState('');
  const [selectedColor, setSelectedColor] = useState('grey');
  const [selectedTimeFrom, setSelectedTimeFrom] = useState(new Date());
  const [selectedTimeUntil, setSelectedTimeUntil] = useState(new Date());
  const [currentUser, setCurrentUser] = useState(firebase.auth().currentUser);
  const [currentUserFcm, setCurrentUserFcm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUserName, setCurrentUserName] = useState('');
  const [isFromTimePickerVisible, setIsFromTimePickerVisible] = useState(false);
  const [isUntilTimePickerVisible, setIsUntilTimePickerVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    Appearance.getColorScheme() === 'dark'
  );

  const [itemsKey, setItemsKey] = useState(0);
  
  useEffect(() => {
    const unsubscribe = firebase.firestore().collection('calendars').doc(currentUser.uid)
      .onSnapshot((snapshot) => {
        const data = snapshot.data();
        if (data) {
          setItems(data);
        }
      });

    const userRef = firebase.firestore().collection('users').doc(currentUser.uid);
    userRef.get().then((doc) => {
      if (doc.exists) {
        const userData = doc.data();
        setCurrentUserName(`${userData.firstName} ${userData.lastName}`);
        setCurrentUserFcm(userData.fcm);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  const loadItems = (day) => {
    const newItems = { ...items };
    for (let i = -15; i < 85; i++) {
      const time = day.timestamp + i * 24 * 60 * 60 * 1000;
      const strTime = timeToString(time);
      if (!newItems[strTime]) {
        newItems[strTime] = [];
      }
    }
    setItems({ ...items });
  };

  const handleAccept = async (item) => {
    const newItems = { ...items };
    for (const date in newItems) {
      const selectedItemIndex = newItems[date].findIndex((i) => i === item);
      if (selectedItemIndex !== -1) {
        newItems[date][selectedItemIndex] = {
          ...item,
          requestStatus: 1,
        };
        await firebase.firestore().collection('calendars').doc(currentUser.uid).set({
          [date]: newItems[date],
        }, { merge: true });
      }
    }
    setItems(newItems);
    setItemsKey((prevKey) => prevKey + 1);
    navigation.navigate('Main', { refreshCalendar: true });
  };

  const handleReject = async (item) => {
    const newItems = { ...items };
    for (const date in newItems) {
      const selectedItemIndex = newItems[date].findIndex((i) => i === item);
      if (selectedItemIndex !== -1) {
        newItems[date].splice(selectedItemIndex, 1);
        await firebase.firestore().collection('calendars').doc(currentUser.uid).set({
          [date]: newItems[date],
        }, { merge: true });
      }
    }
    setItems(newItems);
    setItemsKey((prevKey) => prevKey - 1);
    navigation.navigate('Main', { refreshCalendar: true });
  };
  
  const handleDayPress = (day) => {
    const strTime = timeToString(day.timestamp);
    setSelectedDate(strTime);
    setModalVisible(true);
  };

  const handleSave = async () => {

    if (mentionedFor && !selectedUser) {
      Alert.alert('Error', 'Please select a user for mention or leave the field empty.');
    }

    if (selectedDate && textInputValue) {
      const newItems = { ...items };
      if (!newItems[selectedDate]) {
        newItems[selectedDate] = [];
      }

      const newItem = {
        description: textInputValue,
        color: selectedColor,
        mentionedFor: selectedUser ? selectedUser.firstName + ' ' + selectedUser.lastName : '',
      };
      if (typeof selectedTimeFrom !== 'string') {
    
        newItem.timeFrom = formatTime(selectedTimeFrom)
      }
      else{
        newItem.timeFrom = selectedTimeFrom
      }
  
      if ( typeof selectedTimeUntil !== 'string'){
        newItem.timeUntil = formatTime(selectedTimeUntil)
      }
      else{
        newItem.timeUntil = selectedTimeUntil
      }
      if (mentionedFor) {
        await firebase.firestore().collection('calendars').doc(selectedUser.userId).set({
          [selectedDate]: firebase.firestore.FieldValue.arrayUnion({
            description: textInputValue,
            color: selectedColor,
            timeFrom: typeof selectedTimeFrom !== 'string' ? formatTime(selectedTimeFrom) : selectedTimeFrom,
            timeUntil: typeof selectedTimeUntil !== 'string' ? formatTime(selectedTimeUntil) : selectedTimeUntil,
            senderId: currentUserName,
            requestStatus: 0
          }),
        }, { merge: true });
        if(selectedUser.fcm){
          const fcm = selectedUser.fcm ;
          sendNotification(
            
            fcm ,
            "Fit Loupe",
            `Calendar request from ${currentUserName}` //should be sender name 
            // place for text of a meesage to pas for text value in notifications
          )
        }
      }

      newItems[selectedDate].push(newItem);

      await firebase.firestore().collection('calendars').doc(currentUser.uid).set({
        [selectedDate]: newItems[selectedDate],
      }, { merge: true });

      setItems(newItems);
      setModalVisible(false);
      setSelectedDate('');
      setTextInputValue('');
      setSelectedColor('grey');
      setSelectedTimeFrom(new Date());
      setSelectedTimeUntil(new Date());
      setMentionedFor('');
      setSelectedUser(null);
    }
  };

  const searchUsers = async (query) => {
    const usersRef = firebase.firestore().collection('users');
    const snapshot = await usersRef
      .where('firstName', '==', query)
      .get();

    const users = [];
    snapshot.forEach((doc) => {
      const userData = doc.data();
      userData["userId"] = doc.id;
      users.push(userData);
    });

    return users;
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedDate('');
    setTextInputValue('');
    setSelectedColor('grey');
    setSelectedTimeFrom(new Date());
    setSelectedTimeUntil(new Date());
    setMentionedFor('');
  };
  return (

    <View style={{ flex: 1 }}>
      <Agenda
        key={itemsKey} 
        items={items}
        loadItemsForMonth={loadItems}
        renderEmptyData={() => (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
            <Text style={{ fontSize: dynamicFontSize(5), color:'#fff', fontFamily:'impact' }}>No notes for this day yet.</Text>
            <Text style={{ fontSize: dynamicFontSize(5), color:'#fff', fontFamily:'impact' }}>Click on a day in calendar to set notes.</Text>
          </View>
        )}
        renderItem={(item) => (
          <View style={{ margin: 10, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: item.color, borderRadius: 5, fontSize:dynamicFontSize(3), }}>
            {item.requestStatus == 0 ? (
              <>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{fontSize: dynamicFontSize(3)}}>Note request from:</Text>
                  <Text style={{ paddingLeft: 10, fontSize: dynamicFontSize(3), color: '#fff', fontWeight: "bold", }}>{item.senderId}</Text>
                </View>

                <Text style={{ fontSize: dynamicFontSize(3), paddingTop: 10 }}>{item.description}</Text>
                <View style={{ paddingTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ color: '#343434', fontSize: 15 }}>
                    {item.timeFrom} - {item.timeUntil}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, paddingHorizontal: 10, }}>
                  <TouchableOpacity onPress={() => handleAccept(item)}>
                    <Icon name="check" size={32} color="green" style={{ marginRight: 10 }} />

                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleReject(item)}>
                    <Icon name="close" size={32} color="red" />

                  </TouchableOpacity>
                </View>
              </>
            ) : (

              <>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: dynamicFontSize(4), color:'#000', }}>{item.description}</Text>
                  <TouchableOpacity onPress={() => handleReject(item)} style={{ alignSelf: 'flex-end' }}>
                    <Icon name="delete" size={dynamicFontSize(5)} color="#000" />
                  </TouchableOpacity>
                </View>

                <View style={{ paddingTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{fontSize:dynamicFontSize(3),}}>
                    {item.mentionedFor ? `With: ${item.mentionedFor}` : `With: ${item.senderId}`}
                  </Text>

                  <Text style={{ fontSize: dynamicFontSize(3) }}>
                    {item.timeFrom} - {item.timeUntil}
                  </Text>
                </View>
              </>
            )}
          </View>
        )}
        onDayPress={handleDayPress}
        theme={{
          calendarBackground: '#181818',
          reservationsBackgroundColor: "#181818",
          text:dynamicFontSize(2),
          textDisabledColor: 'gray',
          dayTextColor: 'white',
          textSectionTitleColor: 'white',
          monthTextColor: 'white',
          textMonthFontSize: dynamicFontSize(3),
          textDayHeaderFontSize: dynamicFontSize(3.5), // Veličina dana u nedelji (Ponedeljak, Utorak, itd.)
          textMonthFontSize: dynamicFontSize(3.3), // Veličina meseca
          textDayFontSize: dynamicFontSize(3), // Veličina brojeva unutar kalendara
          agendaKnobColor: 'white', // Boja strelice za prelazak između dana
          dotColor: 'white', // Boja tačkica ispod datuma koji sadrže događaje
          todayTextColor: 'white', // Boja teksta za danasnji dan
        }}
      />

      {modalVisible && (
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          useNativeDriver={false}
        >

          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', }}>

            <View>

              <View style={{ backgroundColor: '#343434', padding: 20, borderRadius: 10, width: '90%' }}>
                <TouchableOpacity onPress={handleModalClose} style={{ alignSelf: 'flex-end', borderWidth: 1, borderColor: 'black', backgroundColor: '#5ce1e6', padding: 5, borderRadius: 7 }}>
                  <Icon name="close" size={dynamicFontSize(4.8)} color="red" />
                </TouchableOpacity>
                <Text style={{ marginBottom: 10, alignSelf: 'center', color: '#fff', fontWeight: 'bold', fontSize:dynamicFontSize(3.8), }}>{selectedDate}</Text>
                <Text style={{ color: '#fff', fontFamily: 'impact', fontSize:dynamicFontSize(4.8), paddingBottom: 10, }}>Leave Note</Text>
                <TextInput
                  value={textInputValue}
                  onChangeText={setTextInputValue}
                  placeholder="Enter text..."
                  placeholderTextColor='grey'
                  multiline={true}
                  style={{ textAlignVertical: 'top', height: deviceWidth * 0.2, borderRadius: 8, color: '#fff', borderColor: 'gray', borderWidth: 1, padding: 10, marginBottom: 30, fontSize:dynamicFontSize(3.5), }}
                  autoCorrect={false}
                  
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1, alignItems: 'flex-start' }}>
                  <Text style={{ color: '#fff', fontFamily: 'impact', fontSize: dynamicFontSize(5.5) }}>From: </Text>
                  {Platform.select({
                    ios: (
                      <DatePicker
                        style={{marginBottom:20}}
                        value={selectedTimeFrom}
                        mode="time"
                     
                        is24Hour={false}
                        date={selectedTimeFrom}                     
                        display="spinner"
                        format="h:mm A" 
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
            
                        onDateChange={(time) => setSelectedTimeFrom(time)}
                        showIcon={false}
                        customStyles={{
                          datePickerCon: {
                            backgroundColor:isDarkMode ? 'black' : 'white',
                          },
                          dateInput: {
                            borderWidth: 1,
                            borderRadius:8,
                            marginTop:10,
                            alignItems: 'flex-start',
                            color:'black',
                            backgroundColor:'#fff',
                          },
                          dateText: {
                            fontSize:dynamicFontSize(3.5), 
                            color: '#000',
                            alignSelf:'center',
                          },
                          btnTextConfirm: {
                            color: '#5ce1e6', 
                            fontWeight: 'bold',
                          },
                          btnTextCancel: {
                            color: isDarkMode ? '#fff' : '#000',
                          },
                          textStyle: {
                            color: 'black', 
                          },                        
                        }}
                        
                      >
                      </DatePicker>
                    ),
                    android: (
                      <TouchableOpacity onPress={() => setIsFromTimePickerVisible(true)} style={{marginBottom:20,marginTop:8,paddingHorizontal:12,paddingVertical:5, borderWidth:1, borderColor:'#fff'}}>
                        <Text style={{ color: '#fff', fontSize:dynamicFontSize(3.5), }}>
                          {formatTime(selectedTimeFrom)} {/* Prikaz na Android uređajima */}
                        </Text>
                      </TouchableOpacity>
                    ),
                  })}
                  {isFromTimePickerVisible && Platform.OS === 'android' ? (
                    <DateTimePicker
                      value={selectedTimeFrom}
                      mode="time"
                      is24Hour={false}
                      
                      display="spinner"
                      themeVariant="dark"
                      onChange={(event, selectedTime) => {
                        if (event.type === 'set') {
                          setSelectedTimeFrom(selectedTime);
                        }
                        setIsFromTimePickerVisible(false);
                      }}
                      style={{ fontSize: dynamicFontSize(3.5), backgroundColor:'blue' }}
                    />
                  ) : null}
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Text style={{ color: '#fff', fontFamily: 'impact', fontSize: dynamicFontSize(5.5) }}>Until: </Text>
                  {Platform.select({
                    ios: (
                      <DatePicker
                        value={selectedTimeUntil}
                        date={selectedTimeUntil}
                        style={{marginBottom:20}}
                        mode="time"
                        is24Hour={false}
                        display="spinner"
                        format="h:mm A" // Prikazuje AM/PM
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        onDateChange={(time) => setSelectedTimeUntil(time)}
                        showIcon={false}
                        customStyles={{
                          datePickerCon: {
                            backgroundColor:isDarkMode ? 'black' : 'white',
                          },
                          dateInput: {
                            borderWidth: 1, // Uklanja ivice
                            borderRadius:8,
                            marginTop:10,
                            alignItems: 'flex-start', // Poravnanje teksta u prozoru
                            color:'#000',
                            backgroundColor:'#fff'
                          },
                          dateText: {
                            fontSize: dynamicFontSize(3.5), // Prilagodite veličinu fonta po želji
                            color: '#000',
                            alignSelf:'center',
                          },
                          btnTextConfirm: {
                            color: '#5ce1e6', // Postavite boju teksta na crnu
                            fontWeight: 'bold',
                          },
                          btnTextCancel: {
                            color: isDarkMode ? '#fff' : '#000',
                          },
                          textStyle: {
                            color: 'black', // Postavite boju teksta brojeva i AM/PM ovde
                          },
                          
                        }}
                      >
                        {/* <Text style={{ color: '#000' }}>{selectedTimeUntil}</Text> */}
                      </DatePicker>
                    ),
                    android: (
                      <TouchableOpacity onPress={() => setIsUntilTimePickerVisible(true)} style={{marginTop:8,paddingVertical:5,paddingHorizontal:12, borderWidth:1, borderColor:'#fff'}}>
                        <Text style={{ color: '#fff', fontSize:dynamicFontSize(3.5), }}>
                          {formatTime(selectedTimeUntil)} {/* Prikaz na Android uređajima */}
                        </Text>
                      </TouchableOpacity>
                    ),
                  })}
                  {isUntilTimePickerVisible && Platform.OS === 'android' ? (
                    <DateTimePicker
                      value={selectedTimeUntil}
                      mode="time"
                      is24Hour={false}
                      display="spinner"
                      onChange={(event, selectedTime) => {
                        if (event.type === 'set') {
                          setSelectedTimeUntil(selectedTime);
                        }
                        setIsUntilTimePickerVisible(false);
                      }}
                      style={{ fontSize: dynamicFontSize(3.5) }}
                    />
                  ) : null}
                </View>


                </View>
                <Text style={{ color: '#fff', fontFamily: 'impact', fontSize: dynamicFontSize(5.5), marginTop:dynamicFontSize(4.8), }}>Mention user</Text>
                <Text style={{ color: '#fff', paddingBottom: dynamicFontSize(2.3), fontSize:dynamicFontSize(3), }}>(If you mention someone, that user will receive an request to accept or decline a copy of this note in his own calendar)</Text>
                <TextInput
                  value={mentionedFor}
                  autoCorrect={false}
                  placeholder='Enter First Name'
                  placeholderTextColor='grey'
                  style={{ borderWidth: 1, color: '#fff', borderColor: 'grey', borderRadius: 8, marginBottom: 15, fontSize:dynamicFontSize(4), paddingHorizontal:dynamicFontSize(2), paddingVertical:dynamicFontSize(2), }}
                  onChangeText={async (query) => {
                    setMentionedFor(query);
                    if (query) {
                      const results = await searchUsers(query);
                      setSearchResults(results);
                    } else {
                      setSearchResults([]);
                    }
                  }}
                />  

                {searchResults.length > 0 && (
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 10 }}>
                    {searchResults.map((user) => (
                      <TouchableOpacity
                        key={user.uid}
                        style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}
                        onPress={() => {
                          setSelectedUser(user);
                          setMentionedFor(user.firstName + ' ' + user.lastName);
                          setSearchResults([]);
                        }}
                      >
                        <Image
                          source={{ uri: user.profileImageURL }}
                          style={{ width: deviceWidth * 0.08, height: deviceWidth * 0.08, borderRadius: dynamicFontSize(5), marginRight: 5 }}
                        />

                        <Text style={{ color: '#fff', fontSize:dynamicFontSize(3.4), }}>{user.firstName} {user.lastName}</Text>

                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <View style={{ flexDirection: 'row', marginTop: dynamicFontSize(8), justifyContent: 'space-between', marginBottom: 10 }}>
                  <TouchableOpacity
                    onPress={() => setSelectedColor('gray')}
                    style={{
                      width: deviceWidth * 0.06,
                      height: deviceWidth * 0.06,
                      backgroundColor: 'gray',
                      borderRadius: dynamicFontSize(5),
                      borderWidth: selectedColor === 'gray' ? 2 : 0,
                      borderColor: '#5ce1e6'
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => setSelectedColor('#32cd32')}

                    style={{
                      width: deviceWidth * 0.06,
                      height: deviceWidth * 0.06,
                      backgroundColor: '#32cd32',
                      borderRadius: dynamicFontSize(5),
                      borderWidth: selectedColor === '#32cd32' ? 2 : 0,
                      borderColor: '#5ce1e6'
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => setSelectedColor('#ff355e')}
                    style={{
                      width: deviceWidth * 0.06,
                      height: deviceWidth * 0.06,
                      backgroundColor: '#ff355e',
                      borderRadius: dynamicFontSize(5),
                      borderWidth: selectedColor === '#ff355e' ? 2 : 0,
                      borderColor: '#5ce1e6'
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => setSelectedColor('#ffdf00')}
                    style={{
                      width: deviceWidth * 0.06,
                      height: deviceWidth * 0.06,
                      backgroundColor: '#ffdf00',
                      borderRadius: dynamicFontSize(5),
                      borderWidth: selectedColor === '#ffdf00' ? 2 : 0,
                      borderColor: '#5ce1e6'
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => setSelectedColor('#5ce1e6')}
                    style={{
                      width: deviceWidth * 0.06,
                      height: deviceWidth * 0.06,
                      backgroundColor: '#5ce1e6',
                      borderRadius: dynamicFontSize(5),
                      borderWidth: selectedColor === '#5ce1e6' ? 2 : 0,
                      borderColor: '#5ce1e6'
                    }}
                  /> 
                </View>

                <TouchableOpacity onPress={handleSave} style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#5ce1e6', paddingVertical: 5, borderRadius: 8, marginTop: 20 }}>
                  <Text style={{ color: '#181818', fontFamily: 'impact', fontSize: dynamicFontSize(4.8), }}>Add Note</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

        </Modal>
      )}
    </View>


  );
};

export default CalendarScreen;
