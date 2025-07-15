import React from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Skeleton,
  Box,
} from "@mui/material";

export function Notificationskeleton(title, rows = 4) {
  return (
    <React.Fragment>
      <Typography
        variant="h6"
        component="h3"
        gutterBottom
        sx={{ mt: 3, mb: 1 }}
      >
        <Skeleton width="70%" />
      </Typography>

      <List dense>
        {Array.from({ length: rows }).map((_, idx) => (
          <React.Fragment key={idx}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={<Skeleton variant="text" width="40%" height={24} />}
                secondary={
                  <Box>     
                    <Skeleton variant="text" width="80%" />
                    <Box mt={1}>
                      <Skeleton variant="text" width="60%" />
                    </Box>
                    <Box mt={0.5}>
                      <Skeleton variant="text" width="50%" />
                    </Box>
                  </Box>
                }
              />
            </ListItem>
            {idx < rows - 1 && <Divider component="li" />}
          </React.Fragment>
        ))}
      </List>
    </React.Fragment>
  );
}
