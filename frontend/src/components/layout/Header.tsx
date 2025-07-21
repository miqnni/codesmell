'use client'

const isLoggedIn : boolean = true;

import {
  Box,
  Flex,
  Avatar,
  HStack,
  Text,
  IconButton,
  Button,
  Menu,
//   MenuButton,
//   MenuList,
  MenuItem,
//   MenuDivider,
  useDisclosure,
//   useColorModeValue,
  Stack,
  LinkOverlay,
  Portal,
} from '@chakra-ui/react'
import Link from 'next/link'
import { LuExternalLink, LuCirclePlus } from 'react-icons/lu'
import { MuseoModerno } from 'next/font/google';

interface Props {
  children: React.ReactNode
}

interface SimpleLink {
  name: string,
  href: string,
  external : boolean,
}

interface NavLinkProps extends Props {
  simpleLink: SimpleLink
}

const Links: readonly SimpleLink[] = [
  {
    name: 'About',
    href: '/about',
    external: false,
  },
  {
    name: 'Exercises',
    href: '/exercises',
    external: false,
  },
  {
    name: 'GitHub',
    href: 'https://github.com/miqnni/codesmell',
    external: true,
  },
]

const NavLink = (props: NavLinkProps) => {
  const { children, simpleLink } = props
  return (
    <Box
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        // bg: useColorModeValue('gray.200', 'gray.700'),
        bg: "gray.700"
      }}
      >
      <Link href={simpleLink.href}>
        <HStack px={2} py={1}>{children}</HStack>
      </Link>
    </Box>
  )
}

const museoModerno = MuseoModerno({subsets: ["latin"]})

export default function WithAction() {
  const { onOpen, onClose } = useDisclosure()

  return (
    <>
      <Box bg={"#009FB7"} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            // icon={<HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={onClose}
          />
          <HStack alignItems={'center'}>
            <Box>
              <Link href="/" style={ {fontSize: "1.5rem"} } className={museoModerno.className}>CodeSmell</Link>
            </Box>
            <HStack as={'nav'} display={{ base: 'none', md: 'flex' }}>
              {Links.map((link) => (
                <NavLink key={link.name} simpleLink={link}>{link.name}{link.external ? (<LuExternalLink />) : null}</NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            <Button
              variant={'solid'}
              colorScheme={'teal'}
              size={'sm'}
              mr={4}
              >
               <LuCirclePlus /> New Exercise
            </Button>
            <Menu.Root positioning={{ placement: "right-end" }}>
              <Menu.Trigger rounded="full" focusRing="outside">
                <Avatar.Root size="sm">
                  <Avatar.Fallback name="User" />
                  {isLoggedIn ? <Avatar.Image src="https://f4.bcbits.com/img/a2506847905_10.jpg" /> : <Avatar.Image src="https://upload.wikimedia.org/wikipedia/en/c/cc/Wojak_cropped.jpg" />}
                  
                  
                </Avatar.Root>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  {isLoggedIn ? (
                    <Menu.Content>
                      <Menu.Item value="account">Account</Menu.Item>
                      <Menu.Item value="settings">Settings</Menu.Item>
                      <Menu.Item value="logout">Logout</Menu.Item>
                    </Menu.Content>
                  ) : (
                    <Menu.Content>
                      <Menu.Item value="sign-up">Sign Up</Menu.Item>
                      <Menu.Item value="log-in">Log In</Menu.Item>
                    </Menu.Content>
                  )}
                  
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </Flex>
        </Flex>

        {/* {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null} */}
      </Box>
    </>
  )
}