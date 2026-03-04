'use client';

import { BasicNodesKit } from './basic-nodes-kit';
import { MathKit } from './math-kit';
import { MediaKit } from './media-kit';
import { TableKit } from './table-kit';

export const TaskEditorKit = [
  ...BasicNodesKit,
  ...MathKit,
  ...TableKit,
  ...MediaKit,
];
