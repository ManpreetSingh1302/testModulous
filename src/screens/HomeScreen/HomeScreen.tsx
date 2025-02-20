import {
  View,
  SectionList,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React, {memo, useState, useRef} from 'react';
import Video from 'react-native-video';
import {SECTIONS_DATA} from '../../constants/constants';
import {styles} from './HomeScreenStyles';

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
  const [isLoading, setIsLoading] = useState(true);

  return (
    <View style={styles.cardContainer}>
      <View style={styles.mediaItem}>
        {isLoading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}

        {item.type === 'image' ? (
          <Image
            source={item.source}
            style={styles.media}
            resizeMode="cover"
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
          />
        ) : (
          <Video
            source={item.source}
            style={styles.media}
            resizeMode="cover"
            repeat
            paused={!isVisible}
            muted={true}
            controls
            onLoadStart={() => setIsLoading(true)}
            onLoad={() => setIsLoading(false)}
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
