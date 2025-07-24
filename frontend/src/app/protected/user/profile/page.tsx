"use client";

import React, { useEffect, useState } from 'react';
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSave = () => {
    if (selectedFile) {
      const localUrl = URL.createObjectURL(selectedFile);
      onAvatarChange(localUrl);
      setSelectedFile(null);
    }
    onClose();
  };

  return (
    <>
      <Dialog.Root open={isOpen}>
        <Dialog.Trigger asChild>
          <Avatar.Root
            shape="full"
            boxSize="220px" 
            cursor="pointer"
            onClick={onOpen}
            style={{ border: '2px solid', borderColor: 'blue' }}
          >
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
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </Dialog.Body>

            <Dialog.Footer>
              <Button
                colorScheme="blue"
                onClick={handleSave}
                disabled={!selectedFile}
              >
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
const Username = ({ name }: { name: string | null }) => {
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
      {/* Tu możesz wczytać dane z bazy*/}
      <Text color="gray.500">(Brak zadań)</Text>
    </Box>
  );
};

// Główny komponent profilu
const ProfilePage = () => {
  const [avatarUrl, setAvatarUrl] = useState<string>('https://bit.ly/broken-link');
  const [username, setUsername] = useState<string | null>(null);
  const [solvedTasks, setSolvedTasks] = useState<number | undefined>(undefined);

  useEffect(() => {
    setUsername(localStorage.getItem("username"))
  }, []);

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
