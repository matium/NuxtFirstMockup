import express from "express";
import mysql, {MysqlError} from "mysql";
import { DBConfig } from "../configs/db-config";
import { User, UserInfo } from "../interfaces/user-params";
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
  // ToDo ユーザー情報データの初期値を登録する
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
