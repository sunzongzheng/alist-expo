import type {HostComponent, ViewProps} from 'react-native';
import type {
  BubblingEventHandler,
  Int32,
} from 'react-native/Libraries/Types/CodegenTypes';
import {requireNativeComponent} from 'react-native';

export interface TabBarProps extends ViewProps {
  items: readonly string[];
  selectedItem: Int32;
  onSelectItem: BubblingEventHandler<Readonly<{index: Int32}>>;
}

export type TabBarType = HostComponent<TabBarProps>;

export default requireNativeComponent('YLDTabBar') as TabBarType;
