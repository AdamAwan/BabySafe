import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react'
import './App.css'
import FoodSearch from './components/FoodSearch'

function App() {
  return (
    <Container maxW="container.md" pt={10}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={2}>BabySafe</Heading>
          <Text fontSize="lg" color="gray.600">
            Food Safety Information During Pregnancy
          </Text>
        </Box>
        
        <FoodSearch />
      </VStack>
    </Container>
  )
}

export default App
