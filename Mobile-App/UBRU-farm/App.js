import React from 'react';
import {StyleSheet, SafeAreaView,StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';

const MyWebView = () => {
  return (
    <SafeAreaView style={styles.container}>
      <WebView source={{ uri: 'https:ubru-farm.web.app' }} />
      <StatusBar barStyle={'light-content'}/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MyWebView;
