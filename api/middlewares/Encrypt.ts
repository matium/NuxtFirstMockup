import crypto from "crypto";

const ENCRYPTION_PASS = 'QzrPk47treYqBFHaBbusq8gKnDWz5UfL';  // 32Byte
const SALT = 'mwZdnWY4s92rfRMX';  // 16Byte
const BUFFER_KEY = 'ApPhJ7CLsx2Rd3qA';  // 16Byte
const ENCRYPT_METHOD = 'aes-256-cbc';
const ENCODING = 'hex';

export default class Encrypt {
  
  /**
   * 渡された文字列データを暗号化する
   * @param message
   * @returns { string }
   */
  static encrypt = async (message: string): Promise<any> => {
    try {
      // 鍵の生成
      const key = crypto.scryptSync(ENCRYPTION_PASS, SALT, 32);
      // IVを生成
      const iv = Buffer.from(BUFFER_KEY);
      // 暗号器を生成
      const cipher = crypto.createCipheriv(ENCRYPT_METHOD, key, iv);
      // 暗号化されたデータを作成
      let encryptedData = cipher.update(Buffer.from(message));
      encryptedData = Buffer.concat([encryptedData, cipher.final()]);
      
      // 文字列化されたデータを戻す
      return Promise.resolve(encryptedData.toString(ENCODING));
    }
    catch (error) {
      console.log('Encrypt Error', error);
      return Promise.reject(error);
    }
  };
  
  /**
   * 渡された暗号文字列を元のテキストデータに戻す
   * @param encryptedString
   */
  static decrypt = async (encryptedString: string) => {
    try {
      // 暗号化された文字列をバッファに戻す
      const encryptedData = Buffer.from(encryptedString, ENCODING);
      // 鍵を生成
      const key = crypto.scryptSync(ENCRYPTION_PASS, SALT, 32);
      // IVを生成
      const iv = Buffer.from(BUFFER_KEY);
      // 復号器を生成
      const decipher = crypto.createDecipheriv(ENCRYPT_METHOD, key, iv);
      // 復元データを作成
      let decryptedData = decipher.update(encryptedData);
      decryptedData = Buffer.concat([decryptedData, decipher.final()]);
      
      // 復号されたテキストを戻す
      return Promise.resolve(decryptedData.toString());
    }
    catch (error) {
      console.log('Decrypt Error', error);
      return Promise.reject(error);
    }
  };
}
