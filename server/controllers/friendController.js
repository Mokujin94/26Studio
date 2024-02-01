const { Op } = require("sequelize");
const {
  Friend,
  Subscriber,
  User,
  Likes,
  Comments,
  Notifications,
} = require("../models/models");
const ApiError = require("../error/ApiError");

class FriendController {
  async getAllFriends(req, res, next) {
    try {
      const { userId } = req.query;

      const friend = await Friend.findAll({
        include: [User],
        where: {
          [Op.or]: [{ id_sender: userId }, { id_recipient: userId }],
        },
      });

      return res.json(friend);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async addFriend(req, res, next) {
    try {
      const { id_sender, id_recipient } = req.body;

      let friend = await Friend.findOne({
        where: { id_sender, id_recipient },
      });

      if (!friend) {
        return next(ApiError.forbidden("Пользователь отменил заявку"));
      }

      friend.update({
        status: true,
      });

      return res.json(friend);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async reqFriend(req, res, next) {
    try {
      const { id_sender, id_recipient } = req.body;
      const io = getIo();
      const friendCondidate = await Friend.findOne({
        where: {
          [Op.or]: [
            { id_sender: id_sender, id_recipient: id_recipient },
            { id_sender: id_recipient, id_recipient: id_sender },
          ],
        },
      });

      if (friendCondidate) {
        return next(ApiError.forbidden("Пользователь уже отправил заявку"));
      }

      const friend = await Friend.create({
        id_sender,
        id_recipient,
        userId: id_sender,
      });

      const notification = await Notifications.create({
        senderId: id_sender,
        recipientId: id_recipient,
      });

      const sendNotification = await Notifications.findOne({
        where: { id: notification.id },
        include: [
          {
            model: Likes,
            as: "like",
          },
          {
            model: Comments,
            as: "comment",
          },
          {
            model: User,
            as: "sender",
          },
          {
            model: User,
            as: "recipient",
          },
        ],
      });
      io.emit("notification", sendNotification);

      return res.json(friend);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async deleteFriend(req, res) {
    try {
      const { id_sender, id_recipient } = req.query;

      const friend = await Friend.destroy({
        where: {
          [Op.or]: [
            { id_sender: id_sender, id_recipient: id_recipient },
            { id_sender: id_recipient, id_recipient: id_sender },
          ],
        },
      });

      return res.json(friend);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
}

module.exports = new FriendController();
