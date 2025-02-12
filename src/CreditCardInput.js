import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactNative, {
  NativeModules,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
  ViewPropTypes,
  I18nManager,
} from "react-native";

import CreditCard from "./CardView";
import CCInput from "./CCInput";
import { InjectedProps } from "./connectToState";

const sHorizontal = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  form: {
    marginTop: 20,
  },
  inputContainer: {
    marginLeft: 20,
  },
  inputLabel: {
    fontWeight: "bold",
  },
  input: {
    height: 40,
  },
});

const sVertical = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  form: {
    width: "100%",
    marginTop: 20,
    flexDirection: "row",
  },
  formContainer: {
    width: "100%",
  },
  inputContainer: {},
  inputLabel: {
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    height: 40,
  },
});

const CVC_INPUT_WIDTH = 100;
const EXPIRY_INPUT_WIDTH = CVC_INPUT_WIDTH;
const CARD_NUMBER_INPUT_WIDTH_OFFSET = 40;
const CARD_NUMBER_INPUT_WIDTH =
  Dimensions.get("window").width -
  EXPIRY_INPUT_WIDTH -
  CARD_NUMBER_INPUT_WIDTH_OFFSET;
const NAME_INPUT_WIDTH = CARD_NUMBER_INPUT_WIDTH;
const PREVIOUS_FIELD_OFFSET = 40;
const POSTAL_CODE_INPUT_WIDTH = 120;

/* eslint react/prop-types: 0 */ // https://github.com/yannickcr/eslint-plugin-react/issues/106
export default class CreditCardInput extends Component {
  static propTypes = {
    ...InjectedProps,
    labels: PropTypes.object,
    arabicLabel: PropTypes.object,
    placeholders: PropTypes.object,

    labelStyle: Text.propTypes.style,
    arabicLabelStyle: Text.propTypes.style,
    inputStyle: Text.propTypes.style,
    inputContainerStyle: ViewPropTypes.style,

    validColor: PropTypes.string,
    invalidColor: PropTypes.string,
    placeholderColor: PropTypes.string,

    cardImageFront: PropTypes.number,
    cardImageBack: PropTypes.number,
    cardScale: PropTypes.number,
    cardFontFamily: PropTypes.string,
    cardBrandIcons: PropTypes.object,
    useVertical: PropTypes.boolean,
    allowScroll: PropTypes.bool,

    additionalInputsProps: PropTypes.objectOf(
      PropTypes.shape(TextInput.propTypes)
    ),
  };

  static defaultProps = {
    cardViewSize: {},
    labels: {
      name: "CARDHOLDER'S NAME",
      number: "CARD NUMBER",
      expiry: "EXPIRY",
      cvc: "CVC/CCV",
      postalCode: "POSTAL CODE",
    },
    arabicLabels: {
      number: "رقم البطاقة",
      expiry: "انقضاء",
      cvc: "رمز الامان",
      name: "إسم صاحب البطاقة",
    },
    placeholders: {
      name: "Full Name",
      number: "**** **** **** ****",
      expiry: "MM/YY",
      cvc: "CVC",
      postalCode: "34567",
    },
    inputContainerStyle: {
      borderBottomWidth: 1,
      borderBottomColor: "black",
    },
    validColor: "",
    invalidColor: "red",
    placeholderColor: "gray",
    allowScroll: false,
    additionalInputsProps: {},
  };

  componentDidMount = () => {
    this._focus(this.props.focused);
  };

  componentWillReceiveProps = (newProps) => {
    if (this.props.focused !== newProps.focused) this._focus(newProps.focused);
  };

  _focus = (field) => {
    if (!field) return;
    const scrollResponder = this.refs.Form.getScrollResponder();
    const nodeHandle = ReactNative.findNodeHandle(this.refs[field]);

    NativeModules.UIManager.measureLayoutRelativeToParent(
      nodeHandle,
      (e) => {
        throw e;
      },
      (x) => {
        scrollResponder.scrollTo({
          x: Math.max(x - PREVIOUS_FIELD_OFFSET, 0),
          animated: true,
        });
        this.refs[field].focus();
      }
    );
  };

  _inputProps = (field) => {
    const {
      inputStyle,
      labelStyle,
      validColor,
      invalidColor,
      placeholderColor,
      placeholders,
      labels,
      arabicLabels,
      values,
      status,
      onFocus,
      onChange,
      onBecomeEmpty,
      onBecomeValid,
      additionalInputsProps,
      useVertical,
      arabicLabelStyle,
    } = this.props;
    const style = useVertical ? sVertical : sHorizontal;

    return {
      inputStyle: [style.input, inputStyle],
      labelStyle: [style.inputLabel, labelStyle],
      arabicLabelStyle: [style.inputLabel, arabicLabelStyle],
      validColor,
      invalidColor,
      placeholderColor,
      ref: field,
      field,

      label: labels[field],
      arabicLabel: arabicLabels[field],
      placeholder: placeholders[field],
      value: values[field],
      status: status[field],

      onFocus,
      onChange,
      onBecomeEmpty,
      onBecomeValid,

      additionalInputProps: additionalInputsProps[field],
    };
  };

  render() {
    const {
      cardImageFront,
      cardImageBack,
      inputContainerStyle,
      values: { number, expiry, cvc, name, type },
      focused,
      allowScroll,
      requiresName,
      requiresCVC,
      requiresPostalCode,
      cardScale,
      cardFontFamily,
      cardBrandIcons,
      useVertical,
      isMADA,
      isInstantBooking,
    } = this.props;
    const styles = useVertical ? sVertical : sHorizontal;
    return (
      <View style={styles.container}>
        <CreditCard
          focused={focused}
          brand={type}
          scale={cardScale}
          fontFamily={cardFontFamily}
          imageFront={cardImageFront}
          imageBack={cardImageBack}
          instantImageFront={cardImageFront}
          instantImageBack={cardImageBack}
          customIcons={cardBrandIcons}
          name={requiresName ? name : " "}
          number={number}
          expiry={expiry}
          cvc={cvc}
          isMADA={isMADA}
          isInstantBooking={isInstantBooking}
        />
        <ScrollView
          ref="Form"
          horizontal={useVertical ? false : true}
          vertical={useVertical ? false : true}
          keyboardShouldPersistTaps="always"
          scrollEnabled={allowScroll}
          showsHorizontalScrollIndicator={false}
          style={styles.form}
          contentContainerStyle={styles.formContainer}
        >
          {requiresName && (
            <CCInput
              {...this._inputProps("name")}
              containerStyle={[
                styles.inputContainer,
                inputContainerStyle,
                { width: "100%" },
              ]}
            />
          )}
          <CCInput
            {...this._inputProps("number")}
            keyboardType="numeric"
            containerStyle={[
              styles.inputContainer,
              inputContainerStyle,
              { width: "100%" },
            ]}
          />
          <View
            style={[
              {
                display: "flex",
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
              },
              I18nManager.isRTL && { flexDirection: "row-reverse" },
            ]}
          >
            <CCInput
              {...this._inputProps("expiry")}
              keyboardType="numeric"
              parentContainer={{ width: "50%" }}
              containerStyle={[
                styles.inputContainer,
                inputContainerStyle,
                { width: "98%" },
              ]}
            />
            {requiresCVC && (
              <CCInput
                {...this._inputProps("cvc")}
                parentContainer={{ width: "50%" }}
                keyboardType="numeric"
                containerStyle={[
                  styles.inputContainer,
                  inputContainerStyle,
                  { width: "98%" },
                ]}
              />
            )}
          </View>
          {requiresPostalCode && (
            <CCInput
              {...this._inputProps("postalCode")}
              keyboardType="numeric"
              containerStyle={[
                styles.inputContainer,
                inputContainerStyle,
                { width: POSTAL_CODE_INPUT_WIDTH },
              ]}
            />
          )}
        </ScrollView>
      </View>
    );
  }
}
