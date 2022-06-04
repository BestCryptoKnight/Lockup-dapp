import { Box, styled } from "@mui/material";
import React, { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Ds from "../assets/images/ds.svg"
import Tw from "../assets/images/tw.svg"
import medium from "../assets/images/medium.svg"
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
    setToggle, getToggle
} from '../actions/ToggleMode';
import useMobile from "../hooks/useMobile";

const Items = styled((props: any) => <Box {...props} />)`
    display: flex;
    padding: 10px;
    padding-left: 15px;
    align-items: center;
    cursor: pointer;
    &:hover{
        color: #6EF47A;
    }
`

const Triangle = styled((props: any) => <span {...props} />)`
    width: 0; 
    height: 0; 
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-top: 10px solid #ffffff;
    margin-right: 10px;
`

const Sidebar: FC = () => {
    const { pathname } = useLocation();
    const isSelected = (url: string) => pathname === url
    const {isMobile} = useMobile();
    const dispatch = useAppDispatch();
    const isToggled = useAppSelector(getToggle)
    let navigate = useNavigate();
    const toggle = () => {
        if(!isMobile) return;
        dispatch(setToggle())
    }

    const onClickItem = (url: string) => () => {
        navigate(url);
        toggle();
    }

    return <Box
        display="flex"
        py="10px"
        height="calc(100vh)"
        color="white"
        position="fixed"
        left="0"
        top="30px"
        width="100%"
        style={{transition: 'all 0.2s', transform: !isToggled&&isMobile ? "translateX(-100%)": "translateX(0)"}}
        zIndex={isMobile&&isToggled ? "10" : "0"}
    >
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            bgcolor={"black"}
            width="250px"
            minWidth="250px"
            pr="10px"
        >
            <Box display="flex" flexDirection="column" justifyContent="center" height="100%" mb="100px">
                <Box mb="30px" ml="25px" mt="50px">
                    <Box display="flex" alignItems="center"><Triangle /> REBASED DASHBOARD</Box>
                    <Items color={isSelected('/dashboard') ? '#6EF47A' : 'white'} onClick={onClickItem('/dashboard')}>
                        <Box borderRadius={999} width="10px" height="10px" bgcolor="gray" mr="10px" />
                        <Box fontSize="14px" >Dashboard</Box>
                    </Items>
                    <Items color={isSelected('/account') ? '#6EF47A' : 'white'} onClick={onClickItem('/account') }>
                        <Box borderRadius={999} width="10px" height="10px" bgcolor="gray" mr="10px" />
                        <Box fontSize="14px" >Account</Box>
                    </Items>
                    <Items color={isSelected('/calculator') ? '#6EF47A' : 'white'} onClick={onClickItem('/calculator')}>
                        <Box borderRadius={999} width="10px" height="10px" bgcolor="gray" mr="10px" />
                        <Box fontSize="14px" >Calculator</Box>
                    </Items>
                </Box>
                <Box ml="25px">
                    <Box display="flex" alignItems="center">
                        <Triangle /> ENHANCED FEATURES
                    </Box>

                    <Items color={isSelected('/dapp_dashboard') ? '#6EF47A' : 'white'} onClick={onClickItem('/dapp_dashboard')}>
                        <Box borderRadius={999} width="10px" height="10px" bgcolor="gray" mr="10px" />
                        <Box fontSize="14px" >DAPP dashboard</Box>
                    </Items>

                    <Items color={isSelected('/staking') ? '#6EF47A' : 'white'} onClick={onClickItem('/staking')}>
                        <Box borderRadius={999} width="10px" height="10px" bgcolor="gray" mr="10px" />
                        <Box fontSize="14px" >Liquidity Node</Box>
                    </Items>
                    <Items color={isSelected('/wrap') ? '#6EF47A' : 'white'} onClick={()=>{navigate('/wrap')}}>
                        <Box borderRadius={999} width="10px" height="10px" bgcolor="gray" mr="10px" />
                        <Box fontSize="14px" >xLEO</Box>
                    </Items>

                    <Items color={isSelected('/income') ? '#6EF47A' : 'white'}  onClick={()=>{navigate('/income')}}  >
                        <Box borderRadius={999} width="10px" height="10px" bgcolor="gray" mr="10px" />
                        <Box fontSize="14px" >AVAX income</Box>
                    </Items>
                    <Items color={isSelected('/income') ? '#6EF47A' : 'white'}  onClick={()=>{navigate('/incomeeth')}}  >
                        <Box borderRadius={999} width="10px" height="10px" bgcolor="gray" mr="10px" />
                        <Box fontSize="14px" >ETH income</Box>
                    </Items>
                    <Items color={isSelected('/presale') ? '#6EF47A' : 'white'} onClick={onClickItem('/presale')}>
                        <Box borderRadius={999} width="10px" height="10px" bgcolor="gray" mr="10px" />
                        <Box fontSize="14px" >Whitelist Presale</Box>
                    </Items>

                </Box>

            </Box>
            <Box display="flex" flexDirection="column" ml="50px" mb="100px">
                <Box display="flex" mb="10px">
                    <a href="https://discord.gg/Wga5sWPRc6" rel="noreferrer" target="_blank"><Box component="img" src={Ds} width="24px" height="24px" mr="30px" style={{ cursor: 'pointer' }} /></a>
                    <a href="https://twitter.com/LeonidasFinance" rel="noreferrer" target="_blank"><Box component="img" src={Tw} width="24px" height="24px" mr="30px" style={{ cursor: 'pointer' }} /></a>
                    <a href="https://medium.com/@leonidasfinance" rel="noreferrer" target="_blank"><Box component="img" src={medium} width="24px" height="24px" mr="30px" style={{ cursor: 'pointer' }} /></a>
                </Box>
            </Box>
        </Box>
        {isMobile&&isToggled&&<Box width="100%" style={{backdropFilter: 'blur(5px)'}} onClick={toggle}></Box>}
    </Box>
}
export default Sidebar;