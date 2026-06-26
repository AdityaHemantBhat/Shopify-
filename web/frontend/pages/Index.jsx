import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Badge,
  Box,
  Spinner,
  Toast,
  Divider,
  Banner,
} from "@shopify/polaris";
import { useAnnouncement } from "../hooks/useAnnouncement.js";
import AnnouncementForm from "../components/AnnouncementForm.jsx";

export default function IndexPage(props) {
  const onNavigate = props.onNavigate;
  
  const {
    currentAnnouncement,
    isLoading,
    isSaving,
    toastMessage,
    toastError,
    createAnnouncement,
    clearToast,
  } = useAnnouncement();

  return (
    <Page
      title="Announcement Banner"
      subtitle="Create and manage storefront announcements"
      primaryAction={{
        content: "View History",
        onAction: () => {
          if (onNavigate != undefined) {
            onNavigate("history");
          }
        },
      }}
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
          <BlockStack gap="500">
            {currentAnnouncement == null && isLoading == false && (
              <Banner tone="info">
                <p>
                  Create your first announcement! It will appear as a sticky banner
                  across all pages of your online store.
                </p>
              </Banner>
            )}

            <AnnouncementForm
              onSave={(text) => createAnnouncement(text)}
              isSaving={isSaving == true}
            />
          </BlockStack>
        </Layout.Section>

        <Layout.Section variant="oneThird">
          <BlockStack gap="500">
            <Card>
              <BlockStack gap="300">
                <Text variant="headingMd" as="h2">
                  Current Status
                </Text>

                <Divider />

                {isLoading == true ? (
                  <div className="loading-overlay" style={{ minHeight: "100px" }}>
                    <Spinner size="small" />
                  </div>
                ) : currentAnnouncement != null ? (
                  <BlockStack gap="200">
                    <InlineStack gap="200" blockAlign="center">
                      <span className="active-badge">Live</span>
                    </InlineStack>

                    <Box
                      padding="300"
                      background="bg-surface-secondary"
                      borderRadius="200"
                    >
                      <Text variant="bodyMd" fontWeight="semibold">
                        &quot;{currentAnnouncement.text}&quot;
                      </Text>
                    </Box>

                    <Text variant="bodySm" tone="subdued">
                      Last updated:{" "}
                      {new Date(currentAnnouncement.updatedAt).toLocaleString()}
                    </Text>
                  </BlockStack>
                ) : (
                  <BlockStack gap="200">
                    <InlineStack gap="200" blockAlign="center">
                      <span className="inactive-badge">No active announcement</span>
                    </InlineStack>
                    <Text variant="bodySm" tone="subdued">
                      Create an announcement to display it on your storefront.
                    </Text>
                  </BlockStack>
                )}
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="300">
                <Text variant="headingMd" as="h2">
                  How It Works
                </Text>
                <Divider />
                <BlockStack gap="200">
                  <InlineStack gap="200" blockAlign="start">
                    <Badge tone="info">1</Badge>
                    <Text variant="bodySm">Type your announcement</Text>
                  </InlineStack>
                  <InlineStack gap="200" blockAlign="start">
                    <Badge tone="info">2</Badge>
                    <Text variant="bodySm">Click Save to publish</Text>
                  </InlineStack>
                  <InlineStack gap="200" blockAlign="start">
                    <Badge tone="info">3</Badge>
                    <Text variant="bodySm">Enable the app embed</Text>
                  </InlineStack>
                  <InlineStack gap="200" blockAlign="start">
                    <Badge tone="success">✓</Badge>
                    <Text variant="bodySm">Banner is live!</Text>
                  </InlineStack>
                </BlockStack>
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="300">
                <Text variant="headingMd" as="h2">
                  Enable on Storefront
                </Text>
                <Divider />
                <Text variant="bodySm" tone="subdued">
                  Go to <strong>Online Store → Themes → Customize</strong> → 
                  App embeds → Toggle on <strong>Announcement Banner</strong>.
                </Text>
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
