export const numberWithCommas = (x:number | string, decimal=0) => {
    var parts = x.toString().split(".");
    parts[0]=parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,",");
    
    if(parts[1] && decimal) {
        parts[1] = parts[1].slice(decimal * -1);
    }
    return parts.join(".");
}

export const shortAddr = (addr:string) => {
    var firPart = addr.slice(0, 7);
    var secondPart = addr.slice(addr.length - 5, addr.length);
    return firPart.concat("...", secondPart);
}

export const toFixed = (x: any) => {
    if (Math.abs(x) < 1.0) {
      let e = parseInt(x.toString().split('e-')[1]);
      if (e) {
          x *= Math.pow(10,e-1);
          x = Math.round(x * 100) / 100;
          x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
      }
    } else {
      let e = parseInt(x.toString().split('+')[1]);
      if (e > 20) {
          e -= 20;
          x /= Math.pow(10,e);
          x = Math.round(x * 100) / 100;
          x += (new Array(e+1)).join('0');
      }
    }
    return x;
}

export const displayDays = (timeLimit: number) => {
    const day = (~~(timeLimit / (24 * 3600))).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
    })
    const hour = (~~(timeLimit / 3600) % 24).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
    })
    const minute = (~~(timeLimit / 60) % 60).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
    })
    const second = (~~(timeLimit % 60)).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
    })
    return {day, hour,minute, second}
}

export const roundWithPrecision = (num: number, precision: number) => {
    var multiplier = Math.pow(10, precision);
    return Math.round( num * multiplier ) / multiplier;
}