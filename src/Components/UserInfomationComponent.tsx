import { Box } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import Topbar from "../Components/Topbar";
import {
    StakedInfo,
    isExistStakingName,
    staking,
    getUserBalance,
    setNetworkProvider,
    getTime,
    getTotalStakedAmmount,
    getUserStakedInfo,
    getUserUnclaimRewardByName,
    cliam,
    compound,
    withdraw,
    withdrawAll,
    isClaimable,
    isWidthdraw,
    getTokenURI,
    getStakedTokenURI,
    UnStakeNFT,
} from "../hooks/useTokenInfo";
import useAuth from "../hooks/useAuth";
import Paper from "../Components/Paper";
import CountUp from 'react-countup';
import useMobile from "../hooks/useMobile";
import { CustomField } from "../Components/Global";
import StakingInputComponent from "../Components/StakingInputComponent";
import { Button } from "../Components/Button";
import cx from "classnames";
import _ from "lodash";
import { DataGrid, GridColDef, GridValueGetterParams, GridSelectionModel, GridCallbackDetails } from '@mui/x-data-grid';
import { Alert } from "../Pages/Staking";
import ImagePopup from "./ImagePopup";
// import Bottombar from "../Components/Bottombar";

const UserInfomationComponent: FC<{onEvent: ()=>void}> = (props: {onEvent: ()=>void}) => {

    const [name, setName] = useState("");
    const [stakingAmount, setStakingAmount] = useState("")
    const [duration, setDuration] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [contract, setContract] = useState<any>({})
    const { account } = useAuth()
    const { isMobile } = useMobile()
    const [balance, setBalance] = useState({ oldVal: 0, newVal: 0 });
    const [totalStakedAmount, setTotalStakedAmount] = useState({ oldVal: 0, newVal: 0 })
    const [stakeInfo, setStakeInfo] = useState<(StakedInfo & { unClaimed: number | null } & { dailyReward: number } & { id: number })[]>([])
    const [curTime, setCurTime] = useState(0);
    const [selectedIds, setSelectedIds] = useState<any[]>([]);
    const [isCliamable, setIsCliamable] = useState(true)
    const [isCompoundable, setIsCompoundable] = useState(true)
    const [open, setOpen] = useState(false);
    const [uri, setUri] = useState("")

    useEffect(() => {
        (async () => {
            setContract(await setNetworkProvider())
            const _totalStakedAmount = await getTotalStakedAmmount();
            setTotalStakedAmount({ oldVal: totalStakedAmount.newVal, newVal: _totalStakedAmount })
            setCurTime(await getTime());
        })()
    }, [])

    useEffect(() => {
        setBalance({ oldVal: 0, newVal: 0 })
        if (!account) return;
        getBalance();
        _getUserStakedInfo(account);

        // eslint-disable-next-line
    }, [account])

    const _getUserStakedInfo = (account: string) => {
        getUserStakedInfo(account).then(async ({ length, stakedInfo, dailyRewards }) => {
            const info: (StakedInfo & { unClaimed: number | null } & { dailyReward: number } & { id: number })[] = [];
            _.map(stakedInfo, async (each, index) => {
                const uncliam = await getUserUnclaimRewardByName(each.name);
                let tmp: (StakedInfo & { unClaimed: number | null } & { dailyReward: number } & { id: number })
                tmp = {
                    ...each,
                    ...{ dailyReward: dailyRewards[index] },
                    ...{ unClaimed: uncliam },
                    ...{ id: index + 1 },
                };
                info.push(tmp);
                if (info.length === stakedInfo.length) {
                    setStakeInfo(info)
                }
            })
        })
    }

    const getBalance = async () => {
        const bal = await getUserBalance(account);
        setBalance({ oldVal: balance.newVal, newVal: bal })
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

    const onEvnet = () => {
        if (!account) return;
        contract.events.allEvents({
            filter: { user: account, pid: 0 }, // Using an array means OR: e.g. 20 or 23
            // fromBlock: 0
        })
            .on('data', function (event: any) {
                console.log("evnet trigger", event)
            })
            .on('changed', function (event: any) {
            })
            .on('error', console.error);
    }

    const onChangeTable = async (selectionModel: GridSelectionModel, details: GridCallbackDetails) => {
        setSelectedIds(selectionModel);
        for (let i = 0; i < selectionModel.length; i++) {
            const v: any = _.find(stakeInfo, { id: selectionModel[i] });
            const claimable = await isClaimable(v.name)
            if (!claimable) {
                setIsCliamable(false);
                return;
            }
            setIsCliamable(true);
        }
        for (let i = 0; i < selectionModel.length; i++) {
            const v: any = _.find(stakeInfo, { id: selectionModel[i] });
            if (v.StakeNFTId) {
                setIsCompoundable(false);
                return;
            }
            setIsCompoundable(true);
        }
    }

    const isSelected = () => {
        if (selectedIds.length) return true;
        return false;
    }

    const getClaim = () => {
        if (!isSelected()) return;
        const nameList: string[] = [];
        _.map(selectedIds, each => {
            const v: any = _.find(stakeInfo, { id: each })
            nameList.push(v.name)
        })
        cliam(nameList, account);
        (() => {
            if (!account) return;
            contract.events.ClaimReward({
                filter: { user: account }, //
                // fromBlock: 0
            })
                .on('data', function (event: any) {
                    console.log("evnet trigger", event)
                    getBalance();
                    _getUserStakedInfo(account);
                    props.onEvent()
                })
                .on('changed', function (event: any) {
                })
                .on('error', console.error);
        })();
    }

    const getCompound = () => {
        if (!isSelected()) return;
        const nameList: string[] = [];
        _.map(selectedIds, each => {
            const v: any = _.find(stakeInfo, { id: each })
            nameList.push(v.name)
        })
        compound(nameList, account);
        (() => {
            if (!account) return;
            contract.events.Compound({
                filter: { user: account }, //
                // fromBlock: 0
            })
                .on('data', function (event: any) {
                    console.log("evnet trigger", event)
                    getBalance();
                    _getUserStakedInfo(account);
                    props.onEvent()
                })
                .on('changed', function (event: any) {
                })
                .on('error', console.error);
        })();
    }

    const _withrawAll = () => {
        withdrawAll(account);
        (() => {
            if (!account) return;
            contract.events.Withdraw({
                filter: { user: account }, //
                // fromBlock: 0
            })
                .on('data', function (event: any) {
                    console.log("evnet trigger", event)
                    getBalance();
                    _getUserStakedInfo(account);
                    props.onEvent()
                })
                .on('changed', function (event: any) {
                })
                .on('error', console.error);
        })();
    }

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70, hideable: false },
        { field: 'name', headerName: 'Name', width: 150, hideable: false },
        {
            field: 'amount',
            headerName: 'Amount',
            align: 'left',
            width: 130,
            renderCell: (params: any) => {
                const onClick = async (e: any) => {
                    e.stopPropagation(); // don't select this row after clicking
                    console.log(params.row.NFTId)
                    const uri = await getStakedTokenURI(params.row.StakeNFTId)
                    console.log(uri)
                    setUri(uri)
                    setOpen(true)
                };
                return (Number(params.row.StakeNFTId) === 0 ? 
                    <Box>{Math.round(params.row.amount / 10 ** 18 * 100) / 100}</Box>
                    :
                    <Box width="100%">
                        {console.log(params.row.StakeNFTId)}
                        <Button
                            className={cx("bg_btn", {
                            })}
                            text='StakedNFT'
                            // icon={<MdSwapCalls />}
                            onClick={onClick}
                        />
                </Box>)
            },
            hideable: false,
        },
        {
            field: 'stakedTime',
            headerName: 'Staked Time',
            type: 'date',
            width: 180,
            valueGetter: (params: GridValueGetterParams) => {
                const delta = curTime - params.row.stakedTime;
                const stakedTime = Date.now() - delta * 1000
                return new Date(stakedTime).toLocaleString('en', { timeZone: 'EST', hour12: false }).slice(0, 15);
            },
            hideable: false,
        },
        {
            field: 'lastClaimed',
            headerName: 'Last Claim',
            width: 200,
            valueGetter: (params: GridValueGetterParams) => {
                const delta = curTime - params.row.lastClaimed;
                return (Math.round(delta / 3600 / 24) === 0 ? "" : `${Math.round(delta / 3600 / 24)} days `) + (Math.round(delta / 3600) % 24 === 0 ? "" : `${Math.round(delta / 3600) % 24} hours`) + `${Math.round(delta / 60) % 60} min ago`
            },
            hideable: false,
        },
        {
            field: 'unClaimed',
            headerName: 'Reward',
            width: 130,
            hideable: false,
            valueGetter: (params: GridValueGetterParams) => {

                return Math.round(params.row.unClaimed / 10 ** 18 * 100) / 100
            },
        },
        {
            field: 'dailyReward',
            headerName: 'Daily APR',
            //   description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 130,
            valueGetter: (params: GridValueGetterParams) => {
                return `${Math.round((params.row.dailyReward / 10 ** 18) / (params.row.amount / 10 ** 18) * 100 * 100) / 100}%`
            },
            hideable: false,
        },
        {
            field: 'duration',
            headerName: 'Lock Period',
            width: 130,
            valueGetter: (params: GridValueGetterParams) => {
                if (Number(params.row.duration) < 0) {
                    return 'Irreversible Lock'
                } else if (Number(params.row.duration) === 0) {
                    return 'No Lock'
                } else {
                    return `${params.row.duration} days`
                }
            },
            hideable: false,
        },
        {
            field: 'NFTId',
            headerName: 'NFT Information',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 100,
            hideable: false,
            renderCell: (params: any) => {
                const onClick = async (e: any) => {
                    e.stopPropagation(); // don't select this row after clicking
                    const uri = await getTokenURI(params.row.NFTId)
                    console.log(uri)
                    setUri(uri)
                    setOpen(true)
                };

                return (<Box width="100%">{Number(params.row.NFTId) !== 0 && <Button
                    className={cx("bg_btn", {
                    })}
                    text='ViewNFT'
                    // icon={<MdSwapCalls />}
                    onClick={onClick}
                />}</Box>)
            }
        },
        {
            field: 'unstake',
            headerName: 'Unstake',
            sortable: false,
            width: 100,
            hideable: false,
            renderCell: (params: any) => {
                const onClick = async(e: any) => {
                    e.stopPropagation(); // don't select this row after clicking
                    if (!await isWidthdraw(params.row.name)) {
                        setErrorMsg("You can't withdraw right now. Lock period is not expired")
                        return;
                    }
                    if(Number(params.row.StakeNFTId) === 0)
                        withdraw(params.row.name, account);
                    else UnStakeNFT(account, params.row.name);
                    (() => {
                        if (!account) return;
                        contract.events.Withdraw({
                            filter: { user: account }, //
                            // fromBlock: 0
                        })
                            .on('data', function (event: any) {
                                console.log("evnet trigger", event)
                                getBalance();
                                _getUserStakedInfo(account);
                                props.onEvent()
                            })
                            .on('changed', function (event: any) {
                            })
                            .on('error', console.error);
                    })();
                };

                return (<Box width="100%">{Number(params.row.duration) >= 0 && <Button
                    className={cx("bg_btn", {
                    })}
                    text='Withdraw'
                    // icon={<MdSwapCalls />}
                    onClick={onClick}
                />}</Box>)
            }
        },
    ];

    return <Box height={500} width="100%" borderRadius={'8px'} >
        <Box display="flex" mt="10px" minHeight="50px" justifyContent={"center"} alignItems="center" flexDirection="column">
            {errorMsg !== "" && <Alert severity="warning" sx={{ width: '100%', mb: '0px' }} onClose={() => { setErrorMsg("") }}>
                <Box display="flex" justifyContent={"center"} alignItems="center">
                    {errorMsg}
                </Box>
            </Alert>}
        </Box>
        <Box display="flex" width={'100%'} justifyContent="space-between" my="20px">
            <Box display="flex">
                <Button
                    loading={isLoading}
                    className={cx("bg_btn", {
                        zig_disabled: !isCliamable || !isSelected()
                    })}
                    text="Claim"
                    // icon={<MdSwapCalls />}
                    style={{ marginRight: '20px' }}
                    onClick={getClaim}
                />
                <Button
                    loading={isLoading}
                    className={cx("bg_btn", {
                        zig_disabled: !isCliamable || !isSelected() || !isCompoundable
                    })}
                    text="Compund"
                    // icon={<MdSwapCalls />}
                    onClick={getCompound}
                    style={{ marginRight: '20px' }}
                />
                {/* <Button
                    loading={isLoading}
                    className={cx("bg_btn", {
                        zig_disabled: !isCliamable
                    })}
                    text="NewStake"
                    // icon={<MdSwapCalls />}
                    onClick={stake}
                    style={{ marginRight: '20px' }}
                /> */}
            </Box>
            <Box>
                {/* <Button
                    loading={isLoading}
                    className={cx("bg_btn", {
                    })}
                    text="WithdrawAll"
                    // icon={<MdSwapCalls />}
                    onClick={_withrawAll}
                /> */}
            </Box>
        </Box>

        <DataGrid
            rows={stakeInfo}
            columns={columns}
            rowsPerPageOptions={[5]}
            checkboxSelection
            onSelectionModelChange={onChangeTable}
            sx={{
                '.MuiDataGrid-columnSeparator': {
                    display: 'none',
                },
                '&.MuiDataGrid-root': {
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white'
                },
                '.MuiSvgIcon-root': {
                    color: 'white'
                },
                '.MuiDataGrid-cell': {
                    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                },
                '.MuiDataGrid-columnHeaders': {
                    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                },
                '.MuiTablePagination-displayedRows': {
                    color: 'white'
                }
            }}
        />
        <ImagePopup isOpen={open} onClose={()=>setOpen(false)} uri={uri} />
    </Box>
}
export default UserInfomationComponent;