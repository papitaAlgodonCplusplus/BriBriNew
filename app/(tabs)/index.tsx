import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from './homepage';
import LevelMapping from './level_mapping';
import Level1 from '../levels/1/level_1';
import Guide1 from '../levels/1/guide_1';
import Level2 from '../levels/2/level_2';
import Guide2 from '../levels/2/guide_2';
import Guide3 from '../levels/3/guide_3';
import Level3 from '../levels/3/level_3';
import Guide4 from '../levels/4/guide_4';
import Level4 from '../levels/4/level_4';
import Level5 from '../levels/5/level_5';
import Guide5 from '../levels/5/guide_5';
import Guide6 from '../levels/6/guide_6';
import Level6 from '../levels/6/level_6';
import Guide7 from '../levels/7/guide_7';
import Level7 from '../levels/7/level_7';
import Guide1Listen from '../levels_listen/1/guide_1_listen';
import Level1Listen from '../levels_listen/1/level_1_listen';
import Guide2Listen from '../levels_listen/2/guide_2_listen';
import Level2Listen from '../levels_listen/2/level_2_listen';
import Guide3Listen from '../levels_listen/3/guide_3_listen';
import Level3Listen from '../levels_listen/3/level_3_listen';
import Level4Listen from '../levels_listen/4/level_4_listen';
import Guide4Listen from '../levels_listen/4/guide_4_listen';
import Level5Listen from '../levels_listen/5/level_5_listen';
import Guide5Listen from '../levels_listen/5/guide_5_listen';
import Level6Listen from '../levels_listen/6/level_6_listen';
import Guide6Listen from '../levels_listen/6/guide_6_listen';
import Level7Listen from '../levels_listen/7/level_7_listen';
import Guide7Listen from '../levels_listen/7/guide_7_listen';
import ToucanSettings from '../screens/ToucanSettings';
const Stack = createStackNavigator();

export default function App() {
  return (
    <Stack.Navigator initialRouteName="HomePage">
      <Stack.Screen
        name="HomePage"
        component={HomePage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ToucanSettings"
        component={ToucanSettings}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LevelMapping"
        component={LevelMapping}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Guide1"
        component={Guide1}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Level1"
        component={Level1}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Guide2"
        component={Guide2}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Level2"
        component={Level2}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Guide3"
        component={Guide3}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Level3"
        component={Level3}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Guide4"
        component={Guide4}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Level4"
        component={Level4}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Level5"
        component={Level5}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Guide5"
        component={Guide5}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Guide6"
        component={Guide6}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Level6"
        component={Level6}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Guide7"
        component={Guide7}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Level7"
        component={Level7}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Guide1Listen"
        component={Guide1Listen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Level1Listen"
        component={Level1Listen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Guide2Listen"
        component={Guide2Listen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Level2Listen"
        component={Level2Listen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Guide3Listen"
        component={Guide3Listen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Level3Listen"
        component={Level3Listen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Level4Listen"
        component={Level4Listen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Guide4Listen"
        component={Guide4Listen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Level5Listen"
        component={Level5Listen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Guide5Listen"
        component={Guide5Listen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Level6Listen"
        component={Level6Listen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Guide6Listen"
        component={Guide6Listen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Level7Listen"
        component={Level7Listen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Guide7Listen"
        component={Guide7Listen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
