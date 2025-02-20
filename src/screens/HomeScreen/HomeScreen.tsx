import {
  StyleSheet,
  Text,
  View,
  SectionList,
  ScrollView,
  Image,
  Dimensions,
  SectionListData,
} from 'react-native';
import React, {memo, useState, useRef} from 'react';
import Video from 'react-native-video';
import {SECTIONS_DATA} from '../../constants/constants';

const {width} = Dimensions.get('window');

interface MediaItemTypes {
  item: any;
  isVisible: boolean;
}

interface onViewableItemsChangedTypes {
  viewableItems: Array<{item: any; isViewable: boolean}>;
}

interface renderItemTypes {
  item: Array<any>;
  section: any;
}

// Update MediaItem component to handle the new source format
const MediaItem = memo(({item, isVisible}: MediaItemTypes) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.mediaItem}>
        {item.type === 'image' ? (
          <Image source={item.source} style={styles.media} resizeMode="cover" />
        ) : (
          <Video
            source={item.source}
            style={styles.media}
            resizeMode="cover"
            repeat
            paused={!isVisible}
            muted={true}
            controls
          />
        )}
      </View>
    </View>
  );
});

const HomeScreen = () => {
  const [visibleSections, setVisibleSections] = useState(new Set());

  // Tracks which sections are currently visible (60% or more) in the viewport
  const onViewableItemsChanged = useRef(
    ({viewableItems}: onViewableItemsChangedTypes) => {
      const newVisibleSections = new Set();
      viewableItems.forEach(({item, isViewable}) => {
        if (isViewable) {
          newVisibleSections.add(item);
        }
      });
      setVisibleSections(newVisibleSections);
    },
  ).current;

  // Renders a horizontal scrollable list of media items (images/videos) for each section
  const renderItem = ({item, section}: renderItemTypes) => (
    <HorizontalMediaList
      items={item}
      isSectionVisible={visibleSections.has(section.data[0])}
    />
  );

  return (
    <SectionList
      sections={SECTIONS_DATA}
      renderItem={renderItem}
      stickySectionHeadersEnabled={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 60,
      }}
    />
  );
};

// Renders a horizontal scrollable list of media items with pagination dots and auto-play functionality
const HorizontalMediaList = memo(
  ({
    items,
    isSectionVisible,
  }: {
    items: Array<any>;
    isSectionVisible: boolean;
  }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [visibleItems, setVisibleItems] = useState(new Set([0])); // Start with first item visible
    const scrollViewRef = useRef(null);

    const handleScroll = (event: {
      nativeEvent: {contentOffset: {x: number}};
    }) => {
      const contentOffset = event.nativeEvent.contentOffset.x;
      const currentIndex = Math.round(contentOffset / width);
      setActiveIndex(currentIndex);

      // Calculate which items are more than 60% visible
      const viewableThreshold = width * 0.6;
      const visibleIndexes = new Set();

      items.forEach((_, index) => {
        const itemOffset = index * width;
        const itemVisibleWidth = width - Math.abs(contentOffset - itemOffset);

        if (itemVisibleWidth > viewableThreshold) {
          visibleIndexes.add(index);
        }
      });

      setVisibleItems(visibleIndexes as any);
    };

    return (
      <View>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalList}
          onScroll={handleScroll}
          scrollEventThrottle={16}>
          {items.map((item, index) => (
            <MediaItem
              key={item.id}
              item={item}
              isVisible={isSectionVisible && visibleItems.has(index)}
            />
          ))}
        </ScrollView>
        <View style={styles.pagination}>
          {items.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === activeIndex && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
      </View>
    );
  },
);

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingBottom: 20,
    paddingTop: 10,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    padding: 15,
    backgroundColor: '#fff',
  },
  horizontalList: {
    paddingHorizontal: 0,
  },
  media: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    width: width,
    paddingHorizontal: 15,
    marginTop: 25,
  },
  mediaItem: {
    height: 250,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
    overflow: 'hidden',
    marginVertical: 2,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#000',
  },
});
