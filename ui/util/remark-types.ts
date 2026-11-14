// The few fields of a markdown (mdast) node that the remark plugins in this folder read or write,
// and the "eat" function remark passes to inline tokenizers.
export type MdNode = {
  type: string;
  value?: string;
  url?: string;
  title?: string;
  children?: MdNode[];
  data?: { hProperties?: Record<string, unknown> };
};

export type Eat = (text: string) => (node: MdNode) => unknown;
