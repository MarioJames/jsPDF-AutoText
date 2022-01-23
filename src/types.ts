export interface IAutoTextProps {
  pdfFile: any;
  TEXT_LINE_MAX_WIDTH?: number; // every text line max width
  INITIAL_POSITION_X?: number; // every text content's horizontal position
  INITIAL_POSITION_Y?: number; // every page content's vertical position
  EVERY_PAGE_MAX_HEIGHT?: number; // every page content's max height
  EVERY_INDENT_WIDTH?: number;
  EVERY_TEXT_LINE_HEIGHT?: number;
}

export type jsPdfTextOptions = {
  align?: 'left' | 'center' | 'right' | 'jusify';
  baseline?:
    | 'alphabetic'
    | 'ideographic'
    | 'bottom'
    | 'top'
    | 'middle'
    | 'hanging';
  angle?: number;
  rotationDirection?: 0 | 1;
  charSpace?: number;
  horizontalScale?: number;
  lineHeightFactor?: number;
  flags?: {
    noBOM?: boolean;
    autoencode?: boolean;
  };
  maxWidth?: number;
  renderingMode?:
    | 'fill'
    | 'stroke'
    | 'fillThenStroke'
    | 'invisible'
    | 'fillAndAddForClipping'
    | 'strokeAndAddPathForClipping'
    | 'fillThenStrokeAndAddToPathForClipping'
    | 'addToPathForClipping';
  isInputVisual?: boolean;
  isOutputVisual?: boolean;
  isInputRtl?: boolean;
  isOutputRtl?: boolean;
  isSymmetricSwapping?: boolean;
};

export type EveryTextConfigType = jsPdfTextOptions & {
  text: string;
  indent?: number;
};

export type TextRenderAttributeType = {
  text: string;
  positionX: number;
  positionY: number;
  maxWidth: number;
};
