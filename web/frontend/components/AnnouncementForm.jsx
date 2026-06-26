import { useState, useCallback } from "react";
import {
  Card,
  TextField,
  Button,
  InlineStack,
  BlockStack,
  Text,
  Banner,
  Box,
} from "@shopify/polaris";

export default function AnnouncementForm(props) {
  const onSave = props.onSave;
  const isSaving = props.isSaving;
  const initialText = props.initialText || "";
  const submitLabel = props.submitLabel || "Save Announcement";
  const onCancel = props.onCancel;

  const [text, setText] = useState(initialText);
  const [validationError, setValidationError] = useState("");

  const MAX_CHARS = 500;
  const charCount = text.length;
  let isOverLimit = false;
  if (charCount > MAX_CHARS) {
    isOverLimit = true;
  }

  const handleSubmit = async () => {
    console.log("handle submit called");
    setValidationError("");

    const trimmed = text.trim();
    if (trimmed == "") {
      console.log("error: empty text");
      setValidationError("Announcement text cannot be empty.");
      return;
    }

    if (trimmed.length > MAX_CHARS) {
      console.log("error: too long");
      setValidationError(`Announcement text cannot exceed ${MAX_CHARS} characters.`);
      return;
    }

    console.log("saving...");
    const success = await onSave(trimmed);

    if (success == true) {
      if (initialText == "") {
        console.log("clearing text box");
        setText("");
      }
    }
  };

  const handleTextChange = (value) => {
    console.log("text changed to: " + value);
    setText(value);
    if (validationError != "") {
      setValidationError("");
    }
  };

  return (
    <Card>
      <BlockStack gap="400">
        <Text variant="headingMd" as="h2">
          {initialText != "" ? "Edit Announcement" : "New Announcement"}
        </Text>

        {validationError != "" && (
          <Banner tone="critical" onDismiss={() => { setValidationError(""); }}>
            <p>{validationError}</p>
          </Banner>
        )}

        <TextField
          label="Announcement Text"
          value={text}
          onChange={handleTextChange}
          multiline={3}
          autoComplete="off"
          placeholder="e.g. 🎉 Free shipping on all orders over $50! Limited time offer."
          maxLength={MAX_CHARS}
          showCharacterCount
          helpText={
            isOverLimit == true
              ? (charCount - MAX_CHARS) + " characters over the limit"
              : (MAX_CHARS - charCount) + " characters remaining"
          }
          error={isOverLimit == true ? "Text exceeds maximum length" : undefined}
          disabled={isSaving == true}
        />

        <InlineStack gap="300" align="end">
          {onCancel != undefined && (
            <Button onClick={onCancel} disabled={isSaving == true}>
              Cancel
            </Button>
          )}
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={isSaving == true}
            disabled={isSaving == true || isOverLimit == true || text.trim().length === 0}
          >
            {submitLabel}
          </Button>
        </InlineStack>

        <Box paddingBlockStart="200">
          <Text variant="bodySm" tone="subdued">
            Your announcement will appear as a banner across all storefront pages.
            Customers can dismiss it, and it will reappear on their next visit.
          </Text>
        </Box>
      </BlockStack>
    </Card>
  );
}
