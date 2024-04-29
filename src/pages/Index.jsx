import React, { useState, useEffect } from "react";
import { Box, Button, Container, FormControl, FormLabel, Input, VStack, Heading, Text, useToast, List, ListItem, IconButton, CloseButton } from "@chakra-ui/react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { client } from "lib/crud";

const Index = () => {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const toast = useToast();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const data = await client.getWithPrefix("customer:");
    if (data) {
      setCustomers(data.map((item) => ({ id: item.key, ...item.value })));
    }
  };

  const addCustomer = async () => {
    if (!name || !email) {
      toast({
        title: "Error",
        description: "Name and email cannot be empty",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const key = `customer:${Date.now()}`;
    const success = await client.set(key, { name, email });
    if (success) {
      fetchCustomers();
      setName("");
      setEmail("");
      toast({
        title: "Success",
        description: "Customer added successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const deleteCustomer = async (id) => {
    const success = await client.delete(id);
    if (success) {
      setCustomers(customers.filter((customer) => customer.id !== id));
      toast({
        title: "Deleted",
        description: "Customer removed successfully",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.md" py={5}>
      <VStack spacing={4} align="stretch">
        <Heading mb={4}>Customer Management</Heading>
        <Box p={5} shadow="md" borderWidth="1px">
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <Button leftIcon={<FaPlus />} colorScheme="teal" onClick={addCustomer}>
              Add Customer
            </Button>
          </VStack>
        </Box>
        <Box mt={4}>
          <Heading size="md">Customers List</Heading>
          <List spacing={3}>
            {customers.map((customer) => (
              <ListItem key={customer.id} d="flex" justifyContent="space-between" alignItems="center">
                <Text>
                  {customer.name} ({customer.email})
                </Text>
                <IconButton icon={<FaTrash />} aria-label="Delete customer" colorScheme="red" onClick={() => deleteCustomer(customer.id)} />
              </ListItem>
            ))}
          </List>
        </Box>
      </VStack>
    </Container>
  );
};

export default Index;
