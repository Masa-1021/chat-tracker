---
name: brainstorming
description: "You MUST use this before any creative work - creating features, building components, adding functionality, or modifying behavior. Explores user intent, requirements and design before implementation."
---

# Brainstorming Ideas Into Designs

## Overview

Help turn ideas into fully formed designs and specs through natural collaborative dialogue.

Start by understanding the current project context, then ask questions one at a time to refine the idea. Once you understand what you're building, present the design in small sections (200-300 words), checking after each section whether it looks right so far.

## The Process

**Understanding the idea:**
- Check out the current project state first (files, docs, recent commits)
- Ask questions one at a time to refine the idea
- Prefer multiple choice questions when possible, but open-ended is fine too
- Only one question per message - if a topic needs more exploration, break it into multiple questions
- Focus on understanding: purpose, constraints, success criteria

**Exploring approaches:**
- Propose 2-3 different approaches with trade-offs
- Present options conversationally with your recommendation and reasoning
- Lead with your recommended option and explain why

**Presenting the design:**
- Once you believe you understand what you're building, present the design
- Break it into sections of 200-300 words
- Ask after each section whether it looks right so far
- Cover: architecture, components, data flow, error handling, testing
- Be ready to go back and clarify if something doesn't make sense

## After the Design

**Documentation:**
- Write the validated design to `docs/plans/YYYY-MM-DD-<topic>-design.md`
- Use elements-of-style:writing-clearly-and-concisely skill if available
- Commit the design document to git

**Implementation (if continuing):**
- Ask: "Ready to set up for implementation?"
- Use superpowers:using-git-worktrees to create isolated workspace
- Use superpowers:writing-plans to create detailed implementation plan

## Key Principles

- **One question at a time** - Don't overwhelm with multiple questions
- **Multiple choice preferred** - Easier to answer than open-ended when possible
- **YAGNI ruthlessly** - Remove unnecessary features from all designs
- **Explore alternatives** - Always propose 2-3 approaches before settling
- **Incremental validation** - Present design in sections, validate each
- **Be flexible** - Go back and clarify when something doesn't make sense

## Question Templates by Phase

### Phase 1: Understanding the Problem

**Purpose & Goals:**
```
What problem are you trying to solve?
  A) [Specific pain point - e.g., "Users can't find items quickly"]
  B) [Feature request - e.g., "Add search functionality"]
  C) [Technical improvement - e.g., "Reduce page load time"]
  D) Other (please describe)
```

**Target Users:**
```
Who is the primary user of this feature?
  A) End users (customers)
  B) Internal team (admins, operators)
  C) Developers (API consumers)
  D) Multiple user types
```

**Success Criteria:**
```
How will we know this is successful?
  A) Quantitative metric (e.g., "50% faster load time")
  B) User feedback/satisfaction
  C) Feature completion (binary: works or doesn't)
  D) Let's define metrics together
```

### Phase 2: Constraints & Context

**Timeline:**
```
What's the timeline for this?
  A) Urgent (days)
  B) Near-term (1-2 weeks)
  C) Medium-term (1-2 months)
  D) No specific deadline
```

**Technical Constraints:**
```
Are there any technical constraints I should know about?
  A) Must use existing tech stack only
  B) Must integrate with [specific system]
  C) Performance requirements (e.g., < 100ms response)
  D) No specific constraints
```

**Scope:**
```
How comprehensive should the first version be?
  A) MVP - bare minimum to validate the idea
  B) Feature-complete but simple
  C) Production-ready with edge cases handled
  D) Let's discuss scope together
```

### Phase 3: Approach Selection

**Implementation Approach:**
```
I see a few ways to approach this:

Option A: [Simple approach]
- Pros: Fast to implement, easy to understand
- Cons: Limited flexibility, may need rework later
- Best for: Tight deadlines, simple requirements

Option B: [Balanced approach] (Recommended)
- Pros: Good balance of speed and flexibility
- Cons: Slightly more complex
- Best for: Most typical use cases

Option C: [Comprehensive approach]
- Pros: Handles all edge cases, very flexible
- Cons: Takes longer, more complex
- Best for: Critical features, long-term investment

Which approach fits your needs?
```

### Phase 4: Design Validation

**Architecture Check:**
```
For the [component name], I'm thinking:
- Data flow: [A] → [B] → [C]
- State management: [approach]
- Error handling: [strategy]

Does this align with your expectations?
  A) Yes, looks good
  B) I have concerns about [specific part]
  C) Can you explain [specific part] more?
```

**Trade-off Confirmation:**
```
This approach means:
- We gain: [benefit]
- We trade off: [limitation]

Is this trade-off acceptable?
  A) Yes, that's fine
  B) No, [limitation] is a problem
  C) Let's explore alternatives
```

## Example Brainstorming Sessions

### Example 1: Adding Search Feature

```
You: "I want to add search to our product catalog"

Claude: Let me understand the context first. I'll check the current
project structure...

[Reads files, understands context]

What type of search are you envisioning?
  A) Simple text matching (filter existing list)
  B) Full-text search (weighted, fuzzy matching)
  C) Advanced search (filters, facets, sorting)
  D) AI-powered search (semantic, recommendations)

You: "B - full-text search"

Claude: Good choice. For full-text search, what's the data scale?
  A) Small (< 1,000 items) - client-side search works
  B) Medium (1,000 - 100,000) - lightweight search library
  C) Large (100,000+) - dedicated search service needed
  D) Not sure, let me check

You: "B - around 10,000 products"

Claude: Perfect. For ~10K products, I recommend:

Option A: Fuse.js (client-side)
- Pros: No backend changes, instant results
- Cons: Initial load of all data, limited scalability

Option B: MiniSearch + API (Recommended)
- Pros: Good balance, server-side indexing
- Cons: Requires API endpoint

Option C: Algolia/Meilisearch
- Pros: Powerful, scalable, typo-tolerant
- Cons: External service, potential cost

Which fits best?
```

### Example 2: Refactoring Authentication

```
You: "Our auth code is a mess, I want to refactor it"

Claude: I'll look at the current auth implementation...

[Reads auth-related files]

I see the current auth has these issues:
- Auth logic spread across 5 files
- Mixed concerns (UI + logic + API)
- No clear error handling

What's your primary goal for this refactor?
  A) Clean up code structure (maintainability)
  B) Add new auth methods (SSO, OAuth)
  C) Fix security issues
  D) All of the above

You: "A - just clean it up for now"

Claude: Understood. For a maintainability refactor, here's my
recommendation:

**Architecture:**
```
src/
├── auth/
│   ├── AuthProvider.tsx      # Context provider
│   ├── useAuth.ts            # Hook for components
│   ├── authService.ts        # API calls
│   ├── authStorage.ts        # Token management
│   └── types.ts              # Auth types
```

**Key changes:**
1. Extract auth context from App.tsx
2. Move API calls to dedicated service
3. Centralize token storage

Does this structure make sense for your codebase?
  A) Yes, let's proceed
  B) I'd prefer [alternative]
  C) Can you explain [part] more?
```

## Design Document Template

After brainstorming, generate a design doc with this structure:

```markdown
# [Feature Name] Design

## Overview
One paragraph summary of what we're building and why.

## Goals
- Primary: [main objective]
- Secondary: [nice-to-have]
- Non-goals: [explicitly out of scope]

## User Stories
- As a [user type], I want to [action] so that [benefit]

## Technical Design

### Architecture
[Diagram or description of components]

### Data Model
[Key entities and their relationships]

### API Changes
[New endpoints or modifications]

### UI Changes
[New screens or component changes]

## Implementation Plan
1. [Step 1] - [estimated effort]
2. [Step 2] - [estimated effort]
...

## Open Questions
- [ ] [Question that needs resolution]

## Risks & Mitigations
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| [Risk] | Low/Med/High | Low/Med/High | [How to address] |
```

## Anti-Patterns to Avoid

**Don't:**
- Ask multiple questions at once
- Jump to implementation before understanding goals
- Present only one approach without alternatives
- Ignore constraints mentioned by the user
- Over-design for hypothetical future needs

**Do:**
- Pause and clarify before assuming
- Validate understanding frequently
- Keep designs minimal but complete
- Document decisions and rationale
- Be willing to backtrack when needed

## When to Stop Brainstorming

Brainstorming is complete when:

1. **Problem is clear** - You can articulate what you're solving
2. **Approach is chosen** - One option selected from alternatives
3. **Scope is defined** - What's in and out of scope is explicit
4. **Success criteria exist** - You know how to verify it works
5. **User agrees** - Explicit confirmation on the design

Then move to: Design documentation → Task breakdown → Implementation
