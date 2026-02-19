'use client';

import { useState } from 'react';
import { useContent } from '@/lib/content-context';
import { defaultContent } from '@/lib/content-data';
import EditorLayout, { SectionCard, InputField, ArrayEditor } from '@/components/admin/EditorLayout';

export default function LayoutEditorPage() {
  const { content, updateContent, saveContent } = useContent();
  const [localContent, setLocalContent] = useState({
    header: { ...content.header },
    footer: { ...content.footer },
  });

  const handleSave = async () => {
    updateContent('header', localContent.header);
    updateContent('footer', localContent.footer);
    await saveContent();
    alert('Header & Footer content saved!');
  };

  const handleReset = () => {
    if (confirm('Reset header and footer content to defaults?')) {
      setLocalContent({
        header: { ...defaultContent.header },
        footer: { ...defaultContent.footer },
      });
    }
  };

  return (
    <EditorLayout
      title="Header & Footer"
      description="Edit the site-wide header and footer content"
      onSave={handleSave}
      onReset={handleReset}
    >
      {/* Header Section */}
      <SectionCard title="Header" description="Site header and navigation">
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Logo Text"
            value={localContent.header.logoText}
            onChange={(value) =>
              setLocalContent({
                ...localContent,
                header: { ...localContent.header, logoText: value },
              })
            }
          />
          <InputField
            label="Logo Subtext"
            value={localContent.header.logoSubtext}
            onChange={(value) =>
              setLocalContent({
                ...localContent,
                header: { ...localContent.header, logoSubtext: value },
              })
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="CTA Button Text"
            value={localContent.header.ctaText}
            onChange={(value) =>
              setLocalContent({
                ...localContent,
                header: { ...localContent.header, ctaText: value },
              })
            }
          />
          <InputField
            label="CTA Button Link"
            value={localContent.header.ctaHref}
            onChange={(value) =>
              setLocalContent({
                ...localContent,
                header: { ...localContent.header, ctaHref: value },
              })
            }
          />
        </div>

        <div className="pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Navigation Links</label>
          <ArrayEditor
            items={localContent.header.navigation}
            onUpdate={(navigation) =>
              setLocalContent({
                ...localContent,
                header: { ...localContent.header, navigation },
              })
            }
            renderItem={(item, index, updateItem) => (
              <div className="grid grid-cols-2 gap-3">
                <InputField
                  label="Name"
                  value={item.name}
                  onChange={(value) => updateItem({ ...item, name: value })}
                />
                <InputField
                  label="Link"
                  value={item.href}
                  onChange={(value) => updateItem({ ...item, href: value })}
                />
              </div>
            )}
            createNew={() => ({ name: 'New Link', href: '/' })}
            addButtonText="Add Navigation Link"
          />
        </div>
      </SectionCard>

      {/* Footer Section */}
      <SectionCard title="Footer" description="Site footer content">
        <InputField
          label="Brand Description"
          value={localContent.footer.brandDescription}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              footer: { ...localContent.footer, brandDescription: value },
            })
          }
          type="textarea"
        />

        <div className="pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Organization Links</label>
          <ArrayEditor
            items={localContent.footer.organization}
            onUpdate={(organization) =>
              setLocalContent({
                ...localContent,
                footer: { ...localContent.footer, organization },
              })
            }
            renderItem={(item, index, updateItem) => (
              <div className="grid grid-cols-2 gap-3">
                <InputField
                  label="Name"
                  value={item.name}
                  onChange={(value) => updateItem({ ...item, name: value })}
                />
                <InputField
                  label="Link"
                  value={item.href}
                  onChange={(value) => updateItem({ ...item, href: value })}
                />
              </div>
            )}
            createNew={() => ({ name: 'New Link', href: '/' })}
            addButtonText="Add Organization Link"
          />
        </div>

        <div className="pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Services Links</label>
          <ArrayEditor
            items={localContent.footer.services}
            onUpdate={(services) =>
              setLocalContent({
                ...localContent,
                footer: { ...localContent.footer, services },
              })
            }
            renderItem={(item, index, updateItem) => (
              <div className="grid grid-cols-2 gap-3">
                <InputField
                  label="Name"
                  value={item.name}
                  onChange={(value) => updateItem({ ...item, name: value })}
                />
                <InputField
                  label="Link"
                  value={item.href}
                  onChange={(value) => updateItem({ ...item, href: value })}
                />
              </div>
            )}
            createNew={() => ({ name: 'New Link', href: '/' })}
            addButtonText="Add Services Link"
          />
        </div>

        <div className="pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Resources Links</label>
          <ArrayEditor
            items={localContent.footer.resources}
            onUpdate={(resources) =>
              setLocalContent({
                ...localContent,
                footer: { ...localContent.footer, resources },
              })
            }
            renderItem={(item, index, updateItem) => (
              <div className="grid grid-cols-2 gap-3">
                <InputField
                  label="Name"
                  value={item.name}
                  onChange={(value) => updateItem({ ...item, name: value })}
                />
                <InputField
                  label="Link"
                  value={item.href}
                  onChange={(value) => updateItem({ ...item, href: value })}
                />
              </div>
            )}
            createNew={() => ({ name: 'New Link', href: '/' })}
            addButtonText="Add Resources Link"
          />
        </div>
      </SectionCard>
    </EditorLayout>
  );
}
