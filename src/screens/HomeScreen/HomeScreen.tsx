import React, {useRef, useState, useCallback} from 'react';
import {View, FlatList, Dimensions} from 'react-native';
import Video from 'react-native-video';
import FastImage from 'react-native-fast-image';
import {DATA} from '../../constants/constants';
import {styles} from './HomeScreenStyles';

const {width} = Dimensions.get('window');

interface CarouselDotsTypes {
  total: number;
  current: number;
}
interface CarouselItemTypes {
  item: {type: string; uri: string};
  isPlaying: boolean;
}

interface CarouselTypes {
  media: {type: string; uri: string}[];
  isParentVisible: boolean;
}

const HomeScreen = (): React.JSX.Element => {
  const [playingItems, setPlayingItems] = useState<Set<string>>(new Set());

  const viewabilityConfig = useRef({
    minimumViewTime: 300,
    itemVisiblePercentThreshold: 30, // Changed to use only this threshold
  });

  // Renders either an image or video component based on the item type with play/pause control
  const CarouselItem = ({item, isPlaying}: CarouselItemTypes) => {
    // To check if the item is an image or a video
    const isImage = item.type === 'image';

    return (
      <View style={styles.carouselItemContainer}>
        <View style={styles.carouselItem}>
          {isImage ? (
            <FastImage
              source={{uri: item.uri}}
              style={styles.media}
              resizeMode="cover"
            />
          ) : (
            <Video
              source={{uri: item.uri}}
              style={styles.media}
              resizeMode="cover"
              controls={false}
              paused={!isPlaying}
              repeat={true}
            />
          )}
        </View>
      </View>
    );
  };

  // Handles visibility changes of items in the FlatList
  const onViewableItemsChanged = useCallback(({viewableItems}: any) => {
    const newPlayingItems = new Set<string>();
    viewableItems.forEach((viewableItem: any) => {
      newPlayingItems.add(viewableItem.item.id);
    });
    setPlayingItems(newPlayingItems);
  }, []);

  // Renders pagination dots indicating current position in the carousel with active/inactive states
  const CarouselDots = React.memo(({total, current}: CarouselDotsTypes) => {
    return (
      <View style={styles.dotsContainer}>
        {Array(total)
          .fill(0)
          .map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {backgroundColor: current === index ? '#0095f6' : '#c4c4c4'},
              ]}
            />
          ))}
      </View>
    );
  });

  // Horizontal scrollable carousel component that manages media playback and pagination indicators
  const Carousel = ({media, isParentVisible}: CarouselTypes) => {
    const [playingIndex, setPlayingIndex] = useState<number | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const viewabilityConfig = useRef({
      minimumViewTime: 300,
      itemVisiblePercentThreshold: 30,
    });

    const onViewableItemsChanged = useCallback(({viewableItems}: any) => {
      if (viewableItems[0]) {
        setCurrentIndex(viewableItems[0].index);
        const firstVisibleItem = viewableItems.find(
          (item: any) => item.item.type === 'video',
        );
        setPlayingIndex(firstVisibleItem ? firstVisibleItem.index : null);
      }
    }, []);

    return (
      <View style={styles.carouselWrapper}>
        <FlatList
          data={media}
          horizontal
          pagingEnabled
          snapToAlignment="start"
          decelerationRate="fast"
          snapToInterval={width - 24}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({item, index}) => (
            <CarouselItem
              item={item}
              isPlaying={isParentVisible && index === playingIndex}
            />
          )}
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig.current}
          initialNumToRender={2}
          windowSize={3}
          removeClippedSubviews={false}
        />
        <CarouselDots total={media?.length} current={currentIndex} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={DATA}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.listItem}>
            <Carousel
              media={item.media}
              isParentVisible={playingItems.has(item.id)}
            />
          </View>
        )}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig.current}
        initialNumToRender={2}
        windowSize={5}
        maxToRenderPerBatch={2}
        removeClippedSubviews={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default HomeScreen;
