import React from 'react';
import { Typography } from '@/components/ui/Typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';

const TypographyShowcase = () => {
  return (
    <div className="container mx-auto space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Typography Variants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Heading Variants */}
          <section className="flex flex-col">
            <Typography variant="h1" className="mb-4">
              H1 - Main Heading
            </Typography>
            <Typography variant="h2" className="mb-4">
              H2 - Section Heading
            </Typography>
            <Typography variant="h3">H3 - Subsection Heading</Typography>
          </section>

          {/* Paragraph Variants */}
          <section className="mt-6 flex flex-col">
            <Typography variant="lead" className="mb-4">
              Lead Paragraph: A prominent introductory text that draws readers in with its larger
              size and slightly muted color.
            </Typography>

            <Typography variant="p" className="mb-4">
              Standard Paragraph: This is a standard paragraph that provides the main body of text.
              It uses a comfortable leading (line height) for readability.
            </Typography>
          </section>

          {/* Additional Text Variants */}
          <section className="mt-6 flex flex-col space-y-4">
            <Typography variant="large">Large Text: Used for slightly emphasized text</Typography>

            <Typography variant="small">
              Small Text: Secondary or supplementary information
            </Typography>

            <Typography variant="muted">
              Muted Text: Subtle, less prominent text for additional context
            </Typography>
          </section>

          {/* Mixing Variants and Custom Styling */}
          <section className="mt-6 flex flex-col">
            <Typography variant="h3" className="mb-4 text-primary">
              Custom Styled Heading
            </Typography>

            <Typography variant="p" className="text-destructive italic">
              Customized Paragraph with Destructive Color and Italic Style
            </Typography>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default TypographyShowcase;
