const Router = require('express');
const router = new Router();

const UserRouter = require('./userRouter');
const ProjectRouter = require('./projectRouter');
const NewsRouter = require('./newsRouter');
const GroupRouter = require('./groupRouter');
const MessageRouter = require('./messageRouter');
const RolesRouter = require('./rolesRouter');

router.use('/user', UserRouter);
router.use('/project', ProjectRouter);
router.use('/news', NewsRouter);
router.use('/message', MessageRouter);
router.use('/group', GroupRouter);
router.use('/roles', RolesRouter);

module.exports = router;
