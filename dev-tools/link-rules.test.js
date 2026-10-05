import { describe, expect, it } from 'vitest';

import { isLandingAlias } from './link-rules.mjs';

describe('isLandingAlias', () => {
  it('a docs home that sends you to its own introduction is the owner picking a landing page', () => {
    expect(isLandingAlias('https://docs.pipecat.ai/', 'https://docs.pipecat.ai/overview/introduction')).toBe(true);
    expect(isLandingAlias('https://docs.browser-use.com', 'https://docs.browser-use.com/cloud/quickstart')).toBe(true);
    expect(isLandingAlias('https://gofastmcp.com/', 'https://gofastmcp.com/getting-started/welcome')).toBe(true);
  });

  it('a course page that sends you to its first lesson', () => {
    expect(
      isLandingAlias(
        'https://learn.deeplearning.ai/courses/mcp-build-rich-context-ai-apps-with-anthropic/',
        'https://learn.deeplearning.ai/courses/mcp-build-rich-context-ai-apps-with-anthropic/lesson/fkbhh/introduction'
      )
    ).toBe(true);
  });

  it('a trailing slash and a leading www. are not a move', () => {
    expect(isLandingAlias('https://www.deeplearning.ai/courses/agent-skills-with-anthropic/', 'https://www.deeplearning.ai/courses/agent-skills-with-anthropic')).toBe(true);
    expect(isLandingAlias('https://example.com/docs', 'https://www.example.com/docs/')).toBe(true);
  });

  it('a page that moved to a different path is a move', () => {
    expect(isLandingAlias('https://deepmind.google/models/imagen/', 'https://deepmind.google/models/gemini-image/')).toBe(false);
    expect(isLandingAlias('https://www.anthropic.com/research/building-effective-agents', 'https://www.anthropic.com/engineering/building-effective-agents')).toBe(false);
  });

  it('a different domain is a move', () => {
    expect(isLandingAlias('https://www.notion.so/', 'https://www.notion.com/')).toBe(false);
  });

  it('a sibling path that merely shares a prefix is not a deeper page', () => {
    expect(isLandingAlias('https://example.com/doc', 'https://example.com/docs/intro')).toBe(false);
  });

  it('a page that redirects up to the site root is a move', () => {
    expect(isLandingAlias('https://example.com/old/page', 'https://example.com/')).toBe(false);
  });
});
