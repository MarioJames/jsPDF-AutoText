import { A4_DEFAULT_CONFIG } from './config';
import {
  EveryTextConfigType,
  TextRenderAttributeType,
  IAutoTextProps,
} from './types';

export default class jsPDFAutoText {
  private readonly pdfFile;
  private TEXT_LINE_MAX_WIDTH: number;
  private INITIAL_POSITION_X: number;
  private INITIAL_POSITION_Y: number;
  private EVERY_PAGE_MAX_HEIGHT: number;
  private EVERY_INDENT_WIDTH: number;
  private EVERY_TEXT_LINE_HEIGHT: number;
  private NEXT_TEXT_VERTICAL_POSITION: number;

  constructor(props: IAutoTextProps) {
    if (!props) {
      throw new Error('Please Set Autotext Config');
    }

    if (!props.pdfFile) {
      throw new Error('Please Transfer Your PDF File');
    }

    // set the pdf instance
    this.pdfFile = props.pdfFile;

    this.TEXT_LINE_MAX_WIDTH =
      props.TEXT_LINE_MAX_WIDTH || A4_DEFAULT_CONFIG.TEXT_LINE_MAX_WIDTH;

    this.INITIAL_POSITION_X =
      props.INITIAL_POSITION_X || A4_DEFAULT_CONFIG.INITIAL_POSITION_X;

    this.INITIAL_POSITION_Y =
      props.INITIAL_POSITION_Y || A4_DEFAULT_CONFIG.INITIAL_POSITION_Y;

    this.NEXT_TEXT_VERTICAL_POSITION = this.INITIAL_POSITION_Y;

    this.EVERY_PAGE_MAX_HEIGHT =
      props.EVERY_PAGE_MAX_HEIGHT || A4_DEFAULT_CONFIG.EVERY_PAGE_MAX_HEIGHT;

    this.EVERY_INDENT_WIDTH =
      props.EVERY_INDENT_WIDTH || A4_DEFAULT_CONFIG.EVERY_INDENT_WIDTH;

    this.EVERY_TEXT_LINE_HEIGHT =
      props.EVERY_TEXT_LINE_HEIGHT || A4_DEFAULT_CONFIG.EVERY_TEXT_LINE_HEIGHT;
  }

  public updateConfig = (AutoTextConfig: Omit<IAutoTextProps, 'pdfFile'>) => {
    // set every line max width config
    if (AutoTextConfig?.TEXT_LINE_MAX_WIDTH) {
      this.TEXT_LINE_MAX_WIDTH = AutoTextConfig?.TEXT_LINE_MAX_WIDTH;
    }

    // set every text default position
    if (AutoTextConfig?.INITIAL_POSITION_X) {
      this.INITIAL_POSITION_X = AutoTextConfig?.INITIAL_POSITION_X;
    }

    // set every page content's origin
    if (AutoTextConfig?.INITIAL_POSITION_Y) {
      this.INITIAL_POSITION_Y = AutoTextConfig?.INITIAL_POSITION_Y;

      // use initial vertical position to init NEXT_POSITON
      this.NEXT_TEXT_VERTICAL_POSITION = AutoTextConfig.INITIAL_POSITION_Y;
    }

    // set every page content's max height
    if (AutoTextConfig?.EVERY_PAGE_MAX_HEIGHT) {
      this.EVERY_PAGE_MAX_HEIGHT = AutoTextConfig?.EVERY_PAGE_MAX_HEIGHT;
    }

    // set if text exist horizontal indent should shift how many
    if (AutoTextConfig?.EVERY_INDENT_WIDTH) {
      this.EVERY_INDENT_WIDTH = AutoTextConfig?.EVERY_INDENT_WIDTH;
    }

    // set every line text content's height
    if (AutoTextConfig?.EVERY_TEXT_LINE_HEIGHT) {
      this.EVERY_TEXT_LINE_HEIGHT = AutoTextConfig?.EVERY_TEXT_LINE_HEIGHT;
    }
  };

  public render = (
    contents: EveryTextConfigType | string | (string | EveryTextConfigType)[]
  ) => {
    // transfer string or Object to array
    const renderContents = Array.isArray(contents) ? contents : [contents];

    // render text and record every text rendered position
    const renderedTextPosion = renderContents.map(this.renderText);

    // return rendered information
    return renderedTextPosion;
  };

  public addPage = () => {
    this.pdfFile?.addPage();

    this.NEXT_TEXT_VERTICAL_POSITION = this.INITIAL_POSITION_Y;
  };

  public calcTextAttribute: (
    content: EveryTextConfigType | string
  ) => TextRenderAttributeType = (content) => {
    const {
      INITIAL_POSITION_X,
      TEXT_LINE_MAX_WIDTH,
      EVERY_INDENT_WIDTH,
      EVERY_TEXT_LINE_HEIGHT,
      NEXT_TEXT_VERTICAL_POSITION,
      EVERY_PAGE_MAX_HEIGHT,
      INITIAL_POSITION_Y,
      pdfFile,
    } = this;

    // current Text indent number
    const curIndentNumber: number =
      typeof content === 'string' ? 0 : content.indent || 0;

    const renderText: string =
      typeof content === 'string' ? content : content.text;

    // calculate current text's horizontal origin position
    const curTextPositionX: number =
      INITIAL_POSITION_X + curIndentNumber * EVERY_TEXT_LINE_HEIGHT;

    // calculate current line can render how long text
    const curLineMaxWidth: number =
      TEXT_LINE_MAX_WIDTH - curIndentNumber * EVERY_INDENT_WIDTH;

    // calculate current text need how many width
    const curTextWidth = pdfFile.getTextWidth(renderText);

    // calculate current text will place how many lines
    const curTextPlaceLineNumber: number =
      Math.ceil(curTextWidth / curLineMaxWidth) || 1;

    // calculate current text will place height
    const currentTextPlaceHeight =
      curTextPlaceLineNumber * EVERY_TEXT_LINE_HEIGHT;

    // calculate and set if current text rendered, the last text's vertical position
    let renderedPositionY =
      NEXT_TEXT_VERTICAL_POSITION + currentTextPlaceHeight;

    this.NEXT_TEXT_VERTICAL_POSITION = renderedPositionY;

    let BASIC_RENDER_TEXT_CONFIG = {
      text: renderText,
      positionX: curTextPositionX,
      positionY: NEXT_TEXT_VERTICAL_POSITION,
      maxWidth: curLineMaxWidth,
    };

    if (typeof content === 'object') {
      BASIC_RENDER_TEXT_CONFIG = {
        ...content,
        ...BASIC_RENDER_TEXT_CONFIG,
        maxWidth: content?.maxWidth || BASIC_RENDER_TEXT_CONFIG.maxWidth,
      };
    }

    // if the last line text overview max height of current page
    if (renderedPositionY > EVERY_PAGE_MAX_HEIGHT) {
      // generate a new page
      pdfFile.addPage();

      renderedPositionY = INITIAL_POSITION_Y + currentTextPlaceHeight;

      this.NEXT_TEXT_VERTICAL_POSITION = renderedPositionY;

      // reset the vertical position
      BASIC_RENDER_TEXT_CONFIG.positionY = INITIAL_POSITION_Y;
    }

    return BASIC_RENDER_TEXT_CONFIG;
  };

  private renderText = (content: EveryTextConfigType | string) => {
    const RENDER_OPTIONS = this.calcTextAttribute(content);

    const { text, positionX, positionY, ...restOptions } = RENDER_OPTIONS;

    this.pdfFile.text(text, positionX, positionY, restOptions);

    return { text, starPositionX: positionX, startPositionY: positionY };
  };
}
