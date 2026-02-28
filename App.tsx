import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import NavigationBar from './components/NavigationBar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  AppState,
  AppStateStatus,
  Easing,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './store/store';
import { LanguageProvider } from './i18n/LanguageContext';

const SPLASH_DURATION_MS = 5000;
const FADE_OUT_MS = 500;

function SplashScreen() {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const motionProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const logoAnimation = Animated.timing(logoOpacity, {
      toValue: 1,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });

    const blockLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(motionProgress, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(motionProgress, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    );

    logoAnimation.start();
    blockLoop.start();

    return () => {
      blockLoop.stop();
    };
  }, [logoOpacity, motionProgress]);

  const blockOneX = motionProgress.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [-72, 70, 72, -68, -72],
  });
  const blockOneY = motionProgress.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [-72, -70, 72, 68, -72],
  });

  const blockTwoX = motionProgress.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [68, 72, -72, -68, 68],
  });
  const blockTwoY = motionProgress.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [-56, 68, 64, -58, -56],
  });

  const blockThreeX = motionProgress.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [-16, 90, -18, -90, -16],
  });
  const blockThreeY = motionProgress.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [92, 14, -92, 14, 92],
  });

  const blockFourX = motionProgress.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [92, 20, -92, -22, 92],
  });
  const blockFourY = motionProgress.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [18, -92, -18, 92, 18],
  });

  const blockScale = motionProgress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.92, 1.08, 0.92],
  });

  return (
    <View style={styles.splashContainer}>
      <View style={styles.splashStage}>
        <Animated.View
          style={[
            styles.movingBlock,
            styles.blockOne,
            { transform: [{ translateX: blockOneX }, { translateY: blockOneY }, { scale: blockScale }] },
          ]}
        />
        <Animated.View
          style={[
            styles.movingBlock,
            styles.blockTwo,
            { transform: [{ translateX: blockTwoX }, { translateY: blockTwoY }, { scale: blockScale }] },
          ]}
        />
        <Animated.View
          style={[
            styles.movingBlock,
            styles.blockThree,
            { transform: [{ translateX: blockThreeX }, { translateY: blockThreeY }, { scale: blockScale }] },
          ]}
        />
        <Animated.View
          style={[
            styles.movingBlock,
            styles.blockFour,
            { transform: [{ translateX: blockFourX }, { translateY: blockFourY }, { scale: blockScale }] },
          ]}
        />
      </View>
      <Animated.View style={[styles.logoWrapper, { opacity: logoOpacity }]}>
        <Text style={styles.logoText}>uCash</Text>
      </Animated.View>
    </View>
  );
}

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [showSplash, setShowSplash] = useState(true);
  const splashOpacity = useRef(new Animated.Value(1)).current;
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const appStateRef = useRef(AppState.currentState);

  const clearHideTimer = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const runSplashSequence = useCallback(() => {
    clearHideTimer();
    splashOpacity.stopAnimation();
    splashOpacity.setValue(1);
    setShowSplash(true);

    hideTimerRef.current = setTimeout(() => {
      Animated.timing(splashOpacity, {
        toValue: 0,
        duration: FADE_OUT_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(() => setShowSplash(false));
    }, SPLASH_DURATION_MS);
  }, [splashOpacity]);

  useEffect(() => {
    runSplashSequence();

    const onAppStateChange = (nextAppState: AppStateStatus) => {
      const wasInBackground =
        appStateRef.current === 'background' || appStateRef.current === 'inactive';

      if (wasInBackground && nextAppState === 'active') {
        runSplashSequence();
      }

      appStateRef.current = nextAppState;
    };

    const appStateSubscription = AppState.addEventListener('change', onAppStateChange);

    return () => {
      appStateSubscription.remove();
      clearHideTimer();
    };
  }, [runSplashSequence]);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <LanguageProvider>
          <SafeAreaProvider>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <View style={styles.appContainer}>
              <NavigationContainer>
                <View style={styles.appContainer}>
                  <AppNavigator />
                  <NavigationBar />
                </View>
              </NavigationContainer>
              {showSplash && (
                <Animated.View style={[styles.splashOverlay, { opacity: splashOpacity }]}>
                  <SplashScreen />
                </Animated.View>
              )}
            </View>
          </SafeAreaProvider>
        </LanguageProvider>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
  splashOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  splashContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#050505',
  },
  splashStage: {
    width: 240,
    height: 240,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: '#0B0B0B',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  movingBlock: {
    position: 'absolute',
    width: 68,
    height: 68,
    borderRadius: 24,
    left: '50%',
    top: '50%',
    marginLeft: -34,
    marginTop: -34,
    opacity: 0.92,
  },
  blockOne: {
    backgroundColor: '#1F1F1F',
  },
  blockTwo: {
    backgroundColor: '#4B4B4B',
  },
  blockThree: {
    backgroundColor: '#8A8A8A',
  },
  blockFour: {
    backgroundColor: '#D9D9D9',
  },
  logoWrapper: {
    marginTop: 28,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  logoText: {
    color: '#F6F6F6',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
});

