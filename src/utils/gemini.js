//AIzaSyDKjTI4xe_SA3OFLurQH20e1bmQ-lS7_ps

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");
  
const MODEL_NAME = "gemini-1.5-pro-latest";
const API_KEY = process.env.API_KEY;

function formatResponse(texto) {
    texto = texto.trim();
    
    var regex = /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/;
    var resultado = regex.exec(texto);
    
    if (resultado) {
        return resultado[0];
    } else {
        return false;
    }
}
  
module.exports = {
    async getReminderDate({label, currentDate}) {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });
      
        const generationConfig = {
          temperature: 1,
          topK: 64,
          topP: 0.95,
          maxOutputTokens: 8192,
        };
      
        const safetySettings = [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
        ];
      
        const parts = [
          {text: "input: {\n  label: 'Comprar leite e ovos para o café da manhã amanhã cedo',\n  currentDate: '2024-05-23T16:30:00'\n}"},
          {text: "output: '2024-05-24T07:00:00'"},
          {text: "input: {\n  label: 'Enviar relatório de vendas até sexta-feira às 18h',\n  currentDate: '2024-05-23T10:15:00'\n}"},
          {text: "output: '2024-05-24T18:00:00'"},
          {text: "input: {\n  label: 'Marcar consulta médica para o próximo mês',\n  currentDate: '2024-05-23T09:00:00'\n}"},
          {text: "output: '2024-06-10T08:30:00'"},
          {text: "input: {\n  label: 'Estudar para o exame de matemática na terça-feira à noite',\n  currentDate: '2024-05-22T21:00:00'\n}"},
          {text: "output: '2024-05-28T20:00:00'"},
          {text: "input: {\n  label: 'Fazer compras para o jantar de aniversário na sexta-feira',\n  currentDate: '2024-05-23T11:45:00'\n}"},
          {text: "output: '2024-05-24T16:00:00'"},
          {text: "input: {\n  label: 'Resolver problemas de TI no servidor até amanhã à tarde',\n  currentDate: '2024-05-22T14:20:00'\n}"},
          {text: "output: '2024-05-23T16:00:00'"},
          {text: "input: {\n  label: 'Preparar apresentação para o seminário de quinta-feira à noite',\n  currentDate: '2024-05-23T13:00:00'\n}"},
          {text: "output: '2024-05-25T19:30:00'"},
          {text: "input: {\n  label: 'Comprar ingressos para o cinema no final de semana',\n  currentDate: '2024-05-23T17:30:00'\n}"},
          {text: "output: '2024-05-25T11:00:00'"},
          {text: "input: {\n  label: 'Pagar contas até o fim do mês',\n  currentDate: '2024-05-22T10:00:00'\n}"},
          {text: "output: '2024-05-31T17:00:00'"},
          {text: "input: {\n  label: 'Treinar corrida todos os dias de manhã',\n  currentDate: '2024-05-23T07:00:00'\n}"},
          {text: "output: '2024-05-24T06:30:00'"},
          {text: `input: {\n  label: '${label}',\n  currentDate: '${currentDate}'\n}`},
          {text: "output: "},
        ];
      
        const result = await model.generateContent({
          contents: [{ role: "user", parts }],
          generationConfig,
          safetySettings,
        });
      
        const response = result.response

        return formatResponse(response.text())
      }
}