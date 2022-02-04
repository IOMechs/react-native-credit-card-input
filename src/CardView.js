import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  ImageBackground,
  Image,
  Text,
  StyleSheet,
  Platform,
  I18nManager,
} from "react-native";

import defaultIcons from "./Icons";
import FlipCard from "react-native-flip-card";

const BASE_SIZE = { width: 300, height: 190 };

const s = StyleSheet.create({
  cardContainer: {},
  cardFace: {},
  icon: {
    position: "absolute",
    top: 15,
    right: I18nManager.isRTL ? 0 : 15,
    width: 60,
    height: 40,
    resizeMode: "contain",
  },
  baseText: {
    color: "rgba(255, 255, 255, 0.8)",
    backgroundColor: "transparent",
  },
  placeholder: {
    color: "rgba(255, 255, 255, 0.5)",
  },
  focused: {
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 1)",
  },
  number: {
    fontSize: 21,
    position: "absolute",
    top: 95,
    right: I18nManager.isRTL ? 28 : 0,
    left: I18nManager.isRTL ? 0 : 28,
  },
  name: {
    fontSize: 16,
    position: "absolute",
    bottom: 20,
    right: I18nManager.isRTL ? 25 : 100,
    left: I18nManager.isRTL ? 100 : 25,
  },
  expiryLabel: {
    fontSize: 9,
    position: "absolute",
    bottom: 40,
    right: I18nManager.isRTL ? 218 : 0,
    left: I18nManager.isRTL ? 0 : 218,
  },
  expiry: {
    fontSize: 16,
    position: "absolute",
    bottom: 20,
    right: I18nManager.isRTL ? 220 : 0,
    left: I18nManager.isRTL ? 0 : 220,
  },
  amexCVC: {
    fontSize: 16,
    position: "absolute",
    top: 73,
    right: 30,
  },
  cvc: {
    fontSize: 16,
    position: "absolute",
    top: 80,
  },
});

/* eslint react/prop-types: 0 */ // https://github.com/yannickcr/eslint-plugin-react/issues/106
export default class CardView extends Component {
  static propTypes = {
    focused: PropTypes.string,
    isMADA: PropTypes.bool,
    brand: PropTypes.string,
    name: PropTypes.string,
    number: PropTypes.string,
    expiry: PropTypes.string,
    cvc: PropTypes.string,
    placeholder: PropTypes.object,

    scale: PropTypes.number,
    fontFamily: PropTypes.string,
    imageFront: PropTypes.number,
    imageBack: PropTypes.number,
    customIcons: PropTypes.object,
    isInstantBooking: PropTypes.bool,
  };

  static defaultProps = {
    name: "",
    placeholder: {
      number: "•••• •••• •••• ••••",
      name: "FULL NAME",
      expiry: "••/••",
      cvc: "•••",
    },

    scale: 1,
    fontFamily: Platform.select({ ios: "Courier", android: "monospace" }),
    normalImageFront: require("../images/normal-card.png"),
    normalImageBack: require("../images/normal-card-back.png"),
    instantImageFront: require("../images/instant-card.png"),
    instantImageBack: require("../images/instant-card-back.png"),

    isMADA: false,
    isInstantBooking: false,
  };

  render() {
    const {
      focused,
      brand,
      name,
      number,
      expiry,
      cvc,
      customIcons,
      placeholder,
      imageFront,
      imageBack,
      scale,
      fontFamily,
      isMADA,
      isInstantBooking,
    } = this.props;
    const Icons = { ...defaultIcons, ...customIcons };
    const isAmex = brand === "american-express";
    const shouldFlip = !isAmex && focused === "cvc";

    const containerSize = { ...BASE_SIZE, height: BASE_SIZE.height * scale };
    const transform = {
      transform: [
        { scale },
        { translateY: (BASE_SIZE.height * (scale - 1)) / 2 },
      ],
    };

    return (
      <View style={[s.cardContainer, containerSize]}>
        <FlipCard
          style={{ borderWidth: 0 }}
          flipHorizontal
          flipVertical={false}
          friction={10}
          perspective={2000}
          clickable={false}
          flip={shouldFlip}
        >
          <ImageBackground
            style={[BASE_SIZE, s.cardFace, transform]}
            source={isInstantBooking ? instantImageBack : normalImageBack}
          >
            <Image
              style={[
                s.icon,
                I18nManager.isRTL && { left: I18nManager.isRTL ? 15 : 0 },
              ]}
              source={!isMADA ? Icons[brand] : Icons["mada"]}
            />
            <Text
              style={[
                s.baseText,
                { fontFamily },
                s.number,
                !number && s.placeholder,
                focused === "number" && s.focused,
              ]}
            >
              {!number ? placeholder.number : number}
            </Text>
            <Text
              style={[
                s.baseText,
                { fontFamily },
                s.name,
                !name && s.placeholder,
                focused === "name" && s.focused,
              ]}
              numberOfLines={1}
            >
              {!name ? placeholder.name : name.toUpperCase()}
            </Text>
            <Text
              style={[
                s.baseText,
                { fontFamily },
                s.expiryLabel,
                s.placeholder,
                focused === "expiry" && s.focused,
              ]}
            >
              MONTH/YEAR
            </Text>
            <Text
              style={[
                s.baseText,
                { fontFamily },
                s.expiry,
                !expiry && s.placeholder,
                focused === "expiry" && s.focused,
              ]}
            >
              {!expiry ? placeholder.expiry : expiry}
            </Text>
            {isAmex && (
              <Text
                style={[
                  s.baseText,
                  { fontFamily },
                  s.amexCVC,
                  !cvc && s.placeholder,
                  focused === "cvc" && s.focused,
                ]}
              >
                {!cvc ? placeholder.cvc : cvc}
              </Text>
            )}
          </ImageBackground>
          <ImageBackground
            style={[BASE_SIZE, s.cardFace, transform]}
            source={isInstantBooking ? instantImageBack : normalImageBack}
          >
            <Text
              style={[
                s.baseText,
                s.cvc,
                !cvc && s.placeholder,
                focused === "cvc" && s.focused,
                I18nManager.isRTL ? { left: 30 } : { right: 30 },
              ]}
            >
              {!cvc ? placeholder.cvc : cvc}
            </Text>
          </ImageBackground>
        </FlipCard>
      </View>
    );
  }
}
