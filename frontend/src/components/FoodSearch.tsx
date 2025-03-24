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
  useColorModeValue,
  Image,
  Icon,
  Flex,
  Tooltip,
  ScaleFade,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { FoodSafetyInfo, FoodSearchResponse } from '../types/food';
import { searchFood } from '../services/foodApi';
import { 
  FaCheck, 
  FaTimes, 
  FaExclamationTriangle, 
  FaStar, 
  FaExclamationCircle, 
  FaSearch, 
  FaLeaf, 
  FaHeart,
  FaAppleAlt,
  FaInfoCircle,
  FaClock
} from 'react-icons/fa';

const FoodSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [input, setInput] = useState('');
  const [isRateLimited, setIsRateLimited] = useState(false);
  const toast = useToast();

  // Color mode values for consistent theming
  const cardBg = useColorModeValue('white', 'gray.700');
  const cardShadow = useColorModeValue('xl', 'dark-lg');
  const headingColor = useColorModeValue('teal.600', 'teal.200');
  const inputBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('teal.100', 'teal.700');
  const accentColor = useColorModeValue('purple.500', 'purple.300');

  // Responsive sizes
  const badgeSize = useBreakpointValue({ base: "xs", md: "sm" });
  const headingSize = useBreakpointValue({ base: "sm", md: "md" });
  const iconSize = useBreakpointValue({ base: 5, md: 6 });

  const { data, isLoading, error } = useQuery<FoodSearchResponse, Error>({
    queryKey: ['foodSafety', searchTerm],
    queryFn: () => searchFood(searchTerm),
    enabled: !!searchTerm,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2
  });

  // Check for rate limit errors
  useEffect(() => {
    if (error) {
      const errorMessage = error.message.toLowerCase();
      if (
        errorMessage.includes('too many requests') ||
        errorMessage.includes('rate limit') ||
        errorMessage.includes('429')
      ) {
        setIsRateLimited(true);
      } else {
        setIsRateLimited(false);
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  }, [error, toast]);

  const handleSearch = () => {
    if (input.trim()) {
      setSearchTerm(input.trim());
      setIsRateLimited(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.9) {
      return (
        <Tooltip label="This information is highly reliable">
          <Badge 
            colorScheme="green" 
            fontSize="sm" 
            px={3} 
            py={1} 
            borderRadius="full"
            boxShadow="sm"
          >
            <HStack spacing={1}>
              <Icon as={FaCheck} boxSize={3} />
              <Text>High Confidence</Text>
            </HStack>
          </Badge>
        </Tooltip>
      );
    } else if (confidence >= 0.7) {
      return (
        <Tooltip label="This information is moderately reliable">
          <Badge 
            colorScheme="yellow" 
            fontSize="sm" 
            px={3} 
            py={1} 
            borderRadius="full"
            boxShadow="sm"
          >
            <HStack spacing={1}>
              <Icon as={FaInfoCircle} boxSize={3} />
              <Text>Medium Confidence</Text>
            </HStack>
          </Badge>
        </Tooltip>
      );
    } else {
      return (
        <Tooltip label="This information should be verified with a healthcare provider">
          <Badge 
            colorScheme="red" 
            fontSize="sm" 
            px={3} 
            py={1} 
            borderRadius="full"
            boxShadow="sm"
          >
            <HStack spacing={1}>
              <Icon as={FaExclamationCircle} boxSize={3} />
              <Text>Low Confidence</Text>
            </HStack>
          </Badge>
        </Tooltip>
      );
    }
  };

  return (
    <Box>
      <Card 
        mb={6} 
        bg={cardBg} 
        shadow={cardShadow} 
        borderRadius="xl" 
        borderWidth="1px" 
        borderColor={borderColor}
        overflow="hidden"
        position="relative"
        transition="all 0.3s"
        _hover={{
          transform: 'translateY(-5px)',
          boxShadow: '2xl'
        }}
      >
        <CardBody p={6}>
          <VStack spacing={4} align="stretch">
            <Flex 
              justify="space-between" 
              align="center" 
              mb={1}
              flexDirection={{ base: "column", sm: "row" }}
              gap={2}
            >
              <HStack spacing={3}>
                <Icon 
                  as={FaAppleAlt} 
                  color="teal.400" 
                  boxSize={iconSize} 
                  className="pulse-icon"
                />
                <Heading as="h2" size={headingSize} color={headingColor}>
                  Search Food Safety
                </Heading>
              </HStack>
              <Badge 
                colorScheme="purple" 
                variant="solid" 
                borderRadius="full" 
                px={3}
                fontWeight="bold"
                fontSize={badgeSize}
                mt={{ base: 1, sm: 0 }}
              >
                AI Powered
              </Badge>
            </Flex>
            
            <Text fontSize="sm" color="gray.500" mb={2}>
              Enter a food item to check if it's safe to consume during pregnancy
            </Text>
            
            <InputGroup size="lg">
              <Input
                placeholder="Search..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                bg={inputBg}
                borderWidth="1px"
                borderColor={borderColor}
                _focus={{ 
                  borderColor: accentColor, 
                  boxShadow: `0 0 0 1px ${accentColor}`
                }}
                _hover={{
                  borderColor: 'teal.300'
                }}
                borderRadius="full"
                pl={5}
                pr={16}
                height="48px"
                fontSize="md"
              />
              <InputRightElement width="4rem" pr={1} height="48px">
                <Button
                  aria-label="Search"
                  size="sm"
                  colorScheme="teal"
                  onClick={handleSearch}
                  isLoading={isLoading}
                  borderRadius="full"
                  p={0}
                  minW="40px"
                  height="40px"
                  className="search-button"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'md'
                  }}
                >
                  <Icon as={FaSearch} boxSize={4} />
                </Button>
              </InputRightElement>
            </InputGroup>
          </VStack>
        </CardBody>
      </Card>

      {isLoading && (
        <Card bg={cardBg} shadow={cardShadow} borderRadius="xl" borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Stack spacing={6}>
              <HStack>
                <Skeleton height="40px" width="70%" />
                <Skeleton height="30px" width="20%" />
              </HStack>
              <Skeleton height="30px" width="90%" />
              <Skeleton height="20px" width="80%" />
              <Skeleton height="120px" width="100%" />
            </Stack>
          </CardBody>
        </Card>
      )}

      {isRateLimited && (
        <ScaleFade initialScale={0.9} in={true}>
          <Alert 
            status="warning" 
            variant="solid" 
            borderRadius="xl" 
            mt={4} 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center" 
            textAlign="center" 
            py={6}
            boxShadow="md"
          >
            <Flex mb={3} bg="orange.300" p={3} borderRadius="full">
              <Icon as={FaClock} boxSize={6} color="white" />
            </Flex>
            <AlertIcon display="none" />
            <Heading size="md" mb={2}>Rate Limit Reached</Heading>
            <Text>
              You've made too many requests in a short period of time. 
              Please wait a few minutes and try again.
            </Text>
          </Alert>
        </ScaleFade>
      )}

      {error && !isRateLimited && (
        <Alert status="error" borderRadius="xl" mt={4}>
          <AlertIcon />
          {error.message}
        </Alert>
      )}

      {!searchTerm && !isLoading && !data && !isRateLimited && (
        <ScaleFade initialScale={0.9} in={true}>
          <Box 
            textAlign="center" 
            py={12} 
            px={6} 
            borderRadius="xl" 
            borderWidth="1px" 
            borderColor={borderColor}
            borderStyle="dashed"
            bg={useColorModeValue('gray.50', 'gray.800')}
            position="relative"
            overflow="hidden"
            transition="all 0.3s"
            _hover={{
              borderColor: 'teal.300',
              transform: 'scale(1.01)',
            }}
          >
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              height="8px"
              bgGradient="linear(to-r, teal.400, blue.500, purple.500)"
            />
            <Icon as={FaHeart} color="teal.400" boxSize={14} mb={4} />
            <Heading as="h3" size="lg" mb={2} color={headingColor}>
              Start Your Food Safety Journey
            </Heading>
            <Text color="gray.500" fontSize="lg" maxW="md" mx="auto" mt={4}>
              Search for any food to see if it's safe during pregnancy.
              Our AI-powered system provides research-backed information.
            </Text>
            
            <HStack justify="center" spacing={8} mt={8}>
              <VStack>
                <Icon as={FaLeaf} color="green.400" boxSize={8} />
                <Text fontWeight="medium" color={headingColor}>Safe Options</Text>
              </VStack>
              <VStack>
                <Icon as={FaExclamationTriangle} color="orange.400" boxSize={8} />
                <Text fontWeight="medium" color={headingColor}>Potential Risks</Text>
              </VStack>
              <VStack>
                <Icon as={FaStar} color="blue.400" boxSize={8} />
                <Text fontWeight="medium" color={headingColor}>Health Benefits</Text>
              </VStack>
            </HStack>
          </Box>
        </ScaleFade>
      )}

      {data && !isRateLimited && (
        <ScaleFade initialScale={0.9} in={true}>
          <Card 
            bg={cardBg} 
            shadow={cardShadow} 
            borderRadius="xl" 
            borderWidth="1px" 
            borderColor={borderColor}
            overflow="hidden"
            transition="all 0.3s"
          >
            <CardHeader 
              pb={4} 
              bg={data.data.isSafe ? 'green.50' : 'red.50'} 
              borderBottomWidth="1px" 
              borderColor={data.data.isSafe ? 'green.100' : 'red.100'}
              position="relative"
              overflow="hidden"
            >
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                height="4px"
                bg={data.data.isSafe ? 'green.400' : 'red.400'}
              />
              <HStack spacing={2} justify="space-between" flexWrap="wrap">
                <Heading 
                  size="lg" 
                  color={data.data.isSafe ? 'green.700' : 'red.700'}
                  fontWeight="bold"
                >
                  {data.data.name}
                </Heading>
                {getConfidenceBadge(data.data.confidence)}
              </HStack>
            </CardHeader>
            <CardBody p={6}>
              <VStack align="start" spacing={6}>
                <HStack 
                  bg={data.data.isSafe ? 'green.50' : 'red.50'} 
                  p={4} 
                  borderRadius="lg" 
                  width="100%"
                  boxShadow="sm"
                >
                  <Flex
                    bg={data.data.isSafe ? 'green.500' : 'red.500'}
                    borderRadius="full"
                    p={3}
                    color="white"
                    boxShadow="md"
                  >
                    {data.data.isSafe ? (
                      <FaCheck size={18} />
                    ) : (
                      <FaTimes size={18} />
                    )}
                  </Flex>
                  <Heading size="md" color={data.data.isSafe ? 'green.700' : 'red.700'} ml={3}>
                    {data.data.isSafe ? 'Safe to consume' : 'Not recommended'}
                  </Heading>
                </HStack>

                <Text fontSize="md" lineHeight="tall">{data.data.explanation}</Text>

                {data.data.safeQuantity && (
                  <Box 
                    width="100%" 
                    p={5} 
                    borderRadius="lg" 
                    bg="blue.50" 
                    borderLeft="4px solid" 
                    borderColor="blue.400"
                    boxShadow="sm"
                    _hover={{
                      boxShadow: "md",
                      transform: "translateY(-2px)"
                    }}
                    transition="all 0.3s"
                  >
                    <Heading size="sm" mb={2} color="blue.700">Recommended Quantity</Heading>
                    <Text fontWeight="medium">{data.data.safeQuantity}</Text>
                  </Box>
                )}

                {data.data.risks && data.data.risks.length > 0 && (
                  <Box 
                    width="100%" 
                    p={5} 
                    borderRadius="lg" 
                    bg="orange.50"
                    boxShadow="sm"
                    _hover={{
                      boxShadow: "md",
                      transform: "translateY(-2px)"
                    }}
                    transition="all 0.3s"
                  >
                    <Heading size="sm" mb={3} color="orange.700">Potential Risks</Heading>
                    <List spacing={3}>
                      {data.data.risks.map((risk, index) => (
                        <ListItem key={index} display="flex" alignItems="flex-start">
                          <ListIcon as={FaExclamationTriangle} color="orange.500" mt={1} />
                          <Text>{risk}</Text>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {data.data.benefits && data.data.benefits.length > 0 && (
                  <Box 
                    width="100%" 
                    p={5} 
                    borderRadius="lg" 
                    bg="green.50"
                    boxShadow="sm"
                    _hover={{
                      boxShadow: "md",
                      transform: "translateY(-2px)"
                    }}
                    transition="all 0.3s"
                  >
                    <Heading size="sm" mb={3} color="green.700">Benefits</Heading>
                    <List spacing={3}>
                      {data.data.benefits.map((benefit, index) => (
                        <ListItem key={index} display="flex" alignItems="flex-start">
                          <ListIcon as={FaStar} color="green.500" mt={1} />
                          <Text>{benefit}</Text>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {data.data.alternatives && data.data.alternatives.length > 0 && (
                  <Box 
                    width="100%" 
                    p={5} 
                    borderRadius="lg" 
                    bg="purple.50"
                    boxShadow="sm"
                    _hover={{
                      boxShadow: "md",
                      transform: "translateY(-2px)"
                    }}
                    transition="all 0.3s"
                  >
                    <Heading size="sm" mb={3} color="purple.700">Alternatives</Heading>
                    <List spacing={3}>
                      {data.data.alternatives.map((alternative, index) => (
                        <ListItem key={index} display="flex" alignItems="flex-start">
                          <ListIcon as={FaCheck} color="purple.500" mt={1} />
                          <Text>{alternative}</Text>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                <Divider />

                {data.data.sourceUrl && (
                  <HStack 
                    spacing={2} 
                    width="100%" 
                    p={4} 
                    borderRadius="lg" 
                    bg="gray.50"
                    boxShadow="sm"
                  >
                    <Icon as={FaExclamationCircle} color="gray.500" />
                    <Text fontSize="sm" color="gray.600">
                      Source:{' '}
                      <Link 
                        href={data.data.sourceUrl} 
                        isExternal 
                        color="blue.500" 
                        fontWeight="medium"
                      >
                        {new URL(data.data.sourceUrl).hostname}
                      </Link>
                    </Text>
                  </HStack>
                )}
              </VStack>
            </CardBody>
          </Card>
        </ScaleFade>
      )}
    </Box>
  );
};

export default FoodSearch; 