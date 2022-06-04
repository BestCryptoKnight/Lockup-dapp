import {useState, useEffect} from 'react'

const useMobile = () =>{
    const [isMobile, setMobileMode] = useState(false);
    useEffect(()=>{
      resize();
      window.addEventListener("resize", resize);
      return () => {
        window.removeEventListener("resize", resize);
      }
    },[])

    const resize = () => {
        if (window.innerWidth <= 850) {
          setMobileMode(true)
        } else {
          setMobileMode(false)
        }
    }
    return {isMobile};
}

export default useMobile;