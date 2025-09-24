
export enum EditorJSDataBlockTypesEnum {
	PARAGRAPH = "paragraph",
	HEADER = "header",
	LIST = "list",
	IMAGE = "image",
	COLUMNS = "columns",
}

interface EditorJSDataBlockParagraph {
	type: EditorJSDataBlockTypesEnum.PARAGRAPH;
	data: {
		text: string;
	};
}

interface EditorJSDataBlockHeader {
	type: EditorJSDataBlockTypesEnum.HEADER;
	data: {
		text: string;
		level: number;
	};
}

interface EditorJSDataBlockList {
	type: EditorJSDataBlockTypesEnum.LIST;
	data: {
		style: "ordered" | "unordered";
		items: {
			content: string;
			items: []
		}[]
	};
}

interface EditorJSDataBlockImage {
	type: EditorJSDataBlockTypesEnum.IMAGE;
	data: {
		caption: string;
		file: {
			url: string;
		};
	};
}

interface EditorJSDataBlockColumns {
	type: EditorJSDataBlockTypesEnum.COLUMNS;
	data: {
		cols: {
			blocks: EditorJSDataBlock[];
		}[];
	};
}


export type EditorJSDataBlock = { id?: string } & (EditorJSDataBlockParagraph | EditorJSDataBlockHeader | EditorJSDataBlockList | EditorJSDataBlockImage | EditorJSDataBlockColumns);
