'use client'

// const isLoggedIn: boolean = true;

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
  Collapsible,
} from '@chakra-ui/react'
import Link from 'next/link'
import { LuExternalLink, LuCirclePlus, LuMenu } from 'react-icons/lu'
import { MuseoModerno } from 'next/font/google';
import { useState } from 'react';

interface Props {
  children: React.ReactNode
}

interface SimpleLink {
  name: string,
  href: string,
  external: boolean,
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

const museoModerno = MuseoModerno({ subsets: ["latin"] })

export default function WithAction() {
  const { onOpen, onClose } = useDisclosure()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("Default User")

  return (
    <Box as="header" bg={"#009FB7"} px={4} position="fixed" w="100%" zIndex="99">
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>

        <Menu.Root >
          <Menu.Trigger paddingY="3" as="div" display={{ md: "none" }}>
            <IconButton
              size={'sm'}
              aria-label={'Open Menu'}
              display={{ md: 'none' }}
              onClick={() => console.log("Cluecked!")}
            ><LuMenu /></IconButton>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                {Links.map((link) => (
                  <Menu.Item key={link.href} asChild value={link.name}>
                    <Link href={link.href} rel="noreferrer">
                      {link.name}{link.external ? (<LuExternalLink />) : null}
                    </Link>
                  </Menu.Item>
                ))}
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>

        <HStack alignItems={'center'}>
          <Box>
            <Link href="/" style={{ fontSize: "1.5rem" }} className={museoModerno.className}>CodeSmell</Link>
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
                    <Menu.Item value="account"><Link href="protected/user/profile">Account</Link></Menu.Item>
                    <Menu.Item value="settings"><Link href="/user/profile/edit">Settings</Link></Menu.Item>
                    <Menu.Item value="logout"><Link href="/" onClick={() => {
                      localStorage.removeItem("token")
                      setIsLoggedIn(false)
                      }}>Logout</Link></Menu.Item>
                  </Menu.Content>
                ) : (
                  <Menu.Content>
                    <Menu.Item value="sign-up"><Link href="/register">Sign Up</Link></Menu.Item>
                    <Menu.Item value="log-in"><Link href="#" onClick={() => setIsLoggedIn(true)}>Log In</Link></Menu.Item>
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
  )
}