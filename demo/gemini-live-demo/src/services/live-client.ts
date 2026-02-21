export interface ToolDeclaration {
  name: string;
  description: string;
  parameters?: {
    type: string;
    properties?: Record<string, { type: string; description?: string; enum?: string[] }>;
    required?: string[];
  };
}

export interface ToolCall {
  id: string;
  name: string;
  args: Record<string, any>;
}

export interface LiveClientConfig {
  url: string;
  apiKey: string;
  model: string;
  systemInstruction: string;
  tools?: ToolDeclaration[];
}

export class LiveClient {
  private ws: WebSocket | null = null;
  private config: LiveClientConfig;

  constructor(config: LiveClientConfig) {
    this.config = config;
  }

  async connect() {
    return new Promise((resolve, reject) => {
      const url = `${this.config.url}?key=${this.config.apiKey}`;
      this.onLog(`Socket: Connecting to ${url.substring(0, 40)}...`);
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        this.onLog("Socket: Open! Sending setup...");
        this.sendSetup();
        resolve(true);
      };

      this.ws.onerror = (e) => {
        this.onLog(`Socket: ERROR encountered.`);
        reject(new Error("WebSocket encountered an error. This is usually due to an invalid key or restricted region."));
      };

      this.ws.onclose = (e) => {
        this.onLog(`Socket: CLOSED. Code: ${e.code}, Reason: ${e.reason || 'None'}`);
        if (e.code !== 1000) {
          reject(new Error(`WebSocket closed with code ${e.code}: ${e.reason || 'No reason provided'}`));
        }
      };

      this.ws.onmessage = async (event) => {
        try {
          let text: string;
          if (event.data instanceof Blob) {
            text = await event.data.text();
          } else {
            text = event.data;
          }
          const data = JSON.parse(text);
          this.handleMessage(data);
        } catch (e) {
          this.onLog(`Error parsing message: ${e}`);
        }
      };
    });
  }

  onLog: (msg: string) => void = () => {};

  private sendSetup() {
    if (!this.ws) return;
    this.onLog("Sending setup message...");
    const setup = {
      setup: {
        model: `models/${this.config.model}`,
        generation_config: {
          response_modalities: ["AUDIO"],
          speech_config: {
            voice_config: {
              prebuilt_voice_config: {
                voice_name: "Aoede",
              },
            },
          },
        },
        system_instruction: {
          parts: [{ text: this.config.systemInstruction }],
        },
        ...(this.config.tools && this.config.tools.length > 0 ? {
          tools: [{
            function_declarations: this.config.tools,
          }],
        } : {}),
        realtimeInputConfig: {
          automaticActivityDetection: {
            disabled: false,
            startOfSpeechSensitivity: "START_SENSITIVITY_HIGH",
            endOfSpeechSensitivity: "END_SENSITIVITY_LOW",
            prefixPaddingMs: 20,
            silenceDurationMs: 100,
          },
          activityHandling: "START_OF_ACTIVITY_INTERRUPTS",
        },
      },
    };
    this.ws.send(JSON.stringify(setup));
  }

  isReady(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  sendAudio(base64Audio: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    const msg = {
      realtime_input: {
        audio: {
          data: base64Audio,
          mime_type: "audio/pcm;rate=16000",
        },
      },
    };
    this.ws.send(JSON.stringify(msg));
  }

  sendToolResponse(callId: string, result: any) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    const msg = {
      tool_response: {
        function_responses: [{
          id: callId,
          name: callId,
          response: result,
        }],
      },
    };
    this.ws.send(JSON.stringify(msg));
  }

  private handleMessage(data: any) {
    // Check for tool calls at the top level
    const toolCall = data.toolCall || data.tool_call;
    if (toolCall) {
      const functionCalls = toolCall.functionCalls || toolCall.function_calls || [];
      for (const fc of functionCalls) {
        this.onLog(`TOOL CALL: ${fc.name}(${JSON.stringify(fc.args || {})})`);
        this.onToolCall({
          id: fc.id || fc.name,
          name: fc.name,
          args: fc.args || {},
        });
      }
    }

    const serverContent = data.serverContent || data.server_content;
    if (serverContent) {
      // Check for interruption FIRST - stop playback before processing anything else
      if (serverContent.interrupted) {
        this.onLog("INTERRUPTED: User barged in, clearing playback.");
        this.onInterrupted();
        return;
      }

      const modelTurn = serverContent.modelTurn || serverContent.model_turn;
      if (modelTurn && modelTurn.parts) {
        for (const part of modelTurn.parts) {
          if (part.inlineData || part.inline_data) {
            const inlineData = part.inlineData || part.inline_data;
            this.onAudioData(inlineData.data);
          }
          if (part.text) {
            this.onLog(`AGENT TEXT: ${part.text}`);
          }
          if (part.functionCall || part.function_call) {
            const fc = part.functionCall || part.function_call;
            this.onLog(`TOOL CALL (inline): ${fc.name}(${JSON.stringify(fc.args || {})})`);
            this.onToolCall({
              id: fc.id || fc.name,
              name: fc.name,
              args: fc.args || {},
            });
          }
        }
      }

      if (serverContent.turnComplete || serverContent.turn_complete) {
        this.onLog("Turn complete.");
      }
    }
    if (data.setupComplete || data.setup_complete) {
      this.onLog("HANDSHAKE SUCCESS: Setup is complete.");
      this.onSetupComplete();
    }
    if (data.error) {
      this.onLog(`SERVER ERROR: ${JSON.stringify(data.error)}`);
    }
  }

  onAudioData: (base64Audio: string) => void = () => {};
  onSetupComplete: () => void = () => {};
  onInterrupted: () => void = () => {};
  onToolCall: (toolCall: ToolCall) => void = () => {};

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
