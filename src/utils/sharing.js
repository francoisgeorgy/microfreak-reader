
/*
export let toHexString = function(byteArray, sep) {
    return Array.from(byteArray, function (byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join(sep || '')
};

export var fromHexString = function(string, sep) {
    let s = sep ? string.replace(sep, '') : string;
    if ((s.length % 2) > 0) {
        // TODO: throw an exception
        console.warn(`fromHexString: invalid hex string: ${s}`);
        return null;
    }
    let a = new Uint8Array(s.length / 2);
    for (let i=0; i < (s.length / 2); i++) {
        a[i] = parseInt(s.substr(i * 2, 2), 16);
    }
    return a;
};
*/

/*
https://studiocode.dev/microfreak-reader/?data=N4IgZg7iBcCMA0IB2BDAtgUxiAIgSwGcAnDAgBwwGMAXMAVwBsREC6yyB7I6jAExmpE6GRLxTUUMANpSADPADMAVngAOAGzx1AdnjaAnFtVqALPFgAmBLE2xL52Qn2HYCo3uPb581fP267M38HQxNDZ3NzWD8VfRUvNT8A2BMAXXgpE2Ng6MMlPxdoxQt4EwR5BN94HJTqgNk8hE0Iu3kFBHy9JttHeHlWhx8Sgei3CIs0jO8tM3UzZTVNHT1p9WNVM0tre2inQ2HzCwCjla1k5Ns7Podh2RKI%20SVjBSXVdKk5tVvtlTs968sun6J0%20C3Uhm0CDC7k%202mS1lk-V640OQNRXS%20Dl%20sF%20vW06ne-Vgxmi2UM0wq5Ux0WxuIQqjcpKiJQK12mkNOwSRJNknkuPLJfXeHVsrz0wyuTOi0webIxCS5DgFakZvOZ1XJcoq8nUuMK220wsuROamsB6M%20bXisR5OohCOMSNxSP%20FOuCQMGqizWSPNg7yChk0JhKIa0hg0DipUquERaWvc2glDsGXqp7MpSr08MJqd2XpZ7qpVUCUaiKl1IXVrKKqwjY01OTV%20YijqFU3cqmTUW2pqiCdBFexm3s2vDUSS1WV%20ZrcvBmP8uZGslV-zcq1mujWWKigqKFhUPiD63uFzLKL8waW9aiLlkSiXRVGBcP123PkZVgnXvjbvnDPVGk016e5Cj-Yxtxpd492RMC510BQSkg%208okDRR0XNO0VTLOw3E9AZZXTGZFHiTQvFzT1-1VIJkm%20UovRUA94CY5ZkNfOw90LHUT2uGoeldaoVDCXNtwArZvzjFxInNc1KjouxLjMJ0HAbZi31mJSSPHDlOm3OEeyXRFzykjM32xS4fWA3RZTdBJkLXEouxwtVCOeQ0Ow5MTYGScy6h3IlWVsipNBdFS-IUns0wHeZ4gRbZZAo%20lJ1LJtuxJIp4xkk5POmP4s3E5YRhsAtpKY2SktQ8tH00SM8qZcZNNM2rJWbbyqx2WCbkOWwQRi64xK-OxYsSSqhsM3s9DcbcbLlHLRpxHDip1CyvXA-qxl9Yy2VzTNVF8oCpRQk1DgEjdrgWfS%20NOS60Qi%20cCPCTUEo7Mcbu9LQVoC1bZqadiFqGndnwGaEZrcEoOUrAGxo7A6V2-TpZVfTNIf%20-6UOfL6lAEoJiKtM5IuhVj7VzEGnrfLcXDIjpAowkE0Xxa7HoTHVdFUdKJTQ7wdvx7Q6RO76-z6wqrk6FntKhJm3TF%20cdMC7mxYZj1JYHVn2cqmnVl0Xmy2BU71JIkT4XgLH8ZliX6NlT4IiJjFHg18m9BCxmBfJ3M2cA2oZs1vQ%20fEr39bBI2lCQtEzdKZWuYyT4bdl764gBOnHed-2xfduwOZKto3AUTcfZwqwAzjvnB3xokOimimMVJ5nTftY2ZTJhWyOeuQ9GV9piOWd2iQz-3lgqX2vxT4jA8ipRc-BRLw5dsWsNj4flkVioI-6iDVY9zn5Z5we9bO0e8seCtK45aupdrjEEf0Lem%20d%203U7VolOfgvPQr9xuZlzBYBt%20keVAA1-XDXX4t%20IGK1ohoXUMCY4Wtiw8liHeekEpzK5l-EWDEioIr5gZvmB6I1rAnHKthXIkUD7vXAdPVBLddqqn1CQ4q5C7ZRXZPSdc7VJTsJ6GYE2hEfpEIaAZGGHCHBcNApEYEe9hgEKkdA2mMispyOkbIpR8jZHCkUSojR6itEKJ0co7RejdGaMMdItRxizEGIsUYyx%20irG2JsUcVIqQAC%20QA
*/

export function getParameterByName(name) {
    const match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

/*
export function getShareUrl(data) {
    console.log("getShareUrl", data);
    return "?data" + "=" + encodeURIComponent(toHexString(data));
}
*/

