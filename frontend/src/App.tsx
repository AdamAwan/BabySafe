import { Box, VStack, Container, Heading, Text, useColorModeValue, Icon, Flex, HStack } from '@chakra-ui/react'
import './App.css'
import FoodSearch from './components/FoodSearch'
import { FaBaby, FaHeart } from 'react-icons/fa'

const App = () => {
  const bgColor = useColorModeValue('teal.50', 'gray.900')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  
  return (
    <Box 
      minH="100vh" 
      py={8} 
      bgGradient={useColorModeValue(
        'linear(to-b, teal.50, blue.50, purple.50)',
        'linear(to-b, gray.900, blue.900)'
      )}
    >
      <Container maxW="container.md">
        <VStack spacing={8}>
          <Box textAlign="center" mb={10} className="header-container">
            <HStack spacing={3} justify="center" mb={2}>
              <Icon as={FaBaby} boxSize={8} color="teal.400" className="pulse-icon" />
              <Heading 
                as="h1" 
                size="2xl" 
                bgGradient="linear(to-r, teal.400, blue.500, purple.400)" 
                bgClip="text"
                fontWeight="extrabold"
                letterSpacing="wider"
                textShadow="0 1px 2px rgba(0,0,0,0.1)"
                className="header-animation logo-text"
                mb={4}
              >
                BabySafe
              </Heading>
              <Icon as={FaHeart} boxSize={6} color="purple.400" className="pulse-icon" />
            </HStack>
            <Text 
              fontSize="xl" 
              color={textColor} 
              fontWeight="medium"
              letterSpacing="wide"
              textTransform="uppercase"
              className="subtitle-animation"
              mt={2}
            >
              Food Safety Information During Pregnancy
            </Text>
          </Box>
          
          <FoodSearch />
          
          <Text fontSize="sm" color={textColor} textAlign="center" mt={6}>
            Always consult with your healthcare provider for personalized advice.
          </Text>
        </VStack>
      </Container>
    </Box>
  )
}

export default App
