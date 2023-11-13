import errorHandler from '../helpers/dbErrorHandler';
import User from '../models/user.model';

const create = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    return res.status(200).json({ message: 'Successfully signed up!' });
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const userByID = async (req, res, next, id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    req.profile = user;
    next();
  } catch (err) {
    return res.status(400).json({ error: 'Could not retrieve user' });
  }
};

const read = (req, res) => {
  const sanitizedUser = req.profile.toObject();
  delete sanitizedUser.hashed_password;
  delete sanitizedUser.salt;
  return res.json(sanitizedUser);
};

const list = async (req, res) => {
  try {
    const users = await User.find().select('name email updated created');
    res.json(users);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const update = async (req, res) => {
  try {
    let user = req.profile;
    user = Object.assign(user, req.body);
    user.updated = Date.now();
    await user.save();
    delete user.hashed_password;
    delete user.salt;
    res.json(user);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const remove = async (req, res) => {
  try {
    const user = req.profile;
    const deletedUser = await user.remove();
    delete deletedUser.hashed_password;
    delete deletedUser.salt;
    res.json(deletedUser);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

export default {
  create,
  userByID,
  read,
  list,
  update,
  remove,
};
