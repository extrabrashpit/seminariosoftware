var conn = require('../../../utils/dao');
var ObjectID = require('mongodb').ObjectId;
const bcrypt = require("bcryptjs");
var _db;
class Sec {
  secColl = null;
  constructor() {
    this.initModel();
  }
  async initModel() {
    try {
      _db = await conn.getDB();
      this.secColl = await _db.collection("users");
    } catch (ex) {
      console.log(ex);
      process.exit(1);
    }
  }
  async createNewUser( email, password) {
    try {
      let user = {
        email: email,
        password: await bcrypt.hash(password, 10),
        lastlogin: null,
        lastpasswordchange: null,
        passwordexpires: new Date().getTime() + (90 * 24 * 60 * 60 * 1000), 
        oldpasswords: [],
        roles:["public"]
      }
      let result = await this.secColl.insertOne(user);
      //console.log(result);
      return result;
    } catch(ex) {
      console.log(ex);
      throw(ex);
    }
  }

  async getByEmail(email){
    const filter = {"email": email};
    return await this.secColl.findOne(filter);
  }

  async comparePassword (rawPassword, dbPassword){
    return await bcrypt.compare(rawPassword, dbPassword);
  }

  async updatePassword(pass, id){
    let filter = {"_id": new ObjectID(id)};
    let updateJson = {
      "$push" : {"password": await bcrypt.hash(pass, 10)}
    };
    let result = await this.secColl.updateOne(filter, updateJson);
    return result;
  }

  getEjercicio2 = async()=>{
    try {
      /*Aquí su codigo*/
      let pipe = [
        {'$sort':{ 'edad': -1 }},
        {'$limit' : 10 }
      ];
      const cursor = db.direcciones.aggregate(pipe);
      return cursor.toArray();
    } catch(ex){
      console.log(ex);
      throw(ex);
    }
  }
}

module.exports = Sec;
