import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import exerciseData from '../assets/exerciseData.js';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomDropdown = ({ onSelect }) => {
  const [filterText, setFilterText] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');

  useEffect(() => {
    setFilteredItems(exerciseData);
  }, []);

  const handleFilter = (text) => {
    console.log("Text koji se unosi", text);
    setFilterText(text);
    const filtered = exerciseData.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    console.log("Filtrirani rezultati", filtered);
    setFilteredItems(filtered);
  };

  const handleSelectItem = (item) => {
    setFilterText(item.name);
    setSelectedValue(item.name);
    onSelect(item.name);
    setDropdownVisible(false);
  };

  const closeModal = () => {
    setDropdownVisible(false);
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setDropdownVisible(true)}>
        <Text style={{ color: '#fff', fontSize: dynamicFontSize(4),paddingVertical:dynamicFontSize(2),paddingHorizontal:dynamicFontSize(1),borderWidth: 1,borderColor: '#fff',borderRadius: 5,  }}>
          {selectedValue || 'Search exercises'}
        </Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isDropdownVisible}
        onRequestClose={() => setDropdownVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Icon
              name="close"
              size={dynamicFontSize(8)}
              color="#fff"
              style={styles.closeIcon}
              onPress={closeModal}
            />
            <TextInput
              placeholder="Search exercises"
              placeholderTextColor='grey'
              value={filterText}
              onChangeText={handleFilter}
              style={styles.input}
            />
            <ScrollView keyboardShouldPersistTaps="handled">
              {filteredItems.map((item) => (
                <TouchableOpacity
                  
                  key={item.id}
                  onPress={() => handleSelectItem(item)}
                >
                  <Text style={styles.itemText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              onPress={() => {
                setSelectedValue(filterText);
                onSelect(filterText);
                setDropdownVisible(false);
              }}
            >
              <Text style={styles.selectText}>Select</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const dynamicFontSize = (percentage) => {
  return (deviceWidth * percentage) / 100;
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#000',
    width: '80%',
    padding: dynamicFontSize(2),
    borderRadius: 8,
    height:'70%',
  },
  closeIcon: {
    alignSelf:'flex-end',
  },
  input: {
    color: '#fff',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
    fontSize: dynamicFontSize(4),
    padding: dynamicFontSize(2),
    marginBottom: dynamicFontSize(3),
  },
  itemsContainer: {
    backgroundColor: 'white',
    maxHeight: '60%',
  },
  itemText: {
    fontSize: dynamicFontSize(4),
    paddingHorizontal: dynamicFontSize(1),
    paddingVertical: dynamicFontSize(1),
    color:'#fff',
  },
  selectText: {
    color: '#fff',
    fontSize: dynamicFontSize(4),
    textAlign: 'center',
    padding: dynamicFontSize(1),
    backgroundColor: '#30A9C7',
  },
});

export default CustomDropdown;

