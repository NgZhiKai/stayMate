import { Box, Slider, Typography } from '@mui/material';
import React from 'react';

interface FiltersProps {
  priceRange: [number, number];
  rating: number;
  onPriceChange: (value: [number, number]) => void;
  onRatingChange: (value: number) => void;
}

const Filters: React.FC<FiltersProps> = ({
  priceRange,
  rating,
  onPriceChange,
  onRatingChange,
}) => {
  return (
    <Box>
      <Typography variant="h6">Filters</Typography>
      <Box mt={2}>
        <Typography>Price Range</Typography>
        <Slider
          value={priceRange}
          onChange={(_, value) => onPriceChange(value as [number, number])}
          valueLabelDisplay="auto"
          min={0}
          max={500}
        />
      </Box>
      <Box mt={2}>
        <Typography>Rating</Typography>
        <Slider
          value={rating}
          onChange={(_, value) => onRatingChange(value as number)}
          valueLabelDisplay="auto"
          min={0}
          max={5}
          step={0.1}
        />
      </Box>
    </Box>
  );
};

export default Filters;