'use client';

import { useState } from 'react';
import { useContent } from '@/lib/content-context';
import { defaultContent } from '@/lib/content-data';
import EditorLayout, { SectionCard, InputField } from '@/components/admin/EditorLayout';

export default function VerificationEditorPage() {
  const { content, updateContent, saveContent } = useContent();
  const [localContent, setLocalContent] = useState({
    verification: { ...content.verification },
  });

  const handleSave = async () => {
    updateContent('verification', localContent.verification);
    await saveContent();
    alert('Verification page content saved!');
  };

  const handleReset = () => {
    if (confirm('Reset verification page content to defaults?')) {
      setLocalContent({
        verification: { ...defaultContent.verification },
      });
    }
  };

  return (
    <EditorLayout
      title="Verification Page"
      description="Edit the Verification page content"
      onSave={handleSave}
      onReset={handleReset}
    >
      {/* Verification Content */}
      <SectionCard title="Verification Page" description="Certificate verification page content">
        <InputField
          label="Tag"
          value={localContent.verification.tag}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              verification: { ...localContent.verification, tag: value },
            })
          }
        />
        <InputField
          label="Title"
          value={localContent.verification.title}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              verification: { ...localContent.verification, title: value },
            })
          }
        />
        <InputField
          label="Description"
          value={localContent.verification.description}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              verification: { ...localContent.verification, description: value },
            })
          }
          type="textarea"
        />
      </SectionCard>

      {/* Form Content */}
      <SectionCard title="Verification Form" description="Form labels and text">
        <InputField
          label="Form Title"
          value={localContent.verification.formTitle}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              verification: { ...localContent.verification, formTitle: value },
            })
          }
        />
        <InputField
          label="Form Description"
          value={localContent.verification.formDescription}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              verification: { ...localContent.verification, formDescription: value },
            })
          }
        />
        <InputField
          label="Input Label"
          value={localContent.verification.inputLabel}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              verification: { ...localContent.verification, inputLabel: value },
            })
          }
        />
        <InputField
          label="Input Placeholder"
          value={localContent.verification.inputPlaceholder}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              verification: { ...localContent.verification, inputPlaceholder: value },
            })
          }
        />
        <InputField
          label="Button Text"
          value={localContent.verification.buttonText}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              verification: { ...localContent.verification, buttonText: value },
            })
          }
        />
      </SectionCard>
    </EditorLayout>
  );
}
