import { useEffect, useRef } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, Path, RadialGradient, Stop } from 'react-native-svg';

export type BodyBuddyLoadingVariant = 'flip3d' | 'liftBounce' | 'elasticTrail';

interface BodyBuddyLoadingIconProps {
  size?: number;
  variant?: BodyBuddyLoadingVariant;
}

// viewBox חתוך לאזור הסמל (הקסגון + H) בלבד, בלי הטקסט "Body Buddy" שנמצא מתחת ל-y=712
const ICON_VIEWBOX = '0 0 717 720';

const HEX_BORDER_PATH =
  'M624.163 356.05C624.163 356.05 657.694 325.231 663.672 309.531C672.416 286.599 670.886 205.878 670.886 205.878C670.867 184.64 659.54 165.021 641.141 154.437L387.313 8.19626C368.915 -2.38839 346.256 -2.36874 327.914 8.24777L74.3022 154.928C55.9224 165.582 44.6289 185.22 44.6473 206.421L44.9013 499.417C44.9197 520.656 56.2473 540.274 74.6456 550.859L328.474 697.137C346.872 707.721 369.531 707.702 387.873 697.085L641.447 550.367C659.827 539.751 671.121 520.113 671.102 498.874C671.102 498.874 668.825 420.514 663.975 399.991C657.736 373.626 624.126 356.05 624.126 356.05L624.163 356.05Z' +
  'M578.538 519.107L380.735 628.169C362.767 638.56 340.67 638.842 322.46 628.856L127.054 521.821C107.607 511.162 95.7164 490.608 96.1841 468.47L100.822 245.703C101.254 224.951 112.51 205.913 130.478 195.522L335.015 77.1643C352.983 66.7728 375.079 66.4915 393.29 76.477L588.696 183.512C605.369 191.027 609.201 204.958 611.43 226.719C611.43 226.719 611.789 252.377 611.048 261.78C608.899 288.677 601.028 324.343 526.611 326.056C522.716 326.134 519.573 329.321 519.577 333.217L519.616 378.841C519.62 383.073 523.256 386.366 527.487 385.988C546.998 384.211 596.884 383.83 607.481 424.276C614.019 449.255 612.953 472.255 607.386 487.393C603.762 497.285 587.971 513.705 578.538 519.144L578.538 519.107Z';

const H_MARK_PATH =
  'M283.792 276.638C286.162 276.636 288.078 279.099 288.081 282.151L288.112 317.829C288.113 319.649 289.264 321.127 290.677 321.126L406.577 321.026C407.99 321.024 409.137 319.544 409.135 317.724L409.104 282.046C409.102 278.994 411.014 276.528 413.385 276.525L456.47 276.488C458.84 276.486 460.757 278.949 460.76 282.001L460.778 302.874C460.779 304.694 461.929 306.172 463.342 306.171L481.278 306.155C483.648 306.153 485.564 308.616 485.567 311.668L485.635 390.607C485.638 393.659 483.726 396.125 481.356 396.128L463.376 396.143C461.963 396.145 460.815 397.625 460.816 399.444L460.837 423.065C460.84 426.117 458.928 428.584 456.558 428.587L413.473 428.624C411.102 428.626 409.185 426.162 409.183 423.11L409.149 384.664C409.148 382.844 407.997 381.367 406.584 381.368L290.715 381.469C289.301 381.47 288.154 382.949 288.155 384.769L288.189 423.215C288.191 426.267 286.28 428.734 283.909 428.736L242.356 428.772C239.985 428.774 238.068 426.311 238.066 423.259L238.045 399.638C238.043 397.818 236.893 396.34 235.48 396.341L217.177 396.357C214.806 396.359 212.89 393.896 212.887 390.844L212.819 311.904C212.816 308.852 214.728 306.386 217.099 306.384L235.416 306.368C236.83 306.367 237.977 304.887 237.976 303.067L237.958 282.194C237.955 279.142 239.868 276.676 242.238 276.674L283.792 276.638Z';

function LogoMark({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox={ICON_VIEWBOX} fill="none">
      <Path d={HEX_BORDER_PATH} fill="#516070" fillRule="evenodd" />
      <Path d={H_MARK_PATH} fill="#96C828" />
    </Svg>
  );
}

export default function BodyBuddyLoadingIcon({ size = 96, variant = 'elasticTrail' }: BodyBuddyLoadingIconProps) {
  const rotationY = useSharedValue(0);
  const rotationZ = useSharedValue(0);
  const translateY = useSharedValue(0);
  const wobble = useSharedValue(0);
  const gradientId = useRef(`bb-loading-glow-${Math.random().toString(36).slice(2)}`).current;

  useEffect(() => {
    if (variant === 'flip3d') {
      // סיבוב תלת-מימדי סביב ציר Y — כמו דיסקית משקולת שמסתובבת במרחב
      rotationY.value = withRepeat(withTiming(360, { duration: 2200, easing: Easing.linear }), -1, false);
    } else if (variant === 'elasticTrail') {
      // סיבוב עם קפיצה אלסטית + זנב זוהר שנשאר מאחור
      rotationZ.value = withRepeat(
        withTiming(360, { duration: 1300, easing: Easing.out(Easing.elastic(1.1)) }),
        -1,
        false
      );
    } else if (variant === 'liftBounce') {
      // הרמת משקולת: זינוק למעלה ונחיתה עם bounce, פלוס נדנוד קל
      translateY.value = withRepeat(
        withSequence(
          withTiming(-16, { duration: 300, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 500, easing: Easing.bounce })
        ),
        -1,
        false
      );
      wobble.value = withRepeat(
        withSequence(withTiming(-8, { duration: 400 }), withTiming(8, { duration: 400 })),
        -1,
        true
      );
    }
  }, [variant]);

  const flipStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 900 }, { rotateY: `${rotationY.value}deg` }],
  }));

  const flipGlowStyle = useAnimatedStyle(() => {
    const facing = Math.cos((rotationY.value * Math.PI) / 180);
    return {
      opacity: interpolate(facing, [-1, 1], [0.25, 0.7]),
      transform: [{ scale: interpolate(facing, [-1, 1], [0.8, 1.1]) }],
    };
  });

  const mainSpinStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotationZ.value}deg` }] }));
  const ghost1Style = useAnimatedStyle(() => ({
    opacity: 0.16,
    transform: [{ rotate: `${rotationZ.value - 16}deg` }],
  }));
  const ghost2Style = useAnimatedStyle(() => ({
    opacity: 0.07,
    transform: [{ rotate: `${rotationZ.value - 30}deg` }],
  }));

  const liftStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { rotate: `${wobble.value}deg` }],
  }));

  const glowSize = size * 1.4;

  return (
    <View
      style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="טוען"
      accessibilityState={{ busy: true }}
    >
      {variant === 'flip3d' && (
        <>
          <Animated.View style={[{ position: 'absolute', width: glowSize, height: glowSize }, flipGlowStyle]}>
            <Svg width={glowSize} height={glowSize} viewBox={`0 0 ${glowSize} ${glowSize}`}>
              <Defs>
                <RadialGradient id={gradientId} cx="50%" cy="50%" r="50%">
                  <Stop offset="0%" stopColor="#96C828" stopOpacity={0.55} />
                  <Stop offset="100%" stopColor="#96C828" stopOpacity={0} />
                </RadialGradient>
              </Defs>
              <Circle cx={glowSize / 2} cy={glowSize / 2} r={glowSize / 2} fill={`url(#${gradientId})`} />
            </Svg>
          </Animated.View>
          <Animated.View style={[{ width: size, height: size }, flipStyle]}>
            <LogoMark size={size} />
          </Animated.View>
        </>
      )}

      {variant === 'elasticTrail' && (
        <>
          <Animated.View style={[{ position: 'absolute', width: size, height: size }, ghost2Style]}>
            <LogoMark size={size} />
          </Animated.View>
          <Animated.View style={[{ position: 'absolute', width: size, height: size }, ghost1Style]}>
            <LogoMark size={size} />
          </Animated.View>
          <Animated.View style={[{ width: size, height: size }, mainSpinStyle]}>
            <LogoMark size={size} />
          </Animated.View>
        </>
      )}

      {variant === 'liftBounce' && (
        <Animated.View style={[{ width: size, height: size }, liftStyle]}>
          <LogoMark size={size} />
        </Animated.View>
      )}
    </View>
  );
}
