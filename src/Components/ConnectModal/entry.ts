import Icon1 from '../../assets/images/connect/1.svg'
import Icon2 from '../../assets/images/connect/2.svg'

import { Config } from "../../types";

export const connections: Config[] = [
    {
        id  : 0,
        name: 'Ether Mainnet',
        icon: Icon1,
    },
    {
        id  : 1,
        name: 'Kovan Testnet',
        icon: Icon2,
    },
];

export const connectorLocalStorageKey = "connectorId";