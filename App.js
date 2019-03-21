import React, { Component } from 'react';
import { Platform } from 'react-native';
import { Router, Scene } from 'react-native-router-flux';
import Home from './src/Home';

export default class App extends Component {
  render() {
    return (
      <Router>
        <Scene
          key="root"
          navigationBarStyle={{
            backgroundColor: '#162331',
            borderColor: '#162331',
            borderBottomColor: 'transparent',
          }}
          titleStyle={{
            color: 'white',
            ...Platform.select({
              android: { marginTop: 10 },
            }),
          }}
        >
          <Scene
            key="Home"
            component={Home}
            title="SPORTS"
            initial={true}
            hideBackImage={Platform.OS === 'android'}
          />
        </Scene>
      </Router>
    );
  }
}
