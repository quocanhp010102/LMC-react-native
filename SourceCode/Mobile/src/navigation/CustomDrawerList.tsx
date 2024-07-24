import {
  CommonActions,
  DrawerActions,
  DrawerNavigationState,
  ParamListBase,
  useLinkBuilder,
} from "@react-navigation/native";
import * as React from "react";

import { DrawerItemCustom } from "./customDrawerItem";
import { DrawerDescriptorMap, DrawerNavigationHelpers } from "./types";

type Props = {
  state: DrawerNavigationState<ParamListBase>;
  navigation: DrawerNavigationHelpers;
  descriptors: DrawerDescriptorMap;
};

/**
 * Component that renders the navigation list in the drawer.
 */
export function DrawerItemListCustom({
  state,
  navigation,
  descriptors,
}: Props) {
  const buildLink = useLinkBuilder();
  const focusedRoute = state.routes[state.index];
  const focusedDescriptor = descriptors[focusedRoute.key];
  const focusedOptions = focusedDescriptor.options;
  const {
    drawerActiveTintColor,
    drawerInactiveTintColor,
    drawerActiveBackgroundColor,
    drawerInactiveBackgroundColor,
  }: any = focusedOptions;

  return state.routes.map((route, i) => {
    const focused = i === state.index;

    const onPress = () => {
      const event = navigation.emit({
        type: "drawerItemPress",
        target: route.key,
        canPreventDefault: true,
      });
      if (!event.defaultPrevented) {
        if (focused) {
          navigation.dispatch({
            ...CommonActions.navigate(route.name, {
              screen: route?.state?.routeNames?.[0],
            }),
            target: state.key,
          });
        } else {
       
        console.log("route.name" ,route.name);
        if(route.name === "Trung tâm kiểm soát" || route.name === "Khoá học của tôi" ) {
             navigation.dispatch({
            ...CommonActions.reset({
              index: 0,
              routes: [{ name: route.name }]
         })
        })
        }  else {
          navigation.dispatch({
            ...CommonActions.navigate(route.name ),
            target: state.key,
          });
        }
      }}
    };

    const {
      title,
      drawerLabel,
      drawerIcon,
      drawerLabelStyle,
      drawerItemStyle,
      drawerAllowFontScaling,
    }: any = descriptors[route.key].options;

    return (
      <DrawerItemCustom
        key={route.key}
        route={route}
        href={buildLink(route.name, route.params)}
        label={
          drawerLabel !== undefined
            ? drawerLabel
            : title !== undefined
            ? title
            : route.name
        }
        icon={drawerIcon}
        focused={focused}
        activeTintColor={drawerActiveTintColor}
        inactiveTintColor={drawerInactiveTintColor}
        activeBackgroundColor={drawerActiveBackgroundColor}
        inactiveBackgroundColor={drawerInactiveBackgroundColor}
        allowFontScaling={drawerAllowFontScaling}
        labelStyle={[drawerLabelStyle, { fontWeight: "500" }]}
        style={drawerItemStyle}
        onPress={onPress}
      />
    );
  }) as React.ReactNode as React.ReactElement;
}
