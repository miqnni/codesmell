"use client";

import Image from "next/image";
import { Button, HStack, Center, Stack, Text, Link } from "@chakra-ui/react";
import { MuseoModerno } from "next/font/google";
import Confetti, { Rectangle, Circle, Triangle } from "@tholman/confetti";

const museoModerno = MuseoModerno({ subsets: ["latin"] });

export default function Page() {
  let iter = 0;

  return (
    <>
      {/* TODO: Get rid of the hard-coded margin
      (some global CSS veriable equal to 4rem / 16 ChakraUI tokens ?) */}
      <Confetti
        total={30}
        style={{ marginTop: "4rem" }}
        Component={[
          <Rectangle key={"r" + String(iter++ % 100000)} color="#EFF1F3" />,
          <Circle key={"r" + String(iter++ % 100000)} color="#FED766" />,
          <Triangle key={"r" + String(iter++ % 100000)} color="#009FB7" />,
        ]}
      />
      <Center>
        <Stack mt={20}>
          <Text textStyle="7xl" className={museoModerno.className}>
            CodeSmell
          </Text>
          <Center>
            <HStack align="center">
              <Button>Get Started</Button>
              <Button>
                <a href="/login">Sign In</a>
              </Button>
            </HStack>
          </Center>
        </Stack>
      </Center>
    </>
  );
}
