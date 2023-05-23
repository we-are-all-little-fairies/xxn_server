/**
 * 根据用户唯一的token查询，token永不过期
 * @param token
 */

async function findUser(mapping) {
  return new Promise((resolve, reject) => {
    MongoDBClient.collection("user")
      .findOne(mapping)
      .then((res) => {
        dbLogger.info("find user success", res);
        resolve(res);
      })
      .catch((err) => {
        dbLogger.error("find user failed", err);
        reject(err);
      });
  });
}

/**
 * 对某个用户对使用次数-1
 * @param mapping
 * @returns {Promise<unknown>}
 */
async function decreaseTryTime(mapping) {
  return new Promise((resolve, reject) => {
    MongoDBClient.collection("user")
      .findOneAndUpdate(mapping, {
        $inc: {
          retry: -1,
        },
      })
      .then((res) => {
        dbLogger.info("decrease user try time success", res);
        resolve(res);
      })
      .catch((err) => {
        dbLogger.error("decrease user try time failed", err);
        reject(err);
      });
  });
}

module.exports.decreaseTryTime = decreaseTryTime;

module.exports.findUser = findUser;

/**
 * 新增一个用户
 * @param name
 * @param password
 * @param token
 */
module.exports.insertUser = async function insertUser(name, password, token) {
  if ((await findUser({ name: name })) != null) {
    dbLogger.info("find user already add, return");
    throw "find user already add";
  } else {
    return MongoDBClient.collection("user").insertOne({
      name: name,
      password: password,
      token: token,
      retry: 10,
    });
  }
};
