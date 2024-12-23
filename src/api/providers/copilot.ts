import { ApiHandler } from "../index";
import { ApiStream } from "../transform/stream";
import { ModelInfo } from "../../shared/api";
import * as vscode from "vscode";

export class CopilotHandler implements ApiHandler {
  async *createMessage(systemPrompt: string, messages: any[]): ApiStream {
    const copilot = vscode.extensions.getExtension("GitHub.copilot");
    if (!copilot) {
      throw new Error("GitHub Copilot extension is not installed.");
    }

    const copilotApi = copilot.exports;
    const response = await copilotApi.sendPrompt(systemPrompt, messages);

    for (const chunk of response) {
      yield {
        type: "text",
        text: chunk,
      };
    }
  }

  getModel(): { id: string; info: ModelInfo } {
    return {
      id: "github-copilot",
      info: {
        maxTokens: 4096,
        contextWindow: 8192,
        supportsImages: false,
        supportsPromptCache: false,
      },
    };
  }
}
