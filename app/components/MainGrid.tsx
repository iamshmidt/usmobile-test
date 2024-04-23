"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Flex, SimpleGrid, useColorMode } from '@chakra-ui/react';
import useGame from '../hooks/gameControls';
import useInterval from 'use-interval'

interface Cell {
  alive: boolean;
}

const MainGrid = () => {
  const [generation, setGeneration] = useState<number>(0);
  const [gridFull, setGridFull] = useState<Cell[][]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(500);
  const rows: number = 50;
  const cols: number = 50;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    seed();
  }, []);

  const cloneArray = (arr: any) => {
    return JSON.parse(JSON.stringify(arr));
  }

  const seed = () => {
    const newGrid = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({ alive: Math.floor(Math.random() * 4) === 1 }))
    );
    setGridFull(newGrid);
  };

  const playButton = () => {
    setIsPlaying(true);
  };

  const pauseButton = () => {
    setIsPlaying(false);
  };

  const fast = () => {
    setSpeed(100);
  };

  const slow = () => {
    setSpeed(1000);
  };

  const resetButton = () => {
    setGeneration(0);
    seed();
  }

  const play = () => {
    setGeneration((prevGen) => prevGen + 1);
    setGridFull((prevGrid) => {
      const newGrid = cloneArray(prevGrid);

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          let count = 0;

          if (i > 0 && prevGrid[i - 1][j].alive) count++;
          if (i > 0 && j > 0 && prevGrid[i - 1][j - 1].alive) count++;
          if (i > 0 && j < cols - 1 && prevGrid[i - 1][j + 1].alive) count++;
          if (j < cols - 1 && prevGrid[i][j + 1].alive) count++;
          if (j > 0 && prevGrid[i][j - 1].alive) count++;
          if (i < rows - 1 && prevGrid[i + 1][j].alive) count++;
          if (i < rows - 1 && j > 0 && prevGrid[i + 1][j - 1].alive) count++;
          if (i < rows - 1 && j < cols - 1 && prevGrid[i + 1][j + 1].alive) count++;

          if (prevGrid[i][j].alive && (count < 2 || count > 3)) newGrid[i][j].alive = false;
          if (!prevGrid[i][j].alive && count === 3) newGrid[i][j].alive = true;
        }
      }
      return newGrid;
    });
  };

  useInterval(() => {
    if (isPlaying) {
      play();
    }
  }, speed);

  return (
    <div>
      <Box mb="2rem">
        <Box
          as="h1"
          fontSize="30px"
          textShadow={'8px 8px #9a9a9a'}
          letterSpacing="3px"
          color={'gray.800'}
        >
          GAME OF LIFE
        </Box>
      </Box>

      <SimpleGrid gridTemplateColumns="1fr 5fr 1fr" mb="2rem">
        <Flex gridGap="1rem" justifyContent="center">
          <Button onClick={playButton}>Play</Button>
          <Button onClick={pauseButton}>Pause</Button>
          <Button onClick={resetButton}>Reset</Button>
          <Button onClick={fast}>Fast</Button>
          <Button onClick={slow}>Slow</Button>
        </Flex>
        <Box>Step: {generation}</Box>
      </SimpleGrid>

      <SimpleGrid
        data-testid="grid-wrapper"
        gridTemplateColumns={`repeat(${cols}, 20px)`}
        gridGap="2px"
        mb="4rem"
      >
        {gridFull.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <Box
              key={`${rowIndex}-${colIndex}`}
              data-testid="cell"
              width="20px"
              height="20px"
              backgroundColor={cell.alive ? 'black' : 'gray.300'}
              cursor="pointer"
            />
          ))
        ))}
      </SimpleGrid>
    </div>
  )
}

export default MainGrid;
