import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  List,
  ListIcon,
  ListItem,
  Skeleton,
  Stack,
  Text,
  useToast,
  Alert,
  AlertIcon,
  VStack,
  HStack,
  Badge,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { FoodSafetyInfo } from '../types/food';
import { searchFood } from '../services/foodApi';
import { FaCheck, FaTimes, FaExclamationTriangle, FaStar, FaExclamationCircle } from 'react-icons/fa';

const FoodSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [input, setInput] = useState('');
  const toast = useToast();

  const { data, isLoading, error } = useQuery({
    queryKey: ['foodSafety', searchTerm],
    queryFn: () => searchFood(searchTerm),
    enabled: !!searchTerm,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });

  // Handle errors with toast notifications
  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch food safety information',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  const handleSearch = () => {
    if (input.trim()) {
      setSearchTerm(input.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.9) {
      return <Badge colorScheme="green">High Confidence</Badge>;
    } else if (confidence >= 0.7) {
      return <Badge colorScheme="yellow">Medium Confidence</Badge>;
    } else {
      return <Badge colorScheme="red">Low Confidence</Badge>;
    }
  };

  return (
    <Box>
      <Stack spacing={4}>
        <InputGroup size="lg">
          <Input
            placeholder="Search for food safety information..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              colorScheme="teal"
              onClick={handleSearch}
              isLoading={isLoading}
            >
              Search
            </Button>
          </InputRightElement>
        </InputGroup>

        {isLoading && (
          <Card>
            <CardBody>
              <Stack spacing={4}>
                <Skeleton height="40px" />
                <Skeleton height="20px" />
                <Skeleton height="20px" />
                <Skeleton height="120px" />
              </Stack>
            </CardBody>
          </Card>
        )}

        {error && (
          <Alert status="error">
            <AlertIcon />
            {error instanceof Error ? error.message : 'Failed to fetch food safety information'}
          </Alert>
        )}

        {data?.data && (
          <Card>
            <CardHeader>
              <HStack spacing={2} justify="space-between">
                <Heading size="md">{data.data.name}</Heading>
                {getConfidenceBadge(data.data.confidence)}
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack align="start" spacing={4}>
                <HStack>
                  <Heading size="md" color={data.data.isSafe ? 'green.500' : 'red.500'}>
                    {data.data.isSafe ? 'Safe to consume' : 'Not recommended'}
                  </Heading>
                  {data.data.isSafe ? (
                    <FaCheck color="green" />
                  ) : (
                    <FaTimes color="red" />
                  )}
                </HStack>

                <Text>{data.data.explanation}</Text>

                {data.data.safeQuantity && (
                  <Box>
                    <Heading size="sm">Recommended Quantity</Heading>
                    <Text>{data.data.safeQuantity}</Text>
                  </Box>
                )}

                {data.data.risks && data.data.risks.length > 0 && (
                  <Box width="100%">
                    <Heading size="sm">Risks</Heading>
                    <List spacing={1} mt={2}>
                      {data.data.risks.map((risk, index) => (
                        <ListItem key={index}>
                          <ListIcon as={FaExclamationTriangle} color="orange.500" />
                          {risk}
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {data.data.benefits && data.data.benefits.length > 0 && (
                  <Box width="100%">
                    <Heading size="sm">Benefits</Heading>
                    <List spacing={1} mt={2}>
                      {data.data.benefits.map((benefit, index) => (
                        <ListItem key={index}>
                          <ListIcon as={FaStar} color="green.500" />
                          {benefit}
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {data.data.alternatives && data.data.alternatives.length > 0 && (
                  <Box width="100%">
                    <Heading size="sm">Alternatives</Heading>
                    <List spacing={1} mt={2}>
                      {data.data.alternatives.map((alternative, index) => (
                        <ListItem key={index}>
                          <ListIcon as={FaCheck} color="blue.500" />
                          {alternative}
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                <Divider />

                {data.data.sourceUrl && (
                  <HStack>
                    <FaExclamationCircle />
                    <Text fontSize="sm">
                      Source:{' '}
                      <Link href={data.data.sourceUrl} isExternal color="blue.500">
                        {new URL(data.data.sourceUrl).hostname}
                      </Link>
                    </Text>
                  </HStack>
                )}
              </VStack>
            </CardBody>
          </Card>
        )}
      </Stack>
    </Box>
  );
};

export default FoodSearch; 