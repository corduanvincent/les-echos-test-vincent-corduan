import React from 'react';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';

interface NewsletterCardProps {
  title: string;
  description: string;
  image: string;
  label: React.ReactNode;
}

function NewsletterCard({ 
    title,
    description,
    image,
    label,
 }: NewsletterCardProps) {
  return (
    <Card sx={{ minWidth: 360 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={image}
          alt={title}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Container 
          maxWidth="lg"
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            {label}
        </Container>
      </CardActions>
    </Card>
  );
}

export default NewsletterCard;