"use client";

import React, { useCallback, useEffect, useState } from 'react';
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
import TaskStats from '@/components/features/profile/TaskStats';
import DoneTaskList from '@/components/features/profile/DoneTaskList';

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
      {name || 'Niezalogowany'}
    </Text>
  );
};

// Główny komponent profilu
export default function Page(){

  const [avatarUrl, setAvatarUrl] = useState<string>('https://bit.ly/broken-link');
  const [username, setUsername] = useState<string | null>(null);
  const [data, setData] = useState<string>();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const getData = useCallback(
    async (signal: AbortSignal) => {
      setIsLoading(true);
      setIsError(false);
      try {
        const token = localStorage.getItem("token")
        const res = await fetch(`http://localhost:8080/api/users/giveMeMyName`, {
          method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
         });
        if (res.ok){
          const restext = await res.text();
          setData(restext);
          setUsername(restext)
        }
      } catch (e) {
        setIsError(true);
        if (typeof e === "string") setError(e);
        else if (e instanceof Error) setError(e.message);
        else setError("Error");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const controller = new AbortController();
    getData(controller.signal);
    return () => controller.abort();
  }, [getData]);

  return (
    <VStack p={6} align="center" w="100%" maxW="md" mx="auto">
      <UserAvatar avatarUrl={avatarUrl} onAvatarChange={setAvatarUrl} />
      <Username name={isLoading ? "Trwa Ładowanie" : username} />
      <TaskStats />
      <DoneTaskList />
    </VStack>
  );
};
