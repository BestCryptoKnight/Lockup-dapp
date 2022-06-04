import { Box } from "@mui/material";
import React, { FC, useState } from "react";
import styled from "@emotion/styled";

const SwapInputBox = styled((props: any)=>(<div {...props} />))`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  /* Background[light]/300 */
  border: rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding-left: 15px;

  input,
  input:focus {
    width: calc(100% - 148px);
    height: 40px;
    background: transparent !important;
    padding: 20px 10px 20px 7px;
    font-size: 28px;
    border: none;
    outline: none;
    text-align: right;
    -webkit-appearance: none;
    appearance: none;
    color: white;
    font-weight: 600;
    cursor: ${props => props.readOnly === "true" ? "default !important" : "text"};
  }

  .currencySelector {
    width: ${props => props.readOnly === "true" ? "148px" : "208px"};
    display: flex;
    align-items: center;
  }
`;

const MaxButton = styled.button`
  outline: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 4px;
  gap: 2px;
  width: 36px;
  height: 28px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  border: none;
  font-weight: 400;
  font-size: 10px;
  color: #2AABEE;
  margin-left: 10px;
`

const CustomSelect = styled.select`
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    height: 50px;
    background-color: transparent;
    color: white;
    padding-left: 10px;
    padding-right: 10px;
    font-size: 18px;
    &:focus-visible{
        outline: none;
        border: 1px solid rgba(255, 255, 255, 0.08);
    }
    option {
        background-color: #191A33;
        border-radius: 5px;
    }
`

interface Props {
    onChangeValue: (value: string) => void;
    onChangeDuration: (value: number) => void;
}

const StakingInputComponent = (props: Props) => {
    const [amount, setAmount] = useState("");
    const [period, setPeriod] = useState(0);
    const onChangeAmount = (e: any) => {
        setAmount(e.target.value);
        props.onChangeValue(e.target.value);
    }

    const onChangePeriod = (e: any) => {
        setPeriod(e.target.value);
        props.onChangeDuration(e.target.value);
    }
    return <SwapInputBox>
        <Box className="currencySelector" display="flex" alignItems={'center'} width="200px">
            <CustomSelect onChange={onChangePeriod} value={period}>
                <option value={0}>unlock</option>
                <option value={30}>1 month</option>
                <option value={90}>3 month</option>
                <option value={180}>6 month</option>
                <option value={365}>1 year</option>
                <option value={-1}>Irreversible</option>
            </CustomSelect>
            <MaxButton>Max</MaxButton>
        </Box>
        <input
            onChange={onChangeAmount}
            value={amount}
            placeholder="0.00"
            type="text"
        />
    </SwapInputBox>
}


export default StakingInputComponent;
