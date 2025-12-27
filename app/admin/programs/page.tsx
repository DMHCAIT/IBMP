'use client';

import { useState } from 'react';
import { useContent } from '@/lib/content-context';
import { defaultContent } from '@/lib/content-data';
import EditorLayout, { SectionCard, InputField, ArrayEditor } from '@/components/admin/EditorLayout';

export default function ProgramsEditorPage() {
  const { content, updateContent, saveContent } = useContent();
  const [localContent, setLocalContent] = useState({
    programs: { ...content.programs },
  });

  const handleSave = async () => {
    updateContent('programs', localContent.programs);
    await saveContent();
    alert('Programs page content saved!');
  };

  const handleReset = () => {
    if (confirm('Reset programs page content to defaults?')) {
      setLocalContent({
        programs: { ...defaultContent.programs },
      });
    }
  };

  return (
    <EditorLayout
      title="Programs Page"
      description="Edit the Programs page content"
      onSave={handleSave}
      onReset={handleReset}
    >
      {/* Programs Hero */}
      <SectionCard title="Programs Hero" description="Top section of the programs page">
        <InputField
          label="Badge Text"
          value={localContent.programs.badge}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              programs: { ...localContent.programs, badge: value },
            })
          }
        />
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Title"
            value={localContent.programs.title}
            onChange={(value) =>
              setLocalContent({
                ...localContent,
                programs: { ...localContent.programs, title: value },
              })
            }
          />
          <InputField
            label="Highlighted Text"
            value={localContent.programs.highlightedText}
            onChange={(value) =>
              setLocalContent({
                ...localContent,
                programs: { ...localContent.programs, highlightedText: value },
              })
            }
          />
        </div>
        <InputField
          label="Description"
          value={localContent.programs.description}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              programs: { ...localContent.programs, description: value },
            })
          }
          type="textarea"
        />
      </SectionCard>

      {/* Program Cards */}
      <SectionCard title="Program Cards" description="Program categories displayed on the page">
        <ArrayEditor
          items={localContent.programs.programs}
          onUpdate={(programs) =>
            setLocalContent({
              ...localContent,
              programs: { ...localContent.programs, programs },
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
                  label="Icon (Stethoscope, Microscope, BookOpen)"
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
              <InputField
                label="Image URL"
                value={item.image}
                onChange={(value) => updateItem({ ...item, image: value })}
                type="url"
              />
              <InputField
                label="Gradient (e.g., from-blue-500 to-blue-600)"
                value={item.gradient}
                onChange={(value) => updateItem({ ...item, gradient: value })}
              />
            </div>
          )}
          createNew={() => ({
            icon: 'BookOpen',
            title: 'New Program',
            description: 'Program description',
            gradient: 'from-blue-500 to-blue-600',
            image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80',
          })}
          addButtonText="Add Program"
        />
      </SectionCard>
    </EditorLayout>
  );
}
