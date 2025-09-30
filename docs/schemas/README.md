# Database Schema Documentation

## Overview

This document describes the database schema for the template-based proposal system. The system supports three different proposal templates: **New**, **Flash**, and **Prime**. Each template has its own set of tables to store template-specific data, while sharing a common projects table for basic project information.

## Architecture

The database follows a **hybrid approach**:
- **Main Projects Table**: Stores basic project information (name, client, status, template type)
- **Template-Specific Tables**: Store template-specific sections and fields
- **User Management**: Links projects to users through the existing user system

```
User → Project → Template-Specific Tables
```

## Core Tables

### Projects Table (`projects`)
**Purpose**: Stores basic project information shared across all templates

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `personId` | UUID | References `person_user.id` |
| `projectName` | String | Project name |
| `clientName` | String | Client name |
| `templateType` | Enum | "new", "flash", "prime" |
| `projectStatus` | Enum | "active", "approved", "negotiation", "rejected", "draft", "expired", "archived" |
| `mainColor` | String | Template color theme |
| `companyName` | String | Company name |
| `companyEmail` | String | Company email |
| `projectUrl` | String | Public URL for proposal |
| `pagePassword` | String | Password protection |
| `isProposalGenerated` | Boolean | Whether proposal is finalized |
| `projectSentDate` | Date | When proposal was sent |
| `projectVisualizationDate` | Date | When proposal was viewed |
| `created_at` | Timestamp | Creation date |
| `updated_at` | Timestamp | Last update |

### User Table (`person_user`)
**Purpose**: Stores user information linked to Clerk authentication

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `email` | String | User email (linked to Clerk) |
| `firstName` | String | First name |
| `lastName` | String | Last name |
| `userName` | String | Username |

---

## New Template Schema

The **New Template** is designed for comprehensive business proposals with detailed sections.

### Core Sections

#### 1. Introduction (`new_template_introduction`)
**Purpose**: Company and client information with photo gallery

| Field | Type | Required | Can Hide? | Description |
|-------|------|----------|-----------|-------------|
| `projectId` | UUID | ✅ | ❌ | References projects table |
| `companyName` | String | ❌ | ✅ | Company name |
| `companyLogo` | String | ❌ | ✅ | Company logo URL |
| `buttonTitle` | String | ✅ | ❌ | CTA button text |
| `clientName` | String | ✅ | ❌ | Client name |
| `clientPhoto` | String | ❌ | ✅ | Client photo URL |
| `title` | String | ✅ | ❌ | Proposal title |
| `validity` | Date | ✅ | ❌ | Proposal validity date |

**Related Tables:**
- `new_template_introduction_photos`: Photo gallery (each photo can be hidden)

#### 2. About Us (`new_template_about_us`)
**Purpose**: Company information and team presentation

| Field | Type | Required | Can Hide? | Description |
|-------|------|----------|-----------|-------------|
| `projectId` | UUID | ✅ | Section | References projects table |
| `validity` | Date | ✅ | ❌ | Section validity |
| `title` | String | ✅ | ❌ | Section title |
| `subtitle` | String | ❌ | ✅ | Section subtitle |
| `mainDescription` | String | ❌ | ✅ | Main description |
| `additionalDescription1` | String | ❌ | ✅ | Additional description 1 |
| `additionalDescription2` | String | ❌ | ✅ | Additional description 2 |

**Related Tables:**
- `new_template_about_us_team`: Team members (photo + description, each can be hidden)
- `new_template_about_us_marquee`: Service names marquee (each can be hidden)

#### 3. Clients (`new_template_clients`)
**Purpose**: Client logos and references

| Field | Type | Required | Can Hide? | Description |
|-------|------|----------|-----------|-------------|
| `projectId` | UUID | ✅ | Section | References projects table |

**Related Tables:**
- `new_template_clients_list`: Client entries (logo + name, each can be hidden)

#### 4. Expertise (`new_template_expertise`)
**Purpose**: Service expertise and capabilities

| Field | Type | Required | Can Hide? | Description |
|-------|------|----------|-----------|-------------|
| `projectId` | UUID | ✅ | Section | References projects table |
| `tagline` | String | ❌ | ✅ | Expertise tagline |
| `title` | String | ❌ | ✅ | Section title |

**Related Tables:**
- `new_template_expertise_topics`: Expertise topics (title + description, each can be hidden)

#### 5. Plans (`new_template_plans`)
**Purpose**: Pricing plans and packages

| Field | Type | Required | Can Hide? | Description |
|-------|------|----------|-----------|-------------|
| `projectId` | UUID | ✅ | Section | References projects table |
| `title` | String | ❌ | ✅ | Section title |
| `subtitle` | String | ✅ | ❌ | Section subtitle |

**Related Tables:**
- `new_template_plans_list`: Individual plans (title, description, price, period, button)
- `new_template_plans_included_items`: Items included in each plan

#### 6. Terms and Conditions (`new_template_terms_conditions`)
**Purpose**: Legal terms and conditions

| Field | Type | Required | Can Hide? | Description |
|-------|------|----------|-----------|-------------|
| `projectId` | UUID | ✅ | Section | References projects table |
| `title` | String | ✅ | ❌ | Section title |

**Related Tables:**
- `new_template_terms_conditions_list`: Individual terms (title + description, each can be hidden)

#### 7. FAQ (`new_template_faq`)
**Purpose**: Frequently asked questions

| Field | Type | Required | Can Hide? | Description |
|-------|------|----------|-----------|-------------|
| `projectId` | UUID | ✅ | Section | References projects table |

**Related Tables:**
- `new_template_faq_list`: FAQ entries (question + answer, each can be hidden)

#### 8. Footer (`new_template_footer`)
**Purpose**: Final call to action and contact information

| Field | Type | Required | Can Hide? | Description |
|-------|------|----------|-----------|-------------|
| `projectId` | UUID | ✅ | ❌ | References projects table |
| `callToAction` | String | ✅ | ❌ | CTA text |
| `validity` | Date | ✅ | ❌ | Proposal validity |
| `email` | String | ✅ | ❌ | Contact email |
| `whatsapp` | String | ✅ | ❌ | WhatsApp contact |

**Related Tables:**
- `new_template_footer_marquee`: Service names marquee (inherited from About Us)

---

## Flash Template Schema

The **Flash Template** is designed for quick, conversion-focused proposals.

### Core Sections

#### 1. Introduction (`flash_template_introduction`)
**Purpose**: Quick introduction with services

| Field | Type | Required | Can Hide? | Description |
|-------|------|----------|-----------|-------------|
| `projectId` | UUID | ✅ | ❌ | References projects table |
| `name` | String | ✅ | ❌ | Professional name |
| `email` | String | ✅ | ❌ | Contact email |
| `buttonTitle` | String | ✅ | ❌ | CTA button text |
| `title` | String | ✅ | ❌ | Proposal title |
| `validity` | Date | ✅ | ❌ | Proposal validity |
| `subtitle` | String | ❌ | ✅ | Proposal subtitle |

**Related Tables:**
- `flash_template_introduction_services`: Service list (each can be hidden)

#### 2. About Us (`flash_template_about_us`)
**Purpose**: Brief company information

| Field | Type | Required | Can Hide? | Description |
|-------|------|----------|-----------|-------------|
| `projectId` | UUID | ✅ | Section | References projects table |
| `title` | String | ❌ | ✅ | Section title |
| `supportText` | String | ❌ | ✅ | Supporting text |
| `subtitle` | String | ❌ | ✅ | Section subtitle |

#### 3. Team (`flash_template_team`)
**Purpose**: Team member showcase

| Field | Type | Required | Can Hide? | Description |
|-------|------|----------|-----------|-------------|
| `projectId` | UUID | ✅ | Section | References projects table |
| `title` | String | ✅ | ❌ | Section title |

**Related Tables:**
- `flash_template_team_members`: Team members (photo, name, role - each field can be hidden)

#### 4. Expertise (`flash_template_expertise`)
**Purpose**: Service expertise

| Field | Type | Required | Can Hide? | Description |
|-------|------|----------|-----------|-------------|
| `projectId` | UUID | ✅ | Section | References projects table |
| `title` | String | ❌ | ✅ | Section title |

**Related Tables:**
- `flash_template_expertise_topics`: Expertise areas (title + description, each can be hidden)

#### 5. Results (`flash_template_results`)
**Purpose**: Client results and ROI data

| Field | Type | Required | Can Hide? | Description |
|-------|------|----------|-----------|-------------|
| `projectId` | UUID | ✅ | Section | References projects table |

**Related Tables:**
- `flash_template_results_list`: Results (photo, name, Instagram, invested amount, return amount)

#### 6. Clients (`flash_template_clients`)
**Purpose**: Client testimonials through logos

| Field | Type | Required | Can Hide? | Description |
|-------|------|----------|-----------|-------------|
| `projectId` | UUID | ✅ | Section | References projects table |

**Related Tables:**
- `flash_template_clients_list`: Client entries (logo + name, each can be hidden)

#### 7. Steps (`flash_template_steps`)
**Purpose**: Process methodology

| Field | Type | Required | Can Hide? | Description |
|-------|------|----------|-----------|-------------|
| `projectId` | UUID | ✅ | Section | References projects table |
| `title` | String | ❌ | ✅ | Section title |

**Related Tables:**
- `flash_template_steps_topics`: Process steps (name + description, each can be hidden)
- `flash_template_steps_marquee`: Service names marquee (each can be hidden)

#### 8. CTA (`flash_template_cta`)
**Purpose**: Call to action section

| Field | Type | Required | Can Hide? | Description |
|-------|------|----------|-----------|-------------|
| `projectId` | UUID | ✅ | Section | References projects table |
| `title` | String | ✅ | ❌ | CTA title |
| `buttonTitle` | String | ✅ | ❌ | Button text |
| `backgroundImage` | String | ✅ | ❌ | Background image URL |

#### 9. Testimonials (`flash_template_testimonials`)
**Purpose**: Client testimonials

| Field | Type | Required | Can Hide? | Description |
|-------|------|----------|-----------|-------------|
| `projectId` | UUID | ✅ | Section | References projects table |

**Related Tables:**
- `flash_template_testimonials_list`: Testimonials (photo, text, name, role - each can be hidden)

#### 10. Investment (`flash_template_investment`)
**Purpose**: Investment section header

| Field | Type | Required | Can Hide? | Description |
|-------|------|----------|-----------|-------------|
| `projectId` | UUID | ✅ | Section | References projects table |
| `title` | String | ✅ | ❌ | Section title |

#### 11. Deliverables (`flash_template_deliverables`)
**Purpose**: What will be delivered

| Field | Type | Required | Can Hide? | Description |
|-------|------|----------|-----------|-------------|
| `projectId` | UUID | ✅ | Section | References projects table |
| `title` | String | ✅ | ❌ | Section title |

**Related Tables:**
- `flash_template_deliverables_list`: Deliverable items (name + content, each can be hidden)

#### 12. Plans (`flash_template_plans`)
**Purpose**: Pricing plans

| Field | Type | Required | Can Hide? | Description |
|-------|------|----------|-----------|-------------|
| `projectId` | UUID | ✅ | Section | References projects table |

**Related Tables:**
- `flash_template_plans_list`: Plans (title, description, price, period, button)
- `flash_template_plans_included_items`: Items included in each plan

#### 13. Terms and Conditions (`flash_template_terms_conditions`)
**Purpose**: Legal terms (cannot be hidden)

| Field | Type | Required | Can Hide? | Description |
|-------|------|----------|-----------|-------------|
| `projectId` | UUID | ✅ | ❌ | References projects table |
| `title` | String | ✅ | ❌ | Section title |

**Related Tables:**
- `flash_template_terms_conditions_list`: Terms (title + description, each can be hidden)

#### 14. FAQ (`flash_template_faq`)
**Purpose**: Frequently asked questions

| Field | Type | Required | Can Hide? | Description |
|-------|------|----------|-----------|-------------|
| `projectId` | UUID | ✅ | Section | References projects table |
| `title` | String | ❌ | ✅ | Section title |

**Related Tables:**
- `flash_template_faq_list`: FAQ entries (question + answer, each can be hidden)

#### 15. Footer (`flash_template_footer`)
**Purpose**: Final message and validity

| Field | Type | Required | Can Hide? | Description |
|-------|------|----------|-----------|-------------|
| `projectId` | UUID | ✅ | Section | References projects table |
| `thankYouMessage` | String | ✅ | ❌ | Thank you message |
| `ctaMessage` | String | ✅ | ❌ | CTA message |
| `disclaimer` | String | ❌ | ✅ | Legal disclaimer |
| `validity` | String | ✅ | ❌ | Proposal validity |

**Related Tables:**
- `flash_template_footer_marquee`: Button titles from introduction

---

## Prime Template Schema

The **Prime Template** is designed for premium, detailed business proposals.

### Core Sections

#### 1. Introduction (`prime_template_introduction`)
**Purpose**: Professional introduction with member showcase

| Field | Type | Required | Can Hide? | Description |
|-------|------|----------|-----------|-------------|
| `projectId` | UUID | ✅ | ❌ | References projects table |
| `name` | String | ✅ | ❌ | Professional name |
| `validity` | Date | ✅ | ❌ | Proposal validity |
| `email` | String | ✅ | ❌ | Contact email |
| `title` | String | ✅ | ❌ | Proposal title |
| `subtitle` | String | ✅ | ❌ | Proposal subtitle |
| `buttonTitle` | String | ✅ | ❌ | CTA button text |
| `photo` | String | ❌ | ✅ | Professional photo |
| `memberName` | String | ❌ | ✅ | Member name |

**Related Tables:**
- `prime_template_introduction_marquee`: Service names marquee (each can be hidden)

#### 2. About Us (`prime_template_about_us`)
**Purpose**: Detailed company information

| Field | Type | Required | Can Hide? | Description |
|-------|------|----------|-----------|-------------|
| `projectId` | UUID | ✅ | Section | References projects table |
| `title` | String | ✅ | ❌ | Section title |
| `paragraph1` | String | ❌ | ✅ | First paragraph |
| `paragraph2` | String | ❌ | ✅ | Second paragraph |

#### 3. Team (`prime_template_team`)
**Purpose**: Team member showcase

| Field | Type | Required | Can Hide? | Description |
|-------|------|----------|-----------|-------------|
| `projectId` | UUID | ✅ | Section | References projects table |
| `title` | String | ❌ | ✅ | Section title |

**Related Tables:**
- `prime_template_team_members`: Team members (photo, name, role - each can be hidden)

#### 4. Expertise (`prime_template_expertise`)
**Purpose**: Service expertise

| Field | Type | Required | Can Hide? | Description |
|-------|------|----------|-----------|-------------|
| `projectId` | UUID | ✅ | Section | References projects table |
| `title` | String | ✅ | ❌ | Section title |

**Related Tables:**
- `prime_template_expertise_topics`: Expertise areas (title + description, each can be hidden)

#### 5. Results (`prime_template_results`)
**Purpose**: Client results showcase

| Field | Type | Required | Can Hide? | Description |
|-------|------|----------|-----------|-------------|
| `projectId` | UUID | ✅ | Section | References projects table |
| `title` | String | ✅ | ❌ | Section title |

**Related Tables:**
- `prime_template_results_list`: Results (photo, name, Instagram, invested, return amounts)

#### 6. Clients (`prime_template_clients`)
**Purpose**: Client portfolio

| Field | Type | Required | Can Hide? | Description |
|-------|------|----------|-----------|-------------|
| `projectId` | UUID | ✅ | Section | References projects table |

**Related Tables:**
- `prime_template_clients_list`: Client entries (logo + name, each can be hidden)

#### 7. CTA (`prime_template_cta`)
**Purpose**: Call to action

| Field | Type | Required | Can Hide? | Description |
|-------|------|----------|-----------|-------------|
| `projectId` | UUID | ✅ | Section | References projects table |
| `title` | String | ✅ | ❌ | CTA title |
| `buttonTitle` | String | ✅ | ❌ | Button text |
| `backgroundImage` | String | ✅ | ❌ | Background image |

#### 8. Steps (`prime_template_steps`)
**Purpose**: Process methodology

| Field | Type | Required | Can Hide? | Description |
|-------|------|----------|-----------|-------------|
| `projectId` | UUID | ✅ | Section | References projects table |
| `title` | String | ❌ | ✅ | Section title |

**Related Tables:**
- `prime_template_steps_topics`: Process steps (name + description, each can be hidden)

#### 9. Testimonials (`prime_template_testimonials`)
**Purpose**: Client testimonials

| Field | Type | Required | Can Hide? | Description |
|-------|------|----------|-----------|-------------|
| `projectId` | UUID | ✅ | Section | References projects table |

**Related Tables:**
- `prime_template_testimonials_list`: Testimonials (photo, text, name, role - each can be hidden)

#### 10. Investment (`prime_template_investment`)
**Purpose**: Investment information

| Field | Type | Required | Can Hide? | Description |
|-------|------|----------|-----------|-------------|
| `projectId` | UUID | ✅ | Section | References projects table |
| `title` | String | ✅ | ❌ | Section title |

#### 11. Deliverables (`prime_template_deliverables`)
**Purpose**: Project deliverables (cannot be hidden)

| Field | Type | Required | Can Hide? | Description |
|-------|------|----------|-----------|-------------|
| `projectId` | UUID | ✅ | ❌ | References projects table |
| `title` | String | ✅ | ❌ | Section title |

**Related Tables:**
- `prime_template_deliverables_list`: Deliverable items (name + content, each can be hidden)

#### 12. Plans (`prime_template_plans`)
**Purpose**: Pricing plans

| Field | Type | Required | Can Hide? | Description |
|-------|------|----------|-----------|-------------|
| `projectId` | UUID | ✅ | Section | References projects table |
| `title` | String | ✅ | ❌ | Section title |

**Related Tables:**
- `prime_template_plans_list`: Plans (title, description, price, period, button)
- `prime_template_plans_included_items`: Items included in each plan

#### 13. Terms and Conditions (`prime_template_terms_conditions`)
**Purpose**: Legal terms

| Field | Type | Required | Can Hide? | Description |
|-------|------|----------|-----------|-------------|
| `projectId` | UUID | ✅ | Section | References projects table |
| `title` | String | ✅ | ❌ | Section title |

**Related Tables:**
- `prime_template_terms_conditions_list`: Terms (title + description, each can be hidden)

#### 14. FAQ (`prime_template_faq`)
**Purpose**: Frequently asked questions

| Field | Type | Required | Can Hide? | Description |
|-------|------|----------|-----------|-------------|
| `projectId` | UUID | ✅ | Section | References projects table |
| `subtitle` | String | ❌ | ✅ | Section subtitle |

**Related Tables:**
- `prime_template_faq_list`: FAQ entries (question + answer, each can be hidden)

#### 15. Footer (`prime_template_footer`)
**Purpose**: Final section (cannot be hidden)

| Field | Type | Required | Can Hide? | Description |
|-------|------|----------|-----------|-------------|
| `projectId` | UUID | ✅ | ❌ | References projects table |
| `thankYouTitle` | String | ❌ | ✅ | Thank you title |
| `thankYouMessage` | String | ❌ | ✅ | Thank you message |
| `disclaimer` | String | ❌ | ✅ | Legal disclaimer |
| `email` | String | ✅ | ❌ | Contact email (from intro) |
| `buttonTitle` | String | ✅ | ❌ | Button title (from intro) |
| `validity` | Date | ✅ | ❌ | Proposal validity |

---

## Common Patterns

### Field Types
- **UUID**: Primary keys and foreign keys
- **String**: Text fields (titles, descriptions, names)
- **Date/Timestamp**: Validity dates, creation dates
- **Boolean**: Hide/show flags
- **Decimal**: Pricing and financial amounts
- **Integer**: Sort order, counters

### Hide/Show System
Each template supports granular visibility control:
- **Section Level**: Entire sections can be hidden
- **Field Level**: Individual fields can be hidden
- **Record Level**: Individual items in arrays can be hidden

### Relationships
- **One-to-One**: Project → Template Section
- **One-to-Many**: Template Section → Template Items
- **Cascade Delete**: When project is deleted, all template data is deleted

### Timestamps
All tables include:
- `created_at`: When record was created
- `updated_at`: When record was last modified
- `deleted_at`: Soft delete support

## API Endpoints

### Template-Specific Routes
Each template has its own API namespace:

```
/api/flash/     - Flash template operations
/api/prime/     - Prime template operations  
/api/new/       - New template operations
```

### Available Operations
- **GET** `/api/{template}/` - List projects
- **GET** `/api/{template}/[id]` - Get single project
- **POST** `/api/{template}/draft` - Save draft
- **POST** `/api/{template}/finish` - Finalize project
- **PUT** `/api/{template}/` - Update project status
- **PATCH** `/api/{template}/` - Bulk update projects

## Migration Notes

To apply the schema to your database:

1. **Generate Migration**:
   ```bash
   npm run migrations
   ```

2. **Apply Migration**:
   ```bash
   npm run push
   ```

3. **Verify Tables**: All 97 tables should be created successfully

## Development Guidelines

### Adding New Fields
1. Update the appropriate template schema file
2. Generate and apply migration
3. Update API routes to handle new fields
4. Update frontend forms and components

### Adding New Templates
1. Create new template schema directory
2. Follow existing pattern of section-based files
3. Export from main schema index
4. Create corresponding API routes
5. Update frontend to support new template

### Data Integrity
- Always use foreign key constraints
- Implement proper cascade deletion
- Use unique constraints where appropriate
- Validate required fields in API routes

---

## Summary

This schema provides a flexible, scalable foundation for multi-template proposal system with:

- ✅ **Template Isolation**: Each template has dedicated tables
- ✅ **Granular Control**: Hide/show any section or field
- ✅ **Type Safety**: Full TypeScript support with Drizzle ORM
- ✅ **User Security**: Proper authentication and ownership validation
- ✅ **API Consistency**: RESTful endpoints for each template
- ✅ **Future-Proof**: Easy to extend with new templates or fields