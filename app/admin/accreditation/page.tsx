'use client';

import { useState } from 'react';
import { useContent } from '@/lib/content-context';
import { defaultContent } from '@/lib/content-data';
import EditorLayout, { SectionCard, InputField, ArrayEditor } from '@/components/admin/EditorLayout';

export default function AccreditationEditorPage() {
  const { content, updateContent, saveContent } = useContent();
  const [localContent, setLocalContent] = useState({
    accreditationHero: { ...content.accreditationHero },
    process: { ...content.process },
    applicationCTA: { ...content.applicationCTA },
  });

  const handleSave = async () => {
    updateContent('accreditationHero', localContent.accreditationHero);
    updateContent('process', localContent.process);
    updateContent('applicationCTA', localContent.applicationCTA);
    await saveContent();
    alert('Accreditation page content saved!');
  };

  const handleReset = () => {
    if (confirm('Reset accreditation page content to defaults?')) {
      setLocalContent({
        accreditationHero: { ...defaultContent.accreditationHero },
        process: { ...defaultContent.process },
        applicationCTA: { ...defaultContent.applicationCTA },
      });
    }
  };

  return (
    <EditorLayout
      title="Accreditation Page"
      description="Edit the Accreditation page sections including Hero, Process, and Application CTA"
      onSave={handleSave}
      onReset={handleReset}
    >
      {/* Accreditation Hero */}
      <SectionCard title="Accreditation Hero" description="Top banner section">
        <InputField
          label="Badge Text"
          value={localContent.accreditationHero.badge}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              accreditationHero: { ...localContent.accreditationHero, badge: value },
            })
          }
        />
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Title Prefix"
            value={localContent.accreditationHero.titlePrefix}
            onChange={(value) =>
              setLocalContent({
                ...localContent,
                accreditationHero: { ...localContent.accreditationHero, titlePrefix: value },
              })
            }
          />
          <InputField
            label="Title Highlight"
            value={localContent.accreditationHero.titleHighlight}
            onChange={(value) =>
              setLocalContent({
                ...localContent,
                accreditationHero: { ...localContent.accreditationHero, titleHighlight: value },
              })
            }
          />
        </div>
        <InputField
          label="Description"
          value={localContent.accreditationHero.description}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              accreditationHero: { ...localContent.accreditationHero, description: value },
            })
          }
          type="textarea"
        />
        <InputField
          label="Background Image URL"
          value={localContent.accreditationHero.backgroundImage}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              accreditationHero: { ...localContent.accreditationHero, backgroundImage: value },
            })
          }
        />

        <div className="pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Trust Indicators</label>
          <ArrayEditor
            items={localContent.accreditationHero.trustIndicators}
            onUpdate={(trustIndicators) =>
              setLocalContent({
                ...localContent,
                accreditationHero: { ...localContent.accreditationHero, trustIndicators },
              })
            }
            renderItem={(item, index, updateItem) => (
              <div className="grid grid-cols-2 gap-3">
                <InputField
                  label="Icon (CheckCircle, Shield, Award)"
                  value={item.icon}
                  onChange={(value) => updateItem({ ...item, icon: value })}
                />
                <InputField
                  label="Text"
                  value={item.text}
                  onChange={(value) => updateItem({ ...item, text: value })}
                />
              </div>
            )}
            createNew={() => ({ icon: 'CheckCircle', text: 'New Indicator' })}
            addButtonText="Add Trust Indicator"
          />
        </div>
      </SectionCard>

      {/* Process Section */}
      <SectionCard title="Accreditation Process" description="Step-by-step process section">
        <InputField
          label="Badge"
          value={localContent.process.badge}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              process: { ...localContent.process, badge: value },
            })
          }
        />
        <InputField
          label="Title"
          value={localContent.process.title}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              process: { ...localContent.process, title: value },
            })
          }
        />
        <InputField
          label="Subtitle"
          value={localContent.process.subtitle}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              process: { ...localContent.process, subtitle: value },
            })
          }
          type="textarea"
        />

        <div className="pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Process Steps</label>
          <ArrayEditor
            items={localContent.process.steps}
            onUpdate={(steps) =>
              setLocalContent({
                ...localContent,
                process: { ...localContent.process, steps },
              })
            }
            renderItem={(item, index, updateItem) => (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <InputField
                    label="Number"
                    value={item.number}
                    onChange={(value) => updateItem({ ...item, number: value })}
                  />
                  <InputField
                    label="Title"
                    value={item.title}
                    onChange={(value) => updateItem({ ...item, title: value })}
                  />
                  <InputField
                    label="Icon (Emoji)"
                    value={item.icon}
                    onChange={(value) => updateItem({ ...item, icon: value })}
                  />
                </div>
                <InputField
                  label="Description"
                  value={item.description}
                  onChange={(value) => updateItem({ ...item, description: value })}
                />
              </div>
            )}
            createNew={() => ({
              number: '06',
              title: 'New Step',
              description: 'Step description',
              icon: '📋',
            })}
            addButtonText="Add Step"
          />
        </div>
      </SectionCard>

      {/* Application CTA */}
      <SectionCard title="Application CTA" description="Call to action section">
        <InputField
          label="Title"
          value={localContent.applicationCTA.title}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              applicationCTA: { ...localContent.applicationCTA, title: value },
            })
          }
        />
        <InputField
          label="Description"
          value={localContent.applicationCTA.description}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              applicationCTA: { ...localContent.applicationCTA, description: value },
            })
          }
          type="textarea"
        />
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Primary Button Text"
            value={localContent.applicationCTA.primaryButton.text}
            onChange={(value) =>
              setLocalContent({
                ...localContent,
                applicationCTA: {
                  ...localContent.applicationCTA,
                  primaryButton: { ...localContent.applicationCTA.primaryButton, text: value },
                },
              })
            }
          />
          <InputField
            label="Primary Button Link"
            value={localContent.applicationCTA.primaryButton.href}
            onChange={(value) =>
              setLocalContent({
                ...localContent,
                applicationCTA: {
                  ...localContent.applicationCTA,
                  primaryButton: { ...localContent.applicationCTA.primaryButton, href: value },
                },
              })
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Secondary Button Text"
            value={localContent.applicationCTA.secondaryButton.text}
            onChange={(value) =>
              setLocalContent({
                ...localContent,
                applicationCTA: {
                  ...localContent.applicationCTA,
                  secondaryButton: { ...localContent.applicationCTA.secondaryButton, text: value },
                },
              })
            }
          />
          <InputField
            label="Secondary Button Link"
            value={localContent.applicationCTA.secondaryButton.href}
            onChange={(value) =>
              setLocalContent({
                ...localContent,
                applicationCTA: {
                  ...localContent.applicationCTA,
                  secondaryButton: { ...localContent.applicationCTA.secondaryButton, href: value },
                },
              })
            }
          />
        </div>
      </SectionCard>
    </EditorLayout>
  );
}
