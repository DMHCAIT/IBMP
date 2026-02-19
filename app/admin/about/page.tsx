'use client';

import { useState } from 'react';
import { useContent } from '@/lib/content-context';
import { defaultContent } from '@/lib/content-data';
import EditorLayout, { SectionCard, InputField, ArrayEditor } from '@/components/admin/EditorLayout';

export default function AboutEditorPage() {
  const { content, updateContent, saveContent } = useContent();
  const [localContent, setLocalContent] = useState({
    aboutHero: { ...content.aboutHero },
    board: { ...content.board },
    values: { ...content.values },
  });

  const handleSave = async () => {
    updateContent('aboutHero', localContent.aboutHero);
    updateContent('board', localContent.board);
    updateContent('values', localContent.values);
    await saveContent();
    alert('About page content saved!');
  };

  const handleReset = () => {
    if (confirm('Reset about page content to defaults?')) {
      setLocalContent({
        aboutHero: { ...defaultContent.aboutHero },
        board: { ...defaultContent.board },
        values: { ...defaultContent.values },
      });
    }
  };

  return (
    <EditorLayout
      title="About Page"
      description="Edit the About page sections including Hero, Board of Directors, and Values"
      onSave={handleSave}
      onReset={handleReset}
    >
      {/* About Hero Section */}
      <SectionCard title="About Hero" description="Top section of the about page">
        <InputField
          label="Badge"
          value={localContent.aboutHero.badge}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              aboutHero: { ...localContent.aboutHero, badge: value },
            })
          }
        />
        <InputField
          label="Title"
          value={localContent.aboutHero.title}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              aboutHero: { ...localContent.aboutHero, title: value },
            })
          }
        />
        <InputField
          label="Main Description"
          value={localContent.aboutHero.description}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              aboutHero: { ...localContent.aboutHero, description: value },
            })
          }
          type="textarea"
          rows={4}
        />
        <InputField
          label="Sub Description"
          value={localContent.aboutHero.subDescription}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              aboutHero: { ...localContent.aboutHero, subDescription: value },
            })
          }
          type="textarea"
        />
      </SectionCard>

      {/* Board Section */}
      <SectionCard title="Board of Directors" description="Leadership section">
        <InputField
          label="Badge"
          value={localContent.board.badge}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              board: { ...localContent.board, badge: value },
            })
          }
        />
        <InputField
          label="Title"
          value={localContent.board.title}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              board: { ...localContent.board, title: value },
            })
          }
        />
        <InputField
          label="Description"
          value={localContent.board.description}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              board: { ...localContent.board, description: value },
            })
          }
          type="textarea"
        />
        <InputField
          label="Commitment Title"
          value={localContent.board.commitmentTitle}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              board: { ...localContent.board, commitmentTitle: value },
            })
          }
        />
        <InputField
          label="Commitment Text 1"
          value={localContent.board.commitmentText1}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              board: { ...localContent.board, commitmentText1: value },
            })
          }
          type="textarea"
        />
        <InputField
          label="Commitment Text 2"
          value={localContent.board.commitmentText2}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              board: { ...localContent.board, commitmentText2: value },
            })
          }
          type="textarea"
        />
        <InputField
          label="Image URL"
          value={localContent.board.imageUrl}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              board: { ...localContent.board, imageUrl: value },
            })
          }
        />
        <InputField
          label="Image Alt Text"
          value={localContent.board.imageAlt}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              board: { ...localContent.board, imageAlt: value },
            })
          }
        />
        <InputField
          label="Overlay Title"
          value={localContent.board.overlayTitle}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              board: { ...localContent.board, overlayTitle: value },
            })
          }
        />
        <InputField
          label="Overlay Subtitle"
          value={localContent.board.overlaySubtitle}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              board: { ...localContent.board, overlaySubtitle: value },
            })
          }
        />

        <div className="pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Expertise Areas</label>
          <ArrayEditor
            items={localContent.board.expertiseAreas}
            onUpdate={(expertiseAreas) =>
              setLocalContent({
                ...localContent,
                board: { ...localContent.board, expertiseAreas },
              })
            }
            renderItem={(item, index, updateItem) => (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    label="Title"
                    value={item.title}
                    onChange={(value) => updateItem({ ...item, title: value })}
                  />
                  <InputField
                    label="Icon (Building2, GraduationCap, Globe2, Scale)"
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
              icon: 'Building2',
              title: 'New Area',
              description: 'Area description',
              gradient: 'from-blue-500 to-blue-600',
            })}
            addButtonText="Add Expertise Area"
          />
        </div>
      </SectionCard>

      {/* Values Section */}
      <SectionCard title="Board Values" description="Core principles section">
        <InputField
          label="Badge"
          value={localContent.values.badge}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              values: { ...localContent.values, badge: value },
            })
          }
        />
        <InputField
          label="Title"
          value={localContent.values.title}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              values: { ...localContent.values, title: value },
            })
          }
        />
        <InputField
          label="Subtitle"
          value={localContent.values.subtitle}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              values: { ...localContent.values, subtitle: value },
            })
          }
          type="textarea"
        />

        <div className="pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Values</label>
          <ArrayEditor
            items={localContent.values.values}
            onUpdate={(values) =>
              setLocalContent({
                ...localContent,
                values: { ...localContent.values, values },
              })
            }
            renderItem={(item, index, updateItem) => (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
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
                  type="textarea"
                />
              </div>
            )}
            createNew={() => ({
              icon: '⭐',
              title: 'New Value',
              description: 'Value description',
            })}
            addButtonText="Add Value"
          />
        </div>
      </SectionCard>
    </EditorLayout>
  );
}
