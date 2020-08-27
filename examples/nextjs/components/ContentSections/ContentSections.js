import React from 'react';
import dynamic from 'next/dynamic';

import HeroBanner from 'components/HeroBanner';

// Avoid SSR for the Side By Side component since it relies on the size
// of the device and client-side data to choose the proper layout
const DynamicSideBySide = dynamic(() => import('../SideBySide'), {
  ssr: false
});

const ContentSections = ({ sections }) => {
  if (!Array.isArray(sections)) {
    return null;
  }

  return sections.map((section) => {
    const type = section?.sys?.contentType?.sys?.id;

    switch (type) {
      case 'heroBanner':
        return <HeroBanner fields={section.fields} key={section.sys.id} />;
      case 'sideBySide':
        return (
          <DynamicSideBySide fields={section.fields} key={section.sys.id} />
        );
      // ...add additional cases for whichever content types are needed
      default:
        return null;
    }
  });
};

export default ContentSections;