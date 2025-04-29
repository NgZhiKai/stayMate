import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Rating
} from '@mui/material';
import { HotelData } from '../../types/Hotels';
import { Link } from 'react-router-dom';

interface HotelCardProps {
  hotel: HotelData;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  const defaultImage = 'https://archive.org/download/placeholder-image/placeholder-image.jpg';
  const minPrice = Math.min(...hotel.rooms.map(room => room.pricePerNight));

  return (
    <Link to={`/hotel/${hotel.id}`} style={{ textDecoration: 'none' }}>
      <Card sx={{
        maxWidth: 280,
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        boxShadow: 2,
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'transform 0.2s',
        '&:hover': { transform: 'scale(1.05)' }
      }}>
        <CardMedia
          component="img"
          image={hotel.image ? `data:image/jpeg;base64,${hotel.image}` : defaultImage}
          alt={hotel.name}
          sx={{ height: 120, width: '100%', objectFit: 'contain' }}
        />
        <CardContent sx={{ p: 1.5, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold" noWrap>{hotel.name}</Typography>
          <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: '0.75rem' }}>
            {hotel.address}
          </Typography>
          <Box display="flex" alignItems="center" mt={0.5}>
            <Rating value={hotel.averageRating || 0} readOnly precision={0.1} size="small" />
            <Typography variant="caption" ml={0.5}>
              {hotel.averageRating?.toFixed(1) || '0.0'}
            </Typography>
          </Box>
          <Typography variant="subtitle2" mt={1} color="primary" fontWeight="bold" sx={{ fontSize: '0.85rem' }}>
            From ${minPrice} / night
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
};

export default HotelCard;