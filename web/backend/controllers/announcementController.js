import {
  createAnnouncement,
  getCurrentAnnouncement,
  getAnnouncementHistory,
  updateAnnouncement,
  deleteAnnouncement,
} from "../services/announcementService.js";
import logger from "../utils/logger.js";

const create = async (req, res, next) => {
  try {
    console.log("create announcement called");
    const text = req.body.text;

    if (text == undefined || text == null || text == "" || text.trim() == "") {
      console.log("text is bad");
      return res.status(400).json({
        success: false,
        error: "Announcement text is required and cannot be empty",
      });
    }

    if (text.trim().length > 500) {
      console.log("text too long");
      return res.status(400).json({
        success: false,
        error: "Announcement text cannot exceed 500 characters",
      });
    }

    const session = res.locals.shopify.session;
    const announcement = await createAnnouncement(session, text);

    console.log("success! id is " + announcement._id);

    return res.status(201).json({
      success: true,
      data: announcement,
      message: "Announcement created and synced to storefront",
    });
  } catch (error) {
    console.log("error in create");
    next(error);
  }
}

const getCurrent = async (req, res, next) => {
  try {
    console.log("getCurrent called");
    const session = res.locals.shopify.session;
    const announcement = await getCurrentAnnouncement(session.shop);

    return res.status(200).json({
      success: true,
      data: announcement,
    });
  } catch (error) {
    console.log("error in getCurrent");
    next(error);
  }
}

const getHistory = async (req, res, next) => {
  try {
    console.log("getHistory called");
    const session = res.locals.shopify.session;
    const announcements = await getAnnouncementHistory(session.shop);

    return res.status(200).json({
      success: true,
      data: announcements,
      count: announcements.length,
    });
  } catch (error) {
    console.log("error in getHistory");
    next(error);
  }
}

const update = async (req, res, next) => {
  try {
    console.log("update called");
    const id = req.params.id;
    const text = req.body.text;

    if (text == null || text == undefined || text.trim() == "") {
      return res.status(400).json({
        success: false,
        error: "Announcement text is required and cannot be empty",
      });
    }

    if (text.trim().length > 500) {
      return res.status(400).json({
        success: false,
        error: "Announcement text cannot exceed 500 characters",
      });
    }

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: "Invalid announcement ID",
      });
    }

    const session = res.locals.shopify.session;
    const announcement = await updateAnnouncement(session, id, text);

    console.log("updated " + announcement._id);

    return res.status(200).json({
      success: true,
      data: announcement,
      message: "Announcement updated successfully",
    });
  } catch (error) {
    console.log("error in update");
    next(error);
  }
}

const remove = async (req, res, next) => {
  try {
    console.log("remove called");
    const id = req.params.id;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: "Invalid announcement ID",
      });
    }

    const session = res.locals.shopify.session;
    const announcement = await deleteAnnouncement(session, id);

    console.log("deleted " + announcement._id);

    return res.status(200).json({
      success: true,
      data: announcement,
      message: "Announcement deleted successfully",
    });
  } catch (error) {
    console.log("error in remove");
    next(error);
  }
}

export { create, getCurrent, getHistory, update, remove };
