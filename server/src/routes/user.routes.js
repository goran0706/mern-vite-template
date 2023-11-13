import express from 'express';
import authCtrl from '../controllers/auth.controller';
import userCtrl from '../controllers/user.controller';

const router = express.Router();

// Users API routes
router
  .route('/api/users') //
  .get(userCtrl.list)
  .post(userCtrl.create);

router
  .route('/api/users/:userId')
  .get(authCtrl.requireSignin, userCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove);

// Param middleware
router.param('userId', userCtrl.userByID);

export default router;
