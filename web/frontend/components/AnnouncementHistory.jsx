import { useState, useCallback } from "react";
import {
  Card,
  ResourceList,
  ResourceItem,
  Text,
  InlineStack,
  BlockStack,
  Button,
  Modal,
  EmptyState,
  Badge,
  Box,
  Divider,
  TextField,
  Banner,
  Spinner,
} from "@shopify/polaris";

export default function AnnouncementHistory(props) {
  const announcements = props.announcements;
  const isLoading = props.isLoading;
  const isSaving = props.isSaving;
  const onEdit = props.onEdit;
  const onDelete = props.onDelete;


  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editText, setEditText] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);

  const handleEditOpen = (item) => {
    console.log("opening edit modal for item", item);
    setEditingItem(item);
    setEditText(item.text);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    console.log("submit clicked!");
    if (editingItem == null) {
      console.log("no item to edit");
      return;
    }
    if (editText.trim() == "") {
      console.log("text is empty");
      return;
    }

    const success = await onEdit(editingItem._id, editText.trim());
    if (success == true) {
      console.log("edit was a success");
      setEditModalOpen(false);
      setEditingItem(null);
      setEditText("");
    } else {
      console.log("edit failed");
    }
  };

  const handleDeleteOpen = (item) => {
    setDeletingItem(item);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    console.log("delete confirmed by user");
    if (deletingItem == null) {
      return;
    }

    const success = await onDelete(deletingItem._id);
    if (success == true) {
      setDeleteModalOpen(false);
      setDeletingItem(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("en-US", options);
  }

  const getRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) {
      return "just now";
    } else if (diffMins < 60) {
      return diffMins + "m ago";
    } else if (diffHours < 24) {
      return diffHours + "h ago";
    } else if (diffDays < 7) {
      return diffDays + "d ago";
    } else {
      return formatDate(dateString);
    }
  }

  if (isLoading == true) {
    console.log("currently loading history...");
    return (
      <Card>
        <div className="loading-overlay">
          <Spinner accessibilityLabel="Loading announcement history" size="large" />
        </div>
      </Card>
    );
  }

  if (announcements == undefined || announcements.length == 0) {
    return (
      <Card>
        <EmptyState
          heading="No announcements yet"
          image=""
        >
          <p>
            Create your first announcement from the Dashboard to see it here.
          </p>
        </EmptyState>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <BlockStack gap="400">
          <InlineStack align="space-between" blockAlign="center">
            <Text variant="headingMd" as="h2">
              Announcement History
            </Text>
            <Badge tone="info">{announcements.length} total</Badge>
          </InlineStack>

          <Divider />

          <ResourceList
            resourceName={{ singular: "announcement", plural: "announcements" }}
            items={announcements}
            renderItem={(item) => (
              <ResourceItem
                id={item._id}
                accessibilityLabel={`Announcement: ${item.text}`}
              >
                <div className={`announcement-history-card`}>
                  <BlockStack gap="200">
                    <InlineStack align="space-between" blockAlign="start">
                      <Box maxWidth="70%">
                        <Text variant="bodyMd" fontWeight="semibold" truncate>
                          {item.text}
                        </Text>
                      </Box>
                      <span className={item.isActive == true ? "active-badge" : "inactive-badge"}>
                        {item.isActive == true ? "Active" : "Inactive"}
                      </span>
                    </InlineStack>

                    <InlineStack align="space-between" blockAlign="center">
                      <Text variant="bodySm" tone="subdued">
                        Created {getRelativeTime(item.createdAt)} · {formatDate(item.createdAt)}
                        {item.updatedAt !== item.createdAt && (
                          <> · Edited {getRelativeTime(item.updatedAt)}</>
                        )}
                      </Text>

                      <InlineStack gap="200">
                        <Button
                          size="slim"
                          onClick={() => { handleEditOpen(item); }}
                          disabled={isSaving == true}
                        >
                          Edit
                        </Button>
                        <Button
                          size="slim"
                          tone="critical"
                          onClick={() => { handleDeleteOpen(item); }}
                          disabled={isSaving == true}
                        >
                          Delete
                        </Button>
                      </InlineStack>
                    </InlineStack>
                  </BlockStack>
                </div>
              </ResourceItem>
            )}
          />
        </BlockStack>
      </Card>

      <Modal
        open={editModalOpen}
        onClose={() => { setEditModalOpen(false); }}
        title="Edit Announcement"
        primaryAction={{
          content: "Save Changes",
          onAction: handleEditSubmit,
          loading: isSaving,
          disabled: isSaving == true || editText.trim() == "",
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => { setEditModalOpen(false); },
            disabled: isSaving,
          },
        ]}
      >
        <Modal.Section>
          <BlockStack gap="300">
            <TextField
              label="Announcement Text"
              value={editText}
              onChange={(val) => { setEditText(val); }}
              multiline={3}
              autoComplete="off"
              maxLength={500}
              showCharacterCount
              disabled={isSaving}
            />
            {editingItem && editingItem.isActive == true && (
              <Banner tone="info">
                <p>This is the currently active announcement. Saving will update the storefront banner immediately.</p>
              </Banner>
            )}
          </BlockStack>
        </Modal.Section>
      </Modal>

      <Modal
        open={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); }}
        title="Delete Announcement"
        primaryAction={{
          content: "Delete",
          onAction: handleDeleteConfirm,
          loading: isSaving,
          destructive: true,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => { setDeleteModalOpen(false); },
          },
        ]}
      >
        <Modal.Section>
          <BlockStack gap="300">
            <Text>
              Are you sure you want to delete this announcement?
            </Text>
            {deletingItem != null && (
              <Box padding="300" background="bg-surface-secondary" borderRadius="200">
                <Text variant="bodyMd" fontWeight="semibold">
                  &quot;{deletingItem.text}&quot;
                </Text>
              </Box>
            )}
            {deletingItem && deletingItem.isActive == true && (
              <Banner tone="warning">
                <p>
                  This is the currently active announcement. Deleting it will remove the banner
                  from your storefront, or activate the next most recent announcement.
                </p>
              </Banner>
            )}
          </BlockStack>
        </Modal.Section>
      </Modal>
    </>
  );
}
