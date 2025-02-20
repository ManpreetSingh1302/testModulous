import {Dimensions, StyleSheet} from 'react-native';
const {width} = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  listContainer: {
    padding: 12,
  },
  carousel: {
    marginBottom: 8,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 8,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginHorizontal: 2,
  },
  carouselWrapper: {
    width: width - 24,
    alignSelf: 'center',
  },
  carouselItemContainer: {
    width: width - 24,
    paddingRight: 0,
  },
  carouselItem: {
    width: width - 24,
    height: (width - 24) * 0.7,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  listItem: {
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  media: {
    width: '100%',
    height: '100%',
  },
});
