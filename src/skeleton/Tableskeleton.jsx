import React from "react";
import { TableBody, TableRow, TableCell, Skeleton, Box } from "@mui/material";

export function Tableskeleton({ count = 5 }) {
  return (
    <TableBody>
      {Array.from({ length: count }).map((_, idx) => (
        <TableRow hover key={idx}>
          <TableCell padding="checkbox">
            <Skeleton variant="circular" width={24} height={24} />
          </TableCell>

          <TableCell padding="none">
            <Skeleton variant="text" width="40%" />
          </TableCell>

          <TableCell>
            <Box sx={{ maxWidth: 200 }}>
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="80%" />
            </Box>
          </TableCell>

          <TableCell>
            <Skeleton variant="rectangular" width={60} height={24} />
          </TableCell>

          <TableCell>
            <Skeleton variant="rectangular" width={60} height={24} />
          </TableCell>

          <TableCell>
            <Skeleton
              variant="circular"
              width={24}
              height={24}
              sx={{ mr: 1 }}
            />
            <Skeleton
              variant="circular"
              width={24}
              height={24}
              sx={{ mr: 1 }}
            />
            <Skeleton variant="circular" width={24} height={24} />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
