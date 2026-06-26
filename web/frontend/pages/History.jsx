import { useEffect } from "react";
import {
  Page,
  Layout,
  Toast,
} from "@shopify/polaris";
import { useAnnouncement } from "../hooks/useAnnouncement.js";
import AnnouncementHistory from "../components/AnnouncementHistory.jsx";

export default function HistoryPage(props) {
  const onNavigate = props.onNavigate;

  const {
    history,
    isLoading,
    isSaving,
    toastMessage,
    toastError,
    fetchHistory,
    updateAnnouncement,
    deleteAnnouncement,
    clearToast,
  } = useAnnouncement();

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <Page
      title="Announcement History"
      subtitle="View, edit, and manage all past announcements"
      backAction={{ content: "Dashboard", onAction: () => {
        if (onNavigate != undefined) {
          onNavigate("index");
        }
      }}}
    >
      {toastMessage != "" && (
        <Toast
          content={toastMessage}
          error={toastError == true}
          onDismiss={() => { clearToast(); }}
          duration={4000}
        />
      )}

      <Layout>
        <Layout.Section>
          <AnnouncementHistory
            announcements={history}
            isLoading={isLoading == true}
            isSaving={isSaving == true}
            onEdit={(id, text) => updateAnnouncement(id, text)}
            onDelete={(id) => deleteAnnouncement(id)}
          />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
