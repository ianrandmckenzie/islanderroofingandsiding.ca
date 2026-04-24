# Reference Labels

## Purpose

Reference labels are lightweight identifiers used for notes, project snapshots, and reusable content items. They are purely presentational and help keep the site organized without adding unnecessary clutter.

## Format

```
REF: [SECTION]-[SEQ]-[SLUG]
```

| Segment | Rules |
|---|---|
| `SECTION` | A short uppercase label for the page group, such as `HOME`, `EXAMPLES`, `SERVICES`, `EXPERIMENTS`, or `NOTES`. |
| `SEQ` | 3-digit zero-padded integer, unique within the section. |
| `SLUG` | Short uppercase keyword that describes the item in a human-friendly way. |

## Usage

- Keep labels consistent across the site.
- Use monospace styling for the rendered identifier.
- Avoid creating multiple identifier styles for the same kind of content.
- Keep the label specific when the surrounding page is specific.

## Examples

```text
REF: HOME-001-INTRO
REF: SERVICES-002-ROOFING
REF: NOTES-003-DRAFT
```
