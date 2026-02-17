import React, { JSX, useMemo, useState } from 'react';
import DropDownPicker, {
  DropDownPickerProps,
  ItemType,
  RenderListItemPropsInterface,
  ValueType,
} from 'react-native-dropdown-picker';
import OutsidePressHandler from 'react-native-outside-press';

import SvgIconDown from '@components/svg/icons/SvgIconDown';
import SvgIconUp from '@components/svg/icons/SvgIconUp';

import palette from '@theme/_palette';

interface Props<TItem>
  extends Pick<DropDownPickerProps<TItem>, 'items' | 'zIndex'> {
  value: TItem;
  label?: string;
  headerDropdown?: boolean;
  defaultValue?: TItem;
  onSelectItem: (item: ItemType<TItem>) => void;
  renderItem?:
  | ((
    props: RenderListItemPropsInterface<TItem> & {
      setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    }
  ) => JSX.Element)
  | undefined;
  searchable?: boolean;
  placeholder: string;
  isOpen?: boolean;
  itemToBeFirst?: string;
  itemKey?: string;
  setIsOpen?: (newIsOpen: boolean) => void;
}

const Dropdown = <TItem extends ValueType>({
  items,
  label,
  zIndex = 100,
  onSelectItem,
  value,
  renderItem,
  searchable = false,
  placeholder,
  isOpen,
  itemToBeFirst,
  setIsOpen,
  itemKey,
}: Props<TItem>) => {
  const [open, setOpen] = useState(false);

  const dropDownProps = useMemo(() => {
    let props: DropDownPickerProps<TItem> = {
      items: items.sort((a, b) => {
        let val = 0;

        if (a.label === itemToBeFirst) {
          val = -1;
        } else {
          val = (a.label ?? 0) < (b.label ?? 0) ? -1 : 1;
        }

        return val;
      }),
      itemKey,
      value,
      setValue: () => { },
      onSelectItem,
      open: isOpen ?? open,
      setOpen: () => {
        const newValue = isOpen ?? open;
        if (setIsOpen) {
          setIsOpen(!newValue);
          return;
        }
        setOpen(!newValue);
      },
      multiple: false,
      listMode: 'SCROLLVIEW',
      labelProps: {},
      zIndex,
      searchable,
      placeholder,
      autoScroll: true,
      ArrowDownIconComponent: () => (
        <SvgIconDown
          size={25}
          color={palette.white_50}
        />
      ),
      ArrowUpIconComponent: () => (
        <SvgIconUp
          size={25}
          color={palette.white_50}
        />
      ),
      dropDownDirection: 'BOTTOM',
      maxHeight: 300,
      //
      dropDownContainerStyle: {
        marginTop: 5,
        borderColor: palette.white_20,
        backgroundColor: palette.black,
        zIndex,
      },
      style: {
        backgroundColor: palette.black,
        borderColor: palette.white_50,
        zIndex,
        paddingVertical: 15,
        marginVertical: 10,
      },
      textStyle: {
        fontSize: 12,
        color: palette.offWhite,
      },
      searchContainerStyle: {
        backgroundColor: palette.white_20,
      },
      searchTextInputStyle: {
        borderWidth: 0,
        color: palette.offWhite,
      },
    };
    if (renderItem) {
      props = {
        ...props,
        renderListItem: (props) => {
          return renderItem({ ...props, setOpen });
        },
      };
    }
    return props;
  }, [
    isOpen,
    itemKey,
    itemToBeFirst,
    items,
    onSelectItem,
    open,
    placeholder,
    renderItem,
    searchable,
    setIsOpen,
    value,
    zIndex,
  ]);

  return (
    <OutsidePressHandler
      onOutsidePress={() => {
        setOpen(false);
      }}
    >
      <DropDownPicker {...dropDownProps} />
    </OutsidePressHandler>
  );
};

export default React.memo(Dropdown);
