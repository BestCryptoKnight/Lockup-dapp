import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

export const Div = styled((props: any) => <Box {...props} />)`
  color: ${(props) => (props.color ? props.color : "white")};
  font-family: Roboto;
  font-style: normal;
  font-weight: ${(props) => (props.fw ? props.fw : props.bold === true ? "bold" : "normal")};
  font-size: ${(props) => {
    return `${
      props.mobile ? (props.fsize * 100) / 375 : (props.fsize * 100) / 1920
    }vw`;
  }};
  line-height: ${(props) => {
    return `${
      props.mobile ? (props.lineHightC * 100) / 375 : (props.lineHightC * 100) / 1920
    }vw`;
  }};
  display: ${(props) => (props.display ? props.display : "flex")};
  width: ${(props) => {
    return `${
      props.mobile ? (props.widthC * 100) / 375 : (props.widthC * 100) / 1920
    }vw`;
  }};
  height: ${(props) => {
    return `${
      props.mobile ? (props.heightC * 100) / 375 : (props.heightC * 100) / 1920
    }vw`;
  }};
  left: ${(props) => {
    return `${
      props.mobile ? (props.leftC * 100) / 375 : (props.leftC * 100) / 1920
    }vw`;
  }};
  right: ${(props) => {
    return `${
      props.mobile ? (props.rightC * 100) / 375 : (props.rightC * 100) / 1920
    }vw`;
  }};
  top: ${(props) => {
    return `${
      props.mobile ? (props.topC * 100) / 375 : (props.topC * 100) / 1920
    }vw`;
  }};
  bottom: ${(props) => {
    return `${
      props.mobile ? (props.bottomC * 100) / 375 : (props.bottomC * 100) / 1920
    }vw`;
  }};
  padding-top: ${(props) => {
    return `${
      props.mobile ? (props.ptC * 100) / 375 : (props.ptC * 100) / 1920
    }vw`;
  }};
  padding-bottom: ${(props) => {
    return `${
      props.mobile ? (props.pbC * 100) / 375 : (props.pbC * 100) / 1920
    }vw`;
  }};
  padding-left: ${(props) => {
    return `${
      props.mobile ? (props.plC * 100) / 375 : (props.plC * 100) / 1920
    }vw`;
  }};
  padding-right: ${(props) => {
    return `${
      props.mobile ? (props.prC * 100) / 375 : (props.prC * 100) / 1920
    }vw`;
  }};
  padding: ${(props) => {
    return `${
      props.mobile ? (props.pc * 100) / 375 : (props.pc * 100) / 1920
    }vw`;
  }};
  margin: ${(props) => {
    return `${
      props.mobile ? (props.mc * 100) / 375 : (props.mc * 100) / 1920
    }vw`;
  }};
  margin-left: ${(props) => {
    return `${
      props.mobile ? (props.mlC * 100) / 375 : (props.mlC * 100) / 1920
    }vw`;
  }};
  margin-right: ${(props) => {
    return `${
      props.mobile ? (props.mrC * 100) / 375 : (props.mrC * 100) / 1920
    }vw`;
  }};
  margin-top: ${(props) => {
    return `${
      props.mobile ? (props.mtC * 100) / 375 : (props.mtC * 100) / 1920
    }vw`;
  }};
  margin-bottom: ${(props) => {
    return `${
      props.mobile ? (props.mbC * 100) / 375 : (props.mbC * 100) / 1920
    }vw`;
  }};
  &::-webkit-scrollbar {
        height: 5px;
        width: 8px;
        /* border: 1px solid black; */
    }
  &::-webkit-scrollbar-track {
    
  }
  &::-webkit-scrollbar-thumb {
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      background: rgba(182, 182, 182, 0.8);
      border-radius: 8px;
  }
`;

export const CustomField = styled((props: any) => <input {...props} />)`
  border-radius: 8px;
  padding: 5px 15px;
  font-size: 16px;
  height: 50px;
  background-color: transparent;
  border: ${(props) => (props.error ? "1px solid red" : "1px solid rgba(255, 255, 255, 0.08)")};
  background: rgba(255, 255, 255, 0.05);
  color: white;
  &:focus-visible{
    outline: none;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }
`

export const Button = styled((props: any) => <button {...props} />)`
    border-radius: 6px;
    padding: 10px 23px;
    font-size: 15px;
    font-weight: 500;
    color: white;
    background-color:#ED4529;
    border: none;
    cursor: pointer;
    &:focus-visible{
        outline: none;
        border: none;
    }
    &:hover {
      background-color:#FF1519;
    }
`