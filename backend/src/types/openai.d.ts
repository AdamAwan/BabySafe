declare module 'openai' {
  class OpenAI {
    constructor(options: any);
    chat: {
      completions: {
        create: (options: any) => Promise<any>;
      };
    };
  }
  export default OpenAI;
} 