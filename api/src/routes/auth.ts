import express from "express";
import mysql, {MysqlError} from "mysql";
import { DBConfig } from "../configs/db-config";
import { User, UserInfo } from "../interfaces/user-params";
import jwt from "jsonwebtoken";
import { JwtSecretKey } from "../configs/jwt-secret";
import Encrypt from "../../middlewares/Encrypt";
import bcrypt from "bcrypt";

export const router = express.Router();

const db = mysql.createConnection({
  host: DBConfig.host,
  port: DBConfig.port,
  user: DBConfig.user,
  password: DBConfig.password,
  database: DBConfig.database
});

router.post('/create-user', (req, res) => {
  
  const user: any = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  };
  
  createUser(req.body.username, req.body.email, req.body.password)
    .then((result) => {
      res.send({
        status: 'success',
        message: 'Success Create User',
        user: result
      });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

router.post('/signin', (req, res) => {
  signInUser(req.body.email, req.body.password)
    .then((result) => {
      // 取得したユーザーIDからユーザー情報を取得する
      getUserInfo(result.uid)
        .then((result) => {
          // トークンの有効期間
          const expiresInTerm = '3h';
          // トークンを作成
          const payload: any = {
            uid: result.uid,
            username: result.username
          };
          const token: string = jwt.sign(payload, JwtSecretKey, {algorithm: "HS256", expiresIn: expiresInTerm});
          
          // ユーザーデータを作成する
          const userInfo: UserInfo = {
            id: result.id,
            uid: result.uid,
            username: result.username,
            photoUrl: result.photo_url
          };
          
          // ユーザーデータとトークンをレスポンス
          res.send({
            status: 'success',
            message: 'Success Sign In User',
            userInfo: userInfo,
            token: token
          });
        })
        .catch((error) => {
          res.status(500).send(error);
        });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// ToDo 認証トークンによる認証チェックを実装する


/**
 * 新規ユーザーの登録
 * @param username {string} ユーザー名
 * @param email {string} Emailアドレス
 * @param password {string} パスワード
 */
async function createUser(username: string, email: string, password: string): Promise<any> {
  try {
    // 新規ユーザーのユーザーIDを取得
    const uid: string = await getNextUserId();
    
    // Emailアドレスを暗号化する
    const encryptEmail: string = await Encrypt.encrypt(email);
    console.log('Encrypt Email: ', encryptEmail);
    // パスワードをハッシュ化する
    const hashPassword: string = bcrypt.hashSync(password, 10);
    console.log('Hash Password: ', hashPassword);
    
    // 新規ユーザーをusersテーブルに登録
    const user = await registerNewUser({
      uid: uid,
      email: encryptEmail,
      password: hashPassword
    });
    
    // 新規ユーザーの初期情報をuser_infoテーブルに登録する
    const registeredUser: any = await setInitialUserInfo({
      uid: uid,
      username: username
    });
    
    return Promise.resolve(registeredUser);
  }
  catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
}


async function getNextUserId (): Promise<string> {
  return new Promise((resolve, reject) => {
    db.query('SHOW TABLE STATUS LIKE "users"', (error, results, fields) => {
      if (error) {
        reject(error);
        throw error;
      }
      const id: number = results[0].Auto_increment;
      let uid: string = '';
      if (id < 10) { uid = 'u0000' + id; }
      else if (id < 100) { uid = 'u000' + id; }
      else if (id < 1000) { uid = 'u00' + id; }
      else if (id < 10000) { uid= 'u0' + id; }
      else { uid = 'u' + id; }
      resolve(uid);
    });
  });
}


async function getUserInfo (uid: string): Promise<any> {
  return new Promise((resolve, reject) => {
    db.query(
      'SELECT * FROM user_info WHERE uid=?',
      [uid],
      (error, results, fields) => {
        if (error) {
          reject(error);
        }
        
        console.log(results);
        const userInfo: UserInfo = results[0];
        if (userInfo) {
          resolve(userInfo)
        }
        else {
          const noUserError: Error = new Error('Not existed user info.');
          noUserError.name = 'NoExistedError';
          reject(noUserError);
        }
      }
    );
  });
}


async function registerNewUser ( newUser: User ): Promise<any> {
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO users SET ?', newUser, (error, results, fields) => {
      if (error) {
        reject(error);
        throw error;
      }
      resolve(newUser.uid);
    });
  });
}

async function setInitialUserInfo ( userInfo: UserInfo ): Promise<any> {
  return new Promise((resolve, reject) => {
    // 初期値はユーザー名のみを登録する
    db.query('INSERT INTO user_info SET ?', userInfo, (error, results, fields) => {
      if (error) {
        reject(error);
        throw error;
      }
      resolve(userInfo);
    })
  });
}


async function signInUser (email: string, password: string): Promise<any> {
  return new Promise(async (resolve, reject) => {
    // まず該当のemailアドレスを持つユーザーがいるかどうか
    // Emailアドレスを暗号化する
    const encryptEmail: string = await Encrypt.encrypt(email);
    console.log('Encrypt Email: ', encryptEmail);
    // パスワードをハッシュ化する
    const hashPassword: string = bcrypt.hashSync(password, 10);
    console.log('Hash Password: ', hashPassword);
    db.query(
      'SELECT * FROM users WHERE email=?',
      [encryptEmail],
      (error, results, fields) => {
        if (error) {
          reject(error);
          throw error;
        }
        const user: User = results[0];
        // パスワードチェック
        bcrypt.compare(password, user.password, (err, same) => {
          // エラーが存在した場合
          if (err) {
            console.log('Password Error: ', err);
            reject(err);
          }
          // パスワードの同一性エラー
          if (!same) {
            const incorrectError: Error = new Error('Incorrect password');
            incorrectError.name = 'SignInFailed';
            reject(incorrectError);
          }
          
          // サインインユーザーのユーザーIDを返す
          resolve({
            id: user.id,
            uid: user.uid
          });
        });
      }
    );
  });
}

