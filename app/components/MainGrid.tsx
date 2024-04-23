"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Flex, Input, InputGroup, InputLeftAddon, SimpleGrid, } from '@chakra-ui/react';
import useInterval from 'use-interval'
import { HexColorPicker } from "react-colorful";

interface Cell {
  alive: boolean;
}

const MainGrid = () => {
  const [generation, setGeneration] = useState<number>(0);
  const [gridFull, setGridFull] = useState<Cell[][]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(500);
  const [cellColor, setCellColor] = useState<string>('#3f546a');
  const [bgColor, setBgColor] = useState<string>('#d4e9e3');
  const rows: number = 30;
  const cols: number = 50;

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
    setSpeed(500);
  };

  const pauseButton = () => {
    setIsPlaying(false);
  };

  const fast = () => {
    setIsPlaying(true);
    setSpeed(100);
  };

  const slow = () => {
    setIsPlaying(true);
    setSpeed(1000);
  };

  const resetButton = () => {
    setGeneration(0);
    setSpeed(500);
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
    <div className='flex mr-auto flex-col justify-center items-center'>
      <Box
        as="h1"
        fontSize="24px"
        letterSpacing="3px"
        color={'gray.800'}
        my={5}
      >
        GAME OF LIFE
      </Box>
      <Flex direction="row" >
        <Flex direction="column" justifyContent="center" marginRight={4} gap={5}>
          <HexColorPicker color={cellColor} onChange={setCellColor} />
          <InputGroup>
            <InputLeftAddon>Cell Color</InputLeftAddon>
            <Input type='tel' placeholder='cell color' width={200} value={cellColor} onChange={(e) => setCellColor(e.target.value)} />
          </InputGroup>
        </Flex>

        <Flex direction="column" justifyContent="center" gap={5}>
          <HexColorPicker color={bgColor} onChange={setBgColor} />
          <InputGroup>
            <InputLeftAddon>BG Color</InputLeftAddon>
            <Input type='tel' placeholder='background color' width={200} value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
          </InputGroup>
        </Flex>
      </Flex>

      <SimpleGrid gridTemplateColumns="1fr 1fr" my="2rem" alignItems="center">
        <Flex gridGap="1rem" justifyContent="center">
          <Button onClick={playButton} variant={isPlaying ? "outline" : ""} colorScheme='gray'>Play</Button>
          <Button onClick={pauseButton} variant={!isPlaying ? "outline" : ""} colorScheme='gray'>Pause</Button>
          <Button onClick={resetButton} colorScheme='red'>Reset</Button>
          <Button onClick={fast} variant={speed === 100 ? "outline" : ""} colorScheme='gray'>Fast</Button>
          <Button onClick={slow} variant={speed === 1000 ? "outline" : ""} colorScheme='gray'>Slow</Button>
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
              backgroundColor={cell.alive ? cellColor : bgColor}
              cursor="pointer"
            />
          ))
        ))}
      </SimpleGrid>
    </div>
  )
}

export default MainGrid;
