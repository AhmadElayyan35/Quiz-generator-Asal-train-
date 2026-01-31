import React from 'react'
import {
  AppItem,
  Hamburger,
  NavDrawerBody,
  NavDrawerHeader,
  NavItem,
  NavSectionHeader,
} from "@fluentui/react-nav-preview";

import {
  Tooltip,
  DrawerProps,
} from "@fluentui/react-components";

import {
  PersonCircle32Regular,
  Book20Regular,
  Board20Filled,
  Board20Regular,
  PersonSearch20Filled,
  PersonSearch20Regular,
  bundleIcon,
} from "@fluentui/react-icons";

import { Nav } from "./Dashboard.styles";

const Dashboard = bundleIcon(Board20Filled, Board20Regular);
const Search = bundleIcon(PersonSearch20Filled, PersonSearch20Regular);

type DrawerType = Required<DrawerProps>["type"];

type DashboardNavProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  type: DrawerType;
  isMultiple: boolean;
  userName: string;
  linkDestination: string;
};

const DashboardNav: React.FC<DashboardNavProps> = ({
  isOpen,
  setIsOpen,
  type,
  isMultiple,
  userName,
  linkDestination
}) => {
  return (
    <>
      {
        // @ts-expect-error TS2590: complex JSX union type issue in Nav component
        <Nav
          defaultSelectedValue="1"
          defaultSelectedCategoryValue=""
          open={isOpen}
          type={type}
          multiple={isMultiple}
        >
          <NavDrawerHeader>
            <Tooltip content="Close Navigation" relationship="label">
              <Hamburger onClick={() => setIsOpen(!isOpen)} />
            </Tooltip>
          </NavDrawerHeader>

          <NavDrawerBody>
            <AppItem
              icon={<PersonCircle32Regular />}
              as="a"
              href={linkDestination}
            >
              {userName}
            </AppItem>
            <NavItem disabled icon={<Dashboard />} value="1">
              Dashboard
            </NavItem>
            <NavSectionHeader>Personal Info</NavSectionHeader>

            <NavItem icon={<Search />} href={linkDestination} value="2">
              Profile
            </NavItem>

            <NavSectionHeader>Categories</NavSectionHeader>

            <NavItem href="/categories" icon={<Book20Regular />} value="3">
              Categories
            </NavItem>
          </NavDrawerBody>
        </Nav>
      }
    </>
  );
}

export default DashboardNav;
