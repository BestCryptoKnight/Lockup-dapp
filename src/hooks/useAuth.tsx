import React,{ useMemo, useState } from 'react';
import Web3 from 'web3';
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";

export const FTM_MAIN_ID = 250;
export const AVAX_MAIN_ID = 43114;
export const KOVAN_TEST_ID = 42;


// declare let window: any;

interface ConnectInfo {
  chainId: string;
}

interface UserAuthProps{
  account: string;
  login: ()=>Promise<void>
  logout: () => void
}

const defaultVal:UserAuthProps = {
  account: "",
  login: async()=>{},
  logout: () => {}
}

export const UserAuthContext = React.createContext<UserAuthProps>(defaultVal)

export default function useAuth() {
  return React.useContext(UserAuthContext);
}

interface UserAuthProviderProps {
  children: React.ReactNode;
} 

export function UserAuthProvider({ children }: UserAuthProviderProps): JSX.Element {
  const [web3Modal, setWeb3Modal] = useState<Web3Modal>()
  const [account, setAccount] = useState("")

  useMemo(() => {
    if (window.ethereum) {
      window.ethereum.on('networkChanged', () => {
        const metamaskId = window.ethereum.chainId;
        if(metamaskId !== AVAX_MAIN_ID) {
          logout();
        }
      })
      window.ethereum.on('connect', (connectInfo: ConnectInfo) => {
        if(parseInt(connectInfo.chainId, 16) === AVAX_MAIN_ID) {
          login()
        }
      })
    }
    // eslint-disable-next-line
  }, [window.ethereum])

  const login = async () => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          rpc: {
            43114: 'https://api.avax.network/ext/bc/C/rpc'
          },
          chainId: 43114
        }
      }
    }
    
    const web3Modal = new Web3Modal({
      network: "mainnet", 
      cacheProvider: true, 
      providerOptions 
    });
    // web3Modal.clearCachedProvider();
    const provider = await web3Modal.connect();
    await web3Modal.toggleModal();
    const newWeb3 = new Web3(provider);
    const accounts = await newWeb3.eth.getAccounts();
    console.log("=================",accounts)
    setAccount(accounts[0])
    setWeb3Modal(web3Modal)
  }

  const logout = async() => {
    if(!web3Modal) return;
    web3Modal.clearCachedProvider()
    // const accounts = await web3?.eth.getAccounts();
    // console.log("=================",accounts)
    setAccount("")
  }

  return <UserAuthContext.Provider value={{account, login, logout}} children={children}  />;
}


// const useAuth = () => {
//   const [web3Modal, setWeb3Modal] = useState<Web3Modal>()
//   const [account, setAccount] = useState<string>()

//   const login = async () => {
//     const providerOptions = {
//       walletconnect: {
//         package: WalletConnectProvider,
//         options: {
//           rpc: {
//             43114: 'https://api.avax.network/ext/bc/C/rpc'
//           },
//           chainId: 43114
//         }
//       }
//     }
    
//     const web3Modal = new Web3Modal({
//       network: "mainnet", 
//       cacheProvider: true, 
//       providerOptions 
//     });
//     web3Modal.clearCachedProvider();
//     const provider = await web3Modal.connect();
//     await web3Modal.toggleModal();
//     const newWeb3 = new Web3(provider);
//     const accounts = await newWeb3.eth.getAccounts();
//     console.log("=================",accounts)
//     setAccount(accounts[0])
//     setWeb3Modal(web3Modal)
//   }

//   const logOut = async() => {
//     if(!web3Modal) return;
//     web3Modal.clearCachedProvider()
//     // const accounts = await web3?.eth.getAccounts();
//     // console.log("=================",accounts)
//     setAccount("")
//   }

//   return { login, logout: logOut, account }
// }

// export default useAuth