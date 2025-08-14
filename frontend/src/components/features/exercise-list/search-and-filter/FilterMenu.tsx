"use client";

import { Menu, Text, Button, Portal, useCheckboxGroup } from "@chakra-ui/react";
import { LuFilter } from "react-icons/lu";

export default function FilterMenu(props: {
  menuName: string;
  menuData: Array<number | string>;
  onFilterChange: (checkedItems: string[]) => void;
}) {
  const { menuName, menuData, onFilterChange } = props;
  const group = useCheckboxGroup();

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button>
          <LuFilter /> <Text>{menuName}</Text>
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.ItemGroup>
              <Menu.ItemGroupLabel>Features</Menu.ItemGroupLabel>
              {menuData.map((menuOption) => {
                menuOption = String(menuOption);
                return (
                  <Menu.CheckboxItem
                    key={menuOption}
                    value={menuOption}
                    checked={group.isChecked(menuOption)}
                    onCheckedChange={() => {
                      group.toggleValue(menuOption);

                      if (group.value.includes(menuOption))
                        onFilterChange(
                          group.value.filter((el) => el !== menuOption)
                        );
                      else onFilterChange([...group.value, menuOption]);
                    }}
                  >
                    {menuOption}
                    <Menu.ItemIndicator />
                  </Menu.CheckboxItem>
                );
              })}
            </Menu.ItemGroup>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
