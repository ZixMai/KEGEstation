'use client';

import {
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  StrikethroughIcon,
  SubscriptIcon,
  SuperscriptIcon,
  UnderlineIcon,
} from 'lucide-react';
import { KEYS } from 'platejs';

import { InlineEquationToolbarButton } from '@/components/ui/equation-toolbar-button';
import { FixedToolbar } from '@/components/ui/fixed-toolbar';
import { MarkToolbarButton } from '@/components/ui/mark-toolbar-button';
import { MediaToolbarButton } from '@/components/ui/media-toolbar-button';
import { TableToolbarButton } from '@/components/ui/table-toolbar-button';
import { ToolbarGroup, ToolbarSeparator } from '@/components/ui/toolbar';

export function TaskEditorToolbar() {
  return (
    <FixedToolbar className="overflow-x-auto">
      <ToolbarGroup>
        <MarkToolbarButton nodeType={KEYS.bold} tooltip="Bold (Ctrl+B)">
          <BoldIcon />
        </MarkToolbarButton>
        <MarkToolbarButton nodeType={KEYS.italic} tooltip="Italic (Ctrl+I)">
          <ItalicIcon />
        </MarkToolbarButton>
        <MarkToolbarButton nodeType={KEYS.underline} tooltip="Underline (Ctrl+U)">
          <UnderlineIcon />
        </MarkToolbarButton>
        <MarkToolbarButton
          nodeType={KEYS.strikethrough}
          tooltip="Strikethrough (Ctrl+Shift+X)"
        >
          <StrikethroughIcon />
        </MarkToolbarButton>
        <MarkToolbarButton nodeType={KEYS.code} tooltip="Code (Ctrl+E)">
          <CodeIcon />
        </MarkToolbarButton>
        <MarkToolbarButton nodeType={KEYS.sup} tooltip="Superscript">
          <SuperscriptIcon />
        </MarkToolbarButton>
        <MarkToolbarButton nodeType={KEYS.sub} tooltip="Subscript">
          <SubscriptIcon />
        </MarkToolbarButton>
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <InlineEquationToolbarButton tooltip="Equation" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TableToolbarButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MediaToolbarButton nodeType={KEYS.img} />
      </ToolbarGroup>
    </FixedToolbar>
  );
}
