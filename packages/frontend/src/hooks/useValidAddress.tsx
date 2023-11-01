type ValidAddress = {
    css:string;
    valid:boolean;
    address:`0x${string}`
};


export default function useValidAddress(address: `0x${string}`): ValidAddress {
    const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    if(ethereumAddressRegex.test(address)){
        return {valid: true, address: address,css:""}
    }
    return {valid: false, address: address,css:"border-rose-500"}
  }