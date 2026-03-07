import { BaseBasicBlocksKit } from './basic-blocks-base-kit';
import { BaseBasicMarksKit } from './basic-marks-base-kit';
import { BaseMathKit } from './math-base-kit';
import { BaseTableKit } from './table-base-kit';
import { BaseMediaKit } from './media-base-kit';

export const TaskEditorBaseKit = [
    ...BaseBasicBlocksKit,
    ...BaseBasicMarksKit,
    ...BaseMathKit,
    ...BaseTableKit,
    ...BaseMediaKit,
];
