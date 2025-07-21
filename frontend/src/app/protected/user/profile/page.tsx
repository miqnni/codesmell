"use client";

import React, { useState } from 'react';
import {
  Box,
  Text,
  VStack,
  Avatar,
  Button,
  Input,
  useDisclosure,
  Dialog,
} from '@chakra-ui/react';

const UserAvatar = ({ avatarUrl, onAvatarChange }: { avatarUrl: string; onAvatarChange: (url: string) => void }) => {
  const { open: isOpen, onOpen, onClose } = useDisclosure();
  const [newAvatar, setNewAvatar] = useState('');

  const handleSave = () => {
    if (newAvatar) {
      onAvatarChange(newAvatar);
    }
    onClose();
  };

  return (
    <>
      <Dialog.Root open={isOpen}>
        <Dialog.Trigger asChild>
          <Avatar.Root shape="full" size="2xl" cursor="pointer" onClick={onOpen} style={{ border: '2px solid', borderColor: 'blue' }}>
            <Avatar.Fallback name="Użytkownik" />
            <Avatar.Image src={avatarUrl} />
          </Avatar.Root>
        </Dialog.Trigger>

        <Dialog.Backdrop />

        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.CloseTrigger />
            <Dialog.Header>
              <Dialog.Title>Zmień avatar</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <Input
                placeholder="Wklej URL nowego avatara"
                value={newAvatar}
                onChange={(e) => setNewAvatar(e.target.value)}
              />
            </Dialog.Body>

            <Dialog.Footer>
              <Button colorScheme="blue" onClick={handleSave}>
                Zapisz
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </>
  );
};

// Nazwa użytkownika
const Username = ({ name }: { name?: string }) => {
  return (
    <Text fontSize="2xl" fontWeight="bold">
      {name || 'Domyślny Użytkownik'}
    </Text>
  );
};

// Liczba rozwiązanych zadań
const TaskStats = ({ solvedCount }: { solvedCount?: number }) => {
  return (
    <Text fontSize="md" color="gray.600">
      Rozwiązane zadania: {solvedCount ?? 0}
    </Text>
  );
};

// Lista zadań (placeholder)
const TaskList = () => {
  return (
    <Box mt={4} w="100%">
      <Text fontSize="lg" fontWeight="semibold" mb={2}>
        Twoje zadania:
      </Text>
      {/* Tu możesz wczytać dane z bazy lub wstawić <TaskItem /> */}
      <Text color="gray.500">(Brak zadań)</Text>
    </Box>
  );
};

// Główny komponent profilu
const ProfilePage = () => {
  const [avatarUrl, setAvatarUrl] = useState<string>('https://bit.ly/broken-link');
  const [username, setUsername] = useState<string | undefined>(undefined); // symulacja bazy
  const [solvedTasks, setSolvedTasks] = useState<number | undefined>(undefined); // symulacja bazy

  return (
    <VStack p={6} align="center" w="100%" maxW="md" mx="auto">
      <UserAvatar avatarUrl={avatarUrl} onAvatarChange={setAvatarUrl} />
      <Username name={username} />
      <TaskStats solvedCount={solvedTasks} />
      <TaskList />
    </VStack>
  );
};

export default ProfilePage;
