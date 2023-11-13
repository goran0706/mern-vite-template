import { expressjwt } from 'express-jwt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import config from './../config';

const signin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user || !user.authenticate(req.body.password)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ _id: user._id }, config.jwtSecret);

    res.cookie('t', token, { expire: new Date() + 9999 });

    const { _id, name, email } = user;
    return res.json({ token, user: { _id, name, email } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const signout = (req, res) => {
  res.clearCookie('t');
  return res.status(200).json({ message: 'Signed out successfully' });
};

const requireSignin = expressjwt({
  secret: config.jwtSecret,
  algorithms: ['HS256'],
  requestProperty: 'auth',
});

const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id == req.auth._id;

  if (!authorized) {
    return res.status(403).json({ error: 'User is not authorized' });
  }

  next();
};

export default {
  signin,
  signout,
  requireSignin,
  hasAuthorization,
};
