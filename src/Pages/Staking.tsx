import { Box, Checkbox } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import Topbar from "../Components/Topbar";
import { 
    getAllowance, 
    approve, 
    isExistStakingName,
    staking,
    getUserBalance,
    setNetworkProvider,
    getUserUnclaimedRewardAll,
    getTotalStakedAmmount,
    getUserStakedInfo,
    getUserNFT,
    StakeNFT,
} from "../hooks/useTokenInfo";
import useAuth from "../hooks/useAuth";
import Paper from "../Components/Paper";
// import Sidebar from "../Components/Sidebar";
import CountUp from 'react-countup';
import { roundWithPrecision } from "../utils/calculation";
// import coin2 from "../assets/images/coin2.png"
// import logo from "../assets/images/logo-large.png"
import useMobile from "../hooks/useMobile";
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { CustomField } from "../Components/Global";
import StakingInputComponent from "../Components/StakingInputComponent";
import { Button } from "../Components/Button";
import cx from "classnames";
import _ from "lodash";
import UserInfomationComponent from "../Components/UserInfomationComponent";
// import Bottombar from "../Components/Bottombar";

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="standard" {...props} />;
});

const Staking: FC = () => {
    const [openDlg, setOpenDlg] = useState({ open: false, title: '' })
    const [openStakeWindow, setOpenStakeWindow] = useState(false)
    
    const [claimableVal, setClaimableVal] = useState({ oldVal: 0, newVal: 0 })
    

    
    const [lpPrice, setLpPrice] = useState({ oldVal: 0, newVal: 0 })
    const [APR, setAPR] = useState({ oldVal: 0, newVal: 0 })
    const [LeoPrice, setLeoPrice] = useState({ oldVal: 0, newVal: 0 })
    const [timer, setTimer] = React.useState<any>({})
    const [period, setPeriod] = React.useState<number>(-1)
    
    const [ratio, setRatio] = useState({ oldVal: 0, newVal: 0 })
    const [unlockTime, setUnlockTime] = React.useState<number>(0)
    


    const [name, setName] = useState("");
    const [nftName, setNftName] = useState("")
    const [stakingAmount, setStakingAmount] = useState("")
    const [duration, setDuration] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [contract, setContract] = useState<any>({})
    const { account } = useAuth()
    const { isMobile } = useMobile()
    const [balance, setBalance] = useState({ oldVal: 0, newVal: 0 });
    const [totalStakedAmount, setTotalStakedAmount] = useState({ oldVal: 0, newVal: 0 })
    const [unCliamedRewardAll, setUnCliamedRewardAll] = useState({ oldVal: 0, newVal: 0 })
    const [totalDailyReward, setTotalDailyReward] = useState({ oldVal: 0, newVal: 0 })
    const [page, setPage] = useState(0);
    const [userNFT, setUserNFT] = useState<{tokenId: number, uri: string}[]>([]);
    const [selectedNFT, setSelectedNFT] = useState(0);

    useEffect(()=>{
        (async()=>{
            setContract(await setNetworkProvider())
            const _totalStakedAmount = await getTotalStakedAmmount();
            setTotalStakedAmount({oldVal: totalStakedAmount.newVal, newVal: _totalStakedAmount})
        })()
    },[])

    useEffect(() => {
        setBalance({ oldVal: 0, newVal: 0 })
        if (!account) return;
        getBalance();
        getAllowance(account).then((isAllowance) => {
            if (isAllowance > 0) setOpenStakeWindow(true)
            else setOpenStakeWindow(false)
        })
        setPeriod(0);
        getUserUnclaimedRewardAll(account).then(({totalReward})=>{
            setUnCliamedRewardAll({oldVal: unCliamedRewardAll.newVal, newVal: totalReward})
        });
        getUserStakedInfo(account).then(({length, stakedInfo, dailyRewards})=>{
            const val = _.reduce(dailyRewards, (prev, current)=>{
                return Number(prev) + Number(current)
            })
            console.log(val)
            setTotalDailyReward({oldVal: totalDailyReward.newVal, newVal: val / (10 ** 18)})
        })
        getUserNFT(account).then((val: any)=>{
            setUserNFT(val);
            console.log(val);
        })
        // eslint-disable-next-line
    }, [account])

    const getApprove = async () => {
        setLoading(true);
        const res = await approve(account || undefined)
        if (res) setOpenStakeWindow(true)
        setLoading(false);
    }

    const onChangeName = (e: any) => {
        setName(e.target.value);
        setErrorMsg("");
    }

    const onChangeNFTName = (e: any) => {
        setNftName(e.target.value);
        setErrorMsg("");
    }

    const getBalance = async () => {
        const bal = await getUserBalance(account);
        setBalance({ oldVal: balance.newVal, newVal: bal })
    }

    const stake = async() => {
        setLoading(true);
        const _stakingAmount = Number.isNaN(stakingAmount) ? 0 : Number(stakingAmount);
        if(_stakingAmount === 0) {
            setErrorMsg("Amount should be bigger that 0!")
            setLoading(false);
            return;
        }
        if(name === "") {
            setErrorMsg("Please set name of your staking")
            setLoading(false);
            return;
        }
        try{
            const isUnique = await isExistStakingName(name);
            if(isUnique) {
                setErrorMsg("Duplicated name, please name again")
                setLoading(false);
                return;
            }
            await staking(name, duration, _stakingAmount, account);
            (() => {
                if (!account) return;
                contract.events.Deposit({
                    filter: { user: account }, //
                    // fromBlock: 0
                })
                    .on('data', function (event: any) {
                        console.log("evnet trigger", event)
                        getBalance();
                        getUserUnclaimedRewardAll(account).then(({totalReward})=>{
                            setUnCliamedRewardAll({oldVal: unCliamedRewardAll.newVal, newVal: totalReward})
                        });
                        getUserStakedInfo(account).then(({length, stakedInfo, dailyRewards})=>{
                            const val = _.reduce(dailyRewards, (prev, current)=>{
                                return Number(prev) + Number(current)
                            })
                            console.log(val)
                            setTotalDailyReward({oldVal: totalDailyReward.newVal, newVal: val / (10 ** 18)})
                        })
                        getUserNFT(account).then((val: any)=>{
                            setUserNFT(val);
                            console.log(val);
                        })
                    })
                    .on('changed', function (event: any) {
                    })
                    .on('error', console.error);
            })();
            setName("")
            setStakingAmount("")
        } catch(e) {
        } finally {
            setLoading(false);
        }
    }

    const NFTStaking = async() => {
        if(selectedNFT === 0) {
            setErrorMsg("please select your NFT")
            setLoading(false);
            return;
        }
        if(nftName === "") {
            setErrorMsg("Please set name of your staking")
            setLoading(false);
            return;
        }
        
        try{
            const isUnique = await isExistStakingName(nftName);
            if(isUnique) {
                setErrorMsg("Duplicated name, please name again")
                setLoading(false);
                return;
            }
            await StakeNFT(account, nftName, selectedNFT);
            (() => {
                if (!account) return;
                getUserUnclaimedRewardAll(account).then(({totalReward})=>{
                    setUnCliamedRewardAll({oldVal: unCliamedRewardAll.newVal, newVal: totalReward})
                });
                getUserStakedInfo(account).then(({length, stakedInfo, dailyRewards})=>{
                    const val = _.reduce(dailyRewards, (prev, current)=>{
                        return Number(prev) + Number(current)
                    })
                    console.log(val)
                    setTotalDailyReward({oldVal: totalDailyReward.newVal, newVal: val / (10 ** 18)})
                })
                getUserNFT(account).then((val: any)=>{
                    setUserNFT(val);
                    console.log(val);
                })
                getBalance();
                contract.events.DepositNFT({
                    filter: { user: account }, //
                    // fromBlock: 0
                })
                    .on('data', function (event: any) {
                        console.log("evnet trigger", event)
                        
                    })
                    .on('changed', function (event: any) {
                    })
                    .on('error', console.error);
            })();
            setNftName("")
            setSelectedNFT(0)
        } catch(e) {
            console.log(e)
        } finally {
            setLoading(false);
        }
    }

    // React.useEffect(() => {
    //     clearTimeout(timer);
    //     const time = setTimeout(() => {
    //         if (period % 10 === 0) {
    //             getLPPrice(0).then(({ _LPprice, _TVL, _APR, _LeoPrice }) => {
    //                 setLpPrice({ oldVal: lpPrice.newVal, newVal: _LPprice })
    //                 setTVL({ oldVal: TVL.newVal, newVal: _TVL })
    //                 setAPR({ oldVal: APR.newVal, newVal: _APR })
    //                 setLeoPrice({ oldVal: LeoPrice.newVal, newVal: _LeoPrice })
    //             });
    //             if (account) {
    //                 getPendingLEO(0, account).then((reward: number) => {
    //                     setClaimableVal({ oldVal: claimableVal.newVal, newVal: reward / 100000 });
    //                 })
    //                 getUserRemainLockTime(0, account).then((unlockTime: number) => {
    //                     setUnlockTime(Number(unlockTime))
    //                 })
    //                 getStakedAmountAndLockedPeriod(0, account).then(({ _balance, _ratio }) => {
    //                     setBalance({ oldVal: balance.newVal, newVal: _balance })
    //                     setRatio({ oldVal: 2, newVal: 2 })

    //                 })
    //             }
    //         }
    //         if (account && unlockTime > 0) {
    //             setUnlockTime((period) => period - 1);
    //         }
    //         setPeriod((period) => period + 1);
    //     }, 1000);
    //     setTimer(time)
    //     // eslint-disable-next-line
    // }, [period]);

    const onEvnet = async() => {
        setContract(await setNetworkProvider())
        const _totalStakedAmount = await getTotalStakedAmmount();
        setTotalStakedAmount({oldVal: totalStakedAmount.newVal, newVal: _totalStakedAmount})
        if(!account) return;
        getBalance();
        getAllowance(account).then((isAllowance) => {
            if (isAllowance > 0) setOpenStakeWindow(true)
            else setOpenStakeWindow(false)
        })
        setPeriod(0);
        getUserUnclaimedRewardAll(account).then(({totalReward})=>{
            setUnCliamedRewardAll({oldVal: unCliamedRewardAll.newVal, newVal: totalReward})
        });
        getUserStakedInfo(account).then(({length, stakedInfo, dailyRewards})=>{
            const val = _.reduce(dailyRewards, (prev, current)=>{
                return Number(prev) + Number(current)
            })
            console.log(val)
            setTotalDailyReward({oldVal: totalDailyReward.newVal, newVal: val / (10 ** 18)})
        })
        getUserNFT(account).then((val: any)=>{
            setUserNFT(val);
        })
    }

    const onClickNFT = (id: number) => () => {
        console.log(id)
        if(selectedNFT === id ) id = 0;
        setSelectedNFT(id)
    }

    return <Box
        display="flex"
        flexDirection="column"
        width="100%"
        zIndex="0"
        height={"-webkit-fill-available"}
    >
        <Topbar mode="staking" onChangePage={(page: number)=>{setPage(page)}} />
        <Box display="flex" style={{ overflowY: 'auto', overflowX: 'hidden' }} height={"-webkit-fill-available"}>
            {/* <Sidebar /> */}
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="flex-start"
                alignItems="center"
                width="90%"
                m="auto"
                zIndex="5"
                mt="20px"
            >
                <Box display="flex" mt="10px" minHeight="50px" justifyContent={"center"} alignItems="center" flexDirection="column">
                    {errorMsg !== "" && <Alert severity="warning" sx={{ width: '100%', mb: '0px' }} onClose={() => {setErrorMsg("")}}>
                        <Box display="flex" justifyContent={"center"} alignItems="center">
                            {errorMsg}
                        </Box>
                    </Alert>}
                </Box>
                <Box display="flex" justifyContent={"center"} alignItems="center" mt="30px" mb="30px" sx={{ flexDirection: { md: 'row', sm: 'column', xs: 'column' } }}>
                    <Paper p="15px" mr="20px" sx={{ mr: { md: '20px', sm: '0', xs: '0' }, mb: { md: '0', sm: '30px', xs: '30px' }, width: { md: 'auto', sm: '300px', xs: '300px' } }}>
                        <Box fontSize="16px" lineHeight="22px">Avaliable Amount</Box>
                        <Box fontSize="24px" fontWeight={"500"} color={ratio.newVal > 1 ? "#FCF686" : "#6EF47A"}>
                            <CountUp start={unCliamedRewardAll.oldVal} decimal="." decimals={2} end={unCliamedRewardAll.newVal}
                                useEasing={true} duration={2} />
                        </Box>
                    </Paper>
                    <Paper p="15px" mr="20px" sx={{ mr: { md: '20px', sm: '0', xs: '0' }, mb: { md: '0', sm: '30px', xs: '30px' }, width: { md: 'auto', sm: '300px', xs: '300px' } }}>
                        <Box fontSize="16px" lineHeight="22px">Totoal Staked</Box>
                        <Box fontSize="24px" fontWeight={"500"} color={ratio.newVal > 1 ? "#FCF686" : "#6EF47A"}>
                            <CountUp start={totalStakedAmount.oldVal} decimal="." decimals={2} end={totalStakedAmount.newVal}
                                useEasing={true} duration={2} />
                        </Box>
                    </Paper>
                    <Paper p="15px" mr="20px" sx={{ mr: { md: '20px', sm: '0', xs: '0' }, mb: { md: '0', sm: '30px', xs: '30px' }, width: { md: 'auto', sm: '300px', xs: '300px' } }}>
                        <Box fontSize="16px" lineHeight="22px">Estimate Daily Income</Box>
                        <Box fontSize="24px" fontWeight={"500"} color="#FCF686">
                            <CountUp start={totalDailyReward.oldVal} decimal="." decimals={2} end={totalDailyReward.newVal}
                                useEasing={true} duration={1.2} />
                        </Box>
                    </Paper>
                    
                </Box>

                {page === 0 ? <Box display="flex" mb="30px" mt="100px" justifyContent={"center"} alignItems="center" width="1000px" sx={{ flexDirection: { md: 'row', sm: 'column-reverse', xs: 'column-reverse' } }}>
                    <Paper p="25px" borderRadius={'8px'} sx={{ mr: { md: '20px', sm: '0', xs: '0' }, mb: { md: '0', sm: '50px', xs: '50px' }, width: { md: 'auto', sm: '300px', xs: '300px' } }} flex={1} position="relative">
                        <Box fontSize="24px" lineHeight="26px" mb="20px">CheemsX STAKING</Box>
                        <Box my="20px"><CustomField value={name} onChange={onChangeName} placeholder="staking name" /></Box>
                        <StakingInputComponent
                            onChangeValue={(value: string) => {setStakingAmount(value); setErrorMsg("")}}
                            onChangeDuration={(duration: number)=>{setDuration(duration)}}
                        />
                        <Box fontSize="12px" lineHeight="26px" fontWeight="500" mb="30px" mt="10px" textAlign="right" width="100%">
                            <span>Your balance is  &nbsp;
                                <CountUp start={balance.oldVal} end={balance.newVal}
                                    useEasing={true} duration={2} />
                            </span>
                        </Box>
                        {!openStakeWindow ?
                            <Button
                                loading={isLoading}
                                className={cx("bg_btn", {
                                })}
                                text="Approve"
                                // icon={<MdSwapCalls />}
                                onClick={getApprove}
                            /> 
                            :
                            <Button
                                loading={isLoading}
                                className={cx("bg_btn", {
                                })}
                                text="Staking"
                                // icon={<MdSwapCalls />}
                                onClick={stake}
                            />
                        }
                    </Paper>
                    <Paper p="25px" borderRadius={'8px'} sx={{ mr: { md: '20px', sm: '0', xs: '0' }, mb: { md: '0', sm: '50px', xs: '50px' }, width: { md: 'auto', sm: '300px', xs: '300px' } }} flex={1} position="relative">
                        <Box mb="10px" width="50%"><CustomField value={nftName} onChange={onChangeNFTName} placeholder="staking name" /></Box>
                        <Box display="flex" width="100%" mb="20px" minHeight={'200px'} maxWidth={'400px'} style={{overflowX: 'auto'}}>
                            {
                                _.map(userNFT, (each, key)=>{
                                    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
                                    return <Box display={'flex'} position="relative" p="20px" onClick={onClickNFT(each.tokenId)}>
                                        <Box 
                                            className="card-view-container"
                                            component="img" 
                                            src={each.uri} 
                                            width="150px"
                                            mr="20px"
                                            height="150px" 
                                            key={key}
                                            borderRadius={'8px'}
                                        />
                                        <Checkbox 
                                            {...label} 
                                            style={{position: 'absolute', top: '15px', left: '15px'}} 
                                            color="primary" 
                                            sx={{
                                                'svg':{
                                                    fill: 'white'
                                                }
                                            }}
                                            checked={selectedNFT === each.tokenId}
                                        />
                                    </Box>
                                })
                            }
                        </Box>
                        
                        <Button
                            loading={isLoading}
                            className={cx("bg_btn", {
                            })}
                            text="NFTStaking"
                            // icon={<MdSwapCalls />}
                            onClick={NFTStaking}
                        />
                    </Paper>
                </Box>
                :
                <UserInfomationComponent onEvent={onEvnet} />
                }
            </Box>

        </Box>
    </Box>
}
export default Staking;