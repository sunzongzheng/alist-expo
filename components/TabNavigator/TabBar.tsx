import React from 'react';
import {ViewProps} from 'react-native';
import {BubblingEventHandler} from "react-native/Libraries/Types/CodegenTypes";
import TabBarNativeComponent from './TabBarNativeComponent';

export interface TabBarProps extends ViewProps {
  items: string[];
  selectedItem: number;
  onSelectItem: (_: {index: number}) => void;
}
export default function TabBar({onSelectItem, ...props}: TabBarProps) {
  const handleSelectItem = React.useCallback<
    BubblingEventHandler<{index: number}>
  >(
    event => {
      onSelectItem(event.nativeEvent);
    },
    [onSelectItem],
  );
  return <TabBarNativeComponent {...props} onSelectItem={handleSelectItem} />;
}
