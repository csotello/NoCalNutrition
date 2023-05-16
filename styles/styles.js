import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  primaryBackgroundColor: '#3d3c3a',
  header: {
    textAlign: 'center',
    color: 'white',
    fontSize: 15,
    borderBottomWidth: 2,
    backgroundColor: 'black',
    marginBottom: 5,
  },
  nutrient: {
    textAlign: 'center',
    fontSize: 16,
  },
  navigator: {
    activeColor: '#0a0a0a',
    backgroundColor: '#363738',
  },
  customFood: {
    width: 40,
    left: 10,
  },
  modalTab: {
    width: '34%',
    padding: 10,
    justifyContent: 'center',
    marginBottom: 10,
    textAlign: 'center',
    borderColor: 'grey',
    elevation: 1,
    color: 'white',
  },
});

export default styles;
