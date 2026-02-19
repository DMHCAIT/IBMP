'use client';

import { useState } from 'react';
import { useContent } from '@/lib/content-context';
import { defaultContent } from '@/lib/content-data';
import EditorLayout, { SectionCard, InputField, ArrayEditor } from '@/components/admin/EditorLayout';

export default function HomeEditorPage() {
  const { content, updateContent, saveContent } = useContent();
  const [localContent, setLocalContent] = useState({
    hero: { ...content.hero },
    whatWeDo: { ...content.whatWeDo },
    missionVision: { ...content.missionVision },
    stats: { ...content.stats },
    cta: { ...content.cta },
  });

  const handleSave = async () => {
    updateContent('hero', localContent.hero);
    updateContent('whatWeDo', localContent.whatWeDo);
    updateContent('missionVision', localContent.missionVision);
    updateContent('stats', localContent.stats);
    updateContent('cta', localContent.cta);
    await saveContent();
    alert('Home page content saved!');
  };

  const handleReset = () => {
    if (confirm('Reset home page content to defaults?')) {
      setLocalContent({
        hero: { ...defaultContent.hero },
        whatWeDo: { ...defaultContent.whatWeDo },
        missionVision: { ...defaultContent.missionVision },
        stats: { ...defaultContent.stats },
        cta: { ...defaultContent.cta },
      });
    }
  };

  return (
    <EditorLayout
      title="Home Page"
      description="Edit the homepage sections including Hero, What We Do, Mission/Vision, Stats, and CTA"
      onSave={handleSave}
      onReset={handleReset}
    >
      {/* Hero Section */}
      <SectionCard title="Hero Section" description="Main banner content at the top of the homepage">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField
            label="Heading Line 1"
            value={localContent.hero.heading.line1}
            onChange={(value) =>
              setLocalContent({
                ...localContent,
                hero: {
                  ...localContent.hero,
                  heading: { ...localContent.hero.heading, line1: value },
                },
              })
            }
          />
          <InputField
            label="Heading Line 2"
            value={localContent.hero.heading.line2}
            onChange={(value) =>
              setLocalContent({
                ...localContent,
                hero: {
                  ...localContent.hero,
                  heading: { ...localContent.hero.heading, line2: value },
                },
              })
            }
          />
          <InputField
            label="Heading Line 3"
            value={localContent.hero.heading.line3}
            onChange={(value) =>
              setLocalContent({
                ...localContent,
                hero: {
                  ...localContent.hero,
                  heading: { ...localContent.hero.heading, line3: value },
                },
              })
            }
          />
        </div>
        <InputField
          label="Description"
          value={localContent.hero.description}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              hero: { ...localContent.hero, description: value },
            })
          }
          type="textarea"
        />
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Primary Button Text"
            value={localContent.hero.ctaButtons.primary.text}
            onChange={(value) =>
              setLocalContent({
                ...localContent,
                hero: {
                  ...localContent.hero,
                  ctaButtons: {
                    ...localContent.hero.ctaButtons,
                    primary: { ...localContent.hero.ctaButtons.primary, text: value },
                  },
                },
              })
            }
          />
          <InputField
            label="Primary Button Link"
            value={localContent.hero.ctaButtons.primary.href}
            onChange={(value) =>
              setLocalContent({
                ...localContent,
                hero: {
                  ...localContent.hero,
                  ctaButtons: {
                    ...localContent.hero.ctaButtons,
                    primary: { ...localContent.hero.ctaButtons.primary, href: value },
                  },
                },
              })
            }
          />
        </div>
      </SectionCard>

      {/* What We Do Section */}
      <SectionCard title="What We Do Section" description="Services and why choose IBMP">
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Title"
            value={localContent.whatWeDo.title}
            onChange={(value) =>
              setLocalContent({
                ...localContent,
                whatWeDo: { ...localContent.whatWeDo, title: value },
              })
            }
          />
          <InputField
            label="Subtitle"
            value={localContent.whatWeDo.subtitle}
            onChange={(value) =>
              setLocalContent({
                ...localContent,
                whatWeDo: { ...localContent.whatWeDo, subtitle: value },
              })
            }
          />
        </div>
        <InputField
          label="Description"
          value={localContent.whatWeDo.description}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              whatWeDo: { ...localContent.whatWeDo, description: value },
            })
          }
          type="textarea"
        />
        <InputField
          label="Commitment Statement"
          value={localContent.whatWeDo.commitment}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              whatWeDo: { ...localContent.whatWeDo, commitment: value },
            })
          }
          type="textarea"
        />
        
        <div className="pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Services</label>
          <ArrayEditor
            items={localContent.whatWeDo.services}
            onUpdate={(services) =>
              setLocalContent({
                ...localContent,
                whatWeDo: { ...localContent.whatWeDo, services },
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
                    label="Icon (Award, GraduationCap, Users)"
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
              icon: 'Award',
              title: 'New Service',
              description: 'Service description',
              color: 'from-blue-500 to-blue-700',
            })}
            addButtonText="Add Service"
          />
        </div>

        <div className="pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Why Choose IBMP Points</label>
          <ArrayEditor
            items={localContent.whatWeDo.whyChoose}
            onUpdate={(whyChoose) =>
              setLocalContent({
                ...localContent,
                whatWeDo: { ...localContent.whatWeDo, whyChoose },
              })
            }
            renderItem={(item, index, updateItem) => (
              <InputField
                label={`Point ${index + 1}`}
                value={item}
                onChange={(value) => updateItem(value)}
              />
            )}
            createNew={() => 'New point'}
            addButtonText="Add Point"
          />
        </div>
      </SectionCard>

      {/* Mission Vision Section */}
      <SectionCard title="Mission, Vision & Commitment" description="Core principles section">
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Section Tag"
            value={localContent.missionVision.sectionTag}
            onChange={(value) =>
              setLocalContent({
                ...localContent,
                missionVision: { ...localContent.missionVision, sectionTag: value },
              })
            }
          />
          <InputField
            label="Subtitle"
            value={localContent.missionVision.subtitle}
            onChange={(value) =>
              setLocalContent({
                ...localContent,
                missionVision: { ...localContent.missionVision, subtitle: value },
              })
            }
          />
        </div>
        <InputField
          label="Title"
          value={localContent.missionVision.title}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              missionVision: { ...localContent.missionVision, title: value },
            })
          }
        />

        <div className="pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Items</label>
          {localContent.missionVision.items.map((item, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200 mb-4">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <InputField
                  label="Title"
                  value={item.title}
                  onChange={(value) => {
                    const newItems = [...localContent.missionVision.items];
                    newItems[index] = { ...item, title: value };
                    setLocalContent({
                      ...localContent,
                      missionVision: { ...localContent.missionVision, items: newItems },
                    });
                  }}
                />
                <InputField
                  label="Tagline"
                  value={item.tagline}
                  onChange={(value) => {
                    const newItems = [...localContent.missionVision.items];
                    newItems[index] = { ...item, tagline: value };
                    setLocalContent({
                      ...localContent,
                      missionVision: { ...localContent.missionVision, items: newItems },
                    });
                  }}
                />
              </div>
              <InputField
                label="Description"
                value={item.description}
                onChange={(value) => {
                  const newItems = [...localContent.missionVision.items];
                  newItems[index] = { ...item, description: value };
                  setLocalContent({
                    ...localContent,
                    missionVision: { ...localContent.missionVision, items: newItems },
                  });
                }}
                type="textarea"
              />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Stats Section */}
      <SectionCard title="Stats Section" description="Global impact statistics">
        <InputField
          label="Tag"
          value={localContent.stats.tag}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              stats: { ...localContent.stats, tag: value },
            })
          }
        />
        <InputField
          label="Title"
          value={localContent.stats.title}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              stats: { ...localContent.stats, title: value },
            })
          }
        />
        <InputField
          label="Description"
          value={localContent.stats.description}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              stats: { ...localContent.stats, description: value },
            })
          }
          type="textarea"
        />

        <div className="pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Statistics</label>
          <ArrayEditor
            items={localContent.stats.stats}
            onUpdate={(stats) =>
              setLocalContent({
                ...localContent,
                stats: { ...localContent.stats, stats },
              })
            }
            renderItem={(item, index, updateItem) => (
              <div className="grid grid-cols-2 gap-3">
                <InputField
                  label="Value"
                  value={item.value}
                  onChange={(value) => updateItem({ ...item, value })}
                />
                <InputField
                  label="Label"
                  value={item.label}
                  onChange={(value) => updateItem({ ...item, label: value })}
                />
              </div>
            )}
            createNew={() => ({
              value: '100+',
              label: 'New Stat',
              icon: 'Users',
              color: 'from-blue-500 to-blue-600',
            })}
            addButtonText="Add Statistic"
          />
        </div>
      </SectionCard>

      {/* CTA Section */}
      <SectionCard title="Call to Action Section" description="Bottom CTA banner">
        <InputField
          label="Badge Text"
          value={localContent.cta.badge}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              cta: { ...localContent.cta, badge: value },
            })
          }
        />
        <InputField
          label="Title"
          value={localContent.cta.title}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              cta: { ...localContent.cta, title: value },
            })
          }
        />
        <InputField
          label="Subtitle"
          value={localContent.cta.subtitle}
          onChange={(value) =>
            setLocalContent({
              ...localContent,
              cta: { ...localContent.cta, subtitle: value },
            })
          }
          type="textarea"
        />
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Primary Button Text"
            value={localContent.cta.primaryButton.text}
            onChange={(value) =>
              setLocalContent({
                ...localContent,
                cta: {
                  ...localContent.cta,
                  primaryButton: { ...localContent.cta.primaryButton, text: value },
                },
              })
            }
          />
          <InputField
            label="Primary Button Link"
            value={localContent.cta.primaryButton.href}
            onChange={(value) =>
              setLocalContent({
                ...localContent,
                cta: {
                  ...localContent.cta,
                  primaryButton: { ...localContent.cta.primaryButton, href: value },
                },
              })
            }
          />
        </div>

        <div className="pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
          <ArrayEditor
            items={localContent.cta.features}
            onUpdate={(features) =>
              setLocalContent({
                ...localContent,
                cta: { ...localContent.cta, features },
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
                    label="Icon"
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
              icon: 'Zap',
              title: 'New Feature',
              description: 'Feature description',
            })}
            addButtonText="Add Feature"
          />
        </div>
      </SectionCard>
    </EditorLayout>
  );
}
