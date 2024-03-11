import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Text,
  Modal,
  ScrollView,
} from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { sendNotification } from '../../../services/Notification';

const ChatPage = ({ route }) => {
  const [messages, setMessages] = useState([]);
  const currentUser = firebase.auth().currentUser;
  const sender = { _id: currentUser.uid, name: currentUser.displayName || '' };
  const receiver = { _id: route.params.id, name: route.params.contactName || '' };
  const chatId = [currentUser.uid, route.params.id].sort().join('_');
  const [initialLoad, setInitialLoad] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [notificationName, setNotificationName] = useState([]);

  const giftedChatRef = useRef(null);



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

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection('chats')
      .doc(chatId)
      .onSnapshot((snapshot) => {
        if (snapshot.exists) {
          const data = snapshot.data();
          if (data && data.messages) {
            setMessages(data.messages.map(transformMessage));
            
            if (initialLoad) {
              setInitialLoad(false);
            }
          }
        }
      });

    return () => unsubscribe();
  }, [chatId, initialLoad]);

  const handleSend = async (newMessages) => {
    const message = newMessages[0];
    const _id = Date.now();
    const text = message.text;
    const timestamp = message.createdAt.getTime();
    const messageData = { _id, sender: message.user._id, receiver: receiver._id, text, createdAt: timestamp };

    const chatRef = firebase.firestore().collection('chats').doc(chatId);
    const chatDoc = await chatRef.get();
    //const userDoc = await firebase.firestore.collection('users').doc(receiver._id);
    console.log(receiver);
   
    const userDoc = await firebase
    .firestore()
    .collection('users')
    .doc(receiver._id)
    .get()
  
    if(userDoc.exists){
      const receiverUser = userDoc.data();
      if(receiverUser.fcm){
        const fcm = receiverUser.fcm ;
        sendNotification(
          fcm ,
          `${notificationName}`,
          message.text //should be sender name 
          // place for text of a meesage to pas for text value in notifications
        )
      }
    }

    if (chatDoc.exists) {
      await chatRef.update({
        messages: firebase.firestore.FieldValue.arrayUnion(messageData),
      });
    } else {
      const newChatData = {
        messages: [messageData],
      };
      await chatRef.set(newChatData);
    }
  };

  const transformMessage = (message) => {
    const transformedMessage = {
      ...message,
      _id: message._id,
      user: {
        ...message.user,
        _id: message.sender === sender._id ? sender._id : receiver._id,
      },
    };

    return transformedMessage;
  };
  
  const scrollToBottomComponent = () => {
    return <Icon name='arrow-down' size={dynamicFontSize(8)} color='#000'></Icon>
  }

  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#DDDDDD',
        }}
      />
    );
  };
  
  const handleBubblePress = (message) => {
    setSelectedMessage(message);
    setIsModalVisible(true);
  };
  
  const handleDeleteMessage = async (message) => {
    try {
      const chatRef = firebase.firestore().collection('chats').doc(chatId);
      const chatDoc = await chatRef.get();
  
      if (chatDoc.exists) {
        const messages = chatDoc.data().messages;
        const updatedMessages = messages.filter((msg) => msg._id !== message._id);
  
        await chatRef.update({
          messages: updatedMessages,
        });
        
        setIsModalVisible(false); // Zatvorite modal nakon brisanja poruke
      } else {
        console.log('Dokument ne postoji ili nema poruka.');
      }
    } catch (error) {
      console.error('Greška prilikom brisanja poruke:', error);
    }
  };
  
  
  const closeModal = () => {
    setIsModalVisible(false);
  };
  
  const renderBubble = (props) => {
    return (
     
        <Bubble
          {...props}
        
          wrapperStyle={{
            left: {
              backgroundColor: '#DDDDDD',
              alignSelf: 'flex-start',
              position: 'relative',
              left: -50,
              paddingTop: dynamicFontSize(1),
            },
            right: {
              backgroundColor: '#5ce1e6',
              alignSelf: 'flex-end',
              paddingTop: dynamicFontSize(1),
            },
          }}
          textStyle={{
            left: {
              color: '#000000',
              fontSize: dynamicFontSize(3),
            },
            right: {
              color: '#181818',
              fontSize: dynamicFontSize(3),
            },
          }}
          position={props.currentMessage.user._id === sender._id ? 'right' : 'left'}
          onPress={() => {
            if (props.currentMessage.user._id === sender._id) {
              // Pokrećemo onPress samo za poruke na desnoj strani
              handleBubblePress(props.currentMessage);
            }
          }}
        />
   
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.chatContainer}>
        <GiftedChat
          ref={giftedChatRef}
          messages={messages}
          user={sender}
          onSend={handleSend}
          renderBubble={renderBubble}
          scrollToBottom={true}
          inverted={false}
          scrollToBottomStyle={{width: dynamicFontSize(8), height: dynamicFontSize(8), borderRadius: dynamicFontSize(10)}}
          scrollToBottomComponent={scrollToBottomComponent}
          textInputStyle={{color: 'black'}}
          onContentSizeChange={() => giftedChatRef.current.scrollToEnd({ animated: true })}
          keyExtractor={(message) => message._id.toString()}
          renderInputToolbar={renderInputToolbar}
        />
      </SafeAreaView>
      {selectedMessage && (
        <Modal 
        visible={isModalVisible} 
        //onBackdropPress={closeModal}
        animationType="slide"
        transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
            <TouchableOpacity style={{alignSelf:'flex-end', marginBottom:dynamicFontSize(5)}} onPress={() => setIsModalVisible(false)}>
              <Text style={{color:'black', fontSize:dynamicFontSize(3.7)}}>Cancel</Text>
            </TouchableOpacity>
            <ScrollView style={{maxHeight:deviceWidth * 0.6}}>
              <Text style={{fontSize:dynamicFontSize(5), color:'black'}}>{selectedMessage.text}</Text>
            </ScrollView>
            <View style={{marginTop:dynamicFontSize(7), borderTopWidth:1, width:'100%'}}>
              <TouchableOpacity style={{alignSelf:'center'}} onPress={() => handleDeleteMessage(selectedMessage)}>
                <Text style={styles.deleteButton}>Delete Message</Text>
              </TouchableOpacity>
              
            </View>
            
          </View>
          </View>
          
        </Modal>
      )}
    </View>
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
  },
  chatContainer: {
    flex: 1,
    marginBottom: 50,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    
  },
  modalContent: {
    backgroundColor: 'rgba(200, 200, 200, 0.95)',
    padding: dynamicFontSize(5),
    borderRadius: 10,
    alignItems: 'center',
    width:'80%',
  },
  deleteButton:{
    color:'red',
    fontSize:dynamicFontSize(4),
    paddingTop:dynamicFontSize(3),
  },
});

export default ChatPage;
















//OVO JE CET KOJI SAM JA PRAVIO I KOJI JE BIO DOBAR (PRE GIFTEDA)

// import React, { useState, useEffect } from 'react';
// import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';
// import 'firebase/compat/firestore';

// const ChatPage = ({ route }) => {
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [contactChat, setContactChat] = useState(null);

//   const currentUser = firebase.auth().currentUser;
//   const sender = currentUser.uid;
//   const receiver = route.params.id;
//   const chatId = [currentUser.uid, route.params.id].sort().join('_');
  
//   useEffect(() => {
//     const fetchContactChat = async () => {
//       const user = firebase.auth().currentUser;
//       if (sender && receiver) {
//         const contactSnapshot = await firebase.firestore().collection('users').doc(route.params.id).get();
//         if (contactSnapshot.exists) {
//           setContactChat(contactSnapshot.data());
//         }
//       }
//     };

//     fetchContactChat();
//   }, []);

//   useEffect(() => {
//     const unsubscribe = firebase
//       .firestore()
//       .collection('chats')
//       .doc(chatId)
//       .onSnapshot((snapshot) => {
//         if (snapshot.exists) {
//           const data = snapshot.data();
//           if (data && data.messages) {
//             setMessages(data.messages);
//           }
//         }
//       });

//     return () => unsubscribe();
//   }, [chatId]);

//   const handleSend = async() => {
//     if (message.trim() === '') {
//       return;
//     }

//     const messageid = messages.length + 1;
//     const text = message.trim();
//     const chatDoc = await firebase.firestore().collection('chats').doc(chatId).get();
//     if(!chatDoc.exists ){
//       firebase
//       .firestore()
//       .collection('chats')
//       .doc(chatId)
//       .set({
//         messages: firebase.firestore.FieldValue.arrayUnion({ messageid, sender, receiver, text }),
//       })
//       .catch((error) => {
//         console.log('Error sending message:', error);
//       });
//       console.log("Izvukla se set metoda");
//       setMessage('');
//     }else {
//         const currentMessages = chatDoc.data().messages || [];
//         currentMessages.push({ messageid, sender, receiver, text });
//         await firebase
//         .firestore()
//         .collection('chats')
//         .doc(chatId)
//         .update({
//           messages: firebase.firestore.FieldValue.arrayUnion({ messageid, sender, receiver, text }),
//         })
//         .catch((error) => {
//           console.log('Error sending message:', error);
//         });
//         console.log("Izvukla se UPDATE metoda");
//       setMessage('');

//     }
    
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerText}>{contactChat?.firstName}</Text>
//       </View>
//       <ScrollView style={styles.messagesContainer}>
//         {messages.map((message) => (
//           <View
//             key={message.messageid}
//             style={[
//               styles.message,
//               message.sender === currentUser.uid ? styles.rightMessage : styles.leftMessage,
//             ]}
//           >

//             <Text style={styles.text}>{message.text}</Text>
//           </View>
//         ))}
//       </ScrollView>
//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder="Type a message..."
//           value={message}
//           onChangeText={setMessage}
//         />
//         <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
//           <Text style={styles.sendButtonText}>Send</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#181818',
//   },
//   header: {
//     height: 50,
//     backgroundColor: '#3A3B3C',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   headerText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: "#fff"
//   },
//   messagesContainer: {
//     flex: 1,
//     padding: 10,
//   },
//   message: {
//     marginBottom: 10,
//     padding: 10,
//     borderRadius: 10,
//     backgroundColor: '#FFFFFF',
//   },
//   rightMessage: {
//     alignSelf: 'flex-end',
//     backgroundColor: '#5ce1e6',
//   },
//   leftMessage: {
//     alignSelf: 'flex-start',
//     backgroundColor: '#DDDDDD',
//   },
//   sender: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     marginBottom: 5,
//     color: '#FFFFFF',
//   },
//   text: {
//     fontSize: 16,
//     color: '#000000',
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//     borderTopWidth: 1,
//     borderTopColor: '#EAEAEA',
//   },
//   input: {
//     flex: 1,
//     height: 40,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 20,
//     paddingHorizontal: 10,
//   },
//   sendButton: {
//     marginLeft: 10,
//     backgroundColor: '#5ce1e6',
//     borderRadius: 20,
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//   },
//   sendButtonText: {
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     fontSize: 14,
//   },
// });

// export default ChatPage;

