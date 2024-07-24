import React from "react";
import { NewPaper } from "../components/NewPaper";
import { NavLink } from "../platform/links";
import { Box } from "../rebass";

export const PageNewPaper = React.memo((props : any) => {
  const { node ,hexagonal } = props;

  return (
    <Box>
      <NavLink
        {...{
          route: node.id ? "/chi-tiet-tin" : "/null",
          params: {
            id: node.id,
          },
        }}
      >
        <NewPaper
          key={node.id}
          image={node.news_image}
          name={node.news_title}
          minute={node.news_created_date}
          hexagonal={hexagonal}
        />
      </NavLink>
    </Box>
  );
});
