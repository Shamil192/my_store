const ApiError = require("../error/ApiErrors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Basket } = require("../models/models");

const generateJwt = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};

async function registration(req, res, next) {
  let { email, password, role } = req.body;
  if (!email || !password) {
    return next(ApiError.badRequest("Некоректный email или password"));
  }
  const condidate = await User.findOne({ where: { email } });
  if (condidate) {
    return next(
      ApiError.badRequest("Пользователь с таким email уже существует")
    );
  }
  const hashPassword = await bcrypt.hash(password, 5);
  const user = await User.create({ email, role, password: hashPassword });
  const basket = await Basket.create({ userId: user.id });
  const token = generateJwt(user.id, user.email, user.role);
  return res.json({ token });
}

async function login(req, res, next) {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return next(ApiError.internal("Пользователь не найден"));
  }
  let comparePassword = bcrypt.compareSync(password, user.password);
  if (!comparePassword) {
    return next(ApiError.internal("Указан неверный пароль"));
  }
  const token = generateJwt(user.id, user.email, user.role);
  return res.json({ token });
}

async function check(req, res, next) {
  const token = generateJwt(req.user.id, req.user.email, req.user.role);
  return res.json({ token });
}

module.exports = { registration, login, check };
