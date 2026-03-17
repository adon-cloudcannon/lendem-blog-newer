---
_schema: default
title: Astro Component Starter
description: >-
  Build fast, customizable Astro sites with a modern component starter that is
  easy to edit and maintain.
pageSections:
  - _component: page-sections/blog/featured-blog
    id:
    heading: Insights
    subtext: >-
      Practical insights to help you understand money and make informed
      decisions
    featuredArticles:
      - /src/content/blog/2025-10-22-keeping-performance-simple.mdx
      - /src/content/blog/2025-10-29-why-our-components-stay-small.mdx
      - /src/content/blog/2025-11-12-our-approach-to-css-just-enough.mdx
      - /src/content/blog/2025-11-19-how-we-think-about-js-in-this-starter.mdx
      - /src/content/blog/2025-11-26-launching-projects-faster-with-presets.mdx
    colorScheme: inherit
    backgroundColor: base
  - _component: page-sections/ctas/cta-center
    heading: Need extra cash?
    subtext: A simple, secure way to cover urgent expenses.
    buttonSections:
      - _component: building-blocks/core-elements/button
        text: Apply Now
        hideText: false
        link: ''
        iconName: ''
        iconPosition: before
        variant: primary
        size: md
    colorScheme: inherit
    backgroundColor: base
    rounded: false
---
