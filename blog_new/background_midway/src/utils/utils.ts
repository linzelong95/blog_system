export const rsaPrivateKey:string=`
-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQC/8YDeYSsOqS65mhjQIp0c0RgBi+Po+ECONRs6GIh4H2h5f4WG
5a8y/PcvhC9Bg06xHC+Zn9wj9OmYZ9cJl0cklhkngA018Azuv+aul53KJxEfD9eq
gevdP1+BtqDFYdMfjy0EVTZXzSxO+Wl7/2NtAmE/AuywA3t/EolsPMvFVQIDAQAB
AoGABlu+tB8t6Pdrx9Q1/DcZU0oN7Icwzpfis5NIypzjcG9B67xwtO5I5nyAx78u
PZJW+gEABqvIBBzp3BWchwHO5nWKJvo2CQ2D779kTEx8nsZiCr/pYQZg3cge4tR4
RQyyoDEE8DyyGO2emgiVqSuh/XyidT91LtW4R5HzZhofR8ECQQD+0OG92xrVs6Wm
x5eSVeeU6cvnVKevowbDDr+5EsP6eVC72SwG5XfYm77QVhuCvcLMDBv1qiBkyKAH
5b3dUx3RAkEAwNXUwBJa1OV1g7bE223xEw9BARyqaVmuZR/yDxzcYZxx1H3LJGpj
tABFu3Ku/FVZPy7T0iHc/E/nYvawbxv8RQJBAJLYvb8z7ZsKFISwsWDbsMHYmnGO
D7TgNp1ieoqljdti3mvjE8RFqXNjDevyM5h80y3ULKi+ijyKge8LLwfFRoECQDW6
XnC1rIEs/bUZM3hABa9dzKrWpdR8nE6ou/TiAbVgtYaTFgqraeQ5PzSfG4pK7Xbh
QTuHG99hFANK4JXUolECQQDC/BziFhbcH+WRk3XE3p9IhYvN6adLaHnK5VDGjejg
ZpGpnitzadqqKRVJEO8s+W/E7gZZv9MWC/h6wzlScX3/
-----END RSA PRIVATE KEY-----
`;

export const rsaPublicKey:string=`
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC/8YDeYSsOqS65mhjQIp0c0RgB
i+Po+ECONRs6GIh4H2h5f4WG5a8y/PcvhC9Bg06xHC+Zn9wj9OmYZ9cJl0cklhkn
gA018Azuv+aul53KJxEfD9eqgevdP1+BtqDFYdMfjy0EVTZXzSxO+Wl7/2NtAmE/
AuywA3t/EolsPMvFVQIDAQAB
-----END PUBLIC KEY-----
`;

/**
 * @getClientIP
 * @desc 获取用户 ip 地址
 * @param {Object} req - 请求
 */
export const getClientIP=(req)=>
    req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
    req.connection.remoteAddress || // 判断 connection 的远程 IP
    req.socket.remoteAddress || // 判断后端的 socket 的 IP
    req.connection.socket.remoteAddress;
;
