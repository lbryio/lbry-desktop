// flow-typed signature: 405ae1983603e8018c018978697f94de
// flow-typed version: 578dff53f6/mime_v2.x.x/flow_>=v0.25.x

declare type $npm$mime$TypeMap = {[mime: string]: Array<string>};

declare class $npm$mime$Mime {
  constructor(...typeMap: Array<$npm$mime$TypeMap>): void;

  define(typeMap: $npm$mime$TypeMap, force?: boolean): void;
  getExtension(mime: string): ?string;
  getType(path: string): ?string;
}

declare module 'mime' {
  declare type TypeMap = $npm$mime$TypeMap;
  declare module.exports: $npm$mime$Mime;
}

declare module 'mime/lite' {
  declare type TypeMap = $npm$mime$TypeMap;
  declare module.exports: $npm$mime$Mime;
}

declare module 'mime/Mime' {
  declare type TypeMap = $npm$mime$TypeMap;
  declare module.exports: typeof $npm$mime$Mime;
}
