import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Rating } from '@mui/material';
import { Hotel } from '../types/Hotels';
import { Link } from 'react-router-dom';

interface HotelCardProps {
  hotel: Hotel;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  return (
    <Link to={`/hotel/${hotel.id}`} style={{ textDecoration: 'none' }}>
      <Card sx={{ maxWidth: 345, cursor: 'pointer' }}>
        <CardMedia component="img" height="140" image={hotel.image} alt={hotel.name} />
        <CardContent>
          <Typography variant="h5">{hotel.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {hotel.address}
          </Typography>
          <Box display="flex" alignItems="center" mt={1}>
            <Rating value={hotel.rating} readOnly precision={0.1} />
            <Typography variant="body2" ml={1}>
              {hotel.rating}
            </Typography>
          </Box>
          <Typography variant="h6" mt={1}>
            ${hotel.pricePerNight} / night
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
};

export default HotelCard;
