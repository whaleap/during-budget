const _ = require("lodash");
const User = require("../models/User");
const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");
const passport = require("passport");
const generateRandomString = require("../utils/generateRandomString");
//_____________________________________________________________________________

/**
 * Register
 *
 * @body {email: 'user00001', password: 'asdfasdf!!'}
 */
module.exports.register = async (req, res) => {
  try {
    const exUser = await User.findOne({ email: req.body.email });
    if (exUser)
      return res
        .status(409)
        .send({ message: `email ${req.body.email} is already in use` });

    // userId, password 유효성 검사
    // ...

    const user = new User({
      email: req.body.email,
      password: req.body.password,
    });
    await user.save();
    return res.status(200).send({});
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Login (guest)
 *
 */
module.exports.loginGuest = async (req, res) => {
  try {
    let email = generateRandomString(8);
    while (true) {
      const exUser = await User.findOne({ email });
      if (exUser) email = generateRandomString(8);
      else break;
    }
    const password = generateRandomString(16);

    const user = new User({
      email,
      password,
      isGuest: true,
    });
    await user.save();

    req.body.email = user.email;
    req.body.password = password;
    passport.authenticate("local", (authError, user) => {
      try {
        if (authError) throw authError;
        return req.login(user, (loginError) => {
          if (loginError) throw loginError;
          return res.status(200).send({ user });
        });
      } catch (err) {
        throw err;
      }
    })(req, res);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Login (local)
 *
 * @body {email: 'user00001', password: 'asdfasdf!!'}
 */
module.exports.loginLocal = async (req, res) => {
  passport.authenticate("local", (authError, user) => {
    try {
      if (authError) throw authError;
      console.log("DEBUG: authentication is over");
      return req.login(user, (loginError) => {
        if (loginError) throw loginError;
        console.log("DEBUG: login is over");
        /* set maxAge as 1 year if auto login is requested */
        if (req.body.persist === "true") {
          req.session.cookie["maxAge"] = 365 * 24 * 60 * 60 * 1000; //1 year
        }
        console.log("DEBUG: sending response");
        return res.status(200).send({ user });
      });
    } catch (err) {
      return res.status(err.status || 500).send({ message: err.message });
    }
  })(req, res);
};

/**
 * Logout
 */
module.exports.logout = async (req, res) => {
  const { _id: userId, isGuest } = req.user;
  req.logout(async (err) => {
    try {
      if (err) throw err;
      req.session.destroy();
      res.clearCookie("connect.sid");
      if (isGuest) {
        await Promise.all([
          User.findByIdAndDelete(userId),
          Budget.deleteMany({ userId }),
          Transaction.deleteMany({ userId }),
        ]);
      }
      return res.status(200).send({});
    } catch (err) {
      return res.status(err.status || 500).send({ message: err.message });
    }
  });
};

/**
 * Read current user's info
 */
module.exports.current = (req, res) => {
  return res.status(200).send({ user: req.user });
};

/**
 * Read all users (master)
 */
module.exports.list = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).send({ users });
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
};
