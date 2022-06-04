/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-empty-pattern */
import Web3 from "web3";

import ERC20ABI from "../contracts/ERC20ABI.json";
import LockupAPI from "../contracts/Lockup.json"

declare let window: any;

const Hour = 3600;
const Day = 24 * Hour;
const Year = 365 * Day;

export const setNetworkProvider = async () => {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
    }
    return await new window.web3.eth.Contract(LockupAPI, process.env.REACT_APP_CONTRACT_ADDR);
}

const converNumber2Str = (amount: number) => {
    return '0x' + (Math.round(amount * Math.pow(10, 18))).toString(16)
}

export const getUserBalance = async (account: string) => {
    if(!account) return 0;
    const Lockup = await setNetworkProvider();
    const stakingTokenAddress = await Lockup.methods.stakingToken().call();
    const Cheemsx = await new window.web3.eth.Contract(ERC20ABI, stakingTokenAddress);
    const Decimal = await Cheemsx.methods.decimals().call();
    const balance = await Cheemsx.methods.balanceOf(account).call();
    return balance / Math.pow(10, Decimal);
}

export const getAllowance = async (account: string) => {
    const Lockup = await setNetworkProvider();
    const stakingTokenAddress = await Lockup.methods.stakingToken().call();
    const Cheemsx = await new window.web3.eth.Contract(ERC20ABI, stakingTokenAddress);
    return await Cheemsx.methods.allowance(account, process.env.REACT_APP_CONTRACT_ADDR).call();
}

export const approve = async (account?: string) => {
    if(!account) return;
    const Lockup = await setNetworkProvider();
    const stakingTokenAddress = await Lockup.methods.stakingToken().call();
    const Cheemsx = await new window.web3.eth.Contract(ERC20ABI, stakingTokenAddress);
    return await Cheemsx.methods.approve(process.env.REACT_APP_CONTRACT_ADDR, '0x99999999999999999999999999999999999999').send({ from: account });
}

export const isExistStakingName = async(name: string) => {
    if (!name) return false;
    const Lockup = await setNetworkProvider();
    return await Lockup.methods.isExistStakeId(name).call();
}

export const staking = async(name: string, duration: number, amount: number, account: string) => {
    const Lockup = await setNetworkProvider();
    console.log("===================",converNumber2Str(amount))
    Lockup.methods.stake(name, duration, converNumber2Str(amount)).send({from : account});
}









// export enum ABI { StakingABI, LPtokenABI, PresaleABI, XLeoABI }

// const getPoolTokenAddr = async (_pid: number) => {
//     if (window.ethereum) {
//         window.web3 = new Web3(window.ethereum);
//     }
//     const contract = await new window.web3.eth.Contract(ContractABI, process.env.REACT_APP_CONTRACT_ADDR);
//     const poolInfo = await contract.methods.poolInfo(_pid).call()
//     return poolInfo.lpToken;
// }

// export const getContract = async (abi: number) => {
//     if (window.ethereum) {
//         window.web3 = new Web3(window.ethereum);
//     }
//     switch (abi) {
//         case ABI.StakingABI:
//             return await new window.web3.eth.Contract(ContractABI, process.env.REACT_APP_CONTRACT_ADDR);
//         case ABI.LPtokenABI:
//             return await new window.web3.eth.Contract(LPtokenABI, process.env.REACT_APP_LEO_CONTRACT_ADDR);
//         case ABI.PresaleABI:
//             return await new window.web3.eth.Contract(PresaleABI, process.env.REACT_APP_PRESALE_CONTRACT_ADDR);
//         case ABI.XLeoABI:
//             return await new window.web3.eth.Contract(xLEOABI, process.env.REACT_APP_XLEO_CONTRACT_ADDR);
//         default: return;
//     }
// }

// export const getUserRemainLockTime = async (_pid: number, account: string) => {

//     if (window.ethereum) {
//         window.web3 = new Web3(window.ethereum);
//     }
//     const contract = await new window.web3.eth.Contract(ContractABI, process.env.REACT_APP_CONTRACT_ADDR);
//     const remaining = await contract.methods.getRemainingLockedTime(_pid, account).call()
//     return remaining;
// }

// export const getPendingLEO = async (_pid: number, account: string) => {
//     if (window.ethereum) {
//         window.web3 = new Web3(window.ethereum);
//     }
//     const contract = await new window.web3.eth.Contract(ContractABI, process.env.REACT_APP_CONTRACT_ADDR);
//     return await contract.methods.pendingLEO(_pid, account).call();
// }

// export const deposit = async (_pid: number, amount: number, lockTime: number, account: string) => {

//     if (window.ethereum) {
//         window.web3 = new Web3(window.ethereum);
//     }

//     const tokencontract = await new window.web3.eth.Contract(ERC20ABI, await getPoolTokenAddr(_pid));
//     const Decimal = await tokencontract.methods.decimals().call();
//     // await tokencontract.methods.approve(process.env.REACT_APP_CONTRACT_ADDR, '0x' + (Math.round(amount * Math.pow(10, Decimal))).toString(16)).send({ from: account });
//     const contract = await new window.web3.eth.Contract(ContractABI, process.env.REACT_APP_CONTRACT_ADDR);
//     contract.methods.deposit(_pid, '0x' + (Math.round(amount * Math.pow(10, Decimal))).toString(16), lockTime).send({ from: account });
// }

// export const getStakedAmountAndLockedPeriod = async (_pid: number, account: string) => {
//     if (window.ethereum) {
//         window.web3 = new Web3(window.ethereum);
//     }
//     const contract = await new window.web3.eth.Contract(ContractABI, process.env.REACT_APP_CONTRACT_ADDR);
//     const userInfo = await contract.methods.userInfo(_pid, account).call()
//     const tokencontract = await new window.web3.eth.Contract(ERC20ABI, await getPoolTokenAddr(_pid));
//     const Decimal = await tokencontract.methods.decimals().call();

//     return { _balance: userInfo.amount / Math.pow(10, Decimal), lockTime: userInfo.unlockTime, _ratio: userInfo.amount !== 0 ? userInfo.userPoint / userInfo.amount : 1 };
// }

// export const withdraw = async (_pid: number, amount: number, account: string) => {

//     if (window.ethereum) {
//         window.web3 = new Web3(window.ethereum);
//     }
//     const tokencontract = await new window.web3.eth.Contract(ERC20ABI, await getPoolTokenAddr(_pid));
//     const Decimal = await tokencontract.methods.decimals().call();
//     const contract = await new window.web3.eth.Contract(ContractABI, process.env.REACT_APP_CONTRACT_ADDR);
//     contract.methods.withdraw(_pid, '0x' + (Math.round(amount * Math.pow(10, Decimal))).toString(16)).send({ from: account });
//     return contract;
// }

// export const getTotalContributed = async () => {
//     if (window.ethereum) {
//         window.web3 = new Web3(window.ethereum);
//     }
//     const presaleContract = await new window.web3.eth.Contract(PresaleABI, process.env.REACT_APP_PRESALE_CONTRACT_ADDR)
//     const totalContributed = await presaleContract.methods.totalContributed().call();
//     return totalContributed;
// }

// export const claimLEO = async (account: string) => {
//     if (window.ethereum) {
//         window.web3 = new Web3(window.ethereum);
//     }
//     const presaleContract = await new window.web3.eth.Contract(PresaleABI, process.env.REACT_APP_PRESALE_CONTRACT_ADDR)
//     await presaleContract.methods.claimLEO().send({ from: account });
// }

// export const getWAVAXAmount = async (account: string) => {
//     if (window.ethereum) {
//         window.web3 = new Web3(window.ethereum);
//     }
//     const WAVAX = await new window.web3.eth.Contract(ERC20ABI, "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7");
//     const Decimal = await WAVAX.methods.decimals().call();
//     const balance = await WAVAX.methods.balanceOf(account).call()
//     return { balance: balance / Math.pow(10, Decimal) };
// }

// export const getStakedAmountInPresale = async (account: string) => {
//     if (window.ethereum) {
//         window.web3 = new Web3(window.ethereum);
//     }
//     const presaleContract = await new window.web3.eth.Contract(PresaleABI, process.env.REACT_APP_PRESALE_CONTRACT_ADDR)
//     const userInfo = await presaleContract.methods.userInfo(account).call()
//     const tokencontract = await new window.web3.eth.Contract(ERC20ABI, "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7");
//     const Decimal = await tokencontract.methods.decimals().call();
//     return { _balance: userInfo.amount / Math.pow(10, Decimal) };
// }

// export const depositPresale = async (amount: number, account: string) => {
//     if (window.ethereum) {
//         window.web3 = new Web3(window.ethereum);
//     }
//     const presaleContract = await new window.web3.eth.Contract(PresaleABI, process.env.REACT_APP_PRESALE_CONTRACT_ADDR)
//     const tokencontract = await new window.web3.eth.Contract(ERC20ABI, "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7");
//     const Decimal = await tokencontract.methods.decimals().call();
//     await presaleContract.methods.deposit('0x' + (Math.round(amount * Math.pow(10, Decimal))).toString(16)).send({ from: account });
// }

// export const getAllowanceInPresale = async (account: string) => {
//     if (window.ethereum) {
//         window.web3 = new Web3(window.ethereum);
//     }

//     const WAVAXContract = await new window.web3.eth.Contract(ERC20ABI, "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7");
//     return await WAVAXContract.methods.allowance(account, process.env.REACT_APP_PRESALE_CONTRACT_ADDR).call();
// }

// export const getPendingLEOInPresale = async (account: string) => {
//     if (window.ethereum) {
//         window.web3 = new Web3(window.ethereum);
//     }
//     const presaleContract = await new window.web3.eth.Contract(PresaleABI, process.env.REACT_APP_PRESALE_CONTRACT_ADDR)
//     return await presaleContract.methods.getPendingLEO(account).call();
// }

// export const approveInPresale = async (account?: string) => {
//     if (!account) return;
//     if (window.ethereum) {
//         window.web3 = new Web3(window.ethereum);
//     }
//     const tokencontract = await new window.web3.eth.Contract(ERC20ABI, "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7");
//     return await tokencontract.methods.approve(process.env.REACT_APP_PRESALE_CONTRACT_ADDR, '0x99999999999999999999999999999').send({ from: account });
// }

// export const checkWhiteList = async (address: string) => {
//     if (window.ethereum) {
//         window.web3 = new Web3(window.ethereum);
//     }
//     const presaleContract = await new window.web3.eth.Contract(PresaleABI, process.env.REACT_APP_PRESALE_CONTRACT_ADDR)
//     return await presaleContract.methods.Whitelist(address).call()
// }

// export const checkClaimable = async () => {
//     if (window.ethereum) {
//         window.web3 = new Web3(window.ethereum);
//     }
//     const presaleContract = await new window.web3.eth.Contract(PresaleABI, process.env.REACT_APP_PRESALE_CONTRACT_ADDR)
//     return await presaleContract.methods.claimable().call()
// }

// export const getRemainAllocation = async () => {
//     if (window.ethereum) {
//         window.web3 = new Web3(window.ethereum);
//     }
//     const presaleContract = await new window.web3.eth.Contract(PresaleABI, process.env.REACT_APP_PRESALE_CONTRACT_ADDR)
//     return await presaleContract.methods.remainAllocation().call()
// }