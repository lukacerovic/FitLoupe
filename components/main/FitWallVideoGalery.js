import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  //ActivityIndicator,
  Animated
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import Video from 'react-native-video';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const FitWallVideoGalery = ({ route }) => {
  const [coverVideo, setCoverVideo] = useState(null);
  const [videoList, setVideoList] = useState([]);
  const wallId = route.params.wall;
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChoosingVideo, setIsChoosingVideo] = useState(false);
  const [rotation, setRotation] = useState(0);


  console.log("Video LISTAA",videoList);
  const rotateIcon = () => {
    let angle = 0;
    const a = 10; // Manji poluosa a (horizontalna komponenta)
    const b = 20; // Manji poluosa b (vertikalna komponenta)
  
    const rotationInterval = setInterval(() => {
      const x = a * Math.cos(angle * (Math.PI / 180));
      const y = b * Math.sin(angle * (Math.PI / 180));
  
      setRotation(angle); // Ažurira vrednost rotacije
  
      angle += 5; // Promenite ovu vrednost da biste kontrolisali brzinu rotacije
      if (angle >= 360) {
        angle = 0; // Resetuje ugao kada dođe do 360 stepeni
      }
    }, 16); // Promenite interval prema svojim potrebama (16ms je približno 60 FPS)
  };

  const handleChooseVideo = async () => {
    setIsChoosingVideo(true);
    rotateIcon();
    setSelectedVideo(false);
  
    // Otvaranje galerije za izbor videa
    launchImageLibrary({ mediaType: 'video' }, (response) => {
      if (!response.didCancel) {
        // Korisnik je selektovao video
        const { uri } = response.assets[0];
        setSelectedVideo(uri);
      } else {
        // Korisnik je odustao od izbora videa
        setIsChoosingVideo(false);
      }
    });
  };
  

  const handleUploadVideo = async () => {
    if (selectedVideo) {
      try {
        // Prvo otpremite video datoteku na Firebase Storage
        const response = await fetch(selectedVideo);
        const blob = await response.blob();
        const storageRef = firebase.storage().ref().child(`fit_wall_videos/${Date.now()}.mov`);
        await storageRef.put(blob);
  
        // Zatim dobijte URL video datoteke koju ste otpremili
        const downloadURL = await storageRef.getDownloadURL();
  
        // Sada čuvajte ovaj URL u bazi umesto putanje
        const wallRef = firebase.firestore().collection("fit_wall_videos").doc(wallId);
        const wallSnapshot = await wallRef.get();
  
        if (wallSnapshot.exists) {
          const wallData = wallSnapshot.data();
          if (wallData && wallData.videoList) {
            const updatedVideoList = [...wallData.videoList, downloadURL];
            await wallRef.update({ videoList: updatedVideoList });
            setVideoList(updatedVideoList);
          }
        } else {
          await wallRef.set({ videoList: [downloadURL] });
          setVideoList([downloadURL]);
        }
        setIsChoosingVideo(false);
        setSelectedVideo(null);
      } catch (error) {
        console.error("Error uploading video:", error);
      }
    }
  };
  

  useEffect(() => {
    getVideoList();
  }, []);

  const getVideoList = async () => {
    try {
      const wallRef = firebase.firestore().collection("fit_wall_videos").doc(wallId);
      const wallSnapshot = await wallRef.get();

      if (wallSnapshot.exists) {
        const wallData = wallSnapshot.data();
        if (wallData && wallData.videoList) {
          console.log("Wall data videoList",wallData.videoList)
          setVideoList(wallData.videoList);
        }
      }
    } catch (error) {
      console.error("Error getting video list:", error);
    }
  };

  const handleDelete = async (videoUri) => {
    try {
      const videoIndex = videoList.indexOf(videoUri);

      if (videoIndex !== -1) {
        const updatedVideoList = [...videoList];
        updatedVideoList.splice(videoIndex, 1);

        const wallRef = firebase.firestore().collection("fit_wall_videos").doc(wallId);
        await wallRef.update({ videoList: updatedVideoList });

        setVideoList(updatedVideoList);
      }
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  return (
    <ScrollView style={{ backgroundColor: '#181818', paddingVertical: 100 }}>
      <View style={styles.videoContainer}>
      <View style={styles.videoPreviewContainer}>
        {isChoosingVideo ? (
          !selectedVideo ? ( 
            <Icon
              name="magnify"
              size={dynamicFontSize(8.8)}
              color="#5ce1e6"
              style={{ ...styles.preloaderIcon, transform: [{ rotate: `${rotation}deg` }] }}
            />
            
          ) : (
            <Video source={{ uri: selectedVideo }} style={styles.video} resizeMode="cover" shouldPlay isLooping />
          )
        ) : (
          !isChoosingVideo && ( // Prikazi ikonu file-video samo ako nije odabran video i nije u toku odabir videa
            <Icon name="file-video" size={dynamicFontSize(20)} color="#fff" style={styles.videoIcon} />
          )
        )}
      </View>


        <View style={{ flexDirection: 'row', justifyContent: selectedVideo ? 'center' : 'space-between' }}>
          <TouchableOpacity style={styles.chooseVideoButton} onPress={handleChooseVideo}>
            <Text style={styles.chooseVideoButtonText}>Choose Video</Text>
          </TouchableOpacity>
          {selectedVideo && (
            <TouchableOpacity style={[styles.chooseVideoButton, { marginLeft: dynamicFontSize(10) }]} onPress={handleUploadVideo}>
              <Text style={styles.chooseVideoButtonText}>Upload Video</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Text style={{ fontFamily: 'impact', color: '#fff', fontSize: dynamicFontSize(8), paddingLeft: dynamicFontSize(3), marginTop: dynamicFontSize(10) }}>Video List</Text>
      <View style={styles.videoListContainer}>
        {videoList.map((video, index) => (
          <View key={index} style={styles.videoListItemContainer}>
            <Video
              source={{ uri: video }}
              style={styles.videoListItem}
              resizeMode="cover"
              controls={true}
              //paused={true}
              
            />
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(video)}
            >
              <Icon name="delete" size={dynamicFontSize(6)} color="#FF0000" />
            </TouchableOpacity>
          </View>
        ))}

      </View>
    </ScrollView>
  );
};

const deviceWidth = Dimensions.get('window').width;

const dynamicFontSize = (percentage) => {
  return (deviceWidth * percentage) / 100;
};

const styles = StyleSheet.create({
  videoContainer: {
    width: '100%',
    marginTop: 30,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoPreviewContainer: {
    width: '90%',
    height: deviceWidth * 0.4,
    backgroundColor: '#000',
    marginBottom: 10,
  },
  video: {
    flex: 1,
  },
  emptyVideo: {
    flex: 1,
    backgroundColor: '#fff',
  },
  videoIcon: {
    flex: 1,
    alignSelf: 'center',
    paddingTop: dynamicFontSize(10),
  },
  chooseVideoButton: {
    backgroundColor: '#30A9C7',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: dynamicFontSize(5),
  },
  // uploadButton: {
  //   backgroundColor: '#30A9C7',
  //   padding: 10,
  //   borderRadius: 5,
  //   alignItems: 'center',
  //   marginTop: dynamicFontSize(5),
  // },
  chooseVideoButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize:dynamicFontSize(3.5),
  },
  // uploadButtonText: {
  //   color: 'white',
  //   fontWeight: 'bold',
  // },
  videoListContainer: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: dynamicFontSize(22),
  },
  videoListItemContainer: {
    width: '80%',
    marginBottom: dynamicFontSize(12),
  },
  videoListItem: {
    width: '100%',
    height: deviceWidth * 0.4,
  },
  deleteButton: {
    marginTop: 8,
    alignItems: 'flex-end',
  },
  preloaderIcon: {
    width:dynamicFontSize(20),
    alignSelf:'center',
    marginTop:dynamicFontSize(20),
    //transform: [{ rotate: rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }],
  },
  
});

export default FitWallVideoGalery;
