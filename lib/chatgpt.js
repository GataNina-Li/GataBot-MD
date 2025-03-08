import axios from 'axios';

const perplexity = {
  api: {
    base: 'https://api.perplexity.ai/chat/completions',
    
    models: {
      'sonar-medium-online': {
        description: 'Online-enabled medium model',
        context: 12000
      },
      'sonar-small-online': {
        description: 'Online-enabled small model',
        context: 12000
      },
      'sonar-medium-chat': {
        description: 'Optimized medium chat model',
        context: 12000
      },
      'sonar-small-chat': {
        description: 'Optimized small chat model', 
        context: 12000
      },
      'sonar-reasoning-pro': {
        description: 'Advanced reasoning model with enhanced capabilities',
        context: 16384
      },
      'sonar-reasoning': {
        description: 'Balanced reasoning model',
        context: 8192
      },
      'sonar-pro': {
        description: 'Enhanced general purpose model',
        context: 8192
      },
      'sonar': {
        description: 'Fast and efficient model',
        context: 4096
      },
      'mixtral-8x7b-instruct': {
        description: 'Mixtral instruction model',
        context: 8192
      },
      'codellama-70b-instruct': {
        description: 'Code specialized model',
        context: 8192
      },
      'llama-2-70b-chat': {
        description: 'LLaMA 2 chat model',
        context: 4096
      }
    },

    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'Postify/1.0.0'
    },

    keys: [
      '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',
      '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',
      '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',
      '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'
    ],

    retry: {
      maxAttempts: 3,
      delayMs: 2000,
      timeoutMs: 60000
    }
  },

  isParams: (messages, model, temperature) => {
    const errors = [];

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      errors.push({
        param: 'messages',
        error: 'Udah capek yak gua ngasih tau lu, input tuh minimal diisi napa 🗿',
        example: [{
          role: 'user',
          content: 'inputnya disini yakk'
        }]
      });
    } else {
      messages.forEach((msg, index) => {
        if (!msg.role || !msg.content) {
          errors.push({
            param: `messages[${index}]`,
            error: 'Format message lu ngaco anjirr 🗿',
            example: {
              role: 'user/assistant',
              content: 'inputnya disini yakk'
            }
          });
        }
      });
    }

    if (!model) {
      errors.push({
        param: 'model',
        error: 'Literally modelnya kagak diisi bree?? Minimal input lah 1 mah 🗿',
        available: Object.keys(perplexity.api.models)
      });
    } else if (!perplexity.api.models[model]) {
      errors.push({
        param: 'model',
        error: 'Model yang lu pilih kagak ada bree! Pilih aja salah satu dari list ini yak ..',
        available: Object.keys(perplexity.api.models)
      });
    }

    if (temperature === undefined || temperature === null) {
      errors.push({
        param: 'temperature',
        error: 'Temperaturenya mana bree?! Kagak kosong begini dong 🗿',
        range: '0.0 - 1.0',
        recommended: 0.7
      });
    } else if (temperature < 0 || temperature > 1) {
      errors.push({
        param: 'temperature',
        error: 'Temperaturenya kebanyakan atau kurang ngab! Rangenya 0-1 doang yak 🙃',
        range: '0.0 - 1.0',
        recommended: 0.7
      });
    }

    return errors;
  },

  key: () => perplexity.api.keys[Math.floor(Math.random() * perplexity.api.keys.length)],

  delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

  retry: async (operation, attempt = 1) => {
    try {
      return await operation();
    } catch (error) {
      if (attempt >= perplexity.api.retry.maxAttempts) {
        throw error;
      }

      console.log(`🔄 Ngetry attempt yang ke-${attempt}, nunggu ${perplexity.api.retry.delayMs}ms yak bree 😂...`);
      console.error(error.message);

      await perplexity.delay(perplexity.api.retry.delayMs * attempt);
      return await perplexity.retry(operation, attempt + 1);
    }
  },

  createAxiosInstance: () => axios.create({
    baseURL: perplexity.api.base,
    timeout: perplexity.api.retry.timeoutMs,
    maxContentLength: Infinity,
    maxBodyLength: Infinity
  }),

  getHeaders: (apiKey) => {
    return {
      'Authorization': `Bearer ${apiKey}`,
      ...perplexity.api.headers
    };
  },

  chat: async (messages, model = 'sonar', temperature = 0.7) => {
    const ve = perplexity.isParams(messages, model, temperature);
    if (ve.length > 0) {
      return {
        status: false,
        code: 400,
        result: {
          error: 'Parameter lu pada ngaco semua anjiir 🌝',
          details: ve
        }
      };
    }

    return await perplexity.retry(async () => {
      const axiosInstance = perplexity.createAxiosInstance();
      const perplexityKey = perplexity.key();

      try {
        const response = await axiosInstance.post('', {
          model: model,
          messages: messages,
          temperature: temperature,
          max_tokens: 4096,
          stream: false
        }, {
          headers: perplexity.getHeaders(perplexityKey)
        });

        return {
          status: true,
          code: 200,
          result: {
            response: response.data.choices[0].message.content,
            model: {
              name: model,
              ...perplexity.api.models[model]
            }
          }
        };

      } catch (error) {
        const e = {
          status: false,
          code: error.response?.status || 500,
          result: {
            error: 'Error bree 🗿',
            details: `${error.message}`,
            solution: 'Coba lagi nanti aja bree, sapa tau berhasil nanti 😂'
          }
        };
        throw e;
      }
    });
  },

  stream: async (messages, model = 'sonar', temperature = 0.7, onChunk) => {
    const ve = perplexity.isParams(messages, model, temperature);
    if (ve.length > 0) {
      return {
        status: false,
        code: 400,
        result: {
          error: 'Parameter lu pada ngaco semua bree 😫',
          details: ve
        }
      };
    }

    if (typeof onChunk !== 'function') {
      return {
        status: false,
        code: 400,
        result: {
          error: 'Function callbacknya mana bree?! 😤',
          details: [{
            param: 'onChunk',
            error: 'Kudu pake callback function buat streaminnya bree!',
            example: '(chunk) => console.log(chunk)'
          }]
        }
      };
    }

    return await perplexity.retry(async () => {
      const axiosInstance = perplexity.createAxiosInstance();
      const perplexityKey = perplexity.key();

      try {
        const response = await axiosInstance.post('', {
          model: model,
          messages: messages,
          temperature: temperature,
          max_tokens: 4096,
          stream: true
        }, {
          headers: perplexity.getHeaders(perplexityKey),
          responseType: 'stream'
        });

        let pull = '';
        
        for await (const chunk of response.data) {
          const lines = chunk.toString().split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const result = JSON.parse(line.slice(5));
                if (result.choices?.[0]?.delta?.content) {
                  const content = result.choices[0].delta.content;
                  pull += content;
                  onChunk(content);
                }
              } catch (e) {
                if (!line.includes('[DONE]')) {
                  console.warn('❌ Gagal parse chunknya bree: ', e);
                }
              }
            }
          }
        }

        return {
          status: true,
          code: 200,
          result: {
            response: pull,
            model: {
              name: model,
              ...perplexity.api.models[model]
            }
          }
        };

      } catch (error) {
        const e = {
          status: false,
          code: error.response?.status || 500,
          result: {
            error: 'Streamingnya error bree 😑',
            details: error.message,
            solution: 'Reset ulang aja dah streamingnya bree 🔄'
          }
        };
        throw e;
      }
    });
  }
};

export { perplexity };