# Visual Comparison Checklist: Minimal Template vs Empty Studio

**Reference**: https://empty-studio.webflow.io/  
**Test URL**: http://localhost:3000/editar/aurora-cafe-co

## 🎯 Hero Section (Introduction)

### Layout
- [ ] **Navbar Layout**:
  - [ ] Logo on the left
  - [ ] Client name centered (or prominent position)
  - [ ] Validity date + CTA button on the right
  - [ ] Horizontal layout, well-spaced
  
- [ ] **Hero Content**:
  - [ ] Large, prominent title (48px+ font size)
  - [ ] Title is descriptive, not just project name
  - [ ] Client name with avatar/logo below title
  - [ ] Horizontal separator line after client name
  - [ ] Subtitle/description with good line height
  - [ ] Proposal date positioned strategically (possibly absolute)

### Typography
- [ ] Title: Large, bold, high contrast
- [ ] Body text: Readable, good line height (1.5+)
- [ ] Consistent font family throughout

### Spacing
- [ ] Generous top/bottom padding (80px+)
- [ ] Good spacing between elements (24-48px)
- [ ] Not cramped or too spacious

---

## 🎨 About Us Section

### Layout
- [ ] **Header**:
  - [ ] Section title (H2)
  - [ ] Subtitle/description below title
  - [ ] Centered or left-aligned consistently
  
- [ ] **Content Grid**:
  - [ ] 2-column grid for images/videos
  - [ ] First image: Wider aspect (16:9 or similar)
  - [ ] Second image: Taller aspect (9:16 or similar)
  - [ ] Images have captions below
  - [ ] No borders or heavy overlays on images

### Spacing
- [ ] Good gap between images (24-32px)
- [ ] Section padding consistent with hero
- [ ] Captions have breathing room

---

## 🤝 Clients Section

### Header Layout (CRITICAL - Reference: Empty Studio)
```
+--------------------------------+--------------------+
| TITLE                          |                    |
| Long, impactful title          |                    |
| (3-4 lines, left column)       | PARAGRAPHS         |
|                                | (right column,     |
|                                | bottom aligned)    |
+--------------------------------+--------------------+
```

- [ ] **Grid Structure**:
  - [ ] 2x2 asymmetric grid
  - [ ] Left column wider (1.6fr or ~60%)
  - [ ] Right column narrower (1fr or ~40%)
  
- [ ] **Title**:
  - [ ] Left column, top row
  - [ ] Long title (150+ characters)
  - [ ] 3-4 lines of text
  - [ ] Left-aligned
  - [ ] Larger font size (36-48px)
  
- [ ] **Paragraphs**:
  - [ ] Right column, second row
  - [ ] Bottom-aligned within grid
  - [ ] 2 paragraphs stacked
  - [ ] Each paragraph 100+ characters
  - [ ] Smaller font size (16-18px)
  - [ ] Good line height (1.6+)

### Client Logos
- [ ] **Grid**:
  - [ ] 12 client logos total
  - [ ] 3-4 columns on desktop
  - [ ] Equal-sized items
  - [ ] Consistent spacing (gap: 24px+)
  
- [ ] **Logos**:
  - [ ] Placeholder or actual logos
  - [ ] Centered within items
  - [ ] Subtle styling (not too bold)

### Spacing
- [ ] Header section: 80-120px top/bottom padding
- [ ] Good gap between header and logos (48-64px)
- [ ] Logos grid: 24-32px gap

---

## 💎 Expertise Section

### Layout
- [ ] **Header**:
  - [ ] Subtitle (small, uppercase or distinct)
  - [ ] Main title (H2, large)
  - [ ] Centered or left-aligned
  
- [ ] **Topics Grid**:
  - [ ] 3-column grid on desktop
  - [ ] 2-column on tablet
  - [ ] 1-column on mobile
  - [ ] Equal-height items or auto

### Each Topic Item
- [ ] **Structure**:
  - [ ] Icon at top (or left)
  - [ ] Topic title (H3, medium size)
  - [ ] Description (P, 120+ characters)
  - [ ] Vertical layout within item
  
- [ ] **Typography**:
  - [ ] Title: 20-24px, bold
  - [ ] Description: 16-18px, regular
  - [ ] Good line height (1.5+)

### Spacing
- [ ] Topic items: 32-48px gap
- [ ] Internal padding: 24-32px
- [ ] Section padding: 80-120px

---

## 💰 Investment Section

### Layout
- [ ] **Plans Grid**:
  - [ ] 3-column grid (for 3 plans)
  - [ ] Equal width columns
  - [ ] Cards with subtle borders/shadows
  
- [ ] **Each Plan Card**:
  - [ ] Plan name (H3)
  - [ ] Price (large, prominent)
  - [ ] Description/subtitle
  - [ ] Feature list (bullets or checkmarks)
  - [ ] CTA button at bottom
  - [ ] "Best offer" badge (if applicable)

### Spacing
- [ ] Cards: 24-32px gap
- [ ] Internal padding: 32-48px
- [ ] Consistent heights or auto

---

## 📋 Terms & Conditions Section

### Layout
- [ ] **Accordion/Expandable Items**:
  - [ ] Title + icon (expand/collapse)
  - [ ] Content hidden by default
  - [ ] Smooth transition on expand
  
- [ ] **Each Item**:
  - [ ] Clear title
  - [ ] Descriptive content when expanded
  - [ ] Good padding and spacing

---

## 🎨 Overall Design Tokens

### Colors
- [ ] Primary color: #000000 (black)
- [ ] Background: White or light gray
- [ ] Text: Dark gray or black
- [ ] Accents: Consistent with brand

### Typography Scale
- [ ] H1 (Hero): 48-64px
- [ ] H2 (Sections): 36-48px
- [ ] H3 (Subsections): 24-32px
- [ ] Body: 16-18px
- [ ] Small: 14px

### Spacing Scale
- [ ] Section padding: 80-120px vertical
- [ ] Container max-width: 1200-1400px
- [ ] Grid gaps: 24-48px
- [ ] Element spacing: 16-32px

### Responsive Behavior
- [ ] Desktop: Full layout with grids
- [ ] Tablet (768px): Adjusted columns (2-col → 2-col, 3-col → 2-col)
- [ ] Mobile (375px): Single column, stacked layout

---

## 🔍 Detailed Inspection Points

### Empty Studio Specific Details

From reference analysis:

1. **Hero**:
   - Title: "Focus on the Aurore product growing while we cover the brand design and web development services."
   - Client: "Hello, Jesse —"
   - Date: "Proposal — June 22, 2025" (positioned top-right)

2. **Clients Header** (MOST IMPORTANT):
   ```
   Title (left, 60% width):
   "We recognized a gap in the creative industry—small 
   businesses often struggle to find high-quality, yet 
   affordable, design solutions. That's why we exist."
   
   Paragraphs (right, 40% width, bottom-aligned):
   "Your website is most likely the first point of 
   contact someone will have with your brand..."
   
   "Design is about creating experiences, making the 
   lives of people easier..."
   ```

3. **Expertise**:
   - 11 topics shown
   - Each with icon, title, short description
   - "Premium design", "Premium development", "Figma to Webflow", etc.

4. **Investment**:
   - 3 plans side by side
   - "Essencial" plan repeated (demo data)
   - Price: "R$ 3.200"
   - "Melhor oferta!" badge on middle plan

---

## ✅ Testing Checklist

### Manual Testing Steps

1. **Open Proposal**:
   ```bash
   # Make sure dev server is running
   npm run dev
   
   # Navigate to:
   http://localhost:3000/editar/aurora-cafe-co
   ```

2. **Compare Side-by-Side**:
   - Open Empty Studio in one window: https://empty-studio.webflow.io/
   - Open your proposal in another: http://localhost:3000/editar/aurora-cafe-co
   - Use browser dev tools to inspect element sizes

3. **Check Each Section**:
   - Go through checklist above
   - Mark items as complete ✅ or needs work ❌
   - Take notes on specific issues

4. **Measure Specifics**:
   - Use browser inspector to check:
     - Font sizes
     - Padding/margin values
     - Grid template columns
     - Element positions
     - Colors (hex values)

5. **Responsive Testing**:
   - Resize browser to test breakpoints:
     - Desktop: 1440px
     - Tablet: 768px
     - Mobile: 375px

---

## 🐛 Common Issues to Look For

- [ ] **Spacing too tight** (increase padding/margin)
- [ ] **Typography too small** (increase font sizes)
- [ ] **Grid columns incorrect** (check grid-template-columns)
- [ ] **Alignment off** (check flex/grid alignment)
- [ ] **Content too short** (AI generating short text)
- [ ] **Missing elements** (sections not rendering)
- [ ] **Color inconsistency** (not using mainColor prop)
- [ ] **Responsive breaks** (layout breaking on mobile)

---

## 📸 Screenshot Comparison

**Recommended Tool**: Use browser extensions like:
- Overlay for comparing layouts
- PixelSnap for measuring
- WhatFont for checking typography

**OR** Run automated visual regression with:
```bash
npm run test:e2e:visual
```

---

## 🎯 Success Criteria

**Proposal passes visual validation if**:
- ✅ 90%+ of checklist items are complete
- ✅ Clients section header matches 2x2 grid layout
- ✅ Typography sizes are within 10% of reference
- ✅ Spacing is consistent and generous
- ✅ All sections render correctly
- ✅ Content is AI-generated and complete (not fallback)
- ✅ Responsive layout works on mobile

