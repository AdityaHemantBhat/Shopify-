import Announcement from "../models/Announcement.js";
import {
  setAnnouncementMetafield,
  getAnnouncementMetafield,
  clearAnnouncementMetafield,
} from "./shopifyService.js";
import logger from "../utils/logger.js";

const createAnnouncement = async (session, text) => {
  const shopDomain = session.shop;
  console.log("Creating announcement for shop: " + shopDomain);

  const announcement = new Announcement({
    text: text.trim(),
    shopDomain: shopDomain,
    isActive: true,
  });

  await announcement.save();
  console.log("saved to mongo");

  try {
    await setAnnouncementMetafield(session, text.trim());
    console.log("synced to shopify");
  } catch (error) {
    console.log("failed to sync to shopify!");
    throw new Error("Announcement saved to database but failed to sync with Shopify: " + error.message);
  }

  return announcement;
}

const getCurrentAnnouncement = async (shopDomain) => {
  const announcement = await Announcement.findOne({
    shopDomain: shopDomain,
    isActive: true,
  }).sort({ createdAt: -1 });

  return announcement;
}

const getAnnouncementHistory = async (shopDomain) => {
  const announcements = await Announcement.find({ shopDomain: shopDomain })
    .sort({ createdAt: -1 })
    .lean();

  return announcements;
}

const updateAnnouncement = async (session, announcementId, text) => {
  const shopDomain = session.shop;

  const announcement = await Announcement.findOneAndUpdate(
    { _id: announcementId, shopDomain: shopDomain },
    { text: text.trim() },
    { new: true, runValidators: true }
  );

  if (announcement == null || announcement == undefined) {
    const error = new Error("Announcement not found");
    error.statusCode = 404;
    throw error;
  }

  console.log("updated in mongo");

  if (announcement.isActive == true) {
    try {
      await setAnnouncementMetafield(session, text.trim());
      console.log("updated on shopify too");
    } catch (error) {
      console.log("failed to update on shopify");
      throw new Error("Announcement updated in database but failed to sync with Shopify: " + error.message);
    }
  }

  return announcement;
}

const deleteAnnouncement = async (session, announcementId) => {
  const shopDomain = session.shop;

  const announcement = await Announcement.findOneAndDelete({
    _id: announcementId,
    shopDomain: shopDomain,
  });

  if (announcement == null) {
    const error = new Error("Announcement not found");
    error.statusCode = 404;
    throw error;
  }

  console.log("deleted from mongo");

  if (announcement.isActive == true) {
    const latestRemaining = await Announcement.findOne({ shopDomain: shopDomain })
      .sort({ createdAt: -1 });

    if (latestRemaining != null) {
      latestRemaining.isActive = true;
      await latestRemaining.save();
      await setAnnouncementMetafield(session, latestRemaining.text);
      console.log("activated the next one");
    } else {
      await clearAnnouncementMetafield(session);
      console.log("cleared shopify metafield");
    }
  }

  return announcement;
}

export {
  createAnnouncement,
  getCurrentAnnouncement,
  getAnnouncementHistory,
  updateAnnouncement,
  deleteAnnouncement,
};
