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
                    <Box mr="50px" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Staking</Box>
                    <Box style={{ cursor: 'pointer' }} onClick={() => navigate('/userInfo')}>User Information</Box>
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
        {/* <Box
            display="flex"
            position="absolute"
            left="0"
            top="51px"
            alignItems="center"
            py="7px"
            bgcolor="#000"
            width="-webkit-fill-available"
            color="#FCF686"
            pl="4.16vw"
            pr="5.7vw"
            flexDirection="column"
            zIndex="20"
            style={{transition: 'all 0.2s', transform: openToggle&&isMobile ? "translateY(0)": "translateY(-120%)"}}
        >
            <Box mb="25px" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Home</Box>
            <Box mb="25px" style={{ cursor: 'pointer' }}><a href="https://leonidas-finance.gitbook.io/leonidas-finance-rebase-2.0/" target="blank" style={{ textDecoration: 'none', color: 'inherit' }}>Whitepaper</a></Box>
            <Box mb="25px" style={{ cursor: 'pointer' }} onClick={() => navigate('/roadmap')}>Roadmap</Box>
            <Box mb="25px" style={{ cursor: 'pointer' }}><a href="https://discord.gg/Wga5sWPRc6" target="blank" style={{ textDecoration: 'none', color: 'inherit' }}>Discord</a></Box>
            <Box mb="25px" style={{ cursor: 'pointer' }} onClick={() => navigate('/presale')}>Whitelist Presale</Box>
            <Box mb="25px" style={{ cursor: 'pointer' }}><a href="https://www.pinksale.finance/#/launchpad/0xa3071f57E542A692bd3495fd27aEC28F25051555?chain=AVAX" target="blank" style={{ textDecoration: 'none', color: 'inherit' }}>Public presale</a></Box>
            <a href="https://www.pinksale.finance/#/launchpad/0xa3071f57E542A692bd3495fd27aEC28F25051555?chain=AVAX" target="blank"><Box component="img" mb="10px" src={kyc} onClick={toggle} width="60px" style={{ cursor: 'pointer' }} alt="logo"></Box></a>
            <Box mb="20px" style={{ cursor: 'pointer' }} color="#E5C55A"><a href="https://twitter.com/AssureDefi/status/1510986021734912000" target="blank" style={{ textDecoration: 'none', color: 'inherit' }}>KYC</a></Box>
        </Box> */}
    </Box>
}

export default Topbar;