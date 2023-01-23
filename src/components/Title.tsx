import * as React from 'react';
import Typography from '@mui/material/Typography';

interface TitleProps {
  children?: React.ReactNode;
  margin?: number
  pading?: number
  sx?: {}
}

export default function Title({children, margin, pading, sx}: TitleProps) {
  return (
    <Typography component="h2" variant="h6" color="primary" gutterBottom m={margin} p={pading} sx={sx}>
      {children}
    </Typography>
  );
}