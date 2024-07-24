import React from "react";
import {Box} from "../../rebass";
import {NavLink} from "../../platform/links";
import {NewPaper} from "../../components/NewPaper";


export const ItemNewHexagon = React.memo((props : any) => {
    const { node } = props;

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
                    hexagonal
                />
            </NavLink>
        </Box>
    );
});
