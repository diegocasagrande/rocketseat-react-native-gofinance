
import React from 'react';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';
import { ThemeProvider } from 'styled-components';
import AppLoading from 'expo-app-loading'; 

import theme from './src/global/styles/theme';
import { Dashboard } from './src/screen/Dashboard';
import { Register } from './src/screen/Register';
import { CategorySelect } from './src/screen/CategorySelect';

import { 
  useFonts, 
  Poppins_400Regular, 
  Poppins_500Medium, 
  Poppins_700Bold 
} from '@expo-google-fonts/poppins';

import { NavigationContainer } from '@react-navigation/native';
import { AppRoutes } from './src/routes/app.routes';
import { StatusBar } from 'expo-status-bar';

export default function App() {

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }


  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <StatusBar style="light" />
        <AppRoutes></AppRoutes>
      </NavigationContainer>
    </ThemeProvider>
  );
}

