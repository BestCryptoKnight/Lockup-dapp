import {Box, BoxProps} from "@mui/material";
import React, { FC, useEffect, useState } from "react";

interface Props extends BoxProps {
    hover?: boolean
    disabled?: boolean
}

const Paper:FC<Props> = (props: Props) => {
    const [shadow, setShadow] = useState<any>({shd1: 'rgba(0, 0, 0, 0.25)', shd3: 'rgba(9, 10, 31, 0.2)', shd2: 'rgba(255, 255, 255, 0.25)', shd4: 'rgba(255, 255, 255, 0.4)'})
    const toggleHover = (flag: boolean) => {
        if(!props.hover) return;
        if(props.disabled) return;
        if(flag) {
            setShadow({shd1: 'rgba(0, 0, 0, 0.05)', shd3: 'rgba(9, 10, 31, 0.01)', shd2: 'rgba(255, 255, 255, 0.25)', shd4: 'rgba(255, 255, 255, 0.4)'})
        } else {
            setShadow({shd1: 'rgba(0, 0, 0, 0.15)', shd3: 'rgba(9, 10, 31, 0.15)', shd2: 'rgba(255, 255, 255, 0.45)', shd4: 'rgba(255, 255, 255, 0.6)'})
        }
    }
    useEffect(()=>{
        if(props.hover)
            setShadow({shd1: 'rgba(0, 0, 0, 0.05)', shd3: 'rgba(9, 10, 31, 0.05)', shd2: 'rgba(255, 255, 255, 0.45)', shd4: 'rgba(255, 255, 255, 0.6)'})
        else
            setShadow({shd1: 'rgba(0, 0, 0, 0.25)', shd3: 'rgba(9, 10, 31, 0.2)', shd2: 'rgba(255, 255, 255, 0.25)', shd4: 'rgba(255, 255, 255, 0.4)'})
    // eslint-disable-next-line
    },[])
    return <Box 
            border={"1px solid rgba(255, 255, 255, 0.2)"}
            borderRadius="6px" 
            style={{backdropFilter: 'blur(40px)'}}
            display={props.display?props.display:"flex"}
            flexDirection={props.flexDirection? props.flexDirection:"column"}
            alignItems={props.alignItems ? props.alignItems : "center"}
            justifyContent={props.justifyContent ? props.justifyContent : "center"}
            onMouseEnter={()=>toggleHover(true)}
            onMouseLeave={()=>toggleHover(false)}
            {...props}
        >
        {props.children}
    </Box>
}

export default Paper;