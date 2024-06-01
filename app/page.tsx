import * as React from 'react'
import { ChakraProvider, Box, VStack, Grid, extendTheme, Button, ThemeConfig } from '@chakra-ui/react'
// import { ColorModeSwitcher } from './ColorModeSwitcher'
import MainGrid from './components/MainGrid'


const config: ThemeConfig = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
}


export default function Home() {
  return (
    <ChakraProvider >
    <Box textAlign="center" fontSize="xl">
      <Grid minH="100vh" p={3}>
        {/* <ColorModeSwitcher justifySelf="flex-end" /> */}
        helloDDD
        <VStack spacing={8}>
          <Box>
            <MainGrid />
          </Box>
        </VStack>
      </Grid>
    </Box>
  </ChakraProvider>
  );
}
