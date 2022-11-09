const User = require("../models/User");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(401).json({ msg: "Please enter all fields" });
    }

    const user = await User.create(req.body);
    token = user.createJWT();
    res.status(200).send({ name: user.name, token });
  } catch (err) {
    res.status(400).send(err);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(401).json("Please provide email and password");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json("invalid credentials");
    }
    
    const isMatch = await user.comparePasswords(password);
    if (!isMatch) {
      return res.status(401).json("invalid credentials");
    }
    
    const token = user.createJWT();
    res.status(200).send({ name: user.name, token });
  } catch (err) {
    res.status(400).send(err);
  }
};

module.exports = {
  register,
  login,
};
