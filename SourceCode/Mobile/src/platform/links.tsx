import { useNavigation } from "@react-navigation/native";
import { LinkProps } from "next/link";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import { TouchableOpacity } from "react-native";
//@ts-ignore
import _ from "lodash";

const routeToLink = (
  route: string,
  params: { [k: string]: string | null | undefined } = {}
): LinkProps => {
  const pathParams = new Set<string>();
  const pathname = route.replace(
    /\[([^\]]+)\]/,
    (match: string, paramName: string) => {
      pathParams.add(paramName);
      return params[paramName] ?? "";
    }
  );
  return {
    href: route,
    as: {
      pathname,
      query: _.omit(params, Array.from(pathParams)) as {
        [key: string]: string;
      },
    },
  };
};
export const useNavigationLink = (
  route: string,
  params?: { [k: string]: string | null | undefined | (() => void) }
) => {
  const router = useRouter();
  // const modals = useModals();
  return useCallback(() => {
    switch (route) {
      case "notification":
      case "search":
      case "login":
        // case 'popup':
        //   modals?.show(route, { ...params });
        return;
    }
    const { href, as } = routeToLink(route, paramFilter(params));
    //   modals?.popAll();
    //   if (href !== '#') {
    //     console.log(href, as);
    //     router.push(href, as);
    //   }
  }, [route, params, router]);
};

const paramFilter = (params?: {
  [k: string]: string | null | undefined | (() => void);
}) =>
  params
    ? Object.keys(params).reduce(
        (filtered: { [k: string]: string | null | undefined }, key) => {
          if (typeof params[key] === "string") {
            filtered[key] = params[key] as string;
          }
          return filtered;
        },
        {}
      )
    : {};

export type RouteProps = {
  route: string;
  params?: { [k: string]: string | null | undefined };
};

export const NavLink = React.memo(({
  onPress,
  children,
  ...props
}: React.PropsWithChildren<RouteProps & { onPress?: () => void }>) => {
 
  const callback = useCallback(() => {
    // modals?.popAll();
    if (onPress) {
      onPress();
    }
  }, [onPress]);
  const navigation = useNavigation()

  
 
    return <TouchableOpacity onPress={() => {navigation.navigate(props.route, props.params);}}>{children}</TouchableOpacity>;

} );
