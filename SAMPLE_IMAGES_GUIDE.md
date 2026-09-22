# Sample Image Generation Guide

## Overview

This guide helps you generate or prepare sample teaching schematic images for the Pain Medicine assessment questions, particularly Q41-Q60 which are marked as "image-based" questions.

---

## Question Types & Images

### MCQ Questions (Q01-Q40)
- No images required
- Pure text-based MCQs with 4 options

### Image-Based Questions (Q41-Q60)
- **Q41:** Pain assessment scale (visual scale 0-10)
- **Q42:** Observation chart (vital signs table)
- **Q43:** Lumbar anatomy diagram (cross-section)
- **Q44:** Posterior spinal structures (side view)
- **Q45:** Ultrasound pattern (nerve + vessel)
- **Q46:** Joint assessment schematic (knee effusion)
- **Q47:** Pain pattern chart (time-intensity graph)
- **Q48:** Body diagram (pain distribution)
- **Q49:** Regional pain findings (CRPS indicators)
- **Q50:** Implanted therapy schematic (spinal cord stimulation)

---

## Image Source Options

### Option 1: Use Existing Teaching Materials
- Medical textbooks (with permissions)
- Journal articles (open access)
- Online medical databases
- Your institution's teaching slides

### Option 2: Create Simple Diagrams

#### Using Free Online Tools

**PlantUML** (free, open-source)
```bash
# Install
npm install -g plantuml

# Example: Create a simple spinal diagram
cat > diagram.puml << 'EOF'
@startuml
!define COLOR_NORMAL #E8E8E8
!define COLOR_SELECTED #FF6B6B

skinparam backgroundColor COLOR_NORMAL

rectangle "Spinal Cord" {
    rectangle "L4-L5 Disc Level" {
        circle "Nerve Root" as nerve
        rectangle "Disc Herniation (X)" as hernia #FF9999
    }
}

nerve --> hernia
@enduml
EOF

# Generate PNG
plantuml -Tpng diagram.puml
```

**Diagrams.net** (Free web-based)
1. Go to https://diagrams.net
2. Create diagram (anatomy, charts, etc.)
3. Export as PNG
4. Download

**Canva** (Free tier available)
1. https://www.canva.com
2. Search "medical diagram"
3. Create custom version
4. Download as PNG

**Google Drawings** (Free)
1. https://docs.google.com/drawings
2. Create shape-based diagram
3. Download as PNG

### Option 3: Use AI Image Generation

**DALL-E / Midjourney Prompts:**
```
"Medical teaching schematic: lumbar spine L4-L5 cross-section showing nerve root compression"
"Clinical observation chart for opioid safety with respiratory rate, pulse, and sedation columns"
"Pain assessment visual analog scale from 0 to 10"
"Ultrasound anatomy showing peripheral nerve cross-section next to blood vessel"
```

### Option 4: Screenshot Medical Resources

**Open-Access Medical Websites:**
- Wikimedia Commons (medical images)
- NIH Image Gallery
- OpenStax Anatomy & Physiology
- Khan Academy Medical Videos

---

## Image Specifications

### Requirements
- **Format:** PNG or JPG
- **Dimensions:** 512×512 to 800×600 pixels (portrait or landscape)
- **Resolution:** 72-150 DPI (screen display)
- **File Size:** < 2 MB each
- **Colors:** Clear, high contrast for readability
- **Text:** Minimal, clear, readable at small sizes

### Naming Convention
```
Q41_pain_assessment_scale.png
Q42_observation_chart.png
Q43_lumbar_anatomy.png
Q44_facet_joint_innervation.png
Q45_nerve_ultrasound.png
Q46_knee_effusion.png
Q47_breakthrough_pain_pattern.png
Q48_peripheral_neuropathy_distribution.png
Q49_crps_indicators.png
Q50_spinal_cord_stimulation.png
```

---

## Upload Process

### Via Admin Panel

1. **Navigate to question:**
   - Go to `/admin/assessment/papers/{paperId}/questions`
   - Find Q41-Q60

2. **Edit question:**
   - Click "Edit" button
   - Scroll to "Question Image" section

3. **Upload image:**
   - Click file input
   - Select PNG or JPG
   - Image uploads to Supabase
   - URL auto-populates

4. **Save:**
   - Click "Update Question"
   - Changes persist automatically

### Via API

```bash
# Upload image
curl -X POST http://localhost:3000/api/upload \
  -F "file=@path/to/Q41_pain_scale.png" \
  -F "bucket=assessment-images"

# Response:
# {
#   "url": "https://..../assessment-images/pain-medicine/Q41_pain_scale.png"
# }

# Then update question with URL
curl -X PUT http://localhost:3000/api/admin/assessment/questions/{questionId} \
  -H "Content-Type: application/json" \
  -d '{
    "image_url": "https://..../assessment-images/pain-medicine/Q41_pain_scale.png"
  }'
```

### Batch Upload Script

```bash
#!/bin/bash
# upload-images.sh

BUCKET="assessment-images"
IMAGES_DIR="./sample-images"

for image in $IMAGES_DIR/*.png; do
  echo "Uploading $(basename $image)..."
  curl -X POST http://localhost:3000/api/upload \
    -F "file=@$image" \
    -F "bucket=$BUCKET"
done

echo "✅ All images uploaded"
```

---

## Sample Image Content Suggestions

### Q41: Pain Assessment Scale
**Visual:**
- Horizontal line marked 0 to 10
- "No Pain" on left, "Worst Pain" on right
- Cursor/arrow at 7
- Color gradient (green → red)

**Tools:** Canva, Google Drawings, or simple SVG

### Q42: Observation Chart
**Visual:**
- Table with columns: Time, Respiration, Pulse, SpO2, Sedation
- Sample data rows
- Highlighted row showing concerning values (RR=8)

**Tools:** Excel → PNG, Google Sheets screenshot, Canva

### Q43: Lumbar Anatomy
**Visual:**
- Cross-section view at L4-L5
- Labels: disc, dura, nerve root, CSF
- "X" marking compression point

**Tools:** Wikimedia Commons, BioRender, PlantUML

### Q44: Facet Joint
**Visual:**
- Side view of lumbar spine
- Two adjacent vertebrae
- Highlighted facet joint (zygapophyseal)
- Medial branch nerve pathway

**Tools:** Anatomical diagram tools, Canva

### Q45: Ultrasound Pattern
**Visual:**
- Two circular structures in cross-section
- Left: nerve (smaller, with fascicles)
- Right: blood vessel (smooth, darker)
- Color Doppler overlay on vessel

**Tools:** DALL-E, medical imaging simulation

### Q46: Joint Effusion
**Visual:**
- Knee joint longitudinal view
- Suprapatellar recess
- Distended fluid collection (X marking)
- Labels: Quadriceps, patella, fluid

**Tools:** Canva, medical diagram tools

### Q47: Pain Pattern Chart
**Visual:**
- X-axis: Time (hours)
- Y-axis: Pain intensity (0-10)
- Baseline line at moderate level
- Spikes showing breakthrough episodes

**Tools:** Excel chart → screenshot, Plotly

### Q48: Neuropathy Distribution
**Visual:**
- Body diagram (feet/legs highlighted)
- Symmetrical stocking distribution shading
- Color gradient showing affected areas
- Labels: ankle, sole, calf

**Tools:** Body diagram templates, Canva

### Q49: CRPS Findings
**Visual:**
- Limb showing:
  - Color changes (red/blue mottling)
  - Swelling
  - Temperature asymmetry (heat halo)
  - Skin texture changes

**Tools:** Illustrated diagram, Canva

### Q50: SCS Device
**Visual:**
- Sagittal view of spine
- Paddle electrode in epidural space
- Battery/generator subcutaneously implanted
- Connecting leads shown

**Tools:** Medical illustration, Canva, BioRender

---

## Free Resources for Medical Images

| Site | Type | License |
|------|------|---------|
| [Wikimedia Commons](https://commons.wikimedia.org) | Medical photos/diagrams | CC/Public Domain |
| [OpenStax](https://openstax.org) | Textbook diagrams | CC BY 4.0 |
| [NIH Image Gallery](https://www.nih.gov/news-events/news-releases) | Medical images | Public Domain |
| [Khan Academy](https://www.khanacademy.org) | Educational videos (screenshot) | CC BY-NC-SA |
| [Unsplash](https://unsplash.com) | General photos | CC0 |
| [Pixabay](https://pixabay.com) | General photos | CC0 |

---

## Create Sample Images (Quick Method)

### Using Google Drawings (No Tools Needed)

1. **Go to:** https://docs.google.com/drawings/create

2. **Create Pain Scale (Q41):**
   ```
   - Draw rectangle (axis)
   - Add text: "0" and "10"
   - Add gradient (light to red)
   - Add arrow at 7
   - Download as PNG
   ```

3. **Create Chart (Q42):**
   ```
   - Insert table
   - Fill with sample data
   - Highlight concerning row
   - Download as PNG
   ```

4. **Create Anatomy (Q43):**
   ```
   - Use shapes (circles, rectangles)
   - Add labels with text tool
   - Draw nerve root as line
   - Mark compression with "X"
   - Download as PNG
   ```

5. **Repeat for Q44-Q50**

**Total Time:** ~30 minutes for all 10 images

---

## Upload Sample Images

### Quick Start

```bash
# Create directory
mkdir -p sample-images

# Download a sample image
wget https://example.com/sample_pain_scale.png -O sample-images/Q41_pain_scale.png

# Or use placeholder:
convert -size 512x512 xc:white -pointsize 20 \
  -fill black -gravity center \
  -annotate 0 "Q41: Pain Assessment\n(Placeholder)" \
  sample-images/Q41_pain_scale.png

# Upload via admin panel or script
node upload-question-images.mjs pain-medicine
```

### Verify Upload

```bash
# Check that image URL saved to database
psql -d assessment_db -c "
  SELECT question_number, image_url 
  FROM assessment_questions
  WHERE paper_id = '{paperId}' 
    AND question_number >= 'Q41'
  ORDER BY sort_order;
"

# Should show URLs like:
# Q41 | https://....jpg
# Q42 | https://....png
# ...
```

---

## Optional: Create Placeholder Images

If you don't have specific images yet, create simple placeholders:

```bash
#!/bin/bash
# create-placeholders.sh

for i in {41..50}; do
  Q=$(printf "Q%02d" $i)
  
  # Create simple placeholder
  convert -size 512x512 xc:lightgray \
    -pointsize 16 -fill black -gravity center \
    -annotate 0 "$Q: [Image Placeholder]\nReplace with actual schematic" \
    sample-images/${Q}_placeholder.png
  
  echo "✅ Created $Q placeholder"
done
```

Then upload through admin panel:
1. Edit Q41
2. Upload `Q41_placeholder.png`
3. Edit Q42
4. Upload `Q42_placeholder.png`
5. ... and so on

Later, replace placeholders with actual images by editing the question again and uploading the real image.

---

## Summary

✅ **No images required** to start - All 60 MCQ questions work without images  
✅ **Optional for Q41-Q60** - Add teaching schematics to enhance understanding  
✅ **Easy to upload** - Drag & drop in admin panel  
✅ **Easy to replace** - Edit question and upload new image anytime  
✅ **Free tools available** - Google Drawings, Canva, Diagrams.net  

**Next Steps:**
1. Seed your questions
2. Access admin panel
3. For Q41-Q60, click Edit
4. Upload image (or skip for now)
5. Update question
6. Add images anytime later

---

## Resources

- [IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md) - Full system overview
- [PAIN_MEDICINE_SEEDING_GUIDE.md](./PAIN_MEDICINE_SEEDING_GUIDE.md) - Detailed documentation
- [SEEDING_QUICK_START.md](./SEEDING_QUICK_START.md) - Quick setup guide
