'use client';

import { useState } from 'react';
import { useContent } from '@/lib/content-context';
import { defaultContent } from '@/lib/content-data';
import EditorLayout, { SectionCard, InputField, ArrayEditor } from '@/components/admin/EditorLayout';

export default function ContactEditorPage() {
  const { content, updateContent, saveContent } = useContent();
  const [localContent, setLocalContent] = useState({
    contact: { ...content.contact },
  });

  const handleSave = async () => {
    updateContent('contact', localContent.contact);
    await saveContent();
    alert('Contact page content saved!');
  };

  const handleReset = () => {
    if (confirm('Reset contact page content to defaults?')) {
      setLocalContent({
        contact: { ...defaultContent.contact },
      });
    }
  };

  return (
    <EditorLayout
      title="Contact Page"
      description="Edit the Contact page content"
      onSave={handleSave}
      onReset={handleReset}
    >
      {/* Contact Header */}
      <SectionCard title="Contact Header" description="Top section of the contact page">
        <InputField
          label="Tag"
          value={localContent.contact.tag}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              contact: { ...localContent.contact, tag: value },
            })
          }
        />
        <InputField
          label="Title"
          value={localContent.contact.title}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              contact: { ...localContent.contact, title: value },
            })
          }
        />
        <InputField
          label="Description"
          value={localContent.contact.description}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              contact: { ...localContent.contact, description: value },
            })
          }
          type="textarea"
        />
        <InputField
          label="Form Title"
          value={localContent.contact.formTitle}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              contact: { ...localContent.contact, formTitle: value },
            })
          }
        />
      </SectionCard>

      {/* Contact Cards */}
      <SectionCard title="Contact Cards" description="Contact information cards">
        <ArrayEditor
          items={localContent.contact.contactCards}
          onUpdate={(contactCards) =>
            setLocalContent({
              ...localContent,
              contact: { ...localContent.contact, contactCards },
            })
          }
          renderItem={(item, index, updateItem) => (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <InputField
                  label="Icon (Emoji)"
                  value={item.icon}
                  onChange={(value) => updateItem({ ...item, icon: value })}
                />
                <InputField
                  label="Title"
                  value={item.title}
                  onChange={(value) => updateItem({ ...item, title: value })}
                />
              </div>
              <InputField
                label="Description"
                value={item.description}
                onChange={(value) => updateItem({ ...item, description: value })}
                type="textarea"
              />
              <InputField
                label="Link (optional, e.g., email address)"
                value={(item as { icon: string; title: string; description: string; link?: string }).link || ''}
                onChange={(value) => updateItem({ ...item, link: value })}
              />
            </div>
          )}
          createNew={() => ({
            icon: '📞',
            title: 'New Contact',
            description: 'Contact description',
            link: '',
          })}
          addButtonText="Add Contact Card"
        />
      </SectionCard>
    </EditorLayout>
  );
}
