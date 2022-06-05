import { Box, Button as MuiButton } from "@mui/material";

import React, { FC, useState } from "react";
import useAuth from "../hooks/useAuth";
import { shortAddr } from "../utils/calculation";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LogoutIcon from '@mui/icons-material/Logout';
import { Button } from "./Global";
import { useNavigate } from "react-router-dom";
import pieIcon from "../assets/images/pieIcon.png"
import kyc from "../assets/images/assure2.png"
import useMobile from "../hooks/useMobile";
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
    setToggle, getToggle
} from '../actions/ToggleMode';

interface SidebarProps {
    mode?: string;
    onChangePage: (page: number) => void
}

const Topbar: FC<SidebarProps> = (props: SidebarProps) => {
    const { account, logout, login } = useAuth();
    const [open, setOpen] = useState(false)
    const [openToggle, setOpenToggle] = useState(false);
    let navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { isMobile } = useMobile()
    const isToggled = useAppSelector(getToggle)

    const copyAddress = () => {
        navigator.clipboard.writeText(account || "")
    }

    const toggle = () => {
        if (!isMobile) return;
        dispatch(setToggle())
    }

    const openTopbar = () => {
        if(!isMobile) return;
        if (isToggled) dispatch(setToggle());
        setOpenToggle(!openToggle)
    }
    return <Box position="relative" width="100%" zIndex="20">
        <Box
            display="flex"
            alignItems="center"
            py="7px"
            height="100%"
            bgcolor="#000"
            width="-webkit-fill-available"
            color="#FCF686"
            pl="4.16vw"
            pr="5.7vw"
            justifyContent={'space-between'}
            zIndex="20"
        >
            <Box fontSize="15px" display="flex" alignItems="center" width="50%">
                {isMobile && <Box component="img" src={pieIcon} onClick={toggle} width="20px" style={{ cursor: 'pointer', objectFit: 'cover' }} alt="logo" mr="2.8vw" />}
                {!isMobile ? <>
                    <Box mr="50px" style={{ cursor: 'pointer' }} onClick={() => props.onChangePage(0)}>Staking</Box>
                    <Box style={{ cursor: 'pointer' }} onClick={() => props.onChangePage(1)}>User Information</Box>
                </> : <Box color="#FCF686" style={{ cursor: 'pointer' }} onClick={openTopbar}>---</Box>}
            </Box>
            <Box display="flex" justifyContent="flex-end" alignItems="center" zIndex="10">
                {/* {props.mode === "home" && <Button style={{ fontWeight: 'bold' }} onClick={() => navigate('/staking')}> OPEN APP</Button>} */}
                {props.mode === "staking" && !account &&
                    <Button style={{ fontWeight: 'bold' }} onClick={login}>Connect Wallet</Button>
                }
                {props.mode === "staking" && account &&
                    <Box display="flex" fontSize="15px" alignItems="center" style={{ cursor: 'pointer' }} position="relative" onClick={() => { setOpen(!open) }}>
                        <Box >{shortAddr(account || "")}</Box>
                        <Box position="absolute" color="#FCF686" display={open ? "flex" : "none"} alignItems="flex-start" flexDirection="column" borderRadius="6px" p="1vw" pr="1.5vw" left="-40%" width="150%" boxShadow="5px 4px 13px 7px #000000" top="calc(100% + 1vw)" bgcolor="#202020" zIndex={10}>
                            <Box component={MuiButton} color="#FCF686" style={{ textTransform: 'none' }} onClick={copyAddress} startIcon={<ContentCopyIcon />}>Copy Address</Box>
                            <MuiButton
                                color="inherit"
                                style={{ textTransform: 'none' }}
                                startIcon={<OpenInNewIcon />}
                                href={`https://snowtrace.io/address/${account}`}
                                target="_blank"
                            >
                                View on Explorer
                            </MuiButton>
                            <Box component={MuiButton} color="#FCF686" style={{ textTransform: 'none' }} startIcon={<LogoutIcon />} onClick={logout} >Disconnect</Box>
                        </Box>
                    </Box>
                }
            </Box>
        </Box>
    </Box>
}

export default Topbar;