import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, RefreshControl, Dimensions } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const Chat = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const currentUser = firebase.auth().currentUser;
  const [refreshing, setRefreshing] = useState(false);

  console.log(users)
  const onRefresh = () => {
    setRefreshing(true);
    fetchChats();
    setRefreshing(false);
  };

  const fetchChats = async () => {
    const chatsSnapshot = await firebase
      .firestore()
      .collection('chats')
      .get();

    const filteredContacts = {};

    for (const doc of chatsSnapshot.docs) {
      const chat = doc.id;
      const idParts = chat.split('_');
      const leftSide = idParts[0];
      const rightSide = idParts[1];

      if (leftSide === currentUser.uid || rightSide === currentUser.uid) {
        const lastMessageSnapshot = await firebase
          .firestore()
          .collection('chats')
          .doc(chat)
          .get()
      
        const messages = lastMessageSnapshot.data()
      
        let lastMessageText = ''; // Početna vrednost ako nema poruka
      
        if (messages && messages.messages && messages.messages.length > 0) {
          const lastMessage = messages.messages[messages.messages.length - 1];
          lastMessageText = lastMessage.text;
        }
      
        if (leftSide !== currentUser.uid) {
          filteredContacts[leftSide] = lastMessageText;
        }
        if (rightSide !== currentUser.uid) {
          filteredContacts[rightSide] = lastMessageText;
        }
      }
    }

    if (Object.keys(filteredContacts).length > 0) {
      const usersData = [];

      for (const id of Object.keys(filteredContacts)) {
        const userDoc = await firebase
          .firestore()
          .collection('users')
          .doc(id)
          .get();

        if (userDoc.exists) {
          const user = userDoc.data();
          user.userId = id;
          user.lastMessage = filteredContacts[id];
          usersData.push(user);
        }
      }

      setUsers(usersData);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [currentUser]);

  return (
    <ScrollView style={{ backgroundColor: '#181818' }} refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }>
      <View style={styles.container}>
        {users.map((user, index) => (
          <TouchableOpacity
            key={`${user.uid}-${index}`}
            style={styles.contactContainer}
            onPress={() => {
              navigation.navigate('ChatPage', { id: user.userId, userName: user.firstName });
            }}
          >
            <View style={styles.userInfo}>
              <View style={styles.userImgWrapper}>
                <Image
                  source={{ uri: user?.profileImageURL }}
                  style={styles.userImg}
                />
              </View>
              <View style={styles.textSection}>
                <View style={styles.userInfoText}>
                  <Text style={{ fontFamily: 'impact', fontSize: dynamicFontSize(4), fontWeight: 'bold', color: 'white' }}>
                    {user.firstName} {user.lastName}
                  </Text>
                  
                </View>
                <Text style={{ color: '#d3d3d3', fontSize: dynamicFontSize(3.5), paddingTop: dynamicFontSize(2),height:deviceWidth * 0.11,}}>
                  {user.lastMessage}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
  selectTag: {
    backgroundColor: '#181818',
  },
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
    width: deviceWidth * 0.2,
    height: deviceWidth * 0.2,
    borderRadius: dynamicFontSize(10),
    borderWidth: 1,
    borderColor: "cyan",
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
  postTime: {
    fontSize: 12,
    color: 'white',
  },
  messageText: {
    fontSize: 14,
    color: '#333333',
  },
});

export default Chat;
