import * as admin from 'firebase-admin';
import serviceAccount from './serviceAccount.json';



if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://polished-leaf-592-default-rtdb.firebaseio.com",
  });
}



export default admin;
