/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-empty-pattern */
import _ from "lodash";
import Web3 from "web3";

import ERC20ABI from "../contracts/ERC20ABI.json";
import LockupAPI from "../contracts/Lockup.json"
import ERC721ABI from "../contracts/ERC721.json"
import { numberWithCommas } from "../utils/calculation";

declare let window: any;

const Hour = 3600;
const Day = 24 * Hour;
const Year = 365 * Day;

export interface StakedInfo{
    duration: number
    amount: number
    stakedTime: number
    lastClaimed: number
    name: string
    NFTId: number
    StakeNFTId: number
}

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
    if (!name) return true;
    const Lockup = await setNetworkProvider();
    return await Lockup.methods.isExistStakeId(name).call();
}

export const staking = async(name: string, duration: number, amount: number, account: string) => {
    const Lockup = await setNetworkProvider();
    Lockup.methods.stake(name, duration, converNumber2Str(amount)).send({from : account});
}

export const getUserUnclaimedRewardAll = async(account: string) => {
    const Lockup = await setNetworkProvider();
    const res = await Lockup.methods.unclaimedAllRewards(account, 0, true).call();
    return {totalReward: res[0] / Math.pow(10, 18), rewardArr: res[1]};
}

export const getUserUnclaimRewardByName = async(name: string) => {
    const Lockup = await setNetworkProvider();
    const res = await Lockup.methods.unClaimedReward(name).call();
    return res[1] ? res[0] : null;
}

export const getTotalStakedAmmount = async() => {
    const Lockup = await setNetworkProvider();
    return await Lockup.methods.totalStaked().call() / Math.pow(10, 18);
}

export const getUserStakedInfo = async(account: string) => {
    const Lockup = await setNetworkProvider();
    Lockup.methods.getUserStakedInfo(account).call();
    const res = await Lockup.methods.getUserStakedInfo(account).call();
    console.log(res)
    let stakedInfo: StakedInfo[] = [];
    _.each(res.info, item=>{
        let tmp:StakedInfo = {} as StakedInfo;
        tmp.duration = item.duration;
        tmp.amount = item.amount;
        tmp.stakedTime = item.stakedTime;
        tmp.lastClaimed = item.lastClaimed;
        tmp.name = item.name;
        tmp.NFTId = item.NFTId;
        tmp.StakeNFTId = item.NFTStakingId;
        stakedInfo.push(tmp)
    })
    return {length:res[0], stakedInfo, dailyRewards: res.dailyReward}
}

export const getTime = async() => {
    const Lockup = await setNetworkProvider();
    return Lockup.methods.getTime().call();
}

export const cliam = async(nameList: string[], account: string) => {
    const Lockup = await setNetworkProvider();
    Lockup.methods.claimMulti(nameList).send({from : account})
}

export const compound = async(nameList: string[], account: string) => {
    const Lockup = await setNetworkProvider();
    Lockup.methods.compoundMulti(nameList).send({from : account})
}

export const withdraw = async(nameList: string, account: string) => {
    const Lockup = await setNetworkProvider();
    Lockup.methods.unStake(nameList).send({from : account})
}

export const withdrawAll = async(account: string) => {
    const Lockup = await setNetworkProvider();
    Lockup.methods.unStakeAll().send({from : account})
}

export const isWidthdraw = async(name: string) => {
    const Lockup = await setNetworkProvider();
    return Lockup.methods.isWithdrawable(name).call();
}

export const isClaimable = async(name: string) => {
    const Lockup = await setNetworkProvider();
    return Lockup.methods.isClaimable(name).call();
}

export const getTokenURI = async(id: number) => {
    const Lockup = await setNetworkProvider();
    const nftAddr = await Lockup.methods.NFToken().call();
    const NFTContract = await new window.web3.eth.Contract(ERC721ABI, nftAddr);
    return await NFTContract.methods.tokenURI(id).call();
}

export const getUserNFT =async (address:string) => {
    const Lockup = await setNetworkProvider();
    const StakingNFTAddr = await Lockup.methods.StakeNFT().call();
    const NFTContract = await new window.web3.eth.Contract(ERC721ABI, StakingNFTAddr);
    const tokenIds: number[] = await NFTContract.methods.getUserInfo(address).call();
    const tokenInfo: {tokenId: number, uri: string}[] = [];
    for(let i = 0; i < tokenIds.length; i++) {
        const uri = await NFTContract.methods.tokenURI(tokenIds[i]).call();
        const tmp: {tokenId: number, uri: string} = {} as any;
        _.set(tmp, "tokenId", tokenIds[i]);
        _.set(tmp, "uri", uri);
        tokenInfo.push(tmp)
    }
    return tokenInfo;
}

export const StakeNFT = async (address: string, name: string, tokenId: number) => {
    const Lockup = await setNetworkProvider();
    const StakingNFTAddr = await Lockup.methods.StakeNFT().call();
    const NFTContract = await new window.web3.eth.Contract(ERC721ABI, StakingNFTAddr);
    await NFTContract.methods.approve(process.env.REACT_APP_CONTRACT_ADDR, tokenId).send({from : address});
    await Lockup.methods.stakeNFT(name, tokenId).send({from : address})
}

export const UnStakeNFT = async (address: string, name: string) => {
    const Lockup = await setNetworkProvider();
    await Lockup.methods.unStakeNFT(name).send({from : address})
}

export const getStakedTokenURI = async(id: number) => {
    const Lockup = await setNetworkProvider();
    const nftAddr = await Lockup.methods.StakeNFT().call();
    const NFTContract = await new window.web3.eth.Contract(ERC721ABI, nftAddr);
    return await NFTContract.methods.tokenURI(id).call();
}

export const isWhiteList = async(account: string) => {
    const Lockup = await setNetworkProvider();
    return await Lockup.methods.whiteList(account).call();
}

export const isBlackList = async(account: string) => {
    const Lockup = await setNetworkProvider();
    return await Lockup.methods.blackList(account).call();
}