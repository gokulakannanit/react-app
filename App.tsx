import React, { useEffect, useRef, useState } from 'react';
import {StyleSheet, View} from 'react-native';
import { WebView } from 'react-native-webview';
import DeviceInfo from 'react-native-device-info';

// or ES6+ destructured imports

import { getUniqueId, getManufacturer } from 'react-native-device-info';

const cLabApp = () => {
  const webviewRef = useRef<WebView>();
  const [phoneNo, setphoneNo] = useState<string[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  
  function sendDataToWebView(title: string, data: any) {
    const dataStr = JSON.stringify({
      title: title,
      data: data
    });
    webviewRef && webviewRef.current && webviewRef.current.postMessage(dataStr);
  }


  const _onPhoneNumberPressed = () => {
    DeviceInfo.getPhoneNumber().then((phoneNumber) => {
      if(phoneNumber && isLoading) {
        setphoneNo(phoneNumber.split('+91'));
        setLoading(false);
        console.log('phoneNumber >>>', phoneNumber);
      }
    
      // Android: null return: no permission, empty string: unprogrammed or empty SIM1, e.g. "+15555215558": normal return value
    });
  }

  function sendPhoneNum() {
    if(!isLoading){
      let phoneNoString = 'No Sim Found';
      (phoneNo.length > 0) && (phoneNoString = phoneNo.join('+91'));
      
      setTimeout(()=>{
        console.log(phoneNoString);
        sendDataToWebView('phoneNo', phoneNoString);
      }, 40000);
    }
  }

  useEffect(() => {
    _onPhoneNumberPressed();
  });

  function _onLoadEnd() {
    sendPhoneNum();
  }

  const handleWebViewRef = (ref: WebView) => {
    webviewRef.current = ref;
  };

  return (
    <View
      style={styles.container}>
      <WebView
          ref={handleWebViewRef}
          startInLoadingState={true}
          javaScriptEnabled={true}
          style={styles.webView}
          source={{ uri: 'http://192.168.1.3:4200' }}
          onLoadEnd={_onLoadEnd}
        />
    </View>
  );
};

var styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:  '#ffffff'
  },
  webView :{
    height: '100%',
    width : '100%'
  }
});

export default cLabApp;