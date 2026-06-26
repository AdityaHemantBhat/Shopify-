import { useState, useCallback, useEffect } from "react";
import { apiFetch } from "../utils/api.js";

export function useAnnouncement() {


  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  

  const [toastMessage, setToastMessage] = useState("");
  const [toastError, setToastError] = useState(false);

  const showToast = useCallback((message, isError) => {
    if (isError == undefined) {
      isError = false;
    }
    setToastMessage(message);
    setToastError(isError);
  }, []);

  const clearToast = useCallback(() => {
    setToastMessage("");
    setToastError(false);
  }, []);

  const fetchCurrentAnnouncement = useCallback(async () => {
    console.log("fetching current announcement...");
    setIsLoading(true);
    setError(null);

    try {
      const res = await apiFetch("/api/announcement");
      const data = await res.json();
      console.log("data is", data);

      if (data.success === true) {
        setCurrentAnnouncement(data.data);
      } else {
        let errorMsg = data.error;
        if (!errorMsg) {
          errorMsg = "Failed to fetch announcement";
        }
        setError(errorMsg);
      }
    } catch (err) {
      console.log("ERROR inside fetchCurrentAnnouncement!!!!", err);
      setError("Network error: could not reach the server");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    console.log("going to fetch history now");
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiFetch("/api/announcements");
      const dataObj = await response.json();

      if (dataObj.success == true) {
        setHistory(dataObj.data);
      } else {
        if (dataObj.error) {
          setError(dataObj.error);
        } else {
          setError("Failed to fetch history");
        }
      }
    } catch (e) {
      setError("Network error: could not reach the server");
      console.error("Fetch history error:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createAnnouncement = useCallback(async (text) => {
    console.log("creating announcement with text: " + text);
    setIsSaving(true);
    setError(null);

    try {
      const response = await apiFetch("/api/announcement", {
        method: "POST",
        body: JSON.stringify({ text: text }),
      });

      const data = await response.json();

      if (data.success == true) {
        setCurrentAnnouncement(data.data);
        showToast("Announcement saved and published to storefront!", false);
        return true;
      } else {
        showToast(data.error ? data.error : "Failed to save announcement", true);
        return false;
      }
    } catch (err) {
      showToast("Network error: could not save announcement", true);
      console.log("err", err);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [showToast]);

  const updateAnnouncement = useCallback(async (id, text) => {
    console.log("update announcement called", id, text);
    setIsSaving(true);
    setError(null);

    try {
      const response = await apiFetch("/api/announcement/" + id, {
        method: "PUT",
        body: JSON.stringify({ text: text }),
      });

      const returnedData = await response.json();

      if (returnedData.success === true) {
        const newHistory = history.map((item) => {
          if (item._id === id) {
            item.text = returnedData.data.text;
            item.updatedAt = returnedData.data.updatedAt;
            return item;
          } else {
            return item;
          }
        });
        setHistory(newHistory);

        if (returnedData.data.isActive == true) {
          setCurrentAnnouncement(returnedData.data);
        }
        showToast("Announcement updated successfully!", false);
        return true;
      } else {
        if (returnedData.error) {
          showToast(returnedData.error, true);
        } else {
          showToast("Failed to update announcement", true);
        }
        return false;
      }
    } catch (err) {
      showToast("Network error: could not update announcement", true);
      console.log(err);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [showToast, history]);

  const deleteAnnouncement = useCallback(async (id) => {
    console.log("deleting: " + id);
    setIsSaving(true);
    setError(null);

    try {
      const response = await apiFetch(`/api/announcement/${id}`, {
        method: "DELETE",
      });

      const dataFromServer = await response.json();

      if (dataFromServer.success == true) {
        
        const arr = [];
        for (let i = 0; i < history.length; i++) {
          if (history[i]._id != id) {
            arr.push(history[i]);
          }
        }
        setHistory(arr);

        await fetchCurrentAnnouncement();
        showToast("Announcement deleted successfully!", false);
        return true;
      } else {
        showToast(dataFromServer.error || "Failed to delete announcement", true);
        return false;
      }
    } catch (err) {
      showToast("Network error: could not delete announcement", true);
      console.log(err);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [showToast, fetchCurrentAnnouncement, history]);

  useEffect(() => {
    console.log("use effect running");
    fetchCurrentAnnouncement();
  }, [fetchCurrentAnnouncement]);

  return {
    currentAnnouncement: currentAnnouncement,
    history: history,
    isLoading: isLoading,
    isSaving: isSaving,
    error: error,
    toastMessage: toastMessage,
    toastError: toastError,

    fetchCurrentAnnouncement: fetchCurrentAnnouncement,
    fetchHistory: fetchHistory,
    createAnnouncement: createAnnouncement,
    updateAnnouncement: updateAnnouncement,
    deleteAnnouncement: deleteAnnouncement,
    clearToast: clearToast,
    showToast: showToast,
  };
}
