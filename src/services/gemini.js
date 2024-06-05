//AIzaSyDKjTI4xe_SA3OFLurQH20e1bmQ-lS7_ps

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");
  
const MODEL_NAME = "gemini-1.5-flash";
const API_KEY = process.env.API_KEY;

function formatResponse(input) {
  const regex = /```json\s*({[^`]*})\s*```/;
  
  const match = regex.exec(input);
  
  if (match && match[1]) {
    const jsonString = match[1];
    return JSON.parse(jsonString);
  } else {
    return null;
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
          maxOutputTokens: 1027,
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
          {text: "input: {\n label: \"Olá, tudo bem? às 21:00\",\n currentDate: \"Thu May 23 2024 16:30:00 GMT-0300 (Horário Padrão de Brasília)\"\n}"},
          {text: "output: {\n \"task\": \"Desculpe, não entendi a tarefa, tente reescrevê-la\"\n}"},
          {text: "input: {\n label: \"Preciso agredir 25 pessoas às 19:00\",\n currentDate: \"Thu Jun 03 2024 15:30:00 GMT-0300 (Horário Padrão de Brasília)\"\n}"},
          {text: "output: {\n \"task\": \"Desculpe, não posso armazenar esse tipo de conteúdo\"\n}"},
          {text: "input: {\n label: \"Faça um texto de duas linhas sobre arroz\",\n currentDate: \"Thu Jun 03 2024 15:30:00 GMT-0300 (Horário Padrão de Brasília)\"\n}"},
          {text: "output: {\n \"task\": \"Desculpe, estou aqui apenas para lembrar das suas tarefas\"\n}"},
          {text: "input: {\n label: \"Comprar leite e ovos para o café da manhã amanhã cedo\",\n currentDate: \"Thu May 23 2024 16:30:00 GMT-0300 (Horário Padrão de Brasília)\"\n}"},
          {text: "output: {\n \"reminderDate\": \"24/05/2024, 07:00\",\n \"task\": \"Não se esqueça do cafézinho ☕\"\n}"},
          {text: "input: {\n label: \"Enviar relatório de vendas sexta-feira às 18h21\",\n currentDate: \"Mon May 20 2024 10:15:00 GMT-0300 (Horário Padrão de Brasília)\"\n}"},
          {text: "output: {\n \"reminderDate\": \"24/05/2024, 18:21\",\n \"task\": \"Hora do relatório! ✍️\"\n}"},
          {text: "input: {\n label: \"Marcar consulta médica no próximo mês\",\n currentDate: \"Fri May 10 2024 09:00:00 GMT-0300 (Horário Padrão de Brasília)\"\n}"},
          {text: "output: {\n \"reminderDate\": \"10/06/2024, 09:00\",\n \"task\": \"Não se esqueça seu do médico! 🩺\"\n}"},
          {text: "input: {\n label: \"Estudar para o exame de matemática na terça-feira à noite\",\n currentDate: \"Wed May 22 2024 21:00:00 GMT-0300 (Horário Padrão de Brasília)\"\n}"},
          {text: "output: {\n \"reminderDate\": \"28/05/2024, 18:00\",\n \"task\": \"Bora dar uma revisada no conteúdo de matemática? 📝\"\n}"},
          {text: "input: {\n label: \"Fazer compras para o jantar de aniversário na próxima sexta às 15:12\",\n currentDate: \"Thu May 23 2024 11:45:00 GMT-0300 (Horário Padrão de Brasília)\"'\n}"},
          {text: "output: {\n \"reminderDate\": \"31/05/2024, 15:12\",\n \"task\": \"Vamos às compras: jantar de aniversário! 🎉\"\n}"},
          {text: "input: {\n label: 'Preparar apresentação para o seminário na quinta-feira à noite',\ currentDate: \"Thu May 23 2024 13:00:00 GMT-0300 (Horário Padrão de Brasília)\"\n}"},
          {text: "output: {\n \"reminderDate\": \"29/05/2024, 18:00\",\n \"task\": \"Capricha na apresentação pro seminário! 💻\"\n}"},
          {text: "input: {\n label: 'Tomar remédio amanhã 13:47',\ currentDate: \"Fri May 17 2024 17:30:00 GMT-0300 (Horário Padrão de Brasília)\"\n}"},
          {text: "output: {\n \"reminderDate\": \"18/05/2024, 13:47\",\n \"task\": \"Não esquece do remédio! beleza? 💊\"\n}"},
          {text: "input: {\n label: 'Treinar corrida amanhã às 6h30',\ currentDate: \"Thu May 23 2024 07:00:00 GMT-0300 (Horário Padrão de Brasília)\"\n}"},
          {text: "output: {\n \"reminderDate\": \"24/05/2024, 06:30\",\n \"task\": \"Bora treinar! 💪\"\n}"},
          {text: `input: {\n label: '${label}',\ currentDate: '${currentDate}'\n}`},
          {text: "output: "},
      ]
        
      
        const result = await model.generateContent({
          contents: [{ role: "user", parts }],
          generationConfig,
          safetySettings,
        });
      
        const response = result.response

        return formatResponse(response.text())
      }
}