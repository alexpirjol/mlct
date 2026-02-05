# MediaCard Block

A highly configurable media card component that supports flexible layouts, rich text content, and call-to-action buttons.

## Features

### Display Types

- **Image on Top** (`imageTop`) - Traditional card layout with image above content
- **Image on Bottom** (`imageBottom`) - Inverted layout with content above image
- **Image on Left** (`imageLeft`) - Horizontal layout with image on the left
- **Image on Right** (`imageRight`) - Horizontal layout with image on the right

### Image/Content Ratio (for horizontal layouts)

When using `imageLeft` or `imageRight`, you can control the ratio of image to content:

- **25% Image / 75% Content** (`quarter`)
- **33% Image / 66% Content** (`third`)
- **50% Image / 50% Content** (`half`) - Default
- **66% Image / 33% Content** (`twoThirds`)
- **75% Image / 25% Content** (`threeQuarters`)

### Content Options

- **Media** (required) - Upload or select an image from the media library
- **Title** (optional) - Heading text for the card
- **Rich Text** (optional) - Formatted content displayed under the title
- **CTA** (optional) - Call-to-action button with internal/external link support

### Smart Linking Behavior

The MediaCard implements intelligent linking based on CTA configuration:

1. **Whole Card Clickable**: If CTA is enabled with a link but NO label, the entire card becomes clickable
2. **CTA Button Only**: If CTA has both a link AND label, only the CTA button is clickable
3. **No Linking**: If CTA is disabled or has no link, the card is not clickable

This allows you to create either clickable card areas (great for navigation) or cards with explicit CTA buttons (better for conversions).

## Usage in Admin

### Adding to a Collection

The MediaCard block is already configured in:

- Pages collection
- Categories collection

### Configuring a MediaCard

1. Add a new "Media Card" block to your layout
2. Select a **Display Type** (image position)
3. If using left/right layout, choose an **Image Ratio**
4. Upload or select **Media**
5. Optionally add a **Title**
6. Optionally add **Rich Text** content
7. To add a CTA:
   - Check "Enable Call to Action"
   - Configure the **CTA Link**:
     - Add a **Label** (button text) - optional
     - Choose "Internal" for pages/projects
     - Choose "Custom" for external URLs
     - Select link **Appearance** (default/outline)

## Implementation Details

### Component Structure

```
src/blocks/MediaCard/
├── config.ts        # Payload block configuration
├── Component.tsx    # React component
└── index.ts         # Exports
```

### Field Configuration

```typescript
{
  displayType: 'imageTop' | 'imageBottom' | 'imageLeft' | 'imageRight',
  imageRatio: 'quarter' | 'third' | 'half' | 'twoThirds' | 'threeQuarters', // only for horizontal
  media: Media,                     // required
  title: string,                    // optional
  richText: RichText,              // optional
  enableCTA: boolean,
  ctaLink: {                       // optional, includes label, url/reference, appearance
    label: string,
    type: 'reference' | 'custom',
    reference: Page | Project,
    url: string,
    newTab: boolean,
    appearance: 'default' | 'outline'
  }
}
```

### Responsive Behavior

- On mobile (< lg breakpoint): All layouts stack vertically with image on top
- On desktop (>= lg breakpoint): Layouts respect the selected display type and ratio

### Styling

The component uses:

- Tailwind CSS for grid layouts and responsive design
- CSS variables for theming (border, background, text colors)
- 12-column grid system for precise ratio control

## Examples

### HEnable CTA, link to homepage, no label

Display type: Image on Top
Media: Hero image
Title: "Welcome to Our Platform"
Rich Text: Introduction paragraph
CTA: No label, link to homepage (whole card clickable)

### Feature Highlight
: Enable CTA, label
Display type: Image on Left
Ratio: 33% Image / 66% Content
Media: Feature screenshot
Title: "Advanced Analytics"
Rich Text: Feature description
CTA Label: "Learn More", link to feature page

### Call-to-Action Card

Display type: Image on Right
Ratio: 50% Image / 50% Content
Media: Promotional image
Title: "Get Started Today"
Rich Text: Benefits list
CTA: Enable CTA, label "Sign Up", link to registration

## Best Practices

1. **Image Aspect Ratio**: Use consistent aspect ratios for images when using multiple cards together
2. **Content Length**: Keep title and rich text concise for better readability
3. **CTA Clarity**: Use clear, action-oriented labels in the CTA link
4. **Whole Card Links**: Only use whole-card linking (CTA enabled without label) for simple navigation
5. **Accessibility**: Ensure images have proper alt text in the media library
