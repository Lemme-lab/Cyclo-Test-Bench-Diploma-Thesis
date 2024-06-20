import React from "react";
import { Box, useMediaQuery } from "@mui/material";
import Column1 from "./Column1";
import Column2 from "./Column2";
import Column3 from "./Column3";

const gridTemplateLargeScreens = `
  "a f g"
  "a f g"
  "a f x"
  "b f x"
  "b f x"
  "b f x"
  "b f x"
  "c f x"
  "c f x"
  "c f x"
`;
const gridTemplateSmallScreens = `
  "a"
  "a"
  "a"
  "a"
  "b"
  "b"
  "b"
  "b"
  "c"
  "c"
  "c"
  "d"
  "d"
  "d"
  "e"
  "e"
  "f"
  "f"
  "h"
  "h"
  "j"
  "j"
  "j"
`;

const Controlls = () => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 1000px)");
  return (
    <Box
      width="100%"
      height="100%"
      display="grid"
      gap="1.5rem"
      sx={
        isAboveMediumScreens
          ? {
              gridTemplateColumns: "repeat(3, minmax(370px, 1fr))",
              gridTemplateRows: "repeat(10, minmax(60px, 1fr))",
              gridTemplateAreas: gridTemplateLargeScreens,
            }
          : {
              gridAutoColumns: "1fr",
              gridAutoRows: "80px",
              gridTemplateAreas: gridTemplateSmallScreens,
            }
      }
    >
      <Column1 />
      <Column2 />
      <Column3 />

    </Box>
  );
};

export default Controlls;