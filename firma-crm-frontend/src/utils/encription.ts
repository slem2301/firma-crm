import * as crypto from "crypto-js";

const secretKey = process.env.REACT_APP_ENCRYPT_SECRET_KE || "";

export const encrypt = (text: string) => {
    return crypto.AES.encrypt(text, secretKey).toString();
};

export const decrypt = (encrypted: string) => {
    const decrypted = crypto.AES.decrypt(encrypted, secretKey);
    return decrypted.toString(crypto.enc.Utf8);
};
